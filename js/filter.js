// =======================
// FILTER & DATE
// =======================
const getDateFromStr = (s) => {
  if (!s) return null;
  if (s.includes('T') && !s.includes('Z') && !s.includes('+')) {
    const [dp, tp] = s.split('T');
    const [y, m, day] = dp.split('-').map(Number);
    const [h, min] = tp.split(':').map(Number);
    return new Date(y, m - 1, day, h, min);
  }
  return new Date(s);
};

const filterTransactions = (transactions, year, month, day) => {
  if (!year && !month && !day) return transactions;
  return transactions.filter(t => {
    const d = getDateFromStr(t.date);
    if (!d) return false;
    if (year && d.getFullYear() !== Number(year)) return false;
    if (month && d.getMonth() + 1 !== Number(month)) return false;
    if (day && d.getDate() !== Number(day)) return false;
    return true;
  });
};

const getAvailableYears = (transactions) => {
  return [...new Set(transactions.map(t => {
    const d = getDateFromStr(t.date);
    return d ? d.getFullYear() : null;
  }).filter(y => y !== null))].sort((a,b) => b - a);
};
