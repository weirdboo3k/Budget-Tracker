// =======================
// UI
// =======================
const pad = n => String(n).padStart(2, '0');
const formatDate = (s) => {
  if (!s) s = new Date().toISOString();
  const d = getDateFromStr(s);
  return `${pad(d.getDate())}/${pad(d.getMonth()+1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const renderTransactions = (txs, listEl, incomeEl, expenseEl, balanceEl, typeEl, amountEl, categoryEl, saveAndRender) => {
  listEl.innerHTML = "";
  let income = 0, expense = 0;

  txs.forEach((t, i) => {
    t.type === "income" ? income += t.amount : expense += t.amount;
    const isInc = t.type === "income";
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
        <div class="type-cell">
          <div>${t.type}</div>
          <div class="type-date">${formatDate(t.date)}</div>
        </div>
      </td>
      <td class="${isInc ? "income" : "expense"}">${isInc ? "+" : "-"}${t.amount}$</td>
      <td>${t.category}</td>
      <td>
        <button class="edit-btn">Edit</button>
        <button class="remove-btn">Remove</button>
      </td>
    `;
    tr.querySelector(".edit-btn").onclick = () => { 
      typeEl.value = t.type;
      amountEl.value = t.amount;
      categoryEl.value = t.category;
      window.editIndex = i;
    };
    tr.querySelector(".remove-btn").onclick = () => {
      if(confirm("Remove this transaction?")) {
        removeTransactionById(t.id);
      }
    };
    listEl.appendChild(tr);
  });

  const balance = income - expense;
  incomeEl.textContent = `${income}$`;
  expenseEl.textContent = `${expense}$`;
  balanceEl.textContent = `Current: ${balance}$`;
  balanceEl.style.color = balance >= 0 ? "green" : "red";
};
