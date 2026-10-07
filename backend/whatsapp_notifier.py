import logging
import requests
from pathlib import Path
from datetime import datetime

LOG_FILE = Path(__file__).parent / "mock_whatsapp.log"

def _get_whatsapp_config():
    """Load WhatsApp Fonnte configuration from system_settings database."""
    from backend.database import get_setting
    return {
        "token": get_setting("whatsapp_api_token", ""),
        "sender": get_setting("whatsapp_sender", "Fonnte"),
    }

def _write_mock_log(to_number: str, message: str) -> bool:
    """Save WhatsApp message log locally when token is not configured."""
    try:
        with open(LOG_FILE, "a", encoding="utf-8") as f:
            f.write(f"{'='*52}\n")
            f.write(f"TIMESTAMP: {datetime.now().isoformat()}\n")
            f.write(f"TO WHATSAPP: {to_number}\n")
            f.write(f"MESSAGE:\n{message}\n")
            f.write(f"{'='*52}\n\n")
        logging.info(f"[MOCK WHATSAPP] Logged message to {LOG_FILE.name}")
        return True
    except Exception as e:
        logging.error(f"Failed to write mock WhatsApp log: {e}")
        return False

import time
import random

def validate_whatsapp_number(to_number: str) -> dict:
    """Validate if a target phone number is registered and active on WhatsApp using Fonnte API."""
    if not to_number:
        return {"registered": False, "message": "Nomor WhatsApp kosong"}
        
    config = _get_whatsapp_config()
    token = config["token"]
    clean_num = "".join(filter(str.isdigit, to_number))
    if clean_num.startswith("0"):
        clean_num = "62" + clean_num[1:]
        
    if not token:
        is_valid = len(clean_num) >= 10 and clean_num.startswith("62")
        return {"registered": is_valid, "message": "Fonnte token unconfigured (format validation)"}
        
    try:
        url = "https://api.fonnte.com/validate"
        headers = {"Authorization": token}
        data = {"target": clean_num, "countryCode": "62"}
        response = requests.post(url, headers=headers, data=data, timeout=10)
        if response.status_code == 200:
            res_json = response.json()
            if res_json.get("status"):
                registered_list = [str(x) for x in res_json.get("registered", [])]
                not_registered_list = [str(x) for x in res_json.get("not_registered", [])]
                if clean_num in registered_list:
                    return {"registered": True, "message": "Nomor terdaftar di WhatsApp"}
                elif clean_num in not_registered_list or len(registered_list) == 0:
                    return {"registered": False, "message": "Nomor tidak terdaftar di WhatsApp"}
                elif len(registered_list) > 0:
                    return {"registered": True, "message": "Nomor terdaftar di WhatsApp"}
            return {"registered": False, "message": "Respon validasi Fonnte gagal"}
        return {"registered": False, "message": f"HTTP {response.status_code}"}
    except Exception as e:
        logging.error(f"Fonnte validate error: {e}")
        return {"registered": False, "message": str(e)}


def normalize_phone_number(num: str) -> str:
    """Normalize phone number to international 62 format."""
    if not num:
        return ""
    digits = "".join(filter(str.isdigit, str(num)))
    if digits.startswith("0"):
        digits = "62" + digits[1:]
    elif digits.startswith("8"):
        digits = "62" + digits
    return digits

def check_whatsapp_registration(phone: str) -> dict:
    """
    Check if phone number exists in alerts or users, and whether it has unverified alerts.
    Used by webhook to ensure we NEVER reply to private personal chats or unregistered numbers.
    """
    from backend.database import get_db_connection
    norm = normalize_phone_number(phone)
    if not norm or len(norm) < 9:
        return {"exists": False, "total_alerts": 0, "unverified_alerts": 0, "is_verified": False}
    suffix = norm[-9:]
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check in alerts
    cursor.execute("""
        SELECT COUNT(*) as total, 
               SUM(CASE WHEN wa_verified = TRUE THEN 1 ELSE 0 END) as verified_count
        FROM alerts 
        WHERE whatsapp IS NOT NULL AND REPLACE(REPLACE(REPLACE(whatsapp, '+', ''), '-', ''), ' ', '') LIKE ?
    """, (f"%{suffix}",))
    row = cursor.fetchone()
    total = row[0] if row and row[0] is not None else 0
    verified = row[1] if row and row[1] is not None else 0
    
    # Check in users table
    cursor.execute("""
        SELECT COUNT(*) FROM users 
        WHERE whatsapp IS NOT NULL AND REPLACE(REPLACE(REPLACE(whatsapp, '+', ''), '-', ''), ' ', '') LIKE ?
    """, (f"%{suffix}",))
    user_row = cursor.fetchone()
    user_exists = (user_row[0] > 0) if user_row else False
    
    conn.close()
    
    exists = (total > 0) or user_exists
    unverified = total - verified
    return {
        "exists": exists,
        "total_alerts": total,
        "unverified_alerts": unverified,
        "is_verified": (verified > 0)
    }

