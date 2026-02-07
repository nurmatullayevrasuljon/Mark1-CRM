
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
// 🔐 PROFESSIONAL UNIFIED AUTH SYSTEM (FINAL FIX)
// ============================================================

const AuthSystem = (function () {
    'use strict';

    // ============================
    // 🔹 STORAGE KEYS
    // ============================
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
        } catch (error) {
            console.error('❌ Userlarni olishda xato:', error);
            return [];
        }
    }

    function saveAllUsers(users) {
        try {
            localStorage.setItem(USERS_KEY, JSON.stringify(users));
        } catch (error) {
            console.error('❌ Userlarni saqlashda xato:', error);
        }
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

        // ============================================================
        // 📝 RO'YXATDAN O'TKAZISH
        // ============================================================
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

            // ✅ Ro'yxatdan o'tgandan keyin AVTOMATIK LOGIN
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
            localStorage.setItem(SESSION_KEY, "true");

            console.log('✅ Ro\'yxatdan o\'tdi va tizimga kirdi:', newUser.email);
            return { success: true, user: newUser };
        },

        // ============================================================
        // 🔐 LOGIN
        // ============================================================
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

        // ============================================================
        // 👤 HOZIRGI USERNI OLISH
        // ============================================================
        getCurrentUser: function () {
            try {
                const sessionActive = localStorage.getItem(SESSION_KEY);
                if (sessionActive !== "true") {
                    return null;
                }

                const userData = localStorage.getItem(CURRENT_USER_KEY);
                if (!userData) {
                    return null;
                }

                const user = JSON.parse(userData);
                const allUsers = getAllUsers();
                const latestUser = allUsers.find(u => u.userId === user.userId);
                
                if (latestUser) {
                    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(latestUser));
                    return latestUser;
                }
                
                return user;
            } catch (error) {
                console.error('❌ User ma\'lumotlarini olishda xato:', error);
                return null;
            }
        },

        // ============================================================
        // 💾 MA'LUMOTLARNI YANGILASH
        // ============================================================
        updateCurrentUserData: function (updates) {
            const currentUser = this.getCurrentUser();
            if (!currentUser) {
                console.error('❌ Joriy foydalanuvchi topilmadi');
                return false;
            }

            try {
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

                const allUsers = getAllUsers();
                const index = allUsers.findIndex(u => u.userId === currentUser.userId);

                if (index !== -1) {
                    allUsers[index] = updatedUser;
                    saveAllUsers(allUsers);
                } else {
                    console.error('❌ User global bazada topilmadi');
                    return false;
                }

                localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
                console.log('✅ Ma\'lumotlar yangilandi');

                return true;
            } catch (error) {
                console.error('❌ Ma\'lumotlarni yangilashda xato:', error);
                return false;
            }
        },

        // ============================================================
        // ✅ SESSIYA TEKSHIRISH
        // ============================================================
        isSessionValid: function () {
            const sessionActive = localStorage.getItem(SESSION_KEY) === "true";
            const currentUser = localStorage.getItem(CURRENT_USER_KEY);
            return sessionActive && currentUser !== null;
        },

        // ============================================================
        // 🚪 LOGOUT
        // ============================================================
        logout: function () {
            const user = this.getCurrentUser();
            if (user) {
                console.log('👋 Tizimdan chiqdi:', user.email);
            }
            
            localStorage.removeItem(CURRENT_USER_KEY);
            localStorage.removeItem(SESSION_KEY);
            
            if (!window.location.pathname.toLowerCase().includes('login.html')) {
                window.location.href = "login.html";
            }
        },

        // ============================================================
        // 🛡️ SAHIFANI HIMOYA QILISH (FINAL VERSION)
        // ============================================================
        protectPage: function () {
            const currentPath = window.location.pathname.toLowerCase();
            const currentPage = currentPath.split('/').pop() || 'index.html';
            
            const isSignup = currentPage === 'signup.html';
            const isLogin = currentPage === 'login.html';
            const isWelcome = currentPage === 'w-page.html' || currentPage === '';
            const hasSession = this.isSessionValid();

            // ============================================================
            // SIGNUP.HTML - RO'YXATDAN O'TISH
            // ============================================================
            if (isSignup) {
                // Agar allaqachon tizimga kirgan bo'lsa
                if (hasSession) {
                    console.log('✅ Session bor - Dashboard ga');
                    window.location.replace('index.html');
                    return false;
                }
                // Session yo'q - signup sahifasida qolishi mumkin
                console.log('✅ Signup sahifa - Ro\'yxatdan o\'tish mumkin');
                return true;
            }

            // ============================================================
            // LOGIN.HTML - KIRISH
            // ============================================================
            if (isLogin) {
                // Agar allaqachon tizimga kirgan bo'lsa
                if (hasSession) {
                    console.log('✅ Session bor - Dashboard ga');
                    window.location.replace('index.html');
                    return false;
                }
                // Session yo'q - login sahifasida qolishi mumkin
                console.log('✅ Login sahifa - Kirish mumkin');
                return true;
            }

            // ============================================================
            // WELCOME PAGE (W-PAGE.HTML)
            // ============================================================
            if (isWelcome) {
                console.log('✅ Welcome sahifa');
                return true;
            }

            // ============================================================
            // BOSHQA BARCHA SAHIFALAR (INDEX.HTML va boshqalar)
            // ============================================================
            if (!hasSession) {
                console.log('⚠️ Session yo\'q - Login ga yo\'naltirish');
                window.location.replace('login.html');
                return false;
            }

            console.log('✅ Session aktiv - Sahifa ochiq');
            return true;
        },

        // ============================================================
        // 🔄 SINXRONLASH
        // ============================================================
        syncUserData: function () {
            const currentUser = localStorage.getItem(CURRENT_USER_KEY);
            if (!currentUser) return;

            try {
                const user = JSON.parse(currentUser);
                const allUsers = getAllUsers();
                const latestUser = allUsers.find(u => u.userId === user.userId);

                if (latestUser) {
                    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(latestUser));
                }
            } catch (error) {
                console.error('❌ Sinxronlashda xato:', error);
            }
        }
    };
})();

// ============================================================
// 🚀 AVTOMATIK ISHGA TUSHIRISH
// ============================================================
(function initAuth() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            AuthSystem.protectPage();
        });
    } else {
        AuthSystem.protectPage();
    }

    const currentPage = window.location.pathname.toLowerCase();
    const isPublicPage = ["signup.html", "login.html", "w-page.html"].some(page => 
        currentPage.includes(page)
    );
    
    if (!isPublicPage) {
        setInterval(function() {
            AuthSystem.syncUserData();
        }, 30000);
    }

    console.log("✅ AUTH SYSTEM TAYYOR");
})();