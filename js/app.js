// DOM elements
const form = document.getElementById("transaction-form");
const list = document.getElementById("transaction-list");
const incomeEl = document.getElementById("total-income");
const expenseEl = document.getElementById("total-expense");
const balanceEl = document.getElementById("balance");
const resetBtn = document.getElementById("reset-btn");
const typeEl = document.getElementById("type");
const amountEl = document.getElementById("amount");
const categoryEl = document.getElementById("category");

// Data
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let editIndex = null; // luu index sau khi edit

//  Format số với 2 chữ số
const pad = n => String(n).padStart(2, '0');

//  tao date string theo local time
const getDateStr = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;

// Parse date string va format hien thi
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

//  save va render
const saveAndRender = () => {
  localStorage.setItem("transactions", JSON.stringify(transactions));
  form.reset();
  render();
};

// Chan dau + va - trong Amount
amountEl.addEventListener("keydown", (e) => {
  if (['+', '-'].includes(e.key)) {
    e.preventDefault();
  }
});

// Form submit
form.addEventListener("submit", e => {
  e.preventDefault();
  const tx = { 
    type: typeEl.value, 
    amount: Number(amountEl.value), 
    category: categoryEl.value, 
    date: editIndex !== null ? transactions[editIndex].date : getDateStr() 
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
    render();
  }
});

// Render danh sach giao dich
function render() {
  list.innerHTML = "";
  let income = 0, expense = 0;
  
  transactions.forEach((t, i) => {
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

render();
