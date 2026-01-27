// Filter dropdown
const filterYearEl = document.getElementById("filter-year");
const filterMonthEl = document.getElementById("filter-month");
const filterDayEl = document.getElementById("filter-day");
const clearFilterBtn = document.getElementById("clear-filter");

const filterTransactions = () => {
  let year = filterYearEl.value;
  let month = filterMonthEl.value;
  let day = filterDayEl.value;

  let filtered = transactions.filter(t => {
    const d = new Date(t.date);
    if(year && d.getFullYear()!=year) return false;
    if(month && (d.getMonth()+1)!=month) return false;
    if(day && d.getDate()!=day) return false;
    return true;
  });

  renderTransactions(filtered);
};

filterYearEl.addEventListener("change", filterTransactions);
filterMonthEl.addEventListener("change", filterTransactions);
filterDayEl.addEventListener("change", filterTransactions);
clearFilterBtn.addEventListener("click", () => {
  filterYearEl.value = "";
  filterMonthEl.value = "";
  filterDayEl.value = "";
  renderTransactions(transactions);
});
