
const loginTab = document.querySelector("#loginTab");
const registerTab = document.querySelector("#registerTab");
const authForm = document.querySelector("#authForm");

const nameField = document.querySelector("#nameField");
const fullName = document.querySelector("#fullName");
const phone = document.querySelector("#phone");
const password = document.querySelector("#password");

const formTitle = document.querySelector("#formTitle");
const formDescription = document.querySelector("#formDescription");
const submitBtn = document.querySelector("#submitBtn");
const formMessage = document.querySelector("#formMessage");

let mode = "login";

function showMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = "form-message " + type;
}

function setMode(newMode) {
    mode = newMode;

    const isRegister = mode === "register";

    loginTab.classList.toggle("active", !isRegister);
    registerTab.classList.toggle("active", isRegister);

    nameField.hidden = !isRegister;
    fullName.required = isRegister;

    password.autocomplete = isRegister
        ? "new-password"
        : "current-password";

    formTitle.textContent = isRegister
        ? "Yangi hisob yarating"
        : "Xush kelibsiz!";

    formDescription.textContent = isRegister
        ? "Ma’lumotlaringizni kiriting va davom eting."
        : "Hisobingizga kirish uchun ma’lumotlaringizni kiriting.";

    submitBtn.innerHTML = isRegister
        ? "Hisob yaratish <span>→</span>"
        : "Hisobga kirish <span>→</span>";

    showMessage("", "");
}

loginTab.addEventListener("click", () => setMode("login"));

registerTab.addEventListener("click", () => setMode("register"));

document.querySelector("#togglePassword").addEventListener(
    "click",
    function () {
        const hidden = password.type === "password";

        password.type = hidden ? "text" : "password";

        this.textContent = hidden ? "◉" : "◉";
        this.setAttribute(
            "aria-label",
            hidden ? "Parolni yashirish" : "Parolni ko‘rsatish"
        );
    }
);

// Faqat ko‘rinish uchun demo forma.
// Haqiqiy akkaunt server va xavfsiz autentifikatsiya talab qiladi.

authForm.addEventListener("submit", event => {
    event.preventDefault();

    const digits = phone.value.replace(/\D/g, "");
    const normalizedPhone = digits.startsWith("998")
        ? digits.slice(3)
        : digits;

    if (normalizedPhone.length !== 9) {
        showMessage(
            "Telefon raqamini to‘g‘ri kiriting: 90 123 45 67.",
            "error"
        );
        return;
    }

    if (password.value.length < 8) {
        showMessage(
            "Parol kamida 8 ta belgidan iborat bo‘lsin.",
            "error"
        );
        return;
    }

    if (mode === "register" && fullName.value.trim().length < 2) {
        showMessage("Ism va familiyangizni kiriting.", "error");
        return;
    }

    showMessage(
        mode === "register"
            ? "Forma tekshirildi! Haqiqiy ro‘yxatdan o‘tish uchun backend kerak."
            : "Forma tekshirildi! Haqiqiy kirish uchun backend kerak.",
        "success"
    );
});

document.querySelector("#forgotPassword").addEventListener("click", () => {
    showMessage(
        "Parolni tiklash uchun keyinchalik SMS tasdiqlash tizimini ulaymiz.",
        "error"
    );
});
