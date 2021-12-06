import { useQuery } from 'react-query';
import { fetchCoinHistory } from './api';
import ApexChart from 'react-apexcharts';
import { useRecoilValue } from 'recoil';
import { isDarkAtom } from './atoms';

interface IHistorical {
  time_open: string;
  time_close: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  market_cap: number;
}

interface ChartProps {
  coinId: string;
}
function Chart({ coinId }: ChartProps) {
  const isDark = useRecoilValue(isDarkAtom);
  const { isLoading, data } = useQuery<IHistorical[]>(
    ['ohlcv', coinId],
    () => fetchCoinHistory(coinId),
    {
      refetchInterval: 10000,
    }
  );
  const arr = () =>
    data?.map((item) => {
      let x = item.time_close.slice(5, 10);
      let y = [
        item.open.toFixed(2),
        item.high.toFixed(2),
        item.low.toFixed(2),
        item.close.toFixed(2),
      ];
      return { x: x, y: y };
    });
  return (
    <div>
      {isLoading ? (
        'Loading chart...'
      ) : (
        <ApexChart
          type='candlestick'
          series={[
            {
              data: arr(),
            },
          ]}
          options={{
            theme: {
              mode: isDark ? 'dark' : 'light',
            },
            chart: {
              type: 'candlestick',
              width: 1000,
              height: 500,
            },
            title: {
              text: `${coinId} Chart`,
              align: 'left',
            },
            xaxis: {
              type: 'datetime',
              labels: { rotate: 0 },
            },
            yaxis: {
              tooltip: {
                enabled: true,
              },
            },
          }}
        />
      )}
    </div>
  );
}

export default Chart;
