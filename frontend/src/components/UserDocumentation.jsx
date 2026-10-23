import React, { useState } from 'react';

export default function UserDocumentation({ onOpenTour, onNavigateTab, currentUser, adminSettings }) {
    const [activeModule, setActiveModule] = useState('quickstart');
    const [searchQuery, setSearchQuery] = useState('');
    const [alertPreviewMode, setAlertPreviewMode] = useState('all'); // 'all', 'whatsapp', 'email'

    const handleOpenWhatsAppCS = () => {
        const rawPhone = adminSettings?.contact_whatsapp || '6282120664105';
        let cleanPhone = String(rawPhone).replace(/\D/g, '');
        if (cleanPhone.startsWith('0')) {
            cleanPhone = '62' + cleanPhone.substring(1);
        }
        const userIdentifier = currentUser?.email || currentUser?.username || 'Pengguna';
        const msg = `Halo Tim CS Spy SPSE, saya ${userIdentifier}. Saya membutuhkan bantuan terkait panduan dan fitur platform Spy SPSE.`;
        window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
    };

    const modules = [
        {
            id: 'quickstart',
            icon: '🚀',
            title: '1. Memulai Cepat (Quickstart)',
            badge: 'Dasar',
            description: 'Langkah awal penggunaan, verifikasi akun, dan pemahaman alur sistem.'
        },
        {
            id: 'radar',
            icon: '🎯',
            title: '2. Radar Tender & Kata Kunci',
            badge: 'Inti',
            description: 'Strategi meracik kata kunci, filter pagu, dan monitoring lelang spesifik.'
        },
        {
            id: 'alerts',
            icon: '📲',
            title: '3. Notifikasi WhatsApp & Email Alert',
            badge: 'Realtime',
            description: 'Integrasi WhatsApp Gateway & Email Alert, format pesan real-time, dan panduan konfigurasi.'
        },
        {
            id: 'competitor',
            icon: '👥',
            title: '4. Analisis Kompetitor & Lawan',
            badge: 'Intelijen',
            description: 'Profil Badan Usaha, Pola Diskon HPS, Peta Satker/Kandang, Aliansi KSO, Duel Head-to-Head, dan Audit Evaluasi Pokja.'
        },
        {
            id: 'export',
            icon: '📊',
            title: '5. Ekspor Data & Evaluasi Tim',
            badge: 'Produktivitas',
            description: 'Cara unduh rekapitulasi data tender ke Excel/CSV untuk rapat estimasi.'
        },
        {
            id: 'billing',
            icon: '💎',
            title: '6. Akun, Langganan & Kupon',
            badge: 'Billing',
            description: 'Masa aktif paket, cara upgrade, dan aktivasi kupon diskon.'
        }
    ];

    const filteredModules = modules.filter(m =>
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div style={{ width: '100%', paddingBottom: '60px' }}>
            {/* Header Banner */}
            <div data-tour="docs-header" style={{
                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.8))',
                border: '1px solid rgba(99, 102, 241, 0.25)',
                borderRadius: '20px',
                padding: '30px 36px',
                marginBottom: '28px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '20px',
                boxShadow: '0 20px 40px -15px rgba(0,0,0,0.5)'
            }}>
                <div style={{ flex: '1 1 450px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', color: '#818cf8', marginBottom: '12px' }}>
                        <span>📚</span> PUSAT PANDUAN PENGGUNA TERVERIFIKASI
                    </div>
                    <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#ffffff', margin: '0 0 8px', fontFamily: "'Outfit', sans-serif" }}>
                        Dokumentasi &amp; Panduan Strategi Spy SPSE
                    </h1>
                    <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0, lineHeight: '1.6' }}>
                        Kuasai seluruh fitur radar lelang, otomasi notifikasi WhatsApp, dan intelijen kompetitor untuk melipatgandakan peluang kemenangan tender perusahaan Anda.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <button
                        onClick={onOpenTour}
                        style={{
                            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                            color: '#ffffff',
                            border: 'none',
                            padding: '12px 20px',
                            borderRadius: '12px',
                            fontWeight: '700',
                            fontSize: '13px',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            boxShadow: '0 4px 16px rgba(99, 102, 241, 0.35)',
                            transition: 'transform 0.15s ease'
                        }}
                    >
                        <span>🚀</span> Mulai Ulang Tur Pengenalan
                    </button>
                </div>
            </div>

            {/* Layout Grid: Sidebar Nav & Main Reader */}
            <div className="docs-layout-grid" style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px', alignItems: 'flex-start', width: '100%' }}>
                {/* Left Navigation Sidebar */}
                <div style={{
                    background: 'rgba(15, 23, 42, 0.5)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '16px',
                    padding: '20px',
                    position: 'sticky',
                    top: '20px'
                }}>
                    {/* Search Field */}
                    <div style={{ marginBottom: '16px' }}>
                        <input
                            type="text"
                            placeholder="Cari topik panduan..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px 14px',
                                background: 'rgba(30, 41, 59, 0.8)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '10px',
                                color: '#ffffff',
                                fontSize: '13px',
                                outline: 'none'
                            }}
                        />
                    </div>

                    <div style={{ fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px', paddingLeft: '4px' }}>
                        Daftar Modul Panduan
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {filteredModules.map(mod => {
                            const isActive = activeModule === mod.id;
                            return (
                                <button
                                    key={mod.id}
                                    onClick={() => setActiveModule(mod.id)}
                                    style={{
                                        width: '100%',
                                        textAlign: 'left',
                                        padding: '12px 14px',
                                        borderRadius: '10px',
                                        border: isActive ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid transparent',
                                        background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                                        color: isActive ? '#ffffff' : '#94a3b8',
                                        cursor: 'pointer',
                                        transition: 'all 0.15s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}
                                    onMouseEnter={e => {
                                        if (!isActive) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                                    }}
                                    onMouseLeave={e => {
                                        if (!isActive) e.currentTarget.style.background = 'transparent';
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span style={{ fontSize: '16px' }}>{mod.icon}</span>
                                        <div>
                                            <div style={{ fontSize: '13px', fontWeight: isActive ? '700' : '500', color: isActive ? '#ffffff' : '#cbd5e1' }}>
                                                {mod.title}
                                            </div>
                                        </div>
                                    </div>
                                    <span style={{
                                        fontSize: '10px',
                                        fontWeight: '700',
                                        padding: '2px 6px',
                                        borderRadius: '4px',
                                        background: isActive ? '#6366f1' : 'rgba(255, 255, 255, 0.08)',
                                        color: isActive ? '#fff' : '#64748b'
                                    }}>
                                        {mod.badge}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Quick Support Card */}
                    <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(30, 41, 59, 0.4)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        <div style={{ fontSize: '12px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>Butuh Bantuan Personal?</div>
                        <p style={{ fontSize: '11px', color: '#94a3b8', margin: '0 0 10px', lineHeight: '1.5' }}>
                            Tim Customer Success kami siap membantu kendala teknis atau konsultasi tender.
                        </p>
                        <button
                            onClick={handleOpenWhatsAppCS}
                            style={{
                                width: '100%',
                                padding: '9px 12px',
                                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2))',
                                color: '#34d399',
                                border: '1px solid rgba(16, 185, 129, 0.4)',
                                borderRadius: '8px',
                                fontSize: '12px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                transition: 'all 0.2s',
                                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                                e.currentTarget.style.color = '#ffffff';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2))';
                                e.currentTarget.style.color = '#34d399';
                            }}
                        >
                            <span>💬</span> Hubungi Dukungan CS
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div style={{
                    background: 'rgba(15, 23, 42, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '20px',
                    padding: '36px',
                    minHeight: '600px'
                }}>
                    {/* MODULE 1: QUICKSTART */}
                    {activeModule === 'quickstart' && (
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                <span style={{ fontSize: '28px' }}>🚀</span>
                                <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                                    Panduan Memulai Cepat (Quick Start)
                                </h2>
                            </div>
                            <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px' }}>
                                Pelajari langkah-langkah esensial dalam 5 menit pertama agar akun Anda langsung menerima peluang tender secara otomatis.
                            </p>

                            {/* Callout Box */}
                            <div style={{ background: 'rgba(99, 102, 241, 0.08)', borderLeft: '4px solid #6366f1', padding: '16px 20px', borderRadius: '0 12px 12px 0', marginBottom: '28px' }}>
                                <div style={{ fontSize: '13px', fontWeight: '700', color: '#818cf8', marginBottom: '4px' }}>💡 Mengapa Spy SPSE Berbeda?</div>
                                <div style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.6' }}>
                                    Alih-alih Anda harus membuka 500+ portal LPSE satu per satu setiap hari, crawler Spy SPSE mengumpulkan seluruh pengumuman tender baru, pembaruan tahapan jadwal, dan pengumuman pemenang lelang dalam satu wadah terpusat.
                                </div>
                            </div>

                            <h3 style={{ fontSize: '17px', color: '#ffffff', fontWeight: '700', marginBottom: '14px' }}>3 Langkah Wajib Pengguna Baru:</h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                                <div style={{ display: 'flex', gap: '16px', background: 'rgba(30, 41, 59, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '12px', padding: '18px' }}>
                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#6366f1', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '14px', flexShrink: 0 }}>
                                        1
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '15px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>Lengkapi &amp; Verifikasi Nomor WhatsApp</div>
                                        <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.6' }}>
                                            Pastikan nomor WhatsApp Anda sudah terdaftar dengan format yang benar (misal: <code>081234567890</code>). Nomor ini digunakan untuk mengirimkan alert tender baru tanpa biaya pulsa.
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '16px', background: 'rgba(30, 41, 59, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '12px', padding: '18px' }}>
                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#6366f1', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '14px', flexShrink: 0 }}>
                                        2
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '15px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>Daftarkan Kata Kunci Utama Bisnis Anda</div>
                                        <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.6' }}>
                                            Kunjungi menu <strong>Alerts Notifikasi</strong> dan daftarkan kata kunci pengadaan yang ingin Anda buru, misalnya: <em>Konstruksi, Renovasi, Pengadaan Laptop, Catering, Konsultansi</em>.
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '16px', background: 'rgba(30, 41, 59, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '12px', padding: '18px' }}>
                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#6366f1', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '14px', flexShrink: 0 }}>
                                        3
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '15px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>Cek Explorer Tender &amp; Bookmark Paket Incaran</div>
                                        <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.6' }}>
                                            Buka <strong>Explorer Tender</strong> untuk menyaring tender aktif berdasarkan pagu anggaran atau instansi tertentu, lalu klik ikon bintang untuk menyimpan ke folder <em>Saved Bookmarks</em>.
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                <button
                                    onClick={() => onNavigateTab && onNavigateTab('alerts')}
                                    className="btn-primary"
                                    style={{ padding: '10px 20px', borderRadius: '10px', fontSize: '13px', cursor: 'pointer' }}
                                >
                                    Pasang Kata Kunci Pertama Anda ➔
                                </button>
                            </div>
                        </div>
                    )}

                    {/* MODULE 2: RADAR TENDER & KEYWORDS */}
                    {activeModule === 'radar' && (
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                <span style={{ fontSize: '28px' }}>🎯</span>
                                <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                                    Radar Tender &amp; Strategi Kata Kunci
                                </h2>
                            </div>
                            <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px' }}>
                                Cara meracik kata kunci yang tepat sasaran agar radar hanya menangkap tender yang benar-benar bisa Anda kerjakan.
                            </p>

                            <h3 style={{ fontSize: '16px', color: '#ffffff', fontWeight: '700', marginBottom: '12px' }}>
                                Tips Memilih Kata Kunci Efektif:
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                                <div style={{ background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: '12px', padding: '16px' }}>
                                    <div style={{ color: '#4ade80', fontWeight: '700', fontSize: '13px', marginBottom: '6px' }}>✅ Dianjurkan (Spesifik &amp; Relevan)</div>
                                    <ul style={{ margin: 0, paddingLeft: '20px', color: '#cbd5e1', fontSize: '12px', lineHeight: '1.8' }}>
                                        <li><code>Gedung Sekolah</code> (daripada hanya "Gedung")</li>
                                        <li><code>Jaringan Fiber Optik</code> (daripada "Kabel")</li>
                                        <li><code>Pemeliharaan AC</code> (daripada "Alat")</li>
                                        <li><code>Alat Tulis Kantor</code> atau <code>ATK</code></li>
                                    </ul>
                                </div>
                                <div style={{ background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '12px', padding: '16px' }}>
                                    <div style={{ color: '#f87171', fontWeight: '700', fontSize: '13px', marginBottom: '6px' }}>❌ Hindari (Terlalu Umum / Ambiguitas)</div>
                                    <ul style={{ margin: 0, paddingLeft: '20px', color: '#cbd5e1', fontSize: '12px', lineHeight: '1.8' }}>
                                        <li><code>Jasa</code> (akan memicu ribuan tender yang tidak relevan)</li>
                                        <li><code>Pengadaan</code> (terlalu luas)</li>
                                        <li><code>Barang</code> (menghasilkan spam notifikasi)</li>
                                    </ul>
                                </div>
                            </div>

                            <div style={{ background: 'rgba(251, 191, 36, 0.08)', borderLeft: '4px solid #fbbf24', padding: '16px 20px', borderRadius: '0 12px 12px 0', marginBottom: '28px' }}>
                                <div style={{ fontSize: '13px', fontWeight: '700', color: '#fbbf24', marginBottom: '4px' }}>⚡ Fitur Multi-Keyword</div>
                                <div style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.6' }}>
                                    Sebagai pelanggan Premium, Anda dapat mendaftarkan beberapa kata kunci sekaligus sesuai lini usaha bisnis Anda. Radar akan memisahkan notifikasi sesuai kata kunci yang memicunya.
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    onClick={() => onNavigateTab && onNavigateTab('keyword-tenders')}
                                    className="btn-primary"
                                    style={{ padding: '10px 20px', borderRadius: '10px', fontSize: '13px', cursor: 'pointer' }}
                                >
                                    Buka Halaman Peluang Anda ➔
                                </button>
                            </div>
                        </div>
                    )}

                    {/* MODULE 3: NOTIFIKASI WHATSAPP & EMAIL */}
                    {activeModule === 'alerts' && (
                        <div>
                            {/* Header Section */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
                                <div style={{
                                    width: '46px',
                                    height: '46px',
                                    borderRadius: '12px',
                                    background: 'linear-gradient(135deg, rgba(37, 211, 102, 0.2), rgba(99, 102, 241, 0.2))',
                                    border: '1px solid rgba(37, 211, 102, 0.4)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '24px',
                                    flexShrink: 0
                                }}>
                                    📲
                                </div>
                                <div>
                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(37, 211, 102, 0.15)', border: '1px solid rgba(37, 211, 102, 0.3)', padding: '2px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700', color: '#4ade80', textTransform: 'uppercase', marginBottom: '4px' }}>
                                        Dual-Channel Realtime Notification
                                    </div>
                                    <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#ffffff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>
                                        Notifikasi WhatsApp &amp; Email Alert
                                    </h2>
                                </div>
                            </div>
                            <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.6', marginBottom: '22px' }}>
                                Sistem <strong>Radar Intelijen Otomatis Spy SPSE</strong> memantau ratusan portal LPSE di seluruh Indonesia secara non-stop 24/7. Begitu paket lelang yang cocok dengan kata kunci bisnis Anda resmi dipublikasikan, ringkasan peluang tender akan langsung dikirimkan secara instan ke WhatsApp dan Email Anda dalam hitungan detik.
                            </p>

                            {/* View Switcher Bar */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', background: 'rgba(30, 41, 59, 0.4)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '14px', padding: '10px 16px', marginBottom: '26px' }}>
                                <div style={{ fontSize: '13px', color: '#cbd5e1', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span>👁️</span> Mode Pratinjau Alert:
                                </div>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    <button
                                        type="button"
                                        onClick={() => setAlertPreviewMode('all')}
                                        style={{
                                            background: alertPreviewMode === 'all' ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'rgba(255, 255, 255, 0.05)',
                                            color: '#ffffff',
                                            border: alertPreviewMode === 'all' ? '1px solid #818cf8' : '1px solid rgba(255, 255, 255, 0.1)',
                                            padding: '6px 14px',
                                            borderRadius: '8px',
                                            fontSize: '12px',
                                            fontWeight: '700',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        🔄 Berdampingan (Keduanya)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setAlertPreviewMode('whatsapp')}
                                        style={{
                                            background: alertPreviewMode === 'whatsapp' ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'rgba(255, 255, 255, 0.05)',
                                            color: '#ffffff',
                                            border: alertPreviewMode === 'whatsapp' ? '1px solid #4ade80' : '1px solid rgba(255, 255, 255, 0.1)',
                                            padding: '6px 14px',
                                            borderRadius: '8px',
                                            fontSize: '12px',
                                            fontWeight: '700',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        📱 WhatsApp Handphone
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setAlertPreviewMode('email')}
                                        style={{
                                            background: alertPreviewMode === 'email' ? 'linear-gradient(135deg, #0ea5e9, #0284c7)' : 'rgba(255, 255, 255, 0.05)',
                                            color: '#ffffff',
                                            border: alertPreviewMode === 'email' ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                                            padding: '6px 14px',
                                            borderRadius: '8px',
                                            fontSize: '12px',
                                            fontWeight: '700',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        ✉️ Email Alert
                                    </button>
                                </div>
                            </div>

                            {/* PREVIEWS CONTAINER */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: alertPreviewMode === 'all' ? 'repeat(auto-fit, minmax(350px, 1fr))' : '1fr',
                                gap: '28px',
                                alignItems: 'start',
                                marginBottom: '36px'
                            }}>
                                {/* ==================== 1. WHATSAPP SMARTPHONE MOCKUP ==================== */}
                                {(alertPreviewMode === 'all' || alertPreviewMode === 'whatsapp') && (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <div style={{ fontSize: '13px', fontWeight: '700', color: '#4ade80', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <span>📱</span> Tampilan Handphone WhatsApp (Realtime Alert)
                                        </div>

                                        {/* Phone Outer Shell */}
                                        <div style={{
                                            width: '100%',
                                            maxWidth: '380px',
                                            background: '#090d16',
                                            border: '10px solid #1e293b',
                                            borderRadius: '44px',
                                            boxShadow: '0 25px 60px -10px rgba(0,0,0,0.8), 0 0 0 2px rgba(34, 197, 94, 0.3)',
                                            overflow: 'hidden',
                                            position: 'relative'
                                        }}>
                                            {/* Top Notch / Dynamic Island */}
                                            <div style={{
                                                background: '#000000',
                                                borderRadius: '20px',
                                                width: '96px',
                                                height: '22px',
                                                margin: '10px auto 4px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '8px'
                                            }}>
                                                <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#111827', border: '1px solid #1f2937' }} />
                                                <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#065f46' }} />
                                            </div>

                                            {/* Status Bar */}
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                padding: '2px 22px 8px',
                                                fontSize: '11px',
                                                fontWeight: '700',
                                                color: '#ffffff',
                                                fontFamily: 'system-ui, -apple-system, sans-serif'
                                            }}>
                                                <span>09:41</span>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <span>5G</span>
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 21l3.54-.93C9.36 20.64 10.64 21 12 21c4.97 0 9-4.03 9-9s-4.03-9-9-9z"/>
                                                    </svg>
                                                    <span>100% 🔋</span>
                                                </div>
                                            </div>

                                            {/* WhatsApp App Header */}
                                            <div style={{
                                                background: '#1f2c34',
                                                padding: '10px 14px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <span style={{ color: '#00a884', fontSize: '18px', cursor: 'pointer', fontWeight: 'bold' }}>‹</span>
                                                    <div style={{
                                                        width: '38px',
                                                        height: '38px',
                                                        borderRadius: '50%',
                                                        background: 'linear-gradient(135deg, #10b981, #059669)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '20px',
                                                        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                                                        flexShrink: 0
                                                    }}>
                                                        🕵🏼‍♂️
                                                    </div>
                                                    <div>
                                                        <div style={{ color: '#e9edef', fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                            Spy SPSE Radar
                                                            <span style={{ color: '#25d366', fontSize: '12px' }} title="Akun Bisnis Terverifikasi">✓</span>
                                                        </div>
                                                        <div style={{ color: '#25d366', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#25d366' }} />
                                                            online
                                                        </div>
                                                    </div>
                                                </div>

                                                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', color: '#aebac1', fontSize: '15px' }}>
                                                    <span style={{ cursor: 'pointer' }} title="Panggilan Video">📹</span>
                                                    <span style={{ cursor: 'pointer' }} title="Panggilan Suara">📞</span>
                                                    <span style={{ cursor: 'pointer', fontSize: '17px', fontWeight: 'bold' }}>⋮</span>
                                                </div>
                                            </div>

                                            {/* WhatsApp Chat Body */}
                                            <div style={{
                                                background: '#0b141a',
                                                backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(32, 44, 51, 0.4) 1px, transparent 1px)',
                                                backgroundSize: '16px 16px',
                                                padding: '16px 12px',
                                                minHeight: '420px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '10px'
                                            }}>
                                                {/* Date Stamp Pill */}
                                                <div style={{
                                                    alignSelf: 'center',
                                                    background: '#182229',
                                                    color: '#8696a0',
                                                    padding: '4px 12px',
                                                    borderRadius: '8px',
                                                    fontSize: '11px',
                                                    fontWeight: '600',
                                                    boxShadow: '0 1px 2px rgba(0,0,0,0.4)',
                                                    marginBottom: '4px'
                                                }}>
                                                    HARI INI
                                                </div>

                                                {/* Security / Encryption Banner */}
                                                <div style={{
                                                    background: '#182229',
                                                    color: '#ffd279',
                                                    padding: '6px 10px',
                                                    borderRadius: '8px',
                                                    fontSize: '10.5px',
                                                    textAlign: 'center',
                                                    lineHeight: '1.4',
                                                    marginBottom: '6px'
                                                }}>
                                                    🔒 Pesan ini dikirim secara instan oleh Radar Intelijen Otomatis Spy SPSE 24/7.
                                                </div>

                                                {/* Incoming Chat Message Bubble */}
                                                <div style={{
                                                    alignSelf: 'flex-start',
                                                    maxWidth: '92%',
                                                    background: '#202c33',
                                                    borderRadius: '4px 14px 14px 14px',
                                                    padding: '12px 14px',
                                                    color: '#e9edef',
                                                    fontSize: '12px',
                                                    lineHeight: '1.6',
                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                                                    position: 'relative'
                                                }}>
                                                    <div style={{ fontWeight: '800', color: '#4ade80', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                                                        <span>🚨</span> RADAR INTELIJEN TENDER SPSE
                                                    </div>
                                                    <div style={{ color: '#ffd279', fontWeight: '700', fontSize: '11.5px', marginBottom: '8px' }}>
                                                        ⚡ Peluang Tender Baru Terdeteksi!
                                                    </div>

                                                    <div style={{ borderTop: '1px dashed rgba(255, 255, 255, 0.12)', paddingTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                        <div>📦 <strong>Paket:</strong> Pembangunan Gedung Laboratorium Terpadu Kampus B</div>
                                                        <div>🏢 <strong>Instansi:</strong> Universitas Indonesia</div>
                                                        <div>🏛️ <strong>Satker:</strong> Dit. Pengelolaan Fasilitas</div>
                                                        <div>💰 <strong>Pagu:</strong> <span style={{ color: '#4ade80', fontWeight: '700' }}>Rp 4.850.000.000,00</span></div>
                                                        <div>🏷️ <strong>HPS:</strong> Rp 4.792.350.000,00</div>
                                                        <div>📋 <strong>Metode:</strong> Tender - Pascakualifikasi</div>
                                                        <div>⏳ <strong>Batas Akhir:</strong> <span style={{ color: '#f87171', fontWeight: '700' }}>28 Okt 2026, 15:00 WIB</span></div>
                                                        <div>🎯 <strong>Kata Kunci:</strong> <em>"Pembangunan Gedung"</em> (Kesesuaian 98%)</div>
                                                    </div>

                                                    <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px dashed rgba(255, 255, 255, 0.12)' }}>
                                                        <div style={{ color: '#53bdeb', fontSize: '11.5px' }}>
                                                            🔗 <strong>Buka Langsung di SPSE:</strong><br />
                                                            <span style={{ textDecoration: 'underline', wordBreak: 'break-all' }}>spse.inaproc.id/ui/lelang/109823000</span>
                                                        </div>
                                                    </div>

                                                    {/* Message Timestamp & Blue Ticks */}
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', fontSize: '10px', color: '#8696a0', marginTop: '6px' }}>
                                                        <span>09:41</span>
                                                        <span style={{ color: '#53bdeb', fontWeight: 'bold' }}>✓✓</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* WhatsApp Bottom Input Bar */}
                                            <div style={{
                                                background: '#1f2c34',
                                                padding: '8px 10px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px'
                                            }}>
                                                <div style={{
                                                    flex: 1,
                                                    background: '#2a3942',
                                                    borderRadius: '24px',
                                                    padding: '8px 12px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    color: '#8696a0',
                                                    fontSize: '12px'
                                                }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <span>😊</span>
                                                        <span>Ketik pesan...</span>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#8696a0' }}>
                                                        <span>📎</span>
                                                        <span>📷</span>
                                                    </div>
                                                </div>
                                                <div style={{
                                                    width: '36px',
                                                    height: '36px',
                                                    borderRadius: '50%',
                                                    background: '#00a884',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: '#ffffff',
                                                    fontSize: '16px',
                                                    flexShrink: 0
                                                }}>
                                                    🎤
                                                </div>
                                            </div>

                                            {/* Bottom Home Indicator Bar */}
                                            <div style={{ padding: '6px 0 10px', background: '#1f2c34', display: 'flex', justifyContent: 'center' }}>
                                                <div style={{ width: '120px', height: '4px', background: '#ffffff', borderRadius: '4px', opacity: 0.6 }} />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* ==================== 2. EMAIL ALERT CLIENT MOCKUP ==================== */}
                                {(alertPreviewMode === 'all' || alertPreviewMode === 'email') && (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <div style={{ fontSize: '13px', fontWeight: '700', color: '#38bdf8', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <span>✉️</span> Tampilan Email Notifikasi (Inbox Perusahaan)
                                        </div>

                                        {/* Email Client Shell */}
                                        <div style={{
                                            width: '100%',
                                            maxWidth: '460px',
                                            background: '#0f172a',
                                            border: '1px solid rgba(56, 189, 248, 0.3)',
                                            borderRadius: '24px',
                                            boxShadow: '0 25px 60px -10px rgba(0,0,0,0.8), 0 0 0 1px rgba(255, 255, 255, 0.05)',
                                            overflow: 'hidden'
                                        }}>
                                            {/* Window Titlebar */}
                                            <div style={{
                                                background: '#1e293b',
                                                padding: '10px 16px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
                                                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />
                                                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                                                </div>
                                                <div style={{ color: '#94a3b8', fontSize: '11px', fontWeight: '600' }}>
                                                    Kotak Masuk — alert@spyspse.com
                                                </div>
                                                <div style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '10px' }}>
                                                    1 Pesan Baru
                                                </div>
                                            </div>

                                            {/* Email Meta Header */}
                                            <div style={{ padding: '16px 18px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', background: 'rgba(30, 41, 59, 0.3)' }}>
                                                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px', marginBottom: '8px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                                                            🕵🏼‍♂️
                                                        </div>
                                                        <div>
                                                            <div style={{ color: '#ffffff', fontSize: '13px', fontWeight: '700' }}>
                                                                Spy SPSE Radar Intelijen
                                                            </div>
                                                            <div style={{ color: '#94a3b8', fontSize: '11px' }}>
                                                                &lt;alert@spyspse.com&gt;
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div style={{ color: '#64748b', fontSize: '11px', whiteSpace: 'nowrap' }}>
                                                        09:41 WIB (Baru saja)
                                                    </div>
                                                </div>

                                                <div style={{ color: '#cbd5e1', fontSize: '11.5px', marginBottom: '6px' }}>
                                                    Kepada: <strong style={{ color: '#ffffff' }}>direksi@perusahaan-anda.co.id</strong>
                                                </div>
                                                <div style={{ color: '#ffffff', fontSize: '14px', fontWeight: '800', lineHeight: '1.4' }}>
                                                    ⚡ [ALERT TENDER BARU] Pembangunan Gedung Laboratorium Terpadu - Pagu Rp 4,85 Miliar
                                                </div>
                                            </div>

                                            {/* Email Body Content */}
                                            <div style={{ padding: '18px', background: '#0b1324' }}>
                                                {/* Header Brand Banner */}
                                                <div style={{
                                                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2))',
                                                    border: '1px solid rgba(99, 102, 241, 0.3)',
                                                    borderRadius: '12px',
                                                    padding: '12px 16px',
                                                    marginBottom: '16px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between'
                                                }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <span style={{ fontSize: '18px' }}>🕵🏼‍♂️</span>
                                                        <span style={{ color: '#ffffff', fontWeight: '800', fontSize: '13px', fontFamily: "'Outfit', sans-serif" }}>
                                                            Spy SPSE
                                                        </span>
                                                    </div>
                                                    <span style={{ fontSize: '10px', color: '#a5b4fc', fontWeight: '700', textTransform: 'uppercase' }}>
                                                        Radar LPSE 24/7 Terverifikasi
                                                    </span>
                                                </div>

                                                <p style={{ color: '#cbd5e1', fontSize: '12.5px', lineHeight: '1.6', margin: '0 0 14px' }}>
                                                    Halo Rekanan Pengadaan,<br />
                                                    Sistem Radar Intelijen Spy SPSE mendeteksi peluang tender pengadaan baru yang cocok dengan kata kunci bisnis Anda:
                                                </p>

                                                {/* Spec Table */}
                                                <div style={{ background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', overflow: 'hidden', marginBottom: '16px' }}>
                                                    <div style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', justifyContent: 'space-between' }}>
                                                        <span style={{ color: '#94a3b8', fontSize: '11.5px' }}>Nama Paket</span>
                                                        <strong style={{ color: '#ffffff', fontSize: '11.5px', textAlign: 'right', maxWidth: '65%' }}>Pembangunan Gedung Laboratorium Terpadu</strong>
                                                    </div>
                                                    <div style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', justifyContent: 'space-between' }}>
                                                        <span style={{ color: '#94a3b8', fontSize: '11.5px' }}>Instansi / Satker</span>
                                                        <span style={{ color: '#cbd5e1', fontSize: '11.5px', textAlign: 'right' }}>Universitas Indonesia</span>
                                                    </div>
                                                    <div style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', justifyContent: 'space-between' }}>
                                                        <span style={{ color: '#94a3b8', fontSize: '11.5px' }}>Nilai Pagu / HPS</span>
                                                        <span style={{ color: '#4ade80', fontSize: '11.5px', fontWeight: '700' }}>Rp 4.850.000.000,00</span>
                                                    </div>
                                                    <div style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', justifyContent: 'space-between' }}>
                                                        <span style={{ color: '#94a3b8', fontSize: '11.5px' }}>Akhir Penawaran</span>
                                                        <span style={{ color: '#f87171', fontSize: '11.5px', fontWeight: '700' }}>28 Okt 2026, 15:00 WIB</span>
                                                    </div>
                                                    <div style={{ padding: '10px 14px', display: 'flex', justifyContent: 'space-between' }}>
                                                        <span style={{ color: '#94a3b8', fontSize: '11.5px' }}>Kata Kunci Cocok</span>
                                                        <span style={{ color: '#818cf8', fontSize: '11.5px', fontWeight: '700' }}>"Pembangunan Gedung"</span>
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                                                    <button
                                                        type="button"
                                                        style={{
                                                            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                                                            color: '#ffffff',
                                                            border: 'none',
                                                            padding: '11px',
                                                            borderRadius: '10px',
                                                            fontWeight: '700',
                                                            fontSize: '12.5px',
                                                            cursor: 'pointer',
                                                            textAlign: 'center',
                                                            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)'
                                                        }}
                                                    >
                                                        🔗 Buka Paket di Portal SPSE ➔
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => onNavigateTab && onNavigateTab('competitors')}
                                                        style={{
                                                            background: 'rgba(255, 255, 255, 0.06)',
                                                            color: '#cbd5e1',
                                                            border: '1px solid rgba(255, 255, 255, 0.12)',
                                                            padding: '9px',
                                                            borderRadius: '10px',
                                                            fontWeight: '600',
                                                            fontSize: '12px',
                                                            cursor: 'pointer',
                                                            textAlign: 'center'
                                                        }}
                                                    >
                                                        📊 Analisis Kompetitor Tender Ini ➔
                                                    </button>
                                                </div>

                                                {/* Email Footer Disclaimer */}
                                                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '12px', textAlign: 'center', fontSize: '10.5px', color: '#64748b', lineHeight: '1.5' }}>
                                                    Email ini dikirimkan otomatis oleh Spy SPSE sesuai preferensi kata kunci akun Anda.<br />
                                                    Kelola preferensi kata kunci &amp; email di dasbor Spy SPSE.
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Section 2: Panduan Konfigurasi & Troubleshooting */}
                            <h3 style={{ fontSize: '16px', color: '#ffffff', fontWeight: '700', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>⚙️</span> Panduan Konfigurasi WhatsApp &amp; Email Alert:
                            </h3>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '28px' }}>
                                {/* Panduan WhatsApp */}
                                <div style={{ background: 'rgba(30, 41, 59, 0.45)', border: '1px solid rgba(34, 197, 94, 0.25)', borderRadius: '14px', padding: '18px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                        <span style={{ fontSize: '20px' }}>📱</span>
                                        <div style={{ color: '#4ade80', fontWeight: '700', fontSize: '14px' }}>Konfigurasi WhatsApp</div>
                                    </div>
                                    <ul style={{ margin: 0, paddingLeft: '18px', color: '#cbd5e1', fontSize: '12.5px', lineHeight: '1.7' }}>
                                        <li>Pastikan nomor WhatsApp aktif dan diawali dengan format yang benar (misal: <code>081234567890</code> atau <code>6281234567890</code>).</li>
                                        <li>Dapat menerima pesan dari nomor bisnis WhatsApp Gateway resmi Spy SPSE tanpa diblokir.</li>
                                        <li>Jika Anda berganti nomor, perbarui nomor WhatsApp kapan saja di menu <strong>Profil Akun</strong>.</li>
                                    </ul>
                                </div>

                                {/* Panduan Email */}
                                <div style={{ background: 'rgba(30, 41, 59, 0.45)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '14px', padding: '18px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                        <span style={{ fontSize: '20px' }}>✉️</span>
                                        <div style={{ color: '#38bdf8', fontWeight: '700', fontSize: '14px' }}>Konfigurasi Email Alert</div>
                                    </div>
                                    <ul style={{ margin: 0, paddingLeft: '18px', color: '#cbd5e1', fontSize: '12.5px', lineHeight: '1.7' }}>
                                        <li>Gunakan email operasional perusahaan atau email tim tender yang aktif dibuka setiap hari.</li>
                                        <li><strong>Tips Whitelist:</strong> Tambahkan <code>alert@spyspse.com</code> ke kontak Anda agar email selalu masuk ke <em>Primary Inbox</em> dan tidak tersaring ke folder Spam atau Promotions.</li>
                                        <li>Notifikasi email memuat ringkasan paket dan tautan langsung untuk analisis kompetitor instan.</li>
                                    </ul>
                                </div>

                                {/* Cara Kerja Radar Intelijen */}
                                <div style={{ background: 'rgba(30, 41, 59, 0.45)', border: '1px solid rgba(99, 102, 241, 0.25)', borderRadius: '14px', padding: '18px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                        <span style={{ fontSize: '20px' }}>🛰️</span>
                                        <div style={{ color: '#818cf8', fontWeight: '700', fontSize: '14px' }}>Sistem Radar Intelijen 24/7</div>
                                    </div>
                                    <ul style={{ margin: 0, paddingLeft: '18px', color: '#cbd5e1', fontSize: '12.5px', lineHeight: '1.7' }}>
                                        <li>Bekerja secara cerdas dan otomatis memindai seluruh portal LPSE tanpa jeda.</li>
                                        <li>Mencocokkan judul lelang, uraian singkat pengadaan, dan batas pagu anggaran secara ketat.</li>
                                        <li>Menghindari duplikasi notifikasi sehingga Anda tidak akan menerima spam untuk paket yang sama.</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                <button
                                    onClick={() => onNavigateTab && onNavigateTab('alerts')}
                                    className="btn-primary"
                                    style={{
                                        padding: '12px 24px',
                                        borderRadius: '12px',
                                        fontSize: '13.5px',
                                        fontWeight: '700',
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        boxShadow: '0 4px 16px rgba(37, 211, 102, 0.35)'
                                    }}
                                >
                                    <span>⚙️</span> Kelola Notifikasi WhatsApp &amp; Email ➔
                                </button>
                            </div>
                        </div>
                    )}

                    {/* MODULE 4: COMPETITOR ANALYSIS */}
                    {activeModule === 'competitor' && (
                        <div>
                            {/* Header Section */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
                                <div style={{
                                    width: '46px',
                                    height: '46px',
                                    borderRadius: '12px',
                                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2))',
                                    border: '1px solid rgba(99, 102, 241, 0.4)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '24px',
                                    flexShrink: 0
                                }}>
                                    👥
                                </div>
                                <div>
                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '2px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700', color: '#a5b4fc', textTransform: 'uppercase', marginBottom: '4px' }}>
                                        Actionable Procurement Intelligence
                                    </div>
                                    <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#ffffff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>
                                        Profil Kompetitor &amp; Intelijen Badan Usaha
                                    </h2>
                                </div>
                            </div>
                            <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' }}>
                                Mengubah data historis LPSE menjadi instrumen intelijen pengadaan aktif. Ketahui karakter penawaran harga lawan, wilayah kekuasaan dinas/satker, jaringan konsorsium KSO, perbandingan duel langsung (Head-to-Head), hingga titik lemah Pokja sebagai amunisi sanggahan tender.
                            </p>

                            {/* Feature Chips / Pillars */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '28px' }}>
                                <span style={{ background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.25)', color: '#a5b4fc', padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                                    📊 Win Rate &amp; Nilai Kontrak
                                </span>
                                <span style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.25)', color: '#6ee7b7', padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                                    💰 Pola Penawaran &amp; Diskon HPS
                                </span>
                                <span style={{ background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.25)', color: '#fcd34d', padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                                    🏛️ Peta Kandang Satker
                                </span>
                                <span style={{ background: 'rgba(139, 92, 246, 0.12)', border: '1px solid rgba(139, 92, 246, 0.25)', color: '#c4b5fd', padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                                    🤝 Jaringan Rekanan &amp; KSO
                                </span>
                                <span style={{ background: 'rgba(6, 182, 212, 0.12)', border: '1px solid rgba(6, 182, 212, 0.25)', color: '#67e8f9', padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                                    ⚔️ Duel Head-to-Head
                                </span>
                                <span style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.25)', color: '#fca5a5', padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                                    ❌ Audit Catatan Evaluasi Pokja
                                </span>
                                <span style={{ background: 'rgba(236, 72, 153, 0.12)', border: '1px solid rgba(236, 72, 153, 0.25)', color: '#f9a8d4', padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                                    📄 Ekspor Dossier PDF A4
                                </span>
                            </div>

                            {/* Section 1: 6 Sub-Tab Profil Kompetitor */}
                            <h3 style={{ fontSize: '17px', color: '#ffffff', fontWeight: '700', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>🔍</span> 6 Modul Analisis di Halaman Profil Kompetitor:
                            </h3>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px', marginBottom: '28px' }}>
                                {/* 1. Ringkasan Profil */}
                                <div style={{ background: 'rgba(30, 41, 59, 0.45)', border: '1px solid rgba(99, 102, 241, 0.25)', borderRadius: '14px', padding: '20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                        <span style={{ fontSize: '20px' }}>📊</span>
                                        <div>
                                            <div style={{ color: '#ffffff', fontWeight: '700', fontSize: '15px' }}>1. Ringkasan Profil &amp; Kinerja</div>
                                            <div style={{ color: '#818cf8', fontSize: '11px', fontWeight: '600' }}>Track Record &amp; Win Rate</div>
                                        </div>
                                    </div>
                                    <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.6', margin: '0 0 10px' }}>
                                        Menampilkan kartu statistik agregat lawan: total lelang yang diikuti, total kemenangan, total keguguran, persentase <strong>Win Rate</strong>, akumulasi nilai rupiah kontrak yang dimenangkan, serta rata-rata nilai pagu proyek yang mereka garap.
                                    </p>
                                    <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '10px 12px', borderRadius: '8px', fontSize: '12px', color: '#cbd5e1' }}>
                                        💡 <strong>Insight:</strong> Mengukur kapasitas skala modal lawan (apakah tergolong kontraktor spesialis proyek kecil &lt; 2,5 M atau kontraktor kelas kakap &gt; 15 M).
                                    </div>
                                </div>

                                {/* 2. Pola Penawaran & HPS */}
                                <div style={{ background: 'rgba(30, 41, 59, 0.45)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '14px', padding: '20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                        <span style={{ fontSize: '20px' }}>💰</span>
                                        <div>
                                            <div style={{ color: '#ffffff', fontWeight: '700', fontSize: '15px' }}>2. Pola Penawaran &amp; HPS</div>
                                            <div style={{ color: '#34d399', fontSize: '11px', fontWeight: '600' }}>Bidding Pricing Pattern</div>
                                        </div>
                                    </div>
                                    <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.6', margin: '0 0 10px' }}>
                                        Sistem mengklasifikasikan karakter lawan secara otomatis berdasarkan perbandingan harga penawaran terhadap Pagu/HPS:
                                    </p>
                                    <ul style={{ margin: '0 0 10px', paddingLeft: '18px', color: '#cbd5e1', fontSize: '12px', lineHeight: '1.7' }}>
                                        <li><strong style={{ color: '#f87171' }}>🔥 Tipe Banting Harga (&lt; 80% Pagu):</strong> Agresif memotong harga demi volume proyek.</li>
                                        <li><strong style={{ color: '#fbbf24' }}>⚖️ Tipe Moderat (80% - 90% Pagu):</strong> Menjaga margin sambil tetap kompetitif.</li>
                                        <li><strong style={{ color: '#6ee7b7' }}>💎 Tipe Teknis / Premium (&gt; 90% Pagu):</strong> Bertumpu pada nilai teknis, personil ahli, atau spesifikasi unggul.</li>
                                    </ul>
                                    <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '10px 12px', borderRadius: '8px', fontSize: '12px', color: '#cbd5e1' }}>
                                        🎯 <strong>Winning Sweet Spot:</strong> Menemukan rentang persentase harga di mana lawan paling sering menang (misal: <em>82% - 86% dari HPS</em>).
                                    </div>
                                </div>

                                {/* 3. Sebaran Satker & Basis Menang */}
                                <div style={{ background: 'rgba(30, 41, 59, 0.45)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: '14px', padding: '20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                        <span style={{ fontSize: '20px' }}>🏛️</span>
                                        <div>
                                            <div style={{ color: '#ffffff', fontWeight: '700', fontSize: '15px' }}>3. Sebaran Satker &amp; Basis Wilayah</div>
                                            <div style={{ color: '#fbbf24', fontSize: '11px', fontWeight: '600' }}>Client &amp; Satker Mapping</div>
                                        </div>
                                    </div>
                                    <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.6', margin: '0 0 10px' }}>
                                        Memetakan instansi kementerian, dinas pemda, atau BUMN mana saja yang menjadi langganan tetap badan usaha tersebut. Menampilkan total paket yang dimenangkan, total nilai rupiah kontrak, dan rata-rata diskon saat menang di satker tersebut.
                                    </p>
                                    <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '10px 12px', borderRadius: '8px', fontSize: '12px', color: '#cbd5e1' }}>
                                        ⚠️ <strong>Peta Kandang (Home Ground):</strong> Menandai dinas yang menjadi basis utama lawan sehingga Anda dapat memperhitungkan peluang sebelum mengajukan penawaran.
                                    </div>
                                </div>

                                {/* 4. Rekanan & KSO */}
                                <div style={{ background: 'rgba(30, 41, 59, 0.45)', border: '1px solid rgba(139, 92, 246, 0.25)', borderRadius: '14px', padding: '20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                        <span style={{ fontSize: '20px' }}>🤝</span>
                                        <div>
                                            <div style={{ color: '#ffffff', fontWeight: '700', fontSize: '15px' }}>4. Jaringan Rekanan &amp; KSO</div>
                                            <div style={{ color: '#c084fc', fontSize: '11px', fontWeight: '600' }}>Partner Network &amp; Co-Bidders</div>
                                        </div>
                                    </div>
                                    <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.6', margin: '0 0 10px' }}>
                                        Membongkar ekosistem kerja sama badan usaha:
                                    </p>
                                    <ul style={{ margin: '0 0 10px', paddingLeft: '18px', color: '#cbd5e1', fontSize: '12px', lineHeight: '1.7' }}>
                                        <li><strong>KSO Formal:</strong> Rekanan resmi Joint Operation yang tercatat dalam kontrak lelang SPSE.</li>
                                        <li><strong>Frequent Co-Bidders:</strong> Mitra yang sering mendaftar bersama pada paket lelang yang sama, mendeteksi apakah berperan sebagai mitra setara atau peserta pendamping.</li>
                                    </ul>
                                    <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '10px 12px', borderRadius: '8px', fontSize: '12px', color: '#cbd5e1' }}>
                                        👥 <strong>Deteksi Aliansi:</strong> Membantu Anda mengenali apakah lelang diramaikan oleh kelompok vendor yang saling berafiliasi.
                                    </div>
                                </div>

                                {/* 5. Head-to-Head */}
                                <div style={{ background: 'rgba(30, 41, 59, 0.45)', border: '1px solid rgba(6, 182, 212, 0.25)', borderRadius: '14px', padding: '20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                        <span style={{ fontSize: '20px' }}>⚔️</span>
                                        <div>
                                            <div style={{ color: '#ffffff', fontWeight: '700', fontSize: '15px' }}>5. Komparasi Head-to-Head</div>
                                            <div style={{ color: '#22d3ee', fontSize: '11px', fontWeight: '600' }}>Dual Direct Matchup</div>
                                        </div>
                                    </div>
                                    <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.6', margin: '0 0 10px' }}>
                                        Fitur komparasi langsung 1 lawan 1 antara <strong>Perusahaan Anda</strong> (atau badan usaha pilihan) dengan <strong>Kompetitor Incaran</strong> yang pernah bertemu di lelang yang sama:
                                    </p>
                                    <ul style={{ margin: '0 0 10px', paddingLeft: '18px', color: '#cbd5e1', fontSize: '12px', lineHeight: '1.7' }}>
                                        <li><strong>Scoreboard Menang-Kalah:</strong> Rekor bentrok langsung (misal: <em>Perusahaan A 4 - 2 Perusahaan B</em>).</li>
                                        <li><strong>Selisih Harga Langsung:</strong> Rata-rata persentase selisih harga penawaran saat saling berhadapan.</li>
                                        <li><strong>Daftar Riwayat Lelang Bersama:</strong> Tabel histori paket lelang lengkap dengan nominal harga penawaran masing-masing.</li>
                                    </ul>
                                </div>

                                {/* 6. Audit Alasan Gugur */}
                                <div style={{ background: 'rgba(30, 41, 59, 0.45)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: '14px', padding: '20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                        <span style={{ fontSize: '20px' }}>❌</span>
                                        <div>
                                            <div style={{ color: '#ffffff', fontWeight: '700', fontSize: '15px' }}>6. Audit Alasan Gugur &amp; Catatan Pokja</div>
                                            <div style={{ color: '#f87171', fontSize: '11px', fontWeight: '600' }}>Disqualification Matrix &amp; Protest Intel</div>
                                        </div>
                                    </div>
                                    <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.6', margin: '0 0 10px' }}>
                                        Memetakan titik lemah dan penyebab keguguran kompetitor yang dievaluasi oleh Pokja Pemilihan:
                                    </p>
                                    <ul style={{ margin: '0 0 10px', paddingLeft: '18px', color: '#cbd5e1', fontSize: '12px', lineHeight: '1.7' }}>
                                        <li><strong>4 Pos Evaluasi:</strong> Administrasi, Teknis, Harga, dan Kualifikasi.</li>
                                        <li><strong>Catatan Asli Pokja:</strong> Alasan riil gugurnya penawaran (seperti: tidak melampirkan jaminan bank yang valid, sertifikat personil kedaluwarsa, atau analisa harga satuan timpang).</li>
                                    </ul>
                                    <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '10px 12px', borderRadius: '8px', fontSize: '12px', color: '#cbd5e1' }}>
                                        🛡️ <strong>Amunisi Sanggahan:</strong> Memastikan Anda memiliki data pendukung jika kompetitor yang memiliki catatan evaluasi bermasalah dimenangkan di lelang.
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Executive Dossier PDF & CSV Export */}
                            <div style={{
                                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7), rgba(20, 27, 48, 0.8))',
                                border: '1px solid rgba(236, 72, 153, 0.3)',
                                borderRadius: '16px',
                                padding: '22px 26px',
                                marginBottom: '28px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                flexWrap: 'wrap',
                                gap: '18px'
                            }}>
                                <div style={{ flex: '1 1 500px' }}>
                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(236, 72, 153, 0.15)', border: '1px solid rgba(236, 72, 153, 0.3)', padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700', color: '#f472b6', textTransform: 'uppercase', marginBottom: '8px' }}>
                                        📄 Executive Dossier Report
                                    </div>
                                    <h4 style={{ color: '#ffffff', fontSize: '17px', fontWeight: '700', margin: '0 0 6px' }}>
                                        Ekspor Dossier Intelijen Lengkap (Format PDF A4 &amp; Excel)
                                    </h4>
                                    <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0, lineHeight: '1.6' }}>
                                        Unduh dokumen dossier intelijen badan usaha dalam format berkas PDF A4 siap cetak hanya dalam 1 klik. Dilengkapi kartu legalitas, grafik rasio penawaran, daftar dinas langganan, dan catatan evaluasi Pokja untuk bahan pertimbangan direksi dalam rapat penentuan harga penawaran (<em>bidding meeting</em>).
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                    <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '8px 14px', borderRadius: '10px', fontSize: '12px', color: '#fca5a5', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <span>📄</span> PDF Dossier A4
                                    </div>
                                    <div style={{ background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.3)', padding: '8px 14px', borderRadius: '10px', fontSize: '12px', color: '#86efac', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <span>📊</span> Spreadsheet Excel
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: 3 Langkah Taktis Menggunakan Analisis Kompetitor */}
                            <h3 style={{ fontSize: '16px', color: '#ffffff', fontWeight: '700', marginBottom: '14px' }}>
                                3 Langkah Praktis Melakukan Riset Intelijen Lawan:
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
                                <div style={{ display: 'flex', gap: '14px', background: 'rgba(30, 41, 59, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '12px', padding: '16px' }}>
                                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#6366f1', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '13px', flexShrink: 0 }}>
                                        1
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>Cari Nama Perusahaan atau NPWP</div>
                                        <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.5' }}>
                                            Buka menu <strong>Analisis Kompetitor</strong>, ketik nama badan usaha atau nomor NPWP pada kotak pencarian, lalu klik tombol <em>Cari Kompetitor</em> atau pilih dari daftar pemenang lelang teratas.
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '14px', background: 'rgba(30, 41, 59, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '12px', padding: '16px' }}>
                                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#6366f1', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '13px', flexShrink: 0 }}>
                                        2
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>Eksplorasi Tab Analisis Mendalam</div>
                                        <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.5' }}>
                                            Pelajari tab <strong>Pola Penawaran &amp; HPS</strong> untuk mengetahui seberapa jauh lawan biasa memotong harga, periksa <strong>Sebaran Satker</strong> untuk mengetahui apakah dinas terkait adalah basis kekuasaannya, dan cek <strong>Rekanan &amp; KSO</strong> untuk melihat aliansi rekanannya.
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '14px', background: 'rgba(30, 41, 59, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '12px', padding: '16px' }}>
                                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#6366f1', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '13px', flexShrink: 0 }}>
                                        3
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>Lakukan Duel Head-to-Head &amp; Unduh Dossier PDF</div>
                                        <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.5' }}>
                                            Ketik nama perusahaan Anda di tab <strong>Head-to-Head</strong> untuk melihat perbandingan skor menang-kalah langsung, lalu klik tombol <strong>Unduh Dossier PDF</strong> untuk mencetak lembar intelijen resmi untuk rapat direksi.
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 4: Tips Strategis Memenangkan Tender */}
                            <div style={{ background: 'rgba(99, 102, 241, 0.08)', borderLeft: '4px solid #6366f1', padding: '18px 22px', borderRadius: '0 12px 12px 0', marginBottom: '28px' }}>
                                <div style={{ fontSize: '14px', fontWeight: '700', color: '#818cf8', marginBottom: '6px' }}>💡 Tips Strategis Menghadapi Kompetitor Tangguh:</div>
                                <div style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.7' }}>
                                    Sebelum memasukkan penawaran harga akhir di SPSE, periksa daftar peserta lelang yang telah memasukkan penawaran. Jika terdeteksi kompetitor bertipe <em>Banting Harga (&lt; 80% Pagu)</em> dengan Win Rate tinggi di satker tersebut, Anda dapat memilih antara:
                                    <ol style={{ margin: '6px 0 0', paddingLeft: '20px' }}>
                                        <li>Menyesuaikan kalkulasi penawaran agar mendekati <em>Winning Sweet Spot</em> lawan.</li>
                                        <li>Mengutamakan keunggulan dokumen teknis dan personil ahli yang tidak dapat disaingi oleh lawan.</li>
                                        <li>Mempersiapkan catatan sanggahan berdasarkan riwayat pos keguguran lawan di Pokja (misal: jaminan bank atau kualifikasi personil).</li>
                                    </ol>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                <button
                                    onClick={() => onNavigateTab && onNavigateTab('competitors')}
                                    className="btn-primary"
                                    style={{
                                        padding: '12px 24px',
                                        borderRadius: '12px',
                                        fontSize: '13.5px',
                                        fontWeight: '700',
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        boxShadow: '0 4px 16px rgba(99, 102, 241, 0.4)'
                                    }}
                                >
                                    <span>🏢</span> Buka Analisis Kompetitor Sekarang ➔
                                </button>
                            </div>
                        </div>
                    )}

                    {/* MODULE 5: EXPORT & EVALUATION */}
                    {activeModule === 'export' && (
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                <span style={{ fontSize: '28px' }}>📊</span>
                                <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                                    Ekspor Data &amp; Rapat Evaluasi Tender
                                </h2>
                            </div>
                            <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px' }}>
                                Jadikan data tender sebagai landasan pengambilan keputusan penawaran (Go / No-Go).
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
                                <div style={{ background: 'rgba(30, 41, 59, 0.4)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)', padding: '18px' }}>
                                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>Unduh Data Rekapitulasi</div>
                                    <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.6' }}>
                                        Gunakan fitur ekspor data lelang ke format spreadsheet Excel / CSV untuk dibagikan kepada tim estimator dan pimpinan proyek.
                                    </div>
                                </div>
                                <div style={{ background: 'rgba(30, 41, 59, 0.4)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)', padding: '18px' }}>
                                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>Folder Bookmarks Proyek Incaran</div>
                                    <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.6' }}>
                                        Tandai paket-paket bernilai strategis ke menu <strong>Saved Bookmarks</strong> agar tim Anda dapat memantau jadwal Aanwijzing dan batas upload dokumen tanpa terselip.
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => onNavigateTab && onNavigateTab('bookmarks')}
                                className="btn-primary"
                                style={{ padding: '10px 20px', borderRadius: '10px', fontSize: '13px', cursor: 'pointer' }}
                            >
                                Lihat Folder Saved Bookmarks ➔
                            </button>
                        </div>
                    )}

                    {/* MODULE 6: BILLING & COUPONS */}
                    {activeModule === 'billing' && (
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                <span style={{ fontSize: '28px' }}>💎</span>
                                <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                                    Akun, Paket Langganan &amp; Kupon Promo
                                </h2>
                            </div>
                            <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px' }}>
                                Kelola masa aktif akun Anda untuk memastikan pemantauan tender berjalan terus tanpa terputus.
                            </p>

                            <div style={{ background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '24px', marginBottom: '28px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                                    <div>
                                        <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Status Paket Akun Anda</div>
                                        <div style={{ fontSize: '20px', fontWeight: '800', color: '#ffffff', marginTop: '2px' }}>
                                            {currentUser?.plan_type === 'premium' ? '👑 Paket Premium VIP' : '⚡ Paket Trial / Eksplorasi'}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => onNavigateTab && onNavigateTab('billing')}
                                        style={{
                                            background: 'linear-gradient(135deg, #fbbf24, #d97706)',
                                            color: '#000',
                                            border: 'none',
                                            padding: '10px 18px',
                                            borderRadius: '10px',
                                            fontWeight: '800',
                                            fontSize: '13px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Upgrade / Perpanjang Paket ➔
                                    </button>
                                </div>
                                <div style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.6' }}>
                                    Pelanggan Premium mendapatkan kuota kata kunci tanpa batas, push notifikasi instan prioritas WhatsApp, serta akses penuh ke riwayat diskualifikasi kompetitor.
                                </div>
                            </div>

                            <h3 style={{ fontSize: '16px', color: '#ffffff', fontWeight: '700', marginBottom: '10px' }}>
                                Cara Klaim Kode Kupon Diskon:
                            </h3>
                            <p style={{ color: '#cbd5e1', fontSize: '13px', lineHeight: '1.6', marginBottom: '20px' }}>
                                Jika Anda memiliki kode kupon dari program kemitraan atau promo musiman, masukkan kode kupon tersebut di kolom checkout halaman <strong>Upgrade / Billing</strong> sebelum menyelesaikan pembayaran.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
