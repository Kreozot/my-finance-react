import { memo, VFC } from 'react';
import {
  Chart as RumbleChart, Lines, Ticks,
} from 'rumble-charts';

import { dates } from 'store';
import { formatMoney } from 'money';

import styles from './Chart.module.scss';

const formatLabel = (text: string) => {
  return formatMoney(Number(text));
};

const yearTicks = dates.reduce((result, dateKey: string, index: number) => {
  const month = dateKey.slice(5, 7);
  if (month === '01') {
    result.push(index);
  }
  return result;
}, [] as number[]);

export const Chart: VFC<any> = memo(({ chartDataSet, isNonAbsolute }) => {
  const max = Math.max(...chartDataSet);

  return (
    <RumbleChart
      className={styles.chart}
      series={[{
        data: chartDataSet,
      }]}
      width={200}
      height={40}
      scaleX={{
        paddingEnd: 0.1,
        paddingStart: 0.1,
      }}
      scaleY={{
        paddingTop: 5,
        paddingBottom: 5,
      }}
    >
      {/* Разделитель между годами */}
      <Ticks
        lineLength="100%"
        lineVisible
        position="top"
        lineStyle={{
          stroke: 'lightgray',
          strokeDasharray: 4,
        }}
        labelVisible={false}
        axis="x"
        ticks={yearTicks}
      />
      {
        isNonAbsolute && (
          // Нулевая линия
          <Ticks
            lineLength="100%"
            lineVisible
            position="top"
            lineStyle={{
              stroke: 'lightgray',
            }}
            labelVisible={false}
            axis="y"
            ticks={[0]}
          />
        )
      }
      {/* Линия графика */}
      <Lines
        interpolation="linear"
        lineWidth={1}
      />
      {/* Вывод максимального значения */}
      <Ticks
        lineVisible={false}
        position="top"
        labelVisible
        axis="y"
        ticks={[max]}
        labelFormat={formatLabel}
        labelStyle={{
          fill: 'silver',
          dominantBaseline: 'hanging',
          fontSize: 10,
          enableBackground: true,
        }}
      />
    </RumbleChart>
  );
});
