import React, { useState } from 'react';

// Lightweight inline SVG icons matching design aesthetic
const Icons = {
  Bell: ({ className = 'w-5 h-5' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  Search: ({ className = 'w-5 h-5' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Users: ({ className = 'w-5 h-5' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  MapPin: ({ className = 'w-5 h-5' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Swords: ({ className = 'w-5 h-5' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
  FileWarning: ({ className = 'w-5 h-5' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="12" y1="12" x2="12" y2="15" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  ),
  FileSpreadsheet: ({ className = 'w-5 h-5' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M8 13h8" />
      <path d="M8 17h8" />
      <path d="M12 10v10" />
    </svg>
  ),
  Share2: ({ className = 'w-5 h-5' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  ),
  Calculator: ({ className = 'w-5 h-5' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
  CheckCircle2: ({ className = 'w-4 h-4' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  ArrowRight: ({ className = 'w-4 h-4' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  ChevronRight: ({ className = 'w-4 h-4' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  Layers: ({ className = 'w-4 h-4' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  ),
  ExternalLink: ({ className = 'w-4 h-4' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  ),
  AlertTriangle: ({ className = 'w-4 h-4' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  HelpCircle: ({ className = 'w-4 h-4' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
      problem: 'Banyak kontraktor kehilangan peluang proyek miliaran rupiah hanya karena telat mengecek puluhan portal LPSE atau melewatkan masa aanwijzing.',
      solution: 'Mesin bot Spy SPSE memindai ratusan LPSE nasional secara otomatis setiap beberapa menit. Saat ada paket lelang baru yang sesuai dengan kata kunci, rentang pagu, atau satker incaran Anda, notifikasi langsung dikirim ke WhatsApp dan Email Anda.',
      capabilities: [
        'Filter cerdas multi-keyword (contoh: "Gedung", "Jalan", "Pengadaan IT", "Alkes")',
        'Pengaturan rentang nilai pagu (contoh: Rp 500 Juta – Rp 25 Miliar)',
        'Pemilihan instansi atau LPSE spesifik (Provinsi, Kabupaten/Kota, Kementerian, BUMN)',
        'Pengingat otomatis perubahan tahapan krusial (pembukaan penawaran, evaluasi, sanggahan, pengumuman pemenang)'
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
      problem: 'Membuka puluhan tab browser untuk mengecek LPSE Kementerian PUPR, Pemprov, Pemkab, dan instansi lain satu per satu sangat melelahkan dan rawan terlewat.',
      solution: 'Spy SPSE mengumpulkan seluruh paket lelang tender dari ratusan LPSE nasional ke dalam satu antarmuka terpusat yang responsif, cepat, dan selalu terbarui.',
      capabilities: [
        'Pencarian instan berdasarkan nama tender, kode lelang, lokasi satker, atau metode pengadaan',
        'Filter komprehensif: Metode Evaluasi (Harga Terendah / Kualitas), Kualifikasi (Usaha Kecil / Non-Kecil)',
        'Sinkronisasi real-time jadwal tahapan resmi LPSE dengan hitung mundur (countdown)',
        'Akses langsung 1-klik menuju link paket resmi di portal LPSE asal tanpa perlu login ulang'
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
      subtitle: 'Bongkar track record, rasio kemenangan (Win Rate), dan gaya penawaran lawan',
      problem: 'Saat mengajukan penawaran, Anda sering kali buta siapa saja kontraktor lain yang ikut menawar dan berapa rata-rata harga yang biasa mereka tawarkan.',
      solution: 'Ketik nama perusahaan kontraktor mana pun, dan dapatkan profil lengkap historis: total tender yang pernah diikuti, tingkat kemenangan riil (Win Rate %), total nilai kontrak yang dimenangkan, serta pola diskon penawaran harga terhadap HPS.',
      capabilities: [
        'Kalkulasi otomatis Win Rate % (rasio menang vs kalah dalam 3 tahun terakhir)',
        'Akumulasi nilai kemenangan proyek dan tren skala proyek yang biasa digarap',
        'Distribusi nilai penawaran rata-rata (pola banting harga agresif vs realistis)',
        'Daftar lengkap riwayat keikutsertaan lelang beserta nilai HPS dan penawaran akhirnya'
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
      problem: 'Sering kali kontraktor menghabiskan biaya jaminan penawaran dan waktu menyusun dokumen tender di dinas tertentu yang ternyata sudah dikuasai oleh rekanan langganan tetap.',
      solution: 'Algoritma Spy SPSE memetakan konsentrasi kemenangan kontraktor per Satuan Kerja (Satker) dan Dinas. Jika satu kontraktor memenangkan ≥35% proyek di satker yang sama, sistem langsung melabelinya sebagai "Satker Langganan Utama" dengan indikator status proteksi wilayah.',
      capabilities: [
        'Deteksi konsentrasi kemenangan per dinas dan instansi secara matematis',
        'Klasifikasi status wilayah: "Dominasi Tinggi" (Sangat Terproteksi) vs "Wilayah Terbuka/Netral"',
        'Rekomendasi taktis: Identifikasi dinas mana yang peluang menangnya tinggi untuk penetrasi baru dan mana yang berisiko tinggi',
        'Visualisasi ranking satker tempat kompetitor paling sering memenangkan proyek APBD/APBN'
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
      solution: 'Masukkan dua nama kontraktor (misal perusahaan Anda vs rival terberat), arena Head-to-Head akan membedah rekor pertemuan bersama (shared tenders), skor menang-kalah langsung, selisih penawaran harga rata-rata, dan memberikan Strategic Verdict otomatis.',
      capabilities: [
        'Deteksi otomatis seluruh paket tender tempat kedua rekanan pernah sama-sama mendaftar',
        'Perbandingan skor menang langsung (Win-Loss Direct Record)',
        'Analisis Price Gap: berapa persen biasanya lawan memasang harga lebih tinggi atau lebih rendah dari Anda',
        'Strategic Verdict otomatis: rekomendasi taktik penawaran bila kembali bertemu di paket mendatang'
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
      subtitle: 'Audit alasan gugur kompetitor dan siapkan materi sanggahan tender berbasis data',
      problem: 'Saat mengajukan sanggahan ke Pokja Pemilihan, kontraktor sering kali kekurangan data pembanding atau tidak tahu titik lemah riil dari pemenang lelang.',
      solution: 'Spy SPSE mengekstrak seluruh histori evaluasi Pokja pada kompetitor. Anda dapat melihat di aspek mana rekanan tersebut pernah digugurkan (administrasi, kualifikasi teknis, sertifikat SKK personil, kepemilikan alat, atau jaminan bank), lengkap dengan catatan resmi Pokja.',
      capabilities: [
        'Klaster kegagalan: Administrasi, Teknis, SKK/Personil, Peralatan Utama, dan Keuangan',
        'Akses catatan asli Pokja saat menggugurkan rekanan dalam tender-tender sebelumnya',
        'Amunisi kuat untuk menyusun materi sanggahan resmi jika pemenang dinilai tidak memenuhi syarat',
        'Checklist preventif bagi tim tender Anda agar tidak melakukan kesalahan gugur yang sama'
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
      subtitle: 'Unduh laporan intelijen rahasia siap presentasi untuk direksi dan pemilik modal',
      problem: 'Menyusun laporan analisa kompetitor secara manual memakan waktu berhari-hari dan sering kali tidak memiliki tampilan formal berstandar eksekutif.',
      solution: 'Hasilkan laporan komprehensif dalam satu klik: Dokumen PDF resmi siap cetak format A4 dengan watermark Confidential, serta file spreadsheet Excel multi-sheet terstruktur lengkap dengan data riwayat, statistik, dan formula.',
      capabilities: [
        'Ekspor PDF A4 profesional dengan ringkasan eksekutif, tabel statistik, dan rekomendasi',
        'Ekspor Excel multi-sheet (Sheet Profil, Riwayat Menang, Satker Dominasi, Analisis Evaluasi)',
        'Siap dibawa ke rapat direksi untuk penentuan pagu penawaran proyek strategis',
        'Watermark keamanan resmi untuk menjaga kerahasiaan intelijen internal perusahaan'
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
      problem: 'Sering ada rekanan bayangan atau grup kontraktor yang selalu ikut bersamaan untuk memenuhi kuota penawar atau mengatur strategi penawaran.',
      solution: 'Sistem menganalisis korelasi keikutsertaan antar rekanan. Anda dapat melihat dengan siapa saja kompetitor Anda paling sering muncul bersama dalam satu lelang, mendeteksi pola aliansi, dan potensi kemitraan KSO.',
      capabilities: [
        'Matriks frekuensi lelang bersama antar kontraktor',
        'Deteksi pola penawaran pendamping (co-bidding patterns)',
        'Identifikasi partner strategis yang cocok diajak konsorsium (KSO) untuk proyek besar'
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
      problem: 'Menawar terlalu rendah membuat margin proyek habis atau rugi, sedangkan menawar terlalu tinggi pasti kalah dari kontraktor lain.',
      solution: 'Berdasarkan data historis lelang serupa di LPSE target, Spy SPSE memproyeksikan rentang diskon kemenangan (Winning Price Band) yang paling sering lolos evaluasi Pokja dan mengalahkan rival.',
      capabilities: [
        'Rekomendasi persentase penawaran ideal terhadap HPS (misal 88.5% – 93.2%)',
        'Simulasi margin keuntungan vs risiko dikalahkan oleh banting harga lawan',
        'Histori persentase penawaran pemenang di paket sejenis di wilayah yang sama'
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
    <main style={{ flexGrow: 1, padding: '40px 20px 60px', maxWidth: '1180px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      {/* Hero Section */}
      <div style={{ textAlign: 'center', marginBottom: '48px', maxWidth: '860px', margin: '0 auto 48px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(99, 102, 241, 0.12)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          padding: '6px 16px',
          borderRadius: '24px',
          fontSize: '12px',
          fontWeight: '700',
          color: '#a5b4fc',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '20px'
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6366f1', boxShadow: '0 0 8px #6366f1' }} />
          Katalog Modul & Spesifikasi Sistem
        </div>

        <h1 style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: 'clamp(30px, 5vw, 48px)',
          fontWeight: '900',
          color: '#ffffff',
          lineHeight: '1.22',
          letterSpacing: '-0.02em',
          margin: '0 0 16px'
        }}>
          Kekuatan Penuh di Tangan Anda untuk <br />
          <span style={{
            background: 'linear-gradient(135deg, #a5b4fc 0%, #6366f1 50%, #c084fc 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Memenangkan Tender Pengadaan Pemerintah
          </span>
        </h1>

        <p style={{ color: '#94a3b8', fontSize: '16px', maxWidth: '660px', margin: '0 auto 36px', lineHeight: '1.6' }}>
          Jelajahi setiap modul dan teknologi intelijen yang dirancang khusus untuk membebaskan kontraktor dari ketidakpastian lelang dan tebak-tebakan harga.
        </p>

        {/* Quick Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '14px',
          maxWidth: '720px',
          margin: '0 auto'
        }}>
          <div style={{ background: '#0e1424', border: '1px solid rgba(255,255,255,0.06)', padding: '16px', borderRadius: '16px', boxShadow: '0 8px 20px rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize: '28px', fontWeight: '900', color: '#818cf8', fontFamily: "'Outfit', sans-serif" }}>9+</div>
            <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600', marginTop: '2px' }}>Modul Intelijen</div>
          </div>
          <div style={{ background: '#0e1424', border: '1px solid rgba(255,255,255,0.06)', padding: '16px', borderRadius: '16px', boxShadow: '0 8px 20px rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize: '28px', fontWeight: '900', color: '#34d399', fontFamily: "'Outfit', sans-serif" }}>24/7</div>
            <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600', marginTop: '2px' }}>Radar Non-Stop</div>
          </div>
          <div style={{ background: '#0e1424', border: '1px solid rgba(255,255,255,0.06)', padding: '16px', borderRadius: '16px', boxShadow: '0 8px 20px rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize: '28px', fontWeight: '900', color: '#60a5fa', fontFamily: "'Outfit', sans-serif" }}>100%</div>
            <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600', marginTop: '2px' }}>Multi-LPSE Nasional</div>
          </div>
          <div style={{ background: '#0e1424', border: '1px solid rgba(255,255,255,0.06)', padding: '16px', borderRadius: '16px', boxShadow: '0 8px 20px rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize: '28px', fontWeight: '900', color: '#c084fc', fontFamily: "'Outfit', sans-serif" }}>Instan</div>
            <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600', marginTop: '2px' }}>Ekspor PDF & Excel</div>
          </div>
        </div>
      </div>

      {/* Category Filter Pills (matching PublicBlogPage style) */}
      <div style={{
        display: 'flex',
        gap: '10px',
        overflowX: 'auto',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginBottom: '40px',
        padding: '4px'
      }}>
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                background: isActive ? 'linear-gradient(135deg, #4f46e5, #6366f1)' : 'rgba(255, 255, 255, 0.04)',
                color: isActive ? '#ffffff' : '#9ca3af',
                border: `1px solid ${isActive ? '#818cf8' : 'rgba(255, 255, 255, 0.08)'}`,
                padding: '8px 18px',
                borderRadius: '24px',
                fontSize: '13px',
                fontWeight: isActive ? '700' : '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: isActive ? '0 4px 14px rgba(79, 70, 229, 0.4)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>{cat.label}</span>
              {cat.id === 'all' && (
                <span style={{
                  fontSize: '11px',
                  padding: '1px 6px',
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', marginBottom: '60px' }}>
        {filteredFeatures.map((feat, idx) => {
          const IconComponent = feat.icon;
          return (
            <div 
              key={feat.id}
              id={feat.id}
              style={{
                background: '#0d1222',
                border: '1px solid rgba(99, 102, 241, 0.18)',
                borderRadius: '20px',
                padding: '32px',
                boxShadow: '0 12px 35px rgba(0,0,0,0.3)',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '32px' }}>
                {/* Left Column: Title & Overview */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '14px',
                      background: feat.iconBg,
                      color: feat.accentColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: `1px solid ${feat.accentColor}33`
                    }}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <span style={{
                        display: 'inline-block',
                        fontSize: '11px',
                        fontWeight: '800',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        background: `${feat.accentColor}18`,
                        color: feat.accentColor,
                        border: `1px solid ${feat.accentColor}40`
                      }}>
                        {feat.badge}
                      </span>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px', fontWeight: '600', letterSpacing: '0.05em' }}>
                        MODUL 0{idx + 1}
                      </div>
                    </div>
                  </div>

                  <h2 style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: '22px',
                    fontWeight: '800',
                    color: '#ffffff',
                    margin: 0,
                    lineHeight: '1.3'
                  }}>
                    {feat.title}
                  </h2>

                  <p style={{ color: '#a5b4fc', fontSize: '14px', fontWeight: '500', margin: 0, lineHeight: '1.5' }}>
                    {feat.subtitle}
                  </p>

                  <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
                    <button 
                      onClick={onGetStarted}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#818cf8',
                        fontSize: '13px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: 0,
                        transition: 'color 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#c7d2fe'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#818cf8'}
                    >
                      <span>Coba fitur ini di dashboard</span>
                      <Icons.ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Right Column: Problem, Solution & Capabilities */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                    <div style={{
                      background: 'rgba(239, 68, 68, 0.08)',
                      border: '1px solid rgba(239, 68, 68, 0.22)',
                      borderRadius: '12px',
                      padding: '16px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f87171', fontSize: '12px', fontWeight: '800', marginBottom: '8px' }}>
                        <Icons.AlertTriangle className="w-3.5 h-3.5" />
                        <span>Tantangan Lapangan:</span>
                      </div>
                      <p style={{ color: '#cbd5e1', fontSize: '13px', margin: 0, lineHeight: '1.5' }}>
                        {feat.problem}
                      </p>
                    </div>

                    <div style={{
                      background: 'rgba(16, 185, 129, 0.08)',
                      border: '1px solid rgba(16, 185, 129, 0.22)',
                      borderRadius: '12px',
                      padding: '16px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399', fontSize: '12px', fontWeight: '800', marginBottom: '8px' }}>
                        <Icons.CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Solusi Spy SPSE:</span>
                      </div>
                      <p style={{ color: '#cbd5e1', fontSize: '13px', margin: 0, lineHeight: '1.5' }}>
                        {feat.solution}
                      </p>
                    </div>
                  </div>

                  {/* Capabilities List */}
                  <div style={{
                    background: '#090d19',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '14px',
                    padding: '18px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '800', color: '#e2e8f0', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                      <Icons.Layers className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Kemampuan & Spesifikasi:</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {feat.capabilities.map((cap, cIdx) => (
                        <div key={cIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: '#cbd5e1', lineHeight: '1.5' }}>
                          <span style={{ color: '#818cf8', marginTop: '2px', flexShrink: 0, fontWeight: 'bold' }}>✓</span>
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
        border: '1px solid rgba(99, 102, 241, 0.18)',
        borderRadius: '24px',
        padding: '40px 28px',
        marginBottom: '60px',
        boxShadow: '0 12px 35px rgba(0,0,0,0.3)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 12px',
            borderRadius: '20px',
            background: 'rgba(99, 102, 241, 0.12)',
            color: '#a5b4fc',
            fontSize: '12px',
            fontWeight: '700',
            marginBottom: '10px'
          }}>
            <Icons.HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
            <span>Tanya Jawab</span>
          </div>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '26px', fontWeight: '800', color: '#ffffff', margin: 0 }}>
            Pertanyaan yang Sering Diajukan
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '6px' }}>
            Pahami lebih mendalam cara kerja sistem kami sebelum mulai berlangganan
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '840px', margin: '0 auto' }}>
          {faqs.map((faq, fIdx) => {
            const isOpen = activeFaq === fIdx;
            return (
              <div 
                key={fIdx}
                style={{
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  background: 'rgba(9, 13, 25, 0.7)',
                  overflow: 'hidden'
                }}
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : fIdx)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    background: 'transparent',
                    border: 'none',
                    color: '#f1f5f9',
                    fontSize: '15px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  <span>{faq.q}</span>
                  <span style={{
                    transform: isOpen ? 'rotate(90deg)' : 'none',
                    transition: 'transform 0.2s',
                    color: isOpen ? '#818cf8' : '#64748b'
                  }}>
                    ➜
                  </span>
                </button>
                {isOpen && (
                  <div style={{
                    padding: '0 20px 18px',
                    fontSize: '14px',
                    color: '#94a3b8',
                    lineHeight: '1.6',
                    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                    paddingTop: '12px'
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
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.1) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        borderRadius: '24px',
        padding: '48px 24px',
        textAlign: 'center',
        boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '28px', fontWeight: '800', color: '#ffffff', margin: '0 0 12px' }}>
          Siap Menembus Dominasi Kompetitor Anda?
        </h2>
        <p style={{ color: '#cbd5e1', fontSize: '15px', maxWidth: '580px', margin: '0 auto 28px', lineHeight: '1.6' }}>
          Mulai pantau ribuan tender LPSE dan buka seluruh intelijen kompetitor di wilayah Anda sekarang juga.
        </p>
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={onGetStarted}
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              border: 'none',
              color: '#ffffff',
              padding: '14px 32px',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)',
              transition: 'all 0.2s'
            }}
          >
            <span>{userToken ? 'Akses Dashboard Intelijen' : 'Daftar & Coba Gratis Sekarang'}</span>
            <Icons.ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onGoTenders}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#e2e8f0',
              padding: '14px 28px',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; }}
          >
            <span>Jelajahi Database Tender</span>
            <Icons.ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </main>
  );
}
