/*
  Data contoh. Strukturnya sama persis dengan tab di Google Sheets:
  setiap tab = array baris, setiap baris = { nama_kolom: nilai }.
  Kolom berakhiran _id untuk Bahasa Indonesia, _en untuk English.
  Pisahkan beberapa item dalam satu sel dengan tanda | (garis tegak).
*/
window.DEMO_CONTENT = {
  settings: [
    { key: "name", value_id: "Arka Pramudya", value_en: "Arka Pramudya" },
    { key: "role", value_id: "Video editor & colorist di Bali", value_en: "Video editor & colorist based in Bali" },
    { key: "hero_title", value_id: "Dua jam rekaman.|Enam puluh detik|yang ditonton sampai habis.", value_en: "Two hours of footage.|Sixty seconds|people watch to the end." },
    { key: "hero_sub", value_id: "Saya mengedit iklan, video musik, film pernikahan, dan konten pendek untuk brand dan kreator. Color grading dan sound design sudah termasuk, jadi kamu terima file yang siap tayang.", value_en: "I edit commercials, music videos, wedding films and short-form content for brands and creators. Color grading and sound design are included, so you get a file that's ready to publish." },
    { key: "program_clip", value_id: "Uluwatu_Sunset_v3", value_en: "Uluwatu_Sunset_v3" },
    { key: "showreel_url", value_id: "https://www.youtube.com/watch?v=R6MlUcmOul8", value_en: "https://www.youtube.com/watch?v=R6MlUcmOul8" },
    { key: "showreel_credit", value_id: "Video contoh: Tears of Steel, Blender Foundation (CC BY 3.0).", value_en: "Sample video: Tears of Steel, Blender Foundation (CC BY 3.0)." },
    { key: "tools", value_id: "Premiere Pro|After Effects|DaVinci Resolve|Final Cut Pro|CapCut|Audition", value_en: "Premiere Pro|After Effects|DaVinci Resolve|Final Cut Pro|CapCut|Audition" },
    { key: "about_title", value_id: "Saya memotong sampai ceritanya terasa, bukan sampai durasinya pas.", value_en: "I cut until the story lands, not until the runtime fits." },
    { key: "about_body", value_id: "Tujuh tahun terakhir saya duduk di depan timeline untuk brand lokal, musisi, dan pasangan yang baru menikah. Kebanyakan klien datang dengan hard disk penuh footage dan satu permintaan: bikin ini terasa hidup. Saya mulai dengan mendengarkan musiknya, memilih momen yang jujur, lalu membuang sisanya tanpa ragu. Grading dan audio saya kerjakan sendiri supaya hasil akhirnya utuh.", value_en: "For the past seven years I've sat in front of a timeline for local brands, musicians and newlyweds. Most clients arrive with a hard drive full of footage and one request: make this feel alive. I start by listening to the music, pick the honest moments, and cut the rest without hesitation. I grade and mix everything myself so the final piece holds together." },
    { key: "stat1_value", value_id: "7", value_en: "7" },
    { key: "stat1_label", value_id: "tahun mengedit", value_en: "years editing" },
    { key: "stat2_value", value_id: "240+", value_en: "240+" },
    { key: "stat2_label", value_id: "proyek selesai", value_en: "projects delivered" },
    { key: "stat3_value", value_id: "48", value_en: "48" },
    { key: "stat3_label", value_id: "jam rata-rata sampai draf pertama", value_en: "hours to first cut, on average" },
    { key: "contact_title", value_id: "Punya footage yang menumpuk di hard disk? Kirim ke saya.", value_en: "Got footage piling up on a hard drive? Send it my way." },
    { key: "contact_sub", value_id: "Ceritakan proyekmu, tenggatnya, dan beberapa video yang kamu suka. Saya balas dalam satu hari kerja.", value_en: "Tell me about the project, the deadline and a few videos you like. I reply within one working day." },
    { key: "whatsapp", value_id: "6281200000000", value_en: "6281200000000" },
    { key: "email", value_id: "halo@arkapramudya.example", value_en: "halo@arkapramudya.example" },
    { key: "location", value_id: "Denpasar, Bali", value_en: "Denpasar, Bali" },
    { key: "instagram", value_id: "", value_en: "" },
    { key: "youtube", value_id: "", value_en: "" },
    { key: "seo_title", value_id: "Arka Pramudya, video editor & colorist di Bali", value_en: "Arka Pramudya, video editor & colorist in Bali" },
    { key: "seo_description", value_id: "Edit iklan, video musik, film pernikahan, dan konten pendek, lengkap dengan color grading dan sound design.", value_en: "Commercials, music videos, wedding films and short-form edits, with color grading and sound design included." }
  ],

  projects: [
    { id: "p01", title_id: "Pagi di Tepi Laut", title_en: "Morning by the Shore", client: "Kopi Tepi Laut", category: "commercial", year: "2026", duration: "00:45", color1: "#F2A65A", color2: "#3B2A6B", thumbnail: "", video_url: "https://www.youtube.com/watch?v=R6MlUcmOul8", featured: "TRUE",
      summary_id: "Iklan 45 detik untuk peluncuran biji kopi musim kemarau, disusun dari tiga jam footage satu hari syuting di Sanur.", summary_en: "A 45-second spot for a dry-season coffee launch, built from three hours of footage shot in a single day in Sanur.",
      role_id: "Edit, color grading, sound design", role_en: "Edit, color grading, sound design", credit: "Video contoh: Tears of Steel, Blender Foundation (CC BY 3.0)" },
    { id: "p02", title_id: "Senandika: Pulang", title_en: "Senandika: Pulang", client: "Senandika", category: "music", year: "2025", duration: "03:52", color1: "#F2709C", color2: "#1E2A4A", thumbnail: "", video_url: "https://www.youtube.com/watch?v=eRsGyueVLvQ", featured: "TRUE",
      summary_id: "Video musik dari satu take panjang yang dipotong mengikuti ketukan drum, lalu di-grade dengan palet dingin.", summary_en: "A music video cut from one long take to the drum pattern, then graded in a cold palette.",
      role_id: "Edit, speed ramp, color grading", role_en: "Edit, speed ramps, color grading", credit: "Video contoh: Sintel, Blender Foundation (CC BY 3.0)" },
    { id: "p03", title_id: "Dewi & Krisna", title_en: "Dewi & Krisna", client: "Dewi & Krisna", category: "wedding", year: "2026", duration: "06:10", color1: "#F5C87A", color2: "#5A3B2E", thumbnail: "", video_url: "https://www.youtube.com/watch?v=YE7VzlLtp-4", featured: "FALSE",
      summary_id: "Film pernikahan adat Bali di Tabanan, dari persiapan subuh sampai resepsi malam.", summary_en: "A Balinese wedding film in Tabanan, from the dawn preparations to the evening reception.",
      role_id: "Edit, audio janji nikah, color grading", role_en: "Edit, vow audio, color grading", credit: "Video contoh: Big Buck Bunny, Blender Foundation (CC BY 3.0)" },
    { id: "p04", title_id: "30 Hari Ombak", title_en: "30 Days of Swell", client: "Sanur Surf Co.", category: "social", year: "2026", duration: "00:30", color1: "#3CC6A8", color2: "#14324A", thumbnail: "", video_url: "https://www.youtube.com/watch?v=R6MlUcmOul8", featured: "FALSE",
      summary_id: "Seri 30 video vertikal untuk Reels dan TikTok, satu video setiap hari selama musim ombak.", summary_en: "A series of 30 vertical videos for Reels and TikTok, one a day through the swell season.",
      role_id: "Edit, subtitle, template seri", role_en: "Edit, subtitles, series template", credit: "Video contoh: Tears of Steel, Blender Foundation (CC BY 3.0)" },
    { id: "p05", title_id: "Benang yang Pulang", title_en: "The Thread Comes Home", client: "Rumah Batik Laras", category: "commercial", year: "2025", duration: "02:15", color1: "#C9604A", color2: "#2B2238", thumbnail: "", video_url: "https://www.youtube.com/watch?v=eRsGyueVLvQ", featured: "FALSE",
      summary_id: "Brand film tentang tiga generasi pembatik, dipakai untuk pameran dan halaman utama toko online mereka.", summary_en: "A brand film about three generations of batik makers, used at exhibitions and on their online store's homepage.",
      role_id: "Edit, color grading", role_en: "Edit, color grading", credit: "Video contoh: Sintel, Blender Foundation (CC BY 3.0)" },
    { id: "p06", title_id: "Pagi yang Pelan", title_en: "Slow Mornings", client: "Ubud Yoga Retreat", category: "social", year: "2025", duration: "00:20", color1: "#A9D39A", color2: "#2F3B2A", thumbnail: "", video_url: "https://www.youtube.com/watch?v=YE7VzlLtp-4", featured: "FALSE",
      summary_id: "Dua belas video pendek dengan tempo lambat untuk promosi paket retreat akhir pekan.", summary_en: "Twelve slow-paced short videos promoting a weekend retreat package.",
      role_id: "Edit, sound design", role_en: "Edit, sound design", credit: "Video contoh: Big Buck Bunny, Blender Foundation (CC BY 3.0)" },
    { id: "p07", title_id: "Kelana: Layang-Layang", title_en: "Kelana: Layang-Layang", client: "Kelana", category: "music", year: "2024", duration: "04:05", color1: "#7D8BFF", color2: "#2A1F3D", thumbnail: "", video_url: "https://www.youtube.com/watch?v=eRsGyueVLvQ", featured: "TRUE",
      summary_id: "Video musik yang direkam di festival layang-layang Sanur, dengan potongan cepat di bagian reff.", summary_en: "A music video shot at the Sanur kite festival, with rapid cuts through the chorus.",
      role_id: "Edit, VFX ringan, color grading", role_en: "Edit, light VFX, color grading", credit: "Video contoh: Sintel, Blender Foundation (CC BY 3.0)" },
    { id: "p08", title_id: "Sore di Seminyak", title_en: "Afternoon in Seminyak", client: "Ayu & Bram", category: "wedding", year: "2024", duration: "02:40", color1: "#F0A0A8", color2: "#3A2A44", thumbnail: "", video_url: "https://www.youtube.com/watch?v=R6MlUcmOul8", featured: "FALSE",
      summary_id: "Video prewedding di pantai Seminyak saat matahari terbenam, diedit mengikuti lagu pilihan pasangan.", summary_en: "A pre-wedding film on Seminyak beach at sunset, edited to the couple's chosen song.",
      role_id: "Edit, color grading", role_en: "Edit, color grading", credit: "Video contoh: Tears of Steel, Blender Foundation (CC BY 3.0)" }
  ],

  services: [
    { id: "s1", title_id: "Iklan & brand film", title_en: "Commercials & brand films",
      desc_id: "Untuk peluncuran produk, profil usaha, dan iklan berbayar. Saya susun ceritanya dari footage mentah sampai versi akhir dalam beberapa rasio.", desc_en: "For product launches, company profiles and paid ads. I shape the story from raw footage to a finished cut in every ratio you need.",
      includes_id: "Versi 16:9, 9:16, dan 1:1|Color grading|Sound design & mixing|2x revisi", includes_en: "16:9, 9:16 and 1:1 versions|Color grading|Sound design & mixing|2 rounds of revisions",
      turnaround_id: "5–7 hari kerja", turnaround_en: "5–7 working days", price_from: "Rp3.500.000" },
    { id: "s2", title_id: "Video musik", title_en: "Music videos",
      desc_id: "Edit yang mengikuti ritme lagu, termasuk efek visual ringan dan grading yang sejalan dengan mood album.", desc_en: "Edits that follow the song's rhythm, with light visual effects and a grade that matches the album's mood.",
      includes_id: "Potongan sinkron dengan ketukan|VFX ringan & speed ramp|Color grading|2x revisi", includes_en: "Beat-synced cutting|Light VFX & speed ramps|Color grading|2 rounds of revisions",
      turnaround_id: "7–10 hari kerja", turnaround_en: "7–10 working days", price_from: "Rp4.000.000" },
    { id: "s3", title_id: "Film pernikahan", title_en: "Wedding films",
      desc_id: "Film highlight 5–8 menit dan teaser satu menit untuk media sosial, dari footage tim videografermu.", desc_en: "A 5–8 minute highlight film and a one-minute teaser for social media, cut from your videographer's footage.",
      includes_id: "Highlight film|Teaser vertikal 60 detik|Audio janji nikah dibersihkan|Kirim lewat Google Drive", includes_en: "Highlight film|60-second vertical teaser|Cleaned-up vow audio|Delivered via Google Drive",
      turnaround_id: "14–21 hari kerja", turnaround_en: "14–21 working days", price_from: "Rp5.500.000" },
    { id: "s4", title_id: "Konten pendek bulanan", title_en: "Monthly short-form",
      desc_id: "Paket bulanan untuk Reels, TikTok, dan Shorts. Kamu kirim footage, saya kirim video yang siap diunggah.", desc_en: "A monthly package for Reels, TikTok and Shorts. You send footage, I send back videos ready to post.",
      includes_id: "10–30 video per bulan|Subtitle & teks animasi|Template yang konsisten dengan brand|1x revisi per video", includes_en: "10–30 videos a month|Subtitles & animated text|Templates that match your brand|1 revision per video",
      turnaround_id: "2–3 hari per video", turnaround_en: "2–3 days per video", price_from: "Rp1.500.000" }
  ],

  process: [
    { step: "1", title_id: "Brief", title_en: "Brief", desc_id: "Kita bahas tujuan video, siapa penontonnya, dan referensi yang kamu suka. Footage dikirim lewat Google Drive.", desc_en: "We talk through the goal, the audience and references you like. You send the footage over Google Drive.", days: "1" },
    { step: "2", title_id: "Rough cut", title_en: "Rough cut", desc_id: "Saya susun alur cerita dan kirim draf pertama untuk kamu tonton.", desc_en: "I build the story and send you a first cut to watch.", days: "2–4" },
    { step: "3", title_id: "Revisi", title_en: "Revisions", desc_id: "Kamu kasih catatan langsung di timecode-nya. Saya rapikan tempo dan pilihan shot.", desc_en: "You leave notes right on the timecode. I tighten the pacing and the shot choices.", days: "1–2" },
    { step: "4", title_id: "Grading & audio", title_en: "Grade & mix", desc_id: "Warna disamakan antar-shot, lalu audio dibersihkan dan di-mix.", desc_en: "Color is matched shot to shot, then the audio is cleaned up and mixed.", days: "1–2" },
    { step: "5", title_id: "Kirim master", title_en: "Delivery", desc_id: "File final dalam rasio dan resolusi yang kamu butuhkan, plus versi untuk media sosial.", desc_en: "Final files in the ratios and resolutions you need, plus versions for social media.", days: "1" }
  ],

  pricing: [
    { id: "starter", name_id: "Starter", name_en: "Starter", price: "Rp1.500.000", unit_id: "per bulan", unit_en: "per month",
      desc_id: "Untuk kreator dan UMKM yang rutin posting.", desc_en: "For creators and small businesses who post regularly.",
      features_id: "10 video pendek per bulan|Subtitle yang dicek manual|1x revisi per video|Durasi maksimal 60 detik", features_en: "10 short videos a month|Hand-checked subtitles|1 revision per video|Up to 60 seconds each", highlight: "FALSE" },
    { id: "brand", name_id: "Brand", name_en: "Brand", price: "Rp3.500.000", unit_id: "per proyek", unit_en: "per project",
      desc_id: "Satu video utama untuk kampanye atau peluncuran.", desc_en: "One hero video for a campaign or launch.",
      features_id: "1 video sampai 2 menit|3 rasio: 16:9, 9:16, 1:1|Color grading & sound design|2x revisi|Musik berlisensi", features_en: "1 video up to 2 minutes|3 ratios: 16:9, 9:16, 1:1|Color grading & sound design|2 rounds of revisions|Licensed music", highlight: "TRUE" },
    { id: "wedding", name_id: "Wedding", name_en: "Wedding", price: "Rp5.500.000", unit_id: "per acara", unit_en: "per event",
      desc_id: "Highlight dan teaser dari footage hari pernikahanmu.", desc_en: "A highlight film and teaser from your wedding-day footage.",
      features_id: "Highlight film 5–8 menit|Teaser 60 detik|Audio janji nikah|Upload footage lewat Google Drive", features_en: "5–8 minute highlight film|60-second teaser|Vow audio|Footage upload via Google Drive", highlight: "FALSE" }
  ],

  testimonials: [
    { name: "Sari Wulandari", role_id: "Pemilik, Kopi Tepi Laut", role_en: "Owner, Kopi Tepi Laut",
      quote_id: "Footage kami berantakan, tapi Arka bisa menemukan ceritanya. Iklannya masih kami pakai sampai sekarang.", quote_en: "Our footage was a mess, but Arka found the story in it. We're still running that ad today." },
    { name: "Gilang Mahendra", role_id: "Vokalis, Senandika", role_en: "Vocalist, Senandika",
      quote_id: "Dia mengedit sambil mendengarkan lagunya, bukan cuma melihat gambarnya. Setiap potongan jatuh tepat di ketukan.", quote_en: "He edits while listening to the song, not just watching the picture. Every cut lands right on the beat." },
    { name: "Dewi & Krisna", role_id: "Pasangan pengantin", role_en: "Newlyweds",
      quote_id: "Kami menangis menonton highlight-nya. Momen kecil yang kami sendiri sudah lupa, semuanya ada di sana.", quote_en: "We cried watching the highlight film. Little moments we'd already forgotten were all there." }
  ],

  faq: [
    { q_id: "Bagaimana cara mengirim footage?", q_en: "How do I send you the footage?",
      a_id: "Lewat Google Drive, Dropbox, atau WeTransfer. Untuk proyek di Bali, hard disk juga bisa diantar langsung.", a_en: "Through Google Drive, Dropbox or WeTransfer. For projects in Bali, you can also drop off a hard drive." },
    { q_id: "Berapa kali saya bisa minta revisi?", q_en: "How many revisions do I get?",
      a_id: "Tergantung paket, biasanya dua kali. Revisi tambahan dihitung per jam kerja.", a_en: "It depends on the package, usually two rounds. Extra revisions are billed by the hour." },
    { q_id: "Apakah musiknya aman dari klaim hak cipta?", q_en: "Is the music safe from copyright claims?",
      a_id: "Saya memakai musik berlisensi dari library berbayar, atau musik yang kamu sediakan sendiri.", a_en: "I use licensed tracks from a paid music library, or music you supply yourself." },
    { q_id: "Bisa kerja jarak jauh?", q_en: "Can we work remotely?",
      a_id: "Bisa. Sebagian besar klien saya di luar Bali, dan semua review dilakukan online.", a_en: "Yes. Most of my clients are outside Bali, and every review happens online." },
    { q_id: "Bagaimana sistem pembayarannya?", q_en: "How does payment work?",
      a_id: "DP 50% di awal, pelunasan sebelum file master dikirim.", a_en: "50% up front, and the balance before the master files are delivered." }
  ]
};
