import sqlite3
import os
import re
import json
import logging
from pathlib import Path
from datetime import datetime, timedelta


DB_PATH = Path(__file__).parent / "spse_saas.db"

# PostgreSQL connection pool setup
DATABASE_URL = os.getenv("DATABASE_URL")
_pg_pool = None
_use_postgres = False

if DATABASE_URL:
    _use_postgres = True

class DictLikeRow(dict):
    def __init__(self, colnames, row_tuple):
        super().__init__(zip(colnames, row_tuple))
        self._colnames = colnames
        self._row_tuple = row_tuple

    def __getitem__(self, key):
        if isinstance(key, int):
            return self._row_tuple[key]
        return super().__getitem__(key)

class CursorWrapper:
    def __init__(self, cursor, is_postgres=True):
        self._cursor = cursor
        self._is_postgres = is_postgres

    @property
    def description(self):
        return self._cursor.description

    @property
    def rowcount(self):
        return self._cursor.rowcount

    @property
    def lastrowid(self):
        return getattr(self._cursor, 'lastrowid', None)

    def execute(self, query, params=None):
        if self._is_postgres:
            query_adapted = query.replace("%", "%%").replace("?", "%s")
            
            # Convert LIKE to ILIKE for case-insensitive search in PostgreSQL
            if "LIKE" in query_adapted:
                query_adapted = query_adapted.replace("LIKE", "ILIKE")
            
            # Convert datetime('now') to CURRENT_TIMESTAMP
            if "datetime('now')" in query_adapted:
                query_adapted = query_adapted.replace("datetime('now')", "CURRENT_TIMESTAMP")
                
            # Convert datetime(some_field) to CAST(NULLIF(some_field, '') AS TIMESTAMP)
            if "datetime(" in query_adapted:
                query_adapted = re.sub(r'datetime\(([^)]+)\)', r"CAST(NULLIF(\1, '') AS TIMESTAMP)", query_adapted)
            
            # Convert INSERT OR IGNORE to ON CONFLICT DO NOTHING
            if "INSERT OR IGNORE" in query_adapted:
                target = ""
                if "system_settings" in query_adapted:
                    target = "(key)"
                elif "bookmarks" in query_adapted:
                    target = "(user_id, nomor_pengadaan)"
                elif "sent_alerts" in query_adapted:
                    target = "(alert_id, nomor_pengadaan)"
                query_adapted = query_adapted.replace("INSERT OR IGNORE INTO", "INSERT INTO")
                query_adapted += f" ON CONFLICT {target} DO NOTHING"
            
            # Convert INSERT OR REPLACE to ON CONFLICT DO UPDATE
            elif "INSERT OR REPLACE" in query_adapted:
                if "tender_participants" in query_adapted:
                    query_adapted = query_adapted.replace("INSERT OR REPLACE INTO", "INSERT INTO")
                    query_adapted += " ON CONFLICT (nomor_pengadaan, nama_peserta) DO UPDATE SET npwp = EXCLUDED.npwp, harga_penawaran = EXCLUDED.harga_penawaran, harga_terkoreksi = EXCLUDED.harga_terkoreksi"
                elif "tender_winners" in query_adapted:
                    query_adapted = query_adapted.replace("INSERT OR REPLACE INTO", "INSERT INTO")
                    query_adapted += " ON CONFLICT (nomor_pengadaan) DO UPDATE SET nama_pemenang = EXCLUDED.nama_pemenang, alamat = EXCLUDED.alamat, npwp = EXCLUDED.npwp, harga_kontrak = EXCLUDED.harga_kontrak, nilai_pdn = EXCLUDED.nilai_pdn, nilai_umk = EXCLUDED.nilai_umk"
            
            if params is None:
                self._cursor.execute(query_adapted)
            else:
                self._cursor.execute(query_adapted, params)
        else:
            query_adapted = re.sub(r'%s(?![a-zA-Z0-9_])', '?', query)
            if params is None:
                self._cursor.execute(query_adapted)
            else:
                self._cursor.execute(query_adapted, params)
        return self

    def fetchone(self):
        row = self._cursor.fetchone()
        if row is None:
            return None
        colnames = [desc[0] for desc in self._cursor.description]
        return DictLikeRow(colnames, row)

    def fetchall(self):
        rows = self._cursor.fetchall()
        if not rows:
            return []
        colnames = [desc[0] for desc in self._cursor.description]
        return [DictLikeRow(colnames, r) for r in rows]

    def close(self):
        self._cursor.close()

class PoolConnectionWrapper:
    def __init__(self, pool_obj, conn):
        self._pool = pool_obj
        self._conn = conn

    def cursor(self):
        return CursorWrapper(self._conn.cursor(), is_postgres=True)

    def commit(self):
        self._conn.commit()

    def rollback(self):
        self._conn.rollback()

    def close(self):
        self._pool.putconn(self._conn)

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_type is not None:
            self.rollback()
        else:
            self.commit()
        self.close()

class SQLiteConnectionWrapper:
    def __init__(self, conn):
        self._conn = conn

    def cursor(self):
        return CursorWrapper(self._conn.cursor(), is_postgres=False)

    def commit(self):
        self._conn.commit()

    def rollback(self):
        self._conn.rollback()

    def close(self):
        self._conn.close()

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_type is not None:
            self.rollback()
        else:
            self.commit()
        self.close()

def get_db_connection():
    global _pg_pool
    if DATABASE_URL:
        try:
            import psycopg2
            from psycopg2 import pool
            if _pg_pool is None:
                _pg_pool = pool.ThreadedConnectionPool(1, 20, DATABASE_URL)
            return PoolConnectionWrapper(_pg_pool, _pg_pool.getconn())
        except Exception as e:
            print(f"[Error] Failed to connect to PostgreSQL: {e}")
            raise e
    else:
        conn = sqlite3.connect(DB_PATH, timeout=30)
        return SQLiteConnectionWrapper(conn)

