// تابع رزرو مشاور
async function book(advisorId) {
    try {
        // دریافت لیست مشاوران از فایل JSON
        const response = await fetch("data/advisors.json");
        const advisors = await response.json();

        // پیدا کردن مشاور انتخاب‌شده
        const advisor = advisors.find(a => a.id === advisorId);

        if (!advisor) {
            alert("Advisor not found!");
            return;
        }

        // ساخت اطلاعات رزرو
        const reservation = {
            id: Date.now().toString(),
            user: localStorage.getItem("currentUser") || "Guest",
            advisorName: advisor.name,
            advisorExpertise: advisor.expertise,
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString()
        };

        // گرفتن رزروهای قبلی و اضافه کردن رزرو جدید
        const reservations = JSON.parse(localStorage.getItem("reservations") || '[]');
        reservations.push(reservation);
        localStorage.setItem("reservations", JSON.stringify(reservations));

        // ذخیره آیدی مشاور برای صفحه تایید
        localStorage.setItem("selectedadvisor", advisor.id);

        // انتقال به صفحه تایید
        window.location.href = "confirm.html";

    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred during booking");
    }
}

// بارگذاری مشاوران در صفحه
fetch("data/advisors.json")
    .then(res => res.json())
    .then(advisors => {
        const container = document.getElementById("advisors-container");

        // ذخیره مشاورها برای استفاده‌های بعدی
        localStorage.setItem("advisors", JSON.stringify(advisors));

        // ساخت کارت مشاورها
        advisors.forEach(advisor => {
            const card = document.createElement("div");
            card.className = "advisor-card";
            card.innerHTML = `
                <h3>${advisor.name}</h3>
                <p>${advisor.expertise}</p>
                <button onclick="book('${advisor.id}')">Book</button>
            `;
            container.appendChild(card);
        });
    })
    .catch(error => {
        console.error("Error loading advisors:", error);
        document.getElementById("advisors-container").innerHTML =
            "<p>Error loading advisors. Please try again later.</p>";
    });
