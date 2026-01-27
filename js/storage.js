let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let editIndex = null; // lưu index khi edit

// Lưu vào localStorage
const saveTransactions = () => {
  localStorage.setItem("transactions", JSON.stringify(transactions));
};

// Hàm render transactions
const renderTransactions = () => {
  // TODO: viết render theo table hoặc list
};

// Load transactions từ backend khi mở trang
fetch("http://localhost:3001/transactions")
  .then(res => res.json())
  .then(data => {
    transactions = data;
    saveTransactions();
    renderTransactions();
  })
  .catch(err => console.log("Error loading transactions from API", err));

// Thêm hoặc chỉnh sửa transaction
const addOrEditTransaction = (tx) => {
  // EDIT
  if (editIndex !== null) {
    transactions[editIndex] = tx;
    editIndex = null;
    saveTransactions();
    renderTransactions();
    return;
  }

  // ADD: gọi API
  fetch("http://localhost:3001/transactions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tx),
  })
    .then(res => res.json())
    .then(savedTx => {
      transactions.push(savedTx);
      saveTransactions();
      renderTransactions();
    })
    .catch(err => console.log("Error adding transaction", err));
};

// Remove transaction qua API
const removeTransaction = (id) => {
  fetch(`http://localhost:3001/transactions/${id}`, { method: "DELETE" })
    .then(() => {
      transactions = transactions.filter(t => t.id !== id);
      saveTransactions();
      renderTransactions();
    })
    .catch(err => console.log("Error removing transaction", err));
};

// Reset tất cả transactions
const resetTransactions = () => {
  // nếu muốn xoá tất cả backend, backend cần hỗ trợ DELETE all
  transactions = [];
  localStorage.removeItem("transactions");
  renderTransactions();
};
