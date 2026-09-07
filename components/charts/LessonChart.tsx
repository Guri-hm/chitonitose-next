'use client';

import GoogleChart from './GoogleChart';
import { CHART_BUILDERS } from '@/lib/chartBuilders';

interface LessonChartProps {
  chartType?: string;
  dataset: string;
  params: string; // JSON文字列（例: '{"nation_cd":578}'）
  datasets: Record<string, any[]>;
  title?: string;
}

/**
 * ::chart{...} ディレクティブから生成されたプレースホルダーの位置に、
 * dangerouslySetInnerHTMLの外側で（本来のReact子要素として）直接レンダリングされるチャート。
 * データ整形は`lib/chartBuilders.ts`の該当datasetのbuilder関数が行う。
 */
export default function LessonChart({ chartType = 'PieChart', dataset, params, datasets, title }: LessonChartProps) {
  let parsedParams: any = {};
  try {
    parsedParams = params ? JSON.parse(params) : {};
  } catch {
    parsedParams = {};
  }

  const builder = CHART_BUILDERS[dataset];
  const result = builder ? builder(datasets, parsedParams, datasets.nations || []) : null;

  if (!result) {
    return <p className="text-sm text-gray-500">データが見つかりませんでした。</p>;
  }

  return (
    <div className="my-6">
      <GoogleChart
        data={result.data}
        chartType={chartType as any}
        height="320px"
        options={{ ...(title ? { title } : {}), ...(result.options || {}) }}
      />
    </div>
  );
}
