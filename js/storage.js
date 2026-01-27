let transactions = [];
let editIndex = null;

const saveTransactions = () => {
  localStorage.setItem("transactions", JSON.stringify(transactions));
};

const loadTransactions = () => {
  fetch("/transactions")
    .then(res => res.json())
    .then(data => {
      transactions = data;
      saveTransactions();
      renderTransactions(transactions);
    });
};

const addOrEditTransaction = (tx) => {
  if (editIndex !== null) {
    transactions[editIndex] = tx;
    editIndex = null;
    saveTransactions();
    renderTransactions(transactions);
    return;
  }

  fetch("/transactions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tx),
  })
    .then(res => res.json())
    .then(savedTx => {
      transactions.push(savedTx);
      saveTransactions();
      renderTransactions(transactions);
    });
};

const removeTransaction = (id) => {
  fetch(`/transactions/${id}`, { method: "DELETE" })
    .then(() => {
      transactions = transactions.filter(t => t.id != id);
      saveTransactions();
      renderTransactions(transactions);
    });
};

const resetTransactions = () => {
  transactions = [];
  localStorage.removeItem("transactions");
  renderTransactions(transactions);
};
