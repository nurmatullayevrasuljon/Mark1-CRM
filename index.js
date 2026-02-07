// ============================================================
// GLOBAL PAGE TRANSITION
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

  // Sahifa yuklanganda fade-in
  window.addEventListener("pageshow", () => {
    overlay.style.opacity = "0";
    document.body.classList.remove("page-exit");
  });

  // Universal navigation function
  window.goToPage = function (url) {
    overlay.style.opacity = "1";
    document.body.classList.add("page-exit");
    setTimeout(() => {
      window.location.href = url;
    }, 650);
  };

  // Barcha <a> linklar uchun
  // document.addEventListener("click", function (e) {
  //   const link = e.target.closest("a");
  //   if (
  //     link &&
  //     link.href &&
  //     !link.hasAttribute("target") &&
  //     !link.hasAttribute("download") &&
  //     link.origin === window.location.origin
  //   ) {
  //     e.preventDefault();
  //     goToPage(link.href);
  //   }
  // });
})();

// ============================================================
// AUTHENTICATION & STORAGE SYSTEM
// ============================================================

// Barcha foydalanuvchilarni olish
function getAllUsers() {
  try {
    const users = localStorage.getItem('allUsers');
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error('❌ Foydalanuvchilarni olishda xato:', error);
    return [];
  }
}

// Barcha foydalanuvchilarni saqlash
function saveAllUsers(users) {
  try {
    localStorage.setItem('allUsers', JSON.stringify(users));
    console.log('✅ Barcha foydalanuvchilar saqlandi:', users.length);
    return true;
  } catch (error) {
    console.error('❌ Foydalanuvchilarni saqlashda xato:', error);
    return false;
  }
}

// Yangi foydalanuvchi qo'shish
function registerUser(userData) {
  try {
    const allUsers = getAllUsers();

    // ✅ FAQAT EMAIL BO'YICHA TEKSHIRISH (telefon emas!)
    const existingUser = allUsers.find(u => u.email === userData.email);

    if (existingUser) {
      console.log('⚠️ Bu email allaqachon ro\'yxatdan o\'tgan:', userData.email);
      return {
        success: false,
        message: 'Bu email allaqachon ro\'yxatdan o\'tgan!\n\nIltimos, tizimga kiring.'
      };
    }

    // Yangi foydalanuvchiga ID berish
    userData.userId = Date.now().toString();
    userData.registeredAt = new Date().toISOString();

    // Ro'yxatga qo'shish
    allUsers.push(userData);
    saveAllUsers(allUsers);

    console.log('✅ Yangi foydalanuvchi ro\'yxatdan o\'tdi:', userData.email);
    return { success: true, user: userData };
  } catch (error) {
    console.error('❌ Ro\'yxatdan o\'tishda xato:', error);
    return { success: false, message: 'Ro\'yxatdan o\'tishda xato yuz berdi' };
  }
}

// Login - foydalanuvchini topish
function loginUser(emailOrPhone, password) {
  try {
    const allUsers = getAllUsers();

    // Email yoki telefon orqali topish
    const user = allUsers.find(u =>
      (u.email === emailOrPhone || u.phone === emailOrPhone) &&
      u.password === password
    );

    if (user) {
      console.log('✅ Foydalanuvchi topildi va tizimga kirdi:', user);
      return { success: true, user: user };
    } else {
      console.log('❌ Email/telefon yoki parol noto\'g\'ri');
      return { success: false, message: 'Email/telefon yoki parol noto\'g\'ri' };
    }
  } catch (error) {
    console.error('❌ Tizimga kirishda xato:', error);
    return { success: false, message: 'Tizimga kirishda xato yuz berdi' };
  }
}

// Joriy foydalanuvchini saqlash (session)
function setCurrentUser(userData) {
  try {
    localStorage.setItem('currentUser', JSON.stringify(userData));
    localStorage.setItem('isLoggedIn', 'true');
    console.log('✅ Joriy foydalanuvchi o\'rnatildi:', userData);
    return true;
  } catch (error) {
    console.error('❌ Joriy foydalanuvchini saqlashda xato:', error);
    return false;
  }
}

