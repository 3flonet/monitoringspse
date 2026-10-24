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

from fastapi import FastAPI, BackgroundTasks, HTTPException, Depends, Query, UploadFile, File, status, Request
from fastapi.responses import JSONResponse, Response, HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from backend.database import (
    get_db_connection, DB_PATH, get_setting, set_setting,
    create_user, get_user_by_email, get_user_by_id, get_user_subscription, update_user_subscription,
    create_voucher, get_voucher, increment_voucher_usage, delete_voucher, get_all_vouchers, get_transaction,
    create_article, get_article_by_slug, get_all_articles, update_article, delete_article, clean_str, get_article_categories,
    create_password_reset, get_password_reset_by_hash, mark_password_reset_used, update_user_password,
    create_contact_submission, get_all_contact_submissions, update_contact_submission_status, delete_contact_submission,
    get_company_leads, get_all_company_leads_for_export, upsert_company_contact,
    get_all_alerts_for_admin, update_alert_toggle
)
from backend.auth import (
    hash_password, verify_password, create_access_token, get_current_user
)
from backend.whatsapp_notifier import send_whatsapp_alert, send_test_whatsapp, send_password_reset_whatsapp, check_whatsapp_status
from backend.email_notifier import send_test_email, send_email_alert, send_password_reset_email, check_smtp_status
from backend.crawl_coordinator import run_crawl
from backend.intelligence_exporter import (
    generate_competitor_dossier_pdf,
    generate_competitor_dossier_excel,
    generate_head_to_head_pdf,
    generate_head_to_head_excel
)


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

class AlertToggleReq(BaseModel):
    is_active: Optional[bool] = None
    email_active: Optional[bool] = None
    wa_active: Optional[bool] = None


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
    gtm_id: Optional[str] = None
    custom_head_scripts: Optional[str] = None
    custom_body_scripts: Optional[str] = None
    powered_by_text: Optional[str] = None
    powered_by_url: Optional[str] = None
    chatbot_active: Optional[str] = None
    chatbot_name: Optional[str] = None
    chatbot_avatar: Optional[str] = None
    chatbot_initial_greeting: Optional[str] = None
    chatbot_ask_name_message: Optional[str] = None
    chatbot_ask_phone_message: Optional[str] = None
    chatbot_ask_email_message: Optional[str] = None
    chatbot_ask_reason_message: Optional[str] = None
    chatbot_final_message: Optional[str] = None

class MaintenanceToggleReq(BaseModel):
    maintenance_mode: bool
    maintenance_message: Optional[str] = None

class SchedulerToggleRequest(BaseModel):
    enabled: bool



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
    document_title: Optional[str] = None
    document_url: Optional[str] = None
    document_type: Optional[str] = None
    category: Optional[str] = None

class CompanyContactUpdate(BaseModel):
    company_name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    npwp: Optional[str] = None

# AUTH ENDPOINTS
@app.post("/api/auth/register")
def register(req: UserRegister):
    clean_email = str(req.email).strip().lower()
    existing = get_user_by_email(clean_email)
    if existing:
        raise HTTPException(status_code=400, detail="Email sudah terdaftar.")
    hashed = hash_password(req.password)
    try:
        user_id = create_user(clean_email, hashed, whatsapp=req.whatsapp)
        token = create_access_token({"sub": str(user_id), "email": clean_email, "role": "user"})
        return {
            "status": "success",
            "message": "Registrasi berhasil.",
            "user_id": user_id,
            "access_token": token,
            "token_type": "bearer"
        }
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
    from backend.database import get_setting
    app_url = get_setting("app_url", "https://spyspse.com").rstrip("/")
    reset_link = f"{app_url}/#/reset-password?token={plain_token}"
    
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
        "chatbot_final_message": get_setting("chatbot_final_message", "Terima kasih! Informasi Anda sudah kami simpan. Silakan klik tombol di bawah untuk langsung terhubung dengan tim teknis kami di WhatsApp."),
        "gtm_id": get_setting("gtm_id", ""),
        "custom_head_scripts": get_setting("custom_head_scripts", ""),
        "custom_body_scripts": get_setting("custom_body_scripts", ""),
        "powered_by_text": get_setting("powered_by_text", "3flo.net") or "3flo.net",
        "powered_by_url": get_setting("powered_by_url", "https://3flo.net") or "https://3flo.net"
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
        "spse_proxy": get_setting("spse_proxy", ""),
        "gtm_id": get_setting("gtm_id", ""),
        "custom_head_scripts": get_setting("custom_head_scripts", ""),
        "custom_body_scripts": get_setting("custom_body_scripts", ""),
        "powered_by_text": get_setting("powered_by_text", "3flo.net") or "3flo.net",
        "powered_by_url": get_setting("powered_by_url", "https://3flo.net") or "https://3flo.net",
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
    if req.gtm_id is not None:
        set_setting("gtm_id", req.gtm_id.strip())
    if req.custom_head_scripts is not None:
        set_setting("custom_head_scripts", req.custom_head_scripts)
    if req.custom_body_scripts is not None:
        set_setting("custom_body_scripts", req.custom_body_scripts)
    if req.powered_by_text is not None:
        set_setting("powered_by_text", req.powered_by_text.strip())
    if req.powered_by_url is not None:
        set_setting("powered_by_url", req.powered_by_url.strip())
    if req.chatbot_active is not None:
        set_setting("chatbot_active", req.chatbot_active)
    if req.chatbot_name is not None:
        set_setting("chatbot_name", req.chatbot_name)
    if req.chatbot_avatar is not None:
        set_setting("chatbot_avatar", req.chatbot_avatar)
    if req.chatbot_initial_greeting is not None:
        set_setting("chatbot_initial_greeting", req.chatbot_initial_greeting)
    if req.chatbot_ask_name_message is not None:
        set_setting("chatbot_ask_name_message", req.chatbot_ask_name_message)
    if req.chatbot_ask_phone_message is not None:
        set_setting("chatbot_ask_phone_message", req.chatbot_ask_phone_message)
    if req.chatbot_ask_email_message is not None:
        set_setting("chatbot_ask_email_message", req.chatbot_ask_email_message)
    if req.chatbot_ask_reason_message is not None:
        set_setting("chatbot_ask_reason_message", req.chatbot_ask_reason_message)
    if req.chatbot_final_message is not None:
        set_setting("chatbot_final_message", req.chatbot_final_message)
        
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
        import asyncio
        from backend.scheduler import run_daily_scraping
        asyncio.run(run_daily_scraping())
    except Exception as e:
        logging.error(f"Error executing forced scraping job: {e}")

