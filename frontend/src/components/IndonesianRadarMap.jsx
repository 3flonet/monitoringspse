import React, { useEffect, useRef, useState } from 'react';

/**
 * IndonesianRadarMap (Split 2-Kolom Showcase Edition)
 * High-tech cyber command monitor showcasing the live Indonesian SPSE digital network.
 * Features:
 * - Authentic high-resolution digital network map with glowing red shorelines
 * - 60 FPS Canvas data streams (laser packets moving across Jakarta, IKN, Makassar, Surabaya, Jayapura)
 * - Pulsing radar wave emitters on key LPSE hubs
 * - Futuristic HUD headers and live status telemetry
 */
const IndonesianRadarMap = () => {
    const canvasRef = useRef(null);
    const [activeHubIndex, setActiveHubIndex] = useState(0);

    const hubs = [
        { id: 'jkt', name: 'DKI Jakarta (Pusat Komando)', x: 0.278, y: 0.627, tenders: '12.4K+ Tender', isHQ: true },
        { id: 'ikn', name: 'IKN Nusantara / Kaltim', x: 0.469, y: 0.408, tenders: '4.8K+ Tender', isStrategic: true },
        { id: 'sby', name: 'Surabaya (Jawa Timur)', x: 0.395, y: 0.695, tenders: '8.2K+ Tender' },
        { id: 'mks', name: 'Makassar (Hub Indonesia Timur)', x: 0.513, y: 0.573, tenders: '5.1K+ Tender' },
        { id: 'mdn', name: 'Medan (Sumatera Utara)', x: 0.122, y: 0.260, tenders: '6.3K+ Tender' },
        { id: 'dps', name: 'Denpasar (Bali)', x: 0.439, y: 0.749, tenders: '2.7K+ Tender' },
        { id: 'jpr', name: 'Jayapura (Papua)', x: 0.918, y: 0.493, tenders: '1.9K+ Tender' }
    ];

    // Cycle through highlighted radar hubs every 3 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveHubIndex(prev => (prev + 1) % hubs.length);
        }, 3200);
        return () => clearInterval(interval);
    }, [hubs.length]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const handleResize = () => {
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * (window.devicePixelRatio || 1);
            canvas.height = rect.height * (window.devicePixelRatio || 1);
            ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
        };
        handleResize();
        window.addEventListener('resize', handleResize);

        const hubMap = {};
        hubs.forEach(h => { hubMap[h.id] = h; });

        // Primary network pathways (startHub -> endHub, curvature control)
        const pathways = [
            { from: 'jkt', to: 'ikn', cpY: -0.12, speed: 0.007 },
            { from: 'jkt', to: 'mks', cpY: -0.06, speed: 0.006 },
            { from: 'jkt', to: 'sby', cpY: -0.03, speed: 0.009 },
            { from: 'jkt', to: 'mdn', cpY: -0.08, speed: 0.006 },
            { from: 'ikn', to: 'mks', cpY: -0.05, speed: 0.008 },
            { from: 'mks', to: 'jpr', cpY: -0.07, speed: 0.005 },
            { from: 'sby', to: 'dps', cpY: -0.02, speed: 0.010 }
        ];

        // Active traveling data packets along pathways
        const packets = [];
        for (let i = 0; i < 20; i++) {
            packets.push({
                pathIndex: i % pathways.length,
                progress: Math.random(),
                speedMultiplier: 0.7 + Math.random() * 0.6,
                size: 2 + Math.random() * 2,
                color: i % 3 === 0 ? '#fbbf24' : '#ff2a5f'
            });
        }

        // Floating ambient cyber constellation particles
        const particles = [];
        for (let i = 0; i < 28; i++) {
            particles.push({
                x: 0.08 + Math.random() * 0.84,
                y: 0.15 + Math.random() * 0.7,
                vx: (Math.random() - 0.5) * 0.0003,
                vy: (Math.random() - 0.5) * 0.0003,
                size: 1 + Math.random() * 2,
                alpha: 0.2 + Math.random() * 0.6,
                fadeSpeed: 0.01 + Math.random() * 0.015,
                fadingIn: Math.random() > 0.5
            });
        }

        let pulseTime = 0;

        const getBezierPoint = (p0, p1, p2, t) => {
            const x = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x;
            const y = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y;
            return { x, y };
        };

        const render = () => {
            const rect = canvas.getBoundingClientRect();
            const w = rect.width;
            const h = rect.height;

            ctx.clearRect(0, 0, w, h);
            pulseTime += 0.025;

            // 1. Draw glowing data packets traveling along curved pathways
            packets.forEach(packet => {
                const path = pathways[packet.pathIndex];
                const start = hubMap[path.from];
                const end = hubMap[path.to];
                if (!start || !end) return;

                packet.progress += path.speed * packet.speedMultiplier;
                if (packet.progress > 1) {
                    packet.progress = 0;
                    packet.pathIndex = (packet.pathIndex + 1) % pathways.length;
                }

                const p0 = { x: start.x * w, y: start.y * h };
                const p2 = { x: end.x * w, y: end.y * h };
                const midX = (p0.x + p2.x) / 2;
                const midY = (p0.y + p2.y) / 2;
                const p1 = { x: midX, y: midY + path.cpY * h };

                const pt = getBezierPoint(p0, p1, p2, packet.progress);

                // Packet outer neon glow
                ctx.beginPath();
                ctx.arc(pt.x, pt.y, packet.size * 2.5, 0, Math.PI * 2);
                ctx.fillStyle = packet.color === '#fbbf24' ? 'rgba(251, 191, 36, 0.25)' : 'rgba(255, 42, 95, 0.3)';
                ctx.fill();

                // Packet bright solid core
                ctx.beginPath();
                ctx.arc(pt.x, pt.y, packet.size, 0, Math.PI * 2);
                ctx.fillStyle = packet.color === '#fbbf24' ? '#fde047' : '#ff4d79';
                ctx.shadowColor = packet.color;
                ctx.shadowBlur = 10;
                ctx.fill();
                ctx.shadowBlur = 0;
            });

            // 2. Draw pulsing radar emitter rings on key hubs
            hubs.forEach((hub, hIdx) => {
                const cx = hub.x * w;
                const cy = hub.y * h;
                const isHQ = hub.isHQ;
                const isStrategic = hub.isStrategic;

                // Pulsing expanding ripple rings
                for (let r = 0; r < 2; r++) {
                    const waveProgress = ((pulseTime * 0.8 + hIdx * 0.6 + r * 0.5) % 1.5) / 1.5;
                    const radius = (isHQ ? 30 : (isStrategic ? 22 : 15)) * waveProgress;
                    const alpha = Math.max(0, (1 - waveProgress) * (isHQ ? 0.75 : 0.45));

                    ctx.beginPath();
                    ctx.arc(cx, cy, Math.max(1, radius), 0, Math.PI * 2);
                    ctx.strokeStyle = isHQ ? `rgba(255, 42, 95, ${alpha})` : (isStrategic ? `rgba(251, 191, 36, ${alpha})` : `rgba(239, 68, 68, ${alpha})`);
                    ctx.lineWidth = isHQ ? 1.5 : 1;
                    ctx.stroke();
                }

                // Core glowing pin
                const coreSize = isHQ ? 5 : (isStrategic ? 4 : 3);
                ctx.beginPath();
                ctx.arc(cx, cy, coreSize, 0, Math.PI * 2);
                ctx.fillStyle = isHQ ? '#ffffff' : (isStrategic ? '#fbbf24' : '#ff2a5f');
                ctx.shadowColor = '#ff2a5f';
                ctx.shadowBlur = 10;
                ctx.fill();
                ctx.shadowBlur = 0;
            });

            // 3. Render ambient drifting cyber particles
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.fadingIn) {
                    p.alpha += p.fadeSpeed;
                    if (p.alpha >= 0.8) p.fadingIn = false;
                } else {
                    p.alpha -= p.fadeSpeed;
                    if (p.alpha <= 0.1) p.fadingIn = true;
                }

                ctx.beginPath();
                ctx.arc(p.x * w, p.y * h, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 60, 110, ${p.alpha})`;
                ctx.shadowColor = '#ff2a5f';
                ctx.shadowBlur = 5;
                ctx.fill();
                ctx.shadowBlur = 0;
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    const activeHub = hubs[activeHubIndex] || hubs[0];

    return (
        <div style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(7, 10, 19, 0.98))',
            borderRadius: '20px',
            border: '1px solid rgba(255, 42, 95, 0.3)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 35px rgba(255, 42, 95, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
            overflow: 'hidden',
            position: 'relative'
        }}>
            {/* Top HUD Telemetry Bar */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 18px',
                background: 'rgba(7, 10, 19, 0.7)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#ff2a5f',
                        boxShadow: '0 0 8px #ff2a5f',
                        animation: 'radar-blink 1.2s ease-in-out infinite'
                    }} />
                    <span style={{ fontSize: '11.5px', fontWeight: '800', letterSpacing: '1px', color: '#f8fafc', textTransform: 'uppercase', fontFamily: "'Outfit', sans-serif" }}>
                        Radar Transmisi LPSE Nusantara
                    </span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        color: '#10b981',
                        background: 'rgba(16, 185, 129, 0.12)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        borderRadius: '6px',
                        padding: '2px 8px'
                    }}>
                        581 LPSE Sync
                    </span>
                    <span style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        color: '#fbbf24',
                        background: 'rgba(251, 191, 36, 0.12)',
                        border: '1px solid rgba(251, 191, 36, 0.3)',
                        borderRadius: '6px',
                        padding: '2px 8px'
                    }}>
                        Live 24/7
                    </span>
                </div>
            </div>

            {/* Map Artwork + Animation Canvas Container */}
            <div style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '1024 / 558',
                background: '#070a13',
                overflow: 'hidden'
            }}>
                {/* Authentic High-Res Digital Network Map Image */}
                <img
                    src="/images/indonesia-digital-map.jpg"
                    alt="Indonesia Digital Network Map"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block'
                    }}
                />

                {/* 60fps Live Animation Canvas */}
                <canvas
                    ref={canvasRef}
                    style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        pointerEvents: 'none'
                    }}
                />

                {/* Dynamic Floating Telemetry Pin Card */}
                <div style={{
                    position: 'absolute',
                    top: '14px',
                    left: '14px',
                    background: 'rgba(15, 23, 42, 0.88)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 42, 95, 0.4)',
                    borderRadius: '10px',
                    padding: '8px 12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
                    pointerEvents: 'none',
                    transition: 'all 0.3s ease'
                }}>
                    <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '2px' }}>
                        Deteksi Sinyal Aktif:
                    </div>
                    <div style={{ fontSize: '12.5px', fontWeight: '800', color: '#fff', fontFamily: "'Outfit', sans-serif" }}>
                        📍 {activeHub.name}
                    </div>
                    <div style={{ fontSize: '11px', color: '#fbbf24', fontWeight: '700', marginTop: '2px' }}>
                        ⚡ {activeHub.tenders} Dipindai
                    </div>
                </div>

                {/* Subtly vignette bottom edge */}
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '40px',
                    background: 'linear-gradient(to top, rgba(7, 10, 19, 0.8), transparent)',
                    pointerEvents: 'none'
                }} />
            </div>

            {/* Bottom HUD Quick Stats Strip */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '1px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)'
            }}>
                <div style={{ padding: '10px 14px', background: 'rgba(15, 23, 42, 0.8)', textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>Cakupan Wilayah</div>
                    <div style={{ fontSize: '13px', fontWeight: '800', color: '#fff' }}>38 Provinsi</div>
                </div>
                <div style={{ padding: '10px 14px', background: 'rgba(15, 23, 42, 0.8)', textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>Kecepatan Scan</div>
                    <div style={{ fontSize: '13px', fontWeight: '800', color: '#10b981' }}>Tiap 15 Menit</div>
                </div>
                <div style={{ padding: '10px 14px', background: 'rgba(15, 23, 42, 0.8)', textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>Akurasi Sumber</div>
                    <div style={{ fontSize: '13px', fontWeight: '800', color: '#38bdf8' }}>100% Resmi LPSE</div>
                </div>
            </div>
        </div>
    );
};

export default IndonesianRadarMap;
