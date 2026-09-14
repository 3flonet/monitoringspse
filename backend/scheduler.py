import asyncio
import logging
from datetime import datetime
from backend.database import get_db_connection
from backend.crawl_coordinator import run_crawl

logger = logging.getLogger("scheduler")

async def run_daily_scraping():
    """Select unique active alerts by instansi + keyword and crawl them sequentially."""
    from backend.database import set_setting
    from datetime import timedelta
    import json
    
    logger.info("Daily Auto-Scraper job started")
    start_time = datetime.now()
    set_setting("scheduler_state", "RUNNING")
    set_setting("scheduler_last_run_at", start_time.isoformat())
    set_setting("scheduler_next_run_at", (start_time + timedelta(days=1)).isoformat())
    
    total_tenders_saved = 0
    total_alerts_triggered = 0
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Select alerts from active subscribers only
        cursor.execute("""
            SELECT DISTINCT a.keyword, a.instansi
            FROM alerts a
            JOIN users u ON a.user_id = u.id
            LEFT JOIN subscriptions s ON u.id = s.user_id
            WHERE s.status = 'active'
        """)
        active_alerts = cursor.fetchall()
        conn.close()
        
        if not active_alerts:
            logger.info("No active alerts found. Skipping scheduler crawl.")
            set_setting("scheduler_state", "IDLE")
            summary = {
                "status": "success",
                "message": "No active alerts found",
                "duration_seconds": round((datetime.now() - start_time).total_seconds(), 2),
                "tenders_saved": 0,
                "alerts_triggered": 0
            }
            set_setting("scheduler_last_run_summary", json.dumps(summary))
            return
            
        logger.info(f"Daily scheduler: Found {len(active_alerts)} unique alert combinations to crawl.")
        
        for idx, alert in enumerate(active_alerts, 1):
            raw_kw = alert["keyword"].strip()
            sub_keywords = [k.strip() for k in raw_kw.split(",") if k.strip()]
            if not sub_keywords:
                sub_keywords = [raw_kw]

            instansi = alert["instansi"].strip()
            
            if instansi == "all":
                from backend.database import get_setting
                lpse_str = get_setting("lpse_instances", "[]")
                try:
                    targets = [l["slug"] for l in json.loads(lpse_str)]
                except Exception:
                    targets = ["nasional"]
                if not targets:
                    targets = ["nasional"]
            else:
                targets = [instansi]
                
            for sub_kw in sub_keywords:
                for target_instansi in targets:
                    logger.info(f"[{idx}/{len(active_alerts)}] Daily auto-crawling for '{target_instansi}' with query '{sub_kw}'")
                    try:
                        # Crawl 10 items for the daily scheduler
                        res = run_crawl(tipe="tender", category=target_instansi, tahun=datetime.now().year, length=10, search=sub_kw)
                        if isinstance(res, dict):
                            total_tenders_saved += res.get("tenders_saved", 0)
                            total_alerts_triggered += res.get("alerts_triggered", 0)
                        logger.info(f"Finished auto-crawling '{target_instansi}' for '{sub_kw}': {res}")
                    except Exception as ex:
                        logger.error(f"Error crawling in daily scheduler for '{target_instansi}' with query '{sub_kw}': {ex}")
                        with open("logs/crawl_errors.log", "a", encoding="utf-8") as f:
                            f.write(f"{datetime.now().isoformat()} - SCHEDULER ERROR ({target_instansi}/{sub_kw}): {ex}\n")
                        try:
                            from backend.database import save_crawl_log
                            from backend.whatsapp_notifier import send_admin_crawl_alert
                            save_crawl_log(instansi=target_instansi, tipe="tender", status="error", records_count=0, error_message=str(ex))
                            send_admin_crawl_alert(target_instansi, str(ex))
                        except Exception:
                            pass

                        
        summary = {
            "status": "success",
            "message": f"Crawled {len(active_alerts)} alert targets successfully" if len(active_alerts) > 0 else "No active alerts found",
            "duration_seconds": round((datetime.now() - start_time).total_seconds(), 2),
            "tenders_saved": total_tenders_saved,
            "alerts_triggered": total_alerts_triggered
        }
        set_setting("scheduler_last_run_summary", json.dumps(summary))
        set_setting("scheduler_state", "IDLE")

        # Write log entry to log file so tail log is updated
        log_dir = Path("logs")
        log_dir.mkdir(parents=True, exist_ok=True)
        with open(log_dir / "crawl_errors.log", "a", encoding="utf-8") as f:
            f.write(f"{datetime.now().strftime('%Y-%m-%d %H:%M:%S')} - SCHEDULER INFO: {summary['message']} (Duration: {summary['duration_seconds']}s, Saved: {total_tenders_saved}, Alerts: {total_alerts_triggered})\n")
    except Exception as e:
        logger.error(f"Scheduler job failed: {e}")
        set_setting("scheduler_state", "ERROR")
        summary = {
            "status": "error",
            "message": str(e),
            "duration_seconds": round((datetime.now() - start_time).total_seconds(), 2)
        }
        set_setting("scheduler_last_run_summary", json.dumps(summary))
        
        log_dir = Path("logs")
        log_dir.mkdir(parents=True, exist_ok=True)
        with open(log_dir / "crawl_errors.log", "a", encoding="utf-8") as f:
            f.write(f"{datetime.now().strftime('%Y-%m-%d %H:%M:%S')} - SCHEDULER ERROR: {e}\n")

