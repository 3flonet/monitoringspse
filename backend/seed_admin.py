import os
import sys
from datetime import datetime, timedelta
from pathlib import Path

# Add project root to path
sys.path.append(str(Path(__file__).parent.parent))

from backend.database import get_db_connection, get_user_by_email
from backend.auth import hash_password

def seed_admin():
    email = "admin@spyspse.com"
    password = "admin123"
    role = "admin"
    whatsapp = "081234567890"

    print(f"Checking if user '{email}' already exists...")
    
    user = get_user_by_email(email)
    if user:
        print(f"User '{email}' already exists with role '{user['role']}'. Seeding skipped.")
        return

    print(f"Creating Super Admin account: {email} with password: {password}...")
    hashed = hash_password(password)
    now_str = datetime.now().isoformat()
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    is_pg = hasattr(conn, '_pool')
    
    try:
        # 1. Insert user
        if is_pg:
            cursor.execute("""
                INSERT INTO users (email, password_hash, whatsapp, role, created_at)
                VALUES (?, ?, ?, ?, ?) RETURNING id
            """, (email, hashed, whatsapp, role, now_str))
            user_id = cursor.fetchone()[0]
        else:
            cursor.execute("""
                INSERT INTO users (email, password_hash, whatsapp, role, created_at)
                VALUES (?, ?, ?, ?, ?)
            """, (email, hashed, whatsapp, role, now_str))
            user_id = cursor.lastrowid
            
        # 2. Add sub (unlimited subscription for Admin)
        start_date = datetime.now()
        end_date = start_date + timedelta(days=3650) # 10 years
        cursor.execute("""
            INSERT INTO subscriptions (user_id, plan_type, start_date, end_date, status)
            VALUES (?, 'premium', ?, ?, 'active')
        """, (user_id, start_date.isoformat(), end_date.isoformat()))
        
        conn.commit()
        print(f"[SUCCESS] Super Admin account created successfully! User ID: {user_id}")
    except Exception as e:
        conn.rollback()
        print(f"[ERROR] Failed to seed Admin: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    seed_admin()
