# 🚀 Panduan Deployment Produksi: **Spy SPSE**

> **Dokumen Resmi Deployment & Operational Runbook**
> Panduan ini disusun secara komprehensif agar dapat dipahami dan dieksekusi dengan mudah oleh **Developer/System Administrator (Human)** maupun **AI Assistant / Agentic CLI**.

---

## 📌 Daftar Isi
1. [Spesifikasi Server & Prasyarat](#1-spesifikasi-server--prasyarat)
2. [Instalasi Runtime & Dependensi Server](#2-instalasi-runtime--dependensi-server)
3. [Kloning Repositori & Konfigurasi Environment](#3-kloning-repositori--konfigurasi-environment)
4. [Konfigurasi & Migrasi Database PostgreSQL](#4-konfigurasi--migrasi-database-postgresql)
5. [Build Production Frontend (React + Vite)](#5-build-production-frontend-react--vite)
6. [Konfigurasi Systemd Services (Pemisahan Process)](#6-konfigurasi-systemd-services-pemisahan-process)
7. [Konfigurasi Nginx Reverse Proxy & SSL (HTTPS)](#7-konfigurasi-nginx-reverse-proxy--ssl-https)
8. [Best Practices Anti-Spam WA & Anti-Block LPSE](#8-best-practices-anti-spam-wa--anti-block-lpse)
9. [Script Backup Harian & Monitoring Log](#9-script-backup-harian--monitoring-log)

---

## 1. Spesifikasi Server & Prasyarat

### Rekomendasi Hardware Server (0 - 1.000 Pengguna)
* **OS**: Ubuntu 22.04 LTS (64-bit)
* **vCPU**: 2 Core High-Performance vCPU
* **RAM**: 4 GB RAM (Minimal 4 GB untuk menampung PostgreSQL + Python Crawler)
* **Storage**: 60 GB NVMe SSD
* **Akses**: Akses root / sudoer via SSH

---

## 2. Instalasi Runtime & Dependensi Server

Jalankan perintah berikut di terminal SSH server Ubuntu Anda:

```bash
# Update sistem
sudo apt update && sudo apt upgrade -y

# Install dependensi dasar & build tools
sudo apt install -y curl git build-essential libpq-dev python3-pip python3-venv nginx certbot python3-certbot-nginx

# Install PostgreSQL 14+
sudo apt install -y postgresql postgresql-contrib

# Install Node.js 18 LTS (via NodeSource)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

Verifikasi versi terpasang:
```bash
python3 --version
node -v
npm -v
psql --version
```

---

## 3. Kloning Repositori & Konfigurasi Environment

### A. Kloning Source Code
```bash
# Buat direktori aplikasi
sudo mkdir -p /var/www/monitoringspse
sudo chown -R $USER:$USER /var/www/monitoringspse

# Clone repositori
git clone https://github.com/username/monitoringspse.git /var/www/monitoringspse
cd /var/www/monitoringspse
```

### B. Setup Python Virtual Environment
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
pip install -e .
```

### C. Konfigurasi File `.env` Produksi
Buat file `/var/www/monitoringspse/.env` (atau di folder `/var/www/monitoringspse/backend/.env`):

```env
# Node / Python Environment
ENVIRONMENT=production

# Database URL (PostgreSQL)
DATABASE_URL=postgresql://spse_user:PasswordKuat123!@localhost:5432/spse_db

# App Security
SECRET_KEY=isi-dengan-secret-key-acak-panjang-dan-aman-32-karakter

# Gateway & Email Integrations (Opsional)
WHATSAPP_API_TOKEN=isi_token_fonnte_anda
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=emailanda@gmail.com
SMTP_PASS=app_password_anda

# Proxy (Opsional jika server IP diblokir LPSE tertentu)
# SPSE_PROXY=http://user:pass@proxy-ip:port
```

---

## 4. Konfigurasi & Migrasi Database PostgreSQL

### A. Buat Database & User di PostgreSQL
```bash
sudo -u postgres psql -c "CREATE DATABASE spse_db;"
sudo -u postgres psql -c "CREATE USER spse_user WITH PASSWORD 'PasswordKuat123!';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE spse_db TO spse_user;"
sudo -u postgres psql -d spse_db -c "GRANT ALL ON SCHEMA public TO spse_user;"
```

### B. Eksekusi Script Migrasi & Seeding
```bash
cd /var/www/monitoringspse
source .venv/bin/activate

# 1. Jalankan migrasi schema & data otomatis
python3 -m backend.migrate_sqlite_to_postgres

# 2. Seed akun Super Admin awal
python3 -m backend.seed_admin
# Admin Default: admin@spyspse.com / admin123 (Ubah kata sandi setelah login!)

# (Opsional) Reset & bersihkan ulang seluruh isi database
python3 -m backend.reset_db
```

---

## 5. Build Production Frontend (React + Vite)

```bash
cd /var/www/monitoringspse/frontend

# Install dependensi frontend
npm install

# Build asset produksi
npm run build
```
*Hasil build akan tersimpan di `/var/www/monitoringspse/frontend/dist`.*

---

## 6. Konfigurasi Systemd Services (Pemisahan Process)

Untuk menjaga stabilitas, **Web API** dan **Background Crawler Worker** dipisah menjadi 2 process mandiri.

### Service 1: Backend Web API (`/etc/systemd/system/spse-backend.service`)
Buat file service backend:
```bash
sudo nano /etc/systemd/system/spse-backend.service
```
Isi dengan konfigurasi berikut:
```ini
[Unit]
Description=Spy SPSE FastAPI Backend Service
After=network.target postgresql.service

[Service]
User=ubuntu
WorkingDirectory=/var/www/monitoringspse
EnvironmentFile=/var/www/monitoringspse/.env
ExecStart=/var/www/monitoringspse/.venv/bin/uvicorn backend.main:app --host 127.0.0.1 --port 8000 --workers 4
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

### Service 2: Background Crawler Scheduler (`/etc/systemd/system/spse-crawler.service`)
Buat file service crawler:
```bash
sudo nano /etc/systemd/system/spse-crawler.service
```
Isi dengan konfigurasi berikut:
```ini
[Unit]
Description=Spy SPSE Background Crawler Scheduler
After=network.target postgresql.service spse-backend.service

[Service]
User=ubuntu
WorkingDirectory=/var/www/monitoringspse
EnvironmentFile=/var/www/monitoringspse/.env
ExecStart=/var/www/monitoringspse/.venv/bin/python3 -m backend.scheduler
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

### Aktifkan & Jalankan Kedua Service:
```bash
sudo systemctl daemon-reload

# Enable auto-start on boot
sudo systemctl enable spse-backend
sudo systemctl enable spse-crawler

# Start services
sudo systemctl start spse-backend
sudo systemctl start spse-crawler

# Cek status
sudo systemctl status spse-backend
sudo systemctl status spse-crawler
```

---

## 7. Konfigurasi Nginx Reverse Proxy & SSL (HTTPS)

### A. Buat Konfigurasi Site Nginx
```bash
sudo nano /etc/nginx/sites-available/spyspse
```
Isi dengan konfigurasi Nginx berikut (Ganti `domainanda.com` dengan nama domain resmi Anda):

```nginx
server {
    listen 80;
    server_name domainanda.com www.domainanda.com;

    # Root folder frontend React build
    root /var/www/monitoringspse/frontend/dist;
    index index.html;

    # Gzip Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Proxy REST API requests ke FastAPI Backend (Port 8000)
    location /api/ {
        proxy_pass http://127.0.0.1:8000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Serve uploads / static assets
    location /static/ {
        alias /var/www/monitoringspse/backend/static/;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    # SPA Routing Fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### B. Aktifkan Site & Certificate SSL
```bash
# Symlink ke sites-enabled
sudo ln -s /etc/nginx/sites-available/spyspse /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Install SSL Gratis SSL Let's Encrypt
sudo certbot --nginx -d domainanda.com -d www.domainanda.com
```

---

## 8. Best Practices Anti-Spam WA & Anti-Block LPSE

### A. WhatsApp Anti-Spam Mitigasi
1. **Inbound Trigger Chat**:
   - Pastikan pengguna baru mengklik tombol **"Aktifkan WA Notifikasi"** dari dashboard.
   - Tombol tersebut membuka link `https://wa.me/628xxx?text=Halo%20Spy%20SPSE%20aktifkan%20alert` agar percakapan pertama berasal dari user.
2. **Pesan Acak & Delay**:
   - Sistem sudah dilengkapi *random delay (2-5 detik)* dan *greeting spinning* otomatis di `backend/whatsapp_notifier.py`.

### B. Anti-IP Block LPSE & Strategi Proxy

#### 1. Rotasi User-Agent
Sudah aktif otomatis di `spse/cookie_manager.py` (merotasi header HTTP User-Agent secara dinamis).

#### 2. Penggunaan Proxy Dinamis (Web UI & .env)
* **Tanpa Restart Server**: Masuk ke Dasbor **Super Admin -> IP Proxy & Anti-Block** (`/#/admin/proxy`), lalu isi `spse_proxy` (contoh: `http://user:pass@ip_proxy:port`). Sistem membaca proxy secara *real-time* dari database.
* **Environment Variable**: Atau set `SPSE_PROXY=http://user:pass@ip_proxy:port` pada file `.env`.

#### 3. Opsi Penyedia Proxy Lokal Indonesia (Pembayaran IDR / QRIS)
Bila membutuhkan IP Proxy lokasi Indonesia:
* **IDCloudHost / Biznet GIO / DomaiNesia**: Beli Floating/Dedicated IP Jakarta (~Rp 35.000 – Rp 50.000 / bulan), pasang `3proxy`/`Squid`.
* **Webshare.io**: Datacenter IP Indonesia murah (~$1.5 / bulan per IP).
* **Smartproxy / Bright Data**: Residential IP pool Indonesia (Telkomsel/Indihome/Biznet).

#### 4. Solusi Mandiri: Dynamic 4G USB Dongle Rotating Residential Proxy (100% Anti-Block)
Bagi pengguna yang ingin solusi **bebas langganan proxy komersial** dan **100% Anti-Block Cloudflare/LPSE**:

##### Apakah Project Harus Dipindah dari VPS Cloud ke PC Lokal?
**TIDAK HARUS!** Anda dapat memilih 2 model arsitektur berikut:

* **Arsitektur A: VPS Cloud Tetap Online + PC Lokal / Raspberry Pi 4G Proxy Node (Rekomendasi Utama)**
  * **Website Spy SPSE (FastAPI + React + PostgreSQL)** TETAP berjalan 24/7 di VPS Cloud.
  * Tancapkan Modem 4G USB (Huawei E3372 / ZTE MF833) berisi Kartu Perdana Seluler (Telkomsel / Indosat / XL) pada PC lokal / Raspberry Pi di rumah/kantor.
  * Jalankan proxy service (`3proxy`/`Tinyproxy`) + Secure Tunnel (`Tailscale` / `Cloudflare Tunnel` / `SSH Reverse Tunnel`) di PC lokal.
  * Di VPS Cloud, set `spse_proxy` ke URL Tunnel PC lokal (contoh: `http://proxy-rumah.tailscale.net:8888`).
  * **Hasil**: Website tetap kencang & publik di VPS Cloud, sementara lalu lintas crawling LPSE dialirkan secara aman lewat IP Mobile Residential Indonesia dari modem 4G rumah Anda.

* **Arsitektur B: Full Self-Hosted di PC Server Lokal**
  * Seluruh aplikasi (Backend, Frontend, PostgreSQL, Modem 4G) berjalan di 1 PC Server lokal di rumah/kantor yang menyala 24 jam.
  * Akses publik menggunakan **Cloudflare Tunnel (Free)** dengan domain Anda (misal `https://app.spyspse.com`).
  * **Biaya VPS = Rp 0/bulan**.

##### Mekanisme Rotasi IP Mobile (CGNAT Operator Seluler)
Modem 4G USB dapat di-restart koneksi datanya (Mode Pesawat ON/OFF) secara otomatis via script Python:
```python
import requests
import time

def rotate_4g_mobile_ip():
    # Sinyal Turn Off Mobile Data (Mode Pesawat ON)
    requests.post('http://192.168.8.1/api/dialup/mobile-dataswitch', data='<request><dataswitch>0</dataswitch></request>')
    time.sleep(2)
    # Sinyal Turn On Mobile Data -> Operator memberikan IP Mobile Residential Baru!
    requests.post('http://192.168.8.1/api/dialup/mobile-dataswitch', data='<request><dataswitch>1</dataswitch></request>')
    print("✅ IP Mobile Indonesia Berhasil Berotasi!")
```
> **Kenapa Mustahil Diblokir?**: Operator seluler di Indonesia menggunakan **CGNAT**, di mana 1 IP publik dipakai bersama oleh ribuan pengguna HP. LPSE / Cloudflare tidak akan memblokir IP ini karena akan berdampak memblokir pengguna HP biasa di area tower BTS tersebut.

---


## 9. Script Backup Harian & Monitoring Log

### A. Setup Auto-Backup Database PostgreSQL (Cron Job)
Buat script backup di `/var/www/monitoringspse/scratch/backup_db.sh`:

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/spse_db"
mkdir -p $BACKUP_DIR
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
FILENAME="$BACKUP_DIR/spse_db_$TIMESTAMP.sql.gz"

# Export PostgreSQL DB compressed
PGPASSWORD='PasswordKuat123!' pg_dump -U spse_user -h localhost spse_db | gzip > $FILENAME

# Hapus backup yang lebih tua dari 14 hari
find $BACKUP_DIR -type f -name "*.sql.gz" -mtime +14 -delete
```

Beri izin eksekusi dan tambahkan ke Crontab:
```bash
chmod +x /var/www/monitoringspse/scratch/backup_db.sh
crontab -e
```
Tambahkan baris berikut (Backup otomatis setiap jam 02:00 malam):
```cron
0 2 * * * /var/www/monitoringspse/scratch/backup_db.sh > /dev/null 2>&1
```

### B. Cara Memantau Log Aplikasi (Live Monitoring)

```bash
# Memantau Log Web API FastAPI:
sudo journalctl -u spse-backend -f

# Memantau Log Crawler Worker Background:
sudo journalctl -u spse-crawler -f

# Memantau Log Error Scraping:
tail -f /var/www/monitoringspse/logs/crawl_errors.log
```

---
*Dokumen ini dibuat otomatis sebagai panduan standar deployment produksi Spy SPSE.*
