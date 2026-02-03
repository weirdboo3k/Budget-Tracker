// データ管理ファイル - localStorage を使ってデータを保存

// グローバル変数
let transactions = [];
let editIndex = null;  // 編集中のインデックス

// localStorageに取引データを保存する関数
const saveTransactions = () => {
  try {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  } catch (error) {
    console.error("Error saving transactions:", error);
    alert("データの保存エラー。ストレージが満杯かもしれません。");
  }
};

// localStorageからデータを読み込む
const loadTransactions = () => {
  try {
    const saved = localStorage.getItem("transactions");
    transactions = saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("Error loading transactions:", error);
    transactions = [];
  }
  renderTransactions(transactions);
};

// 新しいデータを追加 または 既存のデータを編集
const addOrEditTransaction = (transaction) => {
  if (editIndex !== null) {
    // 既存のデータを編集する場合
    const existingTransaction = transactions[editIndex];
    if (existingTransaction) {
      transactions[editIndex] = {
        id: existingTransaction.id,
        type: transaction.type,
        amount: transaction.amount,
        category: transaction.category,
        date: existingTransaction.date // Keep original date
      };
      editIndex = null;
    }
  } else {
    // 新しいデータを追加する場合
    const newTransaction = {
      ...transaction,
      id: Date.now(),
      date: new Date().toISOString()
    };
    transactions.push(newTransaction);
  }

  saveTransactions();
  renderTransactions(transactions);
};

// IDで指定した取引を削除
const removeTransaction = (id) => {
  transactions = transactions.filter(transaction => transaction.id !== id);
  saveTransactions();
  renderTransactions(transactions);
};

// すべてのデータをリセット（削除）
const resetTransactions = () => {
  if (confirm("すべての取引をリセットしますか？")) {
    transactions = [];
    localStorage.removeItem("transactions");
    renderTransactions(transactions);
  }
};

// APIとの連携が必要な場合に全データを取得
const fetchTransactions = () => {
  return Promise.resolve(transactions);
};

// 取引データをCSVファイルでエクスポート
const exportToCSV = () => {
  const csvContent = "data:text/csv;charset=utf-8,"
    + "タイプ,金額,カテゴリ,日付\n"
    + transactions.map(t => `${t.type},${t.amount},${t.category},${formatDate(t.date)}`).join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "transactions.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Event listeners
document.getElementById("export-btn").addEventListener("click", exportToCSV);
