import time
import sys
import logging
from pathlib import Path
from datetime import datetime

# Adjust path to import the local `spse` package
sys.path.append(str(Path(__file__).parent.parent))

from spse.cookie_manager import SPSECookieManager
from spse.json_getter import SPSEJsonGetter
from spse.detail_getter import SPSEDetailGetter
from spse.config import DEFAULT_CATEGORY

from backend.database import save_tender, save_tender_detail, get_db_connection, save_tender_participants, save_tender_winner, save_competitor_evaluations, save_crawl_log
from backend.email_notifier import send_email_alert
from backend.whatsapp_notifier import send_admin_crawl_alert

logging.basicConfig(level=logging.INFO, format='[%(levelname)s] %(message)s')

def run_crawl(tipe="tender", category=None, tahun=None, start=0, length=25, search=""):
    """
    Main function to run the crawl and save to database.
    
    Args:
        tipe: "tender" or "nontender"
        category: slug of the LPSE agency (e.g. "nasional", "padang")
        tahun: year to crawl (default: current year)
        start: offset
        length: row count limit
        search: server-side search query
    
    Returns:
        dict: Summary of crawl results
    """
    category_slug = category or DEFAULT_CATEGORY
    tahun = tahun or datetime.now().year
    
    logging.info(f"Starting crawl for {tipe} ({category_slug}) - Year: {tahun}, Limit: {length}, Query: '{search}'")
    
    cookie_manager = SPSECookieManager()
    success = cookie_manager.get_spse_session_cookie(tipe, category=category_slug)
    
    if not success or not cookie_manager.is_spse_session_set():
        err_msg = f"Gagal mendapatkan SPSE Session Cookie (Dugaan IP VPS terblokir atau server LPSE '{category_slug}' offline)."
        logging.error(err_msg)
        save_crawl_log(instansi=category_slug, tipe=tipe, status="blocked", records_count=0, error_message=err_msg)
        send_admin_crawl_alert(category_slug, err_msg)
        return {"status": "error", "message": err_msg}
        
    json_getter = SPSEJsonGetter(cookie_manager, category=category_slug)
    data = json_getter.get_data(
        endpoint_type=tipe,
        tahun=tahun,
        start=start,
        length=length,
        search=search
    )
    
    if not data or 'data' not in data:
        err_msg = f"Respon kosong / HTML dari API LPSE '{category_slug}' (Situs LPSE down / rate-limit / terblokir)."
        logging.error(err_msg)
        save_crawl_log(instansi=category_slug, tipe=tipe, status="failed", records_count=0, error_message=err_msg)
        send_admin_crawl_alert(category_slug, err_msg)
        return {"status": "error", "message": err_msg}

        
    records = data.get('data', [])
    total_found = len(records)
    logging.info(f"Retrieved {total_found} raw records from API. Fetching details and saving to database...")
    
    detail_getter = SPSEDetailGetter(cookie_manager, category=category_slug)
    
    saved_tenders = []
    saved_details_count = 0
    
    for idx, record in enumerate(records, 1):
        if not record or len(record) < 2:
            continue
            
        nomor_pengadaan = record[0]
        nama_tender = record[1]
        
        logging.info(f"[{idx}/{total_found}] Processing: {nomor_pengadaan} - {nama_tender[:40]}...")
        
        # Parse basic record fields
        tender_data = {
            "nomor_pengadaan": nomor_pengadaan,
            "nama_tender": nama_tender,
            "instansi": record[2] if len(record) > 2 else "",
            "tahap": record[3] if len(record) > 3 else "",
            "pagu": record[4] if len(record) > 4 else "",
            "metode": record[6] if len(record) > 6 else "",
            "jenis_pengadaan": record[8] if len(record) > 8 else "",
            "kategori": category_slug,
            "tipe": tipe,
            "tahun": tahun
        }
        
        try:
            # Save basic tender list details
            save_tender(tender_data)
            saved_tenders.append(tender_data)
            
            # Fetch detailed requirements from detail page
            detail_data = detail_getter.get_detail_data(nomor_pengadaan, tipe)
            
            # Fetch schedule data
            schedule_data = None
            try:
                schedule_data = detail_getter.get_schedule_data(nomor_pengadaan, tipe)
            except Exception as se:
                logging.warning(f"Error fetching schedule for tender {nomor_pengadaan}: {se}")
                
            # Fetch participants data
            participants_data = None
            try:
                participants_data = detail_getter.get_participants_data(nomor_pengadaan, tipe)
            except Exception as pe:
                logging.warning(f"Error fetching participants for tender {nomor_pengadaan}: {pe}")

            # Fetch contract winner data
            winner_data = None
            try:
                winner_data = detail_getter.get_contract_winner_data(nomor_pengadaan, category_slug)
            except Exception as we:
                logging.warning(f"Error fetching contract winner for tender {nomor_pengadaan}: {we}")
                
            # Fetch competitor evaluations data
            evaluations_data = None
            try:
                evaluations_data = detail_getter.get_evaluation_data(nomor_pengadaan, category_slug)
            except Exception as ee:
                logging.warning(f"Error fetching evaluations for tender {nomor_pengadaan}: {ee}")
                
            if detail_data:
                if schedule_data:
                    import json
                    detail_data['jadwal'] = json.dumps(schedule_data, ensure_ascii=False)
                    
                    # Parse tanggal_mulai_tender (Mulai column of the first row)
                    if len(schedule_data) > 0:
                        detail_data['tanggal_mulai_tender'] = schedule_data[0].get('mulai')
                        
                    # Parse akhir_penawaran
                    akhir_penawaran_found = False
                    for step in schedule_data:
                        tahap_lower = step.get('tahap', '').lower()
                        if any(kw in tahap_lower for kw in ['upload', 'kirim', 'penyampaian']) and 'penawaran' in tahap_lower:
                            detail_data['akhir_penawaran'] = step.get('sampai')
                            akhir_penawaran_found = True
                            break
                    if not akhir_penawaran_found:
                        for step in schedule_data:
                            tahap_lower = step.get('tahap', '').lower()
                            if any(kw in tahap_lower for kw in ['upload', 'kirim', 'penyampaian']) and 'kualifikasi' in tahap_lower:
                                detail_data['akhir_penawaran'] = step.get('sampai')
                                break
                                
                save_tender_detail(detail_data)
                
                # Save participants list and winner details to dedicated tables
                if participants_data:
                    save_tender_participants(nomor_pengadaan, participants_data)
                if winner_data:
                    save_tender_winner(nomor_pengadaan, winner_data)
                if evaluations_data:
                    w_name = winner_data.get('nama_pemenang') if winner_data else None
                    save_competitor_evaluations(nomor_pengadaan, evaluations_data, w_name)
                    
                saved_details_count += 1
            else:
                logging.warning(f"Could not retrieve details for tender {nomor_pengadaan}")
        except Exception as e:
            logging.error(f"Error saving tender {nomor_pengadaan} to database: {e}")
            
        # Add a polite delay of 1.5s between detail crawl requests
        time.sleep(1.5)
            
    logging.info(f"Crawl completed. Saved {len(saved_tenders)} tenders, {saved_details_count} details.")
    save_crawl_log(instansi=category_slug, tipe=tipe, status="success", records_count=len(saved_tenders))
    
    # Run email notification alerts
    alerts_triggered = check_alerts_and_notify(saved_tenders)

    
    return {
        "status": "success",
        "tenders_found": total_found,
        "tenders_saved": len(saved_tenders),
        "details_saved": saved_details_count,
        "alerts_triggered": alerts_triggered
    }

