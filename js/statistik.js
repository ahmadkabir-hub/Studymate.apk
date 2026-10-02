/* =========================================
   STUDYMATE
   JAVASCRIPT STATISTIK & RIWAYAT
   ========================================= */

// Ambil data tugas dari LocalStorage
let tasks = JSON.parse(localStorage.getItem("studymate_tasks")) || [];


// Simpan data tugas ke LocalStorage
function saveTasks() {
    localStorage.setItem("studymate_tasks", JSON.stringify(tasks));
}

const hamburgerBtn = document.getElementById('hamburgerBtn');
const navMenu = document.querySelector('.nav-menu');

hamburgerBtn.addEventListener('click', function() {
    // Menambahkan atau menghapus kelas 'active' pada menu
    navMenu.classList.toggle('active');
});

/* =========================================
   KEY LOCAL STORAGE
   ========================================= */

const STORAGE_KEY = "studymate_tasks";


/* =========================================
   SAAT HALAMAN DIBUKA
   ========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadStatistics();

    }
);


/* =========================================
   MENGAMBIL DATA DARI LOCAL STORAGE
   ========================================= */

function getTasks() {

    const data =
        localStorage.getItem(STORAGE_KEY);


    /*
       Jika belum ada data
    */

    if (!data) {

        return [];

    }


    try {

        const tasks = JSON.parse(data);

        /*
           Pastikan data berbentuk array.
        */

        if (!Array.isArray(tasks)) {

            return [];

        }

        return tasks;

    } catch (error) {

        console.error(
            "Data studymate_tasks tidak valid:",
            error
        );

        return [];

    }

}


/* =========================================
   LOAD SEMUA STATISTIK
   ========================================= */

function loadStatistics() {

    const tasks = getTasks();


    /*
       1. Hitung total tugas
    */

    const totalTasks = tasks.length;


    /*
       2. Cari tugas yang sudah selesai
    */

    const completedTasks =
        tasks.filter(function (task) {

            return isCompleted(task);

        });


    /*
       3. Cari tugas yang deadline-nya mepet
    */

    const urgentTasks =
        tasks.filter(function (task) {

            /*
               Tugas harus BELUM selesai
               dan deadline hari ini / besok.
            */

            return (
                !isCompleted(task) &&
                isUrgentDeadline(task.deadline)
            );

        });


    /*
       Tampilkan angka ke halaman
    */

    document.getElementById(
        "totalTasks"
    ).textContent = totalTasks;


    document.getElementById(
        "completedTasks"
    ).textContent =
        completedTasks.length;


    document.getElementById(
        "urgentTasks"
    ).textContent =
        urgentTasks.length;


    /*
       Tampilkan riwayat tugas selesai.
    */

    displayHistory(completedTasks);

}


/* =========================================
   CEK STATUS SELESAI
   ========================================= */

function isCompleted(task) {

    /*
       Format yang diberikan prompt:

       status: "selesai"

       Tapi kita juga menerima:

       "Selesai"
       "SELESAI"
       "Sudah Selesai"

       serta format dari Monitoring sebelumnya:

       "Selesai"
    */

    if (!task.status) {

        return false;

    }


    const status =
        String(task.status)
        .toLowerCase()
        .trim();


    return (
        status === "selesai" ||
        status === "sudah selesai" ||
        status === "completed" ||
        status === "done"
    );

}


/* =========================================
   CEK DEADLINE MEPET
   ========================================= */

function isUrgentDeadline(deadline) {

    if (!deadline) {

        return false;

    }


    const today = new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );


    const deadlineDate =
        new Date(deadline);

    deadlineDate.setHours(
        0,
        0,
        0,
        0
    );


    /*
       Hitung selisih waktu.
    */

    const difference =
        deadlineDate.getTime() -
        today.getTime();


    /*
       Ubah menjadi jumlah hari.
    */

    const daysLeft =
        Math.ceil(
            difference /
            (1000 * 60 * 60 * 24)
        );


    /*
       Deadline mepet:

       Hari ini = 0
       Besok = 1

       Deadline yang sudah lewat
       juga dianggap mepet.
    */

    return daysLeft <= 1;

}


/* =========================================
   MENAMPILKAN RIWAYAT
   ========================================= */

function displayHistory(completedTasks) {

    const historyList =
        document.getElementById(
            "historyList"
        );


    const emptyHistory =
        document.getElementById(
            "emptyHistory"
        );


    /*
       Bersihkan daftar terlebih dahulu.
    */

    historyList.innerHTML = "";


    /*
       Jika belum ada tugas selesai
    */

    if (completedTasks.length === 0) {

        emptyHistory.classList.remove(
            "hidden"
        );

        return;

    }


    /*
       Jika ada tugas selesai,
       sembunyikan pesan kosong.
    */

    emptyHistory.classList.add(
        "hidden"
    );


    /*
       Urutkan berdasarkan tanggal
       dari yang paling baru.
    */

    completedTasks.sort(
        function (a, b) {

            return (
                new Date(
                    b.tanggal
                ) -
                new Date(
                    a.tanggal
                )
            );

        }
    );


    /*
       Buat card satu per satu.
    */

    completedTasks.forEach(
        function (task) {

            const card =
                createHistoryCard(task);

            historyList.appendChild(card);

        }
    );

}


/* =========================================
   MEMBUAT CARD RIWAYAT
   ========================================= */

function createHistoryCard(task) {

    const card =
        document.createElement("div");


    card.className =
        "history-card";


    /*
       Support dua format nama tugas:

       Format prompt:
       task.tugas

       Format Monitoring sebelumnya:
       task.nama
    */

    const taskName =
        task.tugas ||
        task.nama ||
        "Tugas tanpa nama";


    /*
       Pemberi tugas
    */

    const giver =
        task.pemberi ||
        "Tidak diketahui";


    /*
       Tanggal
    */

    const taskDate =
        formatDate(task.tanggal);


    /*
       Deadline
    */

    const deadline =
        formatDate(task.deadline);


    /*
       Masukkan isi card.
    */

    card.innerHTML = `

        <div class="history-info">

            <h3 class="history-title">
                ${escapeHTML(taskName)}
            </h3>


            <p class="history-giver">

                Pemberi tugas:
                <strong>
                    ${escapeHTML(giver)}
                </strong>

            </p>


            <div class="history-details">

                <span class="history-detail">

                    📅 Tanggal:
                    <strong>
                        ${taskDate}
                    </strong>

                </span>


                <span class="history-detail">

                    ⏰ Deadline:
                    <strong>
                        ${deadline}
                    </strong>

                </span>

            </div>

        </div>


        <span class="completed-status">

            ✓ Selesai

        </span>

    `;


    return card;

}


/* =========================================
   FORMAT TANGGAL
   ========================================= */

function formatDate(dateString) {

    if (!dateString) {

        return "-";

    }


    const date =
        new Date(dateString);


    if (isNaN(date.getTime())) {

        return "-";

    }


    return date.toLocaleDateString(
        "id-ID",
        {
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );

}


/* =========================================
   KEAMANAN DATA
   ========================================= */

function escapeHTML(text) {

    if (
        text === undefined ||
        text === null
    ) {

        return "";

    }


    return String(text)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}