/**
 * UI rendering and interaction functions for the Budget Tracker
 */

/**
 * Formats a date string to DD/MM/YYYY HH:MM format
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${hours}:${minutes}`;
};

/**
 * Translates transaction type to Japanese
 * @param {string} type - 'income' or 'expense'
 * @returns {string} Japanese translation
 */
const translateType = (type) => {
  return type === "income" ? "収入" : "支出";
};

/**
 * Translates category to Japanese
 * @param {string} category - English category name
 * @returns {string} Japanese translation
 */
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

/**
 * Renders the transaction list and summary
 * @param {Array} transactions - Array of transaction objects
 */
const renderTransactions = (transactions) => {
  const listEl = document.getElementById("transaction-list");
  const incomeEl = document.getElementById("total-income");
  const expenseEl = document.getElementById("total-expense");
  const balanceEl = document.getElementById("balance");

  listEl.innerHTML = "";
  let income = 0;
  let expense = 0;

  transactions.forEach((transaction, index) => {
    const tr = document.createElement("tr");
    const amountClass = transaction.type === "income" ? "income" : "expense";

    tr.innerHTML = `
      <td>${translateType(transaction.type)}<br><small>${formatDate(transaction.date)}</small></td>
      <td class="${amountClass}">${transaction.type === "income" ? "+" : "-"}${transaction.amount}$</td>
      <td>${translateCategory(transaction.category)}</td>
      <td>
        <button class="edit-btn">編集</button>
        <button class="remove-btn">削除</button>
      </td>
    `;

    // Edit button handler
    tr.querySelector(".edit-btn").onclick = () => {
      document.getElementById("type").value = transaction.type;
      document.getElementById("amount").value = transaction.amount;
      document.getElementById("category").value = transaction.category;
      editIndex = index;
      document.getElementById("type").focus();

      // Update submit button
      const submitBtn = document.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.textContent = "更新";
        submitBtn.style.background = "#667eea";
      }
    };

    // Remove button handler
    tr.querySelector(".remove-btn").onclick = () => {
      if (confirm("この取引を削除しますか？")) {
        removeTransaction(transaction.id);
      }
    };

    listEl.appendChild(tr);

    // Calculate totals
    if (transaction.type === "income") {
      income += transaction.amount;
    } else {
      expense += transaction.amount;
    }
  });

  // Update summary
  const balance = income - expense;
  balanceEl.textContent = `現在: ${balance}$`;
  balanceEl.className = balance >= 0 ? "income" : "expense";
  incomeEl.textContent = `${income}$`;
  expenseEl.textContent = `${expense}$`;

  // Update filters and chart
  if (typeof updateFilterOptions === 'function') {
    updateFilterOptions();
  }
  updateChart();
};

/**
 * Global chart instance
 */
let chart;

/**
 * Updates the summary chart
 */
const updateChart = () => {
  const ctx = document.getElementById('summary-chart').getContext('2d');

  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  if (chart) {
    chart.destroy();
  }

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
