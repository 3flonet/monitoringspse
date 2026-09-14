import sys
import unittest
from pathlib import Path

# Add backend to sys.path
sys.path.append(str(Path(__file__).parent.parent))

from backend.database import init_db, create_user, get_user_by_email, get_user_subscription, get_db_connection, set_setting, get_transaction
from backend.midtrans_gateway import create_snap_transaction
from fastapi.testclient import TestClient
from backend.main import app

class TestMidtransIntegration(unittest.TestCase):
    
    @classmethod
    def setUpClass(cls):
        init_db()
        cls.client = TestClient(app)

    def test_mock_snap_token_generation(self):
        # Empty server key to force mock mode
        set_setting("midtrans_server_key", "")
        
        res = create_snap_transaction("TEST-ORDER-123", 150000.0, "user@example.com")
        self.assertTrue(res["success"])
        self.assertEqual(res["token"], "mock-snap-token-TEST-ORDER-123")
        self.assertIn("simulation", res["redirect_url"])

    def test_payment_notification_webhook(self):
        # Create a dummy user
        email = "billing_test_user@domain.com"
        
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM users WHERE email = ?", (email,))
        conn.commit()
        conn.close()
        
        user_id = create_user(email, "hashedpassword", whatsapp="08123456789")
        self.assertIsNotNone(user_id)
        
        # Check starting subscription is trial
        sub = get_user_subscription(user_id)
        self.assertEqual(sub["plan_type"], "trial")
        
        # Login or get JWT token
        token_res = self.client.post("/api/auth/login", json={"email": email, "password": "hashedpassword"})
        # Since password hash in seeder is hashed, let's login by mocking auth headers
        
        # Test checkout endpoint to create a pending transaction in DB
        headers = {
            "Authorization": f"Bearer {token_res.json().get('access_token')}"
        }
        
        # We can also mock user login using test client
        # Let's register & login via API
        self.client.post("/api/auth/register", json={
            "email": "register_test@domain.com",
            "password": "mysecretpassword",
            "whatsapp": "08123456789"
        })
        login_res = self.client.post("/api/auth/login", json={
            "email": "register_test@domain.com",
            "password": "mysecretpassword"
        })
        token = login_res.json()["access_token"]
        
        # Trigger checkout
        checkout_res = self.client.post("/api/billing/checkout", 
            json={"plan_type": "premium", "duration_days": 30},
            headers={"Authorization": f"Bearer {token}"}
        )
        self.assertEqual(checkout_res.status_code, 200)
        order_id = checkout_res.json()["order_id"]
        
        # Verify transaction is recorded as pending in DB
        tx = get_transaction(order_id)
        self.assertIsNotNone(tx)
        self.assertEqual(tx["status"], "pending")
        
        # Trigger payment settlement notification (webhook simulation)
        payload = {
            "order_id": order_id,
            "transaction_status": "settlement",
            "status_code": "200"
        }
        webhook_res = self.client.post("/api/payment/notification", json=payload)
        self.assertEqual(webhook_res.status_code, 200)
        self.assertEqual(webhook_res.json()["status"], "success")
        
        # Verify transaction is updated to settlement
        tx_updated = get_transaction(order_id)
        self.assertEqual(tx_updated["status"], "settlement")
        
        # Verify user is upgraded to premium
        user_db = get_user_by_email("register_test@domain.com")
        sub_updated = get_user_subscription(user_db["id"])
        self.assertEqual(sub_updated["plan_type"], "premium")
        
        # Clean up
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM users WHERE email IN (?, ?)", (email, "register_test@domain.com"))
        conn.commit()
        conn.close()

if __name__ == "__main__":
    unittest.main()
