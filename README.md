# Era Visual — Website & Sistem Order

Website resmi Era Visual: profil, katalog layanan, sistem order multi-cabang, dan dashboard admin. Dibangun sebagai HTML/CSS/JS statis murni supaya bisa langsung di-host lewat **GitHub Pages** tanpa server tambahan.

## 1. Struktur Proyek

```
era-visual/
├── index.html          Home
├── layanan.html         Daftar layanan + status
├── cabang.html          Daftar cabang + karyawan per cabang
├── pesan.html           Wizard order (Cabang → Layanan → Karyawan → Form → Konfirmasi)
├── cara-order.html      Panduan langkah order
├── tentang.html         Tentang Era Visual
├── kontak.html          Kontak
├── admin/
│   ├── index.html       Dashboard admin (dengan gerbang PIN)
│   └── admin.js         Logika CRUD dashboard
├── assets/
│   ├── css/style.css    Seluruh styling & design system
│   └── js/
│       ├── data.js      Data awal (seed) + semua fungsi baca/tulis data
│       ├── app.js       Navbar, footer, helper bersama
│       └── order.js     Logika wizard pesan layanan
└── README.md
```

## 2. Fitur yang Sudah Dibuat

- Halaman profil lengkap: Home, Layanan, Cabang, Cara Order, Tentang Kami, Kontak.
- Wizard order 5 langkah: Pilih Cabang → Pilih Layanan → Pilih Karyawan → Form Detail → Konfirmasi.
- Karyawan yang tampil di langkah "Pilih Karyawan" otomatis difilter: hanya yang aktif, dari cabang yang dipilih, dan punya layanan yang dipilih.
- Setelah order dikirim, tersedia tombol **Kirim Detail ke WhatsApp** yang membuka `wa.me` dengan pesan otomatis berisi nomor order, cabang, layanan, penanggung jawab, dan deskripsi.
- Status order: `Menunggu Konfirmasi → Dikonfirmasi → Diproses → Selesai`, plus `Dibatalkan`.
- Sistem multi-cabang: Cabang Ende aktif (dengan data karyawan), Cabang Batam berstatus "Segera Hadir" tapi struktur datanya sudah siap dipakai begitu ada data asli.
- Layanan dengan 3 status berbeda: Aktif (Electrical, Editor), Tahap Pengembangan (Mechanical), Segera Hadir (Sewing).
- Dashboard admin (`/admin`) untuk kelola Cabang, Karyawan (tambah **dan edit**), Layanan, Berita/Info, Order (lihat & filter & ubah status), dan Kontak.
- Halaman **Berita/Info/Iklan** (`berita.html`) — kartu foto + judul + cuplikan + baca selengkapnya, dikelola dari Dashboard Admin.
- Login admin dengan **Google** (opsional, perlu Client ID) atau **PIN**, plus notifikasi email otomatis setiap ada yang login.
- Desain mobile-first, responsif, dengan navbar hamburger di layar kecil.

## 3. Struktur Data

Semua data disimpan di **localStorage** browser (key `era_visual_db_v1`), dengan bentuk:

```
{
  contact:   { email, whatsapp, whatsapp_display, instagram },
  branches:  [{ id, name, status }],                 // status: 'active' | 'coming_soon'
  services:  [{ id, name, icon, status, short, description, isLocal }],
  employees: [{ id, name, role, branchId, serviceIds:[], whatsapp, photo, description, active }],
  orders:    [{ id, orderNumber, branchId, serviceId, employeeId, customerName, ... , status, createdAt }]
}
```

Relasi order mengikuti: **Order → Cabang → Layanan → Karyawan → Pelanggan**, persis sesuai rancangan awal.

Hanya data berikut yang nyata (bukan placeholder): nama bisnis, tahun berdiri, cabang Ende, kontak resmi, dan Ewaldus Sangga sebagai Leader/Penanggung Jawab. **Karyawan 02** dan **Karyawan 03** sengaja diisi placeholder — silakan diganti lewat dashboard admin.

## 4. Cara Menambah Cabang

