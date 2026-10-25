/**
 * 総務省統計局 e-Stat API（政府統計の総合窓口）から、人口・出生率などの
 * 最新値を取得し、レッスン本文中の `::estat{...}` プレースホルダーを
 * 実際の値に置き換えるためのユーティリティ。
 *
 * このサイトは `output: 'export'` の完全静的サイトのため、ビルド時
 * （Node.js側）にfetchして結果を文字列として直接HTML化する。
 * クライアント側で毎回fetchする方式も検討したが、
 * - 取得完了までの「取得中…」表示がレイアウトシフト(CLS)の原因になる
 * - dangerouslySetInnerHTMLの途中にReactコンポーネントの境界を割り込ませると、
 *   文中の開きタグ・閉じタグがコンポーネント境界をまたいでしまい、
 *   ブラウザのHTMLパーサーがタグの対応関係を誤認してハイドレーションエラーに
 *   なるケースがある（本関数が埋め込む値はプレーンテキストなので影響を受けない）
 * という理由から、ビルド時に解決する方式を採用した。
 */

const APP_ID = '9b53889428fc3f19ba9875f350a8c8d0703af544';
const API_BASE = 'https://api.e-stat.go.jp/rest/3.0/app/json/getStatsData';

interface EStatValueNode {
  '@tab'?: string;
  '@cat01'?: string;
  '@area'?: string;
  '@time'?: string;
  '@unit'?: string;
  '$': string;
}

interface EStatDatasetConfig {
  statsDataId: string;
  compute: (values: EStatValueNode[], area?: string) => string | null;
}

function yearOf(v: EStatValueNode): string {
  return (v['@time'] || '').slice(0, 4);
}

const DATASET_CONFIGS: Record<string, EStatDatasetConfig> = {
  // 日本の人口総数
  population: {
    statsDataId: '0003411881',
    compute: (values) => {
      const v = values[0];
      if (!v) return null;
      return `${(Number(v['$']) / 100000000).toFixed(2)}億人(${yearOf(v)}年)`;
    },
  },
  // 日本の出生率（人口千対）
  birthrate: {
    statsDataId: '0003411595',
    compute: (values) => {
      const v = values.find((x) => x['@cat01'] === '00130');
      if (!v) return null;
      return `${v['$']}‰(${yearOf(v)}年)`;
    },
  },
  // 日本の合計特殊出生率
  'total-fertility-rate': {
    statsDataId: '0003411595',
    compute: (values) => {
      const v = values.find((x) => x['@cat01'] === '00150');
      if (!v) return null;
      return `${v['$']}(${yearOf(v)}年)`;
    },
  },
  // 日本の死亡率（人口千対）
  'mortality-rate': {
    statsDataId: '0003411649',
    compute: (values) => {
      const v = values.find((x) => x['@cat01'] === '00140');
      if (!v) return null;
      return `${v['$']}‰(${yearOf(v)}年)`;
    },
  },
  // 日本の老年人口（65歳以上）の割合
  'elderly-population-ratio': {
    statsDataId: '0003411883',
    compute: (values) => {
      const elderly = values.find((x) => x['@cat01'] === '00460');
      const total = values.find((x) => x['@cat01'] === '00100');
      if (!elderly || !total) return null;
      const ratio = (Number(elderly['$']) / Number(total['$'])) * 100;
      return `${ratio.toFixed(1)}%(${yearOf(elderly)}年)`;
    },
  },
  // 都道府県別の合計特殊出生率（areaに都道府県コードを指定）
  'prefecture-total-fertility-rate': {
    statsDataId: '0003411598',
    compute: (values, area) => {
      const v = values.find((x) => (x['@tab'] || '').includes('10060') && x['@area'] === area);
      if (!v) return null;
      return `${v['$']}(${yearOf(v)}年)`;
    },
  },
};

async function fetchStatsDataId(statsDataId: string): Promise<EStatValueNode[]> {
  const params = new URLSearchParams({
    appId: APP_ID,
    statsDataId,
    metaGetFlg: 'Y',
    cntGetFlg: 'N',
    explanationGetFlg: 'Y',
    annotationGetFlg: 'Y',
    sectionHeaderFlg: '1',
    replaceSpChars: '0',
  });
  const res = await fetch(`${API_BASE}?${params.toString()}`);
  if (!res.ok) throw new Error(`e-Stat API HTTP ${res.status}`);
  const json = await res.json();
  const result = json?.GET_STATS_DATA?.RESULT;
  if (result?.STATUS !== 0) throw new Error(result?.ERROR_MSG || 'e-Stat API error');
  const rawValues = json?.GET_STATS_DATA?.STATISTICAL_DATA?.DATA_INF?.VALUE;
  return Array.isArray(rawValues) ? rawValues : rawValues ? [rawValues] : [];
}

const PLACEHOLDER_RE = /<span class="lesson-estat-placeholder" data-estat-dataset="([^"]*)" data-estat-area="([^"]*)"><\/span>/g;

/**
 * htmlContent中の`.lesson-estat-placeholder`をe-Stat APIの実際の値に置き換える。
 * プレースホルダーが含まれない場合は何もfetchせずそのまま返す。
 */
export async function resolveEstatPlaceholders(html: string): Promise<string> {
  if (!html.includes('lesson-estat-placeholder')) return html;

  const matches = [...html.matchAll(PLACEHOLDER_RE)];
  if (matches.length === 0) return html;

  // 同じstatsDataIdを重複取得しないよう、必要なIDだけ集めてまとめて取得する
  const neededIds = new Set<string>();
  for (const m of matches) {
    const config = DATASET_CONFIGS[m[1]];
    if (config) neededIds.add(config.statsDataId);
  }

  const valuesById = new Map<string, EStatValueNode[]>();
  await Promise.all(
    [...neededIds].map(async (id) => {
      try {
        valuesById.set(id, await fetchStatsDataId(id));
      } catch (error) {
        console.error(`[estat] statsDataId=${id} の取得に失敗しました:`, error);
        valuesById.set(id, []);
      }
    })
  );

  return html.replace(PLACEHOLDER_RE, (match, dataset: string, area: string) => {
    const config = DATASET_CONFIGS[dataset];
    if (!config) return '';
    const values = valuesById.get(config.statsDataId) || [];
    const text = config.compute(values, area || undefined);
    if (!text) return '<span class="estat-value estat-value-error">(最新データ取得不可)</span>';
    return `<span class="estat-value">${text}</span>`;
  });
}
