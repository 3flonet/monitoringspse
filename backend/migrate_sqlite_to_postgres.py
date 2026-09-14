import sqlite3
import os
import sys
from pathlib import Path

# Add project root to path
sys.path.append(str(Path(__file__).parent.parent))

from backend.database import get_db_connection, init_db, DB_PATH

def migrate():
    # Verify environment variable
    pg_url = os.getenv("DATABASE_URL")
    if not pg_url:
        print("[Error] DATABASE_URL environment variable is not set.")
        sys.exit(1)

    print(f"Connecting to source SQLite database: {DB_PATH}")
    if not DB_PATH.exists():
        print(f"[Error] Source SQLite database file does not exist at {DB_PATH}")
        sys.exit(1)

    sqlite_conn = sqlite3.connect(DB_PATH)
    sqlite_cursor = sqlite_conn.cursor()

    print("Initializing PostgreSQL database schemas...")
    # This will create tables in PostgreSQL
    init_db()

    pg_conn = get_db_connection()
    pg_cursor = pg_conn.cursor()

    # Get valid reference keys from SQLite to prevent orphaned foreign key violations
    sqlite_cursor.execute("SELECT id FROM users")
    valid_users = {row[0] for row in sqlite_cursor.fetchall()}
    
    sqlite_cursor.execute("SELECT nomor_pengadaan FROM tenders")
    valid_tenders = {row[0] for row in sqlite_cursor.fetchall()}

    sqlite_cursor.execute("SELECT id FROM alerts")
    valid_alerts = {row[0] for row in sqlite_cursor.fetchall()}

    print(f"Loaded validation keys: {len(valid_users)} users, {len(valid_tenders)} tenders, {len(valid_alerts)} alerts")

    # List of tables to migrate
    tables = [
        {"name": "tenders", "pkey": "nomor_pengadaan"},
        {"name": "tender_details", "pkey": "nomor_pengadaan"},
        {"name": "system_settings", "pkey": "key"},
        {"name": "users", "pkey": "id", "seq": "users_id_seq"},
        {"name": "subscriptions", "pkey": "id", "seq": "subscriptions_id_seq"},
        {"name": "bookmarks", "pkey": "id", "seq": "bookmarks_id_seq"},
        {"name": "transactions", "pkey": "order_id"},
        {"name": "vouchers", "pkey": "code"},
        {"name": "alerts", "pkey": "id", "seq": "alerts_id_seq"},
        {"name": "sent_alerts", "pkey": "id", "seq": "sent_alerts_id_seq"},
        {"name": "tender_participants", "pkey": "(nomor_pengadaan, nama_peserta)"},
        {"name": "tender_winners", "pkey": "nomor_pengadaan"},
        {"name": "competitor_evaluations", "pkey": "id", "seq": "competitor_evaluations_id_seq"},
        {"name": "articles", "pkey": "id", "seq": "articles_id_seq"}
    ]

    try:
        for t in tables:
            tname = t["name"]
            print(f"Migrating table: {tname}...")

            # Get columns from SQLite
            sqlite_cursor.execute(f"PRAGMA table_info({tname})")
            columns = [col[1] for col in sqlite_cursor.fetchall()]
            if not columns:
                print(f"  [Warning] Table {tname} has no columns in SQLite. Skipping.")
                continue

            # Fetch all rows from SQLite
            sqlite_cursor.execute(f"SELECT {', '.join(columns)} FROM {tname}")
            rows = sqlite_cursor.fetchall()

            if not rows:
                print("  No rows to transfer.")
                continue

            # Filter out rows that violate foreign keys (data sanitization)
            sanitized_rows = []
            
            # Map column names to index
            col_idx = {name: idx for idx, name in enumerate(columns)}
            
            for row in rows:
                # 1. Check user_id reference
                if "user_id" in col_idx:
                    u_id = row[col_idx["user_id"]]
                    if u_id not in valid_users:
                        # Skip orphaned subscription/alert/bookmark
                        continue
                
                # 2. Check nomor_pengadaan reference
                if "nomor_pengadaan" in col_idx:
                    nomor = row[col_idx["nomor_pengadaan"]]
                    if nomor not in valid_tenders:
                        # Skip orphaned detail/participant/winner/evaluation
                        continue
                        
                # 3. Check alert_id reference in sent_alerts
                if "alert_id" in col_idx:
                    a_id = row[col_idx["alert_id"]]
                    if a_id not in valid_alerts:
                        continue
                        
                sanitized_rows.append(row)

            print(f"  Found {len(rows)} rows in SQLite. Sanitized to {len(sanitized_rows)} valid rows.")

            if not sanitized_rows:
                continue

            # Prepare PostgreSQL insert query
            placeholders = ", ".join(["%s"] * len(columns))
            conflict_clause = ""
            pkey = t["pkey"]
            if tname == "system_settings":
                conflict_clause = " ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value"
            elif tname == "bookmarks":
                conflict_clause = " ON CONFLICT (user_id, nomor_pengadaan) DO NOTHING"
            elif tname == "sent_alerts":
                conflict_clause = " ON CONFLICT (alert_id, nomor_pengadaan) DO NOTHING"
            elif tname == "tender_participants":
                conflict_clause = " ON CONFLICT (nomor_pengadaan, nama_peserta) DO UPDATE SET npwp = EXCLUDED.npwp, harga_penawaran = EXCLUDED.harga_penawaran, harga_terkoreksi = EXCLUDED.harga_terkoreksi"
            elif tname == "tender_winners":
                conflict_clause = " ON CONFLICT (nomor_pengadaan) DO UPDATE SET nama_pemenang = EXCLUDED.nama_pemenang, alamat = EXCLUDED.alamat, npwp = EXCLUDED.npwp, harga_kontrak = EXCLUDED.harga_kontrak, nilai_pdn = EXCLUDED.nilai_pdn, nilai_umk = EXCLUDED.nilai_umk"
            elif pkey and not pkey.startswith("("):
                conflict_clause = f" ON CONFLICT ({pkey}) DO NOTHING"

            insert_query = f"INSERT INTO {tname} ({', '.join(columns)}) VALUES ({placeholders}){conflict_clause}"

            # Execute batch inserts
            data_to_insert = [list(row) for row in sanitized_rows]
            
            chunk_size = 5000
            for i in range(0, len(data_to_insert), chunk_size):
                chunk = data_to_insert[i:i + chunk_size]
                pg_cursor._cursor.executemany(insert_query, chunk)

            print(f"  Successfully migrated {len(sanitized_rows)} rows into PostgreSQL.")

            # Sync sequence if it has one
            if "seq" in t:
                seq_name = t["seq"]
                pg_cursor._cursor.execute(f"SELECT COALESCE(MAX(id), 0) FROM {tname}")
                max_id = pg_cursor._cursor.fetchone()[0]
                if max_id > 0:
                    pg_cursor._cursor.execute(f"SELECT setval('{seq_name}', %s)", (max_id,))
                    print(f"  Synchronized sequence '{seq_name}' to max ID: {max_id}")

        pg_conn.commit()
        print("\n[SUCCESS] Database migration completed successfully!")

    except Exception as e:
        pg_conn.rollback()
        print(f"\n[ERROR] Migration failed: {e}")
        raise e
    finally:
        sqlite_conn.close()
        pg_conn.close()

if __name__ == "__main__":
    migrate()
