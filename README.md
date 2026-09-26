# Era Visual

> **Catatan versi ini:** ini versi *flat* (semua CSS & JS digabung langsung ke tiap file .html, tanpa folder) supaya gampang di-upload lewat HP/GitHub browser. Isinya identik secara fungsi dengan versi terstruktur (folder assets/ + admin/) — cuma beda cara filenya disusun. `admin/index.html` sekarang jadi `admin.html` di root. Logo asli Era Visual sudah dipasang (di-encode langsung ke dalam file, tanpa file gambar terpisah). Untuk login Google, edit `GOOGLE_CLIENT_ID` dan `ADMIN_ALLOWED_EMAILS` langsung di dalam `admin.html` (cari dengan Ctrl+F / cari teks), bukan di file `admin.js` terpisah.

 — Website & Sistem Order

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
- Dashboard admin (`/admin`) untuk kelola Cabang, Karyawan, Layanan, Order (lihat & filter & ubah status), dan Kontak.
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

## 10. Deploy ke GitHub Pages

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
