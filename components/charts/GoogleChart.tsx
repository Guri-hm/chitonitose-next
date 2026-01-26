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
  chartType?: 'LineChart' | 'BarChart' | 'PieChart' | 'ColumnChart' | 'ComboChart';
  width?: string;
  height?: string;
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
    // Google Charts APIを読み込み
    const loadGoogleCharts = () => {
      if (window.google && window.google.charts) {
        drawChart();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://www.gstatic.com/charts/loader.js';
      script.onload = () => {
        window.google.charts.load('current', { packages: ['corechart'] });
        window.google.charts.setOnLoadCallback(drawChart);
      };
      document.head.appendChild(script);
    };

    const drawChart = () => {
      if (!chartRef.current || !window.google) return;

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

    loadGoogleCharts();

    // ウィンドウリサイズ時に再描画
    const handleResize = () => {
      if (window.google && window.google.visualization) {
        drawChart();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [data, options, chartType, width, height]);

  return <div ref={chartRef} style={{ width, height }}></div>;
}
