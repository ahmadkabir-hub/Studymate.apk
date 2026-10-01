// ==================================================
// STUDYMATE - JAVASCRIPT
// WITH KELOMPOK KOSONG TIGA 
// 1. DATA & LOCAL STORAGE
// ==================================================

// Ambil data tugas dari LocalStorage
let tasks = JSON.parse(localStorage.getItem("studymate_tasks")) || [];


// Simpan data tugas ke LocalStorage
function saveTasks() {
    localStorage.setItem("studymate_tasks", JSON.stringify(tasks));
}


// ==================================================
// 2. HALAMAN TUGAS
// ==================================================

// script kode tambah tugas di sini



// ==================================================
// 3. HALAMAN MONITORING
// ==================================================

// script kode monitoring di sini



// ==================================================
// 4. HALAMAN STATISTIK / RIWAYAT
// ==================================================

// script kode statistik di sini



// ==================================================
// 5. FUNGSI UMUM
// ==================================================

// Fungsi edit, hapus, format tanggal, Dll