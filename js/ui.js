const formatDate = (s) => {
  const d = new Date(s);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()} ${hours}:${minutes}`;
};

const translateType = (type) => {
  return type === "income" ? "収入" : "支出";
};

const translateCategory = (category) => {
  const translations = {
    "Salary": "給与",
    "Freelance": "フリーランス",
    "Food": "食品",
    "Transport": "交通",
    "Entertainment": "エンターテイメント",
    "Utilities": "公共料金",
    "Other": "その他"
  };
  return translations[category] || category;
};

const renderTransactions = (transactions) => {
  const listEl = document.getElementById("transaction-list");
  const incomeEl = document.getElementById("total-income");
  const expenseEl = document.getElementById("total-expense");
  const balanceEl = document.getElementById("balance");

  listEl.innerHTML = "";
  let income = 0, expense = 0;

  transactions.forEach((t, i) => {
    const tr = document.createElement("tr");
    const amountClass = t.type === "income" ? "income" : "expense";
    tr.innerHTML = `
      <td>${translateType(t.type)}<br><small>${formatDate(t.date)}</small></td>
      <td class="${amountClass}">${t.type==="income"? "+" : "-"}${t.amount}$</td>
      <td>${translateCategory(t.category)}</td>
      <td>
        <button class="edit-btn">編集</button>
        <button class="remove-btn">削除</button>
      </td>
    `;
    // Edit button
    tr.querySelector(".edit-btn").onclick = () => {
      document.getElementById("type").value = t.type;
      document.getElementById("amount").value = t.amount;
      document.getElementById("category").value = t.category;
      editIndex = i;
      document.getElementById("type").focus();
      // Visual feedback
      const submitBtn = document.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.textContent = "更新";
      submitBtn.style.background = "#667eea";
    };
    // Remove button
    tr.querySelector(".remove-btn").onclick = () => {
      if(confirm("この取引を削除しますか？")) removeTransaction(t.id);
    };

    listEl.appendChild(tr);

    t.type === "income" ? income += t.amount : expense += t.amount;
  });

  balanceEl.textContent = `現在: ${income - expense}$`;
  const balance = income - expense;
  balanceEl.className = balance >= 0 ? "income" : "expense";
  incomeEl.textContent = `${income}$`;
  expenseEl.textContent = `${expense}$`;

  // Update filter options
  if (typeof updateFilterOptions === 'function') {
    updateFilterOptions();
  }

  // Update chart
  updateChart();
};

let chart;

const updateChart = () => {
  const ctx = document.getElementById('summary-chart').getContext('2d');
  const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['収入', '支出'],
      datasets: [{
        data: [income, expense],
        backgroundColor: ['#28a745', '#dc3545'],
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
        }
      }
    }
  });
};
