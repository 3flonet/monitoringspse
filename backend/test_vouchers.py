import sys
import unittest
from pathlib import Path
from datetime import datetime, timedelta

# Add backend to sys.path
sys.path.append(str(Path(__file__).parent.parent))

from backend.database import (
    init_db, create_user, get_user_by_email, get_user_subscription, 
    get_db_connection, set_setting, get_transaction,
    create_voucher, get_voucher, increment_voucher_usage, delete_voucher, get_all_vouchers
)
from fastapi.testclient import TestClient
from backend.main import app

class TestVoucherIntegration(unittest.TestCase):
    
    @classmethod
    def setUpClass(cls):
        init_db()
        cls.client = TestClient(app)
        
    def setUp(self):
        # Clean up database tables for vouchers and test users before each test
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM vouchers")
        cursor.execute("DELETE FROM users WHERE email LIKE '%test%'")
        conn.commit()
        conn.close()

    def test_voucher_database_helpers(self):
        # Test create voucher
        success = create_voucher("PROMO20", "percent", 20.0, max_uses=5, expires_at="2027-12-31")
        self.assertTrue(success)
        
        # Test get voucher
        v = get_voucher("PROMO20")
        self.assertIsNotNone(v)
        self.assertEqual(v["code"], "PROMO20")
        self.assertEqual(v["discount_type"], "percent")
        self.assertEqual(v["discount_value"], 20.0)
        self.assertEqual(v["max_uses"], 5)
        self.assertEqual(v["used_count"], 0)
        self.assertEqual(v["expires_at"], "2027-12-31")
        
        # Test increment usage
        increment_voucher_usage("PROMO20")
        v = get_voucher("PROMO20")
        self.assertEqual(v["used_count"], 1)
        
        # Test get all vouchers
        create_voucher("HEMAT50", "nominal", 50000.0)
        all_v = get_all_vouchers()
        self.assertEqual(len(all_v), 2)
        
        # Test delete voucher
        delete_voucher("PROMO20")
        v = get_voucher("PROMO20")
        self.assertIsNone(v)

    def test_voucher_validation_api(self):
        # 1. Non-existent voucher
        res = self.client.post("/api/billing/voucher/validate", json={"code": "UNKNOWN", "duration_days": 30})
        self.assertEqual(res.status_code, 404)
        
        # 2. Inactive voucher
        create_voucher("OFFLINE", "percent", 10.0)
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("UPDATE vouchers SET is_active = 0 WHERE code = 'OFFLINE'")
        conn.commit()
        conn.close()
        
        res = self.client.post("/api/billing/voucher/validate", json={"code": "OFFLINE", "duration_days": 30})
        self.assertEqual(res.status_code, 400)
        self.assertIn("tidak aktif", res.json()["detail"])
        
        # 3. Expired voucher
        yesterday = (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d")
        create_voucher("EXPIRED", "percent", 10.0, expires_at=yesterday)
        res = self.client.post("/api/billing/voucher/validate", json={"code": "EXPIRED", "duration_days": 30})
        self.assertEqual(res.status_code, 400)
        self.assertIn("kedaluwarsa", res.json()["detail"])
        
        # 4. Max uses reached
        create_voucher("MAXED", "percent", 10.0, max_uses=2)
        increment_voucher_usage("MAXED")
        increment_voucher_usage("MAXED")
        res = self.client.post("/api/billing/voucher/validate", json={"code": "MAXED", "duration_days": 30})
        self.assertEqual(res.status_code, 400)
        self.assertIn("habis", res.json()["detail"])
        
        # 5. Correct percentage discount on monthly price
        set_setting("premium_price", "150000")
        create_voucher("CUT30", "percent", 30.0)
        res = self.client.post("/api/billing/voucher/validate", json={"code": "CUT30", "duration_days": 30})
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data["valid"])
        self.assertEqual(data["discount_amount"], 45000.0)
        self.assertEqual(data["final_price"], 105000.0)
        
        # 6. Correct nominal discount on yearly price
        set_setting("premium_price_yearly", "1500000")
        create_voucher("SAVE200K", "nominal", 200000.0)
        res = self.client.post("/api/billing/voucher/validate", json={"code": "SAVE200K", "duration_days": 365})
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["discount_amount"], 200000.0)
        self.assertEqual(data["final_price"], 1300000.0)

        # 7. Discount cap at base price
        create_voucher("HUGE_DISCOUNT", "nominal", 200000.0)
        res = self.client.post("/api/billing/voucher/validate", json={"code": "HUGE_DISCOUNT", "duration_days": 30})
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["discount_amount"], 150000.0)
        self.assertEqual(data["final_price"], 0.0)

    def test_checkout_with_vouchers(self):
        # Register and login test user
        self.client.post("/api/auth/register", json={
            "email": "voucher_test@domain.com",
            "password": "testpassword",
            "whatsapp": "08123456789"
        })
        login_res = self.client.post("/api/auth/login", json={
            "email": "voucher_test@domain.com",
            "password": "testpassword"
        })
        token = login_res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # Set settings
        set_setting("premium_price", "150000")
        set_setting("midtrans_server_key", "") # force mock snap tokens
        
        # 1. Checkout with standard 20% discount voucher
        create_voucher("PROMO20", "percent", 20.0)
        res = self.client.post("/api/billing/checkout", 
            json={"plan_type": "premium", "duration_days": 30, "voucher_code": "PROMO20"},
            headers=headers
        )
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "success")
        # final amount should be 120,000. The mock snap token should be generated.
        order_id = data["order_id"]
        tx = get_transaction(order_id)
        self.assertEqual(tx["amount"], 120000.0)
        self.assertEqual(tx["status"], "pending")
        
        # Verify voucher usage incremented
        v = get_voucher("PROMO20")
        self.assertEqual(v["used_count"], 1)

        # 2. Checkout with 100% free upgrade voucher
        create_voucher("FREE_PASS", "percent", 100.0)
        res2 = self.client.post("/api/billing/checkout", 
            json={"plan_type": "premium", "duration_days": 30, "voucher_code": "FREE_PASS"},
            headers=headers
        )
        self.assertEqual(res2.status_code, 200)
        data2 = res2.json()
        self.assertEqual(data2["snap_token"], "free-voucher-upgrade")
        self.assertIn("berhasil menggunakan diskon penuh", data2["message"])
        
        # Verify immediate settlement
        tx2 = get_transaction(data2["order_id"])
        self.assertEqual(tx2["amount"], 0.0)
        self.assertEqual(tx2["status"], "settlement")
        
        # Verify user upgraded directly
        user_db = get_user_by_email("voucher_test@domain.com")
        sub = get_user_subscription(user_db["id"])
        self.assertEqual(sub["plan_type"], "premium")
        self.assertEqual(sub["status"], "active")

if __name__ == "__main__":
    unittest.main()
