# 💌 Undangan Pernikahan Digital

Website undangan statis (HTML + CSS + JS murni, tanpa build tools) dengan tema sage, cream & gold.

## Fitur
- Cover "Buka Undangan" + nama tamu otomatis (`?to=Nama+Tamu`)
- Countdown, simpan tanggal ke Google Calendar, navigasi map
- Mempelai, acara, kisah cinta, galeri
- RSVP, **Gift section** (kartu rekening, salin nomor, QRIS, alamat kado)
- Ucapan & doa, musik latar, navigasi dock, responsif

## Struktur
```
├── index.html
├── style.css
├── script.js        ← ubah CONFIG di bagian atas
├── assets/music.mp3 ← (tambahkan sendiri)
└── images/          ← (foto, qris.jpg)
```

## Cara kustomisasi
1. Ganti nama, tanggal, orang tua, rekening, dan alamat di `index.html`.
2. Ubah `CONFIG` di `script.js` (tanggal countdown, kalender, nomor WhatsApp RSVP).
3. Foto: ganti elemen `.ph` dengan `<img src="images/foto1.jpg" alt="">`.
4. QRIS: ganti placeholder di `#qrisModal` dengan `<img src="images/qris.jpg">`.
5. Musik: taruh file di `assets/music.mp3`.

## Link per tamu
`https://username.github.io/nama-repo/?to=Budi+Santoso`

## Deploy ke GitHub Pages
1. Buat repo baru, upload semua file.
2. **Settings → Pages → Branch: `main` / root → Save**.
3. Buka `https://username.github.io/nama-repo/`.

## Catatan
RSVP & ucapan saat ini tersimpan di `localStorage` (hanya terlihat di browser masing-masing).
Agar ucapan tampil untuk semua tamu, sambungkan ke Google Sheets (Apps Script), Firebase, atau Supabase.
