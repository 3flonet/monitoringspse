import asyncio
import logging
from datetime import datetime
from backend.database import get_db_connection
from backend.crawl_coordinator import run_crawl

logger = logging.getLogger("scheduler")

async def run_daily_scraping():
    """
    Automated background scraper:
    Iterates through all configured LPSE instances in the database without keyword filters,
    performs smart incremental scraping (new tenders + schedule updates + winner updates),
    and sends WhatsApp/Email alerts to matching active subscribers.
    """
    from backend.database import set_setting, get_setting, get_db_connection, save_crawl_log
    from backend.whatsapp_notifier import send_admin_crawl_alert
    from datetime import timedelta
    from pathlib import Path
    import json
    
    logger.info("Daily Auto-Scraper job started (All LPSEs, Decoupled Ingestion & Notification)")
    start_time = datetime.now()
    set_setting("scheduler_state", "RUNNING")
    set_setting("scheduler_last_run_at", start_time.isoformat())
    set_setting("scheduler_next_run_at", (start_time + timedelta(days=1)).isoformat())
    
    total_tenders_saved = 0
    total_tenders_updated = 0
    total_alerts_triggered = 0
    total_lpse_success = 0
    
    try:
        # 1. Collect all target LPSE instances configured in database
        lpse_str = get_setting("lpse_instances", "[]")
        target_instansi_list = []
        try:
            lpse_data = json.loads(lpse_str)
            for item in lpse_data:
                if isinstance(item, dict) and item.get("slug"):
                    s = item["slug"].strip().lower()
                    if s and s not in target_instansi_list:
                        target_instansi_list.append(s)
        except Exception as e:
            logger.warning(f"Error parsing lpse_instances setting: {e}")
            
        # 2. Also ensure any specific LPSE target requested by active subscriber alerts is included
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("""
                SELECT DISTINCT a.instansi
                FROM alerts a
                JOIN users u ON a.user_id = u.id
                LEFT JOIN subscriptions s ON u.id = s.user_id
                WHERE s.status = 'active' AND a.instansi != 'all'
            """)
            for r in cursor.fetchall():
                ins = r["instansi"].strip().lower()
                if ins and ins not in target_instansi_list:
                    target_instansi_list.append(ins)
            conn.close()
        except Exception as e:
            logger.warning(f"Error querying active subscriber alert instansi: {e}")
            
        # Fallback default if list is empty
        if not target_instansi_list:
            target_instansi_list = ["nasional", "padang", "jakarta", "lkpp"]
            
        logger.info(f"Daily scheduler: Scanning {len(target_instansi_list)} LPSE instances across Indonesia without keyword filter...")
        
        # 3. Sequentially crawl each LPSE instance (Smart Incremental Ingestion)
        for idx, target_instansi in enumerate(target_instansi_list, 1):
            logger.info(f"[{idx}/{len(target_instansi_list)}] Auto-scraping LPSE: '{target_instansi}' (Top 25 tenders, without keyword filter)...")
            try:
                # Crawl latest 25 items without keyword filter
                res = run_crawl(tipe="tender", category=target_instansi, tahun=datetime.now().year, length=25, search="")
                if isinstance(res, dict):
                    saved_new = res.get("tenders_saved", 0)
                    updated = res.get("tenders_updated", 0)
                    alerts = res.get("alerts_triggered", 0)
                    
                    total_tenders_saved += saved_new
                    total_tenders_updated += updated
                    total_alerts_triggered += alerts
                    total_lpse_success += 1
                    
                    logger.info(f"Finished auto-crawling '{target_instansi}': {saved_new} baru, {updated} update, {alerts} alert terkirim.")
            except Exception as ex:
                logger.error(f"Error crawling in daily scheduler for '{target_instansi}': {ex}")
                with open("logs/crawl_errors.log", "a", encoding="utf-8") as f:
                    f.write(f"{datetime.now().isoformat()} - SCHEDULER ERROR ({target_instansi}): {ex}\n")
                try:
                    save_crawl_log(instansi=target_instansi, tipe="tender", status="error", records_count=0, error_message=str(ex))
                    send_admin_crawl_alert(target_instansi, str(ex))
                except Exception:
                    pass
                    
            # Polite delay between LPSE instances to avoid aggressive rate-limiting
            await asyncio.sleep(2.5)
            
        summary = {
            "status": "success",
            "message": f"Berhasil memindai {total_lpse_success} LPSE ({total_tenders_saved} tender baru, {total_tenders_updated} diperbarui, {total_alerts_triggered} alert terkirim)",
            "duration_seconds": round((datetime.now() - start_time).total_seconds(), 2),
            "tenders_saved": total_tenders_saved,
            "tenders_updated": total_tenders_updated,
            "alerts_triggered": total_alerts_triggered,
            "lpse_scanned": total_lpse_success
        }
        set_setting("scheduler_last_run_summary", json.dumps(summary))
        set_setting("scheduler_state", "IDLE")

        # Write log entry to log file so tail log is updated
        log_dir = Path("logs")
        log_dir.mkdir(parents=True, exist_ok=True)
        with open(log_dir / "crawl_errors.log", "a", encoding="utf-8") as f:
            f.write(f"{datetime.now().strftime('%Y-%m-%d %H:%M:%S')} - SCHEDULER INFO: {summary['message']} (Duration: {summary['duration_seconds']}s)\n")
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
    while True:
        try:
            await run_daily_scraping()
        except Exception as e:
            logger.error(f"Error in daily scraping task: {e}")
            
        try:
            await sync_bookmarked_tenders()
        except Exception as e:
            logger.error(f"Error in bookmarked tenders sync task: {e}")
            
        logger.info("Scheduler completed cycle. Sleeping for 24 hours...")
        # Sleep for 24 hours (86400 seconds)
        await asyncio.sleep(86400)

if __name__ == "__main__":
    import sys
    from pathlib import Path
    
    # Adjust path to import backend correctly
    sys.path.append(str(Path(__file__).parent.parent))
    
    logging.basicConfig(level=logging.INFO, format='[%(levelname)s] %(message)s')
    
    logger.info("=== Memulai Background Scheduler SPSE ===")
    asyncio.run(start_scheduler_loop())
