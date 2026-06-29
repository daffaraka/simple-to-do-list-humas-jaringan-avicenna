# TimePro IT & Branding

TimePro IT & Branding adalah aplikasi manajemen tugas berbasis Kanban dan kalender, dirancang khusus untuk memfasilitasi koordinasi pekerjaan antara divisi Humas dan Jaringan (serta divisi lainnya). Aplikasi ini memisahkan hak akses antara Admin dan Staff (Role-Based Access Control) dan dibangun menggunakan arsitektur Single Page Application (SPA).

## Fitur Utama

- **Manajemen Tugas (Kanban Board)**: Memindahkan tugas antar kolom status (To Do, In Progress, Review, Done).
- **Tampilan Kalender**: Memantau tenggat waktu tugas berdasarkan kalender.
- **Role-Based Access Control (RBAC)**: Pembatasan fitur aplikasi berdasarkan jabatan pengguna (Admin atau Staff).
- **Master Data Terpusat**: Pengelolaan data Departemen, Jabatan (Role), dan Pengguna (Users) secara dinamis khusus untuk Admin.
- **Detail Tugas Spesifik**: Meliputi penugasan PIC (Penanggung Jawab), label tugas, tingkat prioritas, tautan dokumen, dan checklist (sub-tugas).
- **Filter Berdasarkan Departemen**: Memudahkan penyaringan tugas berdasarkan divisi yang bertanggung jawab.
- **Persistensi State**: Menggunakan Local Storage agar state aplikasi tidak hilang saat halaman di-refresh.

## Teknologi yang Digunakan

### Frontend
- React.js (dengan Vite)
- TypeScript
- Tailwind CSS
- Zustand (State Management)
- Lucide React (Komponen grafis)

### Backend
- Node.js & Express.js
- TypeScript
- Prisma ORM
- JSON Web Token (JWT) untuk autentikasi

## Prasyarat

Pastikan perangkat Anda sudah terpasang:
- Node.js (versi 18 atau lebih baru)
- npm (Node Package Manager)

## Panduan Instalasi dan Menjalankan Aplikasi

Aplikasi ini terbagi menjadi dua bagian: `backend` dan `frontend`. Keduanya harus dijalankan secara bersamaan agar aplikasi dapat beroperasi dengan normal.

### 1. Konfigurasi Backend

Buka terminal dan arahkan direktori ke folder backend:

```bash
cd backend
```

Instal seluruh dependensi:

```bash
npm install
```

Salin file `.env.example` (jika ada) menjadi `.env` dan sesuaikan koneksi database Anda. Setelah itu, jalankan sinkronisasi database:

```bash
npx prisma db push
```

(Opsional) Jika Anda ingin mengisi database dengan data awal / dummy (termasuk akun Super Admin), jalankan:

```bash
npx prisma db seed
```

Jalankan server backend:

```bash
npm run dev
```

Server backend biasanya akan berjalan di `http://localhost:3001`.

### 2. Konfigurasi Frontend

Buka tab terminal baru dan arahkan direktori ke folder frontend:

```bash
cd frontend
```

Instal seluruh dependensi:

```bash
npm install
```

Jalankan server frontend:

```bash
npm run dev
```

Aplikasi web dapat diakses melalui browser pada alamat yang diberikan oleh Vite (biasanya `http://localhost:5173`).

## Kredensial Akses Default

Jika Anda menjalankan perintah *seed* pada database, Anda dapat masuk menggunakan kredensial admin berikut:

- **Email**: admin@gmail.com
- **Password**: password

Pengguna dengan status Admin akan melihat tombol "Master Data" pada halaman utama untuk mengelola informasi pengguna dan departemen aplikasi.
