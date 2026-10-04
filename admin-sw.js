/* ==========================================================================
   Era Visual — Service Worker khusus Dashboard Admin
   Sengaja HANYA menangani admin.html dan file pendukungnya. Semua halaman
   publik lain (index.html, pesan.html, cabang.html, dst) sama sekali tidak
   disentuh oleh service worker ini — request-nya dibiarkan lewat apa adanya
   ke jaringan seperti biasa, supaya perubahan di halaman publik selalu
   langsung terlihat tanpa ketahanan cache yang basi.
   ========================================================================== */

const CACHE_NAME = 'era-visual-admin-v1';
const APP_SHELL = ['admin.html', 'admin-manifest.webmanifest', 'icon-192.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

function isAdminFile(pathname){
  return /\/admin\.html$/.test(pathname) || pathname === '/admin.html' ||
         /\/admin-manifest\.webmanifest$/.test(pathname) ||
         /\/icon-(192|512|512-maskable)\.png$/.test(pathname);
}

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Bukan bagian admin (mis. index.html, cabang.html, pesan.html, dll)?
  // Jangan dicegat sama sekali — biarkan browser menanganinya seperti biasa.
  if (!isAdminFile(url.pathname)) return;

  // admin.html: coba jaringan dulu (supaya admin selalu lihat kode terbaru),
  // kalau gagal (offline) baru pakai salinan terakhir yang tersimpan.
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});
