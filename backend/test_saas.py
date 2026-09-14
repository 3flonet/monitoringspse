import os
import sys
import unittest
from pathlib import Path

# Add backend to sys.path so we can import modules
sys.path.append(str(Path(__file__).parent.parent))

from backend.database import init_db, create_user, get_user_by_email, get_user_subscription, update_user_subscription, get_db_connection, set_setting, get_setting
from backend.auth import hash_password, verify_password, create_access_token, decode_access_token
from backend.whatsapp_notifier import send_whatsapp_alert, send_test_whatsapp

class TestSaaSIntegration(unittest.TestCase):
    
    @classmethod
    def setUpClass(cls):
        # Initialize DB (creates database and runs migrations if not already run)
        init_db()

    def test_database_and_auth(self):
        email = "test_saas_user@domain.com"
        password = "secretpassword"
        
        # Clean up existing test user
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM users WHERE email = ?", (email,))
        conn.commit()
        conn.close()

        # Create user
        hashed = hash_password(password)
        user_id = create_user(email, hashed, whatsapp="08123456789")
        self.assertIsNotNone(user_id)
        
        # Retrieve user
        user = get_user_by_email(email)
        self.assertIsNotNone(user)
        self.assertEqual(user["email"], email)
        self.assertEqual(user["whatsapp"], "08123456789")
        self.assertTrue(verify_password(password, user["password_hash"]))
        
        # Check trial subscription
        sub = get_user_subscription(user_id)
        self.assertEqual(sub["plan_type"], "trial")
        self.assertEqual(sub["status"], "active")
        
        # Upgrade subscription to premium
        update_user_subscription(user_id, plan_type="premium", status="active", duration_days=30)
        sub_updated = get_user_subscription(user_id)
        self.assertEqual(sub_updated["plan_type"], "premium")
        
        # Clean up
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM users WHERE id = ?", (user_id,))
        conn.commit()
        conn.close()

    def test_whatsapp_notifier_mock_fallback(self):
        # Force WhatsApp token to be empty
        set_setting("whatsapp_api_token", "")
        
        # Clear mock WhatsApp log if exists
        log_file = Path(__file__).parent / "mock_whatsapp.log"
        if log_file.exists():
            log_file.unlink()
            
        dummy_tender = {
            "nomor_pengadaan": "123456",
            "nama_tender": "Pembangunan Jalan Protokol Baru",
            "instansi": "Dinas Pekerjaan Umum",
            "pagu": "Rp 5.000.000.000,00",
            "tahap": "Pengumuman Pascakualifikasi",
            "metode": "Tender - Pascakualifikasi Satu File",
            "kategori": "nasional"
        }
        
        # Trigger whatsapp alert
        success = send_whatsapp_alert("08123456789", "jalan", dummy_tender)
        self.assertTrue(success)
        
        # Verify log was written
        self.assertTrue(log_file.exists())
        with open(log_file, "r", encoding="utf-8") as f:
            content = f.read()
            self.assertIn("123456", content)
            self.assertIn("Pembangunan Jalan Protokol Baru", content)
            self.assertIn("08123456789", content)

    def test_whatsapp_notifier_empty_token_test(self):
        # Verify test whatsapp returns fail when token is empty
        res = send_test_whatsapp("08123456789", api_token="")
        self.assertFalse(res["success"])
        self.assertIn("belum dikonfigurasi", res["message"])

if __name__ == "__main__":
    unittest.main()