async def sync_bookmarked_tenders():
    """Sync stage and details for all bookmarked tenders from SPSE portal."""
    logger.info("Automatic bookmarked tenders sync started")
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get all distinct bookmarked tenders with their metadata from tenders table
        cursor.execute("""
            SELECT DISTINCT t.nomor_pengadaan, t.kategori, t.tipe, t.tahun
            FROM bookmarks b
            JOIN tenders t ON b.nomor_pengadaan = t.nomor_pengadaan
        """)
        bookmarks = [dict(row) for row in cursor.fetchall()]
        conn.close()
        
        if not bookmarks:
            logger.info("No bookmarks found to sync.")
            return
            
        logger.info(f"Bookmarked sync: Found {len(bookmarks)} tenders to update.")
        
        for idx, bm in enumerate(bookmarks, 1):
            nomor = bm["nomor_pengadaan"]
            kategori = bm["kategori"]
            tipe = bm["tipe"]
            tahun = bm["tahun"]
            
            logger.info(f"[{idx}/{len(bookmarks)}] Syncing bookmark: {nomor} (kategori: {kategori}, tipe: {tipe}, tahun: {tahun})")
            try:
                # Run crawl with search query set to the exact nomor_pengadaan to refresh its data
                res = run_crawl(tipe=tipe, category=kategori, tahun=tahun, start=0, length=1, search=nomor)
                logger.info(f"Finished sync for bookmark '{nomor}': {res.get('status')}")
                # Add a small delay between requests to be polite to the SPSE servers
                await asyncio.sleep(2)
            except Exception as ex:
                logger.error(f"Error syncing bookmark '{nomor}': {ex}")
                
    except Exception as e:
        logger.error(f"Bookmarked tenders sync failed: {e}")

async def start_scheduler_loop():
    """Daily scheduler loop that runs once every 24 hours."""
    logger.info("Auto-Scraper Scheduler loop starting in background. Interval: 24 hours.")
    # Run once at startup after a short delay (10 seconds) to not block initial server loading
    await asyncio.sleep(10)
    while True:
        try:
            await run_daily_scraping()
        except Exception as e:
            logger.error(f"Error in daily scraping task: {e}")
            
        try:
            await sync_bookmarked_tenders()
        except Exception as e:
            logger.error(f"Error in bookmarked tenders sync task: {e}")
            
        # Sleep for 24 hours (86400 seconds)
        await asyncio.sleep(86400)

if __name__ == "__main__":
    import sys
    from pathlib import Path
    
    # Adjust path to import backend correctly
    sys.path.append(str(Path(__file__).parent.parent))
    
    logging.basicConfig(level=logging.INFO, format='[%(levelname)s] %(message)s')
    
    logger.info("=== Memulai Scheduler Harian SPSE ===")
    asyncio.run(run_daily_scraping())
    asyncio.run(sync_bookmarked_tenders())
    logger.info("=== Scheduler Harian SPSE Selesai ===")