1. Buka `/admin` → menu **Cabang**.
2. Isi nama cabang baru dan pilih status (Aktif / Segera Hadir).
3. Klik **Tambah Cabang**. Cabang langsung muncul di halaman "Pilih Cabang" pada wizard order dan halaman Cabang.

## 5. Cara Menambah Karyawan

1. Buka `/admin` → menu **Karyawan**.
2. Isi nama, jabatan, pilih cabang, centang layanan/divisi yang dikuasai, isi nomor WhatsApp.
3. Klik **Tambah Karyawan**. Karyawan otomatis muncul di langkah "Pilih Karyawan" untuk kombinasi cabang + layanan yang sesuai.
4. Kolom **Aktif** di tabel bisa dicentang/dilepas untuk menyembunyikan karyawan tanpa menghapus datanya.

## 6. Cara Menambah / Mengubah Layanan

Saat ini status dan deskripsi singkat 4 layanan (Electrical, Editor, Mechanical, Sewing) bisa diubah lewat `/admin` → menu **Layanan**. Untuk menambah layanan baru sepenuhnya (ikon, deskripsi panjang, apakah butuh lokasi), edit array `services` di `assets/js/data.js` — sudah disiapkan sebagai satu objek per layanan sehingga tinggal disalin polanya.

## 7. Cara Mengelola Order

1. Buka `/admin` → menu **Order** (halaman default saat login).
2. Filter berdasarkan Cabang, Layanan, atau Karyawan.
3. Ubah status langsung dari dropdown di setiap baris.
4. Klik **Detail** untuk melihat deskripsi lengkap, lokasi, lampiran, dan catatan tambahan.

## 8. Bagian yang Masih Membutuhkan Konfigurasi

- **Logo asli** belum tersedia saat pembuatan situs ini — logo sementara (bentuk huruf "A" bergaya kilat, warna biru Era Visual) dipasang di navbar & hero. Ganti file SVG di `assets/js/app.js` (variabel `EV_LOGO_SVG`) dan di `index.html` dengan logo resmi begitu file logo tersedia.
- **PIN admin** (`ADMIN_PIN` di `admin/admin.js`) masih PIN sederhana sisi-klien untuk MVP — **bukan** autentikasi yang aman. Untuk penggunaan produksi sebaiknya diganti dengan backend + login sungguhan (mis. Firebase Auth, Supabase, atau server sendiri).
- **Data tersimpan hanya di localStorage browser masing-masing perangkat** — artinya perubahan yang dibuat admin di satu perangkat/browser tidak otomatis muncul di perangkat lain, dan order yang masuk hanya tersimpan di browser pelanggan yang memesan. Untuk order yang benar-benar terpusat dan bisa diakses semua admin, langkah selanjutnya adalah menyambungkan `assets/js/data.js` ke backend nyata (mis. Firebase, Supabase, atau Google Sheets API) — struktur data yang sudah ada bisa dipakai langsung sebagai skema.
- **Alamat lengkap tiap cabang** belum diisi (field `address` sudah disiapkan di data, tinggal diisi).
- **Foto karyawan** belum ada — field `photo` menerima URL gambar; tanpa foto, sistem otomatis menampilkan inisial nama.
- **Nomor WhatsApp Karyawan 02 & 03** masih kosong sehingga tombol WhatsApp di order akan jatuh ke nomor kontak utama Era Visual — lengkapi lewat dashboard admin begitu data asli tersedia.
- **Cabang Batam**: struktur sudah mendukung, tinggal ditambahkan lewat dashboard admin begitu ada karyawan dan layanan yang nyata.

## 9. Login Admin dengan Google

Dashboard admin sekarang punya dua cara masuk: **Login dengan akun Google** (utama) dan **PIN** (cadangan). Supaya tombol Google-nya aktif, kamu perlu daftarkan situs ini ke Google Cloud Console sendiri (Claude tidak bisa melakukan ini karena butuh akun Google kamu):

