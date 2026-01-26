
// == DOM ELEMENTS ==
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

// == DATA ==
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let editIndex = null; // luu index sau khi edit

// == HELPER FUNCTIONS ==

// Format so voi 2 chu so
const pad = n => String(n).padStart(2, '0');

// Tao date string theo local time (format: YYYY-MM-DDTHH:mm:ss)
const getDateStr = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;

// Parse date string va format hien thi (dd/mm/yyyy HH:MM)
const formatDate = (s) => {
  if (!s) s = getDateStr();
  let d;
  if (s.includes('T') && !s.includes('Z') && !s.includes('+')) {
    // Format local: YYYY-MM-DDTHH:mm:ss
    const [dp, tp] = s.split('T');
    const [y, m, day] = dp.split('-').map(Number);
    const [h, min] = tp.split(':').map(Number);
    d = new Date(y, m - 1, day, h, min);
  } else d = new Date(s);
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

// Luu vao localStorage va render lai
const saveAndRender = () => {
  localStorage.setItem("transactions", JSON.stringify(transactions));
  form.reset();
  updateFilterOptions();
  render();
};

// Lay date object tu date string
const getDateFromStr = (s) => {
  if (!s) return null;
  if (s.includes('T') && !s.includes('Z') && !s.includes('+')) {
    const [dp, tp] = s.split('T');
    const [y, m, day] = dp.split('-').map(Number);
    const [h, min] = tp.split(':').map(Number);
    return new Date(y, m - 1, day, h, min);
  }
  return new Date(s);
};

// Loc transactions theo nam, thang, ngay
const filterTransactions = () => {
  const year = filterYearEl.value;
  const month = filterMonthEl.value;
  const day = filterDayEl.value;
  
  if (!year && !month && !day) return transactions;
  
  return transactions.filter(t => {
    const d = getDateFromStr(t.date);
    if (!d) return false;
    
    if (year && d.getFullYear() !== Number(year)) return false;
    if (month && d.getMonth() + 1 !== Number(month)) return false;
    if (day && d.getDate() !== Number(day)) return false;
    
    return true;
  });
};

// Cap nhat filter options
const updateFilterOptions = () => {
  // Lay tat ca years tu transactions
  const years = [...new Set(transactions.map(t => {
    const d = getDateFromStr(t.date);
    return d ? d.getFullYear() : null;
  }).filter(y => y !== null))].sort((a, b) => b - a);
  
  // Cap nhat year dropdown
  filterYearEl.innerHTML = '<option value="">All Years</option>';
  years.forEach(y => {
    const option = document.createElement('option');
    option.value = y;
    option.textContent = y;
    filterYearEl.appendChild(option);
  });
  
  // Cap nhat day dropdown neu co year va month
  updateDayOptions();
};

// Cap nhat day options
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

// == EVENT LISTENERS ==

// Chan dau + va - trong Amount input
amountEl.addEventListener("keydown", (e) => {
  if (['+', '-'].includes(e.key)) {
    e.preventDefault();
  }
});

// Form submit - Add hoac Edit transaction
form.addEventListener("submit", e => {
  e.preventDefault();
  const tx = { 
    type: typeEl.value, 
    amount: Number(amountEl.value), 
    category: categoryEl.value, 
    date: editIndex !== null ? transactions[editIndex].date : getDateStr() // Giữ date cũ khi edit
  };
  editIndex !== null ? transactions[editIndex] = tx : transactions.push(tx);
  editIndex = null;
  saveAndRender();
});

// Reset toan bo giao dich
resetBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to reset all transactions?")) {
    transactions = [];
    localStorage.removeItem("transactions");
    updateFilterOptions();
    render();
  }
});

// Filter event listeners
filterYearEl.addEventListener("change", () => {
  updateDayOptions();
  render();
});

filterMonthEl.addEventListener("change", () => {
  updateDayOptions();
  render();
});

filterDayEl.addEventListener("change", () => {
  render();
});

clearFilterBtn.addEventListener("click", () => {
  filterYearEl.value = "";
  filterMonthEl.value = "";
  filterDayEl.value = "";
  render();
});

// == RENDER FUNCTION ==

// Render danh sach giao dich
function render() {
  list.innerHTML = "";
  let income = 0, expense = 0;
  
  const filtered = filterTransactions();
  
  filtered.forEach((t) => {
    const i = transactions.indexOf(t);
    // Tinh tong income va expense
    t.type === "income" ? income += t.amount : expense += t.amount;
    const isInc = t.type === "income";
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
        <div class="type-cell">
          <div>${t.type}</div>
          <div class="type-date">${formatDate(t.date)}</div>
        </div>
      </td>
      <td class="${isInc ? "income" : "expense"}">${isInc ? "+" : "-"}${t.amount}$</td>
      <td>${t.category}</td>
      <td>
        <button class="edit-btn">Edit</button>
        <button class="remove-btn">Remove</button>
      </td>
    `;
    
    // Edit transaction
    tr.querySelector(".edit-btn").onclick = () => { 
      typeEl.value = t.type; 
      amountEl.value = t.amount; 
      categoryEl.value = t.category; 
      editIndex = i; 
    };
    
    // Remove transaction
    tr.querySelector(".remove-btn").onclick = () => { 
      if (confirm("Remove this transaction?")) { 
        transactions.splice(i, 1); 
        saveAndRender(); 
      } 
    };
    
    list.appendChild(tr);
  });
  
  // Hien thi tong ket
  const balance = income - expense;
  incomeEl.textContent = `${income}$`;
  expenseEl.textContent = `${expense}$`;
  balanceEl.textContent = `Current: ${balance}$`;
  balanceEl.style.color = balance >= 0 ? "green" : "red";
}

// Khoi tao
updateFilterOptions();
render();
