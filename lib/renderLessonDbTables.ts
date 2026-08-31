import { formatNumber } from '@/lib/formatNumber';
import type { BasicData, StatisticsInfo, StatisticsDataRow, TradeItem, Nation } from '@/lib/dataLoader';

export interface GeoLessonDbDatasets {
  basicData: BasicData[];
  statisticsInfo: StatisticsInfo[];
  statisticsData: StatisticsDataRow[];
  exportItems: TradeItem[];
  importItems: TradeItem[];
  nations?: Nation[];
}

function escapeHtml(s: unknown): string {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[c] as string));
}

const NOT_FOUND_HTML = '<p class="text-sm text-gray-500">データが見つかりませんでした。</p>';

// ::basic-data{cd="..."} 用の国基礎データ表（旧basic_data.php相当）
function renderBasicDataTable(cd: string, rows: BasicData[]): string {
  const row = (rows || []).find((r) => String(r.cd) === cd);
  if (!row) return NOT_FOUND_HTML;

  const optionalRows: string[] = [];
  if (row.people) {
    optionalRows.push(`<tr><th class="text-center">民族</th><td class="text-center">${escapeHtml(row.people)}</td></tr>`);
  }
  if (row.official_lang) {
    optionalRows.push(`<tr><th class="text-center">公用語</th><td class="text-center">${escapeHtml(row.official_lang)}</td></tr>`);
  }
  if (row.religion) {
    optionalRows.push(`<tr><th class="text-center">主な宗教</th><td class="text-center">${escapeHtml(row.religion)}</td></tr>`);
  }
  if (row.suzerain_state) {
    optionalRows.push(`<tr><th class="text-center">宗主国</th><td class="text-center">${escapeHtml(row.suzerain_state)}</td></tr>`);
  }

  return (
    '<div class="overflow-x-auto mt-10 mb-10"><table class="w-auto table mx-auto"><tbody>' +
    `<tr><th class="text-center">人口(万人)(${escapeHtml(row.popu_year)})</th><td class="text-end">${formatNumber(row.population)}</td></tr>` +
    `<tr><th class="text-center">面積(万㎢)(${escapeHtml(row.area_year)}年)</th><td class="text-end">${formatNumber(row.area)}</td></tr>` +
    `<tr><th class="text-center">人口密度(人/k㎡)</th><td class="text-end">${formatNumber(row.density)}</td></tr>` +
    `<tr><th class="text-center">1人あたりGNI(ドル)(${escapeHtml(row.gni_year)}年)</th><td class="text-end">${formatNumber(row.dollar)}</td></tr>` +
    optionalRows.join('') +
    `<tr><th class="text-center">首都</th><td class="text-center">${escapeHtml(row.capital)}</td></tr>` +
    '</tbody></table></div>'
  );
}

interface StatisticsTableParams {
  id: string;
  order?: string;
  limit?: string;
  offset?: string;
  dataYear?: string;
  years?: string; // カンマ区切り
  linked?: string; // カンマ区切り
  info: StatisticsInfo[];
  data: StatisticsDataRow[];
}

// ::statistics{...} 用の統計ランキング表（旧statistics.php相当）
function renderStatisticsTable(params: StatisticsTableParams): string {
  const { id, order = 'desc', limit, offset, dataYear, years, linked, info, data } = params;
  const statId = Number(id);
  const infoRow = (info || []).find((r) => r.id === statId);
  const rows = (data || []).filter((r) => r.statistics_id === statId);

  if (!infoRow || rows.length === 0) return NOT_FOUND_HTML;

  const targetYear = dataYear ? Number(dataYear) : Math.max(...rows.map((r) => r.data_year));
  const filtered = rows
    .filter((r) => r.data_year === targetYear)
    .sort((a, b) => (order === 'asc' ? a.data_val - b.data_val : b.data_val - a.data_val));

  const offsetNum = offset ? Number(offset) : 0;
  const limitNum = limit ? Number(limit) : filtered.length;
  const sliced = filtered.slice(offsetNum, offsetNum + limitNum);

  const yearList = (years || '')
    .split(',')
    .map((y) => y.trim())
    .filter(Boolean)
    .map(Number)
    .filter((y) => !Number.isNaN(y));
  const linkedList = (linked || '')
    .split(',')
    .map((l) => l.trim())
    .filter(Boolean)
    .map(Number)
    .filter((l) => !Number.isNaN(l));

  const findYearVal = (nationName: string, year: number) =>
    rows.find((r) => r.nation_name === nationName && r.data_year === year)?.data_val;

  const linkedInfoMap = new Map(linkedList.map((lid) => [lid, (info || []).find((r) => r.id === lid)]));
  const linkedRowsMap = new Map(linkedList.map((lid) => [lid, (data || []).filter((r) => r.statistics_id === lid)]));
  const findLinkedVal = (nationName: string, lid: number) => {
    const nationRows = (linkedRowsMap.get(lid) || []).filter((r) => r.nation_name === nationName);
    if (nationRows.length === 0) return undefined;
    const maxYear = Math.max(...nationRows.map((r) => r.data_year));
    return nationRows.find((r) => r.data_year === maxYear)?.data_val;
  };

  const yearHeaders = yearList
    .map((y) => `<th class="text-center">${escapeHtml(infoRow.unit)}(${y}年)</th>`)
    .join('');
  const linkedHeaders = linkedList
    .map((lid) => `<th class="text-center">${escapeHtml(linkedInfoMap.get(lid)?.unit)}(${targetYear}年)</th>`)
    .join('');

  const bodyRows = sliced
    .map((row) => {
      const yearCells = yearList
        .map((y) => `<td class="text-end">${formatNumber(findYearVal(row.nation_name, y))}</td>`)
        .join('');
      const linkedCells = linkedList
        .map((lid) => `<td class="text-end">${formatNumber(findLinkedVal(row.nation_name, lid))}</td>`)
        .join('');
      return (
        `<tr><td class="text-center">${escapeHtml(row.nation_name)}</td>` +
        `<td class="text-end">${formatNumber(row.data_val)}</td>${yearCells}${linkedCells}</tr>`
      );
    })
    .join('');

  return (
    '<div class="overflow-x-auto mt-10 mb-10"><table class="w-auto table mx-auto">' +
    `<caption class="text-center">${escapeHtml(infoRow.data_name)}</caption>` +
    '<thead><tr><th class="text-center">国名</th>' +
    `<th class="text-center">${escapeHtml(infoRow.unit)}(${targetYear}年)</th>${yearHeaders}${linkedHeaders}</tr></thead>` +
    `<tbody>${bodyRows}</tbody></table></div>`
  );
}

