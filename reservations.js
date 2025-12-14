document.addEventListener("DOMContentLoaded", () => {
    const currentUser = localStorage.getItem("currentUser");
    
    // چک کردن اینکه کاربر وارد شده یا نه
    if (!currentUser) {
        window.location.href = "index.html";
        return;
    }

    // گرفتن تمام رزروها از localStorage
    const reservations = JSON.parse(localStorage.getItem("reservations") || '[]');

    // فیلتر کردن فقط رزروهای کاربر جاری
    const userReservations = reservations.filter(res => res.user === currentUser);
    const listElement = document.getElementById("reservations-list");

    if (userReservations.length === 0) {
        listElement.innerHTML = "<p>No reservations found.</p>";
        return;
    }

    // ساخت HTML برای رزروها
    listElement.innerHTML = userReservations.map(reservation => `
        <div class="reservation-card">
            <h3>${reservation.advisorName}</h3>
            <p><strong>Date:</strong> ${reservation.date}</p>
            <p><strong>Time:</strong> ${reservation.time}</p>
            <button class="cancel-btn" data-id="${reservation.id}">Cancel</button>
        </div>
    `).join("");

    // اضافه کردن رویداد لغو به دکمه‌ها
    document.querySelectorAll(".cancel-btn").forEach(button => {
        button.addEventListener("click", (e) => {
            const idToCancel = e.target.getAttribute("data-id");

            // حذف رزرو از لیست
            const updatedReservations = reservations.filter(res => res.id !== idToCancel);
            localStorage.setItem("reservations", JSON.stringify(updatedReservations));

            // رفرش صفحه برای نمایش تغییرات
            window.location.reload();
        });
    });
});
