// ===== DOM =====
const form = document.getElementById("transaction-form");
const list = document.getElementById("transaction-list");
const incomeEl = document.getElementById("total-income");
const expenseEl = document.getElementById("total-expense");
const balanceEl = document.getElementById("balance");

const typeEl = document.getElementById("type");
const amountEl = document.getElementById("amount");
const categoryEl = document.getElementById("category");
const noteEl = document.getElementById("note");

// ===== DATA =====
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// ===== CHART =====
const ctx = document.getElementById("budgetChart").getContext("2d");

let budgetChart = new Chart(ctx, {
  type: "doughnut",
  data: {
    labels: ["Spent", "Remaining"],
    datasets: [
      {
        data: [0, 0],
        backgroundColor: ["#f44336", "#4caf50"]
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "bottom"
      }
    }
  }
});


// ===== EVENT =====
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const amount = Number(amountEl.value);

  // ✅ validate input
  if (isNaN(amount) || amount <= 0) {
    alert("Please enter a valid amount");
    return;
  }

  const transaction = {
    type: typeEl.value,
    amount: amount,
    category: categoryEl.value.trim(),
    note: noteEl.value.trim()
  };

  transactions.push(transaction);
  localStorage.setItem("transactions", JSON.stringify(transactions));

  form.reset();
  render();
});

// ===== RENDER =====
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
      <td>${t.note || "-"}</td>
    `;
    list.appendChild(tr);

    if (t.type === "income") income += t.amount;
    else expense += t.amount;
  });

  incomeEl.textContent = income;
  expenseEl.textContent = expense;
  balanceEl.textContent = income - expense;

  updateChart(income, expense);
}

// ===== CHART UPDATE =====
function updateChart(income, expense) {
  const remaining = Math.max(income - expense, 0);

  budgetChart.data.datasets[0].data = [expense, remaining];
  budgetChart.update();
}


// ===== INIT =====
render();