1. Buka **console.cloud.google.com** → buat project baru (nama bebas, misal "Era Visual").
2. Menu kiri → **APIs & Services → OAuth consent screen** → pilih **External** → isi nama app "Era Visual", email kamu → Save.
3. Menu kiri → **APIs & Services → Credentials** → **Create Credentials → OAuth client ID**.
4. Application type: **Web application**.
5. Di **Authorized JavaScript origins**, tambahkan persis: `https://eravisual17-ui.github.io` (tanpa garis miring di akhir, tanpa nama repo).
6. Klik **Create** — akan muncul **Client ID** (contoh: `xxxxx.apps.googleusercontent.com`). Salin itu.
7. Buka file `admin.html` (atau `admin/admin.js` di versi terstruktur), cari baris:
   ```js
   const GOOGLE_CLIENT_ID = 'GANTI_DENGAN_CLIENT_ID_ANDA.apps.googleusercontent.com';
   ```
   Ganti dengan Client ID asli dari langkah 6, lalu simpan dan upload ulang ke GitHub.
8. Di baris `ADMIN_ALLOWED_EMAILS`, isi daftar alamat Gmail yang boleh masuk sebagai admin (default sudah diisi `eravisual17@gmail.com` dan `kbatam275@gmail.com` — tambah/kurangi sesuai kebutuhan).

Setelah Client ID terpasang, tombol **"Sign in with Google"** akan aktif di halaman `/admin`. Login dengan akun Google yang ada di daftar `ADMIN_ALLOWED_EMAILS` akan langsung masuk ke dashboard; akun lain akan ditolak dengan pesan "belum terdaftar sebagai admin". Tombol **Keluar** di sidebar dashboard untuk logout.

**Catatan keamanan:** Login Google ini memverifikasi identitas akun secara sah, tapi karena situs ini murni statis (tanpa server), pengecekan email tetap dilakukan di sisi browser (client-side) — sama seperti PIN, ini cukup untuk mencegah orang iseng, tapi bukan proteksi tingkat enterprise. Untuk keamanan penuh (verifikasi token di server), langkah berikutnya adalah menambahkan backend sungguhan.

## 10. Notifikasi Email Setiap Login

Setiap kali ada yang login ke Dashboard Admin — lewat Google maupun PIN, berhasil maupun ditolak/salah — sistem otomatis kirim email pemberitahuan ke `eravisual17@gmail.com`, isinya: metode login, status (berhasil/ditolak), email yang dipakai (kalau Google), waktu, dan halaman asal. Ini pakai layanan gratis **EmailJS** (kirim email langsung dari browser, tanpa server sendiri).

Cara mengaktifkan:

1. Buka **emailjs.com** → **Sign Up** (gratis, cukup daftar pakai email).
2. Menu **Email Services** → **Add New Service** → pilih **Gmail** → hubungkan dengan akun `eravisual17@gmail.com` (atau Gmail lain yang mau dipakai untuk mengirim). Catat **Service ID** yang muncul.
3. Menu **Email Templates** → **Create New Template**. Isi subjek misalnya `Login Admin Era Visual — {{status}}`, dan isi body-nya pakai variabel berikut (ketik persis, termasuk kurung kurawal dobelnya):
   ```
   Metode login: {{method}}
   Status: {{status}}
   Email yang login: {{attempt_email}}
   Waktu: {{time}}
   Halaman: {{page_url}}
   ```
   Di kolom "To Email" pada pengaturan template, isi `{{to_email}}`. Simpan, lalu catat **Template ID**.
4. Menu **Account → General** → catat **Public Key**.
5. Buka file `admin.html` (atau `admin/admin.js` di versi terstruktur), cari 3 baris ini dan ganti dengan nilai asli dari langkah 2-4:
   ```js
   const EMAILJS_PUBLIC_KEY = 'GANTI_DENGAN_PUBLIC_KEY_ANDA';
   const EMAILJS_SERVICE_ID = 'GANTI_DENGAN_SERVICE_ID_ANDA';
   const EMAILJS_TEMPLATE_ID = 'GANTI_DENGAN_TEMPLATE_ID_ANDA';
   ```
6. Simpan, upload ulang ke GitHub. Selesai — setiap login akan otomatis terkirim email.

