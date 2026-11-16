# Website demo: Video Editor Portfolio

Website portofolio satu halaman untuk video editor. Dibuat sebagai demo jasa pembuatan website.
Persona **Arka Pramudya** beserta karya, klien, dan testimoninya **fiktif**.

- HTML, CSS, dan JavaScript biasa. Tanpa build step dan tanpa `npm install`.
- Konten diambil dari **Google Sheets**, jadi klien bisa mengubah isi tanpa menyentuh kode.
- Dua bahasa: Indonesia & English (tombol ID/EN, atau `?lang=en` di URL).
- Animasi pakai [Motion](https://motion.dev) (file lokal di `assets/vendor/motion.js`).
- Responsif, bisa dipakai dengan keyboard, dan animasi dimatikan untuk pengguna yang memilih *reduce motion*.

## Struktur

```
index.html                 Kerangka halaman
assets/css/style.css       Semua gaya (token warna & font di bagian atas)
assets/js/config.js        PENGATURAN: ID Google Sheet, badge demo, dll.
assets/js/i18n.js          Teks antarmuka (tombol, judul section) ID & EN
assets/js/data.js          Membaca Google Sheets + cache + fallback
assets/js/app.js           Render konten & semua animasi
data/demo-content.js       Data contoh (dipakai kalau sheet belum disambungkan)
sheet-template/            Template Google Sheets (.xlsx dan .csv per tab)
scripts/build-sheet-template.js   Membuat ulang CSV dari data contoh
```

## Menjalankan di komputer

Buka `index.html` langsung di browser, atau jalankan server kecil:

```bash
npx serve .
# atau
python3 -m http.server 8000
```

## Menyambungkan Google Sheets

1. Buka Google Drive, lalu **New → File upload** dan pilih `sheet-template/video-editor-template.xlsx`.
2. Buka file itu, lalu **File → Save as Google Sheets**. Hasilnya punya 7 tab:
   `settings`, `projects`, `services`, `process`, `pricing`, `testimonials`, `faq`.
3. Klik **Share → General access → Anyone with the link → Viewer**.
4. Salin ID dari URL sheet:
   `https://docs.google.com/spreadsheets/d/`**`ID_SHEET_ADA_DI_SINI`**`/edit`
5. Tempel di `assets/js/config.js`:
   ```js
   sheetId: "ID_SHEET_ADA_DI_SINI",
   ```
6. Deploy ulang. Selesai.

Catatan penting:

- **Jangan ubah nama tab dan nama kolom** di baris pertama. Nama tab dan kolom harus sama persis dengan template.
- Semua sel di template berformat **Plain text**. Biarkan begitu supaya Google tidak mengubah `00:45` jadi jam atau nomor WhatsApp jadi angka ilmiah.
- Kolom berakhiran `_id` untuk Bahasa Indonesia, `_en` untuk English. Kalau `_en` kosong, teks Indonesia yang dipakai.
- Beberapa item dalam satu sel dipisah dengan `|`, misalnya `Color grading|Sound design|2x revisi`.
- Sheet yang dibagikan publik bisa dibaca siapa saja yang tahu ID-nya. Jangan simpan data pribadi di sana.
- Perubahan di sheet tampil saat halaman dibuka ulang. Pengunjung yang pernah datang melihat versi cache dulu, lalu konten diperbarui otomatis di latar belakang.
- Kalau sheet gagal dibaca, website memakai data contoh dan menulis alasannya di console browser.

### Isi tab

| Tab | Isi |
| --- | --- |
| `settings` | Pasangan `key` dan nilai: nama, judul hero, deskripsi, kontak, statistik, link showreel. |
| `projects` | Karya. `category` salah satu dari `commercial`, `music`, `wedding`, `social`. `featured` = `TRUE` agar kartunya lebih lebar. `color1`/`color2` untuk warna poster kalau `thumbnail` kosong. |
| `services` | Layanan, harga mulai, dan lama pengerjaan. |
| `process` | Langkah kerja (berurutan). |
| `pricing` | Paket. `highlight` = `TRUE` untuk paket yang ditonjolkan. |
| `testimonials` | Testimoni. |
| `faq` | Pertanyaan & jawaban. |

Di `hero_title`, tanda `|` menentukan pergantian baris. Baris kedua otomatis berwarna kuning.

### Video & thumbnail

`video_url` dan `showreel_url` menerima link **YouTube**, **Vimeo**, **Google Drive** (file yang di-share publik), atau file `.mp4` langsung.
`thumbnail` menerima URL gambar (misalnya dari Cloudinary, atau gambar di folder `assets/`).

Video contoh di data demo adalah film terbuka Blender Foundation (CC BY 3.0) dan ditandai di modal.

## Deploy ke Netlify

1. Push repo ini ke GitHub.
2. Di Netlify: **Add new site → Import an existing project → GitHub**, pilih repo ini.
3. Build command dikosongkan, publish directory `.` (sudah diatur di `netlify.toml`).

Setiap `git push` akan ter-deploy otomatis.

## Menyesuaikan untuk klien

- **Badge demo** di pojok kanan bawah dan kredit di footer: atur di `config.js` → `demo`. Set `show: false` untuk website klien sungguhan.
- **Warna**: ubah token di bagian atas `assets/css/style.css`. Warna `--c-commercial`, `--c-music`, `--c-wedding`, `--c-social` adalah warna kategori karya.
- **Teks tombol dan judul section**: `assets/js/i18n.js`.
- **Adegan di hero** (perbandingan grading) adalah ilustrasi SVG di `index.html`. Bisa diganti foto: taruh `<img>` di `.scene-graded`, dan versi "mentah" otomatis dibuat dengan filter CSS.

## Lisensi pihak ketiga

- Motion: MIT.
- Font Big Shoulders Display dan Hanken Grotesk: SIL Open Font License 1.1 (lihat `assets/fonts/`).
