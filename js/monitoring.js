// Ambil data tugas dari LocalStorage
let tasks = JSON.parse(localStorage.getItem("studymate_tasks")) || [];


// Simpan data tugas ke LocalStorage
function saveTasks() {
    localStorage.setItem("studymate_tasks", JSON.stringify(tasks));
}

const STORAGE_KEY = "studymate_tasks";
/* =========================================
   SAAT HALAMAN SELESAI DIMUAT
   ========================================= */

document.addEventListener("DOMContentLoaded", function () {
  /*
       Untuk sementara kita menggunakan data contoh
       agar halaman bisa langsung dites.

       Nanti ketika halaman Tugas kelompok sudah jadi,
       bagian data contoh ini bisa dihapus.
    */

  createExampleData();

  // Menampilkan data tugas
  loadTasks();
});

/* =========================================
   DATA CONTOH
   ========================================= */

function createExampleData() {
  /*
       Cek apakah LocalStorage sudah memiliki data.

       Kalau sudah ada data dari halaman Tugas,
       data tersebut TIDAK akan ditimpa.
    */

  const existingData = localStorage.getItem(STORAGE_KEY);

  if (!existingData) {
    const exampleTasks = [
      {
        id: 1,
        nama: "Praktikum Algoritma",
        pemberi: "Bu Fitri",
        tanggal: "2026-09-27",
        deadline: "2026-09-28",
        status: "Belum Selesai",
      },

      {
        id: 2,
        nama: "Pancasila",
        pemberi: "Bu Atika",
        tanggal: "2026-09-28",
        deadline: "2026-09-29",
        status: "Belum Selesai",
      },

      {
        id: 3,
        nama: "Makalah Pancasila",
        pemberi: "Bu Siti",
        tanggal: "2026-09-25",
        deadline: "2026-10-02",
        status: "Belum Selesai",
      },

      {
        id: 4,
        nama: "Presentasi Bahasa Inggris",
        pemberi: "Bu Rina",
        tanggal: "2026-09-22",
        deadline: "2026-10-05",
        status: "Selesai",
      },

      {
        id: 5,
        nama: "Latihan Kalkulus Dasar",
        pemberi: "Pak Ahmad",
        tanggal: "2026-09-20",
        deadline: "2026-10-15",
        status: "Belum Selesai",
      },
    ];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(exampleTasks));
  }
}

/* =========================================
   MEMBACA DATA DARI LOCAL STORAGE
   ========================================= */

function getTasks() {
  const data = localStorage.getItem(STORAGE_KEY);

  if (!data) {
    return [];
  }

  try {
    return JSON.parse(data);
  } catch (error) {
    console.error("Data tugas tidak valid:", error);

    return [];
  }
}

/* =========================================
   MENAMPILKAN TUGAS
   ========================================= */

function loadTasks() {
  const taskList = document.getElementById("taskList");
  const emptyMessage = document.getElementById("emptyMessage");
  const taskCount = document.getElementById("taskCount");
  const deadlineAlert = document.getElementById("deadlineAlert");

  // Ambil semua tugas
  let tasks = getTasks();

  /*
       Hanya tampilkan tugas yang belum selesai.
    */

  tasks = tasks.filter(function (task) {
    return task.status !== "Selesai";
  });

  /*
       Urutkan berdasarkan deadline
       dari yang paling dekat.
    */

  tasks.sort(function (a, b) {
    return new Date(a.deadline) - new Date(b.deadline);
  });

  /*
       Update jumlah tugas
    */

  taskCount.textContent = tasks.length + " tugas";

  /*
       Bersihkan daftar tugas sebelum menampilkan ulang.
    */

  taskList.innerHTML = "";

  /*
       Kalau tidak ada tugas
    */

  if (tasks.length === 0) {
    emptyMessage.classList.remove("hidden");

    deadlineAlert.classList.add("hidden");

    return;
  }

  /*
       Kalau ada tugas
    */

  emptyMessage.classList.add("hidden");

  /*
       Cek apakah ada tugas dengan deadline
       hari ini atau besok.
    */

  const hasUrgentTask = tasks.some(function (task) {
    return getDeadlineStatus(task.deadline).className === "urgent";
  });

  if (hasUrgentTask) {
    deadlineAlert.classList.remove("hidden");
  } else {
    deadlineAlert.classList.add("hidden");
  }

  /*
       Buat card untuk setiap tugas.
    */

  tasks.forEach(function (task) {
    const taskCard = createTaskCard(task);

    taskList.appendChild(taskCard);
  });
}

/* =========================================
   MEMBUAT CARD TUGAS
   ========================================= */

