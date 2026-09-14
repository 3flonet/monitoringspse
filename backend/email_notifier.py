import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from pathlib import Path
from datetime import datetime

LOG_FILE = Path(__file__).parent / "mock_emails.log"


def _get_smtp_config():
    """Load SMTP configuration from system_settings database (dynamic, not env var)."""
    from backend.database import get_setting
    return {
        "host": get_setting("smtp_host", ""),
        "port": get_setting("smtp_port", "587"),
        "user": get_setting("smtp_user", ""),
        "password": get_setting("smtp_password", ""),
        "sender": get_setting("smtp_sender", "no-reply@spyspse.com"),
    }


def _build_html_email(app_name, keyword, tender):
    """Build HTML email body for a tender alert."""
    from backend.database import get_setting
    app_logo = get_setting("app_logo", "🕵🏼‍♂️")
    app_url = get_setting("app_url", "http://localhost:5173").rstrip("/")
    nomor_pengadaan = tender['nomor_pengadaan']
    public_tender_url = f"{app_url}/#/tender/{nomor_pengadaan}"

    return f"""
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; color: #333; line-height: 1.6; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }}
            .header {{ background-color: #6366f1; color: white; padding: 15px; border-radius: 6px 6px 0 0; text-align: center; }}
            .content {{ padding: 20px; }}
            .tender-info {{ background-color: #f9fafb; border-left: 4px solid #6366f1; padding: 15px; margin: 15px 0; border-radius: 0 4px 4px 0; }}
            .footer {{ font-size: 12px; color: #777; text-align: center; margin-top: 20px; }}
            .btn {{ display: inline-block; padding: 12px 24px; color: white; background-color: #6366f1; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 15px; text-align: center; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>{app_logo} {app_name} — Tender Alert</h2>
            </div>
            <div class="content">
                <p>Halo,</p>
                <p>Kami menemukan tender baru yang cocok dengan kata kunci pencarian Anda: <strong>"{keyword}"</strong>.</p>
                <div class="tender-info">
                    <strong>Nomor Pengadaan:</strong> <span style="font-size: 16px; font-weight: bold; color: #111827; background-color: #e0e7ff; padding: 2px 8px; border-radius: 4px;">{nomor_pengadaan}</span><br>
                    <strong>Nama Paket:</strong> {tender['nama_tender']}<br>
                    <strong>Instansi:</strong> {tender.get('instansi', '-')}<br>
                    <strong>Nilai Pagu:</strong> {tender.get('pagu', '-')}<br>
                    <strong>Tahap Saat Ini:</strong> {tender.get('tahap', '-')}<br>
                    <strong>Metode Pengadaan:</strong> {tender.get('metode', '-')}<br>
                </div>

                <div style="text-align: center; margin-top: 20px;">
                    <a href="{public_tender_url}" class="btn" style="color: white; text-decoration: none;">🔍 Lihat Detail Tender & Pengumuman Resmi</a>
                </div>
            </div>
            <div class="footer">
                <p>Email ini dikirim otomatis oleh <strong>{app_name}</strong>.</p>
                <p>&copy; 2026 {app_name}</p>
            </div>
        </div>
    </body>
    </html>
    """


def _send_via_smtp(smtp, to_email, subject, html_content):
    """Internal SMTP sending helper. Raises exception on failure."""
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = smtp["sender"]
    msg["To"] = to_email
    msg.attach(MIMEText(html_content, "html"))

    try:
        port = int(smtp["port"])
    except ValueError:
        raise ValueError(f"Port SMTP tidak valid: '{smtp['port']}' (harus berupa angka)")

    if port == 465:
        server = smtplib.SMTP_SSL(smtp["host"], port)
    else:
        server = smtplib.SMTP(smtp["host"], port)
        server.ehlo()
        server.starttls()

    with server:
        server.login(smtp["user"], smtp["password"])
        server.sendmail(smtp["sender"], [to_email], msg.as_string())


