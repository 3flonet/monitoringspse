import os
import sys
from pathlib import Path

# Add project root to sys.path
sys.path.append(str(Path(__file__).parent.parent))

from backend.database import get_db_connection, init_db
from backend.seed_admin import seed_admin

def reset_and_seed_database():
    """Wipe all tables and re-initialize schema with default settings and Super Admin account."""
    print("=== PROSES PEMBERSIHAN & RESET DATABASE ===")
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    is_pg = hasattr(conn, '_pool')
    
    if is_pg:
        # PostgreSQL wipe query
        cursor.execute("""
            SELECT tablename FROM pg_tables 
            WHERE schemaname = 'public';
        """)
        tables = [r[0] for r in cursor.fetchall()]
        print(f"Mengosongkan {len(tables)} tabel PostgreSQL...")
        for t in tables:
            cursor.execute(f'TRUNCATE TABLE "{t}" CASCADE;')
            print(f" - Truncated: {t}")
    else:
        # SQLite wipe query
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = [r[0] for r in cursor.fetchall() if not r[0].startswith('sqlite_')]
        print(f"Mengosongkan {len(tables)} tabel SQLite...")
        for t in tables:
            cursor.execute(f'DELETE FROM "{t}";')
            print(f" - Cleared: {t}")
            
    conn.commit()
    conn.close()
    print("[OK] Seluruh isi database berhasil dibersihkan.")
    
    # Re-initialize schema and seed default system settings
    print("\n--- Menjalankan init_db() ---")
    init_db()
    print("[OK] Skema & setting dasar aplikasi berhasil di-seed!")
    
    # Re-seed Super Admin account
    print("\n--- Menjalankan seed_admin() ---")
    seed_admin()
    
    print("\n=== RESET & SEEDING DATABASE SELESAI DENGAN SUKSES ===")

if __name__ == "__main__":
    reset_and_seed_database()
