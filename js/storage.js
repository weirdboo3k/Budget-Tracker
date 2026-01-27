// =======================
// STORAGE & API
// =======================
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
window.editIndex = null; // global

const saveTransactions = () => {
  localStorage.setItem("transactions", JSON.stringify(transactions));
};

// Load từ backend
const loadTransactions = () => {
  fetch("http://localhost:3001/transactions")
    .then(res => res.json())
    .then(data => {
      transactions = data;
      saveTransactions();
      saveAndRender();
    })
    .catch(err => console.log("Backend not reachable, using LocalStorage", err));
};

// Add / Edit transaction
const addOrEditTransaction = (tx) => {
  if (window.editIndex !== null) {
    transactions[window.editIndex] = tx;
    window.editIndex = null;
    saveTransactions();
    saveAndRender();
    return;
  }

  // Add via backend
  fetch("http://localhost:3001/transactions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tx),
  })
    .then(res => res.json())
    .then(savedTx => {
      transactions.push(savedTx);
      saveTransactions();
      saveAndRender();
    })
    .catch(err => {
      console.log("Backend error, saving to LocalStorage only", err);
      tx.id = Date.now();
      transactions.push(tx);
      saveTransactions();
      saveAndRender();
    });
};

// Remove transaction
const removeTransactionById = (id) => {
  fetch(`http://localhost:3001/transactions/${id}`, { method: "DELETE" })
    .then(() => {
      transactions = transactions.filter(t => t.id !== id);
      saveTransactions();
      saveAndRender();
    })
    .catch(err => {
      console.log("Backend remove failed, removing locally", err);
      transactions = transactions.filter(t => t.id !== id);
      saveTransactions();
      saveAndRender();
    });
};

// Reset all
const resetTransactions = () => {
  if(confirm("Are you sure you want to reset all transactions?")) {
    transactions = [];
    localStorage.removeItem("transactions");
    saveAndRender();
  }
};
