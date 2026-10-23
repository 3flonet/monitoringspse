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
