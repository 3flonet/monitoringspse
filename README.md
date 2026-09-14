# 👁️ Spy SPSE

> **SaaS-Ready Platform untuk Monitoring, Scraping, dan Analisis Data Tender & Nontender SPSE Indonesia.**

[![Python Version](https://img.shields.io/badge/python-3.9%2B-blue.svg)](https://www.python.org/)
[![Vite React](https://img.shields.io/badge/frontend-Vite%20%2B%20React-orange.svg)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/backend-FastAPI-green.svg)](https://fastapi.tiangolo.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**Spy SPSE** adalah platform pemantauan terintegrasi berskala *enterprise/SaaS* untuk mengumpulkan, menganalisis, dan memantau data tender dan nontender dari sistem **SPSE (Sistem Pengadaan Secara Elektronik)** versi nasional maupun instansi/daerah. Dengan arsitektur yang dirancang untuk performa tinggi, platform ini mampu menangani ribuan data pengadaan secara otomatis serta menyajikan wawasan analitik kompetitor secara real-time.

---

## ✨ Fitur Utama

### 1. ⚙️ Engine Crawler & Scraper Berkinerja Tinggi
*   **Multi-Instance LPSE**: Mendukung pencarian kategori otomatis di ratusan LPSE instansi (Kementerian, Provinsi, Kabupaten/Kota) dengan fitur *Category Resolver*.
*   **Paging & Pencarian Presisi**: Penarikan data massal (*bulk*) dengan filter paging dinamis dan pencarian berdasarkan kata kunci paket.
*   **Simpan Beragam Format**: Mengunduh dan menyimpan respons asli (`JSON`), pengumuman pascakualifikasi detail (`CSV`), dan dokumen lampiran pembuktian kualifikasi (`PDF Summary`).

### 2. 🔔 Notifikasi Pintar (WhatsApp & Email Alerts)
*   **Rekomendasi Kata Kunci**: Pengguna dapat menyetel notifikasi otomatis berbasis kata kunci paket atau instansi target.
*   **WhatsApp Gateway**: Integrasi notifikasi langsung ke nomor WhatsApp menggunakan API Gateway (Fonnte/WABlas).
*   **Email Gateway**: Notifikasi otomatis berbasis HTML profesional dikirim langsung ke kotak masuk pengguna via SMTP.

### 3. 📊 Analisis Kompetitor & Dashboard Interaktif
*   **Analisis Pemenang**: Melacak profil pemenang tender, riwayat penawaran, dan nilai kemenangan (nilai pagu vs nilai penawaran).
*   **Distribusi Kemenangan**: Visualisasi grafik interaktif seputar sebaran tender berdasarkan kategori, instansi, dan nilai pagu.
*   **Evaluasi Harga Bid**: Membantu tim analis merumuskan strategi penawaran harga berdasarkan tren historis kompetitor.

### 4. 💳 Siap Skala SaaS & Monetisasi
*   **Sistem Langganan Premium**: Pembatasan fitur bagi pengguna Free dan akses penuh tanpa batas untuk pengguna Premium.
*   **Midtrans Payment Gateway**: Pembayaran otomatis berbasis snap token untuk tagihan bulanan/tahunan secara *real-time* dan otomatis terkonfirmasi via Webhook.
*   **Manajemen Voucher**: Fitur potongan harga/kupon promo untuk memudahkan strategi pemasaran.

### 5. 🛡️ Portal Admin & CMS (Content Management System)
*   **Konfigurasi Global**: Ubah nama aplikasi, logo, tagline, kontak, hingga SEO metadata langsung melalui panel admin.
*   **Manajemen Artikel/Berita**: Integrasi modul CMS internal untuk memperbarui informasi/tips pengadaan bagi pengguna.
*   **Daftar Instansi Dinamis**: Kemudahan memperbarui segmen instansi LPSE target tanpa menyentuh kode program.

---

## 🏗️ Struktur Repositori

```text
.
├── backend/                   # Backend FastAPI
│   ├── static/                # Asset statis, upload logo, dll.
│   ├── auth.py                # Autentikasi JWT & Password Hashing
│   ├── database.py            # Koneksi database & Query Layer (Postgres/SQLite)
│   ├── crawl_coordinator.py   # Koordinator eksekusi task crawler
│   ├── email_notifier.py      # Pengirim email alert berbasis template
│   ├── whatsapp_notifier.py   # Pengirim notifikasi WhatsApp API
│   ├── main.py                # FastAPI app router, endpoints & core settings
│   └── migrate_sqlite_to_postgres.py # Utilitas migrasi DB lokal ke Postgres
├── frontend/                  # Frontend Vite + React SPA
│   ├── src/                   # Source code React (Komponen, Dashboard, dll.)
│   ├── vite.config.js         # Konfigurasi bundler Vite
│   └── package.json           # Dependensi modul frontend
├── spse/                      # Core Module Scraper (CLI & Python SDK)
│   ├── category_resolver.py   # Pencari slug URL instansi LPSE
│   ├── cookie_manager.py      # Manajemen sesi & cookie bypass SPSE
│   ├── json_getter.py         # Pengunduh JSON DataTables SPSE
│   ├── detail_getter.py       # Pengikis halaman pengumuman detail
│   └── summary_getter.py      # Pengunduh dokumen PDF pembuktian kualifikasi
└── README.md                  # Dokumentasi teknis proyek
```

---

## 🚀 Panduan Memulai Cepat

### Prasyarat System
*   **Python**: Versi 3.9 atau lebih tinggi
*   **Node.js**: Versi 18 atau lebih tinggi
*   **Database**: PostgreSQL (Direkomendasikan untuk produksi) atau SQLite (Pengembangan lokal)

---

### 1. Pengaturan Backend (FastAPI)

1.  Masuk ke direktori root proyek dan buat virtual environment:
    ```bash
    python -m venv .venv
    
    # Windows:
    .venv\Scripts\activate
    # Linux/Mac:
    source .venv/bin/activate
    ```
2.  Pasang dependensi backend:
    ```bash
    pip install -r requirements.txt
    # Pasang core package dalam mode editable
    pip install -e .
    ```
3.  Konfigurasikan file variabel lingkungan `.env` di root/backend:
    ```env
    DATABASE_URL=postgresql://user:password@localhost:5432/pyspse_saas
    SECRET_KEY=ganti-dengan-key-rahasia-anda-yang-aman
    ```
4.  Lakukan seeding admin awal untuk akses dasbor admin:
    ```bash
    python -m backend.seed_admin
    # Super Admin default: admin@spyspse.com / admin123
    ```
    *Catatan Pembersihan Database*: Jika Anda ingin mengosongkan seluruh tabel dan melakukan re-seeding dari awal, jalankan:
    ```bash
    python -m backend.reset_db
    ```
5.  Jalankan server backend:
    ```bash
    uvicorn backend.main:app --reload --port 8000
    ```

Cara Alternatif Menjalankan FastAPI (Tanpa Aktivasi Virtual Environment)
Anda juga dapat menjalankan backend FastAPI tanpa perlu mengaktifkan virtual environment terlebih dahulu, asalkan Anda sudah menginstal backend package dalam mode editable (pip install -e .).

Jalankan perintah:
```bash
.\.venv\Scripts\python.exe -m uvicorn backend.main:app --reload --port 8000
```


---

### 2. Pengaturan Frontend (Vite + React)

1.  Pindah ke direktori frontend:
    ```bash
    cd frontend
    ```
2.  Pasang modul dependensi:
    ```bash
    npm install
    ```
3.  Jalankan server pengembangan frontend:
    ```bash
    npm run dev
    ```
4.  Aplikasi sekarang dapat diakses secara default melalui browser di `http://localhost:5173`.

---

### 3. Menjalankan Scheduler Crawling Otomatis & Sync (Background Worker)

Untuk menjalankan proses crawling otomatis secara berkala (memantau alert kata kunci pengguna premium & memperbarui data bookmark secara otomatis):

```bash
# Menggunakan virtual environment (Windows):
.\.venv\Scripts\python.exe -m backend.scheduler

# Atau jika venv sudah aktif:
python -m backend.scheduler
```

> 💡 **Cara Menguji Scheduler Otomatis:**
> 1. Login ke web app di `http://localhost:5173` menggunakan akun Super Admin (`admin@spyspse.com` / `admin123`).
> 2. Buka menu **Notifikasi / Radar Tender** dan tambahkan kata kunci baru (contoh kata kunci: `pengadaan`, instansi: `nasional` / `all`).
> 3. Jalankan perintah `.\.venv\Scripts\python.exe -m backend.scheduler` di terminal. Scheduler akan otomatis mendeteksi kata kunci tersebut, melakukan penarikan data dari SPSE, dan menyimpan tender yang cocok ke database.

---

## 🗄️ Produksi & Migrasi Database (SQLite vs PostgreSQL)

### ⚠️ Mengapa Wajib Menggunakan PostgreSQL di Lingkungan Produksi?
Secara bawaan lokal, proyek ini mendukung SQLite (`spse_saas.db`). Namun, untuk **lingkungan produksi/online (SaaS)**, **PostgreSQL SANGAT DIANJURKAN & WAJIB DIGUNAKAN**.

* **Risiko Database Locking pada SQLite**: SQLite menggunakan mekanisme penguncian tingkat file (*file-level lock*). Ketika *Background Scheduler Worker* sedang menulis ribuan record hasil crawling SPSE secara intensif bersamaan dengan ratusan request HTTP dari pengguna publik di FastAPI, SQLite akan mengalami kendala fatal `sqlite3.OperationalError: database is locked`.
* **Keunggulan PostgreSQL**: PostgreSQL mendukung *Row-Level Locking*, konkurensi koneksi *Multi-Threaded / Connection Pooling*, dan performa indexing query pencarian kata kunci yang jauh lebih tangguh untuk transaksi berskala besar.

### 🔄 Langkah-langkah Migrasi SQLite ke PostgreSQL

1. **Jalankan Layanan PostgreSQL** di server VPS Anda dan buat database baru (contoh: `pyspse_saas`).
2. **Atur Variabel Lingkungan `DATABASE_URL`** pada file `.env`:
   ```env
   DATABASE_URL=postgresql://postgres:password_anda@localhost:5432/pyspse_saas
   ```
3. **Eksekusi Script Migrasi Otomatis**:
   ```bash
   python -m backend.migrate_sqlite_to_postgres
   ```
   *Script ini akan otomatis membuat tabel, skema, indeks, serta memindahkan seluruh data dari SQLite lokal ke PostgreSQL tanpa kehilangan data.*

---

## ⏱️ Penjelasan Detail & Cara Kerja Scraper Scheduler

Sistem **Scraper Scheduler** pada **Spy SPSE** bertugas mengotomatiskan penarikan data dari berbagai portal LPSE SPSE secara berkala, melakukan pencocokan kata kunci alert pengguna, mengirimkan notifikasi multi-channel (WhatsApp & Email), serta memperbarui status tender yang di-bookmark oleh pengguna.

### 1. Arsitektur Komponen Scheduler

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        SCHEDULER ENGINE WORKER                         │
│                    (backend/scheduler.py - 24 Hours)                   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
       ┌────────────────────────────┴───────────────────────────┐
       ▼                                                        ▼
┌─────────────────────────────┐                         ┌─────────────────────────────┐
│    run_daily_scraping()     │                         │  sync_bookmarked_tenders()  │
│  (Crawl alert kata kunci)   │                         │  (Update tahapan bookmark)  │
└──────────────┬──────────────┘                         └──────────────┬──────────────┘
               │                                                       │
               ▼                                                       ▼
┌─────────────────────────────┐                         ┌─────────────────────────────┐
│    run_crawl() Engine       │                         │    run_crawl() Engine       │
│   (backend/crawl_coord.py)  │                         │ (search = nomor_pengadaan)  │
└──────────────┬──────────────┘                         └─────────────────────────────┘
               │
               ▼
┌─────────────────────────────┐
│  check_alerts_and_notify()  │
│   (WhatsApp & Email Alert)  │
└─────────────────────────────┘
```

* **`backend/scheduler.py`**: Berisi fungsi siklus kerja utama (`run_daily_scraping`, `sync_bookmarked_tenders`, dan `start_scheduler_loop`).
* **`backend/crawl_coordinator.py` (`run_crawl`)**: Mengoordinasikan pembacaan data via modul `spse`, menyimpan record ke SQLite/PostgreSQL, serta memicu pengiriman notifikasi.
* **`backend/whatsapp_notifier.py` & `backend/email_notifier.py`**: Menangani pengiriman notifikasi ke WhatsApp Gateway (Fonnte API) dan Email (SMTP Gateway).
* **`backend/main.py` & UI Admin (`App.jsx`)**: Menyediakan REST API endpoint (`/api/admin/scheduler/force-run` dan `/api/admin/server-monitoring`) untuk eksekusi manual serta pemantauan metrik server secara real-time.

---

### 2. Alur Kerja Eksekusi (Step-by-Step Flow)

#### A. Inisialisasi & Pembacaan Target Alert (`run_daily_scraping`)
1. Status scheduler di database (`system_settings`) diubah menjadi **`RUNNING`**.
2. Waktu eksekusi dicatat pada kolom `scheduler_last_run_at` dan estimasi `scheduler_next_run_at`.
3. Scheduler mengeksekusi query database untuk mengambil kombinasi unik `keyword` dan `instansi` **hanya dari pengguna dengan status langganan aktif (`subscriptions.status = 'active'`)**:
   ```sql
   SELECT DISTINCT a.keyword, a.instansi
   FROM alerts a
   JOIN users u ON a.user_id = u.id
   LEFT JOIN subscriptions s ON u.id = s.user_id
   WHERE s.status = 'active'
   ```
4. Jika tidak ada alert aktif, job selesai dan mengembalikan status ke **`IDLE`**.

#### B. Penarikan Data dari Portal SPSE (`run_crawl`)
Untuk setiap kombinasi `instansi` + `keyword`:
1. **Cookie Management**: Mengambil cookie sesi resmi dari portal LPSE target melalui `SPSECookieManager`.
2. **Query DataTables API**: Mengkueri JSON DataTables SPSE via `SPSEJsonGetter` sesuai kategori dan kata kunci pencarian.
3. **Ekstraksi & Persistensi Detail**:
   - Menyimpan data ringkasan tender ke tabel `tenders`.
   - Mengambil detail kualifikasi, jadwal, peserta, pemenang, dan evaluasi gugur kompetitor via `SPSEDetailGetter`.
   - Menyimpan seluruh detail ke database.
   - Menggunakan jeda waktu teratur (`time.sleep(1.5)`) per item agar tidak membebani server SPSE.

#### C. Pencocokan Alert & Pengiriman Notifikasi (`check_alerts_and_notify`)
1. Mengambil seluruh daftar alert pengguna bersubskripsi aktif.
2. Memocokkan kata kunci alert terhadap **Nama Tender**, **Syarat Kualifikasi**, dan **Uraian Pekerjaan**.
3. **Mencegah Duplikasi Notifikasi**: Mengecek tabel `sent_alerts`. Jika tender tersebut sudah pernah dikirimkan ke user untuk alert terkait, notifikasi diabaikan.
4. **Pengiriman Notifikasi Multi-Channel**:
   - **WhatsApp**: Mengirim pesan terformat via Fonnte API (`send_whatsapp_alert`).
   - **Email**: Mengirim email HTML informatif via SMTP (`send_email_alert`).
5. Menyimpan catatan ke tabel `sent_alerts` untuk memastikan tidak ada pesan ganda di masa mendatang.

#### D. Sinkronisasi Tahapan Tender Bookmark (`sync_bookmarked_tenders`)
1. Membaca daftar tender unik yang disimpan pengguna (`bookmarks`).
2. Menjalankan penarikan ulang (*refresh*) terhadap tahapan jadwal dan data pemenang terbaru dari portal SPSE.
3. Memperbarui record database sehingga status proyek selalu sinkron dengan kondisi di lapangan.

---

### 3. Kontrol Konkurensi & Status State Machine

Sistem scheduler menggunakan mekanisme *State Machine* sederhana di tabel `system_settings`:

* **`IDLE`**: Worker dalam posisi *standby* dan siap menerima tugas.
* **`RUNNING`**: Worker sedang memproses penarikan data dari portal SPSE.
* **`ERROR`**: Terjadi kesalahan fatal pada saat eksekusi worker.

> 🔒 **Pencegahan Bentrok (*Race Condition Protection*):**
> Apabila tombol **▶ Force Run** pada Admin Panel ditekan sementara status scheduler masih **`RUNNING`**, API backend akan menolak permintaan baru untuk mencegah eksekusi ganda yang dapat membebani server.

---

### 4. Logging & Dashboard Monitoring

* **Ringkasan JSON**: Hasil eksekusi disimpan dalam bentuk ringkasan JSON pada `system_settings.scheduler_last_run_summary` (berisi durasi, total tender disimpan, dan total alert terkirim).
* **Audit Trail Error**: Jika terjadi kendala jaringan atau kegagalan parsing, rincian log ditulis ke `logs/crawl_errors.log` yang dapat langsung dipantau oleh Admin pada menu **Server & Scheduler Monitoring** di dasbor web app.

---

## 🛠️ Penggunaan Modul CLI (`spyspse`)

Bagi pengembang yang ingin mengekstrak data langsung lewat baris perintah (CLI), core engine `spyspse` menyediakan interface mandiri:

```bash
# Menarik 10 data tender nasional tahun 2025 ke folder json/ dan detail/
spyspse tender -T 2025 -L 10

# Mencari instansi LPSE daerah
spyspse --search-category "Bandung"

# Menarik data tender khusus LPSE Bandung tahun 2025 beserta file PDF dokumen kualifikasinya
spyspse tender -C bandung -T 2025 -L 5 -M all
```

---

## ⚖️ Penafian (Disclaimer)

Aplikasi **Spy SPSE** dibuat murni secara independen untuk tujuan eksperimen teknis, mempermudah akses informasi data publik pengadaan secara legal, serta studi analitis. Pengembang tidak terafiliasi dengan LKPP atau pihak pengelola SPSE manapun. Pengguna diimbau untuk menggunakan engine crawling secara santun, mematuhi beban server tujuan, dan mematuhi peraturan perundang-undangan yang berlaku terkait akses informasi publik. Segala konsekuensi penggunaan ditanggung sepenuhnya oleh masing-masing pengguna.

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah lisensi **MIT License** - Lihat file [LICENSE](LICENSE) untuk detail lebih lanjut.
