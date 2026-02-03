// フィルター機能 - 年月日でのフィルタリングと検索

// HTMLのフィルター要素を取得
const filterYearEl = document.getElementById("filter-year");
const filterMonthEl = document.getElementById("filter-month");
const filterDayEl = document.getElementById("filter-day");
const clearFilterBtn = document.getElementById("clear-filter");
const searchInput = document.getElementById("search-input");

// フィルター用のドロップダウンを更新
const updateFilterOptions = () => {
  // 取引データから年を集める
  const years = new Set();
  transactions.forEach(transaction => {
    const date = new Date(transaction.date);
    years.add(date.getFullYear());
  });

  // 年のドロップダウンを更新
  const currentYear = filterYearEl.value;
  const yearOptions = Array.from(years).sort((a, b) => b - a);
  const yearHTML = '<option value="">全年</option>' +
    yearOptions.map(year => `<option value="${year}">${year}</option>`).join('');
  filterYearEl.innerHTML = yearHTML;
  if (currentYear) filterYearEl.value = currentYear;

  // 選択した月と年に応じて日数のドロップダウンを更新
  const currentDay = filterDayEl.value;
  let dayHTML = '<option value="">全日</option>';

  const selectedMonth = parseInt(filterMonthEl.value);
  const selectedYear = parseInt(filterYearEl.value);

  if (selectedMonth) {
    // 月の日数を取得
    const year = selectedYear || new Date().getFullYear();
    const daysInMonth = new Date(year, selectedMonth, 0).getDate();
    for (let i = 1; i <= daysInMonth; i++) {
      dayHTML += `<option value="${i}">${i}</option>`;
    }
  } else {
    // 月が選択されていない場合は1-31を表示
    for (let i = 1; i <= 31; i++) {
      dayHTML += `<option value="${i}">${i}</option>`;
    }
  }

  filterDayEl.innerHTML = dayHTML;
  if (currentDay) filterDayEl.value = currentDay;
};

// 選択されたフィルター条件で取引データを絞り込む
const filterTransactions = () => {
  const year = filterYearEl.value;
  const month = filterMonthEl.value;
  const day = filterDayEl.value;
  const search = searchInput.value.toLowerCase();

  const filtered = transactions.filter(transaction => {
    const date = new Date(transaction.date);

    // 年でフィルター
    if (year && date.getFullYear() != year) return false;

    // 月でフィルター
    if (month && (date.getMonth() + 1) != month) return false;

    // 日でフィルター
    if (day && date.getDate() != day) return false;

    // 検索キーワードでフィルター（カテゴリ）
    if (search && !translateCategory(transaction.category).toLowerCase().includes(search)) return false;

    return true;
  });

  renderTransactions(filtered);
};

// イベントリスナー - フィルター要素が変わったときの処理
filterYearEl.addEventListener("change", () => {
  updateFilterOptions();
  filterTransactions();
});

filterMonthEl.addEventListener("change", () => {
  updateFilterOptions();
  filterTransactions();
});

filterDayEl.addEventListener("change", filterTransactions);

// 検索ボックスに入力されたら実行
searchInput.addEventListener("input", filterTransactions);

// フィルターをクリアする
clearFilterBtn.addEventListener("click", () => {
  filterYearEl.value = "";
  filterMonthEl.value = "";
  filterDayEl.value = "";
  searchInput.value = "";
  renderTransactions(transactions);
});