def clean_str(text):
    if not text:
        return ""
    if not isinstance(text, str):
        text = str(text)
    text = text.replace('\xa0', ' ')
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def parse_pagu(pagu_str):
    if not pagu_str:
        return 0.0
    pagu_str = clean_str(pagu_str)
    
    multiplier = 1.0
    pagu_upper = pagu_str.upper()
    if "JT" in pagu_upper:
        multiplier = 1_000_000.0
        pagu_str = pagu_str.replace("JT", "").replace("jt", "").replace("Jt", "")
    elif "M" in pagu_upper:
        multiplier = 1_000_000_000.0
        pagu_str = pagu_str.replace("M", "").replace("m", "")
    elif "T" in pagu_upper:
        multiplier = 1_000_000_000_000.0
        pagu_str = pagu_str.replace("T", "").replace("t", "")
        
    pagu_str = pagu_str.replace("Rp", "").replace(".", "").replace(" ", "")
    if "," in pagu_str:
        pagu_str = pagu_str.replace(",", ".")
        
    try:
        return float(pagu_str) * multiplier
    except:
        return 0.0

parse_pagu_to_float = parse_pagu

def parse_indonesian_date(date_str):
    if not date_str:
        return None
    date_str = clean_str(date_str)
    if re.match(r'^\d{4}-\d{2}-\d{2}', date_str):
        return date_str
        
    months_id = {
        'januari': '01', 'februari': '02', 'maret': '03', 'april': '04',
        'mei': '05', 'juni': '06', 'juli': '07', 'agustus': '08',
        'september': '09', 'oktober': '10', 'november': '11', 'desember': '12',
        'jan': '01', 'feb': '02', 'mar': '03', 'apr': '04',
        'jun': '06', 'jul': '07', 'agu': '08', 'sep': '09',
        'okt': '10', 'nov': '11', 'des': '12'
    }
    
    match = re.match(r'^(\d{1,2})\s+([a-zA-Z]+)\s+(\d{4})(?:\s+(\d{1,2})[.:](\d{2}))?', date_str)
    if match:
        day, month_name, year, hour, minute = match.groups()
        month = months_id.get(month_name.lower())
        if month:
            day_str = f"{int(day):02d}"
            hour_str = f"{int(hour):02d}" if hour else "00"
            minute_str = f"{int(minute):02d}" if minute else "00"
            return f"{year}-{month}-{day_str} {hour_str}:{minute_str}:00"
            
    return date_str

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    is_pg = hasattr(conn, '_pool')
    
    if is_pg:
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS tenders (
            nomor_pengadaan VARCHAR(255) PRIMARY KEY,
            nama_tender TEXT,
            instansi TEXT,
            tahap TEXT,
            pagu TEXT,
            pagu_val DOUBLE PRECISION,
            metode TEXT,
            jenis_pengadaan TEXT,
            kategori TEXT,
            tipe TEXT,
            tahun INTEGER,
            scraped_at TEXT,
            tanggal_mulai_tender TEXT,
            akhir_penawaran TEXT
        )
        """)
        
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS tender_details (
            nomor_pengadaan VARCHAR(255) PRIMARY KEY,
            syarat_kualifikasi TEXT,
            uraian_singkat_pekerjaan TEXT,
            satuan_kerja TEXT,
            jenis_kontrak TEXT,
            lokasi_pekerjaan TEXT,
            tanggal_pembuatan TEXT,
            alasan_diulang TEXT,
            scraped_at TEXT,
            jadwal TEXT,
            FOREIGN KEY (nomor_pengadaan) REFERENCES tenders (nomor_pengadaan) ON DELETE CASCADE
        )
        """)
        
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS system_settings (
            key VARCHAR(255) PRIMARY KEY,
            value TEXT
        )
        """)
        
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            whatsapp TEXT,
            role VARCHAR(50) DEFAULT 'user',
            created_at TEXT
        )
        """)
        
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS subscriptions (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL,
            plan_type VARCHAR(50) DEFAULT 'trial',
            start_date TEXT,
            end_date TEXT,
            status VARCHAR(50) DEFAULT 'active',
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )
        """)
        
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS bookmarks (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL,
            nomor_pengadaan VARCHAR(255) NOT NULL,
            bookmarked_at TEXT,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
            FOREIGN KEY (nomor_pengadaan) REFERENCES tenders (nomor_pengadaan) ON DELETE CASCADE,
            UNIQUE(user_id, nomor_pengadaan)
        )
        """)
        
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS transactions (
            order_id VARCHAR(255) PRIMARY KEY,
            user_id INTEGER NOT NULL,
            plan_type VARCHAR(50) NOT NULL,
            amount DOUBLE PRECISION NOT NULL,
            status VARCHAR(50) DEFAULT 'pending',
            duration_days INTEGER DEFAULT 30,
            snap_token TEXT,
            created_at TEXT,
            updated_at TEXT,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )
        """)
        
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS vouchers (
            code VARCHAR(255) PRIMARY KEY,
            discount_type VARCHAR(50) NOT NULL,
            discount_value DOUBLE PRECISION NOT NULL,
            max_uses INTEGER DEFAULT 100,
            used_count INTEGER DEFAULT 0,
            is_active INTEGER DEFAULT 1,
            expires_at TEXT
        )
        """)
        
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS alerts (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL,
            keyword TEXT NOT NULL,
            email TEXT NOT NULL,
            whatsapp TEXT,
            instansi TEXT NOT NULL,
            created_at TEXT,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )
        """)
        
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS sent_alerts (
            id SERIAL PRIMARY KEY,
            alert_id INTEGER,
            nomor_pengadaan VARCHAR(255),
            sent_at TEXT,
            FOREIGN KEY (alert_id) REFERENCES alerts (id) ON DELETE CASCADE,
            FOREIGN KEY (nomor_pengadaan) REFERENCES tenders (nomor_pengadaan) ON DELETE CASCADE,
            UNIQUE(alert_id, nomor_pengadaan)
        )
        """)
        
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS tender_participants (
            nomor_pengadaan VARCHAR(255),
            nama_peserta VARCHAR(255),
            npwp TEXT,
            harga_penawaran DOUBLE PRECISION,
            harga_terkoreksi DOUBLE PRECISION,
            PRIMARY KEY (nomor_pengadaan, nama_peserta),
            FOREIGN KEY (nomor_pengadaan) REFERENCES tenders (nomor_pengadaan) ON DELETE CASCADE
        )
        """)
        
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS tender_winners (
            nomor_pengadaan VARCHAR(255) PRIMARY KEY,
            nama_pemenang TEXT,
            alamat TEXT,
            npwp TEXT,
            harga_kontrak DOUBLE PRECISION,
            nilai_pdn DOUBLE PRECISION,
            nilai_umk DOUBLE PRECISION,
            FOREIGN KEY (nomor_pengadaan) REFERENCES tenders (nomor_pengadaan) ON DELETE CASCADE
        )
        """)
        
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS competitor_evaluations (
            id SERIAL PRIMARY KEY,
            nomor_pengadaan VARCHAR(255),
            nama_peserta VARCHAR(255),
            npwp TEXT,
            harga_penawaran DOUBLE PRECISION,
            harga_terkoreksi DOUBLE PRECISION,
            evaluasi_administrasi TEXT,
            evaluasi_teknis TEXT,
            evaluasi_harga TEXT,
            evaluasi_kualifikasi TEXT,
            alasan_gugur TEXT,
            is_winner INTEGER DEFAULT 0,
            scraped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (nomor_pengadaan) REFERENCES tenders (nomor_pengadaan) ON DELETE CASCADE
        )
        """)
        
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS articles (
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            slug VARCHAR(255) UNIQUE NOT NULL,
            content TEXT NOT NULL,
            meta_title TEXT,
            meta_description TEXT,
            meta_keywords TEXT,
            is_pinned INTEGER DEFAULT 0,
            is_published INTEGER DEFAULT 1,
            image_url TEXT,
            youtube_embed TEXT,
            created_at TEXT,
            updated_at TEXT
        )
        """)
        
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS password_resets (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL,
            token_hash VARCHAR(255) NOT NULL,
            expires_at TEXT NOT NULL,
            used INTEGER DEFAULT 0,
            created_at TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )
        """)

        cursor.execute("""
        CREATE TABLE IF NOT EXISTS contact_submissions (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            phone TEXT NOT NULL,
            email TEXT,
            message TEXT NOT NULL,
            status VARCHAR(50) DEFAULT 'new',
            created_at TEXT
        )
        """)

        cursor.execute("""
        CREATE TABLE IF NOT EXISTS crawl_logs (
            id SERIAL PRIMARY KEY,
            instansi VARCHAR(255),
            tipe VARCHAR(50),
            status VARCHAR(50),
            records_count INTEGER DEFAULT 0,
            error_message TEXT,
            created_at TEXT
        )
        """)

        cursor.execute("""
        CREATE TABLE IF NOT EXISTS company_contacts (
            id SERIAL PRIMARY KEY,
            company_name VARCHAR(255) UNIQUE NOT NULL,
            npwp VARCHAR(255),
            email VARCHAR(255),
            phone VARCHAR(255),
            updated_at TEXT
        )
        """)
    else:
        try:
            cursor.execute("PRAGMA table_info(alerts)")
            columns = [c[1] for c in cursor.fetchall()]
            if columns and ('user_id' not in columns or 'instansi' not in columns):
                cursor.execute("DROP TABLE IF EXISTS sent_alerts")
                cursor.execute("DROP TABLE IF EXISTS alerts")
        except Exception:
            pass

        cursor.execute("""
        CREATE TABLE IF NOT EXISTS tenders (
            nomor_pengadaan TEXT PRIMARY KEY,
            nama_tender TEXT,
            instansi TEXT,
            tahap TEXT,
            pagu TEXT,
            pagu_val REAL,
            metode TEXT,
            jenis_pengadaan TEXT,
            kategori TEXT,
            tipe TEXT,
            tahun INTEGER,
            scraped_at TEXT,
            tanggal_mulai_tender TEXT,
            akhir_penawaran TEXT
        )
        """)
        
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS tender_details (
            nomor_pengadaan TEXT PRIMARY KEY,
            syarat_kualifikasi TEXT,
            uraian_singkat_pekerjaan TEXT,
            satuan_kerja TEXT,
            jenis_kontrak TEXT,
            lokasi_pekerjaan TEXT,
            tanggal_pembuatan TEXT,
            alasan_diulang TEXT,
            scraped_at TEXT,
            jadwal TEXT,
            FOREIGN KEY (nomor_pengadaan) REFERENCES tenders (nomor_pengadaan) ON DELETE CASCADE
        )
        """)
        
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS system_settings (
            key TEXT PRIMARY KEY,
            value TEXT
        )
        """)
        
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            whatsapp TEXT,
            role TEXT DEFAULT 'user',
            created_at TEXT
        )
        """)
        
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS subscriptions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            plan_type TEXT DEFAULT 'trial',
            start_date TEXT,
            end_date TEXT,
            status TEXT DEFAULT 'active',
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )
        """)
        
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS bookmarks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            nomor_pengadaan TEXT NOT NULL,
            bookmarked_at TEXT,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
            FOREIGN KEY (nomor_pengadaan) REFERENCES tenders (nomor_pengadaan) ON DELETE CASCADE,
            UNIQUE(user_id, nomor_pengadaan)
        )
        """)
        
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS transactions (
            order_id TEXT PRIMARY KEY,
            user_id INTEGER NOT NULL,
            plan_type TEXT NOT NULL,
            amount REAL NOT NULL,
            status TEXT DEFAULT 'pending',
            duration_days INTEGER DEFAULT 30,
            snap_token TEXT,
            created_at TEXT,
            updated_at TEXT,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )
        """)
        
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS vouchers (
            code TEXT PRIMARY KEY,
            discount_type TEXT NOT NULL,
            discount_value REAL NOT NULL,
            max_uses INTEGER DEFAULT 100,
            used_count INTEGER DEFAULT 0,
            is_active INTEGER DEFAULT 1,
            expires_at TEXT
        )
        """)
        
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS alerts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            keyword TEXT NOT NULL,
            email TEXT NOT NULL,
            whatsapp TEXT,
            instansi TEXT NOT NULL,
            created_at TEXT,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )
        """)
        
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS sent_alerts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            alert_id INTEGER,
            nomor_pengadaan TEXT,
            sent_at TEXT,
            FOREIGN KEY (alert_id) REFERENCES alerts (id) ON DELETE CASCADE,
            FOREIGN KEY (nomor_pengadaan) REFERENCES tenders (nomor_pengadaan) ON DELETE CASCADE,
            UNIQUE(alert_id, nomor_pengadaan)
        )
        """)
        
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS tender_participants (
            nomor_pengadaan TEXT,
            nama_peserta TEXT,
            npwp TEXT,
            harga_penawaran REAL,
            harga_terkoreksi REAL,
            PRIMARY KEY (nomor_pengadaan, nama_peserta),
            FOREIGN KEY (nomor_pengadaan) REFERENCES tenders (nomor_pengadaan) ON DELETE CASCADE
        )
        """)
        
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS tender_winners (
            nomor_pengadaan TEXT PRIMARY KEY,
            nama_pemenang TEXT,
            alamat TEXT,
            npwp TEXT,
            harga_kontrak REAL,
            nilai_pdn REAL,
            nilai_umk REAL,
            FOREIGN KEY (nomor_pengadaan) REFERENCES tenders (nomor_pengadaan) ON DELETE CASCADE
        )
        """)
        
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS competitor_evaluations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nomor_pengadaan TEXT,
            nama_peserta TEXT,
            npwp TEXT,
            harga_penawaran REAL,
            harga_terkoreksi REAL,
            evaluasi_administrasi TEXT,
            evaluasi_teknis TEXT,
            evaluasi_harga TEXT,
            evaluasi_kualifikasi TEXT,
            alasan_gugur TEXT,
            is_winner INTEGER DEFAULT 0,
            scraped_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (nomor_pengadaan) REFERENCES tenders (nomor_pengadaan) ON DELETE CASCADE
        )
        """)
        
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS articles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            slug TEXT UNIQUE NOT NULL,
            content TEXT NOT NULL,
            meta_title TEXT,
            meta_description TEXT,
            meta_keywords TEXT,
            is_pinned INTEGER DEFAULT 0,
            is_published INTEGER DEFAULT 1,
            image_url TEXT,
            youtube_embed TEXT,
            created_at TEXT,
            updated_at TEXT
        )
        """)
        
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS password_resets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            token_hash TEXT NOT NULL,
            expires_at TEXT NOT NULL,
            used INTEGER DEFAULT 0,
            created_at TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )
        """)

        cursor.execute("""
        CREATE TABLE IF NOT EXISTS contact_submissions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT NOT NULL,
            email TEXT,
            message TEXT NOT NULL,
            status TEXT DEFAULT 'new',
            created_at TEXT
        )
        """)

    # Always ensure crawl_logs table exists
    if is_pg:
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS crawl_logs (
            id SERIAL PRIMARY KEY,
            instansi VARCHAR(255),
            tipe VARCHAR(50),
            status VARCHAR(50),
            records_count INTEGER DEFAULT 0,
            error_message TEXT,
            created_at TEXT
        )
        """)
    else:
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS crawl_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            instansi TEXT,
            tipe TEXT,
            status TEXT,
            records_count INTEGER DEFAULT 0,
            error_message TEXT,
            created_at TEXT
        )
        """)
    
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS company_contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            company_name TEXT UNIQUE NOT NULL,
            npwp TEXT,
            email TEXT,
            phone TEXT,
            updated_at TEXT
        )
        """)
        
    # Seed default system settings
    default_settings = {
        "premium_price": "150000",
        "premium_price_yearly": "1500000",
        "chatbot_active": "true",
        "chatbot_name": "Nadia",
        "chatbot_avatar": "",
        "chatbot_initial_greeting": "Halo! Saya Nadia, asisten virtual Spy SPSE. Ada yang bisa saya bantu terkait pemantauan tender LPSE?",
        "chatbot_ask_name_message": "Boleh tahu siapa nama Anda?",
        "chatbot_ask_phone_message": "Boleh minta nomor WhatsApp Anda yang aktif? (Contoh: 08123456789)",
        "chatbot_ask_email_message": "Bisa infokan juga alamat email Anda?",
        "chatbot_ask_reason_message": "Terima kasih! Silakan ceritakan apa yang ingin Anda tanyakan atau konsultasikan mengenai pemantauan tender LPSE?",
        "chatbot_final_message": "Terima kasih! Informasi Anda sudah kami simpan. Silakan klik tombol di bawah untuk langsung terhubung dengan tim teknis kami di WhatsApp.",
        "lpse_instances": json.dumps([
            {"name": "Nasional", "slug": "nasional", "jenis": "Lembaga"},
            {"name": "Kota Padang", "slug": "padang", "jenis": "Kota"},
            {"name": "DKI Jakarta", "slug": "jakarta", "jenis": "Provinsi"},
            {"name": "LKPP", "slug": "lkpp", "jenis": "Lembaga"},
        ])
    }
    
    for k, v in default_settings.items():
        cursor.execute("INSERT OR IGNORE INTO system_settings (key, value) VALUES (?, ?)", (k, v))
        
    conn.commit()
    conn.close()

