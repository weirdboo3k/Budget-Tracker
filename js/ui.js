/**
 * UI rendering and interaction functions for the Budget Tracker
 */

// 日付を見やすい形式に変換する (日/月/年 時:分)
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${hours}:${minutes}`;
};

// 種類を日本語に翻訳 (income → 収入, expense → 支出)
const translateType = (type) => {
  return type === "income" ? "収入" : "支出";
};

// カテゴリを日本語に翻訳
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

// 取引一覧と合計を画面に表示
const renderTransactions = (transactions) => {
  const listEl = document.getElementById("transaction-list");
  const incomeEl = document.getElementById("total-income");
  const expenseEl = document.getElementById("total-expense");
  const balanceEl = document.getElementById("balance");

  listEl.innerHTML = "";
  let income = 0;      // 収入の合計
  let expense = 0;     // 支出の合計

  // 全ての取引をテーブルで表示
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

    // 編集ボタンをクリックしたとき
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

    // 削除ボタンをクリックしたとき
    tr.querySelector(".remove-btn").onclick = () => {
      if (confirm("この取引を削除しますか？")) {
        removeTransaction(transaction.id);
      }
    };

    listEl.appendChild(tr);

    // 収入と支出を計算
    if (transaction.type === "income") {
      income += transaction.amount;
    } else {
      expense += transaction.amount;
    }
  });

  // 合計情報を表示（収入 - 支出 = 残高）
  const balance = income - expense;
  balanceEl.textContent = `現在: ${balance}$`;
  balanceEl.className = balance >= 0 ? "income" : "expense";
  incomeEl.textContent = `${income}$`;
  expenseEl.textContent = `${expense}$`;

  // フィルタのドロップダウンとグラフを更新
  if (typeof updateFilterOptions === 'function') {
    updateFilterOptions();
  }
  updateChart();
};

// グラフのインスタンスを保存
let chart;

// グラフを更新（ドーナツ型チャート）
const updateChart = () => {
  const ctx = document.getElementById('summary-chart').getContext('2d');

  // 収入と支出の合計を計算
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // 既存のグラフを削除して新しいものを作成
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
