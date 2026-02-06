// ============================================================
// 🔐 AUTH CHECK - HAR SAHIFADA
// ============================================================
(function() {
  const currentPage = window.location.pathname.toLowerCase();
  const publicPages = ['signup.html', 'login.html', 'index.html'];
  
  const isPublicPage = publicPages.some(page => currentPage.includes(page));
  
  if (!isPublicPage && !AuthSystem.isSessionValid()) {
    window.location.href = 'login.html';
    return;
  }
})();

// ============================================================
// 📦 USER DATA LOADING
// ============================================================
function loadUserData() {
  const userData = AuthSystem.getCurrentUser();
  if (!userData) {
    AuthSystem.logout();
    return;
  }

  // Ma'lumotlarni yuklash
  products = userData.products || [];
  categories = userData.categories || ['Electronics'];
  sales = userData.sales || [];
  debtors = userData.debtors || [];
  paidDebtors = userData.paidDebtors || [];
  smsHistory = userData.smsHistory || [];
  
  console.log('✅ User data loaded:', userData.email);
}

// ============================================================
// 💾 SAVE FUNCTIONS - UPDATED
// ============================================================
function saveProducts() {
  AuthSystem.updateCurrentUserData({ products });
}

function saveCategories() {
  AuthSystem.updateCurrentUserData({ categories });
}

function saveSales() {
  AuthSystem.updateCurrentUserData({ sales });
}

function saveDebtors() {
  AuthSystem.updateCurrentUserData({ debtors, paidDebtors });
}

function saveSmsHistory() {
  AuthSystem.updateCurrentUserData({ smsHistory });
}

// ============================================================
// 🎯 INITIALIZATION
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
  console.log('🎬 Dashboard initializing...');
  
  // 1. Ma'lumotlarni yuklash
  loadUserData();
  
  // 2. Boshqa barcha funksiyalar...
  // (Sizning eski kodingiz)
});

// KEYIN SIZNING BARCHA ESKI KODINGIZ...


// Welcome text animation
const items = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  },
  { threshold: 0.15 }
);

items.forEach(el => observer.observe(el));

/* ===============================================
   BUGUNGI DAROMAD COUNTER (dailySales ichida)
=============================================== */
function updateDailySalesPageCounter() {
  const counterEl = document.getElementById("dailySalesPageCounter");
  const changeEl = document.getElementById("dailySalesPageChange");

  if (!counterEl || !changeEl) return;

  const today = getToday();
  const todayTotal = calculateTodayRevenue(today);
  const yesterdayTotal = Number(localStorage.getItem("yesterdaySalesTotal")) || 0;

  const lastShown = Number(counterEl.dataset.lastValue || 0);

  // Counter animatsiya
  if (todayTotal !== lastShown) {
    animateCounter(counterEl, lastShown, todayTotal);
    counterEl.dataset.lastValue = todayTotal;
  } else {
    counterEl.innerText = todayTotal.toLocaleString();
  }

  // Animatsiya tugagandan keyin UZS qo'shish
  setTimeout(() => {
    counterEl.innerHTML = `${todayTotal.toLocaleString()} <small style="font-size:0.6em;color:#94a3b8;font-weight:400;margin-left:4px">UZS</small>`;
  }, 1200);
  
  // REAL FOIZ HISOBLASH
  if (todayTotal === 0 && yesterdayTotal === 0) {
    changeEl.innerText = "Bugun savdo yo'q";
    changeEl.className = "counter-change text-muted";
  }
  else if (yesterdayTotal === 0 && todayTotal > 0) {
    changeEl.innerText = "▲ Yangi savdolar boshlandi";
    changeEl.className = "counter-change text-success";
  }
  else if (todayTotal === 0 && yesterdayTotal > 0) {
    changeEl.innerText = "▼ 100% kamaydi (kechaga nisbatan)";
    changeEl.className = "counter-change text-danger";
  }
  else {
    const percent = ((todayTotal - yesterdayTotal) / yesterdayTotal) * 100;

    if (percent > 0) {
      changeEl.innerText = `▲ ${percent.toFixed(1)}% kechaga nisbatan`;
      changeEl.className = "counter-change text-success";
    } else if (percent < 0) {
      changeEl.innerText = `▼ ${Math.abs(percent).toFixed(1)}% kechaga nisbatan`;
      changeEl.className = "counter-change text-danger";
    } else {
      changeEl.innerText = "Kecha bilan teng";
      changeEl.className = "counter-change text-muted";
    }
  }
}

// Dashboard'dagi umumiy qarzdorlik counterini yangilash (SUM + COUNT)
function updateTotalDebtCounter() {
  const counterEl = document.querySelector('.counter[data-key="totalDebt"]');
  const countEl = document.querySelector('.debt-count-badge');

  if (!counterEl) return;

  // Barcha qarzdorlarning umumiy qarzini hisoblash
  const totalDebt = debtors.reduce((sum, d) => sum + d.amount, 0);
  const debtorCount = debtors.length;
  const lastShown = Number(counterEl.dataset.lastValue || 0);

  // Counter animatsiya
  if (totalDebt !== lastShown) {
    let current = lastShown;
    const step = Math.ceil(Math.abs(totalDebt - lastShown) / 60);

    const interval = setInterval(() => {
      if (totalDebt > lastShown) {
        current += step;
        if (current >= totalDebt) {
          counterEl.innerHTML = `${totalDebt.toLocaleString()} <small style="font-size:0.55em;color:#94a3b8;font-weight:400;margin-left:4px">UZS</small>`;
          clearInterval(interval);
        } else {
          counterEl.innerHTML = `${Math.floor(current).toLocaleString()} <small style="font-size:0.55em;color:#94a3b8;font-weight:400;margin-left:4px">UZS</small>`;
        }
      } else {
        current -= step;
        if (current <= totalDebt) {
          counterEl.innerHTML = `${totalDebt.toLocaleString()} <small style="font-size:0.55em;color:#94a3b8;font-weight:400;margin-left:4px">UZS</small>`;
          clearInterval(interval);
        } else {
          counterEl.innerHTML = `${Math.floor(current).toLocaleString()} <small style="font-size:0.55em;color:#94a3b8;font-weight:400;margin-left:4px">UZS</small>`;
        }
      }
    }, 20);

    counterEl.dataset.lastValue = totalDebt;
  } else {
    counterEl.innerHTML = `${totalDebt.toLocaleString()} <small style="font-size:0.55em;color:#94a3b8;font-weight:400;margin-left:4px">UZS</small>`;
  }

  // Qarzdorlar sonini ko'rsatish
  if (countEl) {
    countEl.textContent = `${debtorCount} ta qarzdordan`;
  }
}

/* ===============================================
   NAVIGATION (Active sahifa saqlanadi)
=============================================== */
const navItems = document.querySelectorAll(".nav-item");
const sections = document.querySelectorAll(".section");
const pageTitle = document.getElementById("pageTitle");

function openPage(pageId, titleText) {
  navItems.forEach(n => n.classList.remove("active"));
  document.querySelector(`.nav-item[data-target="${pageId}"]`)?.classList.add("active");

  sections.forEach(s => s.classList.remove("active"));
  document.getElementById(pageId)?.classList.add("active");

  pageTitle.innerText = titleText;

  localStorage.setItem("activePage", pageId);
  localStorage.setItem("activePageTitle", titleText);
}

navItems.forEach(item => {
  item.addEventListener("click", () => {
    openPage(item.dataset.target, item.innerText.trim());
  });
});

/* ===============================================
   SANA VA VAQT
=============================================== */
function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function getYesterday() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

function getCurrentTimestamp() {
  return new Date().getTime();
}

function isToday(dateStr) {
  const d = new Date(dateStr);
  const t = new Date();
  return (
    d.getDate() === t.getDate() &&
    d.getMonth() === t.getMonth() &&
    d.getFullYear() === t.getFullYear()
  );
}

/* ===============================================
   STORAGE
=============================================== */
let products = JSON.parse(localStorage.getItem("products")) || [];
let categories = JSON.parse(localStorage.getItem("categories")) || ["Electronics"];
let sales = JSON.parse(localStorage.getItem("sales")) || [];
let debtors = JSON.parse(localStorage.getItem("crmDebtors")) || [];
let paidDebtors = JSON.parse(localStorage.getItem("crmPaidDebtors")) || [];
let smsHistory = JSON.parse(localStorage.getItem("smsHistory")) || [];
let editingId = null;
let currentFilter = 'all';
let currentSmsDebtorId = null;
let transactionFilter = "daily";
let transactionSearchQuery = "";

// Chart instances
let chartInstances = {
  weekly: null,
  daily: null
};

function saveProducts() {
  localStorage.setItem("products", JSON.stringify(products));
}

function saveCategories() {
  localStorage.setItem("categories", JSON.stringify(categories));
}

function saveSales() {
  localStorage.setItem("sales", JSON.stringify(sales));
}

function saveDebtors() {
  localStorage.setItem('crmDebtors', JSON.stringify(debtors));
  localStorage.setItem('crmPaidDebtors', JSON.stringify(paidDebtors));
}

function saveSmsHistory() {
  localStorage.setItem('smsHistory', JSON.stringify(smsHistory));
}

/* ===============================================
   COUNTER ANIMATION
=============================================== */
function animateCounter(element, fromValue, toValue) {
  let current = fromValue;
  const step = Math.ceil(Math.abs(toValue - fromValue) / 60);

  const interval = setInterval(() => {
    if (toValue > fromValue) {
      current += step;
      if (current >= toValue) {
        element.innerText = toValue.toLocaleString();
        clearInterval(interval);
      } else {
        element.innerText = Math.floor(current).toLocaleString();
      }
    } else {
      current -= step;
      if (current <= toValue) {
        element.innerText = toValue.toLocaleString();
        clearInterval(interval);
      } else {
        element.innerText = Math.floor(current).toLocaleString();
      }
    }
  }, 20);
}

/* ===============================================
   KUN O'ZGARISHINI TEKSHIRISH (00:00 da reset)
=============================================== */
function checkAndResetDailyIfNeeded() {
  const savedDate = localStorage.getItem("currentSalesDate");
  const today = getToday();

  if (savedDate !== today) {
    const todayTotal = calculateTodayRevenue(savedDate || getYesterday());
    localStorage.setItem("yesterdaySalesTotal", todayTotal);
    localStorage.setItem("currentSalesDate", today);

    const oldSales = sales.filter(s => s.date.slice(0, 10) !== today);
    console.log(`Kun o'zgardi! Kechagi savdo: ${todayTotal} UZS`);
    console.log(`${oldSales.length} ta eski sotuv o'chirildi`);

    return true;
  }

  return false;
}

/* ===============================================
   KUNLIK SAVDO HISOBLASH (FAQAT BUGUN)
=============================================== */
function calculateTodayRevenue(date = getToday()) {
  return sales
    .filter(s => s.status === "sold" && s.date.slice(0, 10) === date)
    .reduce((sum, s) => sum + Number(s.total), 0);
}

/* ===============================================
   OYLIK DAROMAD HISOBLASH
=============================================== */
function getFirstSaleDate() {
  if (sales.length === 0) return null;

  const sortedSales = [...sales].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return sortedSales[0].date.slice(0, 10);
}

function calculateMonthlyRevenue(date = getToday()) {
  const [year, month] = date.split('-');

  return sales
    .filter(s => {
      if (s.status !== "sold") return false;
      const [sYear, sMonth] = s.date.slice(0, 10).split('-');
      return sYear === year && sMonth === month;
    })
    .reduce((sum, s) => sum + Number(s.total), 0);
}

function getPreviousMonthRevenue() {
  const today = new Date();
  today.setMonth(today.getMonth() - 1);
  const prevMonth = today.toISOString().slice(0, 10);

  return calculateMonthlyRevenue(prevMonth);
}

/* ===============================================
   OYLIK DAROMAD COUNTER (UZS ni saqlab qolish - FIXED)
=============================================== */
function updateMonthlyRevenueUI() {
  const counterEl = document.querySelector('.counter[data-key="totalRevenue"]');
  const changeEl = document.getElementById("monthlyRevenueChange");

  if (!counterEl) return;

  const firstSaleDate = getFirstSaleDate();

  if (!firstSaleDate) {
    counterEl.innerHTML = `0 <small style="font-size:0.55em;color:#94a3b8;font-weight:400;margin-left:4px">UZS</small>`;
    counterEl.dataset.lastValue = 0;

    if (changeEl) {
      changeEl.innerText = "Hali sotuv boshlanmagan";
      changeEl.className = "counter-change text-muted";
    }
    return;
  }

  const firstDate = new Date(firstSaleDate);
  const today = new Date();

  const monthsDiff = (today.getFullYear() - firstDate.getFullYear()) * 12 +
    (today.getMonth() - firstDate.getMonth());

  const currentMonth = calculateMonthlyRevenue();
  const lastShown = Number(counterEl.dataset.lastValue || 0);

  if (currentMonth !== lastShown) {
    let current = lastShown;
    const step = Math.ceil(Math.abs(currentMonth - lastShown) / 60);

    const interval = setInterval(() => {
      if (currentMonth > lastShown) {
        current += step;
        if (current >= currentMonth) {
          counterEl.innerHTML = `${currentMonth.toLocaleString()} <small style="font-size:0.55em;color:#94a3b8;font-weight:400;margin-left:4px">UZS</small>`;
          clearInterval(interval);
        } else {
          counterEl.innerHTML = `${Math.floor(current).toLocaleString()} <small style="font-size:0.55em;color:#94a3b8;font-weight:400;margin-left:4px">UZS</small>`;
        }
      } else {
        current -= step;
        if (current <= currentMonth) {
          counterEl.innerHTML = `${currentMonth.toLocaleString()} <small style="font-size:0.55em;color:#94a3b8;font-weight:400;margin-left:4px">UZS</small>`;
          clearInterval(interval);
        } else {
          counterEl.innerHTML = `${Math.floor(current).toLocaleString()} <small style="font-size:0.55em;color:#94a3b8;font-weight:400;margin-left:4px">UZS</small>`;
        }
      }
    }, 20);

    counterEl.dataset.lastValue = currentMonth;
  } else {
    counterEl.innerHTML = `${currentMonth.toLocaleString()} <small style="font-size:0.55em;color:#94a3b8;font-weight:400;margin-left:4px">UZS</small>`;
  }

  if (changeEl) {
    if (monthsDiff === 0) {
      changeEl.innerText = "📊 Birinchi oy (0%)";
      changeEl.className = "counter-change text-info";
    }
    else {
      const previousMonth = getPreviousMonthRevenue();

      if (previousMonth === 0 && currentMonth > 0) {
        changeEl.innerText = "▲ Yangi oylik savdo boshlandi";
        changeEl.className = "counter-change text-success";
      }
      else if (previousMonth === 0) {
        changeEl.innerText = "O'tgan oy savdo bo'lmagan";
        changeEl.className = "counter-change text-muted";
      }
      else {
        const percent = ((currentMonth - previousMonth) / previousMonth) * 100;

        if (percent > 0) {
          changeEl.innerText = `▲ ${percent.toFixed(1)}% o'tgan oyga nisbatan`;
          changeEl.className = "counter-change text-success";
        }
        else if (percent < 0) {
          changeEl.innerText = `▼ ${Math.abs(percent).toFixed(1)}% o'tgan oyga nisbatan`;
          changeEl.className = "counter-change text-danger";
        }
        else {
          changeEl.innerText = "O'tgan oy bilan teng (0%)";
          changeEl.className = "counter-change text-muted";
        }
      }
    }
  }
}

