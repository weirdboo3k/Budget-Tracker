const form = document.getElementById("transaction-form");

form.addEventListener("submit", e => {
  e.preventDefault();
  const tx = {
    type: document.getElementById("type").value,
    amount: parseFloat(document.getElementById("amount").value),
    category: document.getElementById("category").value,
    date: new Date().toISOString()
  };
  addOrEditTransaction(tx);
  form.reset();
});

document.getElementById("reset-btn").addEventListener("click", () => {
  if(confirm("Reset all transactions?")) resetTransactions();
});

// Load dữ liệu lần đầu
loadTransactions();