# User Helpers
def get_user_by_id(user_id):
    if user_id is None or str(user_id) == 'None' or not str(user_id).isdigit():
        return None
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE id = ?", (int(user_id),))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None

def get_user_by_email(email):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email = ?", (str(email).strip().lower(),))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None

def create_user(email, password_hash, role='user', whatsapp=None):
    conn = get_db_connection()
    cursor = conn.cursor()
    now_str = datetime.now().isoformat()
    
    is_pg = hasattr(conn, '_pool')
    if is_pg:
        cursor.execute("""
            INSERT INTO users (email, password_hash, whatsapp, role, created_at)
            VALUES (?, ?, ?, ?, ?) RETURNING id
        """, (str(email).strip().lower(), password_hash, whatsapp, role, now_str))
        user_id = cursor.fetchone()[0]
    else:
        cursor.execute("""
            INSERT INTO users (email, password_hash, whatsapp, role, created_at)
            VALUES (?, ?, ?, ?, ?)
        """, (str(email).strip().lower(), password_hash, whatsapp, role, now_str))
        user_id = cursor.lastrowid
        if not user_id:
            cursor.execute("SELECT id FROM users WHERE email = ?", (str(email).strip().lower(),))
            row = cursor.fetchone()
            user_id = row['id'] if row else None
    
    # Initialize a 7-day trial subscription automatically
    start_date = datetime.now()
    end_date = start_date + timedelta(days=7)
    cursor.execute("""
        INSERT INTO subscriptions (user_id, plan_type, start_date, end_date, status)
        VALUES (?, 'trial', ?, ?, 'active')
    """, (int(user_id), start_date.isoformat(), end_date.isoformat()))
    
    conn.commit()
    conn.close()
    return user_id

