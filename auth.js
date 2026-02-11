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
//             const publicPages = ["signup.html", "login.html", "landing.html"];

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
// 🔐 PROFESSIONAL MULTI-USER AUTH SYSTEM (PRODUCTION)
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
            return true;
        } catch (error) {
            console.error('❌ Userlarni saqlashda xato:', error);
            return false;
        }
    }

    function hashPassword(password) {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            hash = (hash << 5) - hash + password.charCodeAt(i);
            hash |= 0;
        }
        return Math.abs(hash).toString(36);
    }

    function generateUserId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).slice(2, 11);
    }

    // Default user structure
    function createDefaultUserStructure(userData) {
        return {
            userId: generateUserId(),
            fullName: userData.fullName,
            email: userData.email,
            phone: userData.phone,
            storeName: userData.storeName,
            password: hashPassword(userData.password),
            role: userData.role || "Boshqaruv",
            createdAt: new Date().toISOString(),

            // ✅ HAR BIR USER O'Z MA'LUMOTLARIGA EGA
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
    }

    // ============================
    // 🔹 PUBLIC API
    // ============================
    return {

        // ============================================================
        // 📝 REGISTER - RO'YXATDAN O'TKAZISH
        // ============================================================
        register: function (userData) {
            console.log('📝 Ro\'yxatdan o\'tish jarayoni boshlandi:', userData.email);

            const allUsers = getAllUsers();

            // ✅ EMAIL ORQALI TEKSHIRISH
            const existingUser = allUsers.find(u => u.email === userData.email);

            if (existingUser) {
                console.log('⚠️ Bu email allaqachon mavjud:', userData.email);
                return { 
                    success: false, 
                    message: "Bu email allaqachon ro'yxatdan o'tgan!\n\nIltimos, tizimga kiring.",
                    redirectToLogin: true
                };
            }

            // ✅ YANGI USER YARATISH
            const newUser = createDefaultUserStructure(userData);

            allUsers.push(newUser);
            
            if (!saveAllUsers(allUsers)) {
                return {
                    success: false,
                    message: "Saqlashda xatolik yuz berdi. Qayta urinib ko'ring."
                };
            }

            console.log('✅ Yangi foydalanuvchi ro\'yxatdan o\'tdi:', newUser.email);
            console.log('📊 Jami foydalanuvchilar:', allUsers.length);

            return { 
                success: true, 
                user: newUser 
            };
        },

        // ============================================================
        // 🔐 LOGIN - TIZIMGA KIRISH
        // ============================================================
        login: function (emailOrPhone, password) {
            console.log('🔐 Login jarayoni boshlandi:', emailOrPhone);

            const allUsers = getAllUsers();
            const hashedPassword = hashPassword(password);

            // ✅ EMAIL YOKI TELEFON ORQALI TOPISH
            const user = allUsers.find(u => {
                const emailMatch = u.email === emailOrPhone;
                const phoneMatch = u.phone === emailOrPhone;
                const passwordMatch = u.password === hashedPassword;

                return (emailMatch || phoneMatch) && passwordMatch;
            });

            if (!user) {
                console.log('❌ Login xato - foydalanuvchi topilmadi');
                return { 
                    success: false, 
                    message: "Email/Telefon yoki parol noto'g'ri!" 
                };
            }

            // ✅ SESSION O'RNATISH
            this.setSession(user);

            console.log('✅ Muvaffaqiyatli tizimga kirdi:', user.email);
            console.log('📊 User ma\'lumotlari yuklandi');

            return { 
                success: true, 
                user: user 
            };
        },

        // ============================================================
        // 💾 SESSION O'RNATISH (INTERNAL)
        // ============================================================
        setSession: function(user) {
            try {
                // Session boshlanish vaqtini saqlash
                const sessionData = {
                    ...user,
                    sessionStarted: new Date().toISOString()
                };

                localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionData));
                localStorage.setItem(SESSION_KEY, "true");

                // ✅ Backward compatibility (eski kodlar uchun)
                localStorage.setItem('currentUser', JSON.stringify(sessionData));
                localStorage.setItem('isLoggedIn', 'true');

                console.log('✅ Session o\'rnatildi:', user.email);
                return true;
            } catch (error) {
                console.error('❌ Session o\'rnatishda xato:', error);
                return false;
            }
        },

        // ============================================================
        // 👤 JORIY USERNI OLISH
        // ============================================================
        getCurrentUser: function () {
            try {
                const userData = localStorage.getItem(CURRENT_USER_KEY);
                
                if (!userData) {
                    console.log('⚠️ Joriy user topilmadi');
                    return null;
                }

                const user = JSON.parse(userData);
                console.log('✅ Joriy user:', user.email);
                return user;
            } catch (error) {
                console.error('❌ Userni olishda xato:', error);
                return null;
            }
        },

        // ============================================================
        // 💾 USER MA'LUMOTLARINI YANGILASH (CRITICAL FUNCTION)
        // ============================================================
        updateCurrentUserData: function (updates) {
            console.log('💾 User ma\'lumotlarini yangilash:', Object.keys(updates));

            const currentUser = this.getCurrentUser();
            
            if (!currentUser) {
                console.error('❌ Joriy user topilmadi - yangilab bo\'lmadi');
                return false;
            }

            // ✅ DEEP MERGE - har bir field to'g'ri yangilanadi
            const updatedUser = { ...currentUser };

            Object.keys(updates).forEach(key => {
                if (Array.isArray(updates[key])) {
                    // Array bo'lsa - to'liq almashtirish
                    updatedUser[key] = [...updates[key]];
                } else if (typeof updates[key] === 'object' && updates[key] !== null) {
                    // Object bo'lsa - merge
                    updatedUser[key] = {
                        ...(updatedUser[key] || {}),
                        ...updates[key]
                    };
                } else {
                    // Primitive value
                    updatedUser[key] = updates[key];
                }
            });

            // ✅ 1. CURRENT SESSION NI YANGILASH
            if (!this.setSession(updatedUser)) {
                console.error('❌ Session yangilashda xato');
                return false;
            }

            // ✅ 2. GLOBAL USERS BAZASINI YANGILASH
            const allUsers = getAllUsers();
            const userIndex = allUsers.findIndex(u => u.userId === currentUser.userId);

            if (userIndex === -1) {
                console.error('❌ User global bazada topilmadi');
                return false;
            }

            allUsers[userIndex] = updatedUser;
            
            if (!saveAllUsers(allUsers)) {
                console.error('❌ Global bazani saqlashda xato');
                return false;
            }

            console.log('✅ User ma\'lumotlari muvaffaqiyatli yangilandi');
            console.log('📊 Yangilangan fieldlar:', Object.keys(updates).join(', '));

            return true;
        },

        // ============================================================
        // ✅ SESSION TEKSHIRISH
        // ============================================================
        isSessionValid: function () {
            const hasSession = localStorage.getItem(SESSION_KEY) === "true";
            const hasUser = this.getCurrentUser() !== null;
            
            const isValid = hasSession && hasUser;
            
            if (!isValid) {
                console.log('⚠️ Session yaroqsiz - login talab qilinadi');
            }
            
            return isValid;
        },

        // ============================================================
        // 🚪 LOGOUT - TIZIMDAN CHIQISH
        // ============================================================
        logout: function () {
            const user = this.getCurrentUser();
            
            if (user) {
                console.log('👋 Tizimdan chiqish:', user.email);
            }

            // ✅ BARCHA SESSION MA'LUMOTLARINI TOZALASH
            localStorage.removeItem(CURRENT_USER_KEY);
            localStorage.removeItem(SESSION_KEY);
            
            // Backward compatibility
            localStorage.removeItem('currentUser');
            localStorage.removeItem('isLoggedIn');

            console.log('✅ Session tozalandi');
            
            // Login sahifasiga yo'naltirish
            window.location.href = 'login.html';
        },

        // ============================================================
        // 🛡️ SAHIFANI HIMOYA QILISH
        // ============================================================
        protectPage: function () {
            const currentPath = window.location.pathname.toLowerCase();
            
            // Public sahifalar (login talab qilinmaydi)
            const publicPages = ['signup.html', 'login.html', 'landing.html'];
            
            const isPublicPage = publicPages.some(page => currentPath.includes(page));

            // Agar public sahifa bo'lsa - tekshirishni o'tkazib yuborish
            if (isPublicPage) {
                console.log('✅ Public sahifa - himoya kerak emas');
                return true;
            }

            // Private sahifalar uchun session tekshirish
            if (!this.isSessionValid()) {
                console.log('🚫 Ruxsatsiz kirish - login sahifasiga yo\'naltirish');
                window.location.href = 'login.html';
                return false;
            }

            console.log('✅ Session yaroqli - sahifa himoyalangan');
            return true;
        },

        // ============================================================
        // 📊 DEBUG - SISTEMA HOLATINI KO'RISH
        // ============================================================
        getSystemStatus: function() {
            const allUsers = getAllUsers();
            const currentUser = this.getCurrentUser();
            const hasSession = this.isSessionValid();

            return {
                totalUsers: allUsers.length,
                currentUser: currentUser ? currentUser.email : 'none',
                isLoggedIn: hasSession,
                allEmails: allUsers.map(u => u.email)
            };
        }
    };
})();

// ============================================================
// 🎯 GLOBAL INITIALIZATION
// ============================================================
(function() {
    console.log('🔥 AUTH SYSTEM INITIALIZED');
    console.log('📊 System Status:', AuthSystem.getSystemStatus());
})();

// ============================================================
// 🌐 GLOBAL EXPORTS
// ============================================================
window.AuthSystem = AuthSystem;

console.log('✅ Auth System to\'liq yuklandi (Production Ready)');