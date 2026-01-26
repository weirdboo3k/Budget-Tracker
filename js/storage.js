let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let editIndex = null; // lưu index khi edit

// Lưu vào localStorage
const saveTransactions = () => {
  localStorage.setItem("transactions", JSON.stringify(transactions));
};

// Thêm hoặc chỉnh sửa transaction
const addOrEditTransaction = (tx) => {
  if (editIndex !== null) {
    transactions[editIndex] = tx;
    editIndex = null;
  } else {
    transactions.push(tx);
  }
  saveTransactions();
};

// Xóa tất cả transaction
const resetTransactions = () => {
  transactions = [];
  localStorage.removeItem("transactions");
};
