// import percentile from 'just-percentile';
import { mean } from 'lodash';

const formatNumber = (value: number): string => {
  return Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

export const formatMoney = (amount: number): string => {
  if (!amount) {
    return '';
  }
  return formatNumber(amount);
};

export const getMostAverage = (data: number[]): number => {
  if (!data.length) {
    return 0;
  }
  return mean(data);
  // TODO: Отбрасывать значительно отстоящие значения
  // const absData = data.map(Math.abs);
  // const percentile95 = percentile(absData, 0.95) as number;
  // const percentileValues = absData.filter((value) => Math.abs(value) <= Math.abs(percentile95));
  // const percentileSum = sum(percentileValues);

  // const result = percentileSum > 0
  //   ? percentileSum / percentileValues.length
  //   : sum(absData) / absData.length;
  // return result;
};

/** 123456 => 123000, 123 => 120, 12 => 12 */
export const roundInteger = (value: number, roundMin: number = 2, maxZeros: number = 3): number => {
  const valueInteger = Math.round(value);
  const digitCount = valueInteger.toString().length;
  if (digitCount <= roundMin) {
    return valueInteger;
  }
  const roundDiv = 10 ** Math.min(maxZeros, digitCount - roundMin);
  const result = Math.round(valueInteger / roundDiv) * roundDiv;
  return result;
};
