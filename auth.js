document.addEventListener("DOMContentLoaded", () => {
    // تنظیم فضای ذخیره‌سازی اولیه
    if (!localStorage.getItem("users")) {
        localStorage.setItem("users", JSON.stringify([]));
    }

    // مدیریت فرم لاگین اصلی (در index.html)
    document.getElementById("auth-form")?.addEventListener("submit", (e) => {
        e.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const users = JSON.parse(localStorage.getItem("users"));

        // بررسی اعتبار کاربر
        const validUser = users.find(user => 
            user.username === username && 
            user.password === password
        );

        if (validUser) {
            localStorage.setItem("currentUser", username);
            window.location.href = "dashboard.html";
        } else {
            alert("نام کاربری یا رمز عبور نادرست است!");
        }
    });

    // مدیریت فرم ثبت‌نام (در signup.html)
    document.getElementById("signup-form")?.addEventListener("submit", (e) => {
        e.preventDefault();
        const username = document.getElementById("new-username").value;
        const email = document.getElementById("new-email").value; // اضافه شده
        const password = document.getElementById("new-password").value;
        const users = JSON.parse(localStorage.getItem("users"));

        if (users.some(user => user.username === username)) {
            alert("این نام کاربری قبلاً استفاده شده است!");
            return;
        }
        
        if (users.some(user => user.email === email)) { // اضافه شده
            alert("این ایمیل قبلاً ثبت‌شده است!");
            return;
        }

        users.push({ username, email, password }); // اضافه شده
        localStorage.setItem("users", JSON.stringify(users));
        alert("حساب کاربری با موفقیت ساخته شد!");
        window.location.href = "login.html";
    });
});

// مدیریت خروج
document.getElementById("logout-btn")?.addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
});

// ======= بخش جدید: مدیریت بازیابی رمز عبور ======= //

// تابع تولید توکن
function generateResetToken() {
    return crypto.randomUUID ? crypto.randomUUID() : 
           Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// تابع اعتبارسنجی توکن
function validateResetToken(email, token) {
    const storedData = JSON.parse(localStorage.getItem(`reset_${email}`) || "null");
    
    // بررسی وجود توکن و تطابق
    if (!storedData || storedData.token !== token) {
        return { valid: false, message: "لینک بازیابی نامعتبر است!" };
    }
    
    // بررسی تاریخ انقضا
    if (Date.now() > storedData.expires) {
        return { valid: false, message: "لینک بازیابی منقضی شده است!" };
    }
    
    return { valid: true };
}

// تابع به روزرسانی رمز عبور
function updateUserPassword(email, newPassword) {
    const users = JSON.parse(localStorage.getItem("users"));
    const userIndex = users.findIndex(user => user.email === email);
    
    if (userIndex !== -1) {
        users[userIndex].password = newPassword;
        localStorage.setItem("users", JSON.stringify(users));
        localStorage.removeItem(`reset_${email}`); // حذف توکن بعد از استفاده
        return true;
    }
    return false;
}