def _write_mock_log(smtp_from, to_email, subject, keyword, tender):
    """Write email data to local fallback log file for debugging."""
    try:
        with open(LOG_FILE, "a", encoding="utf-8") as f:
            f.write(f"{'='*52}\n")
            f.write(f"TIMESTAMP: {datetime.now().isoformat()}\n")
            f.write(f"FROM: {smtp_from}\n")
            f.write(f"TO: {to_email}\n")
            f.write(f"SUBJECT: {subject}\n")
            f.write(f"Keyword: {keyword}\n")
            f.write(f"Tender ID: {tender['nomor_pengadaan']}\n")
            f.write(f"Nama Tender: {tender['nama_tender']}\n")
            f.write(f"Instansi: {tender.get('instansi', '-')}\n")
            f.write(f"Pagu: {tender.get('pagu', '-')}\n")
            f.write(f"Tahap: {tender.get('tahap', '-')}\n")
            f.write(f"{'='*52}\n\n")
        logging.info(f"[MOCK EMAIL] Alert logged to {LOG_FILE.name}")
        return True
    except Exception as e:
        logging.error(f"Failed to write mock email log: {e}")
        return False


def send_email_alert(to_email, keyword, tender):
    """
    Send an email alert for a matching tender.
    SMTP config is loaded dynamically from system_settings database.
    Falls back to mock log file if SMTP is not configured.
    """
    from backend.database import get_setting
    app_name = get_setting("app_name", "Spy SPSE")
    subject = f"[Tender Alert] Tender Baru Ditemukan untuk Kata Kunci: '{keyword}'"
    html_content = _build_html_email(app_name, keyword, tender)
    smtp = _get_smtp_config()

    if smtp["host"] and smtp["user"] and smtp["password"]:
        try:
            _send_via_smtp(smtp, to_email, subject, html_content)
            logging.info(f"Email alert sent to {to_email} for tender {tender['nomor_pengadaan']}")
            return True
        except Exception as e:
            logging.error(f"SMTP send failed: {e}. Falling back to mock log.")
            _write_mock_log(smtp["sender"], to_email, subject, keyword, tender)
            return False

    _write_mock_log(smtp["sender"], to_email, subject, keyword, tender)
    return False

def check_smtp_status(smtp_config: dict = None) -> dict:
    """
    Check real-time status of SMTP Email server connection.
    Attempts TCP connection & EHLO/STARTTLS/Auth login to verify host & credentials.
    """
    if smtp_config is None:
        smtp = _get_smtp_config()
    else:
        smtp = smtp_config

    host = (smtp.get("host") or "").strip()
    port_str = str(smtp.get("port") or "587").strip()
    user = (smtp.get("user") or "").strip()
    password = (smtp.get("password") or "").strip()
    sender = (smtp.get("sender") or "").strip()

    if not host or not user or not password:
        return {
            "status": "unconfigured",
            "connected": False,
            "message": "Konfigurasi SMTP belum lengkap (Host, Username, & Password wajib diisi).",
            "host": host,
            "port": port_str,
            "sender": sender
        }

    try:
        try:
            port = int(port_str)
        except ValueError:
            return {
                "status": "error",
                "connected": False,
                "message": f"Port SMTP tidak valid: '{port_str}'",
                "host": host,
                "port": port_str
            }

        if port == 465:
            server = smtplib.SMTP_SSL(host, port, timeout=10)
        else:
            server = smtplib.SMTP(host, port, timeout=10)
            server.ehlo()
            server.starttls()

        with server:
            server.login(user, password)
            
        return {
            "status": "connected",
            "connected": True,
            "message": f"Koneksi Aktif ({host}:{port})",
            "host": host,
            "port": port,
            "user": user,
            "sender": sender
        }
    except smtplib.SMTPAuthenticationError:
        return {
            "status": "error",
            "connected": False,
            "message": "Gagal Otentikasi: Username atau Password SMTP salah.",
            "host": host,
            "port": port_str
        }
    except smtplib.SMTPConnectError:
        return {
            "status": "error",
            "connected": False,
            "message": f"Gagal terhubung ke host '{host}:{port_str}'. Periksa alamat host & port.",
            "host": host,
            "port": port_str
        }
    except Exception as e:
        return {
            "status": "error",
            "connected": False,
            "message": f"Koneksi SMTP Gagal: {str(e)}",
            "host": host,
            "port": port_str
        }


