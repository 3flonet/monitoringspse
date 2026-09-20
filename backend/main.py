import os
import json
import logging
import shutil
import time
import requests
import psutil
from pathlib import Path
from datetime import datetime, timedelta
from typing import Optional, List, Any

from fastapi import FastAPI, BackgroundTasks, HTTPException, Depends, Query, UploadFile, File, status
from fastapi.responses import JSONResponse, Response
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from backend.database import (
    get_db_connection, DB_PATH, get_setting, set_setting,
    create_user, get_user_by_email, get_user_subscription, update_user_subscription,
    create_voucher, get_voucher, increment_voucher_usage, delete_voucher, get_all_vouchers, get_transaction,
    create_article, get_article_by_slug, get_all_articles, update_article, delete_article, clean_str,
    create_password_reset, get_password_reset_by_hash, mark_password_reset_used, update_user_password,
    create_contact_submission, get_all_contact_submissions, update_contact_submission_status, delete_contact_submission,
    get_company_leads, get_all_company_leads_for_export, upsert_company_contact
)
from backend.auth import (
    hash_password, verify_password, create_access_token, get_current_user
)
from backend.whatsapp_notifier import send_whatsapp_alert, send_test_whatsapp, send_password_reset_whatsapp, check_whatsapp_status
from backend.email_notifier import send_test_email, send_email_alert, send_password_reset_email, check_smtp_status
from backend.crawl_coordinator import run_crawl


logging.basicConfig(level=logging.INFO, format='[%(levelname)s] %(message)s')

SERVER_START_TIME = time.time()

