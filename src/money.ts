const formatNumber = (value: number): string => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

export const formatMoney = (sum: number): string => {
  if (!sum) {
    return '';
  }
  return formatNumber(sum);
};

export const median = (arr: number[]): number => {
  if (!arr.length) {
    return 0;
  }
  const s = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 === 0 ? ((s[mid - 1] + s[mid]) / 2) : s[mid];
};
