import React, { useState, useEffect } from 'react';

// Explicit-sized SVG icons (avoids missing Tailwind class issue)
const Icons = {
  Bell: ({ size = 18, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, display: 'inline-block', verticalAlign: 'middle' }}>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  Search: ({ size = 18, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, display: 'inline-block', verticalAlign: 'middle' }}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Users: ({ size = 18, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, display: 'inline-block', verticalAlign: 'middle' }}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  MapPin: ({ size = 18, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, display: 'inline-block', verticalAlign: 'middle' }}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Swords: ({ size = 18, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, display: 'inline-block', verticalAlign: 'middle' }}>
      <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" />
      <line x1="13" y1="19" x2="19" y2="13" />
      <line x1="16" y1="16" x2="20" y2="20" />
      <line x1="19" y1="21" x2="21" y2="19" />
      <polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5" />
      <line x1="5" y1="14" x2="9" y2="18" />
      <line x1="7" y1="17" x2="4" y2="20" />
      <line x1="3" y1="19" x2="5" y2="21" />
    </svg>
  ),
  FileWarning: ({ size = 18, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, display: 'inline-block', verticalAlign: 'middle' }}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="12" y1="12" x2="12" y2="15" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  ),
  FileSpreadsheet: ({ size = 18, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, display: 'inline-block', verticalAlign: 'middle' }}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M8 13h8" />
      <path d="M8 17h8" />
      <path d="M12 10v10" />
    </svg>
  ),
  Share2: ({ size = 18, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, display: 'inline-block', verticalAlign: 'middle' }}>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  ),
  Calculator: ({ size = 18, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, display: 'inline-block', verticalAlign: 'middle' }}>
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <line x1="8" y1="6" x2="16" y2="6" />
      <line x1="16" y1="14" x2="16" y2="14.01" />
      <line x1="12" y1="14" x2="12" y2="14.01" />
      <line x1="8" y1="14" x2="8" y2="14.01" />
      <line x1="16" y1="18" x2="16" y2="18.01" />
      <line x1="12" y1="18" x2="12" y2="18.01" />
      <line x1="8" y1="18" x2="8" y2="18.01" />
    </svg>
  ),
  CheckCircle2: ({ size = 15, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, display: 'inline-block', verticalAlign: 'middle' }}>
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  ArrowRight: ({ size = 15, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, display: 'inline-block', verticalAlign: 'middle' }}>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  ChevronRight: ({ size = 14, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, display: 'inline-block', verticalAlign: 'middle' }}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  Layers: ({ size = 15, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, display: 'inline-block', verticalAlign: 'middle' }}>
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  ),
  ExternalLink: ({ size = 14, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, display: 'inline-block', verticalAlign: 'middle' }}>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  ),
  AlertTriangle: ({ size = 15, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, display: 'inline-block', verticalAlign: 'middle' }}>
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  HelpCircle: ({ size = 15, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, display: 'inline-block', verticalAlign: 'middle' }}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
};