app = FastAPI(title="Spy SPSE SaaS API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure static files directory exists and mount it
UPLOAD_DIR = Path(__file__).parent / "static" / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/static", StaticFiles(directory=str(Path(__file__).parent / "static")), name="static")

# Ensure logs directory exists
Path("logs").mkdir(exist_ok=True)

# Pydantic Request/Response Models
class UserRegister(BaseModel):
    email: str
    password: str
    whatsapp: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str

class ForgotPasswordReq(BaseModel):
    email: str

class ResetPasswordReq(BaseModel):
    token: str
    new_password: str


class AlertCreate(BaseModel):
    keyword: str
    email: str
    whatsapp: Optional[str] = None
    instansi: str

class AlertUpdateWhatsapp(BaseModel):
    whatsapp: str


class CrawlRequest(BaseModel):
    tipe: str = "tender"
    category: str = "nasional"
    tahun: Optional[int] = None
    limit: Optional[int] = 25
    start: Optional[int] = 0
    search: Optional[str] = ""

class SettingsUpdate(BaseModel):
    app_name: Optional[str] = None
    app_logo: Optional[str] = None
    app_tagline: Optional[str] = None
    seo_description: Optional[str] = None
    seo_keywords: Optional[str] = None
    geo_placename: Optional[str] = None
    whatsapp_api_token: Optional[str] = None
    whatsapp_sender: Optional[str] = None
    smtp_host: Optional[str] = None
    smtp_port: Optional[str] = None
    smtp_user: Optional[str] = None
    smtp_password: Optional[str] = None
    smtp_sender: Optional[str] = None
    premium_price: Optional[str] = None
    premium_price_yearly: Optional[str] = None
    lpse_instances: Optional[Any] = None
    midtrans_server_key: Optional[str] = None
    midtrans_client_key: Optional[str] = None
    midtrans_is_production: Optional[str] = None
    contact_whatsapp: Optional[str] = None
    contact_email: Optional[str] = None
    contact_maps_embed: Optional[str] = None
    spse_proxy: Optional[str] = None

class MaintenanceToggleReq(BaseModel):
    maintenance_mode: bool
    maintenance_message: Optional[str] = None



class SmtpTestRequest(BaseModel):
    smtp_host: str
    smtp_port: str
    smtp_user: str
    smtp_password: str
    smtp_sender: str
    test_email: str

class WhatsappTestRequest(BaseModel):
    to_whatsapp: str
    whatsapp_api_token: str

class WhatsappStatusRequest(BaseModel):
    whatsapp_api_token: Optional[str] = None

class ProxyTestRequest(BaseModel):
    proxy_url: str

class SmtpStatusRequest(BaseModel):
    smtp_host: Optional[str] = None
    smtp_port: Optional[str] = None
    smtp_user: Optional[str] = None
    smtp_password: Optional[str] = None
    smtp_sender: Optional[str] = None

class MidtransStatusRequest(BaseModel):
    midtrans_server_key: Optional[str] = None
    midtrans_client_key: Optional[str] = None
    midtrans_is_production: Optional[str] = None

class VoucherCreateReq(BaseModel):
    code: str
    discount_type: str
    discount_value: float
    max_uses: Optional[int] = 100
    expires_at: Optional[str] = None

class VoucherValidateReq(BaseModel):
    code: str
    duration_days: int

class CheckoutRequest(BaseModel):
    plan_type: str
    duration_days: int
    voucher_code: Optional[str] = None

class MidtransWebhookReq(BaseModel):
    order_id: str
    transaction_status: str
    status_code: str

class VerifyPaymentRequest(BaseModel):
    order_id: str

class ArticleCreateReq(BaseModel):
    title: str
    slug: str
    content: str
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    meta_keywords: Optional[str] = None
    is_pinned: Optional[int] = 0
    is_published: Optional[int] = 1
    image_url: Optional[str] = None
    youtube_embed: Optional[str] = None

class CompanyContactUpdate(BaseModel):
    company_name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    npwp: Optional[str] = None

# AUTH ENDPOINTS
@app.post("/api/auth/register")
def register(req: UserRegister):
    existing = get_user_by_email(req.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email sudah terdaftar.")
    hashed = hash_password(req.password)
    try:
        user_id = create_user(req.email, hashed, whatsapp=req.whatsapp)
        return {"status": "success", "message": "Registrasi berhasil.", "user_id": user_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal registrasi: {str(e)}")

@app.post("/api/auth/login")
def login(req: UserLogin):
    user = get_user_by_email(req.email)
    if not user or not verify_password(req.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Email atau password salah.")
    token = create_access_token({"sub": str(user["id"]), "email": user["email"], "role": user["role"]})
    return {"access_token": token, "token_type": "bearer"}

@app.get("/api/auth/me")
def get_me(current_user: dict = Depends(get_current_user)):
    sub = get_user_subscription(current_user["id"])
    return {
        "id": current_user["id"],
        "email": current_user["email"],
        "role": current_user["role"],
        "whatsapp": current_user.get("whatsapp"),
        "subscription": {
            "plan_type": sub["plan_type"] if sub else "trial",
            "status": sub["status"] if sub else "active",
            "start_date": sub["start_date"] if sub else None,
            "end_date": sub["end_date"] if sub else None
        }
    }

@app.post("/api/auth/forgot-password")
def forgot_password(req: ForgotPasswordReq):
    import secrets
    import hashlib
    
    clean_email = req.email.strip().lower()
    user = get_user_by_email(clean_email)
    
    # Generic success message for security (Anti Account Enumeration)
    generic_msg = "Jika email terdaftar di sistem kami, instruksi reset kata sandi telah dikirim ke Email / WhatsApp Anda."
    
    if not user:
        return {"status": "success", "message": generic_msg}
        
    # Generate crypto-secure plain token
    plain_token = secrets.token_urlsafe(32)
    token_hash = hashlib.sha256(plain_token.encode('utf-8')).hexdigest()
    
    # Expiration: 15 minutes
    expires_at = (datetime.utcnow() + timedelta(minutes=15)).isoformat()
    
    # Save to database
    create_password_reset(user["id"], token_hash, expires_at)
    
    # Build reset link
    reset_link = f"http://localhost:5173/#/reset-password?token={plain_token}"
    
    # Send via Email
    send_password_reset_email(clean_email, reset_link, expire_minutes=15)
    
    # Send via WhatsApp if user has registered WhatsApp number
    if user.get("whatsapp"):
        send_password_reset_whatsapp(user["whatsapp"], reset_link, expire_minutes=15)
        
    return {"status": "success", "message": generic_msg}

@app.get("/api/auth/verify-reset-token")
def verify_reset_token(token: str = Query(...)):
    import hashlib
    token_hash = hashlib.sha256(token.encode('utf-8')).hexdigest()
    reset_rec = get_password_reset_by_hash(token_hash)
    
    if not reset_rec or reset_rec.get("used", 0) == 1:
        raise HTTPException(status_code=400, detail="Tautan reset kata sandi tidak valid atau telah digunakan.")
        
    try:
        expires_at = datetime.fromisoformat(reset_rec["expires_at"])
        if datetime.utcnow() > expires_at:
            raise HTTPException(status_code=400, detail="Tautan reset kata sandi telah kadaluarsa (berlaku 15 menit).")
    except Exception:
        raise HTTPException(status_code=400, detail="Format token tidak valid.")
        
    return {"status": "success", "valid": True, "message": "Token valid."}

@app.post("/api/auth/reset-password")
def reset_password(req: ResetPasswordReq):
    import hashlib
    if len(req.new_password) < 6:
        raise HTTPException(status_code=400, detail="Password minimal 6 karakter.")
        
    token_hash = hashlib.sha256(req.token.encode('utf-8')).hexdigest()
    reset_rec = get_password_reset_by_hash(token_hash)
    
    if not reset_rec or reset_rec.get("used", 0) == 1:
        raise HTTPException(status_code=400, detail="Tautan reset kata sandi tidak valid atau telah digunakan.")
        
    try:
        expires_at = datetime.fromisoformat(reset_rec["expires_at"])
        if datetime.utcnow() > expires_at:
            raise HTTPException(status_code=400, detail="Tautan reset kata sandi telah kadaluarsa.")
    except Exception:
        raise HTTPException(status_code=400, detail="Format token tidak valid.")
        
    # Update password and mark token used
    new_hash = hash_password(req.new_password)
    update_user_password(reset_rec["user_id"], new_hash)
    mark_password_reset_used(reset_rec["id"])
    
    return {"status": "success", "message": "Kata sandi berhasil diperbarui! Silakan login dengan kata sandi baru Anda."}



DEFAULT_APP_TAGLINE = "Solusi Praktis Menangkan Tender Pemerintah"
DEFAULT_SEO_DESCRIPTION = "Spy SPSE adalah platform intelijen dan monitoring tender LPSE Indonesia terdepan. Pantau peluang pengadaan barang/jasa, analisis kompetitor, notifikasi WhatsApp realtime, dan wujudkan strategi menang tender pemerintah secara praktis dan otomatis."
DEFAULT_SEO_KEYWORDS = "spy spse, lpse, monitoring tender, pengadaan barang jasa, tender pemerintah, lkpp, tender indonesia, pantau lpse, analisis kompetitor tender, e-procurement, tender online, sirup lkpp, tender konstruksi, tender jasa konsultansi"
DEFAULT_GEO_PLACENAME = "Indonesia"

# PUBLIC SETTINGS
@app.get("/api/settings/public")
def get_public_settings():
    lpse_str = get_setting("lpse_instances", "[]")
    try:
        lpse_list = json.loads(lpse_str)
    except Exception:
        lpse_list = []
        
    return {
        "app_name": get_setting("app_name", "Spy SPSE") or "Spy SPSE",
        "app_logo": get_setting("app_logo", "🕵🏼‍♂️") or "🕵🏼‍♂️",
        "app_tagline": get_setting("app_tagline", DEFAULT_APP_TAGLINE) or DEFAULT_APP_TAGLINE,
        "seo_description": get_setting("seo_description", DEFAULT_SEO_DESCRIPTION) or DEFAULT_SEO_DESCRIPTION,
        "seo_keywords": get_setting("seo_keywords", DEFAULT_SEO_KEYWORDS) or DEFAULT_SEO_KEYWORDS,
        "geo_placename": get_setting("geo_placename", DEFAULT_GEO_PLACENAME) or DEFAULT_GEO_PLACENAME,
        "premium_price": get_setting("premium_price", "150000"),
        "premium_price_yearly": get_setting("premium_price_yearly", "1500000"),
        "trial_days": get_setting("trial_days", "7"),
        "lpse_instances": lpse_list,
        "contact_whatsapp": get_setting("contact_whatsapp", ""),
        "contact_email": get_setting("contact_email", ""),
        "contact_maps_embed": get_setting("contact_maps_embed", ""),
        "midtrans_client_key": get_setting("midtrans_client_key", ""),
        "midtrans_is_production": get_setting("midtrans_is_production", "false"),
        "maintenance_mode": get_setting("maintenance_mode", "false") == "true",
        "maintenance_message": get_setting("maintenance_message", "Sistem sedang dalam pemeliharaan rutin. Silakan kembali beberapa saat lagi."),
        "chatbot_active": get_setting("chatbot_active", "true"),
        "chatbot_name": get_setting("chatbot_name", "Nadia"),
        "chatbot_avatar": get_setting("chatbot_avatar", ""),
        "chatbot_initial_greeting": get_setting("chatbot_initial_greeting", "Halo! Saya Nadia, asisten virtual Spy SPSE. Ada yang bisa saya bantu terkait pemantauan tender LPSE?"),
        "chatbot_ask_name_message": get_setting("chatbot_ask_name_message", "Boleh tahu siapa nama Anda?"),
        "chatbot_ask_phone_message": get_setting("chatbot_ask_phone_message", "Boleh minta nomor WhatsApp Anda yang aktif? (Contoh: 08123456789)"),
        "chatbot_ask_email_message": get_setting("chatbot_ask_email_message", "Bisa infokan juga alamat email Anda?"),
        "chatbot_ask_reason_message": get_setting("chatbot_ask_reason_message", "Terima kasih! Silakan ceritakan apa yang ingin Anda tanyakan atau konsultasikan mengenai pemantauan tender LPSE?"),
        "chatbot_final_message": get_setting("chatbot_final_message", "Terima kasih! Informasi Anda sudah kami simpan. Silakan klik tombol di bawah untuk langsung terhubung dengan tim teknis kami di WhatsApp.")
    }


# ADMIN SETTINGS
@app.get("/api/admin/settings")
def get_admin_settings(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Akses ditolak.")
    lpse_str = get_setting("lpse_instances", "[]")
    try:
        lpse_list = json.loads(lpse_str)
    except Exception:
        lpse_list = []
        
    return {
        "app_name": get_setting("app_name", "Spy SPSE") or "Spy SPSE",
        "app_logo": get_setting("app_logo", "🕵🏼‍♂️") or "🕵🏼‍♂️",
        "app_tagline": get_setting("app_tagline", DEFAULT_APP_TAGLINE) or DEFAULT_APP_TAGLINE,
        "seo_description": get_setting("seo_description", DEFAULT_SEO_DESCRIPTION) or DEFAULT_SEO_DESCRIPTION,
        "seo_keywords": get_setting("seo_keywords", DEFAULT_SEO_KEYWORDS) or DEFAULT_SEO_KEYWORDS,
        "geo_placename": get_setting("geo_placename", DEFAULT_GEO_PLACENAME) or DEFAULT_GEO_PLACENAME,
        "whatsapp_api_token": get_setting("whatsapp_api_token", ""),
        "whatsapp_sender": get_setting("whatsapp_sender", ""),
        "smtp_host": get_setting("smtp_host", ""),
        "smtp_port": get_setting("smtp_port", ""),
        "smtp_user": get_setting("smtp_user", ""),
        "smtp_password": "********" if get_setting("smtp_password", "") else "",
        "smtp_sender": get_setting("smtp_sender", ""),
        "premium_price": get_setting("premium_price", "150000"),
        "premium_price_yearly": get_setting("premium_price_yearly", "1500000"),
        "lpse_instances": lpse_list,
        "midtrans_server_key": get_setting("midtrans_server_key", ""),
        "midtrans_client_key": get_setting("midtrans_client_key", ""),
        "midtrans_is_production": get_setting("midtrans_is_production", "false"),
        "contact_whatsapp": get_setting("contact_whatsapp", ""),
        "contact_email": get_setting("contact_email", ""),
        "contact_maps_embed": get_setting("contact_maps_embed", ""),
        "spse_proxy": get_setting("spse_proxy", "")
    }

@app.post("/api/admin/settings")
def update_admin_settings(req: SettingsUpdate, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Akses ditolak.")
    if req.app_name is not None:
        set_setting("app_name", req.app_name)
    if req.app_logo is not None:
        set_setting("app_logo", req.app_logo)
    if req.app_tagline is not None:
        set_setting("app_tagline", req.app_tagline)
    if req.seo_description is not None:
        set_setting("seo_description", req.seo_description)
    if req.seo_keywords is not None:
        set_setting("seo_keywords", req.seo_keywords)
    if req.geo_placename is not None:
        set_setting("geo_placename", req.geo_placename)
    if req.whatsapp_api_token is not None:
        set_setting("whatsapp_api_token", req.whatsapp_api_token)
    if req.whatsapp_sender is not None:
        set_setting("whatsapp_sender", req.whatsapp_sender)
    if req.smtp_host is not None:
        set_setting("smtp_host", req.smtp_host)
    if req.smtp_port is not None:
        set_setting("smtp_port", req.smtp_port)
    if req.smtp_user is not None:
        set_setting("smtp_user", req.smtp_user)
    if req.smtp_password is not None:
        # Don't overwrite with masked value
        if not req.smtp_password.startswith("****"):
            set_setting("smtp_password", req.smtp_password)
    if req.smtp_sender is not None:
        set_setting("smtp_sender", req.smtp_sender)
    if req.premium_price is not None:
        set_setting("premium_price", req.premium_price)
    if req.premium_price_yearly is not None:
        set_setting("premium_price_yearly", req.premium_price_yearly)
    if req.lpse_instances is not None:
        if isinstance(req.lpse_instances, str):
            set_setting("lpse_instances", req.lpse_instances)
        else:
            set_setting("lpse_instances", json.dumps(req.lpse_instances))
    if req.midtrans_server_key is not None:
        set_setting("midtrans_server_key", req.midtrans_server_key)
    if req.midtrans_client_key is not None:
        set_setting("midtrans_client_key", req.midtrans_client_key)
    if req.midtrans_is_production is not None:
        set_setting("midtrans_is_production", req.midtrans_is_production)
    if req.contact_whatsapp is not None:
        set_setting("contact_whatsapp", req.contact_whatsapp)
    if req.contact_email is not None:
        set_setting("contact_email", req.contact_email)
    if req.contact_maps_embed is not None:
        set_setting("contact_maps_embed", req.contact_maps_embed)
    if req.spse_proxy is not None:
        set_setting("spse_proxy", req.spse_proxy)
        
    return {"status": "success", "message": "Pengaturan berhasil diperbarui."}

@app.post("/api/admin/settings/test-smtp")
def test_smtp(req: SmtpTestRequest, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Akses ditolak.")
    
    password = req.smtp_password
    if password.startswith("****"):
        # Load from database
        password = get_setting("smtp_password", "")
        
    res = send_test_email(
        to_email=req.test_email,
        smtp_config={
            "host": req.smtp_host,
            "port": req.smtp_port,
            "user": req.smtp_user,
            "password": password,
            "sender": req.smtp_sender
        }
    )
    if res.get("success"):
        return {"status": "success", "message": res.get("message")}
    else:
        raise HTTPException(status_code=500, detail=res.get("message") or "Gagal mengirim email uji coba. Periksa log atau konfigurasi SMTP.")

@app.get("/api/admin/settings/smtp-status")
def get_smtp_status_route(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Akses ditolak.")
    return check_smtp_status()

@app.post("/api/admin/settings/smtp-status")
def check_smtp_status_route(req: SmtpStatusRequest, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Akses ditolak.")
    
    password = req.smtp_password
    if password == "********" or not password:
        password = get_setting("smtp_password", "")

    smtp_config = {
        "host": req.smtp_host,
        "port": req.smtp_port or "587",
        "user": req.smtp_user,
        "password": password,
        "sender": req.smtp_sender
    }
    return check_smtp_status(smtp_config)

@app.post("/api/admin/settings/test-whatsapp")
def test_whatsapp(req: WhatsappTestRequest, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Akses ditolak.")
    res = send_test_whatsapp(req.to_whatsapp, req.whatsapp_api_token)
    if res.get("success"):
        return {"status": "success", "message": res.get("message")}
    else:
        raise HTTPException(status_code=400, detail=res.get("message"))

@app.get("/api/admin/settings/whatsapp-status")
def get_whatsapp_status_route(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Akses ditolak.")
    return check_whatsapp_status()

@app.post("/api/admin/settings/whatsapp-status")
def check_whatsapp_status_route(req: WhatsappStatusRequest, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Akses ditolak.")
    return check_whatsapp_status(req.whatsapp_api_token)

@app.post("/api/admin/settings/test-proxy")
def test_proxy(req: ProxyTestRequest, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Akses ditolak.")
    
    proxy_url = req.proxy_url.strip()
    if not proxy_url:
        raise HTTPException(status_code=400, detail="Alamat Proxy tidak boleh kosong.")
        
    try:
        proxies = {
            "http": proxy_url,
            "https": proxy_url
        }
        # Attempt request to SPSE Portal via proxy
        response = requests.get("https://spse.inaproc.id/nasional/lelang", proxies=proxies, timeout=12)
        if response.status_code in [200, 301, 302, 403]:
            return {"status": "success", "message": f"Koneksi Proxy Berhasil! Respon server SPSE: HTTP {response.status_code}"}
        else:
            return {"status": "success", "message": f"Proxy terhubung, HTTP Status: {response.status_code}"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Koneksi Proxy Gagal: {str(e)}")

@app.post("/api/admin/settings/maintenance")
def set_maintenance_mode(req: MaintenanceToggleReq, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Akses ditolak.")
    set_setting("maintenance_mode", "true" if req.maintenance_mode else "false")
    if req.maintenance_message is not None:
        set_setting("maintenance_message", req.maintenance_message)
    return {
        "status": "success",
        "maintenance_mode": req.maintenance_mode,
        "message": f"Maintenance mode berhasil {'diaktifkan' if req.maintenance_mode else 'dinonaktifkan'}."
    }

def run_force_scrape_background():
    try:
        from backend.scheduler import run_daily_scraping
        run_daily_scraping()
    except Exception as e:
        logging.error(f"Error executing forced scraping job: {e}")

@app.post("/api/admin/scheduler/force-run")
def force_run_scheduler(background_tasks: BackgroundTasks, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Akses ditolak.")
    state = get_setting("scheduler_state", "idle")
    if state == "running":
        return {"status": "running", "message": "Scraper otomatis saat ini sedang berjalan!"}
    
    background_tasks.add_task(run_force_scrape_background)
    return {"status": "started", "message": "Proses scrape otomatis berhasil dipicu di latar belakang."}

@app.get("/api/admin/server-monitoring")
def get_server_monitoring(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Akses ditolak.")
    
    cpu_percent = psutil.cpu_percent(interval=None)
    ram = psutil.virtual_memory()
    disk = psutil.disk_usage("/")
    
    db_status = "connected"
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT 1")
        conn.close()
    except Exception as e:
        db_status = f"error: {str(e)}"
        
    uptime_seconds = int(time.time() - SERVER_START_TIME)
    
    scheduler_state = get_setting("scheduler_state", "idle")
    scheduler_last_run_at = get_setting("scheduler_last_run_at", None)
    scheduler_last_run_summary = get_setting("scheduler_last_run_summary", None)
    scheduler_next_run_at = get_setting("scheduler_next_run_at", None)
    
    log_feed = []
    log_file = Path("logs/crawl_errors.log")
    if log_file.exists():
        try:
            lines = log_file.read_text(encoding="utf-8", errors="ignore").strip().splitlines()
            log_feed = lines[-15:]
        except Exception:
            pass
            
    return {
        "cpu_percent": cpu_percent,
        "ram": {
            "percent": ram.percent,
            "used_mb": round(ram.used / (1024 * 1024), 2),
            "total_mb": round(ram.total / (1024 * 1024), 2)
        },
        "disk": {
            "percent": disk.percent,
            "used_gb": round(disk.used / (1024 * 1024 * 1024), 2),
            "total_gb": round(disk.total / (1024 * 1024 * 1024), 2)
        },
        "db_status": db_status,
        "uptime_seconds": uptime_seconds,
        "scheduler": {
            "state": scheduler_state,
            "last_run_at": scheduler_last_run_at,
            "last_run_summary": scheduler_last_run_summary,
            "next_run_at": scheduler_next_run_at
        },
        "log_feed": log_feed,
        "maintenance_mode": get_setting("maintenance_mode", "false") == "true",
        "maintenance_message": get_setting("maintenance_message", "Sistem sedang dalam pemeliharaan rutin. Silakan kembali beberapa saat lagi.")
    }

@app.get("/api/admin/crawl-logs")
def get_admin_crawl_logs(limit: int = 50, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Akses ditolak.")
    from backend.database import get_recent_crawl_logs
    logs = get_recent_crawl_logs(limit=limit)
    return {"logs": logs}


# TENDERS SEARCH & FILTERING
@app.get("/api/tenders")
def list_tenders(
    limit: int = 10,
    offset: int = 0,
    q: Optional[str] = None,
    instansi: Optional[str] = None,
    jenis_instansi: Optional[str] = None,
    kategori: Optional[str] = None,
    tipe: Optional[str] = None,
    jenis_pengadaan: Optional[str] = None,
    tahun: Optional[int] = None,
    pagu_min: Optional[float] = None,
    pagu_max: Optional[float] = None,
    tahap: Optional[str] = None,
    aktif_only: Optional[bool] = False
):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    where_clauses = []
    params = []
    
    if q:
        where_clauses.append("(nama_tender LIKE ? OR nomor_pengadaan LIKE ? OR instansi LIKE ?)")
        params.extend([f"%{q}%", f"%{q}%", f"%{q}%"])
    if instansi:
        where_clauses.append("instansi = ?")
        params.append(instansi)
    if jenis_instansi:
        raw_lpse = get_setting("lpse_instances", "[]")
        try:
            lpse_list = json.loads(raw_lpse)
        except Exception:
            lpse_list = []
            
        matching_slugs = [inst.get("slug") for inst in lpse_list if inst.get("jenis") == jenis_instansi and inst.get("slug") and inst.get("slug") != "nasional"]
        
        slug_condition = ""
        slug_params = []
        if matching_slugs:
            placeholders = ",".join(["?"] * len(matching_slugs))
            slug_condition = f"kategori IN ({placeholders})"
            slug_params = matching_slugs

        text_patterns = []
        j_low = jenis_instansi.lower().strip()
        if j_low == 'kementerian':
            text_patterns.append("instansi LIKE 'Kementerian%'")
        elif j_low == 'provinsi':
            text_patterns.append("(instansi LIKE 'Provinsi%' OR instansi LIKE 'Pemerintah Provinsi%' OR instansi LIKE 'Pemprov%')")
        elif j_low == 'kota':
            text_patterns.append("(instansi LIKE 'Kota %' OR instansi LIKE 'Pemerintah Kota%' OR instansi LIKE 'Pemkot%')")
        elif j_low in ['kabupaten', 'kab']:
            text_patterns.append("(instansi LIKE 'Kab.%' OR instansi LIKE 'Kabupaten%' OR instansi LIKE 'Pemerintah Kab%')")
        elif j_low in ['lembaga', 'badan']:
            text_patterns.append("(instansi LIKE 'Badan%' OR instansi LIKE 'Otorita%' OR instansi LIKE 'Sekretariat%' OR instansi LIKE 'Dewan%' OR instansi LIKE 'Komisi%' OR instansi LIKE 'Lembaga%' OR instansi LIKE 'Setjen%' OR instansi LIKE 'PDAM%' OR instansi LIKE 'LKPP%')")

        combined_conditions = []
        if slug_condition:
            combined_conditions.append(slug_condition)
            params.extend(slug_params)
        if text_patterns:
            combined_conditions.append(" OR ".join(text_patterns))

        if combined_conditions:
            where_clauses.append("(" + " OR ".join(combined_conditions) + ")")
        else:
            where_clauses.append("1=0")
    if kategori:
        where_clauses.append("kategori = ?")
        params.append(kategori)
    if tipe:
        where_clauses.append("(tipe = ? OR metode LIKE ?)")
        params.extend([tipe, f"%{tipe}%"])
    if jenis_pengadaan:
        where_clauses.append("jenis_pengadaan LIKE ?")
        params.append(f"%{jenis_pengadaan}%")
    if tahun:
        where_clauses.append("tahun = ?")
        params.append(tahun)
    if pagu_min is not None:
        where_clauses.append("pagu_val >= ?")
        params.append(pagu_min)
    if pagu_max is not None:
        where_clauses.append("pagu_val <= ?")
        params.append(pagu_max)
    if tahap:
        where_clauses.append("tahap LIKE ?")
        params.append(f"%{tahap}%")
        
    if aktif_only:
        where_clauses.append("""(
            (akhir_penawaran IS NULL OR akhir_penawaran = '' OR datetime(akhir_penawaran) >= datetime('now'))
            AND tahap NOT LIKE '%selesai%'
            AND tahap NOT LIKE '%gagal%'
            AND tahap NOT LIKE '%batal%'
        )""")
        
    where_sql = ""
    if where_clauses:
        where_sql = "WHERE " + " AND ".join(where_clauses)
        
    # Get total count
    count_query = f"SELECT COUNT(*) FROM tenders {where_sql}"
    cursor.execute(count_query, params)
    total = cursor.fetchone()[0]
    
    # Get data
    query = f"""
        SELECT nomor_pengadaan, nama_tender, instansi, tahap, pagu, pagu_val, kategori, tipe, metode, jenis_pengadaan, tahun, scraped_at, tanggal_mulai_tender, akhir_penawaran
        FROM tenders
        {where_sql}
        ORDER BY scraped_at DESC
        LIMIT ? OFFSET ?
    """
    cursor.execute(query, params + [limit, offset])
    rows = cursor.fetchall()
    
    # Get detail schedules for each tender
    tenders_list = []
    for row in rows:
        t_dict = dict(row)
        cursor.execute("SELECT jadwal, syarat_kualifikasi, uraian_singkat_pekerjaan, lokasi_pekerjaan FROM tender_details WHERE nomor_pengadaan = ?", (t_dict["nomor_pengadaan"],))
        detail = cursor.fetchone()
        if detail:
            t_dict["jadwal"] = detail["jadwal"]
            t_dict["syarat_kualifikasi"] = detail["syarat_kualifikasi"]
            t_dict["uraian_singkat_pekerjaan"] = detail["uraian_singkat_pekerjaan"]
            t_dict["lokasi_pekerjaan"] = detail["lokasi_pekerjaan"]
        else:
            t_dict["jadwal"] = None
            t_dict["syarat_kualifikasi"] = None
            t_dict["uraian_singkat_pekerjaan"] = None
            t_dict["lokasi_pekerjaan"] = None
        tenders_list.append(t_dict)
        
    conn.close()
    return {"total": total, "data": tenders_list}

@app.get("/api/tenders/{nomor}")
def get_tender_detail(nomor: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT nomor_pengadaan, nama_tender, instansi, tahap, pagu, pagu_val, kategori, tipe, tahun, scraped_at, tanggal_mulai_tender, akhir_penawaran
        FROM tenders WHERE nomor_pengadaan = ?
    """, (nomor,))
    tender_row = cursor.fetchone()
    if not tender_row:
        conn.close()
        raise HTTPException(status_code=404, detail="Tender tidak ditemukan")
        
    tender = dict(tender_row)
    
    cursor.execute("""
        SELECT syarat_kualifikasi, uraian_singkat_pekerjaan, satuan_kerja, jenis_kontrak, lokasi_pekerjaan, tanggal_pembuatan, alasan_diulang, jadwal
        FROM tender_details WHERE nomor_pengadaan = ?
    """, (nomor,))
    detail_row = cursor.fetchone()
    if detail_row:
        tender.update(dict(detail_row))
    else:
        tender.update({
            "syarat_kualifikasi": None,
            "uraian_singkat_pekerjaan": None,
            "satuan_kerja": None,
            "jenis_kontrak": None,
            "lokasi_pekerjaan": None,
            "tanggal_pembuatan": None,
            "alasan_diulang": None,
            "jadwal": None
        })
        
    cursor.execute("""
        SELECT nama_peserta, npwp, harga_penawaran, harga_terkoreksi
        FROM tender_participants WHERE nomor_pengadaan = ?
        ORDER BY harga_terkoreksi ASC, harga_penawaran ASC
    """, (nomor,))
    tender["peserta"] = [dict(r) for r in cursor.fetchall()]
    
    cursor.execute("""
        SELECT nama_pemenang, alamat, npwp, harga_kontrak, nilai_pdn, nilai_umk
        FROM tender_winners WHERE nomor_pengadaan = ?
    """, (nomor,))
    winner_row = cursor.fetchone()
    if winner_row:
        tender["pemenang"] = dict(winner_row)
    else:
        # Fallback 1: check competitor_evaluations for is_winner = 1
        cursor.execute("""
            SELECT nama_peserta AS nama_pemenang, '' AS alamat, npwp,
                   COALESCE(harga_terkoreksi, harga_penawaran, 0) AS harga_kontrak,
                   0 AS nilai_pdn, 0 AS nilai_umk
            FROM competitor_evaluations
            WHERE nomor_pengadaan = ? AND is_winner = 1
            LIMIT 1
        """, (nomor,))
        eval_winner = cursor.fetchone()
        if eval_winner:
            tender["pemenang"] = dict(eval_winner)
        else:
            # Fallback 2: On-demand live scrape winner from SPSE (/pemenangberkontrak then /pemenang)
            try:
                from spse.detail_getter import SPSEDetailGetter
                from spse.cookie_manager import SPSECookieManager
                try:
                    from backend.database import save_tender_winner
                except ImportError:
                    from database import save_tender_winner

                cm = SPSECookieManager()
                getter = SPSEDetailGetter(cm)
                live_winner = getter.get_contract_winner_data(nomor, tender.get("kategori", "nasional"))
                if live_winner:
                    save_tender_winner(nomor, live_winner)
                    tender["pemenang"] = live_winner
                else:
                    tender["pemenang"] = None
            except Exception as ex:
                logging.warning(f"On-demand live winner retrieval failed for tender {nomor}: {ex}")
                tender["pemenang"] = None
    
    conn.close()
    return tender

# ANALYTICS ENDPOINTS
@app.get("/api/analytics")
def get_analytics():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Total count and total pagu
    cursor.execute("SELECT COUNT(*), SUM(pagu_val) FROM tenders")
    row = cursor.fetchone()
    total_tenders = row[0] if row else 0
    total_pagu = row[1] if row else 0.0
    
    # Total unique agencies configured
    lpse_str = get_setting("lpse_instances", "[]")
    try:
        total_instansi = len(json.loads(lpse_str))
    except Exception:
        total_instansi = 0

    # Total unique providers/suppliers
    cursor.execute("""
        SELECT COUNT(DISTINCT name) FROM (
            SELECT nama_peserta AS name FROM tender_participants
            UNION
            SELECT nama_pemenang AS name FROM tender_winners
            UNION
            SELECT nama_peserta AS name FROM competitor_evaluations
        ) AS unique_providers
    """)
    total_penyedia = cursor.fetchone()[0] or 0
    
    # Top 5 tenders by pagu
    cursor.execute("SELECT nomor_pengadaan, nama_tender, pagu, pagu_val, instansi FROM tenders ORDER BY pagu_val DESC LIMIT 5")
    top_tenders = [dict(r) for r in cursor.fetchall()]
    
    # Top 5 LPSE instances by total pagu
    cursor.execute("SELECT instansi, SUM(pagu_val) as total_pagu, COUNT(*) as count FROM tenders GROUP BY instansi ORDER BY total_pagu DESC LIMIT 5")
    top_instansi = [dict(r) for r in cursor.fetchall()]
    
    # Tenders count by kategori (slug)
    cursor.execute("SELECT kategori, COUNT(*) as count, SUM(pagu_val) as pagu FROM tenders GROUP BY kategori")
    kategori_stats = [{"category": r["kategori"], "count": r["count"], "pagu": r["pagu"] or 0.0} for r in cursor.fetchall()]
    
    conn.close()
    return {
        "total_tenders": total_tenders,
        "total_pagu": total_pagu,
        "total_instansi": total_instansi,
        "total_penyedia": total_penyedia,
        "top_tenders": top_tenders,
        "top_instansi": top_instansi,
        "kategori_stats": kategori_stats
    }

# BOOKMARKS ENDPOINTS
@app.get("/api/bookmarks")
def list_bookmarks(current_user: dict = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT t.nomor_pengadaan, t.nama_tender, t.instansi, t.tahap, t.pagu, t.pagu_val, t.kategori, t.tipe, t.tahun, b.bookmarked_at
        FROM bookmarks b
        JOIN tenders t ON b.nomor_pengadaan = t.nomor_pengadaan
        WHERE b.user_id = ?
        ORDER BY b.bookmarked_at DESC
    """, (current_user["id"],))
    rows = cursor.fetchall()
    
    bookmarks_list = []
    for r in rows:
        b_dict = dict(r)
        # Fetch details
        cursor.execute("SELECT jadwal, syarat_kualifikasi, uraian_singkat_pekerjaan, lokasi_pekerjaan FROM tender_details WHERE nomor_pengadaan = ?", (b_dict["nomor_pengadaan"],))
        detail = cursor.fetchone()
        if detail:
            b_dict["jadwal"] = detail["jadwal"]
            b_dict["syarat_kualifikasi"] = detail["syarat_kualifikasi"]
            b_dict["uraian_singkat_pekerjaan"] = detail["uraian_singkat_pekerjaan"]
            b_dict["lokasi_pekerjaan"] = detail["lokasi_pekerjaan"]
        bookmarks_list.append(b_dict)
        
    conn.close()
    return bookmarks_list

@app.post("/api/bookmarks")
def add_bookmark(req: dict, current_user: dict = Depends(get_current_user)):
    nomor = req.get("nomor_pengadaan")
    if not nomor:
        raise HTTPException(status_code=400, detail="nomor_pengadaan wajib diisi")
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT OR IGNORE INTO bookmarks (user_id, nomor_pengadaan, bookmarked_at) VALUES (?, ?, ?)",
            (current_user["id"], nomor, datetime.now().isoformat())
        )
        conn.commit()
        return {"status": "success", "message": "Tender disimpan ke bookmark."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@app.delete("/api/bookmarks/{nomor}")
def remove_bookmark(nomor: str, current_user: dict = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM bookmarks WHERE user_id = ? AND nomor_pengadaan = ?", (current_user["id"], nomor))
    conn.commit()
    conn.close()
    return {"status": "success", "message": "Bookmark berhasil dihapus."}

# BILLING CHECKOUT & WEBHOKS
@app.post("/api/billing/checkout")
def billing_checkout(req: CheckoutRequest, current_user: dict = Depends(get_current_user)):
    import time
    from backend.midtrans_gateway import create_snap_transaction
    
    plan_type = req.plan_type
    duration = req.duration_days
    voucher_code = req.voucher_code
    
    # Calculate base price
    base_price = 0.0
    if plan_type == "premium":
        if duration == 365:
            base_price = float(get_setting("premium_price_yearly", "1500000"))
        else:
            base_price = float(get_setting("premium_price", "150000"))
            
    # Apply discount voucher if passed
    final_price = base_price
    discount_amount = 0.0
    if voucher_code:
        v = get_voucher(voucher_code)
        if not v or v["is_active"] != 1:
            raise HTTPException(status_code=400, detail="Voucher tidak valid atau tidak aktif")
        if v["expires_at"]:
            is_expired = False
            try:
                exp_date = datetime.strptime(v["expires_at"], "%Y-%m-%d")
                if exp_date.date() < datetime.now().date():
                    is_expired = True
            except ValueError:
                pass
            if is_expired:
                raise HTTPException(status_code=400, detail="Voucher sudah kedaluwarsa")
        if v["used_count"] >= v["max_uses"]:
            raise HTTPException(status_code=400, detail="Kuota voucher sudah habis")
            
        if v["discount_type"] == "percent":
            discount_amount = base_price * (v["discount_value"] / 100.0)
        else:
            discount_amount = v["discount_value"]
            
        discount_amount = min(discount_amount, base_price)
        final_price = base_price - discount_amount
        increment_voucher_usage(voucher_code)
        
    import time
    import random
    order_id = f"ORDER-{current_user['id']}-{int(time.time())}-{random.randint(10000, 99999)}"
    
    # Save transaction in database
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        
        # If 100% free discount, upgrade immediately
        if final_price <= 0:
            cursor.execute("""
                INSERT INTO transactions (order_id, user_id, plan_type, amount, status, duration_days, snap_token, created_at, updated_at)
                VALUES (?, ?, ?, ?, 'settlement', ?, 'free-voucher-upgrade', ?, ?)
            """, (order_id, current_user["id"], plan_type, 0.0, duration, datetime.now().isoformat(), datetime.now().isoformat()))
            conn.commit()
            
            # Directly upgrade subscription
            update_user_subscription(current_user["id"], plan_type=plan_type, status="active", duration_days=duration)
            return {
                "status": "success",
                "message": "Anda berhasil menggunakan diskon penuh. Akun Anda telah langsung di-upgrade!",
                "order_id": order_id,
                "snap_token": "free-voucher-upgrade"
            }
            
        # Generate Midtrans Snap token
        snap_res = create_snap_transaction(order_id, final_price, current_user["email"])
        if not snap_res["success"]:
            raise HTTPException(status_code=500, detail="Gagal terhubung dengan gerbang pembayaran Midtrans.")
            
        snap_token = snap_res["token"]
        cursor.execute("""
            INSERT INTO transactions (order_id, user_id, plan_type, amount, status, duration_days, snap_token, created_at, updated_at)
            VALUES (?, ?, ?, ?, 'pending', ?, ?, ?, ?)
        """, (order_id, current_user["id"], plan_type, final_price, duration, snap_token, datetime.now().isoformat(), datetime.now().isoformat()))
        conn.commit()
    finally:
        conn.close()
    
    return {
        "status": "success",
        "order_id": order_id,
        "snap_token": snap_token,
        "redirect_url": snap_res["redirect_url"]
    }


@app.post("/api/billing/verify-payment")
def verify_payment(req: VerifyPaymentRequest, current_user: dict = Depends(get_current_user)):
    from backend.midtrans_gateway import check_transaction_status
    
    order_id = req.order_id
    tx = get_transaction(order_id)
    if not tx:
        raise HTTPException(status_code=404, detail="Transaksi tidak ditemukan")
        
    # Security check: Ensure this transaction belongs to the current logged-in user
    if tx["user_id"] != current_user["id"]:
        raise HTTPException(status_code=403, detail="Akses ditolak untuk transaksi ini.")
        
    # If transaction is already settled, ignore
    if tx["status"] == "settlement":
        return {
            "status": "success",
            "transaction_status": "settlement",
            "message": "Pembayaran berhasil diverifikasi!"
        }
        
    # Check status directly from Midtrans API
    midtrans_res = check_transaction_status(order_id)
    
    if not midtrans_res["success"]:
        raise HTTPException(status_code=400, detail=midtrans_res["message"])
        
    status = midtrans_res["status"]
    status_code = midtrans_res["status_code"]
    
    # Update transaction status and upgrade subscription if appropriate
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        if status in ("settlement", "capture") or status_code == "200":
            # Upgrade subscription
            cursor.execute("UPDATE transactions SET status='settlement', updated_at=? WHERE order_id=?", (datetime.now().isoformat(), order_id))
            conn.commit()
            update_user_subscription(tx["user_id"], plan_type=tx["plan_type"], status="active", duration_days=tx["duration_days"])
            return {"status": "success", "transaction_status": "settlement", "message": "Pembayaran berhasil diverifikasi!"}
        else:
            cursor.execute("UPDATE transactions SET status=?, updated_at=? WHERE order_id=?", (status, datetime.now().isoformat(), order_id))
            conn.commit()
            return {"status": "success", "transaction_status": status, "message": f"Status transaksi saat ini: {status}"}
    finally:
        conn.close()


@app.post("/api/payment/notification")
def payment_webhook(req: MidtransWebhookReq):
    order_id = req.order_id
    status_code = req.status_code
    status = req.transaction_status.lower()
    
    tx = get_transaction(order_id)
    if not tx:
        raise HTTPException(status_code=404, detail="Transaksi tidak ditemukan")
        
    # If transaction is already settled, ignore
    if tx["status"] == "settlement":
        return {"status": "success", "message": "Already processed"}
        
    conn = get_db_connection()
    cursor = conn.cursor()
    
    if status == "settlement" or status == "capture" or status_code == "200":
        cursor.execute("UPDATE transactions SET status='settlement', updated_at=? WHERE order_id=?", (datetime.now().isoformat(), order_id))
        conn.commit()
        # Upgrade subscription
        update_user_subscription(tx["user_id"], plan_type=tx["plan_type"], status="active", duration_days=tx["duration_days"])
    else:
        cursor.execute("UPDATE transactions SET status=?, updated_at=? WHERE order_id=?", (status, datetime.now().isoformat(), order_id))
        conn.commit()
        
    conn.close()
    return {"status": "success"}

@app.get("/api/admin/settings/midtrans-status")
def get_midtrans_status_route(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Akses ditolak.")
    from backend.midtrans_gateway import check_midtrans_status
    return check_midtrans_status()

@app.post("/api/admin/settings/midtrans-status")
def check_midtrans_status_route(req: MidtransStatusRequest, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Akses ditolak.")
    from backend.midtrans_gateway import check_midtrans_status
    is_prod = (req.midtrans_is_production.lower() == "true") if req.midtrans_is_production else None
    return check_midtrans_status(req.midtrans_server_key, req.midtrans_client_key, is_prod)

@app.get("/api/billing/history")
def get_user_billing_history(current_user: dict = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT order_id, plan_type, amount, status, duration_days, snap_token, created_at, updated_at
        FROM transactions
        WHERE user_id = ?
        ORDER BY id DESC
    """, (current_user["id"],))
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.get("/api/admin/transactions")
def get_admin_transactions_list(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Akses ditolak.")
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT t.id, t.order_id, t.user_id, u.email as user_email, u.whatsapp as user_whatsapp,
               t.plan_type, t.amount, t.status, t.duration_days, t.snap_token, t.created_at, t.updated_at
        FROM transactions t
        LEFT JOIN users u ON t.user_id = u.id
        ORDER BY t.id DESC
    """)
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

# VOUCHERS MANAGEMENT (ADMIN)
@app.get("/api/admin/vouchers")
def list_vouchers(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Akses ditolak.")
    return get_all_vouchers()

@app.post("/api/admin/vouchers")
def add_voucher(req: VoucherCreateReq, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Akses ditolak.")
    try:
        code = create_voucher(req.code, req.discount_type, req.discount_value, req.max_uses, req.expires_at)
        return {"status": "success", "code": code}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Gagal membuat voucher: {str(e)}")

@app.delete("/api/admin/vouchers/{code}")
def remove_voucher(code: str, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Akses ditolak.")
    delete_voucher(code)
    return {"status": "success", "message": "Voucher berhasil dihapus."}

@app.post("/api/billing/voucher/validate")
def validate_voucher(req: VoucherValidateReq):
    v = get_voucher(req.code)
    if not v:
        raise HTTPException(status_code=404, detail="Kode voucher tidak ditemukan.")
    if v["is_active"] != 1:
        raise HTTPException(status_code=400, detail="Voucher ini sudah tidak aktif.")
    if v["expires_at"]:
        is_expired = False
        try:
            exp_date = datetime.strptime(v["expires_at"], "%Y-%m-%d")
            if exp_date.date() < datetime.now().date():
                is_expired = True
        except ValueError:
            pass
        if is_expired:
            raise HTTPException(status_code=400, detail="Voucher ini sudah kedaluwarsa.")
    if v["used_count"] >= v["max_uses"]:
        raise HTTPException(status_code=400, detail="Kuota penukaran voucher sudah habis.")
        
    # Calculate base price based on duration
    base_price = 0.0
    if req.duration_days == 365:
        base_price = float(get_setting("premium_price_yearly", "1500000"))
    else:
        base_price = float(get_setting("premium_price", "150000"))
        
    # Calculate discount
    discount_amount = 0.0
    if v["discount_type"] == "percent":
        discount_amount = base_price * (v["discount_value"] / 100.0)
    else:
        discount_amount = v["discount_value"]
        
    discount_amount = min(discount_amount, base_price)
    final_price = base_price - discount_amount
    
    return {
        "valid": True,
        "code": v["code"],
        "discount_type": v["discount_type"],
        "discount_value": v["discount_value"],
        "discount_amount": discount_amount,
        "final_price": final_price,
        "base_price": base_price
    }

# ALERTS ENDPOINTS
@app.get("/api/alerts")
def list_alerts(current_user: dict = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM alerts WHERE user_id = ?", (current_user["id"],))
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

def process_new_alert_background(alert_id: int, user_id: int, keyword: str, instansi: str, email: str, whatsapp: str = None):
    """
    Background worker triggered when a new alert is registered:
    1. Queries existing tenders matching keyword & instansi in local database.
    2. Filters for ACTIVE tenders (before 'Tender Sudah Selesai' stage).
    3. Dispatches Email and WhatsApp notifications with a 5-second delay between each.
    4. Triggers background crawling for fresh tenders.
    """
    import time
    from backend.email_notifier import send_email_alert
    from backend.whatsapp_notifier import send_whatsapp_alert
    from backend.crawl_coordinator import run_crawl, is_tender_active

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        raw_kw = keyword.strip().lower()
        sub_keywords = [k.strip() for k in raw_kw.split(',') if k.strip()]
        if not sub_keywords:
            sub_keywords = [raw_kw]

        inst_lower = instansi.lower()

        # Build SQL OR condition for all sub-keywords
        kw_sub_clauses = ["LOWER(nama_tender) LIKE ?" for _ in sub_keywords]
        kw_sql = "(" + " OR ".join(kw_sub_clauses) + ")"
        params = [f"%{k}%" for k in sub_keywords]

        if inst_lower != "all":
            where_sql = f"{kw_sql} AND LOWER(kategori) = ?"
            params.append(inst_lower)
        else:
            where_sql = kw_sql

        cursor.execute(f"""
            SELECT nomor_pengadaan, nama_tender, instansi, tahap, pagu, pagu_val, kategori, tipe, tahun, scraped_at
            FROM tenders
            WHERE {where_sql}
            ORDER BY scraped_at DESC
        """, params)

        rows = cursor.fetchall()
        now_str = datetime.now().isoformat()

        # Resolve target whatsapp number
        target_wa = whatsapp
        if not target_wa:
            cursor.execute("SELECT whatsapp FROM users WHERE id = ?", (user_id,))
            user_row = cursor.fetchone()
            if user_row and user_row["whatsapp"]:
                target_wa = user_row["whatsapp"]

        for row in rows:
            tender = dict(row)
            nomor_pengadaan = tender["nomor_pengadaan"]
            tahap = tender.get("tahap", "")

            # 1. Filter ACTIVE tenders only (before "Tender Sudah Selesai")
            if not is_tender_active(tahap):
                continue

            # 2. Prevent duplicate notifications
            cursor.execute("SELECT id FROM sent_alerts WHERE alert_id = ? AND nomor_pengadaan = ?", (alert_id, nomor_pengadaan))
            if cursor.fetchone():
                continue

            title_lower = tender["nama_tender"].lower()
            matched_kw = next((k for k in sub_keywords if k in title_lower), sub_keywords[0])

            email_sent = send_email_alert(email, matched_kw, tender)
            wa_sent = False
            if target_wa and target_wa.strip():
                wa_sent = send_whatsapp_alert(target_wa.strip(), matched_kw, tender)

            if email_sent or wa_sent:
                try:
                    cursor.execute("INSERT OR IGNORE INTO sent_alerts (alert_id, nomor_pengadaan, sent_at) VALUES (?, ?, ?)", (alert_id, nomor_pengadaan, now_str))
                    conn.commit()
                except Exception as e:
                    logging.error(f"Error recording sent alert: {e}")

            # 3. 5-second notification delay throttle to prevent spam detection
            time.sleep(5)

        conn.close()

        # 4. Trigger live crawling for each sub-keyword individually
        for sub_kw in sub_keywords:
            if inst_lower == "all":
                run_crawl(tipe="tender", category="nasional", tahun=datetime.now().year, length=10, search=sub_kw)
            else:
                run_crawl(tipe="tender", category=inst_lower, tahun=datetime.now().year, length=10, search=sub_kw)

    except Exception as ex:
        logging.error(f"Error in process_new_alert_background for alert_id {alert_id}: {ex}")

# ALERTS ENDPOINTS
@app.get("/api/alerts")
def list_alerts(current_user: dict = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM alerts WHERE user_id = ?", (current_user["id"],))
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.post("/api/alerts")
def create_user_alert(req: AlertCreate, background_tasks: BackgroundTasks, current_user: dict = Depends(get_current_user)):
    # Check limit for trial users
    sub = get_user_subscription(current_user["id"])
    plan = sub["plan_type"] if sub else "trial"
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Get active alert count
    cursor.execute("SELECT COUNT(*) FROM alerts WHERE user_id = ?", (current_user["id"],))
    alert_count = cursor.fetchone()[0]
    
    if plan == "trial" and alert_count >= 3:
        conn.close()
        raise HTTPException(status_code=400, detail="Batas maksimum alerts untuk akun Trial adalah 3 K/L/Pemda/Instansi.")
        
    target_wa = req.whatsapp.strip() if (req.whatsapp and req.whatsapp.strip()) else None
    clean_target_wa = "".join(filter(str.isdigit, target_wa)) if target_wa else None

    is_new_number = False
    whatsapp_registered = False
    activation_url = None
    app_name = get_setting("app_name", "Spy SPSE")

    if clean_target_wa:
        # Check if clean_target_wa already exists in alerts table
        cursor.execute("""
            SELECT COUNT(*) FROM alerts 
            WHERE whatsapp IS NOT NULL AND REPLACE(REPLACE(REPLACE(whatsapp, '+', ''), '-', ''), ' ', '') LIKE ?
        """, (f"%{clean_target_wa[-10:]}",))
        existing_count = cursor.fetchone()[0]
        if existing_count == 0:
            is_new_number = True
            from backend.whatsapp_notifier import validate_whatsapp_number, get_whatsapp_activation_link
            val_res = validate_whatsapp_number(target_wa)
            whatsapp_registered = val_res.get("registered", True)
            activation_url = get_whatsapp_activation_link(user_wa=target_wa)

    now_str = datetime.now().isoformat()
    cursor.execute("""
        INSERT INTO alerts (user_id, keyword, email, whatsapp, instansi, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (current_user["id"], req.keyword.strip(), req.email.strip(), target_wa, req.instansi.strip(), now_str))
    conn.commit()
    alert_id = cursor.lastrowid
    conn.close()

    # Launch background task: match existing active tenders with 5s delay & trigger live crawl
    background_tasks.add_task(
        process_new_alert_background,
        alert_id=alert_id,
        user_id=current_user["id"],
        keyword=req.keyword.strip(),
        instansi=req.instansi.strip(),
        email=req.email.strip(),
        whatsapp=target_wa
    )

    return {
        "status": "success", 
        "message": "Pemantauan alert berhasil didaftarkan.",
        "alert_id": alert_id,
        "is_new_number": is_new_number,
        "whatsapp": target_wa,
        "whatsapp_registered": whatsapp_registered,
        "app_name": app_name,
        "activation_url": activation_url
    }


@app.delete("/api/alerts/{alert_id}")
def delete_user_alert(alert_id: int, current_user: dict = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM alerts WHERE id = ? AND user_id = ?", (alert_id, current_user["id"]))
    conn.commit()
    conn.close()
    return {"status": "success", "message": "Alert berhasil dihapus."}


@app.put("/api/alerts/{alert_id}/whatsapp")
def update_alert_whatsapp(alert_id: int, req: AlertUpdateWhatsapp, current_user: dict = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM alerts WHERE id = ? AND user_id = ?", (alert_id, current_user["id"]))
    row = cursor.fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Pemantauan tidak ditemukan")
        
    target_wa = req.whatsapp.strip() if (req.whatsapp and req.whatsapp.strip()) else None
    cursor.execute("UPDATE alerts SET whatsapp = ? WHERE id = ?", (target_wa, alert_id))
    conn.commit()
    conn.close()
    
    from backend.whatsapp_notifier import validate_whatsapp_number, get_whatsapp_activation_link
    app_name = get_setting("app_name", "Spy SPSE")
    val_res = validate_whatsapp_number(target_wa) if target_wa else {"registered": False}
    activation_url = get_whatsapp_activation_link(user_wa=target_wa) if target_wa else None
    
    return {
        "status": "success",
        "message": "Nomor WhatsApp pemantauan berhasil diperbarui.",
        "alert_id": alert_id,
        "whatsapp": target_wa,
        "whatsapp_registered": val_res.get("registered", False),
        "app_name": app_name,
        "activation_url": activation_url
    }

# SYSTEM LOGS (ADMIN)
@app.get("/api/admin/logs")
def get_logs(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Akses ditolak.")
    log_path = Path("logs/crawl_errors.log")
    if not log_path.exists():
        return {"logs": ""}
    try:
        with open(log_path, "r", encoding="utf-8") as f:
            return {"logs": f.read()}
    except Exception as e:
        return {"logs": f"Error reading logs: {str(e)}"}

# ADMIN DASHBOARD STATS
@app.get("/api/admin/dashboard")
def get_admin_dashboard(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Akses ditolak.")
        
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Total users
    cursor.execute("SELECT COUNT(*) FROM users")
    total_users = cursor.fetchone()[0] or 0
    
    # Active premium users
    cursor.execute("""
        SELECT COUNT(*) FROM subscriptions s
        JOIN users u ON s.user_id = u.id
        WHERE s.plan_type = 'premium' AND s.status = 'active' AND (s.end_date IS NULL OR datetime(s.end_date) >= datetime('now'))
    """)
    active_premium = cursor.fetchone()[0] or 0
    
    # Active trial users
    cursor.execute("""
        SELECT COUNT(*) FROM subscriptions s
        JOIN users u ON s.user_id = u.id
        WHERE s.plan_type = 'trial' AND s.status = 'active' AND (s.end_date IS NULL OR datetime(s.end_date) >= datetime('now'))
    """)
    active_trial = cursor.fetchone()[0] or 0
    
    # Expired users
    cursor.execute("""
        SELECT COUNT(*) FROM subscriptions s
        JOIN users u ON s.user_id = u.id
        WHERE datetime(s.end_date) < datetime('now') OR s.status != 'active'
    """)
    expired_users = cursor.fetchone()[0] or 0
    
    # Total revenue from Midtrans transactions (settlement status)
    cursor.execute("SELECT SUM(amount) FROM transactions WHERE status = 'settlement'")
    total_revenue = cursor.fetchone()[0] or 0.0
    
    # Total successful transactions
    cursor.execute("SELECT COUNT(*) FROM transactions WHERE status = 'settlement'")
    total_transactions = cursor.fetchone()[0] or 0
    
    # Revenue from monthly package (duration_days = 30)
    cursor.execute("SELECT SUM(amount) FROM transactions WHERE status = 'settlement' AND duration_days = 30")
    revenue_monthly = cursor.fetchone()[0] or 0.0
    
    # Revenue from yearly package (duration_days = 365)
    cursor.execute("SELECT SUM(amount) FROM transactions WHERE status = 'settlement' AND duration_days = 365")
    revenue_yearly = cursor.fetchone()[0] or 0.0
    
    # 10 recent users with active packages
    cursor.execute("""
        SELECT u.id, u.email, u.role, u.whatsapp, u.created_at, s.plan_type, s.status, s.end_date
        FROM users u
        LEFT JOIN subscriptions s ON u.id = s.user_id
        ORDER BY u.created_at DESC
        LIMIT 10
    """)
    recent_users = [dict(r) for r in cursor.fetchall()]
    
    conn.close()
    return {
        "total_users": total_users,
        "active_premium": active_premium,
        "active_trial": active_trial,
        "expired_users": expired_users,
        "total_revenue": total_revenue,
        "total_transactions": total_transactions,
        "revenue_monthly": revenue_monthly,
        "revenue_yearly": revenue_yearly,
        "recent_users": recent_users
    }

# USER & SUBSCRIPTION MANAGEMENT (ADMIN)
@app.get("/api/admin/users")
def get_admin_users(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Akses ditolak.")
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT u.id, u.email, u.role, u.whatsapp, u.created_at, s.plan_type, s.status, s.end_date
        FROM users u
        LEFT JOIN subscriptions s ON u.id = s.user_id
        ORDER BY u.created_at DESC
    """)
    users = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return users

@app.post("/api/admin/users/{user_id}/subscription")
def edit_user_subscription_admin(user_id: int, req: dict, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Akses ditolak.")
    plan = req.get("plan_type", "premium")
    duration = req.get("duration_days", 30)
    update_user_subscription(user_id, plan_type=plan, status="active", duration_days=duration)
    return {"status": "success", "message": "Subscription updated successfully"}

@app.delete("/api/admin/users/{user_id}")
def delete_user_admin(user_id: int, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Akses ditolak.")
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM users WHERE id = ?", (user_id,))
    conn.commit()
    conn.close()
    return {"status": "success", "message": "User deleted successfully"}

@app.post("/api/admin/users")
def create_user_admin(req: dict, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Akses ditolak.")
    
    email = req.get("email", "").strip()
    password = req.get("password", "")
    role = req.get("role", "user")
    whatsapp = req.get("whatsapp", "").strip()
    plan_type = req.get("plan_type", "trial")
    duration_days = req.get("duration_days", 30)
    
    if not email or "@" not in email:
        raise HTTPException(status_code=400, detail="Alamat email tidak valid.")
    if not password or len(password) < 6:
        raise HTTPException(status_code=400, detail="Password minimal 6 karakter.")
    if role not in ["user", "admin"]:
        raise HTTPException(status_code=400, detail="Role harus 'user' atau 'admin'.")
        
    user_exist = get_user_by_email(email)
    if user_exist:
        raise HTTPException(status_code=400, detail=f"Email '{email}' sudah terdaftar.")
        
    hashed = hash_password(password)
    now_str = datetime.now().isoformat()
    
    conn = get_db_connection()
    cursor = conn.cursor()
    is_pg = hasattr(conn, '_pool')
    
    try:
        if is_pg:
            cursor.execute("""
                INSERT INTO users (email, password_hash, whatsapp, role, created_at)
                VALUES (?, ?, ?, ?, ?) RETURNING id
            """, (email, hashed, whatsapp, role, now_str))
            new_user_id = cursor.fetchone()[0]
        else:
            cursor.execute("""
                INSERT INTO users (email, password_hash, whatsapp, role, created_at)
                VALUES (?, ?, ?, ?, ?)
            """, (email, hashed, whatsapp, role, now_str))
            new_user_id = cursor.lastrowid
            
        conn.commit()
        conn.close()
        
        # Set subscription
        update_user_subscription(new_user_id, plan_type=plan_type, status="active", duration_days=duration_days)
        
        return {"status": "success", "message": f"User '{email}' berhasil dibuat dengan role '{role}'!", "user_id": new_user_id}
    except Exception as e:
        conn.rollback()
        conn.close()
        raise HTTPException(status_code=500, detail=f"Gagal membuat user: {str(e)}")

@app.post("/api/admin/users/{user_id}/role")
def change_user_role_admin(user_id: int, req: dict, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Akses ditolak.")
        
    new_role = req.get("role")
    if new_role not in ["user", "admin"]:
        raise HTTPException(status_code=400, detail="Role harus 'user' atau 'admin'.")
        
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE users SET role = ? WHERE id = ?", (new_role, user_id))
    conn.commit()
    conn.close()
    return {"status": "success", "message": f"Role berhasil diperbarui menjadi '{new_role}'."}

@app.post("/api/admin/users/{user_id}/notify-wa")
def notify_user_wa_credentials(user_id: int, req: dict = None, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Akses ditolak.")
        
    target_user = get_user_by_id(user_id)
    if not target_user:
        raise HTTPException(status_code=404, detail="User tidak ditemukan.")
        
    wa_num = target_user.get("whatsapp") or (req.get("whatsapp") if req else None)
    if not wa_num:
        raise HTTPException(status_code=400, detail="Nomor WhatsApp user belum terisi.")
        
    password_text = req.get("password") if req else None
    
    from backend.whatsapp_notifier import send_credentials_whatsapp
    res = send_credentials_whatsapp(to_number=wa_num, email=target_user["email"], password=password_text, role=target_user.get("role", "user"))
    return res

@app.post("/api/admin/users/{user_id}/notify-email")
def notify_user_email_credentials(user_id: int, req: dict = None, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Akses ditolak.")
        
    target_user = get_user_by_id(user_id)
    if not target_user:
        raise HTTPException(status_code=404, detail="User tidak ditemukan.")
        
    password_text = req.get("password") if req else None
    
    from backend.email_notifier import send_credentials_email
    res = send_credentials_email(to_email=target_user["email"], password=password_text, role=target_user.get("role", "user"))
    return res

@app.post("/api/admin/users/{user_id}/password")
def change_user_password_admin(user_id: int, req: dict, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Akses ditolak.")
    new_password = req.get("password")
    if not new_password or len(new_password) < 6:
        raise HTTPException(status_code=400, detail="Password minimal 6 karakter.")
    hashed = hash_password(new_password)
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE users SET password_hash = ? WHERE id = ?", (hashed, user_id))
    conn.commit()
    conn.close()
    return {"status": "success", "message": "Password updated successfully"}

# USER KEYWORD ALERTS
@app.get("/api/user/tenders/keywords")
def list_user_keyword_tenders(
    limit: int = 10,
    offset: int = 0,
    only_active: bool = False,
    current_user: dict = Depends(get_current_user)
):
    from backend.crawl_coordinator import is_tender_active

    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Get all keyword alerts for current user
    cursor.execute("SELECT keyword, instansi FROM alerts WHERE user_id = ?", (current_user["id"],))
    alerts = cursor.fetchall()
    
    if not alerts:
        conn.close()
        return {"total": 0, "data": []}
        
    # Construct keyword SQL queries supporting comma-separated sub-keywords
    clauses = []
    params = []
    for alert in alerts:
        raw_kw = alert["keyword"].strip().lower()
        sub_keywords = [k.strip() for k in raw_kw.split(',') if k.strip()]
        if not sub_keywords:
            sub_keywords = [raw_kw]

        inst = alert["instansi"].strip().lower()
        
        kw_sub_clauses = ["LOWER(nama_tender) LIKE ?" for _ in sub_keywords]
        kw_clause = "(" + " OR ".join(kw_sub_clauses) + ")"
        for sub_k in sub_keywords:
            params.append(f"%{sub_k}%")
        
        if inst != "all":
            clauses.append(f"({kw_clause} AND LOWER(kategori) = ?)")
            params.append(inst)
        else:
            clauses.append(kw_clause)
            
    where_sql = "WHERE (" + " OR ".join(clauses) + ")"
    if only_active:
        where_sql += " AND (LOWER(tahap) NOT LIKE '%selesai%' AND LOWER(tahap) NOT LIKE '%batal%' AND LOWER(tahap) NOT LIKE '%gagal%')"
    
    # Get total count
    cursor.execute(f"SELECT COUNT(*) FROM tenders {where_sql}", params)
    total = cursor.fetchone()[0] or 0
    
    # Get data
    query = f"""
        SELECT nomor_pengadaan, nama_tender, instansi, tahap, pagu, pagu_val, kategori, tipe, tahun, scraped_at, tanggal_mulai_tender, akhir_penawaran
        FROM tenders
        {where_sql}
        ORDER BY scraped_at DESC
        LIMIT ? OFFSET ?
    """
    cursor.execute(query, params + [limit, offset])
    rows = cursor.fetchall()
    
    tenders_list = []
    for row in rows:
        t_dict = dict(row)
        t_dict["is_active"] = is_tender_active(t_dict.get("tahap", ""))
        cursor.execute("SELECT jadwal, syarat_kualifikasi, uraian_singkat_pekerjaan, lokasi_pekerjaan FROM tender_details WHERE nomor_pengadaan = ?", (t_dict["nomor_pengadaan"],))
        detail = cursor.fetchone()
        if detail:
            t_dict["jadwal"] = detail["jadwal"]
            t_dict["syarat_kualifikasi"] = detail["syarat_kualifikasi"]
            t_dict["uraian_singkat_pekerjaan"] = detail["uraian_singkat_pekerjaan"]
            t_dict["lokasi_pekerjaan"] = detail["lokasi_pekerjaan"]
        tenders_list.append(t_dict)
        
    conn.close()
    return {"total": total, "data": tenders_list}

# SCRAPER TRIGGER (ADMIN)
@app.post("/api/crawl")
def trigger_crawl(req: CrawlRequest, background_tasks: BackgroundTasks, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Akses ditolak.")
        
    def run_sequential_crawl(tipe, category, tahun, limit, start, search):
        if category == "all":
            lpse_str = get_setting("lpse_instances", "[]")
            try:
                targets = [l["slug"] for l in json.loads(lpse_str)]
            except Exception:
                targets = ["nasional"]
        else:
            targets = [category]
            
        import time
        for t in targets:
            try:
                run_crawl(tipe=tipe, category=t, tahun=tahun, start=start, length=limit, search=search)
                if len(targets) > 1:
                    time.sleep(5.0)
            except Exception as e:
                logging.error(f"Sequential crawl error for {t}: {e}")
                
    background_tasks.add_task(run_sequential_crawl, req.tipe, req.category, req.tahun, req.limit, req.start, req.search)
    
    instansi_label = "seluruh instansi" if req.category == "all" else req.category
    return {"status": "success", "message": f"Proses scraping untuk {instansi_label} berhasil dimasukkan ke antrean."}

# BOOKMARKS Realtime sync (ADMIN)
@app.post("/api/admin/sync-bookmarks")
def trigger_sync_bookmarks(background_tasks: BackgroundTasks, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Akses ditolak.")
    
    from backend.scheduler import sync_bookmarked_tenders
    import asyncio
    
    def run_sync_sync():
        asyncio.run(sync_bookmarked_tenders())
        
    background_tasks.add_task(run_sync_sync)
    return {"status": "success", "message": "Proses sinkronisasi bookmarks berhasil dijalankan di latar belakang"}

# COMPETITOR ANALYTICS
@app.get("/api/competitors/search")
def search_competitors(q: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT DISTINCT nama_peserta FROM competitor_evaluations WHERE nama_peserta LIKE ?
        UNION
        SELECT DISTINCT nama_pemenang FROM tender_winners WHERE nama_pemenang LIKE ?
        LIMIT 20
    """, (f"%{q}%", f"%{q}%"))
    results = [r[0] for r in cursor.fetchall()]
    conn.close()
    return results

@app.get("/api/competitors/profile")
def get_competitor_profile(name: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    name_clean = clean_str(name)
    # 1. Fetch NPWP (check competitor_evaluations, then tender_winners, then tender_participants)
    npwp = "-"
    cursor.execute("SELECT npwp FROM competitor_evaluations WHERE nama_peserta = ? AND npwp IS NOT NULL AND npwp != '' LIMIT 1", (name_clean,))
    row = cursor.fetchone()
    if row:
        npwp = row[0]
    else:
        cursor.execute("SELECT npwp FROM tender_winners WHERE nama_pemenang = ? AND npwp IS NOT NULL AND npwp != '' LIMIT 1", (name_clean,))
        row = cursor.fetchone()
        if row:
            npwp = row[0]
        else:
            cursor.execute("SELECT npwp FROM tender_participants WHERE nama_peserta = ? AND npwp IS NOT NULL AND npwp != '' LIMIT 1", (name_clean,))
            row = cursor.fetchone()
            if row:
                npwp = row[0]
                
    # 2. Fetch Address (check tender_winners)
    address = "-"
    cursor.execute("SELECT alamat FROM tender_winners WHERE nama_pemenang = ? AND alamat IS NOT NULL AND alamat != '' LIMIT 1", (name_clean,))
    row = cursor.fetchone()
    if row:
        address = row[0]
        
    # 3. Total tenders followed (submitted price or won)
    cursor.execute("SELECT COUNT(DISTINCT nomor_pengadaan) FROM competitor_evaluations WHERE nama_peserta = ? AND (harga_penawaran > 0 OR harga_terkoreksi > 0 OR is_winner = 1)", (name_clean,))
    total_tenders = cursor.fetchone()[0] or 0
    
    # 4. Total tenders won
    cursor.execute("SELECT COUNT(*) FROM tender_winners WHERE nama_pemenang = ?", (name_clean,))
    total_wins = cursor.fetchone()[0] or 0
    
    # 5. Total contract value won
    cursor.execute("SELECT SUM(harga_kontrak) FROM tender_winners WHERE nama_pemenang = ?", (name_clean,))
    total_contract_value = cursor.fetchone()[0] or 0.0
    
    # 6. Win success rate
    win_rate = 0
    if total_tenders > 0:
        win_rate = round((total_wins / total_tenders) * 100)
        
    # 7. Total Pagu followed (sum of pagu_val of all tenders followed with price or won)
    cursor.execute("""
        SELECT SUM(t.pagu_val)
        FROM competitor_evaluations e
        JOIN tenders t ON e.nomor_pengadaan = t.nomor_pengadaan
        WHERE e.nama_peserta = ? AND (e.harga_penawaran > 0 OR e.harga_terkoreksi > 0 OR e.is_winner = 1)
    """, (name_clean,))
    total_pagu = cursor.fetchone()[0] or 0.0
    
    # 8. Dominant LPSE instances won
    cursor.execute("""
        SELECT t.instansi, COUNT(*) as win_count
        FROM tender_winners w
        JOIN tenders t ON w.nomor_pengadaan = t.nomor_pengadaan
        WHERE w.nama_pemenang = ?
        GROUP BY t.instansi
        ORDER BY win_count DESC
        LIMIT 3
    """, (name_clean,))
    dominant_lpse = [dict(r) for r in cursor.fetchall()]
    
    # 9. Top head-to-head competitors (both submitted price or won)
    cursor.execute("""
        SELECT e2.nama_peserta, COUNT(*) as match_count
        FROM competitor_evaluations e1
        JOIN competitor_evaluations e2 ON e1.nomor_pengadaan = e2.nomor_pengadaan
        WHERE e1.nama_peserta = ? AND (e1.harga_penawaran > 0 OR e1.harga_terkoreksi > 0 OR e1.is_winner = 1)
          AND e2.nama_peserta != ? AND (e2.harga_penawaran > 0 OR e2.harga_terkoreksi > 0 OR e2.is_winner = 1)
        GROUP BY e2.nama_peserta
        ORDER BY match_count DESC
        LIMIT 5
    """, (name_clean, name_clean))
    raw_top = cursor.fetchall()
    
    top_competitors = []
    for r in raw_top:
        c_name = r[0]
        m_count = r[1]
        
        # Get NPWP
        cursor.execute("SELECT npwp FROM competitor_evaluations WHERE nama_peserta = ? AND npwp IS NOT NULL AND npwp != '' LIMIT 1", (c_name,))
        c_row = cursor.fetchone()
        c_npwp = c_row[0] if c_row else "-"
        if c_npwp == "-":
            cursor.execute("SELECT npwp FROM tender_winners WHERE nama_pemenang = ? AND npwp IS NOT NULL AND npwp != '' LIMIT 1", (c_name,))
            c_row = cursor.fetchone()
            if c_row:
                c_npwp = c_row[0]
            else:
                cursor.execute("SELECT npwp FROM tender_participants WHERE nama_peserta = ? AND npwp IS NOT NULL AND npwp != '' LIMIT 1", (c_name,))
                c_row = cursor.fetchone()
                if c_row:
                    c_npwp = c_row[0]
                    
        # Get followed count (with price or won)
        cursor.execute("SELECT COUNT(DISTINCT nomor_pengadaan) FROM competitor_evaluations WHERE nama_peserta = ? AND (harga_penawaran > 0 OR harga_terkoreksi > 0 OR is_winner = 1)", (c_name,))
        c_followed = cursor.fetchone()[0] or 0
        
        # Get wins count
        cursor.execute("SELECT COUNT(*) FROM tender_winners WHERE nama_pemenang = ?", (c_name,))
        c_wins = cursor.fetchone()[0] or 0
        
        top_competitors.append({
            "name": c_name,
            "npwp": c_npwp,
            "followed": c_followed,
            "wins": c_wins,
            "match_count": m_count
        })
    
    # 10. History of recent tenders followed (with price or won)
    cursor.execute("""
        SELECT t.nomor_pengadaan, t.nama_tender, t.instansi, t.pagu, e.harga_penawaran, e.harga_terkoreksi, e.is_winner, t.scraped_at
        FROM competitor_evaluations e
        JOIN tenders t ON e.nomor_pengadaan = t.nomor_pengadaan
        WHERE e.nama_peserta = ? AND (e.harga_penawaran > 0 OR e.harga_terkoreksi > 0 OR e.is_winner = 1)
        ORDER BY t.scraped_at DESC
        LIMIT 10
    """, (name_clean,))
    recent_tenders = [dict(r) for r in cursor.fetchall()]
    
    # 11. Monthly trend (last 12 months, with price or won)
    cursor.execute("""
        SELECT t.scraped_at
        FROM competitor_evaluations e
        JOIN tenders t ON e.nomor_pengadaan = t.nomor_pengadaan
        WHERE e.nama_peserta = ? AND (e.harga_penawaran > 0 OR e.harga_terkoreksi > 0 OR e.is_winner = 1)
    """, (name_clean,))
    scraped_dates = [r[0] for r in cursor.fetchall()]
    
    cursor.execute("""
        SELECT t.scraped_at
        FROM competitor_evaluations e
        JOIN tenders t ON e.nomor_pengadaan = t.nomor_pengadaan
        WHERE e.nama_peserta = ? AND e.is_winner = 1
    """, (name_clean,))
    won_dates = [r[0] for r in cursor.fetchall()]
    
    from datetime import datetime, timedelta
    trend = []
    now = datetime.now()
    for i in range(11, -1, -1):
        target_date = now - timedelta(days=30 * i)
        month_label = target_date.strftime("%b %Y")
        month_key = target_date.strftime("%Y-%m")
        
        followed_count = 0
        for d in scraped_dates:
            if d and d.startswith(month_key):
                followed_count += 1
                
        won_count = 0
        for d in won_dates:
            if d and d.startswith(month_key):
                won_count += 1
                
        trend.append({"month": month_label, "followed": followed_count, "won": won_count})
        
    conn.close()
    return {
        "name": name_clean,
        "npwp": npwp,
        "address": address,
        "total_tenders": total_tenders,
        "total_wins": total_wins,
        "total_contract_value": total_contract_value,
        "win_rate": win_rate,
        "total_pagu": total_pagu,
        "dominant_lpse": dominant_lpse,
        "top_competitors": top_competitors,
        "recent_tenders": recent_tenders,
        "monthly_trend": trend
    }

@app.get("/api/competitors/disqualifications")
def get_competitor_disqualifications(name: str, current_user: dict = Depends(get_current_user)):
    name_clean = clean_str(name)
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Get all evaluations where competitor was disqualified (alasan_gugur is not null/empty)
    cursor.execute("""
        SELECT ce.nomor_pengadaan, t.nama_tender, t.instansi, ce.harga_penawaran, ce.harga_terkoreksi,
               ce.evaluasi_administrasi, ce.evaluasi_teknis, ce.evaluasi_harga, ce.evaluasi_kualifikasi, ce.alasan_gugur
        FROM competitor_evaluations ce
        JOIN tenders t ON ce.nomor_pengadaan = t.nomor_pengadaan
        WHERE ce.nama_peserta = ? AND ce.is_winner = 0 AND ce.alasan_gugur IS NOT NULL AND ce.alasan_gugur != ''
    """, (name_clean,))
    rows = cursor.fetchall()
    
    disqualifications = []
    stage_counts = {"administrasi": 0, "teknis": 0, "harga": 0, "kualifikasi": 0}
    total_disqualified = 0
    
    # Determine user subscription level for data masking
    sub = get_user_subscription(current_user["id"])
    is_premium = sub and sub["plan_type"] == "premium" and sub["status"] == "active"
    
    for r in rows:
        r_dict = dict(r)
        
        # Deduce failed stage from columns or text
        failed_stage = "Lainnya"
        alasan_lower = r_dict["alasan_gugur"].lower()
        
        if r_dict["evaluasi_administrasi"] == "Gugur" or "administrasi" in alasan_lower:
            failed_stage = "Administrasi"
            stage_counts["administrasi"] += 1
        elif r_dict["evaluasi_teknis"] == "Gugur" or "teknis" in alasan_lower or "spesifikasi" in alasan_lower:
            failed_stage = "Teknis"
            stage_counts["teknis"] += 1
        elif r_dict["evaluasi_harga"] == "Gugur" or "harga" in alasan_lower or "penawaran" in alasan_lower:
            failed_stage = "Harga"
            stage_counts["harga"] += 1
        elif r_dict["evaluasi_kualifikasi"] == "Gugur" or "kualifikasi" in alasan_lower:
            failed_stage = "Kualifikasi"
            stage_counts["kualifikasi"] += 1
        else:
            # Fallback based on stage counts
            failed_stage = "Teknis"
            stage_counts["teknis"] += 1
            
        total_disqualified += 1
        
        # Mask/Sensor details if not premium
        if not is_premium:
            # obfuscate tender name and reasons
            r_dict["nama_tender"] = r_dict["nama_tender"][:6] + " •••••••••• [Premium Pro]"
            r_dict["alasan_gugur"] = "Upgrade ke Premium Pro untuk membaca alasan detail keguguran dari Pokja."
            r_dict["harga_penawaran"] = 0.0
            r_dict["harga_terkoreksi"] = 0.0
            
        r_dict["failed_stage"] = failed_stage
        disqualifications.append(r_dict)
        
    conn.close()
    return {
        "is_premium": is_premium,
        "total_disqualified": total_disqualified,
        "disqualified_stages": stage_counts,
        "disqualifications": disqualifications
    }

@app.get("/api/public/latest-winners")
def get_latest_winners():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT w.nomor_pengadaan, w.nama_pemenang, w.alamat, w.npwp, w.harga_kontrak, w.nilai_pdn, w.nilai_umk,
               t.nama_tender, t.instansi, t.pagu, t.scraped_at
        FROM tender_winners w
        JOIN tenders t ON w.nomor_pengadaan = t.nomor_pengadaan
        ORDER BY t.scraped_at DESC
        LIMIT 3
    """)
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

# ARTICLES / BLOG ENDPOINTS
@app.get("/api/public/articles")
def list_public_articles(limit: Optional[int] = Query(None)):
    articles = get_all_articles(include_unpublished=False)
    if limit is not None:
        articles = articles[:limit]
    return articles

@app.get("/api/public/articles/{slug}")
def get_public_article(slug: str):
    a = get_article_by_slug(slug)
    if not a or a["is_published"] != 1:
        raise HTTPException(status_code=404, detail="Artikel tidak ditemukan.")
    return a

@app.get("/api/admin/articles")
def list_admin_articles(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Akses ditolak.")
    return get_all_articles(include_unpublished=True)

@app.post("/api/admin/articles")
def admin_create_article(req: ArticleCreateReq, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Akses ditolak.")
    existing = get_article_by_slug(req.slug)
    if existing:
        raise HTTPException(status_code=400, detail="Slug artikel sudah digunakan.")
    try:
        article_id = create_article(
            title=req.title,
            slug=req.slug,
            content=req.content,
            meta_title=req.meta_title,
            meta_description=req.meta_description,
            meta_keywords=req.meta_keywords,
            is_pinned=req.is_pinned,
            is_published=req.is_published,
            image_url=req.image_url,
            youtube_embed=req.youtube_embed
        )
        return {"status": "success", "article_id": article_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal membuat artikel: {str(e)}")

@app.put("/api/admin/articles/{id}")
def admin_update_article(id: int, req: ArticleCreateReq, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Akses ditolak.")
    # Check if slug taken by another article
    existing = get_article_by_slug(req.slug)
    if existing and existing["id"] != id:
        raise HTTPException(status_code=400, detail="Slug artikel sudah digunakan oleh artikel lain.")
    try:
        update_article(
            article_id=id,
            title=req.title,
            slug=req.slug,
            content=req.content,
            meta_title=req.meta_title,
            meta_description=req.meta_description,
            meta_keywords=req.meta_keywords,
            is_pinned=req.is_pinned,
            is_published=req.is_published,
            image_url=req.image_url,
            youtube_embed=req.youtube_embed
        )
        return {"status": "success", "message": "Artikel berhasil diperbarui."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal memperbarui artikel: {str(e)}")

@app.delete("/api/admin/articles/{id}")
def admin_delete_article(id: int, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Akses ditolak.")
    try:
        delete_article(id)
        return {"status": "success", "message": "Artikel berhasil dihapus."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal menghapus artikel: {str(e)}")

@app.post("/api/admin/articles/upload")
def admin_upload_article_image(file: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Akses ditolak.")
    try:
        file_ext = Path(file.filename).suffix.lower()
        if file_ext not in [".jpg", ".jpeg", ".png", ".webp", ".gif"]:
            raise HTTPException(status_code=400, detail="Format file tidak didukung. Harap upload gambar.")
            
        # Unique filename using timestamp
        filename = f"img_{int(datetime.now().timestamp())}{file_ext}"
        filepath = UPLOAD_DIR / filename
        
        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        return {"status": "success", "url": f"/static/uploads/{filename}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal mengunggah gambar: {str(e)}")

# Contact Submissions / Leads API Endpoints
class ContactSubmissionRequest(BaseModel):
    name: str
    phone: str
    email: Optional[str] = None
    message: str

class ContactSubmissionStatusRequest(BaseModel):
    status: str

@app.post("/api/public/contact-submissions")
def create_public_contact_submission(req: ContactSubmissionRequest):
    if not req.name or not req.phone or not req.message:
        raise HTTPException(status_code=400, detail="Nama, Nomor WhatsApp, dan Pesan wajib diisi.")
    try:
        sub_id = create_contact_submission(req.name, req.phone, req.email, req.message)
        return {"status": "success", "id": sub_id, "message": "Pesan berhasil terkirim."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal mengirim pesan: {str(e)}")

@app.get("/api/admin/contact-submissions")
def admin_get_contact_submissions(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Akses ditolak.")
    try:
        leads = get_all_contact_submissions()
        return {"status": "success", "data": leads}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal mengambil data prospek: {str(e)}")

@app.put("/api/admin/contact-submissions/{id}/status")
def admin_update_contact_submission_status(id: int, req: ContactSubmissionStatusRequest, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Akses ditolak.")
    try:
        update_contact_submission_status(id, req.status)
        return {"status": "success", "message": "Status prospek berhasil diperbarui."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal memperbarui status: {str(e)}")

@app.delete("/api/admin/contact-submissions/{id}")
def admin_delete_contact_submission(id: int, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Akses ditolak.")
    try:
        delete_contact_submission(id)
        return {"status": "success", "message": "Data prospek berhasil dihapus."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal menghapus prospek: {str(e)}")

# COMPANY LEADS & CAMPAIGN ADMIN ENDPOINTS
@app.get("/api/admin/company-leads")
def admin_get_company_leads(
    search: str = "",
    filter_status: str = "all",
    page: int = 1,
    limit: int = 20,
    current_user: dict = Depends(get_current_user)
):
    if current_user.get("role") not in ["admin", "super_admin"]:
        raise HTTPException(status_code=403, detail="Akses ditolak.")
    try:
        data = get_company_leads(search=search, filter_status=filter_status, page=page, limit=limit)
        return {"status": "success", "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal mengambil data perusahaan: {str(e)}")

@app.put("/api/admin/company-leads/contact")
def admin_update_company_contact(
    req: CompanyContactUpdate,
    current_user: dict = Depends(get_current_user)
):
    if current_user.get("role") not in ["admin", "super_admin"]:
        raise HTTPException(status_code=403, detail="Akses ditolak.")
    if not req.company_name:
        raise HTTPException(status_code=400, detail="Nama perusahaan wajib diisi.")
    try:
        upsert_company_contact(req.company_name, email=req.email, phone=req.phone, npwp=req.npwp)
        return {"status": "success", "message": "Kontak perusahaan berhasil diperbarui."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal memperbarui kontak: {str(e)}")

@app.get("/api/admin/company-leads/export")
def admin_export_company_leads(
    format: str = "xlsx",
    search: str = "",
    filter_status: str = "all",
    current_user: dict = Depends(get_current_user)
):
    if current_user.get("role") not in ["admin", "super_admin"]:
        raise HTTPException(status_code=403, detail="Akses ditolak.")
    
    items = get_all_company_leads_for_export(search=search, filter_status=filter_status)
    
    if format.lower() == "csv":
        import io
        import csv
        
        output = io.StringIO()
        output.write('\ufeff')  # UTF-8 BOM for Excel
        writer = csv.writer(output)
        writer.writerow([
            "No", "Nama Perusahaan", "NPWP", "Total Tender Diikuti",
            "Total Menang", "Win Rate (%)", "Total Nilai Kontrak (Rp)",
            "Email Kontak", "No. Telepon / WA", "Terakhir Diupdate"
        ])
        for idx, item in enumerate(items, 1):
            writer.writerow([
                idx,
                item.get("company_name", ""),
                item.get("npwp", "-"),
                item.get("total_followed", 0),
                item.get("total_wins", 0),
                f"{item.get('win_rate', 0)}%",
                item.get("total_contract_value", 0.0),
                item.get("email", ""),
                item.get("phone", ""),
                item.get("updated_at", "")
            ])
            
        csv_bytes = output.getvalue().encode('utf-8')
        return Response(
            content=csv_bytes,
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=daftar_prospek_perusahaan.csv"}
        )
    else:
        import io
        import openpyxl
        from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
        
        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = "Prospek Perusahaan"
        
        headers = [
            "No", "Nama Perusahaan", "NPWP", "Total Tender Diikuti",
            "Total Menang", "Win Rate (%)", "Total Nilai Kontrak (Rp)",
            "Email Kontak", "No. Telepon / WA", "Terakhir Diupdate"
        ]
        
        header_font = Font(name="Arial", size=11, bold=True, color="FFFFFF")
        header_fill = PatternFill(start_color="1F2937", end_color="1F2937", fill_type="solid")
        alignment_center = Alignment(horizontal="center", vertical="center")
        alignment_left = Alignment(horizontal="left", vertical="center")
        alignment_right = Alignment(horizontal="right", vertical="center")
        
        ws.append(headers)
        for col_num in range(1, len(headers) + 1):
            cell = ws.cell(row=1, column=col_num)
            cell.font = header_font
            cell.fill = header_fill
            cell.alignment = alignment_center
            
        thin_border = Border(
            left=Side(style='thin', color='D1D5DB'),
            right=Side(style='thin', color='D1D5DB'),
            top=Side(style='thin', color='D1D5DB'),
            bottom=Side(style='thin', color='D1D5DB')
        )
        
        for idx, item in enumerate(items, 1):
            row_data = [
                idx,
                item.get("company_name", ""),
                item.get("npwp", "-"),
                item.get("total_followed", 0),
                item.get("total_wins", 0),
                f"{item.get('win_rate', 0)}%",
                item.get("total_contract_value", 0.0),
                item.get("email", ""),
                item.get("phone", ""),
                item.get("updated_at", "")
            ]
            ws.append(row_data)
            row_num = idx + 1
            for col_num in range(1, len(row_data) + 1):
                cell = ws.cell(row=row_num, column=col_num)
                cell.border = thin_border
                if col_num in [1, 3, 4, 5, 6, 9, 10]:
                    cell.alignment = alignment_center
                elif col_num == 7:
                    cell.alignment = alignment_right
                    cell.number_format = '#,##0'
                else:
                    cell.alignment = alignment_left
                    
        for col in ws.columns:
            max_len = max(len(str(cell.value or '')) for cell in col)
            col_letter = openpyxl.utils.get_column_letter(col[0].column)
            ws.column_dimensions[col_letter].width = max(max_len + 4, 12)
            
        stream = io.BytesIO()
        wb.save(stream)
        stream.seek(0)
        
        return Response(
            content=stream.getvalue(),
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": "attachment; filename=daftar_prospek_perusahaan.xlsx"}
        )