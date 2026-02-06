// // ============================================================
// // 🔐 PROFESSIONAL UNIFIED AUTH SYSTEM
// // ============================================================

// const AuthSystem = (function () {
//     'use strict';

//     // ============================
//     // 🔹 STORAGE KEYS (YAGONAlik uchun)
//     // ============================
//     const USERS_KEY = 'crm_all_users';
//     const CURRENT_USER_KEY = 'crm_current_user';
//     const SESSION_KEY = 'crm_session_active';

//     // ============================
//     // 🔹 PRIVATE FUNCTIONS
//     // ============================
    
//     // Barcha userlarni olish
//     function getAllUsers() {
//         try {
//             const users = localStorage.getItem(USERS_KEY);
//             return users ? JSON.parse(users) : [];
//         } catch {
//             return [];
//         }
//     }

//     // Barcha userlarni saqlash
//     function saveAllUsers(users) {
//         localStorage.setItem(USERS_KEY, JSON.stringify(users));
//     }

//     // Parolni xeshlash
//     function hashPassword(password) {
//         let hash = 0;
//         for (let i = 0; i < password.length; i++) {
//             hash = (hash << 5) - hash + password.charCodeAt(i);
//             hash |= 0;
//         }
//         return hash.toString(36);
//     }

//     // Random ID generator
//     function generateUserId() {
//         return 'user_' + Date.now() + '_' + Math.random().toString(36).slice(2);
//     }

//     // ============================
//     // 🔹 PUBLIC API
//     // ============================
//     return {

//         // ============================================================
//         // 📝 RO'YXATDAN O'TKAZISH
//         // ============================================================
//         register: function (data) {
//             const allUsers = getAllUsers();

//             // Email orqali tekshirish
//             if (allUsers.find(u => u.email === data.email)) {
//                 return { 
//                     success: false, 
//                     message: "Bu email allaqachon ro'yxatdan o'tgan!" 
//                 };
//             }

//             const newUser = {
//                 userId: generateUserId(),
//                 fullName: data.fullName,
//                 email: data.email,
//                 phone: data.phone,
//                 storeName: data.storeName,
//                 password: hashPassword(data.password),
//                 role: "Boshqaruv",
//                 createdAt: new Date().toISOString(),

//                 // 🔹 Dashboard uchun bo'sh struktura
//                 products: [],
//                 categories: ['Electronics'],
//                 sales: [],
//                 debtors: [],
//                 paidDebtors: [],
//                 smsHistory: [],

//                 stats: {
//                     customers: 0,
//                     deals: 0,
//                     today: 0
//                 }
//             };

//             allUsers.push(newUser);
//             saveAllUsers(allUsers);

//             console.log('✅ Yangi foydalanuvchi ro\'yxatdan o\'tdi:', newUser.email);
//             return { success: true, user: newUser };
//         },

//         // ============================================================
//         // 🔐 LOGIN
//         // ============================================================
//         login: function (emailOrPhone, password) {
//             const users = getAllUsers();
//             const hashed = hashPassword(password);

//             const user = users.find(
//                 u =>
//                     (u.email === emailOrPhone || u.phone === emailOrPhone) &&
//                     u.password === hashed
//             );

//             if (!user) {
//                 return { 
//                     success: false, 
//                     message: "Email/Telefon yoki parol noto'g'ri!" 
//                 };
//             }

//             // Session o'rnatish
//             localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
//             localStorage.setItem(SESSION_KEY, "true");

//             console.log('✅ Tizimga kirdi:', user.email);
//             return { success: true, user };
//         },

//         // ============================================================
//         // 👤 HOZIRGI USERNI OLISH
//         // ============================================================
//         getCurrentUser: function () {
//             try {
//                 const data = localStorage.getItem(CURRENT_USER_KEY);
//                 return data ? JSON.parse(data) : null;
//             } catch {
//                 return null;
//             }
//         },

//         // ============================================================
//         // 💾 MA'LUMOTLARNI YANGILASH (ASOSIY FUNKSIYA)
//         // ============================================================
//         updateCurrentUserData: function (updates) {
//             const currentUser = this.getCurrentUser();
//             if (!currentUser) {
//                 console.error('❌ Joriy foydalanuvchi topilmadi');
//                 return false;
//             }

//             // Deep merge - har bir maydon to'g'ri yangilanadi
//             const updatedUser = JSON.parse(JSON.stringify(currentUser));

