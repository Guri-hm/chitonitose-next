'use client';

import GoogleChart from './GoogleChart';

interface LessonChartProps {
  chartType?: 'LineChart' | 'BarChart' | 'PieChart' | 'ColumnChart' | 'ComboChart';
  rows: Record<string, any>[];
  filter?: string; // 例: "nation_cd=578"（カンマ区切りで複数条件）
  fields?: string; // 例: "hydroelectricity:水力,thermal_power:火力"
  title?: string;
}

/**
 * ::chart{...} ディレクティブから生成されたプレースホルダーにマウントされるチャート。
 * dataset（JSONから読み込んだレコード配列）をfilter/fieldsで絞り込み、Google Chartsで描画する。
 */
export default function LessonChart({ chartType = 'PieChart', rows, filter, fields, title }: LessonChartProps) {
  const conditions = (filter || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => {
      const [key, value] = s.split('=').map((x) => x.trim());
      return { key, value };
    });

  let matched = (rows || []).filter((row) =>
    conditions.every((c) => String(row[c.key]) === c.value)
  );

  // 複数年のデータがある場合は最新年のものを採用
  if (matched.length > 1 && matched[0]?.data_year !== undefined) {
    const maxYear = Math.max(...matched.map((r) => r.data_year));
    matched = matched.filter((r) => r.data_year === maxYear);
  }

  const row = matched[0];

  const fieldList = (fields || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => {
      const [col, label] = s.split(':');
      return { col: col.trim(), label: (label || col).trim() };
    });

  if (!row || fieldList.length === 0) {
    return <p className="text-sm text-gray-500">データが見つかりませんでした。</p>;
  }

  const dataRows = fieldList
    .map((f) => [f.label, Number(row[f.col]) || 0] as [string, number])
    .filter(([, value]) => value > 0);

  if (dataRows.length === 0) {
    return <p className="text-sm text-gray-500">データが見つかりませんでした。</p>;
  }

  const data: any[][] = [['項目', '値'], ...dataRows];

  return (
    <div className="my-6">
      <GoogleChart
        data={data}
        chartType={chartType}
        height="320px"
        options={title ? { title } : {}}
      />
    </div>
  );
}
