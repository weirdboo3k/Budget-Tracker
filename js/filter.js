/**
 * Filtering and search functionality for the Budget Tracker
 */

// DOM elements
const filterYearEl = document.getElementById("filter-year");
const filterMonthEl = document.getElementById("filter-month");
const filterDayEl = document.getElementById("filter-day");
const clearFilterBtn = document.getElementById("clear-filter");
const searchInput = document.getElementById("search-input");

/**
 * Updates filter dropdown options based on available transactions
 */
const updateFilterOptions = () => {
  // Collect unique years from transactions
  const years = new Set();
  transactions.forEach(transaction => {
    const date = new Date(transaction.date);
    years.add(date.getFullYear());
  });

  // Update year options
  const currentYear = filterYearEl.value;
  const yearOptions = Array.from(years).sort((a, b) => b - a);
  const yearHTML = '<option value="">全年</option>' +
    yearOptions.map(year => `<option value="${year}">${year}</option>`).join('');
  filterYearEl.innerHTML = yearHTML;
  if (currentYear) filterYearEl.value = currentYear;

  // Update day options based on selected month and year
  const currentDay = filterDayEl.value;
  let dayHTML = '<option value="">全日</option>';

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

/**
 * Filters transactions based on current filter criteria
 */
const filterTransactions = () => {
  const year = filterYearEl.value;
  const month = filterMonthEl.value;
  const day = filterDayEl.value;
  const search = searchInput.value.toLowerCase();

  const filtered = transactions.filter(transaction => {
    const date = new Date(transaction.date);

    // Filter by year
    if (year && date.getFullYear() != year) return false;

    // Filter by month
    if (month && (date.getMonth() + 1) != month) return false;

    // Filter by day
    if (day && date.getDate() != day) return false;

    // Filter by search (category)
    if (search && !translateCategory(transaction.category).toLowerCase().includes(search)) return false;

    return true;
  });

  renderTransactions(filtered);
};

// Event listeners
filterYearEl.addEventListener("change", () => {
  updateFilterOptions();
  filterTransactions();
});

filterMonthEl.addEventListener("change", () => {
  updateFilterOptions();
  filterTransactions();
});

filterDayEl.addEventListener("change", filterTransactions);

searchInput.addEventListener("input", filterTransactions);

clearFilterBtn.addEventListener("click", () => {
  filterYearEl.value = "";
  filterMonthEl.value = "";
  filterDayEl.value = "";
  searchInput.value = "";
  renderTransactions(transactions);
});
