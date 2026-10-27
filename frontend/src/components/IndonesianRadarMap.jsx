import React, { useEffect, useRef } from 'react';

/**
 * IndonesianRadarMap
 * High-tech animated digital network map of Indonesia based on realistic cyber-command visual.
 * Features:
 * - High-resolution digital network map artwork with illuminated red shorelines & constellation mesh
 * - Animated Canvas 60fps data packets streaming along the major network arcs (Jakarta -> IKN, Makassar, Medan, Surabaya, Jayapura)
 * - Pulsing radar wave emitters on key LPSE hubs
 * - Subtle floating cyber data particles
 * - Atmospheric vignette overlay ensuring 100% sharp text readability
 */
const IndonesianRadarMap = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        // Resize canvas to match display size
        const handleResize = () => {
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * (window.devicePixelRatio || 1);
            canvas.height = rect.height * (window.devicePixelRatio || 1);
            ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
        };
        handleResize();
        window.addEventListener('resize', handleResize);

        // Relative coordinates on the 1024 x 558 map (%)
        const hubs = [
            { id: 'jkt', name: 'Jakarta', x: 0.278, y: 0.627, isHQ: true },
            { id: 'ikn', name: 'IKN / Balikpapan', x: 0.469, y: 0.408, isStrategic: true },
            { id: 'sby', name: 'Surabaya', x: 0.395, y: 0.695 },
            { id: 'dps', name: 'Denpasar', x: 0.439, y: 0.749 },
            { id: 'mks', name: 'Makassar', x: 0.513, y: 0.573 },
            { id: 'mdn', name: 'Medan', x: 0.122, y: 0.260 },
            { id: 'plb', name: 'Palembang', x: 0.215, y: 0.493 },
            { id: 'pnk', name: 'Pontianak', x: 0.345, y: 0.380 },
            { id: 'mnd', name: 'Manado', x: 0.615, y: 0.250 },
            { id: 'amb', name: 'Ambon', x: 0.705, y: 0.530 },
            { id: 'jpr', name: 'Jayapura', x: 0.918, y: 0.493 }
        ];

        // Primary network pathways (startHub -> endHub, curvature control)
        const pathways = [
            { from: 'jkt', to: 'ikn', cpY: -0.12, speed: 0.007 },
            { from: 'jkt', to: 'mks', cpY: -0.06, speed: 0.006 },
            { from: 'jkt', to: 'sby', cpY: -0.03, speed: 0.009 },
            { from: 'jkt', to: 'mdn', cpY: -0.08, speed: 0.006 },
            { from: 'jkt', to: 'plb', cpY: -0.04, speed: 0.008 },
            { from: 'ikn', to: 'mks', cpY: -0.05, speed: 0.008 },
            { from: 'ikn', to: 'mnd', cpY: -0.06, speed: 0.007 },
            { from: 'mks', to: 'amb', cpY: -0.04, speed: 0.006 },
            { from: 'amb', to: 'jpr', cpY: -0.05, speed: 0.005 },
            { from: 'sby', to: 'dps', cpY: -0.02, speed: 0.010 }
        ];

        // Active traveling data packets along pathways
        const packets = [];
        for (let i = 0; i < 24; i++) {
            packets.push({
                pathIndex: i % pathways.length,
                progress: Math.random(),
                speedMultiplier: 0.7 + Math.random() * 0.6,
                size: 2 + Math.random() * 2,
                color: i % 4 === 0 ? '#fbbf24' : '#ff2a5f'
            });
        }

        // Floating ambient cyber constellation particles
        const particles = [];
        for (let i = 0; i < 35; i++) {
            particles.push({
                x: 0.08 + Math.random() * 0.84,
                y: 0.15 + Math.random() * 0.7,
                vx: (Math.random() - 0.5) * 0.0002,
                vy: (Math.random() - 0.5) * 0.0002,
                size: 1 + Math.random() * 2,
                alpha: 0.2 + Math.random() * 0.6,
                fadeSpeed: 0.008 + Math.random() * 0.015,
                fadingIn: Math.random() > 0.5
            });
        }

        let pulseTime = 0;

        const hubMap = {};
        hubs.forEach(h => { hubMap[h.id] = h; });

        // Quadratic Bezier interpolation helper
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
            pathways.forEach((path, pIdx) => {
                const start = hubMap[path.from];
                const end = hubMap[path.to];
                if (!start || !end) return;

                const p0 = { x: start.x * w, y: start.y * h };
                const p2 = { x: end.x * w, y: end.y * h };
                const midX = (p0.x + p2.x) / 2;
                const midY = (p0.y + p2.y) / 2;
                const p1 = { x: midX, y: midY + path.cpY * h };

                // Draw faint laser pulse trail along the arc
                ctx.beginPath();
                ctx.moveTo(p0.x, p0.y);
                ctx.quadraticCurveTo(p1.x, p1.y, p2.x, p2.y);
                ctx.strokeStyle = 'rgba(255, 42, 95, 0.12)';
                ctx.lineWidth = 1;
                ctx.stroke();
            });

            // Update & render traveling packets
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
                ctx.arc(pt.x, pt.y, packet.size * 2.8, 0, Math.PI * 2);
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
                    const radius = (isHQ ? 32 : (isStrategic ? 24 : 16)) * waveProgress;
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
                ctx.arc(cx, cy, coreSize + 3, 0, Math.PI * 2);
                ctx.fillStyle = isHQ ? 'rgba(255, 42, 95, 0.4)' : (isStrategic ? 'rgba(251, 191, 36, 0.3)' : 'rgba(239, 68, 68, 0.3)');
                ctx.fill();

                ctx.beginPath();
                ctx.arc(cx, cy, coreSize, 0, Math.PI * 2);
                ctx.fillStyle = isHQ ? '#ffffff' : (isStrategic ? '#fbbf24' : '#ff2a5f');
                ctx.shadowColor = '#ff2a5f';
                ctx.shadowBlur = 12;
                ctx.fill();
                ctx.shadowBlur = 0;
            });

            // 3. Render ambient drifting cyber constellation particles
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
                ctx.shadowBlur = 6;
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

    return (
        <div style={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            pointerEvents: 'none',
            zIndex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            {/* CSS Breathing Keyframe */}
            <style>{`
                @keyframes map-breathe {
                    0%, 100% { opacity: 0.72; filter: drop-shadow(0 0 25px rgba(255, 42, 95, 0.25)); }
                    50% { opacity: 0.88; filter: drop-shadow(0 0 45px rgba(255, 42, 95, 0.45)); }
                }
                @keyframes grid-drift {
                    0% { background-position: 0 0; }
                    100% { background-position: 48px 48px; }
                }
            `}</style>

            {/* Subtle Cyber Grid Background */}
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `
                    linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
                `,
                backgroundSize: '48px 48px',
                animation: 'grid-drift 20s linear infinite',
                opacity: 0.5
            }} />

            {/* Central Glowing Radar Aperture */}
            <div style={{
                position: 'absolute',
                top: '48%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '720px',
                height: '720px',
                borderRadius: '50%',
                border: '1px dashed rgba(255, 42, 95, 0.1)',
                boxShadow: '0 0 120px rgba(255, 42, 95, 0.06)',
                pointerEvents: 'none'
            }} />

            {/* Container for Image + Canvas Aligning 1:1 */}
            <div style={{
                position: 'relative',
                width: '100%',
                maxWidth: '1280px',
                aspectRatio: '1024 / 558',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto'
            }}>
                {/* Authentic High-Res Digital Network Map Image */}
                <img
                    src="/images/indonesia-digital-map.jpg"
                    alt="Indonesia Digital Network Map"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        animation: 'map-breathe 4s ease-in-out infinite'
                    }}
                />

                {/* 60fps Live Animation Canvas Layer (Pulsing nodes, Laser packets, Constellations) */}
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
            </div>

            {/* High-Contrast Radial Vignette Overlay: Keeps center text 100% crisp & legible */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: `
                    radial-gradient(ellipse at 50% 48%, rgba(7, 10, 19, 0.45) 0%, rgba(7, 10, 19, 0.8) 65%, #070a13 95%),
                    linear-gradient(180deg, rgba(7, 10, 19, 0.7) 0%, transparent 20%, transparent 80%, #070a13 100%)
                `,
                pointerEvents: 'none'
            }} />
        </div>
    );
};

export default IndonesianRadarMap;