def verify_whatsapp_number(phone: str) -> int:
    """
    Mark alerts and user record matching this phone number as wa_verified = True.
    Triggered when an incoming message (inbound chat) is received via Fonnte webhook.
    """
    from backend.database import get_db_connection
    norm = normalize_phone_number(phone)
    if not norm or len(norm) < 9:
        return 0
    suffix = norm[-9:]
    now_str = datetime.now().isoformat()
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE alerts 
        SET wa_verified = TRUE, wa_verified_at = ? 
        WHERE whatsapp IS NOT NULL AND REPLACE(REPLACE(REPLACE(whatsapp, '+', ''), '-', ''), ' ', '') LIKE ?
    """, (now_str, f"%{suffix}"))
    updated = cursor.rowcount if hasattr(cursor, 'rowcount') else 1
    
    cursor.execute("""
        UPDATE users 
        SET whatsapp = ? 
        WHERE whatsapp IS NOT NULL AND REPLACE(REPLACE(REPLACE(whatsapp, '+', ''), '-', ''), ' ', '') LIKE ?
    """, (norm, f"%{suffix}"))
    
    conn.commit()
    conn.close()
    logging.info(f"Verified WhatsApp number {phone} (Suffix: {suffix}) - {updated} alerts updated.")
    return updated

def unverify_whatsapp_number(phone: str) -> int:
    """
    Mark alerts matching this phone number as wa_verified = False (Opt-Out / STOP).
    Triggered when a user sends 'STOP' message.
    """
    from backend.database import get_db_connection
    norm = normalize_phone_number(phone)
    if not norm or len(norm) < 9:
        return 0
    suffix = norm[-9:]
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE alerts 
        SET wa_verified = FALSE, wa_verified_at = NULL 
        WHERE whatsapp IS NOT NULL AND REPLACE(REPLACE(REPLACE(whatsapp, '+', ''), '-', ''), ' ', '') LIKE ?
    """, (f"%{suffix}",))
    updated = cursor.rowcount if hasattr(cursor, 'rowcount') else 1
    conn.commit()
    conn.close()
    logging.info(f"Unverified (Opt-Out STOP) WhatsApp number {phone} (Suffix: {suffix}) - {updated} alerts updated.")
    return updated

def send_whatsapp_direct(to_number: str, message: str) -> bool:
    """Send immediate WhatsApp message via Fonnte (used for webhook auto-reply)."""
    config = _get_whatsapp_config()
    token = config.get("token")
    clean_num = normalize_phone_number(to_number)
    if token and clean_num:
        try:
            url = "https://api.fonnte.com/send"
            headers = {"Authorization": token}
            data = {"target": clean_num, "message": message, "countryCode": "62"}
            resp = requests.post(url, headers=headers, data=data, timeout=12)
            res_json = resp.json()
            if resp.status_code == 200 and res_json.get("status"):
                return True
        except Exception as e:
            logging.error(f"Error sending direct WA via Fonnte: {e}")
    return _write_mock_log(to_number, message)

def get_whatsapp_activation_link(user_wa: str = None, admin_wa: str = None) -> str:
    """Generate WhatsApp inbound activation link so user sends first message to bypass anti-spam block."""
    from backend.database import get_setting
    target_wa = admin_wa or get_setting("contact_whatsapp", "6281234567890")
    app_name = get_setting("app_name", "Spy SPSE")
    clean_wa = "".join(filter(str.isdigit, target_wa))
    if clean_wa.startswith("0"):
        clean_wa = "62" + clean_wa[1:]
        
    clean_user_wa = "".join(filter(str.isdigit, user_wa)) if user_wa else ""
    user_num_display = clean_user_wa if clean_user_wa else (user_wa or "")
    
    text = f"Halo {app_name}, saya mengaktifkan notifikasi alert tender untuk nomor WhatsApp saya: {user_num_display}."
    encoded_text = requests.utils.quote(text)
    return f"https://wa.me/{clean_wa}?text={encoded_text}"