/* ===============================================
   HAFTALIK DAROMAD (Oxirgi 7 kun)
=============================================== */
function calculateWeeklyRevenue() {
  const weekData = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().slice(0, 10);

    const dayRevenue = sales
      .filter(s => s.status === "sold" && s.date.slice(0, 10) === dateStr)
      .reduce((sum, s) => sum + Number(s.total), 0);

    weekData.push(dayRevenue);
  }

  return weekData;
}

/* ===============================================
   BUGUNGI DAROMAD COUNTER (Real animation)
=============================================== */
function updateDailySalesCounter() {
  const counterEl = document.getElementById("dailySalesCounter");
  const changeEl = document.getElementById("dailySalesChange");

  if (!counterEl || !changeEl) return;

  const dayChanged = checkAndResetDailyIfNeeded();

  const today = getToday();
  const todayTotal = calculateTodayRevenue(today);

  const yesterdayTotal = Number(localStorage.getItem("yesterdaySalesTotal")) || 0;

  const lastShown = Number(counterEl.dataset.lastValue || 0);

  if (dayChanged) {
    counterEl.innerHTML = `0 <small style="font-size:0.55em;color:#94a3b8;font-weight:400;margin-left:4px">UZS</small>`;
    counterEl.dataset.lastValue = 0;
    animateCounter(counterEl, 0, todayTotal);
  }
  else if (todayTotal !== lastShown) {
    animateCounter(counterEl, lastShown, todayTotal);
  }
  else {
    counterEl.innerText = todayTotal.toLocaleString();
  }

  counterEl.dataset.lastValue = todayTotal;

  setTimeout(() => {
    counterEl.innerHTML = `${todayTotal.toLocaleString()} <small style="font-size:0.6em;color:#94a3b8;font-weight:400;margin-left:4px">UZS</small>`;
  }, 1200);

  if (todayTotal === 0 && yesterdayTotal === 0) {
    changeEl.innerText = "Bugun savdo yo'q";
    changeEl.className = "counter-change text-muted";
  }
  else if (yesterdayTotal === 0 && todayTotal > 0) {
    changeEl.innerText = "▲ Yangi savdolar boshlandi";
    changeEl.className = "counter-change text-success";
  }
  else if (todayTotal === 0 && yesterdayTotal > 0) {
    changeEl.innerText = "▼ 100% kamaydi (kechaga nisbatan)";
    changeEl.className = "counter-change text-danger";
  }
  else {
    const percent = ((todayTotal - yesterdayTotal) / yesterdayTotal) * 100;

    if (percent > 0) {
      changeEl.innerText = `▲ ${percent.toFixed(1)}% kechaga nisbatan`;
      changeEl.className = "counter-change text-success";
    } else if (percent < 0) {
      changeEl.innerText = `▼ ${Math.abs(percent).toFixed(1)}% kechaga nisbatan`;
      changeEl.className = "counter-change text-danger";
    } else {
      changeEl.innerText = "Kecha bilan teng";
      changeEl.className = "counter-change text-muted";
    }
  }
}

/* ===============================================
   SOTUV HOLATI (7 kunlik real trend)
=============================================== */
function getSalesStatus(product) {
  if (!product) {
    return `<span class="badge badge-secondary">Ma'lumot yo'q</span>`;
  }

  const baseStock = Number(product.initialStock ?? product.stock);

  if (!baseStock || isNaN(baseStock) || baseStock <= 0) {
    return `<span class="badge badge-secondary">Stok noto'g'ri</span>`;
  }

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  let sold = 0;

  sales.forEach(s => {
    if (s.productId === product.id && s.status === "sold") {
      const qty = Number(s.qty);
      const date = new Date(s.date);

      if (!isNaN(qty) && date >= sevenDaysAgo) {
        sold += qty;
      }
    }
  });

  if (sold === 0) {
    return `<span class="badge badge-dark">0% – Sotilmayapti</span>`;
  }

  const percent = Math.round((sold / baseStock) * 100);

  if (percent <= 10) {
    return `<span class="badge badge-danger">${percent}% – Kam sotilgan</span>`;
  }

  if (percent <= 50) {
    return `<span class="badge badge-warning">${percent}% – O'rtacha</span>`;
  }

  return `<span class="badge badge-success">${percent}% – Ko'p sotilgan</span>`;
}

/* ===============================================
   KATEGORIYALAR
=============================================== */
const productCategory = document.getElementById("productCategory");

function renderCategories(selected = null) {
  if (!productCategory) return;

  productCategory.innerHTML = categories
    .map(c => `<option value="${c}">${c}</option>`)
    .join("");

  if (selected) productCategory.value = selected;
}

/* ===============================================
   MAHSULOTLAR - RENDER (data-label bilan)
=============================================== */
const productTable = document.getElementById("productTable");

function renderProducts(list = products) {
  if (!productTable) return;
  productTable.innerHTML = "";

  if (list.length === 0) {
    productTable.innerHTML = `
      <tr>
        <td colspan="7" class="text-center text-muted py-3">
          Mahsulotlar topilmadi
        </td>
      </tr>
    `;
    return;
  }

  list.forEach(p => {
    const stockUI = getStockUI(p);

    productTable.innerHTML += `
      <tr class="${stockUI.color === "danger" ? "table-danger" : ""}">
        <td data-label="Rasm">
          <img src="${p.image}" class="product-img">
        </td>
        <td data-label="Nomi">${p.name}</td>
        <td data-label="Kategoriya">${p.category}</td>
        <td data-label="Narx">${p.price.toLocaleString()} ${p.currency}</td>

        <!-- ZAXIRA DIZAYNI -->
        <td data-label="Zaxira">
          <div class="stock-cell">
            <div class="stock-text">
              ${p.stock} / ${p.initialStock} ${p.unit}
            </div>

            <div class="progress stock-progress">
              <div class="progress-bar bg-${stockUI.color}"
                   style="width:${stockUI.percent}%">
              </div>
            </div>
          </div>
        </td>

        <td data-label="Holat">${getSalesStatus(p)}</td>

        <td data-label="Harakatlar">
          <a href="#" onclick="editProduct(${p.id})">Edit</a>
          <a href="#" class="text-danger ml-2"
             onclick="deleteProduct(${p.id})">Delete</a>
        </td>
      </tr>
    `;
  });
}


// Zaxirani HIsoblash
function getStockUI(product) {
  const initial = Number(product.initialStock) || 0;
  const current = Number(product.stock) || 0;

  const percent = initial > 0
    ? Math.round((current / initial) * 100)
    : 0;

  if (current <= 0) {
    return {
      percent: 0,
      color: "danger"
    };
  }

  if (percent <= 20) {
    return {
      percent,
      color: "warning"
    };
  }

  return {
    percent,
    color: "success"
  };
}

/* ===============================================
   MAHSULOT BOSHQARUVI
=============================================== */
const productForm = document.getElementById("productForm");
const productName = document.getElementById("productName");
const productImage = document.getElementById("productImage");
const productPrice = document.getElementById("productPrice");
const productCurrency = document.getElementById("productCurrency");
const productStock = document.getElementById("productStock");
const productUnit = document.getElementById("productUnit");
const openProductModal = document.getElementById("openProductModal");

