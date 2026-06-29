# Dokumentasi & Walkthrough Proyek: Humas & Jaringan To-Do App

Selamat datang di repositori dokumentasi **Humas & Jaringan To-Do App**. Dokumen ini merangkum seluruh proses perjalanan _development_ dari awal (pembuatan prototipe UI) hingga menjadi aplikasi *Fullstack* (React + Node.js + MySQL).

---

## 🏗️ 1. Arsitektur & Teknologi (Tech Stack)
Aplikasi ini dikembangkan menggunakan arsitektur **Monorepo**, di mana kode *Frontend* dan *Backend* dipisahkan dengan sangat rapi pada foldernya masing-masing namun berada di bawah satu atap proyek.

### Frontend (`/frontend`)
- **Framework:** React.js (via Vite)
- **Bahasa:** TypeScript
- **Styling:** Tailwind CSS (dengan konsep Glassmorphism & Modern Aesthetic UI)
- **State Management:** Zustand (Migrasi dari React Context)
- **Drag & Drop:** `@dnd-kit` untuk logika geser kartu Kanban yang _smooth_
- **HTTP Client:** Axios dengan _interceptors_ JWT
- **Ikon:** Lucide React

### Backend (`/backend`)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Bahasa:** TypeScript
- **Database:** MySQL
- **ORM:** Prisma
- **Autentikasi:** JSON Web Token (JWT) & Bcrypt (Password Hashing)
- **Pola Arsitektur:** Controller Pattern (Separation of Concerns setara MVC)

---

## 🚀 2. Rekam Jejak Pengembangan (Step-by-Step)

Berikut adalah tahap demi tahap (secara kronologis) bagaimana sistem ini dibangun:

### Fase 1: Prototipe UI (Tampilan Visual & Logika Lokal)
1. **Inisialisasi Kanban Board:** Membangun antarmuka struktur awal kolom "New", "Progress", dan "Selesai". 
2. **Implementasi _Drag and Drop_:** Mengintegrasikan `dnd-kit` agar kartu tugas dapat ditarik lintas kolom maupun disusun ulang di dalam kolom yang sama.
3. **Penyempurnaan Navigasi (Header):** Merombak tata letak *Header* menjadi dua baris: 
   - *Main Nav*: Menampung Judul Logo, Pemilih Mode (To Do vs Kalender), dan Kolom Pencarian.
   - *Sub Nav*: Berisi Tab perpindahan antar Departemen (Humas / Jaringan) dan Filter Label.
4. **Interaksi Modals:** Mempercantik form tambah/edit tugas (Modal) dengan kalender (*date picker*). Modals ini juga direkayasa menggunakan *React Portal* (`createPortal`) demi mengatasi masalah _z-index_ tertimpa Header, sehingga sangat responsif di perangkat _Mobile_ maupun Desktop.
5. **Aksi Kartu:** Memberikan tombol interaktif mungil (Edit & Hapus) yang muncul otomatis saat _mouse_ diarahkan ke atas kartu tugas.

### Fase 2: Perencanaan & Inisialisasi Backend
1. **Pemilihan Stack Database:** Memutuskan menggunakan kombinasi kuat **Node.js, Express, dan MySQL** dengan alat bantu Prisma ORM agar relasi data kokoh.
2. **Migrasi Repositori:** Memecah isi proyek (*file* React yang berantakan di *root*) secara terstruktur ke dalam folder `frontend/`, kemudian menciptakan *folder* baru `backend/`.
3. **Skema Database:** 
   - Dibuat tabel `User` untuk mengelola staf Divisi.
   - Tabel `Task` dengan kunci relasi ke `User` (sebagai penanggung jawab/PIC).
   - Tabel `Checklist` dan `TaskLabel` berelasi *many-to-many* / *one-to-many*.
4. **Generasi Prisma:** Berhasil mengkoneksikan dan mendongkrak (*Push*) rancangan tabel secara otomatis ke MySQL lokal server `humas_jaringan_todo`.

### Fase 3: Pengembangan API dengan Standar MVC
1. **Middleware Keamanan:** Menulis lapisan penjaga gerbang (Auth Middleware) menggunakan JWT. Semua _endpoint_ tugas dilindungi oleh gembok digital.
2. **Controller Pattern:** Mengadopsi prinsip kerja yang lazim dipakai framework *Enterprise* (seperti Laravel). _Routes_ Express dibersihkan, dan semua isi otak pemrograman (Logika Bisnis/CRUD) dipindahkan dan disentralisasi pada folder `controllers/` (`authController.ts`, `taskController.ts`, `checklistController.ts`).

### Fase 4: Integrasi *Fullstack*
1. **Zustand State Management:** Menghapus `kanbanStore` versi lama yang kaku (React Context + LocalStorage) menjadi Zustand. Hal ini bertujuan agar kode *frontend* jauh lebih ringkas saat memanggil fungsi-fungsi _backend_.
2. **Halaman Login:** Membangun gerbang visual `Login.tsx` untuk menghalau tamu tak diundang.
3. **Axios & JWT:** Menghubungkan Zustand secara reaktif ke `api.ts`.
4. **Optimistic UI:** Menciptakan pengalaman pengguna (UX) tanpa hambatan (*lag-free*). Ketika kartu tugas ditarik, ia akan seketika pindah, sementara API berjalan secara siluman di belakang layar.

---

## 🏃 3. Panduan Menjalankan Sistem Secara Lokal

Karena proyek ini kini berupa monorepo, Anda membutuhkan dua _Terminal_ terbuka secara bersamaan.

### Menyalakan Backend (Terminal 1)
Buka terminal baru di *root project*, lalu:
```bash
cd backend
npm install   # (hanya jika baru pertama kali di komputer lain)
npm run dev
```
> Server API akan menyala di `http://localhost:3001`

### Menyalakan Frontend (Terminal 2)
Buka terminal baru lagi di *root project*, lalu:
```bash
cd frontend
npm install   # (hanya jika baru pertama kali di komputer lain)
npm run dev
```
> Aplikasi Web akan menyala di `http://localhost:5173` (klik link yang muncul di terminal).

---
*Dokumentasi ini otomatis dibuat pada fase penutupan proses migrasi Fullstack.*
