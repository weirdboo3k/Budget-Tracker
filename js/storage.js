let transactions = [];
let editIndex = null;

const saveTransactions = () => {
  localStorage.setItem("transactions", JSON.stringify(transactions));
};

const loadTransactions = () => {
  const saved = localStorage.getItem("transactions");
  transactions = saved ? JSON.parse(saved) : [];
  renderTransactions(transactions);
};

const addOrEditTransaction = (tx) => {
  if (editIndex !== null) {
    const txToUpdate = transactions[editIndex];
    if (txToUpdate) {
      transactions[editIndex] = {
        ...txToUpdate,
        ...tx,
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
  transactions = transactions.filter(t => t.id != id);
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
