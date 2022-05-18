import dayjs from 'dayjs';
// import 'dayjs/locale/ru';

// dayjs.locale('en');

export const getDayjsFromKey = (dateKey: string) => {
  return dayjs(`${dateKey}-01`);
};

export const formatDateKeyHeader = (dateKey: string): string => {
  return getDayjsFromKey(dateKey).format('MMM YYYY');
};
