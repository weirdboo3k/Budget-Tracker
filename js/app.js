const form = document.querySelector("form");
const list = document.getElementById("transaction-list");
const incomeEl = document.getElementById("total-income");
const expenseEl = document.getElementById("total-expense");
const balanceEl = document.getElementById("balance");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// Load khi trang mo ra
render();

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const type = document.querySelector("select").value;
  const amount = Number(document.querySelector("input[type='number']").value);
  const category = document.querySelector("input[placeholder='Food, Rent, Salary...']").value;
  const note = document.querySelector("input[placeholder='Optional note']").value;

  const transaction = { type, amount, category, note };
  transactions.push(transaction);

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

    tr.innerHTML = `
      <td>${t.type}</td>
      <td>${t.amount}</td>
      <td>${t.category}</td>
      <td>${t.note}</td>
    `;

    list.appendChild(tr);

    if (t.type === "income") income += t.amount;
    else expense += t.amount;
  });

  incomeEl.textContent = income;
  expenseEl.textContent = expense;
  balanceEl.textContent = income - expense;
}

// chart 
const ctx = document.getElementById('budgetChart').getContext('2d');

let budgetChart = new Chart(ctx, {
  type: 'pie',
  data: {
    labels: ['Income', 'Expense'],
    datasets: [{
      data: [0, 0],
      backgroundColor: ['#4caf50', '#f44336']
    }]
  }
});
