// Filter dropdown
const filterYearEl = document.getElementById("filter-year");
const filterMonthEl = document.getElementById("filter-month");
const filterDayEl = document.getElementById("filter-day");
const clearFilterBtn = document.getElementById("clear-filter");

const updateFilterOptions = () => {
  // Collect unique years from transactions
  const years = new Set();
  
  transactions.forEach(t => {
    const d = new Date(t.date);
    years.add(d.getFullYear());
  });

  // Update year options
  const currentYear = filterYearEl.value;
  const yearOptions = Array.from(years).sort((a, b) => b - a);
  const yearHTML = '<option value="">All Years</option>' + 
    yearOptions.map(y => `<option value="${y}">${y}</option>`).join('');
  filterYearEl.innerHTML = yearHTML;
  if (currentYear) filterYearEl.value = currentYear;

  // Update day options based on selected month and year
  const currentDay = filterDayEl.value;
  let dayHTML = '<option value="">All Days</option>';
  
  const selectedMonth = parseInt(filterMonthEl.value);
  const selectedYear = parseInt(filterYearEl.value);
  
  if (selectedMonth) {
    // Get number of days in the selected month
    const year = selectedYear || new Date().getFullYear();
    const daysInMonth = new Date(year, selectedMonth, 0).getDate();
    for (let i = 1; i <= daysInMonth; i++) {
      dayHTML += `<option value="${i}">${i}</option>`;
    }
  } else {
    // If no month selected, show all possible days (1-31)
    for (let i = 1; i <= 31; i++) {
      dayHTML += `<option value="${i}">${i}</option>`;
    }
  }
  
  filterDayEl.innerHTML = dayHTML;
  if (currentDay) filterDayEl.value = currentDay;
};

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

filterYearEl.addEventListener("change", () => {
  updateFilterOptions();
  filterTransactions();
});
filterMonthEl.addEventListener("change", () => {
  updateFilterOptions();
  filterTransactions();
});
filterDayEl.addEventListener("change", filterTransactions);
clearFilterBtn.addEventListener("click", () => {
  filterYearEl.value = "";
  filterMonthEl.value = "";
  filterDayEl.value = "";
  renderTransactions(transactions);
});