def check_whatsapp_status(api_token: str = None) -> dict:
    """
    Check real-time status of WhatsApp Fonnte Gateway connection.
    Queries Fonnte API '/device' endpoint to check if device is CONNECT or DISCONNECT.
    """
    from backend.database import get_setting
    token = api_token if (api_token is not None and api_token.strip()) else _get_whatsapp_config()["token"]
    
    if not token:
        return {
            "status": "unconfigured",
            "connected": False,
            "message": "Token API Fonnte belum dikonfigurasi.",
            "device": None,
            "quota": None,
            "package": None
        }
        
    try:
        url = "https://api.fonnte.com/device"
        headers = {"Authorization": token}
        response = requests.post(url, headers=headers, timeout=10)
        
        if response.status_code == 200:
            res_json = response.json()
            is_ok = res_json.get("status")
            device_status = str(res_json.get("device_status", "")).upper()
            device_num = res_json.get("device")
            quota = res_json.get("quota")
            package = res_json.get("package")
            
            if is_ok and device_status == "CONNECT":
                return {
                    "status": "connected",
                    "connected": True,
                    "message": f"Koneksi Aktif ({device_num or 'Fonnte Device'})",
                    "device": device_num,
                    "name": res_json.get("name"),
                    "package": package,
                    "quota": quota,
                    "expired": res_json.get("expired")
                }
            elif is_ok and device_status != "CONNECT":
                return {
                    "status": "disconnected",
                    "connected": False,
                    "message": f"Terputus ({device_status or 'Perlu Scan QR Fonnte'})",
                    "device": device_num,
                    "quota": quota
                }
            else:
                reason = res_json.get("reason", "Token Fonnte tidak valid atau akun tidak aktif.")
                return {
                    "status": "error",
                    "connected": False,
                    "message": f"Gagal: {reason}",
                    "device": None
                }
        else:
            return {
                "status": "error",
                "connected": False,
                "message": f"HTTP {response.status_code} dari Fonnte",
                "device": None
            }
    except Exception as e:
        return {
            "status": "error",
            "connected": False,
            "message": f"Koneksi Fonnte Gagal: {str(e)}",
            "device": None
        }

def send_whatsapp_alert(to_number: str, keyword: str, tender: dict) -> bool:
    """
    Send WhatsApp notification for matching tender.
    Uses Fonnte API if token is configured, otherwise logs to mock_whatsapp.log.
    Includes anti-spam humanization: random delay and greeting variations.
    """
    from backend.database import get_setting
    app_name = get_setting("app_name", "Spy SPSE")
    app_logo = get_setting("app_logo", "🕵🏼‍♂️")
    
    # Message spinning (anti-spam hash randomization)
    greetings = [
        "Halo, kami menemukan tender baru yang cocok",
        "Info Tender Baru: Ditemukan proyek baru yang sesuai",
        "Pemberitahuan Radar Tender: Proyek baru terdeteksi",
        "Update Tender LPSE: Kami menemukan peluang baru"
    ]
    selected_greeting = random.choice(greetings)
    
    app_url = get_setting("app_url", "https://spyspse.com").rstrip("/")
    nomor_pengadaan = tender['nomor_pengadaan']
    public_tender_url = f"{app_url}/#/tender/{nomor_pengadaan}"

    # Build a premium WhatsApp alert message
    message = (
        f"{app_logo} *{app_name} — Tender Alert*\n\n"
        f"{selected_greeting} dengan kata kunci: *\"{keyword}\"*\n\n"
        f"• *Nomor Pengadaan:* `{nomor_pengadaan}`\n"
        f"• *Nama Tender:* {tender['nama_tender']}\n"
        f"• *Instansi:* {tender.get('instansi', '-')}\n"
        f"• *Nilai Pagu:* {tender.get('pagu', '-')}\n"
        f"• *Tahap Saat Ini:* {tender.get('tahap', '-')}\n"
        f"• *Metode:* {tender.get('metode', '-')}\n\n"
        f"🔍 *Lihat Detail & Pengumuman Resmi:*\n"
        f"{public_tender_url}\n\n"
        f"💡 _Ingin jeda notifikasi? Balas *STOP* untuk mematikan._"
    )
    
    # Add random delay (2 - 5s) to mimic human typing & bypass rate-limit filters
    time.sleep(random.uniform(2.0, 5.0))
    
    config = _get_whatsapp_config()
    if config["token"]:
        try:
            url = "https://api.fonnte.com/send"
            headers = {
                "Authorization": config["token"]
            }
            data = {
                "target": to_number,
                "message": message,
                "countryCode": "62"
            }
            response = requests.post(url, headers=headers, data=data, timeout=15)
            res_json = response.json()
            if response.status_code == 200 and res_json.get("status"):
                logging.info(f"WhatsApp alert sent successfully to {to_number} via Fonnte")
                return True
            else:
                logging.error(f"Fonnte API responded with error: {res_json.get('reason', 'Unknown error')}")
        except Exception as e:
            logging.error(f"Failed to connect to Fonnte API: {e}")
            
    # Fallback to local mock log file
    return _write_mock_log(to_number, message)