// Joriy foydalanuvchini olish
function getCurrentUser() {
  try {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('❌ Joriy foydalanuvchini olishda xato:', error);
    return null;
  }
}

// Foydalanuvchi tizimga kirganmi tekshirish
function isUserLoggedIn() {
  return localStorage.getItem('isLoggedIn') === 'true' && getCurrentUser() !== null;
}

// Foydalanuvchi ma'lumotlarini yangilash
function updateCurrentUser(updatedData) {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      console.log('❌ Joriy foydalanuvchi topilmadi');
      return false;
    }

    // Ma'lumotlarni yangilash
    const newUserData = { ...currentUser, ...updatedData };

    // Barcha foydalanuvchilarda ham yangilash
    const allUsers = getAllUsers();
    const userIndex = allUsers.findIndex(u => u.userId === currentUser.userId);

    if (userIndex !== -1) {
      allUsers[userIndex] = newUserData;
      saveAllUsers(allUsers);
    }

    // Joriy sessiyani yangilash
    setCurrentUser(newUserData);

    console.log('✅ Foydalanuvchi ma\'lumotlari yangilandi:', newUserData);
    return true;
  } catch (error) {
    console.error('❌ Ma\'lumotlarni yangilashda xato:', error);
    return false;
  }
}

// Chiqish funksiyasi
function logout() {
  localStorage.removeItem('currentUser');
  localStorage.removeItem('isLoggedIn');
  console.log('👋 Foydalanuvchi tizimdan chiqdi');
  window.location.href = 'login.html';
}

// Sahifa himoyasi - faqat tizimga kirganlar ko'rishi mumkin
function protectPage() {
  const currentPage = window.location.pathname;

  // Login va signup sahifalarni tekshirmaslik
  if (currentPage.includes('login') || currentPage.includes('signup') || currentPage.includes('landing')) {
    return;
  }

  // Agar tizimga kirmagan bo'lsa, login sahifasiga yo'naltirish
  if (!isUserLoggedIn()) {
    console.log('⚠️ Tizimga kirilmagan, login sahifasiga yo\'naltirilmoqda...');
    window.location.href = 'login.html';
  }
}