def update_user_subscription(user_id, plan_type, status='active', duration_days=30):
    if user_id is None or str(user_id) == 'None' or not str(user_id).isdigit():
        return
    user_id = int(user_id)
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT end_date, status FROM subscriptions WHERE user_id = ?", (user_id,))
    sub = cursor.fetchone()
    
    start_date = datetime.now()
    if sub and sub['status'] == 'active' and sub['end_date']:
        try:
            curr_end = datetime.fromisoformat(sub['end_date'])
            if curr_end > start_date:
                start_date = curr_end
        except Exception:
            pass
            
    end_date = start_date + timedelta(days=duration_days)
    
    if sub:
        cursor.execute("""
            UPDATE subscriptions SET
                plan_type = ?,
                start_date = ?,
                end_date = ?,
                status = ?
            WHERE user_id = ?
        """, (plan_type, datetime.now().isoformat(), end_date.isoformat(), status, user_id))
    else:
        cursor.execute("""
            INSERT INTO subscriptions (user_id, plan_type, start_date, end_date, status)
            VALUES (?, ?, ?, ?, ?)
        """, (user_id, plan_type, datetime.now().isoformat(), end_date.isoformat(), status))
    conn.commit()
    conn.close()

def create_password_reset(user_id, token_hash, expires_at):
    conn = get_db_connection()
    cursor = conn.cursor()
    now_str = datetime.now().isoformat()
    cursor.execute("""
        INSERT INTO password_resets (user_id, token_hash, expires_at, used, created_at)
        VALUES (?, ?, ?, 0, ?)
    """, (int(user_id), token_hash, expires_at, now_str))
    conn.commit()
    conn.close()

