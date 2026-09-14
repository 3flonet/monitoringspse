import sys
import unittest
from pathlib import Path
from datetime import datetime

# Add backend to sys.path
sys.path.append(str(Path(__file__).parent.parent))

from backend.database import (
    init_db, create_user, get_user_by_email, get_db_connection, set_setting,
    create_article, get_article_by_slug, get_all_articles, update_article, delete_article
)
from fastapi.testclient import TestClient
from backend.main import app

class TestArticleIntegration(unittest.TestCase):
    
    @classmethod
    def setUpClass(cls):
        init_db()
        cls.client = TestClient(app)
        
    def setUp(self):
        # Clean up database tables for articles and test users before each test
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM articles")
        cursor.execute("DELETE FROM users WHERE email LIKE '%test%'")
        conn.commit()
        conn.close()

    def test_article_database_helpers(self):
        # 1. Test create article
        article_id = create_article(
            title="Cara Kerja Scraper di {lpse_name}",
            slug="cara-kerja-scraper",
            content="Artikel ini memaparkan cara kerja scraper di {lpse_name}.",
            meta_title="Cara Kerja Scraper {lpse_name}",
            meta_description="Deskripsi lengkap cara kerja pemantau tender.",
            meta_keywords="scraper, tender, {lpse_name}",
            is_pinned=1,
            is_published=1,
            image_url="/static/uploads/image.jpg",
            youtube_embed="https://youtube.com/embed/xyz"
        )
        self.assertIsNotNone(article_id)
        
        # 2. Test get article by slug
        a = get_article_by_slug("cara-kerja-scraper")
        self.assertIsNotNone(a)
        self.assertEqual(a["title"], "Cara Kerja Scraper di {lpse_name}")
        self.assertEqual(a["is_pinned"], 1)
        self.assertEqual(a["image_url"], "/static/uploads/image.jpg")
        
        # 3. Test get all articles
        create_article(
            title="Artikel Kedua",
            slug="artikel-kedua",
            content="Isi artikel kedua",
            is_pinned=0,
            is_published=1
        )
        all_a = get_all_articles()
        self.assertEqual(len(all_a), 2)
        # Pinned should be first
        self.assertEqual(all_a[0]["slug"], "cara-kerja-scraper")
        
        # 4. Test update article
        update_article(
            article_id=article_id,
            title="Cara Kerja Scraper Baru di {lpse_name}",
            slug="cara-kerja-scraper",
            content="Konten diubah.",
            is_pinned=0,
            is_published=0
        )
        a_updated = get_article_by_slug("cara-kerja-scraper")
        self.assertEqual(a_updated["title"], "Cara Kerja Scraper Baru di {lpse_name}")
        self.assertEqual(a_updated["is_pinned"], 0)
        self.assertEqual(a_updated["is_published"], 0)
        
        # 5. Test delete article
        delete_article(article_id)
        a_del = get_article_by_slug("cara-kerja-scraper")
        self.assertIsNone(a_del)

    def test_article_api_endpoints(self):
        # Register and login admin user
        self.client.post("/api/auth/register", json={
            "email": "admin_test@domain.com",
            "password": "adminpassword",
            "whatsapp": "08123456789"
        })
        # Set role as admin directly in database
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("UPDATE users SET role='admin' WHERE email='admin_test@domain.com'")
        conn.commit()
        conn.close()
        
        login_res = self.client.post("/api/auth/login", json={
            "email": "admin_test@domain.com",
            "password": "adminpassword"
        })
        token = login_res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # Create article via admin API
        res = self.client.post("/api/admin/articles", json={
            "title": "Judul Penting {lpse_name}",
            "slug": "judul-penting",
            "content": "Ini konten penting.",
            "meta_title": "Meta Penting",
            "meta_description": "Deskripsi penting.",
            "is_pinned": 1,
            "is_published": 1
        }, headers=headers)
        self.assertEqual(res.status_code, 200)
        
        # Get via public API
        res_public = self.client.get("/api/public/articles")
        self.assertEqual(res_public.status_code, 200)
        self.assertEqual(len(res_public.json()), 1)
        self.assertEqual(res_public.json()[0]["slug"], "judul-penting")
        
        # Get detail via public API
        res_detail = self.client.get("/api/public/articles/judul-penting")
        self.assertEqual(res_detail.status_code, 200)
        self.assertEqual(res_detail.json()["title"], "Judul Penting {lpse_name}")

if __name__ == "__main__":
    unittest.main()