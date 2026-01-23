const form = document.getElementById("transaction-form");
const list = document.getElementById("transaction-list");
const incomeEl = document.getElementById("total-income");
const expenseEl = document.getElementById("total-expense");
const balanceEl = document.getElementById("balance");
const resetBtn = document.getElementById("reset-btn");

const typeEl = document.getElementById("type");
const amountEl = document.getElementById("amount");
const categoryEl = document.getElementById("category");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let editIndex = null; // luu index sau khi edit

form.addEventListener("submit", e => {
  e.preventDefault();

  const newTx = {
    type: typeEl.value,
    amount: Number(amountEl.value),
    category: categoryEl.value
  };

  if (editIndex !== null) {
    transactions[editIndex] = newTx;
    editIndex = null;
  } else {
    transactions.push(newTx);
  }

  localStorage.setItem("transactions", JSON.stringify(transactions));
  form.reset();
  render();
});

// Reset toan bo giao dich
resetBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to reset all transactions?")) {
    transactions = [];
    localStorage.removeItem("transactions");
    render();
  }
});

function render() {
  list.innerHTML = "";

  let income = 0;
  let expense = 0;
  let currentBalance = 0;

  transactions.forEach((t, index) => {
    if (t.type === "income") {
      income += t.amount;
      currentBalance += t.amount;
    } else {
      expense += t.amount;
      currentBalance -= t.amount;
    }

    const tr = document.createElement("tr");
    const sign = t.type === "income" ? "+" : "-";
    const className = t.type === "income" ? "income" : "expense";

    tr.innerHTML = `
      <td>${t.type}</td>
      <td class="${className}">${sign}${t.amount}$</td>
      <td>${t.category}</td>
      <td>
        <button class="edit-btn">Edit</button>
        <button class="remove-btn">Remove</button>
      </td>
    `;

    //  Edit
    tr.querySelector(".edit-btn").addEventListener("click", () => {
      typeEl.value = t.type;
      amountEl.value = t.amount;
      categoryEl.value = t.category;
      editIndex = index;
    });

    //  Remove
    tr.querySelector(".remove-btn").addEventListener("click", () => {
      if (confirm("Remove this transaction?")) {
        transactions.splice(index, 1);
        localStorage.setItem("transactions", JSON.stringify(transactions));
        render();
      }
    });

    list.appendChild(tr);
  });

  incomeEl.textContent = `${income}$`;
  expenseEl.textContent = `${expense}$`;
  balanceEl.textContent = `Current: ${currentBalance}$`;
  balanceEl.style.color = currentBalance >= 0 ? "green" : "red";
}

render();