def send_test_whatsapp(to_number: str, api_token: str = None) -> dict:
    """Send a test WhatsApp message to verify Fonnte integration."""
    from backend.database import get_setting
    app_name = get_setting("app_name", "Spy SPSE")
    app_logo = get_setting("app_logo", "🕵🏼‍♂️")
    
    token = api_token if api_token is not None else _get_whatsapp_config()["token"]
    
    if not token:
        return {"success": False, "message": "API Token Fonnte belum dikonfigurasi. Masukkan Token terlebih dahulu."}
        
    message = (
        f"{app_logo} *{app_name} — Uji Coba WhatsApp*\n\n"
        f"Selamat! Pengujian integrasi WhatsApp Gateway menggunakan Fonnte berhasil.\n"
        f"Dikirim pada: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
    )
    
    try:
        url = "https://api.fonnte.com/send"
        headers = {
            "Authorization": token
        }
        data = {
            "target": to_number,
            "message": message,
            "countryCode": "62"
        }
        response = requests.post(url, headers=headers, data=data, timeout=15)
        res_json = response.json()
        if response.status_code == 200 and res_json.get("status"):
            return {"success": True, "message": f"WhatsApp uji coba sukses dikirim ke {to_number}!"}
        else:
            reason = res_json.get("reason", "Token Fonnte tidak valid atau limit habis.")
            return {"success": False, "message": f"Gagal mengirim pesan: {reason}"}
    except Exception as e:
        return {"success": False, "message": f"Koneksi ke Fonnte gagal: {str(e)}"}

def send_credentials_whatsapp(to_number: str, email: str, password: str = None, role: str = "user") -> dict:
    """Send user login credentials via Fonnte WhatsApp Gateway."""
    from backend.database import get_setting
    app_name = get_setting("app_name", "Spy SPSE")
    app_logo = get_setting("app_logo", "🕵🏼‍♂️")
    
    pass_info = f"🔑 *Password:* `{password}`\n" if password else "🔑 *Password:* (Tetap sama seperti yang telah diatur)\n"
    
    message = (
        f"{app_logo} *{app_name} — Akses Akun Anda*\n\n"
        f"Halo! Berikut adalah informasi akun akses login Anda:\n\n"
        f"📧 *Email:* `{email}`\n"
        f"{pass_info}"
        f"👤 *Role:* `{role.upper()}`\n\n"
        f"🌐 *Link Login:* {get_setting('app_url', 'https://spyspse.com').rstrip('/')}/auth\n\n"
        f"Silakan simpan informasi ini dengan aman."
    )
    
    config = _get_whatsapp_config()
    token = config["token"]
    
    if token:
        try:
            url = "https://api.fonnte.com/send"
            headers = {"Authorization": token}
            data = {"target": to_number, "message": message, "countryCode": "62"}
            response = requests.post(url, headers=headers, data=data, timeout=15)
            res_json = response.json()
            if response.status_code == 200 and res_json.get("status"):
                return {"success": True, "message": f"Kredensial login berhasil dikirim ke WhatsApp {to_number} via Fonnte!"}
            else:
                reason = res_json.get("reason", "Gagal mengirim via Fonnte API.")
                return {"success": False, "message": f"Fonnte Error: {reason}"}
        except Exception as e:
            return {"success": False, "message": f"Koneksi ke Fonnte gagal: {str(e)}"}
            
    # Fallback log
    _write_mock_log(to_number, message)
    return {"success": True, "message": f"[LOG MODE] Kredensial berhasil dicatat di log WhatsApp (Fonnte API Token belum diisi)."}


