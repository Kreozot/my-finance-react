import percentile from 'percentile';

const formatNumber = (value: number): string => {
  return Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

export const formatMoney = (sum: number): string => {
  if (!sum) {
    return '';
  }
  return formatNumber(sum);
};

export const mostAverage = (data: number[]): number => {
  if (!data.length) {
    return 0;
  }
  const absData = data.map(Math.abs);
  const percentile95 = percentile(95, absData) as number;
  const percentileValues = absData.filter((value) => Math.abs(value) < Math.abs(percentile95));
  const percentileSum = percentileValues.reduce((result, value) => result + value, 0);
  const result = percentileSum / percentileValues.length;
  return result;
};

/** 12345 => 12000, 123 => 120, 12 => 12 */
export const roundInteger = (value: number, roundMin: number = 2, maxZeros: number = 3): number => {
  const valueInteger = Math.round(value);
  const digitCount = valueInteger.toString().length;
  // if (digitCount <= roundMin) {
  //   return valueInteger;
  // }
  const roundDiv = 10 ** Math.min(maxZeros, digitCount - roundMin);
  const result = Math.round(valueInteger / roundDiv) * roundDiv;
  console.log(valueInteger, result);
  return result;
};
