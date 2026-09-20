import React, { useState, useEffect } from 'react';

// Helper inline SVG icons
const BuildingIcon = ({ size = 24, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
    <path d="M9 22v-4h6v4"/>
    <path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/>
  </svg>
);

const SearchIcon = ({ size = 18, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const EditIcon = ({ size = 14, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const MailIcon = ({ size = 14, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const PhoneIcon = ({ size = 14, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const FileSpreadsheetIcon = ({ size = 18, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="8" y1="13" x2="16" y2="13"/>
    <line x1="8" y1="17" x2="16" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);

const FileTextIcon = ({ size = 18, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);

const RefreshIcon = ({ size = 18, style = {}, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style} className={className}>
    <polyline points="23 4 23 10 17 10"/>
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
  </svg>
);

const ChevronLeftIcon = ({ size = 16, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);

const ChevronRightIcon = ({ size = 16, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

const CheckIcon = ({ size = 20, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const AlertIcon = ({ size = 20, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

const CloseIcon = ({ size = 20, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const FilterIcon = ({ size = 18, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
  </svg>
);

export default function CompanyLeadsManager({ token }) {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState({ total_companies: 0, has_contact: 0, no_contact: 0 });
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  
  // Modal Edit State
  const [editingCompany, setEditingCompany] = useState(null);
  const [editForm, setEditForm] = useState({ company_name: '', email: '', phone: '', npwp: '' });
  const [isSaving, setIsSaving] = useState(false);
  
  // Toast Alert State
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search: search,
        filter_status: filterStatus,
        page: page,
        limit: limit
      });
      const res = await fetch(`/api/admin/company-leads?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const json = await res.json();
      if (res.ok && json.status === 'success') {
        setLeads(json.data.items || []);
        setTotal(json.data.total || 0);
        if (json.data.stats) {
          setStats(json.data.stats);
        }
      } else {
        showToast(json.detail || 'Gagal memuat data prospek perusahaan', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Terjadi kesalahan jaringan saat mengambil data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [page, search, filterStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };

  const handleOpenEdit = (company) => {
    setEditingCompany(company);
    setEditForm({
      company_name: company.company_name,
      email: company.email || '',
      phone: company.phone || '',
      npwp: company.npwp !== '-' ? company.npwp : ''
    });
  };

  const handleSaveContact = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/company-leads/contact', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });
      const json = await res.json();
      if (res.ok && json.status === 'success') {
        showToast('Kontak perusahaan berhasil diperbarui!');
        setEditingCompany(null);
        fetchLeads();
      } else {
        showToast(json.detail || 'Gagal memperbarui kontak', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Gagal terhubung ke server', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = async (format) => {
    setExporting(true);
    try {
      const params = new URLSearchParams({
        format: format,
        search: search,
        filter_status: filterStatus
      });
      const response = await fetch(`/api/admin/company-leads/export?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Gagal mengunduh file ekspor');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `daftar_prospek_perusahaan.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      showToast(`File ${format.toUpperCase()} berhasil diunduh!`);
    } catch (err) {
      console.error(err);
      showToast('Gagal mengunduh file ekspor', 'error');
    } finally {
      setExporting(false);
    }
  };

  const formatRupiah = (val) => {
    if (!val || isNaN(val)) return 'Rp 0';
    return 'Rp ' + Number(val).toLocaleString('id-ID');
  };

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto', color: '#f3f4f6' }}>
      {/* Toast Alert */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '14px 20px',
          borderRadius: '10px',
          backgroundColor: toast.type === 'error' ? '#ef4444' : '#10b981',
          color: '#fff',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)',
          fontWeight: '600',
          fontSize: '14px'
        }}>
          {toast.type === 'error' ? <AlertIcon size={20} /> : <CheckIcon size={20} />}
          {toast.msg}
        </div>
      )}

      {/* Header & Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '800', fontFamily: 'Outfit, sans-serif', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
            <BuildingIcon size={30} style={{ color: '#6366f1' }} /> Prospek & Kontak Perusahaan
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '14px', marginTop: '6px' }}>
            Kelola kontak person (Email & No. Telp) seluruh penyedia/kontraktor SPSE untuk campaign aplikasi.
          </p>
        </div>

        {/* Dual Export Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => handleExport('xlsx')}
            disabled={exporting}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#059669',
              color: '#fff',
              border: 'none',
              padding: '10px 18px',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '14px',
              cursor: exporting ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
              boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#047857'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#059669'}
          >
            <FileSpreadsheetIcon size={18} />
            {exporting ? 'Mengunduh...' : 'Export Excel (.xlsx)'}
          </button>

          <button
            onClick={() => handleExport('csv')}
            disabled={exporting}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#4f46e5',
              color: '#fff',
              border: 'none',
              padding: '10px 18px',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '14px',
              cursor: exporting ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4338ca'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4f46e5'}
          >
            <FileTextIcon size={18} />
            {exporting ? 'Mengunduh...' : 'Export CSV (.csv)'}
          </button>
        </div>
      </div>

      {/* Stats Counter Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid #334155' }}>
          <div style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>TOTAL PERUSAHAAN TEREKAM</div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#fff' }}>{stats.total_companies.toLocaleString('id-ID')}</div>
          <div style={{ color: '#64748b', fontSize: '12px', marginTop: '4px' }}>Peserta & Pemenang SPSE</div>
        </div>

        <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid #065f46' }}>
          <div style={{ color: '#34d399', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>SUDAH ADA KONTAK</div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#34d399' }}>{stats.has_contact.toLocaleString('id-ID')}</div>
          <div style={{ color: '#64748b', fontSize: '12px', marginTop: '4px' }}>Telah diisi email / telp</div>
        </div>

        <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid #854d0e' }}>
          <div style={{ color: '#facc15', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>BELUM ADA KONTAK</div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#facc15' }}>{stats.no_contact.toLocaleString('id-ID')}</div>
          <div style={{ color: '#64748b', fontSize: '12px', marginTop: '4px' }}>Perlu di-prospecting</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div style={{ backgroundColor: '#1e293b', padding: '16px 20px', borderRadius: '12px', border: '1px solid #334155', marginBottom: '24px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '10px', flex: 1, minWidth: '300px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <SearchIcon size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input
              type="text"
              placeholder="Cari nama perusahaan atau NPWP..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '8px',
                padding: '10px 14px 10px 42px',
                color: '#fff',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              backgroundColor: '#3b82f6',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '0 20px',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Cari
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FilterIcon size={18} style={{ color: '#94a3b8' }} />
          <select
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
            style={{
              backgroundColor: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '8px',
              padding: '10px 14px',
              color: '#fff',
              fontSize: '14px',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="all">Semua Perusahaan</option>
            <option value="has_contact">Sudah Ada Kontak</option>
            <option value="no_contact">Belum Ada Kontak</option>
          </select>

          <button
            onClick={fetchLeads}
            title="Refresh Data"
            style={{
              backgroundColor: '#334155',
              color: '#cbd5e1',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <RefreshIcon size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: '#0f172a', borderBottom: '1px solid #334155', color: '#94a3b8' }}>
                <th style={{ padding: '16px 20px', width: '60px' }}>No</th>
                <th style={{ padding: '16px 20px' }}>Nama Perusahaan & NPWP</th>
                <th style={{ padding: '16px 20px', textAlign: 'center' }}>Total Diikuti</th>
                <th style={{ padding: '16px 20px', textAlign: 'center' }}>Total Menang</th>
                <th style={{ padding: '16px 20px', textAlign: 'center' }}>Win Rate</th>
                <th style={{ padding: '16px 20px', textAlign: 'right' }}>Total Nilai Kontrak</th>
                <th style={{ padding: '16px 20px' }}>Kontak Person</th>
                <th style={{ padding: '16px 20px', textAlign: 'center', width: '120px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                    <RefreshIcon size={28} className="animate-spin" style={{ margin: '0 auto 12px auto', display: 'block', color: '#6366f1' }} />
                    Memuat data perusahaan prospek...
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                    Tidak ada data perusahaan yang sesuai dengan kriteria pencarian/filter.
                  </td>
                </tr>
              ) : (
                leads.map((item, idx) => {
                  const rowNumber = (page - 1) * limit + idx + 1;
                  const hasEmail = Boolean(item.email && item.email.trim());
                  const hasPhone = Boolean(item.phone && item.phone.trim());

                  return (
                    <tr key={item.company_name} style={{ borderBottom: '1px solid #334155', transition: 'background-color 0.15s' }}>
                      <td style={{ padding: '16px 20px', color: '#94a3b8', fontWeight: '500' }}>{rowNumber}</td>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ fontWeight: '700', color: '#fff', fontSize: '15px' }}>{item.company_name}</div>
                        <div style={{ color: '#64748b', fontSize: '12px', marginTop: '2px' }}>NPWP: {item.npwp || '-'}</div>
                      </td>
                      <td style={{ padding: '16px 20px', textAlign: 'center', color: '#cbd5e1', fontWeight: '600' }}>
                        {item.total_followed}
                      </td>
                      <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                        <span style={{ 
                          backgroundColor: item.total_wins > 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(100, 116, 139, 0.15)',
                          color: item.total_wins > 0 ? '#34d399' : '#94a3b8',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontWeight: '700'
                        }}>
                          {item.total_wins}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px', textAlign: 'center', fontWeight: '700', color: item.win_rate > 30 ? '#34d399' : '#94a3b8' }}>
                        {item.win_rate}%
                      </td>
                      <td style={{ padding: '16px 20px', textAlign: 'right', fontWeight: '700', color: item.total_contract_value > 0 ? '#60a5fa' : '#64748b' }}>
                        {formatRupiah(item.total_contract_value)}
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: hasEmail ? '#e2e8f0' : '#64748b' }}>
                            <MailIcon size={14} style={{ color: hasEmail ? '#38bdf8' : '#475569' }} />
                            {hasEmail ? item.email : <span style={{ fontStyle: 'italic' }}>Belum ada email</span>}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: hasPhone ? '#e2e8f0' : '#64748b' }}>
                            <PhoneIcon size={14} style={{ color: hasPhone ? '#4ade80' : '#475569' }} />
                            {hasPhone ? item.phone : <span style={{ fontStyle: 'italic' }}>Belum ada no. telp</span>}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                        <button
                          onClick={() => handleOpenEdit(item)}
                          style={{
                            backgroundColor: '#3b82f6',
                            color: '#fff',
                            border: 'none',
                            padding: '8px 14px',
                            borderRadius: '6px',
                            fontWeight: '600',
                            fontSize: '13px',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            boxShadow: '0 2px 8px rgba(59, 130, 246, 0.25)'
                          }}
                        >
                          <EditIcon size={14} /> Edit
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ color: '#94a3b8', fontSize: '14px' }}>
            Menampilkan {leads.length > 0 ? (page - 1) * limit + 1 : 0} hingga {Math.min(page * limit, total)} dari <strong style={{ color: '#fff' }}>{total}</strong> perusahaan
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setPage(p => Math.max(p - 1, 1))}
              disabled={page === 1}
              style={{
                backgroundColor: page === 1 ? '#1e293b' : '#334155',
                color: page === 1 ? '#475569' : '#fff',
                border: '1px solid #475569',
                borderRadius: '6px',
                padding: '6px 12px',
                cursor: page === 1 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '13px'
              }}
            >
              <ChevronLeftIcon size={16} /> Sebelum
            </button>
            <span style={{ color: '#cbd5e1', fontSize: '14px', padding: '0 8px' }}>
              Halaman <strong>{page}</strong> dari <strong>{totalPages}</strong>
            </span>
            <button
              onClick={() => setPage(p => Math.min(p + 1, totalPages))}
              disabled={page >= totalPages}
              style={{
                backgroundColor: page >= totalPages ? '#1e293b' : '#334155',
                color: page >= totalPages ? '#475569' : '#fff',
                border: '1px solid #475569',
                borderRadius: '6px',
                padding: '6px 12px',
                cursor: page >= totalPages ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '13px'
              }}
            >
              Lanjut <ChevronRightIcon size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Modal Edit Contact */}
      {editingCompany && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '520px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <EditIcon size={20} style={{ color: '#3b82f6' }} /> Edit Kontak Perusahaan
              </h3>
              <button
                onClick={() => setEditingCompany(null)}
                style={{ backgroundColor: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <CloseIcon size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveContact} style={{ padding: '24px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#94a3b8', marginBottom: '6px' }}>Nama Perusahaan</label>
                <input
                  type="text"
                  value={editForm.company_name}
                  disabled
                  style={{
                    width: '100%',
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    color: '#94a3b8',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#94a3b8', marginBottom: '6px' }}>NPWP (Opsional)</label>
                <input
                  type="text"
                  placeholder="Contoh: 01.234.567.8-901.000"
                  value={editForm.npwp}
                  onChange={(e) => setEditForm({ ...editForm, npwp: e.target.value })}
                  style={{
                    width: '100%',
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    color: '#fff',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#94a3b8', marginBottom: '6px' }}>Email Kontak</label>
                <div style={{ position: 'relative' }}>
                  <MailIcon size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                  <input
                    type="email"
                    placeholder="email@perusahaan.com"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    style={{
                      width: '100%',
                      backgroundColor: '#0f172a',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      padding: '10px 14px 10px 42px',
                      color: '#fff',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#94a3b8', marginBottom: '6px' }}>No. Telepon / WhatsApp</label>
                <div style={{ position: 'relative' }}>
                  <PhoneIcon size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                  <input
                    type="text"
                    placeholder="081234567890"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    style={{
                      width: '100%',
                      backgroundColor: '#0f172a',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      padding: '10px 14px 10px 42px',
                      color: '#fff',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setEditingCompany(null)}
                  style={{
                    backgroundColor: '#334155',
                    color: '#cbd5e1',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 20px',
                    fontWeight: '600',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  style={{
                    backgroundColor: '#3b82f6',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 24px',
                    fontWeight: '600',
                    fontSize: '14px',
                    cursor: isSaving ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                  }}
                >
                  {isSaving ? 'Menyimpan...' : 'Simpan Kontak'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