def send_password_reset_whatsapp(to_number: str, reset_link: str, expire_minutes: int = 15) -> dict:
    """Send Password Reset Link via Fonnte WhatsApp Gateway."""
    from backend.database import get_setting
    app_name = get_setting("app_name", "Spy SPSE")
    app_logo = get_setting("app_logo", "🕵🏼‍♂️")
    
    message = (
        f"{app_logo} *{app_name} — Reset Kata Sandi*\n\n"
        f"Halo! Kami menerima permintaan untuk mereset kata sandi akun Anda.\n\n"
        f"Silakan klik tautan di bawah ini untuk mengatur kata sandi baru Anda:\n"
        f"{reset_link}\n\n"
        f"⚠️ *Catatan:* Tautan ini hanya berlaku selama *{expire_minutes} menit* dan hanya dapat digunakan 1 kali demi keamanan akun Anda.\n\n"
        f"Jika Anda tidak merasa melakukan permintaan ini, silakan abaikan pesan ini."
    )
    
    config = _get_whatsapp_config()
    token = config["token"]
    
    if token:
        try:
            url = "https://api.fonnte.com/send"
            headers = {"Authorization": token}
            data = {"target": to_number, "message": message, "countryCode": "62"}
            response = requests.post(url, headers=headers, data=data, timeout=15)
            res_json = response.json()
            if response.status_code == 200 and res_json.get("status"):
                return {"success": True, "message": f"Tautan reset kata sandi berhasil dikirim ke WhatsApp {to_number}."}
            else:
                reason = res_json.get("reason", "Gagal mengirim via Fonnte API.")
                return {"success": False, "message": f"Fonnte Error: {reason}"}
        except Exception as e:
            return {"success": False, "message": f"Koneksi ke Fonnte gagal: {str(e)}"}
            
    # Fallback log
    _write_mock_log(to_number, message)
    return {"success": True, "message": f"[LOG MODE] Tautan reset kata sandi berhasil dicatat di log WhatsApp."}

def send_admin_crawl_alert(instansi: str, error_reason: str) -> dict:
    """Send emergency notification to Admin WhatsApp when an LPSE crawl fails or IP is blocked."""
    from backend.database import get_setting
    app_name = get_setting("app_name", "Spy SPSE")
    admin_wa = get_setting("contact_whatsapp", "")
    
    if not admin_wa:
        logging.warning("No admin WhatsApp number configured for crawl error alerts")
        return {"success": False, "message": "Admin WhatsApp not configured"}
        
    now_str = datetime.now().strftime("%d-%m-%Y %H:%M:%S")
    message = (
        f"🚨 *{app_name} — PERINGATAN KENDALA CRAWLING* 🚨\n\n"
        f"Sistem memantau terjadi kendala penarikan data / dugaan pemblokiran IP VPS:\n"
        f"• *Instansi/LPSE:* `{instansi}`\n"
        f"• *Kendala:* {error_reason}\n"
        f"• *Waktu Kejadian:* {now_str}\n\n"
        f"💡 *Tindakan Disarankan:* Buka Dasbor Admin (Menu *IP Proxy & Anti-Block*) lalu aktifkan / ganti IP Proxy agar penarikan data berjalan lancar kembali."
    )
    
    config = _get_whatsapp_config()
    token = config["token"]
    if token:
        try:
            url = "https://api.fonnte.com/send"
            headers = {"Authorization": token}
            data = {"target": admin_wa, "message": message, "countryCode": "62"}
            response = requests.post(url, headers=headers, data=data, timeout=15)
            res_json = response.json()
            if response.status_code == 200 and res_json.get("status"):
                logging.info(f"Crawl failure alert sent to Admin WhatsApp: {admin_wa}")
                return {"success": True, "message": "Peringatan berhasil dikirim ke Admin WhatsApp."}
            else:
                logging.error(f"Failed to send admin crawl alert via Fonnte: {res_json}")
        except Exception as e:
            logging.error(f"Error sending admin crawl alert via Fonnte: {e}")
            
    _write_mock_log(admin_wa, message)
    return {"success": True, "message": "[LOG MODE] Peringatan kendala crawling dicatat di log."}