// ::export-items{...} / ::import-items{...} 用の貿易品目ランキング表（旧export/import_items_lank.php相当）
function renderTradeItemsTable(nationCd: string, rows: TradeItem[], type: 'export' | 'import', nationName?: string): string {
  const matched = (rows || []).filter((r) => String(r.nation_cd) === nationCd).sort((a, b) => a.lank - b.lank);
  if (matched.length === 0) return NOT_FOUND_HTML;

  const dataYear = matched[0].data_year;
  const label = type === 'export' ? '輸出品目' : '輸入品目';
  const bodyRows = matched
    .map(
      (row) =>
        `<tr><td class="text-center">${escapeHtml(row.item_name)}</td><td class="text-end">${escapeHtml(row.ratio)}</td></tr>`
    )
    .join('');

  return (
    '<div class="overflow-x-auto mt-10 mb-10">' +
    `<div class="text-center">${nationName ? escapeHtml(nationName) + ' ' : ''}${label}（${dataYear}年、%）</div>` +
    `<table class="w-auto table mx-auto"><tbody>${bodyRows}</tbody></table></div>`
  );
}

const PLACEHOLDER_RE =
  /<div class="lesson-(basic-data|statistics|export-items|import-items)-placeholder"([^>]*)><\/div>/g;

function parseDataAttrs(attrsStr: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  const re = /data-([\w-]+)="([^"]*)"/g;
  let m;
  while ((m = re.exec(attrsStr)) !== null) {
    // kebab-case属性名をcamelCaseに変換（例: data-arr-linked-id -> arrLinkedId）
    const key = m[1].replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
    attrs[key] = m[2].replace(/&quot;/g, '"');
  }
  return attrs;
}

/**
 * レッスン本文中の::basic-data / ::statistics / ::export-items / ::import-items
 * プレースホルダーを、DBデータ（JSON）をもとに生成したテーブルHTMLに置き換える。
 */
export function renderLessonDbTables(htmlContent: string, datasets: GeoLessonDbDatasets): string {
  return htmlContent.replace(PLACEHOLDER_RE, (match, kind, attrsStr) => {
    const attrs = parseDataAttrs(attrsStr);
    switch (kind) {
      case 'basic-data':
        return renderBasicDataTable(attrs.cd, datasets.basicData);
      case 'statistics':
        return renderStatisticsTable({
          id: attrs.id,
          order: attrs.order,
          limit: attrs.limit,
          offset: attrs.offset,
          dataYear: attrs.dataYear,
          years: attrs.arrYear,
          linked: attrs.arrLinkedId,
          info: datasets.statisticsInfo,
          data: datasets.statisticsData,
        });
      case 'export-items':
      case 'import-items': {
        const type = kind === 'export-items' ? 'export' : 'import';
        const rows = type === 'export' ? datasets.exportItems : datasets.importItems;
        const nationName = datasets.nations?.find((n) => String(n.cd) === attrs.nationCd)?.short_name;
        return renderTradeItemsTable(attrs.nationCd, rows, type, nationName);
      }
      default:
        return match;
    }
  });
}