def send_test_email(to_email, smtp_config=None):
    """
    Send a test email to verify SMTP settings.

    Args:
        to_email: Target email address.
        smtp_config: Optional dict with SMTP overrides. If None, loads from DB.

    Returns:
        dict: {"success": bool, "message": str}
    """
    from backend.database import get_setting
    app_name = get_setting("app_name", "Spy SPSE")
    app_logo = get_setting("app_logo", "🕵🏼‍♂️")

    if smtp_config is None:
        smtp = _get_smtp_config()
    else:
        smtp = smtp_config

    if not smtp["host"] or not smtp["user"] or not smtp["password"]:
        return {"success": False, "message": "Konfigurasi SMTP tidak lengkap. Host, user, dan password wajib diisi."}

    subject = f"{app_logo} {app_name} — Uji Coba Email SMTP"
    html_content = f"""
    <html><body style="font-family: Arial, sans-serif; padding: 20px;">
        <div style="max-width: 500px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
            <div style="background: #6366f1; padding: 20px; text-align: center;">
                <h2 style="color: white; margin: 0;">{app_logo} {app_name}</h2>
            </div>
            <div style="padding: 24px;">
                <h3>Pengujian Koneksi SMTP Berhasil!</h3>
                <p>Email uji coba ini dikirim dari panel <strong>Super Admin</strong> untuk memverifikasi bahwa konfigurasi SMTP sudah benar dan berfungsi.</p>
                <p><strong>SMTP Host:</strong> {smtp["host"]}</p>
                <p><strong>SMTP Port:</strong> {smtp["port"]}</p>
                <p><strong>Pengirim:</strong> {smtp["sender"]}</p>
                <hr style="border-color: #eee;">
                <p style="color: #888; font-size: 12px;">Dikirim pada: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
            </div>
        </div>
    </body></html>
    """

    try:
        _send_via_smtp(smtp, to_email, subject, html_content)
        logging.info(f"Test email sent successfully to {to_email}")
        return {"success": True, "message": f"Email uji coba berhasil dikirim ke {to_email}!"}
    except smtplib.SMTPAuthenticationError:
        return {"success": False, "message": "Gagal otentikasi SMTP. Periksa kembali username dan password."}
    except smtplib.SMTPConnectError:
        return {"success": False, "message": f"Gagal terhubung ke SMTP server '{smtp['host']}:{smtp['port']}'. Periksa host dan port."}
    except Exception as e:
        return {"success": False, "message": f"Gagal mengirim email: {str(e)}"}

def send_credentials_email(to_email: str, password: str = None, role: str = "user") -> dict:
    """Send user login credentials via SMTP Email."""
    from backend.database import get_setting
    app_name = get_setting("app_name", "Spy SPSE")
    app_logo = get_setting("app_logo", "🕵🏼‍♂️")
    
    smtp = _get_smtp_config()
    subject = f"{app_logo} {app_name} — Informasi Akses Akun Anda"
    
    pass_html = f"<strong>Password:</strong> <code style='background: #e2e8f0; padding: 2px 6px; border-radius: 4px;'>{password}</code><br>" if password else "<strong>Password:</strong> (Tetap sama seperti yang diatur)<br>"
    
    html_content = f"""
    <html><body style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <div style="max-width: 520px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; font-size: 14px;">
            <div style="background: linear-gradient(135deg, #6366f1, #4f46e5); padding: 24px; text-align: center; color: white;">
                <h2 style="margin: 0;">{app_logo} {app_name}</h2>
                <p style="margin: 6px 0 0; opacity: 0.9; font-size: 13px;">Informasi Akses Akun & Login</p>
            </div>
            <div style="padding: 28px; background: #ffffff;">
                <p>Halo,</p>
                <p>Berikut adalah rincian akses login akun Anda di platform <strong>{app_name}</strong>:</p>
                <div style="background: #f8fafc; border-left: 4px solid #6366f1; padding: 16px; margin: 20px 0; border-radius: 0 8px 8px 0;">
                    <strong>Email:</strong> <code style="background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">{to_email}</code><br>
                    {pass_html}
                    <strong>Role:</strong> <span style="text-transform: uppercase; font-weight: bold; color: #6366f1;">{role}</span>
                </div>
                <p style="text-align: center; margin-top: 24px;">
                    <a href="http://localhost:5173/auth" style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Login ke Dashboard</a>
                </p>
                <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 24px 0;">
                <p style="color: #94a3b8; font-size: 12px; text-align: center;">Harap simpan informasi akun ini dengan aman.</p>
            </div>
        </div>
    </body></html>
    """
    
    if smtp["host"] and smtp["user"] and smtp["password"]:
        try:
            _send_via_smtp(smtp, to_email, subject, html_content)
            return {"success": True, "message": f"Kredensial login berhasil dikirim ke email {to_email} via SMTP!"}
        except Exception as e:
            return {"success": False, "message": f"Gagal mengirim SMTP Email: {str(e)}"}
            
    # Fallback log
    _write_mock_log(smtp["sender"], to_email, subject, "CREDS", {"nomor_pengadaan": "LOGIN", "nama_tender": "Account Credentials"})
    return {"success": True, "message": f"[LOG MODE] Kredensial berhasil dicatat di log Email (SMTP Server belum dikonfigurasi)."}


