const form = document.getElementById("transaction-form");
const amountInput = document.getElementById("amount");

// Validate Amount input - only allow integers and decimals
amountInput.addEventListener("input", (e) => {
  let value = e.target.value;
  // Only allow digits and decimal point
  value = value.replace(/[^0-9.]/g, "");
  // Allow only one decimal point
  const parts = value.split(".");
  if (parts.length > 2) {
    value = parts[0] + "." + parts.slice(1).join("");
  }
  e.target.value = value;
});

form.addEventListener("submit", e => {
  e.preventDefault();
  const amountValue = parseFloat(amountInput.value);

  // Validate Amount
  if (!amountValue || amountValue <= 0) {
    alert("金額は0より大きくなければなりません！");
    amountInput.focus();
    return;
  }

  // Validate category
  const category = document.getElementById("category").value;
  if (!category) {
    alert("カテゴリを選択してください！");
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
  const submitBtn = document.querySelector('button[type="submit"]');
  if (submitBtn) submitBtn.textContent = "追加";
  editIndex = null;
});

document.getElementById("reset-btn").addEventListener("click", () => {
  resetTransactions();
});

// Load data on startup
loadTransactions();

// Dark mode toggle
document.getElementById("theme-toggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const btn = document.getElementById("theme-toggle");
  btn.textContent = document.body.classList.contains("dark") ? "☀️ ライトモード" : "🌙 ダークモード";
});

