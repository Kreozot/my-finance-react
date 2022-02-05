const formatNumber = (value: number): string => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export const formatMoney = (sum: number): string => {
  return formatNumber(sum);
}
