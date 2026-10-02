const STORAGE_KEY = "studymate_tasks";

const hamburgerBtn = document.getElementById('hamburgerBtn');
const navMenu = document.querySelector('.nav-menu');

hamburgerBtn.addEventListener('click', function() {
    // Menambahkan atau menghapus kelas 'active' pada menu
    navMenu.classList.toggle('active');
});

// ================================
// AMBIL DATA DARI LOCAL STORAGE
// ================================
function getTasks() {
const data = localStorage.getItem(STORAGE_KEY);

if (!data) {
    return [];
}

try {
    return JSON.parse(data);
} catch (error) {
    console.error("Data LocalStorage tidak valid:", error);
    return [];
}


}

// ================================
// SIMPAN DATA KE LOCAL STORAGE
// ================================
function saveTasks(tasks) {
localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// ================================
// ELEMENT HTML
// ================================
const formTambahTugas = document.getElementById("form-tambah-tugas");
const listTugas = document.getElementById("list-tugas");

// ================================
// TAMPILKAN DAFTAR TUGAS
// ================================
function tampilkanTugas() {
const tasks = getTasks();

listTugas.innerHTML = "";

// Jika belum ada tugas
if (tasks.length === 0) {
    listTugas.innerHTML = `
        <p class="tugas-kosong">
            Belum ada tugas.
        </p>
    `;
    return;
}

// Buat card untuk setiap tugas
tasks.forEach(function (task) {

    const taskCard = document.createElement("div");

    taskCard.className = "task-card";
    taskCard.setAttribute("data-task-id", task.id);

    taskCard.innerHTML = `
        <div class="task-info">

            <p>
                <strong>Tanggal:</strong>
                <span class="task-tanggal">
                    ${task.tanggal}
                </span>
            </p>

            <p>
                <strong>Hari:</strong>
                <span class="task-hari">
                    ${task.hari}
                </span>
            </p>

            <p>
                <strong>Pemberi:</strong>
                <span class="task-pemberi">
                    ${task.pemberi}
                </span>
            </p>

            <p>
                <strong>Nama Tugas:</strong>
                <span class="task-nama">
                    ${task.tugas}
                </span>
            </p>

            <p>
                <strong>Deadline:</strong>
                <span class="task-deadline">
                    ${task.deadline}
                </span>
            </p>

        </div>

        <div class="task-actions">

            <button
                type="button"
                class="btn-edit-tugas"
                data-task-id="${task.id}">
                Edit
            </button>

            <button
                type="button"
                class="btn-hapus-tugas"
                data-task-id="${task.id}">
                Hapus
            </button>

        </div>
    `;

    listTugas.appendChild(taskCard);
});


}

// ================================
// TAMBAH TUGAS
// ================================
formTambahTugas.addEventListener("submit", function (event) {

event.preventDefault();

const tanggal = document.getElementById("input-tanggal").value;
const hari = document.getElementById("input-hari").value.trim();
const pemberi = document.getElementById("input-pemberi").value.trim();
const tugas = document.getElementById("input-tugas").value.trim();
const deadline = document.getElementById("input-deadline").value;

// Validasi
if (!tanggal || !hari || !pemberi || !tugas || !deadline) {
    alert("Semua data tugas harus diisi.");
    return;
}

const tasks = getTasks();

// Membuat ID otomatis
const newId = tasks.length > 0
    ? Math.max(...tasks.map(task => Number(task.id))) + 1
    : 1;

const newTask = {
    id: newId,
    tanggal: tanggal,
    hari: hari,
    pemberi: pemberi,
    tugas: tugas,
    deadline: deadline,
    status: "belum"
};

// Tambahkan tugas
tasks.push(newTask);

// Simpan
saveTasks(tasks);

// Tampilkan ulang
tampilkanTugas();

// Bersihkan form
formTambahTugas.reset();

alert("Tugas berhasil ditambahkan!");


});

// ================================
// EVENT EDIT, HAPUS, SELESAI
// ================================
listTugas.addEventListener("click", function (event) {

const button = event.target;

// Pastikan yang diklik adalah tombol
if (button.tagName !== "BUTTON") {
    return;
}

const taskId = Number(button.getAttribute("data-task-id"));

if (!taskId) {
    return;
}


// ================================
// EDIT TUGAS
// ================================
if (button.classList.contains("btn-edit-tugas")) {

    editTugas(taskId);
}


// ================================
// HAPUS TUGAS
// ================================
if (button.classList.contains("btn-hapus-tugas")) {

    hapusTugas(taskId);
}


// ================================
// TANDAI SELESAI
// ================================
if (button.classList.contains("btn-selesai-tugas")) {

    toggleSelesai(taskId);
}


});

// ================================
// FUNGSI EDIT TUGAS
// ================================
function editTugas(taskId) {

const tasks = getTasks();

const task = tasks.find(function (item) {
    return Number(item.id) === taskId;
});

if (!task) {
    alert("Tugas tidak ditemukan.");
    return;
}

// Masukkan data lama ke form
document.getElementById("input-tanggal").value = task.tanggal;
document.getElementById("input-hari").value = task.hari;
document.getElementById("input-pemberi").value = task.pemberi;
document.getElementById("input-tugas").value = task.tugas;
document.getElementById("input-deadline").value = task.deadline;

// Ubah tombol menjadi mode edit
const tombolTambah = document.getElementById("btn-tambah-tugas");

tombolTambah.textContent = "Simpan Perubahan";

// Hapus event submit lama
formTambahTugas.onsubmit = null;

// Gunakan mode edit
formTambahTugas.onsubmit = function (event) {

    event.preventDefault();

    const tanggal = document.getElementById("input-tanggal").value;
    const hari = document.getElementById("input-hari").value.trim();
    const pemberi = document.getElementById("input-pemberi").value.trim();
    const tugas = document.getElementById("input-tugas").value.trim();
    const deadline = document.getElementById("input-deadline").value;

    if (!tanggal || !hari || !pemberi || !tugas || !deadline) {
        alert("Semua data tugas harus diisi.");
        return;
    }

    // Cari index tugas
    const index = tasks.findIndex(function (item) {
        return Number(item.id) === taskId;
    });

    if (index === -1) {
        alert("Tugas tidak ditemukan.");
        return;
    }

    // Update data
    tasks[index] = {
        id: taskId,
        tanggal: tanggal,
        hari: hari,
        pemberi: pemberi,
        tugas: tugas,
        deadline: deadline,
        status: task.status
    };

    // Simpan
    saveTasks(tasks);

    // Tampilkan ulang
    tampilkanTugas();

    // Reset form
    formTambahTugas.reset();

    // Kembalikan tombol
    tombolTambah.textContent = "Tambah Tugas";

    // Kembalikan event submit normal
    formTambahTugas.onsubmit = null;

    alert("Tugas berhasil diperbarui.");

    // Reload handler tambah
    pasangEventTambah();
};


}

// ================================
// HAPUS TUGAS
// ================================
function hapusTugas(taskId) {

const tasks = getTasks();

const task = tasks.find(function (item) {
    return Number(item.id) === taskId;
});

if (!task) {
    alert("Tugas tidak ditemukan.");
    return;
}

const konfirmasi = confirm(
    `Apakah kamu yakin ingin menghapus tugas "${task.tugas}"?`
);

if (!konfirmasi) {
    return;
}

const tasksBaru = tasks.filter(function (item) {
    return Number(item.id) !== taskId;
});

saveTasks(tasksBaru);

tampilkanTugas();

alert("Tugas berhasil dihapus.");


}

// ================================
// TANDAI SELESAI / BELUM SELESAI
// ================================
function toggleSelesai(taskId) {

const tasks = getTasks();

const index = tasks.findIndex(function (item) {
    return Number(item.id) === taskId;
});

if (index === -1) {
    alert("Tugas tidak ditemukan.");
    return;
}

// Ubah status
if (tasks[index].status === "belum") {
    tasks[index].status = "selesai";
} else {
    tasks[index].status = "belum";
}

saveTasks(tasks);

tampilkanTugas();


}

// ================================
// EVENT TAMBAH TUGAS
// ================================
function pasangEventTambah() {

formTambahTugas.onsubmit = function (event) {

    event.preventDefault();

    const tanggal = document.getElementById("input-tanggal").value;
    const hari = document.getElementById("input-hari").value.trim();
    const pemberi = document.getElementById("input-pemberi").value.trim();
    const tugas = document.getElementById("input-tugas").value.trim();
    const deadline = document.getElementById("input-deadline").value;

    if (!tanggal || !hari || !pemberi || !tugas || !deadline) {
        alert("Semua data tugas harus diisi.");
        return;
    }

    const tasks = getTasks();

    const newId = tasks.length > 0
        ? Math.max(...tasks.map(task => Number(task.id))) + 1
        : 1;

    const newTask = {
        id: newId,
        tanggal: tanggal,
        hari: hari,
        pemberi: pemberi,
        tugas: tugas,
        deadline: deadline,
        status: "belum"
    };

    tasks.push(newTask);

    saveTasks(tasks);

    tampilkanTugas();

    formTambahTugas.reset();

    alert("Tugas berhasil ditambahkan.");
};


}

// ================================
// JALANKAN SAAT HALAMAN DIBUKA
// ================================
tampilkanTugas();
pasangEventTambah();