/**
 * Data storage and management functions for the Budget Tracker
 */

// Global variables
let transactions = [];
let editIndex = null;

/**
 * Saves transactions to localStorage
 */
const saveTransactions = () => {
  try {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  } catch (error) {
    console.error("Error saving transactions:", error);
    alert("データの保存エラー。ストレージが満杯かもしれません。");
  }
};

/**
 * Loads transactions from localStorage and renders them
 */
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

/**
 * Adds a new transaction or edits an existing one
 * @param {Object} transaction - Transaction object
 */
const addOrEditTransaction = (transaction) => {
  if (editIndex !== null) {
    // Edit existing transaction
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
    // Add new transaction
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

/**
 * Removes a transaction by ID
 * @param {number} id - Transaction ID
 */
const removeTransaction = (id) => {
  transactions = transactions.filter(transaction => transaction.id !== id);
  saveTransactions();
  renderTransactions(transactions);
};

/**
 * Resets all transactions
 */
const resetTransactions = () => {
  if (confirm("すべての取引をリセットしますか？")) {
    transactions = [];
    localStorage.removeItem("transactions");
    renderTransactions(transactions);
  }
};

/**
 * Fetches all transactions (for potential API integration)
 * @returns {Promise<Array>} Promise resolving to transactions array
 */
const fetchTransactions = () => {
  return Promise.resolve(transactions);
};

/**
 * Exports transactions to CSV file
 */
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
