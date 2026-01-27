// =======================
// APP LOGIC
// =======================
const form = document.getElementById("transaction-form");
const listEl = document.getElementById("transaction-list");
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

// Save + render chung
const saveAndRender = () => {
  saveTransactions();
  form.reset();
  updateFilterOptions();
  const filtered = filterTransactions(transactions, filterYearEl.value, filterMonthEl.value, filterDayEl.value);
  renderTransactions(filtered, listEl, incomeEl, expenseEl, balanceEl, typeEl, amountEl, categoryEl, saveAndRender);
};

// Update filter dropdowns
const updateFilterOptions = () => {
  const years = getAvailableYears(transactions);
  filterYearEl.innerHTML = '<option value="">All Years</option>';
  years.forEach(y => {
    const opt = document.createElement('option');
    opt.value = y;
    opt.textContent = y;
    filterYearEl.appendChild(opt);
  });
  updateDayOptions();
};

const updateDayOptions = () => {
  const year = filterYearEl.value;
  const month = filterMonthEl.value;
  filterDayEl.innerHTML = '<option value="">All Days</option>';
  if(year && month) {
    const daysInMonth = new Date(Number(year), Number(month), 0).getDate();
    for(let i=1;i<=daysInMonth;i++){
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = i;
      filterDayEl.appendChild(opt);
    }
  }
};

// ------------------------
// Events
// ------------------------
amountEl.addEventListener("keydown", e => { if(['+','-'].includes(e.key)) e.preventDefault(); });

form.addEventListener("submit", e => {
  e.preventDefault();
  const amountVal = Number(amountEl.value);
  if(!amountVal || amountVal<=0){ alert("Please enter valid Amount"); return; }
  const tx = {
    type: typeEl.value,
    amount: amountVal,
    category: categoryEl.value,
    date: window.editIndex!==null ? transactions[window.editIndex].date : new Date().toISOString()
  };
  addOrEditTransaction(tx);
  window.editIndex = null;
  saveAndRender();
});

resetBtn.addEventListener("click", resetTransactions);
filterYearEl.addEventListener("change", () => { updateDayOptions(); saveAndRender(); });
filterMonthEl.addEventListener("change", () => { updateDayOptions(); saveAndRender(); });
filterDayEl.addEventListener("change", saveAndRender);
clearFilterBtn.addEventListener("click", () => {
  filterYearEl.value = "";
  filterMonthEl.value = "";
  filterDayEl.value = "";
  saveAndRender();
});

// ------------------------
// Initialize
// ------------------------
loadTransactions();
updateFilterOptions();
saveAndRender();
