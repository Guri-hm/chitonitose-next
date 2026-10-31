'use client';

import { useMemo } from 'react';
import GoogleChart from '@/components/charts/GoogleChart';
import type { ChartTable } from '@/lib/geoStatistics';

interface StatsChartProps {
  kind: 'geo' | 'bar';
  table: ChartTable;
  title?: string;
  /** Google Chartsのオプション（colorAxisなど） */
  options?: Record<string, unknown>;
}

const BAR_COLORS = ['#dc3912', '#3366cc', '#990099', '#109618', '#ff9900', '#C0C0C0'];

/** 統計データページの世界地図（GeoChart）・％積み上げ横棒グラフ */
export default function StatsChart({ kind, table, title, options }: StatsChartProps) {
  const chartOptions = useMemo(
    () =>
      kind === 'geo'
        ? { width: undefined, ...options }
        : {
            title,
            legend: { position: 'top', maxLines: 3 },
            isStacked: 'percent',
            titleTextStyle: { fontSize: 14 },
            colors: BAR_COLORS,
            ...options,
          },
    [kind, title, options]
  );

  if (table.length === 0) {
    return <p className="text-sm text-gray-500">データが見つかりませんでした。</p>;
  }

  return (
    <div className="mx-auto mt-10 mb-10" style={{ width: '100%', maxWidth: kind === 'geo' ? 600 : 800 }}>
      <GoogleChart
        data={table as any[][]}
        chartType={kind === 'geo' ? 'GeoChart' : 'BarChart'}
        height={kind === 'geo' ? '400px' : '250px'}
        options={chartOptions}
      />
    </div>
  );
}
