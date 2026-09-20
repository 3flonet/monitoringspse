import React, { useState, useEffect } from 'react';
import Chatbot from './components/Chatbot';
import AdminLeadsManager from './components/AdminLeadsManager';
import CompanyLeadsManager from './components/CompanyLeadsManager';

const PremiumFooter = ({ adminSettings, onNavigate }) => {
    return (
        <footer className="app-footer" style={{
            background: 'linear-gradient(180deg, #070a12 0%, #030509 100%)',
            borderTop: '1px solid rgba(99, 102, 241, 0.15)',
            padding: '60px 24px 32px',
            marginTop: '60px',
            width: '100%',
            boxSizing: 'border-box',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Top ambient glow */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '600px',
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.5), rgba(168, 85, 247, 0.5), transparent)',
                boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)'
            }} />

            <div style={{ maxWidth: '1140px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                {/* Top CTA Banner inside Footer */}
                <div className="footer-cta-card">
                    <div>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6366f1', boxShadow: '0 0 8px #6366f1' }} />
                            Platform Monitoring SPSE #1
                        </div>
                        <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '22px', fontWeight: '800', color: '#ffffff', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
                            Siap Menangkan Tender Berikutnya?
                        </h3>
                        <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0, lineHeight: '1.6', maxWidth: '560px' }}>
                            Deteksi peluang proyek LPSE seluruh Indonesia otomatis dengan notifikasi instan WhatsApp & Email.
                        </p>
                    </div>
                    <button
                        onClick={() => onNavigate('auth')}
                        style={{
                            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                            color: '#ffffff',
                            border: 'none',
                            padding: '14px 28px',
                            borderRadius: '14px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            fontSize: '14px',
                            boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '10px',
                            whiteSpace: 'nowrap',
                            flexShrink: 0,
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <span>🚀</span> Mulai Gratis {adminSettings?.trial_days || '7'} Hari
                    </button>
                </div>

                {/* Main Content Grid */}
                <div className="footer-content-grid">
                    {/* Brand column */}
                    <div className="footer-brand-col">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.2))', border: '1px solid rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                                {adminSettings.app_logo || '🕵🏼‍♂️'}
                            </div>
                            <div>
                                <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: '800', fontSize: '22px', background: 'linear-gradient(135deg, #ffffff, #c7d2fe)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'block', lineHeight: '1.1' }}>
                                    {adminSettings.app_name || 'Spy SPSE'}
                                </span>
                                <span style={{ fontSize: '11px', color: '#818cf8', fontWeight: '600', letterSpacing: '0.04em' }}>
                                    {adminSettings?.app_tagline || 'SPSE Monitoring Engine'}
                                </span>
                            </div>
                        </div>
                        <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.7', margin: '0 0 20px', maxWidth: '320px' }}>
                            {adminSettings?.seo_description || 'Platform pemantauan tender SPSE otomatis #1 Indonesia. Deteksi peluang proyek lebih cepat & tingkatkan kemenangan bisnis Anda.'}
                        </p>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            {adminSettings.contact_whatsapp && (
                                <a href={`https://wa.me/${String(adminSettings.contact_whatsapp || '').replace(/\D/g, '')}`} target="_blank" rel="noreferrer"
                                    style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                                        background: 'rgba(34, 197, 94, 0.08)', border: '1px solid rgba(34, 197, 94, 0.25)',
                                        color: '#4ade80', padding: '8px 14px', borderRadius: '10px',
                                        fontSize: '12px', fontWeight: '600', textDecoration: 'none', transition: 'all 0.2s ease'
                                    }}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                    WhatsApp Support
                                </a>
                            )}
                            {adminSettings.contact_email && (
                                <a href={`mailto:${adminSettings.contact_email}`}
                                    style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                                        background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.25)',
                                        color: '#a5b4fc', padding: '8px 14px', borderRadius: '10px',
                                        fontSize: '12px', fontWeight: '600', textDecoration: 'none', transition: 'all 0.2s ease'
                                    }}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
                                    Email Support
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Navigasi column */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                            <div style={{ width: '4px', height: '14px', borderRadius: '2px', background: '#6366f1' }} />
                            <h4 style={{ fontSize: '12px', fontWeight: '800', color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
                                Navigasi
                            </h4>
                        </div>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {[
                                { label: 'Beranda', action: () => onNavigate('landing', 'home') },
                                { label: 'Explorer Tender', action: () => onNavigate('tenders') },
                                { label: 'Paket Harga', action: () => onNavigate('landing', 'home', 'landing-pricing') },
                                { label: 'Hubungi Kami', action: () => onNavigate('landing', 'contact') },
                                { label: 'Daftar / Masuk', action: () => onNavigate('auth') },
                            ].map((item, idx) => (
                                <li key={idx}>
                                    <button onClick={item.action} className="footer-link-btn" style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '13px', padding: '2px 0', transition: 'all 0.2s ease', textAlign: 'left', fontWeight: '500', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 0.2s ease' }}><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                                        <span>{item.label}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Fitur column */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                            <div style={{ width: '4px', height: '14px', borderRadius: '2px', background: '#10b981' }} />
                            <h4 style={{ fontSize: '12px', fontWeight: '800', color: '#6ee7b7', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
                                Fitur Utama
                            </h4>
                        </div>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {[
                                'Notifikasi WhatsApp Real-time',
                                'Radar Tender Otomatis 24/7',
                                'Explorer Multi-Instansi',
                                'Analisis Kompetitor & Gugur',
                                'Saved Bookmarks & Sync',
                                'Voucher & Diskon Eksklusif',
                            ].map((f, idx) => (
                                <li key={idx} style={{ color: '#94a3b8', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                    </div>
                                    <span>{f}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Kontak column */}
                    <div className="footer-contact-col">
                        <div style={{
                            background: 'rgba(15, 23, 42, 0.65)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: '16px',
                            padding: '20px',
                            backdropFilter: 'blur(12px)',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                                <div style={{ width: '4px', height: '14px', borderRadius: '2px', background: '#a855f7' }} />
                                <h4 style={{ fontSize: '12px', fontWeight: '800', color: '#c084fc', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
                                    Hubungi Kami
                                </h4>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {adminSettings.contact_whatsapp ? (
                                    <a href={`https://wa.me/${String(adminSettings.contact_whatsapp || '').replace(/\D/g, '')}`} target="_blank" rel="noreferrer"
                                        style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#e2e8f0', textDecoration: 'none', fontSize: '13px', fontWeight: '600', transition: 'all 0.2s ease', padding: '6px 8px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)' }}
                                        onMouseEnter={(e) => { e.currentTarget.style.color = '#34d399'; e.currentTarget.style.background = 'rgba(34, 197, 94, 0.08)'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.color = '#e2e8f0'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                                    >
                                        <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(34, 197, 94, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4ade80' }}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                        </div>
                                        <span>{adminSettings.contact_whatsapp}</span>
                                    </a>
                                ) : <span style={{ color: '#64748b', fontSize: '12px' }}>WhatsApp belum dikonfigurasi</span>}

                                {adminSettings.contact_email ? (
                                    <a href={`mailto:${adminSettings.contact_email}`}
                                        style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#e2e8f0', textDecoration: 'none', fontSize: '13px', fontWeight: '600', transition: 'all 0.2s ease', padding: '6px 8px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)' }}
                                        onMouseEnter={(e) => { e.currentTarget.style.color = '#a5b4fc'; e.currentTarget.style.background = 'rgba(99, 102, 241, 0.08)'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.color = '#e2e8f0'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                                    >
                                        <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8' }}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
                                        </div>
                                        <span>{adminSettings.contact_email}</span>
                                    </a>
                                ) : <span style={{ color: '#64748b', fontSize: '12px' }}>Email belum dikonfigurasi</span>}

                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '12px', marginTop: '2px', paddingTop: '10px', borderTop: '1px dashed rgba(255,255,255,0.08)' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
                                    <span>Respons 1–3 jam di hari kerja</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="footer-bottom-bar" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ color: '#64748b', fontSize: '13px', fontWeight: '500' }}>
                        &copy; {new Date().getFullYear()} <strong style={{ color: '#cbd5e1' }}>{adminSettings.app_name || 'SPSE Monitor'}</strong>. Semua hak dilindungi.
                    </div>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', fontSize: '13px' }}>
                        <button onClick={() => onNavigate('landing', 'privacy')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '13px', padding: 0, transition: 'color 0.2s', fontWeight: '500' }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
                        >Kebijakan Privasi</button>
                        <span style={{ color: '#334155' }}>•</span>
                        <button onClick={() => onNavigate('landing', 'terms')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '13px', padding: 0, transition: 'color 0.2s', fontWeight: '500' }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
                        >Syarat & Ketentuan</button>
                        <span style={{ color: '#334155' }}>•</span>
                        <a href="https://3flo.net" target="_blank" rel="noreferrer" style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.25)',
                            padding: '4px 10px', borderRadius: '12px',
                            color: '#a5b4fc', textDecoration: 'none', fontWeight: '600', fontSize: '12px'
                        }}>
                            <span>Powered by</span>
                            <strong style={{ color: '#818cf8' }}>3flo.net</strong>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

const CrawlLogsHealthMonitor = ({ userToken }) => {
    const [logs, setLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [isClearing, setIsClearing] = useState(false);
    const [flashMsg, setFlashMsg] = useState(null);

    const fetchLogs = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/crawl-logs?limit=30', {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            });
            if (res.ok) {
                const data = await res.json();
                setLogs(data.logs || []);
            }
        } catch (e) {
            console.error('Failed to fetch crawl logs:', e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirmClearLogs = async () => {
        setIsClearing(true);
        setFlashMsg(null);
        try {
            const res = await fetch('/api/admin/crawl-logs', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            });
            const data = await res.json();
            if (res.ok) {
                setLogs([]);
                setShowConfirmModal(false);
                setFlashMsg({ type: 'success', text: data.message || 'Log kesehatan penarikan & pemblokiran berhasil dibersihkan!' });
                setTimeout(() => setFlashMsg(null), 5000);
            } else {
                setShowConfirmModal(false);
                setFlashMsg({ type: 'error', text: data.detail || 'Gagal membersihkan log.' });
            }
        } catch (e) {
            setShowConfirmModal(false);
            setFlashMsg({ type: 'error', text: 'Kesalahan jaringan saat membersihkan log.' });
        } finally {
            setIsClearing(false);
        }
    };

    useEffect(() => {
        if (userToken) fetchLogs();
    }, [userToken]);

    const blockedCount = logs.filter(l => l.status === 'blocked').length;
    const failedCount = logs.filter(l => l.status === 'failed' || l.status === 'error').length;
    const successCount = logs.filter(l => l.status === 'success').length;

    return (
        <div style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.85), rgba(30, 41, 59, 0.85))',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '32px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            position: 'relative'
        }}>
            {/* SWEETALERT STYLED CONFIRMATION MODAL */}
            {showConfirmModal && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 99999,
                    background: 'rgba(15, 23, 42, 0.75)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px'
                }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                        border: '1px solid rgba(239, 68, 68, 0.4)',
                        borderRadius: '20px',
                        padding: '28px',
                        maxWidth: '440px',
                        width: '100%',
                        textAlign: 'center',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 30px rgba(239, 68, 68, 0.2)'
                    }}>
                        <div style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '50%',
                            background: 'rgba(239, 68, 68, 0.15)',
                            border: '2px solid rgba(239, 68, 68, 0.4)',
                            color: '#f87171',
                            fontSize: '28px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 16px',
                            boxShadow: '0 0 20px rgba(239, 68, 68, 0.3)'
                        }}>
                            🗑️
                        </div>

                        <h3 style={{ margin: '0 0 10px', fontSize: '18px', fontWeight: '800', color: '#ffffff' }}>
                            Bersihkan Semua Log Penarikan?
                        </h3>

                        <p style={{ margin: '0 0 24px', fontSize: '13px', color: '#94a3b8', lineHeight: '1.6' }}>
                            Apakah Anda yakin ingin menghapus seluruh riwayat status kesehatan penarikan &amp; indikasi IP terblokir? Tindakan ini <strong style={{ color: '#f87171' }}>tidak dapat dibatalkan</strong>.
                        </p>

                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                disabled={isClearing}
                                style={{
                                    flex: 1,
                                    background: 'rgba(255, 255, 255, 0.08)',
                                    border: '1px solid rgba(255, 255, 255, 0.15)',
                                    color: '#cbd5e1',
                                    padding: '10px 16px',
                                    borderRadius: '10px',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleConfirmClearLogs}
                                disabled={isClearing}
                                style={{
                                    flex: 1,
                                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                    color: '#ffffff',
                                    border: 'none',
                                    padding: '10px 16px',
                                    borderRadius: '10px',
                                    fontSize: '13px',
                                    fontWeight: '700',
                                    cursor: isClearing ? 'wait' : 'pointer',
                                    boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)'
                                }}
                            >
                                {isClearing ? 'Memproses...' : 'Ya, Bersihkan Log'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                <div>
                    <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span>📊</span> Status Kesehatan Crawling &amp; Notifikasi Pemblokiran LPSE
                    </h3>
                    <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#94a3b8' }}>
                        Pemantauan real-time status penarikan data per instansi LPSE &amp; rincian indikasi IP terblokir.
                    </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                        onClick={fetchLogs}
                        disabled={isLoading}
                        style={{
                            background: 'rgba(99, 102, 241, 0.2)',
                            color: '#a5b4fc',
                            border: '1px solid rgba(99, 102, 241, 0.4)',
                            padding: '8px 16px',
                            borderRadius: '10px',
                            fontWeight: '700',
                            fontSize: '12px',
                            cursor: isLoading ? 'wait' : 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}
                    >
                        <span>🔄</span> {isLoading ? 'Memuat Log...' : 'Refresh Logs'}
                    </button>

                    <button
                        onClick={() => setShowConfirmModal(true)}
                        disabled={logs.length === 0 || isLoading}
                        style={{
                            background: 'rgba(239, 68, 68, 0.15)',
                            color: '#f87171',
                            border: '1px solid rgba(239, 68, 68, 0.35)',
                            padding: '8px 16px',
                            borderRadius: '10px',
                            fontWeight: '700',
                            fontSize: '12px',
                            cursor: (logs.length === 0 || isLoading) ? 'not-allowed' : 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            opacity: logs.length === 0 ? 0.6 : 1
                        }}
                    >
                        <span>🗑️</span> Bersihkan Log
                    </button>
                </div>
            </div>

            {/* FLASH MESSAGE BANNER */}
            {flashMsg && (
                <div style={{
                    padding: '12px 16px',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: '600',
                    marginBottom: '16px',
                    background: flashMsg.type === 'success' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    border: `1px solid ${flashMsg.type === 'success' ? 'rgba(34, 197, 94, 0.35)' : 'rgba(239, 68, 68, 0.35)'}`,
                    color: flashMsg.type === 'success' ? '#4ade80' : '#f87171',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <span>{flashMsg.type === 'success' ? '✅' : '❌'}</span>
                    {flashMsg.text}
                </div>
            )}

            {/* Health Indicators */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                <div style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)', padding: '12px 16px', borderRadius: '12px' }}>
                    <div style={{ fontSize: '11px', color: '#86efac', fontWeight: '700', textTransform: 'uppercase' }}>Penarikan Sukses</div>
                    <div style={{ fontSize: '22px', fontWeight: '800', color: '#4ade80' }}>{successCount}</div>
                </div>
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '12px 16px', borderRadius: '12px' }}>
                    <div style={{ fontSize: '11px', color: '#fca5a5', fontWeight: '700', textTransform: 'uppercase' }}>Dugaan IP Terblokir</div>
                    <div style={{ fontSize: '22px', fontWeight: '800', color: '#f87171' }}>{blockedCount}</div>
                </div>
                <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '12px 16px', borderRadius: '12px' }}>
                    <div style={{ fontSize: '11px', color: '#fde047', fontWeight: '700', textTransform: 'uppercase' }}>Kendala Response API</div>
                    <div style={{ fontSize: '22px', fontWeight: '800', color: '#fbbf24' }}>{failedCount}</div>
                </div>
            </div>

            {/* Notification Banner if blocked logs exist */}
            {blockedCount > 0 && (
                <div style={{
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    padding: '14px 18px',
                    borderRadius: '12px',
                    marginBottom: '20px',
                    color: '#fca5a5',
                    fontSize: '13px',
                    lineHeight: '1.6',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                }}>
                    <span style={{ fontSize: '24px' }}>🚨</span>
                    <div>
                        <strong>PERINGATAN PEMBLOKIRAN IP VPS:</strong> Terdeteksi {blockedCount} percobaan penarikan data yang gagal akibat pemblokiran IP oleh server LPSE. Notifikasi peringatan darurat juga dikirimkan otomatis ke WhatsApp Admin. <strong>Disarankan segera memasukkan IP Proxy baru pada form di atas!</strong>
                    </div>
                </div>
            )}

            {/* Logs Table */}
            <div style={{ overflowX: 'auto', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', color: '#cbd5e1', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <th style={{ padding: '10px 14px' }}>Waktu</th>
                            <th style={{ padding: '10px 14px' }}>Instansi LPSE</th>
                            <th style={{ padding: '10px 14px' }}>Tipe</th>
                            <th style={{ padding: '10px 14px' }}>Status</th>
                            <th style={{ padding: '10px 14px' }}>Jumlah Data</th>
                            <th style={{ padding: '10px 14px' }}>Keterangan Kendala / Error</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>
                                    Belum ada log aktivitas crawling tersimpan. Log akan terisi otomatis saat scheduler atau manual crawling dijalankan.
                                </td>
                            </tr>
                        ) : (
                            logs.map((log) => (
                                <tr key={log.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '10px 14px', whiteSpace: 'nowrap', color: '#94a3b8' }}>{log.created_at}</td>
                                    <td style={{ padding: '10px 14px', fontWeight: '700', color: '#ffffff' }}>{log.instansi}</td>
                                    <td style={{ padding: '10px 14px', textTransform: 'uppercase', fontSize: '11px' }}>{log.tipe}</td>
                                    <td style={{ padding: '10px 14px' }}>
                                        {log.status === 'success' && (
                                            <span style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#4ade80', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: '700' }}>
                                                🟢 SUKSES
                                            </span>
                                        )}
                                        {log.status === 'blocked' && (
                                            <span style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: '700' }}>
                                                🔴 TERBLOKIR IP
                                            </span>
                                        )}
                                        {(log.status === 'failed' || log.status === 'error') && (
                                            <span style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: '700' }}>
                                                ⚠️ KENDALA API
                                            </span>
                                        )}
                                    </td>
                                    <td style={{ padding: '10px 14px', fontWeight: '600' }}>{log.records_count || 0} tender</td>
                                    <td style={{ padding: '10px 14px', color: log.error_message ? '#fca5a5' : '#94a3b8', fontStyle: log.error_message ? 'normal' : 'italic' }}>
                                        {log.error_message || 'Penarikan data berjalan lancar'}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const PublicHeader = ({ adminSettings, onNavigate, userToken, activePage }) => {

    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    const navBtnStyle = (active) => ({
        background: 'transparent',
        color: active ? '#a5b4fc' : '#9ca3af',
        border: 'none',
        padding: '8px 14px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'color 0.2s'
    });

    return (
        <header className="landing-header" style={{
            position: 'sticky',
            top: 0,
            zIndex: 200,
            width: '100%',
            boxSizing: 'border-box'
        }}>
            {/* Logo */}
            <div
                style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', flexShrink: 0 }}
                onClick={() => { setIsMobileMenuOpen(false); onNavigate('landing', 'home'); }}
            >
                <span style={{ fontSize: '24px' }}>{adminSettings.app_logo || '🕵🏼‍♂️'}</span>
                <span style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: '800',
                    fontSize: '20px',
                    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    {adminSettings.app_name || 'Spy SPSE'}
                </span>
            </div>

            {/* Desktop Navigation */}
            <div className="landing-nav-desktop">
                <button onClick={() => onNavigate('landing', 'home')} style={navBtnStyle(activePage === 'home')}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#a5b4fc'}
                    onMouseLeave={(e) => e.currentTarget.style.color = activePage === 'home' ? '#a5b4fc' : '#9ca3af'}
                >Beranda</button>
                <button onClick={() => onNavigate('tenders')} style={navBtnStyle(activePage === 'tenders')}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#a5b4fc'}
                    onMouseLeave={(e) => e.currentTarget.style.color = activePage === 'tenders' ? '#a5b4fc' : '#9ca3af'}
                >Tender</button>
                <button onClick={() => { window.location.hash = '#/blog'; onNavigate('blog'); }} style={navBtnStyle(activePage === 'blog')}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#a5b4fc'}
                    onMouseLeave={(e) => e.currentTarget.style.color = activePage === 'blog' ? '#a5b4fc' : '#9ca3af'}
                >Artikel</button>
                <button onClick={() => onNavigate('landing', 'contact')} style={navBtnStyle(activePage === 'contact')}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#a5b4fc'}
                    onMouseLeave={(e) => e.currentTarget.style.color = activePage === 'contact' ? '#a5b4fc' : '#9ca3af'}
                >Kontak</button>
                <button onClick={() => onNavigate('landing', 'home', 'landing-pricing')} style={navBtnStyle(false)}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#a5b4fc'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                >Harga</button>
                {userToken ? (
                    <button onClick={() => { window.location.hash = '#/dashboard'; }} style={{
                        background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                        color: '#fff', border: 'none', padding: '8px 20px',
                        fontSize: '14px', fontWeight: '600', borderRadius: '8px',
                        cursor: 'pointer', transition: 'all 0.2s',
                        boxShadow: '0 4px 12px rgba(99,102,241,0.35)', marginLeft: '8px'
                    }}>Ke Dashboard</button>
                ) : (
                    <button onClick={() => onNavigate('auth')} style={{
                        background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                        color: '#fff', border: 'none', padding: '8px 20px',
                        fontSize: '14px', fontWeight: '600', borderRadius: '8px',
                        cursor: 'pointer', transition: 'all 0.2s',
                        boxShadow: '0 4px 12px rgba(99,102,241,0.35)', marginLeft: '8px'
                    }}>Masuk / Daftar</button>
                )}
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
                className="mobile-menu-btn"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle Mobile Menu"
            >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {isMobileMenuOpen ? (
                        <path d="M18 6L6 18M6 6l12 12" />
                    ) : (
                        <path d="M4 6h16M4 12h16M4 18h16" />
                    )}
                </svg>
            </button>

            {/* Mobile Navigation Drawer */}
            {isMobileMenuOpen && (
                <div className="mobile-nav-drawer" style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    zIndex: 200
                }}>
                    <button
                        onClick={() => { setIsMobileMenuOpen(false); onNavigate('landing', 'home'); }}
                        style={{ background: 'transparent', color: activePage === 'home' ? '#a5b4fc' : '#d1d5db', border: 'none', padding: '12px 16px', fontSize: '15px', fontWeight: '600', textAlign: 'left', borderRadius: '8px' }}
                    >
                        🏠 Beranda
                    </button>
                    <button
                        onClick={() => { setIsMobileMenuOpen(false); onNavigate('tenders'); }}
                        style={{ background: 'transparent', color: activePage === 'tenders' ? '#a5b4fc' : '#d1d5db', border: 'none', padding: '12px 16px', fontSize: '15px', fontWeight: '600', textAlign: 'left', borderRadius: '8px' }}
                    >
                        🔍 Tender
                    </button>
                    <button
                        onClick={() => { setIsMobileMenuOpen(false); window.location.hash = '#/blog'; onNavigate('blog'); }}
                        style={{ background: 'transparent', color: activePage === 'blog' ? '#a5b4fc' : '#d1d5db', border: 'none', padding: '12px 16px', fontSize: '15px', fontWeight: '600', textAlign: 'left', borderRadius: '8px' }}
                    >
                        📰 Artikel
                    </button>
                    <button
                        onClick={() => { setIsMobileMenuOpen(false); onNavigate('landing', 'contact'); }}
                        style={{ background: 'transparent', color: activePage === 'contact' ? '#a5b4fc' : '#d1d5db', border: 'none', padding: '12px 16px', fontSize: '15px', fontWeight: '600', textAlign: 'left', borderRadius: '8px' }}
                    >
                        📬 Kontak
                    </button>
                    <button
                        onClick={() => { setIsMobileMenuOpen(false); onNavigate('landing', 'home', 'landing-pricing'); }}
                        style={{ background: 'transparent', color: '#d1d5db', border: 'none', padding: '12px 16px', fontSize: '15px', fontWeight: '600', textAlign: 'left', borderRadius: '8px' }}
                    >
                        💎 Harga
                    </button>
                    {userToken ? (
                        <button
                            onClick={() => { setIsMobileMenuOpen(false); window.location.hash = '#/dashboard'; }}
                            style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: '#fff', border: 'none', padding: '14px 20px', fontSize: '15px', fontWeight: '700', borderRadius: '10px', marginTop: '8px', cursor: 'pointer', textAlign: 'center' }}
                        >
                            ⚡ Ke Dashboard
                        </button>
                    ) : (
                        <button
                            onClick={() => { setIsMobileMenuOpen(false); onNavigate('auth'); }}
                            style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: '#fff', border: 'none', padding: '14px 20px', fontSize: '15px', fontWeight: '700', borderRadius: '10px', marginTop: '8px', cursor: 'pointer', textAlign: 'center' }}
                        >
                            🚀 Masuk / Daftar
                        </button>
                    )}
                </div>
            )}
        </header>
    );
};

const PublicBlogPage = ({ adminSettings, publicArticles, isLoadingArticles, onNavigate, userToken }) => {
    const [searchTerm, setSearchTerm] = React.useState('');

    const filteredArticles = publicArticles
        .filter(art => (art.title && art.title.toLowerCase().includes(searchTerm.toLowerCase())) || (art.content && art.content.toLowerCase().includes(searchTerm.toLowerCase())))
        .sort((a, b) => {
            if (a.is_pinned !== b.is_pinned) {
                return b.is_pinned - a.is_pinned;
            }
            return new Date(b.created_at || 0) - new Date(a.created_at || 0);
        });

    return (
        <div style={{
            minHeight: '100vh',
            background: 'radial-gradient(circle at top right, rgba(99, 102, 241, 0.15), transparent), radial-gradient(circle at bottom left, rgba(168, 85, 247, 0.15), transparent), #070a13',
            color: '#f3f4f6',
            fontFamily: "'Inter', sans-serif",
            display: 'flex',
            flexDirection: 'column',
            width: '100%'
        }}>
            <PublicHeader adminSettings={adminSettings} onNavigate={onNavigate} userToken={userToken} activePage="blog" />

            <main style={{ flexGrow: 1, padding: '60px 20px', maxWidth: '1100px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
                <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                    <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '42px', fontWeight: '800', margin: '0 0 12px', background: 'linear-gradient(135deg, #fff, #9ca3af)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>💡 Insight & Panduan Tender</h1>
                    <p style={{ color: '#9ca3af', fontSize: '16px', maxWidth: '600px', margin: '0 auto 30px' }}>Dapatkan analisis mendalam, strategi memenangkan tender SPSE Indonesia.</p>

                    <div style={{ maxWidth: '500px', margin: '0 auto', position: 'relative' }}>
                        <input
                            type="text"
                            placeholder="Cari artikel..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '14px 20px',
                                borderRadius: '12px',
                                background: 'rgba(255,255,255,0.02)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                color: '#fff',
                                fontSize: '15px',
                                outline: 'none',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>
                </div>

                {isLoadingArticles ? (
                    <div style={{ textAlign: 'center', color: '#9ca3af', padding: '40px 0' }}>Memuat artikel...</div>
                ) : filteredArticles.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#6b7280', padding: '40px 0' }}>Tidak ditemukan artikel yang cocok.</div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
                        {filteredArticles.map((art) => (
                            <div key={art.id} style={{
                                background: '#0f1322',
                                border: '1px solid rgba(255, 255, 255, 0.05)',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'all 0.3s ease'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                                }}>
                                {art.image_url ? (
                                    <img src={art.image_url} alt={art.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ width: '100%', height: '200px', background: 'linear-gradient(135deg, #1e1b4b, #311042)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <span style={{ fontSize: '56px' }}>📝</span>
                                    </div>
                                )}
                                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                                        {art.is_pinned === 1 && (
                                            <span style={{ background: 'rgba(251,191,36,0.1)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.2)', fontSize: '11px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '4px' }}>📌 PINNED</span>
                                        )}
                                        <span style={{ color: '#6b7280', fontSize: '12px', alignSelf: 'center' }}>
                                            {art.created_at ? new Date(art.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                                        </span>
                                    </div>
                                    <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '20px', fontWeight: 'bold', color: '#fff', margin: '0 0 10px', lineHeight: '1.4' }}>
                                        {art.title.replace(/{lpse_name}/g, 'Indonesia')}
                                    </h2>
                                    <p style={{ color: '#9ca3af', fontSize: '13px', lineHeight: '1.6', margin: '0 0 20px', flexGrow: 1 }}>
                                        {art.meta_description || (art.content.length > 130 ? art.content.substring(0, 130) + '...' : art.content)}
                                    </p>
                                    <button onClick={() => { window.location.hash = `#/artikel/${art.slug}`; }} style={{
                                        background: 'rgba(99,102,241,0.1)',
                                        color: '#a5b4fc',
                                        border: 'none',
                                        padding: '10px 20px',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontWeight: '600',
                                        fontSize: '13px',
                                        transition: 'all 0.2s',
                                        outline: 'none'
                                    }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = '#6366f1';
                                            e.currentTarget.style.color = '#fff';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'rgba(99,102,241,0.1)';
                                            e.currentTarget.style.color = '#a5b4fc';
                                        }}>
                                        Baca Artikel Selengkapnya
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <PremiumFooter adminSettings={adminSettings} onNavigate={onNavigate} />
            <Chatbot adminSettings={adminSettings} />
        </div>
    );
};

const PublicArticleDetailPage = ({ adminSettings, selectedArticle, selectedArticleLpseSlug, lpseInstances, isLoadingArticles, onNavigate, userToken }) => {
    const [selectedLpse, setSelectedLpse] = React.useState(selectedArticleLpseSlug || 'nasional');

    React.useEffect(() => {
        if (selectedArticleLpseSlug) {
            setSelectedLpse(selectedArticleLpseSlug);
        }
    }, [selectedArticleLpseSlug]);

    if (isLoadingArticles) {
        return (
            <div style={{ minHeight: '100vh', background: '#070a13', color: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                <p>Memuat Detail Artikel...</p>
            </div>
        );
    }

    if (!selectedArticle) {
        return (
            <div style={{ minHeight: '100vh', background: '#070a13', color: '#f3f4f6', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px', width: '100%' }}>
                <h2>Artikel Tidak Ditemukan</h2>
                <button onClick={() => { window.location.hash = '#/blog'; }} className="btn-primary">Kembali ke Blog</button>
            </div>
        );
    }

    const lpseInstanceObj = lpseInstances.find(i => i.slug === selectedLpse);
    const lpseName = lpseInstanceObj ? lpseInstanceObj.name : 'Indonesia';

    const resolvedTitle = selectedArticle.title.replace(/{lpse_name}/g, lpseName);
    const resolvedContent = selectedArticle.content.replace(/{lpse_name}/g, lpseName);

    const handleLpseChange = (e) => {
        const val = e.target.value;
        setSelectedLpse(val);
        window.location.hash = val === 'nasional' ? `#/artikel/${selectedArticle.slug}` : `#/artikel/${selectedArticle.slug}/lpse/${val}`;
    };

    const getYoutubeEmbedUrl = (urlStr) => {
        if (!urlStr) return null;
        let videoId = null;
        if (urlStr.includes('v=')) {
            const parts = urlStr.split('v=');
            if (parts.length > 1) videoId = parts[1].split('&')[0];
        } else if (urlStr.includes('youtu.be/')) {
            const parts = urlStr.split('youtu.be/');
            if (parts.length > 1) videoId = parts[1].split('?')[0];
        } else if (urlStr.includes('embed/')) {
            const parts = urlStr.split('embed/');
            if (parts.length > 1) videoId = parts[1].split('?')[0].split('"')[0];
        }
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    };

    const embedUrl = getYoutubeEmbedUrl(selectedArticle.youtube_embed);

    return (
        <div style={{
            minHeight: '100vh',
            background: 'radial-gradient(circle at top right, rgba(99, 102, 241, 0.15), transparent), radial-gradient(circle at bottom left, rgba(168, 85, 247, 0.15), transparent), #070a13',
            color: '#f3f4f6',
            fontFamily: "'Inter', sans-serif",
            display: 'flex',
            flexDirection: 'column',
            width: '100%'
        }}>
            <PublicHeader adminSettings={adminSettings} onNavigate={onNavigate} userToken={userToken} activePage="blog" />

            <main style={{ flexGrow: 1, padding: '40px 20px', maxWidth: '850px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
                <div style={{
                    background: 'rgba(99, 102, 241, 0.08)',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                    borderRadius: '12px',
                    padding: '16px 20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '15px',
                    flexWrap: 'wrap',
                    marginBottom: '32px'
                }}>
                    <div>
                        <strong style={{ color: '#fff', fontSize: '14px', display: 'block', marginBottom: '2px' }}>📍 Penargetan Wilayah LPSE Dinamis</strong>
                        <span style={{ fontSize: '12px', color: '#9ca3af' }}>Pilih wilayah untuk mengubah konten artikel secara lokal</span>
                    </div>
                    <div>
                        <select
                            value={selectedLpse}
                            onChange={handleLpseChange}
                            style={{
                                background: '#0f1322',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                                color: '#fff',
                                padding: '8px 16px',
                                outline: 'none',
                                fontSize: '14px',
                                cursor: 'pointer'
                            }}
                        >
                            <option value="nasional">Nasional (Default)</option>
                            {lpseInstances.map((inst) => (
                                <option key={inst.slug} value={inst.slug}>{inst.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <article>
                    <div style={{ marginBottom: '28px' }}>
                        <span style={{ color: '#818cf8', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Insight & Analisis</span>
                        <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '36px', fontWeight: '800', color: '#fff', margin: '8px 0 16px', lineHeight: '1.3' }}>
                            {resolvedTitle}
                        </h1>
                        <div style={{ display: 'flex', gap: '12px', color: '#6b7280', fontSize: '13px' }}>
                            <span>Oleh: Admin {adminSettings.app_name || 'Spy SPSE'}</span>
                            <span>•</span>
                            <span>{selectedArticle.created_at ? new Date(selectedArticle.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}</span>
                        </div>
                    </div>

                    {selectedArticle.image_url && (
                        <div style={{ borderRadius: '16px', overflow: 'hidden', marginBottom: '32px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <img src={selectedArticle.image_url} alt={resolvedTitle} style={{ width: '100%', maxHeight: '420px', objectFit: 'cover' }} />
                        </div>
                    )}

                    <div style={{
                        color: '#d1d5db',
                        fontSize: '16px',
                        lineHeight: '1.8',
                        whiteSpace: 'pre-wrap',
                        marginBottom: '40px'
                    }}>
                        {resolvedContent}
                    </div>

                    {embedUrl && (
                        <div style={{ marginTop: '40px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '30px' }}>
                            <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '18px', fontWeight: '700', color: '#fff', marginBottom: '16px' }}>🎥 Tonton Video Terkait</h3>
                            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                                <iframe
                                    src={embedUrl}
                                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    title="YouTube Video Embed"
                                />
                            </div>
                        </div>
                    )}
                </article>

                <div style={{ marginTop: '50px', padding: '30px 0', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'center' }}>
                    <button onClick={() => { window.location.hash = '#/blog'; }} style={{
                        background: 'transparent',
                        color: '#fff',
                        border: '1px solid rgba(255,255,255,0.2)',
                        padding: '12px 30px',
                        borderRadius: '10px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#6366f1';
                            e.currentTarget.style.background = 'rgba(99,102,241,0.05)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                            e.currentTarget.style.background = 'transparent';
                        }}>
                        ← Kembali ke Semua Panduan & Artikel
                    </button>
                </div>
            </main>

            <PremiumFooter adminSettings={adminSettings} onNavigate={onNavigate} />
            <Chatbot adminSettings={adminSettings} />
        </div>
    );
};

const AdminArticlesManager = ({
    adminArticles,
    isLoadingArticles,
    editingArticleId,
    setEditingArticleId,
    adminArticleForm,
    setAdminArticleForm,
    articleMsg,
    setArticleMsg,
    handleSaveArticle,
    handleDeleteArticle,
    handleImageUpload,
    lpseInstances
}) => {
    const [isFormOpen, setIsFormOpen] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [isUploading, setIsUploading] = React.useState(false);

    const openCreateForm = () => {
        setEditingArticleId(null);
        setAdminArticleForm({
            title: '',
            slug: '',
            content: '',
            meta_title: '',
            meta_description: '',
            meta_keywords: '',
            is_pinned: 0,
            is_published: 1,
            image_url: '',
            youtube_embed: ''
        });
        setArticleMsg(null);
        setIsFormOpen(true);
    };

    const openEditForm = (art) => {
        setEditingArticleId(art.id);
        setAdminArticleForm({
            title: art.title || '',
            slug: art.slug || '',
            content: art.content || '',
            meta_title: art.meta_title || '',
            meta_description: art.meta_description || '',
            meta_keywords: art.meta_keywords || '',
            is_pinned: art.is_pinned || 0,
            is_published: art.is_published || 0,
            image_url: art.image_url || '',
            youtube_embed: art.youtube_embed || ''
        });
        setArticleMsg(null);
        setIsFormOpen(true);
    };

    const handleTitleChange = (e) => {
        const title = e.target.value;
        const generatedSlug = title.toLowerCase()
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
        setAdminArticleForm(prev => ({
            ...prev,
            title: title,
            slug: prev.slug === '' || prev.slug === prev.title.toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-') ? generatedSlug : prev.slug
        }));
    };

    const onUploadClick = async (e) => {
        setIsUploading(true);
        try {
            await handleImageUpload(e);
        } finally {
            setIsUploading(false);
        }
    };

    const filtered = adminArticles.filter(art =>
        (art.title && art.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (art.content && art.content.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div>
            <div className="header-dash">
                <div className="header-title">
                    <h1>Manajer Artikel &amp; Panduan SEO</h1>
                    <p>Buat, edit, dan kelola konten edukasi serta promosi penargetan geografis dinamis.</p>
                </div>
                {!isFormOpen && (
                    <button className="crawl-btn" onClick={openCreateForm}>
                        <span>➕</span> Buat Artikel Baru
                    </button>
                )}
            </div>

            {articleMsg && (
                <div style={{
                    background: articleMsg.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    color: articleMsg.type === 'success' ? '#34d399' : '#f87171',
                    border: `1px solid ${articleMsg.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                    padding: '12px 16px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    marginBottom: '20px'
                }}>
                    {articleMsg.text}
                </div>
            )}

            {isFormOpen ? (
                <div className="panel" style={{ animation: 'fadeIn 0.2s ease-out' }}>
                    <div className="panel-header">
                        <h3 className="panel-title">{editingArticleId ? '📝 Edit Artikel' : '➕ Buat Artikel Baru'}</h3>
                    </div>
                    <form onSubmit={(e) => { e.preventDefault(); handleSaveArticle(e); setIsFormOpen(false); }} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div className="form-group">
                                <label>Judul Artikel <span style={{ color: '#ef4444' }}>*</span></label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Contoh: Cara Menang Tender Konstruksi di {lpse_name}"
                                    value={adminArticleForm.title}
                                    onChange={handleTitleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Slug URL <span style={{ color: '#ef4444' }}>*</span></label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="contoh-slug-artikel"
                                    value={adminArticleForm.slug}
                                    onChange={(e) => setAdminArticleForm(prev => ({ ...prev, slug: e.target.value }))}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Isi Konten Artikel <span style={{ color: '#ef4444' }}>*</span></label>
                            <textarea
                                className="form-control"
                                rows="12"
                                placeholder="Tulis isi artikel lengkap disini. Anda dapat menggunakan tag placeholder '{lpse_name}' yang akan diganti secara dinamis."
                                value={adminArticleForm.content}
                                onChange={(e) => setAdminArticleForm(prev => ({ ...prev, content: e.target.value }))}
                                required
                                style={{ fontFamily: 'inherit', lineHeight: '1.6', resize: 'vertical' }}
                            />
                        </div>

                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px' }}>
                            <h4 style={{ fontFamily: 'Outfit, sans-serif', color: '#fff', fontSize: '15px', fontWeight: '600', marginBottom: '16px' }}>⚙️ Pengaturan Media &amp; Tampilan</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div className="form-group">
                                    <label>Gambar Cover Utama (Opsional)</label>
                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={onUploadClick}
                                            style={{ display: 'none' }}
                                            id="article-cover-upload"
                                        />
                                        <label htmlFor="article-cover-upload" className="btn-primary" style={{ padding: '8px 16px', fontSize: '13px', cursor: 'pointer', margin: 0 }}>
                                            {isUploading ? 'Mengunggah...' : '📤 Upload Gambar'}
                                        </label>
                                        {adminArticleForm.image_url && (
                                            <button
                                                type="button"
                                                onClick={() => setAdminArticleForm(prev => ({ ...prev, image_url: '' }))}
                                                style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}
                                            >
                                                Hapus
                                            </button>
                                        )}
                                    </div>
                                    {adminArticleForm.image_url && (
                                        <div style={{ marginTop: '10px', borderRadius: '8px', overflow: 'hidden', width: '120px', height: '80px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                            <img src={adminArticleForm.image_url} alt="Cover Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                    )}
                                </div>
                                <div className="form-group">
                                    <label>Embed Link YouTube (Opsional)</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="https://www.youtube.com/watch?v=..."
                                        value={adminArticleForm.youtube_embed}
                                        onChange={(e) => setAdminArticleForm(prev => ({ ...prev, youtube_embed: e.target.value }))}
                                    />
                                </div>
                            </div>
                        </div>

                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px' }}>
                            <h4 style={{ fontFamily: 'Outfit, sans-serif', color: '#fff', fontSize: '15px', fontWeight: '600', marginBottom: '16px' }}>🔍 Optimasi Meta SEO (Opsional)</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                                <div className="form-group">
                                    <label>Meta Title</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Kosongkan untuk menyamakan dengan judul"
                                        value={adminArticleForm.meta_title}
                                        onChange={(e) => setAdminArticleForm(prev => ({ ...prev, meta_title: e.target.value }))}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Meta Description</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Ringkasan singkat untuk hasil pencarian Google"
                                        value={adminArticleForm.meta_description}
                                        onChange={(e) => setAdminArticleForm(prev => ({ ...prev, meta_description: e.target.value }))}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Meta Keywords</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Kata kunci dipisahkan koma"
                                        value={adminArticleForm.meta_keywords}
                                        onChange={(e) => setAdminArticleForm(prev => ({ ...prev, meta_keywords: e.target.value }))}
                                    />
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '20px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#fff' }}>
                                <input
                                    type="checkbox"
                                    checked={adminArticleForm.is_pinned === 1}
                                    onChange={(e) => setAdminArticleForm(prev => ({ ...prev, is_pinned: e.target.checked ? 1 : 0 }))}
                                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                />
                                📌 Pin Artikel ini di Beranda
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#fff' }}>
                                <input
                                    type="checkbox"
                                    checked={adminArticleForm.is_published === 1}
                                    onChange={(e) => setAdminArticleForm(prev => ({ ...prev, is_published: e.target.checked ? 1 : 0 }))}
                                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                />
                                👁️ Publikasikan Langsung
                            </label>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                            <button type="submit" className="btn-primary" style={{ padding: '10px 24px', margin: 0 }}>
                                💾 Simpan Artikel
                            </button>
                            <button type="button" className="form-control" onClick={() => setIsFormOpen(false)} style={{ width: 'auto', padding: '10px 24px', background: 'rgba(255,255,255,0.05)', margin: 0, cursor: 'pointer' }}>
                                Batal
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="panel">
                    <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                        <h3 className="panel-title">Daftar Artikel ({filtered.length})</h3>
                        <input
                            type="text"
                            placeholder="Cari judul..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '8px',
                                padding: '6px 12px',
                                color: '#fff',
                                fontSize: '13px',
                                outline: 'none'
                            }}
                        />
                    </div>
                    {isLoadingArticles ? (
                        <p style={{ textAlign: 'center', color: '#9ca3af', padding: '30px 0' }}>Memuat artikel...</p>
                    ) : filtered.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#6b7280', padding: '30px 0' }}>Belum ada artikel yang dibuat.</p>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#9ca3af' }}>
                                        <th style={{ padding: '12px 8px' }}>Judul</th>
                                        <th style={{ padding: '12px 8px' }}>Slug</th>
                                        <th style={{ padding: '12px 8px', width: '80px', textAlign: 'center' }}>Pinned</th>
                                        <th style={{ padding: '12px 8px', width: '90px', textAlign: 'center' }}>Status</th>
                                        <th style={{ padding: '12px 8px', width: '120px' }}>Tgl Dibuat</th>
                                        <th style={{ padding: '12px 8px', width: '140px', textAlign: 'center' }}>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((art) => (
                                        <tr key={art.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                                            <td style={{ padding: '12px 8px', fontWeight: '600', color: '#fff' }}>{art.title}</td>
                                            <td style={{ padding: '12px 8px', color: '#818cf8' }}>{art.slug}</td>
                                            <td style={{ padding: '12px 8px', textAlign: 'center' }}>{art.is_pinned === 1 ? '📌 Ya' : '—'}</td>
                                            <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                                                <span style={{
                                                    background: art.is_published === 1 ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                                                    color: art.is_published === 1 ? '#34d399' : '#f87171',
                                                    padding: '2px 8px',
                                                    borderRadius: '4px',
                                                    fontSize: '11px',
                                                    fontWeight: 'bold'
                                                }}>
                                                    {art.is_published === 1 ? 'PUBLISHED' : 'DRAFT'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '12px 8px', color: '#9ca3af' }}>{art.created_at ? new Date(art.created_at).toLocaleDateString('id-ID') : '—'}</td>
                                            <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                                                <button onClick={() => openEditForm(art)} style={{ background: 'rgba(99,102,241,0.1)', color: '#a5b4fc', border: 'none', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', marginRight: '6px' }}>Edit</button>
                                                <button onClick={() => handleDeleteArticle(art.id)} style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: 'none', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>Hapus</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};


const CopyButton = ({ text }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button
            onClick={handleCopy}
            title="Salin Nomor Pengadaan"
            style={{
                background: copied ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                border: copied ? '1px solid #22c55e' : '1px solid rgba(255, 255, 255, 0.2)',
                color: copied ? '#4ade80' : '#d1d5db',
                padding: '3px 10px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
            }}
        >
            {copied ? '✓ Tersalin!' : '📋 Salin'}
        </button>
    );
};

const formatSyaratTextToSections = (rawText) => {
    if (!rawText || typeof rawText !== 'string') return [];

    const sectionDefs = [
        { name: "Persyaratan Kualifikasi Administrasi/Legalitas", icon: "📜", label: "Syarat Administrasi & Legalitas" },
        { name: "Persyaratan Kualifikasi Administrasi / Legalitas", icon: "📜", label: "Syarat Administrasi & Legalitas" },
        { name: "Persyaratan Kualifikasi Teknis", icon: "⚡", label: "Syarat Kualifikasi Teknis" },
        { name: "Syarat Kualifikasi Teknis Lain", icon: "🏢", label: "Syarat Teknis Lain & Kinerja" },
        { name: "Persyaratan Kualifikasi Kinerja", icon: "🏆", label: "Persyaratan Kualifikasi Kinerja" },
        { name: "Kemampuan Manajerial", icon: "👥", label: "Kemampuan Manajerial" },
        { name: "Kemampuan Teknis", icon: "🛠️", label: "Kemampuan Teknis" }
    ];

    const sectionNames = sectionDefs.map(s => s.name);
    const pattern = new RegExp(`(${sectionNames.map(s => s.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")).join('|')})`, 'gi');

    const matches = [];
    let match;
    while ((match = pattern.exec(rawText)) !== null) {
        matches.push({ title: match[1], index: match.index });
    }

    const rawSections = [];
    if (matches.length === 0) {
        rawSections.push({ title: "Persyaratan Kualifikasi", icon: "📋", content: rawText });
    } else {
        for (let i = 0; i < matches.length; i++) {
            const start = matches[i].index + matches[i].title.length;
            const end = i < matches.length - 1 ? matches[i + 1].index : rawText.length;
            const content = rawText.substring(start, end).trim();
            const matchedDef = sectionDefs.find(s => s.name.toLowerCase() === matches[i].title.toLowerCase());
            rawSections.push({
                title: matchedDef?.label || matches[i].title,
                icon: matchedDef?.icon || "📋",
                content
            });
        }
    }

    return rawSections.map(sec => {
        let content = sec.content;
        
        // Add newlines before isolated bullet points a) b) c) d) 1) 2)
        content = content.replace(/(\s+|^)([a-h1-9]\))\s+/gi, '\n$2 ');
        
        // Add newlines before major sentence starters
        content = content.replace(/(\s+|^)(Memenuhi|Jenis Izin|Mempunyai|Secara hukum|Menyetujui|Memiliki|Tabel Data|Nilai kinerja)/gi, '\n$2');

        let lines = content.split('\n').map(l => l.trim()).filter(Boolean);
        let items = [];

        lines.forEach(line => {
            if (line.length > 250 && line.includes('; ')) {
                const subParts = line.split('; ').map(s => s.trim()).filter(Boolean);
                items.push(...subParts);
            } else {
                items.push(line);
            }
        });

        return {
            title: sec.title,
            icon: sec.icon,
            items
        };
    });
};

const PublicTenderDetailPage = ({ adminSettings, tender, isLoading, error, onNavigate, userToken }) => {
    const appName = adminSettings?.app_name || "Spy SPSE";
    const appLogo = adminSettings?.app_logo || "🕵🏼‍♂️";
    const [showBidders, setShowBidders] = useState(false);

    // Parse schedule JSON if present
    let scheduleList = [];
    if (tender?.jadwal) {
        try {
            scheduleList = typeof tender.jadwal === 'string' ? JSON.parse(tender.jadwal) : tender.jadwal;
        } catch (e) {
            console.error("Failed to parse schedule JSON", e);
        }
    }

    const formattedSections = tender?.syarat_kualifikasi ? formatSyaratTextToSections(tender.syarat_kualifikasi) : [];

    return (
        <div style={{
            minHeight: '100vh',
            background: '#070a13',
            color: '#f3f4f6',
            fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
        }}>
            {/* Header Navbar */}
            <header style={{
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                background: 'rgba(15, 23, 42, 0.85)',
                backdropFilter: 'blur(12px)',
                position: 'sticky',
                top: 0,
                zIndex: 50,
                padding: '16px 24px'
            }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => onNavigate('home')}>
                        <span style={{ fontSize: '24px' }}>{appLogo}</span>
                        <span style={{ fontSize: '18px', fontWeight: '800', background: 'linear-gradient(135deg, #fff, #93c5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            {appName}
                        </span>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            onClick={() => onNavigate('tenders')}
                            style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: '#d1d5db', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}
                        >
                            🔍 Cari Tender Lain
                        </button>
                        {!userToken ? (
                            <button
                                onClick={() => onNavigate('auth')}
                                style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', border: 'none', color: '#fff', padding: '8px 18px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}
                            >
                                Masuk / Daftar
                            </button>
                        ) : (
                            <button
                                onClick={() => onNavigate('dashboard')}
                                style={{ background: 'rgba(99, 102, 241, 0.2)', border: '1px solid rgba(99, 102, 241, 0.4)', color: '#a5b4fc', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}
                            >
                                📊 Dashboard
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main style={{ maxWidth: '1050px', margin: '32px auto', padding: '0 24px 60px 24px' }}>
                {isLoading ? (
                    <div style={{ textAlign: 'center', padding: '80px 20px' }}>
                        <div className="spinner" style={{ margin: '0 auto 16px auto' }}></div>
                        <p style={{ color: '#9ca3af' }}>Memuat informasi detail pengadaan...</p>
                    </div>
                ) : error || !tender ? (
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '40px 24px', borderRadius: '16px', textAlign: 'center', color: '#fca5a5' }}>
                        <h3>⚠️ {error || "Tender tidak ditemukan"}</h3>
                        <p style={{ fontSize: '14px', color: '#9ca3af', marginTop: '8px' }}>Nomor pengadaan mungkin salah atau belum masuk ke dalam database.</p>
                        <button onClick={() => onNavigate('tenders')} className="btn-primary" style={{ marginTop: '20px' }}>
                            Kembali ke Pencarian Tender
                        </button>
                    </div>
                ) : (
                    <div>
                        {/* Header Hero Card */}
                        <div style={{
                            background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.9))',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '20px',
                            padding: '32px',
                            marginBottom: '28px',
                            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
                        }}>
                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '16px' }}>
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '4px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: '600' }}>
                                    <span>Kode / Nomor: <strong>{tender.nomor_pengadaan}</strong></span>
                                    <CopyButton text={tender.nomor_pengadaan} />
                                </div>
                                <span style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#4ade80', border: '1px solid rgba(34, 197, 94, 0.3)', padding: '4px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>
                                    {tender.kategori || 'NASIONAL'}
                                </span>
                                <span style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '4px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '700' }}>
                                    {tender.tipe || 'Tender'}
                                </span>
                            </div>

                            <h1 style={{ fontSize: '24px', color: '#ffffff', lineHeight: '1.45', margin: '0 0 24px 0', fontWeight: '800', letterSpacing: '-0.01em' }}>
                                {tender.nama_tender}
                            </h1>

                            {/* Metric Widgets Container: Row 1 Full Width Instansi & Satker, Row 2 3-Column Metrics */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '24px' }}>
                                {/* Row 1: INSTANSI & SATKER (Full Width 1 Column) */}
                                <div style={{
                                    background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.85), rgba(30, 41, 59, 0.6))',
                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                    padding: '20px 24px',
                                    borderRadius: '16px',
                                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
                                }}>
                                    <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                                        <span>🏛️</span> INSTANSI & SATKER
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                                        <div style={{ fontSize: '15px', fontWeight: '700', color: '#ffffff', lineHeight: '1.4', flex: 1, minWidth: '260px' }}>
                                            {tender.instansi || '-'}
                                        </div>
                                        {tender.satuan_kerja && (
                                            <div style={{
                                                fontSize: '12.5px',
                                                color: '#a5b4fc',
                                                background: 'rgba(99, 102, 241, 0.14)',
                                                border: '1px solid rgba(99, 102, 241, 0.3)',
                                                padding: '8px 14px',
                                                borderRadius: '10px',
                                                fontWeight: '600',
                                                lineHeight: '1.4'
                                            }}>
                                                🏢 Satker: {tender.satuan_kerja}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Row 2: 3 Columns for PAGU, TAHAP, LOKASI */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', alignItems: 'stretch' }}>
                                    {/* Widget 2: Nilai Pagu Paket */}
                                    <div style={{
                                        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.85), rgba(245, 158, 11, 0.08))',
                                        border: '1px solid rgba(245, 158, 11, 0.25)',
                                        padding: '18px 20px',
                                        borderRadius: '16px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between'
                                    }}>
                                        <div>
                                            <div style={{ fontSize: '11px', color: '#fbbf24', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <span>💰</span> NILAI PAGU PAKET
                                            </div>
                                            <div style={{ fontSize: '22px', fontWeight: '800', color: '#fef08a', marginTop: '10px', letterSpacing: '-0.02em' }}>
                                                {tender.pagu || '-'}
                                            </div>
                                        </div>
                                        <div style={{ fontSize: '11px', color: '#d97706', marginTop: '10px', fontWeight: '600' }}>
                                            APBN / APBD Terverifikasi
                                        </div>
                                    </div>

                                    {/* Widget 3: Tahap Saat Ini */}
                                    <div style={{
                                        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.85), rgba(99, 102, 241, 0.08))',
                                        border: '1px solid rgba(99, 102, 241, 0.25)',
                                        padding: '18px 20px',
                                        borderRadius: '16px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between'
                                    }}>
                                        <div>
                                            <div style={{ fontSize: '11px', color: '#818cf8', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <span>⚡</span> TAHAP SAAT INI
                                            </div>
                                            <div style={{
                                                fontSize: '13.5px',
                                                fontWeight: '700',
                                                color: '#a5b4fc',
                                                marginTop: '10px',
                                                lineHeight: '1.4',
                                                background: 'rgba(99, 102, 241, 0.15)',
                                                border: '1px solid rgba(99, 102, 241, 0.3)',
                                                padding: '8px 12px',
                                                borderRadius: '10px',
                                                display: 'inline-block'
                                            }}>
                                                {tender.tahap || '-'}
                                            </div>
                                        </div>
                                        <div style={{ fontSize: '11px', color: '#818cf8', marginTop: '10px', fontWeight: '600' }}>
                                            🟢 Status Aktif Real-time
                                        </div>
                                    </div>

                                    {/* Widget 4: Lokasi Pekerjaan */}
                                    <div style={{
                                        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.85), rgba(30, 41, 59, 0.5))',
                                        border: '1px solid rgba(255, 255, 255, 0.08)',
                                        padding: '18px 20px',
                                        borderRadius: '16px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between'
                                    }}>
                                        <div>
                                            <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <span>📍</span> LOKASI PEKERJAAN
                                            </div>
                                            <div style={{ fontSize: '14px', fontWeight: '600', color: '#e5e7eb', marginTop: '10px', lineHeight: '1.4' }}>
                                                {tender.lokasi_pekerjaan || '-'}
                                            </div>
                                        </div>
                                        <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '10px', fontWeight: '600' }}>
                                            Wilayah Administrasi SPSE
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Prominent Direct SPSE Announcement Banner (Placed BEFORE Syarat Kualifikasi) */}
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.18), rgba(79, 70, 229, 0.28))',
                            border: '1px solid rgba(99, 102, 241, 0.45)',
                            borderRadius: '20px',
                            padding: '28px 32px',
                            marginBottom: '28px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.35)',
                            backdropFilter: 'blur(10px)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(99, 102, 241, 0.25)', color: '#c7d2fe', padding: '4px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', marginBottom: '12px' }}>
                                <span>🔒 Tautan Keamanan Terverifikasi SPSE</span>
                            </div>
                            <h3 style={{ margin: '0 0 8px 0', color: '#ffffff', fontSize: '20px', fontWeight: '800', letterSpacing: '-0.01em' }}>
                                Ingin Membuka Pengumuman Lelang Resmi di Portal SPSE?
                            </h3>
                            <p style={{ color: '#c7d2fe', fontSize: '13.5px', maxWidth: '680px', margin: '0 0 20px 0', lineHeight: '1.55' }}>
                                Klik tombol di bawah ini untuk membuka langsung halaman pengumuman lelang resmi di portal SPSE dengan verifikasi otomatis (tanpa error <em>Akses Ditolak</em>).
                            </p>
                            <a
                                href={`https://spse.inaproc.id/${tender.kategori || 'nasional'}/lelang/${tender.nomor_pengadaan}/pengumumanlelang`}
                                target="_blank"
                                rel="noopener"
                                referrerPolicy="unsafe-url"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                                    color: '#ffffff',
                                    padding: '14px 32px',
                                    borderRadius: '12px',
                                    fontWeight: '700',
                                    fontSize: '15px',
                                    textDecoration: 'none',
                                    boxShadow: '0 8px 24px rgba(99, 102, 241, 0.5)',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                🔗 Buka Halaman Pengumuman Resmi (Portal SPSE)
                            </a>
                        </div>

                        {/* Structured Syarat Kualifikasi Cards */}
                        {formattedSections.length > 0 && (
                            <div style={{ marginBottom: '28px' }}>
                                <h2 style={{ fontSize: '18px', color: '#fff', margin: '0 0 16px 0', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span>📋 Syarat Kualifikasi & Ketentuan Paket</span>
                                </h2>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    {formattedSections.map((sec, idx) => (
                                        <div key={idx} style={{
                                            background: 'rgba(30, 41, 59, 0.5)',
                                            border: '1px solid rgba(255, 255, 255, 0.08)',
                                            borderRadius: '16px',
                                            padding: '24px',
                                            backdropFilter: 'blur(8px)'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px' }}>
                                                <span style={{ fontSize: '20px' }}>{sec.icon}</span>
                                                <h3 style={{ fontSize: '15px', color: '#93c5fd', margin: 0, fontWeight: '700' }}>
                                                    {sec.title}
                                                </h3>
                                            </div>

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                {sec.items.map((item, itemIdx) => (
                                                    <div key={itemIdx} style={{
                                                        display: 'flex',
                                                        alignItems: 'flex-start',
                                                        gap: '12px',
                                                        background: 'rgba(15, 23, 42, 0.5)',
                                                        border: '1px solid rgba(255, 255, 255, 0.04)',
                                                        padding: '14px 16px',
                                                        borderRadius: '10px',
                                                        fontSize: '13.5px',
                                                        lineHeight: '1.6',
                                                        color: '#e5e7eb'
                                                    }}>
                                                        <span style={{
                                                            background: 'rgba(34, 197, 94, 0.15)',
                                                            color: '#4ade80',
                                                            borderRadius: '50%',
                                                            width: '22px',
                                                            height: '22px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: '12px',
                                                            fontWeight: '800',
                                                            flexShrink: 0,
                                                            marginTop: '2px'
                                                        }}>
                                                            ✓
                                                        </span>
                                                        <div style={{ flex: 1 }}>{item}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Uraian Singkat Pekerjaan / Attachment Card */}
                        {tender.uraian_singkat_pekerjaan && (
                            <div style={{
                                background: 'rgba(30, 41, 59, 0.5)',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                borderRadius: '16px',
                                padding: '24px',
                                marginBottom: '28px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                                    <span style={{ fontSize: '20px' }}>📄</span>
                                    <h3 style={{ fontSize: '15px', color: '#93c5fd', margin: 0, fontWeight: '700' }}>
                                        Uraian Singkat Pekerjaan / Lampiran
                                    </h3>
                                </div>
                                <div style={{
                                    fontSize: '13.5px',
                                    color: '#d1d5db',
                                    lineHeight: '1.7',
                                    background: 'rgba(15, 23, 42, 0.6)',
                                    padding: '16px 20px',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(255, 255, 255, 0.04)'
                                }}>
                                    {tender.uraian_singkat_pekerjaan.endsWith('.pdf') || tender.uraian_singkat_pekerjaan.endsWith('.doc') || tender.uraian_singkat_pekerjaan.endsWith('.docx') ? (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <span style={{ fontSize: '28px' }}>📎</span>
                                            <div>
                                                <div style={{ fontWeight: '700', color: '#fff' }}>Dokumen Lampiran Pengadaan:</div>
                                                <div style={{ color: '#818cf8', fontSize: '13px', marginTop: '2px' }}>{tender.uraian_singkat_pekerjaan}</div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div style={{ whiteSpace: 'pre-wrap' }}>{tender.uraian_singkat_pekerjaan}</div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Schedule Table (Jadwal Pengadaan) */}
                        {scheduleList && scheduleList.length > 0 && (
                            <div style={{
                                background: 'rgba(30, 41, 59, 0.5)',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                borderRadius: '16px',
                                padding: '24px',
                                marginBottom: '28px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                                    <span style={{ fontSize: '20px' }}>📅</span>
                                    <h3 style={{ fontSize: '15px', color: '#93c5fd', margin: 0, fontWeight: '700' }}>
                                        Jadwal Tahapan Pengadaan
                                    </h3>
                                </div>

                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                                        <thead>
                                            <tr style={{ background: 'rgba(15, 23, 42, 0.8)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#9ca3af' }}>
                                                <th style={{ padding: '10px 14px', width: '40px' }}>No</th>
                                                <th style={{ padding: '10px 14px' }}>Tahap Pengadaan</th>
                                                <th style={{ padding: '10px 14px' }}>Mulai</th>
                                                <th style={{ padding: '10px 14px' }}>Sampai</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {scheduleList.map((item, sIdx) => {
                                                const isActive = tender.tahap && item.tahap && (
                                                    tender.tahap.toLowerCase().includes(item.tahap.toLowerCase()) ||
                                                    item.tahap.toLowerCase().includes(tender.tahap.toLowerCase())
                                                );
                                                return (
                                                    <tr key={sIdx} style={{
                                                        borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                                                        background: isActive ? 'rgba(99, 102, 241, 0.15)' : (sIdx % 2 === 0 ? 'rgba(15, 23, 42, 0.3)' : 'transparent')
                                                    }}>
                                                        <td style={{ padding: '12px 14px', color: '#9ca3af', fontWeight: '600' }}>{item.no || sIdx + 1}</td>
                                                        <td style={{ padding: '12px 14px', fontWeight: isActive ? '700' : '500', color: isActive ? '#818cf8' : '#e5e7eb' }}>
                                                            {item.tahap}
                                                            {isActive && (
                                                                <span style={{ marginLeft: '8px', background: 'rgba(34, 197, 94, 0.2)', color: '#4ade80', fontSize: '10px', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(34, 197, 94, 0.4)' }}>
                                                                    🟢 Tahap Aktif
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td style={{ padding: '12px 14px', color: '#9ca3af' }}>{item.mulai || '-'}</td>
                                                        <td style={{ padding: '12px 14px', color: '#9ca3af' }}>{item.sampai || '-'}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Winner Card (If present) */}
                        {tender.pemenang && (
                            <div style={{
                                background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(16, 185, 129, 0.15))',
                                border: '1px solid rgba(34, 197, 94, 0.3)',
                                borderRadius: '16px',
                                padding: '24px',
                                marginBottom: '28px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                                    <span style={{ fontSize: '24px' }}>🏆</span>
                                    <h3 style={{ fontSize: '16px', color: '#4ade80', margin: 0, fontWeight: '700' }}>
                                        Pemenang Pengadaan
                                    </h3>
                                </div>
                                <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px 20px', borderRadius: '12px', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                                    <div style={{ fontSize: '16px', fontWeight: '800', color: '#ffffff' }}>
                                        {tender.pemenang.nama_pemenang}
                                    </div>
                                    {tender.pemenang.harga_kontrak && (
                                        <div style={{ fontSize: '15px', color: '#4ade80', fontWeight: '700', marginTop: '4px' }}>
                                            Nilai Kontrak: {tender.pemenang.harga_kontrak}
                                        </div>
                                    )}
                                    {tender.pemenang.npwp && (
                                        <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                                            NPWP: {tender.pemenang.npwp}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

const PublicTendersPage = ({ onGoHome, adminSettings, onNavigate, lpseInstances = [] }) => {

    const [tenders, setTenders] = useState([]);
    const [totalTenders, setTotalTenders] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterKategori, setFilterKategori] = useState('');
    const [offset, setOffset] = useState(0);
    const limit = 12;

    const fetchPublicTenders = async () => {
        setIsLoading(true);
        try {
            const url = new URL('/api/tenders', window.location.origin);
            if (searchQuery) url.searchParams.append('q', searchQuery);
            if (filterKategori) url.searchParams.append('kategori', filterKategori);
            url.searchParams.append('limit', limit);
            url.searchParams.append('offset', offset);
            url.searchParams.append('aktif_only', 'true');

            const res = await fetch(url.toString());
            if (res.ok) {
                const data = await res.json();
                setTenders(data.data || []);
                setTotalTenders(data.total || 0);
            }
        } catch (err) {
            console.error('Failed to fetch public tenders:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchPublicTenders();
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery, filterKategori, offset]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setOffset(0);
    };

    const handleFilterChange = (e) => {
        setFilterKategori(e.target.value);
        setOffset(0);
    };

    const timeAgo = (dateString) => {
        if (!dateString) return 'Baru saja';
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + ' tahun yang lalu';
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + ' bulan yang lalu';
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + ' hari yang lalu';
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + ' jam yang lalu';
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + ' menit yang lalu';
        return 'Baru saja';
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: '#070a13',
            color: '#fff',
            fontFamily: "'Inter', sans-serif",
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Header */}
            <PublicHeader adminSettings={adminSettings} onNavigate={onNavigate} activePage="tenders" />

            {/* Main Content */}
            <div style={{ flexGrow: 1, padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
                <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '32px', marginBottom: '8px' }}>Explorer Tender Publik</h2>
                <p style={{ color: '#9ca3af', marginBottom: '30px' }}>Temukan peluang proyek terbaru dari berbagai instansi di seluruh Indonesia.</p>

                {/* Filters */}
                <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
                    <input
                        type="text"
                        placeholder="Cari kata kunci tender..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff', flex: '1 1 240px', minWidth: '0' }}
                    />
                    <select
                        value={filterKategori}
                        onChange={handleFilterChange}
                        className="form-control"
                        style={{ padding: '12px 16px', borderRadius: '8px', flex: '1 1 200px', minWidth: '0' }}
                    >
                        <option style={{ background: '#0f1322', color: '#fff' }} value="">-- Semua Kategori --</option>
                        {lpseInstances.map((inst, idx) => (
                            <option key={idx} style={{ background: '#0f1322', color: '#fff' }} value={inst.slug}>{inst.name}</option>
                        ))}
                    </select>
                </div>

                {/* Grid View */}
                {isLoading ? (
                    <div style={{ textAlign: 'center', padding: '60px', color: '#9ca3af' }}>Memuat data tender...</div>
                ) : tenders.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
                        <h3 style={{ fontSize: '18px', color: '#fff', marginBottom: '8px' }}>Tender tidak ditemukan</h3>
                        <p style={{ color: '#9ca3af' }}>Coba ubah kata kunci atau filter pencarian Anda.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                        {tenders.map(t => (
                            <div key={t.id} style={{ background: '#0f1322', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', padding: '24px', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                    <span style={{ fontSize: '12px', background: 'rgba(99, 102, 241, 0.1)', color: '#818cf8', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>{t.kategori.toUpperCase()}</span>
                                    <span style={{ fontSize: '12px', color: '#6b7280' }}>ID: {t.nomor_pengadaan}</span>
                                </div>
                                <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px', lineHeight: '1.4', flexGrow: 1 }}>
                                    {renderTenderTitle(t.nama_tender)}
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#9ca3af', marginBottom: '20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>🏢 {t.instansi}</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>📌 Tahap: <span style={getTahapStyle(t.tahap)}>{t.tahap || 'Tidak dirincikan'}</span></div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>📅 Mulai: <span style={{ color: '#10b981', fontWeight: '500' }}>{t.tanggal_mulai_tender || 'Tidak dirincikan'}</span></div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>⏳ Akhir: <span style={{ color: '#ef4444', fontWeight: '500' }}>{t.akhir_penawaran || 'Tidak dirincikan'}</span></div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#6b7280' }}>⏱️ Sinkron: {timeAgo(t.scraped_at)}</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fbbf24', fontWeight: 'bold', fontSize: '15px', marginTop: '4px' }}>💰 Pagu: {t.pagu || 'Tidak dirincikan'}</div>
                                </div>
                                <a
                                    href={`https://spse.inaproc.id/${t.kategori}/lelang/${t.nomor_pengadaan}/pengumumanlelang`}
                                    target="_blank"
                                    rel="noopener"
                                    referrerPolicy="unsafe-url"
                                    className="btn-primary"
                                    style={{ textDecoration: 'none', textAlign: 'center', display: 'block' }}
                                >
                                    🔗 Buka Halaman Pengumuman Resmi
                                </a>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {!isLoading && tenders.length > 0 && (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: '40px',
                        padding: '24px 0 10px',
                        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                        flexWrap: 'wrap',
                        gap: '16px'
                    }}>
                        <div style={{
                            fontSize: '14px',
                            color: '#9ca3af',
                            fontWeight: '500'
                        }}>
                            Menampilkan <strong style={{ color: '#fff' }}>{offset + 1}-{Math.min(offset + limit, totalTenders)}</strong> dari <strong style={{ color: '#fff' }}>{totalTenders}</strong> total data
                        </div>
                        <div style={{ display: 'flex', gap: '12px', flexShrink: 0 }}>
                            <button
                                disabled={offset === 0}
                                onClick={() => setOffset(Math.max(0, offset - limit))}
                                style={{
                                    background: offset === 0 ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.06)',
                                    border: '1px solid rgba(255, 255, 255, 0.12)',
                                    color: offset === 0 ? '#4b5563' : '#ffffff',
                                    padding: '10px 20px',
                                    borderRadius: '10px',
                                    cursor: offset === 0 ? 'not-allowed' : 'pointer',
                                    fontWeight: '600',
                                    fontSize: '14px',
                                    whiteSpace: 'nowrap',
                                    transition: 'all 0.2s'
                                }}
                            >
                                ← Sebelumnya
                            </button>
                            <button
                                disabled={offset + limit >= totalTenders}
                                onClick={() => setOffset(offset + limit)}
                                style={{
                                    background: offset + limit >= totalTenders ? 'rgba(255, 255, 255, 0.02)' : 'rgba(99, 102, 241, 0.2)',
                                    border: offset + limit >= totalTenders ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(99, 102, 241, 0.4)',
                                    color: offset + limit >= totalTenders ? '#4b5563' : '#a5b4fc',
                                    padding: '10px 20px',
                                    borderRadius: '10px',
                                    cursor: offset + limit >= totalTenders ? 'not-allowed' : 'pointer',
                                    fontWeight: '600',
                                    fontSize: '14px',
                                    whiteSpace: 'nowrap',
                                    transition: 'all 0.2s'
                                }}
                            >
                                Selanjutnya →
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <PremiumFooter adminSettings={adminSettings} onNavigate={onNavigate} />
            <Chatbot adminSettings={adminSettings} />
        </div>
    );
};

const LandingPage = ({ onGetStarted, onGoTenders, adminSettings, landingPage, setLandingPage, onNavigate }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const [stats, setStats] = React.useState({ tenders: 0, pagu: 0, instansi: 0, penyedia: 0 });
    const [isLoadingStats, setIsLoadingStats] = React.useState(true);
    const [latestTenders, setLatestTenders] = React.useState([]);
    const [isLoadingTenders, setIsLoadingTenders] = React.useState(true);
    const [latestWinners, setLatestWinners] = React.useState([]);
    const [isLoadingWinners, setIsLoadingWinners] = React.useState(true);
    const [openFaqId, setOpenFaqId] = React.useState(null);
    const [contactForm, setContactForm] = React.useState({ name: '', email: '', phone: '', message: '' });
    const [contactSent, setContactSent] = React.useState(false);

    const [latestArticles, setLatestArticles] = React.useState([]);
    const [isLoadingArticles, setIsLoadingArticles] = React.useState(false);

    React.useEffect(() => {
        setIsLoadingArticles(true);
        fetch('/api/public/articles?limit=3')
            .then(res => res.json())
            .then(data => {
                setLatestArticles(data);
                setIsLoadingArticles(false);
            })
            .catch(err => {
                console.error(err);
                setIsLoadingArticles(false);
            });
    }, []);

    const getYearlySavingsPercent = () => {
        const monthly = parseInt(adminSettings?.premium_price) || 150000;
        const yearly = parseInt(adminSettings?.premium_price_yearly) || 1500000;
        if (!monthly || monthly <= 0) return 0;
        const savings = ((monthly * 12 - yearly) / (monthly * 12)) * 100;
        return Math.max(0, Math.round(savings));
    };

    React.useEffect(() => {
        fetch('/api/analytics')
            .then(res => res.json())
            .then(data => {
                setStats({
                    tenders: data.total_tenders || 0,
                    pagu: data.total_pagu || 0,
                    instansi: data.total_instansi || 0,
                    penyedia: data.total_penyedia || 0
                });
                setIsLoadingStats(false);
            })
            .catch(err => {
                console.error(err);
                setIsLoadingStats(false);
            });

        fetch('/api/tenders?limit=6&aktif_only=true')
            .then(res => res.json())
            .then(data => {
                setLatestTenders(data.data || []);
                setIsLoadingTenders(false);
            })
            .catch(err => {
                console.error(err);
                setIsLoadingTenders(false);
            });

        fetch('/api/public/latest-winners')
            .then(res => res.json())
            .then(data => {
                setLatestWinners(data || []);
                setIsLoadingWinners(false);
            })
            .catch(err => {
                console.error(err);
                setIsLoadingWinners(false);
            });
    }, []);

    const formatStatsPagu = (val) => {
        if (!val) return '0';
        if (val >= 1_000_000_000_000) return `Rp ${(val / 1_000_000_000_000).toFixed(1).replace('.', ',')} T`;
        if (val >= 1_000_000_000) return `Rp ${(val / 1_000_000_000).toFixed(1).replace('.', ',')} M`;
        if (val >= 1_000_000) return `Rp ${(val / 1_000_000).toFixed(1).replace('.', ',')} Jt`;
        return `Rp ${val.toLocaleString('id-ID')}`;
    };

    const timeAgo = (dateString) => {
        if (!dateString) return 'Baru saja';
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + ' tahun yang lalu';
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + ' bulan yang lalu';
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + ' hari yang lalu';
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + ' jam yang lalu';
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + ' menit yang lalu';
        return 'Baru saja';
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: '#070a13',
            color: '#fff',
            fontFamily: "'Inter', sans-serif",
            overflowX: 'hidden'
        }}>
            {/* Header */}
            <div className="landing-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '24px' }}>{adminSettings.app_logo || '🕵🏼‍♂️'}</span>
                    <span
                        style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 'bold', fontSize: '20px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', cursor: 'pointer' }}
                        onClick={() => { setIsMobileMenuOpen(false); onNavigate('landing', 'home'); }}
                    >
                        {adminSettings.app_name || 'Spy SPSE'}
                    </span>
                </div>

                {/* Desktop Navigation */}
                <div className="landing-nav-desktop">
                    <button
                        onClick={() => onNavigate('landing', 'home')}
                        style={{ background: 'transparent', color: landingPage === 'home' ? '#a5b4fc' : '#9ca3af', border: 'none', padding: '8px 16px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'color 0.2s' }}
                    >
                        Beranda
                    </button>
                    <button
                        onClick={onGoTenders}
                        style={{ background: 'transparent', color: '#9ca3af', border: 'none', padding: '8px 16px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'color 0.2s' }}
                    >
                        Tender
                    </button>
                    <button
                        onClick={() => { window.location.hash = '#/blog'; onNavigate('blog'); }}
                        style={{ background: 'transparent', color: '#9ca3af', border: 'none', padding: '8px 16px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'color 0.2s' }}
                    >
                        Artikel
                    </button>
                    <button
                        onClick={() => onNavigate('landing', 'contact')}
                        style={{ background: 'transparent', color: landingPage === 'contact' ? '#a5b4fc' : '#9ca3af', border: 'none', padding: '8px 16px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'color 0.2s' }}
                    >
                        Kontak
                    </button>
                    <button
                        onClick={() => onNavigate('landing', 'home', 'landing-pricing')}
                        style={{ background: 'transparent', color: '#9ca3af', border: 'none', padding: '8px 16px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'color 0.2s' }}
                    >
                        Harga
                    </button>
                    <button
                        onClick={onGetStarted}
                        style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: '#fff', border: 'none', padding: '8px 20px', fontSize: '14px', fontWeight: '600', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(99,102,241,0.35)' }}
                    >
                        Masuk / Daftar
                    </button>
                </div>

                {/* Mobile Menu Toggle Button */}
                <button
                    className="mobile-menu-btn"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle Mobile Menu"
                >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        {isMobileMenuOpen ? (
                            <path d="M18 6L6 18M6 6l12 12" />
                        ) : (
                            <path d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile Dropdown Navigation Drawer */}
            {isMobileMenuOpen && (
                <div className="mobile-nav-drawer">
                    <button
                        onClick={() => { setIsMobileMenuOpen(false); onNavigate('landing', 'home'); }}
                        style={{ background: 'transparent', color: landingPage === 'home' ? '#a5b4fc' : '#d1d5db', border: 'none', padding: '12px 16px', fontSize: '15px', fontWeight: '600', textAlign: 'left', borderRadius: '8px' }}
                    >
                        🏠 Beranda
                    </button>
                    <button
                        onClick={() => { setIsMobileMenuOpen(false); onGoTenders(); }}
                        style={{ background: 'transparent', color: '#d1d5db', border: 'none', padding: '12px 16px', fontSize: '15px', fontWeight: '600', textAlign: 'left', borderRadius: '8px' }}
                    >
                        🔍 Tender
                    </button>
                    <button
                        onClick={() => { setIsMobileMenuOpen(false); window.location.hash = '#/blog'; onNavigate('blog'); }}
                        style={{ background: 'transparent', color: '#d1d5db', border: 'none', padding: '12px 16px', fontSize: '15px', fontWeight: '600', textAlign: 'left', borderRadius: '8px' }}
                    >
                        📰 Artikel
                    </button>
                    <button
                        onClick={() => { setIsMobileMenuOpen(false); onNavigate('landing', 'contact'); }}
                        style={{ background: 'transparent', color: landingPage === 'contact' ? '#a5b4fc' : '#d1d5db', border: 'none', padding: '12px 16px', fontSize: '15px', fontWeight: '600', textAlign: 'left', borderRadius: '8px' }}
                    >
                        📬 Kontak
                    </button>
                    <button
                        onClick={() => { setIsMobileMenuOpen(false); onNavigate('landing', 'home', 'landing-pricing'); }}
                        style={{ background: 'transparent', color: '#d1d5db', border: 'none', padding: '12px 16px', fontSize: '15px', fontWeight: '600', textAlign: 'left', borderRadius: '8px' }}
                    >
                        💎 Harga
                    </button>
                    <button
                        onClick={() => { setIsMobileMenuOpen(false); onGetStarted(); }}
                        style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: '#fff', border: 'none', padding: '14px 20px', fontSize: '15px', fontWeight: '700', borderRadius: '10px', marginTop: '8px', cursor: 'pointer', textAlign: 'center' }}
                    >
                        🚀 Masuk / Daftar
                    </button>
                </div>
            )}

            {/* ===== CONTACT PAGE ===== */}
            {landingPage === 'contact' && (
                <div style={{ minHeight: '80vh', padding: '60px 20px', maxWidth: '1000px', margin: '0 auto' }}>
                    {/* Contact Page Header */}
                    <div style={{ textAlign: 'center', marginBottom: '56px' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '20px', padding: '6px 16px', marginBottom: '20px', fontSize: '13px', color: '#818cf8', fontWeight: '600' }}>
                            📬 Hubungi Kami
                        </div>
                        <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: '800', background: 'linear-gradient(135deg, #e0e7ff, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '16px' }}>
                            Siap Membantu Anda
                        </h1>
                        <p style={{ color: '#9ca3af', fontSize: '16px', maxWidth: '520px', margin: '0 auto', lineHeight: '1.7' }}>
                            Tim kami siap menjawab pertanyaan, membantu onboarding, atau mendiskusikan kebutuhan khusus perusahaan Anda.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', alignItems: 'start' }}>
                        {/* Left: Contact Info Cards + Maps */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {/* WhatsApp Card */}
                            {adminSettings.contact_whatsapp && (
                                <a
                                    href={`https://wa.me/${String(adminSettings.contact_whatsapp || '').replace(/\D/g, '')}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{ textDecoration: 'none' }}
                                >
                                    <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', transition: 'all 0.2s', cursor: 'pointer' }}
                                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(16,185,129,0.12)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(16,185,129,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                                    >
                                        <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', flexShrink: 0 }}>💬</div>
                                        <div>
                                            <div style={{ fontSize: '12px', color: '#10b981', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>WhatsApp</div>
                                            <div style={{ fontSize: '18px', fontWeight: '700', color: '#d1fae5' }}>{adminSettings.contact_whatsapp}</div>
                                            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>Klik untuk chat langsung →</div>
                                        </div>
                                    </div>
                                </a>
                            )}
                            {!adminSettings.contact_whatsapp && (
                                <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', flexShrink: 0 }}>💬</div>
                                    <div>
                                        <div style={{ fontSize: '12px', color: '#10b981', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>WhatsApp</div>
                                        <div style={{ fontSize: '14px', color: '#6b7280' }}>Hubungi melalui login akun Anda</div>
                                    </div>
                                </div>
                            )}

                            {/* Email Card */}
                            {adminSettings.contact_email && (
                                <a href={`mailto:${adminSettings.contact_email}`} style={{ textDecoration: 'none' }}>
                                    <div style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', transition: 'all 0.2s', cursor: 'pointer' }}
                                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(99,102,241,0.12)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(99,102,241,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                                    >
                                        <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', flexShrink: 0 }}>📧</div>
                                        <div>
                                            <div style={{ fontSize: '12px', color: '#818cf8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Email</div>
                                            <div style={{ fontSize: '18px', fontWeight: '700', color: '#e0e7ff' }}>{adminSettings.contact_email}</div>
                                            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>Klik untuk kirim email →</div>
                                        </div>
                                    </div>
                                </a>
                            )}
                            {!adminSettings.contact_email && (
                                <div style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', flexShrink: 0 }}>📧</div>
                                    <div>
                                        <div style={{ fontSize: '12px', color: '#818cf8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Email</div>
                                        <div style={{ fontSize: '14px', color: '#6b7280' }}>Belum dikonfigurasi oleh admin</div>
                                    </div>
                                </div>
                            )}

                            {/* Response time badge */}
                            <div style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: '14px', padding: '18px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span style={{ fontSize: '22px' }}>⚡</span>
                                <div>
                                    <div style={{ fontSize: '13px', color: '#fbbf24', fontWeight: '600' }}>Waktu Respons</div>
                                    <div style={{ fontSize: '13px', color: '#9ca3af' }}>Biasanya merespons dalam 1–3 jam di hari kerja</div>
                                </div>
                            </div>

                            {/* Google Maps Embed */}
                            {adminSettings.contact_maps_embed && (
                                <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
                                    <div style={{ fontSize: '12px', color: '#6b7280', padding: '10px 16px', background: 'rgba(255,255,255,0.03)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        📍 Lokasi Kami
                                    </div>
                                    <iframe
                                        src={adminSettings.contact_maps_embed?.match(/src=["']([^"']+)["']/i)?.[1] || adminSettings.contact_maps_embed}
                                        width="100%"
                                        height="220"
                                        style={{ border: 0, display: 'block' }}
                                        allowFullScreen=""
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title="Lokasi Kantor"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Right: Contact Form */}
                        <div style={{ background: '#0f1322', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.06)', padding: '36px', boxShadow: '0 12px 40px rgba(0,0,0,0.3)' }}>
                            <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '22px', fontWeight: '700', marginBottom: '8px' }}>Kirim Pesan</h3>
                            <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '28px', lineHeight: '1.6' }}>Ceritakan kebutuhan bisnis Anda dan kami akan segera menghubungi balik.</p>

                            {contactSent ? (
                                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                                    <div style={{ fontSize: '52px', marginBottom: '16px' }}>✅</div>
                                    <h4 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', color: '#34d399' }}>Pesan Terkirim!</h4>
                                    <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '20px' }}>Terima kasih! Tim kami akan menghubungi Anda secepatnya.</p>
                                    <button onClick={() => { setContactSent(false); setContactForm({ name: '', email: '', phone: '', message: '' }); }} style={{ background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.3)', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
                                        Kirim Pesan Lain
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={(e) => { e.preventDefault(); if (adminSettings.contact_whatsapp) { const msg = `Halo, saya ${contactForm.name} (${contactForm.email}${contactForm.phone ? ', ' + contactForm.phone : ''}). ${contactForm.message}`; window.open(`https://wa.me/${String(adminSettings.contact_whatsapp || '').replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank'); } setContactSent(true); }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '13px', color: '#9ca3af', fontWeight: '600', marginBottom: '8px' }}>Nama Lengkap *</label>
                                            <input
                                                type="text"
                                                required
                                                value={contactForm.name}
                                                onChange={(e) => setContactForm(p => ({ ...p, name: e.target.value }))}
                                                placeholder="PT. Nama Perusahaan / Nama Anda"
                                                style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px 16px', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                                                onFocus={(e) => e.target.style.borderColor = 'rgba(99,102,241,0.6)'}
                                                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '13px', color: '#9ca3af', fontWeight: '600', marginBottom: '8px' }}>Email *</label>
                                            <input
                                                type="email"
                                                required
                                                value={contactForm.email}
                                                onChange={(e) => setContactForm(p => ({ ...p, email: e.target.value }))}
                                                placeholder="email@perusahaan.com"
                                                style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px 16px', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                                                onFocus={(e) => e.target.style.borderColor = 'rgba(99,102,241,0.6)'}
                                                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '13px', color: '#9ca3af', fontWeight: '600', marginBottom: '8px' }}>No. WhatsApp (Opsional)</label>
                                            <input
                                                type="tel"
                                                value={contactForm.phone}
                                                onChange={(e) => setContactForm(p => ({ ...p, phone: e.target.value }))}
                                                placeholder="08xxxxxxxxxx"
                                                style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px 16px', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                                                onFocus={(e) => e.target.style.borderColor = 'rgba(99,102,241,0.6)'}
                                                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '13px', color: '#9ca3af', fontWeight: '600', marginBottom: '8px' }}>Pesan *</label>
                                            <textarea
                                                required
                                                value={contactForm.message}
                                                onChange={(e) => setContactForm(p => ({ ...p, message: e.target.value }))}
                                                placeholder="Ceritakan kebutuhan Anda, instansi yang ingin dipantau, atau pertanyaan tentang paket berlangganan..."
                                                rows={5}
                                                style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px 16px', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box', resize: 'vertical', fontFamily: 'inherit', transition: 'border-color 0.2s' }}
                                                onFocus={(e) => e.target.style.borderColor = 'rgba(99,102,241,0.6)'}
                                                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: '#fff', border: 'none', padding: '14px 28px', fontSize: '15px', fontWeight: '700', borderRadius: '10px', cursor: 'pointer', boxShadow: '0 8px 20px rgba(99,102,241,0.4)', transition: 'all 0.2s', marginTop: '4px' }}
                                            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(99,102,241,0.5)'; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(99,102,241,0.4)'; }}
                                        >
                                            {adminSettings.contact_whatsapp ? '💬 Kirim via WhatsApp' : '📧 Kirim Pesan'}
                                        </button>
                                        <p style={{ fontSize: '12px', color: '#4b5563', textAlign: 'center', margin: 0 }}>
                                            Dengan mengirim pesan, Anda setuju dengan kebijakan privasi kami.
                                        </p>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Footer spacer */}
                    <div style={{ height: '60px' }} />
                </div>
            )}

            {/* ===== PRIVACY POLICY PAGE ===== */}
            {landingPage === 'privacy' && (
                <div style={{ minHeight: '80vh', padding: '60px 20px', maxWidth: '800px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '20px', padding: '6px 16px', marginBottom: '20px', fontSize: '13px', color: '#818cf8', fontWeight: '600' }}>
                            🔒 Kebijakan Privasi
                        </div>
                        <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: '800', background: 'linear-gradient(135deg, #e0e7ff, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '16px' }}>
                            Kebijakan Privasi
                        </h1>
                        <p style={{ color: '#9ca3af', fontSize: '15px' }}>
                            Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>

                    <div style={{ background: '#0f1322', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '40px', color: '#d1d5db', lineHeight: '1.8', fontSize: '15px' }}>
                        <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: '700', marginBottom: '12px', marginTop: '0' }}>1. Informasi Yang Kami Kumpulkan</h3>
                        <p style={{ marginBottom: '24px' }}>
                            Kami mengumpulkan informasi penting untuk memberikan layanan pemantauan tender terbaik bagi Anda. Informasi ini meliputi alamat email, kata sandi terenkripsi, nomor WhatsApp Anda (untuk pengiriman notifikasi WhatsApp), preferensi pencarian/kata kunci proyek yang dipantau, serta log aktivitas sistem yang bersifat teknis untuk optimalisasi server.
                        </p>

                        <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: '700', marginBottom: '12px' }}>2. Bagaimana Kami Menggunakan Informasi</h3>
                        <p style={{ marginBottom: '24px' }}>
                            Informasi Anda digunakan secara eksklusif untuk:
                        </p>
                        <ul style={{ paddingLeft: '20px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <li>Mengirimkan notifikasi radar tender terbaru secara real-time via WhatsApp dan Email.</li>
                            <li>Mengelola akun trial 7 hari serta memproses perpanjangan masa aktif paket premium secara aman.</li>
                            <li>Memproses transaksi langganan melalui payment gateway Midtrans yang terpercaya.</li>
                            <li>Mendeteksi, mencegah, dan mengatasi masalah teknis pada dashboard serta API scraper.</li>
                        </ul>

                        <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: '700', marginBottom: '12px' }}>3. Kerahasiaan & Keamanan Data</h3>
                        <p style={{ marginBottom: '24px' }}>
                            Kami berkomitmen penuh untuk menjaga keamanan data Anda. Sandi Anda disimpan dalam format hash kriptografik satu arah yang tidak dapat dibaca oleh siapa pun. Kami tidak akan pernah menjual, menyewakan, atau membagikan data pribadi Anda kepada pihak ketiga mana pun tanpa persetujuan eksplisit dari Anda, kecuali untuk kebutuhan transaksi legal melalui Midtrans.
                        </p>

                        <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: '700', marginBottom: '12px' }}>4. Perubahan Kebijakan Privasi</h3>
                        <p style={{ marginBottom: '0' }}>
                            Kami berhak memperbarui Kebijakan Privasi ini dari waktu ke waktu guna menyelaraskan dengan pembaruan fitur. Perubahan akan diumumkan secara langsung melalui halaman ini, dan kami menyarankan Anda untuk memeriksanya secara berkala.
                        </p>
                    </div>
                    <div style={{ height: '40px' }} />
                </div>
            )}

            {/* ===== TERMS AND CONDITIONS PAGE ===== */}
            {landingPage === 'terms' && (
                <div style={{ minHeight: '80vh', padding: '60px 20px', maxWidth: '800px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '20px', padding: '6px 16px', marginBottom: '20px', fontSize: '13px', color: '#818cf8', fontWeight: '600' }}>
                            📜 Syarat & Ketentuan
                        </div>
                        <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: '800', background: 'linear-gradient(135deg, #e0e7ff, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '16px' }}>
                            Syarat & Ketentuan Layanan
                        </h1>
                        <p style={{ color: '#9ca3af', fontSize: '15px' }}>
                            Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>

                    <div style={{ background: '#0f1322', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '40px', color: '#d1d5db', lineHeight: '1.8', fontSize: '15px' }}>
                        <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: '700', marginBottom: '12px', marginTop: '0' }}>1. Ketentuan Penggunaan Platform</h3>
                        <p style={{ marginBottom: '24px' }}>
                            Dengan mendaftar dan menggunakan platform kami, Anda setuju untuk terikat oleh Syarat dan Ketentuan ini. Platform ini menyediakan alat bantu otomatisasi pemantauan informasi tender dari portal LPSE seluruh Indonesia (LKPP). Pengguna dilarang keras menyalahgunakan sistem ini untuk tindakan ilegal atau meluncurkan serangan siber yang dapat mengganggu kestabilan server kami maupun server LPSE.
                        </p>

                        <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: '700', marginBottom: '12px' }}>2. Paket Langganan & Transaksi</h3>
                        <p style={{ marginBottom: '24px' }}>
                            Layanan kami menawarkan opsi Akun Trial gratis (masa aktif 7 hari dengan kuota pemantauan terbatas) serta Paket Premium berbayar. Seluruh biaya pembayaran paket premium bersifat non-refundable (tidak dapat dikembalikan). Kelebihan pembayaran atau kesalahan penggunaan kode voucher adalah tanggung jawab penuh pengguna.
                        </p>

                        <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: '700', marginBottom: '12px' }}>3. Kebijakan Batasan & Akumulasi Paket</h3>
                        <p style={{ marginBottom: '24px' }}>
                            Pengguna premium dapat memperpanjang paket langganan kapan saja. Sisa masa aktif Anda saat ini tidak akan hangus melainkan secara otomatis diakumulasikan ke masa aktif baru. Penggunaan akun premium dibatasi untuk satu entitas badan usaha/pengguna dan tidak diperkenankan untuk diperjualbelikan kembali atau dibagi dengan pihak lain.
                        </p>

                        <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: '700', marginBottom: '12px' }}>4. Batasan Tanggung Jawab (Disclaimer)</h3>
                        <p style={{ marginBottom: '0' }}>
                            Kami berusaha menyajikan data tender seakurat dan secepat mungkin dari portal SPSE resmi. Namun, kami tidak memberikan jaminan mutlak atas ketersediaan data secara real-time jika terjadi kendala teknis pada situs LPSE tujuan (seperti situs down atau maintenance). Platform tidak bertanggung jawab atas segala kerugian finansial atau hilangnya kesempatan bisnis yang diakibatkan oleh keterlambatan atau ketidaktersediaan data.
                        </p>
                    </div>
                    <div style={{ height: '40px' }} />
                </div>
            )}

            {/* ===== HOME PAGE ===== */}
            {landingPage === 'home' && <>

                {/* Hero Section */}
                <div className="landing-hero" style={{
                    textAlign: 'center',
                    background: 'radial-gradient(circle at top, rgba(99, 102, 241, 0.18), transparent 65%)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {/* Decorative background blobs */}
                    <div style={{ position: 'absolute', top: '10%', left: '5%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(99,102,241,0.08), transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
                    <div style={{ position: 'absolute', bottom: '5%', right: '5%', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(168,85,247,0.08), transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

                    {/* Logo */}
                    <div style={{ fontSize: '64px', marginBottom: '20px' }}>{adminSettings.app_logo || '🕵🏼‍♂️'}</div>

                    {/* Badge label */}
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '20px', padding: '6px 16px', marginBottom: '28px', fontSize: '13px', color: '#818cf8', fontWeight: '600' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 6px #10b981' }}></span>
                        Platform #1 Pemantauan Tender SPSE Indonesia
                    </div>

                    {/* Main headline */}
                    <h1 style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: 'clamp(32px, 5vw, 54px)',
                        fontWeight: '800',
                        marginBottom: '24px',
                        lineHeight: '1.2',
                        background: 'linear-gradient(135deg, #e0e7ff, #a5b4fc, #c084fc)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        maxWidth: '800px',
                        margin: '0 auto 24px'
                    }}>
                        {adminSettings.app_name || 'Spy SPSE'} — Satu Platform untuk Semua Peluang Tender Indonesia
                    </h1>

                    {/* Subheadline — dynamic tagline or persuasive default */}
                    <p style={{ fontSize: '18px', color: '#cbd5e1', maxWidth: '680px', margin: '0 auto 20px', lineHeight: '1.75' }}>
                        {adminSettings.app_tagline || 'Jangan biarkan kompetitor Anda yang lebih dulu tahu. Deteksi peluang proyek LPSE seluruh Indonesia secara otomatis — notifikasi langsung ke WhatsApp & Email Anda, 24 jam sehari.'}
                    </p>

                    {/* Value proposition highlight */}
                    <div style={{
                        display: 'inline-block',
                        background: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(5,150,105,0.08))',
                        border: '1px solid rgba(16,185,129,0.3)',
                        borderRadius: '16px',
                        padding: '16px 28px',
                        marginBottom: '36px',
                        maxWidth: '680px'
                    }}>
                        <p style={{ margin: 0, fontSize: '15px', color: '#6ee7b7', lineHeight: '1.7', fontWeight: '500' }}>
                            💡 <strong style={{ color: '#34d399' }}>Hanya dengan investasi mulai Rp {parseInt(adminSettings.premium_price || 150000).toLocaleString('id-ID')}/bulan</strong> — buka akses ke ribuan peluang proyek senilai <strong style={{ color: '#34d399' }}>miliaran rupiah</strong> dari seluruh K/L/Pemda Indonesia.
                            {' '}<em style={{ color: '#9ca3af' }}>Satu kemenangan tender sudah balik modal ratusan kali lipat.</em>
                        </p>
                    </div>

                    {/* CTA Buttons */}
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '36px' }}>
                        <button
                            onClick={onGetStarted}
                            style={{
                                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                                color: '#fff',
                                border: 'none',
                                padding: '16px 40px',
                                fontSize: '17px',
                                fontWeight: 'bold',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.5)',
                                transition: 'all 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 15px 30px -5px rgba(99,102,241,0.6)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(99,102,241,0.5)'; }}
                        >
                            🚀 Mulai Gratis Sekarang
                        </button>
                        <button
                            onClick={() => document.getElementById('landing-pricing')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                            style={{
                                background: 'transparent',
                                color: '#a5b4fc',
                                border: '1px solid rgba(165,180,252,0.35)',
                                padding: '16px 32px',
                                fontSize: '17px',
                                fontWeight: '600',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(99,102,241,0.1)'; e.currentTarget.style.borderColor = 'rgba(165,180,252,0.6)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(165,180,252,0.35)'; }}
                        >
                            Lihat Paket Harga →
                        </button>
                    </div>

                    {/* Social proof micro row */}
                    <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap', fontSize: '13px', color: '#6b7280' }}>
                        <span>✅ Uji coba gratis 7 hari tanpa kartu kredit</span>
                        <span>✅ Notifikasi WhatsApp & Email instan</span>
                        <span>✅ Data dari LPSE seluruh Indonesia</span>
                    </div>
                </div>

                {/* Stats Section */}
                <div style={{ maxWidth: '1200px', margin: '0 auto 40px', padding: '0 20px', display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <div style={{ flex: '1 1 220px', background: 'rgba(255,255,255,0.02)', padding: '30px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}>
                        <div style={{ fontSize: '36px', marginBottom: '12px' }}>📄</div>
                        <div style={{ fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 'bold' }}>Total Tender Terpantau</div>
                        <div style={{ fontSize: '36px', fontWeight: '900', color: '#fff', marginTop: '12px', fontFamily: "'Outfit', sans-serif" }}>{isLoadingStats ? '...' : stats.tenders.toLocaleString('id-ID')}</div>
                    </div>
                    <div style={{ flex: '1 1 220px', background: 'rgba(255,255,255,0.02)', padding: '30px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}>
                        <div style={{ fontSize: '36px', marginBottom: '12px' }}>💰</div>
                        <div style={{ fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 'bold' }}>Total Pagu Terpantau</div>
                        <div style={{ fontSize: '36px', fontWeight: '900', color: '#fbbf24', marginTop: '12px', fontFamily: "'Outfit', sans-serif" }}>{isLoadingStats ? '...' : formatStatsPagu(stats.pagu)}</div>
                    </div>
                    <div style={{ flex: '1 1 220px', background: 'rgba(255,255,255,0.02)', padding: '30px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}>
                        <div style={{ fontSize: '36px', marginBottom: '12px' }}>🏢</div>
                        <div style={{ fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 'bold' }}>Total LPSE Terhubung</div>
                        <div style={{ fontSize: '36px', fontWeight: '900', color: '#fff', marginTop: '12px', fontFamily: "'Outfit', sans-serif" }}>{isLoadingStats ? '...' : stats.instansi.toLocaleString('id-ID')}</div>
                    </div>
                    <div style={{ flex: '1 1 220px', background: 'rgba(255,255,255,0.02)', padding: '30px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}>
                        <div style={{ fontSize: '36px', marginBottom: '12px' }}>👥</div>
                        <div style={{ fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 'bold' }}>Total Penyedia Terhubung</div>
                        <div style={{ fontSize: '36px', fontWeight: '900', color: '#38bdf8', marginTop: '12px', fontFamily: "'Outfit', sans-serif" }}>{isLoadingStats ? '...' : stats.penyedia.toLocaleString('id-ID')}</div>
                    </div>
                </div>

                {/* Latest Tenders Preview */}
                <div style={{ padding: '0 20px 80px', maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
                        <div>
                            <h2 style={{ fontSize: '32px', fontFamily: "'Outfit', sans-serif", marginBottom: '8px' }}>Tender Terbaru</h2>
                            <p style={{ color: '#9ca3af' }}>Intip beberapa Peluang Terbaru Hari Ini</p>
                        </div>
                        <button
                            onClick={onGoTenders}
                            style={{
                                background: 'transparent',
                                color: '#818cf8',
                                border: '1px solid rgba(129,140,248,0.5)',
                                padding: '10px 20px',
                                fontSize: '14px',
                                fontWeight: '600',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            Eksplorasi Semua Tender <span>→</span>
                        </button>
                    </div>

                    {isLoadingTenders ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>Memuat data tender terbaru...</div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                            {latestTenders.map(t => (
                                <div key={t.id} style={{ background: '#0f1322', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', padding: '24px', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                        <span style={{ fontSize: '12px', background: 'rgba(99, 102, 241, 0.1)', color: '#818cf8', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>{t.kategori.toUpperCase()}</span>
                                        <span style={{ fontSize: '12px', color: '#6b7280' }}>ID: {t.nomor_pengadaan}</span>
                                    </div>
                                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px', lineHeight: '1.4', flexGrow: 1 }}>
                                        {renderTenderTitle(t.nama_tender)}
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#9ca3af', marginBottom: '20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>🏢 {t.instansi}</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>📌 Tahap: <span style={getTahapStyle(t.tahap)}>{t.tahap || 'Tidak dirincikan'}</span></div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>📅 Mulai: <span style={{ color: '#10b981', fontWeight: '500' }}>{t.tanggal_mulai_tender || 'Tidak dirincikan'}</span></div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>⏳ Akhir: <span style={{ color: '#ef4444', fontWeight: '500' }}>{t.akhir_penawaran || 'Tidak dirincikan'}</span></div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#6b7280' }}>⏱️ Diperbarui: {timeAgo(t.scraped_at)}</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fbbf24', fontWeight: 'bold', fontSize: '15px', marginTop: '4px' }}>💰 Pagu: {t.pagu || 'Tidak dirincikan'}</div>
                                    </div>
                                    <button
                                        onClick={onGoTenders}
                                        className="btn-primary"
                                        style={{ textDecoration: 'none', textAlign: 'center', display: 'block', width: '100%', padding: '10px', borderRadius: '8px', border: 'none', fontWeight: '600', cursor: 'pointer' }}
                                    >
                                        Lihat Detail Tender
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Pemenang Tender Terbaru Section */}
                <div style={{ padding: '0 20px 80px', maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
                        <div>
                            <h2 style={{ fontSize: '32px', fontFamily: "'Outfit', sans-serif", marginBottom: '8px' }}>Pemenang Tender Terbaru</h2>
                            <p style={{ color: '#9ca3af' }}>Daftar Badan Usaha yang Baru Saja Memenangkan Tender</p>
                        </div>
                    </div>

                    {isLoadingWinners ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>Memuat data pemenang tender...</div>
                    ) : latestWinners.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af', background: '#0f1322', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>Belum ada data pemenang tender terbaru.</div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                            {latestWinners.map((w, idx) => (
                                <div key={idx} style={{ background: '#0f1322', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', padding: '24px', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'center' }}>
                                        <span style={{ fontSize: '12px', background: 'rgba(16, 185, 129, 0.1)', color: '#34d399', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>PEMENANG</span>
                                        <span style={{ fontSize: '11px', color: '#6b7280' }}>NPWP: {w.npwp || '-'}</span>
                                    </div>
                                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: '#3b82f6', lineHeight: '1.4' }}>
                                        {w.nama_pemenang}
                                    </h3>
                                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '16px' }}>
                                        📍 {w.alamat || 'Alamat tidak dicantumkan'}
                                    </div>
                                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px', flexGrow: 1 }}>
                                        <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '4px' }}>Nama Tender</div>
                                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#fff', marginBottom: '12px', lineHeight: '1.4' }}>
                                            {renderTenderTitle(w.nama_tender)}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#9ca3af', marginBottom: '20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>🏢 {w.instansi}</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>💰 Nilai Kontrak: <span style={{ color: '#10b981', fontWeight: 'bold' }}>Rp {w.harga_kontrak ? w.harga_kontrak.toLocaleString('id-ID') : '-'}</span></div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>💵 Pagu Proyek: <span style={{ color: '#fbbf24', fontWeight: '600' }}>{w.pagu || '-'}</span></div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#6b7280' }}>⏱️ Sinkron: {timeAgo(w.scraped_at)}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* CTA Analisis Kompetitor */}
                <div style={{ padding: '0 20px 80px', maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{
                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(168, 85, 247, 0.08))',
                        border: '1px solid rgba(99, 102, 241, 0.2)',
                        borderRadius: '24px',
                        padding: '32px 24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '24px',
                        boxShadow: '0 15px 35px rgba(0,0,0,0.25)',
                        backdropFilter: 'blur(10px)'
                    }}>
                        <div style={{ flex: '1 1 280px', minWidth: '0' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', marginBottom: '16px' }}>
                                📊 FITUR PREMIUM
                            </div>
                            <h2 style={{ fontSize: '24px', fontFamily: "'Outfit', sans-serif", fontWeight: 'bold', color: '#fff', marginBottom: '12px', lineHeight: '1.3' }}>
                                Analisis Profil Kompetitor &amp; Badan Usaha
                            </h2>
                            <p style={{ color: '#9ca3af', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                                Selidiki rekam jejak pesaing Anda secara instan. Ketahui tingkat kemenangan (win rate), histori pengajuan harga penawaran vs hasil koreksi pokja, instansi dominan tempat mereka menang, hingga daftar alasan detail keguguran lelang yang dialami kompetitor Anda.
                            </p>
                        </div>
                        <div style={{ flex: '1 1 auto', width: '100%', maxWidth: '340px' }}>
                            <button
                                onClick={() => {
                                    if (localStorage.getItem('user_token')) {
                                        window.location.hash = '#/competitors';
                                    } else {
                                        sessionStorage.setItem('login_redirect', 'competitors');
                                        window.location.hash = '#/login';
                                    }
                                }}
                                style={{
                                    width: '100%',
                                    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                                    color: '#fff',
                                    border: 'none',
                                    padding: '14px 20px',
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    boxShadow: '0 8px 20px rgba(99, 102, 241, 0.35)',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px'
                                }}
                            >
                                🔍 Mulai Analisis Kompetitor Sekarang ➜
                            </button>
                        </div>
                    </div>
                </div>

                {/* Problem & Solution Section */}
                <div style={{ padding: '80px 20px', maxWidth: '1000px', margin: '0 auto', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', marginBottom: '40px' }}>
                    <h2 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '12px', fontFamily: "'Outfit', sans-serif" }}>Mengapa Perusahaan Anda Butuh Ini?</h2>
                    <p style={{ textAlign: 'center', color: '#9ca3af', marginBottom: '40px', fontSize: '15px' }}>Setiap hari tanpa sistem pemantauan adalah hari di mana kompetitor Anda selangkah lebih maju</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', alignItems: 'stretch' }}>
                        <div style={{ background: 'rgba(239, 68, 68, 0.05)', padding: '40px', borderRadius: '16px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                            <h3 style={{ fontSize: '22px', marginBottom: '20px', color: '#f87171', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span>❌</span> Tanpa {adminSettings.app_name || 'Spy SPSE'}
                            </h3>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#9ca3af', lineHeight: '1.9', fontSize: '14px' }}>
                                <li style={{ marginBottom: '10px' }}>📉 Buka puluhan website LPSE satu per satu — buang waktu & tenaga tim.</li>
                                <li style={{ marginBottom: '10px' }}>😰 Tender bernilai miliaran terlewat karena terlambat tahu.</li>
                                <li style={{ marginBottom: '10px' }}>🔍 Cari kata kunci manual berjam-jam tanpa hasil maksimal.</li>
                                <li style={{ marginBottom: '10px' }}>⏰ Deadline penawaran terlupa — gugur sebelum bersaing.</li>
                                <li>🤷 Buta terhadap strategi harga & rekam jejak pesaing.</li>
                            </ul>
                        </div>
                        <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '40px', borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                            <h3 style={{ fontSize: '22px', marginBottom: '20px', color: '#34d399', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span>✅</span> Dengan {adminSettings.app_name || 'Spy SPSE'}
                            </h3>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#9ca3af', lineHeight: '1.9', fontSize: '14px' }}>
                                <li style={{ marginBottom: '10px' }}>🤖 <strong style={{ color: '#d1fae5' }}>Radar Tender Otomatis bekerja 24/7 untuk Anda</strong> — deteksi peluang proyek seluruh Indonesia tanpa jeda.</li>
                                <li style={{ marginBottom: '10px' }}>📱 <strong style={{ color: '#d1fae5' }}>Notifikasi WhatsApp dalam hitungan menit</strong> setelah tender diterbitkan.</li>
                                <li style={{ marginBottom: '10px' }}>🎯 Kata kunci & instansi pilihan = <strong style={{ color: '#d1fae5' }}>hanya tender relevan yang masuk</strong>.</li>
                                <li style={{ marginBottom: '10px' }}>📊 <strong style={{ color: '#d1fae5' }}>Analisis kompetitor</strong>: strategi harga, kemenangan, alasan gugur.</li>
                                <li>💰 Investasi mulai <strong style={{ color: '#34d399' }}>Rp {parseInt(adminSettings.premium_price || 150000).toLocaleString('id-ID')}/bulan</strong> — ROI dari satu kemenangan tender.</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div style={{ padding: '60px 20px', maxWidth: '1000px', margin: '0 auto' }}>
                    <h2 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '12px', fontFamily: "'Outfit', sans-serif" }}>Kenapa Harus {adminSettings.app_name || 'Spy SPSE'}?</h2>
                    <p style={{ textAlign: 'center', color: '#9ca3af', marginBottom: '40px', fontSize: '15px' }}>Jangan habiskan waktu mencari secara manual.</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                        <div style={{ background: '#0f1322', padding: '30px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ fontSize: '32px', marginBottom: '16px' }}>🔔</div>
                            <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>Notifikasi Real-time</h3>
                            <p style={{ color: '#9ca3af', lineHeight: '1.6' }}>Sistem pemantauan tender otomatis yang mengirimkan notifikasi peluang proyek langsung ke WhatsApp dan Email Anda.</p>
                        </div>
                        <div style={{ background: '#0f1322', padding: '30px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ fontSize: '32px', marginBottom: '16px' }}>🔍</div>
                            <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>Explorer Cerdas</h3>
                            <p style={{ color: '#9ca3af', lineHeight: '1.6' }}>Cari miliaran rupiah peluang di semua Instansi. Tanpa perlu membuka puluhan website LPSE satu per satu.</p>
                        </div>
                        <div style={{ background: '#0f1322', padding: '30px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ fontSize: '32px', marginBottom: '16px' }}>🏢</div>
                            <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>Multi-Instansi</h3>
                            <p style={{ color: '#9ca3af', lineHeight: '1.6' }}>Pantau ratusan tender dari Kementerian, Lembaga, BUMN, Pemprov, hingga Pemkab sekaligus dalam satu dasbor.</p>
                        </div>
                        <div style={{ background: '#0f1322', padding: '30px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ fontSize: '32px', marginBottom: '16px' }}>📊</div>
                            <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>Analisis Kompetitor</h3>
                            <p style={{ color: '#9ca3af', lineHeight: '1.6' }}>Lacak rekam jejak badan usaha pesaing Anda. Ketahui win success rate, histori penawaran, instansi dominasi kemenangan, serta analisis alasan detail keguguran lelang oleh Pokja.</p>
                        </div>
                    </div>
                </div>

                {/* Testimonials Section */}
                <div style={{ padding: '80px 20px', maxWidth: '1000px', margin: '0 auto' }}>
                    <h2 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '8px', fontFamily: "'Outfit', sans-serif" }}>Mereka Sudah Merasakannya</h2>
                    <p style={{ textAlign: 'center', color: '#9ca3af', marginBottom: '40px' }}>Ribuan perusahaan pemenang tender mempercayai platform ini — giliran Anda berikutnya</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
                        {[
                            {
                                name: "Budi Santoso",
                                role: "Direktur PT Sinar Jaya Konstruksi",
                                text: "Bulan pertama berlangganan, kami langsung menangkap tender jalan senilai Rp 4,2 M yang sebelumnya tidak pernah kami tahu. Investasi Rp 150 ribu untuk keuntungan miliaran — tidak masuk akal kalau tidak pakai ini.",
                                avatar: "👨‍💼",
                                rating: 5
                            },
                            {
                                name: "Siti Rahma",
                                role: "Tender Specialist, CV Digital Solusindo",
                                text: "Sebelum pakai ini, kami selalu kalah duluan di tender karena telat tahu. Sekarang notifikasi masuk ke WhatsApp dalam menit, kami selalu siap lebih awal dari kompetitor. Win rate kami naik dari 10% ke 35% dalam 3 bulan.",
                                avatar: "👩‍💼",
                                rating: 5
                            },
                            {
                                name: "Hendra Wijaya",
                                role: "CEO PT Megah Infrastruktur",
                                text: "Fitur analisis kompetitor benar-benar mengubah cara kami menyusun harga penawaran. Kami bisa lihat di mana pesaing biasa gugur dan posisi optimal kami untuk menang. ROI-nya tidak bisa dibandingkan.",
                                avatar: "👨‍💻",
                                rating: 5
                            }
                        ].map((item, idx) => (
                            <div key={idx} style={{ background: '#0f1322', padding: '30px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'transform 0.2s', cursor: 'default' }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                                <div>
                                    <div style={{ color: '#fbbf24', marginBottom: '15px', fontSize: '18px' }}>{"★".repeat(item.rating)}</div>
                                    <p style={{ color: '#d1d5db', fontStyle: 'italic', lineHeight: '1.6', fontSize: '14px', marginBottom: '20px' }}>"{item.text}"</p>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <span style={{ fontSize: '32px' }}>{item.avatar}</span>
                                    <div>
                                        <h4 style={{ fontSize: '15px', fontWeight: 'bold', color: '#fff', margin: 0 }}>{item.name}</h4>
                                        <p style={{ fontSize: '12px', color: '#6b7280', margin: 0, marginTop: '2px' }}>{item.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pricing Section */}
                <div id="landing-pricing" style={{ padding: '80px 20px', maxWidth: '1000px', margin: '0 auto', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <h2 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '8px', fontFamily: "'Outfit', sans-serif" }}>Pilih Paket, Mulai Menangkan Tender</h2>
                    <p style={{ textAlign: 'center', color: '#9ca3af', marginBottom: '50px' }}>Investasi terkecil Anda hari ini bisa membuka pintu proyek miliaran rupiah. Mulai gratis, upgrade kapan saja.</p>
                    <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'stretch' }}>
                        {/* Free Trial Plan */}
                        <div style={{ flex: '1 1 300px', maxWidth: '350px', background: '#0f1322', padding: '40px 30px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'all 0.3s' }}
                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'scale(1.02)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.transform = 'scale(1)'; }}>
                            <div>
                                <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>Free Trial</h3>
                                <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '20px' }}>Uji coba fitur dasar pemantauan tender</p>
                                <div style={{ fontSize: '36px', fontWeight: '900', color: '#fff', marginBottom: '25px', fontFamily: "'Outfit', sans-serif" }}>Rp 0 <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: 'normal' }}>/ 7 hari</span></div>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#d1d5db', fontSize: '14px', lineHeight: '2' }}>
                                    <li>✓ Maksimal 1 Kata Kunci Pilihan</li>
                                    <li>✓ Maksimal 1 K/L/Pemda Instansi</li>
                                    <li>✓ Notifikasi Email Harian</li>
                                    <li style={{ color: '#6b7280', textDecoration: 'line-through' }}>✗ Notifikasi Instan WhatsApp</li>
                                    <li style={{ color: '#6b7280', textDecoration: 'line-through' }}>✗ Unlimited Keywords & Instansi</li>
                                    <li style={{ color: '#6b7280', textDecoration: 'line-through' }}>✗ Sinkronisasi Jadwal Real-time</li>
                                </ul>
                            </div>
                            <button onClick={onGetStarted} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', marginTop: '30px', transition: 'all 0.2s' }}
                                onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
                                onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}>
                                Mulai Uji Coba Gratis
                            </button>
                        </div>

                        {/* Premium Plan */}
                        <div style={{ flex: '1 1 300px', maxWidth: '350px', background: 'linear-gradient(145deg, #11152a, #0b0d1b)', padding: '40px 30px', borderRadius: '24px', border: '2px solid #6366f1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', transform: 'scale(1.03)', boxShadow: '0 20px 40px rgba(99, 102, 241, 0.15)', transition: 'all 0.3s' }}
                            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 25px 50px rgba(99, 102, 241, 0.25)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 20px 40px rgba(99, 102, 241, 0.15)'; }}>
                            <span style={{ position: 'absolute', top: '-15px', right: '30px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: '#fff', fontSize: '12px', fontWeight: 'bold', padding: '6px 16px', borderRadius: '20px', boxShadow: '0 4px 10px rgba(99, 102, 241, 0.3)' }}>PALING POPULER</span>
                            <div>
                                <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px', color: '#818cf8' }}>Premium Pro</h3>
                                <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '20px' }}>Pantau tak terbatas dan menangkan tender</p>
                                <div style={{ fontSize: '36px', fontWeight: '900', color: '#fbbf24', marginBottom: '25px', fontFamily: "'Outfit', sans-serif" }}>Rp {parseInt(adminSettings.premium_price || 150000).toLocaleString('id-ID')} <span style={{ fontSize: '14px', color: '#9ca3af', fontWeight: 'normal' }}>/ bulan</span></div>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#d1d5db', fontSize: '14px', lineHeight: '2' }}>
                                    <li>✓ Unlimited Kata Kunci Pencarian</li>
                                    <li>✓ Pantau Semua K/L/Pemda Instansi</li>
                                    <li>✓ Analisis Kompetitor &amp; Alasan Gugur</li>
                                    <li>✓ Notifikasi Instan via WhatsApp</li>
                                    <li>✓ Notifikasi Prioritas via Email</li>
                                    <li>✓ Sinkronisasi Jadwal Real-time 24/7</li>
                                </ul>
                            </div>
                            <button onClick={onGetStarted} style={{ width: '100%', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: '#fff', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', marginTop: '30px', boxShadow: '0 10px 20px -5px rgba(99, 102, 241, 0.4)', transition: 'all 0.2s' }}
                                onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                                onMouseLeave={(e) => e.target.style.opacity = '1'}>
                                Langganan Sekarang
                            </button>
                        </div>

                        {/* Premium Yearly Plan */}
                        <div style={{ flex: '1 1 300px', maxWidth: '350px', background: 'linear-gradient(145deg, #16122d, #0d0b1b)', padding: '40px 30px', borderRadius: '24px', border: '1px solid rgba(168,85,247,0.3)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'all 0.3s', boxShadow: '0 10px 20px rgba(168, 85, 247, 0.05)' }}
                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(168,85,247,0.6)'; e.currentTarget.style.transform = 'scale(1.02)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(168,85,247,0.3)'; e.currentTarget.style.transform = 'scale(1)'; }}>
                            <div>
                                <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px', color: '#c084fc' }}>Premium Tahunan</h3>
                                <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '20px' }}>Opsi paling hemat untuk perlindungan setahun penuh {getYearlySavingsPercent() > 0 ? `(Hemat ${getYearlySavingsPercent()}%)` : ''}</p>
                                <div style={{ fontSize: '36px', fontWeight: '900', color: '#fbbf24', marginBottom: '25px', fontFamily: "'Outfit', sans-serif" }}>Rp {parseInt(adminSettings.premium_price_yearly || 1500000).toLocaleString('id-ID')} <span style={{ fontSize: '14px', color: '#9ca3af', fontWeight: 'normal' }}>/ 365 hari</span></div>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#d1d5db', fontSize: '14px', lineHeight: '2' }}>
                                    <li>✓ Semua Fitur Premium Pro Bulanan</li>
                                    <li>✓ Masa Aktif 365 Hari</li>
                                    <li>✓ Analisis Kompetitor &amp; Alasan Gugur</li>
                                    <li>✓ Notifikasi WhatsApp + Email Prioritas</li>
                                    <li>✓ Hemat Biaya Berlangganan</li>
                                    <li>✓ Dukungan Teknis Prioritas</li>
                                </ul>
                            </div>
                            <button onClick={onGetStarted} style={{ width: '100%', background: 'linear-gradient(135deg, #a855f7, #7c3aed)', color: '#fff', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', marginTop: '30px', boxShadow: '0 10px 20px -5px rgba(168, 85, 247, 0.3)', transition: 'all 0.2s' }}
                                onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                                onMouseLeave={(e) => e.target.style.opacity = '1'}>
                                Langganan Paket Tahunan
                            </button>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div style={{ padding: '80px 20px', maxWidth: '860px', margin: '0 auto', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <h2 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '8px', fontFamily: "'Outfit', sans-serif" }}>Pertanyaan Umum (FAQ)</h2>
                    <p style={{ textAlign: 'center', color: '#9ca3af', marginBottom: '48px' }}>Semua yang perlu Anda tahu sebelum mulai — kami jawab tuntas di sini</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {[
                            {
                                q: "Berapa besar ROI (Return on Investment) yang bisa saya dapatkan?",
                                a: "Satu kemenangan tender bernilai Rp 500 juta saja sudah setara lebih dari 3.000× biaya berlangganan bulanan Anda. Platform kami memastikan Anda tidak pernah melewatkan satu pun peluang yang relevan, sehingga tim bisa fokus pada penyusunan penawaran — bukan pada aktivitas pencarian manual.",
                                icon: "💰"
                            },
                            {
                                q: "Apakah ada masa uji coba gratis sebelum berlangganan?",
                                a: "Ya! Kami menyediakan paket Free Trial selama 7 hari penuh tanpa biaya, tanpa memerlukan kartu kredit. Anda bisa langsung merasakan sistem notifikasi WhatsApp & Email, serta menjelajahi tender dari LPSE pilihan Anda sebelum memutuskan untuk upgrade.",
                                icon: "🎁"
                            },
                            {
                                q: "Bagaimana cara kerja Multi-Channel Alerts (WhatsApp & Email)?",
                                a: "Setiap kali Radar Tender Otomatis kami mendeteksi tender baru di portal SPSE yang cocok dengan kata kunci dan K/L/Pemda/Instansi pilihan Anda, sistem langsung mengirimkan notifikasi ringkasan proyek lengkap ke WhatsApp dan Email Anda dalam hitungan menit secara real-time. Anda bisa membagi saluran pengiriman notifikasi ini ke tim teknis maupun estimasi proyek Anda agar respon koordinasi lebih cepat.",
                                icon: "🔔"
                            },
                            {
                                q: "LPSE dan instansi mana saja yang bisa dipantau?",
                                a: (
                                    <>
                                        Platform kami mendukung pemantauan ratusan instansi: Kementerian & Lembaga Pemerintah Pusat (KLPD), Pemerintah Provinsi, Pemerintah Kabupaten/Kota, BUMN, BUMD, hingga lembaga independen. Admin Super dapat menambahkan instansi LPSE baru secara dinamis sesuai kebutuhan bisnis Anda. Jika instansi (khusus instansi resmi yang terdaftar di sistem SPSE/LKPP) yang Anda cari belum terdaftar, silakan ajukan permintaan penambahan instansi baru melalui{' '}
                                        {adminSettings.contact_whatsapp && (
                                            <a href={`https://wa.me/${String(adminSettings.contact_whatsapp || '').replace(/\D/g, '')}?text=${encodeURIComponent('Halo, saya ingin mengajukan penambahan instansi LPSE baru di platform.')}`} target="_blank" rel="noreferrer" style={{ color: '#818cf8', fontWeight: '600', textDecoration: 'underline' }}>
                                                WhatsApp
                                            </a>
                                        )}
                                        {adminSettings.contact_whatsapp && adminSettings.contact_email && ' atau '}
                                        {adminSettings.contact_email && (
                                            <a href={`mailto:${adminSettings.contact_email}?subject=Permintaan Penambahan Instansi LPSE Baru`} style={{ color: '#818cf8', fontWeight: '600', textDecoration: 'underline' }}>
                                                Email Dukungan Kami
                                            </a>
                                        )}
                                        .
                                    </>
                                ),
                                icon: "🏢"
                            },
                            {
                                q: "Apa itu fitur Analisis Kompetitor dan apa manfaatnya?",
                                a: "Fitur eksklusif Premium ini memungkinkan Anda menelusuri rekam jejak pesaing: siapa saja kompetitor yang sering menang di instansi target Anda, berapa kisaran harga penawaran mereka, di tahap mana mereka biasa gugur, dan apa alasan spesifik Pokja menggugurkan mereka. Informasi ini sangat berharga untuk menyusun strategi penawaran yang lebih kompetitif.",
                                icon: "🔍"
                            },
                            {
                                q: "Apakah data perusahaan saya aman?",
                                a: "Keamanan data adalah prioritas utama kami. Seluruh data akun dan notifikasi Anda dienkripsi menggunakan standar JWT & Bcrypt. Kami tidak menyimpan detail kontrak atau dokumen tender Anda — hanya metadata publik yang memang terbuka di portal SPSE.",
                                icon: "🔒"
                            },
                            {
                                q: "Metode pembayaran apa saja yang diterima?",
                                a: "Pembayaran dilakukan secara aman melalui Midtrans Snap. Kami menerima: Virtual Account (Mandiri, BCA, BNI, BRI, Permata), kartu kredit/debit Visa & Mastercard, e-wallet (GoPay, OVO, ShopeePay, DANA), serta pembayaran tunai di gerai Alfamart & Indomaret.",
                                icon: "💳"
                            },
                            {
                                q: "Apakah bisa berhenti berlangganan kapan saja?",
                                a: "Tentu. Tidak ada kontrak jangka panjang atau biaya penalti pembatalan. Setelah masa aktif berlangganan Anda habis, akun otomatis kembali ke mode terbatas — data dan histori Anda tetap tersimpan. Anda bebas memperbarui langganan kapan pun siap.",
                                icon: "🚪"
                            },
                            {
                                q: "Seberapa sering data tender diperbarui?",
                                a: "Radar Tender Otomatis kami beroperasi secara terjadwal 24/7 di latar belakang tanpa henti. Tender baru umumnya terdeteksi dalam hitungan menit setelah diterbitkan di portal SPSE. Untuk tender yang sudah Anda bookmark, status dan jadwalnya disinkronkan otomatis setiap 24 jam.",
                                icon: "⚡"
                            },
                            {
                                q: "Apakah ada diskon untuk berlangganan lebih lama?",
                                a: `Ya! Paket Premium Tahunan (365 hari) memberikan penghematan signifikan dibanding membayar bulanan. Selain itu, kami secara berkala menerbitkan kode voucher diskon eksklusif yang bisa digunakan saat checkout. Pantau promosi kami atau hubungi tim kami untuk info voucher terkini.`,
                                icon: "🎉"
                            }
                        ].map((item, idx) => (
                            <div key={idx} style={{
                                background: '#0f1322',
                                borderRadius: '14px',
                                border: openFaqId === idx ? '1px solid rgba(99,102,241,0.4)' : '1px solid rgba(255,255,255,0.05)',
                                overflow: 'hidden',
                                transition: 'border-color 0.2s',
                                boxShadow: openFaqId === idx ? '0 4px 20px rgba(99,102,241,0.1)' : 'none'
                            }}>
                                <button
                                    onClick={() => setOpenFaqId(openFaqId === idx ? null : idx)}
                                    style={{
                                        width: '100%',
                                        background: 'transparent',
                                        border: 'none',
                                        color: '#fff',
                                        padding: '20px 24px',
                                        textAlign: 'left',
                                        fontSize: '15px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        gap: '12px'
                                    }}
                                >
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <span style={{
                                            fontSize: '20px',
                                            width: '36px',
                                            height: '36px',
                                            borderRadius: '8px',
                                            background: 'rgba(99,102,241,0.1)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0
                                        }}>{item.icon}</span>
                                        {item.q}
                                    </span>
                                    <span style={{
                                        fontSize: '18px',
                                        color: '#6366f1',
                                        fontWeight: 'bold',
                                        flexShrink: 0,
                                        width: '24px',
                                        textAlign: 'center',
                                        transition: 'transform 0.2s',
                                        transform: openFaqId === idx ? 'rotate(45deg)' : 'rotate(0deg)'
                                    }}>+</span>
                                </button>
                                {openFaqId === idx && (
                                    <div style={{
                                        padding: '0 24px 24px 72px',
                                        color: '#9ca3af',
                                        fontSize: '14px',
                                        lineHeight: '1.75',
                                        borderTop: '1px solid rgba(255,255,255,0.04)'
                                    }}>
                                        <div style={{ paddingTop: '16px' }}>{item.a}</div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Still have questions CTA */}
                    <div style={{
                        marginTop: '40px',
                        textAlign: 'center',
                        padding: '28px',
                        background: 'rgba(99,102,241,0.06)',
                        borderRadius: '16px',
                        border: '1px solid rgba(99,102,241,0.15)'
                    }}>
                        <p style={{ margin: '0 0 12px', color: '#9ca3af', fontSize: '14px' }}>
                            Masih punya pertanyaan lain?
                        </p>
                        <button
                            onClick={onGetStarted}
                            style={{
                                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                                color: '#fff',
                                border: 'none',
                                padding: '10px 24px',
                                fontSize: '14px',
                                fontWeight: '600',
                                borderRadius: '8px',
                                cursor: 'pointer'
                            }}
                        >
                            Hubungi Kami / Daftar & Coba Gratis
                        </button>
                    </div>
                </div>

                {/* Insight & Artikel Terbaru Section */}
                <div style={{ padding: '80px 20px', maxWidth: '1100px', margin: '0 auto', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <h2 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '8px', fontFamily: "'Outfit', sans-serif" }}>💡 Insight & Artikel Terbaru</h2>
                    <p style={{ textAlign: 'center', color: '#9ca3af', marginBottom: '40px' }}>Tips, panduan, dan analisis mendalam seputar tender SPSE Indonesia</p>

                    {isLoadingArticles ? (
                        <p style={{ textAlign: 'center', color: '#6b7280' }}>Memuat artikel...</p>
                    ) : latestArticles.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#6b7280' }}>Belum ada artikel yang dipublikasikan.</p>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '40px' }}>
                            {latestArticles.map((art) => (
                                <div key={art.id} style={{
                                    background: '#0f1322',
                                    borderRadius: '16px',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    overflow: 'hidden',
                                    transition: 'all 0.3s ease',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-5px)';
                                        e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                                    }}>
                                    {art.image_url ? (
                                        <img src={art.image_url} alt={art.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ width: '100%', height: '180px', background: 'linear-gradient(135deg, #1e1b4b, #311042)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <span style={{ fontSize: '48px' }}>📝</span>
                                        </div>
                                    )}
                                    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                        {art.is_pinned === 1 && (
                                            <span style={{ alignSelf: 'flex-start', background: 'rgba(251,191,36,0.1)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.2)', fontSize: '11px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '4px', marginBottom: '12px' }}>📌 PINNED</span>
                                        )}
                                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff', margin: '0 0 10px', lineHeight: '1.4', fontFamily: "'Outfit', sans-serif" }}>
                                            {art.title.replace(/{lpse_name}/g, 'Indonesia')}
                                        </h3>
                                        <p style={{ color: '#9ca3af', fontSize: '13px', lineHeight: '1.6', margin: '0 0 20px', flexGrow: 1 }}>
                                            {art.meta_description || (art.content.length > 120 ? art.content.substring(0, 120) + '...' : art.content)}
                                        </p>
                                        <button onClick={() => { window.location.hash = `#/artikel/${art.slug}`; }} style={{
                                            background: 'rgba(99,102,241,0.1)',
                                            color: '#a5b4fc',
                                            border: '1px solid rgba(99,102,241,0.2)',
                                            padding: '10px 20px',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontWeight: '600',
                                            fontSize: '13px',
                                            transition: 'all 0.2s',
                                            border: 'none',
                                            outline: 'none'
                                        }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = '#6366f1';
                                                e.currentTarget.style.color = '#fff';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = 'rgba(99,102,241,0.1)';
                                                e.currentTarget.style.color = '#a5b4fc';
                                            }}>
                                            Baca Selengkapnya
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div style={{ textAlign: 'center' }}>
                        <button onClick={() => { window.location.hash = '#/blog'; }} style={{
                            background: 'transparent',
                            color: '#fff',
                            border: '1px solid rgba(255,255,255,0.15)',
                            padding: '12px 30px',
                            fontSize: '14px',
                            fontWeight: '600',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            outline: 'none'
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = '#6366f1';
                                e.currentTarget.style.background = 'rgba(99,102,241,0.05)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                                e.currentTarget.style.background = 'transparent';
                            }}>
                            Lihat Artikel Lainnya ➜
                        </button>
                    </div>
                </div>



                {/* CTA Bottom Section */}
                <div style={{ padding: '80px 20px', maxWidth: '1000px', margin: '0 auto 60px' }}>
                    <div style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1))', border: '1px solid rgba(99, 102, 241, 0.2)', padding: '60px 40px', borderRadius: '24px', textAlign: 'center', backdropFilter: 'blur(10px)', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', width: '200px', height: '200px', background: 'rgba(99, 102, 241, 0.2)', filter: 'blur(80px)', top: '-50px', left: '-50px', borderRadius: '50%' }}></div>
                        <div style={{ position: 'absolute', width: '200px', height: '200px', background: 'rgba(168, 85, 247, 0.2)', filter: 'blur(80px)', bottom: '-50px', right: '-50px', borderRadius: '50%' }}></div>
                        <h2 style={{ fontSize: '36px', fontFamily: "'Outfit', sans-serif", fontWeight: 'bold', marginBottom: '16px', position: 'relative', zIndex: 1 }}>Siap Menemukan Peluang Emas Bisnis Anda?</h2>
                        <p style={{ color: '#9ca3af', maxWidth: '600px', margin: '0 auto 30px', fontSize: '16px', lineHeight: '1.6', position: 'relative', zIndex: 1 }}>Dapatkan keunggulan kompetitif atas kompetitor Anda dengan notifikasi radar tender instan.</p>
                        <button onClick={onGetStarted} style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: '#fff', border: 'none', padding: '16px 40px', fontSize: '16px', fontWeight: 'bold', borderRadius: '12px', cursor: 'pointer', boxShadow: '0 10px 20px -5px rgba(59, 130, 246, 0.4)', position: 'relative', zIndex: 1 }}
                            onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                            onMouseLeave={(e) => e.target.style.opacity = '1'}>
                            Mulai Uji Coba Gratis Sekarang
                        </button>
                    </div>
                </div>

            </> /* end home page */}

            {/* ===== PREMIUM FOOTER ===== */}
            <PremiumFooter adminSettings={adminSettings} onNavigate={onNavigate} />
            <Chatbot adminSettings={adminSettings} />
        </div>
    );
};

const getTahapStyle = (tahap) => {
    if (!tahap) {
        return {
            color: '#9ca3af',
            background: 'rgba(156, 163, 175, 0.1)',
            border: '1px solid rgba(156, 163, 175, 0.15)',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: '600',
            display: 'inline-block'
        };
    }
    const lower = tahap.toLowerCase();
    let color = '#818cf8';
    let bg = 'rgba(129, 140, 248, 0.1)';
    let border = '1px solid rgba(129, 140, 248, 0.2)';

    if (lower.includes('gagal') || lower.includes('batal') || lower.includes('dibatalkan')) {
        color = '#f87171';
        bg = 'rgba(239, 68, 68, 0.12)';
        border = '1px solid rgba(239, 68, 68, 0.25)';
    } else if (lower.includes('ulang')) {
        color = '#fbbf24';
        bg = 'rgba(251, 191, 36, 0.12)';
        border = '1px solid rgba(251, 191, 36, 0.25)';
    } else if (lower.includes('selesai')) {
        color = '#34d399';
        bg = 'rgba(52, 211, 153, 0.12)';
        border = '1px solid rgba(52, 211, 153, 0.25)';
    } else if (lower.includes('pengumuman') || lower.includes('pendaftaran') || lower.includes('kirim') || lower.includes('penawaran') || lower.includes('evaluasi')) {
        color = '#60a5fa';
        bg = 'rgba(96, 165, 250, 0.12)';
        border = '1px solid rgba(96, 165, 250, 0.25)';
    }

    return {
        color,
        background: bg,
        border,
        padding: '2px 8px',
        borderRadius: '4px',
        fontSize: '11px',
        fontWeight: '600',
        display: 'inline-block'
    };
};

const renderTenderTitle = (name) => {
    if (!name) return "";

    // Regex to match SPSE badge spans with arbitrary class variants (e.g. class='badge  badge-warning')
    const spanRegex = /<span\s+class=\s*['"]\s*badge\s+[^'"]*['"]\s*>(.*?)<\/span>/gi;
    let match;
    const badges = [];

    // Extract all status texts from raw name spans
    while ((match = spanRegex.exec(name)) !== null) {
        if (match[1]) {
            badges.push(match[1].trim());
        }
    }

    // Strip all the HTML span tags from the title to obtain the clean title
    const cleanTitle = name.replace(spanRegex, '').trim();

    return (
        <>
            <span dangerouslySetInnerHTML={{ __html: cleanTitle }}></span>
            {badges.map((badgeText, idx) => {
                const style = getTahapStyle(badgeText);
                return (
                    <span key={idx} style={{
                        ...style,
                        marginLeft: '8px',
                        fontSize: '11px',
                        padding: '2px 6px',
                        verticalAlign: 'middle',
                        textTransform: 'uppercase',
                        marginTop: '2px',
                        display: 'inline-block'
                    }}>
                        {badgeText}
                    </span>
                );
            })}
        </>
    );
};

function App() {
    const [publicView, setPublicView] = useState('landing'); // 'landing', 'tenders', 'auth'
    const [landingPage, setLandingPage] = useState('home'); // 'home' | 'contact' | 'privacy' | 'terms'
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [analytics, setAnalytics] = useState(null);
    const [isRegistering, setIsRegistering] = useState(false);

    useEffect(() => {
        setAgreeTerms(false);
    }, [isRegistering]);

    // Auth & Session States
    const [userToken, setUserToken] = useState(localStorage.getItem('user_token') || null);
    const [currentUser, setCurrentUser] = useState(null);
    const [authEmail, setAuthEmail] = useState('');
    const [authPassword, setAuthPassword] = useState('');
    const [authWhatsapp, setAuthWhatsapp] = useState('');
    const [authMsg, setAuthMsg] = useState(null);
    const [authMode, setAuthMode] = useState('login'); // 'login' | 'register' | 'forgot' | 'reset'
    const [showAuthPassword, setShowAuthPassword] = useState(false);


    // Forgot & Reset Password States
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotMsg, setForgotMsg] = useState(null);
    const [isSubmittingForgot, setIsSubmittingForgot] = useState(false);
    const [resetToken, setResetToken] = useState('');
    const [resetNewPassword, setResetNewPassword] = useState('');
    const [resetConfirmPassword, setResetConfirmPassword] = useState('');
    const [resetMsg, setResetMsg] = useState(null);
    const [isVerifyingResetToken, setIsVerifyingResetToken] = useState(false);
    const [isResetTokenValid, setIsResetTokenValid] = useState(false);
    const [isSubmittingReset, setIsSubmittingReset] = useState(false);


    // Bookmarks & Alerts Settings
    const [alertInstansi, setAlertInstansi] = useState('nasional');
    const [bookmarks, setBookmarks] = useState([]);
    const [bookmarkSearch, setBookmarkSearch] = useState('');
    const [bookmarkFilterKategori, setBookmarkFilterKategori] = useState('');
    const [bookmarkFilterTipe, setBookmarkFilterTipe] = useState('');
    const [bookmarkFilterJenis, setBookmarkFilterJenis] = useState('');
    const [bookmarkFilterTahun, setBookmarkFilterTahun] = useState('');

    // Admin WhatsApp Settings & Logs
    const [whatsappTestNum, setWhatsappTestNum] = useState('');
    const [isTestingWa, setIsTestingWa] = useState(false);
    const [waTestResult, setWaTestResult] = useState(null);
    const [adminLogs, setAdminLogs] = useState('');
    const [isLoadingLogs, setIsLoadingLogs] = useState(false);

    // Admin Vouchers & Pricing Settings
    const [vouchers, setVouchers] = useState([]);
    const [voucherCode, setVoucherCode] = useState('');
    const [voucherType, setVoucherType] = useState('percent');
    const [voucherValue, setVoucherValue] = useState(10);
    const [voucherMaxUses, setVoucherMaxUses] = useState(100);
    const [voucherExpiresAt, setVoucherExpiresAt] = useState('');
    const [voucherMsg, setVoucherMsg] = useState(null);
    const [isCreatingVoucher, setIsCreatingVoucher] = useState(false);

    // Dynamic LPSE Instances Settings
    const [lpseInstances, setLpseInstances] = useState([]);
    const [newLpseName, setNewLpseName] = useState('');
    const [newLpseSlug, setNewLpseSlug] = useState('');
    const [newLpseJenis, setNewLpseJenis] = useState('');
    const [lpseMsg, setLpseMsg] = useState(null);
    const [editingLpseSlug, setEditingLpseSlug] = useState(null);
    const [editLpseData, setEditLpseData] = useState({ name: '', slug: '', jenis: '' });

    // Billing Coupon Settings
    const [couponInput30, setCouponInput30] = useState('');
    const [couponInput365, setCouponInput365] = useState('');
    const [appliedVoucher30, setAppliedVoucher30] = useState(null);
    const [appliedVoucher365, setAppliedVoucher365] = useState(null);
    const [voucherError30, setVoucherError30] = useState(null);
    const [voucherError365, setVoucherError365] = useState(null);
    const [isValidatingVoucher30, setIsValidatingVoucher30] = useState(false);
    const [isValidatingVoucher365, setIsValidatingVoucher365] = useState(false);

    // Article States
    const [selectedArticleSlug, setSelectedArticleSlug] = useState(null);
    const [selectedArticleLpseSlug, setSelectedArticleLpseSlug] = useState(null);
    const [adminArticles, setAdminArticles] = useState([]);
    const [publicArticles, setPublicArticles] = useState([]);
    const [latestArticles, setLatestArticles] = useState([]);
    const [isLoadingArticles, setIsLoadingArticles] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [editingArticleId, setEditingArticleId] = useState(null);
    const [articleMsg, setArticleMsg] = useState(null);
    const [adminArticleForm, setAdminArticleForm] = useState({
        title: '',
        slug: '',
        content: '',
        meta_title: '',
        meta_description: '',
        meta_keywords: '',
        is_pinned: 0,
        is_published: 1,
        image_url: '',
        youtube_embed: ''
    });

    // Server Monitoring & Telemetry States
    const [serverMonitoring, setServerMonitoring] = useState(null);
    const [isLoadingMonitoring, setIsLoadingMonitoring] = useState(false);
    const [isForceRunningScheduler, setIsForceRunningScheduler] = useState(false);
    const [forceRunMsg, setForceRunMsg] = useState(null);
    const [maintenanceMsgInput, setMaintenanceMsgInput] = useState('');
    const [isSavingMaintenance, setIsSavingMaintenance] = useState(false);
    const [maintenanceSaveMsg, setMaintenanceSaveMsg] = useState(null);

    // Explorer States
    const [tenders, setTenders] = useState([]);
    // Dynamic Fiscal Years Generator
    const currentYear = new Date().getFullYear();
    const dynamicYears = Array.from({ length: 5 }, (_, i) => String(currentYear + 1 - i));

    const [totalTenders, setTotalTenders] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [explorerFilterJenisInstansi, setExplorerFilterJenisInstansi] = useState('');
    const [filterKategori, setFilterKategori] = useState('');
    const [filterTipe, setFilterTipe] = useState('');
    const [filterJenis, setFilterJenis] = useState('');
    const [filterTahun, setFilterTahun] = useState(String(currentYear));
    const [filterTahap, setFilterTahap] = useState('');
    const [limit, setLimit] = useState(10);
    const [offset, setOffset] = useState(0);
    const [selectedTender, setSelectedTender] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isLoadingExplorer, setIsLoadingExplorer] = useState(false);

    // Instansi States
    const [searchInstansi, setSearchInstansi] = useState('');
    const [filterJenisInstansi, setFilterJenisInstansi] = useState('');

    // Keyword Tenders States
    const [keywordTenders, setKeywordTenders] = useState([]);
    const [totalKeywordTenders, setTotalKeywordTenders] = useState(0);
    const [keywordLimit, setKeywordLimit] = useState(10);
    const [keywordOffset, setKeywordOffset] = useState(0);
    const [isLoadingKeywordTenders, setIsLoadingKeywordTenders] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Public Tender Detail States
    const [publicTenderNomor, setPublicTenderNomor] = useState(null);
    const [publicTenderData, setPublicTenderData] = useState(null);
    const [isLoadingPublicTender, setIsLoadingPublicTender] = useState(false);
    const [publicTenderError, setPublicTenderError] = useState(null);

    const fetchPublicTender = async (nomor) => {
        if (!nomor) return;
        setIsLoadingPublicTender(true);
        setPublicTenderError(null);
        try {
            const res = await fetch(`/api/tenders/${nomor}`);
            if (res.ok) {
                const data = await res.json();
                setPublicTenderData(data);
            } else {
                setPublicTenderData(null);
                setPublicTenderError("Detail tender tidak ditemukan.");
            }
        } catch (err) {
            console.error("Failed to fetch public tender:", err);
            setPublicTenderError("Gagal memuat detail tender.");
        } finally {
            setIsLoadingPublicTender(false);
        }
    };

    // Alerts States
    const [alerts, setAlerts] = useState([]);
    const [alertKeyword, setAlertKeyword] = useState('');
    const [alertEmail, setAlertEmail] = useState('');
    const [alertWhatsapp, setAlertWhatsapp] = useState('');
    const [isSubmittingAlert, setIsSubmittingAlert] = useState(false);
    const [waActivationModal, setWaActivationModal] = useState(null); // { alert_id, whatsapp, app_name, activation_url, whatsapp_registered }
    const [isEditingModalWa, setIsEditingModalWa] = useState(false);
    const [editingModalWaValue, setEditingModalWaValue] = useState('');
    const [isSavingModalWa, setIsSavingModalWa] = useState(false);
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        confirmText: 'Ya, Hapus',
        cancelText: 'Batal',
        onConfirm: null
    });

    // Competitor Analysis States
    const [competitorSearch, setCompetitorSearch] = useState('');
    const [competitorSuggestions, setCompetitorSuggestions] = useState([]);
    const [selectedCompetitorName, setSelectedCompetitorName] = useState(null);
    const [competitorProfile, setCompetitorProfile] = useState(null);
    const [isLoadingCompetitor, setIsLoadingCompetitor] = useState(false);
    const [competitorDisqualifications, setCompetitorDisqualifications] = useState(null);
    const [isLoadingDisqualifications, setIsLoadingDisqualifications] = useState(false);
    const [competitorSubTab, setCompetitorSubTab] = useState('overview'); // 'overview' or 'disqualifications'

    const fetchCompetitorSuggestions = async (query) => {
        if (query.trim().length < 2) {
            setCompetitorSuggestions([]);
            return;
        }
        try {
            const res = await fetch(`/api/competitors/search?q=${encodeURIComponent(query)}`);
            if (res.ok) {
                const data = await res.json();
                setCompetitorSuggestions(data);
            }
        } catch (err) {
            console.error("Failed to fetch competitor suggestions:", err);
        }
    };

    const fetchCompetitorProfile = async (compName) => {
        setIsLoadingCompetitor(true);
        try {
            const res = await fetch(`/api/competitors/profile?name=${encodeURIComponent(compName)}`);
            if (res.ok) {
                const data = await res.json();
                setCompetitorProfile(data);
            }
        } catch (err) {
            console.error("Failed to fetch competitor profile:", err);
        } finally {
            setIsLoadingCompetitor(false);
        }
    };

    const fetchCompetitorDisqualifications = async (compName) => {
        setIsLoadingDisqualifications(true);
        try {
            const res = await authFetch(`/api/competitors/disqualifications?name=${encodeURIComponent(compName)}`);
            if (res.ok) {
                const data = await res.json();
                setCompetitorDisqualifications(data);
            }
        } catch (err) {
            console.error("Failed to fetch competitor disqualifications:", err);
        } finally {
            setIsLoadingDisqualifications(false);
        }
    };

    const handleOpenCompetitorProfile = (name) => {
        setSelectedCompetitorName(name);
        setCompetitorProfile(null);
        setCompetitorDisqualifications(null);
        setCompetitorSubTab('overview');
        setActiveTab('competitor-profile');
        setIsDrawerOpen(false); // Close drawer if open
        fetchCompetitorProfile(name);
        fetchCompetitorDisqualifications(name);
    };


    // Control Panel States
    const [crawlTipe, setCrawlTipe] = useState('tender');
    const [crawlKategori, setCrawlKategori] = useState('nasional');
    const [crawlJenis, setCrawlJenis] = useState('');
    const [crawlTahun, setCrawlTahun] = useState(String(currentYear));
    const [crawlLimit, setCrawlLimit] = useState(10);
    const [crawlQuery, setCrawlQuery] = useState('');
    const [crawlStart, setCrawlStart] = useState(0);
    const [isCrawling, setIsCrawling] = useState(false);
    const [crawlResult, setCrawlResult] = useState(null);
    const [crawlLogs, setCrawlLogs] = useState([]);

    // Admin Settings States
    const [adminSubTab, setAdminSubTab] = useState('branding');
    const [adminSettings, setAdminSettings] = useState({
        app_name: 'Spy SPSE', app_logo: '🕵🏼‍♂️', trial_days: '7',
        app_tagline: 'Solusi Praktis Menangkan Tender Pemerintah',
        seo_description: 'Spy SPSE adalah platform intelijen dan monitoring tender LPSE Indonesia terdepan. Pantau peluang pengadaan barang/jasa, analisis kompetitor, notifikasi WhatsApp realtime, dan wujudkan strategi menang tender pemerintah secara praktis dan otomatis.',
        seo_keywords: 'spy spse, lpse, monitoring tender, pengadaan barang jasa, tender pemerintah, lkpp, tender indonesia, pantau lpse, analisis kompetitor tender, e-procurement, tender online, sirup lkpp, tender konstruksi, tender jasa konsultansi',
        geo_placename: 'Indonesia',
        smtp_host: '', smtp_port: '587', smtp_user: '', smtp_password: '', smtp_sender: '',
        whatsapp_api_token: '', whatsapp_sender: 'Fonnte',
        midtrans_server_key: '', midtrans_client_key: '', midtrans_is_production: 'false',
        premium_price: '150000', premium_price_yearly: '1500000',
        contact_whatsapp: '', contact_email: '', contact_maps_embed: '',
        chatbot_active: 'true', chatbot_name: 'Nadia', chatbot_avatar: '',
        chatbot_initial_greeting: 'Halo! Saya Nadia, asisten virtual Spy SPSE. Ada yang bisa saya bantu terkait pemantauan tender LPSE?',
        chatbot_ask_name_message: 'Boleh tahu siapa nama Anda?',
        chatbot_ask_phone_message: 'Boleh minta nomor WhatsApp Anda yang aktif? (Contoh: 08123456789)',
        chatbot_ask_email_message: 'Bisa infokan juga alamat email Anda?',
        chatbot_ask_reason_message: 'Terima kasih! Silakan ceritakan apa yang ingin Anda tanyakan atau konsultasikan mengenai pemantauan tender LPSE?',
        chatbot_final_message: 'Terima kasih! Informasi Anda sudah kami simpan. Silakan klik tombol di bawah untuk langsung terhubung dengan tim teknis kami di WhatsApp.'
    });
    const [leads, setLeads] = useState([]);
    const [isLoadingLeads, setIsLoadingLeads] = useState(false);
    const [isSavingSettings, setIsSavingSettings] = useState(false);
    const [brandingSaveMsg, setBrandingSaveMsg] = useState(null);
    const [waSaveMsg, setWaSaveMsg] = useState(null);
    const [smtpSaveMsg, setSmtpSaveMsg] = useState(null);
    const [midtransSaveMsg, setMidtransSaveMsg] = useState(null);
    const [pricingSaveMsg, setPricingSaveMsg] = useState(null);
    const [contactSaveMsg, setContactSaveMsg] = useState(null);
    const [chatbotSaveMsg, setChatbotSaveMsg] = useState(null);
    const [proxySaveMsg, setProxySaveMsg] = useState(null);
    const [isTestingProxy, setIsTestingProxy] = useState(false);
    const [proxyTestResult, setProxyTestResult] = useState(null);

    const getYearlySavingsPercent = () => {
        const monthly = parseInt(adminSettings.premium_price) || 150000;
        const yearly = parseInt(adminSettings.premium_price_yearly) || 1500000;
        if (!monthly || monthly <= 0) return 0;
        const savings = ((monthly * 12 - yearly) / (monthly * 12)) * 100;
        return Math.max(0, Math.round(savings));
    };
    const [smtpTestEmail, setSmtpTestEmail] = useState('');
    const [isTestingSmtp, setIsTestingSmtp] = useState(false);
    const [smtpTestResult, setSmtpTestResult] = useState(null);
    const [adminDashboard, setAdminDashboard] = useState(null);
    const [adminUsers, setAdminUsers] = useState([]);
    const [editUserModal, setEditUserModal] = useState(null); // { id, email, plan_type, status }
    const [editUserForm, setEditUserForm] = useState({ plan_type: 'premium', status: 'active', duration_days: 30 });
    const [editUserMsg, setEditUserMsg] = useState(null);
    const [deleteUserConfirm, setDeleteUserConfirm] = useState(null); // user object
    const [changePasswordModal, setChangePasswordModal] = useState(null); // { id, email }
    const [newPassword, setNewPassword] = useState('');
    const [passwordMsg, setPasswordMsg] = useState(null);

    // Admin User Filter States
    const [userSearchQuery, setUserSearchQuery] = useState('');
    const [userFilterPlan, setUserFilterPlan] = useState('');
    const [userFilterStatus, setUserFilterStatus] = useState('');
    const [userFilterRole, setUserFilterRole] = useState('');

    // Create User & Notify States
    const [createUserModal, setCreateUserModal] = useState(false);
    const [createUserForm, setCreateUserForm] = useState({
        email: '', password: '', role: 'user', whatsapp: '', plan_type: 'trial', duration_days: 30
    });
    const [createUserMsg, setCreateUserMsg] = useState(null);
    const [notifyMsg, setNotifyMsg] = useState(null);

    const isMonthlyActive = currentUser?.subscription?.plan_type === 'premium' && currentUser?.subscription?.duration_days === 30 && currentUser?.subscription?.status === 'active';
    const isYearlyActive = currentUser?.subscription?.plan_type === 'premium' && currentUser?.subscription?.duration_days === 365 && currentUser?.subscription?.status === 'active';
    const isTrialActive = currentUser?.subscription?.plan_type === 'trial' && currentUser?.subscription?.status === 'active';

    // Auth HTTP Fetch Wrapper
    const authFetch = async (url, options = {}) => {
        const token = localStorage.getItem('user_token');
        const headers = {
            ...options.headers,
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        try {
            const res = await fetch(url, { ...options, headers });
            if (res.status === 401) {
                localStorage.removeItem('user_token');
                setUserToken(null);
                setCurrentUser(null);
            }
            return res;
        } catch (err) {
            throw err;
        }
    };

    const fetchLeads = async () => {
        setIsLoadingLeads(true);
        try {
            const res = await authFetch('/api/admin/contact-submissions');
            if (res.ok) {
                const data = await res.json();
                setLeads(data.data || []);
            }
        } catch (err) {
            console.error('Failed to fetch leads:', err);
        } finally {
            setIsLoadingLeads(false);
        }
    };

    const fetchCurrentUser = async () => {
        const token = localStorage.getItem('user_token');
        if (!token) return;
        try {
            const res = await authFetch('/api/auth/me');
            if (res.ok) {
                const data = await res.json();
                setCurrentUser(data);
            }
        } catch (err) {
            console.error("Failed to fetch user:", err);
        }
    };

    const fetchBookmarks = async () => {
        try {
            const res = await authFetch('/api/bookmarks');
            if (res.ok) {
                const data = await res.json();
                setBookmarks(data);
            }
        } catch (err) {
            console.error("Failed to fetch bookmarks:", err);
        }
    };

    const handleAddBookmark = async (nomor) => {
        try {
            const res = await authFetch('/api/bookmarks', {
                method: 'POST',
                body: JSON.stringify({ nomor_pengadaan: nomor })
            });
            if (res.ok) {
                fetchBookmarks();
            }
        } catch (err) {
            console.error("Failed to add bookmark:", err);
        }
    };

    const handleRemoveBookmark = (nomor, namaTender) => {
        setConfirmModal({
            isOpen: true,
            title: 'Hapus Bookmark',
            message: `Apakah Anda yakin ingin menghapus tender <strong style="color: #fff">"${namaTender || nomor}"</strong> dari Saved Bookmarks Anda?`,
            confirmText: 'Ya, Hapus',
            cancelText: 'Batal',
            onConfirm: async () => {
                try {
                    const res = await authFetch(`/api/bookmarks/${nomor}`, {
                        method: 'DELETE'
                    });
                    if (res.ok) {
                        fetchBookmarks();
                    }
                } catch (err) {
                    console.error("Failed to remove bookmark:", err);
                }
            }
        });
    };

    const loadSnapScript = (clientKey, isProduction) => {
        return new Promise((resolve) => {
            if (window.snap) {
                resolve(true);
                return;
            }
            const snapUrl = isProduction === 'true'
                ? "https://app.midtrans.com/snap/snap.js"
                : "https://app.sandbox.midtrans.com/snap/snap.js";

            const script = document.createElement("script");
            script.src = snapUrl;
            script.setAttribute("data-client-key", clientKey);
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleCheckoutPremium = async (days = 30, voucherCode = null) => {
        try {
            const res = await authFetch('/api/billing/checkout', {
                method: 'POST',
                body: JSON.stringify({ plan_type: 'premium', duration_days: days, voucher_code: voucherCode })
            });
            const data = await res.json();
            if (res.ok) {
                if (data.snap_token === "free-voucher-upgrade") {
                    alert(data.message || "Upgrade gratis menggunakan voucher diskon 100% sukses!");
                    fetchCurrentUser();
                    if (days === 30) {
                        setAppliedVoucher30(null);
                        setCouponInput30('');
                    } else {
                        setAppliedVoucher365(null);
                        setCouponInput365('');
                    }
                } else if (data.snap_token.startsWith("mock-snap-token-")) {
                    const simSuccess = confirm(
                        `[MODE SIMULASI PEMBAYARAN MIDTRANS]\n\n` +
                        `Token Snap: ${data.snap_token}\n` +
                        `Order ID: ${data.order_id}\n\n` +
                        `Apakah Anda ingin mensimulasikan transaksi sukses via webhook lokal?`
                    );
                    if (simSuccess) {
                        const hookRes = await fetch('/api/payment/notification', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                order_id: data.order_id,
                                transaction_status: 'settlement',
                                status_code: '200'
                            })
                        });
                        const hookData = await hookRes.json();
                        if (hookRes.ok) {
                            alert("Simulasi pembayaran sukses! Akun Premium Anda berhasil diaktifkan.");
                            fetchCurrentUser();
                            if (days === 30) {
                                setAppliedVoucher30(null);
                                setCouponInput30('');
                            } else {
                                setAppliedVoucher365(null);
                                setCouponInput365('');
                            }
                        } else {
                            alert("Simulasi gagal: " + hookData.detail);
                        }
                    }
                } else {
                    const clientKey = adminSettings.midtrans_client_key;
                    const isProduction = adminSettings.midtrans_is_production;

                    if (!clientKey) {
                        alert("Kesalahan: Client Key Midtrans belum diisi oleh Super Admin.");
                        return;
                    }

                    const loaded = await loadSnapScript(clientKey, isProduction);
                    if (!loaded) {
                        alert("Gagal memuat library Midtrans Snap.");
                        return;
                    }

                    window.snap.pay(data.snap_token, {
                        onSuccess: async function (result) {
                            try {
                                await authFetch('/api/billing/verify-payment', {
                                    method: 'POST',
                                    body: JSON.stringify({ order_id: data.order_id })
                                });
                            } catch (err) {
                                console.error("Gagal memverifikasi pembayaran:", err);
                            }
                            fetchCurrentUser();
                            if (days === 30) {
                                setAppliedVoucher30(null);
                                setCouponInput30('');
                            } else {
                                setAppliedVoucher365(null);
                                setCouponInput365('');
                            }
                            setConfirmModal({
                                isOpen: true,
                                type: 'success',
                                icon: '🎉',
                                title: '🎉 Pembayaran Berhasil!',
                                message: `<div style="text-align: center;"><span style="font-size: 48px;">✅</span><p style="margin-top: 15px; color: #fff; font-size: 16px; font-weight: 600;">Pembayaran berhasil diselesaikan!</p><p style="color: #9ca3af; font-size: 14px;">Masa aktif Premium Anda telah diaktifkan secara otomatis. Terima kasih.</p></div>`,
                                confirmText: 'Mulai Pantau Tender',
                                cancelText: null,
                                onConfirm: () => {
                                    window.location.hash = '#/dashboard';
                                    setActiveTab('dashboard');
                                }
                            });
                        },
                        onPending: function (result) {
                            fetchCurrentUser();
                            setConfirmModal({
                                isOpen: true,
                                type: 'info',
                                icon: '⏳',
                                title: '⏳ Pembayaran Pending',
                                message: `<div style="text-align: center;"><p style="color: #fff; font-size: 15px; font-weight: 600;">Menunggu penyelesaian pembayaran Anda.</p><p style="color: #9ca3af; font-size: 13px;">Silakan selesaikan transaksi sesuai petunjuk di invoice pembayaran Midtrans Anda.</p></div>`,
                                confirmText: 'Mengerti',
                                cancelText: null,
                                onConfirm: () => { }
                            });
                        },
                        onError: function (result) {
                            setConfirmModal({
                                isOpen: true,
                                type: 'danger',
                                icon: '❌',
                                title: '❌ Pembayaran Gagal',
                                message: `<div style="text-align: center;"><p style="color: #fff; font-size: 15px; font-weight: 600;">Transaksi Gagal</p><p style="color: #9ca3af; font-size: 13px;">Pembayaran gagal diselesaikan. Silakan coba kembali atau gunakan metode pembayaran lain.</p></div>`,
                                confirmText: 'Tutup',
                                cancelText: null,
                                onConfirm: () => { }
                            });
                        },
                        onClose: function () {
                            setConfirmModal({
                                isOpen: true,
                                type: 'info',
                                icon: 'ℹ️',
                                title: 'ℹ️ Pembayaran Dibatalkan',
                                message: `<div style="text-align: center;"><p style="color: #9ca3af; font-size: 14px;">Anda telah menutup jendela pembayaran Snap sebelum menyelesaikan transaksi.</p></div>`,
                                confirmText: 'Tutup',
                                cancelText: null,
                                onConfirm: () => { }
                            });
                        }
                    });
                }
            } else {
                alert(data.detail || "Upgrade gagal.");
            }
        } catch (err) {
            console.error("Failed to checkout:", err);
        }
    };

    const fetchVouchers = async () => {
        try {
            const res = await authFetch('/api/admin/vouchers');
            if (res.ok) {
                const data = await res.json();
                setVouchers(data);
            }
        } catch (err) {
            console.error('Failed to fetch vouchers:', err);
        }
    };

    const handleCreateVoucher = async (e) => {
        e.preventDefault();
        if (!voucherCode || !voucherValue) return;
        setIsCreatingVoucher(true);
        setVoucherMsg(null);
        try {
            const res = await authFetch('/api/admin/vouchers', {
                method: 'POST',
                body: JSON.stringify({
                    code: voucherCode,
                    discount_type: voucherType,
                    discount_value: parseFloat(voucherValue),
                    max_uses: parseInt(voucherMaxUses),
                    expires_at: voucherExpiresAt || null
                })
            });
            const data = await res.json();
            if (res.ok) {
                setVoucherMsg({ type: 'success', text: data.message });
                setVoucherCode('');
                setVoucherValue(10);
                setVoucherMaxUses(100);
                setVoucherExpiresAt('');
                fetchVouchers();
            } else {
                setVoucherMsg({ type: 'error', text: data.detail || 'Gagal membuat voucher.' });
            }
        } catch (err) {
            setVoucherMsg({ type: 'error', text: 'Kesalahan jaringan.' });
        } finally {
            setIsCreatingVoucher(false);
        }
    };

    const handleDeleteVoucher = (code) => {
        setConfirmModal({
            isOpen: true,
            title: 'Hapus Voucher',
            message: `Apakah Anda yakin ingin menghapus voucher diskon <strong style="color: #fff">"${code}"</strong>?`,
            confirmText: 'Ya, Hapus',
            cancelText: 'Batal',
            onConfirm: async () => {
                try {
                    const res = await authFetch(`/api/admin/vouchers/${code}`, {
                        method: 'DELETE'
                    });
                    if (res.ok) {
                        fetchVouchers();
                    } else {
                        const data = await res.json();
                        alert(data.detail || 'Gagal menghapus voucher.');
                    }
                } catch (err) {
                    console.error('Failed to delete voucher:', err);
                }
            }
        });
    };

    const handleValidateVoucher = async (durationDays) => {
        const code = durationDays === 30 ? couponInput30 : couponInput365;
        const setApplied = durationDays === 30 ? setAppliedVoucher30 : setAppliedVoucher365;
        const setError = durationDays === 30 ? setVoucherError30 : setVoucherError365;
        const setIsValidating = durationDays === 30 ? setIsValidatingVoucher30 : setIsValidatingVoucher365;

        if (!code.trim()) return;

        setIsValidating(true);
        setError(null);
        setApplied(null);

        try {
            const res = await fetch('/api/billing/voucher/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code, duration_days: durationDays })
            });
            const data = await res.json();
            if (res.ok) {
                setApplied(data);
            } else {
                setError(data.detail || 'Voucher tidak valid.');
            }
        } catch (err) {
            setError('Kesalahan koneksi jaringan.');
        } finally {
            setIsValidating(false);
        }
    };
    const fetchAdminLogs = async () => {
        setIsLoadingLogs(true);
        try {
            const res = await authFetch('/api/admin/logs');
            if (res.ok) {
                const data = await res.json();
                setAdminLogs(data.logs);
            }
        } catch (err) {
            console.error("Failed to fetch logs:", err);
        } finally {
            setIsLoadingLogs(false);
        }
    };

    const handleTestWhatsapp = async (e) => {
        e.preventDefault();
        if (!whatsappTestNum) return;
        setIsTestingWa(true);
        setWaTestResult(null);
        try {
            const res = await authFetch('/api/admin/settings/test-whatsapp', {
                method: 'POST',
                body: JSON.stringify({
                    to_whatsapp: whatsappTestNum,
                    whatsapp_api_token: adminSettings.whatsapp_api_token
                })
            });
            const data = await res.json();
            if (res.ok) {
                setWaTestResult({ type: 'success', text: data.message });
            } else {
                setWaTestResult({ type: 'error', text: data.detail || 'Gagal.' });
            }
        } catch (err) {
            setWaTestResult({ type: 'error', text: 'Kesalahan jaringan.' });
        } finally {
            setIsTestingWa(false);
        }
    };

    const [waStatus, setWaStatus] = useState(null);
    const [isCheckingWaStatus, setIsCheckingWaStatus] = useState(false);

    const fetchWaStatus = async (customToken = null) => {
        setIsCheckingWaStatus(true);
        try {
            let res;
            if (customToken !== null) {
                res = await authFetch('/api/admin/settings/whatsapp-status', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ whatsapp_api_token: customToken })
                });
            } else {
                res = await authFetch('/api/admin/settings/whatsapp-status');
            }
            if (res.ok) {
                const data = await res.json();
                setWaStatus(data);
            } else {
                setWaStatus({ status: 'error', connected: false, message: 'Gagal mengecek status ke server.' });
            }
        } catch (e) {
            setWaStatus({ status: 'error', connected: false, message: 'Gagal koneksi ke server.' });
        } finally {
            setIsCheckingWaStatus(false);
        }
    };

    const [smtpStatus, setSmtpStatus] = useState(null);
    const [isCheckingSmtpStatus, setIsCheckingSmtpStatus] = useState(false);

    const fetchSmtpStatus = async (customConfig = null) => {
        setIsCheckingSmtpStatus(true);
        try {
            let res;
            if (customConfig !== null) {
                res = await authFetch('/api/admin/settings/smtp-status', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(customConfig)
                });
            } else {
                res = await authFetch('/api/admin/settings/smtp-status');
            }
            if (res.ok) {
                const data = await res.json();
                setSmtpStatus(data);
            } else {
                setSmtpStatus({ status: 'error', connected: false, message: 'Gagal mengecek status SMTP.' });
            }
        } catch (e) {
            setSmtpStatus({ status: 'error', connected: false, message: 'Gagal koneksi server.' });
        } finally {
            setIsCheckingSmtpStatus(false);
        }
    };

    const [midtransStatus, setMidtransStatus] = useState(null);
    const [isCheckingMidtransStatus, setIsCheckingMidtransStatus] = useState(false);

    const fetchMidtransStatus = async (customConfig = null) => {
        setIsCheckingMidtransStatus(true);
        try {
            let res;
            if (customConfig !== null) {
                res = await authFetch('/api/admin/settings/midtrans-status', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(customConfig)
                });
            } else {
                res = await authFetch('/api/admin/settings/midtrans-status');
            }
            if (res.ok) {
                const data = await res.json();
                setMidtransStatus(data);
            } else {
                setMidtransStatus({ status: 'error', connected: false, message: 'Gagal mengecek status Midtrans.' });
            }
        } catch (e) {
            setMidtransStatus({ status: 'error', connected: false, message: 'Gagal koneksi server.' });
        } finally {
            setIsCheckingMidtransStatus(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'admin') {
            if (adminSubTab === 'communication') {
                fetchWaStatus();
                fetchSmtpStatus();
            } else if (adminSubTab === 'payment') {
                fetchMidtransStatus();
            }
        }
    }, [activeTab, adminSubTab]);

    const handleAuthSubmit = async (e) => {
        e.preventDefault();
        setAuthMsg(null);
        if (isRegistering && !agreeTerms) {
            setAuthMsg({ type: 'error', text: 'Anda harus menyetujui Syarat & Ketentuan serta Kebijakan Privasi untuk mendaftar.' });
            return;
        }
        const url = isRegistering ? '/api/auth/register' : '/api/auth/login';
        const body = isRegistering
            ? { email: authEmail, password: authPassword, whatsapp: authWhatsapp }
            : { email: authEmail, password: authPassword };

        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('user_token', data.access_token);
                setUserToken(data.access_token);
                setAuthEmail('');
                setAuthPassword('');
                setAuthWhatsapp('');
                setAuthMsg({ type: 'success', text: isRegistering ? 'Registrasi Berhasil!' : 'Login Berhasil!' });

                const redirectTo = sessionStorage.getItem('login_redirect');
                if (redirectTo === 'competitors') {
                    sessionStorage.removeItem('login_redirect');
                    window.location.hash = '#/competitors';
                } else {
                    window.location.hash = '#/dashboard';
                }
            } else {
                setAuthMsg({ type: 'error', text: data.detail || 'Terjadi kesalahan.' });
            }
        } catch (err) {
            setAuthMsg({ type: 'error', text: 'Kesalahan jaringan.' });
        }
    };

    const handleForgotPasswordSubmit = async (e) => {
        e.preventDefault();
        setForgotMsg(null);
        setIsSubmittingForgot(true);
        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: forgotEmail })
            });
            const data = await res.json();
            if (res.ok) {
                setForgotMsg({ type: 'success', text: data.message });
            } else {
                setForgotMsg({ type: 'error', text: data.detail || 'Terjadi kesalahan.' });
            }
        } catch (err) {
            setForgotMsg({ type: 'error', text: 'Kesalahan jaringan.' });
        } finally {
            setIsSubmittingForgot(false);
        }
    };

    const verifyResetToken = async (token) => {
        setIsVerifyingResetToken(true);
        setIsResetTokenValid(false);
        setResetMsg(null);
        try {
            const res = await fetch(`/api/auth/verify-reset-token?token=${encodeURIComponent(token)}`);
            const data = await res.json();
            if (res.ok && data.valid) {
                setIsResetTokenValid(true);
            } else {
                setResetMsg({ type: 'error', text: data.detail || 'Tautan reset kata sandi tidak valid atau telah kadaluarsa.' });
            }
        } catch (err) {
            setResetMsg({ type: 'error', text: 'Kesalahan jaringan saat memverifikasi token.' });
        } finally {
            setIsVerifyingResetToken(false);
        }
    };

    const handleResetPasswordSubmit = async (e) => {
        e.preventDefault();
        setResetMsg(null);
        if (resetNewPassword !== resetConfirmPassword) {
            setResetMsg({ type: 'error', text: 'Konfirmasi kata sandi tidak cocok.' });
            return;
        }
        if (resetNewPassword.length < 6) {
            setResetMsg({ type: 'error', text: 'Kata sandi minimal 6 karakter.' });
            return;
        }
        setIsSubmittingReset(true);
        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: resetToken, new_password: resetNewPassword })
            });
            const data = await res.json();
            if (res.ok) {
                setResetMsg({ type: 'success', text: data.message });
                setResetNewPassword('');
                setResetConfirmPassword('');
                setTimeout(() => {
                    setAuthMode('login');
                    setIsRegistering(false);
                    window.location.hash = '#/auth';
                }, 3000);
            } else {
                setResetMsg({ type: 'error', text: data.detail || 'Gagal mereset kata sandi.' });
            }
        } catch (err) {
            setResetMsg({ type: 'error', text: 'Kesalahan jaringan.' });
        } finally {
            setIsSubmittingReset(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user_token');
        setUserToken(null);
        setCurrentUser(null);
        setAlertEmail('');
        setAlertWhatsapp('');
        setActiveTab('dashboard');
        window.location.hash = '#/';
    };

    // Fetch Analytics & User settings on mount/tab change
    useEffect(() => {
        fetchPublicSettings();
        fetchAnalytics();
        if (userToken) {
            fetchCurrentUser();
            fetchBookmarks();
        }
    }, [userToken]);

    // Fetch dashboard stats/analytics when tab is dashboard
    useEffect(() => {
        if (activeTab === 'dashboard') {
            fetchAnalytics();
            if (currentUser?.role === 'admin') {
                fetchAdminDashboard();
            }
        }
    }, [activeTab, currentUser]);

    // Pre-populate alertEmail & alertWhatsapp when currentUser is loaded
    useEffect(() => {
        if (currentUser?.email) {
            setAlertEmail(currentUser.email);
        }
        if (currentUser?.whatsapp) {
            setAlertWhatsapp(currentUser.whatsapp);
        }
    }, [currentUser]);

    // Sync selected LPSE dropdown states to ensure they match dynamic lpseInstances values
    useEffect(() => {
        if (lpseInstances.length > 0) {
            if (alertInstansi !== "all" && !lpseInstances.some(inst => inst.slug === alertInstansi)) {
                setAlertInstansi(lpseInstances[0].slug);
            }
            if (crawlKategori !== "all" && !lpseInstances.some(inst => inst.slug === crawlKategori)) {
                setCrawlKategori(lpseInstances[0].slug);
            }
        }
    }, [lpseInstances, alertInstansi, crawlKategori]);

    // Re-fetch settings/logs when admin tabs are opened
    useEffect(() => {
        if (currentUser?.role === 'admin') {
            fetchAdminSettings();
        }
        if (activeTab === 'admin' && currentUser?.role === 'admin') {
            fetchAdminLogs();
            fetchVouchers();
        }
        if (activeTab === 'users' && currentUser?.role === 'admin') {
            fetchAdminUsers();
        }
        if (activeTab === 'articles' && currentUser?.role === 'admin') {
            fetchAdminArticles();
        }
    }, [activeTab, currentUser]);

    // Auto-refresh polling for server monitoring tab (every 5 seconds)
    useEffect(() => {
        let intervalId = null;
        if (activeTab === 'server-monitoring' && currentUser?.role === 'admin') {
            fetchServerMonitoring();
            intervalId = setInterval(() => {
                fetchServerMonitoring();
            }, 5000);
        }
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [activeTab, currentUser]);

    const fetchServerMonitoring = async () => {
        setIsLoadingMonitoring(true);
        try {
            const res = await authFetch('/api/admin/server-monitoring');
            if (res.ok) {
                const data = await res.json();
                setServerMonitoring(data);
                if (!maintenanceMsgInput) {
                    setMaintenanceMsgInput(data.maintenance_message || '');
                }
            }
        } catch (err) {
            console.error('Failed to fetch server monitoring data:', err);
        } finally {
            setIsLoadingMonitoring(false);
        }
    };

    const handleForceRunScheduler = async () => {
        setIsForceRunningScheduler(true);
        setForceRunMsg(null);
        try {
            const res = await authFetch('/api/admin/scheduler/force-run', { method: 'POST' });
            const data = await res.json();
            if (res.ok) {
                setForceRunMsg({ type: 'success', text: data.message });
                fetchServerMonitoring();
            } else {
                setForceRunMsg({ type: 'error', text: data.message || 'Gagal memicu scheduler.' });
            }
        } catch (err) {
            setForceRunMsg({ type: 'error', text: 'Kesalahan jaringan.' });
        } finally {
            setIsForceRunningScheduler(false);
        }
    };

    const handleToggleMaintenance = async (newMode) => {
        setIsSavingMaintenance(true);
        setMaintenanceSaveMsg(null);
        try {
            const res = await authFetch('/api/admin/settings/maintenance', {
                method: 'POST',
                body: JSON.stringify({
                    maintenance_mode: newMode,
                    maintenance_message: maintenanceMsgInput
                })
            });
            const data = await res.json();
            if (res.ok) {
                setMaintenanceSaveMsg({ type: 'success', text: data.message });
                fetchServerMonitoring();
                fetchPublicSettings();
            } else {
                setMaintenanceSaveMsg({ type: 'error', text: data.detail || 'Gagal mengubah status maintenance.' });
            }
        } catch (err) {
            setMaintenanceSaveMsg({ type: 'error', text: 'Kesalahan jaringan.' });
        } finally {
            setIsSavingMaintenance(false);
        }
    };

    const fetchAdminDashboard = async () => {
        try {
            const res = await authFetch('/api/admin/dashboard');
            if (res.ok) {
                const data = await res.json();
                setAdminDashboard(data);
            }
        } catch (err) {
            console.error('Failed to fetch admin dashboard:', err);
        }
    };

    const fetchAdminUsers = async () => {
        try {
            const res = await authFetch('/api/admin/users');
            if (res.ok) {
                const data = await res.json();
                setAdminUsers(data);
            }
        } catch (err) {
            console.error('Failed to fetch admin users:', err);
        }
    };

    const fetchAdminArticles = async () => {
        setIsLoadingArticles(true);
        try {
            const res = await authFetch('/api/admin/articles');
            if (res.ok) {
                const data = await res.json();
                setAdminArticles(data);
            }
        } catch (err) {
            console.error('Failed to fetch admin articles:', err);
        } finally {
            setIsLoadingArticles(false);
        }
    };

    const fetchPublicArticles = async () => {
        setIsLoadingArticles(true);
        try {
            const res = await fetch('/api/public/articles');
            if (res.ok) {
                const data = await res.json();
                setPublicArticles(data);

                // Sort pinned articles first, then latest
                const sorted = [...data].sort((a, b) => b.is_pinned - a.is_pinned);
                setLatestArticles(sorted.slice(0, 3));
            }
        } catch (err) {
            console.error('Failed to fetch public articles:', err);
        } finally {
            setIsLoadingArticles(false);
        }
    };

    const fetchArticleDetail = async (slug) => {
        setIsLoadingArticles(true);
        try {
            const res = await fetch(`/api/public/articles/${slug}`);
            if (res.ok) {
                const data = await res.json();
                setSelectedArticle(data);
            } else {
                setSelectedArticle(null);
            }
        } catch (err) {
            console.error('Failed to fetch article detail:', err);
            setSelectedArticle(null);
        } finally {
            setIsLoadingArticles(false);
        }
    };

    const handleCreateOrUpdateArticle = async (e) => {
        e.preventDefault();
        setArticleMsg(null);
        const url = editingArticleId ? `/api/admin/articles/${editingArticleId}` : '/api/admin/articles';
        const method = editingArticleId ? 'PUT' : 'POST';

        try {
            const res = await authFetch(url, {
                method,
                body: JSON.stringify(adminArticleForm)
            });
            const data = await res.json();
            if (res.ok) {
                setArticleMsg({ type: 'success', text: editingArticleId ? 'Artikel berhasil diperbarui!' : 'Artikel berhasil dibuat!' });
                setEditingArticleId(null);
                setAdminArticleForm({
                    title: '',
                    slug: '',
                    content: '',
                    meta_title: '',
                    meta_description: '',
                    meta_keywords: '',
                    is_pinned: 0,
                    is_published: 1,
                    image_url: '',
                    youtube_embed: ''
                });
                fetchAdminArticles();
                fetchPublicArticles();
            } else {
                setArticleMsg({ type: 'error', text: data.detail || 'Gagal menyimpan artikel.' });
            }
        } catch (err) {
            console.error('Error saving article:', err);
            setArticleMsg({ type: 'error', text: 'Terjadi kesalahan saat menyimpan.' });
        }
    };

    const handleDeleteArticle = async (id) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus artikel ini?')) return;
        try {
            const res = await authFetch(`/api/admin/articles/${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchAdminArticles();
                fetchPublicArticles();
            }
        } catch (err) {
            console.error('Error deleting article:', err);
        }
    };

    const handleArticleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/admin/articles/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('user_token')}`
                },
                body: formData
            });
            const data = await res.json();
            if (res.ok) {
                setAdminArticleForm(p => ({ ...p, image_url: data.url }));
            } else {
                alert(data.detail || 'Gagal mengunggah gambar');
            }
        } catch (err) {
            console.error('Error uploading image:', err);
            alert('Gagal mengunggah gambar');
        }
    };

    // Centralized routing effect
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash || '#/';

            if (hash.startsWith('#/blog')) {
                setSelectedArticleSlug(null);
                setSelectedArticleLpseSlug(null);
                if (userToken) {
                    setActiveTab('blog');
                } else {
                    setPublicView('blog');
                }
            } else if (hash.startsWith('#/artikel/')) {
                const cleanHash = hash.substring(10); // removes "#/artikel/"
                const parts = cleanHash.split('/');
                const slug = parts[0];
                let lpse = null;
                if (parts.length > 1) {
                    if (parts[1] === 'lpse' && parts.length > 2) {
                        lpse = parts[2];
                    } else {
                        lpse = parts[1];
                    }
                }
                setSelectedArticleSlug(slug);
                setSelectedArticleLpseSlug(lpse);
                if (userToken) {
                    setActiveTab('article-detail');
                } else {
                    setPublicView('article-detail');
                }
            } else if (hash.startsWith('#/admin/articles')) {
                setSelectedArticleSlug(null);
                setSelectedArticleLpseSlug(null);
                if (userToken && currentUser?.role === 'admin') {
                    setActiveTab('articles');
                }
            } else if (hash.startsWith('#/admin/users')) {
                setSelectedArticleSlug(null);
                setSelectedArticleLpseSlug(null);
                if (userToken && currentUser?.role === 'admin') {
                    setActiveTab('users');
                }
            } else if (hash.startsWith('#/admin/control')) {
                setSelectedArticleSlug(null);
                setSelectedArticleLpseSlug(null);
                if (userToken && currentUser?.role === 'admin') {
                    setActiveTab('control');
                }
            } else if (hash.startsWith('#/admin/server-monitoring')) {
                setSelectedArticleSlug(null);
                setSelectedArticleLpseSlug(null);
                if (userToken && currentUser?.role === 'admin') {
                    setActiveTab('server-monitoring');
                }
            } else if (hash.startsWith('#/admin/leads')) {
                setSelectedArticleSlug(null);
                setSelectedArticleLpseSlug(null);
                if (userToken && currentUser?.role === 'admin') {
                    setActiveTab('leads');
                    fetchLeads();
                }
            } else if (hash.startsWith('#/admin/company-leads')) {
                setSelectedArticleSlug(null);
                setSelectedArticleLpseSlug(null);
                if (userToken && currentUser?.role === 'admin') {
                    setActiveTab('company-leads');
                }
            } else if (hash.startsWith('#/admin/proxy')) {
                setSelectedArticleSlug(null);
                setSelectedArticleLpseSlug(null);
                if (userToken && currentUser?.role === 'admin') {
                    setActiveTab('proxy');
                }
            } else if (hash.startsWith('#/admin')) {
                setSelectedArticleSlug(null);
                setSelectedArticleLpseSlug(null);
                if (userToken && currentUser?.role === 'admin') {
                    setActiveTab('admin');
                }
            } else if (hash.startsWith('#/explorer') || hash.startsWith('#/tenders')) {
                setSelectedArticleSlug(null);
                setSelectedArticleLpseSlug(null);
                if (userToken) {
                    setActiveTab('explorer');
                } else {
                    setPublicView('tenders');
                }
            } else if (hash.startsWith('#/tender/')) {
                setSelectedArticleSlug(null);
                setSelectedArticleLpseSlug(null);
                const nomor = hash.substring(9).split('?')[0].split('/')[0];
                setPublicTenderNomor(nomor);
                fetchPublicTender(nomor);
                if (userToken) {
                    handleViewTenderDetail(nomor);
                } else {
                    setPublicView('public-tender-detail');
                }
            } else if (hash.startsWith('#/keyword-tenders')) {
                setSelectedArticleSlug(null);
                setSelectedArticleLpseSlug(null);
                if (userToken) {
                    setActiveTab('keyword-tenders');
                }
            } else if (hash.startsWith('#/alerts')) {
                setSelectedArticleSlug(null);
                setSelectedArticleLpseSlug(null);
                if (userToken) {
                    setActiveTab('alerts');
                }
            } else if (hash.startsWith('#/bookmarks')) {
                setSelectedArticleSlug(null);
                setSelectedArticleLpseSlug(null);
                if (userToken) {
                    setActiveTab('bookmarks');
                }
            } else if (hash.startsWith('#/competitors')) {
                setSelectedArticleSlug(null);
                setSelectedArticleLpseSlug(null);
                if (userToken) {
                    setActiveTab('competitors');
                }
            } else if (hash.startsWith('#/instansi')) {
                setSelectedArticleSlug(null);
                setSelectedArticleLpseSlug(null);
                if (userToken) {
                    setActiveTab('instansi');
                }
            } else if (hash.startsWith('#/billing')) {
                setSelectedArticleSlug(null);
                setSelectedArticleLpseSlug(null);
                if (userToken) {
                    setActiveTab('billing');
                }
            } else if (hash.startsWith('#/dashboard')) {
                setSelectedArticleSlug(null);
                setSelectedArticleLpseSlug(null);
                if (userToken) {
                    setActiveTab('dashboard');
                } else {
                    window.location.hash = '#/';
                }
            } else if (hash.startsWith('#/reset-password')) {
                setSelectedArticleSlug(null);
                setSelectedArticleLpseSlug(null);
                const queryStr = hash.includes('?') ? hash.substring(hash.indexOf('?') + 1) : '';
                const params = new URLSearchParams(queryStr);
                const token = params.get('token') || '';
                setResetToken(token);
                setPublicView('auth');
                setAuthMode('reset');
                if (token) {
                    verifyResetToken(token);
                }
            } else if (hash.startsWith('#/forgot-password')) {
                setSelectedArticleSlug(null);
                setSelectedArticleLpseSlug(null);
                if (!userToken) {
                    setPublicView('auth');
                    setAuthMode('forgot');
                } else {
                    window.location.hash = '#/dashboard';
                }
            } else if (hash.startsWith('#/login') || hash.startsWith('#/auth')) {
                setSelectedArticleSlug(null);
                setSelectedArticleLpseSlug(null);
                if (!userToken) {
                    setPublicView('auth');
                    setIsRegistering(false);
                    setAuthMode('login');
                } else {
                    window.location.hash = '#/dashboard';
                }
            } else if (hash.startsWith('#/register')) {
                setSelectedArticleSlug(null);
                setSelectedArticleLpseSlug(null);
                if (!userToken) {
                    setPublicView('auth');
                    setIsRegistering(true);
                    setAuthMode('register');
                } else {
                    window.location.hash = '#/dashboard';
                }
            } else if (hash.startsWith('#/contact')) {
                setSelectedArticleSlug(null);
                setSelectedArticleLpseSlug(null);
                if (!userToken) {
                    setPublicView('landing');
                    setLandingPage('contact');
                }
            } else if (hash.startsWith('#/privacy')) {
                setSelectedArticleSlug(null);
                setSelectedArticleLpseSlug(null);
                if (!userToken) {
                    setPublicView('landing');
                    setLandingPage('privacy');
                }
            } else if (hash.startsWith('#/terms')) {
                setSelectedArticleSlug(null);
                setSelectedArticleLpseSlug(null);
                if (!userToken) {
                    setPublicView('landing');
                    setLandingPage('terms');
                }
            } else if (hash.startsWith('#/pricing')) {
                setSelectedArticleSlug(null);
                setSelectedArticleLpseSlug(null);
                if (!userToken) {
                    setPublicView('landing');
                    setLandingPage('home');
                    setTimeout(() => {
                        const el = document.getElementById('landing-pricing');
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 120);
                }
            } else {
                setSelectedArticleSlug(null);
                setSelectedArticleLpseSlug(null);
                if (userToken) {
                    setActiveTab('dashboard');
                } else {
                    setPublicView('landing');
                    setLandingPage('home');
                }
            }
        };

        window.addEventListener('hashchange', handleHashChange);
        handleHashChange(); // Run once at mount

        return () => window.removeEventListener('hashchange', handleHashChange);
    }, [userToken, currentUser]);

    // Initial public articles load
    useEffect(() => {
        fetchPublicArticles();
    }, []);

    // Load selected article details when slug changes
    useEffect(() => {
        if (selectedArticleSlug) {
            fetchArticleDetail(selectedArticleSlug);
        }
    }, [selectedArticleSlug]);

    // SEO Head Meta update
    useEffect(() => {
        if ((activeTab === 'article-detail' || publicView === 'article-detail') && selectedArticle) {
            const currentLpseName = selectedArticleLpseSlug
                ? (lpseInstances.find(i => i.slug === selectedArticleLpseSlug)?.name || 'Indonesia')
                : 'Indonesia';

            const resolvedTitle = selectedArticle.meta_title
                ? selectedArticle.meta_title.replace(/{lpse_name}/g, currentLpseName)
                : selectedArticle.title.replace(/{lpse_name}/g, currentLpseName);

            const resolvedDesc = selectedArticle.meta_description
                ? selectedArticle.meta_description.replace(/{lpse_name}/g, currentLpseName)
                : selectedArticle.content.substring(0, 160).replace(/{lpse_name}/g, currentLpseName);

            document.title = resolvedTitle + " | " + (adminSettings.app_name || "Spy SPSE");

            let metaDesc = document.querySelector('meta[name="description"]');
            if (!metaDesc) {
                metaDesc = document.createElement('meta');
                metaDesc.setAttribute('name', 'description');
                document.head.appendChild(metaDesc);
            }
            metaDesc.setAttribute('content', resolvedDesc);
        } else {
            document.title = adminSettings.app_name || "TenderKu";
        }
    }, [selectedArticle, selectedArticleLpseSlug, activeTab, publicView, adminSettings, lpseInstances]);


    const getWaMeUrl = (whatsapp, email, role, customPass = null) => {
        const cleanNum = whatsapp ? whatsapp.replace(/\D/g, '') : '';
        const formattedNum = cleanNum.startsWith('0') ? '62' + cleanNum.slice(1) : cleanNum;
        const passText = customPass ? `\n🔑 Password: ${customPass}` : '';
        const text = `🕵🏼‍♂️ *${adminSettings.app_name || 'Spy SPSE'} — Akses Login Anda*\n\nHalo, berikut adalah rincian akses login Anda:\n\n📧 Email: ${email}${passText}\n👤 Role: ${role ? role.toUpperCase() : 'USER'}\n\n🌐 Link Login: http://localhost:5173/auth\n\nSilakan simpan informasi ini dengan aman.`;
        return `https://wa.me/${formattedNum}?text=${encodeURIComponent(text)}`;
    };

    const handleCreateUser = async () => {
        setCreateUserMsg(null);
        if (!createUserForm.email || !createUserForm.password) {
            setCreateUserMsg({ type: 'error', text: 'Email dan Password wajib diisi.' });
            return;
        }
        if (createUserForm.password.length < 6) {
            setCreateUserMsg({ type: 'error', text: 'Password minimal 6 karakter.' });
            return;
        }
        try {
            const res = await authFetch('/api/admin/users', {
                method: 'POST',
                body: JSON.stringify(createUserForm),
            });
            const data = await res.json();
            if (res.ok) {
                setCreateUserMsg({ type: 'success', text: data.message });
                fetchAdminUsers();
                fetchAdminDashboard();
                setTimeout(() => {
                    setCreateUserModal(false);
                    setCreateUserForm({ email: '', password: '', role: 'user', whatsapp: '', plan_type: 'trial', duration_days: 30 });
                    setCreateUserMsg(null);
                }, 1500);
            } else {
                setCreateUserMsg({ type: 'error', text: data.detail || 'Gagal membuat user.' });
            }
        } catch (err) {
            setCreateUserMsg({ type: 'error', text: 'Terjadi kesalahan jaringan.' });
        }
    };

    const handleUpdateUserSub = async () => {
        if (!editUserModal) return;
        setEditUserMsg(null);
        try {
            // Update subscription
            const resSub = await authFetch(`/api/admin/users/${editUserModal.id}/subscription`, {
                method: 'POST',
                body: JSON.stringify(editUserForm),
            });
            // Update role if changed
            if (editUserForm.role && editUserForm.role !== editUserModal.role) {
                await authFetch(`/api/admin/users/${editUserModal.id}/role`, {
                    method: 'POST',
                    body: JSON.stringify({ role: editUserForm.role }),
                });
            }
            const data = await resSub.json();
            if (resSub.ok) {
                setEditUserMsg({ type: 'success', text: 'Data user & role berhasil diperbarui!' });
                fetchAdminUsers();
                fetchAdminDashboard();
                setTimeout(() => {
                    setEditUserModal(null);
                    setEditUserMsg(null);
                }, 1200);
            } else {
                setEditUserMsg({ type: 'error', text: data.detail || 'Gagal memperbarui.' });
            }
        } catch (err) {
            setEditUserMsg({ type: 'error', text: 'Terjadi kesalahan jaringan.' });
        }
    };

    const handleNotifyWA = async (user, customPass = null) => {
        setNotifyMsg({ userId: user.id, type: 'info', text: 'Mengirim WA via Fonnte...' });
        try {
            const res = await authFetch(`/api/admin/users/${user.id}/notify-wa`, {
                method: 'POST',
                body: JSON.stringify({ whatsapp: user.whatsapp, password: customPass }),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setNotifyMsg({ userId: user.id, type: 'success', text: data.message });
            } else {
                setNotifyMsg({ userId: user.id, type: 'error', text: data.message || data.detail || 'Gagal mengirim WA.' });
            }
        } catch (err) {
            setNotifyMsg({ userId: user.id, type: 'error', text: 'Kesalahan koneksi Fonnte WA.' });
        }
        setTimeout(() => setNotifyMsg(null), 4000);
    };

    const handleNotifyEmail = async (user, customPass = null) => {
        setNotifyMsg({ userId: user.id, type: 'info', text: 'Mengirim Email SMTP...' });
        try {
            const res = await authFetch(`/api/admin/users/${user.id}/notify-email`, {
                method: 'POST',
                body: JSON.stringify({ password: customPass }),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setNotifyMsg({ userId: user.id, type: 'success', text: data.message });
            } else {
                setNotifyMsg({ userId: user.id, type: 'error', text: data.message || data.detail || 'Gagal mengirim Email.' });
            }
        } catch (err) {
            setNotifyMsg({ userId: user.id, type: 'error', text: 'Kesalahan koneksi SMTP Email.' });
        }
        setTimeout(() => setNotifyMsg(null), 4000);
    };

    const handleDeleteUser = async (userId) => {
        try {
            const res = await authFetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
            const data = await res.json();
            if (res.ok) {
                setDeleteUserConfirm(null);
                fetchAdminUsers();
                fetchAdminDashboard();
            } else {
                alert(data.detail || 'Gagal menghapus user.');
            }
        } catch (err) {
            alert('Terjadi kesalahan jaringan.');
        }
    };

    const handleUpdateUserPassword = async () => {
        if (!changePasswordModal || !newPassword.trim()) return;
        setPasswordMsg(null);
        if (newPassword.length < 6) {
            setPasswordMsg({ type: 'error', text: 'Password minimal 6 karakter.' });
            return;
        }
        try {
            const res = await authFetch(`/api/admin/users/${changePasswordModal.id}/password`, {
                method: 'PUT',
                body: JSON.stringify({ password: newPassword }),
            });
            const data = await res.json();
            if (res.ok) {
                setPasswordMsg({ type: 'success', text: data.message });
                setTimeout(() => {
                    setChangePasswordModal(null);
                    setNewPassword('');
                    setPasswordMsg(null);
                }, 1500);
            } else {
                setPasswordMsg({ type: 'error', text: data.detail || 'Gagal mengubah password.' });
            }
        } catch (err) {
            setPasswordMsg({ type: 'error', text: 'Terjadi kesalahan jaringan.' });
        }
    };

    const fetchPublicSettings = async () => {
        try {
            const res = await fetch('/api/settings/public');
            if (res.ok) {
                const data = await res.json();
                setAdminSettings(prev => ({
                    ...prev,
                    app_name: data.app_name || 'Spy SPSE',
                    app_logo: data.app_logo || '🕵🏼‍♂️',
                    app_tagline: data.app_tagline || 'Solusi Praktis Menangkan Tender Pemerintah',
                    seo_description: data.seo_description || 'Spy SPSE adalah platform intelijen dan monitoring tender LPSE Indonesia terdepan. Pantau peluang pengadaan barang/jasa, analisis kompetitor, notifikasi WhatsApp realtime, dan wujudkan strategi menang tender pemerintah secara praktis dan otomatis.',
                    seo_keywords: data.seo_keywords || 'spy spse, lpse, monitoring tender, pengadaan barang jasa, tender pemerintah, lkpp, tender indonesia, pantau lpse, analisis kompetitor tender, e-procurement, tender online, sirup lkpp, tender konstruksi, tender jasa konsultansi',
                    geo_placename: data.geo_placename || 'Indonesia',
                    trial_days: data.trial_days || '7',
                    lpse_instances: data.lpse_instances,
                    premium_price: data.premium_price || '150000',
                    premium_price_yearly: data.premium_price_yearly || '1500000',
                    contact_whatsapp: data.contact_whatsapp || '',
                    contact_email: data.contact_email || '',
                    contact_maps_embed: data.contact_maps_embed || '',
                    midtrans_client_key: data.midtrans_client_key || '',
                    midtrans_is_production: data.midtrans_is_production || 'false',
                    maintenance_mode: data.maintenance_mode ?? false,
                    maintenance_message: data.maintenance_message || '',
                    chatbot_active: data.chatbot_active || 'true',
                    chatbot_name: data.chatbot_name || 'Nadia',
                    chatbot_avatar: data.chatbot_avatar || '',
                    chatbot_initial_greeting: data.chatbot_initial_greeting || '',
                    chatbot_ask_name_message: data.chatbot_ask_name_message || '',
                    chatbot_ask_phone_message: data.chatbot_ask_phone_message || '',
                    chatbot_ask_email_message: data.chatbot_ask_email_message || '',
                    chatbot_ask_reason_message: data.chatbot_ask_reason_message || '',
                    chatbot_final_message: data.chatbot_final_message || ''
                }));
                if (data.lpse_instances) {
                    if (typeof data.lpse_instances === 'string') {
                        try {
                            const parsed = JSON.parse(data.lpse_instances);
                            setLpseInstances(parsed || []);
                        } catch (e) {
                            console.error("Failed to parse lpse_instances on mount:", e);
                        }
                    } else {
                        setLpseInstances(data.lpse_instances || []);
                    }
                }
            }
        } catch (err) {
            console.error('Failed to fetch public settings:', err);
        }
    };

    // Inject SEO Meta Tags dynamically whenever adminSettings changes
    useEffect(() => {
        if (adminSettings.app_name) {
            document.title = `${adminSettings.app_name} ${adminSettings.app_tagline ? '- ' + adminSettings.app_tagline : ''}`;
        }

        // Update Meta Description
        if (adminSettings.seo_description) {
            let metaDesc = document.querySelector('meta[name="description"]');
            if (!metaDesc) {
                metaDesc = document.createElement('meta');
                metaDesc.name = "description";
                document.head.appendChild(metaDesc);
            }
            metaDesc.content = adminSettings.seo_description;
        }

        // Update Meta Keywords
        if (adminSettings.seo_keywords) {
            let metaKeywords = document.querySelector('meta[name="keywords"]');
            if (!metaKeywords) {
                metaKeywords = document.createElement('meta');
                metaKeywords.name = "keywords";
                document.head.appendChild(metaKeywords);
            }
            metaKeywords.content = adminSettings.seo_keywords;
        }

        // Update GEO Placename
        if (adminSettings.geo_placename) {
            let metaGeo = document.querySelector('meta[name="geo.placename"]');
            if (!metaGeo) {
                metaGeo = document.createElement('meta');
                metaGeo.name = "geo.placename";
                document.head.appendChild(metaGeo);
            }
            metaGeo.content = adminSettings.geo_placename;
        }
    }, [adminSettings.app_name, adminSettings.app_tagline, adminSettings.seo_description, adminSettings.seo_keywords, adminSettings.geo_placename]);

    const fetchAdminSettings = async () => {
        try {
            const res = await authFetch('/api/admin/settings');
            if (res.ok) {
                const data = await res.json();
                setAdminSettings(prev => ({ ...prev, ...data }));
                if (data.lpse_instances) {
                    if (typeof data.lpse_instances === 'string') {
                        try {
                            const parsed = JSON.parse(data.lpse_instances);
                            setLpseInstances(parsed || []);
                        } catch (e) {
                            console.error("Failed to parse lpse_instances in admin fetch:", e);
                        }
                    } else {
                        setLpseInstances(data.lpse_instances || []);
                    }
                }
            }
        } catch (err) {
            console.error('Failed to fetch admin settings:', err);
        }
    };

    const handleAddLpseInstance = async (e) => {
        e.preventDefault();
        if (!newLpseName.trim() || !newLpseSlug.trim()) {
            setLpseMsg({ type: 'error', text: 'Nama dan Slug LPSE wajib diisi.' });
            return;
        }
        const cleanSlug = newLpseSlug.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '');
        if (!cleanSlug) {
            setLpseMsg({ type: 'error', text: 'Slug tidak valid.' });
            return;
        }
        if (lpseInstances.some(inst => inst.slug === cleanSlug)) {
            setLpseMsg({ type: 'error', text: `Slug "${cleanSlug}" sudah terdaftar.` });
            return;
        }
        const updated = [...lpseInstances, { name: newLpseName.trim(), slug: cleanSlug, jenis: newLpseJenis.trim() }];
        setNewLpseName('');
        setNewLpseSlug('');
        setNewLpseJenis('');
        setLpseMsg({ type: 'success', text: `Menyimpan "${newLpseName.trim()}"...` });
        // Auto-save immediately to backend
        try {
            const res = await authFetch('/api/admin/settings', {
                method: 'POST',
                body: JSON.stringify({ lpse_instances: updated })
            });
            if (res.ok) {
                setLpseInstances(updated);
                setLpseMsg({ type: 'success', text: `✅ Instansi "${updated[updated.length - 1].name}" berhasil ditambahkan dan disimpan!` });
            } else {
                const d = await res.json();
                const errMsg = typeof d.detail === 'string' ? d.detail : (Array.isArray(d.detail) ? 'Parameter tidak valid (422).' : 'Gagal menyimpan ke server.');
                setLpseMsg({ type: 'error', text: errMsg });
            }
        } catch (err) {
            setLpseMsg({ type: 'error', text: `Kesalahan jaringan: ${err.message}` });
        }
    };

    const handleDeleteLpseInstance = (slug) => {
        const instObj = lpseInstances.find(inst => inst.slug === slug);
        const instName = instObj ? instObj.name : slug;

        setConfirmModal({
            isOpen: true,
            title: 'Hapus K/L/Pemda/Instansi LPSE',
            message: `Apakah Anda yakin ingin menghapus K/L/Pemda/Instansi <strong style="color: #fff">"${instName}"</strong> dari daftar pemantauan sistem?`,
            confirmText: 'Ya, Hapus',
            cancelText: 'Batal',
            onConfirm: async () => {
                const updated = lpseInstances.filter(inst => inst.slug !== slug);
                setLpseMsg({ type: 'success', text: 'Menghapus K/L/Pemda/Instansi...' });
                try {
                    const res = await authFetch('/api/admin/settings', {
                        method: 'POST',
                        body: JSON.stringify({ lpse_instances: updated })
                    });
                    if (res.ok) {
                        setLpseInstances(updated);
                        setLpseMsg({ type: 'success', text: '✅ K/L/Pemda/Instansi berhasil dihapus dan perubahan disimpan!' });
                    } else {
                        const d = await res.json();
                        const errMsg = typeof d.detail === 'string' ? d.detail : (Array.isArray(d.detail) ? 'Parameter tidak valid (422).' : 'Gagal menghapus dari server.');
                        setLpseMsg({ type: 'error', text: errMsg });
                    }
                } catch (err) {
                    setLpseMsg({ type: 'error', text: `Kesalahan jaringan: ${err.message}` });
                }
            }
        });
    };

    const handleEditLpseClick = (inst) => {
        setEditingLpseSlug(inst.slug);
        setEditLpseData({ name: inst.name, slug: inst.slug, jenis: inst.jenis || '' });
    };

    const handleCancelEditLpse = () => {
        setEditingLpseSlug(null);
        setEditLpseData({ name: '', slug: '', jenis: '' });
    };

    const handleUpdateLpseInstance = async () => {
        if (!editLpseData.name.trim() || !editLpseData.slug.trim()) {
            setLpseMsg({ type: 'error', text: 'Nama dan Slug LPSE wajib diisi.' });
            return;
        }
        const cleanSlug = editLpseData.slug.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '');

        // Check if new slug already exists in OTHER items
        if (cleanSlug !== editingLpseSlug && lpseInstances.some(inst => inst.slug === cleanSlug)) {
            setLpseMsg({ type: 'error', text: `Slug "${cleanSlug}" sudah terdaftar pada instansi lain.` });
            return;
        }

        const updated = lpseInstances.map(inst => {
            if (inst.slug === editingLpseSlug) {
                return { name: editLpseData.name.trim(), slug: cleanSlug, jenis: editLpseData.jenis.trim() };
            }
            return inst;
        });

        setLpseMsg({ type: 'success', text: `Memperbarui "${editLpseData.name.trim()}"...` });

        try {
            const res = await authFetch('/api/admin/settings', {
                method: 'POST',
                body: JSON.stringify({ lpse_instances: updated })
            });
            if (res.ok) {
                setLpseInstances(updated);
                setEditingLpseSlug(null);
                setEditLpseData({ name: '', slug: '', jenis: '' });
                setLpseMsg({ type: 'success', text: '✅ Instansi berhasil diperbarui!' });
            } else {
                const d = await res.json();
                const errMsg = typeof d.detail === 'string' ? d.detail : (Array.isArray(d.detail) ? 'Parameter tidak valid (422).' : 'Gagal menyimpan ke server.');
                setLpseMsg({ type: 'error', text: errMsg });
            }
        } catch (err) {
            setLpseMsg({ type: 'error', text: `Kesalahan jaringan: ${err.message}` });
        }
    };

    const handleSaveLpseSettings = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        setLpseMsg(null);
        setIsSavingSettings(true);
        console.log('[LPSE Save] Sending lpse_instances:', lpseInstances);
        try {
            const res = await authFetch('/api/admin/settings', {
                method: 'POST',
                body: JSON.stringify({
                    lpse_instances: lpseInstances
                })
            });
            const data = await res.json();
            console.log('[LPSE Save] Response:', res.status, data);
            if (res.ok) {
                setLpseMsg({ type: 'success', text: `✅ Daftar K/L/Pemda/Instansi LPSE berhasil disimpan! (${lpseInstances.length} K/L/Pemda/Instansi)` });
            } else {
                const errMsg = typeof data.detail === 'string' ? data.detail : (Array.isArray(data.detail) ? 'Parameter tidak valid (422).' : `Gagal menyimpan. Status: ${res.status}`);
                setLpseMsg({ type: 'error', text: errMsg });
            }
        } catch (err) {
            console.error('[LPSE Save] Network error:', err);
            setLpseMsg({ type: 'error', text: `Kesalahan jaringan: ${err.message}` });
        } finally {
            setIsSavingSettings(false);
        }
    };

    const handleSaveSettings = async (e, section = 'branding') => {
        e && e.preventDefault();
        setIsSavingSettings(true);

        // Clear all section messages
        setBrandingSaveMsg(null);
        setWaSaveMsg(null);
        setSmtpSaveMsg(null);
        setMidtransSaveMsg(null);
        setPricingSaveMsg(null);
        setContactSaveMsg(null);
        setProxySaveMsg(null);

        const setMsg = {
            'branding': setBrandingSaveMsg,
            'whatsapp': setWaSaveMsg,
            'smtp': setSmtpSaveMsg,
            'midtrans': setMidtransSaveMsg,
            'pricing': setPricingSaveMsg,
            'contact': setContactSaveMsg,
            'chatbot': setChatbotSaveMsg,
            'proxy': setProxySaveMsg
        }[section] || setBrandingSaveMsg;

        try {
            const res = await authFetch('/api/admin/settings', {
                method: 'POST',
                body: JSON.stringify(adminSettings)
            });
            const data = await res.json();
            if (res.ok) {
                setMsg({ type: 'success', text: data.message || 'Pengaturan berhasil diperbarui.' });
                await fetchAdminSettings();
                if (section === 'whatsapp') {
                    fetchWaStatus(adminSettings.whatsapp_api_token);
                } else if (section === 'smtp') {
                    fetchSmtpStatus();
                } else if (section === 'midtrans' || section === 'payment') {
                    fetchMidtransStatus();
                }
            } else {
                let errText = 'Gagal menyimpan.';
                if (typeof data.detail === 'string') {
                    errText = data.detail;
                } else if (Array.isArray(data.detail)) {
                    errText = data.detail.map(item => typeof item === 'string' ? item : (item.msg || JSON.stringify(item))).join(', ');
                } else if (data.detail && typeof data.detail === 'object') {
                    errText = JSON.stringify(data.detail);
                } else if (data.message && typeof data.message === 'string') {
                    errText = data.message;
                }
                setMsg({ type: 'error', text: errText });
            }
        } catch (err) {
            setMsg({ type: 'error', text: 'Kesalahan jaringan.' });
        } finally {
            setIsSavingSettings(false);
        }
    };

    const handleTestProxy = async (e) => {
        e && e.preventDefault();
        if (!adminSettings.spse_proxy?.trim()) return;
        setIsTestingProxy(true);
        setProxyTestResult(null);
        try {
            const res = await authFetch('/api/admin/settings/test-proxy', {
                method: 'POST',
                body: JSON.stringify({ proxy_url: adminSettings.spse_proxy.trim() })
            });
            const data = await res.json();
            if (res.ok) {
                setProxyTestResult({ type: 'success', text: data.message });
            } else {
                setProxyTestResult({ type: 'error', text: data.detail || 'Gagal menguji koneksi proxy.' });
            }
        } catch (err) {
            setProxyTestResult({ type: 'error', text: 'Kesalahan jaringan: ' + err.message });
        } finally {
            setIsTestingProxy(false);
        }
    };

    const handleTestSmtp = async (e) => {
        e.preventDefault();
        if (!smtpTestEmail) return;
        setIsTestingSmtp(true);
        setSmtpTestResult(null);
        try {
            const res = await authFetch('/api/admin/settings/test-smtp', {
                method: 'POST',
                body: JSON.stringify({
                    test_email: smtpTestEmail,
                    smtp_host: adminSettings.smtp_host,
                    smtp_port: adminSettings.smtp_port,
                    smtp_user: adminSettings.smtp_user,
                    smtp_password: adminSettings.smtp_password,
                    smtp_sender: adminSettings.smtp_sender,
                })
            });
            const data = await res.json();
            if (res.ok) {
                setSmtpTestResult({ type: 'success', text: data.message });
            } else {
                const errMsg = typeof data.detail === 'string'
                    ? data.detail
                    : (Array.isArray(data.detail)
                        ? 'Validasi gagal: Parameter tidak valid.'
                        : 'Gagal.');
                setSmtpTestResult({ type: 'error', text: errMsg });
            }
        } catch (err) {
            setSmtpTestResult({ type: 'error', text: 'Kesalahan jaringan.' });
        } finally {
            setIsTestingSmtp(false);
        }
    };

    const fetchAnalytics = async () => {
        try {
            const res = await authFetch('/api/analytics');
            const data = await res.json();
            setAnalytics(data);
        } catch (err) {
            console.error("Failed to fetch analytics:", err);
        }
    };

    // Fetch Tenders when explorer parameters change
    useEffect(() => {
        if (activeTab === 'explorer') {
            fetchTenders();
        }
    }, [activeTab, searchQuery, explorerFilterJenisInstansi, filterKategori, filterTipe, filterJenis, filterTahun, filterTahap, limit, offset]);

    // Fetch Keyword Tenders when tab or parameters change
    useEffect(() => {
        if (activeTab === 'keyword-tenders') {
            fetchKeywordTenders();
        }
    }, [activeTab, keywordLimit, keywordOffset]);

    const fetchTenders = async () => {
        setIsLoadingExplorer(true);
        try {
            const queryParams = new URLSearchParams({
                limit: limit.toString(),
                offset: offset.toString()
            });
            if (searchQuery) queryParams.append('q', searchQuery);
            if (explorerFilterJenisInstansi) queryParams.append('jenis_instansi', explorerFilterJenisInstansi);
            if (filterKategori) queryParams.append('kategori', filterKategori);
            if (filterTipe) queryParams.append('tipe', filterTipe);
            if (filterJenis) queryParams.append('jenis_pengadaan', filterJenis);
            if (filterTahun) queryParams.append('tahun', filterTahun);
            if (filterTahap) queryParams.append('tahap', filterTahap);

            const res = await fetch(`/api/tenders?${queryParams.toString()}`);
            const data = await res.json();
            setTenders(data.data || []);
            setTotalTenders(data.total || 0);
        } catch (err) {
            console.error("Failed to fetch tenders:", err);
        } finally {
            setIsLoadingExplorer(false);
        }
    };

    const fetchKeywordTenders = async () => {
        setIsLoadingKeywordTenders(true);
        try {
            const queryParams = new URLSearchParams({
                limit: keywordLimit.toString(),
                offset: keywordOffset.toString()
            });
            const res = await authFetch(`/api/user/tenders/keywords?${queryParams.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setKeywordTenders(data.data || []);
                setTotalKeywordTenders(data.total || 0);
            } else {
                setKeywordTenders([]);
                setTotalKeywordTenders(0);
            }
        } catch (err) {
            console.error("Failed to fetch keyword tenders:", err);
        } finally {
            setIsLoadingKeywordTenders(false);
        }
    };

    // Fetch alerts on tab change
    useEffect(() => {
        if (activeTab === 'alerts') {
            fetchAlerts();
        }
    }, [activeTab]);

    const fetchAlerts = async () => {
        try {
            const res = await authFetch('/api/alerts');
            const data = await res.json();
            setAlerts(data || []);
        } catch (err) {
            console.error("Failed to fetch alerts:", err);
        }
    };

    const handleCreateAlert = async (e) => {
        e.preventDefault();
        if (currentUser?.subscription?.plan_type === 'trial' && alerts.length >= 1) {
            setActiveTab('billing');
            return;
        }
        if (!alertKeyword || !alertEmail || !alertInstansi) return;
        setIsSubmittingAlert(true);
        try {
            const res = await authFetch('/api/alerts', {
                method: 'POST',
                body: JSON.stringify({ keyword: alertKeyword, email: alertEmail, whatsapp: alertWhatsapp, instansi: alertInstansi })
            });
            const data = await res.json();
            if (res.ok) {
                setAlertKeyword('');
                fetchAlerts();
                fetchKeywordTenders();
                if (data.is_new_number && data.whatsapp) {
                    setWaActivationModal({
                        alert_id: data.alert_id,
                        whatsapp: data.whatsapp,
                        app_name: data.app_name || 'Spy SPSE',
                        activation_url: data.activation_url,
                        whatsapp_registered: data.whatsapp_registered
                    });
                    setIsEditingModalWa(false);
                }
            } else {
                alert(data.detail || "Gagal membuat alert.");
            }
        } catch (err) {
            console.error("Failed to create alert:", err);
        } finally {
            setIsSubmittingAlert(false);
        }
    };

    const handleSaveUpdatedModalWa = async () => {
        if (!waActivationModal?.alert_id || !editingModalWaValue) return;
        setIsSavingModalWa(true);
        try {
            const res = await authFetch(`/api/alerts/${waActivationModal.alert_id}/whatsapp`, {
                method: 'PUT',
                body: JSON.stringify({ whatsapp: editingModalWaValue })
            });
            const data = await res.json();
            if (res.ok) {
                setWaActivationModal(prev => ({
                    ...prev,
                    whatsapp: data.whatsapp,
                    whatsapp_registered: data.whatsapp_registered,
                    activation_url: data.activation_url
                }));
                setIsEditingModalWa(false);
                fetchAlerts();
            } else {
                alert(data.detail || "Gagal memperbarui nomor WhatsApp.");
            }
        } catch (err) {
            console.error("Failed to update modal WA:", err);
        } finally {
            setIsSavingModalWa(false);
        }
    };

    const handleDeleteAlert = (alertObj) => {
        const lpseName = getLpseNameBySlug(alertObj.instansi);
        setConfirmModal({
            isOpen: true,
            title: 'Hapus Pemantauan',
            message: `Apakah Anda yakin ingin menghapus pemantauan kata kunci <strong style="color: #fff">"${alertObj.keyword}"</strong> untuk <strong style="color: #818cf8">${lpseName}</strong>?`,
            confirmText: 'Ya, Hapus',
            cancelText: 'Batal',
            onConfirm: async () => {
                try {
                    const res = await authFetch(`/api/alerts/${alertObj.id}`, { method: 'DELETE' });
                    if (res.ok) {
                        fetchAlerts();
                    }
                } catch (err) {
                    console.error("Failed to delete alert:", err);
                }
            }
        });
    };

    // Trigger Manual Crawling
    const handleTriggerCrawl = async (e) => {
        e.preventDefault();
        setIsCrawling(true);
        setCrawlResult(null);
        const jenisSuffix = crawlJenis ? ` | Jenis: ${crawlJenis}` : '';
        setCrawlLogs(["[SYSTEM] Memulai permintaan crawling...", `[SYSTEM] Target: ${crawlKategori} (${crawlTipe}) - Tahun ${crawlTahun}${jenisSuffix} - Indeks Awal: ${crawlStart}`]);

        try {
            const res = await authFetch('/api/crawl', {
                method: 'POST',
                body: JSON.stringify({
                    tipe: crawlTipe,
                    category: crawlKategori,
                    tahun: parseInt(crawlTahun),
                    limit: parseInt(crawlLimit),
                    start: parseInt(crawlStart) || 0,
                    search: crawlQuery
                })
            });

            const data = await res.json();
            if (data.status === 'crawling_started' || data.status === 'success') {
                setCrawlLogs(prev => [...prev, `[SUCCESS] ${data.message}`, "[SYSTEM] Menunggu scraper menyelesaikan crawling di server... (Proses berjalan secara asinkron)"]);

                // Simulasikan polling atau langsung fetching data setelah 10 detik
                setTimeout(async () => {
                    setCrawlLogs(prev => [...prev, "[SYSTEM] Mengambil hasil pembaruan database...", "[OK] Database selesai diperbarui."]);
                    setIsCrawling(false);
                    fetchAnalytics();
                }, 12000);
            } else {
                setCrawlLogs(prev => [...prev, `[ERROR] Gagal memicu crawling: ${data.message}`]);
                setIsCrawling(false);
            }
        } catch (err) {
            setCrawlLogs(prev => [...prev, `[ERROR] Kesalahan jaringan: ${err.message}`]);
            setIsCrawling(false);
        }
    };

    // Trigger Manual Bookmarks Sync
    const handleSyncBookmarks = async (e) => {
        e && e.preventDefault();
        setIsCrawling(true);
        setCrawlResult(null);
        setCrawlLogs(["[SYSTEM] Memulai sinkronisasi status (tahap) seluruh bookmarks...", "[SYSTEM] Menghubungi server API..."]);
        try {
            const res = await authFetch('/api/admin/sync-bookmarks', {
                method: 'POST'
            });
            const data = await res.json();
            if (res.ok) {
                setCrawlLogs(prev => [
                    ...prev,
                    `[SUCCESS] ${data.message}`,
                    "[SYSTEM] Menunggu proses update latar belakang selesai... (Jeda 2 detik per item)",
                    "[SYSTEM] Anda dapat melihat progress detil pada bagian System Logs."
                ]);
                setTimeout(() => {
                    setIsCrawling(false);
                    fetchAnalytics();
                }, 8000);
            } else {
                setCrawlLogs(prev => [...prev, `[ERROR] Gagal memicu sinkronisasi: ${data.detail || 'Akses ditolak.'}`]);
                setIsCrawling(false);
            }
        } catch (err) {
            setCrawlLogs(prev => [...prev, `[ERROR] Kesalahan jaringan: ${err.message}`]);
            setIsCrawling(false);
        }
    };

    const handleViewTenderDetail = async (nomor) => {
        try {
            const res = await fetch(`/api/tenders/${nomor}`);
            if (res.ok) {
                const data = await res.json();
                setSelectedTender(data);
                setIsDrawerOpen(true);
            }
        } catch (err) {
            console.error("Failed to fetch tender details:", err);
        }
    };

    const formatPaguVal = (val) => {
        if (!val) return 'Rp 0';
        if (val >= 1_000_000_000_000) {
            return `Rp ${(val / 1_000_000_000_000).toFixed(2).replace('.', ',')} T`;
        }
        if (val >= 1_000_000_000) {
            return `Rp ${(val / 1_000_000_000).toFixed(2).replace('.', ',')} M`;
        }
        if (val >= 1_000_000) {
            return `Rp ${(val / 1_000_000).toFixed(2).replace('.', ',')} Jt`;
        }
        return `Rp ${val.toLocaleString('id-ID')}`;
    };

    const getLpseNameBySlug = (slug) => {
        const inst = lpseInstances.find(i => i.slug === slug);
        return inst ? inst.name : slug;
    };

    const getSubscriptionProgress = () => {
        if (!currentUser?.subscription) return null;

        const sub = currentUser.subscription;
        if (sub.status !== 'active' || !sub.start_date || !sub.end_date) return null;

        const startDate = new Date(sub.start_date);
        const endDate = new Date(sub.end_date);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return null;

        const now = new Date();

        const totalTime = endDate.getTime() - startDate.getTime();
        const remainingTime = endDate.getTime() - now.getTime();

        if (remainingTime <= 0) return { daysLeft: 0, percent: 0, color: '#ef4444', totalDays: 0 };

        const totalDays = Math.ceil(totalTime / (1000 * 60 * 60 * 24));
        const daysLeft = Math.ceil(remainingTime / (1000 * 60 * 60 * 24));

        const percent = Math.min(100, Math.max(0, (daysLeft / totalDays) * 100));

        let color = '#34d399'; // Green (Safe)
        if (daysLeft <= 7) {
            color = '#fbbf24'; // Orange/Yellow (Warning)
        }
        if (daysLeft <= 2) {
            color = '#ef4444'; // Red (Danger)
        }

        return { daysLeft, totalDays, percent, color };
    };

    const handlePublicNavigate = (target, subView, anchor) => {
        if (target === 'tenders') {
            window.location.hash = '#/explorer';
        } else if (target === 'blog') {
            window.location.hash = '#/blog';
        } else if (target === 'auth') {
            window.location.hash = '#/auth';
        } else if (target === 'register') {
            window.location.hash = '#/register';
        } else {
            if (subView === 'contact') {
                window.location.hash = '#/contact';
            } else if (subView === 'privacy') {
                window.location.hash = '#/privacy';
            } else if (subView === 'terms') {
                window.location.hash = '#/terms';
            } else if (anchor === 'landing-pricing') {
                window.location.hash = '#/pricing';
            } else {
                window.location.hash = '#/';
            }
        }
    };

    if (!userToken) {
        // Maintenance gate for unauthenticated visitors (admin can still login via auth page)
        if (adminSettings.maintenance_mode && publicView !== 'auth') {
            const hasContact = adminSettings.contact_whatsapp || adminSettings.contact_email || adminSettings.contact_maps_embed;
            return (
                <div style={{
                    minHeight: '100vh',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    backgroundColor: '#090d16',
                    backgroundImage: `
                        radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.15) 0%, transparent 60%),
                        radial-gradient(circle at 85% 90%, rgba(244, 63, 94, 0.08) 0%, transparent 50%),
                        radial-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px)
                    `,
                    backgroundSize: '100% 100%, 100% 100%, 28px 28px',
                    color: '#f9fafb',
                    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                    padding: '40px 20px',
                    overflowX: 'hidden'
                }}>
                    {/* Top Ambient Glow Orb */}
                    <div style={{
                        position: 'absolute',
                        top: '-120px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '600px',
                        height: '300px',
                        background: 'radial-gradient(ellipse at center, rgba(99, 102, 241, 0.25), transparent 70%)',
                        filter: 'blur(60px)',
                        pointerEvents: 'none',
                        zIndex: 0
                    }} />

                    {/* Brand Header */}
                    <div style={{
                        zIndex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '32px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        padding: '8px 20px',
                        borderRadius: '9999px',
                        backdropFilter: 'blur(12px)'
                    }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 10px #f59e0b' }} />
                        <span style={{ fontSize: '13px', fontWeight: '700', letterSpacing: '0.05em', color: '#e5e7eb' }}>
                            SPSE MONITOR
                        </span>
                        <span style={{ fontSize: '11px', color: '#9ca3af', borderLeft: '1px solid rgba(255,255,255,0.15)', paddingLeft: '10px' }}>
                            SYSTEM MAINTENANCE
                        </span>
                    </div>

                    {/* Main Container */}
                    <div style={{
                        zIndex: 1,
                        maxWidth: hasContact ? '840px' : '580px',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '24px'
                    }}>
                        {/* HERO CARD */}
                        <div style={{
                            background: 'rgba(15, 23, 42, 0.75)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '24px',
                            padding: '48px 40px',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(20px)',
                            textAlign: 'center',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            {/* Decorative Top Accent Line */}
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '3px',
                                background: 'linear-gradient(90deg, #f59e0b, #ef4444, #6366f1)'
                            }} />

                            {/* Modern Animated SVG Icon Container */}
                            <div style={{
                                width: '72px',
                                height: '72px',
                                margin: '0 auto 24px',
                                borderRadius: '20px',
                                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(239, 68, 68, 0.15))',
                                border: '1px solid rgba(245, 158, 11, 0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 12px 24px rgba(245, 158, 11, 0.15)'
                            }}>
                                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                                </svg>
                            </div>

                            <h1 style={{
                                fontFamily: "'Outfit', 'Inter', sans-serif",
                                fontSize: '32px',
                                fontWeight: '800',
                                letterSpacing: '-0.02em',
                                marginBottom: '12px',
                                color: '#ffffff'
                            }}>
                                Sistem Dalam Pemeliharaan
                            </h1>

                            <p style={{
                                color: '#9ca3af',
                                fontSize: '15px',
                                lineHeight: '1.7',
                                maxWidth: '520px',
                                margin: '0 auto 24px'
                            }}>
                                {adminSettings.maintenance_message || 'Kami sedang melakukan pemeliharaan rutin untuk menjaga stabilitas dan meningkatkan performa sistem. Layanan akan kembali normal dalam waktu dekat.'}
                            </p>

                            {/* Maintenance Status Badge */}
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                background: 'rgba(245, 158, 11, 0.1)',
                                border: '1px solid rgba(245, 158, 11, 0.25)',
                                padding: '6px 16px',
                                borderRadius: '9999px',
                                fontSize: '12px',
                                color: '#fbbf24',
                                fontWeight: '600',
                                marginBottom: '32px'
                            }}>
                                <span style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    background: '#f59e0b',
                                    display: 'inline-block',
                                    boxShadow: '0 0 8px #f59e0b'
                                }} />
                                Pemeliharaan Terjadwal Aktif
                            </div>

                            {/* Action Buttons Group */}
                            <div style={{
                                display: 'flex',
                                gap: '12px',
                                justifyContent: 'center',
                                flexWrap: 'wrap'
                            }}>
                                <button
                                    onClick={() => window.location.reload()}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        background: 'linear-gradient(135deg, #4f46e5, #3b82f6)',
                                        color: '#ffffff',
                                        border: 'none',
                                        padding: '12px 24px',
                                        borderRadius: '12px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        boxShadow: '0 4px 16px rgba(79, 70, 229, 0.4)',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                                    </svg>
                                    Cek Ulang Status
                                </button>

                                <button
                                    onClick={() => { window.location.hash = '#/auth'; setPublicView('auth'); }}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        color: '#d1d5db',
                                        border: '1px solid rgba(255, 255, 255, 0.12)',
                                        padding: '12px 24px',
                                        borderRadius: '12px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        backdropFilter: 'blur(8px)',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                    Login Administrator
                                </button>
                            </div>
                        </div>

                        {/* CONTACT & LOCATION SECTION */}
                        {hasContact && (
                            <div style={{
                                background: 'rgba(15, 23, 42, 0.65)',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                borderRadius: '24px',
                                padding: '32px',
                                backdropFilter: 'blur(16px)',
                                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    marginBottom: '20px',
                                    paddingBottom: '16px',
                                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
                                }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                    </svg>
                                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#f3f4f6', margin: 0 }}>
                                        Dukungan Bantuan & Informasi Kontak
                                    </h3>
                                </div>

                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: adminSettings.contact_maps_embed ? 'repeat(auto-fit, minmax(300px, 1fr))' : '1fr',
                                    gap: '20px'
                                }}>
                                    {/* Contact Cards Column */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {adminSettings.contact_whatsapp && (
                                            <a
                                                href={`https://wa.me/${String(adminSettings.contact_whatsapp || '').replace(/\D/g, '')}`}
                                                target="_blank" rel="noreferrer"
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    background: 'rgba(34, 197, 94, 0.08)',
                                                    border: '1px solid rgba(34, 197, 94, 0.2)',
                                                    padding: '16px 20px',
                                                    borderRadius: '16px',
                                                    textDecoration: 'none',
                                                    transition: 'all 0.2s ease'
                                                }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                                    <div style={{
                                                        width: '42px', height: '42px', borderRadius: '12px',
                                                        background: 'rgba(34, 197, 94, 0.15)',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                    }}>
                                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#4ade80', fontWeight: '700', marginBottom: '2px' }}>
                                                            WhatsApp Support
                                                        </div>
                                                        <div style={{ fontSize: '15px', color: '#f3f4f6', fontWeight: '600' }}>
                                                            {adminSettings.contact_whatsapp}
                                                        </div>
                                                    </div>
                                                </div>
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                                    <polyline points="15 3 21 3 21 9" />
                                                    <line x1="10" y1="14" x2="21" y2="3" />
                                                </svg>
                                            </a>
                                        )}

                                        {adminSettings.contact_email && (
                                            <a
                                                href={`mailto:${adminSettings.contact_email}`}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    background: 'rgba(99, 102, 241, 0.08)',
                                                    border: '1px solid rgba(99, 102, 241, 0.2)',
                                                    padding: '16px 20px',
                                                    borderRadius: '16px',
                                                    textDecoration: 'none',
                                                    transition: 'all 0.2s ease'
                                                }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                                    <div style={{
                                                        width: '42px', height: '42px', borderRadius: '12px',
                                                        background: 'rgba(99, 102, 241, 0.15)',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                    }}>
                                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a5b4fc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                                            <polyline points="22,6 12,13 2,6" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#a5b4fc', fontWeight: '700', marginBottom: '2px' }}>
                                                            Email Support
                                                        </div>
                                                        <div style={{ fontSize: '15px', color: '#f3f4f6', fontWeight: '600' }}>
                                                            {adminSettings.contact_email}
                                                        </div>
                                                    </div>
                                                </div>
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a5b4fc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                                    <polyline points="15 3 21 3 21 9" />
                                                    <line x1="10" y1="14" x2="21" y2="3" />
                                                </svg>
                                            </a>
                                        )}
                                    </div>

                                    {/* Google Maps Column */}
                                    {adminSettings.contact_maps_embed && (
                                        <div style={{
                                            borderRadius: '16px',
                                            overflow: 'hidden',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            background: '#0f172a',
                                            minHeight: '160px',
                                            position: 'relative'
                                        }}>
                                            <iframe
                                                src={adminSettings.contact_maps_embed?.match(/src=["']([^"']+)["']/i)?.[1] || adminSettings.contact_maps_embed}
                                                width="100%"
                                                height="100%"
                                                style={{ border: 0, minHeight: '160px', display: 'block' }}
                                                allowFullScreen=""
                                                loading="lazy"
                                                referrerPolicy="no-referrer-when-downgrade"
                                                title="Lokasi Kantor"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        if (publicView === 'landing') {
            return (
                <LandingPage
                    onGetStarted={() => handlePublicNavigate('auth')}
                    onGoTenders={() => handlePublicNavigate('tenders')}
                    adminSettings={adminSettings}
                    landingPage={landingPage}
                    setLandingPage={setLandingPage}
                    onNavigate={handlePublicNavigate}
                />
            );
        }
        if (publicView === 'blog') {
            return (
                <PublicBlogPage
                    adminSettings={adminSettings}
                    publicArticles={publicArticles}
                    isLoadingArticles={isLoadingArticles}
                    onNavigate={handlePublicNavigate}
                    userToken={userToken}
                />
            );
        }
        if (publicView === 'article-detail') {
            return (
                <PublicArticleDetailPage
                    adminSettings={adminSettings}
                    selectedArticle={selectedArticle}
                    selectedArticleLpseSlug={selectedArticleLpseSlug}
                    lpseInstances={lpseInstances}
                    isLoadingArticles={isLoadingArticles}
                    onNavigate={handlePublicNavigate}
                    userToken={userToken}
                />
            );
        }
        if (publicView === 'tenders') {
            return (
                <PublicTendersPage
                    onGoHome={() => handlePublicNavigate('landing', 'home')}
                    adminSettings={adminSettings}
                    onNavigate={handlePublicNavigate}
                    lpseInstances={lpseInstances}
                />
            );
        }
        if (publicView === 'public-tender-detail') {
            return (
                <PublicTenderDetailPage
                    adminSettings={adminSettings}
                    tender={publicTenderData}
                    isLoading={isLoadingPublicTender}
                    error={publicTenderError}
                    onNavigate={handlePublicNavigate}
                    userToken={userToken}
                />
            );
        }
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                background: 'radial-gradient(circle at top right, rgba(99, 102, 241, 0.15), transparent), radial-gradient(circle at bottom left, rgba(168, 85, 247, 0.15), transparent), #070a13',
                fontFamily: "'Inter', sans-serif"
            }}>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '20px 40px',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    width: '100%',
                    boxSizing: 'border-box'
                }}>
                    <div
                        onClick={() => handlePublicNavigate('landing', 'home')}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
                    >
                        <span style={{ fontSize: '24px' }}>{adminSettings.app_logo || '🕵🏼‍♂️'}</span>
                        <span style={{
                            fontFamily: "'Outfit', sans-serif",
                            fontWeight: 'bold',
                            fontSize: '20px',
                            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            {adminSettings.app_name || 'Spy SPSE'}
                        </span>
                    </div>
                    <div>
                        <button
                            onClick={() => handlePublicNavigate('landing', 'home')}
                            style={{
                                background: 'transparent',
                                color: '#fff',
                                border: '1px solid rgba(255,255,255,0.2)',
                                padding: '8px 20px',
                                fontSize: '14px',
                                fontWeight: '600',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            Beranda
                        </button>
                    </div>

                </div>

                <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '40px 20px', boxSizing: 'border-box' }}>
                    <div className="auth-split-wrapper">
                        {/* LEFT HERO / VALUE PROPS PANEL */}
                        <div className="auth-hero-section">
                            <div className="auth-badge-pill">
                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#818cf8', display: 'inline-block', boxShadow: '0 0 8px #818cf8' }} />
                                PLATFORM MONITORING SPSE #1 INDONESIA
                            </div>

                            <h1 style={{
                                fontFamily: "'Outfit', sans-serif",
                                fontSize: '36px',
                                fontWeight: '800',
                                color: '#ffffff',
                                lineHeight: '1.25',
                                letterSpacing: '-0.02em',
                                margin: 0
                            }}>
                                Deteksi Peluang Tender SPSE{' '}
                                <span style={{
                                    background: 'linear-gradient(135deg, #818cf8, #c084fc)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}>
                                    Lebih Cepat
                                </span>{' '}
                                dari Kompetitor
                            </h1>

                            <p style={{ fontSize: '15px', color: '#9ca3af', lineHeight: '1.6', margin: 0 }}>
                                Pantau ratusan portal LPSE nasional & daerah secara otomatis. Dapatkan alert notifikasi instan ke WhatsApp & Email begitu proyek impian Anda dipublikasikan.
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '10px' }}>
                                <div className="auth-feature-item">
                                    <div className="auth-feature-icon" style={{ background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.25)' }}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#f3f4f6', marginBottom: '2px' }}>Notifikasi Instan WhatsApp & Email</div>
                                        <div style={{ fontSize: '12px', color: '#9ca3af', lineHeight: '1.4' }}>Alert otomatis sesuai kata kunci proyek target langsung ke HP Anda.</div>
                                    </div>
                                </div>

                                <div className="auth-feature-item">
                                    <div className="auth-feature-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="11" cy="11" r="8" />
                                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#f3f4f6', marginBottom: '2px' }}>Ratusan Portal LPSE Terintegrasi</div>
                                        <div style={{ fontSize: '12px', color: '#9ca3af', lineHeight: '1.4' }}>Kementerian, Provinsi, Kabupaten & Kota dalam 1 sistem pencarian terpadu.</div>
                                    </div>
                                </div>

                                <div className="auth-feature-item">
                                    <div className="auth-feature-icon" style={{ background: 'rgba(168, 85, 247, 0.15)', border: '1px solid rgba(168, 85, 247, 0.25)' }}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c084fc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="18" y1="20" x2="18" y2="10" />
                                            <line x1="12" y1="20" x2="12" y2="4" />
                                            <line x1="6" y1="20" x2="6" y2="14" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#f3f4f6', marginBottom: '2px' }}>Analisis Pemenang & Kompetitor</div>
                                        <div style={{ fontSize: '12px', color: '#9ca3af', lineHeight: '1.4' }}>Pelajari tren harga bid historis pesaing untuk memperbesar rasio penawaran menang.</div>
                                    </div>
                                </div>
                            </div>

                            {/* Live Stats Strip */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                                <div>
                                    <div style={{ fontSize: '18px', fontWeight: '800', color: '#ffffff' }}>{lpseInstances && lpseInstances.length > 0 ? `${lpseInstances.length}+` : '100+'}</div>
                                    <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', fontWeight: '600' }}>LPSE Instansi</div>
                                </div>
                                <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)' }} />
                                <div>
                                    <div style={{ fontSize: '18px', fontWeight: '800', color: '#4ade80' }}>Auto 24/7</div>
                                    <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', fontWeight: '600' }}>Pemantauan Otomatis</div>
                                </div>
                                <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)' }} />
                                <div>
                                    <div style={{ fontSize: '18px', fontWeight: '800', color: '#818cf8' }}>Trial {adminSettings?.trial_days || '7'} Hari</div>
                                    <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', fontWeight: '600' }}>Akses Penuh</div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT FORM CARD */}
                        <div style={{
                            background: 'rgba(15, 23, 42, 0.75)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(99, 102, 241, 0.25)',
                            borderRadius: '24px',
                            padding: '36px 32px',
                            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.55), 0 0 30px rgba(99, 102, 241, 0.1)',
                            width: '100%',
                            boxSizing: 'border-box'
                        }}>
                            {/* Tab Switcher (Only show on login / register modes) */}
                            {(authMode === 'login' || authMode === 'register') && (
                                <div className="auth-tab-bar">
                                    <button
                                        type="button"
                                        className={`auth-tab-item ${!isRegistering ? 'active' : ''}`}
                                        onClick={() => { setIsRegistering(false); setAuthMode('login'); setAuthMsg(null); }}
                                    >
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                                            <polyline points="10 17 15 12 10 7" />
                                            <line x1="15" y1="12" x2="3" y2="12" />
                                        </svg>
                                        Masuk
                                    </button>
                                    <button
                                        type="button"
                                        className={`auth-tab-item ${isRegistering ? 'active' : ''}`}
                                        onClick={() => { setIsRegistering(true); setAuthMode('register'); setAuthMsg(null); }}
                                    >
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                            <circle cx="8.5" cy="7" r="4" />
                                            <line x1="20" y1="8" x2="20" y2="14" />
                                            <line x1="23" y1="11" x2="17" y2="11" />
                                        </svg>
                                        Daftar Akun Baru
                                    </button>
                                </div>
                            )}

                            {/* FORGOT PASSWORD FORM */}
                            {authMode === 'forgot' && (
                                <div>
                                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                                        <div style={{
                                            width: '56px', height: '56px', borderRadius: '18px',
                                            background: 'rgba(99, 102, 241, 0.15)',
                                            border: '1px solid rgba(99, 102, 241, 0.3)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            margin: '0 auto 14px auto'
                                        }}>
                                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                            </svg>
                                        </div>
                                        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '24px', fontWeight: '800', color: '#ffffff', marginBottom: '6px' }}>Lupa Kata Sandi?</h2>
                                        <p style={{ fontSize: '13px', color: '#9ca3af', lineHeight: '1.5', margin: 0 }}>
                                            Masukkan email terdaftar Anda. Kami akan mengirimkan instruksi dan tautan pemulihan kata sandi via <strong>Email</strong> dan <strong>WhatsApp</strong>.
                                        </p>
                                    </div>

                                    {forgotMsg && (
                                        <div style={{
                                            background: forgotMsg.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                                            color: forgotMsg.type === 'success' ? '#34d399' : '#f87171',
                                            border: `1px solid ${forgotMsg.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                                            padding: '12px 16px',
                                            borderRadius: '10px',
                                            fontSize: '13px',
                                            marginBottom: '20px',
                                            textAlign: 'center'
                                        }}>
                                            {forgotMsg.text}
                                        </div>
                                    )}

                                    <form onSubmit={handleForgotPasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                                        <div className="form-group">
                                            <label style={{ fontSize: '12px', fontWeight: '600', color: '#d1d5db', marginBottom: '6px', display: 'block' }}>Alamat Email Terdaftar</label>
                                            <div className="auth-input-container">
                                                <div className="auth-input-icon">
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                                        <polyline points="22,6 12,13 2,6" />
                                                    </svg>
                                                </div>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    placeholder="nama@perusahaan.com"
                                                    value={forgotEmail}
                                                    onChange={(e) => setForgotEmail(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <button type="submit" className="btn-primary" disabled={isSubmittingForgot} style={{ marginTop: '6px', height: '44px', fontSize: '14px', fontWeight: '700' }}>
                                            {isSubmittingForgot ? 'Mengirim Instruksi...' : 'Kirim Tautan Reset Kata Sandi →'}
                                        </button>
                                    </form>

                                    <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: '#9ca3af' }}>
                                        <span
                                            onClick={() => { setAuthMode('login'); setIsRegistering(false); setForgotMsg(null); }}
                                            style={{ color: '#818cf8', cursor: 'pointer', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                                        >
                                            ← Kembali ke Halaman Login
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* RESET PASSWORD FORM */}
                            {authMode === 'reset' && (
                                <div>
                                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                                        <div style={{
                                            width: '56px', height: '56px', borderRadius: '18px',
                                            background: 'rgba(168, 85, 247, 0.15)',
                                            border: '1px solid rgba(168, 85, 247, 0.3)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            margin: '0 auto 14px auto'
                                        }}>
                                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c084fc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                            </svg>
                                        </div>
                                        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '24px', fontWeight: '800', color: '#ffffff', marginBottom: '6px' }}>Atur Kata Sandi Baru</h2>
                                        <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>Buat kata sandi baru yang kuat untuk keamanan akun Anda.</p>
                                    </div>

                                    {isVerifyingResetToken ? (
                                        <div style={{ textAlign: 'center', padding: '24px 0', color: '#9ca3af' }}>
                                            <div className="spinner" style={{ margin: '0 auto 12px auto' }} />
                                            Memverifikasi tautan reset kata sandi...
                                        </div>
                                    ) : !isResetTokenValid ? (
                                        <div>
                                            {resetMsg && (
                                                <div style={{
                                                    background: 'rgba(239, 68, 68, 0.15)',
                                                    color: '#f87171',
                                                    border: '1px solid rgba(239, 68, 68, 0.3)',
                                                    padding: '12px 16px',
                                                    borderRadius: '10px',
                                                    fontSize: '13px',
                                                    marginBottom: '20px',
                                                    textAlign: 'center'
                                                }}>
                                                    {resetMsg.text}
                                                </div>
                                            )}
                                            <button
                                                onClick={() => { setAuthMode('forgot'); setResetMsg(null); }}
                                                className="btn-primary"
                                                style={{ width: '100%', marginTop: '12px' }}
                                            >
                                                Minta Tautan Reset Baru
                                            </button>
                                        </div>
                                    ) : (
                                        <div>
                                            {resetMsg && (
                                                <div style={{
                                                    background: resetMsg.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                                                    color: resetMsg.type === 'success' ? '#34d399' : '#f87171',
                                                    border: `1px solid ${resetMsg.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                                                    padding: '12px 16px',
                                                    borderRadius: '10px',
                                                    fontSize: '13px',
                                                    marginBottom: '20px',
                                                    textAlign: 'center'
                                                }}>
                                                    {resetMsg.text}
                                                </div>
                                            )}

                                            <form onSubmit={handleResetPasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                                                <div className="form-group">
                                                    <label style={{ fontSize: '12px', fontWeight: '600', color: '#d1d5db', marginBottom: '6px', display: 'block' }}>Kata Sandi Baru</label>
                                                    <div className="auth-input-container">
                                                        <div className="auth-input-icon">
                                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                                            </svg>
                                                        </div>
                                                        <input
                                                            type={showAuthPassword ? "text" : "password"}
                                                            className="form-control"
                                                            placeholder="Minimal 6 karakter"
                                                            value={resetNewPassword}
                                                            onChange={(e) => setResetNewPassword(e.target.value)}
                                                            required
                                                            minLength={6}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="form-group">
                                                    <label style={{ fontSize: '12px', fontWeight: '600', color: '#d1d5db', marginBottom: '6px', display: 'block' }}>Konfirmasi Kata Sandi Baru</label>
                                                    <div className="auth-input-container">
                                                        <div className="auth-input-icon">
                                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                                            </svg>
                                                        </div>
                                                        <input
                                                            type={showAuthPassword ? "text" : "password"}
                                                            className="form-control"
                                                            placeholder="Ulangi kata sandi baru"
                                                            value={resetConfirmPassword}
                                                            onChange={(e) => setResetConfirmPassword(e.target.value)}
                                                            required
                                                            minLength={6}
                                                        />
                                                    </div>
                                                </div>

                                                <button type="submit" className="btn-primary" disabled={isSubmittingReset} style={{ marginTop: '6px', height: '44px', fontSize: '14px', fontWeight: '700' }}>
                                                    {isSubmittingReset ? 'Menyimpan Kata Sandi...' : 'Simpan Kata Sandi Baru →'}
                                                </button>
                                            </form>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* LOGIN / REGISTER FORM */}
                            {(authMode === 'login' || authMode === 'register') && (
                                <div>
                                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                                        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '24px', fontWeight: '800', color: '#ffffff', marginBottom: '6px' }}>
                                            {isRegistering ? 'Daftar Akun Baru' : 'Selamat Datang Kembali'}
                                        </h2>
                                        <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>
                                            {isRegistering ? 'Uji coba gratis 7 hari tanpa kartu kredit.' : 'Masukkan email dan password untuk mengakses dasbor pemantau.'}
                                        </p>
                                    </div>

                                    {authMsg && (
                                        <div style={{
                                            background: authMsg.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                                            color: authMsg.type === 'success' ? '#34d399' : '#f87171',
                                            border: `1px solid ${authMsg.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                                            padding: '12px 16px',
                                            borderRadius: '10px',
                                            fontSize: '13px',
                                            marginBottom: '20px',
                                            textAlign: 'center'
                                        }}>
                                            {authMsg.text}
                                        </div>
                                    )}

                                    <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                                        <div className="form-group">
                                            <label style={{ fontSize: '12px', fontWeight: '600', color: '#d1d5db', marginBottom: '6px', display: 'block' }}>Alamat Email</label>
                                            <div className="auth-input-container">
                                                <div className="auth-input-icon">
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                                        <polyline points="22,6 12,13 2,6" />
                                                    </svg>
                                                </div>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    placeholder="nama@perusahaan.com"
                                                    value={authEmail}
                                                    onChange={(e) => setAuthEmail(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                                <label style={{ marginBottom: 0, fontSize: '12px', fontWeight: '600', color: '#d1d5db' }}>Kata Sandi</label>
                                                {!isRegistering && (
                                                    <span
                                                        onClick={() => { setAuthMode('forgot'); setAuthMsg(null); setForgotEmail(authEmail); }}
                                                        style={{ fontSize: '12px', color: '#818cf8', cursor: 'pointer', fontWeight: '600' }}
                                                    >
                                                        Lupa kata sandi?
                                                    </span>
                                                )}
                                            </div>
                                            <div className="auth-input-container">
                                                <div className="auth-input-icon">
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                                    </svg>
                                                </div>
                                                <input
                                                    type={showAuthPassword ? "text" : "password"}
                                                    className="form-control"
                                                    placeholder="••••••••"
                                                    value={authPassword}
                                                    onChange={(e) => setAuthPassword(e.target.value)}
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    className="auth-input-toggle"
                                                    onClick={() => setShowAuthPassword(!showAuthPassword)}
                                                    title={showAuthPassword ? "Sembunyikan password" : "Tampilkan password"}
                                                >
                                                    {showAuthPassword ? (
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                                            <line x1="1" y1="1" x2="23" y2="23" />
                                                        </svg>
                                                    ) : (
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                            <circle cx="12" cy="12" r="3" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        {isRegistering && (
                                            <div className="form-group">
                                                <label style={{ fontSize: '12px', fontWeight: '600', color: '#d1d5db', marginBottom: '6px', display: 'block' }}>Nomor WhatsApp (Opsional)</label>
                                                <div className="auth-input-container">
                                                    <div className="auth-input-icon">
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                                        </svg>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Contoh: 081234567890"
                                                        value={authWhatsapp}
                                                        onChange={(e) => setAuthWhatsapp(e.target.value)}
                                                    />
                                                </div>
                                                <small style={{ color: '#6b7280', fontSize: '11px', marginTop: '4px', display: 'block' }}>
                                                    Digunakan untuk menerima notifikasi alert tender baru via WhatsApp secara instan.
                                                </small>
                                            </div>
                                        )}

                                        {isRegistering && (
                                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginTop: '6px' }}>
                                                <input
                                                    type="checkbox"
                                                    id="agreeTerms"
                                                    checked={agreeTerms}
                                                    onChange={(e) => setAgreeTerms(e.target.checked)}
                                                    style={{ marginTop: '3px', cursor: 'pointer' }}
                                                    required
                                                />
                                                <label htmlFor="agreeTerms" style={{ fontSize: '12px', color: '#9ca3af', lineHeight: '1.4', cursor: 'pointer', userSelect: 'none' }}>
                                                    Saya menyetujui{' '}
                                                    <span
                                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handlePublicNavigate('landing', 'terms'); }}
                                                        style={{ color: '#818cf8', cursor: 'pointer', textDecoration: 'underline', fontWeight: '600' }}
                                                    >
                                                        Syarat & Ketentuan
                                                    </span>{' '}
                                                    serta{' '}
                                                    <span
                                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handlePublicNavigate('landing', 'privacy'); }}
                                                        style={{ color: '#818cf8', cursor: 'pointer', textDecoration: 'underline', fontWeight: '600' }}
                                                    >
                                                        Kebijakan Privasi
                                                    </span>
                                                </label>
                                            </div>
                                        )}

                                        <button type="submit" className="btn-primary" style={{ marginTop: '10px', height: '46px', fontSize: '14px', fontWeight: '700' }}>
                                            {isRegistering ? `Daftar Akun Gratis ${adminSettings?.trial_days || '7'} Hari →` : 'Masuk ke Dasbor →'}
                                        </button>
                                    </form>

                                    <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: '#9ca3af' }}>
                                        {isRegistering ? (
                                            <p style={{ margin: 0 }}>
                                                Sudah punya akun?{' '}
                                                <span
                                                    onClick={() => { setIsRegistering(false); setAuthMode('login'); setAuthMsg(null); }}
                                                    style={{ color: '#818cf8', cursor: 'pointer', fontWeight: '600' }}
                                                >
                                                    Masuk di sini
                                                </span>
                                            </p>
                                        ) : (
                                            <p style={{ margin: 0 }}>
                                                Belum punya akun?{' '}
                                                <span
                                                    onClick={() => { setIsRegistering(true); setAuthMode('register'); setAuthMsg(null); }}
                                                    style={{ color: '#818cf8', cursor: 'pointer', fontWeight: '600' }}
                                                >
                                                    Daftar Trial {adminSettings?.trial_days || '7'} Hari
                                                </span>
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <PremiumFooter adminSettings={adminSettings} onNavigate={handlePublicNavigate} />
                <Chatbot adminSettings={adminSettings} />
            </div>

        );
    }

    // Maintenance Mode Overlay for regular non-admin users
    if (adminSettings.maintenance_mode && currentUser?.role !== 'admin') {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'radial-gradient(circle at top right, rgba(239, 68, 68, 0.15), transparent), radial-gradient(circle at bottom left, rgba(99, 102, 241, 0.15), transparent), #070a13',
                color: '#fff',
                fontFamily: "'Inter', sans-serif",
                padding: '20px',
                textAlign: 'center'
            }}>
                <div style={{
                    background: 'rgba(15, 19, 34, 0.85)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '24px',
                    padding: '50px 40px',
                    maxWidth: '560px',
                    boxShadow: '0 25px 60px rgba(0,0,0,0.7)',
                    backdropFilter: 'blur(16px)'
                }}>
                    <div style={{ fontSize: '64px', marginBottom: '20px' }}>🚧</div>
                    <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '30px', fontWeight: '800', marginBottom: '16px', background: 'linear-gradient(135deg, #f87171, #fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Sistem Dalam Pemeliharaan
                    </h1>
                    <p style={{ color: '#d1d5db', fontSize: '15px', lineHeight: '1.7', marginBottom: '28px' }}>
                        {adminSettings.maintenance_message || 'Sistem sedang dalam pemeliharaan rutin untuk meningkatkan kinerja & stabilitas. Silakan kembali beberapa saat lagi.'}
                    </p>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', padding: '8px 16px', borderRadius: '20px', fontSize: '13px', color: '#f87171', fontWeight: '600' }}>
                        <span>⚡ Maintenance Mode Aktif</span>
                    </div>
                    <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        <button
                            onClick={() => window.location.reload()}
                            style={{
                                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                                color: '#fff', border: 'none', padding: '10px 24px',
                                borderRadius: '10px', fontWeight: '600', cursor: 'pointer',
                                fontSize: '14px', boxShadow: '0 4px 14px rgba(99,102,241,0.4)'
                            }}
                        >
                            🔄 Cek Ulang Status Sistem
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Client-side bookmarks filtering
    const filteredBookmarks = bookmarks.filter(b => {
        if (bookmarkSearch) {
            const query = bookmarkSearch.toLowerCase();
            const namaMatch = b.nama_tender ? b.nama_tender.toLowerCase().includes(query) : false;
            const nomorMatch = b.nomor_pengadaan ? b.nomor_pengadaan.toLowerCase().includes(query) : false;
            const instansiMatch = b.instansi ? b.instansi.toLowerCase().includes(query) : false;
            if (!namaMatch && !nomorMatch && !instansiMatch) return false;
        }
        if (bookmarkFilterKategori && b.kategori !== bookmarkFilterKategori) {
            return false;
        }
        if (bookmarkFilterTipe && b.tipe !== bookmarkFilterTipe) {
            return false;
        }
        if (bookmarkFilterJenis && b.jenis_pengadaan !== bookmarkFilterJenis) {
            return false;
        }
        if (bookmarkFilterTahun && String(b.tahun) !== bookmarkFilterTahun) {
            return false;
        }
        return true;
    });

    return (
        <div className="app-container">
            {/* Sidebar Overlay for Mobile */}
            <div
                className={`sidebar-overlay ${isMobileMenuOpen ? 'open' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Sidebar Navigation */}
            <div className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
                <div className="logo">
                    <span className="logo-icon">{adminSettings.app_logo || '🕵🏼‍♂️'}</span>
                    <span>{adminSettings.app_name || 'Spy SPSE'}</span>
                </div>

                <div className="menu">
                    <div
                        className={`menu-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                        onClick={() => { window.location.hash = '#/dashboard'; setIsMobileMenuOpen(false); }}
                    >
                        <span>📊</span> Dashboard
                    </div>
                    <div
                        className={`menu-item ${activeTab === 'explorer' ? 'active' : ''}`}
                        onClick={() => { window.location.hash = '#/explorer'; setIsMobileMenuOpen(false); }}
                    >
                        <span>🔍</span> Explorer Tender
                    </div>
                    <div
                        className={`menu-item ${activeTab === 'keyword-tenders' ? 'active' : ''}`}
                        onClick={() => { window.location.hash = '#/keyword-tenders'; setIsMobileMenuOpen(false); }}
                    >
                        <span>🎯</span> Peluang Anda
                    </div>
                    <div
                        className={`menu-item ${activeTab === 'alerts' ? 'active' : ''}`}
                        onClick={() => { window.location.hash = '#/alerts'; setIsMobileMenuOpen(false); }}
                    >
                        <span>🔔</span> Alerts Notifikasi
                    </div>
                    <div
                        className={`menu-item ${activeTab === 'bookmarks' ? 'active' : ''}`}
                        onClick={() => { window.location.hash = '#/bookmarks'; setIsMobileMenuOpen(false); }}
                    >
                        <span>💾</span> Saved Bookmarks
                    </div>
                    <div
                        className={`menu-item ${activeTab === 'competitors' || activeTab === 'competitor-profile' ? 'active' : ''}`}
                        onClick={() => { window.location.hash = '#/competitors'; setCompetitorSearch(''); setCompetitorSuggestions([]); setIsMobileMenuOpen(false); }}
                    >
                        <span>👥</span> Analisis Kompetitor
                    </div>
                    <div
                        className={`menu-item ${activeTab === 'instansi' ? 'active' : ''}`}
                        onClick={() => { window.location.hash = '#/instansi'; setIsMobileMenuOpen(false); }}
                    >
                        <span>🏢</span> Daftar LPSE
                    </div>
                    <div
                        className={`menu-item ${activeTab === 'billing' ? 'active' : ''}`}
                        onClick={() => { window.location.hash = '#/billing'; setIsMobileMenuOpen(false); }}
                    >
                        <span>💎</span> Upgrade / Billing
                    </div>
                    {currentUser?.role === 'admin' && (
                        <div
                            className={`menu-item ${activeTab === 'control' ? 'active' : ''}`}
                            onClick={() => { window.location.hash = '#/admin/control'; setIsMobileMenuOpen(false); }}
                        >
                            <span>⚙️</span> Scraper Control
                        </div>
                    )}

                    {currentUser?.role === 'admin' && (
                        <div
                            className={`menu-item ${activeTab === 'users' ? 'active' : ''}`}
                            onClick={() => { window.location.hash = '#/admin/users'; setIsMobileMenuOpen(false); }}
                        >
                            <span>👥</span> User Manager
                        </div>
                    )}
                    {currentUser?.role === 'admin' && (
                        <div
                            className={`menu-item ${activeTab === 'server-monitoring' ? 'active' : ''}`}
                            onClick={() => { window.location.hash = '#/admin/server-monitoring'; setIsMobileMenuOpen(false); }}
                        >
                            <span>🖥️</span> Server &amp; Scheduler
                        </div>
                    )}
                    {currentUser?.role === 'admin' && (
                        <div
                            className={`menu-item ${activeTab === 'articles' ? 'active' : ''}`}
                            onClick={() => { window.location.hash = '#/admin/articles'; setIsMobileMenuOpen(false); }}
                        >
                            <span>📝</span> Manajer Artikel
                        </div>
                    )}
                    {currentUser?.role === 'admin' && (
                        <div
                            className={`menu-item ${activeTab === 'leads' ? 'active' : ''}`}
                            onClick={() => { window.location.hash = '#/admin/leads'; setIsMobileMenuOpen(false); }}
                        >
                            <span>📥</span> Form Prospek
                        </div>
                    )}
                    {currentUser?.role === 'admin' && (
                        <div
                            className={`menu-item ${activeTab === 'company-leads' ? 'active' : ''}`}
                            onClick={() => { window.location.hash = '#/admin/company-leads'; setIsMobileMenuOpen(false); }}
                        >
                            <span>🏢</span> Prospek Perusahaan
                        </div>
                    )}
                    {currentUser?.role === 'admin' && (
                        <div
                            className={`menu-item ${activeTab === 'proxy' ? 'active' : ''}`}
                            onClick={() => { window.location.hash = '#/admin/proxy'; setIsMobileMenuOpen(false); }}
                        >
                            <span>🌐</span> IP Proxy &amp; Anti-Block
                        </div>
                    )}

                    {currentUser?.role === 'admin' && (
                        <div
                            className={`menu-item ${activeTab === 'admin' ? 'active' : ''}`}
                            onClick={() => { window.location.hash = '#/admin'; setIsMobileMenuOpen(false); }}
                            style={{ marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px' }}
                        >
                            <span>🛡️</span> Super Admin
                        </div>
                    )}

                    <div
                        className="menu-item"
                        onClick={handleLogout}
                        style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px', color: '#f87171' }}
                    >
                        <span>🚪</span> Logout
                    </div>
                </div>

                <div className="sidebar-footer">
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px', marginBottom: '8px', textAlign: 'left', fontSize: '11px' }}>
                        <div style={{ color: '#9ca3af', marginBottom: '2px' }}>User: <strong style={{ color: '#fff' }}>{currentUser?.email}</strong></div>
                        <div>Plan: <span style={{ color: currentUser?.subscription?.plan_type === 'premium' ? '#fbbf24' : '#60a5fa', fontWeight: 'bold', textTransform: 'uppercase' }}>
                            {currentUser?.subscription?.plan_type || 'TRIAL'}
                        </span></div>
                        {(() => {
                            const progress = getSubscriptionProgress();
                            if (!progress) return null;
                            return (
                                <div style={{ marginTop: '8px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#9ca3af', marginBottom: '4px' }}>
                                        <span>Aktif: {progress.daysLeft} / {progress.totalDays} H</span>
                                        <span style={{ color: progress.color }}>{Math.round(progress.percent)}%</span>
                                    </div>
                                    <div style={{ width: '100%', height: '5px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                                        <div style={{ width: `${progress.percent}%`, height: '100%', background: progress.color, transition: 'width 0.5s ease-in-out' }} />
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                    <p>Spy SPSE Engine v0.1.1</p>
                    <p style={{ marginTop: '4px' }}>Status: Connected</p>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="main-content">
                {/* Mobile Header */}
                <div className="mobile-header">
                    <button className="hamburger-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        ☰
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '20px' }}>{adminSettings.app_logo || '🕵🏼‍♂️'}</span>
                        <span style={{ fontWeight: 'bold', fontSize: '16px', color: '#fff' }}>{adminSettings.app_name || 'Spy SPSE'}</span>
                    </div>
                    <div style={{ width: '24px' }}></div>
                </div>

                {/* TAB: DASHBOARD */}
                {activeTab === 'dashboard' && (
                    <div>
                        {currentUser?.role === 'admin' ? (
                            /* ====== SUPER ADMIN DASHBOARD VIEW ====== */
                            <div>
                                <div className="header-dash">
                                    <div className="header-title">
                                        <h1>Super Admin Dashboard</h1>
                                        <p>Business Intelligence & Monitoring Pengguna Sistem SaaS Tender SPSE</p>
                                    </div>
                                    <button className="crawl-btn" onClick={() => { fetchAdminDashboard(); fetchAnalytics(); }}>
                                        <span>🔄</span> Refresh Data
                                    </button>
                                </div>

                                {/* Admin KPI Stats Grid */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
                                    {/* Total Users */}
                                    <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '16px', padding: '20px 22px', position: 'relative', overflow: 'hidden' }}>
                                        <div style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '60px', opacity: '0.05' }}>👥</div>
                                        <div style={{ fontSize: '11px', color: '#818cf8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Total Pengguna</div>
                                        <div style={{ fontSize: '36px', fontWeight: '800', color: '#fff', fontFamily: 'Outfit, sans-serif' }}>{adminDashboard?.total_users ?? '—'}</div>
                                        <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Terdaftar (kecuali admin)</div>
                                    </div>

                                    {/* Active Premium */}
                                    <div style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: '16px', padding: '20px 22px', position: 'relative', overflow: 'hidden' }}>
                                        <div style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '60px', opacity: '0.05' }}>💎</div>
                                        <div style={{ fontSize: '11px', color: '#fbbf24', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Premium Aktif</div>
                                        <div style={{ fontSize: '36px', fontWeight: '800', color: '#fbbf24', fontFamily: 'Outfit, sans-serif' }}>{adminDashboard?.active_premium ?? '—'}</div>
                                        <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Subscriber berbayar aktif</div>
                                    </div>

                                    {/* Active Trial */}
                                    <div style={{ background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.2)', borderRadius: '16px', padding: '20px 22px', position: 'relative', overflow: 'hidden' }}>
                                        <div style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '60px', opacity: '0.05' }}>🆓</div>
                                        <div style={{ fontSize: '11px', color: '#60a5fa', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Trial Aktif</div>
                                        <div style={{ fontSize: '36px', fontWeight: '800', color: '#60a5fa', fontFamily: 'Outfit, sans-serif' }}>{adminDashboard?.active_trial ?? '—'}</div>
                                        <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Pengguna akun gratis trial</div>
                                    </div>

                                    {/* Expired */}
                                    <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '16px', padding: '20px 22px', position: 'relative', overflow: 'hidden' }}>
                                        <div style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '60px', opacity: '0.05' }}>⏰</div>
                                        <div style={{ fontSize: '11px', color: '#f87171', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Langganan Kedaluwarsa</div>
                                        <div style={{ fontSize: '36px', fontWeight: '800', color: '#f87171', fontFamily: 'Outfit, sans-serif' }}>{adminDashboard?.expired_users ?? '—'}</div>
                                        <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Perlu diretarget untuk renewal</div>
                                    </div>

                                    {/* Total Revenue */}
                                    <div style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(5,150,105,0.08))', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '16px', padding: '20px 22px', position: 'relative', overflow: 'hidden' }}>
                                        <div style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '60px', opacity: '0.05' }}>💰</div>
                                        <div style={{ fontSize: '11px', color: '#34d399', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Total Revenue</div>
                                        <div style={{ fontSize: '26px', fontWeight: '800', color: '#34d399', fontFamily: 'Outfit, sans-serif' }}>{formatPaguVal(adminDashboard?.total_revenue ?? 0)}</div>
                                        <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>Dari {adminDashboard?.total_transactions ?? 0} transaksi berhasil</div>
                                    </div>

                                    {/* System Health */}
                                    <div style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: '16px', padding: '20px 22px', position: 'relative', overflow: 'hidden' }}>
                                        <div style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '60px', opacity: '0.05' }}>📊</div>
                                        <div style={{ fontSize: '11px', color: '#c084fc', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>K/L/Pemda/Instansi</div>
                                        <div style={{ fontSize: '36px', fontWeight: '800', color: '#c084fc', fontFamily: 'Outfit, sans-serif', marginTop: '4px' }}>{lpseInstances.length}</div>
                                        <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Target LPSE terhubung</div>
                                    </div>
                                </div>

                                {/* Revenue breakdown + User Distribution */}
                                <div className="dash-layout" style={{ marginBottom: '28px' }}>
                                    {/* Revenue Breakdown Panel */}
                                    <div className="panel">
                                        <div className="panel-header">
                                            <h3 className="panel-title">💰 Rincian Pendapatan</h3>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>📅</div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                                        <span style={{ fontSize: '14px', color: '#fff', fontWeight: '500' }}>Paket Bulanan (30H)</span>
                                                        <strong style={{ color: '#6366f1' }}>{formatPaguVal(adminDashboard?.revenue_monthly ?? 0)}</strong>
                                                    </div>
                                                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                                                        <div style={{ height: '100%', width: `${adminDashboard?.total_revenue > 0 ? Math.round((adminDashboard.revenue_monthly / adminDashboard.total_revenue) * 100) : 0}%`, background: 'linear-gradient(90deg, #6366f1, #818cf8)', borderRadius: '3px' }} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>📆</div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                                        <span style={{ fontSize: '14px', color: '#fff', fontWeight: '500' }}>Paket Tahunan (365H)</span>
                                                        <strong style={{ color: '#a855f7' }}>{formatPaguVal(adminDashboard?.revenue_yearly ?? 0)}</strong>
                                                    </div>
                                                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                                                        <div style={{ height: '100%', width: `${adminDashboard?.total_revenue > 0 ? Math.round((adminDashboard.revenue_yearly / adminDashboard.total_revenue) * 100) : 0}%`, background: 'linear-gradient(90deg, #a855f7, #c084fc)', borderRadius: '3px' }} />
                                                    </div>
                                                </div>
                                            </div>

                                            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontSize: '13px', color: '#9ca3af' }}>Total Revenue Keseluruhan</span>
                                                <strong style={{ fontSize: '20px', color: '#34d399', fontFamily: 'Outfit, sans-serif' }}>{formatPaguVal(adminDashboard?.total_revenue ?? 0)}</strong>
                                            </div>
                                        </div>
                                    </div>

                                    {/* User Plan Distribution + Tender Data */}
                                    <div className="panel">
                                        <div className="panel-header">
                                            <h3 className="panel-title">📊 Distribusi Pengguna & Sistem</h3>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                            {[
                                                { label: 'Pengguna Premium Aktif', value: adminDashboard?.active_premium ?? 0, total: adminDashboard?.total_users ?? 1, color: '#fbbf24', icon: '💎' },
                                                { label: 'Pengguna Trial Aktif', value: adminDashboard?.active_trial ?? 0, total: adminDashboard?.total_users ?? 1, color: '#60a5fa', icon: '🆓' },
                                                { label: 'Langganan Kedaluwarsa', value: adminDashboard?.expired_users ?? 0, total: adminDashboard?.total_users ?? 1, color: '#f87171', icon: '⏰' },
                                            ].map((item, idx) => (
                                                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <span style={{ fontSize: '18px', width: '24px', textAlign: 'center' }}>{item.icon}</span>
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '5px' }}>
                                                            <span style={{ color: '#9ca3af' }}>{item.label}</span>
                                                            <span style={{ color: '#fff', fontWeight: '600' }}>{item.value} <span style={{ color: '#6b7280', fontWeight: 'normal' }}>({item.total > 0 ? Math.round((item.value / item.total) * 100) : 0}%)</span></span>
                                                        </div>
                                                        <div style={{ height: '5px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                                                            <div style={{ height: '100%', width: `${item.total > 0 ? Math.round((item.value / item.total) * 100) : 0}%`, background: item.color, borderRadius: '3px', transition: 'width 0.6s ease' }} />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px', marginTop: '4px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                                <div style={{ textAlign: 'center', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                                                    <div style={{ fontSize: '20px', fontWeight: '700', color: '#fff' }}>{analytics?.total_tenders || 0}</div>
                                                    <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>Total Tender DB</div>
                                                </div>
                                                <div style={{ textAlign: 'center', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                                                    <div style={{ fontSize: '20px', fontWeight: '700', color: '#34d399' }}>{formatPaguVal(analytics?.total_pagu)}</div>
                                                    <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>Total Pagu DB</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Recent Users Table */}
                                <div className="panel">
                                    <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <h3 className="panel-title">👤 10 Pengguna Terbaru</h3>
                                        <button
                                            onClick={() => { setActiveTab('users'); fetchAdminUsers(); }}
                                            style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#818cf8', padding: '6px 14px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}
                                        >
                                            👥 Kelola User
                                        </button>
                                    </div>
                                    <div className="table-wrapper">
                                        <table className="tender-table">
                                            <thead>
                                                <tr>
                                                    <th>Email Pengguna</th>
                                                    <th>WhatsApp</th>
                                                    <th>Paket</th>
                                                    <th>Status</th>
                                                    <th>Berakhir</th>
                                                    <th>Tgl Daftar</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {adminDashboard?.recent_users && adminDashboard.recent_users.length > 0 ? (
                                                    adminDashboard.recent_users.map((user, idx) => {
                                                        const isExpired = user.end_date && new Date(user.end_date) < new Date();
                                                        const planLabel = user.plan_type === 'premium' ? 'Premium' : 'Trial';
                                                        const planColor = user.plan_type === 'premium' ? '#fbbf24' : '#60a5fa';
                                                        const statusColor = user.status === 'active' && !isExpired ? '#34d399' : '#f87171';
                                                        const statusLabel = isExpired ? 'Kedaluwarsa' : (user.status === 'active' ? 'Aktif' : 'Tidak Aktif');
                                                        return (
                                                            <tr key={idx}>
                                                                <td><span style={{ fontWeight: '500', color: '#fff' }}>{user.email}</span></td>
                                                                <td><span style={{ color: '#9ca3af', fontSize: '12px' }}>{user.whatsapp || '—'}</span></td>
                                                                <td>
                                                                    <span style={{ background: `${planColor}18`, color: planColor, border: `1px solid ${planColor}30`, padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' }}>
                                                                        {planLabel}
                                                                    </span>
                                                                </td>
                                                                <td>
                                                                    <span style={{ background: `${statusColor}15`, color: statusColor, border: `1px solid ${statusColor}25`, padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' }}>
                                                                        {statusLabel}
                                                                    </span>
                                                                </td>
                                                                <td>
                                                                    <span style={{ fontSize: '12px', color: isExpired ? '#f87171' : '#9ca3af' }}>
                                                                        {user.end_date ? new Date(user.end_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                                                                    </span>
                                                                </td>
                                                                <td>
                                                                    <span style={{ fontSize: '12px', color: '#6b7280' }}>
                                                                        {user.created_at ? new Date(user.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })
                                                ) : (
                                                    <tr>
                                                        <td colSpan="6" style={{ textAlign: 'center', color: '#6b7280', padding: '30px' }}>
                                                            {adminDashboard === null ? 'Memuat data pengguna...' : 'Belum ada pengguna terdaftar.'}
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Quick Actions Admin */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginTop: '24px' }}>
                                    {[
                                        { label: 'Scraper Control', icon: '⚡', desc: 'Jalankan crawling data', tab: 'control', color: '#6366f1' },
                                        { label: 'Alerts Notifikasi', icon: '🔔', desc: 'Lihat semua pemantauan', tab: 'alerts', color: '#a855f7' },
                                        { label: 'Explorer Tender', icon: '🔍', desc: 'Telusuri database tender', tab: 'explorer', color: '#06b6d4' },
                                        { label: 'IP Proxy Manager', icon: '🌐', desc: 'Pengaturan Proxy & Anti-Block', tab: 'proxy', color: '#10b981' },
                                        { label: 'Super Admin Settings', icon: '🛡️', desc: 'Konfigurasi sistem', tab: 'admin', color: '#f59e0b' },
                                    ].map((item, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => setActiveTab(item.tab)}
                                            style={{ background: `${item.color}0a`, border: `1px solid ${item.color}25`, borderRadius: '12px', padding: '16px', cursor: 'pointer', transition: 'all 0.2s' }}
                                            onMouseOver={e => { e.currentTarget.style.background = `${item.color}18`; e.currentTarget.style.borderColor = `${item.color}50`; }}
                                            onMouseOut={e => { e.currentTarget.style.background = `${item.color}0a`; e.currentTarget.style.borderColor = `${item.color}25`; }}
                                        >
                                            <div style={{ fontSize: '24px', marginBottom: '8px' }}>{item.icon}</div>
                                            <div style={{ fontSize: '14px', fontWeight: '600', color: '#fff', marginBottom: '4px' }}>{item.label}</div>
                                            <div style={{ fontSize: '12px', color: '#6b7280' }}>{item.desc}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        ) : (
                            /* ====== REGULAR USER DASHBOARD VIEW ====== */
                            <div>
                                <div className="header-dash">
                                    <div className="header-title">
                                        <h1>Overview Analytics</h1>
                                        <p>Statistik pemantauan tender SPSE real-time di seluruh Indonesia</p>
                                    </div>
                                </div>

                                {/* Stats Cards */}
                                <div className="stats-grid">
                                    <div className="card-stat primary">
                                        <span className="title">Total Tender di Sistem</span>
                                        <span className="value">{analytics?.total_tenders || 0}</span>
                                        <span className="desc">Semua data crawled di sistem</span>
                                    </div>
                                    <div className="card-stat success">
                                        <span className="title">Total Pagu (Rp)</span>
                                        <span className="value">{formatPaguVal(analytics?.total_pagu)}</span>
                                        <span className="desc">Pagu kumulatif proyek</span>
                                    </div>
                                    <div className="card-stat info">
                                        <span className="title">Tender Sesuai Keyword</span>
                                        <span className="value">{analytics?.keyword_tenders_count || 0}</span>
                                        <span className="desc">Tender yang cocok dengan keyword Anda</span>
                                    </div>

                                    <div className="card-stat warning">
                                        <span className="title">Total Keyword Disimpan</span>
                                        <span className="value">{analytics?.total_keywords || 0}</span>
                                        <span className="desc">Keyword pencarian aktif Anda</span>
                                    </div>
                                    <div className="card-stat purple">
                                        <span className="title">Total K/L/Pemda/Instansi</span>
                                        <span className="value">{lpseInstances.length || 0}</span>
                                        <span className="desc">Target LPSE terhubung</span>
                                    </div>
                                </div>

                                {/* User Subscription Status Banner */}
                                {(() => {
                                    const progress = getSubscriptionProgress();
                                    if (!progress) return null;
                                    return (
                                        <div className="sub-banner">
                                            <div className="sub-banner-info">
                                                <div style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '2px' }}>Status Langganan Anda</div>
                                                <div style={{ fontSize: '16px', fontWeight: '700', color: currentUser?.subscription?.plan_type === 'premium' ? '#fbbf24' : '#60a5fa', textTransform: 'uppercase' }}>
                                                    {currentUser?.subscription?.plan_type === 'premium' ? '💎 Premium Plan' : '🆓 Free / Trial'}
                                                </div>
                                                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                                                    Berakhir: {new Date(currentUser?.subscription?.end_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                                                </div>
                                            </div>
                                            <div className="sub-banner-progress">
                                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#9ca3af', marginBottom: '6px' }}>
                                                    <span>Sisa {progress.daysLeft} dari {progress.totalDays} hari</span>
                                                    <span style={{ color: progress.color, fontWeight: '600' }}>{Math.round(progress.percent)}% tersisa</span>
                                                </div>
                                                <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                                                    <div style={{ width: `${progress.percent}%`, height: '100%', background: `linear-gradient(90deg, ${progress.color}, #3b82f6)`, borderRadius: '4px', transition: 'width 0.8s ease' }} />
                                                </div>
                                            </div>
                                            {currentUser?.subscription?.plan_type !== 'premium' && (
                                                <button onClick={() => setActiveTab('billing')} className="btn-primary" style={{ padding: '8px 18px', fontSize: '13px', whiteSpace: 'nowrap' }}>
                                                    ⬆ Upgrade Premium
                                                </button>
                                            )}
                                        </div>
                                    );
                                })()}

                                {/* Dashboard Graphs & Lists Layout */}
                                <div className="dash-layout">
                                    {/* Graph Panel */}
                                    <div className="panel">
                                        <div className="panel-header">
                                            <h3 className="panel-title">Top 5 K/L/Pemda/Instansi dengan Pagu Terbesar</h3>
                                        </div>

                                        {analytics?.top_instansi && analytics.top_instansi.length > 0 ? (
                                            <div>
                                                <div className="chart-container">
                                                    {analytics.top_instansi.map((item, idx) => {
                                                        const maxPagu = Math.max(...analytics.top_instansi.map(x => x.pagu)) || 1;
                                                        const barHeight = `${Math.max(10, (item.pagu / maxPagu) * 100)}%`;

                                                        return (
                                                            <div className="chart-bar-wrapper" key={idx}>
                                                                <div className="chart-bar" style={{ height: barHeight }}>
                                                                    <span className="chart-bar-tooltip">
                                                                        {item.instansi}<br />
                                                                        <strong>{formatPaguVal(item.pagu)}</strong> ({item.count} paket)
                                                                    </span>
                                                                </div>
                                                                <span className="chart-label" title={item.instansi}>
                                                                    {item.instansi.split(' ')[0] || item.instansi}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                                <p style={{ fontSize: '12px', color: '#9ca3af', textAlign: 'center', marginTop: '10px' }}>
                                                    (Arahkan kursor ke grafik batang untuk info detail K/L/Pemda/Instansi)
                                                </p>
                                            </div>
                                        ) : (
                                            <div style={{ padding: '40px 0', textOrigin: 'center', color: '#6b7280', textAlign: 'center' }}>
                                                Belum ada data visualisasi K/L/Pemda/Instansi. Menunggu data dari database.
                                            </div>
                                        )}
                                    </div>

                                    {/* Sidebar Recent Activity / Stats */}
                                    <div className="panel">
                                        <div className="panel-header">
                                            <h3 className="panel-title">Distribusi Kategori</h3>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                            {analytics?.kategori_stats && analytics.kategori_stats.length > 0 ? (
                                                analytics.kategori_stats.map((item, idx) => (
                                                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px' }}>
                                                        <div>
                                                            <strong style={{ color: '#fff', textTransform: 'capitalize' }}>{item.category}</strong>
                                                            <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>{item.count} Paket pengadaan</div>
                                                        </div>
                                                        <span style={{ color: '#34d399', fontWeight: '600' }}>{formatPaguVal(item.pagu)}</span>
                                                    </div>
                                                ))
                                            ) : (
                                                <div style={{ color: '#6b7280', textAlign: 'center', fontSize: '13px', padding: '20px 0' }}>
                                                    Tidak ada sebaran kategori.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Top 5 Tenders Table */}
                                <div className="panel" style={{ marginTop: '24px' }}>
                                    <div className="panel-header">
                                        <h3 className="panel-title">Tender Bernilai Paling Tinggi</h3>
                                    </div>
                                    <div className="table-wrapper">
                                        <table className="tender-table">
                                            <thead>
                                                <tr>
                                                    <th>Nomor Pengadaan</th>
                                                    <th>Nama Paket Tender</th>
                                                    <th>K/L/Pemda/Instansi</th>
                                                    <th>Pagu Anggaran</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {analytics?.top_tenders && analytics.top_tenders.length > 0 ? (
                                                    analytics.top_tenders.map((tender, index) => (
                                                        <tr key={index} onClick={() => handleViewTenderDetail(tender.nomor_pengadaan)} style={{ cursor: 'pointer' }}>
                                                            <td data-label="Nomor Pengadaan"><strong>{tender.nomor_pengadaan}</strong></td>
                                                            <td data-label="Nama Paket">
                                                                {renderTenderTitle(tender.nama_tender)}
                                                            </td>
                                                            <td data-label="Instansi">{tender.instansi}</td>
                                                            <td data-label="Pagu"><span style={{ color: '#fbbf24', fontWeight: 'bold' }}>{tender.pagu}</span></td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="4" style={{ textAlign: 'center', color: '#6b7280', padding: '30px' }}>
                                                            Tidak ada data tender bernilai tinggi.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* TAB: USER MANAGER */}
                {activeTab === 'users' && (
                    <div>
                        <div className="header-dash" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div className="header-title">
                                <h1>User Manager (Super Admin Only)</h1>
                                <p>Mengelola hak akses role, status premium, buat user baru, dan pengiriman kredensial login</p>
                            </div>
                            <button
                                onClick={() => { setCreateUserModal(true); setCreateUserMsg(null); }}
                                className="btn-primary"
                                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '10px', fontWeight: '700' }}
                            >
                                ➕ Tambah User Baru
                            </button>
                        </div>

                        {/* Create User Modal */}
                        {createUserModal && (
                            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                                <div style={{ background: '#0f1322', border: '1px solid rgba(99,102,241,0.4)', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '480px', boxShadow: '0 25px 60px rgba(0,0,0,0.6)' }}>
                                    <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '6px', color: '#fff' }}>➕ Tambah User Baru</h3>
                                    <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '20px' }}>
                                        Daftarkan akun baru ke platform dan atur role serta langganannya.
                                    </p>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                        <div>
                                            <label style={{ fontSize: '12px', color: '#9ca3af', display: 'block', marginBottom: '6px', fontWeight: '600', textTransform: 'uppercase' }}>Alamat Email *</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                placeholder="contoh: user@perusahaan.com"
                                                value={createUserForm.email}
                                                onChange={e => setCreateUserForm(prev => ({ ...prev, email: e.target.value }))}
                                                autoFocus
                                            />
                                        </div>

                                        <div>
                                            <label style={{ fontSize: '12px', color: '#9ca3af', display: 'block', marginBottom: '6px', fontWeight: '600', textTransform: 'uppercase' }}>Password *</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                placeholder="Minimal 6 karakter"
                                                value={createUserForm.password}
                                                onChange={e => setCreateUserForm(prev => ({ ...prev, password: e.target.value }))}
                                            />
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                            <div>
                                                <label style={{ fontSize: '12px', color: '#9ca3af', display: 'block', marginBottom: '6px', fontWeight: '600', textTransform: 'uppercase' }}>Role</label>
                                                <select
                                                    className="form-control"
                                                    value={createUserForm.role}
                                                    onChange={e => setCreateUserForm(prev => ({ ...prev, role: e.target.value }))}
                                                >
                                                    <option value="user">User (Reguler)</option>
                                                    <option value="admin">Admin (Super Admin)</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label style={{ fontSize: '12px', color: '#9ca3af', display: 'block', marginBottom: '6px', fontWeight: '600', textTransform: 'uppercase' }}>WhatsApp</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="081234567890"
                                                    value={createUserForm.whatsapp}
                                                    onChange={e => setCreateUserForm(prev => ({ ...prev, whatsapp: e.target.value }))}
                                                />
                                            </div>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                            <div>
                                                <label style={{ fontSize: '12px', color: '#9ca3af', display: 'block', marginBottom: '6px', fontWeight: '600', textTransform: 'uppercase' }}>Paket Langganan</label>
                                                <select
                                                    className="form-control"
                                                    value={createUserForm.plan_type}
                                                    onChange={e => setCreateUserForm(prev => ({ ...prev, plan_type: e.target.value }))}
                                                >
                                                    <option value="trial">Trial / Free</option>
                                                    <option value="premium">Premium</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label style={{ fontSize: '12px', color: '#9ca3af', display: 'block', marginBottom: '6px', fontWeight: '600', textTransform: 'uppercase' }}>Durasi (Hari)</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    placeholder="30"
                                                    value={createUserForm.duration_days}
                                                    onChange={e => setCreateUserForm(prev => ({ ...prev, duration_days: parseInt(e.target.value) || 0 }))}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {createUserMsg && (
                                        <div style={{ marginTop: '14px', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', background: createUserMsg.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: createUserMsg.type === 'success' ? '#34d399' : '#f87171', border: `1px solid ${createUserMsg.type === 'success' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
                                            {createUserMsg.text}
                                        </div>
                                    )}

                                    <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
                                        <button
                                            onClick={handleCreateUser}
                                            className="btn-primary"
                                            style={{ flex: 1, padding: '10px', justifyContent: 'center', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', border: 'none' }}
                                        >
                                            💾 Simpan User Baru
                                        </button>
                                        <button
                                            onClick={() => { setCreateUserModal(false); setCreateUserMsg(null); }}
                                            style={{ flex: 1, padding: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#9ca3af', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}
                                        >
                                            Batal
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Edit User Modal */}
                        {editUserModal && (
                            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                                <div style={{ background: '#0f1322', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '440px', boxShadow: '0 25px 60px rgba(0,0,0,0.6)' }}>
                                    <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '6px', color: '#fff' }}>✏️ Edit User & Role</h3>
                                    <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '24px' }}>
                                        User: <strong style={{ color: '#818cf8' }}>{editUserModal.email}</strong>
                                    </p>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        <div>
                                            <label style={{ fontSize: '12px', color: '#9ca3af', display: 'block', marginBottom: '6px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Role Pengguna</label>
                                            <select
                                                className="form-control"
                                                value={editUserForm.role || 'user'}
                                                onChange={e => setEditUserForm(prev => ({ ...prev, role: e.target.value }))}
                                            >
                                                <option value="user">User (Pengguna Reguler)</option>
                                                <option value="admin">Admin (Super Admin)</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label style={{ fontSize: '12px', color: '#9ca3af', display: 'block', marginBottom: '6px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tipe Paket</label>
                                            <select
                                                className="form-control"
                                                value={editUserForm.plan_type}
                                                onChange={e => setEditUserForm(prev => ({ ...prev, plan_type: e.target.value }))}
                                            >
                                                <option value="trial">Trial / Free</option>
                                                <option value="premium">Premium</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label style={{ fontSize: '12px', color: '#9ca3af', display: 'block', marginBottom: '6px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status Langganan</label>
                                            <select
                                                className="form-control"
                                                value={editUserForm.status}
                                                onChange={e => setEditUserForm(prev => ({ ...prev, status: e.target.value }))}
                                            >
                                                <option value="active">Aktif</option>
                                                <option value="inactive">Nonaktif</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label style={{ fontSize: '12px', color: '#9ca3af', display: 'block', marginBottom: '6px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Durasi Langganan (Hari)</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder="Jumlah hari durasi"
                                                value={editUserForm.duration_days}
                                                onChange={e => setEditUserForm(prev => ({ ...prev, duration_days: parseInt(e.target.value) || 0 }))}
                                            />
                                            <span style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px', display: 'block' }}>
                                                Masukkan jumlah hari aktif (misal: 30 untuk 1 bulan, 365 untuk 1 tahun). Gunakan 0 jika ingin menonaktifkan durasi manual.
                                            </span>
                                        </div>
                                    </div>

                                    {editUserMsg && (
                                        <div style={{ marginTop: '14px', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', background: editUserMsg.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: editUserMsg.type === 'success' ? '#34d399' : '#f87171', border: `1px solid ${editUserMsg.type === 'success' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
                                            {editUserMsg.text}
                                        </div>
                                    )}

                                    <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
                                        <button
                                            onClick={handleUpdateUserSub}
                                            className="btn-primary"
                                            style={{ flex: 1, padding: '10px', justifyContent: 'center', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', border: 'none' }}
                                        >
                                            💾 Simpan Perubahan
                                        </button>
                                        <button
                                            onClick={() => { setEditUserModal(null); setEditUserMsg(null); }}
                                            style={{ flex: 1, padding: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#9ca3af', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}
                                        >
                                            Batal
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Delete Confirmation Modal */}
                        {deleteUserConfirm && (
                            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                                <div style={{ background: '#0f1322', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '420px', textAlign: 'center', boxShadow: '0 25px 60px rgba(0,0,0,0.6)' }}>
                                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🗑️</div>
                                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', marginBottom: '8px' }}>Hapus Pengguna?</h3>
                                    <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '6px' }}>Aksi ini tidak dapat dibatalkan. Semua data berikut akan dihapus permanen:</p>
                                    <p style={{ fontSize: '14px', color: '#f87171', fontWeight: '600', marginBottom: '4px' }}>{deleteUserConfirm.email}</p>
                                    <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '24px' }}>Alert, Bookmarks, Transaksi, dan Langganan</p>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button
                                            onClick={() => handleDeleteUser(deleteUserConfirm.id)}
                                            style={{ flex: 1, padding: '11px', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.35)', color: '#f87171', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}
                                        >
                                            Ya, Hapus
                                        </button>
                                        <button
                                            onClick={() => setDeleteUserConfirm(null)}
                                            style={{ flex: 1, padding: '11px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#9ca3af', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}
                                        >
                                            Batal
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Change Password Modal */}
                        {changePasswordModal && (
                            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                                <div style={{ background: '#0f1322', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '440px', boxShadow: '0 25px 60px rgba(0,0,0,0.6)' }}>
                                    <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '6px', color: '#fff' }}>🔑 Ubah Password</h3>
                                    <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '24px' }}>
                                        User: <strong style={{ color: '#34d399' }}>{changePasswordModal.email}</strong>
                                    </p>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        <div>
                                            <label style={{ fontSize: '12px', color: '#9ca3af', display: 'block', marginBottom: '6px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password Baru</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                placeholder="Masukkan password baru (min 6 karakter)"
                                                value={newPassword}
                                                onChange={e => setNewPassword(e.target.value)}
                                                autoFocus
                                            />
                                        </div>
                                    </div>

                                    {passwordMsg && (
                                        <div style={{ marginTop: '14px', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', background: passwordMsg.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: passwordMsg.type === 'success' ? '#34d399' : '#f87171', border: `1px solid ${passwordMsg.type === 'success' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
                                            {passwordMsg.text}
                                        </div>
                                    )}

                                    <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
                                        <button
                                            onClick={handleUpdateUserPassword}
                                            className="btn-primary"
                                            style={{ flex: 1, padding: '10px', justifyContent: 'center', background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none' }}
                                        >
                                            💾 Simpan Password
                                        </button>
                                        <button
                                            onClick={() => { setChangePasswordModal(null); setNewPassword(''); setPasswordMsg(null); }}
                                            style={{ flex: 1, padding: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#9ca3af', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}
                                        >
                                            Batal
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Users Table */}
                        <div className="panel">
                            {/* Search & Filters */}
                            <div className="filters-bar" style={{ marginBottom: '20px' }}>
                                <div className="search-input-wrapper">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Cari email atau nomor WhatsApp..."
                                        value={userSearchQuery}
                                        onChange={(e) => setUserSearchQuery(e.target.value)}
                                        style={{ width: '100%' }}
                                    />
                                </div>

                                <select
                                    className="form-control"
                                    value={userFilterRole}
                                    onChange={(e) => setUserFilterRole(e.target.value)}
                                >
                                    <option value="">-- Semua Role --</option>
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>

                                <select
                                    className="form-control"
                                    value={userFilterPlan}
                                    onChange={(e) => setUserFilterPlan(e.target.value)}
                                >
                                    <option value="">-- Semua Paket --</option>
                                    <option value="trial">Trial / Free</option>
                                    <option value="premium">Premium</option>
                                </select>

                                <select
                                    className="form-control"
                                    value={userFilterStatus}
                                    onChange={(e) => setUserFilterStatus(e.target.value)}
                                >
                                    <option value="">-- Semua Status --</option>
                                    <option value="active">Aktif</option>
                                    <option value="inactive">Nonaktif</option>
                                    <option value="expired">Kedaluwarsa</option>
                                </select>
                            </div>

                            <div className="table-wrapper">
                                <table className="tender-table">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Email Pengguna</th>
                                            <th>Role</th>
                                            <th>WhatsApp</th>
                                            <th>Paket</th>
                                            <th>Status</th>
                                            <th>Berakhir</th>
                                            <th>Tgl Daftar</th>
                                            <th style={{ textAlign: 'center' }}>Kirim Akses Login</th>
                                            <th style={{ textAlign: 'center' }}>Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(() => {
                                            const filteredAdminUsers = adminUsers.filter(user => {
                                                const matchesSearch = !userSearchQuery.trim() ||
                                                    (user.email && user.email.toLowerCase().includes(userSearchQuery.toLowerCase())) ||
                                                    (user.whatsapp && user.whatsapp.includes(userSearchQuery));
                                                const matchesPlan = !userFilterPlan || user.plan_type === userFilterPlan;
                                                const matchesRole = !userFilterRole || user.role === userFilterRole;

                                                let status = user.status;
                                                const isExpired = user.end_date && new Date(user.end_date) < new Date();
                                                if (isExpired) {
                                                    status = 'expired';
                                                } else if (user.status !== 'active') {
                                                    status = 'inactive';
                                                }
                                                const matchesStatus = !userFilterStatus || status === userFilterStatus;

                                                return matchesSearch && matchesPlan && matchesStatus && matchesRole;
                                            });

                                            return filteredAdminUsers.length > 0 ? (
                                                filteredAdminUsers.map((user, idx) => {
                                                    const isExpired = user.end_date && new Date(user.end_date) < new Date();
                                                    const planLabel = user.plan_type === 'premium' ? 'Premium' : 'Trial';
                                                    const planColor = user.plan_type === 'premium' ? '#fbbf24' : '#60a5fa';
                                                    const statusColor = user.status === 'active' && !isExpired ? '#34d399' : '#f87171';
                                                    const statusLabel = isExpired ? 'Kedaluwarsa' : (user.status === 'active' ? 'Aktif' : 'Nonaktif');
                                                    const isAdmin = user.role === 'admin';
                                                    const notifyState = notifyMsg && notifyMsg.userId === user.id ? notifyMsg : null;

                                                    return (
                                                        <tr key={user.id}>
                                                            <td data-label="#" style={{ color: '#6b7280', fontSize: '12px' }}>{user.id}</td>
                                                            <td data-label="Email Pengguna"><span style={{ fontWeight: '500', color: '#fff' }}>{user.email}</span></td>
                                                            <td data-label="Role">
                                                                <span style={{ background: isAdmin ? 'rgba(239,68,68,0.15)' : 'rgba(99,102,241,0.15)', color: isAdmin ? '#f87171' : '#818cf8', border: `1px solid ${isAdmin ? 'rgba(239,68,68,0.3)' : 'rgba(99,102,241,0.3)'}`, padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>
                                                                    {user.role || 'USER'}
                                                                </span>
                                                            </td>
                                                            <td data-label="WhatsApp"><span style={{ color: '#9ca3af', fontSize: '12px' }}>{user.whatsapp || '—'}</span></td>
                                                            <td data-label="Paket">
                                                                <span style={{ background: `${planColor}18`, color: planColor, border: `1px solid ${planColor}30`, padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' }}>
                                                                    {planLabel}
                                                                </span>
                                                            </td>
                                                            <td data-label="Status">
                                                                <span style={{ background: `${statusColor}15`, color: statusColor, border: `1px solid ${statusColor}25`, padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' }}>
                                                                    {statusLabel}
                                                                </span>
                                                            </td>
                                                            <td data-label="Berakhir"><span style={{ fontSize: '12px', color: isExpired ? '#f87171' : '#9ca3af' }}>{user.end_date ? new Date(user.end_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}</span></td>
                                                            <td data-label="Tgl Daftar"><span style={{ fontSize: '12px', color: '#6b7280' }}>{user.created_at ? new Date(user.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}</span></td>
                                                            <td data-label="Kirim Akses Login">
                                                                <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', alignItems: 'center' }}>
                                                                    {user.whatsapp ? (
                                                                        <a
                                                                            href={getWaMeUrl(user.whatsapp, user.email, user.role)}
                                                                            target="_blank"
                                                                            rel="noreferrer"
                                                                            title="Kirim via WhatsApp (wa.me)"
                                                                            style={{ padding: '4px 8px', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', color: '#34d399', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', textDecoration: 'none', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                                                                        >
                                                                            💬 wa.me
                                                                        </a>
                                                                    ) : null}

                                                                    <button
                                                                        onClick={() => handleNotifyWA(user)}
                                                                        title="Kirim via Fonnte WA Gateway"
                                                                        style={{ padding: '4px 8px', background: 'rgba(16,185,129,0.18)', border: '1px solid rgba(16,185,129,0.35)', color: '#10b981', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                                                                    >
                                                                        ⚡ Fonnte
                                                                    </button>

                                                                    <button
                                                                        onClick={() => handleNotifyEmail(user)}
                                                                        title="Kirim via Email SMTP"
                                                                        style={{ padding: '4px 8px', background: 'rgba(99,102,241,0.18)', border: '1px solid rgba(99,102,241,0.35)', color: '#818cf8', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                                                                    >
                                                                        📧 Email
                                                                    </button>
                                                                </div>
                                                                {notifyState && (
                                                                    <div style={{ fontSize: '10px', marginTop: '4px', textAlign: 'center', color: notifyState.type === 'success' ? '#34d399' : (notifyState.type === 'error' ? '#f87171' : '#818cf8') }}>
                                                                        {notifyState.text}
                                                                    </div>
                                                                )}
                                                            </td>
                                                            <td data-label="Aksi">
                                                                <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                                                                    <button
                                                                        onClick={() => {
                                                                            setEditUserModal({ id: user.id, email: user.email, role: user.role });
                                                                            setEditUserForm({ role: user.role || 'user', plan_type: user.plan_type || 'trial', status: user.status || 'active', duration_days: 0 });
                                                                            setEditUserMsg(null);
                                                                        }}
                                                                        style={{ padding: '4px 10px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', color: '#818cf8', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}
                                                                    >
                                                                        ✏️ Edit
                                                                    </button>
                                                                    <button
                                                                        onClick={() => {
                                                                            setChangePasswordModal({ id: user.id, email: user.email });
                                                                            setNewPassword('');
                                                                            setPasswordMsg(null);
                                                                        }}
                                                                        style={{ padding: '4px 10px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#34d399', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}
                                                                    >
                                                                        🔑 Password
                                                                    </button>
                                                                    <button
                                                                        onClick={() => setDeleteUserConfirm(user)}
                                                                        style={{ padding: '4px 10px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}
                                                                    >
                                                                        🗑️
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            ) : (
                                                <tr>
                                                    <td colSpan="10" style={{ textAlign: 'center', color: '#6b7280', padding: '40px' }}>
                                                        Tidak ada data pengguna.
                                                    </td>
                                                </tr>
                                            );
                                        })()}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB: EXPLORER TENDER */}

                {activeTab === 'explorer' && (
                    <div>
                        <div className="header-dash">
                            <div className="header-title">
                                <h1>Explorer &amp; Cari Tender</h1>
                                <p>Telusuri tender nasional maupun regional dengan pencarian syarat kualifikasi lokal</p>
                            </div>
                        </div>

                        <div className="panel">
                            {/* Search & Filters */}
                            <div className="filters-bar">
                                <div className="search-input-wrapper">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Cari kata kunci dalam nama atau kualifikasi..."
                                        value={searchQuery}
                                        onChange={(e) => { setSearchQuery(e.target.value); setOffset(0); }}
                                        style={{ width: '100%' }}
                                    />
                                </div>

                                <select
                                    className="form-control"
                                    value={explorerFilterJenisInstansi}
                                    onChange={(e) => {
                                        setExplorerFilterJenisInstansi(e.target.value);
                                        setFilterKategori(''); // Reset LPSE selection when Jenis Instansi changes
                                        setOffset(0);
                                    }}
                                >
                                    <option value="">-- Semua Jenis Instansi --</option>
                                    {[...new Set(lpseInstances.map(i => i.jenis).filter(Boolean))].map((jenis, idx) => (
                                        <option key={idx} value={jenis}>{jenis}</option>
                                    ))}
                                </select>

                                <select
                                    className="form-control"
                                    value={filterKategori}
                                    onChange={(e) => { setFilterKategori(e.target.value); setOffset(0); }}
                                >
                                    <option value="">-- Semua LPSE Kategori --</option>
                                    {lpseInstances
                                        .filter(inst => explorerFilterJenisInstansi ? inst.jenis === explorerFilterJenisInstansi : true)
                                        .map((inst, idx) => (
                                            <option key={idx} value={inst.slug}>{inst.name}</option>
                                        ))}
                                </select>

                                <select
                                    className="form-control"
                                    value={filterTipe}
                                    onChange={(e) => { setFilterTipe(e.target.value); setOffset(0); }}
                                >
                                    <option value="">-- Semua Tipe --</option>
                                    <option value="tender">Tender</option>
                                    <option value="nontender">Non-Tender</option>
                                </select>

                                <select
                                    className="form-control"
                                    value={filterJenis}
                                    onChange={(e) => { setFilterJenis(e.target.value); setOffset(0); }}
                                >
                                    <option value="">-- Semua Jenis Pengadaan --</option>
                                    <option value="Pengadaan Barang">Pengadaan Barang</option>
                                    <option value="Pekerjaan Konstruksi">Pekerjaan Konstruksi</option>
                                    <option value="Jasa Konsultansi">Jasa Konsultansi (Semua)</option>
                                    <option value="Jasa Konsultansi Badan Usaha">Jasa Konsultansi Badan Usaha</option>
                                    <option value="Jasa Konsultansi Perorangan">Jasa Konsultansi Perorangan</option>
                                    <option value="Jasa Lainnya">Jasa Lainnya</option>
                                    <option value="Pekerjaan Konstruksi Terintegrasi">Pekerjaan Konstruksi Terintegrasi</option>
                                </select>

                                <select
                                    className="form-control"
                                    value={filterTahap}
                                    onChange={(e) => { setFilterTahap(e.target.value); setOffset(0); }}
                                >
                                    <option value="">-- Semua Tahap --</option>
                                    <option value="Pengumuman">Pengumuman (Pasca/PraKualifikasi)</option>
                                    <option value="Download Dokumen">Download Dokumen Pemilihan</option>
                                    <option value="Pemberian Penjelasan">Pemberian Penjelasan (Aanwijzing)</option>
                                    <option value="Upload Dokumen Penawaran">Upload Dokumen Penawaran</option>
                                    <option value="Pembukaan Dokumen">Pembukaan Dokumen Penawaran</option>
                                    <option value="Evaluasi">Evaluasi (Admin/Teknis/Harga)</option>
                                    <option value="Penetapan Pemenang">Penetapan / Pengumuman Pemenang</option>
                                    <option value="Masa Sanggah">Masa Sanggah</option>
                                    <option value="Surat Penunjukan">Surat Penunjukan (SPPBJ)</option>
                                    <option value="Penandatanganan Kontrak">Penandatanganan Kontrak</option>
                                </select>

                                <select
                                    className="form-control"
                                    value={filterTahun}
                                    onChange={(e) => { setFilterTahun(e.target.value); setOffset(0); }}
                                >
                                    {dynamicYears.map((yr) => (
                                        <option key={yr} value={yr}>{yr}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Table */}
                            {isLoadingExplorer ? (
                                <div style={{ textAlign: 'center', padding: '60px' }}>
                                    <div className="spinner"></div>
                                    <p style={{ marginTop: '12px', color: '#9ca3af' }}>Memuat database tender...</p>
                                </div>
                            ) : (
                                <div className="table-wrapper">
                                    <table className="tender-table">
                                        <thead>
                                            <tr>
                                                <th>Nomor</th>
                                                <th>Nama Paket</th>
                                                <th>K/L/Pemda/Instansi</th>
                                                <th>Jenis/Tipe</th>
                                                <th>Pagu</th>
                                                <th>Tahap Saat Ini</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tenders.length > 0 ? (
                                                tenders.map((tender, index) => (
                                                    <tr key={index} onClick={() => handleViewTenderDetail(tender.nomor_pengadaan)}>
                                                        <td data-label="Nomor">{tender.nomor_pengadaan}</td>
                                                        <td data-label="Nama Paket">
                                                            <div style={{ fontWeight: '500', color: '#fff' }}>
                                                                {renderTenderTitle(tender.nama_tender)}
                                                            </div>
                                                            <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>
                                                                Lokasi: {tender.lokasi_pekerjaan || '-'}
                                                            </div>
                                                        </td>
                                                        <td data-label="Instansi">{tender.instansi}</td>
                                                        <td data-label="Jenis/Tipe">
                                                            <span className={`badge ${tender.tipe === 'tender' ? 'badge-tender' : 'badge-nontender'}`}>
                                                                {tender.tipe ? tender.tipe.toUpperCase() : 'TENDER'}
                                                            </span>
                                                            <div style={{ fontSize: '11px', color: '#818cf8', marginTop: '4px', fontWeight: '500' }}>
                                                                {tender.jenis_pengadaan ? tender.jenis_pengadaan.replace(/\s*-\s*TA\s*\d{4}.*/gi, '') : (tender.kategori || '-')}
                                                            </div>
                                                        </td>
                                                        <td data-label="Pagu"><span style={{ color: '#fbbf24', fontWeight: 'bold' }}>{tender.pagu}</span></td>
                                                        <td data-label="Tahap">
                                                            <span style={getTahapStyle(tender.tahap)}>{tender.tahap || '-'}</span>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="6" style={{ textAlign: 'center', color: '#6b7280', padding: '40px' }}>
                                                        Tidak ada tender yang ditemukan untuk filter kata kunci saat ini.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Pagination */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                                <div style={{ fontSize: '13px', color: '#9ca3af' }}>
                                    Menampilkan {tenders.length} dari {totalTenders} total data
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                        className="form-control"
                                        disabled={offset === 0}
                                        onClick={() => setOffset(Math.max(0, offset - limit))}
                                        style={{ cursor: offset === 0 ? 'not-allowed' : 'pointer', padding: '6px 12px' }}
                                    >
                                        Sebelumnya
                                    </button>
                                    <button
                                        className="form-control"
                                        disabled={offset + limit >= totalTenders}
                                        onClick={() => setOffset(offset + limit)}
                                        style={{ cursor: offset + limit >= totalTenders ? 'not-allowed' : 'pointer', padding: '6px 12px' }}
                                    >
                                        Selanjutnya
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB: PELUANG KEYWORD */}
                {activeTab === 'keyword-tenders' && (
                    <div>
                        <div className="header-dash">
                            <div className="header-title">
                                <h1>Peluang Anda (Sesuai Keyword)</h1>
                                <p>Menampilkan semua tender yang cocok dengan keyword pencarian aktif Anda</p>
                            </div>
                        </div>

                        <div style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.25)', borderRadius: '10px', padding: '14px 18px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px', color: '#93c5fd', fontSize: '13px', lineHeight: '1.5' }}>
                            <span style={{ fontSize: '20px' }}>🔔</span>
                            <div>
                                <strong>Kriteria Notifikasi & Proyek Aktif:</strong> Notifikasi WhatsApp & Email dikirimkan <strong>berjeda 5 detik</strong> per pesan khusus untuk <strong>Proyek Aktif</strong> (tahapan sebelum <em>"Tender Sudah Selesai"</em>).
                            </div>
                        </div>

                        <div className="panel">
                            {isLoadingKeywordTenders ? (
                                <div style={{ textAlign: 'center', padding: '60px' }}>
                                    <div className="spinner"></div>
                                    <p style={{ marginTop: '12px', color: '#9ca3af' }}>Memuat peluang tender...</p>
                                </div>
                            ) : (
                                <div className="table-wrapper">
                                    <table className="tender-table">
                                        <thead>
                                            <tr>
                                                <th>Nomor</th>
                                                <th>Nama Paket</th>
                                                <th>K/L/Pemda/Instansi</th>
                                                <th>Jenis/Tipe</th>
                                                <th>Pagu</th>
                                                <th>Tahap Saat Ini</th>
                                                <th>Status Proyek</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {keywordTenders.length > 0 ? (
                                                keywordTenders.map((tender, index) => {
                                                    const isActive = tender.is_active !== undefined ? tender.is_active : !(tender.tahap && (tender.tahap.toLowerCase().includes('selesai') || tender.tahap.toLowerCase().includes('batal') || tender.tahap.toLowerCase().includes('gagal')));
                                                    return (
                                                        <tr key={index} onClick={() => handleViewTenderDetail(tender.nomor_pengadaan)}>
                                                            <td data-label="Nomor">{tender.nomor_pengadaan}</td>
                                                            <td data-label="Nama Paket">
                                                                <div style={{ fontWeight: '500', color: '#fff' }}>
                                                                    {renderTenderTitle(tender.nama_tender)}
                                                                </div>
                                                                <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>
                                                                    Lokasi: {tender.lokasi_pekerjaan || '-'}
                                                                </div>
                                                            </td>
                                                            <td data-label="Instansi">{tender.instansi}</td>
                                                            <td data-label="Jenis/Tipe">
                                                                <span className={`badge ${tender.tipe === 'tender' ? 'badge-tender' : 'badge-nontender'}`}>
                                                                    {tender.tipe}
                                                                </span>
                                                                <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>
                                                                    {tender.kategori}
                                                                </div>
                                                            </td>
                                                            <td data-label="Pagu"><span style={{ color: '#fbbf24', fontWeight: 'bold' }}>{tender.pagu}</span></td>
                                                            <td data-label="Tahap">
                                                                <span style={getTahapStyle(tender.tahap)}>{tender.tahap || '-'}</span>
                                                            </td>
                                                            <td data-label="Status Proyek">
                                                                {isActive ? (
                                                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(34, 197, 94, 0.15)', color: '#4ade80', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: '20px', padding: '3px 10px', fontSize: '11px', fontWeight: '600' }}>
                                                                        ● Proyek Aktif
                                                                    </span>
                                                                ) : (
                                                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(156, 163, 175, 0.15)', color: '#9ca3af', border: '1px solid rgba(156, 163, 175, 0.3)', borderRadius: '20px', padding: '3px 10px', fontSize: '11px', fontWeight: '500' }}>
                                                                        Tender Selesai
                                                                    </span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            ) : (
                                                <tr>
                                                    <td colSpan="6" style={{ textAlign: 'center', color: '#6b7280', padding: '40px' }}>
                                                        Tidak ada tender yang ditemukan. Pastikan Anda sudah menambahkan keyword di menu Alerts Notifikasi.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Pagination */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                                <div style={{ fontSize: '13px', color: '#9ca3af' }}>
                                    Menampilkan {keywordTenders.length} dari {totalKeywordTenders} total data peluang
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                        className="form-control"
                                        disabled={keywordOffset === 0}
                                        onClick={() => setKeywordOffset(Math.max(0, keywordOffset - keywordLimit))}
                                        style={{ cursor: keywordOffset === 0 ? 'not-allowed' : 'pointer', padding: '6px 12px' }}
                                    >
                                        Sebelumnya
                                    </button>
                                    <button
                                        className="form-control"
                                        disabled={keywordOffset + keywordLimit >= totalKeywordTenders}
                                        onClick={() => setKeywordOffset(keywordOffset + keywordLimit)}
                                        style={{ cursor: keywordOffset + keywordLimit >= totalKeywordTenders ? 'not-allowed' : 'pointer', padding: '6px 12px' }}
                                    >
                                        Selanjutnya
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB: ALERTS NOTIFIKASI */}
                {activeTab === 'alerts' && (() => {
                    const totalKeywordsCount = alerts.reduce((acc, alert) => {
                        if (!alert.keyword) return acc;
                        const kwList = alert.keyword.split(',').map(k => k.trim()).filter(Boolean);
                        return acc + kwList.length;
                    }, 0);

                    const hasAllLpse = alerts.some(a => a.instansi === 'all' || a.instansi === '');
                    let lpseTargetDisplay = '0 Target LPSE';
                    if (hasAllLpse) {
                        const totalLpse = lpseInstances.length || 0;
                        lpseTargetDisplay = `Semua LPSE (${totalLpse} LPSE)`;
                    } else {
                        const uniqueSlugs = new Set(alerts.map(a => a.instansi).filter(Boolean));
                        lpseTargetDisplay = `${uniqueSlugs.size} Target LPSE`;
                    }

                    return (
                        <div>
                            <div className="header-dash">
                                <div className="header-title">
                                    <h1>Alerts Notifikasi</h1>
                                    <p>Pantau kata kunci target Anda dan terima notifikasi instan melalui Email &amp; WhatsApp ketika tender baru diterbitkan</p>
                                </div>
                            </div>

                            {/* Premium Stats Grid for Alerts */}
                            <div className="stats-grid" style={{ marginBottom: '24px' }}>
                                <div className="card-stat primary" style={{ padding: '16px 20px' }}>
                                    <span className="title" style={{ fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pemantauan Aktif</span>
                                    <div style={{ marginTop: '8px', display: 'flex', alignItems: 'baseline', gap: '14px', flexWrap: 'wrap' }}>
                                        <div>
                                            <span style={{ fontSize: '26px', fontWeight: '800', color: '#fff' }}>{totalKeywordsCount}</span>
                                            <span style={{ fontSize: '13px', color: '#818cf8', marginLeft: '6px', fontWeight: '600' }}>Kata Kunci</span>
                                        </div>
                                        <div style={{ borderLeft: '1px solid rgba(255,255,255,0.15)', paddingLeft: '14px' }}>
                                            <span style={{ fontSize: '16px', fontWeight: '700', color: '#34d399' }}>{lpseTargetDisplay}</span>
                                        </div>
                                    </div>
                                    <span className="desc" style={{ fontSize: '11px', marginTop: '6px', display: 'block', color: '#9ca3af' }}>
                                        {alerts.length} Paket pemantauan aktif diproses 24/7 real-time
                                    </span>
                                </div>
                            <div className="card-stat success" style={{ padding: '16px 20px' }}>
                                <span className="title" style={{ fontSize: '11px', fontWeight: '600' }}>Saluran Notifikasi</span>
                                <span className="value" style={{ fontSize: '18px', color: '#34d399', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
                                    <span>✉️ Email</span>
                                    <span style={{ color: 'rgba(255,255,255,0.15)' }}>|</span>
                                    <span>💬 WhatsApp</span>
                                </span>
                                <span className="desc" style={{ fontSize: '11px', marginTop: '4px' }}>Status pengiriman otomatis aktif</span>
                            </div>
                            <div className="card-stat warning" style={{ padding: '16px 20px' }}>
                                <span className="title" style={{ fontSize: '11px', fontWeight: '600' }}>Paket &amp; Batasan</span>
                                <span className="value" style={{ fontSize: '18px', color: '#fbbf24', marginTop: '8px', textTransform: 'capitalize', fontWeight: 'bold' }}>
                                    {currentUser?.subscription?.plan_type === 'trial' ? 'Free / Trial (7 Hari)' : 'Premium Plan'}
                                </span>
                                <span className="desc" style={{ fontSize: '11px', marginTop: '4px' }}>
                                    {currentUser?.subscription?.plan_type === 'trial'
                                        ? 'Batas maksimal: 1 kata kunci & 1 K/L/Pemda/Instansi'
                                        : 'Akses tanpa batas kata kunci & K/L/Pemda/Instansi'}
                                </span>
                            </div>
                        </div>

                        {currentUser?.subscription?.plan_type === 'trial' && alerts.length >= 1 && (
                            <div style={{
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                marginBottom: '24px',
                                color: '#f87171',
                                fontSize: '13px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                ⚠️ Anda telah mencapai batas **1 Kata Kunci** untuk akun Free/Trial. Silakan hapus pemantauan yang ada atau upgrade ke paket Premium untuk menambahkan lebih banyak pemantauan.
                            </div>
                        )}

                        <div className="dash-layout">
                            {/* Active Alerts List (2fr wide on the left) */}
                            <div className="panel">
                                <div className="panel-header">
                                    <h3 className="panel-title">Daftar Pemantauan Aktif ({alerts.length})</h3>
                                </div>
                                <div className="alerts-list" style={{ gap: '12px' }}>
                                    {alerts.length > 0 ? (
                                        alerts.map((alert, idx) => (
                                            <div
                                                className="alert-item"
                                                key={idx}
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    padding: '16px 20px',
                                                    background: 'rgba(30, 41, 59, 0.25)',
                                                    border: '1px solid var(--border-color)',
                                                    borderRadius: '12px',
                                                    gap: '16px',
                                                    flexWrap: 'wrap'
                                                }}
                                            >
                                                {/* Keyword & LPSE */}
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: '1 1 240px' }}>
                                                    <div style={{
                                                        width: '40px',
                                                        height: '40px',
                                                        borderRadius: '10px',
                                                        background: 'rgba(99, 102, 241, 0.1)',
                                                        border: '1px solid rgba(99, 102, 241, 0.2)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: '#818cf8',
                                                        fontSize: '18px',
                                                        flexShrink: 0
                                                    }}>
                                                        🔍
                                                    </div>
                                                    <div>
                                                        <h4 style={{ margin: 0, fontSize: '15px', color: '#fff', fontWeight: '600', display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
                                                            {alert.keyword && alert.keyword.includes(',') ? (
                                                                alert.keyword.split(',').map((kw, kIdx) => (
                                                                    <span key={kIdx} style={{
                                                                        background: 'rgba(99, 102, 241, 0.18)',
                                                                        border: '1px solid rgba(99, 102, 241, 0.35)',
                                                                        color: '#c7d2fe',
                                                                        padding: '2px 8px',
                                                                        borderRadius: '6px',
                                                                        fontSize: '13px',
                                                                        fontWeight: '600'
                                                                    }}>
                                                                        🔍 {kw.trim()}
                                                                    </span>
                                                                ))
                                                            ) : (
                                                                `"${alert.keyword}"`
                                                            )}
                                                        </h4>
                                                        <div style={{ marginTop: '4px' }}>
                                                            <span style={{
                                                                fontSize: '11px',
                                                                color: '#818cf8',
                                                                background: 'rgba(99, 102, 241, 0.12)',
                                                                border: '1px solid rgba(99, 102, 241, 0.2)',
                                                                padding: '2px 8px',
                                                                borderRadius: '4px',
                                                                textTransform: 'capitalize',
                                                                display: 'inline-block'
                                                            }}>
                                                                {getLpseNameBySlug(alert.instansi)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Email & WA Targets */}
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: '1 1 200px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#9ca3af' }}>
                                                        <span style={{ width: '20px', textAlign: 'center' }}>✉️</span>
                                                        <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{alert.email}</span>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                                                        <span style={{ width: '20px', textAlign: 'center' }}>💬</span>
                                                        {alert.whatsapp ? (
                                                            <span style={{ color: '#34d399', fontWeight: '500' }}>{alert.whatsapp}</span>
                                                        ) : currentUser?.whatsapp ? (
                                                            <span style={{ color: '#34d399', fontWeight: '500' }}>
                                                                {currentUser.whatsapp} <span style={{ fontSize: '10px', color: '#6b7280', fontWeight: 'normal' }}>(Default Profil)</span>
                                                            </span>
                                                        ) : (
                                                            <span style={{ color: '#ef4444' }}>Belum diset</span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Date & Action Button */}
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', justifyContent: 'flex-end', flex: '1 1 150px' }}>
                                                    <div style={{ textAlign: 'right' }}>
                                                        <div style={{ fontSize: '10px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Dibuat</div>
                                                        <div style={{ fontSize: '12px', color: '#9ca3af', fontWeight: '500', marginTop: '2px' }}>
                                                            {new Date(alert.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                        </div>
                                                    </div>
                                                    <button
                                                        className="btn-delete"
                                                        style={{
                                                            background: 'rgba(239, 68, 68, 0.1)',
                                                            color: '#f87171',
                                                            border: '1px solid rgba(239, 68, 68, 0.2)',
                                                            padding: '8px 14px',
                                                            borderRadius: '8px',
                                                            fontSize: '12px',
                                                            fontWeight: '600',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s'
                                                        }}
                                                        onClick={() => handleDeleteAlert(alert)}
                                                        onMouseOver={(e) => {
                                                            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                                                            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.4)';
                                                        }}
                                                        onMouseOut={(e) => {
                                                            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                                                            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.2)';
                                                        }}
                                                    >
                                                        Hapus
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div style={{ color: '#6b7280', textAlign: 'center', padding: '40px 0', fontSize: '14px' }}>
                                            Belum ada pemantauan kata kunci yang aktif. Gunakan form di sebelah kanan untuk menambahkan.
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Alert Creation Form (1fr wide on the right) */}
                            <div className="panel" style={{ height: 'fit-content' }}>
                                <div className="panel-header">
                                    <h3 className="panel-title">Buat Pemantauan Baru</h3>
                                </div>
                                <form onSubmit={handleCreateAlert} className="alert-form-panel">
                                    <div className="form-group" style={{ marginBottom: '20px' }}>
                                        <label>Kata Kunci Pencarian (Keyword)</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Contoh: komputer, jalan, server, renovasi"
                                            value={alertKeyword}
                                            onChange={(e) => setAlertKeyword(e.target.value)}
                                            required
                                        />
                                        <small style={{ color: '#6b7280', fontSize: '11px', display: 'block', marginTop: '4px', marginBottom: '8px' }}>
                                            Sistem akan menyaring nama tender, syarat kualifikasi, dan uraian singkat secara otomatis. 💡 Anda bisa memasukkan <strong>beberapa kata kunci sekaligus</strong> dipisahkan dengan tanda koma (<code>,</code>).
                                        </small>
                                        {alertKeyword.trim() && (
                                            <div className="keyword-tags-container">
                                                {alertKeyword.split(',').map((tag, idx) => {
                                                    const cleanTag = tag.trim();
                                                    if (!cleanTag) return null;
                                                    return (
                                                        <span key={idx} className="keyword-tag">
                                                            🔑 {cleanTag}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label>Pilih LPSE (K/L/Pemda/Instansi Target)</label>
                                        <select
                                            className="form-control"
                                            value={alertInstansi}
                                            onChange={(e) => setAlertInstansi(e.target.value)}
                                            required
                                        >
                                            <option value="all">Pilih semua LPSE</option>
                                            {lpseInstances.map((inst, idx) => (
                                                <option key={idx} value={inst.slug}>{inst.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Email Penerima Notifikasi</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            placeholder="Contoh: user@domain.com"
                                            value={alertEmail}
                                            onChange={(e) => setAlertEmail(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>WhatsApp Penerima Notifikasi (Opsional)</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Contoh: 081234567890"
                                            value={alertWhatsapp}
                                            onChange={(e) => setAlertWhatsapp(e.target.value)}
                                        />
                                        <small style={{ color: '#9ca3af', fontSize: '11px', display: 'block', marginTop: '4px' }}>
                                            Kosongkan jika ingin menggunakan nomor WhatsApp default dari profil Anda.
                                        </small>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn-primary"
                                        style={{
                                            width: '100%',
                                            marginTop: '8px',
                                            background: (currentUser?.subscription?.plan_type === 'trial' && alerts.length >= 1) ? 'linear-gradient(135deg, var(--color-warning), var(--color-secondary))' : undefined,
                                            borderColor: (currentUser?.subscription?.plan_type === 'trial' && alerts.length >= 1) ? 'transparent' : undefined
                                        }}
                                        disabled={isSubmittingAlert}
                                    >
                                        {isSubmittingAlert ? 'Menyimpan...' : (currentUser?.subscription?.plan_type === 'trial' && alerts.length >= 1) ? 'Kuota Trial Habis (Upgrade ke Premium)' : 'Aktifkan Alert'}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Info Box SMTP / Mock */}
                        {currentUser?.role === 'admin' && (
                            <div className="panel" style={{ marginTop: '24px' }}>
                                <div className="panel-header">
                                    <h3 className="panel-title" style={{ color: '#fbbf24' }}>ℹ️ Mode Simulasi Notifikasi</h3>
                                </div>
                                <div style={{ fontSize: '14px', color: '#9ca3af', lineHeight: '1.6' }}>
                                    <p>
                                        Jika server SMTP atau WhatsApp API belum dikonfigurasi melalui panel admin,
                                        notifikasi akan secara otomatis dialihkan ke log simulasi lokal di folder backend proyek Anda:
                                    </p>
                                    <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
                                        <div style={{ flex: 1, padding: '10px', background: '#090d16', borderRadius: '8px', fontFamily: 'monospace', color: '#34d399', fontSize: '12px' }}>
                                            <strong>Email Log:</strong><br />
                                            backend/mock_emails.log
                                        </div>
                                        <div style={{ flex: 1, padding: '10px', background: '#090d16', borderRadius: '8px', fontFamily: 'monospace', color: '#34d399', fontSize: '12px' }}>
                                            <strong>WhatsApp Log:</strong><br />
                                            backend/mock_whatsapp.log
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    );
                })()}

                {/* TAB: DAFTAR LPSE / INSTANSI */}
                {activeTab === 'instansi' && (
                    <div>
                        <div className="header-dash">
                            <div className="header-title">
                                <h1>Daftar K/L/Pemda/Instansi Aktif</h1>
                                <p>Daftar seluruh entitas LPSE yang terpantau dan terhubung dalam sistem</p>
                            </div>
                        </div>

                        <div className="panel">
                            <div className="filters-bar" style={{ marginBottom: '20px' }}>
                                <div className="search-input-wrapper" style={{ flex: 1 }}>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Cari nama instansi atau wilayah..."
                                        value={searchInstansi}
                                        onChange={(e) => setSearchInstansi(e.target.value)}
                                        style={{ width: '100%' }}
                                    />
                                </div>
                                <select
                                    className="form-control"
                                    style={{ width: '220px' }}
                                    value={filterJenisInstansi}
                                    onChange={(e) => setFilterJenisInstansi(e.target.value)}
                                >
                                    <option value="">-- Semua Jenis Instansi --</option>
                                    {[...new Set(lpseInstances.map(i => i.jenis).filter(Boolean))].map((jenis, idx) => (
                                        <option key={idx} value={jenis}>{jenis}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="table-wrapper">
                                <table className="tender-table">
                                    <thead>
                                        <tr>
                                            <th style={{ width: '60px', textAlign: 'center' }}>No</th>
                                            <th>Nama Instansi / Wilayah</th>
                                            <th style={{ width: '150px' }}>Jenis Instansi</th>
                                            <th style={{ width: '200px' }}>Slug / Kategori SPSE</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {lpseInstances
                                            .filter(inst => {
                                                const matchSearch = inst.name.toLowerCase().includes(searchInstansi.toLowerCase()) || inst.slug.toLowerCase().includes(searchInstansi.toLowerCase());
                                                const matchJenis = filterJenisInstansi ? inst.jenis === filterJenisInstansi : true;
                                                return matchSearch && matchJenis;
                                            })
                                            .map((inst, idx) => (
                                                <tr key={idx}>
                                                    <td style={{ textAlign: 'center', color: '#6b7280' }}>{idx + 1}</td>
                                                    <td><span style={{ fontWeight: '600', color: '#fff' }}>{inst.name}</span></td>
                                                    <td><span style={{ fontSize: '12px', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>{inst.jenis || '-'}</span></td>
                                                    <td><code style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>{inst.slug}</code></td>
                                                </tr>
                                            ))
                                        }
                                        {lpseInstances.filter(inst => inst.name.toLowerCase().includes(searchInstansi.toLowerCase()) || inst.slug.toLowerCase().includes(searchInstansi.toLowerCase())).length === 0 && (
                                            <tr>
                                                <td colSpan="3" style={{ textAlign: 'center', padding: '30px', color: '#6b7280' }}>
                                                    Tidak ditemukan instansi yang cocok dengan pencarian Anda.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB: SAVED BOOKMARKS */}
                {activeTab === 'bookmarks' && (
                    <div>
                        <div className="header-dash">
                            <div className="header-title">
                                <h1>Saved Bookmarks</h1>
                                <p>Daftar proyek tender SPSE pilihan yang Anda simpan untuk dipantau secara khusus</p>
                            </div>
                        </div>

                        <div className="panel">
                            {/* Search & Filters */}
                            <div className="filters-bar" style={{ marginBottom: '20px' }}>
                                <div className="search-input-wrapper">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Cari dalam nama tender atau nomor..."
                                        value={bookmarkSearch}
                                        onChange={(e) => setBookmarkSearch(e.target.value)}
                                        style={{ width: '100%' }}
                                    />
                                </div>

                                <select
                                    className="form-control"
                                    value={bookmarkFilterKategori}
                                    onChange={(e) => setBookmarkFilterKategori(e.target.value)}
                                >
                                    <option value="">-- Semua LPSE Kategori --</option>
                                    {lpseInstances.map((inst, idx) => (
                                        <option key={idx} value={inst.slug}>{inst.name}</option>
                                    ))}
                                </select>

                                <select
                                    className="form-control"
                                    value={bookmarkFilterTipe}
                                    onChange={(e) => setBookmarkFilterTipe(e.target.value)}
                                >
                                    <option value="">-- Semua Tipe --</option>
                                    <option value="tender">Tender</option>
                                    <option value="nontender">Non-Tender</option>
                                </select>

                                <select
                                    className="form-control"
                                    value={bookmarkFilterJenis}
                                    onChange={(e) => setBookmarkFilterJenis(e.target.value)}
                                >
                                    <option value="">-- Semua Jenis Pengadaan --</option>
                                    <option value="Pengadaan Barang">Pengadaan Barang</option>
                                    <option value="Jasa Konsultansi Badan Usaha Non Konstruksi">Jasa Konsultansi BU Non Konstruksi</option>
                                    <option value="Pekerjaan Konstruksi">Pekerjaan Konstruksi</option>
                                    <option value="Jasa Lainnya">Jasa Lainnya</option>
                                    <option value="Jasa Konsultansi Perorangan Non Konstruksi">Jasa Konsultansi Perorangan Non Konstruksi</option>
                                    <option value="Jasa Konsultansi Badan Usaha Konstruksi">Jasa Konsultansi BU Konstruksi</option>
                                    <option value="Jasa Konsultansi Perorangan Konstruksi">Jasa Konsultansi Perorangan Konstruksi</option>
                                    <option value="Pekerjaan Konstruksi Terintegrasi">Pekerjaan Konstruksi Terintegrasi</option>
                                </select>

                                <select
                                    className="form-control"
                                    value={bookmarkFilterTahun}
                                    onChange={(e) => setBookmarkFilterTahun(e.target.value)}
                                >
                                    <option value="">-- Semua Tahun --</option>
                                    {dynamicYears.map((yr) => (
                                        <option key={yr} value={yr}>{yr}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="table-wrapper">
                                <table className="tender-table">
                                    <thead>
                                        <tr>
                                            <th>Nomor Pengadaan</th>
                                            <th>Nama Paket Tender</th>
                                            <th>K/L/Pemda/Instansi</th>
                                            <th>Pagu Anggaran</th>
                                            <th>Tahap Saat Ini</th>
                                            <th>Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredBookmarks.length > 0 ? (
                                            filteredBookmarks.map((tender, index) => (
                                                <tr key={index} onClick={() => handleViewTenderDetail(tender.nomor_pengadaan)}>
                                                    <td data-label="Nomor"><strong>{tender.nomor_pengadaan}</strong></td>
                                                    <td data-label="Nama Paket">
                                                        {renderTenderTitle(tender.nama_tender)}
                                                    </td>
                                                    <td data-label="Instansi">{tender.instansi}</td>
                                                    <td data-label="Pagu"><span style={{ color: '#fbbf24', fontWeight: 'bold' }}>{tender.pagu}</span></td>
                                                    <td data-label="Tahap"><span style={getTahapStyle(tender.tahap)}>{tender.tahap || '-'}</span></td>
                                                    <td data-label="Aksi">
                                                        <button
                                                            className="btn-delete"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleRemoveBookmark(tender.nomor_pengadaan, tender.nama_tender);
                                                            }}
                                                        >
                                                            Hapus
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" style={{ textAlign: 'center', color: '#6b7280', padding: '40px' }}>
                                                    {bookmarks.length === 0
                                                        ? "Belum ada tender yang Anda simpan. Telusuri tender di menu Explorer Tender dan klik Simpan!"
                                                        : "Tidak ada tender tersimpan yang cocok dengan kriteria filter saat ini."}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB: UPGRADE / BILLING */}
                {activeTab === 'billing' && (
                    <div>
                        <div className="header-dash">
                            <div className="header-title">
                                <h1>Pricing &amp; Billing</h1>
                                <p>Upgrade paket Anda untuk menikmati pemantauan otomatis tanpa batasan kata kunci dan K/L/Pemda/Instansi</p>
                            </div>
                        </div>

                        {/* Custom Subscription Progress Panel */}
                        {(() => {
                            const progress = getSubscriptionProgress();
                            if (!progress) return null;
                            return (
                                <div className="panel" style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap', background: 'rgba(30, 41, 59, 0.25)' }}>
                                    <div style={{ flex: '1 1 240px' }}>
                                        <h3 style={{ margin: 0, fontSize: '16px', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            🌟 Paket Langganan Aktif:
                                            <span style={{
                                                color: currentUser?.subscription?.plan_type === 'premium' ? '#fbbf24' : '#60a5fa',
                                                fontWeight: 'bold',
                                                textTransform: 'uppercase',
                                                background: currentUser?.subscription?.plan_type === 'premium' ? 'rgba(251, 191, 36, 0.1)' : 'rgba(96, 165, 250, 0.1)',
                                                border: currentUser?.subscription?.plan_type === 'premium' ? '1px solid rgba(251, 191, 36, 0.2)' : '1px solid rgba(96, 165, 250, 0.2)',
                                                padding: '2px 10px',
                                                borderRadius: '20px',
                                                fontSize: '11px'
                                            }}>
                                                {currentUser?.subscription?.plan_type === 'premium' ? 'Premium Plan' : 'Free / Trial'}
                                            </span>
                                        </h3>
                                        <p style={{ margin: '6px 0 0', fontSize: '13px', color: '#9ca3af', lineHeight: '1.5' }}>
                                            Masa aktif tersisa **{progress.daysLeft} hari** (dari total durasi {progress.totalDays} hari).<br />
                                            Berakhir pada: **{new Date(currentUser.subscription.end_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}**.
                                        </p>
                                    </div>
                                    <div style={{ flex: '2 1 300px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#9ca3af' }}>
                                            <span>Progress Masa Aktif</span>
                                            <strong style={{ color: progress.color }}>{Math.round(progress.percent)}% Tersisa</strong>
                                        </div>
                                        <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.06)', borderRadius: '5px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.02)' }}>
                                            <div style={{ width: `${progress.percent}%`, height: '100%', background: `linear-gradient(90deg, ${progress.color}, #3b82f6)`, borderRadius: '5px', transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginTop: '20px' }}>
                            {/* Card 1: Trial */}
                            <div style={{
                                background: 'rgba(255, 255, 255, 0.02)',
                                border: isTrialActive ? '2px solid #60a5fa' : '1px solid var(--border-color)',
                                borderRadius: '16px',
                                padding: '32px 24px',
                                textAlign: 'center',
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between'
                            }}>
                                <div>
                                    {isTrialActive && (
                                        <span style={{ position: 'absolute', top: '16px', right: '16px', background: '#60a5fa', color: '#070a13', fontSize: '10px', padding: '4px 10px', borderRadius: '20px', fontWeight: 'bold' }}>ACTIVE</span>
                                    )}
                                    <h3 style={{ fontSize: '20px', color: '#fff', marginBottom: '8px' }}>Free / Trial {adminSettings?.trial_days || '7'} Hari</h3>
                                    <div style={{ fontSize: '32px', fontWeight: '800', color: '#fff', margin: '20px 0' }}>Rp 0 <span style={{ fontSize: '14px', color: '#9ca3af', fontWeight: 'normal' }}>/ {adminSettings?.trial_days || '7'} hari</span></div>
                                    <hr style={{ borderColor: 'rgba(255,255,255,0.06)', margin: '20px 0' }} />
                                    <ul style={{ textAlign: 'left', listStyle: 'none', padding: 0, margin: '0 0 30px 0', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: '#9ca3af' }}>
                                        <li>✓ Akses portal Explorer Tender</li>
                                        <li>✓ Akses detail persyaratan tender</li>
                                        <li>✓ Maksimal 1 Kata Kunci pemantauan</li>
                                        <li>✓ Maksimal 1 LPSE/K/L/Pemda/Instansi pemantauan</li>
                                        <li>✗ WhatsApp &amp; Email alerts unlimited</li>
                                    </ul>
                                </div>
                                <button className="form-control" disabled style={{ width: '100%', cursor: 'not-allowed' }}>
                                    {isTrialActive ? 'Paket Aktif' : 'Hanya untuk Pendaftaran Baru'}
                                </button>
                            </div>

                            {/* Card 2: Premium Monthly */}
                            <div style={{
                                background: 'rgba(99, 102, 241, 0.05)',
                                border: isMonthlyActive ? '2px solid #fbbf24' : '1px solid rgba(99, 102, 241, 0.25)',
                                borderRadius: '16px',
                                padding: '32px 24px',
                                textAlign: 'center',
                                position: 'relative',
                                boxShadow: '0 10px 30px rgba(99, 102, 241, 0.1)',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between'
                            }}>
                                <div>
                                    {isMonthlyActive && (
                                        <span style={{ position: 'absolute', top: '16px', right: '16px', background: '#fbbf24', color: '#070a13', fontSize: '10px', padding: '4px 10px', borderRadius: '20px', fontWeight: 'bold' }}>ACTIVE</span>
                                    )}
                                    <h3 style={{ fontSize: '20px', color: '#fff', marginBottom: '8px' }}>Premium Bulanan</h3>
                                    <p style={{ fontSize: '13px', color: '#818cf8', margin: '0' }}>Akses Premium 30 Hari</p>

                                    <div style={{ margin: '20px 0' }}>
                                        {appliedVoucher30 ? (
                                            <>
                                                <div style={{ fontSize: '14px', color: '#6b7280', textDecoration: 'line-through' }}>
                                                    Rp {parseFloat(appliedVoucher30.base_price).toLocaleString('id-ID')}
                                                </div>
                                                <div style={{ fontSize: '32px', fontWeight: '800', color: '#fbbf24' }}>
                                                    Rp {parseFloat(appliedVoucher30.final_price).toLocaleString('id-ID')}
                                                    <span style={{ fontSize: '14px', color: '#9ca3af', fontWeight: 'normal' }}> / bln</span>
                                                </div>
                                                <div style={{ fontSize: '12px', color: '#34d399', marginTop: '4px', fontWeight: '600' }}>
                                                    Potongan: -Rp {parseFloat(appliedVoucher30.discount_amount).toLocaleString('id-ID')} ({appliedVoucher30.discount_type === 'percent' ? `${appliedVoucher30.discount_value}%` : 'Voucher'})
                                                </div>
                                            </>
                                        ) : (
                                            <div style={{ fontSize: '32px', fontWeight: '800', color: '#fbbf24' }}>
                                                Rp {parseFloat(adminSettings.premium_price || '150000').toLocaleString('id-ID')}
                                                <span style={{ fontSize: '14px', color: '#9ca3af', fontWeight: 'normal' }}> / bln</span>
                                            </div>
                                        )}
                                    </div>

                                    <hr style={{ borderColor: 'rgba(99, 102, 241, 0.15)', margin: '20px 0' }} />

                                    <ul style={{ textAlign: 'left', listStyle: 'none', padding: 0, margin: '0 0 20px 0', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: '#9ca3af' }}>
                                        <li>✓ Akses penuh seluruh portal Explorer</li>
                                        <li>✓ Tanpa batasan kata kunci alert</li>
                                        <li>✓ Tanpa batasan LPSE/K/L/Pemda/Instansi</li>
                                        <li>✓ Notifikasi instan Email &amp; WhatsApp</li>
                                        <li>✓ Prioritas antrean crawling data</li>
                                    </ul>
                                </div>

                                <div>
                                    {/* Voucher Input Panel */}
                                    {!isYearlyActive && (
                                        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '10px', marginBottom: '16px', border: '1px solid rgba(255,255,255,0.04)' }}>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Kode voucher"
                                                    value={couponInput30}
                                                    onChange={e => setCouponInput30(e.target.value.toUpperCase())}
                                                    style={{ fontSize: '13px', padding: '6px 12px' }}
                                                    disabled={appliedVoucher30 !== null}
                                                />
                                                {appliedVoucher30 ? (
                                                    <button
                                                        onClick={() => {
                                                            setAppliedVoucher30(null);
                                                            setCouponInput30('');
                                                        }}
                                                        className="btn-delete"
                                                        style={{ padding: '6px 12px', fontSize: '12px', margin: 0, borderRadius: '8px', cursor: 'pointer' }}
                                                    >
                                                        Batal
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleValidateVoucher(30)}
                                                        className="form-control"
                                                        style={{ width: 'auto', padding: '6px 12px', cursor: 'pointer', background: 'rgba(255,255,255,0.1)', fontSize: '12px', fontWeight: '600' }}
                                                        disabled={isValidatingVoucher30 || !couponInput30.trim()}
                                                    >
                                                        {isValidatingVoucher30 ? '...' : 'Gunakan'}
                                                    </button>
                                                )}
                                            </div>
                                            {voucherError30 && (
                                                <div style={{ color: '#f87171', fontSize: '11px', textAlign: 'left', marginTop: '6px' }}>
                                                    ⚠ {voucherError30}
                                                </div>
                                            )}
                                            {appliedVoucher30 && (
                                                <div style={{ color: '#34d399', fontSize: '11px', textAlign: 'left', marginTop: '6px' }}>
                                                    ✔ Voucher <strong>{appliedVoucher30.code}</strong> aktif!
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <button
                                        onClick={() => handleCheckoutPremium(30, appliedVoucher30 ? appliedVoucher30.code : null)}
                                        className="btn-primary"
                                        style={{
                                            width: '100%',
                                            background: isYearlyActive ? '#374151' : 'linear-gradient(135deg, #6366f1, #a855f7)',
                                            border: 'none',
                                            padding: '12px',
                                            cursor: isYearlyActive ? 'not-allowed' : 'pointer'
                                        }}
                                        disabled={isYearlyActive}
                                    >
                                        {isYearlyActive ? 'Sudah Memiliki Paket Tahunan' : isMonthlyActive ? 'Perpanjang Paket Bulanan' : 'Upgrade ke Premium'}
                                    </button>
                                </div>
                            </div>

                            {/* Card 3: Premium Yearly */}
                            <div style={{
                                background: 'rgba(168, 85, 247, 0.05)',
                                border: isYearlyActive ? '2px solid #fbbf24' : '1px solid rgba(168, 85, 247, 0.25)',
                                borderRadius: '16px',
                                padding: '32px 24px',
                                textAlign: 'center',
                                position: 'relative',
                                boxShadow: '0 10px 30px rgba(168, 85, 247, 0.1)',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between'
                            }}>
                                <div>
                                    {isYearlyActive && (
                                        <span style={{ position: 'absolute', top: '16px', right: '16px', background: '#fbbf24', color: '#070a13', fontSize: '10px', padding: '4px 10px', borderRadius: '20px', fontWeight: 'bold' }}>ACTIVE</span>
                                    )}
                                    <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: '#a855f7', color: '#fff', fontSize: '11px', padding: '4px 14px', borderRadius: '20px', fontWeight: 'bold', letterSpacing: '0.05em' }}>REKOMENDASI {getYearlySavingsPercent() > 0 ? `(HEMAT ${getYearlySavingsPercent()}%)` : ''}</div>

                                    <h3 style={{ fontSize: '20px', color: '#fff', marginBottom: '8px', marginTop: '4px' }}>Premium Tahunan</h3>
                                    <p style={{ fontSize: '13px', color: '#c084fc', margin: '0' }}>Akses Premium 365 Hari</p>

                                    <div style={{ margin: '20px 0' }}>
                                        {appliedVoucher365 ? (
                                            <>
                                                <div style={{ fontSize: '14px', color: '#6b7280', textDecoration: 'line-through' }}>
                                                    Rp {parseFloat(appliedVoucher365.base_price).toLocaleString('id-ID')}
                                                </div>
                                                <div style={{ fontSize: '32px', fontWeight: '800', color: '#a855f7' }}>
                                                    Rp {parseFloat(appliedVoucher365.final_price).toLocaleString('id-ID')}
                                                    <span style={{ fontSize: '14px', color: '#9ca3af', fontWeight: 'normal' }}> / thn</span>
                                                </div>
                                                <div style={{ fontSize: '12px', color: '#34d399', marginTop: '4px', fontWeight: '600' }}>
                                                    Potongan: -Rp {parseFloat(appliedVoucher365.discount_amount).toLocaleString('id-ID')} ({appliedVoucher365.discount_type === 'percent' ? `${appliedVoucher365.discount_value}%` : 'Voucher'})
                                                </div>
                                            </>
                                        ) : (
                                            <div style={{ fontSize: '32px', fontWeight: '800', color: '#a855f7' }}>
                                                Rp {parseFloat(adminSettings.premium_price_yearly || '1500000').toLocaleString('id-ID')}
                                                <span style={{ fontSize: '14px', color: '#9ca3af', fontWeight: 'normal' }}> / thn</span>
                                            </div>
                                        )}
                                    </div>

                                    <hr style={{ borderColor: 'rgba(168, 85, 247, 0.15)', margin: '20px 0' }} />

                                    <ul style={{ textAlign: 'left', listStyle: 'none', padding: 0, margin: '0 0 20px 0', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: '#9ca3af' }}>
                                        <li>✓ Akses penuh seluruh portal Explorer</li>
                                        <li>✓ Tanpa batasan kata kunci alert</li>
                                        <li>✓ Tanpa batasan LPSE/K/L/Pemda/Instansi</li>
                                        <li>✓ Notifikasi instan Email &amp; WhatsApp</li>
                                        <li>✓ Prioritas antrean crawling data</li>
                                        <li>✨ <strong>Lebih hemat dibandingkan bulanan</strong></li>
                                    </ul>
                                </div>

                                <div>
                                    {/* Voucher Input Panel */}
                                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '10px', marginBottom: '16px', border: '1px solid rgba(255,255,255,0.04)' }}>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Kode voucher"
                                                value={couponInput365}
                                                onChange={e => setCouponInput365(e.target.value.toUpperCase())}
                                                style={{ fontSize: '13px', padding: '6px 12px' }}
                                                disabled={appliedVoucher365 !== null}
                                            />
                                            {appliedVoucher365 ? (
                                                <button
                                                    onClick={() => {
                                                        setAppliedVoucher365(null);
                                                        setCouponInput365('');
                                                    }}
                                                    className="btn-delete"
                                                    style={{ padding: '6px 12px', fontSize: '12px', margin: 0, borderRadius: '8px', cursor: 'pointer' }}
                                                >
                                                    Batal
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleValidateVoucher(365)}
                                                    className="form-control"
                                                    style={{ width: 'auto', padding: '6px 12px', cursor: 'pointer', background: 'rgba(255,255,255,0.1)', fontSize: '12px', fontWeight: '600' }}
                                                    disabled={isValidatingVoucher365 || !couponInput365.trim()}
                                                >
                                                    {isValidatingVoucher365 ? '...' : 'Gunakan'}
                                                </button>
                                            )}
                                        </div>
                                        {voucherError365 && (
                                            <div style={{ color: '#f87171', fontSize: '11px', textAlign: 'left', marginTop: '6px' }}>
                                                ⚠ {voucherError365}
                                            </div>
                                        )}
                                        {appliedVoucher365 && (
                                            <div style={{ color: '#34d399', fontSize: '11px', textAlign: 'left', marginTop: '6px' }}>
                                                ✔ Voucher <strong>{appliedVoucher365.code}</strong> aktif!
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => handleCheckoutPremium(365, appliedVoucher365 ? appliedVoucher365.code : null)}
                                        className="btn-primary"
                                        style={{ width: '100%', background: 'linear-gradient(135deg, #a855f7, #6366f1)', border: 'none', padding: '12px' }}
                                    >
                                        {isYearlyActive ? 'Perpanjang Paket Tahunan' : isMonthlyActive ? 'Upgrade ke Tahunan (Rekomendasi)' : 'Upgrade ke Premium Tahunan'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB: SCRAPER CONTROL */}
                {activeTab === 'control' && currentUser?.role === 'admin' && (
                    <div>
                        <div className="header-dash">
                            <div className="header-title">
                                <h1>Scraper Control Panel</h1>
                                <p>Luncurkan proses crawling manual untuk menarik data langsung dari server SPSE ke database</p>
                            </div>
                        </div>

                        <div className="panel">
                            <div className="panel-header">
                                <h3 className="panel-title">Parameter Scraping</h3>
                            </div>

                            <form onSubmit={handleTriggerCrawl}>
                                <div className="crawl-form-grid">
                                    <div className="form-group">
                                        <label>Tipe Pengadaan</label>
                                        <select
                                            className="form-control"
                                            value={crawlTipe}
                                            onChange={(e) => { setCrawlTipe(e.target.value); setCrawlStart(0); }}
                                        >
                                            <option value="tender">Tender</option>
                                            <option value="nontender">Non-Tender</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>K/L/Pemda/Instansi (Kategori Slug)</label>
                                        <select
                                            className="form-control"
                                            value={crawlKategori}
                                            onChange={(e) => { setCrawlKategori(e.target.value); setCrawlStart(0); }}
                                        >
                                            <option value="all">-- Semua K/L/Pemda/Instansi --</option>
                                            {lpseInstances.map((inst, idx) => (
                                                <option key={idx} value={inst.slug}>{inst.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Jenis Pengadaan</label>
                                        <select
                                            className="form-control"
                                            value={crawlJenis}
                                            onChange={(e) => setCrawlJenis(e.target.value)}
                                        >
                                            <option value="">-- Semua Jenis --</option>
                                            <option value="Pengadaan Barang">Pengadaan Barang</option>
                                            <option value="Jasa Konsultansi Badan Usaha Non Konstruksi">Jasa Konsultansi BU Non Konstruksi</option>
                                            <option value="Pekerjaan Konstruksi">Pekerjaan Konstruksi</option>
                                            <option value="Jasa Lainnya">Jasa Lainnya</option>
                                            <option value="Jasa Konsultansi Perorangan Non Konstruksi">Jasa Konsultansi Perorangan Non Konstruksi</option>
                                            <option value="Jasa Konsultansi Badan Usaha Konstruksi">Jasa Konsultansi BU Konstruksi</option>
                                            <option value="Jasa Konsultansi Perorangan Konstruksi">Jasa Konsultansi Perorangan Konstruksi</option>
                                            <option value="Pekerjaan Konstruksi Terintegrasi">Pekerjaan Konstruksi Terintegrasi</option>
                                        </select>
                                        <small style={{ color: '#9ca3af', fontSize: '11px', marginTop: '4px', display: 'block' }}>Filter lokal pasca-scraping pada data hasil unduhan.</small>
                                    </div>

                                    <div className="form-group">
                                        <label>Tahun Anggaran</label>
                                        <select
                                            className="form-control"
                                            value={crawlTahun}
                                            onChange={(e) => { setCrawlTahun(e.target.value); setCrawlStart(0); }}
                                        >
                                            {dynamicYears.map((yr) => (
                                                <option key={yr} value={yr}>{yr}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Jumlah Data (Limit)</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={crawlLimit}
                                            onChange={(e) => setCrawlLimit(e.target.value)}
                                            min="1"
                                            max="100"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Indeks Awal (Offset / Start)</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={crawlStart}
                                            onChange={(e) => setCrawlStart(e.target.value)}
                                            min="0"
                                            placeholder="Mulai dari 0"
                                        />
                                    </div>
                                </div>

                                <div className="form-group" style={{ marginBottom: '20px' }}>
                                    <label>Penyaringan Judul Paket di Server SPSE (Opsional)</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Contoh: komputer, server, jalan, renovasi"
                                        value={crawlQuery}
                                        onChange={(e) => { setCrawlQuery(e.target.value); setCrawlStart(0); }}
                                    />
                                    <small style={{ color: '#9ca3af', fontSize: '11px', marginTop: '6px', display: 'block' }}>
                                        💡 Anda bisa memasukkan <strong>beberapa kata kunci sekaligus</strong> dipisahkan dengan tanda koma (<code>,</code>). Sistem akan melakukan penarikan data secara berurutan.
                                    </small>
                                    {crawlQuery.trim() && (
                                        <div className="keyword-tags-container">
                                            {crawlQuery.split(',').map((tag, idx) => {
                                                const cleanTag = tag.trim();
                                                if (!cleanTag) return null;
                                                return (
                                                    <span key={idx} className="keyword-tag">
                                                        🔑 {cleanTag}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                <div className="control-actions">
                                    <button
                                        type="submit"
                                        className="crawl-btn"
                                        style={{ flexGrow: 1, justifyContent: 'center', margin: 0 }}
                                        disabled={isCrawling}
                                    >
                                        {isCrawling ? (
                                            <>
                                                <div className="spinner" style={{ marginRight: '10px' }}></div>
                                                Sedang Berjalan...
                                            </>
                                        ) : (
                                            '🚀 Mulai Tarik Data Baru'
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSyncBookmarks}
                                        className="btn-primary"
                                        style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', padding: '12px 24px', borderRadius: '8px', fontWeight: '600', width: 'auto', margin: 0 }}
                                        disabled={isCrawling}
                                    >
                                        🔄 Sinkronkan Status Bookmarks
                                    </button>
                                </div>
                            </form>

                            {/* Crawl Logs Console */}
                            {(isCrawling || crawlLogs.length > 0) && (
                                <div style={{ marginTop: '30px' }}>
                                    <div className="panel-header">
                                        <h3 className="panel-title" style={{ fontSize: '14px', color: '#10b981' }}>Console Log Scraper</h3>
                                    </div>
                                    <div className="crawler-log-panel">
                                        {crawlLogs.map((log, idx) => (
                                            <div className="crawler-log-line" key={idx}>
                                                {log}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* TAB: SERVER & SCHEDULER MONITORING */}
                {activeTab === 'server-monitoring' && currentUser?.role === 'admin' && (
                    <div className="section-content fade-in">
                        <div className="header-dash">
                            <div className="header-title">
                                <h1>🖥️ Server & Scheduler Monitoring</h1>
                                <p>Pantau performa CPU, RAM, Disk, Uptime, serta status Scheduler berjalan</p>
                            </div>
                        </div>

                        {isLoadingMonitoring && !serverMonitoring ? (
                            <div className="empty-state">
                                <div className="loading-spinner"></div>
                                <p>Mengambil data metrik server...</p>
                            </div>
                        ) : serverMonitoring ? (
                            <>
                                {/* ─── ROW 1: METRIC CARDS ─── */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                                    {/* CPU */}
                                    <div style={{ background: 'var(--bg-secondary)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '20px 22px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                            <div>
                                                <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>CPU Usage</div>
                                                <div style={{ fontSize: '32px', fontWeight: '800', color: serverMonitoring.cpu_percent > 80 ? '#f87171' : '#fff', lineHeight: 1 }}>{serverMonitoring.cpu_percent}<span style={{ fontSize: '16px', color: 'var(--text-muted)', fontWeight: '600' }}>%</span></div>
                                            </div>
                                            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: serverMonitoring.cpu_percent > 80 ? 'rgba(239,68,68,0.15)' : 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>⚡</div>
                                        </div>
                                        <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                                            <div style={{ width: `${serverMonitoring.cpu_percent}%`, height: '100%', background: serverMonitoring.cpu_percent > 80 ? 'linear-gradient(90deg,#ef4444,#f87171)' : 'linear-gradient(90deg,#6366f1,#a855f7)', borderRadius: '4px', transition: 'width 0.5s ease' }} />
                                        </div>
                                    </div>
                                    {/* RAM */}
                                    <div style={{ background: 'var(--bg-secondary)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '20px 22px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                            <div>
                                                <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>RAM Usage</div>
                                                <div style={{ fontSize: '32px', fontWeight: '800', color: serverMonitoring.ram.percent > 85 ? '#f87171' : '#fff', lineHeight: 1 }}>{serverMonitoring.ram.percent}<span style={{ fontSize: '16px', color: 'var(--text-muted)', fontWeight: '600' }}>%</span></div>
                                            </div>
                                            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: serverMonitoring.ram.percent > 85 ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.13)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🧠</div>
                                        </div>
                                        <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden', marginBottom: '6px' }}>
                                            <div style={{ width: `${serverMonitoring.ram.percent}%`, height: '100%', background: serverMonitoring.ram.percent > 85 ? 'linear-gradient(90deg,#ef4444,#f87171)' : 'linear-gradient(90deg,#10b981,#34d399)', borderRadius: '4px', transition: 'width 0.5s ease' }} />
                                        </div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{serverMonitoring.ram.used_mb} MB / {serverMonitoring.ram.total_mb} MB</div>
                                    </div>
                                    {/* DISK */}
                                    <div style={{ background: 'var(--bg-secondary)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '20px 22px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                            <div>
                                                <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Disk Storage</div>
                                                <div style={{ fontSize: '32px', fontWeight: '800', color: serverMonitoring.disk.percent > 90 ? '#f87171' : '#fff', lineHeight: 1 }}>{serverMonitoring.disk.percent}<span style={{ fontSize: '16px', color: 'var(--text-muted)', fontWeight: '600' }}>%</span></div>
                                            </div>
                                            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: serverMonitoring.disk.percent > 90 ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.13)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>💾</div>
                                        </div>
                                        <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden', marginBottom: '6px' }}>
                                            <div style={{ width: `${serverMonitoring.disk.percent}%`, height: '100%', background: serverMonitoring.disk.percent > 90 ? 'linear-gradient(90deg,#ef4444,#f87171)' : 'linear-gradient(90deg,#f59e0b,#fbbf24)', borderRadius: '4px', transition: 'width 0.5s ease' }} />
                                        </div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{Math.max(0, serverMonitoring.disk.total_gb - serverMonitoring.disk.used_gb).toFixed(1)} GB Free / {serverMonitoring.disk.total_gb} GB Total</div>
                                    </div>
                                    {/* UPTIME & DB */}
                                    <div style={{ background: 'var(--bg-secondary)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '20px 22px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                            <div>
                                                <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Uptime Server</div>
                                                <div style={{ fontSize: '28px', fontWeight: '800', color: '#fff', lineHeight: 1 }}>{Math.floor(serverMonitoring.uptime_seconds / 3600)}<span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>j</span> {Math.floor((serverMonitoring.uptime_seconds % 3600) / 60)}<span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>m</span></div>
                                            </div>
                                            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(52,211,153,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🕒</div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
                                            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: serverMonitoring.db_status === 'connected' ? '#34d399' : '#f87171', display: 'inline-block', flexShrink: 0 }}></span>
                                            <span style={{ fontSize: '12px', color: serverMonitoring.db_status === 'connected' ? '#34d399' : '#f87171', fontWeight: '600' }}>
                                                DB {serverMonitoring.db_status === 'connected' ? 'Connected' : serverMonitoring.db_status}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* ─── ROW 2: SCHEDULER + MAINTENANCE + LOGS ─── */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                                    {/* SCHEDULER */}
                                    <div style={{ background: 'var(--bg-secondary)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '22px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#e2e8f0' }}>⏱️ Scheduler Worker</h3>
                                                <span style={{
                                                    fontSize: '11px',
                                                    fontWeight: '800',
                                                    padding: '3px 10px',
                                                    borderRadius: '12px',
                                                    background: serverMonitoring.scheduler?.state?.toLowerCase() === 'running' ? 'rgba(234,179,8,0.18)' : 'rgba(52,211,153,0.15)',
                                                    color: serverMonitoring.scheduler?.state?.toLowerCase() === 'running' ? '#facc15' : '#4ade80',
                                                    border: '1px solid ' + (serverMonitoring.scheduler?.state?.toLowerCase() === 'running' ? 'rgba(234,179,8,0.3)' : 'rgba(52,211,153,0.3)')
                                                }}>
                                                    {serverMonitoring.scheduler?.state?.toLowerCase() === 'running' ? '🟡 RUNNING' : '🟢 IDLE (STANDBY)'}
                                                </span>
                                            </div>
                                            <button
                                                style={{
                                                    background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: '#fff', border: 'none',
                                                    padding: '6px 14px', borderRadius: '8px', fontWeight: '700', fontSize: '12px',
                                                    cursor: (isForceRunningScheduler || serverMonitoring.scheduler?.state === 'running') ? 'not-allowed' : 'pointer',
                                                    opacity: (isForceRunningScheduler || serverMonitoring.scheduler?.state === 'running') ? 0.5 : 1
                                                }}
                                                onClick={handleForceRunScheduler}
                                                disabled={isForceRunningScheduler || serverMonitoring.scheduler?.state === 'running'}
                                            >
                                                {isForceRunningScheduler ? '⏳ Meminta...' : '▶ Force Run'}
                                            </button>
                                        </div>

                                        {[
                                            {
                                                label: 'Berjalan Terakhir',
                                                value: serverMonitoring.scheduler?.last_run_at ? (() => {
                                                    try {
                                                        const d = new Date(serverMonitoring.scheduler.last_run_at);
                                                        return isNaN(d.getTime()) ? serverMonitoring.scheduler.last_run_at : d.toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB';
                                                    } catch (e) { return serverMonitoring.scheduler.last_run_at; }
                                                })() : 'Belum pernah'
                                            },
                                            {
                                                label: 'Jadwal Eksekusi Berikutnya',
                                                value: serverMonitoring.scheduler?.next_run_at ? (() => {
                                                    try {
                                                        const d = new Date(serverMonitoring.scheduler.next_run_at);
                                                        return isNaN(d.getTime()) ? serverMonitoring.scheduler.next_run_at : d.toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB';
                                                    } catch (e) { return serverMonitoring.scheduler.next_run_at; }
                                                })() : 'Tidak diketahui'
                                            },
                                        ].map(row => (
                                            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{row.label}</span>
                                                <span style={{ fontSize: '12px', color: '#e2e8f0', fontWeight: '600', textAlign: 'right' }}>{row.value}</span>
                                            </div>
                                        ))}

                                        {/* Structured Ringkasan Terakhir */}
                                        <div style={{ marginTop: '16px' }}>
                                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                                📊 Ringkasan Hasil Eksekusi Terakhir
                                            </div>
                                            {(() => {
                                                let summary = null;
                                                const raw = serverMonitoring.scheduler?.last_run_summary;
                                                if (raw) {
                                                    if (typeof raw === 'object') summary = raw;
                                                    else {
                                                        try { summary = JSON.parse(raw); } catch (e) { summary = { message: raw }; }
                                                    }
                                                }
                                                if (!summary) {
                                                    return <div style={{ fontSize: '12px', color: '#9ca3af', fontStyle: 'italic' }}>Belum ada ringkasan hasil eksekusi.</div>;
                                                }
                                                return (
                                                    <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '14px' }}>
                                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '10px' }}>
                                                            <div style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', padding: '8px 10px', borderRadius: '8px', textAlign: 'center' }}>
                                                                <div style={{ fontSize: '10px', color: '#a5b4fc', fontWeight: '600' }}>⏱️ DURASI</div>
                                                                <div style={{ fontSize: '13px', fontWeight: '800', color: '#fff', marginTop: '2px' }}>{summary.duration_seconds ?? 0}s</div>
                                                            </div>
                                                            <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', padding: '8px 10px', borderRadius: '8px', textAlign: 'center' }}>
                                                                <div style={{ fontSize: '10px', color: '#4ade80', fontWeight: '600' }}>💾 TENDER SAVED</div>
                                                                <div style={{ fontSize: '13px', fontWeight: '800', color: '#fff', marginTop: '2px' }}>{summary.tenders_saved ?? 0}</div>
                                                            </div>
                                                            <div style={{ background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.2)', padding: '8px 10px', borderRadius: '8px', textAlign: 'center' }}>
                                                                <div style={{ fontSize: '10px', color: '#facc15', fontWeight: '600' }}>🔔 ALERT SENT</div>
                                                                <div style={{ fontSize: '13px', fontWeight: '800', color: '#fff', marginTop: '2px' }}>{summary.alerts_triggered ?? 0}</div>
                                                            </div>
                                                        </div>
                                                        <div style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: '1.4', wordBreak: 'break-word', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                            <span>💬</span> <span>{summary.message || 'Eksekusi selesai dengan sukses.'}</span>
                                                        </div>
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    </div>

                                    {/* MAINTENANCE MODE (separated card) */}
                                    <div style={{
                                        background: serverMonitoring.maintenance_mode ? 'rgba(239,68,68,0.06)' : 'var(--bg-secondary)',
                                        border: `1px solid ${serverMonitoring.maintenance_mode ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.07)'}`,
                                        borderRadius: '16px', padding: '22px'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                                            <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#e2e8f0' }}>🛠️ Maintenance Mode</h3>
                                            <div style={{
                                                display: 'inline-flex', alignItems: 'center', gap: '6px',
                                                padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '800',
                                                background: serverMonitoring.maintenance_mode ? 'rgba(239,68,68,0.18)' : 'rgba(52,211,153,0.12)',
                                                border: `1px solid ${serverMonitoring.maintenance_mode ? 'rgba(239,68,68,0.5)' : 'rgba(52,211,153,0.35)'}`,
                                                color: serverMonitoring.maintenance_mode ? '#fca5a5' : '#6ee7b7'
                                            }}>
                                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor', display: 'inline-block', animation: serverMonitoring.maintenance_mode ? 'pulse 1.5s infinite' : 'none' }}></span>
                                                {serverMonitoring.maintenance_mode ? 'AKTIF' : 'NONAKTIF'}
                                            </div>
                                        </div>
                                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '14px', lineHeight: '1.6' }}>
                                            Saat aktif, seluruh user (kecuali admin) tidak dapat mengakses platform dan akan melihat halaman pemeliharaan beserta informasi kontak.
                                        </p>
                                        {maintenanceSaveMsg && (
                                            <div style={{
                                                padding: '8px 12px', borderRadius: '8px', fontSize: '12px', marginBottom: '12px',
                                                background: maintenanceSaveMsg.type === 'success' ? 'rgba(52,211,153,0.1)' : 'rgba(239,68,68,0.1)',
                                                border: `1px solid ${maintenanceSaveMsg.type === 'success' ? 'rgba(52,211,153,0.3)' : 'rgba(239,68,68,0.3)'}`,
                                                color: maintenanceSaveMsg.type === 'success' ? '#34d399' : '#f87171'
                                            }}>
                                                {maintenanceSaveMsg.text}
                                            </div>
                                        )}
                                        <div style={{ marginBottom: '12px' }}>
                                            <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pesan untuk User</label>
                                            <textarea
                                                className="form-control"
                                                rows={3}
                                                style={{ resize: 'vertical', fontSize: '13px' }}
                                                placeholder="Sistem sedang dalam pemeliharaan. Silakan kembali beberapa saat lagi."
                                                value={maintenanceMsgInput}
                                                onChange={e => setMaintenanceMsgInput(e.target.value)}
                                            />
                                        </div>
                                        <button
                                            style={{
                                                width: '100%', padding: '11px', borderRadius: '10px', fontWeight: '700',
                                                fontSize: '13px', cursor: isSavingMaintenance ? 'not-allowed' : 'pointer', border: 'none',
                                                opacity: isSavingMaintenance ? 0.6 : 1, transition: 'all 0.2s',
                                                background: serverMonitoring.maintenance_mode
                                                    ? 'linear-gradient(135deg, #10b981, #059669)'
                                                    : 'linear-gradient(135deg, #ef4444, #dc2626)',
                                                color: '#fff',
                                                boxShadow: serverMonitoring.maintenance_mode
                                                    ? '0 4px 16px rgba(16,185,129,0.35)'
                                                    : '0 4px 16px rgba(239,68,68,0.35)'
                                            }}
                                            onClick={() => handleToggleMaintenance(!serverMonitoring.maintenance_mode)}
                                            disabled={isSavingMaintenance}
                                        >
                                            {isSavingMaintenance ? '⏳ Menyimpan...' : serverMonitoring.maintenance_mode ? '✅ Nonaktifkan Maintenance' : '🚧 Aktifkan Maintenance'}
                                        </button>
                                    </div>
                                </div>

                                {/* ─── ROW 3: LOGS ─── */}
                                <div style={{ background: 'var(--bg-secondary)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '22px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                                        <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#e2e8f0' }}>📜 Crawl & Error Logs (Tail)</h3>
                                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>15 baris terakhir · auto-refresh 5s</span>
                                    </div>
                                    <div className="crawler-log-panel" style={{ height: '240px', overflowY: 'auto' }}>
                                        {serverMonitoring.log_feed && serverMonitoring.log_feed.length > 0 ? (
                                            serverMonitoring.log_feed.map((line, idx) => (
                                                <div className="crawler-log-line" key={idx} style={{
                                                    color: line.toLowerCase().includes('error') || line.toLowerCase().includes('fail') ? '#ef4444' :
                                                        line.toLowerCase().includes('warning') ? '#f59e0b' : '#a7f3d0'
                                                }}>
                                                    {line}
                                                </div>
                                            ))
                                        ) : (
                                            <div style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '60px' }}>📭 Log kosong atau file tidak ditemukan.</div>
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : null}
                    </div>
                )}

                {/* TAB: SUPER ADMIN */}
                {activeTab === 'admin' && (
                    <div>
                        <div className="header-dash" style={{ marginBottom: '24px' }}>
                            <div className="header-title">
                                <h1>🛡️ Super Admin Settings</h1>
                                <p>Kelola identitas aplikasi, branding, pembayaran, notifikasi, instansi LPSE, dan log sistem</p>
                            </div>
                        </div>

                        {/* Sub-Tabs Navigation Bar */}
                        <div style={{
                            display: 'flex',
                            gap: '8px',
                            overflowX: 'auto',
                            WebkitOverflowScrolling: 'touch',
                            paddingBottom: '12px',
                            marginBottom: '28px',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
                        }}>
                            {[
                                { id: 'branding', label: '🎨 Branding & SEO' },
                                { id: 'communication', label: '💬 WhatsApp & Email' },
                                { id: 'payment', label: '💳 Pembayaran & Harga' },
                                { id: 'chatbot', label: '🤖 Chatbot & Kontak' },
                                { id: 'vouchers', label: '🎟️ Voucher Diskon' },
                                { id: 'lpse', label: '🏛️ Instansi LPSE' },
                                { id: 'logs', label: '📝 System Logs' }
                            ].map(tab => {
                                const isActive = (adminSubTab || 'branding') === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setAdminSubTab(tab.id)}
                                        style={{
                                            background: isActive
                                                ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(79, 70, 229, 0.35))'
                                                : 'rgba(255, 255, 255, 0.03)',
                                            color: isActive ? '#ffffff' : '#94a3b8',
                                            border: isActive
                                                ? '1px solid rgba(99, 102, 241, 0.5)'
                                                : '1px solid rgba(255, 255, 255, 0.08)',
                                            padding: '10px 18px',
                                            borderRadius: '12px',
                                            fontWeight: isActive ? '700' : '600',
                                            fontSize: '13px',
                                            cursor: 'pointer',
                                            whiteSpace: 'nowrap',
                                            flexShrink: 0,
                                            transition: 'all 0.2s ease',
                                            boxShadow: isActive ? '0 4px 15px rgba(99, 102, 241, 0.2)' : 'none'
                                        }}
                                    >
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>

                        {/* SUBTAB 1: BRANDING & SEO */}
                        {(adminSubTab || 'branding') === 'branding' && (
                            <div style={{ maxWidth: '820px' }}>
                                <div className="panel">
                                    <div className="panel-header">
                                        <h3 className="panel-title">🎨 Identitas & Branding</h3>
                                    </div>
                                    <div className="form-group" style={{ marginBottom: '16px' }}>
                                        <label>Nama Aplikasi</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={adminSettings.app_name}
                                            onChange={e => setAdminSettings(p => ({ ...p, app_name: e.target.value }))}
                                            placeholder="Contoh: Spy SPSE"
                                        />
                                    </div>
                                    <div className="form-group" style={{ marginBottom: '16px' }}>
                                        <label>Ikon Logo (Emoji atau URL Gambar)</label>
                                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={adminSettings.app_logo}
                                                onChange={e => setAdminSettings(p => ({ ...p, app_logo: e.target.value }))}
                                                placeholder="Emoji (misal: 🕵🏼‍♂️) atau URL gambar https://..."
                                                style={{ flexGrow: 1, minWidth: '200px' }}
                                            />
                                            <div style={{ fontSize: '36px', minWidth: '50px', textAlign: 'center' }}>
                                                {adminSettings.app_logo && !adminSettings.app_logo.startsWith('http')
                                                    ? adminSettings.app_logo
                                                    : adminSettings.app_logo
                                                        ? <img src={adminSettings.app_logo} alt="logo" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                                                        : '🕵🏼‍♂️'
                                                }
                                            </div>
                                        </div>
                                        <small style={{ color: '#6b7280', fontSize: '11px', marginTop: '6px', display: 'block' }}>
                                            Gunakan 1 karakter emoji atau URL gambar (PNG/SVG). Preview tampil di sebelah kanan.
                                        </small>
                                    </div>

                                    <div className="form-group" style={{ marginBottom: '16px' }}>
                                        <label>Tagline Aplikasi</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={adminSettings.app_tagline || ''}
                                            onChange={e => setAdminSettings(p => ({ ...p, app_tagline: e.target.value }))}
                                            placeholder="Slogan atau narasi singkat, contoh: Pantau Tender Cepat"
                                        />
                                    </div>

                                    <div className="form-group" style={{ marginBottom: '16px' }}>
                                        <label>SEO: Meta Deskripsi</label>
                                        <textarea
                                            className="form-control"
                                            style={{ minHeight: '60px' }}
                                            value={adminSettings.seo_description || ''}
                                            onChange={e => setAdminSettings(p => ({ ...p, seo_description: e.target.value }))}
                                            placeholder="Deskripsi untuk SEO mesin pencari"
                                        />
                                    </div>

                                    <div className="form-group" style={{ marginBottom: '16px' }}>
                                        <label>SEO: Kata Kunci (Keywords)</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={adminSettings.seo_keywords || ''}
                                            onChange={e => setAdminSettings(p => ({ ...p, seo_keywords: e.target.value }))}
                                            placeholder="Contoh: tender, lpse, pengadaan barang jasa"
                                        />
                                    </div>

                                    <div className="form-group" style={{ marginBottom: '24px' }}>
                                        <label>GEO: Lokasi / Placename</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={adminSettings.geo_placename || ''}
                                            onChange={e => setAdminSettings(p => ({ ...p, geo_placename: e.target.value }))}
                                            placeholder="Contoh: Indonesia, Jakarta"
                                        />
                                    </div>

                                    {/* Preview sidebar mini */}
                                    <div style={{ background: '#0f1322', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '16px', marginBottom: '24px' }}>
                                        <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Preview Sidebar</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', background: '#070a13', borderRadius: '8px' }}>
                                            <span style={{ fontSize: '22px' }}>{adminSettings.app_logo || '🕵🏼‍♂️'}</span>
                                            <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: '700', fontSize: '18px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                                {adminSettings.app_name || 'Spy SPSE'}
                                            </span>
                                        </div>
                                    </div>

                                    <button className="btn-primary" onClick={(e) => handleSaveSettings(e, 'branding')} disabled={isSavingSettings} style={{ width: '100%' }}>
                                        {isSavingSettings ? 'Menyimpan...' : '💾 Simpan Branding & SEO'}
                                    </button>
                                    {brandingSaveMsg && (
                                        <div style={{
                                            marginTop: '12px', padding: '10px 14px', borderRadius: '8px', fontSize: '13px',
                                            background: brandingSaveMsg.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                                            color: brandingSaveMsg.type === 'success' ? '#34d399' : '#f87171',
                                            border: `1px solid ${brandingSaveMsg.type === 'success' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`
                                        }}>
                                            {brandingSaveMsg.type === 'success' ? '✔ ' : '✘ '}{brandingSaveMsg.text}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* SUBTAB 2: WHATSAPP & EMAIL */}
                        {adminSubTab === 'communication' && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '24px' }}>
                                {/* WHATSAPP SETTINGS */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                    <div className="panel">
                                        <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                                            <h3 className="panel-title" style={{ margin: 0 }}>📱 Pengaturan Integrasi WhatsApp</h3>
                                            
                                            {/* Realtime Status Badge */}
                                            <button
                                                type="button"
                                                onClick={() => fetchWaStatus()}
                                                disabled={isCheckingWaStatus}
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                    padding: '6px 14px',
                                                    borderRadius: '20px',
                                                    fontSize: '12px',
                                                    fontWeight: '700',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease',
                                                    border: '1px solid ' + (
                                                        waStatus?.connected ? 'rgba(34, 197, 94, 0.4)' :
                                                        waStatus?.status === 'unconfigured' ? 'rgba(234, 179, 8, 0.4)' :
                                                        'rgba(239, 68, 68, 0.4)'
                                                    ),
                                                    background: (
                                                        waStatus?.connected ? 'rgba(34, 197, 94, 0.12)' :
                                                        waStatus?.status === 'unconfigured' ? 'rgba(234, 179, 8, 0.12)' :
                                                        'rgba(239, 68, 68, 0.12)'
                                                    ),
                                                    color: (
                                                        waStatus?.connected ? '#4ade80' :
                                                        waStatus?.status === 'unconfigured' ? '#facc15' :
                                                        '#f87171'
                                                    )
                                                }}
                                                title="Klik untuk memperbarui status koneksi WhatsApp Fonnte realtime"
                                            >
                                                <span style={{
                                                    width: '8px',
                                                    height: '8px',
                                                    borderRadius: '50%',
                                                    background: (
                                                        isCheckingWaStatus ? '#6366f1' :
                                                        waStatus?.connected ? '#22c55e' :
                                                        waStatus?.status === 'unconfigured' ? '#eab308' :
                                                        '#ef4444'
                                                    ),
                                                    boxShadow: waStatus?.connected ? '0 0 10px #22c55e' : 'none',
                                                    display: 'inline-block'
                                                }} />
                                                {isCheckingWaStatus ? 'Mengecek...' : (
                                                    waStatus?.connected ? `Terhubung (${waStatus.device || 'Fonnte'})` :
                                                    waStatus?.status === 'unconfigured' ? 'Belum Dikoneksikan' :
                                                    'Terputus'
                                                )}
                                                <span style={{ opacity: 0.7, fontSize: '11px', marginLeft: '2px' }}>🔄</span>
                                            </button>
                                        </div>

                                        {/* Status Detail Banner */}
                                        {waStatus && (
                                            <div style={{
                                                marginBottom: '20px',
                                                padding: '14px 18px',
                                                borderRadius: '12px',
                                                background: waStatus.connected ? 'rgba(34, 197, 94, 0.08)' : waStatus.status === 'unconfigured' ? 'rgba(234, 179, 8, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                                                border: '1px solid ' + (waStatus.connected ? 'rgba(34, 197, 94, 0.25)' : waStatus.status === 'unconfigured' ? 'rgba(234, 179, 8, 0.25)' : 'rgba(239, 68, 68, 0.25)'),
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                gap: '16px',
                                                flexWrap: 'wrap'
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{
                                                        width: '36px', height: '36px', borderRadius: '10px',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
                                                        background: waStatus.connected ? 'rgba(34, 197, 94, 0.2)' : waStatus.status === 'unconfigured' ? 'rgba(234, 179, 8, 0.2)' : 'rgba(239, 68, 68, 0.2)'
                                                    }}>
                                                        {waStatus.connected ? '🟢' : waStatus.status === 'unconfigured' ? '⚠️' : '🔴'}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontSize: '13px', fontWeight: '700', color: waStatus.connected ? '#4ade80' : waStatus.status === 'unconfigured' ? '#facc15' : '#f87171' }}>
                                                            Status Fonnte Gateway: {waStatus.connected ? 'TERHUBUNG (ONLINE)' : waStatus.status === 'unconfigured' ? 'BELUM KONFIGURASI' : 'TERPUTUS (OFFLINE)'}
                                                        </div>
                                                        <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>
                                                            {waStatus.message}
                                                            {waStatus.quota !== null && waStatus.quota !== undefined && ` • Sisa Kuota: ${waStatus.quota} pesan`}
                                                            {waStatus.package && ` • Paket: ${waStatus.package}`}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                    {!waStatus.connected && (
                                                        <a
                                                            href="https://md.fonnte.com"
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            style={{
                                                                padding: '6px 12px',
                                                                borderRadius: '8px',
                                                                background: 'rgba(99, 102, 241, 0.15)',
                                                                border: '1px solid rgba(99, 102, 241, 0.3)',
                                                                color: '#a5b4fc',
                                                                fontSize: '12px',
                                                                fontWeight: '600',
                                                                textDecoration: 'none'
                                                            }}
                                                        >
                                                            🔗 Dashboard Fonnte
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        <div className="form-group" style={{ marginBottom: '16px' }}>
                                            <label>Fonnte API Token (WhatsApp)</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                value={adminSettings.whatsapp_api_token || ''}
                                                onChange={e => setAdminSettings(p => ({ ...p, whatsapp_api_token: e.target.value }))}
                                                placeholder="Token API dari Fonnte"
                                            />
                                            <small style={{ color: '#6b7280', fontSize: '11px' }}>
                                                Token gateway WhatsApp untuk mengirim notifikasi tender baru secara otomatis.
                                            </small>
                                        </div>
                                        <div className="form-group" style={{ marginBottom: '24px' }}>
                                            <label>Nama Pengirim WhatsApp (Sender)</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={adminSettings.whatsapp_sender || ''}
                                                onChange={e => setAdminSettings(p => ({ ...p, whatsapp_sender: e.target.value }))}
                                                placeholder="Contoh: Fonnte"
                                            />
                                        </div>
                                        <button className="btn-primary" onClick={(e) => handleSaveSettings(e, 'whatsapp')} disabled={isSavingSettings} style={{ width: '100%' }}>
                                            {isSavingSettings ? 'Menyimpan...' : '💾 Simpan WhatsApp API'}
                                        </button>
                                        {waSaveMsg && (
                                            <div style={{
                                                marginTop: '12px', padding: '10px 14px', borderRadius: '8px', fontSize: '13px',
                                                background: waSaveMsg.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                                                color: waSaveMsg.type === 'success' ? '#34d399' : '#f87171',
                                                border: `1px solid ${waSaveMsg.type === 'success' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`
                                            }}>
                                                {waSaveMsg.type === 'success' ? '✔ ' : '✘ '}{waSaveMsg.text}
                                            </div>
                                        )}
                                    </div>

                                    {/* WHATSAPP TEST */}
                                    <div className="panel">
                                        <div className="panel-header">
                                            <h3 className="panel-title">🧪 Uji Coba Koneksi WhatsApp</h3>
                                        </div>
                                        <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '16px' }}>
                                            Simpan token API Fonnte terlebih dahulu, lalu masukkan nomor WhatsApp tujuan untuk mengirim pesan uji coba.
                                        </p>
                                        <form onSubmit={handleTestWhatsapp} style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                                            <div style={{ flexGrow: 1, minWidth: '180px' }}>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Contoh: 081234567890"
                                                    value={whatsappTestNum}
                                                    onChange={e => setWhatsappTestNum(e.target.value)}
                                                    required
                                                    style={{ width: '100%' }}
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={isTestingWa}
                                                style={{
                                                    background: '#10b981', border: 'none', color: '#fff', padding: '10px 18px',
                                                    borderRadius: '8px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap',
                                                    opacity: isTestingWa ? 0.7 : 1, width: 'auto', flexGrow: 1
                                                }}
                                            >
                                                {isTestingWa ? 'Mengirim...' : '📤 Kirim WA Uji Coba'}
                                            </button>
                                        </form>

                                        {waTestResult && (
                                            <div style={{
                                                marginTop: '16px', padding: '12px', borderRadius: '8px', fontSize: '13px',
                                                background: waTestResult.type === 'success' ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
                                                color: waTestResult.type === 'success' ? '#34d399' : '#f87171',
                                                border: `1px solid ${waTestResult.type === 'success' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`
                                            }}>
                                                <strong>{waTestResult.type === 'success' ? '✔ Berhasil! ' : '✘ Gagal: '}</strong>
                                                {waTestResult.text}
                                            </div>
                                        )}

                                        <div style={{ marginTop: '14px', padding: '10px 14px', background: '#090d16', borderRadius: '8px', fontSize: '11px', color: '#6b7280' }}>
                                            <strong style={{ color: '#9ca3af' }}>ℹ️ Mode Debug:</strong> Jika Token API Fonnte belum dikonfigurasi, pesan uji coba ditulis ke{' '}
                                            <code style={{ color: '#34d399' }}>backend/mock_whatsapp.log</code>.
                                        </div>
                                    </div>
                                </div>

                                {/* SMTP SETTINGS */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                    <div className="panel">
                                        <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                                            <h3 className="panel-title" style={{ margin: 0 }}>📨 Konfigurasi Email SMTP</h3>
                                            
                                            {/* Realtime SMTP Status Badge */}
                                            <button
                                                type="button"
                                                onClick={() => fetchSmtpStatus()}
                                                disabled={isCheckingSmtpStatus}
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                    padding: '6px 14px',
                                                    borderRadius: '20px',
                                                    fontSize: '12px',
                                                    fontWeight: '700',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease',
                                                    border: '1px solid ' + (
                                                        smtpStatus?.connected ? 'rgba(34, 197, 94, 0.4)' :
                                                        smtpStatus?.status === 'unconfigured' ? 'rgba(234, 179, 8, 0.4)' :
                                                        'rgba(239, 68, 68, 0.4)'
                                                    ),
                                                    background: (
                                                        smtpStatus?.connected ? 'rgba(34, 197, 94, 0.12)' :
                                                        smtpStatus?.status === 'unconfigured' ? 'rgba(234, 179, 8, 0.12)' :
                                                        'rgba(239, 68, 68, 0.12)'
                                                    ),
                                                    color: (
                                                        smtpStatus?.connected ? '#4ade80' :
                                                        smtpStatus?.status === 'unconfigured' ? '#facc15' :
                                                        '#f87171'
                                                    )
                                                }}
                                                title="Klik untuk memperbarui status koneksi SMTP realtime"
                                            >
                                                <span style={{
                                                    width: '8px',
                                                    height: '8px',
                                                    borderRadius: '50%',
                                                    background: (
                                                        isCheckingSmtpStatus ? '#6366f1' :
                                                        smtpStatus?.connected ? '#22c55e' :
                                                        smtpStatus?.status === 'unconfigured' ? '#eab308' :
                                                        '#ef4444'
                                                    ),
                                                    boxShadow: smtpStatus?.connected ? '0 0 10px #22c55e' : 'none',
                                                    display: 'inline-block'
                                                }} />
                                                {isCheckingSmtpStatus ? 'Mengecek...' : (
                                                    smtpStatus?.connected ? `Terhubung (${smtpStatus.host || 'SMTP'})` :
                                                    smtpStatus?.status === 'unconfigured' ? 'Belum Konfigurasi' :
                                                    'Gagal Terhubung'
                                                )}
                                                <span style={{ opacity: 0.7, fontSize: '11px', marginLeft: '2px' }}>🔄</span>
                                            </button>
                                        </div>

                                        {/* Status Detail Banner */}
                                        {smtpStatus && (
                                            <div style={{
                                                marginBottom: '20px',
                                                padding: '14px 18px',
                                                borderRadius: '12px',
                                                background: smtpStatus.connected ? 'rgba(34, 197, 94, 0.08)' : smtpStatus.status === 'unconfigured' ? 'rgba(234, 179, 8, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                                                border: '1px solid ' + (smtpStatus.connected ? 'rgba(34, 197, 94, 0.25)' : smtpStatus.status === 'unconfigured' ? 'rgba(234, 179, 8, 0.25)' : 'rgba(239, 68, 68, 0.25)'),
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '12px'
                                            }}>
                                                <div style={{
                                                    width: '36px', height: '36px', borderRadius: '10px',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
                                                    background: smtpStatus.connected ? 'rgba(34, 197, 94, 0.2)' : smtpStatus.status === 'unconfigured' ? 'rgba(234, 179, 8, 0.2)' : 'rgba(239, 68, 68, 0.2)'
                                                }}>
                                                    {smtpStatus.connected ? '🟢' : smtpStatus.status === 'unconfigured' ? '⚠️' : '🔴'}
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: '13px', fontWeight: '700', color: smtpStatus.connected ? '#4ade80' : smtpStatus.status === 'unconfigured' ? '#facc15' : '#f87171' }}>
                                                        Status SMTP Mailer: {smtpStatus.connected ? 'TERHUBUNG (ONLINE)' : smtpStatus.status === 'unconfigured' ? 'BELUM KONFIGURASI' : 'TERPUTUS (OFFLINE)'}
                                                    </div>
                                                    <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>
                                                        {smtpStatus.message}
                                                        {smtpStatus.user && ` • User: ${smtpStatus.user}`}
                                                        {smtpStatus.sender && ` • Sender: ${smtpStatus.sender}`}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        <form onSubmit={(e) => handleSaveSettings(e, 'smtp')}>
                                            <div className="form-group" style={{ marginBottom: '14px' }}>
                                                <label>SMTP Host</label>
                                                <input className="form-control" type="text" placeholder="smtp.gmail.com" value={adminSettings.smtp_host}
                                                    onChange={e => setAdminSettings(p => ({ ...p, smtp_host: e.target.value }))} />
                                            </div>
                                            <div className="form-group" style={{ marginBottom: '14px' }}>
                                                <label>SMTP Port</label>
                                                <input className="form-control" type="text" placeholder="587" value={adminSettings.smtp_port}
                                                    onChange={e => setAdminSettings(p => ({ ...p, smtp_port: e.target.value }))} />
                                                <small style={{ color: '#6b7280', fontSize: '11px' }}>Port 587 (STARTTLS) atau 465 (SSL)</small>
                                            </div>
                                            <div className="form-group" style={{ marginBottom: '14px' }}>
                                                <label>Username / Email Pengirim SMTP</label>
                                                <input className="form-control" type="text" placeholder="user@gmail.com" value={adminSettings.smtp_user}
                                                    onChange={e => setAdminSettings(p => ({ ...p, smtp_user: e.target.value }))} />
                                            </div>
                                            <div className="form-group" style={{ marginBottom: '14px' }}>
                                                <label>Password SMTP</label>
                                                <input className="form-control" type="password" placeholder="App Password / SMTP Password" value={adminSettings.smtp_password}
                                                    onChange={e => setAdminSettings(p => ({ ...p, smtp_password: e.target.value }))} />
                                                <small style={{ color: '#6b7280', fontSize: '11px' }}>Untuk Gmail, gunakan App Password (bukan password akun biasa).</small>
                                            </div>
                                            <div className="form-group" style={{ marginBottom: '20px' }}>
                                                <label>Nama Email Pengirim (Sender)</label>
                                                <input className="form-control" type="email" placeholder="no-reply@spyspse.com" value={adminSettings.smtp_sender}
                                                    onChange={e => setAdminSettings(p => ({ ...p, smtp_sender: e.target.value }))} />
                                            </div>
                                            <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={isSavingSettings}>
                                                {isSavingSettings ? 'Menyimpan...' : '💾 Simpan Konfigurasi SMTP'}
                                            </button>
                                            {smtpSaveMsg && (
                                                <div style={{
                                                    marginTop: '12px', padding: '10px 14px', borderRadius: '8px', fontSize: '13px',
                                                    background: smtpSaveMsg.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                                                    color: smtpSaveMsg.type === 'success' ? '#34d399' : '#f87171',
                                                    border: `1px solid ${smtpSaveMsg.type === 'success' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`
                                                }}>
                                                    {smtpSaveMsg.type === 'success' ? '✔ ' : '✘ '}{smtpSaveMsg.text}
                                                </div>
                                            )}
                                        </form>
                                    </div>

                                    {/* SMTP TEST */}
                                    <div className="panel">
                                        <div className="panel-header">
                                            <h3 className="panel-title">🧪 Uji Coba Koneksi SMTP</h3>
                                        </div>
                                        <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '16px' }}>
                                            Simpan konfigurasi SMTP terlebih dahulu, lalu masukkan alamat email penerima di bawah ini untuk mengirim email uji coba.
                                        </p>
                                        <form onSubmit={handleTestSmtp} style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                                            <div style={{ flexGrow: 1, minWidth: '180px' }}>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    placeholder="Contoh: anda@gmail.com"
                                                    value={smtpTestEmail}
                                                    onChange={e => setSmtpTestEmail(e.target.value)}
                                                    required
                                                    style={{ width: '100%' }}
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={isTestingSmtp}
                                                style={{
                                                    background: '#0ea5e9', border: 'none', color: '#fff', padding: '10px 18px',
                                                    borderRadius: '8px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap',
                                                    opacity: isTestingSmtp ? 0.7 : 1, width: 'auto', flexGrow: 1
                                                }}
                                            >
                                                {isTestingSmtp ? 'Mengirim...' : '📤 Kirim Email Uji Coba'}
                                            </button>
                                        </form>

                                        {smtpTestResult && (
                                            <div style={{
                                                marginTop: '16px', padding: '12px', borderRadius: '8px', fontSize: '13px',
                                                background: smtpTestResult.type === 'success' ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
                                                color: smtpTestResult.type === 'success' ? '#34d399' : '#f87171',
                                                border: `1px solid ${smtpTestResult.type === 'success' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`
                                            }}>
                                                <strong>{smtpTestResult.type === 'success' ? '✔ Berhasil! ' : '✘ Gagal: '}</strong>
                                                {smtpTestResult.text}
                                            </div>
                                        )}

                                        <div style={{ marginTop: '14px', padding: '10px 14px', background: '#090d16', borderRadius: '8px', fontSize: '11px', color: '#6b7280' }}>
                                            <strong style={{ color: '#9ca3af' }}>ℹ️ Mode Debug:</strong> Jika SMTP belum dikonfigurasi, email uji coba ditulis ke{' '}
                                            <code style={{ color: '#34d399' }}>backend/mock_emails.log</code>.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* SUBTAB 3: PAYMENT & PRICING */}
                        {adminSubTab === 'payment' && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '24px' }}>
                                {/* MIDTRANS SETTINGS */}
                                <div className="panel">
                                    <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                                        <h3 className="panel-title" style={{ margin: 0 }}>💳 Konfigurasi Midtrans Snap</h3>
                                        
                                        {/* Realtime Midtrans Status Badge */}
                                        <button
                                            type="button"
                                            onClick={() => fetchMidtransStatus()}
                                            disabled={isCheckingMidtransStatus}
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                padding: '6px 14px',
                                                borderRadius: '20px',
                                                fontSize: '12px',
                                                fontWeight: '700',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                                border: '1px solid ' + (
                                                    midtransStatus?.connected ? 'rgba(34, 197, 94, 0.4)' :
                                                    midtransStatus?.status === 'unconfigured' ? 'rgba(234, 179, 8, 0.4)' :
                                                    'rgba(239, 68, 68, 0.4)'
                                                ),
                                                background: (
                                                    midtransStatus?.connected ? 'rgba(34, 197, 94, 0.12)' :
                                                    midtransStatus?.status === 'unconfigured' ? 'rgba(234, 179, 8, 0.12)' :
                                                    'rgba(239, 68, 68, 0.12)'
                                                ),
                                                color: (
                                                    midtransStatus?.connected ? '#4ade80' :
                                                    midtransStatus?.status === 'unconfigured' ? '#facc15' :
                                                    '#f87171'
                                                )
                                            }}
                                            title="Klik untuk memperbarui status koneksi Midtrans realtime"
                                        >
                                            <span style={{
                                                width: '8px',
                                                height: '8px',
                                                borderRadius: '50%',
                                                background: (
                                                    isCheckingMidtransStatus ? '#6366f1' :
                                                    midtransStatus?.connected ? '#22c55e' :
                                                    midtransStatus?.status === 'unconfigured' ? '#eab308' :
                                                    '#ef4444'
                                                ),
                                                boxShadow: midtransStatus?.connected ? '0 0 10px #22c55e' : 'none',
                                                display: 'inline-block'
                                            }} />
                                            {isCheckingMidtransStatus ? 'Mengecek...' : (
                                                midtransStatus?.connected ? `Terhubung (${midtransStatus.environment})` :
                                                midtransStatus?.status === 'unconfigured' ? 'Simulasi Lokal' :
                                                'Server Key Ditolak'
                                            )}
                                            <span style={{ opacity: 0.7, fontSize: '11px', marginLeft: '2px' }}>🔄</span>
                                        </button>
                                    </div>

                                    {/* Midtrans Status Detail Banner */}
                                    {midtransStatus && (
                                        <div style={{
                                            marginBottom: '20px',
                                            padding: '14px 18px',
                                            borderRadius: '12px',
                                            background: midtransStatus.connected ? 'rgba(34, 197, 94, 0.08)' : midtransStatus.status === 'unconfigured' ? 'rgba(234, 179, 8, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                                            border: '1px solid ' + (midtransStatus.connected ? 'rgba(34, 197, 94, 0.25)' : midtransStatus.status === 'unconfigured' ? 'rgba(234, 179, 8, 0.25)' : 'rgba(239, 68, 68, 0.25)'),
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px'
                                        }}>
                                            <div style={{
                                                width: '36px', height: '36px', borderRadius: '10px',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
                                                background: midtransStatus.connected ? 'rgba(34, 197, 94, 0.2)' : midtransStatus.status === 'unconfigured' ? 'rgba(234, 179, 8, 0.2)' : 'rgba(239, 68, 68, 0.2)'
                                            }}>
                                                {midtransStatus.connected ? '🟢' : midtransStatus.status === 'unconfigured' ? '⚠️' : '🔴'}
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '13px', fontWeight: '700', color: midtransStatus.connected ? '#4ade80' : midtransStatus.status === 'unconfigured' ? '#facc15' : '#f87171' }}>
                                                    Status Midtrans Gateway: {midtransStatus.connected ? `TERHUBUNG (${midtransStatus.environment.toUpperCase()})` : midtransStatus.status === 'unconfigured' ? 'MODE SIMULASI LOKAL' : 'TERPUTUS (ERROR)'}
                                                </div>
                                                <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>
                                                    {midtransStatus.message}
                                                    {midtransStatus.server_key && ` • Key: ${midtransStatus.server_key}`}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <form onSubmit={(e) => handleSaveSettings(e, 'midtrans')}>
                                        <div className="form-group" style={{ marginBottom: '14px' }}>
                                            <label>Client Key</label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                placeholder="Contoh: SB-Mid-client-..."
                                                value={adminSettings.midtrans_client_key || ''}
                                                onChange={e => setAdminSettings(p => ({ ...p, midtrans_client_key: e.target.value }))}
                                            />
                                        </div>
                                        <div className="form-group" style={{ marginBottom: '14px' }}>
                                            <label>Server Key</label>
                                            <input
                                                className="form-control"
                                                type="password"
                                                placeholder="Contoh: SB-Mid-server-..."
                                                value={adminSettings.midtrans_server_key || ''}
                                                onChange={e => setAdminSettings(p => ({ ...p, midtrans_server_key: e.target.value }))}
                                            />
                                        </div>
                                        <div className="form-group" style={{ marginBottom: '20px' }}>
                                            <label>Environment Mode</label>
                                            <select
                                                className="form-control"
                                                value={adminSettings.midtrans_is_production || 'false'}
                                                onChange={e => setAdminSettings(p => ({ ...p, midtrans_is_production: e.target.value }))}
                                            >
                                                <option value="false">Sandbox (Uji Coba)</option>
                                                <option value="true">Production (Asli)</option>
                                            </select>
                                        </div>
                                        <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={isSavingSettings}>
                                            {isSavingSettings ? 'Menyimpan...' : '💾 Simpan Konfigurasi Midtrans'}
                                        </button>
                                        {midtransSaveMsg && (
                                            <div style={{
                                                marginTop: '12px', padding: '10px 14px', borderRadius: '8px', fontSize: '13px',
                                                background: midtransSaveMsg.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                                                color: midtransSaveMsg.type === 'success' ? '#34d399' : '#f87171',
                                                border: `1px solid ${midtransSaveMsg.type === 'success' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`
                                            }}>
                                                {midtransSaveMsg.type === 'success' ? '✔ ' : '✘ '}{midtransSaveMsg.text}
                                            </div>
                                        )}
                                    </form>
                                </div>

                                {/* PRICING SETTINGS */}
                                <div className="panel">
                                    <div className="panel-header">
                                        <h3 className="panel-title">💰 Pengaturan Harga Premium</h3>
                                    </div>
                                    <form onSubmit={(e) => handleSaveSettings(e, 'pricing')}>
                                        <div className="form-group" style={{ marginBottom: '14px' }}>
                                            <label>Harga Paket Bulanan (30 Hari) - Rp</label>
                                            <input
                                                className="form-control"
                                                type="number"
                                                placeholder="150000"
                                                value={adminSettings.premium_price || ''}
                                                onChange={e => setAdminSettings(p => ({ ...p, premium_price: e.target.value }))}
                                                required
                                            />
                                        </div>
                                        <div className="form-group" style={{ marginBottom: '20px' }}>
                                            <label>Harga Paket Tahunan (365 Hari) - Rp</label>
                                            <input
                                                className="form-control"
                                                type="number"
                                                placeholder="1500000"
                                                value={adminSettings.premium_price_yearly || ''}
                                                onChange={e => setAdminSettings(p => ({ ...p, premium_price_yearly: e.target.value }))}
                                                required
                                            />
                                        </div>
                                        <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={isSavingSettings}>
                                            {isSavingSettings ? 'Menyimpan...' : '💾 Simpan Pengaturan Harga'}
                                        </button>
                                        {pricingSaveMsg && (
                                            <div style={{
                                                marginTop: '12px', padding: '10px 14px', borderRadius: '8px', fontSize: '13px',
                                                background: pricingSaveMsg.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                                                color: pricingSaveMsg.type === 'success' ? '#34d399' : '#f87171',
                                                border: `1px solid ${pricingSaveMsg.type === 'success' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`
                                            }}>
                                                {pricingSaveMsg.type === 'success' ? '✔ ' : '✘ '}{pricingSaveMsg.text}
                                            </div>
                                        )}
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* SUBTAB 4: CHATBOT & CONTACT */}
                        {adminSubTab === 'chatbot' && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '24px' }}>
                                {/* CONTACT SETTINGS */}
                                <div className="panel">
                                    <div className="panel-header">
                                        <h3 className="panel-title">📬 Pengaturan Kontak Landing Page</h3>
                                    </div>
                                    <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '18px', lineHeight: '1.6' }}>
                                        Informasi kontak yang ditampilkan di halaman <strong style={{ color: '#a5b4fc' }}>Kontak</strong> publik. Kosongkan jika tidak ingin ditampilkan.
                                    </p>
                                    <form onSubmit={(e) => handleSaveSettings(e, 'contact')}>
                                        <div className="form-group" style={{ marginBottom: '14px' }}>
                                            <label>Nomor WhatsApp (format internasional)</label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                placeholder="Contoh: 6281234567890"
                                                value={adminSettings.contact_whatsapp || ''}
                                                onChange={e => setAdminSettings(p => ({ ...p, contact_whatsapp: e.target.value }))}
                                            />
                                            <small style={{ color: '#6b7280', fontSize: '12px' }}>Tanpa + dan tanpa spasi. Contoh: 6281234567890</small>
                                        </div>
                                        <div className="form-group" style={{ marginBottom: '14px' }}>
                                            <label>Alamat Email Kontak</label>
                                            <input
                                                className="form-control"
                                                type="email"
                                                placeholder="kontak@perusahaan.com"
                                                value={adminSettings.contact_email || ''}
                                                onChange={e => setAdminSettings(p => ({ ...p, contact_email: e.target.value }))}
                                            />
                                        </div>
                                        <div className="form-group" style={{ marginBottom: '20px' }}>
                                            <label>URL Embed Google Maps</label>
                                            <textarea
                                                className="form-control"
                                                rows={4}
                                                placeholder="https://www.google.com/maps/embed?pb=..."
                                                value={adminSettings.contact_maps_embed || ''}
                                                onChange={e => setAdminSettings(p => ({ ...p, contact_maps_embed: e.target.value }))}
                                                style={{ resize: 'vertical', fontFamily: 'monospace', fontSize: '12px' }}
                                            />
                                            <small style={{ color: '#6b7280', fontSize: '12px' }}>
                                                Buka Google Maps → Share → Embed a map → salin URL dari atribut <code style={{ color: '#818cf8', background: 'rgba(129,140,248,0.1)', padding: '1px 4px', borderRadius: '3px' }}>src="..."</code>
                                            </small>
                                        </div>
                                        <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={isSavingSettings}>
                                            {isSavingSettings ? 'Menyimpan...' : '💾 Simpan Pengaturan Kontak'}
                                        </button>
                                        {contactSaveMsg && (
                                            <div style={{
                                                marginTop: '12px', padding: '10px 14px', borderRadius: '8px', fontSize: '13px',
                                                background: contactSaveMsg.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                                                color: contactSaveMsg.type === 'success' ? '#34d399' : '#f87171',
                                                border: `1px solid ${contactSaveMsg.type === 'success' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`
                                            }}>
                                                {contactSaveMsg.type === 'success' ? '✔ ' : '✘ '}{contactSaveMsg.text}
                                            </div>
                                        )}
                                    </form>
                                </div>

                                {/* CHATBOT ASSISTANT SETTINGS */}
                                <div className="panel" style={{ background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(20px)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                                    <div className="panel-header" style={{ marginBottom: '16px' }}>
                                        <h3 className="panel-title">🤖 Pengaturan Chatbot Asisten</h3>
                                    </div>
                                    <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '20px', lineHeight: '1.5' }}>
                                        Konfigurasi widget Chatbot Asisten interaktif untuk mengumpulkan prospek (*leads*) calon pengguna dari halaman publik.
                                    </p>
                                    <form onSubmit={(e) => handleSaveSettings(e, 'chatbot')}>
                                        <div className="form-group" style={{ marginBottom: '14px' }}>
                                            <label>Status Chatbot Widget</label>
                                            <select
                                                className="form-control"
                                                value={adminSettings.chatbot_active || 'true'}
                                                onChange={e => setAdminSettings(p => ({ ...p, chatbot_active: e.target.value }))}
                                            >
                                                <option value="true">✅ Aktif (Tampilkan Widget Chatbot)</option>
                                                <option value="false">❌ Nonaktifkan Chatbot</option>
                                            </select>
                                        </div>
                                        <div className="form-group" style={{ marginBottom: '14px' }}>
                                            <label>Nama Asisten Virtual (Bot)</label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                placeholder="Contoh: Nadia"
                                                value={adminSettings.chatbot_name || ''}
                                                onChange={e => setAdminSettings(p => ({ ...p, chatbot_name: e.target.value }))}
                                            />
                                        </div>
                                        <div className="form-group" style={{ marginBottom: '14px' }}>
                                            <label>Pesan Salam Pembuka (Initial Greeting)</label>
                                            <textarea
                                                className="form-control"
                                                rows={2}
                                                placeholder="Pesan salam pembuka bot..."
                                                value={adminSettings.chatbot_initial_greeting || ''}
                                                onChange={e => setAdminSettings(p => ({ ...p, chatbot_initial_greeting: e.target.value }))}
                                            />
                                        </div>
                                        <div className="form-group" style={{ marginBottom: '14px' }}>
                                            <label>Pesan Pertanyaan Nama</label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                placeholder="Pesan meminta nama..."
                                                value={adminSettings.chatbot_ask_name_message || ''}
                                                onChange={e => setAdminSettings(p => ({ ...p, chatbot_ask_name_message: e.target.value }))}
                                            />
                                        </div>
                                        <div className="form-group" style={{ marginBottom: '14px' }}>
                                            <label>Pesan Pertanyaan WhatsApp</label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                placeholder="Pesan meminta nomor WhatsApp..."
                                                value={adminSettings.chatbot_ask_phone_message || ''}
                                                onChange={e => setAdminSettings(p => ({ ...p, chatbot_ask_phone_message: e.target.value }))}
                                            />
                                        </div>
                                        <div className="form-group" style={{ marginBottom: '14px' }}>
                                            <label>Pesan Pertanyaan Email</label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                placeholder="Pesan meminta alamat email..."
                                                value={adminSettings.chatbot_ask_email_message || ''}
                                                onChange={e => setAdminSettings(p => ({ ...p, chatbot_ask_email_message: e.target.value }))}
                                            />
                                        </div>
                                        <div className="form-group" style={{ marginBottom: '14px' }}>
                                            <label>Pesan Pertanyaan Konsultasi / Alasan</label>
                                            <textarea
                                                className="form-control"
                                                rows={2}
                                                placeholder="Pesan meminta detail kebutuhan..."
                                                value={adminSettings.chatbot_ask_reason_message || ''}
                                                onChange={e => setAdminSettings(p => ({ ...p, chatbot_ask_reason_message: e.target.value }))}
                                            />
                                        </div>
                                        <div className="form-group" style={{ marginBottom: '20px' }}>
                                            <label>Pesan Akhir / Sukses</label>
                                            <textarea
                                                className="form-control"
                                                rows={2}
                                                placeholder="Pesan penutup sebelum tombol WhatsApp..."
                                                value={adminSettings.chatbot_final_message || ''}
                                                onChange={e => setAdminSettings(p => ({ ...p, chatbot_final_message: e.target.value }))}
                                            />
                                        </div>
                                        <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={isSavingSettings}>
                                            {isSavingSettings ? 'Menyimpan...' : '💾 Simpan Pengaturan Chatbot'}
                                        </button>
                                        {chatbotSaveMsg && (
                                            <div style={{
                                                marginTop: '12px', padding: '10px 14px', borderRadius: '8px', fontSize: '13px',
                                                background: chatbotSaveMsg.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                                                color: chatbotSaveMsg.type === 'success' ? '#34d399' : '#f87171',
                                                border: `1px solid ${chatbotSaveMsg.type === 'success' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`
                                            }}>
                                                {chatbotSaveMsg.type === 'success' ? '✔ ' : '✘ '}{chatbotSaveMsg.text}
                                            </div>
                                        )}
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* SUBTAB 5: VOUCHERS */}
                        {adminSubTab === 'vouchers' && (
                            <div className="panel">
                                <div className="panel-header">
                                    <h3 className="panel-title">🎟️ Manajemen Voucher Diskon</h3>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '24px' }}>
                                    {/* Create Voucher Form */}
                                    <div>
                                        <h4 style={{ fontSize: '15px', color: '#fff', marginBottom: '16px' }}>Buat Voucher Baru</h4>
                                        <form onSubmit={handleCreateVoucher}>
                                            <div className="form-group" style={{ marginBottom: '14px' }}>
                                                <label>Kode Voucher</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Contoh: DISKON50"
                                                    value={voucherCode}
                                                    onChange={e => setVoucherCode(e.target.value.toUpperCase())}
                                                    required
                                                />
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', marginBottom: '14px' }}>
                                                <div className="form-group">
                                                    <label>Tipe Diskon</label>
                                                    <select
                                                        className="form-control"
                                                        value={voucherType}
                                                        onChange={e => setVoucherType(e.target.value)}
                                                    >
                                                        <option value="percent">Persentase (%)</option>
                                                        <option value="nominal">Nominal Rupiah (Rp)</option>
                                                    </select>
                                                </div>
                                                <div className="form-group">
                                                    <label>Nilai Potongan</label>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        value={voucherValue}
                                                        onChange={e => setVoucherValue(e.target.value)}
                                                        required
                                                        min="1"
                                                    />
                                                </div>
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', marginBottom: '14px' }}>
                                                <div className="form-group">
                                                    <label>Maksimal Penggunaan</label>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        value={voucherMaxUses}
                                                        onChange={e => setVoucherMaxUses(e.target.value)}
                                                        required
                                                        min="1"
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>Masa Berlaku s/d (Opsional)</label>
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        value={voucherExpiresAt}
                                                        onChange={e => setVoucherExpiresAt(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={isCreatingVoucher}>
                                                {isCreatingVoucher ? 'Membuat...' : '🎟️ Tambah Voucher'}
                                            </button>
                                        </form>
                                        {voucherMsg && (
                                            <div style={{
                                                marginTop: '12px', padding: '10px 14px', borderRadius: '8px', fontSize: '13px',
                                                background: voucherMsg.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                                                color: voucherMsg.type === 'success' ? '#34d399' : '#f87171',
                                                border: `1px solid ${voucherMsg.type === 'success' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`
                                            }}>
                                                {voucherMsg.type === 'success' ? '✔ ' : '✘ '}{voucherMsg.text}
                                            </div>
                                        )}
                                    </div>

                                    {/* Voucher List Table */}
                                    <div>
                                        <h4 style={{ fontSize: '15px', color: '#fff', marginBottom: '16px' }}>Daftar Voucher Aktif</h4>
                                        <div className="table-wrapper" style={{ maxHeight: '360px', overflowY: 'auto', overflowX: 'auto' }}>
                                            <table className="tender-table" style={{ fontSize: '13px', minWidth: '480px' }}>
                                                <thead>
                                                    <tr>
                                                        <th>Kode</th>
                                                        <th>Potongan</th>
                                                        <th>Penggunaan</th>
                                                        <th>Masa Berlaku</th>
                                                        <th style={{ whiteSpace: 'nowrap' }}>Aksi</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {vouchers.length > 0 ? (
                                                        vouchers.map((v, idx) => (
                                                            <tr key={idx}>
                                                                <td><strong>{v.code}</strong></td>
                                                                <td>
                                                                    {v.discount_type === 'percent' ? `${v.discount_value}%` : `Rp ${parseFloat(v.discount_value).toLocaleString('id-ID')}`}
                                                                </td>
                                                                <td>{v.used_count} / {v.max_uses}</td>
                                                                <td>{v.expires_at ? v.expires_at : <span style={{ color: '#6b7280', fontStyle: 'italic' }}>Tanpa batas</span>}</td>
                                                                <td style={{ whiteSpace: 'nowrap' }}>
                                                                    <button
                                                                        className="btn-delete"
                                                                        style={{ padding: '4px 8px', fontSize: '12px' }}
                                                                        onClick={() => handleDeleteVoucher(v.code)}
                                                                    >
                                                                        Hapus
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="5" style={{ textAlign: 'center', color: '#6b7280', padding: '20px' }}>
                                                                Belum ada voucher kupon aktif.
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* SUBTAB 6: LPSE INSTANCES */}
                        {adminSubTab === 'lpse' && (
                            <div className="panel">
                                <div className="panel-header">
                                    <h3 className="panel-title">🏢 Pengaturan K/L/Pemda/Instansi LPSE</h3>
                                </div>
                                <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '20px' }}>
                                    Kelola daftar K/L/Pemda/Instansi target LPSE nasional dan daerah yang dapat diakses melalui portal pemantauan, alert email, dan scraper.
                                </p>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '24px' }}>
                                    {/* Form Tambah Instansi */}
                                    <div>
                                        <h4 style={{ fontSize: '15px', color: '#fff', marginBottom: '16px' }}>Tambah K/L/Pemda/Instansi Target LPSE</h4>
                                        <form onSubmit={handleAddLpseInstance}>
                                            <div className="form-group" style={{ marginBottom: '14px' }}>
                                                <label>Nama K/L/Pemda/Instansi</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Contoh: Kota Bandung"
                                                    value={newLpseName}
                                                    onChange={e => setNewLpseName(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group" style={{ marginBottom: '14px' }}>
                                                <label>Jenis Instansi</label>
                                                <input
                                                    list="jenis-instansi-options"
                                                    className="form-control"
                                                    placeholder="Pilih atau ketik Jenis Instansi..."
                                                    value={newLpseJenis}
                                                    onChange={e => setNewLpseJenis(e.target.value)}
                                                    required
                                                />
                                                <datalist id="jenis-instansi-options">
                                                    <option value="Kementerian" />
                                                    <option value="Lembaga" />
                                                    <option value="Provinsi" />
                                                    <option value="Kabupaten" />
                                                    <option value="Kota" />
                                                    <option value="BUMN" />
                                                </datalist>
                                            </div>
                                            <div className="form-group" style={{ marginBottom: '20px' }}>
                                                <label>Kategori Slug (Sesuai inaproc segment, misal: bandung)</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Contoh: bandung"
                                                    value={newLpseSlug}
                                                    onChange={e => setNewLpseSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))}
                                                    required
                                                />
                                                <small style={{ color: '#6b7280', fontSize: '11px', marginTop: '6px', display: 'block' }}>
                                                    Slug ini digunakan untuk membentuk URL segment (misal: inaproc.id/<strong>bandung</strong>/lelang). Pastikan slug ini valid.
                                                </small>
                                            </div>
                                            <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                                                ➕ Tambah & Simpan K/L/Pemda/Instansi
                                            </button>
                                        </form>
                                        {lpseMsg && (
                                            <div style={{
                                                marginTop: '12px', padding: '10px 14px', borderRadius: '8px', fontSize: '13px',
                                                background: lpseMsg.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                                                color: lpseMsg.type === 'success' ? '#34d399' : '#f87171',
                                                border: `1px solid ${lpseMsg.type === 'success' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`
                                            }}>
                                                {lpseMsg.type === 'success' ? '✔ ' : '✘ '}{lpseMsg.text}
                                            </div>
                                        )}
                                    </div>

                                    {/* List Instansi Aktif */}
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                                            <div>
                                                <h4 style={{ fontSize: '15px', color: '#fff', margin: 0 }}>Daftar K/L/Pemda/Instansi Aktif ({lpseInstances.length})</h4>
                                                <small style={{ color: '#6b7280', fontSize: '11px' }}>✅ Perubahan disimpan otomatis ke server</small>
                                            </div>
                                            <button
                                                onClick={handleSaveLpseSettings}
                                                disabled={isSavingSettings}
                                                className="form-control"
                                                style={{ width: 'auto', padding: '6px 14px', background: '#6366f1', border: 'none', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
                                            >
                                                {isSavingSettings ? 'Menyimpan...' : '🔄 Sinkronkan Ulang'}
                                            </button>
                                        </div>

                                        <div className="table-wrapper" style={{ maxHeight: '360px', overflowY: 'auto', overflowX: 'auto' }}>
                                            <table className="tender-table" style={{ fontSize: '13px', minWidth: '520px' }}>
                                                <thead>
                                                    <tr>
                                                        <th>Nama K/L/Pemda/Instansi</th>
                                                        <th>Jenis Instansi</th>
                                                        <th>Kategori Slug</th>
                                                        <th style={{ whiteSpace: 'nowrap', width: '1%', textAlign: 'right' }}>Aksi</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {lpseInstances.length > 0 ? (
                                                        lpseInstances.map((inst, idx) => (
                                                            <tr key={idx} style={editingLpseSlug === inst.slug ? { background: 'rgba(99, 102, 241, 0.08)', outline: '1px solid #6366f1', borderRadius: '8px' } : {}}>
                                                                {editingLpseSlug === inst.slug ? (
                                                                    <>
                                                                        <td data-label="Nama K/L/Pemda/Instansi">
                                                                            <input
                                                                                type="text"
                                                                                className="form-control"
                                                                                style={{ width: '100%', maxWidth: '280px', flex: 1, padding: '6px 10px', fontSize: '13px', background: 'rgba(15, 23, 42, 0.9)', border: '1px solid #6366f1', borderRadius: '6px', color: '#fff', outline: 'none' }}
                                                                                value={editLpseData.name}
                                                                                onChange={(e) => setEditLpseData({ ...editLpseData, name: e.target.value })}
                                                                                placeholder="Nama Instansi"
                                                                            />
                                                                        </td>
                                                                        <td data-label="Jenis Instansi">
                                                                            <input
                                                                                list="jenis-instansi-options-edit"
                                                                                type="text"
                                                                                className="form-control"
                                                                                style={{ width: '100%', maxWidth: '200px', flex: 1, padding: '6px 10px', fontSize: '13px', background: 'rgba(15, 23, 42, 0.9)', border: '1px solid #6366f1', borderRadius: '6px', color: '#fff', outline: 'none' }}
                                                                                value={editLpseData.jenis}
                                                                                onChange={(e) => setEditLpseData({ ...editLpseData, jenis: e.target.value })}
                                                                                placeholder="Pilih/Ketik Jenis"
                                                                            />
                                                                            <datalist id="jenis-instansi-options-edit">
                                                                                <option value="Kementerian" />
                                                                                <option value="Lembaga" />
                                                                                <option value="Provinsi" />
                                                                                <option value="Kabupaten" />
                                                                                <option value="Kota" />
                                                                                <option value="BUMN" />
                                                                            </datalist>
                                                                        </td>
                                                                        <td data-label="Kategori Slug">
                                                                            <input
                                                                                type="text"
                                                                                className="form-control"
                                                                                style={{ width: '100%', maxWidth: '200px', flex: 1, padding: '6px 10px', fontSize: '13px', background: 'rgba(15, 23, 42, 0.9)', border: '1px solid #6366f1', borderRadius: '6px', color: '#fff', outline: 'none' }}
                                                                                value={editLpseData.slug}
                                                                                onChange={(e) => setEditLpseData({ ...editLpseData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '') })}
                                                                                placeholder="slug-instansi"
                                                                            />
                                                                        </td>
                                                                        <td data-label="Aksi" style={{ whiteSpace: 'nowrap', width: '1%', textAlign: 'right' }}>
                                                                            <div style={{ display: 'inline-flex', gap: '6px', alignItems: 'center', justifyContent: 'flex-end', marginLeft: 'auto' }}>
                                                                                <button
                                                                                    style={{ padding: '6px 12px', fontSize: '12px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                                                                    onClick={handleUpdateLpseInstance}
                                                                                >
                                                                                    ✓ Simpan
                                                                                </button>
                                                                                <button
                                                                                    style={{ padding: '6px 12px', fontSize: '12px', background: '#4b5563', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                                                                    onClick={handleCancelEditLpse}
                                                                                >
                                                                                    Batal
                                                                                </button>
                                                                            </div>
                                                                        </td>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <td data-label="Nama K/L/Pemda/Instansi"><strong>{inst.name}</strong></td>
                                                                        <td data-label="Jenis Instansi"><span style={{ fontSize: '12px', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>{inst.jenis || '-'}</span></td>
                                                                        <td data-label="Kategori Slug"><code style={{ color: '#818cf8', background: 'rgba(99,102,241,0.08)', padding: '2px 6px', borderRadius: '4px' }}>{inst.slug}</code></td>
                                                                        <td data-label="Aksi" style={{ whiteSpace: 'nowrap', width: '1%', textAlign: 'right' }}>
                                                                            <div style={{ display: 'inline-flex', gap: '6px', alignItems: 'center', justifyContent: 'flex-end', marginLeft: 'auto' }}>
                                                                                <a
                                                                                    href={`https://spse.inaproc.id/${inst.slug}/lelang`}
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    title={`Buka Link SPSE ${inst.name} (${inst.slug})`}
                                                                                    style={{
                                                                                        padding: '4px 8px',
                                                                                        fontSize: '13px',
                                                                                        background: 'rgba(99, 102, 241, 0.15)',
                                                                                        color: '#818cf8',
                                                                                        border: '1px solid rgba(99, 102, 241, 0.3)',
                                                                                        borderRadius: '4px',
                                                                                        cursor: 'pointer',
                                                                                        display: 'inline-flex',
                                                                                        alignItems: 'center',
                                                                                        justifyContent: 'center',
                                                                                        textDecoration: 'none'
                                                                                    }}
                                                                                >
                                                                                    👁️
                                                                                </a>
                                                                                <button
                                                                                    style={{ padding: '4px 8px', fontSize: '12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                                                                    onClick={() => handleEditLpseClick(inst)}
                                                                                >
                                                                                    Edit
                                                                                </button>
                                                                                <button
                                                                                    className="btn-delete"
                                                                                    style={{ padding: '4px 8px', fontSize: '12px' }}
                                                                                    onClick={() => handleDeleteLpseInstance(inst.slug)}
                                                                                >
                                                                                    Hapus
                                                                                </button>
                                                                            </div>
                                                                        </td>
                                                                    </>
                                                                )}
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="4" style={{ textAlign: 'center', color: '#6b7280', padding: '20px' }}>
                                                                Belum ada K/L/Pemda/Instansi LPSE dikonfigurasi.
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                        <small style={{ color: '#6b7280', fontSize: '11px', marginTop: '8px', display: 'block' }}>
                                            💡 Klik tombol <strong>Simpan K/L/Pemda/Instansi</strong> di kanan atas setiap kali setelah Anda menambah atau menghapus K/L/Pemda/Instansi agar tersimpan permanen di database.
                                        </small>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* SUBTAB 7: SYSTEM LOGS */}
                        {adminSubTab === 'logs' && (
                            <div className="panel">
                                <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                                    <h3 className="panel-title">📝 Real-Time System &amp; Crawler Logs</h3>
                                    <button
                                        onClick={fetchAdminLogs}
                                        className="form-control"
                                        style={{ width: 'auto', padding: '6px 16px', cursor: 'pointer', background: 'rgba(255,255,255,0.05)' }}
                                        disabled={isLoadingLogs}
                                    >
                                        {isLoadingLogs ? 'Loading...' : '🔄 Refresh Log'}
                                    </button>
                                </div>
                                <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '15px' }}>
                                    Berikut adalah baris terakhir log error crawling scraper dan simulasi sistem secara real-time.
                                </p>
                                <div style={{
                                    background: '#040711',
                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                    borderRadius: '8px',
                                    padding: '16px',
                                    maxHeight: '400px',
                                    overflowY: 'auto',
                                    fontFamily: 'Consolas, Monaco, monospace',
                                    fontSize: '12px',
                                    lineHeight: '1.5',
                                    color: '#e5e7eb',
                                    whiteSpace: 'pre-wrap'
                                }}>
                                    {adminLogs ? adminLogs : (
                                        <span style={{ color: '#6b7280', fontStyle: 'italic' }}>Tidak ada log untuk ditampilkan atau log kosong.</span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* TAB: ARTICLES MANAGER */}
                {activeTab === 'articles' && currentUser?.role === 'admin' && (
                    <AdminArticlesManager
                        adminArticles={adminArticles}
                        isLoadingArticles={isLoadingArticles}
                        editingArticleId={editingArticleId}
                        setEditingArticleId={setEditingArticleId}
                        adminArticleForm={adminArticleForm}
                        setAdminArticleForm={setAdminArticleForm}
                        articleMsg={articleMsg}
                        setArticleMsg={setArticleMsg}
                        handleSaveArticle={handleCreateOrUpdateArticle}
                        handleDeleteArticle={handleDeleteArticle}
                        handleImageUpload={handleArticleImageUpload}
                        lpseInstances={lpseInstances}
                    />
                )}

                {activeTab === 'leads' && currentUser?.role === 'admin' && (
                    <AdminLeadsManager
                        leads={leads}
                        isLoadingLeads={isLoadingLeads}
                        fetchLeads={fetchLeads}
                        authFetch={authFetch}
                    />
                )}

                {activeTab === 'company-leads' && currentUser?.role === 'admin' && (
                    <CompanyLeadsManager token={userToken} />
                )}

                {/* TAB: IP PROXY MANAGER */}
                {activeTab === 'proxy' && currentUser?.role === 'admin' && (
                    <div>
                        <div className="header-dash" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                            <div className="header-title">
                                <h1>🌐 IP Proxy &amp; Anti-Block Manager</h1>
                                <p>Kelola saluran Proxy SPSE secara dinamis dan pelajari panduan lengkap mitigasi pembatasan IP.</p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: adminSettings.spse_proxy ? 'rgba(34, 197, 94, 0.12)' : 'rgba(148, 163, 184, 0.12)', border: `1px solid ${adminSettings.spse_proxy ? 'rgba(34, 197, 94, 0.3)' : 'rgba(148, 163, 184, 0.2)'}`, padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', color: adminSettings.spse_proxy ? '#4ade80' : '#94a3b8' }}>
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: adminSettings.spse_proxy ? '#22c55e' : '#94a3b8', boxShadow: adminSettings.spse_proxy ? '0 0 8px #22c55e' : 'none' }} />
                                {adminSettings.spse_proxy ? 'PROXY AKTIF' : 'KONEKSI DIRECT (TANPA PROXY)'}
                            </div>
                        </div>

                        {/* 1. CONFIGURATION CARD */}
                        <div style={{ background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.8))', border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: '16px', padding: '24px', marginBottom: '32px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
                            <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '700', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>⚙️</span> Form Konfigurasi IP Proxy SPSE
                            </h3>
                            
                            <form onSubmit={(e) => handleSaveSettings(e, 'proxy')} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#cbd5e1', marginBottom: '8px' }}>
                                        Alamat IP Proxy (HTTP / HTTPS):
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Contoh: http://username:password@p.webshare.io:80 atau http://103.150.190.10:8080"
                                        value={adminSettings.spse_proxy || ''}
                                        onChange={e => setAdminSettings(p => ({ ...p, spse_proxy: e.target.value }))}
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            borderRadius: '10px',
                                            background: 'rgba(15, 23, 42, 0.6)',
                                            border: '1px solid rgba(99, 102, 241, 0.3)',
                                            color: '#ffffff',
                                            fontSize: '13px',
                                            fontFamily: 'monospace',
                                            outline: 'none',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px' }}>
                                        💡 Masukkan URL Proxy lengkap beserta port dan autentikasi (jika ada). Biarkan kosong jika ingin menggunakan koneksi langsung VPS.
                                    </div>
                                </div>

                                {proxySaveMsg && (
                                    <div style={{
                                        padding: '10px 14px',
                                        borderRadius: '8px',
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        background: proxySaveMsg.type === 'success' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                                        border: `1px solid ${proxySaveMsg.type === 'success' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                                        color: proxySaveMsg.type === 'success' ? '#4ade80' : '#f87171'
                                    }}>
                                        {proxySaveMsg.text}
                                    </div>
                                )}

                                {proxyTestResult && (
                                    <div style={{
                                        padding: '12px 16px',
                                        borderRadius: '10px',
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        background: proxyTestResult.type === 'success' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                                        border: `1px solid ${proxyTestResult.type === 'success' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                                        color: proxyTestResult.type === 'success' ? '#4ade80' : '#f87171',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}>
                                        <span>{proxyTestResult.type === 'success' ? '✅' : '❌'}</span>
                                        {proxyTestResult.text}
                                    </div>
                                )}

                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                                    <button
                                        type="submit"
                                        disabled={isSavingSettings}
                                        style={{
                                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                            color: '#ffffff',
                                            border: 'none',
                                            padding: '10px 20px',
                                            borderRadius: '10px',
                                            fontWeight: '700',
                                            fontSize: '13px',
                                            cursor: 'pointer',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}
                                    >
                                        <span>💾</span> {isSavingSettings ? 'Menyimpan...' : 'Simpan Konfigurasi Proxy'}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleTestProxy}
                                        disabled={isTestingProxy || !adminSettings.spse_proxy?.trim()}
                                        style={{
                                            background: 'rgba(99, 102, 241, 0.2)',
                                            color: '#a5b4fc',
                                            border: '1px solid rgba(99, 102, 241, 0.4)',
                                            padding: '10px 20px',
                                            borderRadius: '10px',
                                            fontWeight: '700',
                                            fontSize: '13px',
                                            cursor: (!isTestingProxy && adminSettings.spse_proxy?.trim()) ? 'pointer' : 'not-allowed',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}
                                    >
                                        <span>⚡</span> {isTestingProxy ? 'Menguji Koneksi...' : 'Uji Koneksi Proxy ke SPSE'}
                                    </button>

                                    {adminSettings.spse_proxy && (
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                setAdminSettings(p => ({ ...p, spse_proxy: '' }));
                                                setTimeout(() => handleSaveSettings(e, 'proxy'), 50);
                                            }}
                                            style={{
                                                background: 'transparent',
                                                color: '#f87171',
                                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                                padding: '10px 16px',
                                                borderRadius: '10px',
                                                fontWeight: '600',
                                                fontSize: '13px',
                                                cursor: 'pointer',
                                                marginLeft: 'auto'
                                            }}
                                        >
                                            Hapus Proxy (Direct)
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* 1.5 CRAWLING HEALTH & LOG MONITORING SECTION */}
                        <CrawlLogsHealthMonitor userToken={userToken} />

                        {/* 2. EDUCATIONAL & GUIDANCE SECTION */}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            
                            {/* Question Card */}
                            <div style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(217, 119, 6, 0.04))', border: '1px solid rgba(245, 158, 11, 0.35)', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(245, 158, 11, 0.05)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <span style={{ fontSize: '24px', background: 'rgba(245, 158, 11, 0.2)', width: '42px', height: '42px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>💡</span>
                                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#fbbf24', letterSpacing: '-0.01em' }}>
                                            Kapan Anda Perlu Membeli IP Proxy?
                                        </h3>
                                    </div>
                                    <span style={{ background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.3)', color: '#4ade80', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '800' }}>
                                        STATUS: SESUAI KEBUTUHAN
                                    </span>
                                </div>
                                <div style={{ fontSize: '14px', color: '#f1f5f9', lineHeight: '1.8', background: 'rgba(15, 23, 42, 0.6)', padding: '16px 20px', borderRadius: '12px', borderLeft: '4px solid #f59e0b' }}>
                                    <p style={{ margin: '0 0 8px', fontWeight: '700', color: '#fbbf24', fontSize: '15px' }}>
                                        Anda TIDAK PERLU membeli Proxy saat ini jika proses penarikan data (crawling) berjalan lancar.
                                    </p>
                                    <p style={{ margin: 0, color: '#cbd5e1' }}>
                                        Penggunaan Proxy baru dibutuhkan apabila di masa mendatang terdapat portal LPSE instansi tertentu yang membatasi atau memblokir alamat IP VPS utama Anda. Selama penarikan data 24/7 berlangsung normal tanpa kendala, Anda tidak perlu mengeluarkan biaya tambahan untuk sewa proxy.
                                    </p>
                                </div>
                            </div>

                            {/* 2 Types of Proxy */}
                            <div>
                                <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '700', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span>🌐</span> 2 Jenis Proxy untuk Web Scraping &amp; Pemantauan LPSE
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
                                    {/* Datacenter Proxy */}
                                    <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '14px', padding: '18px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                                            <h4 style={{ margin: 0, color: '#60a5fa', fontSize: '15px', fontWeight: '700' }}>Datacenter Proxy</h4>
                                            <span style={{ fontSize: '11px', background: 'rgba(59, 130, 246, 0.2)', color: '#93c5fd', padding: '2px 8px', borderRadius: '12px', fontWeight: '700' }}>Murah &amp; Cepat</span>
                                        </div>
                                        <p style={{ margin: '0 0 12px', fontSize: '13px', color: '#cbd5e1', lineHeight: '1.6' }}>
                                            IP yang berasal dari server datacenter.
                                        </p>
                                        <div style={{ fontSize: '12px', color: '#94a3b8', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '8px' }}>
                                            <div>💰 <strong>Harga:</strong> Sangat murah (~$1 s.d. $2 USD / bulan per IP = Rp 15.000 – Rp 30.000 / bulan).</div>
                                            <div style={{ marginTop: '4px' }}>⚡ <strong>Kelebihan:</strong> Kecepatan response sangat tinggi.</div>
                                        </div>
                                    </div>

                                    {/* Residential Proxy */}
                                    <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: '14px', padding: '18px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                                            <h4 style={{ margin: 0, color: '#c084fc', fontSize: '15px', fontWeight: '700' }}>Residential Proxy</h4>
                                            <span style={{ fontSize: '11px', background: 'rgba(168, 85, 247, 0.2)', color: '#e9d5ff', padding: '2px 8px', borderRadius: '12px', fontWeight: '700' }}>Anti-Block &amp; Kuat</span>
                                        </div>
                                        <p style={{ margin: '0 0 12px', fontSize: '13px', color: '#cbd5e1', lineHeight: '1.6' }}>
                                            IP asli jaringan rumah (seperti Indihome/Biznet/Telkomsel).
                                        </p>
                                        <div style={{ fontSize: '12px', color: '#94a3b8', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '8px' }}>
                                            <div>💰 <strong>Harga:</strong> Berbasis kuota bandwidth (contoh: $5 USD / GB).</div>
                                            <div style={{ marginTop: '4px' }}>🛡️ <strong>Kelebihan:</strong> Mustahil diblokir oleh Cloudflare/LPSE karena dianggap sebagai lalu lintas pengguna biasa di rumah.</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Providers & Purchase Steps */}
                            <div>
                                <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '700', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span>🛒</span> Rekomendasi Tempat Membeli IP Proxy &amp; Cara Belinya
                                </h3>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                    {/* Option 1: Webshare */}
                                    <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: '14px', padding: '20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                                            <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#4ade80' }}>
                                                Pilihan 1: Webshare.io (Paling Populer, Mudah, &amp; Murah - RECOMMENDED)
                                            </h4>
                                            <a href="https://www.webshare.io" target="_blank" rel="noreferrer" style={{ fontSize: '12px', color: '#4ade80', background: 'rgba(34, 197, 94, 0.15)', padding: '4px 12px', borderRadius: '8px', textDecoration: 'none', fontWeight: '700' }}>
                                                Kunjungi Webshare.io ↗
                                            </a>
                                        </div>
                                        <p style={{ fontSize: '13px', color: '#cbd5e1', margin: '0 0 12px', lineHeight: '1.6' }}>
                                            Webshare adalah penyedia proxy paling populer untuk developer karena harganya yang murah dan kemudahan integrasinya.
                                        </p>
                                        <div style={{ fontSize: '13px', color: '#e2e8f0', background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '10px', lineHeight: '1.7' }}>
                                            <strong>Cara Membeli di Webshare:</strong>
                                            <ol style={{ margin: '8px 0 0', paddingLeft: '20px' }}>
                                                <li>Buka situs <a href="https://www.webshare.io" target="_blank" rel="noreferrer" style={{ color: '#60a5fa' }}>https://www.webshare.io</a> dan daftar akun gratis.</li>
                                                <li>Masuk ke menu <strong>Proxy -&gt; Purchase</strong>.</li>
                                                <li>Pilih jenis: <strong>Dedicated Proxy</strong> atau <strong>Private Proxy</strong> (pilih lokasi server terdekat seperti Singapore/Asia atau Indonesia).</li>
                                                <li>Lakukan pembayaran (bisa menggunakan kartu kredit/debit online / Jenius / PayPal).</li>
                                                <li>Setelah sukses, masuk ke halaman <strong>Proxy List</strong>. Anda akan mendapatkan detail URL Proxy dengan format:</li>
                                            </ol>
                                            <div style={{ background: '#090d16', color: '#a5b4fc', padding: '8px 12px', borderRadius: '6px', fontFamily: 'monospace', fontSize: '12px', margin: '8px 0' }}>
                                                http://username:password@p.webshare.io:80
                                            </div>
                                            <div>Salin URL Proxy tersebut, lalu buka Dasbor Super Admin Spy SPSE -&gt; IP Proxy &amp; Anti-Block, dan paste ke kolom SPSE Proxy, lalu klik <strong>Simpan Konfigurasi Proxy</strong>!</div>
                                        </div>
                                    </div>

                                    {/* Option 2: Proxy6 */}
                                    <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '14px', padding: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                                            <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#fbbf24' }}>
                                                Pilihan 2: Proxy6.net (Bisa Beli Eceran 1 IP / Murah)
                                            </h4>
                                            <a href="https://proxy6.net" target="_blank" rel="noreferrer" style={{ fontSize: '12px', color: '#fbbf24', textDecoration: 'none', fontWeight: '700' }}>
                                                Buka Proxy6.net ↗
                                            </a>
                                        </div>
                                        <div style={{ fontSize: '13px', color: '#cbd5e1' }}>
                                            <strong>Situs:</strong> <a href="https://proxy6.net" target="_blank" rel="noreferrer" style={{ color: '#fbbf24' }}>https://proxy6.net</a><br />
                                            <strong>Harga:</strong> ~$1.5 USD per IP per bulan.<br />
                                            <strong>Kelebihan:</strong> Bebas memilih IP khusus negara tertentu (termasuk Indonesia / Singapore) secara eceran per 1 IP.
                                        </div>
                                    </div>

                                    {/* Option 4: Local Indonesia Rupiah Providers */}
                                    <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(236, 72, 153, 0.35)', borderRadius: '14px', padding: '20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                                            <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#f472b6' }}>
                                                🇮🇩 Daftar Penyedia Proxy &amp; IP Lokal Indonesia (Bayar Rupiah / QRIS / Transfer Bank)
                                            </h4>
                                            <span style={{ fontSize: '11px', background: 'rgba(236, 72, 153, 0.2)', color: '#fbcfe8', padding: '2px 10px', borderRadius: '12px', fontWeight: '700' }}>4 OPSI LOKAL</span>
                                        </div>
                                        <p style={{ margin: '0 0 14px', fontSize: '13px', color: '#cbd5e1', lineHeight: '1.6' }}>
                                            Bagi pengguna di Indonesia yang ingin pembayaran menggunakan <strong>Rupiah (IDR)</strong> via QRIS, Transfer Bank BCA/Mandiri/BRI, atau E-Wallet (GoPay/OVO/Dana), berikut 4 penyedia terbaik:
                                        </p>
                                        
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            {/* Local 1 */}
                                            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '10px', fontSize: '13px', color: '#e2e8f0', lineHeight: '1.7' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                                    <strong style={{ color: '#f472b6' }}>1. IDCloudHost (Dedicated / Floating IP Jakarta)</strong>
                                                    <a href="https://idcloudhost.com" target="_blank" rel="noreferrer" style={{ fontSize: '11px', color: '#f472b6', textDecoration: 'none', background: 'rgba(236,72,153,0.15)', padding: '2px 8px', borderRadius: '6px', fontWeight: '700' }}>idcloudhost.com ↗</a>
                                                </div>
                                                <div>• <strong>Harga:</strong> Rp 35.000 – Rp 100.000 / bulan.</div>
                                                <div>• <strong>Pembayaran:</strong> QRIS, Transfer Bank BCA/Mandiri/BRI, GoPay.</div>
                                                <div>• <strong>Cara Beli:</strong> Console -&gt; Billing -&gt; Add Floating IP Jakarta -&gt; Bayar QRIS -&gt; Ambil IP &amp; Port di Console.</div>
                                            </div>

                                            {/* Local 2 */}
                                            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '10px', fontSize: '13px', color: '#e2e8f0', lineHeight: '1.7' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                                    <strong style={{ color: '#60a5fa' }}>2. Biznet GIO (NEO Floating IP Indonesia)</strong>
                                                    <a href="https://www.biznetgio.com" target="_blank" rel="noreferrer" style={{ fontSize: '11px', color: '#60a5fa', textDecoration: 'none', background: 'rgba(96,165,250,0.15)', padding: '2px 8px', borderRadius: '6px', fontWeight: '700' }}>biznetgio.com ↗</a>
                                                </div>
                                                <div>• <strong>Harga:</strong> Rp 50.000 – Rp 120.000 / bulan.</div>
                                                <div>• <strong>Pembayaran:</strong> QRIS, Credit Card Lokal, Virtual Account Bank.</div>
                                                <div>• <strong>Cara Beli:</strong> Portal NEO -&gt; Network -&gt; Create Floating IP -&gt; Pilih Datacenter Jakarta -&gt; Bayar.</div>
                                            </div>

                                            {/* Local 3 */}
                                            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '10px', fontSize: '13px', color: '#e2e8f0', lineHeight: '1.7' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                                    <strong style={{ color: '#fbbf24' }}>3. DomaiNesia / Niagahoster (Dedicated IP Add-on)</strong>
                                                    <a href="https://www.domainesia.com" target="_blank" rel="noreferrer" style={{ fontSize: '11px', color: '#fbbf24', textDecoration: 'none', background: 'rgba(251,191,36,0.15)', padding: '2px 8px', borderRadius: '6px', fontWeight: '700' }}>domainesia.com ↗</a>
                                                </div>
                                                <div>• <strong>Harga:</strong> Rp 45.000 / bulan.</div>
                                                <div>• <strong>Pembayaran:</strong> QRIS, Indomaret/Alfamart, Transfer Bank.</div>
                                                <div>• <strong>Cara Beli:</strong> MyDomaiNesia -&gt; Addon IP Dedicated Indonesia -&gt; Bayar -&gt; Salin IP.</div>
                                            </div>

                                            {/* Local 4 */}
                                            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '10px', fontSize: '13px', color: '#e2e8f0', lineHeight: '1.7' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                                    <strong style={{ color: '#4ade80' }}>4. Smartproxy ID Pool / IndoProxy (Residential IP Indonesia)</strong>
                                                    <a href="https://smartproxy.com" target="_blank" rel="noreferrer" style={{ fontSize: '11px', color: '#4ade80', textDecoration: 'none', background: 'rgba(74,222,128,0.15)', padding: '2px 8px', borderRadius: '6px', fontWeight: '700' }}>smartproxy.com ↗</a>
                                                </div>
                                                <div>• <strong>Harga:</strong> Berbasis kuota (IDR / Rupiah via DOKU / Midtrans).</div>
                                                <div>• <strong>Kelebihan:</strong> Menggunakan jaringan IP Residential asli Indonesia (Indihome / Telkomsel / Biznet).</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Option 3: Smartproxy */}
                                    <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '14px', padding: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                                            <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#818cf8' }}>
                                                Pilihan 3: Smartproxy / Bright Data (Untuk Skala Enterprise)
                                            </h4>
                                            <a href="https://smartproxy.com" target="_blank" rel="noreferrer" style={{ fontSize: '12px', color: '#818cf8', textDecoration: 'none', fontWeight: '700' }}>
                                                Buka Smartproxy ↗
                                            </a>
                                        </div>
                                        <div style={{ fontSize: '13px', color: '#cbd5e1' }}>
                                            <strong>Situs:</strong> <a href="https://smartproxy.com" target="_blank" rel="noreferrer" style={{ color: '#818cf8' }}>https://smartproxy.com</a><br />
                                            <strong>Kelebihan:</strong> Menyediakan jutaan IP Residential berotasi otomatis (Rotating Residential Proxies) jika Anda memantau ribuan LPSE sekaligus di skala besar.
                                        </div>
                                    </div>

                                    {/* Option 5: Self-Hosted Rotating Proxy (Solusi Mandiri Rp 0 / Murah) */}
                                    <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(34, 197, 94, 0.35)', borderRadius: '14px', padding: '20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                                            <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#4ade80' }}>
                                                🛠️ Solusi Mandiri: 3 Cara Membuat Rotating Proxy Sendiri (Tanpa Berlangganan Proxy)
                                            </h4>
                                            <span style={{ fontSize: '11px', background: 'rgba(34, 197, 94, 0.2)', color: '#86efac', padding: '2px 10px', borderRadius: '12px', fontWeight: '700' }}>SOLUSI GRATIS / MURAH</span>
                                        </div>
                                        <p style={{ margin: '0 0 14px', fontSize: '13px', color: '#cbd5e1', lineHeight: '1.6' }}>
                                            Jika Anda memiliki keahlian teknis dan tidak ingin berlangganan proxy komersial bulanan, Anda bisa menerapkan 3 metode racikan mandiri berikut:
                                        </p>
                                        
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            {/* Method 1 */}
                                            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '10px', fontSize: '13px', color: '#e2e8f0', lineHeight: '1.7' }}>
                                                <div style={{ fontWeight: '700', color: '#4ade80', marginBottom: '4px' }}>
                                                    ⚡ 1. AWS Lambda / Cloud Functions Proxy Relay (IP Berubah Tiap Request - Gratis Tier)
                                                </div>
                                                <div style={{ color: '#94a3b8', fontSize: '12px' }}>
                                                    Deploy script Python/Node sederhana di AWS Lambda. Setiap kali crawler melakukan fetch via Gateway Lambda, AWS memberikan outgoing public IP baru yang berbeda-beda secara otomatis. Gratis hingga 1.000.000 request/bulan!
                                                </div>
                                            </div>

                                            {/* Method 2 */}
                                            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '10px', fontSize: '13px', color: '#e2e8f0', lineHeight: '1.7' }}>
                                                <div style={{ fontWeight: '700', color: '#60a5fa', marginBottom: '4px' }}>
                                                    📱 2. Modem 4G USB LTE Dongle (True Mobile Residential IP Indonesia)
                                                </div>
                                                <div style={{ color: '#94a3b8', fontSize: '12px' }}>
                                                    Pasang modem USB 4G (Telkomsel/Indosat) di server lokal. Script Python dapat mengirim perintah AT (Airplane Mode On/Off) setiap 1-2 menit untuk mendapatkan IP Mobile Indonesia yang 100% baru via CGNAT operator seluler. Ampuh melewati pemblokiran LPSE mana pun.
                                                </div>
                                            </div>

                                            {/* Method 3 */}
                                            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '10px', fontSize: '13px', color: '#e2e8f0', lineHeight: '1.7' }}>
                                                <div style={{ fontWeight: '700', color: '#a78bfa', marginBottom: '4px' }}>
                                                    🧅 3. Tor Network SOCKS5 Proxy Circuit Rotation (Automated NEWNYM Signal)
                                                </div>
                                                <div style={{ color: '#94a3b8', fontSize: '12px' }}>
                                                    Jalankan daemon <code>tor</code> di VPS (SOCKS5 <code>127.0.0.1:9050</code>). Kirim perintah <code>NEWNYM</code> via Tor Control Port (9051) setiap kali ingin mengganti circuit exit IP secara gratis &amp; otomatis.
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            {/* Example Formats */}
                            <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(148, 163, 184, 0.2)', borderRadius: '14px', padding: '20px' }}>
                                <h3 style={{ margin: '0 0 12px', fontSize: '15px', fontWeight: '700', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span>📋</span> Contoh Format Input Proxy di Dasbor Admin Spy SPSE
                                </h3>
                                <p style={{ margin: '0 0 12px', fontSize: '13px', color: '#cbd5e1' }}>
                                    Di halaman Super Admin, Anda cukup memasukkan URL Proxy dalam salah satu format berikut:
                                </p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px' }}>
                                        <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>🔒 <strong>Proxy dengan Username &amp; Password (Umum):</strong></div>
                                        <code style={{ color: '#4ade80', fontSize: '13px', fontFamily: 'monospace' }}>http://user123:pass456@103.150.190.10:8080</code>
                                    </div>
                                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px' }}>
                                        <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>🔓 <strong>Proxy Tanpa Autentikasi (IP Whitelist):</strong></div>
                                        <code style={{ color: '#60a5fa', fontSize: '13px', fontFamily: 'monospace' }}>http://103.150.190.10:8080</code>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                )}

                {/* TAB: PUBLIC BLOG */}
                {activeTab === 'blog' && (
                    <PublicBlogPage
                        adminSettings={adminSettings}
                        publicArticles={publicArticles}
                        isLoadingArticles={isLoadingArticles}
                        onNavigate={handlePublicNavigate}
                        userToken={userToken}
                    />
                )}

                {/* TAB: PUBLIC ARTICLE DETAIL */}
                {activeTab === 'article-detail' && (
                    <PublicArticleDetailPage
                        adminSettings={adminSettings}
                        selectedArticle={selectedArticle}
                        selectedArticleLpseSlug={selectedArticleLpseSlug}
                        lpseInstances={lpseInstances}
                        isLoadingArticles={isLoadingArticles}
                        onNavigate={handlePublicNavigate}
                        userToken={userToken}
                    />
                )}

                {/* TAB: COMPETITOR LIST / SEARCH */}
                {activeTab === 'competitors' && (
                    <div>
                        <div className="header-dash">
                            <div className="header-title">
                                <h1>Analisis Perusahaan &amp; Kompetitor</h1>
                                <p>Cari profil badan usaha peserta lelang, pantau track record penawaran, tingkat kemenangan, dan competitor maps</p>
                            </div>
                        </div>

                        <div className="panel" style={{ maxWidth: '800px', margin: '0 auto' }}>
                            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                                <span style={{ fontSize: '64px', display: 'block', marginBottom: '20px' }}>🔍</span>
                                <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '24px', fontWeight: '800', marginBottom: '8px', color: '#fff' }}>Cari Profil Kompetitor</h2>
                                <p style={{ color: '#9ca3af', marginBottom: '30px', fontSize: '14px' }}>Masukkan nama perusahaan atau NPWP kompetitor untuk melihat analisis detail</p>

                                <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Contoh: PT. Global Teknologi, CV. Digital Solusindo..."
                                        value={competitorSearch}
                                        onChange={(e) => {
                                            setCompetitorSearch(e.target.value);
                                            fetchCompetitorSuggestions(e.target.value);
                                        }}
                                        style={{ padding: '16px 20px', borderRadius: '12px', fontSize: '16px', background: 'rgba(15,23,42,0.8)', borderColor: 'rgba(255,255,255,0.1)' }}
                                    />
                                    {competitorSuggestions.length > 0 && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '100%',
                                            left: 0,
                                            right: 0,
                                            background: '#0f1322',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '12px',
                                            marginTop: '8px',
                                            zIndex: 10,
                                            textAlign: 'left',
                                            boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                                            maxHeight: '300px',
                                            overflowY: 'auto'
                                        }}>
                                            {competitorSuggestions.map((name, idx) => (
                                                <div
                                                    key={idx}
                                                    onClick={() => {
                                                        setCompetitorSearch(name);
                                                        setCompetitorSuggestions([]);
                                                        handleOpenCompetitorProfile(name);
                                                    }}
                                                    style={{
                                                        padding: '12px 16px',
                                                        cursor: 'pointer',
                                                        borderBottom: idx === competitorSuggestions.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.05)',
                                                        color: '#fff',
                                                        fontSize: '14px',
                                                        transition: 'background 0.2s'
                                                    }}
                                                    onMouseEnter={(e) => e.target.style.background = 'rgba(99,102,241,0.1)'}
                                                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                                                >
                                                    🏢 {name}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB: COMPETITOR PROFILE DASHBOARD */}
                {activeTab === 'competitor-profile' && (
                    <div>
                        <div className="header-dash">
                            <div className="header-title" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <button
                                    onClick={() => setActiveTab('competitors')}
                                    className="form-control"
                                    style={{ width: 'auto', padding: '8px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}
                                >
                                    ← Kembali
                                </button>
                                <div>
                                    <h1>Profil Kompetitor &amp; Badan Usaha</h1>
                                    <p>Aggregated statistics &amp; track record lelang perusahaan di LPSE</p>
                                </div>
                            </div>
                        </div>

                        {isLoadingCompetitor ? (
                            <div style={{ textAlign: 'center', padding: '80px', color: '#9ca3af' }}>
                                <div className="spinner" style={{ width: '36px', height: '36px', borderWidth: '4px', marginBottom: '16px' }}></div>
                                <p>Mengompilasi data analitik kompetitor...</p>
                            </div>
                        ) : competitorProfile ? (
                            <div>
                                {/* Competitor Header */}
                                <div className="panel" style={{ marginBottom: '24px', background: 'linear-gradient(135deg, rgba(20,27,48,0.7), rgba(15,19,34,0.7))', borderLeft: '4px solid var(--color-primary)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                                        <div>
                                            <span style={{ fontSize: '12px', background: 'rgba(99,102,241,0.12)', color: '#818cf8', padding: '4px 10px', borderRadius: '4px', fontWeight: 'bold' }}>COMPETITOR PROFILE</span>
                                            <h2 style={{ fontSize: '26px', color: '#fff', marginTop: '8px', fontFamily: 'Outfit, sans-serif' }}>{competitorProfile.name}</h2>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '12px', fontSize: '13px', color: '#9ca3af' }}>
                                                <div>💳 NPWP: <strong style={{ color: '#fff' }}>{competitorProfile.npwp || '-'}</strong></div>
                                                <div>📍 Alamat: <strong style={{ color: '#fff' }}>{competitorProfile.address || '-'}</strong></div>
                                            </div>
                                        </div>

                                        <div style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)', padding: '16px 24px', borderRadius: '12px', textAlign: 'center' }}>
                                            <div style={{ fontSize: '11px', color: '#fbbf24', fontWeight: 'bold', textTransform: 'uppercase' }}>Win Success Rate</div>
                                            <div style={{ fontSize: '36px', fontWeight: '900', color: '#fbbf24', marginTop: '4px', fontFamily: 'Outfit, sans-serif' }}>{competitorProfile.win_rate}%</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Sub-tab Navigation */}
                                <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
                                    <button
                                        onClick={() => setCompetitorSubTab('overview')}
                                        style={{
                                            padding: '10px 20px',
                                            borderRadius: '8px',
                                            border: 'none',
                                            background: competitorSubTab === 'overview' ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'rgba(255,255,255,0.05)',
                                            color: '#fff',
                                            fontWeight: 'bold',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        📊 Ringkasan Profil
                                    </button>
                                    <button
                                        onClick={() => setCompetitorSubTab('disqualifications')}
                                        style={{
                                            padding: '10px 20px',
                                            borderRadius: '8px',
                                            border: 'none',
                                            background: competitorSubTab === 'disqualifications' ? 'linear-gradient(135deg, #ef4444, #b91c1c)' : 'rgba(255,255,255,0.05)',
                                            color: '#fff',
                                            fontWeight: 'bold',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}
                                    >
                                        ❌ Analisis Keguguran
                                        {competitorDisqualifications && competitorDisqualifications.total_disqualified > 0 && (
                                            <span style={{ background: '#fff', color: '#ef4444', fontSize: '11px', padding: '2px 6px', borderRadius: '10px', fontWeight: 'bold' }}>
                                                {competitorDisqualifications.total_disqualified}
                                            </span>
                                        )}
                                    </button>
                                </div>

                                {competitorSubTab === 'overview' ? (
                                    <>
                                        {/* Statistical Counters */}
                                        <div className="stats-grid" style={{ marginBottom: '24px' }}>
                                            <div className="card-stat primary">
                                                <span className="title">Tender Diikuti</span>
                                                <span className="value">{competitorProfile.total_tenders} lelang</span>
                                                <span className="desc">Total partisipasi di LPSE</span>
                                            </div>
                                            <div className="card-stat success">
                                                <span className="title">Tender Dimenangkan</span>
                                                <span className="value">{competitorProfile.total_wins} lelang</span>
                                                <span className="desc">Telah terbit kontrak pemenang</span>
                                            </div>
                                            <div className="card-stat info">
                                                <span className="title">Total Pagu Diikuti</span>
                                                <span className="value">{formatPaguVal(competitorProfile.total_pagu)}</span>
                                                <span className="desc">Akumulasi pagu proyek</span>
                                            </div>
                                            <div className="card-stat warning">
                                                <span className="title">Total Nilai Kontrak</span>
                                                <span className="value" style={{ color: '#fbbf24' }}>{formatPaguVal(competitorProfile.total_contract_value)}</span>
                                                <span className="desc">Akumulasi nilai kontrak dimenangkan</span>
                                            </div>
                                        </div>

                                        <div className="dash-layout" style={{ marginBottom: '24px' }}>
                                            {/* Monthly Trend Bar Chart */}
                                            <div className="panel">
                                                <div className="panel-header">
                                                    <h3 className="panel-title">📅 Tren Partisipasi Lelang (12 Bulan Terakhir)</h3>
                                                </div>
                                                {competitorProfile.monthly_trend && competitorProfile.monthly_trend.length > 0 ? (
                                                    <div>
                                                        <div style={{ display: 'flex', alignItems: 'flex-end', height: '240px', gap: '16px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '12px' }}>
                                                            {competitorProfile.monthly_trend.map((m, idx) => {
                                                                const maxVal = Math.max(...competitorProfile.monthly_trend.map(item => item.followed)) || 1;
                                                                const followedHeight = `${(m.followed / maxVal) * 100}%`;
                                                                const wonHeight = `${(m.won / maxVal) * 100}%`;

                                                                return (
                                                                    <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'flex-end', alignItems: 'center' }}>
                                                                        <div style={{ display: 'flex', gap: '4px', width: '100%', height: '80%', alignItems: 'flex-end', justifyContent: 'center' }}>
                                                                            {/* Followed Bar */}
                                                                            <div
                                                                                style={{ width: '8px', height: followedHeight, background: 'linear-gradient(to top, #6366f1, #818cf8)', borderRadius: '2px 2px 0 0', position: 'relative' }}
                                                                                title={`Diikuti: ${m.followed}`}
                                                                            />
                                                                            {/* Won Bar */}
                                                                            <div
                                                                                style={{ width: '8px', height: wonHeight, background: 'linear-gradient(to top, #10b981, #34d399)', borderRadius: '2px 2px 0 0', position: 'relative' }}
                                                                                title={`Menang: ${m.won}`}
                                                                            />
                                                                        </div>
                                                                        <span style={{ fontSize: '10px', color: '#9ca3af', marginTop: '8px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                                                                            {m.month}
                                                                        </span>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '16px', fontSize: '12px' }}>
                                                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#818cf8' }}><span style={{ width: '10px', height: '10px', background: '#6366f1', borderRadius: '2px' }}></span> Diikuti</span>
                                                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399' }}><span style={{ width: '10px', height: '10px', background: '#10b981', borderRadius: '2px' }}></span> Menang</span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p style={{ color: '#6b7280', fontStyle: 'italic', textAlign: 'center', padding: '40px 0' }}>Tidak ada data tren partisipasi bulanan.</p>
                                                )}
                                            </div>

                                            {/* Top Competitors Maps */}
                                            <div className="panel">
                                                <div className="panel-header">
                                                    <h3 className="panel-title">🎯 Peta Kompetitor Utama (Head-to-Head)</h3>
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                                    {competitorProfile.top_competitors && competitorProfile.top_competitors.length > 0 ? (
                                                        competitorProfile.top_competitors.map((comp, idx) => (
                                                            <div
                                                                key={idx}
                                                                style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.04)' }}
                                                            >
                                                                <span style={{ fontSize: '20px' }}>🏢</span>
                                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                                    <div
                                                                        onClick={() => handleOpenCompetitorProfile(comp.name)}
                                                                        style={{ fontWeight: 'bold', color: '#fff', fontSize: '13px', cursor: 'pointer', textDecoration: 'underline', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                                                                        title="Klik untuk beralih to profil kompetitor ini"
                                                                    >
                                                                        {comp.name}
                                                                    </div>
                                                                    <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>NPWP: {comp.npwp}</div>
                                                                    <div style={{ display: 'flex', gap: '8px', fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>
                                                                        <span>Partisipasi: {comp.followed}</span>
                                                                        <span>Menang: {comp.wins}</span>
                                                                    </div>
                                                                </div>
                                                                <div style={{ textAlign: 'right' }}>
                                                                    <span style={{ fontSize: '11px', color: '#fbbf24', background: 'rgba(251,191,36,0.1)', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                                                                        {comp.match_count}x Bentrok
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <p style={{ color: '#6b7280', fontStyle: 'italic', textAlign: 'center', padding: '20px 0' }}>Tidak ada kompetitor head-to-head.</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Recent Tenders Followed */}
                                        <div className="panel">
                                            <div className="panel-header">
                                                <h3 className="panel-title">📋 Riwayat Tender Diikuti</h3>
                                            </div>
                                            <div className="table-wrapper">
                                                <table className="tender-table">
                                                    <thead>
                                                        <tr>
                                                            <th>Nomor Pengadaan</th>
                                                            <th>Nama Paket Tender</th>
                                                            <th>K/L/Pemda/Instansi</th>
                                                            <th>Pagu</th>
                                                            <th>Hasil</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {competitorProfile.recent_tenders && competitorProfile.recent_tenders.length > 0 ? (
                                                            competitorProfile.recent_tenders.map((tender, idx) => (
                                                                <tr key={idx} onClick={() => handleViewTenderDetail(tender.nomor_pengadaan)}>
                                                                    <td><strong>{tender.nomor_pengadaan}</strong></td>
                                                                    <td>
                                                                        {renderTenderTitle(tender.nama_tender)}
                                                                    </td>
                                                                    <td>{tender.instansi}</td>
                                                                    <td style={{ color: '#fbbf24', fontWeight: 'bold' }}>{tender.pagu}</td>
                                                                    <td>
                                                                        {tender.is_winner === 1 ? (
                                                                            <span style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid rgba(16,185,129,0.25)', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>MENANG</span>
                                                                        ) : (
                                                                            <span style={{ background: 'rgba(255,255,255,0.05)', color: '#9ca3af', border: '1px solid rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px', fontSize: '11px' }}>TERDAFTAR</span>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td colSpan="5" style={{ textAlign: 'center', color: '#6b7280', padding: '20px' }}>Tidak ada riwayat tender.</td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div>
                                        {isLoadingDisqualifications ? (
                                            <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
                                                <div className="spinner" style={{ width: '24px', height: '24px', borderWidth: '3px', marginBottom: '12px', marginLeft: 'auto', marginRight: 'auto' }}></div>
                                                <p>Mengambil data keguguran kompetitor...</p>
                                            </div>
                                        ) : competitorDisqualifications ? (
                                            <div>
                                                {/* KPI Cards for Disqualifications */}
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                                                    <div style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.15)', padding: '20px', borderRadius: '12px' }}>
                                                        <div style={{ fontSize: '12px', color: '#f87171', textTransform: 'uppercase', fontWeight: 'bold' }}>Total Gugur</div>
                                                        <div style={{ fontSize: '32px', fontWeight: '800', color: '#ef4444', marginTop: '6px', fontFamily: 'Outfit, sans-serif' }}>
                                                            {competitorDisqualifications.total_disqualified} <span style={{ fontSize: '14px', color: '#9ca3af', fontWeight: 'normal' }}>lelang</span>
                                                        </div>
                                                    </div>

                                                    <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', padding: '20px', borderRadius: '12px' }}>
                                                        <div style={{ fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 'bold' }}>Tingkat Gugur</div>
                                                        <div style={{ fontSize: '32px', fontWeight: '800', color: '#fff', marginTop: '6px', fontFamily: 'Outfit, sans-serif' }}>
                                                            {competitorProfile.total_tenders > 0 ? Math.round((competitorDisqualifications.total_disqualified / competitorProfile.total_tenders) * 100) : 0}%
                                                        </div>
                                                    </div>

                                                    <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', padding: '20px', borderRadius: '12px' }}>
                                                        <div style={{ fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 'bold' }}>Terbanyak Gugur Pada</div>
                                                        <div style={{ fontSize: '20px', fontWeight: '800', color: '#fbbf24', marginTop: '16px', fontFamily: 'Outfit, sans-serif' }}>
                                                            {(() => {
                                                                const stages = competitorDisqualifications.disqualified_stages;
                                                                const maxVal = Math.max(stages.administrasi, stages.teknis, stages.harga, stages.kualifikasi);
                                                                if (maxVal === 0) return '-';
                                                                if (maxVal === stages.teknis) return 'Teknis 🛠️';
                                                                if (maxVal === stages.administrasi) return 'Administrasi 📄';
                                                                if (maxVal === stages.harga) return 'Harga 💰';
                                                                return 'Kualifikasi 🔍';
                                                            })()}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Breakdown Bar Charts / Progress Lines */}
                                                <div className="panel" style={{ marginBottom: '24px' }}>
                                                    <div className="panel-header">
                                                        <h3 className="panel-title">📊 Distribusi Tahap Gugur Kompetitor</h3>
                                                    </div>

                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                                        {/* Administrasi */}
                                                        <div>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                                                                <span style={{ color: '#d1d5db', fontWeight: '600' }}>📄 Tahap Administrasi</span>
                                                                <span style={{ color: '#9ca3af' }}>{competitorDisqualifications.disqualified_stages.administrasi} Kali</span>
                                                            </div>
                                                            <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                                                                <div style={{
                                                                    height: '100%',
                                                                    background: 'linear-gradient(90deg, #6366f1, #818cf8)',
                                                                    width: `${competitorDisqualifications.total_disqualified > 0 ? (competitorDisqualifications.disqualified_stages.administrasi / competitorDisqualifications.total_disqualified) * 100 : 0}%`,
                                                                    transition: 'width 0.5s'
                                                                }}></div>
                                                            </div>
                                                        </div>

                                                        {/* Teknis */}
                                                        <div>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                                                                <span style={{ color: '#d1d5db', fontWeight: '600' }}>🛠️ Tahap Teknis</span>
                                                                <span style={{ color: '#9ca3af' }}>{competitorDisqualifications.disqualified_stages.teknis} Kali</span>
                                                            </div>
                                                            <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                                                                <div style={{
                                                                    height: '100%',
                                                                    background: 'linear-gradient(90deg, #fbbf24, #f59e0b)',
                                                                    width: `${competitorDisqualifications.total_disqualified > 0 ? (competitorDisqualifications.disqualified_stages.teknis / competitorDisqualifications.total_disqualified) * 100 : 0}%`,
                                                                    transition: 'width 0.5s'
                                                                }}></div>
                                                            </div>
                                                        </div>

                                                        {/* Harga */}
                                                        <div>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                                                                <span style={{ color: '#d1d5db', fontWeight: '600' }}>💰 Tahap Harga &amp; Koreksi</span>
                                                                <span style={{ color: '#9ca3af' }}>{competitorDisqualifications.disqualified_stages.harga} Kali</span>
                                                            </div>
                                                            <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                                                                <div style={{
                                                                    height: '100%',
                                                                    background: 'linear-gradient(90deg, #10b981, #34d399)',
                                                                    width: `${competitorDisqualifications.total_disqualified > 0 ? (competitorDisqualifications.disqualified_stages.harga / competitorDisqualifications.total_disqualified) * 100 : 0}%`,
                                                                    transition: 'width 0.5s'
                                                                }}></div>
                                                            </div>
                                                        </div>

                                                        {/* Kualifikasi */}
                                                        <div>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                                                                <span style={{ color: '#d1d5db', fontWeight: '600' }}>🔍 Tahap Kualifikasi</span>
                                                                <span style={{ color: '#9ca3af' }}>{competitorDisqualifications.disqualified_stages.kualifikasi} Kali</span>
                                                            </div>
                                                            <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                                                                <div style={{
                                                                    height: '100%',
                                                                    background: 'linear-gradient(90deg, #a855f7, #c084fc)',
                                                                    width: `${competitorDisqualifications.total_disqualified > 0 ? (competitorDisqualifications.disqualified_stages.kualifikasi / competitorDisqualifications.total_disqualified) * 100 : 0}%`,
                                                                    transition: 'width 0.5s'
                                                                }}></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* List of Disqualification Items */}
                                                <div className="panel">
                                                    <div className="panel-header">
                                                        <h3 className="panel-title">📋 Riwayat Keguguran &amp; Alasan Pokja</h3>
                                                    </div>

                                                    {!competitorDisqualifications.is_premium && (
                                                        <div style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)', padding: '16px', borderRadius: '10px', marginBottom: '20px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                                                            <span style={{ fontSize: '24px' }}>🔒</span>
                                                            <div style={{ fontSize: '13px', color: '#fbbf24', lineHeight: '1.5' }}>
                                                                <strong>Fitur Eksklusif Premium Pro:</strong> Detail nama tender, nama instansi, serta alasan lengkap Pokja menggugurkan kompetitor ini saat ini disensor. Silakan upgrade ke paket Premium Pro untuk membuka akses analitik kompetitor secara lengkap!
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="table-wrapper">
                                                        <table className="tender-table">
                                                            <thead>
                                                                <tr>
                                                                    <th>Nama Tender &amp; Instansi</th>
                                                                    <th style={{ width: '130px' }}>Tahap Gugur</th>
                                                                    <th style={{ width: '130px' }}>Penawaran</th>
                                                                    <th>Detail Alasan Keguguran Pokja</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {competitorDisqualifications.disqualifications && competitorDisqualifications.disqualifications.length > 0 ? (
                                                                    competitorDisqualifications.disqualifications.map((item, idx) => (
                                                                        <tr key={idx} style={{ verticalAlign: 'top' }}>
                                                                            <td>
                                                                                <div
                                                                                    onClick={() => handleViewTenderDetail(item.nomor_pengadaan)}
                                                                                    style={{ fontWeight: 'bold', fontSize: '13px', color: '#818cf8', cursor: 'pointer', transition: 'color 0.2s' }}
                                                                                    onMouseEnter={(e) => { e.currentTarget.style.color = '#a5b4fc'; e.currentTarget.style.textDecoration = 'underline'; }}
                                                                                    onMouseLeave={(e) => { e.currentTarget.style.color = '#818cf8'; e.currentTarget.style.textDecoration = 'none'; }}
                                                                                    title="Klik untuk melihat detail tender"
                                                                                >
                                                                                    {renderTenderTitle(item.nama_tender)}
                                                                                </div>
                                                                                <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>
                                                                                    🏢 {item.instansi} | ID: {item.nomor_pengadaan}
                                                                                </div>
                                                                            </td>
                                                                            <td>
                                                                                <span style={{ background: 'rgba(239,68,68,0.12)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>
                                                                                    {item.failed_stage.toUpperCase()}
                                                                                </span>
                                                                            </td>
                                                                            <td>
                                                                                {item.harga_penawaran > 0 ? (
                                                                                    <>
                                                                                        <div style={{ color: '#fbbf24', fontWeight: 'bold', fontSize: '12px' }}>
                                                                                            Rp {item.harga_penawaran.toLocaleString('id-ID')}
                                                                                        </div>
                                                                                        {item.harga_terkoreksi > 0 && item.harga_terkoreksi !== item.harga_penawaran && (
                                                                                            <div style={{ fontSize: '10px', color: '#6b7280', marginTop: '2px' }}>
                                                                                                Terkoreksi: Rp {item.harga_terkoreksi.toLocaleString('id-ID')}
                                                                                            </div>
                                                                                        )}
                                                                                    </>
                                                                                ) : (
                                                                                    <span style={{ color: '#6b7280' }}>-</span>
                                                                                )}
                                                                            </td>
                                                                            <td>
                                                                                <div style={{
                                                                                    fontSize: '12.5px',
                                                                                    color: competitorDisqualifications.is_premium ? '#e5e7eb' : '#9ca3af',
                                                                                    fontStyle: competitorDisqualifications.is_premium ? 'normal' : 'italic',
                                                                                    lineHeight: '1.6',
                                                                                    whiteSpace: 'pre-wrap',
                                                                                    background: 'rgba(0,0,0,0.15)',
                                                                                    padding: '10px',
                                                                                    borderRadius: '8px',
                                                                                    border: '1px solid rgba(255,255,255,0.03)'
                                                                                }}>
                                                                                    {item.alasan_gugur || '(Tidak dicantumkan alasan oleh Pokja)'}
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                    ))
                                                                ) : (
                                                                    <tr>
                                                                        <td colSpan="4" style={{ textAlign: 'center', color: '#6b7280', padding: '20px' }}>Tidak ada riwayat keguguran lelang yang tercatat.</td>
                                                                    </tr>
                                                                )}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <p style={{ color: '#6b7280', fontStyle: 'italic', textAlign: 'center', padding: '40px 0' }}>Gagal memuat data keguguran.</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p style={{ color: '#6b7280', fontStyle: 'italic', textAlign: 'center', padding: '40px 0' }}>Badan usaha kompetitor tidak ditemukan.</p>
                        )}
                    </div>
                )}

            </div>

            {/* DETAIL DRAWER PANEL (Overlaid on Right Side) */}
            {isDrawerOpen && selectedTender && (
                <div className="drawer-backdrop" onClick={() => setIsDrawerOpen(false)}>
                    <div className="drawer" onClick={(e) => e.stopPropagation()}>
                        <div className="drawer-header">
                            <div className="drawer-title">
                                <h2>Detail Pengadaan</h2>
                                <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    Nomor Pengadaan: <strong style={{ color: '#fff' }}>{selectedTender.nomor_pengadaan}</strong>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(selectedTender.nomor_pengadaan);
                                            alert('Nomor pengadaan disalin: ' + selectedTender.nomor_pengadaan);
                                        }}
                                        style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '2px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}
                                        title="Salin Nomor Pengadaan"
                                    >
                                        📋 Salin
                                    </button>
                                </p>
                            </div>
                            <button className="btn-close" onClick={() => setIsDrawerOpen(false)}>&times;</button>
                        </div>

                        <div className="drawer-body">
                            <div className="detail-section">
                                <label>Nama Paket</label>
                                <p style={{ fontWeight: 'bold', fontSize: '15px' }}>
                                    {renderTenderTitle(selectedTender.nama_tender)}
                                </p>
                            </div>

                            <div className="detail-section">
                                <label>K/L/Pemda/Instansi / Kategori LPSE</label>
                                <p>{selectedTender.instansi} ({selectedTender.kategori})</p>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="detail-section">
                                    <label>Pagu Anggaran</label>
                                    <p style={{ color: '#fbbf24', fontWeight: 'bold' }}>{selectedTender.pagu}</p>
                                </div>
                                <div className="detail-section">
                                    <label>Tahun Anggaran</label>
                                    <p>{selectedTender.tahun}</p>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="detail-section">
                                    <label>Jenis Pengadaan</label>
                                    <p>{selectedTender.jenis_pengadaan || '-'}</p>
                                </div>
                                <div className="detail-section">
                                    <label>Metode Pengadaan</label>
                                    <p>{selectedTender.metode || '-'}</p>
                                </div>
                            </div>

                            <div className="detail-section">
                                <label>Satuan Kerja</label>
                                <p>{selectedTender.satuan_kerja || '-'}</p>
                            </div>

                            <div className="detail-section">
                                <label>Lokasi Pekerjaan</label>
                                <p>{selectedTender.lokasi_pekerjaan || '-'}</p>
                            </div>

                            {/* Jadwal Pengadaan Section */}
                            <div className="detail-section">
                                <label>Jadwal Pengadaan</label>
                                {(() => {
                                    if (!selectedTender.jadwal) {
                                        return (
                                            <p style={{ color: '#6b7280', fontStyle: 'italic' }}>
                                                Detail jadwal belum ditarik / tidak tersedia untuk tender ini.
                                            </p>
                                        );
                                    }
                                    try {
                                        const parsedJadwal = JSON.parse(selectedTender.jadwal);
                                        if (!Array.isArray(parsedJadwal) || parsedJadwal.length === 0) {
                                            return (
                                                <p style={{ color: '#6b7280', fontStyle: 'italic' }}>
                                                    Format data jadwal tidak valid.
                                                </p>
                                            );
                                        }
                                        return (
                                            <div style={{ overflowX: 'auto', marginTop: '8px' }}>
                                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                    <thead>
                                                        <tr style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }}>
                                                            <th style={{ padding: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)', width: '40px' }}>No</th>
                                                            <th style={{ padding: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Tahap</th>
                                                            <th style={{ padding: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Mulai</th>
                                                            <th style={{ padding: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Sampai</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {parsedJadwal.map((item, idx) => (
                                                            <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                                <td style={{ padding: '8px', color: '#9ca3af' }}>{item.no}</td>
                                                                <td style={{ padding: '8px', fontWeight: '500', color: '#fff' }}>{item.tahap}</td>
                                                                <td style={{ padding: '8px', color: '#10B981' }}>{item.mulai}</td>
                                                                <td style={{ padding: '8px', color: '#EF4444' }}>{item.sampai}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        );
                                    } catch (e) {
                                        return (
                                            <p style={{ color: '#6b7280', fontStyle: 'italic' }}>
                                                Gagal memproses data jadwal.
                                            </p>
                                        );
                                    }
                                })()}
                            </div>

                            <div className="detail-section">
                                <label style={{ fontSize: '14px', color: '#93c5fd', fontWeight: '700', marginBottom: '12px', display: 'block' }}>
                                    📋 Syarat Kualifikasi Administrasi &amp; Teknis
                                </label>
                                {selectedTender.syarat_kualifikasi ? (() => {
                                    const sections = formatSyaratTextToSections(selectedTender.syarat_kualifikasi);
                                    if (!sections || sections.length === 0) {
                                        return (
                                            <div className="detail-section quote" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                                                {selectedTender.syarat_kualifikasi}
                                            </div>
                                        );
                                    }
                                    return (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
                                            {sections.map((sec, idx) => (
                                                <div key={idx} style={{
                                                    background: 'rgba(30, 41, 59, 0.5)',
                                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                                    borderRadius: '14px',
                                                    padding: '18px 20px'
                                                }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '8px' }}>
                                                        <span style={{ fontSize: '18px' }}>{sec.icon}</span>
                                                        <h4 style={{ fontSize: '14px', color: '#93c5fd', margin: 0, fontWeight: '700' }}>
                                                            {sec.title}
                                                        </h4>
                                                    </div>

                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                        {sec.items.map((item, itemIdx) => (
                                                            <div key={itemIdx} style={{
                                                                display: 'flex',
                                                                alignItems: 'flex-start',
                                                                gap: '10px',
                                                                background: 'rgba(15, 23, 42, 0.5)',
                                                                border: '1px solid rgba(255, 255, 255, 0.04)',
                                                                padding: '12px 14px',
                                                                borderRadius: '8px',
                                                                fontSize: '13px',
                                                                lineHeight: '1.6',
                                                                color: '#e5e7eb'
                                                            }}>
                                                                <span style={{
                                                                    background: 'rgba(34, 197, 94, 0.15)',
                                                                    color: '#4ade80',
                                                                    borderRadius: '50%',
                                                                    width: '20px',
                                                                    height: '20px',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    fontSize: '11px',
                                                                    fontWeight: '800',
                                                                    flexShrink: 0,
                                                                    marginTop: '2px'
                                                                }}>
                                                                    ✓
                                                                </span>
                                                                <div style={{ flex: 1 }}>{item}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    );
                                })() : (
                                    <p style={{ color: '#6b7280', fontStyle: 'italic' }}>
                                        Detail kualifikasi belum ditarik / tidak tersedia untuk tender ini.
                                    </p>
                                )}
                            </div>

                            {/* Pemenang Kontrak Section */}
                            <div className="detail-section">
                                <label>🏆 Pemenang Kontrak</label>
                                {selectedTender.pemenang ? (
                                    <div style={{ padding: '16px', background: 'rgba(251, 191, 36, 0.05)', border: '1px solid rgba(251, 191, 36, 0.25)', borderRadius: '12px' }}>
                                        <div style={{ fontWeight: 'bold', color: '#fff', fontSize: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span
                                                onClick={() => handleOpenCompetitorProfile(selectedTender.pemenang.nama_pemenang)}
                                                style={{ color: '#fbbf24', cursor: 'pointer', textDecoration: 'underline' }}
                                                title="Klik untuk melihat profil kompetitor"
                                            >
                                                {selectedTender.pemenang.nama_pemenang}
                                            </span>
                                            <span style={{ fontSize: '11px', background: '#fbbf24', color: '#000', padding: '2px 8px', borderRadius: '20px', fontWeight: 'bold' }}>PEMENANG</span>
                                        </div>
                                        <div style={{ fontSize: '13px', color: '#9ca3af', marginTop: '6px' }}>📍 Alamat: {selectedTender.pemenang.alamat}</div>
                                        <div style={{ fontSize: '13px', color: '#9ca3af', marginTop: '4px' }}>💳 NPWP: {selectedTender.pemenang.npwp}</div>
                                        <div style={{ fontSize: '14px', color: '#34d399', fontWeight: 'bold', marginTop: '8px' }}>💰 Harga Kontrak: {formatPaguVal(selectedTender.pemenang.harga_kontrak)}</div>
                                    </div>
                                ) : (
                                    <p style={{ color: '#6b7280', fontStyle: 'italic' }}>Informasi pemenang berkontrak belum ditarik / tidak tersedia.</p>
                                )}
                            </div>

                            {/* Daftar Peserta Lelang Section */}
                            <div className="detail-section">
                                <label>👥 Peserta Lelang ({selectedTender.peserta?.length || 0})</label>
                                {selectedTender.peserta && selectedTender.peserta.length > 0 ? (
                                    <div style={{ overflowX: 'auto', marginTop: '8px', maxHeight: '200px', overflowY: 'auto', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', background: 'rgba(255,255,255,0.01)' }}>
                                            <thead>
                                                <tr style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }}>
                                                    <th style={{ padding: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Nama Peserta</th>
                                                    <th style={{ padding: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Penawaran</th>
                                                    <th style={{ padding: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Terkoreksi</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {selectedTender.peserta.map((peserta, idx) => (
                                                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                        <td style={{ padding: '8px' }}>
                                                            <span
                                                                onClick={() => handleOpenCompetitorProfile(peserta.nama_peserta)}
                                                                style={{ color: '#818cf8', cursor: 'pointer', textDecoration: 'underline' }}
                                                                title="Klik untuk melihat profil kompetitor"
                                                            >
                                                                {peserta.nama_peserta}
                                                            </span>
                                                            <div style={{ fontSize: '10px', color: '#6b7280', marginTop: '2px' }}>{peserta.npwp}</div>
                                                        </td>
                                                        <td style={{ padding: '8px', color: '#f3f4f6' }}>{peserta.harga_penawaran > 0 ? formatPaguVal(peserta.harga_penawaran) : '-'}</td>
                                                        <td style={{ padding: '8px', color: '#34d399', fontWeight: 'bold' }}>{peserta.harga_terkoreksi > 0 ? formatPaguVal(peserta.harga_terkoreksi) : '-'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p style={{ color: '#6b7280', fontStyle: 'italic' }}>Daftar peserta lelang belum ditarik / tidak tersedia.</p>
                                )}
                            </div>

                            {selectedTender.alasan_diulang && (
                                <div className="detail-section">
                                    <label style={{ color: 'var(--color-danger)' }}>Alasan Diulang</label>
                                    <p style={{ color: 'var(--color-danger)', fontStyle: 'italic' }}>{selectedTender.alasan_diulang}</p>
                                </div>
                            )}

                            <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
                                <a
                                    href={`https://spse.inaproc.id/${selectedTender.kategori}/lelang/${selectedTender.nomor_pengadaan}/pengumumanlelang`}
                                    target="_blank"
                                    rel="noopener"
                                    referrerPolicy="unsafe-url"
                                    className="btn-primary"
                                    style={{ textDecoration: 'none', textAlign: 'center', flexGrow: 1 }}
                                >
                                    🔗 Buka Halaman Pengumuman Resmi
                                </a>

                                {bookmarks.some(b => b.nomor_pengadaan === selectedTender.nomor_pengadaan) ? (
                                    <button
                                        onClick={() => handleRemoveBookmark(selectedTender.nomor_pengadaan, selectedTender.nama_tender)}
                                        style={{ background: '#ef4444', border: 'none', color: '#fff', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
                                    >
                                        🗑️ Hapus Simpanan
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleAddBookmark(selectedTender.nomor_pengadaan)}
                                        style={{ background: '#10b981', border: 'none', color: '#fff', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
                                    >
                                        💾 Simpan Tender
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Global Confirmation Modal */}
            {confirmModal.isOpen && (() => {
                const isSuccess = confirmModal.type === 'success';
                const isInfo = confirmModal.type === 'info';
                const isDanger = confirmModal.type === 'danger' || !confirmModal.type;

                let borderColor = 'rgba(239, 68, 68, 0.25)'; // Default danger red
                let iconBg = 'rgba(239, 68, 68, 0.1)';
                let iconBorder = '1px solid rgba(239, 68, 68, 0.25)';
                let iconColor = '#f87171';
                let iconSymbol = confirmModal.icon || '⚠️';
                let confirmBtnBg = '#ef4444';
                let confirmBtnBorder = '#ef4444';

                if (isSuccess) {
                    borderColor = 'rgba(16, 185, 129, 0.25)'; // Emerald green
                    iconBg = 'rgba(16, 185, 129, 0.1)';
                    iconBorder = '1px solid rgba(16, 185, 129, 0.25)';
                    iconColor = '#34d399';
                    iconSymbol = confirmModal.icon || '✅';
                    confirmBtnBg = '#10b981';
                    confirmBtnBorder = '#10b981';
                } else if (isInfo) {
                    borderColor = 'rgba(99, 102, 241, 0.25)'; // Indigo blue
                    iconBg = 'rgba(99, 102, 241, 0.1)';
                    iconBorder = '1px solid rgba(99, 102, 241, 0.25)';
                    iconColor = '#818cf8';
                    iconSymbol = confirmModal.icon || 'ℹ️';
                    confirmBtnBg = '#6366f1';
                    confirmBtnBorder = '#6366f1';
                }

                const hasCancel = confirmModal.cancelText !== null && confirmModal.cancelText !== undefined && confirmModal.cancelText !== '';

                return (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(5, 8, 16, 0.85)',
                        backdropFilter: 'blur(8px)',
                        zIndex: 99999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        animation: 'fadeIn 0.2s ease-out'
                    }}>
                        <div style={{
                            background: 'var(--bg-secondary)',
                            border: `1px solid ${borderColor}`,
                            borderRadius: '16px',
                            width: '420px',
                            padding: '32px 24px 24px',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                            textAlign: 'center',
                            position: 'relative'
                        }}>
                            <div style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                background: iconBg,
                                border: iconBorder,
                                color: iconColor,
                                fontSize: '24px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 20px'
                            }}>
                                {iconSymbol}
                            </div>

                            <h3 style={{ margin: '0 0 10px', fontSize: '18px', color: '#fff', fontWeight: '700' }}>
                                {confirmModal.title}
                            </h3>

                            <p
                                style={{ margin: '0 0 24px', fontSize: '14px', color: '#9ca3af', lineHeight: '1.6' }}
                                dangerouslySetInnerHTML={{ __html: confirmModal.message }}
                            />

                            <div style={{ display: 'flex', gap: '12px' }}>
                                {hasCancel && (
                                    <button
                                        className="form-control"
                                        style={{
                                            flex: 1,
                                            margin: 0,
                                            padding: '10px',
                                            background: 'rgba(255,255,255,0.05)',
                                            border: '1px solid var(--border-color)',
                                            color: '#fff',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                                    >
                                        {confirmModal.cancelText}
                                    </button>
                                )}
                                <button
                                    className="btn-delete"
                                    style={{
                                        flex: 1,
                                        background: confirmBtnBg,
                                        color: '#fff',
                                        borderColor: confirmBtnBorder,
                                        padding: '10px',
                                        fontWeight: '600',
                                        margin: 0,
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => {
                                        if (confirmModal.onConfirm) {
                                            confirmModal.onConfirm();
                                        }
                                        setConfirmModal(prev => ({ ...prev, isOpen: false }));
                                    }}
                                >
                                    {confirmModal.confirmText || 'Ya, Hapus'}
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })()}
            {/* WHATSAPP ACTIVATION MODAL (INBOUND TRIGGER FOR NEW NUMBERS) */}
            {waActivationModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(15, 23, 42, 0.82)',
                    backdropFilter: 'blur(8px)',
                    zIndex: 99999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px'
                }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                        border: '1px solid rgba(16, 185, 129, 0.35)',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 35px rgba(16, 185, 129, 0.18)',
                        borderRadius: '20px',
                        maxWidth: '520px',
                        width: '100%',
                        padding: '28px',
                        color: '#fff',
                        fontFamily: 'Inter, sans-serif'
                    }}>
                        {/* Header */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '14px',
                                background: 'rgba(16, 185, 129, 0.15)',
                                border: '1px solid rgba(16, 185, 129, 0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '24px',
                                flexShrink: 0
                            }}>
                                🔔
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#fff' }}>
                                    Aktivasi Notifikasi WhatsApp — {waActivationModal.app_name}
                                </h3>
                                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#9ca3af' }}>
                                    Langkah penting untuk mengaktifkan pengiriman notifikasi tender
                                </p>
                            </div>
                        </div>

                        {/* Status Section */}
                        <div style={{
                            background: 'rgba(30, 41, 59, 0.6)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: '14px',
                            padding: '16px 20px',
                            marginBottom: '20px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px', flexWrap: 'wrap', gap: '8px' }}>
                                <span style={{ color: '#9ca3af', fontWeight: '500' }}>📱 Nomor WA Target:</span>
                                {!isEditingModalWa ? (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <strong style={{ color: '#fff', fontSize: '14px' }}>{waActivationModal.whatsapp}</strong>
                                        <button
                                            onClick={() => {
                                                setIsEditingModalWa(true);
                                                setEditingModalWaValue(waActivationModal.whatsapp || '');
                                            }}
                                            style={{
                                                background: 'rgba(99, 102, 241, 0.15)',
                                                border: '1px solid rgba(99, 102, 241, 0.35)',
                                                color: '#c7d2fe',
                                                padding: '3px 9px',
                                                borderRadius: '6px',
                                                fontSize: '12px',
                                                cursor: 'pointer',
                                                fontWeight: '600',
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            ✏️ Edit Nomor
                                        </button>
                                    </div>
                                ) : (
                                    <div style={{
                                        width: '100%',
                                        marginTop: '6px',
                                        background: 'rgba(15, 23, 42, 0.75)',
                                        border: '1px solid rgba(99, 102, 241, 0.4)',
                                        boxShadow: '0 4px 16px rgba(99, 102, 241, 0.15)',
                                        borderRadius: '12px',
                                        padding: '14px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '12px'
                                    }}>
                                        <div style={{ fontSize: '12px', color: '#a5b4fc', fontWeight: '600' }}>
                                            ✏️ Masukkan Nomor WhatsApp Baru:
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            <input
                                                type="text"
                                                value={editingModalWaValue}
                                                onChange={e => setEditingModalWaValue(e.target.value)}
                                                placeholder="Contoh: 081234567890"
                                                style={{
                                                    flex: 1,
                                                    background: '#020617',
                                                    border: '1px solid rgba(99, 102, 241, 0.5)',
                                                    color: '#fff',
                                                    padding: '10px 14px',
                                                    borderRadius: '10px',
                                                    fontSize: '14px',
                                                    fontWeight: '600',
                                                    outline: 'none',
                                                    letterSpacing: '0.5px'
                                                }}
                                            />
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                            <button
                                                onClick={() => setIsEditingModalWa(false)}
                                                style={{
                                                    background: 'rgba(255, 255, 255, 0.06)',
                                                    border: '1px solid rgba(255, 255, 255, 0.15)',
                                                    color: '#cbd5e1',
                                                    padding: '8px 14px',
                                                    borderRadius: '8px',
                                                    fontSize: '13px',
                                                    cursor: 'pointer',
                                                    fontWeight: '500',
                                                    transition: 'all 0.2s ease'
                                                }}
                                            >
                                                Batal
                                            </button>
                                            <button
                                                onClick={handleSaveUpdatedModalWa}
                                                disabled={isSavingModalWa}
                                                style={{
                                                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                                                    color: '#ffffff',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    padding: '8px 16px',
                                                    fontSize: '13px',
                                                    fontWeight: '700',
                                                    cursor: 'pointer',
                                                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)',
                                                    whiteSpace: 'nowrap',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px'
                                                }}
                                            >
                                                {isSavingModalWa ? '⏳ Memeriksa...' : '💾 Simpan & Re-Validasi'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.06)' }}></div>

                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', lineHeight: '1.4' }}>
                                {waActivationModal.whatsapp_registered ? (
                                    <>
                                        <span style={{ color: '#10b981', fontWeight: '700', flexShrink: 0 }}>✅ Status:</span>
                                        <span style={{ color: '#34d399', fontWeight: '500' }}>
                                            Nomor Anda Terdaftar &amp; Aktif di WhatsApp
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <span style={{ color: '#f59e0b', fontWeight: '700', flexShrink: 0 }}>⚠️ Status:</span>
                                        <span style={{ color: '#fbbf24', fontWeight: '500' }}>
                                            Nomor Anda TIDAK Terdaftar / Tidak Aktif di WhatsApp (Mohon periksa kembali nomor Anda)
                                        </span>
                                    </>
                                )}
                            </div>

                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', lineHeight: '1.4' }}>
                                <span style={{ color: '#ef4444', fontWeight: '700', flexShrink: 0 }}>❌ Notifikasi:</span>
                                <span style={{ color: '#f87171', fontWeight: '500' }}>
                                    Nomor Anda Belum Diaktifkan Notifikasi di {waActivationModal.app_name}
                                </span>
                            </div>
                        </div>

                        {/* Info Message Box */}
                        <div style={{
                            background: 'rgba(16, 185, 129, 0.08)',
                            border: '1px solid rgba(16, 185, 129, 0.2)',
                            borderRadius: '12px',
                            padding: '14px 16px',
                            marginBottom: '16px',
                            fontSize: '13px',
                            color: '#d1fae5',
                            lineHeight: '1.5'
                        }}>
                            💡 <strong>Informasi:</strong><br />
                            Agar pengiriman notifikasi radar tender baru dapat berjalan lancar dan terkirim secara optimal ke ponsel Anda, silakan lakukan aktivasi 1-klik sekarang.
                        </div>

                        {/* Important Warning Box */}
                        <div style={{
                            background: 'rgba(245, 158, 11, 0.08)',
                            border: '1px solid rgba(245, 158, 11, 0.2)',
                            borderRadius: '12px',
                            padding: '14px 16px',
                            marginBottom: '24px',
                            fontSize: '12px',
                            color: '#fde68a',
                            lineHeight: '1.5'
                        }}>
                            ⚠️ <strong>Catatan Penting:</strong><br />
                            Mohon pastikan Anda mengklik tombol aktivasi di bawah dan mengirim pesan menggunakan nomor WhatsApp <strong>{waActivationModal.whatsapp}</strong> (nomor yang Anda daftarkan di form) agar notifikasi {waActivationModal.app_name} terhubung secara otomatis.
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <a
                                href={waActivationModal.activation_url}
                                target="_blank"
                                rel="noreferrer"
                                onClick={() => setWaActivationModal(null)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px',
                                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                    color: '#ffffff',
                                    padding: '14px 20px',
                                    borderRadius: '12px',
                                    fontWeight: '700',
                                    fontSize: '14px',
                                    textDecoration: 'none',
                                    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
                                    transition: 'all 0.2s ease',
                                    textAlign: 'center'
                                }}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
                                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                                </svg>
                                <span>Aktifkan Notifikasi {waActivationModal.app_name} via WhatsApp</span>
                            </a>

                            <button
                                onClick={() => setWaActivationModal(null)}
                                style={{
                                    background: 'transparent',
                                    border: '1px solid rgba(255, 255, 255, 0.12)',
                                    color: '#9ca3af',
                                    padding: '10px 16px',
                                    borderRadius: '10px',
                                    fontSize: '13px',
                                    cursor: 'pointer',
                                    fontWeight: '500',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                Nanti Saja
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Chatbot Widget */}
            <Chatbot adminSettings={adminSettings} />
        </div>
    );

}

export default App;
