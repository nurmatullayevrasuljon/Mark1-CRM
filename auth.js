// ============================================================
// 🔐 PROFESSIONAL UNIFIED AUTH SYSTEM (FINAL FIXED)
// ============================================================

const AuthSystem = (function () {
    'use strict';

    const USERS_KEY = 'crm_all_users';
    const CURRENT_USER_KEY = 'crm_current_user';
    const SESSION_KEY = 'crm_session_active';

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

            // ✅ AVTOMATIK LOGIN
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
            localStorage.setItem(SESSION_KEY, "true");

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

            return { success: true, user };
        },

        // ✅ FIXED - Eng yangi ma'lumotni qaytaradi
        getCurrentUser: function () {
            try {
                if (localStorage.getItem(SESSION_KEY) !== "true") {
                    return null;
                }

                const userData = localStorage.getItem(CURRENT_USER_KEY);
                if (!userData) return null;

                const user = JSON.parse(userData);
                
                // Global bazadan eng yangi ma'lumotni olish
                const allUsers = getAllUsers();
                const latestUser = allUsers.find(u => u.userId === user.userId);
                
                if (latestUser) {
                    // Current user ni yangilash
                    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(latestUser));
                    return latestUser;
                }
                
                return user;
            } catch {
                return null;
            }
        },

        // ✅ FIXED - Birinchi global baza, keyin current user
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

            // 1. Global bazani yangilash
            const allUsers = getAllUsers();
            const index = allUsers.findIndex(u => u.userId === currentUser.userId);

            if (index !== -1) {
                allUsers[index] = updatedUser;
                saveAllUsers(allUsers);
            }

            // 2. Current user ni yangilash
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));

            return true;
        },

        isSessionValid: function () {
            return (
                localStorage.getItem(SESSION_KEY) === "true" &&
                this.getCurrentUser() !== null
            );
        },

        logout: function () {
            localStorage.removeItem(CURRENT_USER_KEY);
            localStorage.removeItem(SESSION_KEY);
            window.location.href = "login.html";
        },

        // ✅ FIXED - Infinite loop yo'q
        protectPage: function () {
            const path = window.location.pathname.toLowerCase();
            const page = path.split('/').pop() || 'index.html';
            
            const isSignup = page === 'signup.html';
            const isLogin = page === 'login.html';
            const isLanding = page === 'landing.html' || page === 'w-page.html';
            const hasSession = this.isSessionValid();

            // Signup sahifa
            if (isSignup) {
                if (hasSession) {
                    window.location.replace('index.html');
                    return false;
                }
                return true;
            }

            // Login sahifa
            if (isLogin) {
                if (hasSession) {
                    window.location.replace('index.html');
                    return false;
                }
                return true;
            }

            // Landing/Welcome
            if (isLanding) {
                return true;
            }

            // Boshqa sahifalar - himoyalangan
            if (!hasSession) {
                window.location.replace('login.html');
                return false;
            }

            return true;
        }
    };
})();

// ✅ AUTO INIT - FAQAT 1 MARTA
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        AuthSystem.protectPage();
    });
} else {
    AuthSystem.protectPage();
}

console.log("🔥 AUTH SYSTEM TAYYOR");