function imageToBase64(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

if (openProductModal) {
  openProductModal.addEventListener("click", () => {
    editingId = null;
    productForm.reset();
    renderCategories();
    productUnit.value = "ta";
    productStock.value = "";
    $("#productModal").modal("show");
  });
}

if (productForm) {
  productForm.addEventListener("submit", async e => {
    e.preventDefault();

    let image = "";
    if (productImage.files[0]) {
      image = await imageToBase64(productImage.files[0]);
    } else if (editingId) {
      image = products.find(p => p.id === editingId)?.image || "";
    }

    const stockValue = Number(productStock.value);
    const costPriceValue = Number(document.getElementById("productCostPrice").value);
    const salePriceValue = Number(productPrice.value);

    const data = {
      id: editingId || Date.now(),
      name: productName.value.trim(),
      category: productCategory.value,
      costPrice: costPriceValue,
      price: salePriceValue,
      currency: productCurrency.value,
      stock: stockValue,
      initialStock: editingId ? products.find(p => p.id === editingId)?.initialStock || stockValue : stockValue,
      unit: productUnit.value,
      image
    };

    if (editingId) {
      const i = products.findIndex(p => p.id === editingId);
      products[i] = data;
      editingId = null;
    } else {
      products.push(data);
    }

    saveProducts();
    renderProducts();
    renderSaleProducts();
    updateProfitUI();
    $("#productModal").modal("hide");
    productForm.reset();
  });
}

function editProduct(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;

  editingId = id;
  productName.value = p.name;
  document.getElementById("productCostPrice").value = p.costPrice || 0;
  productPrice.value = p.price;
  productCurrency.value = p.currency;
  productStock.value = p.stock;
  productUnit.value = p.unit || "ta";

  renderCategories(p.category);
  $("#productModal").modal("show");
}

function deleteProduct(id) {
  if (!confirm("O'chirishni xohlaysizmi?")) return;
  products = products.filter(p => p.id !== id);
  saveProducts();
  renderProducts();
  renderSaleProducts();
}

/* ===============================================
   MAHSULOT QIDIRISH
=============================================== */
const productSearch = document.getElementById("productSearch");
if (productSearch) {
  productSearch.addEventListener("input", () => {
    const v = productSearch.value.toLowerCase();
    const filtered = products.filter(p =>
      p.name.toLowerCase().includes(v) ||
      p.category.toLowerCase().includes(v)
    );
    renderProducts(filtered);
  });
}

// MAHSULOT HOLATINI HISOBLASH //
function getStockStatus(product) {
  if (product.stock <= 0) {
    return {
      text: "❌ Tugagan",
      class: "status-danger"
    };
  }

  const percentLeft = product.stock / product.initialStock;

  if (percentLeft <= 0.2) {
    return {
      text: "⚠️ Kam qoldi",
      class: "status-warning"
    };
  }

  return {
    text: "✅ Yetarli",
    class: "status-success"
  };
}


/* ===============================================
   KATEGORIYA BOSHQARUVI
=============================================== */
const openCategoryModal = document.getElementById("openCategoryModal");
const categoryList = document.getElementById("categoryList");
const newCategory = document.getElementById("newCategory");
const saveCategory = document.getElementById("saveCategory");
const updateCategoryBtn = document.getElementById("updateCategory");
const deleteCategoryBtn = document.getElementById("deleteCategory");

function renderCategoryList() {
  if (!categoryList) return;

  categoryList.innerHTML = categories
    .map(c => `<option value="${c}">${c}</option>`)
    .join("");

  if (categories.length) {
    categoryList.value = categories[0];
    newCategory.value = categories[0];
  }
}

if (openCategoryModal) {
  openCategoryModal.addEventListener("click", () => {
    newCategory.value = "";
    renderCategoryList();
    $("#categoryModal").modal("show");
  });
}

if (categoryList) {
  categoryList.addEventListener("change", () => {
    newCategory.value = categoryList.value;
  });
}

if (saveCategory) {
  saveCategory.addEventListener("click", () => {
    const value = newCategory.value.trim();
    if (!value) return alert("Kategoriya nomini kiriting");
    if (categories.includes(value)) return alert("Bu kategoriya mavjud");

    categories.push(value);
    saveCategories();
    renderCategories(value);
    renderCategoryList();
    newCategory.value = "";

    $("#categoryModal").modal("hide");
  });
}

if (updateCategoryBtn) {
  updateCategoryBtn.addEventListener("click", () => {
    const oldValue = categoryList.value;
    const newValue = newCategory.value.trim();

    if (!newValue) return alert("Yangi nomni kiriting");
    if (categories.includes(newValue)) return alert("Bu kategoriya mavjud");

    categories = categories.map(c => (c === oldValue ? newValue : c));
    products.forEach(p => {
      if (p.category === oldValue) p.category = newValue;
    });

    saveCategories();
    saveProducts();
    renderCategories(newValue);
    renderProducts();
    renderCategoryList();

    $("#categoryModal").modal("hide");
  });
}

if (deleteCategoryBtn) {
  deleteCategoryBtn.addEventListener("click", () => {
    const value = categoryList.value;
    if (!value) return;

    const used = products.some(p => p.category === value);
    if (used) return alert("Bu kategoriya mahsulotlarda ishlatilmoqda");
    if (!confirm("Kategoriyani o'chirmoqchimisiz?")) return;

    categories = categories.filter(c => c !== value);
    saveCategories();
    renderCategories();
    renderCategoryList();
    newCategory.value = "";

    $("#categoryModal").modal("hide");
  });
}

/* ===============================================
   SOTUV
=============================================== */
// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const saleProduct = document.getElementById("saleProduct");
const saleQty = document.getElementById("saleQty");
const salePrice = document.getElementById("salePrice");
const saleQtyLabel = document.getElementById("saleQtyLabel");
const salesTable = document.getElementById("salesTable");
const totalSum = document.getElementById("totalSum");
const saleSearch = document.getElementById("saleSearch");
const saleAlert = document.getElementById("saleAlert");

// Session ID
let currentSaleSessionId = localStorage.getItem("currentSaleSessionId") || Date.now();

// Bildirishnoma ko'rsatish funksiyasi
function showSaleAlert(message, type = "success") {
  if (!saleAlert) return;
  
  saleAlert.className = `sale-alert ${type}`;
  saleAlert.textContent = message;
  saleAlert.classList.remove("hidden");
  
  setTimeout(() => {
    saleAlert.classList.add("hidden");
  }, 3000);
}

function renderSaleProducts(list = products) {
  if (!saleProduct) return;

  saleProduct.innerHTML = "";
  list.forEach(p => {
    saleProduct.innerHTML += `
      <option value="${p.id}">
        ${p.name} (${p.stock} ${p.unit})
      </option>
    `;
  });

  if (list.length) {
    saleProduct.value = list[0].id;
    updateSaleFields();
  }
}

function updateSaleFields() {
  const p = products.find(x => x.id == saleProduct.value);
  if (!p) return;

  saleQtyLabel.innerText = `Miqdor (${p.unit})`;

  if (p.unit === "kg") {
    saleQty.step = "0.01";
    saleQty.min = "0.01";
    saleQty.placeholder = "0.5 yoki 1.3";
  } else {
    saleQty.step = "1";
    saleQty.min = "1";
    saleQty.placeholder = "1, 2, 3...";
  }

  saleQty.value = "";
  salePrice.value = `${p.price.toLocaleString()} ${p.currency} / ${p.unit}`;
}

if (saleProduct) {
  saleProduct.addEventListener("change", updateSaleFields);
}

if (saleSearch) {
  saleSearch.addEventListener("input", () => {
    const value = saleSearch.value.toLowerCase();
    const filtered = products.filter(p =>
      p.name.toLowerCase().includes(value)
    );
    renderSaleProducts(filtered);
  });
}

/* ===============================================
   TO'LOV TURI
=============================================== */
function handleSale(paymentType) {
  const product = products.find(p => p.id == saleProduct.value);
  if (!product) {
    showSaleAlert("❌ Mahsulot tanlanmagan!", "error");
    return;
  }

  const qty = parseFloat(saleQty.value);
  if (isNaN(qty) || qty <= 0) {
    showSaleAlert("❌ Miqdorni to'g'ri kiriting!", "error");
    saleQty.focus();
    return;
  }

  if (qty > product.stock) {
    showSaleAlert(`❌ Yetarli mahsulot yo'q! (Mavjud: ${product.stock} ${product.unit})`, "error");
    saleQty.value = "";
    saleQty.focus();
    return;
  }

  const total = qty * product.price;
  product.stock = parseFloat((product.stock - qty).toFixed(2));

  sales.push({
    id: Date.now(),
    sessionId: currentSaleSessionId,
    productId: product.id,
    name: product.name,
    category: product.category,
    qty,
    unit: product.unit,
    price: product.price,
    total,
    currency: product.currency,
    status: "sold",
    paymentType,
    date: new Date().toISOString(),
    timestamp: getCurrentTimestamp()
  });

  saveSales();
  saveProducts();
  renderProducts();
  renderSales();
  
  // Barcha bog'liq funksiyalarni chaqirish
  if (typeof renderTransactions === 'function') renderTransactions();
  if (typeof updateDailySalesCounter === 'function') updateDailySalesCounter();
  if (typeof updateDailySalesPageCounter === 'function') updateDailySalesPageCounter();
  if (typeof updateTotalTransactions === 'function') updateTotalTransactions();
  if (typeof updateMonthlyRevenueUI === 'function') updateMonthlyRevenueUI();
  if (typeof updateProfitUI === 'function') updateProfitUI();
  if (typeof updateCharts === 'function') updateCharts();

  saleQty.value = "";
  saleQty.focus();

  const paymentText = paymentType === "card" ? "💳 Karta" : "💵 Naqd";
  showSaleAlert(`✅ ${product.name} sotildi! (${paymentText})`, "success");
}

const addSaleCash = document.getElementById("addSaleCash");
if (addSaleCash) {
  addSaleCash.addEventListener("click", () => {
    handleSale("cash");
  });
}

const addSaleCard = document.getElementById("addSaleCard");
if (addSaleCard) {
  addSaleCard.addEventListener("click", () => {
    handleSale("card");
  });
}

function renderSales() {
  if (!salesTable || !totalSum) return;

  const today = getToday();

  salesTable.innerHTML = "";
  let sum = 0;

  const todaySales = sales.filter(s =>
    s.date.slice(0, 10) === today &&
    s.status === "sold" &&
    s.sessionId == currentSaleSessionId
  );

  if (todaySales.length === 0) {
    salesTable.innerHTML = `
      <tr>
        <td colspan="6" class="text-center text-muted py-3">
          Bugun hali sotuv bo'lmadi
        </td>
      </tr>
    `;
    totalSum.innerHTML = `0 <span>UZS</span>`;
    return;
  }

  todaySales.reverse().forEach(s => {
    sum += Number(s.total);

    const time = new Date(s.date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });

    salesTable.innerHTML += `
      <tr>
        <td>${s.name}</td>
        <td>${s.qty} ${s.unit}</td>
        <td>${s.price.toLocaleString()} ${s.currency}</td>
        <td>${s.total.toLocaleString()} ${s.currency}</td>
        <td>${time}</td>
        <td>
          <button class="btn btn-sm btn-danger" onclick="cancelSale(${s.id})" title="Bekor qilish">
            ✖
          </button>
        </td>
      </tr>
    `;
  });

  totalSum.innerHTML = `${sum.toLocaleString()} <span>UZS</span>`;
}

function startNewSale() {
  if (!confirm(
    "Yangi sotuvni boshlaysizmi?\n\n" +
    "Oldingi sotuvlar saqlanadi, lekin yangi hisob ochiladi."
  )) return;

  currentSaleSessionId = Date.now();
  localStorage.setItem("currentSaleSessionId", currentSaleSessionId);

  if (salesTable) {
    salesTable.innerHTML = `
      <tr>
        <td colspan="6" class="text-center text-muted py-3">
          Yangi sotuv uchun tayyor
        </td>
      </tr>
    `;
  }

  if (totalSum) {
    totalSum.innerHTML = `0 <span>UZS</span>`;
  }

  if (saleQty) saleQty.value = "";
  if (saleProduct) renderSaleProducts();

  showSaleAlert("🆕 Yangi sotuv boshlandi!", "success");
}

function cancelSale(id) {
  if (!confirm("Bu sotuvni bekor qilmoqchimisiz?\nMahsulot stokga qaytariladi.")) return;

  const sale = sales.find(s => s.id === id);
  if (!sale) return;

  const product = products.find(p => p.id === sale.productId);
  if (product) {
    product.stock = parseFloat((product.stock + sale.qty).toFixed(2));
  }

  sales = sales.filter(s => s.id !== id);

  saveSales();
  saveProducts();
  renderProducts();
  renderSales();
  
  if (typeof renderTransactions === 'function') renderTransactions();
  if (typeof updateDailySalesCounter === 'function') updateDailySalesCounter();
  if (typeof updateDailySalesPageCounter === 'function') updateDailySalesPageCounter();
  if (typeof updateTotalTransactions === 'function') updateTotalTransactions();
  if (typeof updateMonthlyRevenueUI === 'function') updateMonthlyRevenueUI();
  if (typeof updateProfitUI === 'function') updateProfitUI();
  if (typeof updateCharts === 'function') updateCharts();

  showSaleAlert("✅ Sotuv bekor qilindi!", "success");
}

function deleteSale(id) {
  if (!confirm("Bu sotuvni butunlay o'chirmoqchimisiz?\nMahsulot stokga qaytariladi.")) return;

  const sale = sales.find(s => s.id === id);
  if (!sale) return;

  const product = products.find(p => p.id === sale.productId);
  if (product) {
    product.stock = parseFloat((product.stock + sale.qty).toFixed(2));
  }

  sales = sales.filter(s => s.id !== id);

  saveSales();
  saveProducts();
  renderProducts();
  renderSales();
  
  if (typeof renderTransactions === 'function') renderTransactions();
  if (typeof updateDailySalesCounter === 'function') updateDailySalesCounter();
  if (typeof updateDailySalesPageCounter === 'function') updateDailySalesPageCounter();
  if (typeof updateTotalTransactions === 'function') updateTotalTransactions();
  if (typeof updateMonthlyRevenueUI === 'function') updateMonthlyRevenueUI();
  if (typeof updateProfitUI === 'function') updateProfitUI();
  if (typeof updateCharts === 'function') updateCharts();

  showSaleAlert("✅ Sotuv o'chirildi!", "success");
}
// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* ===============================================
   FOYDA HISOBLASH (Professional - Oylik real foyda)
=============================================== */
function calculateMonthlyProfit(date = getToday()) {
  const [year, month] = date.split('-');
  let totalProfit = 0;

  sales.forEach(sale => {
    if (sale.status === "sold") {
      const [sYear, sMonth] = sale.date.slice(0, 10).split('-');

      if (sYear === year && sMonth === month) {
        const product = products.find(p => p.id === sale.productId);

        if (product && product.costPrice && product.price) {
          const profitPerUnit = product.price - product.costPrice;
          const totalProfitForSale = profitPerUnit * sale.qty;

          totalProfit += totalProfitForSale;
        }
      }
    }
  });

  return Math.round(totalProfit);
}

function updateProfitUI() {
  const counterEl = document.querySelector('.counter[data-key="totalProfit"]');
  if (!counterEl) return;

  const currentProfit = calculateMonthlyProfit();
  const lastShown = Number(counterEl.dataset.lastValue || 0);

  if (currentProfit !== lastShown) {
    let current = lastShown;
    const step = Math.ceil(Math.abs(currentProfit - lastShown) / 60);

    const interval = setInterval(() => {
      if (currentProfit > lastShown) {
        current += step;
        if (current >= currentProfit) {
          counterEl.innerHTML = `${currentProfit.toLocaleString()} <small style="font-size:0.55em;color:#94a3b8;font-weight:400;margin-left:4px">UZS</small>`;
          clearInterval(interval);
        } else {
          counterEl.innerHTML = `${Math.floor(current).toLocaleString()} <small style="font-size:0.55em;color:#94a3b8;font-weight:400;margin-left:4px">UZS</small>`;
        }
      } else {
        current -= step;
        if (current <= currentProfit) {
          counterEl.innerHTML = `${currentProfit.toLocaleString()} <small style="font-size:0.55em;color:#94a3b8;font-weight:400;margin-left:4px">UZS</small>`;
          clearInterval(interval);
        } else {
          counterEl.innerHTML = `${Math.floor(current).toLocaleString()} <small style="font-size:0.55em;color:#94a3b8;font-weight:400;margin-left:4px">UZS</small>`;
        }
      }
    }, 20);

    counterEl.dataset.lastValue = currentProfit;
  } else {
    counterEl.innerHTML = `${currentProfit.toLocaleString()} <small style="font-size:0.55em;color:#94a3b8;font-weight:400;margin-left:4px">UZS</small>`;
  }
}

function showNotification(message, type = "info") {
  let notification = document.getElementById("notification");

  if (!notification) {
    notification = document.createElement("div");
    notification.id = "notification";
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 8px;
      color: white;
      font-weight: 500;
      z-index: 9999;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(notification);
  }

  const colors = {
    success: "#22c55e",
    error: "#ef4444",
    warning: "#f59e0b",
    info: "#3b82f6"
  };

  notification.style.background = colors[type] || colors.info;
  notification.innerText = message;
  notification.style.display = "block";

  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease";
    setTimeout(() => {
      notification.style.display = "none";
    }, 300);
  }, 3000);
}

