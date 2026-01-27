let transactions = [];
let editIndex = null;

const saveTransactions = () => {
  try {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  } catch (e) {
    console.error("Error saving transactions:", e);
    alert("Error saving data. Your storage might be full.");
  }
};

const loadTransactions = () => {
  try {
    const saved = localStorage.getItem("transactions");
    transactions = saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.error("Error loading transactions:", e);
    transactions = [];
  }
  renderTransactions(transactions);
};

const addOrEditTransaction = (tx) => {
  if (editIndex !== null) {
    const txToUpdate = transactions[editIndex];
    if (txToUpdate) {
      transactions[editIndex] = {
        id: txToUpdate.id,
        type: tx.type,
        amount: tx.amount,
        category: tx.category,
        date: txToUpdate.date
      };
      editIndex = null;
    }
  } else {
    const tx_with_id = {
      ...tx,
      id: Date.now(),
      date: new Date().toISOString()
    };
    transactions.push(tx_with_id);
  }
  saveTransactions();
  renderTransactions(transactions);
};

const removeTransaction = (id) => {
  transactions = transactions.filter(t => t.id !== id);
  saveTransactions();
  renderTransactions(transactions);
};

const resetTransactions = () => {
  if (confirm("Reset all transactions?")) {
    transactions = [];
    localStorage.removeItem("transactions");
    renderTransactions(transactions);
  }
};

const fetchTransactions = () => {
  return Promise.resolve(transactions);
};
