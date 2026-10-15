import React, { useState } from 'react';

export default function UserDocumentation({ onOpenTour, onNavigateTab, currentUser }) {
    const [activeModule, setActiveModule] = useState('quickstart');
    const [searchQuery, setSearchQuery] = useState('');

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
            title: '3. Notifikasi WhatsApp & Alerts',
            badge: 'Realtime',
            description: 'Integrasi WhatsApp Gateway, struktur pesan alert, dan tips troubleshooting.'
        },
        {
            id: 'competitor',
            icon: '👥',
            title: '4. Analisis Kompetitor & Lawan',
            badge: 'Intelijen',
            description: 'Riset track record, Win Rate kompetitor, dan audit alasan diskualifikasi.'
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
        <div style={{ maxWidth: '1300px', margin: '0 auto', paddingBottom: '60px' }}>
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
            <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px', alignItems: 'flex-start' }}>
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
                            onClick={() => onNavigateTab && onNavigateTab('alerts')}
                            style={{
                                width: '100%',
                                padding: '8px',
                                background: 'rgba(16, 185, 129, 0.15)',
                                color: '#34d399',
                                border: '1px solid rgba(16, 185, 129, 0.3)',
                                borderRadius: '8px',
                                fontSize: '12px',
                                fontWeight: '700',
                                cursor: 'pointer'
                            }}
                        >
                            Hubungi Dukungan CS 💬
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
                                            Kunjungi menu <strong>Peluang Anda</strong> dan tambahkan kata kunci pengadaan yang ingin Anda buru, misalnya: <em>Konstruksi, Renovasi, Pengadaan Laptop, Catering, Konsultansi</em>.
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
                                    onClick={() => onNavigateTab && onNavigateTab('keyword-tenders')}
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

                    {/* MODULE 3: NOTIFIKASI WHATSAPP */}
                    {activeModule === 'alerts' && (
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                <span style={{ fontSize: '28px' }}>📲</span>
                                <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                                    Notifikasi WhatsApp &amp; Format Alert
                                </h2>
                            </div>
                            <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px' }}>
                                Sistem otomatis kami mengirimkan ringkasan tender begitu terdeteksi oleh mesin scraper.
                            </p>

                            {/* WhatsApp Message Simulation */}
                            <div style={{ maxWidth: '440px', background: '#0b141a', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '18px', marginBottom: '28px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '10px' }}>
                                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#25d366', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                                        🕵🏼‍♂️
                                    </div>
                                    <div>
                                        <div style={{ color: '#fff', fontSize: '13px', fontWeight: '700' }}>Spy SPSE Alert Gateway</div>
                                        <div style={{ color: '#25d366', fontSize: '11px' }}>Online • Notifikasi Otomatis</div>
                                    </div>
                                </div>

                                <div style={{ background: '#202c33', borderRadius: '8px 8px 8px 0', padding: '14px', color: '#e9edef', fontSize: '12px', lineHeight: '1.6', fontFamily: 'system-ui, sans-serif' }}>
                                    <div>🚨 <strong>PELUANG TENDER BARU TERDETEKSI</strong></div>
                                    <div style={{ margin: '8px 0', borderTop: '1px dashed rgba(255,255,255,0.15)', paddingTop: '8px' }}>
                                        📦 <strong>Paket:</strong> Pembangunan Gedung Laboratorium Terpadu<br />
                                        🏢 <strong>Instansi:</strong> Universitas Indonesia<br />
                                        💰 <strong>Pagu:</strong> Rp 4.850.000.000,00<br />
                                        🏷️ <strong>Jenis:</strong> Pekerjaan Konstruksi<br />
                                        ⏳ <strong>Akhir Penawaran:</strong> 25 Okt 2026 15:00 WIB<br />
                                        🎯 <strong>Kata Kunci:</strong> <em>Konstruksi Gedung</em>
                                    </div>
                                    <div style={{ marginTop: '8px', color: '#53bdeb' }}>
                                        🔗 Buka langsung di SPSE: <span style={{ textDecoration: 'underline' }}>spse.inaproc.id/ui/lelang/109823000</span>
                                    </div>
                                    <div style={{ textAlign: 'right', fontSize: '10px', color: '#8696a0', marginTop: '6px' }}>14:32 ✔️✔️</div>
                                </div>
                            </div>

                            <h3 style={{ fontSize: '16px', color: '#ffffff', fontWeight: '700', marginBottom: '10px' }}>
                                Panduan Troubleshooting Notifikasi WhatsApp:
                            </h3>
                            <ul style={{ color: '#cbd5e1', fontSize: '13px', lineHeight: '1.8', paddingLeft: '20px', marginBottom: '24px' }}>
                                <li>Pastikan nomor WhatsApp Anda aktif dan dapat menerima pesan dari nomor bisnis baru.</li>
                                <li>Jika berganti nomor WhatsApp, Anda dapat memperbaruinya di menu <strong>Profil Akun</strong>.</li>
                                <li>Pesan notifikasi dikirimkan setiap kali crawler mendeteksi pengadaan yang cocok dengan kata kunci Anda.</li>
                            </ul>

                            <button
                                onClick={() => onNavigateTab && onNavigateTab('alerts')}
                                className="btn-primary"
                                style={{ padding: '10px 20px', borderRadius: '10px', fontSize: '13px', cursor: 'pointer' }}
                            >
                                Kelola Notifikasi &amp; WhatsApp ➔
                            </button>
                        </div>
                    )}

                    {/* MODULE 4: COMPETITOR ANALYSIS */}
                    {activeModule === 'competitor' && (
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                <span style={{ fontSize: '28px' }}>👥</span>
                                <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                                    Market Intelligence &amp; Analisis Lawan
                                </h2>
                            </div>
                            <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px' }}>
                                Gunakan data historis lelang untuk mengetahui kekuatan dan kelemahan badan usaha pesaing Anda.
                            </p>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                                <div style={{ background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '18px' }}>
                                    <div style={{ fontSize: '22px', marginBottom: '6px' }}>🏆</div>
                                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>Win Success Rate</div>
                                    <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.5' }}>
                                        Mengetahui seberapa agresif dan efektif lawan dalam memenangkan tender yang mereka ikuti.
                                    </div>
                                </div>
                                <div style={{ background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '18px' }}>
                                    <div style={{ fontSize: '22px', marginBottom: '6px' }}>🏢</div>
                                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>Dominasi Instansi</div>
                                    <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.5' }}>
                                        Memetakan instansi K/L/Pemda mana saja yang menjadi "kandang" atau langganan dari badan usaha tersebut.
                                    </div>
                                </div>
                                <div style={{ background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '18px' }}>
                                    <div style={{ fontSize: '22px', marginBottom: '6px' }}>⚠️</div>
                                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>Audit Diskualifikasi</div>
                                    <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.5' }}>
                                        Membaca catatan Pokja mengapa lawan digugurkan (kesalahan dokumen teknis, jaminan penawaran, dll).
                                    </div>
                                </div>
                            </div>

                            <div style={{ background: 'rgba(99, 102, 241, 0.08)', borderLeft: '4px solid #6366f1', padding: '16px 20px', borderRadius: '0 12px 12px 0', marginBottom: '28px' }}>
                                <div style={{ fontSize: '13px', fontWeight: '700', color: '#818cf8', marginBottom: '4px' }}>💡 Trik Pemenang Tender:</div>
                                <div style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.6' }}>
                                    Sebelum memasukkan dokumen penawaran harga akhir, cek apakah ada kompetitor besar dengan win-rate di atas 70% yang ikut mendaftar. Anda bisa menyesuaikan estimasi margin dan kelengkapan lampiran teknis untuk mengungguli mereka.
                                </div>
                            </div>

                            <button
                                onClick={() => onNavigateTab && onNavigateTab('competitors')}
                                className="btn-primary"
                                style={{ padding: '10px 20px', borderRadius: '10px', fontSize: '13px', cursor: 'pointer' }}
                            >
                                Cari Profil Kompetitor Sekarang ➔
                            </button>
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