/* ===============================================
   TRANSACTIONS TABLE (Filter bilan)
=============================================== */
/* ===============================================
   ✅ TRANSACTIONS TABLE (Minimalistik & Professional)
=============================================== */
function renderTransactions() {
  const tbody = document.getElementById("transactionsTableBody");
  if (!tbody) return;

  // ================================
  // ✅ 1 OYDAN ESKI SAVDOLARNI TOZALASH
  // ================================
  const now = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setDate(now.getDate() - 30);

  const cleanedSales = sales.filter(s => new Date(s.date) >= oneMonthAgo);
  if (cleanedSales.length !== sales.length) {
    sales = cleanedSales;
    saveSales();
  }

  const today = getToday();
  let filteredSales = [];

  if (transactionFilter === "daily") {
    filteredSales = sales.filter(s => s.date.slice(0, 10) === today);
  }
  else if (transactionFilter === "weekly") {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    filteredSales = sales.filter(s => new Date(s.date) >= sevenDaysAgo);
  }
  else if (transactionFilter === "monthly") {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    filteredSales = sales.filter(s => new Date(s.date) >= thirtyDaysAgo);
  }

  if (transactionSearchQuery) {
    filteredSales = filteredSales.filter(s =>
      s.name.toLowerCase().includes(transactionSearchQuery)
    );
  }

  tbody.innerHTML = "";

  const reversedSales = filteredSales.slice().reverse();

  if (reversedSales.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="empty-state">
          <div class="empty-icon">📦</div>
          <div class="empty-title">Tranzaksiya topilmadi</div>
          <div class="empty-subtitle">Tanlangan filtr bo'yicha ma'lumot mavjud emas</div>
        </td>
      </tr>
    `;
    return;
  }

  reversedSales.forEach((s, index) => {
    const saleDate = new Date(s.date);

    const formattedDate = saleDate.toLocaleDateString('en-GB');
    const formattedTime = saleDate.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const paymentBadge = s.paymentType === "card"
      ? `<span class="payment-badge payment-card"><i class="bi bi-credit-card"></i> Karta</span>`
      : `<span class="payment-badge payment-cash"><i class="bi bi-cash"></i> Naqd</span>`;

    const animationDelay = `style="animation-delay: ${index * 0.05}s"`;

    // ✅ HAR BIR TD GA data-label ATTRIBUTINI TO'G'RIDAN-TO'G'RI QO'SHAMIZ
    tbody.innerHTML += `
      <tr class="transaction-row" ${animationDelay}>
        <td data-label="Mahsulot">
          <div class="product-info">
            <div class="product-name">${s.name}</div>
            <div class="product-category">${s.category}</div>
          </div>
        </td>
        <td data-label="Miqdor">
          <div class="quantity-info">
            <span class="qty-value">${s.qty}</span>
            <span class="qty-unit">${s.unit}</span>
          </div>
        </td>
        <td data-label="Narx">
          <div class="price-info">
            ${s.price.toLocaleString()}
            <span class="currency">${s.currency}</span>
          </div>
        </td>
        <td data-label="Sana">
          <div class="datetime-info">
            <div class="date-text">${formattedDate}</div>
            <div class="time-text">${formattedTime}</div>
          </div>
        </td>
        <td data-label="To'lov">${paymentBadge}</td>
        <td data-label="Holat">
          <span class="status-badge status-sold">
            <i class="bi bi-check-circle-fill"></i> Sotildi
          </span>
        </td>
      </tr>
    `;
  });
}


const transactionSearchInput = document.getElementById("transactionSearch");

if (transactionSearchInput) {
  transactionSearchInput.addEventListener("input", (e) => {
    transactionSearchQuery = e.target.value.trim().toLowerCase();
    renderTransactions();
  });
}

const transactionFilterSelect = document.getElementById("transactionFilter");
if (transactionFilterSelect) {
  transactionFilterSelect.addEventListener("change", (e) => {
    transactionFilter = e.target.value;
    renderTransactions();
  });
}
// Exel eksport funksiyasi
function exportTransactionsExcel() {
  const today = getToday();
  let filteredSales = [];
  let fileName = "";

  if (transactionFilter === "daily") {
    filteredSales = sales.filter(s => s.date.slice(0, 10) === today);
    fileName = `Kunlik_Savdo_${today}.xlsx`;
  }
  else if (transactionFilter === "weekly") {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    filteredSales = sales.filter(s => new Date(s.date) >= d);
    fileName = `Haftalik_Savdo_${today}.xlsx`;
  }
  else if (transactionFilter === "monthly") {
    const [y, m] = today.split("-");
    filteredSales = sales.filter(s => {
      const [sy, sm] = s.date.slice(0, 10).split("-");
      return sy === y && sm === m;
    });
    fileName = `Oylik_Savdo_${y}-${m}.xlsx`;
  }

  if (!filteredSales.length) {
    alert("Eksport qilish uchun ma'lumot yo‘q!");
    return;
  }

  const rows = filteredSales.map(s => {
    const d = new Date(s.date);
    return {
      Mahsulot: s.name,
      Miqdor: s.qty,
      Birlik: s.unit,
      Narx: s.price,
      Valyuta: s.currency,
      Jami: s.total,
      "To‘lov turi": s.paymentType === "card" ? "Karta" : "Naqd",
      Sana: d.toLocaleDateString('en-GB').replace(/\//g, '.'),
      Vaqt: d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      Status: s.status === "sold" ? "Sotildi" : "Qaytarildi"
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Savdolar");

  XLSX.writeFile(workbook, fileName);
}


function updateTotalTransactions() {
  const el = document.getElementById("totalTransactionsCounter");
  if (!el) return;

  const today = getToday();
  const todayTransactions = sales.filter(s =>
    s.status === "sold" && s.date.slice(0, 10) === today
  ).length;

  const lastShown = Number(el.dataset.lastValue || 0);

  if (todayTransactions !== lastShown) {
    animateCounter(el, lastShown, todayTransactions);
    el.dataset.lastValue = todayTransactions;

    setTimeout(() => {
      el.innerHTML = `${todayTransactions} <small style="font-size:0.55em;color:#94a3b8;font-weight:400;margin-left:4px">ta</small>`;
    }, 1200);
  } else {
    el.innerHTML = `${todayTransactions} <small style="font-size:0.55em;color:#94a3b8;font-weight:400;margin-left:4px">ta</small>`;
  }
}

function updateTotalRevenueUI() {
  const counterEl = document.querySelector('.counter[data-key="totalRevenue"]');
  if (counterEl) {
    const totalRevenue = calculateTotalRevenue();
    const lastValue = Number(counterEl.dataset.lastValue || 0);

    if (totalRevenue !== lastValue) {
      animateCounter(counterEl, lastValue, totalRevenue);
      counterEl.dataset.lastValue = totalRevenue;
    } else {
      counterEl.innerText = totalRevenue.toLocaleString();
    }
  }
}

document.querySelectorAll(".counter").forEach(counter => {
  const target = Number(counter.dataset.count);
  animateCounter(counter, 0, target);
});

/* ===============================================
   ✅ CHARTS (REAL DATA + AUTO UPDATE)
=============================================== */
function updateCharts() {
  const weeklyData = calculateWeeklyRevenue();
  const dailySales = calculateTodayRevenue();

  const weekDays = [];
  const today = new Date();
  const dayNames = ["Yak", "Dush", "Sesh", "Char", "Pay", "Juma", "Shan"];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    weekDays.push(dayNames[date.getDay()]);
  }

  const weeklyChart = document.getElementById("weeklyChart");
  if (weeklyChart) {
    if (chartInstances.weekly) {
      chartInstances.weekly.destroy();
    }

    chartInstances.weekly = new Chart(weeklyChart, {
      type: "line",
      data: {
        labels: weekDays,
        datasets: [{
          label: "Daromad (UZS)",
          data: weeklyData,
          borderColor: "#06b6d4",
          backgroundColor: "rgba(6,182,212,0.15)",
          fill: true,
          tension: 0.4,
          pointRadius: 5,
          pointBackgroundColor: "#06b6d4",
          pointBorderColor: "#fff",
          pointBorderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        animation: {
          duration: 750,
          easing: 'easeInOutQuart'
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (context) {
                return context.parsed.y.toLocaleString() + " UZS";
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return value.toLocaleString();
              }
            }
          }
        }
      }
    });
  }

  const dailyChart = document.getElementById("dailyChart");
  if (dailyChart) {
    if (chartInstances.daily) {
      chartInstances.daily.destroy();
    }

    chartInstances.daily = new Chart(dailyChart, {
      type: "bar",
      data: {
        labels: ["Bugun"],
        datasets: [{
          data: [dailySales],
          backgroundColor: "#22c55e",
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        animation: {
          duration: 750,
          easing: 'easeInOutQuart'
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (context) {
                return context.parsed.y.toLocaleString() + " UZS";
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return value.toLocaleString();
              }
            }
          }
        }
      }
    });
  }
}

function calculateProfitPreview() {
  const cost = Number(document.getElementById("productCostPrice").value) || 0;
  const price = Number(document.getElementById("productPrice").value) || 0;
  const profit = price - cost;

  const preview = document.getElementById("profitPreview");
  if (!preview) return;

  if (profit > 0) {
    preview.innerHTML = `<span style="color:#22c55e;font-weight:600">+${profit.toLocaleString()} UZS</span>`;
  } else if (profit < 0) {
    preview.innerHTML = `<span style="color:#ef4444;font-weight:600">${profit.toLocaleString()} UZS (Zarar!)</span>`;
  } else {
    preview.innerHTML = `<span style="color:#94a3b8">0 UZS</span>`;
  }
}

/* ===============================================
   ✅ QARZDORLAR BOSHQARUVI (SMS TIZIMI BILAN)
=============================================== */
function getDaysOverdue(returnDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(returnDate);
  dueDate.setHours(0, 0, 0, 0);
  return Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24));
}

function getStatus(returnDate) {
  const days = getDaysOverdue(returnDate);
  if (days > 0) return { class: 'overdue', text: 'Muddati o\'tgan', days };
  if (days >= -7) return { class: 'upcoming', text: 'Yaqinlashmoqda', days: Math.abs(days) };
  return { class: 'normal', text: 'Oddiy', days: Math.abs(days) };
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

function openModal() {
  document.getElementById('debtorModal').classList.add('show');
  document.getElementById('debtorForm').reset();
  document.getElementById('debtDate').value = new Date().toISOString().split('T')[0];
}

function closeModal() {
  document.getElementById('debtorModal').classList.remove('show');
}

function openAdjustModal(id, type) {
  const debtor = debtors.find(d => d.id === id);
  if (!debtor) return;

  document.getElementById('adjustDebtorId').value = id;
  document.getElementById('adjustType').value = type;
  document.getElementById('adjustDebtorName').value = debtor.name;
  document.getElementById('adjustCurrentDebt').value = `${debtor.amount.toLocaleString()} so'm`;
  document.getElementById('adjustAmount').value = '';

  if (type === 'add') {
    document.getElementById('adjustModalTitle').textContent = 'Qarz qo\'shish';
    document.getElementById('adjustAmountLabel').textContent = 'Qo\'shiladigan summa (so\'m)';
    document.getElementById('adjustSubmitBtn').innerHTML = '<i class="bi bi-plus-circle"></i> Qarz qo\'shish';
  } else {
    document.getElementById('adjustModalTitle').textContent = 'Qarzni kamaytirish';
    document.getElementById('adjustAmountLabel').textContent = 'To\'lanadigan summa (so\'m)';
    document.getElementById('adjustSubmitBtn').innerHTML = '<i class="bi bi-dash-circle"></i> Qarzni kamaytirish';
  }

  document.getElementById('adjustDebtModal').classList.add('show');
}

function closeAdjustModal() {
  document.getElementById('adjustDebtModal').classList.remove('show');
}

function handleAdjustDebt(event) {
  event.preventDefault();

  const id = parseInt(document.getElementById('adjustDebtorId').value);
  const type = document.getElementById('adjustType').value;
  const amount = parseFloat(document.getElementById('adjustAmount').value);

  const debtor = debtors.find(d => d.id === id);
  if (!debtor) return;

  if (type === 'add') {
    debtor.amount += amount;
    showSuccessMessage(`${debtor.name}ga ${amount.toLocaleString()} so'm qarz qo'shildi!`);
  } else {
    if (amount > debtor.amount) {
      alert('To\'lanadigan summa qarzdan katta bo\'lishi mumkin emas!');
      return;
    }

    const payment = {
      debtorId: id,
      debtorName: debtor.name,
      amount: amount,
      date: new Date().toISOString(),
      previousDebt: debtor.amount
    };

    paidDebtors.push(payment);
    debtor.amount -= amount;

    if (debtor.amount === 0) {
      debtors = debtors.filter(d => d.id !== id);
      showSuccessMessage(`${debtor.name}ning qarzi to'liq to'landi!`);
    } else {
      showSuccessMessage(`${amount.toLocaleString()} so'm to'landi. Qoldiq: ${debtor.amount.toLocaleString()} so'm`);
    }
  }

  saveDebtors();
  renderDebtors();
  updateStatistics();
  updateTotalDebtCounter();
  closeAdjustModal();
}

function handleSubmit(event) {
  event.preventDefault();

  // ✅ DUPLICATE CHECK - Qarzdor allaqachon mavjudmi?
  const phone = document.getElementById('debtorPhone').value.trim();
  const existingDebtor = debtors.find(d => d.phone === phone);

  if (existingDebtor) {
    alert(`❌ Bu telefon raqami allaqachon mavjud!\n\nQarzdor: ${existingDebtor.name}\nQarz: ${existingDebtor.amount.toLocaleString()} so'm`);
    return;
  }

  const newDebtor = {
    id: Date.now(),
    name: document.getElementById('debtorName').value.trim(),
    phone: phone,
    amount: parseFloat(document.getElementById('debtAmount').value),
    debtDate: document.getElementById('debtDate').value,
    returnDate: document.getElementById('returnDate').value,
    notes: document.getElementById('debtNotes').value.trim() || ''
  };

  debtors.push(newDebtor);
  saveDebtors();
  renderDebtors();
  updateStatistics();
  updateTotalDebtCounter();
  closeModal();
  showSuccessMessage(`✅ ${newDebtor.name} muvaffaqiyatli qo'shildi!`);
}

function contactDebtor(id) {
  const debtor = debtors.find(d => d.id === id);
  if (debtor) window.open(`tel:${debtor.phone}`);
}

function deleteDebtor(id) {
  const debtor = debtors.find(d => d.id === id);
  if (debtor && confirm(`${debtor.name}ni o'chirish?`)) {
    debtors = debtors.filter(d => d.id !== id);
    saveDebtors();
    renderDebtors();
    updateStatistics();
    updateTotalDebtCounter();
    showSuccessMessage('O\'chirildi!');
  }
}

/* ===============================================
   ✅ SMS YUBORISH TIZIMI (PROFESSIONAL)
=============================================== */
function openSmsModal(id) {
  const debtor = debtors.find(d => d.id === id);
  if (!debtor) return;

  currentSmsDebtorId = id;
  const daysLeft = -getDaysOverdue(debtor.returnDate);

  let smsMessage = `Hurmatli ${debtor.name}!\n\n`;

  if (daysLeft === 1) {
    smsMessage += `⚠️ ESLATMA: Ertaga to'lov muddati!\n\n`;
  } else if (daysLeft < 0) {
    smsMessage += `🚨 MUHIM: To'lov muddati ${Math.abs(daysLeft)} kun oldin o'tgan!\n\n`;
  } else if (daysLeft === 0) {
    smsMessage += `🔴 DIQQAT: Bugun to'lov muddati!\n\n`;
  }

  smsMessage += `Qarzingiz: ${debtor.amount.toLocaleString()} so'm\n`;
  smsMessage += `To'lov sanasi: ${formatDate(debtor.returnDate)}\n\n`;
  smsMessage += `Iltimos, imkon qadar tezroq to'lovni amalga oshiring.\n\n`;
  smsMessage += `Hurmat bilan,\nBoshqaruv jamoasi`;

  document.getElementById('smsRecipient').value = debtor.name;
  document.getElementById('smsPhone').value = debtor.phone;
  document.getElementById('smsMessage').value = smsMessage;
  document.getElementById('smsPreview').textContent = smsMessage;

  document.getElementById('smsModal').classList.add('show');
}

function closeSmsModal() {
  document.getElementById('smsModal').classList.remove('show');
}

function sendSms(event) {
  event.preventDefault();

  const debtor = debtors.find(d => d.id === currentSmsDebtorId);
  if (!debtor) return;

  const smsData = {
    id: Date.now(),
    debtorId: debtor.id,
    debtorName: debtor.name,
    phone: debtor.phone,
    message: document.getElementById('smsMessage').value,
    date: new Date().toISOString(),
    type: 'manual',
    status: 'sent'
  };

  smsHistory.push(smsData);
  saveSmsHistory();

  localStorage.setItem(`last_sms_${debtor.id}`, new Date().toISOString().split('T')[0]);

  renderSmsHistory();
  renderDebtors();
  closeSmsModal();
  showSuccessMessage(`📱 SMS yuborildi: ${debtor.name}`);
}

function sendAutoSms(debtor) {
  const smsMessage = `Hurmatli ${debtor.name}!\n\n` +
    `⚠️ ESLATMA: Ertaga to'lov muddati!\n\n` +
    `Qarzingiz: ${debtor.amount.toLocaleString()} so'm\n` +
    `To'lov sanasi: ${formatDate(debtor.returnDate)}\n\n` +
    `Iltimos, ertaga to'lovni amalga oshiring.\n\n` +
    `Hurmat bilan,\nBoshqaruv jamoasi`;

  const smsData = {
    id: Date.now(),
    debtorId: debtor.id,
    debtorName: debtor.name,
    phone: debtor.phone,
    message: smsMessage,
    date: new Date().toISOString(),
    type: 'auto_reminder',
    status: 'sent'
  };

  smsHistory.push(smsData);
  saveSmsHistory();

  localStorage.setItem(`last_auto_sms_${debtor.id}`, new Date().toISOString().split('T')[0]);

  console.log('═══════════════════════════════════');
  console.log('📱 AVTOMATIK SMS YUBORILDI');
  console.log('═══════════════════════════════════');
  console.log('Qabul qiluvchi:', debtor.name);
  console.log('Telefon:', debtor.phone);
  console.log('Sana:', new Date().toLocaleString('uz-UZ'));
  console.log('───────────────────────────────────');
  console.log(smsMessage);
  console.log('═══════════════════════════════════\n');

  renderSmsHistory();
  showSuccessMessage(`📱 ${debtor.name}ga avtomatik SMS yuborildi!`);
}

function sendOverdueSms(debtor, daysOverdue) {
  const smsMessage = `Hurmatli ${debtor.name}!\n\n` +
    `🚨 MUHIM: To'lov muddati ${daysOverdue} kun oldin o'tgan!\n\n` +
    `Qarzingiz: ${debtor.amount.toLocaleString()} so'm\n` +
    `To'lov sanasi edi: ${formatDate(debtor.returnDate)}\n\n` +
    `Iltimos, imkon qadar tezroq to'lovni amalga oshiring.\n\n` +
    `Savol bo'lsa bog'laning.\n\n` +
    `Hurmat bilan,\nBoshqaruv jamoasi`;

  const smsData = {
    id: Date.now(),
    debtorId: debtor.id,
    debtorName: debtor.name,
    phone: debtor.phone,
    message: smsMessage,
    date: new Date().toISOString(),
    type: 'overdue_reminder',
    status: 'sent',
    daysOverdue: daysOverdue
  };

  smsHistory.push(smsData);
  saveSmsHistory();

  localStorage.setItem(`last_overdue_sms_${debtor.id}`, new Date().toISOString().split('T')[0]);

  console.log('═══════════════════════════════════');
  console.log('🚨 KECHIKKAN ESLATMA SMS');
  console.log('═══════════════════════════════════');
  console.log('Qabul qiluvchi:', debtor.name);
  console.log('Telefon:', debtor.phone);
  console.log('Kechikish:', daysOverdue, 'kun');
  console.log('Sana:', new Date().toLocaleString('uz-UZ'));
  console.log('───────────────────────────────────');
  console.log(smsMessage);
  console.log('═══════════════════════════════════\n');

  renderSmsHistory();
  showSuccessMessage(`🚨 ${debtor.name}ga kechikish eslatmasi yuborildi!`);
}

function renderSmsHistory() {
  const tbody = document.getElementById('smsHistoryTableBody');
  if (!tbody) return;

  if (smsHistory.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center; padding:3rem;">
          <div style="font-size:3.5rem; margin-bottom:1rem; opacity:0.5;">📱</div>
          <div style="font-size:1.2rem; font-weight:600; color:#64748b; margin-bottom:0.5rem;">SMS tarixi bo'sh</div>
          <div style="font-size:0.95rem; color:#94a3b8;">Birinchi SMS yuborilgandan keyin bu yerda ko'rinadi</div>
        </td>
      </tr>
    `;
    return;
  }

  const sortedHistory = [...smsHistory].sort((a, b) => new Date(b.date) - new Date(a.date));

  tbody.innerHTML = sortedHistory.map(sms => {
    const date = new Date(sms.date);
    const formattedDate = date.toLocaleDateString('uz-UZ', { day: '2-digit', month: 'short' });
    const formattedTime = date.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });

    let typeIcon = '';
    let typeText = '';
    let typeBadgeClass = '';

    if (sms.type === 'manual') {
      typeIcon = '<i class="bi bi-person-fill"></i>';
      typeText = 'Qo\'lda yuborilgan';
      typeBadgeClass = 'badge-manual';
    } else if (sms.type === 'auto_reminder') {
      typeIcon = '<i class="bi bi-robot"></i>';
      typeText = 'Avtomatik eslatma';
      typeBadgeClass = 'badge-auto';
    } else if (sms.type === 'overdue_reminder') {
      typeIcon = '<i class="bi bi-exclamation-triangle-fill"></i>';
      typeText = 'Muddati o\'tgan';
      typeBadgeClass = 'badge-overdue';
    }

    // Debtor info
    const debtor = debtors.find(d => d.id === sms.debtorId);
    const debtorStatus = debtor ?
      `<small style="color:#10b981; font-weight:600;">✓ Faol</small>` :
      `<small style="color:#94a3b8;">✓ To'langan</small>`;

    return `
      <tr>
        <td>
          <div style="display:flex; flex-direction:column; gap:4px;">
            <strong style="font-size:1.05rem;">${sms.debtorName}</strong>
            ${debtorStatus}
          </div>
        </td>
        <td>
          <a href="tel:${sms.phone}" style="color:#3b82f6; text-decoration:none; font-weight:500;">
            <i class="bi bi-telephone"></i> ${sms.phone}
          </a>
        </td>
        <td>
          <span class="sms-type-badge ${typeBadgeClass}">
            ${typeIcon}
            <span>${typeText}</span>
          </span>
        </td>
        <td>
          <div style="display:flex; flex-direction:column; gap:2px;">
            <strong style="font-size:0.95rem;">${formattedDate}</strong>
            <span style="color:#64748b; font-size:0.85rem;">${formattedTime}</span>
          </div>
        </td>
        <td>
          <span class="sms-status-sent">
            <i class="bi bi-check-circle-fill"></i>
            Yuborildi
          </span>
        </td>
        <td>
          <button class="btn-view-sms" onclick="viewSmsDetails(${sms.id})" title="SMS matnini ko'rish">
            <i class="bi bi-eye-fill"></i>
            Ko'rish
          </button>
        </td>
      </tr>
    `;
  }).join('');

  updateSmsStatistics();
}

