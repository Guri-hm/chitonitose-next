import { loadJSON } from '@/lib/dataLoader';

type Cell = string | number | { v: string | number; f?: string };
export type ChartTable = Cell[][];

export interface GeoMapStat {
  /** Google GeoChart用のデータ表（先頭行がヘッダー） */
  table: ChartTable;
}

interface Nation {
  cd: number;
  short_name: string;
  english_name: string;
  '2letters': string;
}

async function loadNationsByCd(): Promise<Map<number, Nation>> {
  const nations = await loadJSON<Nation[]>('nations.json');
  return new Map(nations.map((n) => [n.cd, n]));
}

function toGeoTable(
  label: string,
  rows: { nationCd: number; value: number }[],
  nations: Map<number, Nation>
): ChartTable {
  const table: ChartTable = [['国', label]];
  for (const r of rows) {
    const n = nations.get(r.nationCd);
    if (!n || !n['2letters']) continue;
    table.push([{ v: n['2letters'], f: n.english_name }, r.value]);
  }
  return table;
}

/** statistics_changes_data の統計（統計ID・年次指定）を世界地図用データにする */
export async function buildStatisticsGeoTable(statisticsId: number, year: number, labelOverride?: string): Promise<ChartTable> {
  const [data, info, nations] = await Promise.all([
    loadJSON<any[]>('statistics-changes-data.json'),
    loadJSON<any[]>('statistics-info.json'),
    loadNationsByCd(),
  ]);
  const stat = info.find((i) => i.id === statisticsId);
  const label = labelOverride ?? (stat ? `${stat.data_name}${stat.unit ? `(${stat.unit})` : ''}` : '');
  const rows = data
    .filter((d) => d.statistics_id === statisticsId && d.data_year === year)
    .map((d) => ({ nationCd: d.nation_cd, value: d.value ?? 0 }));
  return toGeoTable(label, rows, nations);
}

export async function buildPopulationGeoTable(year: number): Promise<ChartTable> {
  const [data, nations] = await Promise.all([loadJSON<any[]>('nation-population.json'), loadNationsByCd()]);
  const rows = data
    .filter((d) => d.data_year === year)
    .map((d) => ({ nationCd: d.nation_cd, value: d.population }));
  return toGeoTable('人口(万人)', rows, nations);
}

export async function buildBirthrateGeoTable(year: number): Promise<ChartTable> {
  const [data, nations] = await Promise.all([loadJSON<any[]>('birthrate-mortality.json'), loadNationsByCd()]);
  const rows = data
    .filter((d) => d.data_year === year && d.birthrate != null)
    .map((d) => ({ nationCd: d.nation_cd, value: d.birthrate }));
  return toGeoTable('出生率（％）', rows, nations);
}

/** 自然増加率 = 出生率 - 死亡率 */
export async function buildNaturalGrowthGeoTable(year: number): Promise<ChartTable> {
  const [data, nations] = await Promise.all([loadJSON<any[]>('birthrate-mortality.json'), loadNationsByCd()]);
  const rows = data
    .filter((d) => d.data_year === year && d.birthrate != null && d.mortality != null)
    .map((d) => ({ nationCd: d.nation_cd, value: Math.round((d.birthrate - d.mortality) * 100) / 100 }));
  return toGeoTable('自然増加率（％）', rows, nations);
}

export async function loadPerCapitaGni(year: number): Promise<Map<number, number>> {
  const data = await loadJSON<any[]>('gdp-gni.json');
  return new Map(
    data.filter((d) => d.data_year === year && d.per_capita_gni != null).map((d) => [d.nation_cd as number, d.per_capita_gni as number])
  );
}

export async function buildPerCapitaGniGeoTable(year: number): Promise<ChartTable> {
  const [gni, nations] = await Promise.all([loadPerCapitaGni(year), loadNationsByCd()]);
  const rows = [...gni.entries()].map(([nationCd, value]) => ({ nationCd, value }));
  return toGeoTable('1人あたりGNI(ドル)', rows, nations);
}

/**
 * 主要国の割合（％積み上げ横棒）用データ。production の最新年次について、
 * 上位N国＋「その他」（cd=999の合計値から上位N国分を引いた値）を1行で返す。
 */
export async function buildProductionBarTable(statisticsId: number, nationCount: number): Promise<ChartTable> {
  const [production, info, nations] = await Promise.all([
    loadJSON<any[]>('production.json'),
    loadJSON<any[]>('statistics-info.json'),
    loadNationsByCd(),
  ]);
  const rows = production.filter((p) => p.statistics_id === statisticsId);
  if (rows.length === 0) return [];
  const latestYear = Math.max(...rows.map((r) => r.data_year));
  const unit = info.find((i) => i.id === statisticsId)?.unit ?? '';
  const latest = rows.filter((r) => r.data_year === latestYear);
  const total = latest.find((r) => r.nation_cd === 999);
  const top = latest
    .filter((r) => r.nation_cd !== 999)
    .sort((a, b) => b.value - a.value)
    .slice(0, nationCount);

  const fmt = (value: number) => `${value}${unit ? `(${unit})` : ''}`;
  const header: Cell[] = ['年', ...top.map((r) => nations.get(r.nation_cd)?.short_name ?? String(r.nation_cd))];
  const values: Cell[] = [`${latestYear}年`, ...top.map((r) => ({ v: r.value, f: fmt(r.value) }))];
  if (total) {
    const topSum = top.reduce((sum, r) => sum + r.value, 0);
    header.push('その他');
    values.push({ v: total.value - topSum, f: fmt(total.value - topSum) });
  }
  return [header, values];
}
