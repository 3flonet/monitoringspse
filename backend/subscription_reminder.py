import logging
from datetime import datetime, timedelta
from typing import Optional, Dict, Any

from backend.database import get_db_connection
from backend.whatsapp_notifier import send_subscription_expiry_whatsapp
from backend.email_notifier import send_subscription_expiry_email

logger = logging.getLogger(__name__)

def parse_iso_datetime(dt_str: Optional[str]) -> Optional[datetime]:
    if not dt_str:
        return None
    try:
        # Handles formats like 2026-10-27T15:30:00, with or without microseconds or Z
        clean_str = dt_str.replace("Z", "").split(".")[0]
        if "T" in clean_str:
            return datetime.strptime(clean_str, "%Y-%m-%dT%H:%M:%S")
        else:
            return datetime.strptime(clean_str, "%Y-%m-%d")
    except Exception as e:
        logger.warning(f"Error parsing datetime string '{dt_str}': {e}")
        return None

def check_and_send_subscription_reminders(force: bool = False) -> Dict[str, Any]:
    """
    Checks active subscriptions and sends WhatsApp & Email reminders at H-3 and H-1,
    and marks expired subscriptions when end_date <= now.
    
    Rule: Never use the word 'radar'.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Query all subscriptions with their user details
    cursor.execute("""
        SELECT 
            s.id as sub_id,
            s.user_id,
            s.plan_type,
            s.start_date,
            s.end_date,
            s.status,
            s.reminder_h3_sent_at,
            s.reminder_h1_sent_at,
            s.reminder_expired_sent_at,
            u.email,
            u.whatsapp,
            u.role
        FROM subscriptions s
        JOIN users u ON s.user_id = u.id
        WHERE u.role != 'admin'
    """)
    subs = [dict(r) for r in cursor.fetchall()]
    
    now = datetime.now()
    today = now.date()
    
    stats = {
        "total_checked": len(subs),
        "h3_sent": 0,
        "h1_sent": 0,
        "expired_marked": 0,
        "errors": []
    }
    
    for sub in subs:
        end_date_str = sub.get("end_date")
        if not end_date_str:
            continue
            
        end_dt = parse_iso_datetime(end_date_str)
        if not end_dt:
            continue
            
        # Calendar days difference
        days_left = (end_dt.date() - today).days
        user_email = sub.get("email")
        user_wa = sub.get("whatsapp")
        plan_type = sub.get("plan_type", "trial")
        sub_id = sub["sub_id"]
        
        # 1. Check for H-3 reminder (3 calendar days left)
        if days_left == 3:
            if not sub.get("reminder_h3_sent_at") or force:
                logger.info(f"Sending H-3 expiry reminder to User #{sub['user_id']} ({user_email})")
                wa_ok = False
                email_ok = False
                
                if user_wa:
                    res_wa = send_subscription_expiry_whatsapp(
                        to_number=user_wa,
                        email=user_email,
                        plan_type=plan_type,
                        days_left=3,
                        end_date_str=end_date_str
                    )
                    wa_ok = res_wa.get("success", False)
                    
                if user_email:
                    res_em = send_subscription_expiry_email(
                        to_email=user_email,
                        plan_type=plan_type,
                        days_left=3,
                        end_date_str=end_date_str
                    )
                    email_ok = res_em.get("success", False)
                    
                # Mark as sent
                cursor.execute("""
                    UPDATE subscriptions
                    SET reminder_h3_sent_at = ?
                    WHERE id = ?
                """, (now.isoformat(), sub_id))
                conn.commit()
                stats["h3_sent"] += 1
                
        # 2. Check for H-1 reminder (1 calendar day left)
        elif days_left == 1:
            if not sub.get("reminder_h1_sent_at") or force:
                logger.info(f"Sending H-1 expiry reminder to User #{sub['user_id']} ({user_email})")
                wa_ok = False
                email_ok = False
                
                if user_wa:
                    res_wa = send_subscription_expiry_whatsapp(
                        to_number=user_wa,
                        email=user_email,
                        plan_type=plan_type,
                        days_left=1,
                        end_date_str=end_date_str
                    )
                    wa_ok = res_wa.get("success", False)
                    
                if user_email:
                    res_em = send_subscription_expiry_email(
                        to_email=user_email,
                        plan_type=plan_type,
                        days_left=1,
                        end_date_str=end_date_str
                    )
                    email_ok = res_em.get("success", False)
                    
                # Mark as sent
                cursor.execute("""
                    UPDATE subscriptions
                    SET reminder_h1_sent_at = ?
                    WHERE id = ?
                """, (now.isoformat(), sub_id))
                conn.commit()
                stats["h1_sent"] += 1
                
        # 3. Check for expired accounts (end_date <= now)
        elif days_left <= 0:
            if sub.get("status") == "active":
                logger.info(f"Marking subscription for User #{sub['user_id']} ({user_email}) as expired.")
                cursor.execute("""
                    UPDATE subscriptions
                    SET status = 'expired'
                    WHERE id = ?
                """, (sub_id,))
                conn.commit()
                stats["expired_marked"] += 1
                
            # Optionally send 1x expiration notice
            if not sub.get("reminder_expired_sent_at") or force:
                if user_wa:
                    send_subscription_expiry_whatsapp(
                        to_number=user_wa,
                        email=user_email,
                        plan_type=plan_type,
                        days_left=0,
                        end_date_str=end_date_str
                    )
                if user_email:
                    send_subscription_expiry_email(
                        to_email=user_email,
                        plan_type=plan_type,
                        days_left=0,
                        end_date_str=end_date_str
                    )
                cursor.execute("""
                    UPDATE subscriptions
                    SET reminder_expired_sent_at = ?
                    WHERE id = ?
                """, (now.isoformat(), sub_id))
                conn.commit()

    conn.close()
    logger.info(f"Subscription check completed: {stats}")
    return stats
