// DOM ELEMENTS
const form = document.getElementById("transaction-form");
const list = document.getElementById("transaction-list");
const incomeEl = document.getElementById("total-income");
const expenseEl = document.getElementById("total-expense");
const balanceEl = document.getElementById("balance");
const resetBtn = document.getElementById("reset-btn");
const typeEl = document.getElementById("type");
const amountEl = document.getElementById("amount");
const categoryEl = document.getElementById("category");
const filterYearEl = document.getElementById("filter-year");
const filterMonthEl = document.getElementById("filter-month");
const filterDayEl = document.getElementById("filter-day");
const clearFilterBtn = document.getElementById("clear-filter");
// Khởi tạo editIndex global
window.editIndex = null;

// Save + Render
const saveAndRender = () => {
  saveTransactions(); // tu storage.js
  form.reset();
  updateFilterOptions(); // tu app.js
  const filtered = filterTransactions(transactions, filterYearEl.value, filterMonthEl.value, filterDayEl.value);
  renderTransactions(filtered, list, incomeEl, expenseEl, balanceEl, typeEl, amountEl, categoryEl, saveAndRender);
};

// Update filter options
const updateFilterOptions = () => {
  const years = getAvailableYears(transactions);
  filterYearEl.innerHTML = '<option value="">All Years</option>';
  years.forEach(y => {
    const option = document.createElement('option');
    option.value = y;
    option.textContent = y;
    filterYearEl.appendChild(option);
  });
  // cap nhat day dropdown
  updateDayOptions();
};

const updateDayOptions = () => {
  const year = filterYearEl.value;
  const month = filterMonthEl.value;
  filterDayEl.innerHTML = '<option value="">All Days</option>';
  
  if (year && month) {
    const daysInMonth = new Date(Number(year), Number(month), 0).getDate();
    for (let i = 1; i <= daysInMonth; i++) {
      const option = document.createElement('option');
      option.value = i;
      option.textContent = i;
      filterDayEl.appendChild(option);
    }
  }
};

// Event Listeners

// Chặn dấu + và - trong Amount
amountEl.addEventListener("keydown", e => { 
  if (['+','-'].includes(e.key)) e.preventDefault(); 
});

// Submit form: Add / Edit
form.addEventListener("submit", e => {
  e.preventDefault();

  // Validate Amount
  const amountVal = Number(amountEl.value);
  if (!amountVal || amountVal <= 0) {
    alert("Please enter a valid Amount!");
    return;
  }

  const tx = { 
    type: typeEl.value, 
    amount: amountVal, 
    category: categoryEl.value, 
    date: window.editIndex !== null ? transactions[window.editIndex].date : new Date().toISOString()
  };

  addOrEditTransaction(tx); // tu storage.js
  window.editIndex = null;
  saveAndRender();
});

// Reset tat ca transactions
resetBtn.addEventListener("click", () => {
  if(confirm("Are you sure you want to reset all transactions?")) {
    resetTransactions(); // tu storage.js
    updateFilterOptions();
    renderTransactions(transactions, list, incomeEl, expenseEl, balanceEl, typeEl, amountEl, categoryEl, saveAndRender);
  }
});

// Filter events
filterYearEl.addEventListener("change", () => { updateDayOptions(); saveAndRender(); });
filterMonthEl.addEventListener("change", () => { updateDayOptions(); saveAndRender(); });
filterDayEl.addEventListener("change", () => { saveAndRender(); });

clearFilterBtn.addEventListener("click", () => {
  filterYearEl.value = "";
  filterMonthEl.value = "";
  filterDayEl.value = "";
  saveAndRender();
});
// Initialize
updateFilterOptions();
saveAndRender();