// ============================================================
// SIGNUP FORM - RO'YXATDAN O'TISH
// ============================================================
function initSignupForm() {
  console.log("🚀 Signup form init boshlandi...");

  const form = document.getElementById("signupForm");

  if (!form) {
    console.log("⚠️ signupForm topilmadi");
    return;
  }

  console.log("✅ signupForm topildi!");

  const createBtn = document.getElementById("createBtn");
  const terms = document.getElementById("terms");
  const firstName = document.getElementById("firstName");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const telInputs = document.querySelectorAll('input[name="tel"]');

  console.log("📋 Elementlar:", {
    createBtn: !!createBtn,
    terms: !!terms,
    firstName: !!firstName,
    email: !!email,
    password: !!password,
    telInputs: telInputs.length
  });

  if (!createBtn || !terms || !firstName || !email || !password) {
    console.error("❌ Muhim elementlar topilmadi!");
    return;
  }

  // Validatsiya funksiyasi
  function validateForm() {
    const firstNameValue = firstName.value.trim();
    const firstNameValid = firstNameValue.length > 0;

    const emailValue = email.value.trim();
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);

    const passwordValue = password.value;
    const passwordValid = passwordValue.length >= 6;

    let allTelFilled = true;
    telInputs.forEach(input => {
      if (input.value.trim() === "") {
        allTelFilled = false;
      }
    });

    const termsChecked = terms.checked;

    const isValid = firstNameValid &&
      emailValid &&
      passwordValid &&
      allTelFilled &&
      termsChecked;

    console.log("🔍 Validatsiya:", {
      firstName: firstNameValid,
      email: emailValid,
      password: passwordValid,
      tel: allTelFilled,
      terms: termsChecked,
      result: isValid ? "✅" : "❌"
    });

    createBtn.disabled = !isValid;

    if (isValid) {
      createBtn.classList.add("active");
      console.log("✅ TUGMA AKTIV!");
    } else {
      createBtn.classList.remove("active");
    }

    return isValid;
  }

  // Event listeners
  firstName.addEventListener("input", validateForm);
  email.addEventListener("input", validateForm);
  password.addEventListener("input", validateForm);

  telInputs.forEach(input => {
    input.addEventListener("input", validateForm);
  });

  terms.addEventListener("change", validateForm);

  // Boshlang'ich validatsiya
  validateForm();

  // FORM SUBMIT - RO'YXATDAN O'TISH
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    console.log("📤 Form submit - Ro'yxatdan o'tish!");

    if (!validateForm()) {
      console.log("❌ Validatsiya xatosi");
      form.classList.add("was-validated");
      return;
    }

    createBtn.innerText = "Yaratilmoqda...";
    createBtn.disabled = true;

    const userData = {
      fullName: firstName.value.trim(),
      email: email.value.trim(),
      phone: telInputs[0] ? "+998 " + telInputs[0].value.trim() : "",
      storeName: telInputs[1] ? telInputs[1].value.trim() : "",
      password: password.value,
      role: "Boshqaruv",
      stats: {
        customers: 0,
        deals: 0,
        today: 0
      }
    };

    console.log("💾 Yangi foydalanuvchi ma'lumotlari:", userData);

    // Ro'yxatdan o'tkazish
    const result = registerUser(userData);

    if (result.success) {
      // Tizimga avtomatik kirish
      setCurrentUser(result.user);

      console.log("✅ Muvaffaqiyatli ro'yxatdan o'tdingiz!");

      setTimeout(() => {
        window.location.href = "index.html";
      }, 500);
    } else {
      // ✅ Xatolik - alert va login sahifasiga yo'naltirish
      alert(result.message + "\n\nSiz tizimga kirish sahifasiga yo'naltirilasiz.");

      setTimeout(() => {
        window.location.href = "login.html";
      }, 1500);
    }
  });

  // ✅✅✅ GOOGLE LOGIN - TO'G'RILANGAN ✅✅✅
  const googleBtn = document.getElementById("googleBtn");
  if (googleBtn) {
    googleBtn.addEventListener("click", function (e) {
      e.preventDefault();
      console.log("🔵 Google Login boshlandi!");

      // ✅ HAR SAFAR YANGI TASODIFIY MA'LUMOTLAR YARATISH
      const randomId = Math.random().toString(36).substr(2, 9);
      const timestamp = Date.now();

      const demoUser = {
        fullName: `Google User ${randomId.substr(0, 5)}`,
        email: `user_${randomId}@gmail.com`, // ✅ Har safar boshqa email!
        phone: `+998 9${Math.floor(Math.random() * 90000000 + 10000000)}`,
        storeName: "Google Store",
        password: `google_${randomId}`,
        role: "Boshqaruv",
        stats: {
          customers: 0,
          deals: 0,
          today: 0
        }
      };

      console.log("📧 Yangi email yaratildi:", demoUser.email);

      // Ro'yxatdan o'tkazish
      const result = registerUser(demoUser);

      if (result.success) {
        console.log("✅ Yangi Google foydalanuvchi ro'yxatdan o'tdi!");
        setCurrentUser(result.user);

        setTimeout(() => {
          window.location.href = "index.html";
        }, 300);
      } else {
        // ✅ Xatolik - alert va login sahifasiga yo'naltirish
        console.error("❌ Xato:", result.message);
        alert(result.message + "\n\nSiz tizimga kirish sahifasiga yo'naltirilasiz.");

        setTimeout(() => {
          window.location.href = "login.html";
        }, 1500);
      }
    });
  }

  console.log("✅ Signup form tayyor!");
}
// document.addEventListener('DOMContentLoaded', function() {
//   const form = document.getElementById('signupForm');
//   if (!form) return;