function createTaskCard(task) {
  /*
       Ambil informasi kondisi deadline.
    */

  const deadlineStatus = getDeadlineStatus(task.deadline);

  /*
       Buat element card.
    */

  const card = document.createElement("div");

  card.className = "task-card " + deadlineStatus.className;

  /*
       Format tanggal.
    */

  const tanggal = formatDate(task.tanggal);

  const deadline = formatDate(task.deadline);

  /*
       Isi HTML card.
    */

  card.innerHTML = `

        <div class="task-header">

            <div>

                <h3 class="task-title">
                    ${escapeHTML(task.nama)}
                </h3>

                <p class="task-giver">
                    Pemberi tugas:
                    <strong>${escapeHTML(task.pemberi)}</strong>
                </p>

            </div>


            <span class="deadline-indicator ${deadlineStatus.className}">
                ${deadlineStatus.icon}
                ${deadlineStatus.text}
            </span>

        </div>


        <div class="task-details">

            <div class="detail-item">

                <span class="detail-label">
                    Tanggal
                </span>

                <span class="detail-value">
                    ${tanggal}
                </span>

            </div>


            <div class="detail-item">

                <span class="detail-label">
                    Deadline
                </span>

                <span class="detail-value">
                    ${deadline}
                </span>

            </div>


            <div class="detail-item">

                <span class="detail-label">
                    Status
                </span>

                <span class="status status-belum">
                    ${escapeHTML(task.status)}
                </span>

            </div>

        </div>


        <div class="task-actions">

            <button
                class="btn btn-edit"
                onclick="editTask(${task.id})">
                ✏️ Edit
            </button>


            <button
                class="btn btn-delete"
                onclick="deleteTask(${task.id})">
                🗑️ Hapus
            </button>


            <button
                class="btn btn-complete"
                onclick="completeTask(${task.id})">
                ✅ Tandai Selesai
            </button>

        </div>

    `;

  return card;
}

/* =========================================
   MENENTUKAN STATUS DEADLINE
   ========================================= */

function getDeadlineStatus(deadline) {
  /*
       Menggunakan tanggal tanpa jam
       agar perhitungan lebih konsisten.
    */

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const deadlineDate = new Date(deadline);

  deadlineDate.setHours(0, 0, 0, 0);

  /*
       Selisih waktu dalam milidetik.
    */

  const difference = deadlineDate.getTime() - today.getTime();

  /*
       Konversi milidetik menjadi hari.
    */

  const daysLeft = Math.ceil(difference / (1000 * 60 * 60 * 24));

  /*
       🔴 Deadline hari ini atau besok
    */

  if (daysLeft <= 1) {
    return {
      className: "urgent",

      icon: "🔴",

      text:
        daysLeft < 0
          ? "Terlambat"
          : daysLeft === 0
            ? "Deadline Hari Ini"
            : "Deadline Besok",
    };
  }

  /*
       🟡 Deadline beberapa hari lagi
    */

  if (daysLeft <= 7) {
    return {
      className: "warning",

      icon: "🟡",

      text: daysLeft + " hari lagi",
    };
  }

  /*
       🟢 Deadline masih cukup jauh
    */

  return {
    className: "safe",

    icon: "🟢",

    text: daysLeft + " hari lagi",
  };
}

/* =========================================
   FORMAT TANGGAL
   ========================================= */

function formatDate(dateString) {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("id-ID", {
    day: "numeric",

    month: "long",

    year: "numeric",
  });
}

/* =========================================
   TOMBOL TANDAI SELESAI
   ========================================= */

function completeTask(id) {
  let tasks = getTasks();

  /*
       Cari tugas berdasarkan ID.
    */

  const task = tasks.find(function (task) {
    return task.id === id;
  });

  if (!task) {
    alert("Tugas tidak ditemukan.");

    return;
  }

  /*
       Ubah status menjadi Selesai.
    */

  task.status = "Selesai";

  /*
       Simpan kembali ke LocalStorage.
    */

  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));

  /*
       Refresh daftar tugas.
    */

  loadTasks();
}

/* =========================================
   TOMBOL HAPUS
   ========================================= */

function deleteTask(id) {
  const confirmation = confirm("Apakah kamu yakin ingin menghapus tugas ini?");

  if (!confirmation) {
    return;
  }

  let tasks = getTasks();

  /*
       Hapus tugas berdasarkan ID.
    */

  tasks = tasks.filter(function (task) {
    return task.id !== id;
  });

  /*
       Simpan data baru.
    */

  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));

  /*
       Refresh halaman.
    */

  loadTasks();
}

/* =========================================
   TOMBOL EDIT
   ========================================= */

function editTask(id) {
  let tasks = getTasks();

  const task = tasks.find(function (task) {
    return task.id === id;
  });

  if (!task) {
    alert("Tugas tidak ditemukan.");

    return;
  }

  /*
       Untuk sementara menggunakan prompt.

       Nanti ketika halaman Tugas sudah memiliki
       form edit, fungsi ini bisa diarahkan ke
       halaman/form tersebut.
    */

  const newName = prompt("Edit nama tugas:", task.nama);

  if (newName === null || newName.trim() === "") {
    return;
  }

  task.nama = newName.trim();

  /*
       Simpan perubahan.
    */

  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));

  /*
       Refresh daftar.
    */

  loadTasks();
}

/* =========================================
   MENCEGAH HTML INJECTION
   ========================================= */

function escapeHTML(text) {
  if (text === undefined || text === null) {
    return "";
  }

  return String(text)
    .replace(/&/g, "&amp;")

    .replace(/</g, "&lt;")

    .replace(/>/g, "&gt;")

    .replace(/"/g, "&quot;")

    .replace(/'/g, "&#039;");
}
