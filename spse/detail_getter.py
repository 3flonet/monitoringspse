"""
SPSE Detail Getter
Retrieves detailed information from SPSE tender announcement pages
"""

from bs4 import BeautifulSoup
from pathlib import Path
import logging
from .config import (
    SPSE_BASE_URL,
    REQUEST_TIMEOUT,
    SPSE_DETAIL_SUFFIX,
    build_paths,
    DEFAULT_CATEGORY
)
import re


class SPSEDetailGetter:
    """Handles detailed data retrieval from SPSE announcement pages"""
    
    def __init__(self, cookie_manager, output_base=None, category=None):
        """
        Initialize detail getter with cookie manager
        
        Args:
            cookie_manager: SPSECookieManager instance with valid session
        """
        self.base_url = SPSE_BASE_URL
        self.session = cookie_manager.get_session()
        self.output_base = Path(output_base) if output_base else Path('.')
        self.paths = build_paths(category or DEFAULT_CATEGORY)
    
    def _normalize_field_name(self, field_name):
        """
        Normalize field name to snake_case
        
        Args:
            field_name: Original field name from HTML
        
        Returns:
            str: Normalized field name in snake_case
        """
        # Remove special characters and extra spaces
        normalized = field_name.strip()
        
        # Replace common variations
        normalized = normalized.replace('/', '_')
        normalized = normalized.replace('-', ' ')
        normalized = normalized.replace('?', '')
        normalized = normalized.replace('(', '')
        normalized = normalized.replace(')', '')
        
        # Convert to lowercase and replace spaces with underscore
        normalized = re.sub(r'\s+', '_', normalized.lower())
        
        # Remove multiple underscores
        normalized = re.sub(r'_+', '_', normalized)
        
        # Remove leading/trailing underscores
        normalized = normalized.strip('_')
        
        return normalized
    
    def _clean_html_content(self, html_text):
        """
        Clean HTML content to plain text with newlines preserved
        
        Args:
            html_text: Text that may contain HTML tags
        
        Returns:
            str: Plain text with newlines for better readability
        """
        # Parse with BeautifulSoup
        soup = BeautifulSoup(html_text, 'html.parser')
        
        # Replace <br> tags with newline
        for br in soup.find_all('br'):
            br.replace_with('\n')
        
        # Replace block elements with newline
        for tag in soup.find_all(['p', 'div', 'li', 'tr']):
            tag.insert_after('\n')
        
        # Get text
        text = soup.get_text(separator=' ')
        
        # Clean up excessive whitespace but preserve newlines
        lines = text.split('\n')
        cleaned_lines = [re.sub(r'\s+', ' ', line.strip()) for line in lines]
        
        # Remove empty lines and join
        text = '\n'.join(line for line in cleaned_lines if line)
        
        return text
    
    def get_detail_data(self, nomor_pengadaan, endpoint_type='tender'):
        """
        Get detailed data from tender announcement page
        
        Args:
            nomor_pengadaan: Tender identification number
            endpoint_type: 'tender' or 'nontender'
        
        Returns:
            dict: Detailed information or None if failed
        """
        # Map endpoint type to URL path
        url_path_map = {
            'tender': self.paths["tender_path"],
            'nontender': self.paths["nontender_path"],
        }
        url_path = url_path_map.get(endpoint_type, self.paths["tender_path"])
        
        try:
            url = f"{self.base_url}{url_path}/{nomor_pengadaan}{SPSE_DETAIL_SUFFIX}"
            
            logging.debug(f"Fetching detail from: {url}")
            
            # Set referer header
            headers = {
                'Referer': f"{self.base_url}{url_path}"
            }
            
            # Make GET request
            response = self.session.get(url, headers=headers, timeout=REQUEST_TIMEOUT)
            
            # Check if request was successful
            response.raise_for_status()
            
            # Parse HTML
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Extract data from table
            detail_data = {
                'nomor_pengadaan': nomor_pengadaan,
                'url': url
            }
            
            # Find all table rows
            for tr in soup.find_all('tr'):
                th = tr.find('th', class_='bgwarning')
                td = tr.find('td')
                
                if th and td:
                    # Get field name
                    field_name = th.get_text(strip=True)
                    
                    # Normalize field name to snake_case
                    normalized_field_name = self._normalize_field_name(field_name)
                    
                    # Get field value - clean HTML if needed
                    if normalized_field_name in ['syarat_kualifikasi']:
                        field_value = self._clean_html_content(str(td))
                    else:
                        field_value = td.get_text(strip=True).replace('\xa0', ' ')
                    
                    # Store in dictionary
                    detail_data[normalized_field_name] = field_value
            
            logging.debug(f"Detail data extracted: {len(detail_data)} fields")
            
            return detail_data
            
        except Exception as e:
            logging.error(f"Error fetching detail: {str(e)}")
            return None

    def get_schedule_data(self, nomor_pengadaan, endpoint_type='tender'):
        """
        Get schedule table data from tender schedule page
        
        Args:
            nomor_pengadaan: Tender identification number
            endpoint_type: 'tender' or 'nontender'
        
        Returns:
            list: List of dicts representing rows of the schedule table, or None if failed
        """
        url_path_map = {
            'tender': self.paths["tender_path"],
            'nontender': self.paths["nontender_path"],
        }
        url_path = url_path_map.get(endpoint_type, self.paths["tender_path"])
        
        try:
            url = f"{self.base_url}{url_path}/{nomor_pengadaan}/jadwal"
            logging.debug(f"Fetching schedule from: {url}")
            
            headers = {
                'Referer': f"{self.base_url}{url_path}"
            }
            
            response = self.session.get(url, headers=headers, timeout=REQUEST_TIMEOUT)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            table = soup.find('table')
            if not table:
                logging.warning(f"No schedule table found for tender {nomor_pengadaan}")
                return None
                
            schedule_list = []
            rows = table.find_all('tr')
            for row in rows:
                cols = row.find_all('td')
                if not cols:
                    continue
                    
                if len(cols) >= 4:
                    no = cols[0].get_text(strip=True)
                    tahap = cols[1].get_text(strip=True).replace('\xa0', ' ')
                    mulai = cols[2].get_text(strip=True).replace('\xa0', ' ')
                    sampai = cols[3].get_text(strip=True).replace('\xa0', ' ')
                    perubahan = cols[4].get_text(strip=True).replace('\xa0', ' ') if len(cols) > 4 else ""
                    
                    schedule_list.append({
                        "no": no,
                        "tahap": tahap,
                        "mulai": mulai,
                        "sampai": sampai,
                        "perubahan": perubahan
                    })
            
            logging.debug(f"Schedule data extracted: {len(schedule_list)} steps")
            return schedule_list
            
        except Exception as e:
            logging.error(f"Error fetching schedule for tender {nomor_pengadaan}: {str(e)}")
            return None

    def get_participants_data(self, nomor_pengadaan, endpoint_type='tender'):
        """
        Get participants table from SPSE participants page
        """
        url_path_map = {
            'tender': self.paths["tender_path"],
            'nontender': self.paths["nontender_path"],
        }
        url_path = url_path_map.get(endpoint_type, self.paths["tender_path"])
        
        try:
            url = f"{self.base_url}{url_path}/{nomor_pengadaan}/peserta"
            logging.debug(f"Fetching participants from: {url}")
            
            headers = {
                'Referer': f"{self.base_url}{url_path}"
            }
            
            response = self.session.get(url, headers=headers, timeout=REQUEST_TIMEOUT)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            table = soup.find('table')
            if not table:
                logging.warning(f"No participants table found for tender {nomor_pengadaan}")
                return None
                
            from backend.database import parse_pagu_to_float
            
            participants = []
            rows = table.find_all('tr')
            for row in rows:
                cols = row.find_all('td')
                if not cols:
                    continue
                
                if len(cols) >= 3:
                    no = cols[0].get_text(strip=True)
                    nama_peserta = cols[1].get_text(strip=True).replace('\xa0', ' ')
                    npwp = cols[2].get_text(strip=True).replace('\xa0', ' ')
                    
                    harga_penawaran_str = cols[3].get_text(strip=True) if len(cols) > 3 else ""
                    harga_terkoreksi_str = cols[4].get_text(strip=True) if len(cols) > 4 else ""
                    
                    harga_penawaran = parse_pagu_to_float(harga_penawaran_str) if harga_penawaran_str else 0.0
                    harga_terkoreksi = parse_pagu_to_float(harga_terkoreksi_str) if harga_terkoreksi_str else 0.0
                    
                    participants.append({
                        "nama_peserta": nama_peserta,
                        "npwp": npwp,
                        "harga_penawaran": harga_penawaran,
                        "harga_terkoreksi": harga_terkoreksi
                    })
            return participants
        except Exception as e:
            logging.error(f"Error fetching participants for tender {nomor_pengadaan}: {str(e)}")
            return None

    def get_contract_winner_data(self, nomor_pengadaan, category_slug='nasional'):
        """
        Get contract winner table from SPSE pemenangberkontrak page, or fallback to pemenang page.
        Note: uses /evaluasi/ instead of /lelang/
        """
        pages = [
            ("pemenangberkontrak", f"{self.base_url}/{category_slug}/evaluasi/{nomor_pengadaan}/pemenangberkontrak"),
            ("pemenang", f"{self.base_url}/{category_slug}/evaluasi/{nomor_pengadaan}/pemenang")
        ]

        from backend.database import parse_pagu_to_float

        for page_type, url in pages:
            try:
                logging.debug(f"Fetching winner from {page_type}: {url}")
                headers = {
                    'Referer': f"{self.base_url}/{category_slug}/evaluasi/{nomor_pengadaan}/pengumumanlelang"
                }
                response = self.session.get(url, headers=headers, timeout=REQUEST_TIMEOUT)
                if response.status_code != 200:
                    continue

                soup = BeautifulSoup(response.text, 'html.parser')
                tables = soup.find_all('table')
                winner_table = None
                for t in tables:
                    th_elems = t.find_all('th')
                    th_texts = [h.get_text().lower() for h in th_elems]
                    if any('pemenang' in ht for ht in th_texts):
                        winner_table = t
                        break

                if not winner_table and tables:
                    winner_table = tables[-1]

                if not winner_table:
                    continue

                rows = winner_table.find_all('tr')
                for row in rows:
                    cols = row.find_all('td')
                    if not cols:
                        continue

                    shift = 0
                    if len(cols) >= 5:
                        c0_text = cols[0].get_text(strip=True)
                        c1_text = cols[1].get_text(strip=True)
                        if c1_text in c0_text or "Nama Pemenang" in c0_text or c0_text.isdigit():
                            shift = 1
                    elif len(cols) == 7:
                        shift = 1

                    if len(cols) - shift >= 4:
                        nama_pemenang = cols[0 + shift].get_text(strip=True).replace('\xa0', ' ')
                        if not nama_pemenang or nama_pemenang.lower() in ["tidak ada", "tidak ada pemenang", "nihil", "-", "pemenang"]:
                            continue

                        alamat = cols[1 + shift].get_text(strip=True).replace('\xa0', ' ')
                        npwp = cols[2 + shift].get_text(strip=True).replace('\xa0', ' ')

                        harga_kontrak_str = ""
                        for c_idx in range(len(cols) - 1, 2 + shift, -1):
                            val_text = cols[c_idx].get_text(strip=True)
                            if "Rp" in val_text or any(ch.isdigit() for ch in val_text):
                                harga_kontrak_str = val_text
                                break
                        if not harga_kontrak_str and len(cols) > 3 + shift:
                            harga_kontrak_str = cols[3 + shift].get_text(strip=True)

                        nilai_pdn_str = cols[4 + shift].get_text(strip=True) if len(cols) > 4 + shift else ""
                        nilai_umk_str = cols[5 + shift].get_text(strip=True) if len(cols) > 5 + shift else ""

                        harga_kontrak = parse_pagu_to_float(harga_kontrak_str)
                        nilai_pdn = parse_pagu_to_float(nilai_pdn_str) if nilai_pdn_str else 0.0
                        nilai_umk = parse_pagu_to_float(nilai_umk_str) if nilai_umk_str else 0.0

                        if nama_pemenang and len(nama_pemenang) > 2:
                            logging.info(f"Successfully scraped winner for tender {nomor_pengadaan} from {page_type}: {nama_pemenang} ({harga_kontrak})")
                            return {
                                "nama_pemenang": nama_pemenang,
                                "alamat": alamat,
                                "npwp": npwp,
                                "harga_kontrak": harga_kontrak,
                                "nilai_pdn": nilai_pdn,
                                "nilai_umk": nilai_umk
                            }
            except Exception as e:
                logging.error(f"Error fetching winner for tender {nomor_pengadaan} from {page_type}: {str(e)}")

        return None

    def get_evaluation_data(self, nomor_pengadaan, category_slug='nasional'):
        """
        Get evaluation details from SPSE /evaluasi/.../evaluasi page
        """
        try:
            url = f"{self.base_url}/{category_slug}/evaluasi/{nomor_pengadaan}/hasil"
            logging.debug(f"Fetching evaluation details from: {url}")
            
            headers = {
                'Referer': f"{self.base_url}/{category_slug}/evaluasi/{nomor_pengadaan}/pemenang"
            }
            
            response = self.session.get(url, headers=headers, timeout=REQUEST_TIMEOUT)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Find the evaluation table
            tables = soup.find_all('table')
            eval_table = None
            for t in tables:
                th_elements = t.find_all('th')
                th_texts = [h.get_text().strip().lower() for h in th_elements]
                if any('peserta' in th_t or 'nama' in th_t for th_t in th_texts):
                    eval_table = t
                    break
                    
            if not eval_table and tables:
                eval_table = tables[0]
                
            if not eval_table:
                logging.warning(f"No evaluation table found for tender {nomor_pengadaan}")
                return None
                
            from backend.database import parse_pagu_to_float
            
            # Map headers to column indices
            header_row = eval_table.find('tr')
            th_elements = header_row.find_all(['th', 'td']) if header_row else []
            th_texts = [h.get_text().strip().lower() for h in th_elements]
            
            idx_nama = -1
            idx_npwp = -1
            idx_penawaran = -1
            idx_terkoreksi = -1
            idx_adm = -1
            idx_tek = -1
            idx_harga = -1
            idx_kual = -1
            idx_alasan = -1
            
            p_count = 0
            for i, text in enumerate(th_texts):
                if 'peserta' in text or 'nama' in text:
                    idx_nama = i
                elif 'npwp' in text:
                    idx_npwp = i
                elif text == 'pt' or 'terkoreksi' in text:
                    idx_terkoreksi = i
                elif text == 'p':
                    p_count += 1
                    if p_count == 1:
                        idx_penawaran = i
                elif 'penawaran' in text:
                    idx_penawaran = i
                elif text == 'a' or 'administrasi' in text or 'adm' in text:
                    idx_adm = i
                elif text == 't' or 'teknis' in text or 'tek' in text:
                    idx_tek = i
                elif text == 'h' or 'harga' in text or 'evaluasi harga' in text or 'har' in text:
                    idx_harga = i
                elif text == 'k' or 'kualifikasi' in text or 'kual' in text:
                    idx_kual = i
                elif 'alasan' in text or 'keterangan' in text or 'gugur' in text:
                    idx_alasan = i
            
            if idx_nama == -1: idx_nama = 1
            if idx_npwp == -1: idx_npwp = 2
            
            evaluations = []
            rows = eval_table.find_all('tr')
            for row in rows:
                cols = row.find_all(['td', 'th'])
                if not cols:
                    continue
                if len(cols) < 3:
                    continue
                
                nama_peserta = cols[idx_nama].get_text(strip=True).replace('\xa0', ' ')
                if not nama_peserta or 'nama peserta' in nama_peserta.lower() or 'peserta lelang' in nama_peserta.lower() or nama_peserta.lower() in ('no', 'nama'):
                    continue
                
                npwp = cols[idx_npwp].get_text(strip=True).replace('\xa0', ' ') if idx_npwp < len(cols) else ""
                
                penawaran_str = cols[idx_penawaran].get_text(strip=True) if 0 <= idx_penawaran < len(cols) else ""
                terkoreksi_str = cols[idx_terkoreksi].get_text(strip=True) if 0 <= idx_terkoreksi < len(cols) else ""
                
                harga_penawaran = parse_pagu_to_float(penawaran_str) if penawaran_str else 0.0
                harga_terkoreksi = parse_pagu_to_float(terkoreksi_str) if terkoreksi_str else 0.0
                
                def get_status_char(index):
                    if 0 <= index < len(cols):
                        txt = cols[index].get_text(strip=True).replace('\xa0', ' ').strip().lower()
                        if any(c in txt for c in ['lulus', 'ya', 'ok', 'v', '✓', 'y']):
                            return 'Lulus'
                        elif any(c in txt for c in ['gugur', 'tidak', 'x', '✗', 'n']):
                            return 'Gugur'
                        img = cols[index].find('img')
                        if img:
                            src = img.get('src', '').lower()
                            if 'check' in src or 'lulus' in src or 'success' in src:
                                return 'Lulus'
                            elif 'cross' in src or 'gugur' in src or 'fail' in src or 'remove' in src:
                                return 'Gugur'
                        icon = cols[index].find('i')
                        if icon:
                            cls = ' '.join(icon.get('class', [])).lower()
                            if 'check' in cls or 'ok' in cls or 'success' in cls:
                                return 'Lulus'
                            elif 'remove' in cls or 'times' in cls or 'close' in cls or 'danger' in cls:
                                return 'Gugur'
                        if txt:
                            return txt.capitalize()
                    return '-'
                
                eval_adm = get_status_char(idx_adm)
                eval_tek = get_status_char(idx_tek)
                eval_har = get_status_char(idx_harga)
                eval_kua = get_status_char(idx_kual)
                
                alasan_gugur = cols[idx_alasan].get_text(strip=True).replace('\xa0', ' ') if 0 <= idx_alasan < len(cols) else ""
                
                # Smart fallback: infer status from reason if the columns contain minus/dash
                alasan_lower = alasan_gugur.lower()
                if 'gugur' in alasan_lower or 'tidak memenuhi' in alasan_lower or 'tidak lulus' in alasan_lower:
                    if 'administrasi' in alasan_lower and eval_adm != 'Lulus':
                        eval_adm = 'Gugur'
                    if 'teknis' in alasan_lower and eval_tek != 'Lulus':
                        eval_tek = 'Gugur'
                    if 'harga' in alasan_lower and eval_har != 'Lulus':
                        eval_har = 'Gugur'
                    if 'kualifikasi' in alasan_lower and eval_kua != 'Lulus':
                        eval_kua = 'Gugur'
                
                evaluations.append({
                    "nama_peserta": nama_peserta,
                    "npwp": npwp,
                    "harga_penawaran": harga_penawaran,
                    "harga_terkoreksi": harga_terkoreksi,
                    "evaluasi_administrasi": eval_adm,
                    "evaluasi_teknis": eval_tek,
                    "evaluasi_harga": eval_har,
                    "evaluasi_kualifikasi": eval_kua,
                    "alasan_gugur": alasan_gugur
                })
                
            return evaluations
        except Exception as e:
            logging.error(f"Error fetching evaluation details for tender {nomor_pengadaan}: {str(e)}")
            return None
    
    def save_details_to_csv(self, details_list, endpoint_type, tahun, search='', save_path=None):
        """
        Save multiple detail data to single CSV file with semicolon delimiter
        
        Args:
            details_list: List of dictionaries with detail information
            endpoint_type: 'tender' or 'nontender'
            tahun: Year
            search: Search query (optional)
            save_path: Directory to save the file
        
        Returns:
            str: Path to saved file or None if failed
        """
        import csv
        from datetime import datetime
        
        try:
            if not details_list:
                logging.warning("No detail data to save")
                return None
            
            # Create detail directory
            detail_dir = Path(save_path) if save_path else self.output_base / 'detail'
            detail_dir.mkdir(parents=True, exist_ok=True)
            
            # Generate filename with timestamp
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            search_suffix = f"_{search.replace(' ', '_')}" if search else ''
            filename = f"spse_{endpoint_type}_{tahun}{search_suffix}_{timestamp}.csv"
            filepath = detail_dir / filename
            
            # Collect all unique field names from all records
            all_fields = set()
            for detail_data in details_list:
                all_fields.update(detail_data.keys())
            
            # Remove metadata fields
            all_fields.discard('url')
            
            # Ensure fields
            all_fields.add('alasan_diulang')
            all_fields.add('scraped_at')
            
            # Sort fields for consistent column order
            sorted_fields = ['nomor_pengadaan'] + sorted([f for f in all_fields if f != 'nomor_pengadaan'])
            
            # Write CSV with semicolon delimiter
            with open(filepath, 'w', newline='', encoding='utf-8') as f:
                writer = csv.DictWriter(f, fieldnames=sorted_fields, delimiter=';', extrasaction='ignore')
                
                # Write header
                writer.writeheader()
                
                # Write data rows
                for detail_data in details_list:
                    row_data = detail_data.copy()
                    row_data.pop('url', None)
                    row_data['scraped_at'] = datetime.now().isoformat()
                    if 'alasan_diulang' not in row_data:
                        row_data['alasan_diulang'] = None
                    writer.writerow(row_data)
            
            print(f"[OK] CSV saved to: {filepath} ({len(details_list)} records)")
            
            return str(filepath)
            
        except Exception as e:
            print(f"[ERROR] Error saving CSV: {str(e)}")
            return None