**Batasan yang perlu diketahui:** paket gratis EmailJS ada limit jumlah email per bulan (biasanya 200/bulan, cek di dashboard EmailJS untuk angka terbaru). Ini juga sifatnya **notifikasi setelah kejadian**, bukan "tunggu di-ACC dulu baru bisa masuk" — login tetap langsung berhasil kalau email/PIN-nya benar, kamu cuma langsung diberi tahu. Kalau ke depannya kamu mau sistem approval sungguhan (login ditahan sampai kamu setujui manual), itu butuh backend kecil (misalnya Google Apps Script) — bisa dibuatkan kalau suatu saat dibutuhkan.

## 12. Edit Karyawan & Menu Berita/Info (Update Terbaru)

**Edit Karyawan** — di `/admin` → menu **Karyawan**, sekarang setiap baris punya tombol **Edit** (di samping tombol Hapus). Tap Edit akan membuka form yang sama dengan "Tambah Karyawan" tapi sudah terisi data lama — ubah apa saja lalu tap **Simpan Perubahan**. Tidak perlu hapus lalu buat ulang lagi.

**Menu Berita/Info/Iklan** — halaman publik baru `berita.html`, muncul di navbar sebagai **Berita**. Isinya kartu-kartu berisi foto (ukuran diperbesar dibanding contoh biasa supaya jelas terlihat), judul, cuplikan singkat, tanggal, dan tombol "Baca Selengkapnya" untuk isi lengkap (kalau diisi). Cara mengelola:

1. Buka `/admin` → menu **Berita/Info**.
2. Isi judul, cuplikan singkat (wajib), isi lengkap (opsional), tanggal, dan upload foto.
3. Tap **Publikasikan** — langsung muncul di halaman `berita.html`.
4. Tombol **Edit** di tabel untuk mengubah, **Hapus** untuk menghapus.

Foto disimpan langsung sebagai data terenkode di localStorage (sama seperti data lain di situs ini) — **bukan** diunggah ke server, jadi:
- Pakai foto yang sudah dikompres (idealnya di bawah ±1 MB) supaya penyimpanan browser tidak cepat penuh — localStorage biasanya punya batas sekitar 5-10 MB per browser.
- Berita yang ditambahkan dari satu perangkat/browser **hanya tersimpan di perangkat itu** — sama seperti order dan data lain, ini keterbatasan versi statis (lihat bagian "Bagian yang masih membutuhkan konfigurasi").

## 14. Order Terpusat dengan Google Sheets, lewat SheetDB (Mengatasi "Order Tidak Masuk")

**Masalah yang diatasi:** order yang dibuat dari HP pelanggan sebelumnya hanya tersimpan di HP itu sendiri — HP admin tidak bisa melihatnya di Dashboard. Dengan menyambungkan lewat **SheetDB.io** (layanan gratis yang mengubah Google Sheet jadi API, tanpa perlu coding Apps Script), **semua order dari HP manapun otomatis masuk ke satu Google Sheet yang sama**, dan Dashboard Admin bisa membacanya dari HP mana saja.

**Kenapa SheetDB, bukan Apps Script langsung?** Setup Apps Script (deployment, versi, izin akses "Anyone") gampang salah langkah dan hasilnya tidak konsisten terutama lewat HP. SheetDB melewati semua itu — tinggal hubungkan akun Google, pilih sheet, langsung dapat URL API yang jadi.

**Batasan yang perlu diketahui:** SheetDB adalah layanan pihak ketiga (bukan Google), paket gratisnya punya batas jumlah request per bulan (cek sheetdb.io untuk angka terbaru saat ini) — cukup untuk usaha skala kecil-menengah.

**Langkah setup (sekali saja):**

1. Buka **sheets.google.com**, buat spreadsheet baru (atau pakai yang sudah dibuat), beri nama misal "Era Visual - Orders".
2. Di baris pertama (**baris 1**), ketik nama-nama kolom ini persis, satu per sel, berurutan dari kolom A:
   ```
   id | orderNumber | createdAt | status | branchId | branchName | serviceId | serviceName | employeeId | employeeName | employeeWhatsapp | customerName | customerWhatsapp | customerEmail | location | description | attachmentName | notes
   ```
