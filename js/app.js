/**
 * Main application logic for the Budget Tracker
 */

// DOM elements
const form = document.getElementById("transaction-form");
const amountInput = document.getElementById("amount");

// 金額の入力をチェック - 数字とドットだけ許可
amountInput.addEventListener("input", (e) => {
  let value = e.target.value;

  // 数字とドット以外を削除
  value = value.replace(/[^0-9.]/g, "");

  // ドットは1個だけにする
  const parts = value.split(".");
  if (parts.length > 2) {
    value = parts[0] + "." + parts.slice(1).join("");
  }

  e.target.value = value;
});

// フォームの送信処理 - 新しいデータを追加または編集
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const amountValue = parseFloat(amountInput.value);

  // 金額のバリデーション - 0より大きい数字を確認
  if (!amountValue || amountValue <= 0) {
    alert("金額は0より大きくなければなりません！");
    amountInput.focus();
    return;
  }

  // カテゴリが選択されているか確認
  const category = document.getElementById("category").value;
  if (!category) {
    alert("カテゴリを選択してください！");
    document.getElementById("category").focus();
    return;
  }

  // トランザクションオブジェクトを作成
  const transaction = {
    type: document.getElementById("type").value,
    amount: amountValue,
    category: category,
    date: new Date().toISOString()
  };

  // データを追加または編集
  addOrEditTransaction(transaction);

  // フォームをリセット
  form.reset();
  const submitBtn = document.querySelector('button[type="submit"]');
  if (submitBtn) submitBtn.textContent = "追加";
  editIndex = null;
});

// リセットボタンをクリックしたときの処理
document.getElementById("reset-btn").addEventListener("click", () => {
  resetTransactions();
});

// ダークモード切り替えボタン
document.getElementById("theme-toggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const btn = document.getElementById("theme-toggle");
  btn.textContent = document.body.classList.contains("dark") ? "☀️ ライトモード" : "🌙 ダークモード";
});

// アプリを起動
loadTransactions();

