document.addEventListener("DOMContentLoaded", () => {
    const resetForm = document.getElementById("reset-form");

    resetForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("reset-email").value.trim();
        
        // 1. بررسی وجود کاربر
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const userExists = users.some(user => user.email === email);
        
        if (!userExists) {
            alert("No account found with this email address.");
            return;
        }
        
        // 2. تولید و ذخیره توکن
        const token = generateToken();
        const tokenExpiry = Date.now() + 3600000; // 1 ساعت اعتبار
        
        localStorage.setItem(`reset_${email}`, JSON.stringify({
            token: token,
            expires: tokenExpiry
        }));
        
        // 3. نمایش لینک شبیه‌سازی شده (در حالت واقعی باید ایمیل شود)
        console.log(`Password reset link: http://yourapp.com/new-password.html?email=${encodeURIComponent(email)}&token=${token}`);
        
        // 4. اطلاع به کاربر
        alert("Password reset link has been sent to your email!");
        resetForm.reset();
    });
});

// تابع تولید توکن
function generateToken() {
    return crypto.randomUUID ? crypto.randomUUID() : 
           Date.now().toString(36) + Math.random().toString(36).substring(2);
}