3. Buka **sheetdb.io** di browser, tap **"Get Started"** / **"Sign Up"** → daftar (bisa pakai akun Google langsung).
4. Setelah masuk dashboard, tap **"Create new API"** (atau tombol serupa) → pilih **"Connect Google Sheet"**.
5. Login/izinkan akses ke akun Google kamu, lalu pilih spreadsheet **"Era Visual - Orders"** yang sudah dibuat tadi.
6. Setelah terhubung, SheetDB akan menampilkan **API URL**, formatnya `https://sheetdb.io/api/v1/xxxxxxxxxxxxx`. Salin URL itu.
7. Buka file `pesan.html` **dan** `admin.html` — di masing-masing, cari (Ctrl+F) tulisan:
   ```
   GANTI_DENGAN_URL_SHEETDB_ANDA
   ```
   Ganti dengan URL SheetDB tadi, diapit tanda kutip seperti aslinya (`const ERA_BACKEND_URL = 'https://sheetdb.io/api/v1/xxxxxxxxxxxxx';`).
8. Simpan, upload ulang kedua file itu (`pesan.html` dan `admin.html`) ke GitHub.

Setelah ini aktif: setiap order baru otomatis tersimpan sebagai baris baru di Google Sheet itu, dan Dashboard Admin akan menampilkan **"Order terpusat dari Google Sheets — bisa dilihat dari HP mana saja."** di atas tabel Order. Kalau koneksi gagal, dashboard otomatis jatuh ke data lokal HP itu saja, dengan catatan kecil di layar.

**Catatan:** perubahan status order dari dashboard juga otomatis mengubah data di Google Sheet, jadi semua admin yang buka dashboard akan lihat status yang sama.

## 15. Karyawan Terpusat dengan Google Sheets (SheetDB Kedua)

Sama seperti Order, data **Karyawan** juga bisa disambungkan ke Google Sheets terpisah supaya tambah/edit/hapus karyawan dari HP manapun langsung sama di semua HP. **Foto karyawan sengaja TIDAK ikut disinkron** — tetap tersimpan per HP masing-masing (supaya ukurannya gak membengkak).

**Langkah setup:**

1. Buka **sheets.google.com**, buat spreadsheet baru, beri nama misal "Era Visual - Employees".
2. Di **baris 1**, isi nama kolom berikut, satu per sel, urut dari kolom A:
   ```
   id | name | role | branchId | serviceIds | whatsapp | description | active
   ```
   (`serviceIds` diisi berupa teks dipisah koma, misal `electrical,editor` — ini otomatis dari sistem, tidak perlu diisi manual di sini.)
3. Buka **sheetdb.io**, login dengan akun yang sama (kalau sudah pernah daftar sebelumnya).
4. Tap **"Create new API"** → tab **"Existing"** → tempel URL spreadsheet "Era Visual - Employees" tadi → **"Create API"**.
5. Salin **API endpoint url** yang muncul (formatnya `https://sheetdb.io/api/v1/xxxxxxxxxxxxx`).
6. Buka file `pesan.html`, `cabang.html`, dan `admin.html` — di masing-masing, cari (Ctrl+F) tulisan:
   ```
   GANTI_DENGAN_URL_SHEETDB_KARYAWAN_ANDA
   ```
   Ganti dengan URL SheetDB Karyawan tadi (diapit tanda kutip seperti aslinya).
7. Upload ulang ketiga file itu ke GitHub.

Setelah aktif, Dashboard Admin → menu Karyawan akan menampilkan catatan **"Karyawan terpusat dari Google Sheets..."**, dan daftar karyawan di halaman Cabang serta wizard Pesan Layanan akan selalu memakai data terbaru dari Sheet itu.

## 16. Deploy ke GitHub Pages

```bash
# di dalam folder era-visual/
git init                      # lewati jika sudah ada .git
git add .
git commit -m "Era Visual: website & sistem order"
git branch -M main
git remote add origin https://github.com/<username>/<nama-repo>.git
git push -u origin main
```

Lalu di GitHub: **Settings → Pages → Source: Deploy from branch → Branch: main / (root)**. Situs akan aktif di `https://<username>.github.io/<nama-repo>/` dalam beberapa menit.

Karena situs ini murni statis (tanpa build step), tidak perlu GitHub Actions — cukup branch `main` di root.

## Foto Berita Beresolusi Tinggi (ImgBB)