//   const createBtn = document.getElementById('createBtn');
//   const terms = document.getElementById('terms');
//   const firstName = document.getElementById('firstName');
//   const email = document.getElementById('email');
//   const password = document.getElementById('password');
//   const telInputs = document.querySelectorAll('input[name="tel"]');

//   // Validatsiya
//   function validateForm() {
//     const isValid = 
//       firstName.value.trim().length > 0 &&
//       /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()) &&
//       password.value.length >= 6 &&
//       Array.from(telInputs).every(input => input.value.trim() !== '') &&
//       terms.checked;

//     createBtn.disabled = !isValid;
//     createBtn.classList.toggle('active', isValid);
//     return isValid;
//   }

//   firstName.addEventListener('input', validateForm);
//   email.addEventListener('input', validateForm);
//   password.addEventListener('input', validateForm);
//   telInputs.forEach(input => input.addEventListener('input', validateForm));
//   terms.addEventListener('change', validateForm);

//   // Submit
//   form.addEventListener('submit', function(e) {
//     e.preventDefault();
//     if (!validateForm()) return;

//     createBtn.innerText = 'Yaratilmoqda...';
//     createBtn.disabled = true;

//     const userData = {
//       fullName: firstName.value.trim(),
//       email: email.value.trim(),
//       phone: '+998 ' + telInputs[0].value.trim(),
//       storeName: telInputs[1].value.trim(),
//       password: password.value
//     };

//     const result = AuthSystem.register(userData);

//     if (result.success) {
//       AuthSystem.login(userData.email, userData.password);
//       alert('✅ Ro\'yxatdan o\'tdingiz!');
//       window.location.href = 'index.html';
//     } else {
//       alert(result.message);
//       createBtn.innerText = 'Yaratish';
//       createBtn.disabled = false;
//     }
//   });

//   // Google Login
//   const googleBtn = document.getElementById('googleBtn');
//   if (googleBtn) {
//     googleBtn.addEventListener('click', function(e) {
//       e.preventDefault();
//       const id = Math.random().toString(36).substr(2, 9);
      
//       const demo = {
//         fullName: `Demo User ${id.substr(0, 5)}`,
//         email: `demo_${id}@gmail.com`,
//         phone: `+998 9${Math.floor(Math.random() * 90000000 + 10000000)}`,
//         storeName: 'Demo Store',
//         password: `demo${id}`
//       };

//       const result = AuthSystem.register(demo);
//       if (result.success) {
//         AuthSystem.login(demo.email, demo.password);
//         window.location.href = 'index.html';
//       }
//     });
//   }
// });

// ============================================================
// LOGIN FORM - TIZIMGA KIRISH
// ============================================================
function initLoginForm() {
  console.log("🚀 Login form init...");

  const form = document.getElementById("loginForm");
  if (!form) {
    console.log("⚠️ loginForm topilmadi");
    return;
  }

  const loginBtn = document.getElementById("loginBtn");
  const loginInput = document.getElementById("loginInput");
  const password = document.getElementById("password");
  const emailTab = document.getElementById("emailTab");
  const phoneTab = document.getElementById("phoneTab");
  const label = document.getElementById("loginLabel");

  // Tab switching
  if (emailTab && phoneTab && label && loginInput) {
    emailTab.onclick = () => {
      emailTab.classList.add("active");
      phoneTab.classList.remove("active");
      label.innerText = "E-pochta manzili";
      loginInput.type = "email";
      loginInput.placeholder = "you@example.com";
      loginInput.value = "";
      checkLoginForm();
    };

    phoneTab.onclick = () => {
      phoneTab.classList.add("active");
      emailTab.classList.remove("active");
      label.innerText = "Telefon raqam";
      loginInput.type = "tel";
      loginInput.placeholder = "+998 90 123 45 67";
      loginInput.value = "";
      checkLoginForm();
    };
  }

  // Validation
  function checkLoginForm() {
    const loginOk = loginInput.value.trim().length > 4;
    const passOk = password.value.length >= 6;
    loginBtn.disabled = !(loginOk && passOk);
  }

  loginInput.addEventListener("input", checkLoginForm);
  password.addEventListener("input", checkLoginForm);

  // Submit - TIZIMGA KIRISH
  form.addEventListener("submit", e => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }

    loginBtn.innerText = "Kirish...";
    loginBtn.disabled = true;

    const emailOrPhone = loginInput.value.trim();
    const pass = password.value;

    console.log("🔐 Tizimga kirish urinishi:", emailOrPhone);

    // Foydalanuvchini topish
    const result = loginUser(emailOrPhone, pass);

    if (result.success) {
      // Tizimga kirish
      setCurrentUser(result.user);

      console.log("✅ Muvaffaqiyatli tizimga kirdingiz!");

      setTimeout(() => {
        window.location.href = "index.html";
      }, 500);
    } else {
      alert(result.message);
      loginBtn.innerText = "Kirish";
      loginBtn.disabled = false;
    }
  });

  console.log("✅ Login form tayyor!");
}
// document.addEventListener('DOMContentLoaded', function() {
//   const form = document.getElementById('loginForm');
//   if (!form) return;