function viewSmsDetails(smsId) {
  const sms = smsHistory.find(s => s.id === smsId);
  if (!sms) return;

  const date = new Date(sms.date);
  const formattedDate = date.toLocaleDateString('uz-UZ', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  alert(
    `📱 SMS Tafsilotlari\n\n` +
    `Qabul qiluvchi: ${sms.debtorName}\n` +
    `Telefon: ${sms.phone}\n` +
    `Sana: ${formattedDate}\n` +
    `Turi: ${sms.type === 'manual' ? 'Qo\'lda' : 'Avtomatik'}\n\n` +
    `Xabar:\n${sms.message}`
  );
}

function updateSmsStatistics() {
  const today = new Date().toISOString().split('T')[0];

  const todaySms = smsHistory.filter(sms =>
    sms.date.split('T')[0] === today
  ).length;

  const autoSms = smsHistory.filter(sms =>
    sms.type === 'auto_reminder' || sms.type === 'overdue_reminder'
  ).length;

  const manualSms = smsHistory.filter(sms =>
    sms.type === 'manual'
  ).length;

  const todayCountEl = document.getElementById('todaySmsCount');
  const autoCountEl = document.getElementById('autoSmsCount');
  const manualCountEl = document.getElementById('manualSmsCount');

  if (todayCountEl) todayCountEl.textContent = todaySms;
  if (autoCountEl) autoCountEl.textContent = autoSms;
  if (manualCountEl) manualCountEl.textContent = manualSms;
}

/* ===============================================
   ✅ AVTOMATIK SMS YUBORISH (Har kuni 08:00 da)
=============================================== */
function checkAndSendAutoSms() {
  const now = new Date();
  const currentHour = now.getHours();
  const todayStr = now.toISOString().split('T')[0];

  // ✅ FAQAT 08:00 DA ISHLAYDI
  if (currentHour !== 8) {
    console.log(`⏰ Hozir soat ${currentHour}:00. SMS 08:00 da yuboriladi.`);
    return;
  }

  console.log('🔔 08:00 - Avtomatik SMS tekshirilmoqda...');

  debtors.forEach(debtor => {
    const daysLeft = -getDaysOverdue(debtor.returnDate);

    // 1 kun qolganda SMS yuborish
    if (daysLeft === 1) {
      const lastSmsDate = localStorage.getItem(`last_auto_sms_${debtor.id}`);

      if (lastSmsDate !== todayStr) {
        sendAutoSms(debtor);
      }
    }

    // Muddati o'tgan bo'lsa (har 3 kunda)
    if (daysLeft < 0 && Math.abs(daysLeft) % 3 === 0) {
      const lastOverdueSms = localStorage.getItem(`last_overdue_sms_${debtor.id}`);

      if (lastOverdueSms !== todayStr) {
        sendOverdueSms(debtor, Math.abs(daysLeft));
      }
    }
  });

  renderDebtors();
  renderSmsHistory();
}

/* ===============================================
   ✅ VAQT TEKSHIRISH (Har 1 minutda)
=============================================== */
function startAutoSmsScheduler() {
  // Dastlab tekshirish
  checkAndSendAutoSms();

  // Har 1 minutda tekshirish
  setInterval(() => {
    checkAndSendAutoSms();
  }, 60000); // 60 sekund = 1 minut

  console.log('✅ Avtomatik SMS tizimi ishga tushdi (08:00 da yuborish)');
}

// 🔒 RESPONSIVE TD SAFETY FIX (FILTERLAR UCHUN)
if (window.innerWidth <= 767) {
  document.querySelectorAll('#debtorTableBody td').forEach(td => {
    const content = td.firstElementChild;
    if (content) {
      content.style.flex = '1';
      content.style.minWidth = '0';
    }
  });
}

function renderDebtors() {
  const tbody = document.getElementById('debtorTableBody');
  if (!tbody) return;

  const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || "";

  let filtered = debtors.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(searchTerm) ||
      d.phone.includes(searchTerm);
    if (currentFilter === 'all') return matchSearch;
    const status = getStatus(d.returnDate);
    return matchSearch && status.class === currentFilter;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center; padding:2rem; color:#94a3b8;">
          <div style="font-size:3rem; margin-bottom:1rem;">📭</div>
          <div style="font-size:1.1rem; font-weight:600; margin-bottom:0.5rem;">Qarzdor topilmadi</div>
          <div style="font-size:0.9rem;">Yangi qarzdor qo'shish uchun yuqoridagi tugmani bosing</div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(d => {
    const status = getStatus(d.returnDate);
    const daysLeft = -getDaysOverdue(d.returnDate);
    const daysOverdue = getDaysOverdue(d.returnDate);

    let overdueText = daysOverdue > 0 ? `${daysOverdue} kun kechikdi` :
      daysOverdue === 0 ? 'Bugun' : `${Math.abs(daysOverdue)} kun qoldi`;

    const today = new Date().toISOString().split('T')[0];
    const lastAutoSms = localStorage.getItem(`last_auto_sms_${d.id}`);
    const lastOverdueSms = localStorage.getItem(`last_overdue_sms_${d.id}`);
    const lastManualSms = localStorage.getItem(`last_sms_${d.id}`);

    // ✅ PROFESSIONAL SMS STATUS BADGES
    let smsBadge = '';

    if (lastManualSms === today) {
      smsBadge = `
        <div class="sms-status-badge sms-sent">
          <i class="bi bi-check-circle-fill"></i>
          <span>Bugun qo'lda SMS yuborilgan</span>
        </div>
      `;
    } else if (lastAutoSms === today) {
      smsBadge = `
        <div class="sms-status-badge sms-sent">
          <i class="bi bi-robot"></i>
          <span>Bugun avtomatik eslatma yuborilgan</span>
        </div>
      `;
    } else if (lastOverdueSms === today) {
      smsBadge = `
        <div class="sms-status-badge sms-sent sms-overdue">
          <i class="bi bi-exclamation-triangle-fill"></i>
          <span>Bugun muddati o'tgan eslatma yuborilgan</span>
        </div>
      `;
    } else if (daysLeft === 1) {
      smsBadge = `
        <div class="sms-status-badge sms-pending">
          <i class="bi bi-clock-fill"></i>
          <span>Ertaga avtomatik SMS yuboriladi</span>
        </div>
      `;
    } else if (daysOverdue > 0 && daysOverdue % 3 === 0) {
      smsBadge = `
        <div class="sms-status-badge sms-pending sms-overdue">
          <i class="bi bi-bell-fill"></i>
          <span>Bugun eslatma yuboriladi</span>
        </div>
      `;
    } else {
      smsBadge = `
        <div class="sms-status-badge sms-no-action">
          <i class="bi bi-dash-circle"></i>
          <span>SMS yuborilmagan</span>
        </div>
      `;
    }

    return `
      <tr>
        <td data-label="Ism">
          <div style="display:flex; flex-direction:column; gap:8px;">
            <strong style="font-size:1.05rem; color:#1e293b;text-transform: capitalize;">${d.name}</strong>
            ${smsBadge}
          </div>
        </td>
        <td data-label="Telefon">
          <a href="tel:${d.phone}" style="color:#3b82f6; text-decoration:none; font-weight:500;">
            <i class="bi bi-telephone"></i> ${d.phone}
          </a>
        </td>
        <td data-label="Qarz">
          <strong style="font-size:1.1rem; color:#dc2626;">${d.amount.toLocaleString()} so'm</strong>
        </td>
        <td data-label="Qaytarish sanasi">
          <div style="display:flex; flex-direction:column;font-size:0.9rem; gap:4px;">
            <strong>${formatDate(d.returnDate)}</strong>
            <span class="status-badge ${status.class}">${overdueText}</span>
          </div>
        </td>
        <td data-label="Holat">
          <span class="status-badge-large ${status.class}">${status.text}</span>
        </td>
        <td data-label="Amallar">
          <div class="action-buttons-grid">
            <button class="action-btn action-btn-call" onclick="contactDebtor(${d.id})" title="Qo'ng'iroq qilish">
              <i class="bi bi-telephone-fill"></i>
            </button>
            <button class="action-btn action-btn-sms" onclick="openSmsModal(${d.id})" title="SMS yuborish">
              <i class="bi bi-chat-dots-fill"></i>
            </button>
            <button class="action-btn action-btn-add" onclick="openAdjustModal(${d.id}, 'add')" title="Qarz qo'shish">
              <i class="bi bi-plus-circle-fill"></i>
            </button>
            <button class="action-btn action-btn-reduce" onclick="openAdjustModal(${d.id}, 'reduce')" title="To'lov qabul qilish">
              <i class="bi bi-dash-circle-fill"></i>
            </button>
            <button class="action-btn action-btn-delete" onclick="deleteDebtor(${d.id})" title="O'chirish">
              <i class="bi bi-trash-fill"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
  
}

function updateStatistics() {
  let overdueCount = 0, overdueAmount = 0;
  let upcomingCount = 0, upcomingAmount = 0;

  debtors.forEach(d => {
    const status = getStatus(d.returnDate);
    if (status.class === 'overdue') {
      overdueCount++;
      overdueAmount += d.amount;
    } else if (status.class === 'upcoming') {
      upcomingCount++;
      upcomingAmount += d.amount;
    }
  });

  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const monthlyPayments = paidDebtors.filter(p => new Date(p.date) >= oneMonthAgo);
  const monthlyTotal = monthlyPayments.reduce((sum, p) => sum + p.amount, 0);
  const uniqueDebtors = new Set(monthlyPayments.map(p => p.debtorName)).size;

  const overdueAmountEl = document.getElementById('overdueAmount');
  const overdueCountEl = document.getElementById('overdueCount');
  const upcomingAmountEl = document.getElementById('upcomingAmount');
  const upcomingCountEl = document.getElementById('upcomingCount');
  const totalAmountEl = document.getElementById('totalAmount');
  const totalCountEl = document.getElementById('totalCount');

  if (overdueAmountEl) overdueAmountEl.textContent = `${overdueAmount.toLocaleString()} so'm`;
  if (overdueCountEl) overdueCountEl.textContent = overdueCount;
  if (upcomingAmountEl) upcomingAmountEl.textContent = `${upcomingAmount.toLocaleString()} so'm`;
  if (upcomingCountEl) upcomingCountEl.textContent = upcomingCount;
  if (totalAmountEl) totalAmountEl.textContent = `${monthlyTotal.toLocaleString()} so'm`;
  if (totalCountEl) totalCountEl.textContent = uniqueDebtors;
}

function showSuccessMessage(message) {
  const div = document.createElement('div');
  div.className = 'success-message';
  div.innerHTML = `<i class="bi bi-check-circle"></i> ${message}`;
  document.body.appendChild(div);

  setTimeout(() => {
    div.remove();
  }, 3000);
}

/* ===============================================
   ✅ SAHIFA YUKLANGANDA (INITIALIZATION)
=============================================== */
document.addEventListener("DOMContentLoaded", () => {
  const savedPage = localStorage.getItem("activePage") || "dashboard";
  const savedTitle = localStorage.getItem("activePageTitle") || "Dashboard";

  openPage(savedPage, savedTitle);

  if (checkAndResetDailyIfNeeded()) {
    renderTransactions();
  }

  renderCategories();
  renderProducts();
  renderSaleProducts();
  renderSales();
  renderTransactions();
  updateDailySalesCounter();
  updateDailySalesPageCounter();
  updateTotalTransactions();
  updateMonthlyRevenueUI();
  updateProfitUI();
  updateTotalDebtCounter();
  updateCharts();

  // SMS tizimi
  renderSmsHistory();
  renderDebtors();
  updateStatistics();

  // ✅ Avtomatik SMS tizimini ishga tushirish (08:00 da)
  startAutoSmsScheduler();

  // Har daqiqada kun o'zgarganini tekshirish
  setInterval(() => {
    if (checkAndResetDailyIfNeeded()) {
      updateDailySalesCounter();
      updateDailySalesPageCounter();
      renderSales();
      renderTransactions();
      updateTotalTransactions();
      updateMonthlyRevenueUI();
      updateProfitUI();
      updateCharts();
    }
  }, 60000);

  // Event listeners
  // const debtorForm = document.getElementById('debtorForm');
  // if (debtorForm) {
  //   debtorForm.addEventListener('submit', handleSubmit);
  // }

  const adjustForm = document.getElementById('adjustForm');
  if (adjustForm) {
    adjustForm.addEventListener('submit', handleAdjustDebt);
  }

  const smsForm = document.getElementById('smsForm');
  if (smsForm) {
    smsForm.addEventListener('submit', sendSms);
  }

  const smsMessage = document.getElementById('smsMessage');
  if (smsMessage) {
    smsMessage.addEventListener('input', function () {
      const preview = document.getElementById('smsPreview');
      if (preview) {
        preview.textContent = this.value;
      }
    });
  }

  document.querySelectorAll('.filter-tabs button').forEach(button => {
    button.addEventListener('click', function () {
      document.querySelectorAll('.filter-tabs button').forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      currentFilter = this.dataset.filter;
      renderDebtors();
    });
  });

  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      renderDebtors();
    });
  }

  const debtorModal = document.getElementById('debtorModal');
  if (debtorModal) {
    debtorModal.addEventListener('click', function (e) {
      if (e.target === this) closeModal();
    });
  }

  const smsModal = document.getElementById('smsModal');
  if (smsModal) {
    smsModal.addEventListener('click', function (e) {
      if (e.target === this) closeSmsModal();
    });
  }

  const adjustDebtModal = document.getElementById('adjustDebtModal');
  if (adjustDebtModal) {
    adjustDebtModal.addEventListener('click', function (e) {
      if (e.target === this) closeAdjustModal();
    });
  }
});