Secara bawaan, foto berita dikecilkan otomatis (maks. ±40.000 karakter) supaya muat di satu sel Google Sheets, sehingga poster penuh tulisan bisa kurang jelas. Untuk foto yang tetap tajam, foto bisa disimpan di **ImgBB** dan yang masuk ke Sheets hanya link-nya.

API key ImgBB sudah dipasang di `admin.html`. Kalau perlu diganti: cari (Ctrl+F) `const ERA_IMGBB_KEY` di file itu.

Setelah aktif, saat mempublikasikan berita di Admin → Berita/Info, foto otomatis dikecilkan ke sisi terpanjang 1600 px lalu diunggah ke ImgBB. Kalau upload gagal, sistem otomatis memakai foto yang dikecilkan seperti sebelumnya, jadi berita tetap terbit.

## Membatasi Pemakaian Jatah Google Sheets (SheetDB)

Paket gratis SheetDB cuma 500 permintaan/bulan untuk seluruh akun (dibagi ke semua API/spreadsheet). Setiap halaman situs ini (Cabang, Layanan, Karyawan, Rating, Berita) tadinya menghubungi Sheets sendiri-sendiri setiap kali dibuka — satu orang buka beberapa halaman bisa memakai belasan permintaan sekaligus, jatah bulanan jadi cepat habis.

Sekarang ditambahkan jeda otomatis: dalam 10 menit setelah situs terakhir menanyakan satu jenis data (Cabang/Layanan, Karyawan, Rating, atau Berita) ke Sheets, kunjungan berikutnya memakai data yang sudah tersimpan di HP itu saja, tidak bertanya ke Sheets lagi. Jenis data yang berbeda tetap punya jeda masing-masing, dan aksi menyimpan/mengubah data (order, karyawan, berita, dll) tidak terpengaruh — itu selalu langsung terkirim.

Kalau jatah bulanan tetap habis karena situs sudah ramai, pilihannya:
- Tunggu sampai tanggal 1 bulan berikutnya (jatah otomatis reset), atau
- Upgrade paket SheetDB (mulai ±Rp400 ribu/bulan untuk 10.000 permintaan) di sheetdb.io/pricing.

Selama jatah habis, situs tidak rusak — otomatis kembali memakai data yang tersimpan terakhir di HP itu saja.

## Catatan Update Terbaru (belum tercatat di bagian atas)

- **Halaman Lacak Order** (`lacak.html`) — pelanggan bisa cek status pesanannya sendiri dengan memasukkan nomor order, lengkap dengan Nama Pelanggan, WhatsApp, Lokasi, dan Catatan (dua terakhir cuma muncul kalau diisi).
- **Dashboard Admin jadi PWA (bisa di-install sebagai aplikasi)** — ada tombol "📲 Install sebagai Aplikasi" di sidebar admin. File pendukungnya: `admin-manifest.webmanifest`, `admin-sw.js`, `icon-192.png`, `icon-512.png`, `icon-512-maskable.png`. Service worker-nya sengaja HANYA menangani `admin.html`, halaman publik lain tidak terpengaruh sama sekali.
- **Jeda sinkronisasi 10 menit** untuk Cabang, Layanan, Karyawan, Rating, dan Berita — supaya jatah bulanan SheetDB (500 request/bulan gratis) lebih awet. Order dan aksi menyimpan/mengubah data TIDAK kena jeda ini, selalu langsung terkirim.
- **Foto Berita lewat ImgBB** (opsional) — kalau `ERA_IMGBB_KEY` di `admin.html` sudah diisi, foto berita di-upload ke ImgBB dalam resolusi tinggi; kalau belum, foto otomatis dikecilkan supaya muat di satu sel Google Sheets.

## Status Layanan Baru: Istirahat & Sibuk

Di Admin → Layanan, sekarang ada 2 status tambahan selain Aktif/Tahap Pengembangan/Segera Hadir:
- **Istirahat** — layanan sedang diistirahatkan sementara (badge abu-abu).
- **Sibuk** — layanan lagi penuh/padat, tidak menerima order dulu (badge merah).

Sama seperti status non-Aktif lainnya, dua status ini otomatis membuat layanan **tidak bisa dipesan** lewat wizard sampai diganti balik ke Aktif.
