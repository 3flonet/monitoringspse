import React, { useState, useEffect, useRef, useCallback } from 'react';

export default function UserOnboardingTour({ isOpen, activeTab, onNavigate, onClose, onGoDocs }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [targetRect, setTargetRect] = useState(null);
    const [sidebarMenuRect, setSidebarMenuRect] = useState(null);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const pollIntervalRef = useRef(null);

    const menuMetadata = {
        'alerts': { icon: '🔔', label: 'Alerts Notifikasi' },
        'keyword-tenders': { icon: '🎯', label: 'Peluang Anda' },
        'competitors': { icon: '👥', label: 'Analisis Kompetitor' },
        'docs': { icon: '📚', label: 'Panduan & Dokumentasi' },
        'dashboard': { icon: '📊', label: 'Dashboard' }
    };

    const steps = [
        {
            tab: 'alerts',
            selector: '[data-tour="alerts-stats"]',
            icon: '📊',
            badge: 'Langkah 1 dari 6 • Status Radar Notifikasi',
            title: 'Pantau Status Pemantauan & Notifikasi',
            subtitle: 'Ringkasan kata kunci aktif, kuota paket, dan status kanal notifikasi',
            description: 'Di sini Anda dapat melihat akumulasi kata kunci yang sedang aktif dipantau, jangkauan K/L/Pemda/LPSE sasaran (hingga ratusan LPSE se-Indonesia), serta status pengiriman notifikasi instan melalui Email & WhatsApp 24/7.',
            bullets: [
                'Kata Kunci Aktif: Menghitung semua frasa spesialisasi tender Anda.',
                'Saluran Notifikasi: Terintegrasi otomatis ke Email & nomor WhatsApp Anda.',
                'Status Kuota: Menyesuaikan dengan paket akun (Trial 1 kata kunci / Premium Unlimited).'
            ]
        },
        {
            tab: 'alerts',
            selector: '[data-tour="alerts-create-form"]',
            icon: '🎯',
            badge: 'Langkah 2 dari 6 • Pasang Kata Kunci Baru',
            title: 'Buat Radar Pemantauan Baru',
            subtitle: 'Daftarkan kata kunci spesifik dan tentukan target instansi LPSE',
            description: 'Gunakan formulir ini untuk mendaftarkan radar lelang baru. Anda bisa memasukkan beberapa kata kunci sekaligus (pisahkan dengan koma), memilih target instansi tertentu, atau memantau Seluruh LPSE di Indonesia sekaligus.',
            bullets: [
                'Multi Keyword: Contoh: "komputer, laptop, printer, server".',
                'Filter Pagu: Tentukan batas minimum/maksimum anggaran lelang sesuai kapasitas perusahaan.',
                'Target LPSE Fleksibel: Pilih LPSE domisili instansi atau opsi "Semua LPSE".'
            ]
        },
        {
            tab: 'alerts',
            selector: '[data-tour="alerts-list"]',
            icon: '📋',
            badge: 'Langkah 3 dari 6 • Kelola Alert Aktif',
            title: 'Daftar Radar & Notifikasi Aktif',
            subtitle: 'Kontrol penuh kata kunci yang sedang diproses oleh sistem',
            description: 'Semua pemantauan yang telah Anda buat tersusun rapi di sini. Anda dapat menguji pengiriman alert ke WhatsApp/Email, menonaktifkan sementara, atau menghapus kata kunci yang sudah tidak dibutuhkan kapan saja.',
            bullets: [
                'Uji Notifikasi: Klik tombol tes untuk memastikan WhatsApp Anda menerima alert secara realtime.',
                'Kelola Fleksibel: Ubah atau hapus kata kunci yang sudah selesai dipantau.'
            ]
        },
        {
            tab: 'keyword-tenders',
            selector: '[data-tour="keyword-tenders-table"]',
            icon: '⚡',
            badge: 'Langkah 4 dari 6 • Feed Peluang Anda',
            title: 'Daftar Tender Sesuai Spesialisasi',
            subtitle: 'Ribuan lelang LPSE disaring khusus sesuai radar bisnis Anda',
            description: 'Halaman ini adalah feed peluang tender Anda! Sistem secara otomatis mengumpulkan paket pengadaan dari seluruh LPSE yang namanya cocok dengan kata kunci Anda, lengkap dengan nilai pagu, instansi, dan tahapan lelang.',
            bullets: [
                'Penyaringan Otomatis: Tak perlu lagi membuka ratusan website LPSE satu per satu.',
                'Klik Detail: Klik nama tender untuk melihat syarat kualifikasi, jadwal, dan link LPSE resmi.'
            ]
        },
        {
            tab: 'competitors',
            selector: '[data-tour="competitor-search-box"]',
            icon: '🕵🏼‍♂️',
            badge: 'Langkah 5 dari 6 • Intelijen Kompetitor',
            title: 'Bedah Rekam Jejak Kompetitor Lelang',
            subtitle: 'Intip kekuatan, win-rate, dan strategi lawan tender Anda',
            description: 'Ketahui siapa saja lawan tanding Anda di medan tender lelang pemerintah. Masukkan nama PT atau CV kompetitor untuk membedah seberapa sering mereka menang lelang, instansi langganan mereka, dan track record penawarannya.',
            bullets: [
                'Pencarian Instan: Cukup ketik nama badan usaha atau nomor NPWP.',
                'Analisis Kemenangan: Pantau Win Rate %, total pagu yang dimenangkan, dan riwayat tender.'
            ]
        },
        {
            tab: 'docs',
            selector: '[data-tour="docs-header"]',
            icon: '📚',
            badge: 'Langkah 6 dari 6 • Pusat Panduan Lengkap',
            title: 'Pusat Panduan & Siap Menangkan Tender! 🏆',
            subtitle: 'Playbook strategi kata kunci, bedah dokumen lelang, dan trik kualifikasi',
            description: 'Selamat! Anda telah memahami fitur-fitur inti Spy SPSE. Untuk memaksimalkan peluang kemenangan tender lelang Anda, pelajari panduan mendalam kami tentang riset HPS, strategi kata kunci turunan, dan trik menembus kualifikasi teknis.',
            bullets: [
                '6 Modul Panduan Praktis: Mulai dari setup pemula hingga taktik lanjutan kontraktor.',
                'AI Assistant 24/7: Butuh bantuan kilat? Gunakan tombol Chatbot di pojok kanan bawah.'
            ]
        }
    ];

    const currentStepData = steps[currentStep];

    // Measure target element position & active sidebar menu
    const updatePosition = useCallback(() => {
        if (!isOpen) return;
        const step = steps[currentStep];
        if (!step) return;

        // Measure sidebar menu item for active tab
        const menuEl = document.querySelector(`[data-tour-menu="${step.tab}"]`);
        if (menuEl) {
            const mRect = menuEl.getBoundingClientRect();
            if (mRect.width > 0 && mRect.height > 0 && mRect.left >= 0 && mRect.top >= 0) {
                setSidebarMenuRect({
                    top: mRect.top,
                    left: mRect.left,
                    width: mRect.width,
                    height: mRect.height
                });
            } else {
                setSidebarMenuRect(null);
            }
        } else {
            setSidebarMenuRect(null);
        }

        const el = document.querySelector(step.selector);
        if (el) {
            const rect = el.getBoundingClientRect();
            // Only update if visible
            if (rect.width > 0 && rect.height > 0) {
                setTargetRect({
                    top: rect.top,
                    left: rect.left,
                    width: rect.width,
                    height: rect.height,
                    bottom: rect.bottom,
                    right: rect.right
                });
                return true;
            }
        }
        return false;
    }, [isOpen, currentStep]);

    // Handle tab navigation & element discovery when step changes
    useEffect(() => {
        if (!isOpen) {
            setTargetRect(null);
            setSidebarMenuRect(null);
            return;
        }

        const step = steps[currentStep];
        if (!step) return;

        setIsTransitioning(true);

        // Check if tab needs to change
        if (onNavigate && activeTab !== step.tab) {
            onNavigate(step.tab);
        }

        if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
        }

        let attempts = 0;
        const maxAttempts = 25; // 25 * 70ms = 1.75s

        pollIntervalRef.current = setInterval(() => {
            attempts++;
            const el = document.querySelector(step.selector);
            if (el) {
                clearInterval(pollIntervalRef.current);
                pollIntervalRef.current = null;

                // Smooth scroll element to center of screen
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });

                // Allow scroll animation to settle before getting exact coordinates
                setTimeout(() => {
                    updatePosition();
                    setIsTransitioning(false);
                }, 280);
            } else if (attempts >= maxAttempts) {
                clearInterval(pollIntervalRef.current);
                pollIntervalRef.current = null;
                // Fallback to center screen if element not found
                setTargetRect(null);
                setIsTransitioning(false);
            }
        }, 70);

        return () => {
            if (pollIntervalRef.current) {
                clearInterval(pollIntervalRef.current);
            }
        };
    }, [currentStep, isOpen]);

    // Scroll and resize listeners to keep spotlight aligned
    useEffect(() => {
        if (!isOpen) return;

        const handleScrollOrResize = () => {
            updatePosition();
        };

        window.addEventListener('resize', handleScrollOrResize);
        window.addEventListener('scroll', handleScrollOrResize, true);

        return () => {
            window.removeEventListener('resize', handleScrollOrResize);
            window.removeEventListener('scroll', handleScrollOrResize, true);
        };
    }, [isOpen, updatePosition]);

    // Keyboard navigation
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onClose();
            } else if (e.key === 'ArrowRight') {
                if (currentStep < steps.length - 1) {
                    setCurrentStep((prev) => prev + 1);
                }
            } else if (e.key === 'ArrowLeft') {
                if (currentStep > 0) {
                    setCurrentStep((prev) => prev - 1);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, currentStep, onClose]);

    if (!isOpen) return null;

    // Calculate Tooltip Coordinates & Arrow Placement
    const isFinalStep = currentStep === steps.length - 1;
    const tooltipWidth = Math.min(500, window.innerWidth - 32);
    const estimatedHeight = 360;

    let tooltipStyle = {};
    let arrowStyle = {};

    if (targetRect) {
        const spaceBelow = window.innerHeight - targetRect.bottom;
        const spaceAbove = targetRect.top;
        const placeBelow = spaceBelow >= 300 || spaceBelow >= spaceAbove;

        // Tooltip horizontal center alignment with target
        let left = targetRect.left + targetRect.width / 2 - tooltipWidth / 2;
        left = Math.max(16, Math.min(window.innerWidth - tooltipWidth - 16, left));

        // Arrow relative horizontal offset
        const targetCenterX = targetRect.left + targetRect.width / 2;
        const arrowLeft = Math.max(24, Math.min(tooltipWidth - 24, targetCenterX - left));

        if (placeBelow) {
            const top = Math.min(window.innerHeight - estimatedHeight - 16, targetRect.bottom + 16);
            tooltipStyle = {
                position: 'fixed',
                top: `${Math.max(16, top)}px`,
                left: `${left}px`,
                width: `${tooltipWidth}px`
            };
            arrowStyle = {
                top: '-8px',
                left: `${arrowLeft}px`,
                transform: 'translateX(-50%) rotate(45deg)',
                borderTop: '1px solid rgba(56, 189, 248, 0.5)',
                borderLeft: '1px solid rgba(56, 189, 248, 0.5)'
            };
        } else {
            const top = Math.max(16, targetRect.top - estimatedHeight - 16);
            tooltipStyle = {
                position: 'fixed',
                top: `${top}px`,
                left: `${left}px`,
                width: `${tooltipWidth}px`
            };
            arrowStyle = {
                bottom: '-8px',
                left: `${arrowLeft}px`,
                transform: 'translateX(-50%) rotate(45deg)',
                borderBottom: '1px solid rgba(56, 189, 248, 0.5)',
                borderRight: '1px solid rgba(56, 189, 248, 0.5)'
            };
        }
    } else {
        // Fallback: Centered Modal
        tooltipStyle = {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: `${tooltipWidth}px`
        };
    }

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999990, pointerEvents: 'none' }}>
            {/* Backdrop click blocker */}
            <div
                style={{
                    position: 'fixed',
                    inset: 0,
                    pointerEvents: 'auto',
                    cursor: 'default'
                }}
            />

            {/* Spotlight Cutout Overlay */}
            {targetRect ? (
                <div
                    style={{
                        position: 'fixed',
                        top: `${Math.max(0, targetRect.top - 8)}px`,
                        left: `${Math.max(0, targetRect.left - 8)}px`,
                        width: `${targetRect.width + 16}px`,
                        height: `${targetRect.height + 16}px`,
                        borderRadius: '16px',
                        border: '2px solid #38bdf8',
                        background: 'radial-gradient(ellipse at center, rgba(56, 189, 248, 0.08) 0%, rgba(99, 102, 241, 0.04) 75%, transparent 100%)',
                        animation: 'tourSpotlightPulse 2.4s ease-in-out infinite',
                        pointerEvents: 'none',
                        transition: isTransitioning
                            ? 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                            : 'top 0.15s ease-out, left 0.15s ease-out, width 0.15s ease-out, height 0.15s ease-out',
                        zIndex: 999992
                    }}
                >
                    {/* Floating Glow Badge at Top-Left of Cutout */}
                    <div
                        style={{
                            position: 'absolute',
                            top: '-13px',
                            left: '18px',
                            background: 'linear-gradient(135deg, #0284c7, #6366f1)',
                            color: '#ffffff',
                            fontSize: '11px',
                            fontWeight: '800',
                            padding: '3px 12px',
                            borderRadius: '20px',
                            boxShadow: '0 4px 15px rgba(56, 189, 248, 0.6)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            letterSpacing: '0.5px',
                            textTransform: 'uppercase',
                            fontFamily: "'Outfit', sans-serif"
                        }}
                    >
                        <span style={{ position: 'relative', display: 'flex', width: '7px', height: '7px' }}>
                            <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#38bdf8', animation: 'tourPing 1.5s cubic-bezier(0, 0, 0.2, 1) infinite' }}></span>
                            <span style={{ position: 'relative', width: '7px', height: '7px', borderRadius: '50%', background: '#ffffff' }}></span>
                        </span>
                        Area Yang Disorot
                    </div>
                </div>
            ) : (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(2, 6, 23, 0.92)',
                        backdropFilter: 'blur(5px)',
                        transition: 'opacity 0.3s ease',
                        zIndex: 999992
                    }}
                />
            )}

            {/* Sidebar Active Menu Spotlight Highlight */}
            {sidebarMenuRect && menuMetadata[currentStepData.tab] && (
                <div
                    style={{
                        position: 'fixed',
                        top: `${sidebarMenuRect.top}px`,
                        left: `${sidebarMenuRect.left}px`,
                        width: `${sidebarMenuRect.width}px`,
                        height: `${sidebarMenuRect.height}px`,
                        borderRadius: '10px',
                        background: 'linear-gradient(90deg, rgba(56, 189, 248, 0.28), rgba(99, 102, 241, 0.38))',
                        border: '2px solid #38bdf8',
                        boxShadow: '0 0 25px rgba(56, 189, 248, 0.75), inset 0 0 15px rgba(56, 189, 248, 0.3)',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 16px',
                        fontSize: '15px',
                        fontWeight: '700',
                        zIndex: 999994,
                        pointerEvents: 'none',
                        animation: 'tourMenuPulse 2.4s ease-in-out infinite',
                        transition: 'top 0.2s ease, left 0.2s ease, width 0.2s ease, height 0.2s ease',
                        fontFamily: "'Inter', sans-serif"
                    }}
                >
                    <span style={{ fontSize: '18px' }}>{menuMetadata[currentStepData.tab].icon}</span>
                    <span style={{ color: '#ffffff', letterSpacing: '0.2px' }}>{menuMetadata[currentStepData.tab].label}</span>
                    <span
                        style={{
                            marginLeft: 'auto',
                            fontSize: '10px',
                            background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
                            color: '#070a13',
                            fontWeight: '900',
                            padding: '2px 8px',
                            borderRadius: '10px',
                            letterSpacing: '0.5px',
                            textTransform: 'uppercase',
                            boxShadow: '0 2px 8px rgba(56, 189, 248, 0.5)'
                        }}
                    >
                        Menu Aktif
                    </span>
                </div>
            )}

            {/* Floating Tooltip Card */}
            <div
                style={{
                    ...tooltipStyle,
                    zIndex: 999995,
                    pointerEvents: 'auto',
                    background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(20, 27, 48, 0.98))',
                    border: '1px solid rgba(56, 189, 248, 0.4)',
                    borderRadius: '18px',
                    padding: '24px 26px',
                    boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 30px rgba(99, 102, 241, 0.2)',
                    backdropFilter: 'blur(16px)',
                    animation: 'tourFadeIn 0.3s ease-out forwards',
                    color: '#f8fafc',
                    fontFamily: "'Inter', sans-serif"
                }}
            >
                {/* Arrow Pointer */}
                {targetRect && (
                    <div
                        style={{
                            position: 'absolute',
                            width: '16px',
                            height: '16px',
                            background: '#141b30',
                            zIndex: 1,
                            ...arrowStyle
                        }}
                    />
                )}

                {/* Top Bar: Icon, Badge, and Skip Button */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '24px' }}>{currentStepData.icon}</span>
                        <span
                            style={{
                                background: 'rgba(99, 102, 241, 0.18)',
                                border: '1px solid rgba(99, 102, 241, 0.35)',
                                color: '#a5b4fc',
                                fontSize: '11px',
                                fontWeight: '700',
                                padding: '4px 10px',
                                borderRadius: '20px',
                                letterSpacing: '0.3px',
                                textTransform: 'uppercase'
                            }}
                        >
                            {currentStepData.badge}
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        title="Lewati Tur Pengenalan"
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#94a3b8',
                            fontSize: '12px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            transition: 'color 0.2s ease, background 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#ef4444';
                            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.color = '#94a3b8';
                            e.currentTarget.style.background = 'transparent';
                        }}
                    >
                        <span>✕</span> Lewati Tur
                    </button>
                </div>

                {/* Step Title & Subtitle */}
                <h3
                    style={{
                        margin: '0 0 6px',
                        fontSize: '18px',
                        fontWeight: '800',
                        color: '#ffffff',
                        fontFamily: "'Outfit', sans-serif",
                        lineHeight: '1.3'
                    }}
                >
                    {currentStepData.title}
                </h3>
                <p style={{ margin: '0 0 14px', fontSize: '12px', color: '#818cf8', fontWeight: '600' }}>
                    {currentStepData.subtitle}
                </p>

                {/* Description */}
                <p style={{ margin: '0 0 14px', fontSize: '13px', color: '#cbd5e1', lineHeight: '1.6' }}>
                    {currentStepData.description}
                </p>

                {/* Bullets */}
                {currentStepData.bullets && currentStepData.bullets.length > 0 && (
                    <div
                        style={{
                            background: 'rgba(15, 23, 42, 0.6)',
                            border: '1px solid rgba(255, 255, 255, 0.06)',
                            borderRadius: '12px',
                            padding: '12px 14px',
                            marginBottom: '18px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px'
                        }}
                    >
                        {currentStepData.bullets.map((b, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12px', color: '#94a3b8', lineHeight: '1.4' }}>
                                <span style={{ color: '#10b981', fontSize: '12px', marginTop: '1px' }}>✔</span>
                                <span>{b}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Progress Dots */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '18px' }}>
                    {steps.map((s, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentStep(idx)}
                            title={s.title}
                            style={{
                                flex: 1,
                                height: '5px',
                                borderRadius: '10px',
                                border: 'none',
                                background: idx === currentStep ? '#6366f1' : idx < currentStep ? 'rgba(99, 102, 241, 0.5)' : 'rgba(255, 255, 255, 0.12)',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                padding: 0
                            }}
                        />
                    ))}
                </div>

                {/* Bottom Navigation Buttons */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                    <button
                        onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
                        disabled={currentStep === 0}
                        style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: currentStep === 0 ? '#475569' : '#cbd5e1',
                            padding: '10px 16px',
                            borderRadius: '10px',
                            fontSize: '13px',
                            fontWeight: '600',
                            cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        ← Sebelumnya
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                        {!isFinalStep ? (
                            <button
                                onClick={() => setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1))}
                                style={{
                                    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                                    border: 'none',
                                    color: '#ffffff',
                                    padding: '10px 20px',
                                    borderRadius: '10px',
                                    fontSize: '13px',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-1px)';
                                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(99, 102, 241, 0.6)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(99, 102, 241, 0.4)';
                                }}
                            >
                                Selanjutnya →
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={() => {
                                        onClose();
                                        if (onNavigate) {
                                            onNavigate('dashboard');
                                        }
                                    }}
                                    style={{
                                        background: 'linear-gradient(135deg, #10b981, #059669)',
                                        border: 'none',
                                        color: '#ffffff',
                                        padding: '10px 18px',
                                        borderRadius: '10px',
                                        fontSize: '13px',
                                        fontWeight: '700',
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        boxShadow: '0 4px 15px rgba(16, 185, 129, 0.35)',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-1px)';
                                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.5)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.35)';
                                    }}
                                >
                                    Paham &amp; Siap Mulai 🚀
                                </button>
                                <button
                                    onClick={onGoDocs}
                                    style={{
                                        background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                                        border: 'none',
                                        color: '#ffffff',
                                        padding: '10px 18px',
                                        borderRadius: '10px',
                                        fontSize: '13px',
                                        fontWeight: '700',
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-1px)';
                                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(99, 102, 241, 0.6)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(99, 102, 241, 0.4)';
                                    }}
                                >
                                    Pelajari Lebih Lanjut 📚
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