// Kam qolgan tavarlar 
function getStockMeta(product) {
  const initial = Number(product.initialStock) || 0;
  const current = Number(product.stock) || 0;

  const percent = initial > 0
    ? Math.round((current / initial) * 100)
    : 0;

  if (current <= 0) {
    return { percent: 0, status: "danger", label: "TUGAGAN" };
  }

  if (percent <= 20) {
    return { percent, status: "warning", label: "KAM QOLGAN" };
  }

  return null; // kam zaxira emas
}
// Alert cardlarni render qilish
function renderLowStockAlerts(products) {
  const container = document.getElementById("lowStockContainer");
  if (!container) return;

  container.innerHTML = "";

  products.forEach(product => {
    const meta = getStockMeta(product);
    if (!meta) return;

    container.innerHTML += `
      <div class="stock-card ${meta.status}">
        <div class="stock-card-header">
          <div>
            <div class="stock-title">${product.name}</div>
            <div class="stock-category">${product.category}</div>
          </div>
        </div>

        <div class="stock-values">
          <span>Boshlang‘ich:</span>
          <strong>${product.initialStock} ${product.unit}</strong>
        </div>

        <div class="stock-values">
          <span>Hozirgi:</span>
          <strong>${product.stock} ${product.unit}</strong>
        </div>

        <div class="progress">
          <div class="progress-bar ${meta.status}"
               style="width:${meta.percent}%"></div>
        </div>

        <div class="stock-status ${meta.status}">
          ${meta.label} — ${meta.percent}% qolgan
        </div>
      </div>
    `;
  });
}
renderLowStockAlerts(products);

// Card Debtors//

/* ===============================================
   MUDDATI O'TGAN QARZDORLAR CARDLARI (debtorTableBody dan)
=============================================== */
function renderOverdueCards() {
  const container = document.getElementById("overdueCards");
  if (!container) return;

  // debtors massividan muddati o'tganlarni filtrlash
  const overdueDebtors = debtors
    .map(d => {
      const overdueDays = getDaysOverdue(d.returnDate);
      return {
        id: d.id,
        name: d.name,
        amount: d.amount,
        overdueDays: overdueDays
      };
    })
    .filter(d => d.overdueDays > 0) // faqat muddati o'tganlar
    .sort((a, b) => b.overdueDays - a.overdueDays); // ko'p kechikkan birinchi

  // Agar muddati o'tganlar bo'lmasa
  if (overdueDebtors.length === 0) {
    container.innerHTML = `
      <div class="overdue-empty">
        <div class="overdue-empty-icon">✓</div>
        <div class="overdue-empty-text">Muddati o'tgan qarzdorlar yo'q</div>
      </div>
    `;
    return;
  }

  // Cardlarni chiqarish
  container.innerHTML = overdueDebtors.map((d, index) => {
    // Rangni aniqlash
    const urgencyClass = d.overdueDays >= 7 ? 'critical' :
      d.overdueDays >= 3 ? 'warning' : 'mild';

    return `
      <div class="overdue-card-mini ${urgencyClass}" 
           style="animation-delay: ${index * 0.05}s"
           onclick="highlightDebtor(${d.id})">
        <div class="overdue-mini-left">
          <div class="overdue-mini-name">${d.name}</div>
          <div class="overdue-mini-amount">${d.amount.toLocaleString()} so'm</div>
        </div>
        <div class="overdue-mini-right">
          <div class="overdue-mini-days ${urgencyClass}">
            ${d.overdueDays} kun
          </div>
        </div>
      </div>
    `;
  }).join('');
}

/* ===============================================
   QARZDORNI JADVALDA HIGHLIGHT QILISH (bonus)
=============================================== */
function highlightDebtor(debtorId) {
  // Agar Qarzdorlar sahifasiga o'tkazish kerak bo'lsa
  openPage('debtors', 'Qarzdorlar');

  // Bir oz kutib, qarzdorni highlight qilish
  setTimeout(() => {
    const rows = document.querySelectorAll('#debtorTableBody tr');
    rows.forEach(row => {
      row.style.background = '';
    });

    // Kerakli qarzdorni topish va highlight qilish
    const targetRow = Array.from(rows).find(row => {
      return row.innerHTML.includes(`onclick="contactDebtor(${debtorId})"`);
    });

    if (targetRow) {
      targetRow.style.background = '#fef2f2';
      targetRow.scrollIntoView({ behavior: 'smooth', block: 'center' });

      setTimeout(() => {
        targetRow.style.background = '';
      }, 3000);
    }
  }, 300);
}
document.addEventListener("DOMContentLoaded", () => {

  renderDebtors();
  updateStatistics(); // bu avtomatik renderOverdueCards() ni chaqiradi
  renderOverdueCards();

});


