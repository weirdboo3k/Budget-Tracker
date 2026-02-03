/**
 * Main application logic for the Budget Tracker
 */

// DOM elements
const form = document.getElementById("transaction-form");
const amountInput = document.getElementById("amount");

/**
 * Validates and formats amount input to allow only numbers and one decimal point
 */
amountInput.addEventListener("input", (e) => {
  let value = e.target.value;

  // Remove non-numeric characters except decimal point
  value = value.replace(/[^0-9.]/g, "");

  // Ensure only one decimal point
  const parts = value.split(".");
  if (parts.length > 2) {
    value = parts[0] + "." + parts.slice(1).join("");
  }

  e.target.value = value;
});

/**
 * Handles form submission for adding/editing transactions
 */
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const amountValue = parseFloat(amountInput.value);

  // Validate amount
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

  // Create transaction object
  const transaction = {
    type: document.getElementById("type").value,
    amount: amountValue,
    category: category,
    date: new Date().toISOString()
  };

  // Add or edit transaction
  addOrEditTransaction(transaction);

  // Reset form
  form.reset();
  const submitBtn = document.querySelector('button[type="submit"]');
  if (submitBtn) submitBtn.textContent = "追加";
  editIndex = null;
});

/**
 * Handles reset button click
 */
document.getElementById("reset-btn").addEventListener("click", () => {
  resetTransactions();
});

/**
 * Handles dark mode toggle
 */
document.getElementById("theme-toggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const btn = document.getElementById("theme-toggle");
  btn.textContent = document.body.classList.contains("dark") ? "☀️ ライトモード" : "🌙 ダークモード";
});

// Initialize app
loadTransactions();

