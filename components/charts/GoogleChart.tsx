'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    google: any;
  }
}

interface ChartProps {
  data: any[][];
  options?: any;
  chartType?: 'LineChart' | 'BarChart' | 'PieChart' | 'ColumnChart' | 'ComboChart' | 'AreaChart' | string;
  width?: string;
  height?: string;
}

// 1ページに複数のGoogleChartが同時にマウントされても、ローダースクリプトの読み込みと
// google.charts.load()の呼び出しは1回だけ行うためのモジュールレベルの共有Promise
// （各インスタンスが個別にscriptタグを追加すると競合し「google is not defined」等の
// エラーになるため）。
let googleChartsLoadPromise: Promise<void> | null = null;

function loadGoogleChartsOnce(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.google?.visualization) return Promise.resolve();
  if (googleChartsLoadPromise) return googleChartsLoadPromise;

  googleChartsLoadPromise = new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://www.gstatic.com/charts/loader.js';
    script.onload = () => {
      window.google.charts.load('current', { packages: ['corechart', 'geochart'] });
      window.google.charts.setOnLoadCallback(resolve);
    };
    document.head.appendChild(script);
  });
  return googleChartsLoadPromise;
}

/**
 * Google Charts ラッパーコンポーネント
 */
export default function GoogleChart({
  data,
  options = {},
  chartType = 'LineChart',
  width = '100%',
  height = '400px'
}: ChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;

    const drawChart = () => {
      if (cancelled || !chartRef.current || !window.google?.visualization) return;

      const dataTable = window.google.visualization.arrayToDataTable(data);
      
      const defaultOptions = {
        width,
        height: parseInt(height),
        legend: { position: 'bottom' },
        ...options
      };

      if (chartInstanceRef.current) {
        chartInstanceRef.current.clearChart();
      }

      const ChartConstructor = window.google.visualization[chartType];
      chartInstanceRef.current = new ChartConstructor(chartRef.current);
      chartInstanceRef.current.draw(dataTable, defaultOptions);
    };

    loadGoogleChartsOnce().then(drawChart);

    // ウィンドウリサイズ時に再描画
    const handleResize = () => {
      if (window.google && window.google.visualization) {
        drawChart();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      cancelled = true;
      window.removeEventListener('resize', handleResize);
    };
  }, [data, options, chartType, width, height]);

  return <div ref={chartRef} style={{ width, height }}></div>;
}
