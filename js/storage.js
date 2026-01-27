let transactions = [];
let editIndex = null;

// API Base URL - adjust if needed for production
const API_BASE_URL = window.location.origin;

const saveTransactions = () => {
  localStorage.setItem("transactions", JSON.stringify(transactions));
};

const loadTransactions = () => {
  fetch(`${API_BASE_URL}/transactions`)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    })
    .then(data => {
      transactions = Array.isArray(data) ? data : [];
      saveTransactions();
      renderTransactions(transactions);
    })
    .catch(error => {
      console.error("Error loading transactions:", error);
      // Fallback to localStorage
      const saved = localStorage.getItem("transactions");
      transactions = saved ? JSON.parse(saved) : [];
      renderTransactions(transactions);
    });
};

const addOrEditTransaction = (tx) => {
  if (editIndex !== null) {
    const txToUpdate = transactions[editIndex];
    if (txToUpdate && txToUpdate.id) {
      fetch(`${API_BASE_URL}/transactions/${txToUpdate.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...tx, date: new Date().toISOString() }),
      })
        .then(res => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          return res.json();
        })
        .then(updatedTx => {
          transactions[editIndex] = updatedTx;
          editIndex = null;
          saveTransactions();
          renderTransactions(transactions);
        })
        .catch(error => {
          console.error("Error updating transaction:", error);
          // Fallback: update locally
          transactions[editIndex] = tx;
          editIndex = null;
          saveTransactions();
          renderTransactions(transactions);
        });
    }
    return;
  }

  fetch(`${API_BASE_URL}/transactions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...tx, date: new Date().toISOString() }),
  })
    .then(res => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    })
    .then(savedTx => {
      transactions.push(savedTx);
      saveTransactions();
      renderTransactions(transactions);
    })
    .catch(error => {
      console.error("Error adding transaction:", error);
      // Fallback: add locally with temporary ID
      const tx_with_id = {
        ...tx,
        id: Date.now(),
        date: new Date().toISOString()
      };
      transactions.push(tx_with_id);
      saveTransactions();
      renderTransactions(transactions);
    });
};

const removeTransaction = (id) => {
  fetch(`${API_BASE_URL}/transactions/${id}`, { 
    method: "DELETE",
    headers: { "Content-Type": "application/json" }
  })
    .then(res => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    })
    .then(() => {
      transactions = transactions.filter(t => t.id != id);
      saveTransactions();
      renderTransactions(transactions);
    })
    .catch(error => {
      console.error("Error removing transaction:", error);
      // Fallback: remove locally
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