def send_password_reset_email(to_email: str, reset_link: str, expire_minutes: int = 15) -> dict:
    """Send Password Reset Link via SMTP Email."""
    from backend.database import get_setting
    app_name = get_setting("app_name", "Spy SPSE")
    app_logo = get_setting("app_logo", "🕵🏼‍♂️")
    
    smtp = _get_smtp_config()
    subject = f"{app_logo} {app_name} — Instruksi Reset Kata Sandi"
    
    html_content = f"""
    <html><body style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <div style="max-width: 520px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; font-size: 14px;">
            <div style="background: linear-gradient(135deg, #6366f1, #4f46e5); padding: 24px; text-align: center; color: white;">
                <h2 style="margin: 0;">{app_logo} {app_name}</h2>
                <p style="margin: 6px 0 0; opacity: 0.9; font-size: 13px;">Instruksi Permintaan Reset Kata Sandi</p>
            </div>
            <div style="padding: 28px; background: #ffffff;">
                <p>Halo,</p>
                <p>Kami menerima permintaan untuk mereset kata sandi akun Anda (<strong>{to_email}</strong>) di platform <strong>{app_name}</strong>.</p>
                <p>Silakan klik tombol di bawah ini untuk mengatur kata sandi baru Anda:</p>
                <p style="text-align: center; margin: 28px 0;">
                    <a href="{reset_link}" style="display: inline-block; background: #6366f1; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 15px; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);">Reset Kata Sandi Sekarang</a>
                </p>
                <div style="background: #fffbebfb; border: 1px solid #fef3c7; padding: 12px 16px; border-radius: 8px; font-size: 12px; color: #b45309; margin-bottom: 20px;">
                    ⚠️ Link ini hanya berlaku selama <strong>{expire_minutes} menit</strong> dan hanya dapat digunakan 1 kali demi keamanan akun Anda.
                </div>
                <p style="color: #64748b; font-size: 12px;">Jika tombol di atas tidak berfungsi, salin dan tempelkan link berikut di browser Anda:<br>
                <a href="{reset_link}" style="color: #6366f1; word-break: break-all;">{reset_link}</a></p>
                <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 24px 0;">
                <p style="color: #94a3b8; font-size: 12px; text-align: center;">Jika Anda tidak merasa melakukan permintaan ini, abaikan email ini. Kata sandi Anda akan tetap aman.</p>
            </div>
        </div>
    </body></html>
    """
    
    if smtp["host"] and smtp["user"] and smtp["password"]:
        try:
            _send_via_smtp(smtp, to_email, subject, html_content)
            return {"success": True, "message": f"Instruksi reset kata sandi telah dikirim ke email {to_email}."}
        except Exception as e:
            return {"success": False, "message": f"Gagal mengirim SMTP Email: {str(e)}"}
            
    # Fallback log
    _write_mock_log(smtp["sender"], to_email, subject, "RESET_PASSWORD", {"nomor_pengadaan": reset_link, "nama_tender": "Password Reset Link"})
    return {"success": True, "message": f"[LOG MODE] Instruksi reset kata sandi berhasil dicatat di log Email."}