//   const loginBtn = document.getElementById('loginBtn');
//   const loginInput = document.getElementById('loginInput');
//   const password = document.getElementById('password');

//   function checkForm() {
//     loginBtn.disabled = !(loginInput.value.trim().length > 4 && password.value.length >= 6);
//   }

//   loginInput.addEventListener('input', checkForm);
//   password.addEventListener('input', checkForm);

//   form.addEventListener('submit', function(e) {
//     e.preventDefault();
//     if (!form.checkValidity()) return;

//     loginBtn.innerText = 'Kirish...';
//     loginBtn.disabled = true;

//     const result = AuthSystem.login(loginInput.value.trim(), password.value);

//     if (result.success) {
//       alert('✅ Xush kelibsiz!');
//       window.location.href = 'index.html';
//     } else {
//       alert(result.message);
//       loginBtn.innerText = 'Kirish';
//       loginBtn.disabled = false;
//     }
//   });
// });

// ============================================================
// LANDING PAGE
// ============================================================
function initLandingPage() {
  console.log("🚀 Landing page init...");

  const navbar = document.getElementById('navbar');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');

  if (!navbar || !mobileMenuBtn) {
    console.log("⚠️ Navbar elementlari topilmadi");
    return;
  }

  // Navbar scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  mobileMenuBtn.addEventListener('click', () => {
    navbar.classList.toggle('mobile-open');
    mobileMenuBtn.textContent = navbar.classList.contains('mobile-open') ? '✕' : '☰';
  });

  // Button handlers
  const startBtn = document.getElementById('startBtn');
  const trialBtn = document.getElementById('trialBtn');

  if (startBtn) {
    startBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'signup.html';
    });
  }

  if (trialBtn) {
    trialBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'signup.html';
    });
  }

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href !== '#' && href.length > 1) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          navbar.classList.remove('mobile-open');
          mobileMenuBtn.textContent = '☰';
        }
      }
    });
  });

  // Parallax effect
  let mouseX = 0, mouseY = 0;
  let currentX = 0, currentY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - window.innerWidth / 2) / 40;
    mouseY = (e.clientY - window.innerHeight / 2) / 40;
  });

  function animate() {
    currentX += (mouseX - currentX) * 0.1;
    currentY += (mouseY - currentY) * 0.1;

    const floatingElements = document.querySelectorAll('.floating-element');
    floatingElements.forEach((el, index) => {
      const speed = (index + 1) * 0.5;
      el.style.transform = `translate(${currentX * speed}px, ${currentY * speed}px)`;
    });

    requestAnimationFrame(animate);
  }

  animate();

  // Scroll animations
  const revealElements = document.querySelectorAll('.block-text, .line-text');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('block-text-show', 'line-text-show');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -60px 0px'
    }
  );

  revealElements.forEach((el, i) => {
    el.classList.add(`block-text-${(i % 4) + 1}`);
    revealObserver.observe(el);
  });

  // Icon box animations
  const iconBoxes = document.querySelectorAll('.icon-box');
  window.addEventListener('scroll', () => {
    iconBoxes.forEach(box => {
      if (box.getBoundingClientRect().top < window.innerHeight - 50) {
        box.classList.add('svg-icon', 'icon-text', 'icon-text2');
      }
    });
  });

  // Nav links active state
  const navLinks = document.querySelectorAll('.nav-links a');
  const navHeight = navbar.offsetHeight;

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const targetId = link.dataset.target;
      const targetEl = document.getElementById(targetId);

      if (!targetEl) return;

      const y = targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight - 10;

      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });

      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // Update active nav on scroll
  const sections = document.querySelectorAll('section');
  window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop - navHeight - 20;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.dataset.target === current) {
        link.classList.add('active');
      }
    });
  });

  console.log("✅ Landing page tayyor!");
}

