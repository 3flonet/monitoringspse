import React, { useState, useEffect } from 'react';

export default function UserOnboardingTour({ isOpen, onClose, onGoDocs }) {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        if (isOpen) {
            setCurrentStep(0);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const steps = [
        {
            icon: '🕵🏼‍♂️',
            badge: 'Langkah 1 dari 5 • Selamat Datang',
            title: 'Selamat Datang di Spy SPSE!',
            subtitle: 'Platform Intelijen & Radar Tender Pemerintah Terpadu',
            content: (
                <div>
                    <p style={{ color: '#cbd5e1', lineHeight: '1.7', fontSize: '14px', marginBottom: '16px' }}>
                        Spy SPSE dirancang khusus untuk membantu kontraktor, konsultan, dan vendor pengadaan memenangkan tender lelang pemerintah di seluruh Indonesia secara otomatis dan efisien.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
                        <div style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.25)', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
                            <div style={{ fontSize: '20px', marginBottom: '4px' }}>⚡</div>
                            <div style={{ fontSize: '12px', fontWeight: '700', color: '#818cf8' }}>Crawler Realtime</div>
                            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>Update lelang tiap jam</div>
                        </div>
                        <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
                            <div style={{ fontSize: '20px', marginBottom: '4px' }}>🏢</div>
                            <div style={{ fontSize: '12px', fontWeight: '700', color: '#34d399' }}>Ratusan LPSE</div>
                            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>K/L/Pemda se-Indonesia</div>
                        </div>
                        <div style={{ background: 'rgba(251, 191, 36, 0.1)', border: '1px solid rgba(251, 191, 36, 0.25)', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
                            <div style={{ fontSize: '20px', marginBottom: '4px' }}>🎯</div>
                            <div style={{ fontSize: '12px', fontWeight: '700', color: '#fbbf24' }}>Peluang Presisi</div>
                            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>Sesuai kata kunci Anda</div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            icon: '🎯',
            badge: 'Langkah 2 dari 5 • Radar Tender',
            title: 'Pasang Radar Kata Kunci Bisnis Anda',
            subtitle: 'Tak Perlu Membuka Ratusan Website LPSE Satu Per Satu',
            content: (
                <div>
                    <p style={{ color: '#cbd5e1', lineHeight: '1.7', fontSize: '14px', marginBottom: '14px' }}>
                        Daftarkan kata kunci produk atau jasa perusahaan Anda di menu <strong style={{ color: '#818cf8' }}>Peluang Anda</strong>. Sistem Spy SPSE akan terus memantau dan mengumpulkan tender baru yang cocok secara nonstop.
                    </p>
                    <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '14px', fontSize: '13px' }}>
                        <div style={{ color: '#94a3b8', fontWeight: '700', marginBottom: '6px', fontSize: '11px', textTransform: 'uppercase' }}>💡 Contoh Kata Kunci Efektif:</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            <span style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc', padding: '3px 8px', borderRadius: '4px', fontSize: '12px' }}>Konstruksi Gedung</span>
                            <span style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc', padding: '3px 8px', borderRadius: '4px', fontSize: '12px' }}>Pengadaan Komputer</span>
                            <span style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc', padding: '3px 8px', borderRadius: '4px', fontSize: '12px' }}>Jasa Keamanan</span>
                            <span style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc', padding: '3px 8px', borderRadius: '4px', fontSize: '12px' }}>Alat Kesehatan</span>
                        </div>
                    </div>
                </div>
            )
        },
        {
            icon: '📲',
            badge: 'Langkah 3 dari 5 • Notifikasi WhatsApp',
            title: 'Alert Realtime Langsung ke Ponsel',
            subtitle: 'Jangan Sampai Ketinggalan Jadwal Pengajuan Penawaran',
            content: (
                <div>
                    <p style={{ color: '#cbd5e1', lineHeight: '1.7', fontSize: '14px', marginBottom: '14px' }}>
                        Setiap ada tender yang cocok dengan kata kunci Anda atau terjadi pembaruan tahapan (seperti <em>Pengumuman Pascakualifikasi</em> atau <em>Download Dokumen Pemilihan</em>), notifikasi langsung meluncur ke WhatsApp Anda.
                    </p>
                    <div style={{ background: 'rgba(6, 78, 59, 0.25)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '10px', padding: '14px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <div style={{ fontSize: '24px' }}>💬</div>
                        <div style={{ fontSize: '12px', color: '#a7f3d0', lineHeight: '1.6' }}>
                            <strong>Format WhatsApp Otomatis:</strong><br />
                            Berisi Nama Paket, Nilai Pagu Anggaran, Instansi Pengadaan, Tenggat Waktu Penawaran, dan Link Langsung ke Portal SPSE terkait.
                        </div>
                    </div>
                </div>
            )
        },
        {
            icon: '👥',
            badge: 'Langkah 4 dari 5 • Analisis Kompetitor',
            title: 'Market Intelligence & Profil Lawan',
            subtitle: 'Riset Strategis Track Record Badan Usaha Pesaing',
            content: (
                <div>
                    <p style={{ color: '#cbd5e1', lineHeight: '1.7', fontSize: '14px', marginBottom: '14px' }}>
                        Ingin tahu siapa lawan tangguh di tender yang Anda incar? Buka menu <strong style={{ color: '#fbbf24' }}>Analisis Kompetitor</strong>, masukkan nama PT/CV atau NPWP mereka.
                    </p>
                    <ul style={{ paddingLeft: '20px', color: '#cbd5e1', fontSize: '13px', lineHeight: '1.8', margin: 0 }}>
                        <li>Pantau rasio kemenangan (<strong style={{ color: '#fbbf24' }}>Win Rate</strong>) lawan.</li>
                        <li>Cek instansi pemerintah mana saja yang sering dimenangkan lawan.</li>
                        <li>Teliti alasan diskualifikasi lawan agar perusahaan Anda tidak mengulangi kesalahan serupa.</li>
                    </ul>
                </div>
            )
        },
        {
            icon: '🚀',
            badge: 'Langkah 5 dari 5 • Siap Beraksi!',
            title: 'Anda Siap Menangkan Tender!',
            subtitle: 'Kuasai Informasi, Pasang Penawaran Terbaik, Raih Kemenangan',
            content: (
                <div>
                    <p style={{ color: '#cbd5e1', lineHeight: '1.7', fontSize: '14px', marginBottom: '16px' }}>
                        Platform Spy SPSE siap mendukung pertumbuhan bisnis Anda. Jika membutuhkan panduan lengkap, tips menang tender, atau troubleshooting notifikasi, kunjungi menu <strong style={{ color: '#818cf8' }}>Panduan & Dokumentasi</strong> kapan saja.
                    </p>
                    <div style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(16, 185, 129, 0.1))', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>
                            Siap memulai eksplorasi tender hari ini?
                        </div>
                        <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                            Pilih tombol di bawah untuk langsung menuju aplikasi atau pelajari panduan mendalam.
                        </div>
                    </div>
                </div>
            )
        }
    ];

    const isLastStep = currentStep === steps.length - 1;
    const currentData = steps[currentStep];

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(2, 6, 23, 0.82)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            animation: 'fadeIn 0.2s ease-out'
        }}>
            <div style={{
                background: 'linear-gradient(145deg, #1e293b, #0f172a)',
                border: '1px solid rgba(99, 102, 241, 0.35)',
                borderRadius: '24px',
                width: '100%',
                maxWidth: '560px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(99, 102, 241, 0.15)',
                overflow: 'hidden',
                position: 'relative'
            }}>
                {/* Header Bar */}
                <div style={{
                    padding: '24px 28px 16px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <span style={{
                        fontSize: '11px',
                        fontWeight: '800',
                        color: '#818cf8',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        background: 'rgba(99, 102, 241, 0.12)',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        border: '1px solid rgba(99, 102, 241, 0.25)'
                    }}>
                        {currentData.badge}
                    </span>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#94a3b8',
                            fontSize: '13px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            transition: 'color 0.15s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                        onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
                    >
                        Lewati Tur ✕
                    </button>
                </div>

                {/* Body Content */}
                <div style={{ padding: '28px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                        <div style={{
                            fontSize: '36px',
                            background: 'rgba(255, 255, 255, 0.04)',
                            width: '60px',
                            height: '60px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '16px',
                            border: '1px solid rgba(255, 255, 255, 0.08)'
                        }}>
                            {currentData.icon}
                        </div>
                        <div>
                            <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#ffffff', margin: 0, fontFamily: "'Outfit', sans-serif" }}>
                                {currentData.title}
                            </h2>
                            <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>
                                {currentData.subtitle}
                            </div>
                        </div>
                    </div>

                    <div style={{ minHeight: '170px', marginTop: '16px' }}>
                        {currentData.content}
                    </div>
                </div>

                {/* Footer Controls */}
                <div style={{
                    padding: '18px 28px 24px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                    background: 'rgba(15, 23, 42, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px'
                }}>
                    {/* Dots Indicator */}
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        {steps.map((_, sIdx) => (
                            <button
                                key={sIdx}
                                onClick={() => setCurrentStep(sIdx)}
                                style={{
                                    width: currentStep === sIdx ? '22px' : '8px',
                                    height: '8px',
                                    borderRadius: '4px',
                                    background: currentStep === sIdx ? '#6366f1' : 'rgba(255, 255, 255, 0.15)',
                                    border: 'none',
                                    padding: 0,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                                title={`Langkah ${sIdx + 1}`}
                            />
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        {currentStep > 0 && (
                            <button
                                onClick={() => setCurrentStep(prev => prev - 1)}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.06)',
                                    color: '#cbd5e1',
                                    border: '1px solid rgba(255, 255, 255, 0.12)',
                                    padding: '8px 16px',
                                    borderRadius: '10px',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}
                            >
                                ← Kembali
                            </button>
                        )}

                        {!isLastStep ? (
                            <button
                                onClick={() => setCurrentStep(prev => prev + 1)}
                                style={{
                                    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                                    color: '#ffffff',
                                    border: 'none',
                                    padding: '8px 20px',
                                    borderRadius: '10px',
                                    fontSize: '13px',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
                                }}
                            >
                                Lanjut →
                            </button>
                        ) : (
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                    onClick={onClose}
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.08)',
                                        color: '#ffffff',
                                        border: '1px solid rgba(255, 255, 255, 0.18)',
                                        padding: '9px 16px',
                                        borderRadius: '10px',
                                        fontSize: '13px',
                                        fontWeight: '700',
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }}
                                >
                                    Paham &amp; Mulai 🚀
                                </button>
                                <button
                                    onClick={onGoDocs}
                                    style={{
                                        background: 'linear-gradient(135deg, #10b981, #059669)',
                                        color: '#ffffff',
                                        border: 'none',
                                        padding: '9px 18px',
                                        borderRadius: '10px',
                                        fontSize: '13px',
                                        fontWeight: '700',
                                        cursor: 'pointer',
                                        boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }}
                                >
                                    Pelajari Lebih Lanjut 📚
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
