const formatDate = (s) => {
  const d = new Date(s);
  return `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`;
};

const renderTransactions = (transactions) => {
  const listEl = document.getElementById("transaction-list");
  const incomeEl = document.getElementById("total-income");
  const expenseEl = document.getElementById("total-expense");
  const balanceEl = document.getElementById("balance");

  listEl.innerHTML = "";
  let income = 0, expense = 0;

  transactions.forEach((t, i) => {
    const tr = document.createElement("tr");
    const amountClass = t.type === "income" ? "income" : "expense";
    tr.innerHTML = `
      <td>${t.type}<br><small>${formatDate(t.date)}</small></td>
      <td class="${amountClass}">${t.type==="income"? "+" : "-"}${t.amount}$</td>
      <td>${t.category}</td>
      <td>
        <button class="edit-btn">Edit</button>
        <button class="remove-btn">Remove</button>
      </td>
    `;
    // Edit
    tr.querySelector(".edit-btn").onclick = () => {
      document.getElementById("type").value = t.type;
      document.getElementById("amount").value = t.amount;
      document.getElementById("category").value = t.category;
      editIndex = i;
    };
    // Remove
    tr.querySelector(".remove-btn").onclick = () => {
      if(confirm("Remove this transaction?")) removeTransaction(t.id);
    };

    listEl.appendChild(tr);

    t.type === "income" ? income += t.amount : expense += t.amount;
  });

  balanceEl.textContent = `Current: ${income - expense}$`;
  const balance = income - expense;
  balanceEl.className = balance >= 0 ? "income" : "expense";
  incomeEl.textContent = `${income}$`;
  expenseEl.textContent = `${expense}$`;

  // Update filter options
  if (typeof updateFilterOptions === 'function') {
    updateFilterOptions();
  }
};