def is_tender_active(tahap_str: str) -> bool:
    """
    Determines if a tender is active (before 'Tender Sudah Selesai' stage).
    Excludes tenders whose stage contains 'Selesai', 'Batal', or 'Gagal'.
    """
    if not tahap_str:
        return True
    t_lower = str(tahap_str).strip().lower()
    if "selesai" in t_lower or "batal" in t_lower or "gagal" in t_lower:
        return False
    return True

def check_alerts_and_notify(new_tenders):
    """
    Check if any newly scraped active tenders match user keyword alerts, and send emails/WhatsApp messages with a 5s throttle delay.
    """
    if not new_tenders:
        return 0
        
    import time
    from backend.whatsapp_notifier import send_whatsapp_alert
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Get all alerts, joining users and subscriptions to check status and active dates
    cursor.execute("""
        SELECT a.id, a.keyword, a.email, a.whatsapp as alert_whatsapp, a.instansi, u.whatsapp as user_whatsapp, u.id as user_id, 
               s.status as sub_status, s.end_date as sub_end_date
        FROM alerts a
        JOIN users u ON a.user_id = u.id
        LEFT JOIN subscriptions s ON u.id = s.user_id
    """)
    alerts = cursor.fetchall()
    
    if not alerts:
        conn.close()
        return 0
        
    alerts_count = 0
    now_str = datetime.now().isoformat()
    
    for alert in alerts:
        alert_id = alert['id']
        raw_kw = alert['keyword'].strip().lower()
        keywords_list = [k.strip() for k in raw_kw.split(',') if k.strip()]
        if not keywords_list:
            keywords_list = [raw_kw]

        email = alert['email'].strip()
        instansi = alert['instansi'].strip().lower()
        
        # Resolve target WhatsApp number: specific alert whatsapp, falling back to registered user whatsapp profile
        alert_wa = alert['alert_whatsapp']
        user_wa = alert['user_whatsapp']
        whatsapp = alert_wa if alert_wa and alert_wa.strip() else user_wa
        
        # Check subscription validity
        sub_status = alert['sub_status'] or 'expired'
        sub_end_date_str = alert['sub_end_date']
        
        if sub_status != 'active':
            continue
            
        if sub_end_date_str:
            try:
                end_date = datetime.fromisoformat(sub_end_date_str)
                if datetime.now() > end_date:
                    continue
            except Exception:
                continue
        
        for tender in new_tenders:
            nomor_pengadaan = tender['nomor_pengadaan']
            tender_kategori = tender.get('kategori', '').strip().lower()
            tahap = tender.get('tahap', '')
            
            # Active tender project criteria (before 'Tender Sudah Selesai')
            if not is_tender_active(tahap):
                continue

            # Match instansi (must match the alert's target instansi/LPSE category)
            if instansi != "all" and tender_kategori != instansi:
                continue
                
            # Verify if this alert was already sent for this tender
            cursor.execute(
                "SELECT id FROM sent_alerts WHERE alert_id = ? AND nomor_pengadaan = ?",
                (alert_id, nomor_pengadaan)
            )
            already_sent = cursor.fetchone()
            if already_sent:
                continue
                
            # Check for keyword match in title, detail requirements, or short description
            cursor.execute(
                "SELECT syarat_kualifikasi, uraian_singkat_pekerjaan FROM tender_details WHERE nomor_pengadaan = ?",
                (nomor_pengadaan,)
            )
            detail = cursor.fetchone()
            
            title = tender['nama_tender'].lower()
            syarat = detail['syarat_kualifikasi'].lower() if detail and detail['syarat_kualifikasi'] else ""
            uraian = detail['uraian_singkat_pekerjaan'].lower() if detail and detail['uraian_singkat_pekerjaan'] else ""
            
            # Match any sub-keyword in comma-separated list
            matched_kw = next((kw for kw in keywords_list if kw in title or kw in syarat or kw in uraian), None)
            
            if matched_kw:
                logging.info(f"Match found! Alert sub-keyword '{matched_kw}' (from '{raw_kw}') on '{tender_kategori}' triggered by tender {nomor_pengadaan}")
                
                # Send email
                email_sent = send_email_alert(email, matched_kw, tender)
                
                # Send WhatsApp if user phone number is registered
                wa_sent = False
                if whatsapp and whatsapp.strip():
                    wa_sent = send_whatsapp_alert(whatsapp.strip(), matched_kw, tender)
                
                # Record as sent if either email or WA succeeded (or mock fallback completed)
                if email_sent or wa_sent:
                    try:
                        cursor.execute(
                            "INSERT OR IGNORE INTO sent_alerts (alert_id, nomor_pengadaan, sent_at) VALUES (?, ?, ?)",
                            (alert_id, nomor_pengadaan, now_str)
                        )
                        conn.commit()
                        alerts_count += 1
                    except Exception as e:
                        logging.error(f"Error logging sent alert: {e}")
                
                # 5-second notification delay throttle to prevent spam detection
                time.sleep(5)
                        
    conn.close()
    return alerts_count

if __name__ == "__main__":
    # Quick CLI test
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--type", default="tender")
    parser.add_argument("--category", default="nasional")
    parser.add_argument("--tahun", type=int, default=2026)
    parser.add_argument("--limit", type=int, default=5)
    parser.add_argument("--query", default="")
    args = parser.parse_args()
    
    run_crawl(tipe=args.type, category=args.category, tahun=args.tahun, length=args.limit, search=args.query)
