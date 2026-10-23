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
  Sparkles: ({ className = 'w-4 h-4' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
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
    { id: 'all', label: 'Semua Fitur' },
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
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: Icons.Bell,
      iconBg: 'bg-emerald-500/10 text-emerald-600',
      title: 'Radar Notifikasi Otomatis WhatsApp & Email 24/7',
      subtitle: 'Jangan pernah terlambat tahu saat tender incaran Anda tayang di LPSE',
      problem: 'Banyak kontraktor kehilangan peluang miliaran rupiah hanya karena telat 1 hari mengecek ratusan website LPSE atau melewatkan masa aanwijzing.',
      solution: 'Mesin bot Spy SPSE memindai ribuan server LPSE nasional non-stop setiap beberapa menit. Saat ada paket baru yang cocok dengan kriteria kata kunci, pagu anggaran, atau instansi pilihan Anda, notifikasi ringkas otomatis dikirim ke WhatsApp dan Email Anda.',
      capabilities: [
        'Filter cerdas multi-keyword (contoh: "Gedung", "Jalan", "Pengadaan IT", "Alkes")',
        'Pengaturan rentang nilai pagu (contoh: Rp 500 Juta – Rp 25 Miliar)',
        'Pemilihan instansi atau LPSE spesifik (Provinsi, Kabupaten/Kota, Kementerian, BUMN)',
        'Pengingat otomatis perubahan tahapan krusial (pembukaan penawaran, evaluasi, pengumuman pemenang)'
      ],
      tag: 'Monitoring Otomatis'
    },
    {
      id: 'explorer-tender',
      category: 'monitoring',
      badge: 'Database Nasional',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: Icons.Search,
      iconBg: 'bg-blue-500/10 text-blue-600',
      title: 'Explorer & Mesin Pencari Tender Multi-LPSE',
      subtitle: 'Pencarian instan ribuan paket pengadaan aktif se-Indonesia dalam satu layar',
      problem: 'Membuka puluhan tab browser untuk mengecek LPSE Kementerian PUPR, Pemprov, Pemkab, dan LPSE lain satu per satu sangat melelahkan dan rentan terlewat.',
      solution: 'Spy SPSE mengumpulkan seluruh paket lelang tender dari ratusan LPSE nasional ke dalam satu antarmuka terpusat yang responsif, cepat, dan selalu diperbarui.',
      capabilities: [
        'Pencarian instan berdasarkan nama tender, kode lelang, lokasi satker, atau metode pengadaan',
        'Filter komprehensif: Metode Evaluasi (Harga Terendah / Kualitas / Biaya), Kualifikasi (Usaha Kecil / Non-Kecil)',
        'Sinkronisasi real-time jadwal tahapan resmi LPSE dengan hitung mundur (countdown)',
        'Akses langsung 1-klik menuju link paket resmi di portal LPSE asal tanpa perlu login ulang'
      ],
      tag: 'Multi-LPSE Search'
    },
    {
      id: 'competitor-profile',
      category: 'intelligence',
      badge: 'Deep Analytics',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      icon: Icons.Users,
      iconBg: 'bg-purple-500/10 text-purple-600',
      title: 'Profil Lengkap & Intelijen Kompetitor',
      subtitle: 'Bongkar track record, rasio kemenangan (Win Rate), dan gaya penawaran lawan',
      problem: 'Saat mengajukan penawaran, Anda sering kali buta siapa saja kontraktor lain yang ikut menawar dan berapa rata-rata harga yang biasa mereka tawarkan.',
      solution: 'Ketik nama perusahaan kontraktor atau peserta tender mana pun, dan dapatkan profil lengkap historis: total tender yang pernah diikuti, tingkat kemenangan riil (Win Rate %), total nilai kontrak yang dimenangkan, serta pola diskon penawaran harga terhadap HPS.',
      capabilities: [
        'Kalkulasi otomatis Win Rate % (rasio menang vs kalah dalam 3 tahun terakhir)',
        'Akumulasi nilai kemenangan proyek dan tren skala proyek yang biasa digarap',
        'Distribusi nilai penawaran rata-rata (pola banting harga agresif vs realistis)',
        'Daftar lengkap riwayat keikutsertaan lelang beserta nilai HPS dan penawaran akhirnya'
      ],
      tag: 'Profil Kontraktor'
    },
    {
      id: 'peta-dominasi',
      category: 'intelligence',
      badge: 'Strategi Penetrasi',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: Icons.MapPin,
      iconBg: 'bg-amber-500/10 text-amber-600',
      title: 'Peta Dominasi Wilayah & Satker Langganan',
      subtitle: 'Deteksi instansi/dinas mana yang menjadi basis dominasi utama kompetitor',
      problem: 'Sering kali kontraktor menghabiskan biaya jaminan penawaran dan waktu menyusun dokumen tender di dinas tertentu yang ternyata sudah dikuasai oleh rekanan langganan tetap.',
      solution: 'Algoritma Spy SPSE memetakan konsentrasi kemenangan kontraktor per Satuan Kerja (Satker) dan Dinas. Jika satu kontraktor memenangkan ≥35% proyek di satker yang sama, sistem langsung melabelinya sebagai "Satker Langganan Utama" dengan indikator status proteksi.',
      capabilities: [
        'Deteksi konsentrasi kemenangan per dinas dan instansi secara matematis',
        'Klasifikasi status wilayah: "Dominasi Tinggi" (Sangat Terproteksi) vs "Wilayah Terbuka/Netral"',
        'Rekomendasi taktis: Identifikasi dinas mana yang peluang menangnya tinggi untuk penetrasi baru dan mana yang berisiko tinggi',
        'Visualisasi ranking satker tempat kompetitor paling sering memenangkan proyek APBD/APBN'
      ],
      tag: 'Home Ground Detector'
    },
    {
      id: 'head-to-head',
      category: 'tactical',
      badge: 'Arena Adu Kontraktor',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      icon: Icons.Swords,
      iconBg: 'bg-rose-500/10 text-rose-600',
      title: 'Head-to-Head Comparator Arena (Adu Dua Kontraktor)',
      subtitle: 'Simulasikan duel langsung antara perusahaan Anda dan kompetitor terberat',
      problem: 'Sulit mengetahui seberapa sering Anda bentrok dengan kompetitor utama dan siapa yang lebih unggul dalam lelang bersama di masa lalu.',
      solution: 'Masukkan dua nama kontraktor (misal perusahaan Anda vs rival terberat), arena Head-to-Head akan membedah rekor pertemuan bersama (shared tenders), skor menang-kalah langsung, selisih penawaran harga rata-rata, dan memberikan Strategic Verdict otomatis.',
      capabilities: [
        'Deteksi otomatis seluruh paket tender tempat kedua rekanan pernah sama-sama mendaftar',
        'Perbandingan skor menang langsung (Win-Loss Direct Record)',
        'Analisis Price Gap: berapa persen biasanya lawan memasang harga lebih tinggi atau lebih rendah dari Anda',
        'Strategic Verdict otomatis: rekomendasi taktik penawaran bila kembali bertemu di paket mendatang'
      ],
      tag: 'H2H Battle Analyzer'
    },
    {
      id: 'pokja-weakness',
      category: 'tactical',
      badge: 'Amunisi Sanggahan',
      badgeColor: 'bg-red-50 text-red-700 border-red-200',
      icon: Icons.FileWarning,
      iconBg: 'bg-red-500/10 text-red-600',
      title: 'Matriks Kelemahan Pokja & Amunisi Sanggahan',
      subtitle: 'Audit alasan gugur kompetitor dan siapkan materi sanggahan tender berbasis data',
      problem: 'Saat mengajukan sanggahan ke Pokja Pemilihan, kontraktor sering kali kekurangan data pembanding atau tidak tahu titik lemah riil dari pemenang lelang.',
      solution: 'Spy SPSE mengekstrak seluruh histori evaluasi Pokja pada kompetitor. Anda dapat melihat di aspek mana rekanan tersebut pernah digugurkan (administrasi, kualifikasi teknis, sertifikat SKK personil, kepemilikan alat, atau jaminan bank), lengkap dengan catatan resmi Pokja.',
      capabilities: [
        'Klaster kegagalan: Administrasi, Teknis, SKK/Personil, Peralatan Utama, dan Keuangan',
        'Akses catatan asli Pokja saat menggugurkan rekanan dalam tender-tender sebelumnya',
        'Amunisi kuat untuk menyusun materi sanggahan resmi jika pemenang dinilai tidak memenuhi syarat',
        'Checklist preventif bagi tim tender Anda agar tidak melakukan kesalahan gugur yang sama'
      ],
      tag: 'Audit Kegagalan & Sanggah'
    },
    {
      id: 'executive-dossier',
      category: 'reporting',
      badge: 'Ekspor Formal',
      badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
      icon: Icons.FileSpreadsheet,
      iconBg: 'bg-teal-500/10 text-teal-600',
      title: 'Dossier Intelijen Eksekutif (PDF A4 & Excel Multi-Sheet)',
      subtitle: 'Unduh laporan intelijen rahasia siap presentasi untuk direksi dan pemilik modal',
      problem: 'Menyusun laporan analisa kompetitor secara manual memakan waktu berhari-hari dan sering kali tidak memiliki tampilan formal berstandar eksekutif.',
      solution: 'Hasilkan laporan komprehensif dalam satu klik: Dokumen PDF resmi siap cetak format A4 dengan watermark Confidential, serta file spreadsheet Excel multi-sheet terstruktur lengkap dengan data riwayat, statistik, dan formula.',
      capabilities: [
        'Ekspor PDF A4 profesional dengan ringkasan eksekutif, tabel statistik, dan rekomendasi',
        'Ekspor Excel multi-sheet (Sheet Profil, Riwayat Menang, Satker Dominasi, Analisis Evaluasi)',
        'Siap dibawa ke rapat direksi untuk penentuan pagu penawaran proyek strategis',
        'Watermark keamanan resmi untuk menjaga kerahasiaan intelijen internal perusahaan'
      ],
      tag: 'PDF & Excel Export'
    },
    {
      id: 'co-bidding',
      category: 'intelligence',
      badge: 'Deteksi Koalisi',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      icon: Icons.Share2,
      iconBg: 'bg-indigo-500/10 text-indigo-600',
      title: 'Pelacak Rekanan Co-Bidding & Konsorsium',
      subtitle: 'Ketahui siapa rekanan yang sering maju bersama atau berkoalisi (KSO)',
      problem: 'Sering ada perusahaan bayangan atau grup kontraktor yang selalu ikut bersamaan untuk memenuhi kuota penawar atau mengatur strategi penawaran.',
      solution: 'Sistem menganalisis korelasi keikutsertaan antar rekanan. Anda dapat melihat dengan siapa saja kompetitor Anda paling sering muncul bersama dalam satu lelang, mendeteksi pola aliansi, dan potensi kemitraan KSO.',
      capabilities: [
        'Matriks frekuensi lelang bersama antar kontraktor',
        'Deteksi pola penawaran pendamping (co-bidding patterns)',
        'Identifikasi partner strategis yang cocok diajak konsorsium (KSO) untuk proyek besar'
      ],
      tag: 'Koalisi & Jaringan'
    },
    {
      id: 'sweet-spot',
      category: 'tactical',
      badge: 'Kalkulator Penawaran',
      badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      icon: Icons.Calculator,
      iconBg: 'bg-cyan-500/10 text-cyan-600',
      title: 'Kalkulator Sweet Spot Penawaran Harga',
      subtitle: 'Tentukan harga penawaran paling kompetitif tanpa mengorbankan margin profit',
      problem: 'Menawar terlalu rendah membuat margin proyek habis atau rugi, sedangkan menawar terlalu tinggi pasti kalah dari kontraktor lain.',
      solution: 'Berdasarkan data historis lelang serupa di LPSE target, Spy SPSE memproyeksikan rentang diskon kemenangan (Winning Price Band) yang paling sering lolos evaluasi Pokja dan mengalahkan rival.',
      capabilities: [
        'Rekomendasi persentase penawaran ideal terhadap HPS (misal 88.5% – 93.2%)',
        'Simulasi margin keuntungan vs risiko dikalahkan oleh banting harga lawan',
        'Histori persentase penawaran pemenang di paket sejenis di wilayah yang sama'
      ],
      tag: 'Strategi Harga'
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
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #070a14 0%, #030509 100%)',
      color: '#f1f5f9',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* Top Notice Bar */}
      <div style={{
        background: 'linear-gradient(90deg, #f59e0b, #d97706)',
        color: '#020617',
        padding: '8px 16px',
        textAlign: 'center',
        fontSize: '13px',
        fontWeight: '700',
        letterSpacing: '0.02em'
      }}>
        ⚡ Dokumentasi Resmi Fitur & Kemampuan Platform Intelijen Pengadaan Spy SPSE
      </div>

      {/* Main Navigation Bar */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        background: 'rgba(7, 10, 20, 0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '14px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div 
          onClick={() => onNavigate('landing')}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
        >
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '900',
            color: '#020617',
            fontSize: '18px',
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
          }}>
            S
          </div>
          <div>
            <div style={{ fontWeight: '800', fontSize: '16px', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>{adminSettings?.brand_name || 'Spy SPSE'}</span>
              <span style={{ fontSize: '10px', fontWeight: '800', padding: '2px 6px', borderRadius: '4px', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                FITUR
              </span>
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>Platform Intelijen Tender & Kompetitor LPSE</div>
          </div>
        </div>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            onClick={() => onNavigate('landing')} 
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', padding: '8px 14px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'transparent'; }}
          >
            Beranda
          </button>
          <button 
            onClick={onGoTenders} 
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', padding: '8px 14px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'transparent'; }}
          >
            Cari Tender
          </button>
          <button 
            onClick={onGetStarted} 
            style={{
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              border: 'none',
              color: '#020617',
              padding: '9px 18px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 14px rgba(245, 158, 11, 0.25)',
              transition: 'all 0.2s'
            }}
          >
            <span>{userToken ? 'Buka Dashboard' : 'Mulai Sekarang'}</span>
            <Icons.ArrowRight className="w-3.5 h-3.5" />
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section style={{
        padding: '60px 20px 70px',
        textAlign: 'center',
        position: 'relative',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        background: 'radial-gradient(circle at 50% 0%, rgba(245, 158, 11, 0.08), transparent 70%)'
      }}>
        <div style={{ maxWidth: '840px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '20px',
            background: 'rgba(245, 158, 11, 0.12)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            color: '#fbbf24',
            fontSize: '12px',
            fontWeight: '700',
            marginBottom: '20px'
          }}>
            <Icons.Sparkles className="w-4 h-4" />
            <span>Katalog Lengkap & Spesifikasi Sistem</span>
          </div>

          <h1 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 'clamp(28px, 5vw, 44px)',
            fontWeight: '900',
            color: '#ffffff',
            lineHeight: '1.25',
            margin: '0 0 16px'
          }}>
            Kekuatan Penuh di Tangan Anda untuk <br />
            <span style={{
              background: 'linear-gradient(90deg, #fbbf24, #f59e0b, #d97706)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Memenangkan Tender Pengadaan Pemerintah
            </span>
          </h1>

          <p style={{ color: '#94a3b8', fontSize: '16px', maxWidth: '640px', margin: '0 auto 36px', lineHeight: '1.6' }}>
            Jelajahi setiap modul dan teknologi intelijen yang dirancang khusus untuk membebaskan kontraktor dari ketidakpastian lelang dan tebak-tebakan harga.
          </p>

          {/* Quick Stats Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '12px',
            maxWidth: '680px',
            margin: '0 auto'
          }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255,255,255,0.08)', padding: '14px', borderRadius: '14px' }}>
              <div style={{ fontSize: '24px', fontWeight: '900', color: '#fbbf24' }}>9+</div>
              <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600' }}>Modul Intelijen</div>
            </div>
            <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255,255,255,0.08)', padding: '14px', borderRadius: '14px' }}>
              <div style={{ fontSize: '24px', fontWeight: '900', color: '#34d399' }}>24/7</div>
              <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600' }}>Radar Non-Stop</div>
            </div>
            <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255,255,255,0.08)', padding: '14px', borderRadius: '14px' }}>
              <div style={{ fontSize: '24px', fontWeight: '900', color: '#60a5fa' }}>100%</div>
              <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600' }}>Multi-LPSE Nasional</div>
            </div>
            <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255,255,255,0.08)', padding: '14px', borderRadius: '14px' }}>
              <div style={{ fontSize: '24px', fontWeight: '900', color: '#c084fc' }}>Instan</div>
              <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600' }}>Ekspor PDF & Excel</div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section style={{
        position: 'sticky',
        top: '64px',
        zIndex: 30,
        background: 'rgba(7, 10, 20, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '12px 20px'
      }}>
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          justifyContent: 'flex-start',
          paddingBottom: '2px'
        }}>
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  background: isActive ? '#f59e0b' : 'rgba(15, 23, 42, 0.8)',
                  color: isActive ? '#020617' : '#cbd5e1',
                  border: isActive ? '1px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>{cat.label}</span>
                {cat.id === 'all' && (
                  <span style={{
                    fontSize: '10px',
                    padding: '1px 6px',
                    borderRadius: '10px',
                    background: isActive ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.1)',
                    color: isActive ? '#020617' : '#94a3b8'
                  }}>
                    {features.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Features Showcase List */}
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {filteredFeatures.map((feat, idx) => {
            const IconComponent = feat.icon;
            return (
              <div 
                key={feat.id}
                id={feat.id}
                style={{
                  background: 'rgba(15, 20, 34, 0.85)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '20px',
                  padding: '32px',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.25)',
                  transition: 'border-color 0.2s'
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
                  {/* Left Column: Title & Overview */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '12px',
                        background: 'rgba(245, 158, 11, 0.12)',
                        color: '#fbbf24',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid rgba(245, 158, 11, 0.3)'
                      }}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <span style={{
                          display: 'inline-block',
                          fontSize: '11px',
                          fontWeight: '800',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          background: 'rgba(245, 158, 11, 0.15)',
                          color: '#fbbf24',
                          border: '1px solid rgba(245, 158, 11, 0.3)'
                        }}>
                          {feat.badge}
                        </span>
                        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px', fontWeight: '600' }}>
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

                    <p style={{ color: '#fbbf24', fontSize: '14px', fontWeight: '600', margin: 0 }}>
                      {feat.subtitle}
                    </p>

                    <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
                      <button 
                        onClick={onGetStarted}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#fbbf24',
                          fontSize: '13px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: 0
                        }}
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
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        borderRadius: '12px',
                        padding: '14px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f87171', fontSize: '12px', fontWeight: '800', marginBottom: '6px' }}>
                          <Icons.AlertTriangle className="w-3.5 h-3.5" />
                          <span>Tantangan Lapangan:</span>
                        </div>
                        <p style={{ color: '#cbd5e1', fontSize: '12px', margin: 0, lineHeight: '1.5' }}>
                          {feat.problem}
                        </p>
                      </div>

                      <div style={{
                        background: 'rgba(16, 185, 129, 0.08)',
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                        borderRadius: '12px',
                        padding: '14px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399', fontSize: '12px', fontWeight: '800', marginBottom: '6px' }}>
                          <Icons.CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Solusi Spy SPSE:</span>
                        </div>
                        <p style={{ color: '#cbd5e1', fontSize: '12px', margin: 0, lineHeight: '1.5' }}>
                          {feat.solution}
                        </p>
                      </div>
                    </div>

                    {/* Capabilities */}
                    <div style={{
                      background: 'rgba(11, 15, 25, 0.7)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      borderRadius: '14px',
                      padding: '18px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '800', color: '#e2e8f0', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                        <Icons.Layers className="w-3.5 h-3.5 text-amber-400" />
                        <span>Kemampuan & Spesifikasi:</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {feat.capabilities.map((cap, cIdx) => (
                          <div key={cIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: '#cbd5e1', lineHeight: '1.5' }}>
                            <span style={{ color: '#fbbf24', marginTop: '2px', shrink: 0 }}>✓</span>
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
      </main>

      {/* FAQ Section */}
      <section style={{
        background: 'rgba(10, 13, 24, 0.95)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '60px 20px'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '20px',
              background: 'rgba(255,255,255,0.05)',
              color: '#94a3b8',
              fontSize: '12px',
              fontWeight: '700',
              marginBottom: '10px'
            }}>
              <Icons.HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Tanya Jawab</span>
            </div>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '28px', fontWeight: '800', color: '#ffffff', margin: 0 }}>
              Pertanyaan yang Sering Diajukan
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '8px' }}>
              Pahami lebih mendalam cara kerja sistem kami sebelum mulai berlangganan
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {faqs.map((faq, fIdx) => {
              const isOpen = activeFaq === fIdx;
              return (
                <div 
                  key={fIdx}
                  style={{
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    background: 'rgba(15, 23, 42, 0.6)',
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
                      color: isOpen ? '#fbbf24' : '#64748b'
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
      </section>

      {/* Bottom CTA Banner */}
      <section style={{
        padding: '60px 20px 80px',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'linear-gradient(180deg, #0a0d18 0%, #030509 100%)'
      }}>
        <div style={{
          maxWidth: '860px',
          margin: '0 auto',
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(99, 102, 241, 0.08) 100%)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '24px',
          padding: '40px 24px',
          textAlign: 'center',
          boxShadow: '0 20px 50px rgba(0,0,0,0.4)'
        }}>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '28px', fontWeight: '800', color: '#ffffff', margin: '0 0 12px' }}>
            Siap Menembus Dominasi Kompetitor Anda?
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: '15px', maxWidth: '580px', margin: '0 auto 28px', lineHeight: '1.6' }}>
            Mulai pantau ribuan tender LPSE dan buka seluruh intelijen kompetitor di wilayah Anda sekarang juga.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={onGetStarted}
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                border: 'none',
                color: '#020617',
                padding: '14px 32px',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 8px 24px rgba(245, 158, 11, 0.35)',
                transition: 'all 0.2s'
              }}
            >
              <span>{userToken ? 'Akses Dashboard Intelijen' : 'Daftar & Coba Gratis Sekarang'}</span>
              <Icons.ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onGoTenders}
              style={{
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#e2e8f0',
                padding: '14px 28px',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
            >
              <span>Jelajahi Database Tender</span>
              <Icons.ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: '#030509',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        padding: '30px 20px',
        textAlign: 'center',
        fontSize: '12px',
        color: '#64748b'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
          <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: '#f59e0b', color: '#020617', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '11px' }}>
            S
          </div>
          <span style={{ fontWeight: '700', color: '#cbd5e1' }}>{adminSettings?.brand_name || 'Spy SPSE'}</span>
        </div>
        <p style={{ margin: 0 }}>© {new Date().getFullYear()} {adminSettings?.brand_name || 'Spy SPSE'}. Platform Intelijen Pengadaan & Monitoring Tender SPSE Nasional.</p>
      </footer>
    </div>
  );
}
