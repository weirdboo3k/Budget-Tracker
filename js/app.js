const form = document.getElementById("transaction-form");
const list = document.getElementById("transaction-list");
const incomeEl = document.getElementById("total-income");
const expenseEl = document.getElementById("total-expense");
const balanceEl = document.getElementById("balance");

const typeEl = document.getElementById("type");
const amountEl = document.getElementById("amount");
const categoryEl = document.getElementById("category");
const noteEl = document.getElementById("note");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

form.addEventListener("submit", e => {
  e.preventDefault();

  transactions.push({
    type: typeEl.value,
    amount: Number(amountEl.value),
    category: categoryEl.value,
    note: noteEl.value
  });

  localStorage.setItem("transactions", JSON.stringify(transactions));
  form.reset();
  render();
});

function render() {
  list.innerHTML = "";

  let income = 0;
  let expense = 0;

  transactions.forEach(t => {
    const tr = document.createElement("tr");

    const sign = t.type === "income" ? "+" : "-";
    const className = t.type === "income" ? "income" : "expense";

    tr.innerHTML = `
      <td>${t.type}</td>
      <td class="${className}">${sign}${t.amount}</td>
      <td>${t.category}</td>
      <td>${t.note || "-"}</td>
    `;

    list.appendChild(tr);

    if (t.type === "income") income += t.amount;
    else expense += t.amount;
  });

  incomeEl.textContent = income;
  expenseEl.textContent = expense;
  balanceEl.textContent = income - expense;

  balanceEl.style.color = income - expense >= 0 ? "green" : "red";
}

render();
