const form = document.getElementById("transaction-form");
const amountInput = document.getElementById("amount");

// Validate Amount input - chỉ cho phép số nguyên và thập phân
amountInput.addEventListener("input", (e) => {
  let value = e.target.value;
  // Chỉ cho phép chữ số và dấu chấm
  value = value.replace(/[^0-9.]/g, "");
  // Chỉ cho phép một dấu chấm
  const parts = value.split(".");
  if (parts.length > 2) {
    value = parts[0] + "." + parts.slice(1).join("");
  }
  e.target.value = value;
});

form.addEventListener("submit", e => {
  e.preventDefault();
  const amountValue = parseFloat(amountInput.value);
  
  // Kiểm tra Amount hợp lệ
  if (!amountValue || amountValue <= 0) {
    alert("Amount phải lớn hơn 0!");
    amountInput.focus();
    return;
  }

  // Validate category
  const category = document.getElementById("category").value.trim();
  if (!category) {
    alert("Category không được để trống!");
    document.getElementById("category").focus();
    return;
  }
  
  const tx = {
    type: document.getElementById("type").value,
    amount: amountValue,
    category: category,
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

