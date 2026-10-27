import React from 'react';

/**
 * IndonesianRadarMap
 * Ambient high-tech cyber radar visualization of the Indonesian archipelago.
 * Features:
 * - Stylized vector landmass silhouettes of Indonesia
 * - Pulsing glowing red nodes for key LPSE regional centers (Jakarta, IKN, Surabaya, Makassar, Medan, etc.)
 * - Animated bezier network data lines showing national real-time synchronization
 * - Futuristic radar scan sweeps and cyber grid background
 * - Seamless radial vignette gradient ensuring optimal contrast for text & search inputs
 */
const IndonesianRadarMap = () => {
    // Key regional LPSE hubs with coordinates mapped to viewBox 0 0 1000 360
    const hubs = [
        // Sumatera
        { id: 'aceh', name: 'Banda Aceh', x: 95, y: 72, size: 4, pulse: true },
        { id: 'medan', name: 'Medan', x: 135, y: 105, size: 5, pulse: true },
        { id: 'pekanbaru', name: 'Pekanbaru', x: 175, y: 145, size: 4 },
        { id: 'padang', name: 'Padang', x: 165, y: 175, size: 4 },
        { id: 'palembang', name: 'Palembang', x: 228, y: 220, size: 5, pulse: true },
        { id: 'lampung', name: 'Bandar Lampung', x: 252, y: 248, size: 4 },

        // Jawa
        { id: 'jakarta', name: 'DKI Jakarta (HQ)', x: 288, y: 268, size: 7, isHQ: true, pulse: true, label: '581 LPSE HUB' },
        { id: 'bandung', name: 'Bandung', x: 308, y: 282, size: 4.5 },
        { id: 'semarang', name: 'Semarang', x: 366, y: 280, size: 4.5 },
        { id: 'yogyakarta', name: 'Yogyakarta', x: 368, y: 294, size: 4 },
        { id: 'surabaya', name: 'Surabaya', x: 428, y: 282, size: 5.5, pulse: true },

        // Bali & Nusa Tenggara
        { id: 'denpasar', name: 'Denpasar', x: 486, y: 298, size: 4.5 },
        { id: 'mataram', name: 'Mataram', x: 516, y: 300, size: 4 },
        { id: 'kupang', name: 'Kupang', x: 622, y: 326, size: 4, pulse: true },

        // Kalimantan
        { id: 'pontianak', name: 'Pontianak', x: 322, y: 162, size: 4.5 },
        { id: 'banjarmasin', name: 'Banjarmasin', x: 418, y: 226, size: 5 },
        { id: 'ikn', name: 'IKN Nusantara / Balikpapan', x: 462, y: 175, size: 6.5, isStrategic: true, pulse: true, label: 'IKN RADAR 24/7' },
        { id: 'samarinda', name: 'Samarinda', x: 472, y: 155, size: 4 },
        { id: 'tarakan', name: 'Tarakan', x: 492, y: 88, size: 4 },

        // Sulawesi
        { id: 'makassar', name: 'Makassar', x: 518, y: 248, size: 5.5, pulse: true, label: 'HUB TIMUR' },
        { id: 'kendari', name: 'Kendari', x: 558, y: 226, size: 4 },
        { id: 'palu', name: 'Palu', x: 512, y: 165, size: 4 },
        { id: 'gorontalo', name: 'Gorontalo', x: 580, y: 112, size: 3.5 },
        { id: 'manado', name: 'Manado', x: 612, y: 105, size: 4.5, pulse: true },

        // Maluku
        { id: 'ternate', name: 'Ternate', x: 676, y: 126, size: 4 },
        { id: 'ambon', name: 'Ambon', x: 686, y: 226, size: 4.5, pulse: true },

        // Papua
        { id: 'sorong', name: 'Sorong', x: 746, y: 176, size: 4.5 },
        { id: 'manokwari', name: 'Manokwari', x: 782, y: 165, size: 4 },
        { id: 'jayapura', name: 'Jayapura', x: 932, y: 206, size: 5, pulse: true },
        { id: 'merauke', name: 'Merauke', x: 936, y: 316, size: 4 }
    ];

    // Data network transmission links (curved arcs)
    const networkLinks = [
        // Backbone Connections from Jakarta
        { d: 'M 288,268 Q 360,200 462,175', key: 'jkt-ikn', active: true },      // Jakarta -> IKN
        { d: 'M 288,268 Q 350,265 428,282', key: 'jkt-sby', active: true },      // Jakarta -> Surabaya
        { d: 'M 288,268 Q 200,180 135,105', key: 'jkt-mdn', active: true },      // Jakarta -> Medan
        { d: 'M 288,268 Q 250,230 228,220', key: 'jkt-plb' },                     // Jakarta -> Palembang
        { d: 'M 288,268 Q 400,240 518,248', key: 'jkt-mks', active: true },      // Jakarta -> Makassar

        // Trans-Sumatera
        { d: 'M 95,72 Q 115,88 135,105', key: 'ach-mdn' },
        { d: 'M 135,105 Q 155,125 175,145', key: 'mdn-pku' },
        { d: 'M 175,145 Q 165,160 165,175', key: 'pku-pdg' },
        { d: 'M 165,175 Q 190,200 228,220', key: 'pdg-plb' },
        { d: 'M 228,220 Q 240,235 252,248', key: 'plb-lpg' },
        { d: 'M 252,248 Q 270,258 288,268', key: 'lpg-jkt' },

        // Trans-Jawa & Bali-Nusa Tenggara
        { d: 'M 288,268 Q 298,275 308,282', key: 'jkt-bdg' },
        { d: 'M 308,282 Q 338,278 366,280', key: 'bdg-smg' },
        { d: 'M 366,280 Q 367,288 368,294', key: 'smg-yog' },
        { d: 'M 366,280 Q 396,280 428,282', key: 'smg-sby' },
        { d: 'M 428,282 Q 456,290 486,298', key: 'sby-dps' },
        { d: 'M 486,298 Q 501,299 516,300', key: 'dps-mtr' },
        { d: 'M 516,300 Q 568,315 622,326', key: 'mtr-kpg' },

        // Kalimantan Grid
        { d: 'M 322,162 Q 390,165 462,175', key: 'pnk-ikn' },
        { d: 'M 418,226 Q 440,200 462,175', key: 'bjm-ikn' },
        { d: 'M 462,175 Q 467,165 472,155', key: 'ikn-smd' },
        { d: 'M 472,155 Q 482,120 492,88', key: 'smd-trk' },
        { d: 'M 428,282 Q 420,250 418,226', key: 'sby-bjm' },

        // Sulawesi Grid & Eastern Hubs
        { d: 'M 462,175 Q 490,210 518,248', key: 'ikn-mks', active: true },      // IKN -> Makassar
        { d: 'M 518,248 Q 538,236 558,226', key: 'mks-kdr' },
        { d: 'M 518,248 Q 510,205 512,165', key: 'mks-pal' },
        { d: 'M 512,165 Q 545,135 580,112', key: 'pal-gto' },
        { d: 'M 580,112 Q 596,108 612,105', key: 'gto-mnd' },
        { d: 'M 462,175 Q 535,135 612,105', key: 'ikn-mnd' },                     // IKN -> Manado

        // Maluku & Papua Link
        { d: 'M 612,105 Q 644,115 676,126', key: 'mnd-tnt' },
        { d: 'M 518,248 Q 600,238 686,226', key: 'mks-amb', active: true },      // Makassar -> Ambon
        { d: 'M 686,226 Q 715,200 746,176', key: 'amb-srq' },
        { d: 'M 746,176 Q 764,170 782,165', key: 'srq-mnk' },
        { d: 'M 746,176 Q 840,185 932,206', key: 'srq-jpr', active: true },      // Sorong -> Jayapura
        { d: 'M 932,206 Q 930,260 936,316', key: 'jpr-mrk' }
    ];

    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            pointerEvents: 'none',
            zIndex: 1
        }}>
            {/* CSS Animation Keyframes */}
            <style>{`
                @keyframes pulse-ring {
                    0% { transform: scale(0.6); opacity: 0.9; }
                    50% { opacity: 0.4; }
                    100% { transform: scale(2.4); opacity: 0; }
                }
                @keyframes data-beam {
                    0% { stroke-dashoffset: 100; }
                    100% { stroke-dashoffset: 0; }
                }
                @keyframes radar-scan {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes glow-breathe {
                    0%, 100% { opacity: 0.35; }
                    50% { opacity: 0.65; }
                }
                @keyframes badge-float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-4px); }
                }
                .radar-pulse-circle {
                    transform-box: fill-box;
                    transform-origin: center;
                    animation: pulse-ring 2.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
                }
                .network-data-line {
                    stroke-dasharray: 6 12;
                    animation: data-beam 4s linear infinite;
                }
                .network-backbone-line {
                    stroke-dasharray: 8 16;
                    animation: data-beam 2.2s linear infinite;
                }
            `}</style>

            {/* Cyber Radar Grid Background */}
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `
                    radial-gradient(circle at 48% 46%, rgba(239, 68, 68, 0.08) 0%, transparent 60%),
                    linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
                `,
                backgroundSize: '100% 100%, 48px 48px, 48px 48px',
                opacity: 0.7
            }} />

            {/* Radar Circular Scan Center (Targeting Indonesia Nusantara) */}
            <div style={{
                position: 'absolute',
                top: '42%',
                left: '50%',
                width: '650px',
                height: '650px',
                transform: 'translate(-50%, -50%)',
                borderRadius: '50%',
                border: '1px dashed rgba(239, 68, 68, 0.12)',
                boxShadow: '0 0 100px rgba(239, 68, 68, 0.04)',
                opacity: 0.6
            }}>
                <div style={{
                    position: 'absolute',
                    inset: '60px',
                    borderRadius: '50%',
                    border: '1px solid rgba(99, 102, 241, 0.08)'
                }} />
                <div style={{
                    position: 'absolute',
                    inset: '140px',
                    borderRadius: '50%',
                    border: '1px dashed rgba(239, 68, 68, 0.08)'
                }} />
            </div>

            {/* Main SVG Indonesia Map Vector */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%',
                maxWidth: '1280px',
                height: 'auto',
                padding: '0 20px',
                display: 'flex',
                justifyContent: 'center'
            }}>
                <svg
                    viewBox="0 0 1000 360"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                        width: '100%',
                        height: 'auto',
                        filter: 'drop-shadow(0 0 30px rgba(239, 68, 68, 0.15))'
                    }}
                >
                    <defs>
                        {/* Red Neon Glow Filter */}
                        <filter id="redGlow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur1" />
                            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur2" />
                            <feMerge>
                                <feMergeNode in="blur2" />
                                <feMergeNode in="blur1" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        {/* Cyan/Indigo Subtle Glow */}
                        <filter id="cyanGlow" x="-30%" y="-30%" width="160%" height="160%">
                            <feGaussianBlur stdDeviation="2" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>

                        {/* Gradients */}
                        <linearGradient id="backboneGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.8" />
                            <stop offset="50%" stopColor="#ef4444" stopOpacity="0.9" />
                            <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.8" />
                        </linearGradient>

                        <linearGradient id="islandFill" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="rgba(30, 41, 59, 0.65)" />
                            <stop offset="100%" stopColor="rgba(15, 23, 42, 0.85)" />
                        </linearGradient>
                    </defs>

                    {/* ============================================================ */}
                    {/* INDONESIAN ARCHIPELAGO LANDMASSES (High-Tech Vector Outlines) */}
                    {/* ============================================================ */}
                    <g
                        stroke="rgba(99, 102, 241, 0.3)"
                        strokeWidth="1.2"
                        fill="url(#islandFill)"
                        style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }}
                    >
                        {/* SUMATRA */}
                        <path d="
                            M 92,68 
                            C 102,60 118,72 135,95 
                            C 152,118 178,135 192,165 
                            C 205,195 240,215 258,245 
                            C 260,252 254,258 248,255 
                            C 230,248 212,232 195,212 
                            C 178,192 152,185 140,165 
                            C 125,145 105,118 88,88 
                            C 85,82 86,74 92,68 Z
                        " />
                        {/* Nias & Mentawai */}
                        <path d="M 108,138 C 112,135 118,142 115,148 C 112,154 105,150 108,138 Z" />
                        <path d="M 138,185 C 144,180 148,190 142,198 C 136,204 132,192 138,185 Z" />
                        {/* Bangka & Belitung */}
                        <path d="M 235,188 C 242,182 248,190 245,200 C 242,210 232,205 235,188 Z" />
                        <path d="M 262,205 C 268,202 272,208 270,214 C 267,220 260,215 262,205 Z" />

                        {/* JAWA */}
                        <path d="
                            M 268,264 
                            C 285,260 315,268 345,268 
                            C 375,268 410,272 445,274 
                            C 455,275 458,282 450,286 
                            C 425,296 385,296 345,295 
                            C 305,294 278,286 264,278 
                            C 260,274 262,266 268,264 Z
                        " />
                        {/* Madura */}
                        <path d="M 432,266 C 445,262 455,265 452,270 C 448,275 435,273 432,266 Z" />

                        {/* BALI & NUSA TENGGARA */}
                        {/* Bali */}
                        <path d="M 478,294 C 488,292 494,297 490,302 C 485,306 476,301 478,294 Z" />
                        {/* Lombok */}
                        <path d="M 508,296 C 518,295 522,301 518,306 C 512,310 506,304 508,296 Z" />
                        {/* Sumbawa */}
                        <path d="M 532,298 C 552,295 562,302 555,308 C 545,312 530,306 532,298 Z" />
                        {/* Flores */}
                        <path d="M 575,302 C 605,300 615,308 605,312 C 590,316 572,310 575,302 Z" />
                        {/* Sumba */}
                        <path d="M 562,322 C 578,320 584,328 576,334 C 566,338 558,330 562,322 Z" />
                        {/* Timor Barat (NTT) */}
                        <path d="M 612,320 C 632,315 640,324 632,332 C 620,338 608,328 612,320 Z" />

                        {/* KALIMANTAN (Indonesian Borneo) */}
                        <path d="
                            M 320,135 
                            C 345,108 385,98 425,102 
                            C 455,106 485,95 498,110 
                            C 512,125 505,155 492,175 
                            C 480,192 470,215 448,235 
                            C 425,252 400,245 378,238 
                            C 345,225 315,200 305,175 
                            C 298,158 308,145 320,135 Z
                        " />

                        {/* SULAWESI */}
                        <path d="
                            M 505,155 
                            C 515,135 540,118 575,110 
                            C 605,102 622,95 620,108 
                            C 615,120 590,128 575,135 
                            C 560,142 545,152 535,168 
                            C 545,178 570,185 585,195 
                            C 592,202 588,212 576,215 
                            C 560,218 548,208 535,196 
                            C 525,208 535,232 532,255 
                            C 528,264 515,262 510,248 
                            C 502,230 512,198 505,180 
                            C 498,168 495,162 505,155 Z
                        " />

                        {/* MALUKU */}
                        {/* Halmahera */}
                        <path d="M 668,115 C 682,108 692,125 685,140 C 678,152 665,145 668,115 Z" />
                        {/* Seram */}
                        <path d="M 675,208 C 705,204 715,214 702,220 C 685,226 670,218 675,208 Z" />
                        {/* Buru */}
                        <path d="M 648,212 C 662,208 668,218 662,225 C 652,232 642,222 648,212 Z" />

                        {/* PAPUA */}
                        <path d="
                            M 735,165 
                            C 745,152 765,148 782,158 
                            C 798,168 815,175 845,170 
                            C 885,165 925,178 958,190 
                            C 965,194 962,215 960,250 
                            C 958,285 962,315 950,325 
                            C 938,332 925,320 918,300 
                            C 908,270 885,250 855,245 
                            C 820,240 785,235 765,215 
                            C 745,195 725,180 735,165 Z
                        " />
                    </g>

                    {/* ============================================================ */}
                    {/* CONNECTED DATA NETWORK ARCS (Glow Streams) */}
                    {/* ============================================================ */}
                    <g>
                        {/* Base Network Static Glow Lines */}
                        {networkLinks.map((link) => (
                            <path
                                key={`base-${link.key}`}
                                d={link.d}
                                fill="none"
                                stroke={link.active ? 'rgba(239, 68, 68, 0.35)' : 'rgba(99, 102, 241, 0.2)'}
                                strokeWidth={link.active ? '1.5' : '1'}
                            />
                        ))}

                        {/* Animated Glowing Laser Pulses */}
                        {networkLinks.map((link) => (
                            <path
                                key={`anim-${link.key}`}
                                d={link.d}
                                fill="none"
                                stroke={link.active ? 'url(#backboneGradient)' : 'rgba(239, 68, 68, 0.7)'}
                                strokeWidth={link.active ? '2.2' : '1.4'}
                                className={link.active ? 'network-backbone-line' : 'network-data-line'}
                                style={{ filter: link.active ? 'url(#redGlow)' : 'none' }}
                            />
                        ))}
                    </g>

                    {/* ============================================================ */}
                    {/* ILLUMINATED GLOWING RED DOTS (Regional LPSE Hubs) */}
                    {/* ============================================================ */}
                    <g>
                        {hubs.map((hub) => {
                            const isHQ = hub.isHQ;
                            const isStrategic = hub.isStrategic;
                            const isSpecial = isHQ || isStrategic;

                            return (
                                <g key={hub.id}>
                                    {/* Outer Radar Expanding Wave for active hubs */}
                                    {hub.pulse && (
                                        <circle
                                            cx={hub.x}
                                            cy={hub.y}
                                            r={isSpecial ? 16 : 10}
                                            fill="none"
                                            stroke="#ef4444"
                                            strokeWidth={isSpecial ? 1.5 : 1}
                                            className="radar-pulse-circle"
                                            style={{
                                                animationDelay: `${(hub.x % 5) * 0.4}s`
                                            }}
                                        />
                                    )}

                                    {/* Soft Radial Ambient Glow */}
                                    <circle
                                        cx={hub.x}
                                        cy={hub.y}
                                        r={isSpecial ? 12 : 7}
                                        fill={isSpecial ? 'rgba(239, 68, 68, 0.35)' : 'rgba(239, 68, 68, 0.2)'}
                                        filter="url(#redGlow)"
                                    />

                                    {/* Solid Core Dot */}
                                    <circle
                                        cx={hub.x}
                                        cy={hub.y}
                                        r={hub.size || 4}
                                        fill={isHQ ? '#ffffff' : (isStrategic ? '#fbbf24' : '#ef4444')}
                                        stroke="#ef4444"
                                        strokeWidth={isSpecial ? 2 : 1}
                                        filter="url(#redGlow)"
                                    />

                                    {/* Tech Label Badge for Key Flagship Hubs */}
                                    {hub.label && (
                                        <g style={{ animation: 'badge-float 3s ease-in-out infinite' }}>
                                            <rect
                                                x={hub.x - (isHQ ? 46 : 42)}
                                                y={hub.y - (isHQ ? 24 : 22)}
                                                width={isHQ ? 92 : 84}
                                                height={15}
                                                rx={4}
                                                fill="rgba(15, 23, 42, 0.85)"
                                                stroke={isHQ ? 'rgba(239, 68, 68, 0.6)' : 'rgba(251, 191, 36, 0.6)'}
                                                strokeWidth="0.8"
                                            />
                                            <circle
                                                cx={hub.x - (isHQ ? 38 : 34)}
                                                cy={hub.y - (isHQ ? 16.5 : 14.5)}
                                                r="2.5"
                                                fill={isHQ ? '#ef4444' : '#fbbf24'}
                                                filter="url(#redGlow)"
                                            />
                                            <text
                                                x={hub.x - (isHQ ? 30 : 26)}
                                                y={hub.y - (isHQ ? 13 : 11)}
                                                fill="#f8fafc"
                                                fontSize="7.5"
                                                fontFamily="'Outfit', sans-serif"
                                                fontWeight="700"
                                                letterSpacing="0.5px"
                                            >
                                                {hub.label}
                                            </text>
                                        </g>
                                    )}
                                </g>
                            );
                        })}
                    </g>
                </svg>
            </div>

            {/* Seamless Vignette Overlay ensuring text readability */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: `
                    radial-gradient(ellipse at 50% 45%, rgba(7, 10, 19, 0.3) 0%, rgba(7, 10, 19, 0.75) 60%, #070a13 100%),
                    linear-gradient(180deg, rgba(7, 10, 19, 0.6) 0%, transparent 25%, transparent 75%, #070a13 100%)
                `,
                pointerEvents: 'none'
            }} />
        </div>
    );
};

export default IndonesianRadarMap;