//             Object.keys(updates).forEach(key => {
//                 if (Array.isArray(updates[key])) {
//                     // Massiv bo'lsa to'liq yangilanadi
//                     updatedUser[key] = [...updates[key]];
//                 }
//                 else if (typeof updates[key] === "object" && updates[key] !== null) {
//                     // Obyekt bo'lsa merge qilinadi
//                     updatedUser[key] = {
//                         ...updatedUser[key],
//                         ...updates[key]
//                     };
//                 }
//                 else {
//                     updatedUser[key] = updates[key];
//                 }
//             });

//             // 1. CURRENT USER ni yangilash
//             localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));

//             // 2. GLOBAL USERS bazasini yangilash
//             const allUsers = getAllUsers();
//             const index = allUsers.findIndex(u => u.userId === currentUser.userId);

//             if (index !== -1) {
//                 allUsers[index] = updatedUser;
//                 saveAllUsers(allUsers);
//                 console.log('✅ Ma\'lumotlar yangilandi:', currentUser.email);
//             }

//             return true;
//         },

//         // ============================================================
//         // ✅ SESSIYA TEKSHIRISH
//         // ============================================================
//         isSessionValid: function () {
//             return (
//                 localStorage.getItem(SESSION_KEY) === "true" &&
//                 this.getCurrentUser() !== null
//             );
//         },

//         // ============================================================
//         // 🚪 LOGOUT
//         // ============================================================
//         logout: function () {
//             const user = this.getCurrentUser();
//             if (user) {
//                 console.log('👋 Tizimdan chiqdi:', user.email);
//             }
            
//             localStorage.removeItem(CURRENT_USER_KEY);
//             localStorage.removeItem(SESSION_KEY);
//             window.location.href = "login.html";
//         },

//         // ============================================================
//         // 🛡️ SAHIFANI HIMOYA QILISH
//         // ============================================================
//         protectPage: function () {
//             const page = window.location.pathname.toLowerCase();
//             const publicPages = ["signup.html", "login.html", "w-page.html"];

//             const isPublic = publicPages.some(p => page.includes(p));

//             if (!isPublic && !this.isSessionValid()) {
//                 console.log('⚠️ Ruxsatsiz kirish - login sahifasiga yo\'naltirish');
//                 window.location.href = "login.html";
//                 return false;
//             }

//             return true;
//         }
//     };
// })();

// console.log("🔥 AUTH SYSTEM TAYYOR - HAMMASI TO'LIQ ISHLAYDI");

// ============================================================
// 🔐 PROFESSIONAL AUTH SYSTEM - FINAL VERSION
// ============================================================

const AuthSystem = (function () {
  'use strict';

  const USERS_KEY = 'crm_all_users';
  const CURRENT_USER_KEY = 'crm_current_user';
  const SESSION_KEY = 'crm_session_active';

  // ============================
  // 🔹 PRIVATE FUNCTIONS
  // ============================
  
  function getAllUsers() {
    try {
      const users = localStorage.getItem(USERS_KEY);
      return users ? JSON.parse(users) : [];
    } catch {
      return [];
    }
  }

  function saveAllUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function hashPassword(password) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      hash = (hash << 5) - hash + password.charCodeAt(i);
      hash |= 0;
    }
    return hash.toString(36);
  }

  function generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).slice(2);
  }

  // ============================
  // 🔹 PUBLIC API
  // ============================
  return {

    register: function (data) {
      const allUsers = getAllUsers();

      if (allUsers.find(u => u.email === data.email)) {
        return { 
          success: false, 
          message: "Bu email allaqachon ro'yxatdan o'tgan!" 
        };
      }

      const newUser = {
        userId: generateUserId(),
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        storeName: data.storeName,
        password: hashPassword(data.password),
        role: "Boshqaruv",
        createdAt: new Date().toISOString(),
        products: [],
        categories: ['Electronics'],
        sales: [],
        debtors: [],
        paidDebtors: [],
        smsHistory: [],
        stats: {
          customers: 0,
          deals: 0,
          today: 0
        }
      };

      allUsers.push(newUser);
      saveAllUsers(allUsers);

      console.log('✅ Yangi foydalanuvchi ro\'yxatdan o\'tdi:', newUser.email);
      return { success: true, user: newUser };
    },

    login: function (emailOrPhone, password) {
      const users = getAllUsers();
      const hashed = hashPassword(password);

      const user = users.find(
        u =>
          (u.email === emailOrPhone || u.phone === emailOrPhone) &&
          u.password === hashed
      );

      if (!user) {
        return { 
          success: false, 
          message: "Email/Telefon yoki parol noto'g'ri!" 
        };
      }

      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      localStorage.setItem(SESSION_KEY, "true");

      console.log('✅ Tizimga kirdi:', user.email);
      return { success: true, user };
    },

    getCurrentUser: function () {
      try {
        const data = localStorage.getItem(CURRENT_USER_KEY);
        return data ? JSON.parse(data) : null;
      } catch (e) {
        console.error('❌ getCurrentUser xatosi:', e);
        return null;
      }
    },

    updateCurrentUserData: function (updates) {
      const currentUser = this.getCurrentUser();
      if (!currentUser) {
        console.error('❌ Joriy foydalanuvchi topilmadi');
        return false;
      }

      const updatedUser = JSON.parse(JSON.stringify(currentUser));

      Object.keys(updates).forEach(key => {
        if (Array.isArray(updates[key])) {
          updatedUser[key] = [...updates[key]];
        }
        else if (typeof updates[key] === "object" && updates[key] !== null) {
          updatedUser[key] = {
            ...updatedUser[key],
            ...updates[key]
          };
        }
        else {
          updatedUser[key] = updates[key];
        }
      });

      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));

      const allUsers = getAllUsers();
      const index = allUsers.findIndex(u => u.userId === currentUser.userId);

      if (index !== -1) {
        allUsers[index] = updatedUser;
        saveAllUsers(allUsers);
        console.log('✅ Ma\'lumotlar yangilandi:', Object.keys(updates));
      }

      return true;
    },

    isSessionValid: function () {
      return (
        localStorage.getItem(SESSION_KEY) === "true" &&
        this.getCurrentUser() !== null
      );
    },

    logout: function () {
      const user = this.getCurrentUser();
      if (user) {
        console.log('👋 Tizimdan chiqdi:', user.email);
      }
      
      localStorage.removeItem(CURRENT_USER_KEY);
      localStorage.removeItem(SESSION_KEY);
      window.location.href = "login.html";
    }
  };
})();