//---------------------------------------- Admin Profile ----------------------------------------//
// Tab Switching
function switchTab(tabName) {
  // Hide all content
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.add('hidden');
  });

  // Remove active class from all tabs
  document.querySelectorAll('.tab').forEach(tab => {
    tab.classList.remove('active');
  });

  // Show selected content
  document.getElementById(tabName + '-content').classList.remove('hidden');

  // Add active class to selected tab
  event.target.classList.add('active');
}

// Form Validation
function validateForm() {
  let isValid = true;
  const errors = {};

  // Full Name
  const fullName = document.getElementById('fullName').value.trim();
  if (!fullName) {
    errors.fullName = "To'liq ism kiritish majburiy";
    isValid = false;
  }

  // Email
  const email = document.getElementById('email').value.trim();
  if (!email) {
    errors.email = "E-pochta manzili kiritish majburiy";
    isValid = false;
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.email = "Noto'g'ri e-pochta manzili";
    isValid = false;
  }

  // Phone
  const phone = document.getElementById('phone').value.trim();
  if (!phone) {
    errors.phone = "Telefon raqami kiritish majburiy";
    isValid = false;
  }

  // Company
  const company = document.getElementById('company').value.trim();
  if (!company) {
    errors.company = "Kompaniya nomi kiritish majburiy";
    isValid = false;
  }

  // Display errors
  ['fullName', 'email', 'phone', 'company'].forEach(field => {
    const errorElement = document.getElementById(field + 'Error');
    const inputElement = document.getElementById(field);

    if (errors[field]) {
      errorElement.textContent = errors[field];
      errorElement.classList.remove('hidden');
      inputElement.classList.add('error');
    } else {
      errorElement.classList.add('hidden');
      inputElement.classList.remove('error');
    }
  });

  return isValid;
}

// Save Changes
function saveChanges() {
  if (validateForm()) {
    showNotification("O'zgarishlar muvaffaqiyatli saqlandi!", 'success');
  } else {
    showNotification("Qaytarib bo'lmaydigan xatolar!", 'error');
  }
}

// Show Notification
function showNotification(message, type) {
  const notification = document.getElementById('notification');
  const notificationText = document.getElementById('notificationText');

  notification.className = 'notification show ' + type;
  notificationText.textContent = message;

  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}

// Clear errors on input
document.querySelectorAll('.form-input, .form-select').forEach(input => {
  input.addEventListener('input', function () {
    const errorElement = document.getElementById(this.id + 'Error');
    if (errorElement) {
      errorElement.classList.add('hidden');
      this.classList.remove('error');
    }
  });
});

// Profile avatar
const avatarInput = document.getElementById("avatarInput");
const avatarImg = document.getElementById("profileAvatar");
const avatarFallback = document.getElementById("avatarFallback");

// Fayl tanlashni ochish
function triggerAvatarUpload() {
  avatarInput.click();
}

// Yuklash
avatarInput.addEventListener("change", function () {
  const file = this.files[0];
  if (!file) return;

  // 🔒 Format tekshirish
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    alert("Faqat JPG, PNG yoki GIF ruxsat etiladi!");
    return;
  }

  // 🔒 Hajm tekshirish (2MB)
  if (file.size > 2 * 1024 * 1024) {
    alert("Rasm hajmi 2MB dan oshmasligi kerak!");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const base64Image = e.target.result;

    // UI
    avatarImg.src = base64Image;
    avatarImg.classList.remove("d-none");
    avatarFallback.style.display = "none";

    // 🔥 Saqlash (refresh yo‘qolmasin)
    localStorage.setItem("profile_avatar", base64Image);
  };

  reader.readAsDataURL(file);
});

// Sahifa ochilganda avatarni yuklash
(function loadAvatarOnStart() {
  const savedAvatar = localStorage.getItem("profile_avatar");
  if (savedAvatar) {
    avatarImg.src = savedAvatar;
    avatarImg.classList.remove("d-none");
    avatarFallback.style.display = "none";
  }
})();
/**
         * Professional Navigation System
         * Sahifalar orasida o'tish uchun markazlashgan tizim
         */
var NavigationManager = {
  // Konfiguratsiya - bu yerda sahifalar yo'llarini belgilang
  routes: {
    profile: '/profile.html',           // yoki '#profile' hash routing uchun
    settings: '/settings.html',         // yoki '#settings'
    notifications: '/notifications.html', // yoki '#notifications'
    help: '/help.html',                 // yoki '#help'
    dashboard: '/dashboard.html'        // yoki '#dashboard'
  },

  // Navigatsiya metodi
  navigateTo: function (page) {
    // METHOD 1: Multi-page application (klassik yo'l)
    if (this.routes[page]) {
      window.location.href = this.routes[page];
    }

    // METHOD 2: Hash routing (agar SPA ishlatayotgan bo'lsangiz)
    // window.location.hash = page;

    // METHOD 3: Custom event (React/Vue/Angular uchun)
    // var event = new CustomEvent('navigate', { detail: { page: page } });
    // window.dispatchEvent(event);

    console.log('Navigating to:', page);
  },

  // Sahifa holatini o'zgartirish (SPA uchun)
  changePageState: function (page) {
    // Bu yerda sahifa content'ini o'zgartirishingiz mumkin
    document.getElementById('pageTitle').textContent = this.getPageTitle(page);

    // Sahifa ko'rinishini o'zgartirish
    document.querySelectorAll('.section').forEach(function (section) {
      section.style.display = 'none';
    });

    var targetSection = document.getElementById(page);
    if (targetSection) {
      targetSection.style.display = 'block';
    }
  },

  // Sahifa sarlavhasini olish
  getPageTitle: function (page) {
    var titles = {
      profile: 'Shaxsiy Profil',
      settings: 'Sozlamalar',
      notifications: 'Bildirishnomalar',
      help: 'Yordam',
      dashboard: 'Dashboard'
    };
    return titles[page] || 'Dashboard';
  },

  init: function () {
    var self = this;

    // Barcha dropdown itemlarga listener qo'shish
    document.querySelectorAll('[data-page]').forEach(function (item) {
      item.addEventListener('click', function (e) {
        e.preventDefault();
        var page = this.getAttribute('data-page');
        self.navigateTo(page);

        // Dropdown'ni yopish
        ProfileDropdownManager.close();
      });
    });
  }
};

/**
 * Profile Dropdown Manager
 * Dropdown ochish/yopish va animatsiyalarni boshqarish
 */
var ProfileDropdownManager = {

  trigger: null,
  dropdown: null,
  overlay: null,

  init: function () {
    this.trigger = document.getElementById('profileTrigger');
    this.dropdown = document.getElementById('profileDropdown');
    this.overlay = document.getElementById('dropdownOverlay');

    this.attachEventListeners();
  },

  attachEventListeners: function () {
    var self = this;

    // Toggle dropdown
    this.trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      self.toggle();
    });

    // Close on overlay click
    this.overlay.addEventListener('click', function () {
      self.close();
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!self.trigger.contains(e.target) && !self.dropdown.contains(e.target)) {
        self.close();
      }
    });

    // Close on ESC key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        self.close();
      }
    });
  },

  toggle: function () {
    if (this.dropdown.classList.contains('show')) {
      this.close();
    } else {
      this.open();
    }
  },

  open: function () {
    this.trigger.classList.add('active');
    this.dropdown.classList.add('show');
    this.overlay.classList.add('show');
  },

  close: function () {
    this.trigger.classList.remove('active');
    this.dropdown.classList.remove('show');
    this.overlay.classList.remove('show');
  }

};

/**
 * Statistics Manager
 * Statistika ma'lumotlarini boshqarish
 */
var StatisticsManager = {
  init: function () {
    this.updateTodayDate();
    this.loadStats();
    this.startRealTimeClock();
  },

  // Bugungi sanani yangilash
  updateTodayDate: function () {
    var months = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyun', 'Iyul', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'];
    var days = ['Yak', 'Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan'];

    var now = new Date();
    var dayName = days[now.getDay()];
    var day = now.getDate();
    var month = months[now.getMonth()];

    var todayLabel = dayName + ', ' + day + ' ' + month;
    document.getElementById('todayLabel').textContent = todayLabel;
  },

  // Real vaqt soat (har daqiqada yangilanadi)
  startRealTimeClock: function () {
    var self = this;
    this.updateTodayDate();

    // Har daqiqada yangilanadi
    setInterval(function () {
      self.updateTodayDate();
      self.checkNewDay();
    }, 60000);
  },

  // Yangi kun boshlanganini tekshirish
  checkNewDay: function () {
    var today = new Date().toDateString();
    var lastDate = localStorage.getItem('crm_last_date');

    if (lastDate !== today) {
      this.resetTodayActions();
      localStorage.setItem('crm_last_date', today);
    }
  },

  // Statistikani yuklash
  loadStats: function () {
    var stats = localStorage.getItem('crm_statistics');
    if (stats) {
      try {
        var data = JSON.parse(stats);
        document.getElementById('statCustomers').textContent = data.customers || 156;
        document.getElementById('statDeals').textContent = data.deals || 89;
        document.getElementById('statToday').textContent = data.todayActions || 0;
      } catch (e) {
        console.error('Error loading stats:', e);
      }
    } else {
      this.resetTodayActions();
    }
  },

  // Bugungi harakatlarni reset qilish
  resetTodayActions: function () {
    var stats = {
      customers: 156,
      deals: 89,
      todayActions: 0
    };
    localStorage.setItem('crm_statistics', JSON.stringify(stats));
    document.getElementById('statToday').textContent = '0';
  },

  // Harakatni oshirish
  incrementAction: function () {
    var stats = localStorage.getItem('crm_statistics');
    var data = stats ? JSON.parse(stats) : { customers: 156, deals: 89, todayActions: 0 };

    data.todayActions = (data.todayActions || 0) + 1;
    localStorage.setItem('crm_statistics', JSON.stringify(data));
    document.getElementById('statToday').textContent = data.todayActions;
  }
};

/**
 * Profile Data Manager
 * Profil ma'lumotlarini boshqarish va sinxronlash
 */
var TopbarProfileManager = {
  init: function () {
    this.loadProfileData();
    this.setupRealtimeSync();
    this.listenForUpdates();
  },

  // LocalStorage'dan ma'lumotlarni yuklash
  loadProfileData: function () {
    var savedData = localStorage.getItem('profile_data');
    var savedAvatar = localStorage.getItem('profile_avatar');

    if (savedData) {
      try {
        var data = JSON.parse(savedData);
        if (savedAvatar) {
          data.avatar = savedAvatar;
        }
        this.updateAllUI(data);
      } catch (e) {
        console.error('Error loading profile:', e);
      }
    }
  },

  // Barcha UI elementlarni yangilash
  updateAllUI: function (data) {
    console.log('Updating all UI with data:', data);

    // Ism familya
    if (data.fullName) {
      document.getElementById('topbarName').textContent = data.fullName;
      document.getElementById('dropdownName').textContent = data.fullName;

      var initials = this.getInitials(data.fullName);
      document.getElementById('topbarAvatarFallback').textContent = initials;
      document.getElementById('dropdownAvatarFallback').textContent = initials;
    }

    // Email
    if (data.email) {
      document.getElementById('dropdownEmail').textContent = data.email;
    }

    // Telefon
    if (data.phone) {
      document.getElementById('dropdownPhone').textContent = data.phone;
    }

    // Kompaniya/Do'kon
    if (data.company) {
      document.getElementById('topbarStore').textContent = data.company;
    }

    // Department/Role
    if (data.department) {
      document.getElementById('dropdownRole').textContent = data.department;
    }

    // Avatar
    if (data.avatar) {
      this.updateAvatar(data.avatar);
    }
  },

  // Avatar'ni yangilash
  updateAvatar: function (avatarBase64) {
    var elements = [
      {
        img: document.getElementById('topbarAvatar'),
        fallback: document.getElementById('topbarAvatarFallback')
      },
      {
        img: document.getElementById('dropdownAvatar'),
        fallback: document.getElementById('dropdownAvatarFallback')
      }
    ];

    elements.forEach(function (el) {
      if (avatarBase64) {
        el.img.src = avatarBase64;
        el.img.classList.add('show');
        el.fallback.style.display = 'none';
      } else {
        el.img.classList.remove('show');
        el.fallback.style.display = 'flex';
      }
    });
  },

  // Initials olish
  getInitials: function (name) {
    if (!name) return 'AU';
    var parts = name.trim().split(' ');
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  },

  // Real-time sinxronizatsiya (input'larga listener)
  setupRealtimeSync: function () {
    var self = this;
    var inputs = ['fullName', 'email', 'phone', 'company', 'department'];

    inputs.forEach(function (inputId) {
      var element = document.getElementById(inputId);
      if (element) {
        element.addEventListener('input', function () {
          var data = {};
          data[inputId] = this.value;
          self.updateAllUI(data);
        });
      }
    });
  },

  // ProfileUpdated eventini tinglash
  listenForUpdates: function () {
    var self = this;

    window.addEventListener('profileUpdated', function (e) {
      console.log('Profile updated event received:', e.detail);
      var avatar = localStorage.getItem('profile_avatar');
      if (avatar) {
        e.detail.avatar = avatar;
      }
      self.updateAllUI(e.detail);
    });

    // Storage o'zgarishlarini tinglash
    window.addEventListener('storage', function (e) {
      if (e.key === 'profile_data' || e.key === 'profile_avatar') {
        self.loadProfileData();
      }
    });
  }
};