def get_password_reset_by_hash(token_hash):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT * FROM password_resets WHERE token_hash = ? ORDER BY id DESC LIMIT 1
    """, (token_hash,))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None

def mark_password_reset_used(reset_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE password_resets SET used = 1 WHERE id = ?", (int(reset_id),))
    conn.commit()
    conn.close()

def update_user_password(user_id, password_hash):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE users SET password_hash = ? WHERE id = ?", (password_hash, int(user_id)))
    conn.commit()
    conn.close()


def get_user_subscription(user_id):
    if user_id is None:
        return None
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM subscriptions WHERE user_id = ? ORDER BY id DESC LIMIT 1", (int(user_id),))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None

# Tender Helpers
def save_tender(tender_data):
    conn = get_db_connection()
    cursor = conn.cursor()
    pagu_str = tender_data.get("pagu", "")
    pagu_val = parse_pagu(pagu_str)
    
    cursor.execute("""
        INSERT INTO tenders (
            nomor_pengadaan, nama_tender, instansi, tahap, pagu, pagu_val,
            metode, jenis_pengadaan, kategori, tipe, tahun, scraped_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(nomor_pengadaan) DO UPDATE SET
            nama_tender=excluded.nama_tender,
            instansi=excluded.instansi,
            tahap=excluded.tahap,
            pagu=excluded.pagu,
            pagu_val=excluded.pagu_val,
            metode=excluded.metode,
            jenis_pengadaan=excluded.jenis_pengadaan,
            kategori=excluded.kategori,
            tipe=excluded.tipe,
            tahun=excluded.tahun,
            scraped_at=excluded.scraped_at
    """, (
        tender_data.get("nomor_pengadaan"),
        clean_str(tender_data.get("nama_tender")),
        clean_str(tender_data.get("instansi")),
        clean_str(tender_data.get("tahap")),
        clean_str(pagu_str),
        pagu_val,
        clean_str(tender_data.get("metode")),
        clean_str(tender_data.get("jenis_pengadaan")),
        clean_str(tender_data.get("kategori")),
        clean_str(tender_data.get("tipe")),
        tender_data.get("tahun"),
        datetime.now().isoformat()
    ))
    conn.commit()
    conn.close()

def save_tender_detail(detail_data):
    conn = get_db_connection()
    cursor = conn.cursor()
    nomor_pengadaan = detail_data.get("nomor_pengadaan")
    
    tanggal_mulai_tender = parse_indonesian_date(detail_data.get("tanggal_mulai_tender"))
    akhir_penawaran = parse_indonesian_date(detail_data.get("akhir_penawaran"))
    
    if tanggal_mulai_tender or akhir_penawaran:
        if tanggal_mulai_tender and akhir_penawaran:
            cursor.execute("UPDATE tenders SET tanggal_mulai_tender=?, akhir_penawaran=? WHERE nomor_pengadaan=?", (tanggal_mulai_tender, akhir_penawaran, nomor_pengadaan))
        elif tanggal_mulai_tender:
            cursor.execute("UPDATE tenders SET tanggal_mulai_tender=? WHERE nomor_pengadaan=?", (tanggal_mulai_tender, nomor_pengadaan))
        elif akhir_penawaran:
            cursor.execute("UPDATE tenders SET akhir_penawaran=? WHERE nomor_pengadaan=?", (akhir_penawaran, nomor_pengadaan))
            
    cursor.execute("""
        INSERT INTO tender_details (
            nomor_pengadaan, syarat_kualifikasi, uraian_singkat_pekerjaan,
            satuan_kerja, jenis_kontrak, lokasi_pekerjaan, tanggal_pembuatan,
            alasan_diulang, scraped_at, jadwal
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(nomor_pengadaan) DO UPDATE SET
            syarat_kualifikasi=excluded.syarat_kualifikasi,
            uraian_singkat_pekerjaan=excluded.uraian_singkat_pekerjaan,
            satuan_kerja=excluded.satuan_kerja,
            jenis_kontrak=excluded.jenis_kontrak,
            lokasi_pekerjaan=excluded.lokasi_pekerjaan,
            tanggal_pembuatan=excluded.tanggal_pembuatan,
            alasan_diulang=excluded.alasan_diulang,
            scraped_at=excluded.scraped_at,
            jadwal=excluded.jadwal
    """, (
        nomor_pengadaan,
        clean_str(detail_data.get("syarat_kualifikasi")),
        clean_str(detail_data.get("uraian_singkat_pekerjaan")),
        clean_str(detail_data.get("satuan_kerja")),
        clean_str(detail_data.get("jenis_kontrak")),
        clean_str(detail_data.get("lokasi_pekerjaan")),
        clean_str(detail_data.get("tanggal_pembuatan")),
        clean_str(detail_data.get("alasan_diulang")),
        datetime.now().isoformat(),
        detail_data.get("jadwal")
    ))
    conn.commit()
    conn.close()

def save_tender_participants(nomor_pengadaan, participants):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM tender_participants WHERE nomor_pengadaan=?", (nomor_pengadaan,))
    for p in participants:
        nama = clean_str(p.get("nama_peserta"))
        if not nama:
            continue
        cursor.execute("""
            INSERT OR REPLACE INTO tender_participants (
                nomor_pengadaan, nama_peserta, npwp, harga_penawaran, harga_terkoreksi
            ) VALUES (?, ?, ?, ?, ?)
        """, (
            nomor_pengadaan,
            nama,
            clean_str(p.get("npwp")),
            p.get("harga_penawaran"),
            p.get("harga_terkoreksi")
        ))
    conn.commit()
    conn.close()

def save_tender_winner(nomor_pengadaan, winner):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT OR REPLACE INTO tender_winners (
            nomor_pengadaan, nama_pemenang, alamat, npwp, harga_kontrak, nilai_pdn, nilai_umk
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        nomor_pengadaan,
        clean_str(winner.get("nama_pemenang")),
        clean_str(winner.get("alamat")),
        clean_str(winner.get("npwp")),
        winner.get("harga_kontrak"),
        winner.get("nilai_pdn"),
        winner.get("nilai_umk")
    ))
    conn.commit()
    conn.close()

def save_competitor_evaluations(nomor_pengadaan, eval_list, winner_name=None):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM competitor_evaluations WHERE nomor_pengadaan=?", (nomor_pengadaan,))
    for ev in eval_list:
        nama = clean_str(ev.get("nama_peserta"))
        if not nama:
            continue
            
        is_winner = 0
        if winner_name and clean_str(winner_name).lower() == nama.lower():
            is_winner = 1
            
        cursor.execute("""
            INSERT INTO competitor_evaluations (
                nomor_pengadaan, nama_peserta, npwp, harga_penawaran, harga_terkoreksi,
                evaluasi_administrasi, evaluasi_teknis, evaluasi_harga, evaluasi_kualifikasi,
                alasan_gugur, is_winner
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            nomor_pengadaan,
            nama,
            clean_str(ev.get("npwp")),
            ev.get("harga_penawaran"),
            ev.get("harga_terkoreksi"),
            clean_str(ev.get("evaluasi_administrasi")),
            clean_str(ev.get("evaluasi_teknis")),
            clean_str(ev.get("evaluasi_harga")),
            clean_str(ev.get("evaluasi_kualifikasi")),
            clean_str(ev.get("alasan_gugur")),
            is_winner
        ))
    conn.commit()
    conn.close()

# Settings Helpers
def get_setting(key, default=None):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT value FROM system_settings WHERE key = ?", (key,))
    row = cursor.fetchone()
    conn.close()
    if row:
        return row[0]
    return default

def set_setting(key, value):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO system_settings (key, value) VALUES (?, ?)
        ON CONFLICT(key) DO UPDATE SET value=excluded.value
    """, (key, str(value)))
    conn.commit()
    conn.close()

# Transaction Helpers
def get_transaction(order_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM transactions WHERE order_id = ?", (order_id,))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None

# Voucher Helpers
def create_voucher(code, discount_type, discount_value, max_uses=100, expires_at=None):
    conn = get_db_connection()
    cursor = conn.cursor()
    code_upper = str(code).strip().upper()
    cursor.execute("""
        INSERT INTO vouchers (code, discount_type, discount_value, max_uses, used_count, is_active, expires_at)
        VALUES (?, ?, ?, ?, 0, 1, ?)
    """, (code_upper, discount_type, discount_value, max_uses, expires_at))
    conn.commit()
    conn.close()
    return code_upper

def get_voucher(code):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM vouchers WHERE code = ?", (str(code).strip().upper(),))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None

def increment_voucher_usage(code):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE vouchers SET used_count = used_count + 1 WHERE code = ?", (str(code).strip().upper(),))
    conn.commit()
    conn.close()

def delete_voucher(code):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM vouchers WHERE code = ?", (str(code).strip().upper(),))
    conn.commit()
    conn.close()

def get_all_vouchers():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM vouchers")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

# Article Helpers
def create_article(title, slug, content, meta_title=None, meta_description=None, meta_keywords=None, is_pinned=0, is_published=1, image_url=None, youtube_embed=None):
    conn = get_db_connection()
    cursor = conn.cursor()
    now_str = datetime.now().isoformat()
    
    is_pg = hasattr(conn, '_pool')
    if is_pg:
        cursor.execute("""
            INSERT INTO articles (
                title, slug, content, meta_title, meta_description, meta_keywords,
                is_pinned, is_published, image_url, youtube_embed, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id
        """, (
            clean_str(title),
            clean_str(slug).lower(),
            content,
            clean_str(meta_title) if meta_title else None,
            clean_str(meta_description) if meta_description else None,
            clean_str(meta_keywords) if meta_keywords else None,
            is_pinned,
            is_published,
            image_url,
            youtube_embed,
            now_str,
            now_str
        ))
        article_id = cursor.fetchone()[0]
    else:
        cursor.execute("""
            INSERT INTO articles (
                title, slug, content, meta_title, meta_description, meta_keywords,
                is_pinned, is_published, image_url, youtube_embed, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            clean_str(title),
            clean_str(slug).lower(),
            content,
            clean_str(meta_title) if meta_title else None,
            clean_str(meta_description) if meta_description else None,
            clean_str(meta_keywords) if meta_keywords else None,
            is_pinned,
            is_published,
            image_url,
            youtube_embed,
            now_str,
            now_str
        ))
        article_id = cursor.lastrowid
        if not article_id:
            cursor.execute("SELECT id FROM articles WHERE slug = ?", (clean_str(slug).lower(),))
            row = cursor.fetchone()
            article_id = row['id'] if row else None
    conn.commit()
    conn.close()
    return article_id

def get_article_by_slug(slug):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM articles WHERE slug = ?", (str(slug).strip().lower(),))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None

def get_all_articles(include_unpublished=False):
    conn = get_db_connection()
    cursor = conn.cursor()
    if include_unpublished:
        cursor.execute("SELECT * FROM articles ORDER BY is_pinned DESC, created_at DESC")
    else:
        cursor.execute("SELECT * FROM articles WHERE is_published = 1 ORDER BY is_pinned DESC, created_at DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

def update_article(article_id, title, slug, content, meta_title=None, meta_description=None, meta_keywords=None, is_pinned=0, is_published=1, image_url=None, youtube_embed=None):
    if article_id is not None:
        article_id = int(article_id)
    conn = get_db_connection()
    cursor = conn.cursor()
    now_str = datetime.now().isoformat()
    cursor.execute("""
        UPDATE articles SET
            title = ?,
            slug = ?,
            content = ?,
            meta_title = ?,
            meta_description = ?,
            meta_keywords = ?,
            is_pinned = ?,
            is_published = ?,
            image_url = ?,
            youtube_embed = ?,
            updated_at = ?
        WHERE id = ?
    """, (
        clean_str(title),
        clean_str(slug).lower(),
        content,
        clean_str(meta_title) if meta_title else None,
        clean_str(meta_description) if meta_description else None,
        clean_str(meta_keywords) if meta_keywords else None,
        is_pinned,
        is_published,
        image_url,
        youtube_embed,
        now_str,
        article_id
    ))
    conn.commit()
    conn.close()

def delete_article(article_id):
    if article_id is not None:
        article_id = int(article_id)
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM articles WHERE id = ?", (article_id,))
    conn.commit()
    conn.close()

# Contact Submissions / Leads Helpers
def create_contact_submission(name, phone, email=None, message=""):
    conn = get_db_connection()
    cursor = conn.cursor()
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    cursor.execute("""
        INSERT INTO contact_submissions (name, phone, email, message, status, created_at)
        VALUES (?, ?, ?, ?, 'new', ?)
    """, (clean_str(name), clean_str(phone), clean_str(email) if email else None, clean_str(message), now_str))
    last_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return last_id

def get_all_contact_submissions():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM contact_submissions ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows] if rows else []

def update_contact_submission_status(submission_id, status):
    if submission_id is not None:
        submission_id = int(submission_id)
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE contact_submissions SET status = ? WHERE id = ?", (clean_str(status), submission_id))
    conn.commit()
    conn.close()

def delete_contact_submission(submission_id):
    if submission_id is not None:
        submission_id = int(submission_id)
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM contact_submissions WHERE id = ?", (submission_id,))
    conn.commit()
    conn.close()

def save_crawl_log(instansi, tipe="tender", status="success", records_count=0, error_message=None):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        cursor.execute("""
            INSERT INTO crawl_logs (instansi, tipe, status, records_count, error_message, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (clean_str(instansi), clean_str(tipe), clean_str(status), int(records_count or 0), clean_str(error_message) if error_message else None, now_str))
        conn.commit()
        conn.close()
    except Exception as e:
        logging.error(f"Failed to save crawl log to DB: {e}")

def get_recent_crawl_logs(limit=50):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM crawl_logs ORDER BY id DESC LIMIT ?", (int(limit),))
        rows = cursor.fetchall()
        conn.close()
        return [dict(r) for r in rows] if rows else []
    except Exception as e:
        logging.error(f"Failed to fetch crawl logs from DB: {e}")
        return []

def clear_all_crawl_logs():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM crawl_logs")
        conn.commit()
        conn.close()
        return True
    except Exception as e:
        logging.error(f"Failed to clear crawl logs from DB: {e}")
        return False

def upsert_company_contact(company_name, email=None, phone=None, npwp=None):
    company_name_clean = clean_str(company_name)
    if not company_name_clean:
        return False
    email_clean = clean_str(email) if email else ""
    phone_clean = clean_str(phone) if phone else ""
    npwp_clean = clean_str(npwp) if npwp else ""
    now_str = datetime.now().isoformat()
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    is_pg = hasattr(conn, '_pool')
    if is_pg:
        cursor.execute("""
            INSERT INTO company_contacts (company_name, npwp, email, phone, updated_at)
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT (company_name) DO UPDATE SET
                npwp = CASE WHEN EXCLUDED.npwp != '' THEN EXCLUDED.npwp ELSE company_contacts.npwp END,
                email = EXCLUDED.email,
                phone = EXCLUDED.phone,
                updated_at = EXCLUDED.updated_at
        """, (company_name_clean, npwp_clean, email_clean, phone_clean, now_str))
    else:
        cursor.execute("""
            INSERT INTO company_contacts (company_name, npwp, email, phone, updated_at)
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(company_name) DO UPDATE SET
                npwp = CASE WHEN EXCLUDED.npwp != '' THEN EXCLUDED.npwp ELSE company_contacts.npwp END,
                email = EXCLUDED.email,
                phone = EXCLUDED.phone,
                updated_at = EXCLUDED.updated_at
        """, (company_name_clean, npwp_clean, email_clean, phone_clean, now_str))
    conn.commit()
    conn.close()
    return True

def get_company_leads(search="", filter_status="all", page=1, limit=20):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    search_clean = clean_str(search).strip()
    search_param = f"%{search_clean}%"
    
    query_base = """
    FROM (
        SELECT DISTINCT nama_peserta AS company_name FROM competitor_evaluations WHERE nama_peserta IS NOT NULL AND nama_peserta != ''
        UNION
        SELECT DISTINCT nama_pemenang AS company_name FROM tender_winners WHERE nama_pemenang IS NOT NULL AND nama_pemenang != ''
        UNION
        SELECT DISTINCT nama_peserta AS company_name FROM tender_participants WHERE nama_peserta IS NOT NULL AND nama_peserta != ''
    ) c
    LEFT JOIN company_contacts cc ON c.company_name = cc.company_name
    LEFT JOIN (
        SELECT nama_pemenang, COUNT(*) AS total_wins, SUM(harga_kontrak) AS total_contract_value, MAX(npwp) AS npwp
        FROM tender_winners
        GROUP BY nama_pemenang
    ) w ON c.company_name = w.nama_pemenang
    LEFT JOIN (
        SELECT nama_peserta, COUNT(DISTINCT nomor_pengadaan) AS total_followed, MAX(npwp) AS npwp
        FROM competitor_evaluations
        WHERE harga_penawaran > 0 OR harga_terkoreksi > 0 OR is_winner = 1
        GROUP BY nama_peserta
    ) e ON c.company_name = e.nama_peserta
    LEFT JOIN (
        SELECT nama_peserta, MAX(npwp) AS npwp
        FROM tender_participants
        GROUP BY nama_peserta
    ) p ON c.company_name = p.nama_peserta
    WHERE 1=1
    """
    params = []
    if search_clean:
        query_base += " AND (c.company_name LIKE ? OR cc.npwp LIKE ? OR w.npwp LIKE ? OR e.npwp LIKE ? OR p.npwp LIKE ?)"
        params.extend([search_param, search_param, search_param, search_param, search_param])
        
    if filter_status == "has_contact":
        query_base += " AND ((cc.email IS NOT NULL AND cc.email != '') OR (cc.phone IS NOT NULL AND cc.phone != ''))"
    elif filter_status == "no_contact":
        query_base += " AND ((cc.email IS NULL OR cc.email = '') AND (cc.phone IS NULL OR cc.phone = ''))"
        
    # Count total matching rows
    cursor.execute(f"SELECT COUNT(*) {query_base}", params)
    total_count = cursor.fetchone()[0] or 0

    # Fetch global stats (total unique companies, total with contacts, total without contacts)
    stats_query = """
    SELECT 
        COUNT(*) as total_all,
        COALESCE(SUM(CASE WHEN (cc.email IS NOT NULL AND cc.email != '') OR (cc.phone IS NOT NULL AND cc.phone != '') THEN 1 ELSE 0 END), 0) as total_has_contact
    FROM (
        SELECT DISTINCT nama_peserta AS company_name FROM competitor_evaluations WHERE nama_peserta IS NOT NULL AND nama_peserta != ''
        UNION
        SELECT DISTINCT nama_pemenang AS company_name FROM tender_winners WHERE nama_pemenang IS NOT NULL AND nama_pemenang != ''
        UNION
        SELECT DISTINCT nama_peserta AS company_name FROM tender_participants WHERE nama_peserta IS NOT NULL AND nama_peserta != ''
    ) c
    LEFT JOIN company_contacts cc ON c.company_name = cc.company_name
    """
    cursor.execute(stats_query)
    stats_row = cursor.fetchone()
    total_all_companies = (stats_row[0] or 0) if stats_row else 0
    total_has_contact = (stats_row[1] or 0) if stats_row else 0
    total_no_contact = max(total_all_companies - total_has_contact, 0)
    
    # Select columns & sort by total_contract_value DESC, total_wins DESC
    select_query = f"""
    SELECT 
        c.company_name,
        COALESCE(cc.email, '') AS email,
        COALESCE(cc.phone, '') AS phone,
        COALESCE(cc.npwp, w.npwp, e.npwp, p.npwp, '-') AS npwp,
        COALESCE(w.total_wins, 0) AS total_wins,
        COALESCE(w.total_contract_value, 0.0) AS total_contract_value,
        COALESCE(e.total_followed, w.total_wins, 0) AS total_followed,
        cc.updated_at
    {query_base}
    ORDER BY total_contract_value DESC, total_wins DESC, c.company_name ASC
    """
    
    if limit and limit > 0:
        offset = (page - 1) * limit
        select_query += f" LIMIT {limit} OFFSET {offset}"
        
    cursor.execute(select_query, params)
    rows = cursor.fetchall()
    
    results = []
    for r in rows:
        r_dict = dict(r)
        total_followed = r_dict.get("total_followed") or 0
        total_wins = r_dict.get("total_wins") or 0
        win_rate = 0
        if total_followed > 0:
            win_rate = round((total_wins / total_followed) * 100)
        elif total_wins > 0:
            win_rate = 100
        r_dict["win_rate"] = win_rate
        results.append(r_dict)
        
    conn.close()
    return {
        "items": results,
        "total": total_count,
        "page": page,
        "limit": limit,
        "stats": {
            "total_companies": total_all_companies,
            "has_contact": total_has_contact,
            "no_contact": total_no_contact
        }
    }

def get_all_company_leads_for_export(search="", filter_status="all"):
    res = get_company_leads(search=search, filter_status=filter_status, page=1, limit=100000)
    return res.get("items", [])

# Initialize DB on import
init_db()