// ============================================================
// 🔥 GLOBAL PAGE TRANSITION
// ============================================================
(function () {
  const overlay = document.createElement("div");
  overlay.className = "page-overlay";
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    background: #0f172a;
    z-index: 9999;
    opacity: 0;
    transition: opacity 0.6s ease;
    pointer-events: none;
  `;
  document.body.appendChild(overlay);

  window.addEventListener("pageshow", () => {
    overlay.style.opacity = "0";
    document.body.classList.remove("page-exit");
  });

  window.goToPage = function (url) {
    overlay.style.opacity = "1";
    document.body.classList.add("page-exit");
    setTimeout(() => {
      window.location.href = url;
    }, 650);
  };

  document.addEventListener("click", function (e) {
    const link = e.target.closest("a");
    if (
      link &&
      link.href &&
      !link.hasAttribute("target") &&
      !link.hasAttribute("download") &&
      link.origin === window.location.origin &&
      !link.href.includes('#')
    ) {
      e.preventDefault();
      goToPage(link.href);
    }
  });
})();

// ============================================================
// 📝 SIGNUP FORM
// ============================================================
function initSignupForm() {
  const form = document.getElementById("signupForm");
  if (!form) return;

  const createBtn = document.getElementById("createBtn");
  const terms = document.getElementById("terms");
  const firstName = document.getElementById("firstName");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const telInputs = document.querySelectorAll('input[name="tel"]');

  function validateForm() {
    const isValid = 
      firstName.value.trim().length > 0 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()) &&
      password.value.length >= 6 &&
      Array.from(telInputs).every(input => input.value.trim() !== '') &&
      terms.checked;

    createBtn.disabled = !isValid;
    createBtn.classList.toggle('active', isValid);
    return isValid;
  }

  firstName.addEventListener('input', validateForm);
  email.addEventListener('input', validateForm);
  password.addEventListener('input', validateForm);
  telInputs.forEach(input => input.addEventListener('input', validateForm));
  terms.addEventListener('change', validateForm);

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (!validateForm()) return;

    createBtn.innerText = 'Yaratilmoqda...';
    createBtn.disabled = true;

    const userData = {
      fullName: firstName.value.trim(),
      email: email.value.trim(),
      phone: '+998 ' + telInputs[0].value.trim(),
      storeName: telInputs[1].value.trim(),
      password: password.value
    };

    const result = AuthSystem.register(userData);

    if (result.success) {
      AuthSystem.login(userData.email, userData.password);
      setTimeout(() => window.location.href = 'index.html', 300);
    } else {
      alert(result.message);
      createBtn.innerText = 'Yaratish';
      createBtn.disabled = false;
    }
  });

  const googleBtn = document.getElementById('googleBtn');
  if (googleBtn) {
    googleBtn.addEventListener('click', function(e) {
      e.preventDefault();
      const id = Math.random().toString(36).substr(2, 9);
      
      const demo = {
        fullName: `Demo User ${id.substr(0, 5)}`,
        email: `demo_${id}@gmail.com`,
        phone: `+998 9${Math.floor(Math.random() * 90000000 + 10000000)}`,
        storeName: 'Demo Store',
        password: `demo${id}`
      };

      const result = AuthSystem.register(demo);
      if (result.success) {
        AuthSystem.login(demo.email, demo.password);
        window.location.href = 'index.html';
      }
    });
  }
}

// ============================================================
// 🔐 LOGIN FORM
// ============================================================
function initLoginForm() {
  const form = document.getElementById("loginForm");
  if (!form) return;

  const loginBtn = document.getElementById("loginBtn");
  const loginInput = document.getElementById("loginInput");
  const password = document.getElementById("password");
  const emailTab = document.getElementById("emailTab");
  const phoneTab = document.getElementById("phoneTab");
  const label = document.getElementById("loginLabel");

  if (emailTab && phoneTab && label && loginInput) {
    emailTab.onclick = () => {
      emailTab.classList.add("active");
      phoneTab.classList.remove("active");
      label.innerText = "E-pochta manzili";
      loginInput.type = "email";
      loginInput.placeholder = "you@example.com";
      loginInput.value = "";
      checkForm();
    };

    phoneTab.onclick = () => {
      phoneTab.classList.add("active");
      emailTab.classList.remove("active");
      label.innerText = "Telefon raqam";
      loginInput.type = "tel";
      loginInput.placeholder = "+998 90 123 45 67";
      loginInput.value = "";
      checkForm();
    };
  }

  function checkForm() {
    const isValid = loginInput.value.trim().length > 4 && password.value.length >= 6;
    loginBtn.disabled = !isValid;
  }

  loginInput.addEventListener('input', checkForm);
  password.addEventListener('input', checkForm);

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (!form.checkValidity()) return;

    loginBtn.innerText = 'Kirish...';
    loginBtn.disabled = true;

    const result = AuthSystem.login(loginInput.value.trim(), password.value);

    if (result.success) {
      setTimeout(() => window.location.href = 'index.html', 300);
    } else {
      alert(result.message);
      loginBtn.innerText = 'Kirish';
      loginBtn.disabled = false;
    }
  });
}

// ============================================================
// 🏠 LANDING PAGE
// ============================================================
function initLandingPage() {
  const navbar = document.getElementById('navbar');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');

  if (!navbar || !mobileMenuBtn) return;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  mobileMenuBtn.addEventListener('click', () => {
    navbar.classList.toggle('mobile-open');
    mobileMenuBtn.textContent = navbar.classList.contains('mobile-open') ? '✕' : '☰';
  });

  const startBtn = document.getElementById('startBtn');
  const trialBtn = document.getElementById('trialBtn');

  if (startBtn) startBtn.onclick = (e) => { e.preventDefault(); window.location.href = 'signup.html'; };
  if (trialBtn) trialBtn.onclick = (e) => { e.preventDefault(); window.location.href = 'signup.html'; };
}

// ============================================================
// 🎯 INITIALIZATION - AQLLI ROUTING
// ============================================================
document.addEventListener("DOMContentLoaded", function () {
  const path = window.location.pathname.toLowerCase();
  
  console.log('📄 Current page:', path);

  // ✅ SAHIFALARNI ANIQLASH
  const isSignup = path.includes('signup');
  const isLogin = path.includes('login');
  const isLanding = path.includes('landing') || path === '/' || path === '/index.htm';
  const isIndex = path.includes('index.html');

  // ✅ SAHIFAGA QARAB INIT
  if (isSignup) {
    console.log('➡️ Signup page');
    initSignupForm();
  } 
  else if (isLogin) {
    console.log('➡️ Login page');
    initLoginForm();
  } 
  else if (isLanding) {
    console.log('➡️ Landing page');
    initLandingPage();
  } 
  else if (isIndex) {
    console.log('➡️ Dashboard page');
    
    // ⚠️ FAQAT SHU YERDA AUTH CHECK!
    if (!AuthSystem.isSessionValid()) {
      console.log('⚠️ Session yo\'q - login.html ga redirect');
      window.location.href = 'login.html';
    } else {
      console.log('✅ Session valid - dashboard yuklandi');
    }
  }
  // ✅ Navbar bor sahifalar uchun
  else if (document.getElementById('navbar')) {
    console.log('➡️ Page with navbar - landing init');
    initLandingPage();
  }
});

console.log("🔥 AUTH SYSTEM TAYYOR");