/**
 * Logout Manager
 * Tizimdan chiqish jarayonini boshqarish
 */
var LogoutManager = {
  init: function () {
    var logoutBtn = document.getElementById('logoutBtn');

    logoutBtn.addEventListener('click', function (e) {
      e.preventDefault();
      LogoutManager.logout();
    });
  },

  logout: function () {
    if (confirm('Haqiqatan ham tizimdan chiqmoqchimisiz?')) {
      // Ma'lumotlarni tozalash
      this.clearUserData();

      // Login sahifasiga yo'naltirish
      this.redirectToLogin();
    }
  },

  clearUserData: function () {
    // MUHIM: Faqat foydalanuvchi ma'lumotlarini tozalang
    // Tizim sozlamalarini saqlab qoling
    var keysToRemove = [
      'profile_data',
      'profile_avatar',
      'auth_token',
      'user_session',
      'crm_today_actions',
      'crm_last_update_date'
    ];

    keysToRemove.forEach(function (key) {
      localStorage.removeItem(key);
    });

    // Yoki barcha ma'lumotlarni tozalash
    // localStorage.clear();
  },

  redirectToLogin: function () {
    // Login sahifasiga yo'naltirish
    window.location.href = 'login.html';

    // Yoki hash routing uchun:
    // window.location.hash = 'login';

    // Yoki SPA uchun:
    // var event = new CustomEvent('navigate', { detail: { page: 'login' } });
    // window.dispatchEvent(event);
  }
};

/**
 * Application Initialization
 * Barcha modullarni ishga tushirish
 */
function initializeApp() {
  console.log('Initializing CRM Topbar Application...');

  // 1. Navigation tizimini ishga tushirish
  NavigationManager.init();

  // 2. Profile dropdown'ni sozlash
  ProfileDropdownManager.init();

  // 3. Profil ma'lumotlarini yuklash
  TopbarProfileManager.init();

  // 4. Statistika tizimini ishga tushirish
  StatisticsManager.init();

  // 5. Logout funksiyasini ulash
  LogoutManager.init();

  console.log('Application initialized successfully!');
}

// DOM yuklanganida ishga tushirish
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

/**
 * Global API - Boshqa sahifalardan foydalanish uchun
 * 
 * Misol:
 * CRMTopbar.updateProfile({ fullName: 'Yangi Ism' });
 * CRMTopbar.incrementTodayActions();
 * CRMTopbar.navigate('profile');
 */
window.CRMTopbar = {
  // Profilni yangilash
  updateProfile: function (data) {
    TopbarProfileManager.updateUI(data);
  },

  // Bugungi harakatlarni oshirish
  incrementTodayActions: function () {
    StatisticsManager.incrementToday();
  },

  // Sahifaga o'tish
  navigate: function (page) {
    NavigationManager.navigateTo(page);
  },

  // Dropdown'ni ochish/yopish
  toggleDropdown: function () {
    ProfileDropdownManager.toggle();
  },

  // Statistikani yangilash
  updateStats: function (data) {
    StatisticsManager.data = Object.assign(StatisticsManager.data, data);
    StatisticsManager.saveToStorage();
    StatisticsManager.updateUI();
  }
};

// ----------------------------------------------------------------------------------------

// document.addEventListener("DOMContentLoaded", () => {
//   const currentUser = JSON.parse(localStorage.getItem("currentUser"));

//   if (!currentUser) {
//     window.location.href = "login.html";
//     return;
//   }

//   // Profil dropdownni to‘ldiramiz
//   initProfile(currentUser);
// });


// profilga chiqarish
function initProfile(user) {
  document.getElementById("dropdownAvatarFallback").innerText = user.fullname;
  document.getElementById("dropdownName").innerText = user.fullname;
  document.getElementById("dropdownEmail").innerText = user.email;
}

// MOBILE BOTTOM NAV CONTROL (WITH STATE SAVE)
const MOBILE_PAGE_KEY = 'activeMobileSection';

document.querySelectorAll('.mobile-bottom-nav button').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.target;
    if (!target) return;

    // Sections
    document.querySelectorAll('.section').forEach(s =>
      s.classList.remove('active')
    );
    document.getElementById(target)?.classList.add('active');

    // Nav buttons
    document.querySelectorAll('.mobile-bottom-nav button').forEach(b =>
      b.classList.remove('active')
    );
    btn.classList.add('active');

    // Title
    const title = btn.querySelector('span')?.innerText;
    if (title) {
      document.getElementById('pageTitle').innerText = title;
    }

    // 💾 SAVE STATE
    localStorage.setItem(MOBILE_PAGE_KEY, target);
  });
});

// 🔁 RESTORE ACTIVE PAGE ON LOAD (MOBILE ONLY)
document.addEventListener('DOMContentLoaded', () => {
  // faqat mobile uchun
  if (window.innerWidth > 991) return;

  const savedSection = localStorage.getItem(MOBILE_PAGE_KEY);
  if (!savedSection) return;

  const sectionEl = document.getElementById(savedSection);
  const navBtn = document.querySelector(
    `.mobile-bottom-nav button[data-target="${savedSection}"]`
  );

  if (sectionEl && navBtn) {
    // Sections
    document.querySelectorAll('.section').forEach(s =>
      s.classList.remove('active')
    );
    sectionEl.classList.add('active');

    // Nav buttons
    document.querySelectorAll('.mobile-bottom-nav button').forEach(b =>
      b.classList.remove('active')
    );
    navBtn.classList.add('active');

    // Title
    const title = navBtn.querySelector('span')?.innerText;
    if (title) {
      document.getElementById('pageTitle').innerText = title;
    }
  }
});


// ===== RESPONSIVE TABLE FIX (AUTO DATA-LABEL) =====
// ✅ Bu funksiya endi faqat boshqa jadvallar uchun kerak
// Transactions jadvali uchun data-label to'g'ridan-to'g'ri HTML da qo'shiladi
function applyResponsiveTables() {
  document.querySelectorAll("table:not(#transactionsTable, #productTable)").forEach(table => {
    const headers = Array.from(table.querySelectorAll("thead th"))
      .map(th => th.innerText.trim());

    table.querySelectorAll("tbody tr").forEach(tr => {
      Array.from(tr.children).forEach((td, i) => {
        if (!td.getAttribute("data-label") && headers[i]) {
          td.setAttribute("data-label", headers[i]);
        }
      });
    });
  });
}

document.addEventListener("DOMContentLoaded", applyResponsiveTables);

// ===== SAFE RESPONSIVE TABLE WRAPPER =====
document.querySelectorAll("table").forEach(table => {
  if (!table.parentElement.classList.contains("table-responsive-safe")) {
    const wrapper = document.createElement("div");
    wrapper.className = "table-responsive-safe";
    table.parentNode.insertBefore(wrapper, table);
    wrapper.appendChild(table);
  }
});

// /////////////////////////////////////////////////////////////////
/* ========== AUTHENTICATION & STORAGE ========== */

// Foydalanuvchi ma'lumotlarini olish
function getUserData() {
  const userData = localStorage.getItem('currentUser');
  console.log('Dashboard - Getting user data:', userData);
  return userData ? JSON.parse(userData) : null;
}

// Foydalanuvchi ma'lumotlarini saqlash
function saveUserData(userData) {
  localStorage.setItem('currentUser', JSON.stringify(userData));
  console.log('Dashboard - User data saved:', userData);
}

// Foydalanuvchini tekshirish
function checkAuth() {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  console.log('Dashboard - Checking auth:', isLoggedIn);
  
  if (!isLoggedIn) {
    console.log('Not logged in, redirecting...');
    window.location.href = 'signup.html';
    return false;
  }
  return true;
}

// Chiqish funksiyasi
function logout() {
  console.log('Logging out...');
  localStorage.removeItem('currentUser');
  localStorage.removeItem('isLoggedIn');
  window.location.href = 'signup.html';
}

/* ========== PROFILE DISPLAY ========== */

// Initsialarni olish
function getInitials(fullName) {
  if (!fullName) return 'AU';
  const names = fullName.trim().split(' ');
  if (names.length >= 2) {
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  }
  return fullName.substring(0, 2).toUpperCase();
}

// Profil ma'lumotlarini yangilash
function updateProfileDisplay() {
  console.log('Updating profile display...');
  
  const userData = getUserData();
  
  if (!userData) {
    console.error('Foydalanuvchi ma\'lumotlari topilmadi!');
    return;
  }

  console.log('User data for display:', userData);

  const initials = getInitials(userData.fullName);
  console.log('Initials:', initials);

  // Topbar profil ma'lumotlari
  const profileName = document.getElementById('profileName');
  const profileEmail = document.getElementById('profileEmail');
  const topbarAvatarFallback = document.getElementById('topbarAvatarFallback');
  
  console.log('Topbar elements:', {
    profileName: profileName,
    profileEmail: profileEmail,
    topbarAvatarFallback: topbarAvatarFallback
  });

  if (profileName) {
    profileName.textContent = userData.fullName;
    console.log('Set profile name:', userData.fullName);
  }
  if (profileEmail) {
    profileEmail.textContent = userData.storeName;
    console.log('Set profile email/store:', userData.storeName);
  }
  if (topbarAvatarFallback) {
    topbarAvatarFallback.textContent = initials;
    console.log('Set topbar initials:', initials);
  }

  // Dropdown profil ma'lumotlari
  const dropdownName = document.getElementById('dropdownName');
  const dropdownEmail = document.getElementById('dropdownEmail');
  const dropdownPhone = document.getElementById('dropdownPhone');
  const dropdownRole = document.getElementById('dropdownRole');
  const dropdownAvatarFallback = document.getElementById('dropdownAvatarFallback');

  console.log('Dropdown elements:', {
    dropdownName: dropdownName,
    dropdownEmail: dropdownEmail,
    dropdownPhone: dropdownPhone,
    dropdownRole: dropdownRole,
    dropdownAvatarFallback: dropdownAvatarFallback
  });

  if (dropdownName) {
    dropdownName.textContent = userData.fullName;
    console.log('Set dropdown name:', userData.fullName);
  }
  if (dropdownEmail) {
    dropdownEmail.textContent = userData.email;
    console.log('Set dropdown email:', userData.email);
  }
  if (dropdownPhone) {
    dropdownPhone.textContent = userData.phone;
    console.log('Set dropdown phone:', userData.phone);
  }
  if (dropdownRole) {
    dropdownRole.textContent = userData.role;
    console.log('Set dropdown role:', userData.role);
  }
  if (dropdownAvatarFallback) {
    dropdownAvatarFallback.textContent = initials;
    console.log('Set dropdown initials:', initials);
  }

  // Statistika ma'lumotlari
  const statCustomers = document.getElementById('statCustomers');
  const statDeals = document.getElementById('statDeals');
  const statToday = document.getElementById('statToday');

  console.log('Stats elements:', {
    statCustomers: statCustomers,
    statDeals: statDeals,
    statToday: statToday
  });

  if (statCustomers) {
    statCustomers.textContent = userData.stats.customers;
    console.log('Set customers stat:', userData.stats.customers);
  }
  if (statDeals) {
    statDeals.textContent = userData.stats.deals;
    console.log('Set deals stat:', userData.stats.deals);
  }
  if (statToday) {
    statToday.textContent = userData.stats.today;
    console.log('Set today stat:', userData.stats.today);
  }

  console.log('Profile display updated successfully!');
}

// Statistikani yangilash funksiyasi
function updateUserStats(type, value) {
  const userData = getUserData();
  if (!userData) return;

  if (userData.stats.hasOwnProperty(type)) {
    userData.stats[type] = value;
    saveUserData(userData);
    updateProfileDisplay();
  }
}

// Increment funksiyasi
function incrementStat(type) {
  const userData = getUserData();
  if (!userData) return;

  if (userData.stats.hasOwnProperty(type)) {
    userData.stats[type]++;
    saveUserData(userData);
    updateProfileDisplay();
  }
}

/* ========== PROFILE DROPDOWN ========== */

function initProfileDropdown() {
  const profileTrigger = document.getElementById('profileTrigger');
  const profileDropdown = document.getElementById('profileDropdown');
  
  console.log('Init profile dropdown:', {
    trigger: profileTrigger,
    dropdown: profileDropdown
  });

  if (profileTrigger && profileDropdown) {
    profileTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      profileDropdown.classList.toggle('active');
      console.log('Dropdown toggled');
    });

    // Tashqarida bosish orqali yopish
    document.addEventListener('click', (e) => {
      if (!profileTrigger.contains(e.target) && !profileDropdown.contains(e.target)) {
        profileDropdown.classList.remove('active');
      }
    });
  }
}

/* ========== LOGOUT ========== */

function initLogout() {
  const logoutBtn = document.getElementById('logoutBtn');
  console.log('Init logout button:', logoutBtn);
  
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm('Haqiqatan ham chiqmoqchimisiz?')) {
        logout();
      }
    });
  }
}

/* ========== INITIALIZATION ========== */

function initDashboard() {
  console.log('=== Initializing Dashboard ===');
  
  // Auth tekshirish
  if (!checkAuth()) {
    return;
  }
  
  // Profilni yangilash
  updateProfileDisplay();
  
  // Dropdown va logout
  initProfileDropdown();
  initLogout();
  
  console.log('=== Dashboard Initialized ===');
}

// Sahifa yuklanganda ishga tushirish
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDashboard);
} else {
  initDashboard();
}

// Global qilib export qilish
window.updateUserStats = updateUserStats;
window.incrementStat = incrementStat;
window.getUserData = getUserData;
window.saveUserData = saveUserData;
window.logout = logout;