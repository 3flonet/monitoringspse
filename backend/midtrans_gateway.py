import requests
import base64
import logging
from backend.database import get_setting

logger = logging.getLogger("midtrans")

def _get_midtrans_config():
    """Load Midtrans configuration from system settings."""
    server_key = get_setting("midtrans_server_key", "")
    client_key = get_setting("midtrans_client_key", "")
    is_production_str = get_setting("midtrans_is_production", "false")
    is_production = is_production_str.lower() == "true"
    
    return {
        "server_key": server_key,
        "client_key": client_key,
        "is_production": is_production,
        "api_url": "https://app.midtrans.com/snap/v1/transactions" if is_production else "https://app.sandbox.midtrans.com/snap/v1/transactions"
    }

def check_midtrans_status(server_key: str = None, client_key: str = None, is_production: bool = None) -> dict:
    """
    Check real-time connection status to Midtrans Payment Gateway API.
    Verifies Server Key and Client Key against Midtrans API.
    """
    config = _get_midtrans_config()
    s_key = server_key if (server_key is not None and server_key.strip()) else config["server_key"]
    c_key = client_key if (client_key is not None and client_key.strip()) else config["client_key"]
    is_prod = is_production if is_production is not None else config["is_production"]

    if not s_key:
        return {
            "status": "unconfigured",
            "connected": False,
            "message": "Server Key Midtrans belum diisi (Aplikasi menggunakan Mode Simulasi Pembayaran Lokal).",
            "environment": "Production" if is_prod else "Sandbox",
            "server_key": None,
            "client_key": c_key
        }

    env_name = "Production" if is_prod else "Sandbox"
    domain = "https://api.midtrans.com" if is_prod else "https://api.sandbox.midtrans.com"

    auth_str = f"{s_key}:"
    auth_encoded = base64.b64encode(auth_str.encode('utf-8')).decode('utf-8')
    headers = {
        "Accept": "application/json",
        "Authorization": f"Basic {auth_encoded}"
    }

    try:
        # Dummy order status request to test Basic Auth credential validity
        dummy_url = f"{domain}/v2/MIDTRANS-PING-TEST/status"
        response = requests.get(dummy_url, headers=headers, timeout=10)
        
        if response.status_code == 401:
            return {
                "status": "error",
                "connected": False,
                "message": f"Server Key Midtrans ({env_name}) Ditolak (401 Unauthorized). Periksa Server Key Anda.",
                "environment": env_name
            }
        elif response.status_code in [404, 200, 400]:
            return {
                "status": "connected",
                "connected": True,
                "message": f"Koneksi Aktif ke Midtrans Gateway ({env_name})",
                "environment": env_name,
                "server_key": s_key[:6] + "..." if len(s_key) > 6 else s_key,
                "client_key": c_key
            }
        else:
            return {
                "status": "error",
                "connected": False,
                "message": f"Respon HTTP {response.status_code} dari Midtrans ({env_name})",
                "environment": env_name
            }
    except Exception as e:
        return {
            "status": "error",
            "connected": False,
            "message": f"Gagal terhubung ke Midtrans ({env_name}): {str(e)}",
            "environment": env_name
        }

def create_snap_transaction(order_id: str, amount: float, email: str, phone: str = None) -> dict:
    """
    Initiate a Snap payment transaction with Midtrans.
    Returns:
        dict: {"success": bool, "token": str, "redirect_url": str, "message": str}
    """
    config = _get_midtrans_config()
    server_key = config["server_key"]
    
    # Fallback to Mock simulation if no server key is configured
    if not server_key:
        logger.info(f"Midtrans server key not configured. Generating mock token for order {order_id}.")
        return {
            "success": True,
            "token": f"mock-snap-token-{order_id}",
            "redirect_url": f"https://payment-simulation.tenderid.com/pay/{order_id}",
            "message": "Mode Simulasi (Kredensial Midtrans kosong)"
        }
        
    # Prepare basic auth header
    auth_str = f"{server_key}:"
    auth_encoded = base64.b64encode(auth_str.encode('utf-8')).decode('utf-8')
    
    headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": f"Basic {auth_encoded}"
    }
    
    payload = {
        "transaction_details": {
            "order_id": order_id,
            "gross_amount": int(amount)
        },
        "customer_details": {
            "first_name": "User",
            "email": email,
        }
    }
    
    if phone:
        payload["customer_details"]["phone"] = phone
        
    try:
        response = requests.post(config["api_url"], json=payload, headers=headers, timeout=15)
        res_json = response.json()
        
        if response.status_code == 201:
            return {
                "success": True,
                "token": res_json.get("token"),
                "redirect_url": res_json.get("redirect_url"),
                "message": "Token Snap berhasil dibuat."
            }
        else:
            error_msg = res_json.get("error_messages", ["Gagal membuat transaksi"])[0]
            logger.error(f"Midtrans API error: {error_msg} (status: {response.status_code})")
            return {
                "success": False,
                "token": None,
                "redirect_url": None,
                "message": f"Midtrans API Error: {error_msg}"
            }
    except Exception as e:
        logger.error(f"Failed to connect to Midtrans API: {e}")
        return {
            "success": False,
            "token": None,
            "redirect_url": None,
            "message": f"Koneksi ke Midtrans gagal: {str(e)}"
        }

def check_transaction_status(order_id: str) -> dict:
    """
    Check transaction status from Midtrans API.
    Returns:
        dict: {"success": bool, "status": str, "status_code": str, "message": str}
    """
    config = _get_midtrans_config()
    server_key = config["server_key"]
    
    # Fallback to Mock simulation if no server key is configured
    if not server_key:
        logger.info(f"Midtrans server key not configured. Generating mock response for order {order_id}.")
        return {
            "success": True,
            "status": "settlement",
            "status_code": "200",
            "message": "Mock verification: Success"
        }
        
    auth_str = f"{server_key}:"
    auth_encoded = base64.b64encode(auth_str.encode('utf-8')).decode('utf-8')
    
    headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": f"Basic {auth_encoded}"
    }
    
    # API endpoints differ slightly for Core API status queries
    domain = "https://api.midtrans.com" if config["is_production"] else "https://api.sandbox.midtrans.com"
    url = f"{domain}/v2/{order_id}/status"
    
    try:
        response = requests.get(url, headers=headers, timeout=15)
        res_json = response.json()
        
        status_code = res_json.get("status_code")
        transaction_status = res_json.get("transaction_status")
        
        return {
            "success": response.status_code == 200 or status_code == "200",
            "status": transaction_status.lower() if transaction_status else None,
            "status_code": status_code,
            "message": res_json.get("status_message", "")
        }
    except Exception as e:
        logger.error(f"Failed to check Midtrans status for order {order_id}: {e}")
        return {
            "success": False,
            "status": None,
            "status_code": "500",
            "message": f"Koneksi ke Midtrans gagal: {str(e)}"
        }