// ============================================================
// DASHBOARD/INDEX PAGE - FOYDALANUVCHI MA'LUMOTLARINI KO'RSATISH
// ============================================================
function initDashboard() {
  console.log("🚀 Dashboard init...");

  // Himoya - tizimga kirmaganlarni chiqarib yuborish
  protectPage();

  const currentUser = getCurrentUser();

  if (!currentUser) {
    console.log("❌ Foydalanuvchi topilmadi");
    window.location.href = 'login.html';
    return;
  }

  console.log("✅ Joriy foydalanuvchi:", currentUser);

  // Foydalanuvchi ma'lumotlarini ko'rsatish
  // Bu qismni o'zingizning HTML strukturangizga moslashtiring

  // Misol:
  const profileName = document.getElementById("profileName");
  const profileEmail = document.getElementById("profileEmail");
  const profilePhone = document.getElementById("profilePhone");
  const profileStore = document.getElementById("profileStore");

  if (profileName) profileName.textContent = currentUser.fullName;
  if (profileEmail) profileEmail.textContent = currentUser.email;
  if (profilePhone) profilePhone.textContent = currentUser.phone;
  if (profileStore) profileStore.textContent = currentUser.storeName;

  // Logout tugmasi
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function (e) {
      e.preventDefault();
      logout();
    });
  }

  console.log("✅ Dashboard tayyor!");
}

// ============================================================
// MAIN INITIALIZATION
// ============================================================
document.addEventListener("DOMContentLoaded", function () {
  console.log("🎬 DOMContentLoaded - Sahifa yuklandi!");

  const currentPage = window.location.pathname;
  console.log("📄 Joriy sahifa:", currentPage);

  // Signup sahifa
  if (currentPage.includes('signup')) {
    console.log("➡️ Signup sahifa");
    initSignupForm();
  }
  // Login sahifa
  else if (currentPage.includes('login')) {
    console.log("➡️ Login sahifa");
    initLoginForm();
  }
  // Landing sahifa
  else if (currentPage.includes('landing')) {
    console.log("➡️ Landing sahifa");
    initLandingPage();
  }
  // Dashboard/Index sahifa
  else if (currentPage.includes('index')) {
    console.log("➡️ Dashboard sahifa");
    initDashboard();
  }
  // Boshqa sahifalar uchun navbar tekshiruvi
  else {
    const navbar = document.getElementById('navbar');
    if (navbar) {
      console.log("➡️ Landing page");
      initLandingPage();
    } else {
      console.log("➡️ Boshqa sahifa");
      // Boshqa sahifalarda ham himoya
      protectPage();
    }
  }

  console.log("✅✅✅ Barcha initlar bajarildi!");
});

// Global funksiyalar - HTML dan chaqirish uchun
window.logout = logout;
window.getCurrentUser = getCurrentUser;
window.updateCurrentUser = updateCurrentUser;

console.log("📜 Authentication System to'liq yuklandi!");