@app.get("/api/admin/scheduler/status")
def get_scheduler_status(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Akses ditolak.")
    enabled = get_setting("auto_scraper_enabled", "true") == "true"
    state = get_setting("scheduler_state", "IDLE")
    last_run_at = get_setting("scheduler_last_run_at", None)
    next_run_at = get_setting("scheduler_next_run_at", None)
    last_run_summary = get_setting("scheduler_last_run_summary", None)
    return {
        "enabled": enabled,
        "state": state,
        "last_run_at": last_run_at,
        "next_run_at": next_run_at,
        "last_run_summary": last_run_summary
    }

@app.post("/api/admin/scheduler/toggle")
def toggle_scheduler(req: SchedulerToggleRequest, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Akses ditolak.")
    val_str = "true" if req.enabled else "false"
    set_setting("auto_scraper_enabled", val_str)
    if not req.enabled:
        set_setting("scheduler_state", "DISABLED")
    else:
        current_state = get_setting("scheduler_state", "IDLE")
        if current_state == "DISABLED":
            set_setting("scheduler_state", "IDLE")
    return {
        "status": "success",
        "enabled": req.enabled,
        "message": f"Auto-Scraper berhasil {'diaktifkan (ON)' if req.enabled else 'dinonaktifkan (OFF)'}."
    }

@app.post("/api/admin/scheduler/force-run")
def force_run_scheduler(background_tasks: BackgroundTasks, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Akses ditolak.")
    state = get_setting("scheduler_state", "idle")
    if state and state.lower() == "running":
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
    if scheduler_last_run_summary:
        try:
            summary_obj = json.loads(scheduler_last_run_summary) if isinstance(scheduler_last_run_summary, str) else scheduler_last_run_summary
            if isinstance(summary_obj, dict) and "duration_seconds" in summary_obj and "duration_formatted" not in summary_obj:
                sec = int(round(float(summary_obj["duration_seconds"])))
                if sec < 60:
                    summary_obj["duration_formatted"] = f"{sec}s"
                else:
                    m, s = divmod(sec, 60)
                    h, m = divmod(m, 60)
                    summary_obj["duration_formatted"] = f"{h}j {m}m {s}s" if h > 0 else f"{m}m {s}s"
                scheduler_last_run_summary = json.dumps(summary_obj)
        except Exception:
            pass
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
            "enabled": get_setting("auto_scraper_enabled", "true") == "true",
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
def get_admin_crawl_logs(limit: int = 15, offset: int = 0, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Akses ditolak.")
    from backend.database import get_recent_crawl_logs, get_crawl_logs_stats
    logs, total = get_recent_crawl_logs(limit=limit, offset=offset)
    stats = get_crawl_logs_stats()
    return {"logs": logs, "total": total, "stats": stats}

@app.delete("/api/admin/crawl-logs")
def clear_admin_crawl_logs(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Akses ditolak.")
    from backend.database import clear_all_crawl_logs
    success = clear_all_crawl_logs()
    if success:
        return {"status": "success", "message": "Log kesehatan penarikan & pemblokiran berhasil dibersihkan!"}
    else:
        raise HTTPException(status_code=500, detail="Gagal membersihkan log penarikan.")


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
    from backend.email_notifier import send_email_alert, send_email_digest_alert
    from backend.whatsapp_notifier import send_whatsapp_alert, send_whatsapp_digest_alert
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

        # Check alert active and channel toggles
        cursor.execute("SELECT wa_verified, is_active, email_active, wa_active FROM alerts WHERE id = ?", (alert_id,))
        alert_row = cursor.fetchone()
        
        if alert_row and alert_row.get("is_active") is not None and not bool(alert_row["is_active"]):
            logging.info(f"Alert #{alert_id} is disabled by toggle. Skipping initial background alert dispatch.")
            conn.close()
            return
            
        is_wa_verified = bool(alert_row["wa_verified"]) if alert_row and "wa_verified" in alert_row.keys() else False
        email_active = alert_row.get("email_active") if alert_row else True
        wa_active = alert_row.get("wa_active") if alert_row else True
        
        should_send_email = bool(email and (email_active is None or bool(email_active)))
        
        # Resolve target whatsapp number
        target_wa = whatsapp
        if not target_wa:
            cursor.execute("SELECT whatsapp FROM users WHERE id = ?", (user_id,))
            user_row = cursor.fetchone()
            if user_row and user_row["whatsapp"]:
                target_wa = user_row["whatsapp"]

        has_wa = bool(target_wa and target_wa.strip())
        should_send_wa = bool(has_wa and (wa_active is None or bool(wa_active)))

        matched_items = []
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
            matched_items.append({"tender": tender, "matched_kw": matched_kw})

        # Digest threshold: If > 3 matched tenders, consolidate into 1 digest alert to prevent spam reports / WhatsApp ban
        if len(matched_items) > 3:
            logging.info(f"Initial Alert Digest: {len(matched_items)} existing tenders matched alert #{alert_id}. Consolidating into 1 digest alert.")
            tenders_list = [item["tender"] for item in matched_items]

            email_sent = send_email_digest_alert(email, raw_kw, tenders_list) if should_send_email else False
            wa_sent = False
            if should_send_wa:
                if is_wa_verified:
                    wa_sent = send_whatsapp_digest_alert(target_wa.strip(), raw_kw, tenders_list)
                else:
                    logging.info(f"Skipping initial WA digest alert to {target_wa}: Belum verifikasi chat inbound.")

            if email_sent or wa_sent:
                for item in matched_items:
                    t_nomor = item["tender"]["nomor_pengadaan"]
                    try:
                        cursor.execute("INSERT OR IGNORE INTO sent_alerts (alert_id, nomor_pengadaan, sent_at) VALUES (?, ?, ?)", (alert_id, t_nomor, now_str))
                    except Exception as e:
                        logging.error(f"Error recording digest sent alert: {e}")
                conn.commit()

            time.sleep(5)
        else:
            # <= 3 tenders: send individual alerts with 5-second interval
            for item in matched_items:
                tender = item["tender"]
                matched_kw = item["matched_kw"]
                nomor_pengadaan = tender["nomor_pengadaan"]

                email_sent = send_email_alert(email, matched_kw, tender) if should_send_email else False
                wa_sent = False
                if should_send_wa:
                    if is_wa_verified:
                        wa_sent = send_whatsapp_alert(target_wa.strip(), matched_kw, tender)
                    else:
                        logging.info(f"Skipping initial WA alert to {target_wa}: Belum verifikasi chat inbound.")

                if email_sent or wa_sent:
                    try:
                        cursor.execute("INSERT OR IGNORE INTO sent_alerts (alert_id, nomor_pengadaan, sent_at) VALUES (?, ?, ?)", (alert_id, nomor_pengadaan, now_str))
                        conn.commit()
                    except Exception as e:
                        logging.error(f"Error recording sent alert: {e}")

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
    wa_verified = False
    wa_verified_at = None
    app_name = get_setting("app_name", "Spy SPSE")

    if clean_target_wa:
        from backend.whatsapp_notifier import validate_whatsapp_number, get_whatsapp_activation_link
        # Check if clean_target_wa is already verified in alerts table
        cursor.execute("""
            SELECT COUNT(*) FROM alerts 
            WHERE wa_verified = TRUE AND whatsapp IS NOT NULL AND REPLACE(REPLACE(REPLACE(whatsapp, '+', ''), '-', ''), ' ', '') LIKE ?
        """, (f"%{clean_target_wa[-9:]}",))
        if cursor.fetchone()[0] > 0:
            wa_verified = True
            wa_verified_at = datetime.now().isoformat()
        else:
            is_new_number = True
            val_res = validate_whatsapp_number(target_wa)
            whatsapp_registered = val_res.get("registered", True)
            activation_url = get_whatsapp_activation_link(user_wa=target_wa)

    now_str = datetime.now().isoformat()
    cursor.execute("""
        INSERT INTO alerts (user_id, keyword, email, whatsapp, instansi, created_at, wa_verified, wa_verified_at, is_active, email_active, wa_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, 1, 1)
    """, (current_user["id"], req.keyword.strip(), req.email.strip(), target_wa, req.instansi.strip(), now_str, wa_verified, wa_verified_at))
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
        "wa_verified": wa_verified,
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


@app.put("/api/alerts/{alert_id}/toggle")
def toggle_user_alert(alert_id: int, req: AlertToggleReq, current_user: dict = Depends(get_current_user)):
    success = update_alert_toggle(
        alert_id=alert_id,
        is_active=req.is_active,
        email_active=req.email_active,
        wa_active=req.wa_active,
        user_id=current_user["id"]
    )
    if not success:
        raise HTTPException(status_code=404, detail="Alert tidak ditemukan atau tidak dapat diperbarui.")
    return {"status": "success", "message": "Pengaturan notifikasi berhasil diperbarui."}


# ADMIN ALERT MANAGEMENT ENDPOINTS
@app.get("/api/admin/alerts")
def admin_get_all_alerts(
    search: str = "",
    status: str = "all",
    page: int = 1,
    limit: int = 50,
    current_user: dict = Depends(get_current_user)
):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Akses ditolak.")
    offset = (page - 1) * limit
    data = get_all_alerts_for_admin(search=search, status_filter=status, limit=limit, offset=offset)
    return {"status": "success", "data": data}


@app.put("/api/admin/alerts/{alert_id}/toggle")
def admin_toggle_alert(alert_id: int, req: AlertToggleReq, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Akses ditolak.")
    success = update_alert_toggle(
        alert_id=alert_id,
        is_active=req.is_active,
        email_active=req.email_active,
        wa_active=req.wa_active,
        user_id=None
    )
    if not success:
        raise HTTPException(status_code=404, detail="Alert tidak ditemukan.")
    return {"status": "success", "message": "Status notifikasi alert berhasil diperbarui oleh admin."}


@app.delete("/api/admin/alerts/{alert_id}")
def admin_delete_alert(alert_id: int, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Akses ditolak.")
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM alerts WHERE id = ?", (alert_id,))
    conn.commit()
    conn.close()
    return {"status": "success", "message": "Alert berhasil dihapus oleh admin."}


@app.post("/api/admin/alerts/{alert_id}/test")
def admin_test_send_alert(alert_id: int, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Akses ditolak.")
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM alerts WHERE id = ?", (alert_id,))
    row = cursor.fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Alert tidak ditemukan.")
    
    alert = dict(row)
    dummy_tender = {
        "nomor_pengadaan": f"TEST-{alert_id}",
        "nama_tender": f"[UJI COBA NOTIFIKASI] Paket Tender Pengadaan untuk Alert #{alert_id}",
        "instansi": alert.get("instansi") or "Nasional",
        "pagu": "Rp 1.500.000.000,00",
        "tahap": "Pengumuman Pascakualifikasi (Uji Coba)",
        "metode": "Tender - Pascakualifikasi Satu File"
    }
    
    results = {}
    if alert.get("email"):
        res_email = send_email_alert(alert["email"], alert.get("keyword", "Uji Coba"), dummy_tender)
        results["email"] = "Terkirim" if res_email else "Gagal / Dicatat ke Log Mock"
        
    wa_num = alert.get("whatsapp")
    if wa_num and wa_num.strip():
        res_wa = send_whatsapp_alert(wa_num.strip(), alert.get("keyword", "Uji Coba"), dummy_tender)
        results["whatsapp"] = "Terkirim" if res_wa else "Gagal / Dicatat ke Log Mock"
        
    return {"status": "success", "message": "Uji coba pengiriman berhasil dieksekusi.", "results": results}


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
    clean_target_wa = "".join(filter(str.isdigit, target_wa)) if target_wa else None
    
    wa_verified = False
    wa_verified_at = None
    if clean_target_wa:
        cursor.execute("""
            SELECT COUNT(*) FROM alerts 
            WHERE wa_verified = TRUE AND whatsapp IS NOT NULL AND REPLACE(REPLACE(REPLACE(whatsapp, '+', ''), '-', ''), ' ', '') LIKE ?
        """, (f"%{clean_target_wa[-9:]}",))
        if cursor.fetchone()[0] > 0:
            wa_verified = True
            wa_verified_at = datetime.now().isoformat()
            
    cursor.execute("""
        UPDATE alerts 
        SET whatsapp = ?, wa_verified = ?, wa_verified_at = ? 
        WHERE id = ?
    """, (target_wa, wa_verified, wa_verified_at, alert_id))
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
        "wa_verified": wa_verified,
        "whatsapp_registered": val_res.get("registered", False),
        "app_name": app_name,
        "activation_url": activation_url
    }


@app.get("/api/alerts/{alert_id}/activation-link")
def get_alert_activation_link(alert_id: int, current_user: dict = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM alerts WHERE id = ? AND user_id = ?", (alert_id, current_user["id"]))
    row = cursor.fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Pemantauan tidak ditemukan")
    
    alert = dict(row)
    target_wa = alert.get("whatsapp")
    from backend.whatsapp_notifier import get_whatsapp_activation_link
    activation_url = get_whatsapp_activation_link(user_wa=target_wa) if target_wa else None
    return {
        "alert_id": alert_id,
        "whatsapp": target_wa,
        "wa_verified": bool(alert.get("wa_verified")),
        "activation_url": activation_url
    }


# FONNTE INCOMING WEBHOOK (TWO-WAY INBOUND VERIFICATION & ANTI-BAN)
@app.get("/api/fonnte/webhook")
def fonnte_webhook_verify():
    """Endpoint validation check for Fonnte webhook ping."""
    return {"status": "active", "service": "Spy SPSE WhatsApp Webhook Gateway"}


@app.post("/api/fonnte/webhook")
async def fonnte_webhook_receiver(request: Request):
    """
    Webhook handler for incoming WhatsApp messages from Fonnte Gateway.
    When a user chats to the Fonnte number:
    - Opt-in / verify: Activates wa_verified = True and sends welcome confirmation.
    - Opt-out / STOP: Deactivates wa_verified = False to prevent spam reports.
    """
    try:
        content_type = request.headers.get("content-type", "")
        if "application/json" in content_type:
            data = await request.json()
        else:
            form = await request.form()
            data = dict(form)
    except Exception as e:
        logging.warning(f"Error parsing Fonnte webhook payload: {e}")
        data = {}

    sender = str(data.get("sender", "")).strip()
    msg = str(data.get("message", "")).strip().lower()

    if not sender:
        return {"status": "ignored", "reason": "No sender number"}

    logging.info(f"[FONNTE WEBHOOK] Received message from {sender}: {msg}")

    from backend.whatsapp_notifier import (
        check_whatsapp_registration,
        verify_whatsapp_number,
        unverify_whatsapp_number,
        send_whatsapp_direct
    )
    from backend.database import get_setting

    app_name = get_setting("app_name", "Spy SPSE")

    # 1. FILTER NOMOR TERDAFTAR (Pencegahan Chat Pribadi Ikut Dibalas)
    reg_info = check_whatsapp_registration(sender)
    if not reg_info["exists"]:
        logging.info(f"[FONNTE WEBHOOK] Ignored private/unregistered chat from {sender}: '{msg}'")
        return {"status": "ignored", "reason": "Sender number not registered in alerts or users"}

    # 2. OPT-OUT / STOP COMMAND (Hanya untuk nomor terdaftar)
    if any(k in msg for k in ["stop", "berhenti", "jeda", "nonaktif", "unsubscribe"]):
        updated = unverify_whatsapp_number(sender)
        reply = (
            f"⏸️ *{app_name} — Notifikasi WhatsApp Dijeda*\n\n"
            f"Notifikasi radar tender untuk nomor WhatsApp Anda (*{sender}*) berhasil dinonaktifkan sementara.\n\n"
            f"Anda tidak akan menerima pesan notifikasi lelang baru lagi.\n\n"
            f"Ketik pesan mengandung *spy spse* kapan saja jika Anda ingin menyalakan kembali notifikasi radar lelang SPSE."
        )
        send_whatsapp_direct(sender, reply)
        return {"status": "success", "action": "stopped", "sender": sender, "updated_alerts": updated}

    # 3. AKTIVASI DUA ARAH (HANYA JIKA MENGANDUNG KATA KUNCI 'spy spse')
    elif "spy spse" in msg:
        # Cek apakah nomor ini memang belum aktif / butuh verifikasi
        if reg_info["unverified_alerts"] > 0 or not reg_info["is_verified"]:
            updated = verify_whatsapp_number(sender)
            reply = (
                f"✅ *{app_name} — WhatsApp Berhasil Terhubung!*\n\n"
                f"Nomor WhatsApp Anda (*{sender}*) telah berhasil diverifikasi dan terhubung ke sistem radar tender {app_name}.\n\n"
                f"🎯 Anda akan menerima update lelang baru secara otomatis sesuai kata kunci yang Anda pantau di dashboard.\n\n"
                f"💡 _Ketik *STOP* kapan saja jika ingin menjeda atau mematikan notifikasi._"
            )
            send_whatsapp_direct(sender, reply)
            return {"status": "success", "action": "verified", "sender": sender, "updated_alerts": updated}
        else:
            # Nomor sudah aktif sebelumnya, abaikan agar tidak membalas berulang kali
            logging.info(f"[FONNTE WEBHOOK] Number {sender} is already verified, ignoring repeat 'spy spse' chat.")
            return {"status": "ignored", "reason": "Already verified"}

    # 4. CHAT LAINNYA DARI USER TERDAFTAR (Abaikan tanpa membalas apapun)
    else:
        logging.info(f"[FONNTE WEBHOOK] Ignored chat from registered user {sender} (no 'spy spse' keyword): '{msg}'")
        return {"status": "ignored", "reason": "Keyword 'spy spse' not found"}

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
    if user_id == 1:
        raise HTTPException(status_code=400, detail="Akun Super Admin utama (ID #1) tidak dapat dihapus demi keamanan sistem.")
    if user_id == current_user["id"]:
        raise HTTPException(status_code=400, detail="Anda tidak dapat menghapus akun Anda sendiri.")
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

@app.put("/api/admin/users/{user_id}")
def update_user_admin(user_id: int, req: dict, current_user: dict = Depends(get_current_user)):
    """Update user profile: email, whatsapp, role, subscription plan, status, duration."""
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Akses ditolak.")

    new_email = req.get("email", "").strip().lower()
    new_whatsapp = req.get("whatsapp", "").strip()
    new_role = req.get("role")
    new_plan = req.get("plan_type")
    new_status = req.get("status")
    duration_days = req.get("duration_days")

    if new_email and "@" not in new_email:
        raise HTTPException(status_code=400, detail="Alamat email tidak valid.")
    if new_role and new_role not in ["user", "admin"]:
        raise HTTPException(status_code=400, detail="Role harus 'user' atau 'admin'.")

    conn = get_db_connection()
    cursor = conn.cursor()

    if new_email:
        cursor.execute("SELECT id FROM users WHERE email = ? AND id != ?", (new_email, user_id))
        if cursor.fetchone():
            conn.close()
            raise HTTPException(status_code=400, detail=f"Email '{new_email}' sudah digunakan user lain.")

    updates = []
    params = []
    if new_email:
        updates.append("email = ?")
        params.append(new_email)
    if new_whatsapp is not None:
        updates.append("whatsapp = ?")
        params.append(new_whatsapp)
    if new_role:
        updates.append("role = ?")
        params.append(new_role)

    if updates:
        params.append(user_id)
        cursor.execute(f"UPDATE users SET {', '.join(updates)} WHERE id = ?", params)

    conn.commit()
    conn.close()

    if new_plan or new_status or duration_days is not None:
        plan = new_plan or "premium"
        status = new_status or "active"
        days = int(duration_days) if duration_days is not None else 30
        update_user_subscription(user_id, plan_type=plan, status=status, duration_days=days)

    return {"status": "success", "message": "Data user berhasil diperbarui."}

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
        
    targets = []
    if req.category == "all":
        lpse_str = get_setting("lpse_instances", "[]")
        try:
            raw_list = json.loads(lpse_str)
            targets = [
                l["slug"].strip().lower() 
                for l in raw_list 
                if isinstance(l, dict) and l.get("slug") and l["slug"].strip()
            ]
            if not targets:
                targets = ["nasional"]
        except Exception as e:
            logging.error(f"Error parsing lpse_instances setting for crawl: {e}")
            targets = ["nasional"]
    else:
        targets = [req.category]
        
    def run_sequential_crawl(tipe, target_list, tahun, limit, start, search):
        import time
        total = len(target_list)
        logging.info(f"Sequential crawl dimulai untuk {total} target instansi (tipe={tipe}, tahun={tahun})")
        for idx, t in enumerate(target_list, 1):
            try:
                logging.info(f"[{idx}/{total}] Crawling instansi '{t}'...")
                run_crawl(tipe=tipe, category=t, tahun=tahun, start=start, length=limit, search=search)
                if total > 1:
                    time.sleep(5.0)
            except Exception as e:
                logging.error(f"Sequential crawl error for '{t}': {e}")
        logging.info(f"Sequential crawl selesai untuk seluruh {total} instansi.")
                
    background_tasks.add_task(run_sequential_crawl, req.tipe, targets, req.tahun, req.limit, req.start, req.search)
    
    if req.category == "all":
        instansi_label = f"seluruh {len(targets)} K/L/Pemda/Instansi"
    else:
        instansi_label = f"instansi '{req.category}'"
        
    return {"status": "success", "message": f"Proses scraping untuk {instansi_label} berhasil dimasukkan ke antrean latar belakang ({len(targets)} target)."}

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
        UNION
        SELECT DISTINCT nama_peserta FROM tender_participants WHERE nama_peserta LIKE ?
        LIMIT 20
    """, (f"%{q}%", f"%{q}%", f"%{q}%"))
    results = [r[0] for r in cursor.fetchall() if r and r[0]]
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
    
    # 10. History of won tenders (with real harga_kontrak)
    cursor.execute("""
        SELECT w.nomor_pengadaan, t.nama_tender, t.instansi, t.pagu, t.pagu_val, w.harga_kontrak, t.scraped_at
        FROM tender_winners w
        JOIN tenders t ON w.nomor_pengadaan = t.nomor_pengadaan
        WHERE w.nama_pemenang = ?
        ORDER BY t.scraped_at DESC
        LIMIT 15
    """, (name_clean,))
    recent_tenders = [dict(r) for r in cursor.fetchall()]
    if not recent_tenders:
        cursor.execute("""
            SELECT t.nomor_pengadaan, t.nama_tender, t.instansi, t.pagu, t.pagu_val, 
                   COALESCE(NULLIF(e.harga_terkoreksi, 0), e.harga_penawaran) as harga_kontrak, t.scraped_at
            FROM competitor_evaluations e
            JOIN tenders t ON e.nomor_pengadaan = t.nomor_pengadaan
            WHERE e.nama_peserta = ? AND (e.harga_penawaran > 0 OR e.harga_terkoreksi > 0)
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
def get_competitor_disqualifications(name: str, current_user: Optional[dict] = None):
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
    cluster_counts = {
        "personil": 0,
        "peralatan": 0,
        "kualifikasi": 0,
        "teknis": 0,
        "harga": 0,
        "administrasi": 0
    }
    total_disqualified = 0
    
    # Determine user subscription level for data masking
    sub = get_user_subscription(current_user["id"]) if (current_user and "id" in current_user) else None
    is_premium = (sub and sub["plan_type"] == "premium" and sub["status"] == "active") or (current_user is None)
    
    import re

    for r in rows:
        r_dict = dict(r)
        
        # Deduce failed stage from columns or text
        failed_stage = "Lainnya"
        alasan_raw = r_dict["alasan_gugur"] or ""
        alasan_lower = alasan_raw.lower()
        
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
            failed_stage = "Teknis"
            stage_counts["teknis"] += 1
            
        total_disqualified += 1

        # Weakness Matrix Clustering
        if re.search(r'personil|tenaga ahli|ska|skk|keahlian|ijazah|curriculum vitae|\bcv\b|pengalaman kerja|tenaga teknis|petugas k3', alasan_lower):
            cluster_id = "personil"
            cluster_name = "Personil & Tenaga Ahli (SKK/SKA)"
            cluster_counts["personil"] += 1
        elif re.search(r'peralatan|alat|sewa alat|bukti kepemilikan|kapasitas|dukungan alat|kondisi alat', alasan_lower):
            cluster_id = "peralatan"
            cluster_name = "Peralatan & Fasilitas Kerja"
            cluster_counts["peralatan"] += 1
        elif re.search(r'sbu|nib|iujk|ijin usaha|izin usaha|spt|pajak|laporan keuangan|sisa kemampuan paket|skp|rekening koran|jaminan penawaran|bank', alasan_lower):
            cluster_id = "kualifikasi"
            cluster_name = "Legalitas, SBU & Keuangan"
            cluster_counts["kualifikasi"] += 1
        elif re.search(r'metode kerja|spesifikasi|spek|brosur|jadwal|tkdn|uji lab|surat dukungan|pabrikan|katalog', alasan_lower):
            cluster_id = "teknis"
            cluster_name = "Metode Kerja & Spesifikasi Teknis"
            cluster_counts["teknis"] += 1
        elif re.search(r'kewajaran harga|analisa harga|ahs|rincian biaya|harga satuan|hps|keselamatan konstruksi|smk3|rkk|biaya penerapan', alasan_lower):
            cluster_id = "harga"
            cluster_name = "Kewajaran Harga & Rincian AHS/SMK3"
            cluster_counts["harga"] += 1
        else:
            cluster_id = "administrasi"
            cluster_name = "Format Surat & Dokumen Administrasi"
            cluster_counts["administrasi"] += 1

        r_dict["cluster_id"] = cluster_id
        r_dict["cluster_name"] = cluster_name
        
        # Mask/Sensor details if not premium
        if not is_premium:
            r_dict["nama_tender"] = r_dict["nama_tender"][:6] + " •••••••••• [Premium Pro]"
            r_dict["alasan_gugur"] = "Upgrade ke Premium Pro untuk membaca alasan detail keguguran dari Pokja."
            r_dict["harga_penawaran"] = 0.0
            r_dict["harga_terkoreksi"] = 0.0
            
        r_dict["failed_stage"] = failed_stage
        disqualifications.append(r_dict)
        
    conn.close()

    # Build Weakness Matrix clusters array
    cluster_metadata = [
        {"id": "personil", "name": "Personil & Tenaga Ahli (SKK/SKA)", "icon": "👷", "desc": "Kesesuaian sertifikat SKK/SKA, jumlah personil inti, atau bukti pengalaman kerja personil."},
        {"id": "peralatan", "name": "Peralatan & Fasilitas Kerja", "icon": "🚜", "desc": "Bukti kepemilikan/sewa alat, kapasitas alat minimal, atau kondisi kelaikan peralatan utama."},
        {"id": "kualifikasi", "name": "Legalitas, SBU & Keuangan", "icon": "📜", "desc": "Masa berlaku SBU/NIB, sisa kemampuan paket (SKP), SPT tahunan, atau laporan keuangan akuntan publik."},
        {"id": "teknis", "name": "Metode Kerja & Spesifikasi Teknis", "icon": "📋", "desc": "Uraian metode pelaksanaan, brosur spesifikasi pabrikan, sertifikat TKDN, atau jadwal kurva S."},
        {"id": "harga", "name": "Kewajaran Harga & Rincian AHS/SMK3", "icon": "💵", "desc": "Kelengkapan rincian AHS, evaluasi kewajaran harga di bawah 80% HPS, atau pembiayaan K3 (SMK3)."},
        {"id": "administrasi", "name": "Format Surat & Dokumen Administrasi", "icon": "✉️", "desc": "Masa berlaku surat penawaran, jaminan tender, keabsahan tanda tangan basah/elektronik, atau format formulir."}
    ]

    weakness_clusters = []
    tactical_insights = []

    for cm in cluster_metadata:
        c_count = cluster_counts[cm["id"]]
        c_pct = round((c_count / total_disqualified) * 100, 1) if total_disqualified > 0 else 0.0
        
        if c_pct >= 30.0:
            risk_level = "Titik Lemah Utama"
            risk_badge = "danger"
        elif c_pct >= 15.0:
            risk_level = "Cukup Sering Gugur"
            risk_badge = "warning"
        elif c_count > 0:
            risk_level = "Pernah Gugur"
            risk_badge = "info"
        else:
            risk_level = "Kuat / Aman"
            risk_badge = "success"

        weakness_clusters.append({
            "id": cm["id"],
            "name": cm["name"],
            "icon": cm["icon"],
            "desc": cm["desc"],
            "count": c_count,
            "percentage": c_pct,
            "risk_level": risk_level,
            "risk_badge": risk_badge
        })

    # Sort clusters by highest count first
    weakness_clusters.sort(key=lambda x: x["count"], reverse=True)

    # Generate tactical recommendation based on top weakness
    if weakness_clusters and weakness_clusters[0]["count"] > 0:
        top_weak = weakness_clusters[0]
        if top_weak["id"] == "personil":
            tactical_insights.append(f"Titik rawan terbesar {name_clean} berada pada aspek {top_weak['name']} ({top_weak['count']}x gugur). Pastikan dokumen personil Anda lengkap dengan SKK terverifikasi dan referensi kerja valid.")
        elif top_weak["id"] == "peralatan":
            tactical_insights.append(f"{name_clean} rentan digugurkan Pokja pada pembuktian {top_weak['name']} ({top_weak['count']}x gugur). Siapkan bukti kepemilikan atau surat perjanjian sewa alat yang tidak tumpang-tindih.")
        elif top_weak["id"] == "kualifikasi":
            tactical_insights.append(f"Kelemahan historis {name_clean} terdeteksi pada {top_weak['name']} ({top_weak['count']}x gugur). Pokja sangat teliti mengecek masa berlaku kualifikasi dan SKP mereka.")
        elif top_weak["id"] == "teknis":
            tactical_insights.append(f"{name_clean} kerap terganjal di tahap {top_weak['name']} ({top_weak['count']}x gugur). Unggulkan metode kerja yang komprehensif serta lampiran brosur spesifikasi resmi.")
        elif top_weak["id"] == "harga":
            tactical_insights.append(f"Pada aspek penawaran, {name_clean} pernah {top_weak['count']}x gugur terkait {top_weak['name']}. Hati-hati saat banting harga dan pastikan analisa satuan biaya K3 Anda terinci rapi.")
        else:
            tactical_insights.append(f"Periksa format kelengkapan dokumen administratif, karena {name_clean} tercatat pernah tereliminasi akibat ketidakterpenuhinya syarat format surat.")
    else:
        tactical_insights.append(f"Belum ada pola keguguran signifikan yang tercatat untuk {name_clean}.")

    return {
        "is_premium": is_premium,
        "total_disqualified": total_disqualified,
        "disqualified_stages": stage_counts,
        "weakness_clusters": weakness_clusters,
        "tactical_insights": tactical_insights,
        "disqualifications": disqualifications
    }

@app.get("/api/competitors/{name}/pricing-pattern")
def get_competitor_pricing_pattern(name: str):
    name_clean = clean_str(name)
    conn = get_db_connection()
    cursor = conn.cursor()

    # Query all tenders followed with price or won, joined with pagu_val
    cursor.execute("""
        SELECT t.nomor_pengadaan, t.nama_tender, t.instansi, t.pagu_val, 
               e.harga_penawaran, e.harga_terkoreksi, e.is_winner,
               w.harga_kontrak
        FROM competitor_evaluations e
        JOIN tenders t ON e.nomor_pengadaan = t.nomor_pengadaan
        LEFT JOIN tender_winners w ON e.nomor_pengadaan = w.nomor_pengadaan AND w.nama_pemenang = ?
        WHERE e.nama_peserta = ? AND t.pagu_val > 0 
          AND (e.harga_penawaran > 0 OR e.harga_terkoreksi > 0 OR e.is_winner = 1)
        ORDER BY t.scraped_at DESC
    """, (name_clean, name_clean))
    rows = cursor.fetchall()
    
    # Also check tender_winners directly in case competitor won but wasn't in evaluations
    cursor.execute("""
        SELECT t.nomor_pengadaan, t.nama_tender, t.instansi, t.pagu_val, 
               w.harga_kontrak, w.harga_kontrak as harga_terkoreksi, 1 as is_winner,
               w.harga_kontrak
        FROM tender_winners w
        JOIN tenders t ON w.nomor_pengadaan = t.nomor_pengadaan
        WHERE w.nama_pemenang = ? AND t.pagu_val > 0
          AND w.nomor_pengadaan NOT IN (
              SELECT nomor_pengadaan FROM competitor_evaluations WHERE nama_peserta = ?
          )
    """, (name_clean, name_clean))
    extra_winners = cursor.fetchall()

    all_rows = list(rows) + list(extra_winners)
    conn.close()

    total_bids = len(all_rows)
    if total_bids == 0:
        return {
            "name": name_clean,
            "total_bids": 0,
            "avg_discount_pct": 0.0,
            "avg_bid_ratio": 0.0,
            "winning_bids_count": 0,
            "avg_win_discount_pct": 0.0,
            "avg_win_bid_ratio": 0.0,
            "losing_bids_count": 0,
            "avg_lose_discount_pct": 0.0,
            "sweet_spot": {"min": 0.0, "max": 0.0},
            "character_type": {
                "type": "unregistered",
                "label": "Belum Cukup Data Penawaran",
                "badge_color": "neutral",
                "description": "Belum ada riwayat penawaran harga tersimpan untuk badan usaha ini."
            },
            "bids_history": []
        }

    bids_history = []
    win_ratios = []
    lose_ratios = []
    all_ratios = []

    for r in all_rows:
        pagu = float(r["pagu_val"] or 0)
        is_win = bool(r["is_winner"])
        
        # Determine bid price: prefer harga_kontrak if win, else harga_terkoreksi, else harga_penawaran
        bid_price = 0.0
        if is_win and r["harga_kontrak"] and float(r["harga_kontrak"]) > 0:
            bid_price = float(r["harga_kontrak"])
        elif r["harga_terkoreksi"] and float(r["harga_terkoreksi"]) > 0:
            bid_price = float(r["harga_terkoreksi"])
        elif r["harga_penawaran"] and float(r["harga_penawaran"]) > 0:
            bid_price = float(r["harga_penawaran"])

        if pagu > 0 and bid_price > 0:
            bid_ratio = round((bid_price / pagu) * 100, 2)
            discount_pct = round(max(0.0, 100.0 - bid_ratio), 2)
            selisih_rp = max(0.0, pagu - bid_price)

            all_ratios.append(bid_ratio)
            if is_win:
                win_ratios.append(bid_ratio)
            else:
                lose_ratios.append(bid_ratio)

            bids_history.append({
                "nomor_pengadaan": r["nomor_pengadaan"],
                "nama_tender": r["nama_tender"],
                "instansi": r["instansi"],
                "pagu": pagu,
                "penawaran": bid_price,
                "bid_price": bid_price,
                "selisih_rp": selisih_rp,
                "bid_ratio": bid_ratio,
                "discount_pct": discount_pct,
                "is_winner": is_win
            })

    avg_bid_ratio = round(sum(all_ratios) / len(all_ratios), 2) if all_ratios else 0.0
    avg_discount_pct = round(max(0.0, 100.0 - avg_bid_ratio), 2)

    avg_win_bid_ratio = round(sum(win_ratios) / len(win_ratios), 2) if win_ratios else 0.0
    avg_win_discount_pct = round(max(0.0, 100.0 - avg_win_bid_ratio), 2) if win_ratios else 0.0

    avg_lose_bid_ratio = round(sum(lose_ratios) / len(lose_ratios), 2) if lose_ratios else 0.0
    avg_lose_discount_pct = round(max(0.0, 100.0 - avg_lose_bid_ratio), 2) if lose_ratios else 0.0

    # Winning sweet spot: min and max ratio when winning, or around avg_win
    if win_ratios:
        sweet_min = round(min(win_ratios), 1)
        sweet_max = round(max(win_ratios), 1)
    else:
        sweet_min = round(max(0.0, avg_bid_ratio - 3.0), 1)
        sweet_max = round(min(100.0, avg_bid_ratio + 3.0), 1)

    # Character classification
    ref_ratio = avg_win_bid_ratio if win_ratios else avg_bid_ratio
    if ref_ratio < 80.0:
        character_type = {
            "type": "aggressive",
            "label": "Tipe Banting Harga (Price Fighter)",
            "badge_color": "danger",
            "avg_discount": f"{round(100 - ref_ratio, 1)}%",
            "description": "Kompetitor ini konsisten menawar di bawah 80% Pagu. Cenderung berani mengambil risiko klarifikasi kewajaran harga Pokja demi mengamankan volume proyek."
        }
    elif ref_ratio <= 90.0:
        character_type = {
            "type": "moderate",
            "label": "Tipe Moderat Seimbang (Competitive Balanced)",
            "badge_color": "warning",
            "avg_discount": f"{round(100 - ref_ratio, 1)}%",
            "description": "Kompetitor ini bermain di kisaran harga standar pengadaan nasional (80% - 90% Pagu). Menjaga margin keuntungan sehat sembari tetap kompetitif."
        }
    else:
        character_type = {
            "type": "premium",
            "label": "Tipe Kualitas Teknis (Technical High-Margin)",
            "badge_color": "success",
            "avg_discount": f"{round(100 - ref_ratio, 1)}%",
            "description": "Kompetitor ini menawar tipis di atas 90% Pagu. Kerap memenangkan lelang berkat spesifikasi teknis prima, personil ahli lengkap, atau kualifikasi yang sulit disaingi."
        }

    return {
        "name": name_clean,
        "total_bids": len(bids_history),
        "avg_discount_pct": avg_discount_pct,
        "avg_bid_ratio": avg_bid_ratio,
        "winning_bids_count": len(win_ratios),
        "avg_win_discount_pct": avg_win_discount_pct,
        "avg_win_bid_ratio": avg_win_bid_ratio,
        "losing_bids_count": len(lose_ratios),
        "avg_lose_discount_pct": avg_lose_discount_pct,
        "sweet_spot": {"min": sweet_min, "max": sweet_max},
        "character_type": character_type,
        "bids_history": bids_history[:25]
    }


@app.get("/api/competitors/{name}/client-mapping")
def get_competitor_client_mapping(name: str):
    name_clean = clean_str(name)
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT COALESCE(NULLIF(td.satuan_kerja, ''), t.instansi) as satuan_kerja, 
               t.instansi, 
               COUNT(*) as total_wins, 
               SUM(w.harga_kontrak) as total_contract_value,
               AVG(CASE WHEN t.pagu_val > 0 THEN ((t.pagu_val - w.harga_kontrak) / t.pagu_val) * 100 ELSE 0 END) as avg_discount
        FROM tender_winners w
        JOIN tenders t ON w.nomor_pengadaan = t.nomor_pengadaan
        LEFT JOIN tender_details td ON w.nomor_pengadaan = td.nomor_pengadaan
        WHERE w.nama_pemenang = ?
        GROUP BY COALESCE(NULLIF(td.satuan_kerja, ''), t.instansi), t.instansi
        ORDER BY total_wins DESC, total_contract_value DESC
        LIMIT 20
    """, (name_clean,))
    rows = cursor.fetchall()
    conn.close()

    total_all_wins = sum(r["total_wins"] for r in rows) if rows else 0
    total_all_value = sum(float(r["total_contract_value"] or 0) for r in rows) if rows else 0.0

    clients = []
    for idx, r in enumerate(rows):
        satker = clean_str(r["satuan_kerja"]) or clean_str(r["instansi"])
        instansi = clean_str(r["instansi"]) or satker
        wins = r["total_wins"] or 0
        val = float(r["total_contract_value"] or 0)
        disc = round(float(r["avg_discount"] or 0), 1)
        share = round((wins / total_all_wins) * 100, 1) if total_all_wins > 0 else 0

        clients.append({
            "satuan_kerja": satker,
            "instansi": instansi,
            "total_wins": wins,
            "total_contract_value": val,
            "avg_discount_pct": disc,
            "share_pct": share,
            "is_home_ground": wins >= 2 or (idx == 0 and wins >= 1)
        })

    return {
        "name": name_clean,
        "total_clients": len(clients),
        "total_wins": total_all_wins,
        "total_contract_value": total_all_value,
        "top_client": clients[0] if clients else None,
        "clients": clients
    }


@app.get("/api/competitors/{name}/partner-network")
def get_competitor_partner_network(name: str):
    name_clean = clean_str(name)
    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. Detect formal KSO partnerships where competitor is named in a compound entity name
    cursor.execute("""
        SELECT DISTINCT nama_peserta FROM competitor_evaluations 
        WHERE (nama_peserta LIKE ? OR nama_peserta LIKE ?)
          AND (LOWER(nama_peserta) LIKE '%kso%' OR LOWER(nama_peserta) LIKE '%jo%' OR nama_peserta LIKE '%-%' OR nama_peserta LIKE '%,%')
        UNION
        SELECT DISTINCT nama_pemenang FROM tender_winners
        WHERE (nama_pemenang LIKE ? OR nama_pemenang LIKE ?)
          AND (LOWER(nama_pemenang) LIKE '%kso%' OR LOWER(nama_pemenang) LIKE '%jo%' OR nama_pemenang LIKE '%-%' OR nama_pemenang LIKE '%,%')
    """, (f"%{name_clean}%", f"%{name_clean[:15]}%", f"%{name_clean}%", f"%{name_clean[:15]}%"))
    kso_raw_rows = [r[0] for r in cursor.fetchall()]

    import re
    kso_partners = []
    kso_entities = []

    for ent in kso_raw_rows:
        ent_clean = clean_str(ent)
        if not ent_clean:
            continue
        kso_entities.append(ent_clean)
        
        # Split by typical KSO separators
        parts = re.split(r'\s*[-–,]\s*|\s+(?:kso|k\.s\.o|jo)\s+|\s+dan\s+', ent_clean, flags=re.IGNORECASE)
        for p in parts:
            p_clean = clean_str(p).strip('()[]{}')
            if len(p_clean) > 3 and p_clean.lower() not in ['kso', 'k.s.o', 'jo', 'persero', 'tbk', 'cv', 'pt']:
                if name_clean.lower() not in p_clean.lower() and p_clean.lower() not in name_clean.lower():
                    kso_partners.append({
                        "partner_name": p_clean,
                        "full_entity": ent_clean,
                        "type": "Formal KSO / Konsorsium Resmi"
                    })

    # Deduplicate KSO partners by name
    unique_kso_partners = []
    seen_kso_names = set()
    for kp in kso_partners:
        p_low = kp["partner_name"].lower()
        if p_low not in seen_kso_names:
            seen_kso_names.add(p_low)
            unique_kso_partners.append(kp)

    # 2. Detect frequent co-bidders (informal alliance / competitors appearing together in tenders)
    cursor.execute("""
        SELECT e2.nama_peserta, COUNT(DISTINCT e1.nomor_pengadaan) as match_count,
               MAX(e2.npwp) as npwp,
               SUM(CASE WHEN e2.is_winner = 1 THEN 1 ELSE 0 END) as partner_wins
        FROM competitor_evaluations e1
        JOIN competitor_evaluations e2 ON e1.nomor_pengadaan = e2.nomor_pengadaan
        WHERE e1.nama_peserta = ? AND e2.nama_peserta != ? 
          AND (e1.harga_penawaran > 0 OR e1.harga_terkoreksi > 0 OR e1.is_winner = 1)
          AND (e2.harga_penawaran > 0 OR e2.harga_terkoreksi > 0 OR e2.is_winner = 1)
        GROUP BY e2.nama_peserta
        ORDER BY match_count DESC
        LIMIT 10
    """, (name_clean, name_clean))
    co_bid_rows = cursor.fetchall()
    conn.close()

    co_bidders = []
    for r in co_bid_rows:
        p_name = clean_str(r[0])
        matches = r[1] or 0
        npwp = clean_str(r[2]) or "-"
        p_wins = r[3] or 0

        if matches >= 5:
            rel_label = "🔥 Aliansi Kuat"
            rel_tag = "strong"
        elif matches >= 3:
            rel_label = "⚔️ Rival Rutin"
            rel_tag = "moderate"
        else:
            rel_label = "🤝 Pernah Bertemu"
            rel_tag = "casual"

        co_bidders.append({
            "company_name": p_name,
            "npwp": npwp,
            "joint_tenders_count": matches,
            "partner_wins": p_wins,
            "relationship_label": rel_label,
            "relationship_tag": rel_tag
        })

    # Ecosystem assessment
    has_bumn = any("persero" in (p.get("partner_name", "") + c.get("company_name", "")).lower() for p in unique_kso_partners for c in co_bidders)
    if unique_kso_partners or len(co_bidders) >= 3:
        if has_bumn:
            eco_label = "Didukung Ekosistem BUMN / Korporasi Skala Besar"
            eco_desc = "Kompetitor ini terhubung dengan BUMN atau entitas korporasi besar melalui KSO/Aliansi tender, memiliki keunggulan kapasitas modal dan peralatan."
        else:
            eco_label = "Memiliki Jejaring Aliansi / Mitra Konsorsium Aktif"
            eco_desc = "Kompetitor ini aktif membentuk KSO atau berpartner dengan badan usaha lain pada tender bernilai tinggi."
    else:
        eco_label = "Pemain Independen (Mandiri)"
        eco_desc = "Kompetitor ini sebagian besar maju secara mandiri tanpa aliansi KSO formal yang tercatat."

    return {
        "name": name_clean,
        "kso_entities_count": len(kso_entities),
        "kso_partners": unique_kso_partners,
        "co_bidders": co_bidders,
        "ecosystem": {
            "label": eco_label,
            "description": eco_desc,
            "has_bumn": has_bumn
        }
    }


# ========================================================
# FITUR TAHAP 2: HEAD-TO-HEAD & PREDIKSI EARLY WARNING RADAR
# ========================================================

@app.get("/api/competitors/compare")
def compare_competitors(comp1: str = Query(...), comp2: str = Query(...)):
    name1 = clean_str(comp1)
    name2 = clean_str(comp2)
    if not name1 or not name2:
        raise HTTPException(status_code=400, detail="Nama kedua perusahaan wajib diisi.")

    conn = get_db_connection()
    cursor = conn.cursor()

    def resolve_canonical_name(raw_name):
        # Exact match first
        cursor.execute("""
            SELECT nama_peserta FROM competitor_evaluations WHERE nama_peserta = ?
            UNION
            SELECT nama_pemenang FROM tender_winners WHERE nama_pemenang = ?
            UNION
            SELECT nama_peserta FROM tender_participants WHERE nama_peserta = ?
            LIMIT 1
        """, (raw_name, raw_name, raw_name))
        row = cursor.fetchone()
        if row and row[0]:
            return row[0]
        # Case-insensitive / substring match fallback
        cursor.execute("""
            SELECT nama_peserta FROM competitor_evaluations WHERE nama_peserta LIKE ?
            UNION
            SELECT nama_pemenang FROM tender_winners WHERE nama_pemenang LIKE ?
            UNION
            SELECT nama_peserta FROM tender_participants WHERE nama_peserta LIKE ?
            LIMIT 1
        """, (f"%{raw_name}%", f"%{raw_name}%", f"%{raw_name}%"))
        row = cursor.fetchone()
        if row and row[0]:
            return row[0]
        return raw_name

    name1 = resolve_canonical_name(name1)
    name2 = resolve_canonical_name(name2)

    # 1. Fetch profile snapshots for both companies
    def get_comp_summary(comp_name):
        cursor.execute("""
            SELECT COUNT(DISTINCT nomor_pengadaan) 
            FROM competitor_evaluations 
            WHERE nama_peserta = ?
        """, (comp_name,))
        eval_row = cursor.fetchone()
        eval_tenders = eval_row[0] or 0 if eval_row else 0

        cursor.execute("""
            SELECT COUNT(DISTINCT nomor_pengadaan), SUM(harga_kontrak) 
            FROM tender_winners 
            WHERE nama_pemenang = ?
        """, (comp_name,))
        w_row = cursor.fetchone()
        wins = w_row[0] or 0 if w_row else 0
        contracts = float(w_row[1] or 0) if w_row and w_row[1] is not None else 0.0

        total_tenders = max(eval_tenders, wins)
        win_rate = round((wins / total_tenders) * 100, 1) if total_tenders > 0 else 0.0

        cursor.execute("""
            SELECT COALESCE(NULLIF(td.satuan_kerja, ''), t.instansi) as satker, COUNT(*) as c
            FROM tender_winners w
            JOIN tenders t ON w.nomor_pengadaan = t.nomor_pengadaan
            LEFT JOIN tender_details td ON w.nomor_pengadaan = td.nomor_pengadaan
            WHERE w.nama_pemenang = ?
            GROUP BY COALESCE(NULLIF(td.satuan_kerja, ''), t.instansi)
            ORDER BY c DESC LIMIT 1
        """, (comp_name,))
        satker_row = cursor.fetchone()
        top_satker = satker_row[0] if satker_row and satker_row[0] else "-"

        cursor.execute("""
            SELECT AVG(CASE WHEN t.pagu_val > 0 AND (e.harga_terkoreksi > 0 OR e.harga_penawaran > 0)
                       THEN ((t.pagu_val - COALESCE(NULLIF(e.harga_terkoreksi, 0), e.harga_penawaran)) / t.pagu_val) * 100
                       ELSE NULL END) as avg_disc
            FROM competitor_evaluations e
            JOIN tenders t ON e.nomor_pengadaan = t.nomor_pengadaan
            WHERE e.nama_peserta = ? AND t.pagu_val > 0
        """, (comp_name,))
        disc_row = cursor.fetchone()
        avg_disc = round(float(disc_row[0] or 0), 1) if disc_row and disc_row[0] is not None else 0.0

        if avg_disc > 20.0:
            char_label = "Price Fighter (>20% Diskon)"
            char_tag = "danger"
        elif avg_disc >= 10.0:
            char_label = "Moderat Seimbang (10-20% Diskon)"
            char_tag = "warning"
        else:
            char_label = "Teknis / Margin Tinggi (<10% Diskon)"
            char_tag = "success"

        return {
            "name": comp_name,
            "total_tenders": total_tenders,
            "total_wins": wins,
            "win_rate": win_rate,
            "total_contract_value": contracts,
            "top_satker": top_satker,
            "avg_discount_pct": avg_disc,
            "character_label": char_label,
            "character_tag": char_tag
        }

    summary1 = get_comp_summary(name1)
    summary2 = get_comp_summary(name2)

    # 2. Find mutual tenders (where BOTH competed)
    cursor.execute("""
        SELECT 
            t.nomor_pengadaan,
            t.nama_tender,
            t.instansi,
            COALESCE(NULLIF(td.satuan_kerja, ''), t.instansi) as satuan_kerja,
            t.pagu_val,
            e1.harga_penawaran as c1_penawaran,
            e1.harga_terkoreksi as c1_terkoreksi,
            e1.is_winner as c1_eval_win,
            e2.harga_penawaran as c2_penawaran,
            e2.harga_terkoreksi as c2_terkoreksi,
            e2.is_winner as c2_eval_win,
            w.nama_pemenang,
            w.harga_kontrak
        FROM competitor_evaluations e1
        JOIN competitor_evaluations e2 ON e1.nomor_pengadaan = e2.nomor_pengadaan
        JOIN tenders t ON e1.nomor_pengadaan = t.nomor_pengadaan
        LEFT JOIN tender_details td ON e1.nomor_pengadaan = td.nomor_pengadaan
        LEFT JOIN tender_winners w ON e1.nomor_pengadaan = w.nomor_pengadaan
        WHERE e1.nama_peserta = ? AND e2.nama_peserta = ?
        ORDER BY t.scraped_at DESC
    """, (name1, name2))
    rows = cursor.fetchall()
    conn.close()

    meetings = []
    comp1_wins = 0
    comp2_wins = 0
    other_wins = 0
    comp1_cheaper_count = 0
    comp2_cheaper_count = 0
    price_diffs_rp = []
    price_diffs_pct = []

    for r in rows:
        nomor = r["nomor_pengadaan"]
        nama = r["nama_tender"]
        instansi = r["instansi"]
        satker = r["satuan_kerja"]
        pagu = float(r["pagu_val"] or 0)
        pemenang = clean_str(r["nama_pemenang"] or "")
        kontrak = float(r["harga_kontrak"] or 0)

        # Comp 1 price
        p1 = 0.0
        if pemenang.lower() == name1.lower() and kontrak > 0:
            p1 = kontrak
        elif r["c1_terkoreksi"] and float(r["c1_terkoreksi"]) > 0:
            p1 = float(r["c1_terkoreksi"])
        elif r["c1_penawaran"] and float(r["c1_penawaran"]) > 0:
            p1 = float(r["c1_penawaran"])

        # Comp 2 price
        p2 = 0.0
        if pemenang.lower() == name2.lower() and kontrak > 0:
            p2 = kontrak
        elif r["c2_terkoreksi"] and float(r["c2_terkoreksi"]) > 0:
            p2 = float(r["c2_terkoreksi"])
        elif r["c2_penawaran"] and float(r["c2_penawaran"]) > 0:
            p2 = float(r["c2_penawaran"])

        # Winner determination
        if pemenang.lower() == name1.lower() or bool(r["c1_eval_win"]):
            winner_key = "comp1"
            winner_name = name1
            comp1_wins += 1
        elif pemenang.lower() == name2.lower() or bool(r["c2_eval_win"]):
            winner_key = "comp2"
            winner_name = name2
            comp2_wins += 1
        elif pemenang:
            winner_key = "other"
            winner_name = pemenang
            other_wins += 1
        else:
            winner_key = "none"
            winner_name = "-"

        # Pricing comparison
        diff_rp = 0.0
        diff_pct = 0.0
        cheaper = "-"
        if p1 > 0 and p2 > 0:
            diff_rp = abs(p1 - p2)
            price_diffs_rp.append(diff_rp)
            if pagu > 0:
                d1 = ((pagu - p1) / pagu) * 100
                d2 = ((pagu - p2) / pagu) * 100
                diff_pct = round(abs(d1 - d2), 1)
                price_diffs_pct.append(diff_pct)
            if p1 < p2:
                cheaper = "comp1"
                comp1_cheaper_count += 1
            elif p2 < p1:
                cheaper = "comp2"
                comp2_cheaper_count += 1

        p1_disc = round(((pagu - p1) / pagu) * 100, 1) if pagu > 0 and p1 > 0 else 0.0
        p2_disc = round(((pagu - p2) / pagu) * 100, 1) if pagu > 0 and p2 > 0 else 0.0

        meetings.append({
            "nomor_pengadaan": nomor,
            "nama_tender": nama,
            "instansi": instansi,
            "satuan_kerja": satker,
            "pagu": pagu,
            "pagu_val": pagu,
            "comp1_price": p1,
            "comp1_discount_pct": p1_disc,
            "comp2_price": p2,
            "comp2_discount_pct": p2_disc,
            "winner_key": winner_key,
            "winner_name": winner_name,
            "winning_price": kontrak if kontrak > 0 else (p1 if winner_key == 'comp1' else (p2 if winner_key == 'comp2' else 0.0)),
            "price_diff_rp": diff_rp,
            "price_diff_pct": diff_pct,
            "cheaper": cheaper
        })

    total_meetings = len(meetings)
    avg_diff_rp = round(sum(price_diffs_rp) / len(price_diffs_rp), 0) if price_diffs_rp else 0.0
    avg_diff_pct = round(sum(price_diffs_pct) / len(price_diffs_pct), 1) if price_diffs_pct else 0.0

    # Verdict synthesis
    verdict_badge = "neutral"
    if total_meetings == 0:
        verdict = f"Belum tercatat riwayat lelang di mana {name1} dan {name2} bertarung langsung dalam database SPSE."
        verdict_title = "Belum Pernah Bertemu Langsung"
        advice = "Pelajari terlebih dahulu pola penawaran masing-masing di satker target sebelum merancang strategi penawaran."
    elif comp1_wins > comp2_wins:
        verdict_badge = "comp1"
        verdict_title = f"{name1} Unggul Head-to-Head"
        verdict = f"Dalam {total_meetings} lelang bersama, {name1} menang {comp1_wins}x berbanding {comp2_wins}x oleh {name2}."
        if comp1_cheaper_count > comp2_cheaper_count:
            verdict += f" {name1} terbukti lebih agresif menawarkan harga lebih hemat ({comp1_cheaper_count} kali) dengan rerata selisih Rp {avg_diff_rp:,.0f}."
        else:
            verdict += f" Meskipun {name2} sering menawar lebih rendah, {name1} lebih unggul dalam kualifikasi teknis dan keabsahan dokumen Pokja."
        advice = f"Pertahankan margin sehat dan portofolio personil ahli yang menjadi pembeda utama dari {name2}."
    elif comp2_wins > comp1_wins:
        verdict_badge = "comp2"
        verdict_title = f"{name2} Unggul Head-to-Head"
        verdict = f"Dalam {total_meetings} lelang bersama, {name2} memenangkan {comp2_wins} tender sementara {name1} memenangkan {comp1_wins} tender."
        if comp2_cheaper_count > comp1_cheaper_count:
            verdict += f" {name2} konsisten memasang harga lebih kompetitif ({comp2_cheaper_count} kali) dengan selisih rata-rata Rp {avg_diff_rp:,.0f}."
        else:
            verdict += f" {name2} memiliki tingkat keberhasilan evaluasi spesifikasi dan personil lebih solid di hadapan Pokja."
        advice = f"Perketat efisiensi biaya HPS dan siapkan mitigasi dokumen teknis guna menandingi agresivitas penawaran {name2}."
    else:
        verdict_badge = "draw"
        verdict_title = "Rivalitas Imbang (50:50)"
        verdict = f"Kedua perusahaan imbang dengan skor {comp1_wins} - {comp2_wins} dari total {total_meetings} tender bersama."
        if other_wins > 0:
            verdict += f" Sebanyak {other_wins} lelang berhasil dimenangkan peserta lain."
        advice = "Gunakan strategi penawaran harga presisi pada rentang sweet spot dan cermati kelengkapan kualifikasi administratif lawan."

    return {
        "comp1": summary1,
        "comp2": summary2,
        "head_to_head": {
            "total_meetings": total_meetings,
            "comp1_wins": comp1_wins,
            "comp2_wins": comp2_wins,
            "other_wins": other_wins,
            "comp1_cheaper_count": comp1_cheaper_count,
            "comp2_cheaper_count": comp2_cheaper_count,
            "avg_diff_rp": avg_diff_rp,
            "avg_diff_pct": avg_diff_pct,
            "verdict_title": verdict_title,
            "verdict_badge": verdict_badge,
            "verdict_description": verdict,
            "strategic_verdict": verdict,
            "advice": advice
        },
        "meetings": meetings
    }


@app.get("/api/competitors/export-dossier-pdf")
def export_competitor_dossier_pdf(name: str):
    name_clean = clean_str(name)
    if not name_clean:
        raise HTTPException(status_code=400, detail="Nama kompetitor wajib diisi.")
    
    profile = get_competitor_profile(name_clean)
    pricing = get_competitor_pricing_pattern(name_clean)
    client_map = get_competitor_client_mapping(name_clean)
    partners = get_competitor_partner_network(name_clean)
    disqualifications = get_competitor_disqualifications(name_clean)
    
    pdf_bytes = generate_competitor_dossier_pdf(
        profile=profile,
        pricing=pricing,
        client_map=client_map,
        partners=partners,
        disqualifications=disqualifications
    )
    
    safe_filename = "".join(c for c in name_clean if c.isalnum() or c in (' ', '_', '-')).strip().replace(' ', '_')
    filename = f"Dossier_Intelijen_{safe_filename}.pdf"
    
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )


@app.get("/api/competitors/export-dossier-excel")
def export_competitor_dossier_excel(name: str):
    name_clean = clean_str(name)
    if not name_clean:
        raise HTTPException(status_code=400, detail="Nama kompetitor wajib diisi.")
    
    profile = get_competitor_profile(name_clean)
    pricing = get_competitor_pricing_pattern(name_clean)
    client_map = get_competitor_client_mapping(name_clean)
    partners = get_competitor_partner_network(name_clean)
    disqualifications = get_competitor_disqualifications(name_clean)
    
    excel_bytes = generate_competitor_dossier_excel(
        profile=profile,
        pricing=pricing,
        client_map=client_map,
        partners=partners,
        disqualifications=disqualifications
    )
    
    safe_filename = "".join(c for c in name_clean if c.isalnum() or c in (' ', '_', '-')).strip().replace(' ', '_')
    filename = f"Dossier_Intelijen_{safe_filename}.xlsx"
    
    return Response(
        content=excel_bytes,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )


@app.get("/api/competitors/compare/export-pdf")
def export_head_to_head_pdf(comp1: str = Query(...), comp2: str = Query(...)):
    c1 = clean_str(comp1)
    c2 = clean_str(comp2)
    if not c1 or not c2:
        raise HTTPException(status_code=400, detail="Kedua nama perusahaan wajib diisi.")
    
    compare_data = compare_competitors(comp1=c1, comp2=c2)
    pdf_bytes = generate_head_to_head_pdf(compare_data)
    
    safe_c1 = "".join(c for c in c1 if c.isalnum() or c in (' ', '_', '-')).strip().replace(' ', '_')[:15]
    safe_c2 = "".join(c for c in c2 if c.isalnum() or c in (' ', '_', '-')).strip().replace(' ', '_')[:15]
    filename = f"H2H_Intelijen_{safe_c1}_VS_{safe_c2}.pdf"
    
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )


@app.get("/api/competitors/compare/export-excel")
def export_head_to_head_excel(comp1: str = Query(...), comp2: str = Query(...)):
    c1 = clean_str(comp1)
    c2 = clean_str(comp2)
    if not c1 or not c2:
        raise HTTPException(status_code=400, detail="Kedua nama perusahaan wajib diisi.")
    
    compare_data = compare_competitors(comp1=c1, comp2=c2)
    excel_bytes = generate_head_to_head_excel(compare_data)
    
    safe_c1 = "".join(c for c in c1 if c.isalnum() or c in (' ', '_', '-')).strip().replace(' ', '_')[:15]
    safe_c2 = "".join(c for c in c2 if c.isalnum() or c in (' ', '_', '-')).strip().replace(' ', '_')[:15]
    filename = f"H2H_Intelijen_{safe_c1}_VS_{safe_c2}.xlsx"
    
    return Response(
        content=excel_bytes,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )


@app.get("/api/tenders/{nomor}/predicted-competitors")
def get_predicted_competitors(nomor: str):
    nomor_clean = clean_str(nomor)
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT t.nomor_pengadaan, t.nama_tender, t.instansi, t.kategori, t.pagu_val, t.jenis_pengadaan,
               td.satuan_kerja
        FROM tenders t
        LEFT JOIN tender_details td ON t.nomor_pengadaan = td.nomor_pengadaan
        WHERE t.nomor_pengadaan = ?
    """, (nomor_clean,))
    target = cursor.fetchone()
    if not target:
        conn.close()
        return {"nomor_pengadaan": nomor_clean, "predicted_competitors": []}

    instansi = clean_str(target["instansi"] or "")
    satker = clean_str(target["satuan_kerja"] or "")
    pagu_val = float(target["pagu_val"] or 0)

    # 1. Competitors with wins or participations in the same Satker
    satker_wins = {}
    satker_parts = {}
    if satker and satker != '-':
        cursor.execute("""
            SELECT w.nama_pemenang, COUNT(*) as c, SUM(w.harga_kontrak) as total_val
            FROM tender_winners w
            JOIN tenders t ON w.nomor_pengadaan = t.nomor_pengadaan
            LEFT JOIN tender_details td ON w.nomor_pengadaan = td.nomor_pengadaan
            WHERE td.satuan_kerja = ? AND w.nama_pemenang != ''
            GROUP BY w.nama_pemenang
        """, (satker,))
        for r in cursor.fetchall():
            satker_wins[clean_str(r[0])] = {"wins": r[1], "value": float(r[2] or 0)}

        cursor.execute("""
            SELECT ce.nama_peserta, COUNT(DISTINCT ce.nomor_pengadaan) as c
            FROM competitor_evaluations ce
            LEFT JOIN tender_details td ON ce.nomor_pengadaan = td.nomor_pengadaan
            WHERE td.satuan_kerja = ? AND ce.nama_peserta != ''
            GROUP BY ce.nama_peserta
        """, (satker,))
        for r in cursor.fetchall():
            satker_parts[clean_str(r[0])] = r[1]

    # 2. Competitors with wins or participations in the same Instansi
    instansi_wins = {}
    instansi_parts = {}
    if instansi:
        cursor.execute("""
            SELECT w.nama_pemenang, COUNT(*) as c
            FROM tender_winners w
            JOIN tenders t ON w.nomor_pengadaan = t.nomor_pengadaan
            WHERE t.instansi = ? AND w.nama_pemenang != ''
            GROUP BY w.nama_pemenang
        """, (instansi,))
        for r in cursor.fetchall():
            instansi_wins[clean_str(r[0])] = r[1]

        cursor.execute("""
            SELECT ce.nama_peserta, COUNT(DISTINCT ce.nomor_pengadaan) as c
            FROM competitor_evaluations ce
            JOIN tenders t ON ce.nomor_pengadaan = t.nomor_pengadaan
            WHERE t.instansi = ? AND ce.nama_peserta != ''
            GROUP BY ce.nama_peserta
        """, (instansi,))
        for r in cursor.fetchall():
            instansi_parts[clean_str(r[0])] = r[1]

    all_candidates = set(satker_wins.keys()) | set(satker_parts.keys()) | set(instansi_wins.keys()) | set(instansi_parts.keys())
    if not all_candidates:
        cursor.execute("""
            SELECT w.nama_pemenang, COUNT(*) as c
            FROM tender_winners w
            WHERE w.nama_pemenang != ''
            GROUP BY w.nama_pemenang
            ORDER BY c DESC LIMIT 8
        """)
        for r in cursor.fetchall():
            all_candidates.add(clean_str(r[0]))

    # Pre-rank and limit to top 8 candidates to eliminate N+1 latency
    def _quick_rank(name):
        return (
            satker_wins.get(name, {}).get("wins", 0) * 10
            + satker_parts.get(name, 0) * 3
            + instansi_wins.get(name, 0) * 2
            + instansi_parts.get(name, 0)
        )

    candidate_list = [c for c in all_candidates if c and len(c) >= 3]
    candidate_list.sort(key=_quick_rank, reverse=True)
    top_candidates = candidate_list[:8]

    scored_competitors = []
    for cand in top_candidates:
        sw = satker_wins.get(cand, {}).get("wins", 0)
        sp = satker_parts.get(cand, 0)
        iw = instansi_wins.get(cand, 0)
        ip = instansi_parts.get(cand, 0)

        score = 0
        reasons = []

        if sw > 0:
            score += min(45, sw * 25)
            reasons.append(f"Juara Bertahan Satker ({sw}x)")
        elif sp > 0:
            score += min(25, sp * 10)
            reasons.append(f"Spesialis Satker Ini ({sp}x Ikut)")

        if iw > 0:
            score += min(30, iw * 10)
            reasons.append(f"Kolektor Tender Instansi ({iw}x)")
        elif ip > 0:
            score += min(15, ip * 5)
            reasons.append(f"Aktif di Instansi ({ip}x)")

        # Quick price pattern check
        cursor.execute("""
            SELECT AVG(CASE WHEN t.pagu_val > 0 AND (e.harga_terkoreksi > 0 OR e.harga_penawaran > 0)
                       THEN ((t.pagu_val - COALESCE(NULLIF(e.harga_terkoreksi, 0), e.harga_penawaran)) / t.pagu_val) * 100
                       ELSE NULL END) as avg_disc
            FROM competitor_evaluations e
            JOIN tenders t ON e.nomor_pengadaan = t.nomor_pengadaan
            WHERE e.nama_peserta = ? AND t.pagu_val > 0
        """, (cand,))
        p_row = cursor.fetchone()
        avg_disc = round(float(p_row[0] or 0), 1) if p_row and p_row[0] is not None else None

        total_score = min(98, max(25, score + 15))
        if total_score >= 70:
            threat_level = "Tinggi (Kritis)"
            threat_badge = "danger"
        elif total_score >= 45:
            threat_level = "Waspada (Potensial)"
            threat_badge = "warning"
        else:
            threat_level = "Moderat"
            threat_badge = "info"

        price_hint = f"Rerata diskon penawaran: {avg_disc}% Pagu" if avg_disc and avg_disc > 0 else "Karakter penawaran: Standar Pokja"

        scored_competitors.append({
            "company_name": cand,
            "nama_peserta": cand,
            "threat_score": total_score,
            "threat_level": threat_level,
            "threat_badge": threat_level,
            "badge_type": threat_badge,
            "satker_wins": sw,
            "satker_win_count": sw,
            "instansi_wins": iw,
            "instansi_win_count": iw,
            "satker_participations": sp,
            "instansi_participations": ip,
            "reasons": reasons if reasons else ["Memiliki rekam jejak aktif pada klaster tender terkait"],
            "reason_tags": reasons if reasons else ["Rekam Jejak Aktif"],
            "avg_discount_pct": avg_disc,
            "price_hint": price_hint
        })

    conn.close()
    scored_competitors.sort(key=lambda x: (x["threat_score"], x["satker_wins"], x["instansi_wins"]), reverse=True)
    final_list = scored_competitors[:5]

    return {
        "nomor_pengadaan": nomor_clean,
        "instansi": instansi,
        "satuan_kerja": satker,
        "total_predicted": len(final_list),
        "predicted_competitors": final_list,
        "predictions": final_list
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

# ========================================================
# SEO, SITEMAP & AI SEARCH (GEO) ENDPOINTS
# ========================================================

@app.get("/sitemap.xml")
def get_sitemap():
    base_url = "https://spyspse.com"
    today_iso = datetime.now().strftime("%Y-%m-%d")
    
    # Static public routes
    urls = [
        {"loc": f"{base_url}/", "changefreq": "daily", "priority": "1.0", "lastmod": today_iso},
        {"loc": f"{base_url}/#/blog", "changefreq": "daily", "priority": "0.9", "lastmod": today_iso},
        {"loc": f"{base_url}/#/competitors", "changefreq": "weekly", "priority": "0.85", "lastmod": today_iso},
        {"loc": f"{base_url}/#/docs", "changefreq": "monthly", "priority": "0.8", "lastmod": today_iso},
    ]
    
    # Dynamic published articles
    try:
        articles = get_all_articles(include_unpublished=False)
        for art in articles:
            slug = art.get("slug")
            if not slug:
                continue
            updated_at = art.get("updated_at") or art.get("created_at")
            lastmod = today_iso
            if updated_at:
                try:
                    lastmod = str(updated_at)[:10]
                except Exception:
                    pass
            # Clean server-friendly link
            urls.append({
                "loc": f"{base_url}/artikel/{slug}",
                "changefreq": "weekly",
                "priority": "0.9",
                "lastmod": lastmod
            })
            # SPA hash link
            urls.append({
                "loc": f"{base_url}/#/artikel/{slug}",
                "changefreq": "weekly",
                "priority": "0.85",
                "lastmod": lastmod
            })
    except Exception as e:
        logging.error(f"Sitemap articles error: {e}")

    xml_lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ]
    for u in urls:
        xml_lines.append("  <url>")
        xml_lines.append(f"    <loc>{u['loc']}</loc>")
        xml_lines.append(f"    <lastmod>{u['lastmod']}</lastmod>")
        xml_lines.append(f"    <changefreq>{u['changefreq']}</changefreq>")
        xml_lines.append(f"    <priority>{u['priority']}</priority>")
        xml_lines.append("  </url>")
    xml_lines.append("</urlset>")
    
    xml_content = "\n".join(xml_lines)
    return Response(content=xml_content, media_type="application/xml; charset=utf-8")


@app.get("/robots.txt")
def get_robots_txt():
    content = """# robots.txt for Spy SPSE (https://spyspse.com)
User-agent: *
Allow: /
Allow: /blog
Allow: /artikel/
Allow: /llms.txt
Allow: /.well-known/llms.txt
Allow: /sitemap.xml
Disallow: /api/admin/
Disallow: /admin/

# AI Search Crawlers & LLM Engines (GEO - Generative Engine Optimization)
User-agent: GPTBot
Allow: /
Allow: /llms.txt

User-agent: ChatGPT-User
Allow: /
Allow: /llms.txt

User-agent: PerplexityBot
Allow: /
Allow: /llms.txt

User-agent: ClaudeBot
Allow: /
Allow: /llms.txt

User-agent: anthropic-ai
Allow: /
Allow: /llms.txt

User-agent: Google-Extended
Allow: /
Allow: /llms.txt

User-agent: Applebot-Extended
Allow: /
Allow: /llms.txt

User-agent: Bytespider
Allow: /

User-agent: CCBot
Allow: /

Sitemap: https://spyspse.com/sitemap.xml
"""
    return Response(content=content, media_type="text/plain; charset=utf-8")


@app.get("/llms.txt")
@app.get("/.well-known/llms.txt")
def get_llms_txt():
    llms_path = Path(__file__).resolve().parent.parent / "frontend" / "public" / "llms.txt"
    if llms_path.exists():
        content = llms_path.read_text(encoding="utf-8")
    else:
        content = """# Spy SPSE (https://spyspse.com)
> Spy SPSE adalah platform intelijen pengadaan dan pemantauan tender SPSE (LPSE) se-Indonesia yang dirancang untuk membantu kontraktor, konsultan, dan vendor pengadaan pemerintah memenangkan tender secara efisien dan berbasis data akurat.
"""
    try:
        published_articles = get_all_articles(include_unpublished=False)
        if published_articles:
            content += "\n## Daftar Artikel, Panduan & Studi Kasus Taktis Terbaru\n"
            for art in published_articles[:50]:
                art_slug = art.get("slug", "")
                art_title = (art.get("title") or "").replace("{lpse_name}", "Indonesia")
                art_desc = (art.get("meta_description") or "").replace("{lpse_name}", "Indonesia")
                art_cat = art.get("category") or "Informasi"
                if art_slug and art_title:
                    line = f"- [{art_title}](https://spyspse.com/artikel/{art_slug}) [{art_cat}]"
                    if art_desc:
                        line += f": {art_desc}"
                    content += line + "\n"
    except Exception:
        pass
    return Response(content=content, media_type="text/plain; charset=utf-8")


@app.get("/blog")
def redirect_to_blog():
    return HTMLResponse(content='<script>window.location.replace("/#/blog");</script>', status_code=200)


@app.get("/artikel/{slug}", response_class=HTMLResponse)
@app.get("/artikel/{slug}/lpse/{lpse_slug}", response_class=HTMLResponse)
def get_article_social_preview(slug: str, lpse_slug: Optional[str] = None):
    article = get_article_by_slug(slug)
    if not article or article.get("is_published") != 1:
        return HTMLResponse(content='<script>window.location.replace("/#/blog");</script>', status_code=200)
    
    # Resolve dynamic LPSE name
    lpse_name = "Indonesia"
    if lpse_slug and lpse_slug != "nasional":
        try:
            instances = json.loads(get_setting("lpse_instances", "[]"))
            for inst in instances:
                if inst.get("slug") == lpse_slug:
                    lpse_name = inst.get("name", "Indonesia")
                    break
        except Exception:
            pass
            
    import re
    title = (article.get("title") or "Artikel Tender LPSE").replace("{lpse_name}", lpse_name)
    raw_content = (article.get("content") or "").replace("{lpse_name}", lpse_name)
    plain_body = ' '.join(re.sub(r'<[^>]+>', ' ', raw_content).split())
    meta_desc = article.get("meta_description") or ""
    if not meta_desc:
        meta_desc = (plain_body[:155] + "...") if len(plain_body) > 155 else plain_body
    else:
        meta_desc = meta_desc.replace("{lpse_name}", lpse_name)
        
    meta_keywords = (article.get("meta_keywords") or "spy spse, tender lpse, analisis kompetitor tender, e-procurement").replace("{lpse_name}", lpse_name)
    category = article.get("category") or "Strategi Tender & E-Procurement"
    created_at = article.get("created_at") or ""
    updated_at = article.get("updated_at") or created_at
        
    image_url = article.get("image_url") or "https://spyspse.com/static/og-banner.png"
    if image_url.startswith("/"):
        image_url = f"https://spyspse.com{image_url}"
        
    canonical_url = f"https://spyspse.com/artikel/{slug}" + (f"/lpse/{lpse_slug}" if lpse_slug and lpse_slug != 'nasional' else "")
    spa_target_hash = f"/#/artikel/{slug}" + (f"/lpse/{lpse_slug}" if lpse_slug and lpse_slug != 'nasional' else "")

    doc_html = ""
    if article.get("document_url"):
        doc_title = article.get("document_title") or "Dokumen Lampiran Resmi"
        doc_url = article.get("document_url")
        if doc_url.startswith("/"):
            doc_url = f"https://spyspse.com{doc_url}"
        doc_html = f'<section class="doc-attachment"><h3>Lampiran Dokumen Resmi</h3><p><a href="{doc_url}">{doc_title}</a></p></section>'

    structured_data = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Organization",
                "@id": "https://spyspse.com/#organization",
                "name": "Spy SPSE",
                "url": "https://spyspse.com/",
                "logo": "https://spyspse.com/favicon.svg",
                "description": "Platform intelijen pemantauan tender SPSE/LPSE seluruh Indonesia dan strategi pemenangan pengadaan pemerintah."
            },
            {
                "@type": "SoftwareApplication",
                "@id": "https://spyspse.com/#software",
                "name": "Spy SPSE",
                "alternateName": "Spy SPSE - E-Procurement & Tender Competitor Intelligence Tool",
                "operatingSystem": "Web, Windows, macOS, Android, iOS",
                "applicationCategory": "BusinessApplication",
                "applicationSubCategory": "E-Procurement, Tender Monitoring & Competitor Intelligence Software",
                "url": "https://spyspse.com/",
                "provider": {"@id": "https://spyspse.com/#organization"},
                "offers": {
                    "@type": "Offer",
                    "price": "150000",
                    "priceCurrency": "IDR",
                    "availability": "https://schema.org/InStock",
                    "url": "https://spyspse.com/"
                },
                "description": "Tool e-procurement dan platform intelijen tender LPSE/SPSE Indonesia untuk memantau peluang lelang pemerintah, membaca pola bidding & rasio diskon kompetitor (Bidding Sweet Spot), mendeteksi alasan gugur evaluasi Pokja (Spy Weakness Matrix), memetakan Satker dominan, komparasi Head-to-Head peserta tender, Early Warning Radar, serta notifikasi WhatsApp realtime.",
                "featureList": [
                    "Radar Notifikasi Tender WhatsApp Realtime",
                    "Monitoring Tender & Non-Tender Nasional Seluruh LPSE Indonesia",
                    "Analisis Profil Badan Usaha, Win Rate & Riwayat Kontrak Kompetitor",
                    "Analisis Pola Penawaran Harga & Bidding Sweet Spot (% Rasio terhadap Pagu/HPS)",
                    "Spy Weakness Matrix: Deteksi 6 Klaster Titik Lemah & Alasan Gugur Evaluasi Pokja",
                    "Pemetaan Klien & Basis Wilayah Satker Dominan (Home Ground Kompetitor)",
                    "Analisis Jejaring KSO, Konsorsium & Aliansi Co-Bidders",
                    "Komparasi Head-to-Head (Duel Statistik & Rekam Jejak Bentrok 2 Perusahaan)",
                    "Early Warning Radar: Prediksi Kompetitor & Threat Score pada Tender Aktif",
                    "Export Executive Intelligence Dossier (Laporan Rahasia PDF & Excel)"
                ]
            },
            {
                "@type": "Article",
                "@id": f"{canonical_url}#article",
                "mainEntityOfPage": canonical_url,
                "headline": title,
                "description": meta_desc,
                "keywords": meta_keywords,
                "articleSection": category,
                "articleBody": plain_body,
                "image": [image_url],
                "url": canonical_url,
                "inLanguage": "id-ID",
                "datePublished": created_at,
                "dateModified": updated_at,
                "author": {"@id": "https://spyspse.com/#organization"},
                "publisher": {"@id": "https://spyspse.com/#organization"},
                "about": {"@id": "https://spyspse.com/#software"},
                "mentions": [{"@id": "https://spyspse.com/#software"}]
            }
        ]
    }
    
    html = f"""<!doctype html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} | Spy SPSE</title>
    <meta name="description" content="{meta_desc}">
    <meta name="keywords" content="{meta_keywords}">
    <link rel="canonical" href="{canonical_url}">
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
    
    <!-- OpenGraph Facebook / WhatsApp -->
    <meta property="og:type" content="article">
    <meta property="og:site_name" content="Spy SPSE">
    <meta property="og:title" content="{title}">
    <meta property="og:description" content="{meta_desc}">
    <meta property="og:image" content="{image_url}">
    <meta property="og:url" content="{canonical_url}">
    <meta property="og:locale" content="id_ID">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{title}">
    <meta name="twitter:description" content="{meta_desc}">
    <meta name="twitter:image" content="{image_url}">
    
    <!-- JSON-LD Article & SoftwareApplication for Google & AI Engines (GEO) -->
    <script type="application/ld+json">
    {json.dumps(structured_data, ensure_ascii=False, indent=2)}
    </script>
    
    <!-- Instant Client Redirect to SPA Interactive View -->
    <script>
      window.location.replace('{spa_target_hash}');
    </script>
    <style>
      body {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0b0f19; color: #f3f4f6; padding: 40px 20px; max-width: 820px; margin: 0 auto; line-height: 1.7; }}
      a {{ color: #818cf8; text-decoration: none; font-weight: 600; }}
      .btn {{ display: inline-block; background: #4f46e5; color: #fff; padding: 12px 24px; border-radius: 8px; margin-top: 20px; }}
      .tool-summary {{ margin-top: 32px; padding: 20px; border: 1px solid #312e81; border-radius: 12px; background: #111827; }}
    </style>
</head>
<body>
    <article>
        <header>
            <p>Kategori: {category} | Wilayah LPSE: {lpse_name}</p>
            <h1>{title}</h1>
            <p><em>{meta_desc}</em></p>
        </header>
        <div class="article-content">
            {raw_content}
        </div>
        {doc_html}
        <aside class="tool-summary">
            <h2>Tentang Spy SPSE — E-Procurement &amp; Competitor Intelligence Tool</h2>
            <p><strong>Spy SPSE</strong> (<a href="https://spyspse.com">https://spyspse.com</a>) adalah platform intelijen tender LPSE/SPSE Indonesia yang menyediakan fitur Analisis Pola Penawaran Harga (Bidding Sweet Spot), Spy Weakness Matrix (Deteksi 6 Klaster Alasan Gugur Pokja), Pemetaan Satker Dominan, Komparasi Head-to-Head Kompetitor, Early Warning Radar, serta Radar Notifikasi Tender WhatsApp Realtime.</p>
            <p><a href="{spa_target_hash}" class="btn">Buka Artikel Interaktif di Spy SPSE &rarr;</a></p>
        </aside>
    </article>
</body>
</html>"""
    return HTMLResponse(content=html)


# ARTICLES / BLOG ENDPOINTS
@app.get("/api/public/articles")
def list_public_articles(limit: Optional[int] = Query(None), category: Optional[str] = Query(None)):
    articles = get_all_articles(include_unpublished=False)
    if category:
        articles = [a for a in articles if (a.get("category") or "").strip().lower() == category.strip().lower()]
    if limit is not None:
        articles = articles[:limit]
    return articles

@app.get("/api/public/article-categories")
def list_public_article_categories():
    return get_article_categories()

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
            youtube_embed=req.youtube_embed,
            document_title=req.document_title,
            document_url=req.document_url,
            document_type=req.document_type,
            category=req.category
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
            youtube_embed=req.youtube_embed,
            document_title=req.document_title,
            document_url=req.document_url,
            document_type=req.document_type,
            category=req.category
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
        if file_ext not in [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"]:
            raise HTTPException(status_code=400, detail="Format file tidak didukung. Harap upload gambar (JPG, PNG, WebP, GIF, SVG).")
            
        # Unique filename using timestamp
        filename = f"img_{int(datetime.now().timestamp())}{file_ext}"
        filepath = UPLOAD_DIR / filename
        
        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        return {"status": "success", "url": f"/static/uploads/{filename}", "filename": file.filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal mengunggah gambar: {str(e)}")

@app.post("/api/admin/articles/upload-document")
def admin_upload_article_document(file: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Akses ditolak.")
    try:
        file_ext = Path(file.filename).suffix.lower()
        if file_ext not in [".pdf", ".doc", ".docx"]:
            raise HTTPException(status_code=400, detail="Format file tidak didukung. Harap upload dokumen PDF atau Word.")
            
        clean_name = re.sub(r'[^a-zA-Z0-9_-]', '_', Path(file.filename).stem)[:30]
        filename = f"doc_{int(datetime.now().timestamp())}_{clean_name}{file_ext}"
        filepath = UPLOAD_DIR / filename
        
        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        return {"status": "success", "url": f"/static/uploads/{filename}", "filename": file.filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal mengunggah dokumen: {str(e)}")

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