export default function PublicFeaturesPage({ 
  adminSettings, 
  onNavigate, 
  onGetStarted, 
  onGoTenders,
  userToken 
}) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      });
    } catch (e) {
      window.scrollTo(0, 0);
    }
  }, []);

  const categories = [
    { id: 'all', label: 'Semua Modul' },
    { id: 'monitoring', label: 'Monitoring & Alert' },
    { id: 'intelligence', label: 'Intelijen & Kompetitor' },
    { id: 'tactical', label: 'Taktis & Sanggahan' },
    { id: 'reporting', label: 'Laporan & Ekspor' }
  ];

  const features = [
    {
      id: 'radar-alert',
      category: 'monitoring',
      badge: 'Real-Time Alert',
      accentColor: '#34d399',
      icon: Icons.Bell,
      iconBg: 'rgba(16, 185, 129, 0.12)',
      title: 'Radar Notifikasi Otomatis WhatsApp & Email 24/7',
      subtitle: 'Jangan pernah terlambat tahu saat tender incaran Anda tayang di LPSE',
      problem: 'Banyak kontraktor kehilangan peluang proyek miliaran rupiah hanya karena telat mengecek ratusan portal LPSE atau melewatkan masa aanwijzing.',
      solution: 'Mesin bot Spy SPSE memindai seluruh LPSE nasional otomatis setiap beberapa menit. Notifikasi langsung dikirim ke WhatsApp & Email Anda.',
      capabilities: [
        'Filter multi-keyword fleksibel ("Gedung", "Jalan", "Pengadaan IT", "Alkes")',
        'Pengaturan rentang pagu anggaran (contoh: Rp 500 Juta – Rp 25 Miliar)',
        'Pemilihan instansi atau LPSE prioritas (Provinsi, Pemkab, Kementerian, BUMN)',
        'Pengingat tahapan krusial (pembukaan penawaran, evaluasi, sanggah, pemenang)'
      ]
    },
    {
      id: 'explorer-tender',
      category: 'monitoring',
      badge: 'Database Nasional',
      accentColor: '#60a5fa',
      icon: Icons.Search,
      iconBg: 'rgba(59, 130, 246, 0.12)',
      title: 'Explorer & Mesin Pencari Tender Multi-LPSE',
      subtitle: 'Pencarian instan ribuan paket pengadaan aktif se-Indonesia dalam satu layar',
      problem: 'Membuka puluhan tab browser untuk mengecek LPSE kementerian dan pemda satu per satu sangat lambat dan rentan terlewat.',
      solution: 'Mengumpulkan seluruh paket lelang tender LPSE nasional ke dalam satu antarmuka terpusat yang cepat, akurat, dan selalu diperbarui.',
      capabilities: [
        'Pencarian nama tender, kode lelang, lokasi satker, atau metode pengadaan',
        'Filter metode evaluasi, kualifikasi (Usaha Kecil/Non-Kecil), & status paket',
        'Sinkronisasi real-time jadwal tahapan resmi LPSE dengan hitung mundur',
        'Akses 1-klik menuju link paket resmi portal LPSE asal tanpa login ulang'
      ]
    },
    {
      id: 'competitor-profile',
      category: 'intelligence',
      badge: 'Deep Analytics',
      accentColor: '#c084fc',
      icon: Icons.Users,
      iconBg: 'rgba(168, 85, 247, 0.12)',
      title: 'Profil Lengkap & Intelijen Kompetitor',
      subtitle: 'Bongkar track record, rasio kemenangan (Win Rate), dan pola penawaran lawan',
      problem: 'Saat menyusun harga, Anda sering kali buta siapa kontraktor rival dan berapa rata-rata harga yang biasa mereka tawarkan.',
      solution: 'Ketik nama perusahaan mana pun untuk membuka data historis: total lelang, rasio menang (Win Rate %), nilai kontrak dimenangkan, dan pola diskon penawaran.',
      capabilities: [
        'Kalkulasi otomatis Win Rate % (rasio menang vs kalah historis)',
        'Total akumulasi nilai kontrak yang pernah dimenangkan rekanan',
        'Distribusi nilai penawaran rata-rata (pola banting harga vs harga aman)',
        'Daftar lengkap riwayat keikutsertaan lelang beserta HPS & penawaran akhir'
      ]
    },
    {
      id: 'peta-dominasi',
      category: 'intelligence',
      badge: 'Strategi Penetrasi',
      accentColor: '#fbbf24',
      icon: Icons.MapPin,
      iconBg: 'rgba(245, 158, 11, 0.12)',
      title: 'Peta Dominasi Wilayah & Satker Langganan',
      subtitle: 'Deteksi instansi/dinas mana yang menjadi basis dominasi utama kompetitor',
      problem: 'Kontraktor sering rugi biaya jaminan dan waktu menyusun dokumen di dinas yang ternyata sudah dikuasai oleh rekanan langganan tetap.',
      solution: 'Algoritma memetakan konsentrasi kemenangan per Satker. Kemenangan ≥35% di satker yang sama dilabeli status proteksi "Dominasi Tinggi".',
      capabilities: [
        'Deteksi konsentrasi kemenangan dinas dan instansi secara matematis',
        'Klasifikasi status wilayah: "Dominasi Tinggi" vs "Wilayah Terbuka/Netral"',
        'Rekomendasi taktis: Identifikasi dinas peluang tinggi vs wilayah risiko tinggi',
        'Peringkat satker tempat kompetitor paling sering memenangkan paket'
      ]
    },
    {
      id: 'head-to-head',
      category: 'tactical',
      badge: 'Arena Adu Kontraktor',
      accentColor: '#f87171',
      icon: Icons.Swords,
      iconBg: 'rgba(239, 68, 68, 0.12)',
      title: 'Head-to-Head Comparator Arena (Adu Dua Kontraktor)',
      subtitle: 'Simulasikan duel langsung antara perusahaan Anda dan kompetitor terberat',
      problem: 'Sulit mengetahui seberapa sering Anda bentrok dengan kompetitor utama dan siapa yang lebih unggul dalam lelang bersama di masa lalu.',
      solution: 'Bandingkan dua kontraktor sekaligus: bedah rekor pertemuan bersama (shared tenders), skor menang-kalah langsung, dan Strategic Verdict otomatis.',
      capabilities: [
        'Deteksi otomatis seluruh paket tempat kedua rekanan pernah bersaing bersama',
        'Perbandingan skor menang langsung (Win-Loss Direct Record)',
        'Analisis Price Gap: selisih persentase penawaran harga antara kedua kubu',
        'Strategic Verdict otomatis: rekomendasi taktik harga untuk pertemuan mendatang'
      ]
    },
    {
      id: 'pokja-weakness',
      category: 'tactical',
      badge: 'Amunisi Sanggahan',
      accentColor: '#f43f5e',
      icon: Icons.FileWarning,
      iconBg: 'rgba(244, 63, 94, 0.12)',
      title: 'Matriks Kelemahan Pokja & Amunisi Sanggahan',
      subtitle: 'Audit alasan gugur kompetitor dan siapkan materi sanggahan berbasis data',
      problem: 'Saat mengajukan sanggahan, kontraktor sering kali kekurangan data pembanding atau tidak tahu titik lemah riil dari pemenang lelang.',
      solution: 'Mengekstrak seluruh histori evaluasi Pokja pada kompetitor di aspek mana mereka pernah digugurkan (administrasi, teknis, SKK, alat, keuangan).',
      capabilities: [
        'Klaster kegagalan: Administrasi, Teknis, SKK/Personil, Alat, & Keuangan',
        'Akses catatan asli Pokja saat menggugurkan rekanan dalam tender lalu',
        'Amunisi kuat untuk menyusun sanggahan jika pemenang terbukti tidak memenuhi syarat',
        'Checklist preventif internal agar tim Anda tidak melakukan kesalahan serupa'
      ]
    },
    {
      id: 'executive-dossier',
      category: 'reporting',
      badge: 'Ekspor Formal',
      accentColor: '#2dd4bf',
      icon: Icons.FileSpreadsheet,
      iconBg: 'rgba(45, 212, 191, 0.12)',
      title: 'Dossier Intelijen Eksekutif (PDF A4 & Excel Multi-Sheet)',
      subtitle: 'Unduh laporan intelijen rahasia siap presentasi untuk direksi dan manajemen',
      problem: 'Menyusun laporan analisa kompetitor manual butuh berhari-hari dan sering kali tidak memiliki tampilan formal berstandar eksekutif.',
      solution: 'Hasilkan dokumen PDF resmi A4 watermark Confidential dan spreadsheet Excel multi-sheet terstruktur lengkap dengan formula statistik dalam 1 klik.',
      capabilities: [
        'Ekspor PDF A4 profesional dengan ringkasan eksekutif dan tabel analisis',
        'Ekspor Excel multi-sheet (Profil, Rekor Menang, Dominasi Satker, Audit)',
        'Siap dibawa ke rapat pimpinan untuk penentuan pagu penawaran proyek',
        'Watermark keamanan resmi untuk menjaga kerahasiaan dokumen internal'
      ]
    },
    {
      id: 'co-bidding',
      category: 'intelligence',
      badge: 'Deteksi Koalisi',
      accentColor: '#818cf8',
      icon: Icons.Share2,
      iconBg: 'rgba(129, 140, 248, 0.12)',
      title: 'Pelacak Rekanan Co-Bidding & Konsorsium',
      subtitle: 'Ketahui siapa rekanan yang sering maju bersama atau berkoalisi (KSO)',
      problem: 'Sering ada rekanan bayangan yang selalu ikut lelang bersamaan untuk memenuhi kuota penawar atau mengatur strategi harga.',
      solution: 'Menganalisis korelasi keikutsertaan antar rekanan untuk mendeteksi pola aliansi lelang dan mitra potensial yang tepat diajak KSO.',
      capabilities: [
        'Matriks frekuensi lelang bersama antar kontraktor',
        'Deteksi pola penawaran pendamping (co-bidding patterns)',
        'Identifikasi partner strategis yang cocok diajak konsorsium (KSO)'
      ]
    },
    {
      id: 'sweet-spot',
      category: 'tactical',
      badge: 'Kalkulator Penawaran',
      accentColor: '#38bdf8',
      icon: Icons.Calculator,
      iconBg: 'rgba(56, 189, 248, 0.12)',
      title: 'Kalkulator Sweet Spot Penawaran Harga',
      subtitle: 'Tentukan harga penawaran paling kompetitif tanpa mengorbankan margin profit',
      problem: 'Menawar terlalu rendah membuat margin proyek habis atau rugi, sedangkan menawar terlalu tinggi pasti kalah dari rival.',
      solution: 'Berdasarkan data historis lelang serupa, sistem memproyeksikan rentang diskon kemenangan (Winning Price Band) paling optimal.',
      capabilities: [
        'Rekomendasi persentase penawaran ideal terhadap HPS (misal 88.5% – 93.2%)',
        'Simulasi margin keuntungan vs risiko dikalahkan oleh banting harga lawan',
        'Histori persentase penawaran pemenang di paket sejenis di wilayah target'
      ]
    }
  ];

  const filteredFeatures = activeCategory === 'all' 
    ? features 
    : features.filter(f => f.category === activeCategory);

  const faqs = [
    {
      q: 'Dari mana data yang ditampilkan oleh Spy SPSE berasal?',
      a: 'Seluruh data dihimpun secara legal dan otomatis dari ratusan portal LPSE (Layanan Pengadaan Secara Elektronik) kementerian, lembaga, dan pemerintah daerah di seluruh Indonesia yang terhubung dalam sistem SPSE LKPP publik.'
    },
    {
      q: 'Apakah saya bisa memantau lebih dari satu kata kunci sekaligus?',
      a: 'Tentu. Anda dapat menambahkan beberapa kata kunci sekaligus (misalnya: "Pengaspalan Jalan", "Pembangunan Gedung", "Rehabilitasi Sekolah") dan sistem akan mengirim notifikasi setiap ada paket yang sesuai.'
    },
    {
      q: 'Bagaimana cara menggunakan fitur Head-to-Head Arena?',
      a: 'Cukup masukkan nama kontraktor Anda di kolom pertama dan nama rekanan kompetitor di kolom kedua. Sistem langsung memindai database tender untuk menemukan riwayat lelang di mana kedua perusahaan pernah bersaing bersama.'
    },
    {
      q: 'Apakah laporan PDF dan Excel bisa diunduh untuk kebutuhan offline?',
      a: 'Ya, seluruh berkas Dossier Eksekutif PDF A4 dan Spreadsheet Excel dapat diunduh tanpa batas dan langsung siap dibagikan ke jajaran pimpinan atau direksi.'
    },
    {
      q: 'Bagaimana jika instansi/LPSE yang saya cari belum terdaftar di radar?',
      a: 'Database Spy SPSE secara rutin menyinkronkan daftar LPSE se-Indonesia. Jika ada LPSE khusus yang ingin Anda prioritaskan frekuensi pemindaiannya, Anda dapat memintanya langsung melalui tim support kami.'
    }
  ];

  return (
    <main style={{ flexGrow: 1, padding: '24px 16px 48px', maxWidth: '1040px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      {/* Hero Section */}
      <div style={{ textAlign: 'center', marginBottom: '32px', maxWidth: '760px', margin: '0 auto 32px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(99, 102, 241, 0.12)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '11px',
          fontWeight: '700',
          color: '#a5b4fc',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          marginBottom: '14px'
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6366f1', boxShadow: '0 0 6px #6366f1' }} />
          Katalog Modul & Spesifikasi Sistem
        </div>

        <h1 style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: 'clamp(24px, 3.5vw, 34px)',
          fontWeight: '800',
          color: '#ffffff',
          lineHeight: '1.25',
          letterSpacing: '-0.02em',
          margin: '0 0 10px'
        }}>
          Fitur Lengkap Intelijen & <br />
          <span style={{
            background: 'linear-gradient(135deg, #a5b4fc 0%, #6366f1 50%, #c084fc 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Monitoring Tender SPSE Nasional
          </span>
        </h1>

        <p style={{ color: '#94a3b8', fontSize: '14px', maxWidth: '580px', margin: '0 auto 24px', lineHeight: '1.5' }}>
          Panduan komprehensif seluruh modul intelijen untuk membebaskan kontraktor dari ketidakpastian lelang dan tebak-tebakan harga.
        </p>

        {/* Quick Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '10px',
          maxWidth: '620px',
          margin: '0 auto'
        }}>
          <div style={{ background: '#0e1424', border: '1px solid rgba(255,255,255,0.06)', padding: '10px 14px', borderRadius: '12px' }}>
            <div style={{ fontSize: '20px', fontWeight: '800', color: '#818cf8', fontFamily: "'Outfit', sans-serif" }}>9+</div>
            <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600' }}>Modul Intelijen</div>
          </div>
          <div style={{ background: '#0e1424', border: '1px solid rgba(255,255,255,0.06)', padding: '10px 14px', borderRadius: '12px' }}>
            <div style={{ fontSize: '20px', fontWeight: '800', color: '#34d399', fontFamily: "'Outfit', sans-serif" }}>24/7</div>
            <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600' }}>Radar Non-Stop</div>
          </div>
          <div style={{ background: '#0e1424', border: '1px solid rgba(255,255,255,0.06)', padding: '10px 14px', borderRadius: '12px' }}>
            <div style={{ fontSize: '20px', fontWeight: '800', color: '#60a5fa', fontFamily: "'Outfit', sans-serif" }}>100%</div>
            <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600' }}>Multi-LPSE</div>
          </div>
          <div style={{ background: '#0e1424', border: '1px solid rgba(255,255,255,0.06)', padding: '10px 14px', borderRadius: '12px' }}>
            <div style={{ fontSize: '20px', fontWeight: '800', color: '#c084fc', fontFamily: "'Outfit', sans-serif" }}>Instan</div>
            <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600' }}>PDF & Excel</div>
          </div>
        </div>
      </div>

      {/* Category Filter Pills (matching PublicBlogPage style) */}
      <div style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginBottom: '28px',
        padding: '2px'
      }}>
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                background: isActive ? 'linear-gradient(135deg, #4f46e5, #6366f1)' : 'rgba(255, 255, 255, 0.04)',
                color: isActive ? '#ffffff' : '#94a3b8',
                border: `1px solid ${isActive ? '#818cf8' : 'rgba(255, 255, 255, 0.08)'}`,
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: isActive ? '700' : '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: isActive ? '0 2px 10px rgba(79, 70, 229, 0.35)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>{cat.label}</span>
              {cat.id === 'all' && (
                <span style={{
                  fontSize: '10px',
                  padding: '1px 5px',
                  borderRadius: '10px',
                  background: isActive ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.1)',
                  color: isActive ? '#ffffff' : '#94a3b8'
                }}>
                  {features.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Features Showcase List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>
        {filteredFeatures.map((feat, idx) => {
          const IconComponent = feat.icon;
          return (
            <div 
              key={feat.id}
              id={feat.id}
              style={{
                background: '#0d1222',
                border: '1px solid rgba(99, 102, 241, 0.16)',
                borderRadius: '16px',
                padding: '20px 22px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.25)'
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                {/* Left Column: Title & Overview */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      background: feat.iconBg,
                      color: feat.accentColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: `1px solid ${feat.accentColor}33`,
                      flexShrink: 0
                    }}>
                      <IconComponent size={20} color={feat.accentColor} />
                    </div>
                    <div>
                      <span style={{
                        display: 'inline-block',
                        fontSize: '10px',
                        fontWeight: '800',
                        padding: '1px 7px',
                        borderRadius: '5px',
                        background: `${feat.accentColor}18`,
                        color: feat.accentColor,
                        border: `1px solid ${feat.accentColor}35`
                      }}>
                        {feat.badge}
                      </span>
                      <div style={{ fontSize: '10px', color: '#64748b', marginTop: '1px', fontWeight: '600' }}>
                        MODUL 0{idx + 1}
                      </div>
                    </div>
                  </div>

                  <h2 style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: '17px',
                    fontWeight: '700',
                    color: '#ffffff',
                    margin: 0,
                    lineHeight: '1.3'
                  }}>
                    {feat.title}
                  </h2>

                  <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0, lineHeight: '1.45' }}>
                    {feat.subtitle}
                  </p>

                  <div style={{ marginTop: 'auto', paddingTop: '6px' }}>
                    <button 
                      onClick={onGetStarted}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#818cf8',
                        fontSize: '12px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: 0
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#c7d2fe'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#818cf8'}
                    >
                      <span>Coba fitur ini di dashboard</span>
                      <Icons.ChevronRight size={13} color="currentColor" />
                    </button>
                  </div>
                </div>

                {/* Right Column: Problem, Solution & Capabilities */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
                    <div style={{
                      background: 'rgba(239, 68, 68, 0.06)',
                      border: '1px solid rgba(239, 68, 68, 0.18)',
                      borderRadius: '10px',
                      padding: '10px 12px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#f87171', fontSize: '11px', fontWeight: '700', marginBottom: '4px' }}>
                        <Icons.AlertTriangle size={13} color="#f87171" />
                        <span>Tantangan Lapangan:</span>
                      </div>
                      <p style={{ color: '#cbd5e1', fontSize: '12px', margin: 0, lineHeight: '1.4' }}>
                        {feat.problem}
                      </p>
                    </div>

                    <div style={{
                      background: 'rgba(16, 185, 129, 0.06)',
                      border: '1px solid rgba(16, 185, 129, 0.18)',
                      borderRadius: '10px',
                      padding: '10px 12px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#34d399', fontSize: '11px', fontWeight: '700', marginBottom: '4px' }}>
                        <Icons.CheckCircle2 size={13} color="#34d399" />
                        <span>Solusi Spy SPSE:</span>
                      </div>
                      <p style={{ color: '#cbd5e1', fontSize: '12px', margin: 0, lineHeight: '1.4' }}>
                        {feat.solution}
                      </p>
                    </div>
                  </div>

                  {/* Capabilities List */}
                  <div style={{
                    background: '#090d19',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: '10px',
                    padding: '12px 14px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: '700', color: '#e2e8f0', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
                      <Icons.Layers size={13} color="#818cf8" />
                      <span>Kemampuan & Spesifikasi:</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {feat.capabilities.map((cap, cIdx) => (
                        <div key={cIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '12px', color: '#cbd5e1', lineHeight: '1.4' }}>
                          <span style={{ color: '#818cf8', fontWeight: 'bold', flexShrink: 0, marginTop: '1px' }}>✓</span>
                          <span>{cap}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* FAQ Section */}
      <div style={{
        background: '#0d1222',
        border: '1px solid rgba(99, 102, 241, 0.16)',
        borderRadius: '16px',
        padding: '24px 20px',
        marginBottom: '36px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.25)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '3px 10px',
            borderRadius: '16px',
            background: 'rgba(99, 102, 241, 0.12)',
            color: '#a5b4fc',
            fontSize: '11px',
            fontWeight: '700',
            marginBottom: '6px'
          }}>
            <Icons.HelpCircle size={12} color="#818cf8" />
            <span>Tanya Jawab</span>
          </div>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '20px', fontWeight: '700', color: '#ffffff', margin: 0 }}>
            Pertanyaan yang Sering Diajukan
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '12px', marginTop: '4px' }}>
            Pahami cara kerja sistem intelijen Spy SPSE sebelum mulai berlangganan
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '780px', margin: '0 auto' }}>
          {faqs.map((faq, fIdx) => {
            const isOpen = activeFaq === fIdx;
            return (
              <div 
                key={fIdx}
                style={{
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '10px',
                  background: 'rgba(9, 13, 25, 0.7)',
                  overflow: 'hidden'
                }}
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : fIdx)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px',
                    background: 'transparent',
                    border: 'none',
                    color: '#f1f5f9',
                    fontSize: '13.5px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  <span>{faq.q}</span>
                  <span style={{
                    transform: isOpen ? 'rotate(90deg)' : 'none',
                    transition: 'transform 0.2s',
                    color: isOpen ? '#818cf8' : '#64748b',
                    fontSize: '12px',
                    flexShrink: 0
                  }}>
                    ➜
                  </span>
                </button>
                {isOpen && (
                  <div style={{
                    padding: '0 16px 14px',
                    fontSize: '12.5px',
                    color: '#94a3b8',
                    lineHeight: '1.5',
                    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                    paddingTop: '10px'
                  }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom CTA Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(168, 85, 247, 0.08) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.25)',
        borderRadius: '16px',
        padding: '32px 20px',
        textAlign: 'center',
        boxShadow: '0 12px 30px rgba(0,0,0,0.3)',
        position: 'relative'
      }}>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '22px', fontWeight: '800', color: '#ffffff', margin: '0 0 8px' }}>
          Siap Menembus Dominasi Kompetitor Anda?
        </h2>
        <p style={{ color: '#cbd5e1', fontSize: '13.5px', maxWidth: '520px', margin: '0 auto 20px', lineHeight: '1.5' }}>
          Mulai pantau ribuan tender LPSE dan buka seluruh intelijen kompetitor di wilayah Anda sekarang juga.
        </p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={onGetStarted}
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              border: 'none',
              color: '#ffffff',
              padding: '11px 24px',
              borderRadius: '10px',
              fontSize: '13.5px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
              transition: 'all 0.2s'
            }}
          >
            <span>{userToken ? 'Akses Dashboard Intelijen' : 'Daftar & Coba Gratis Sekarang'}</span>
            <Icons.ArrowRight size={14} color="#ffffff" />
          </button>
          <button
            onClick={onGoTenders}
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#e2e8f0',
              padding: '11px 20px',
              borderRadius: '10px',
              fontSize: '13.5px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'; }}
          >
            <span>Jelajahi Database Tender</span>
            <Icons.ExternalLink size={13} color="#e2e8f0" />
          </button>
        </div>
      </div>
    </main>
  );
}
