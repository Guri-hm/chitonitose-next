/**
 * ::chart{}ディレクティブ用のデータ整形関数群。
 * 元PHPサイトのgeo/php/*.phpが行っていたSQL集計・単位変換ロジックをTS側で再現し、
 * Google Chartsの`arrayToDataTable`にそのまま渡せる二次元配列（data）を組み立てる。
 * LessonChart.tsx（クライアントコンポーネント）から呼ばれる純粋関数のみを置く場所。
 */

export interface ChartBuildResult {
  data: (string | number)[][];
  options?: Record<string, any>;
}

type Datasets = Record<string, any[]>;

function nationName(nations: any[] | undefined, cd: string | number): string {
  return nations?.find((n) => String(n.cd) === String(cd))?.short_name || String(cd);
}

function latestYearRows(rows: any[], yearKey = 'data_year'): any[] {
  if (rows.length === 0) return [];
  const maxYear = Math.max(...rows.map((r) => r[yearKey]));
  return rows.filter((r) => r[yearKey] === maxYear);
}

// ::chart{dataset="power_generation" params="{nation_cd}"} 用（旧power_generation.php相当）
function buildPowerGeneration(datasets: Datasets, params: any): ChartBuildResult | null {
  const rows = (datasets.power_generation || []).filter((r) => r.nation_cd === Number(params.nation_cd));
  const latest = latestYearRows(rows)[0];
  if (!latest) return null;
  const fields: [string, string][] = [
    ['thermal_power', '火力'],
    ['hydroelectricity', '水力'],
    ['nuclear_power', '原子力'],
    ['wind_power', '風力'],
    ['solar_power', '太陽光'],
    ['geothermal_power', '地熱'],
    ['biomass_power', 'バイオマス'],
  ];
  const data: (string | number)[][] = [['項目', '値']];
  fields.forEach(([col, label]) => {
    const v = Number(latest[col]);
    if (v > 0) data.push([label, v]);
  });
  return data.length > 1 ? { data } : null;
}

// ::chart{dataset="wood_type" params="{nation_cd}"} 用（旧wood_type.php相当。実体はwood_useテーブル）
function buildWoodType(datasets: Datasets, params: any): ChartBuildResult | null {
  const rows = (datasets.wood_use || []).filter((r) => r.nation_cd === Number(params.nation_cd));
  const latest = latestYearRows(rows)[0];
  if (!latest) return null;
  const data: (string | number)[][] = [['種類', '割合(%)']];
  if (Number(latest.coniferous_tree) > 0) data.push(['針葉樹', Number(latest.coniferous_tree)]);
  if (Number(latest.broadleaf_tree) > 0) data.push(['広葉樹', Number(latest.broadleaf_tree)]);
  return data.length > 1 ? { data } : null;
}

// ::chart{dataset="wood_use" params="{nation_cd}"} 用（旧wood_use.php相当、単位:百万㎥）
function buildWoodUse(datasets: Datasets, params: any): ChartBuildResult | null {
  const rows = (datasets.wood_use || []).filter((r) => r.nation_cd === Number(params.nation_cd));
  const latest = latestYearRows(rows)[0];
  if (!latest) return null;
  const production = Number(latest.production) || 0;
  const data: (string | number)[][] = [['用途', '生産量(百万㎥)']];
  const timber = (Number(latest.timber) * production) / 100;
  const fuelWood = (Number(latest.fuel_wood) * production) / 100;
  if (timber > 0) data.push(['用材', Math.round(timber * 100) / 100]);
  if (fuelWood > 0) data.push(['薪炭材', Math.round(fuelWood * 100) / 100]);
  return data.length > 1 ? { data } : null;
}

// ::chart{dataset="wood_use_comparison" params="{params:[nation_cd,...]}"} 用
function buildWoodUseComparison(datasets: Datasets, params: any, nations: any[]): ChartBuildResult | null {
  const nationCds: number[] = params.params || [];
  const woodUse = datasets.wood_use || [];
  const data: (string | number)[][] = [['国', '用材(%)', '薪炭材(%)']];
  nationCds.forEach((cd) => {
    const rows = woodUse.filter((r) => r.nation_cd === cd);
    const latest = latestYearRows(rows)[0];
    if (latest) data.push([nationName(nations, cd), Number(latest.timber) || 0, Number(latest.fuel_wood) || 0]);
  });
  return data.length > 1 ? { data, options: { isStacked: 'percent' } } : null;
}

// ::chart{dataset="wood_supply" params="{}"} 用（旧wood_supply.php相当、木材供給量と自給率の推移）
function buildWoodSupply(datasets: Datasets): ChartBuildResult | null {
  const rows = [...(datasets.wood_supply || [])].sort((a, b) => a.data_year - b.data_year);
  if (rows.length === 0) return null;
  const data: (string | number)[][] = [['年', '国産材(億㎥)', '輸入材(億㎥)', '木材自給率(%)']];
  rows.forEach((r) => {
    const domestic = Number(r.domestic_timber) / 10000;
    const imported = Number(r.imported_timber) / 10000;
    const rate = domestic + imported > 0 ? Math.round((domestic / (domestic + imported)) * 1000) / 10 : 0;
    data.push([r.data_year, Math.round(domestic * 100) / 100, Math.round(imported * 100) / 100, rate]);
  });
  return {
    data,
    options: {
      seriesType: 'bars',
      series: { 2: { type: 'line', targetAxisIndex: 1 } },
      vAxes: { 0: { title: '木材供給量(億㎥)' }, 1: { title: '木材自給率(%)' } },
      hAxis: { title: '年' },
    },
  };
}

// ::chart{dataset="forestry_worker" params="{}"} 用（旧forestry_worker.php相当）
function buildForestryWorker(datasets: Datasets): ChartBuildResult | null {
  const rows = [...(datasets.forestry_worker || [])].sort((a, b) => a.data_year - b.data_year);
  if (rows.length === 0) return null;
  const data: (string | number)[][] = [['年', '林業従事者数(万人)', '高齢者率(%)', '若年者率(%)']];
  rows.forEach((r) => {
    data.push([r.data_year, Math.round((Number(r.population) / 10000) * 10) / 10, Number(r.aging_rate), Number(r.youth_rate)]);
  });
  return {
    data,
    options: {
      seriesType: 'bars',
      series: { 1: { type: 'line', targetAxisIndex: 1 }, 2: { type: 'line', targetAxisIndex: 1 } },
      vAxes: { 0: { title: '林業従事者数(万人)' }, 1: { title: '割合(%)' } },
      hAxis: { title: '年' },
    },
  };
}

// ::chart{dataset="agricultural_work_force" params="{}"} 用
function buildAgriculturalWorkForce(datasets: Datasets): ChartBuildResult | null {
  const rows = [...(datasets.agricultural_work_force || [])].sort((a, b) => a.data_year - b.data_year);
  if (rows.length === 0) return null;
  const data: (string | number)[][] = [
    ['年', '農業就業人口(旧統計方法)(万人)', '農業就業人口(万人)', '65歳以上の割合(%)'],
  ];
  rows.forEach((r) => {
    const oldMethod = Number(r.population_statistical_method) || 0;
    const newMethod = Number(r.population) || 0;
    const elderly = Number(r.elderly) || 0;
    const total = oldMethod + newMethod;
    const elderlyRate = total > 0 ? Math.round((elderly / total) * 1000) / 10 : 0;
    data.push([r.data_year, Math.round(oldMethod / 1000) / 10, Math.round(newMethod / 1000) / 10, elderlyRate]);
  });
  return {
    data,
    options: {
      seriesType: 'bars',
      series: { 2: { type: 'line', targetAxisIndex: 1 } },
      vAxes: { 0: { title: '農業就業人口(万人)' }, 1: { title: '65歳以上の割合(%)' } },
      hAxis: { title: '年' },
      isStacked: true,
    },
  };
}

const FISH_FIELDS: Record<string, string> = {
  pelagic_fishery: '遠洋漁業',
  offshore_fishery: '沖合漁業',
  coastal_fishery: '沿岸漁業',
  sea_culture: '海面養殖業',
  inland_fishery: '内水面漁業',
  inland_water_culture: '内水面養殖業',
  import: '輸入量',
};

// ::chart{dataset="fish_catche_detail" params="{nation_cd}"} 用（日本の漁業種別内訳の推移）
function buildFishCatcheDetail(datasets: Datasets, params: any): ChartBuildResult | null {
  const rows = (datasets.fish_catche || [])
    .filter((r) => r.nation_cd === Number(params.nation_cd) && r.inland_water_culture !== null)
    .sort((a, b) => a.data_year - b.data_year);
  if (rows.length === 0) return null;
  const cols = Object.keys(FISH_FIELDS);
  const data: (string | number)[][] = [['年', ...cols.map((c) => FISH_FIELDS[c])]];
  rows.forEach((r) => {
    data.push([r.data_year, ...cols.map((c) => Math.round(((Number(r[c]) || 0) / 10000) * 10) / 10)]);
  });
  return { data, options: { isStacked: true, hAxis: { title: '年' }, vAxis: { title: '万トン' } } };
}

// ::chart{dataset="fish_catche_world" params="{nation_cd:999}"} 用（世界の漁業・養殖業の推移）
function buildFishCatcheWorld(datasets: Datasets, params: any): ChartBuildResult | null {
  const rows = (datasets.fish_catche || [])
    .filter((r) => r.nation_cd === Number(params.nation_cd ?? 999))
    .sort((a, b) => a.data_year - b.data_year);
  if (rows.length === 0) return null;
  const data: (string | number)[][] = [['年', '海面漁船漁業(万トン)', '内水面漁船漁業(万トン)', '海面養殖業(万トン)', '内水面養殖業(万トン)']];
  rows.forEach((r) => {
    const seaVessel = (Number(r.pelagic_fishery) || 0) + (Number(r.offshore_fishery) || 0) + (Number(r.coastal_fishery) || 0);
    data.push([
      r.data_year,
      Math.round((seaVessel / 10000) * 10) / 10,
      Math.round(((Number(r.inland_fishery) || 0) / 10000) * 10) / 10,
      Math.round(((Number(r.sea_culture) || 0) / 10000) * 10) / 10,
      Math.round(((Number(r.inland_water_culture) || 0) / 10000) * 10) / 10,
    ]);
  });
  return { data, options: { isStacked: true, hAxis: { title: '年' } } };
}

// ::chart{dataset="fish_catche" params="{params:[nation_cd,...]}"} 用（国別漁獲量の推移比較）
function buildFishCatche(datasets: Datasets, params: any, nations: any[]): ChartBuildResult | null {
  const nationCds: number[] = params.params || [];
  const rows = datasets.fish_catche || [];
  const years = [...new Set(rows.filter((r) => nationCds.includes(r.nation_cd)).map((r) => r.data_year))].sort(
    (a, b) => a - b
  );
  if (years.length === 0) return null;
  const data: (string | number)[][] = [['年', ...nationCds.map((cd) => nationName(nations, cd))]];
  years.forEach((year) => {
    data.push([
      year,
      ...nationCds.map((cd) => {
        const row = rows.find((r) => r.nation_cd === cd && r.data_year === year);
        return row ? Math.round(((Number(row.total) || 0) / 10000) * 10) / 10 : 0;
      }),
    ]);
  });
  return { data, options: { hAxis: { title: '年' }, vAxis: { title: '万トン' } } };
}

// ::chart{dataset="foreign_population" params="{}"} 用（国籍別在留外国人数の推移）
function buildForeignPopulation(datasets: Datasets): ChartBuildResult | null {
  const rows = datasets.foreign_population || [];
  const nationality = datasets.nationality || [];
  const codes = [1, 2, 3, 4, 5, 6, 7];
  const years = [...new Set(rows.map((r) => r.data_year))].sort((a, b) => a - b);
  if (years.length === 0) return null;
  const names = codes.map((cd) => nationality.find((n) => n.cd === cd)?.nationality_name || String(cd));
  const data: (string | number)[][] = [['年', ...names]];
  years.forEach((year) => {
    data.push([
      year,
      ...codes.map((cd) => {
        const row = rows.find((r) => r.cd === cd && r.data_year === year);
        return row ? Number(row.population) : 0;
      }),
    ]);
  });
  return { data, options: { hAxis: { title: '年' } } };
}

// ::chart{dataset="foreign_population_prefecture" params="{}"} 用（都道府県別、国籍別在留外国人）
function buildForeignPopulationPrefecture(datasets: Datasets): ChartBuildResult | null {
  const rows = datasets.foreign_population_prefecture || [];
  const nationality = datasets.nationality || [];
  const prefectures = datasets.prefectures || [];
  const codes = [1, 2, 3, 4, 5, 6, 99];
  const prefCds = [...new Set(rows.map((r) => r.prefecture_cd))].sort((a, b) => a - b);
  if (prefCds.length === 0) return null;
  const names = codes.map((cd) => nationality.find((n) => n.cd === cd)?.nationality_name || String(cd));
  const data: (string | number)[][] = [['都道府県', ...names]];
  prefCds.forEach((prefCd) => {
    const prefName = prefectures.find((p) => p.cd === prefCd)?.name || String(prefCd);
    data.push([
      prefName,
      ...codes.map((cd) => {
        const row = rows.find((r) => r.prefecture_cd === prefCd && r.nationality_cd === cd);
        return row ? Number(row.population) : 0;
      }),
    ]);
  });
  return { data, options: { isStacked: 'percent' } };
}

// ::chart{dataset="ha_per_farmer" params="{data_year, statistics_ids:[nation_cd,...]}"} 用
function buildHaPerFarmer(datasets: Datasets, params: any, nations: any[]): ChartBuildResult | null {
  const nationCds: number[] = params.statistics_ids || [];
  const dataYear = Number(params.data_year);
  const rows = datasets.land_use || [];
  const data: (string | number)[][] = [['国', '1農家あたり耕地面積(ha)']];
  nationCds.forEach((cd) => {
    const row = rows.find((r) => r.nation_cd === cd && r.data_year === dataYear);
    if (row && row.per_farmer_ha != null) data.push([nationName(nations, cd), Number(row.per_farmer_ha)]);
  });
  return data.length > 1 ? { data } : null;
}

// ::chart{dataset="production_per_ha" params="{data_year, statistics_ids:[nation_cd,...]}"} 用
function buildProductionPerHa(datasets: Datasets, params: any, nations: any[]): ChartBuildResult | null {
  const nationCds: number[] = params.statistics_ids || [];
  const dataYear = Number(params.data_year);
  const rows = datasets.production_per_ha || [];
  const data: (string | number)[][] = [['国', '耕地1haあたりの農業産出額(ドル)']];
  nationCds.forEach((cd) => {
    const row = rows.find((r) => r.nation_cd === cd && r.data_year === dataYear);
    if (row) data.push([nationName(nations, cd), Number(row.production_per_ha)]);
  });
  return data.length > 1 ? { data } : null;
}

// ::chart{dataset="region_agricultural_production" params="{data_year, region_cds:[...]}"} 用
function buildRegionAgriculturalProduction(datasets: Datasets, params: any): ChartBuildResult | null {
  const regionCds: number[] = params.region_cds || [];
  const dataYear = Number(params.data_year);
  const rows = datasets.region_agricultural_production || [];
  const regionInfo = datasets.region_info || [];
  const data: (string | number)[][] = [['地域', '米', 'いも類', '野菜', '果実', '畜産', 'その他']];
  regionCds.forEach((cd) => {
    const row = rows.find((r) => r.region_cd === cd && r.data_year === dataYear);
    if (!row) return;
    const name = regionInfo.find((r) => r.cd === cd)?.name || String(cd);
    const sum =
      (Number(row.rice) || 0) +
      (Number(row.tubers_roots) || 0) +
      (Number(row.vegetables) || 0) +
      (Number(row.fruits) || 0) +
      (Number(row.animal_husbandry) || 0);
    const other = Math.round((100 - sum) * 10) / 10;
    data.push([
      name,
      Number(row.rice) || 0,
      Number(row.tubers_roots) || 0,
      Number(row.vegetables) || 0,
      Number(row.fruits) || 0,
      Number(row.animal_husbandry) || 0,
      other > 0 ? other : 0,
    ]);
  });
  return data.length > 1 ? { data, options: { isStacked: 'percent' } } : null;
}

// ::chart{dataset="Korea_gdp" params="{}"} 用（韓国・北朝鮮の1人あたりGDP推移）
function buildKoreaGdp(datasets: Datasets): ChartBuildResult | null {
  const rows = datasets.per_unit_of_gdp || [];
  const south = rows.filter((r) => r.nation_cd === 410);
  const north = rows.filter((r) => r.nation_cd === 408);
  const years = [...new Set([...south.map((r) => r.data_year), ...north.map((r) => r.data_year)])].sort(
    (a, b) => a - b
  );
  if (years.length === 0) return null;
  const data: (string | number)[][] = [['年', '韓国(ドル)', '北朝鮮(ドル)']];
  years.forEach((year) => {
    const s = south.find((r) => r.data_year === year);
    const n = north.find((r) => r.data_year === year);
    if (s || n) data.push([year, s ? Number(s.dollar) : 0, n ? Number(n.dollar) : 0]);
  });
  return { data, options: { hAxis: { title: '年' } } };
}

// ::chart{dataset="river_flow_rate" params="{river_cd}"} 用
function buildRiverFlowRate(datasets: Datasets, params: any): ChartBuildResult | null {
  const rows = (datasets.river_flow_rate || [])
    .filter((r) => r.river_cd === Number(params.river_cd))
    .sort((a, b) => a.data_month - b.data_month);
  if (rows.length === 0) return null;
  const data: (string | number)[][] = [['月', '流量(㎥/秒)']];
  rows.forEach((r) => data.push([`${r.data_month}月`, Number(r.data_val)]));
  return { data };
}

// ::chart{dataset="export_items_bar" params="{nation_cd, year, total_amount}"} 用（輸出品目上位5+その他）
function buildExportItemsBar(datasets: Datasets, params: any): ChartBuildResult | null {
  const rows = (datasets.export_items || [])
    .filter((r) => r.nation_cd === Number(params.nation_cd) && r.data_year === Number(params.year))
    .sort((a, b) => a.lank - b.lank)
    .slice(0, 5);
  if (rows.length === 0) return null;
  const sum = rows.reduce((acc, r) => acc + (Number(r.ratio) || 0), 0);
  const other = Math.round((100 - sum) * 10) / 10;
  const data: (string | number)[][] = [['品目', '割合(%)']];
  rows.forEach((r) => data.push([r.item_name, Number(r.ratio)]));
  if (other > 0) data.push(['その他', other]);
  return { data };
}

// statistics_data（nation_name文字列ベース）を使い、ある統計IDの最新年における
// 国別構成比（上位N + その他）を1行のパイ/バー用データに変換する
// （statistics_bar2.php / statistics_highest.php 共通ロジック）
function buildStatisticsSingleYearComposition(datasets: Datasets, statisticsId: number, topN = 10): ChartBuildResult | null {
  const rows = (datasets.statistics_data || []).filter((r) => r.statistics_id === statisticsId);
  if (rows.length === 0) return null;
  const latest = latestYearRows(rows)
    .filter((r) => r.nation_name !== '世界' && r.nation_name !== '日本')
    .sort((a, b) => b.data_val - a.data_val)
    .slice(0, topN);
  if (latest.length === 0) return null;
  const info = (datasets.statistics_info || []).find((r) => r.id === statisticsId);
  const sum = latest.reduce((acc, r) => acc + (Number(r.data_val) || 0), 0);
  const other = Math.round((100 - sum) * 10) / 10;
  const data: (string | number)[][] = [['国', info?.unit || '値']];
  latest.forEach((r) => data.push([r.nation_name, Number(r.data_val)]));
  if (other > 0 && other < 100) data.push(['その他', other]);
  return { data };
}

// ::chart{dataset="statistics_bar2" params="{statistics_id}"} 用
function buildStatisticsBar2(datasets: Datasets, params: any): ChartBuildResult | null {
  return buildStatisticsSingleYearComposition(datasets, Number(params.statistics_id));
}

// ::chart{dataset="statistics_highest" params="{statistics_id}"} 用
function buildStatisticsHighest(datasets: Datasets, params: any): ChartBuildResult | null {
  return buildStatisticsSingleYearComposition(datasets, Number(params.statistics_id), 5);
}

// ::chart{dataset="statistics_any_name" params="{params:[statId,...]}"} 用（fetchChart経由）
// 1件のみなら単一統計の構成比、複数件ならstatistics_data（nation_name基準）を使った
// 年別の複数指標比較として扱う
function buildStatisticsAnyName(datasets: Datasets, params: any): ChartBuildResult | null {
  const ids: number[] = params.params || [];
  if (ids.length === 0) return null;
  if (ids.length === 1) return buildStatisticsSingleYearComposition(datasets, ids[0], 10);

  const info = datasets.statistics_info || [];
  const rows = datasets.statistics_data || [];
  const series = ids.map((id) => ({
    label: info.find((r) => r.id === id)?.data_name || String(id),
    rows: rows.filter((r) => r.statistics_id === id),
  }));
  const years = [...new Set(series.flatMap((s) => s.rows.map((r) => r.data_year)))].sort((a, b) => a - b);
  if (years.length === 0) return null;
  const data: (string | number)[][] = [['年', ...series.map((s) => s.label)]];
  years.forEach((year) => {
    data.push([
      year,
      ...series.map((s) => {
        const row = s.rows.find((r) => r.data_year === year);
        return row ? Number(row.data_val) : 0;
      }),
    ]);
  });
  return { data, options: { hAxis: { title: '年' } } };
}

// ::chart{dataset="statistics_bars2" params="{statistics_ids:[...], category?}"} 用（2モード）
function buildStatisticsBars2(datasets: Datasets, params: any): ChartBuildResult | null {
  const ids: number[] = params.statistics_ids || (params.statistics_id ? [params.statistics_id] : []);
  if (ids.length === 0) return null;

  if (params.category === 'nation') {
    return buildStatisticsSingleYearComposition(datasets, ids[0], 10);
  }

  // 各statistics_idは「ある年（または単一時点）のスナップショット」を表し、
  // nation_nameは実際にはカテゴリ名（輸入先国・産業分類・エネルギー源等）として使われている。
  // 複数idを指定した場合は、各idのdata_nameに含まれる「◯◯年」を横軸にした
  // 構成比（100%積み上げ棒）の推移として扱う。
  const info = datasets.statistics_info || [];
  const rows = datasets.statistics_data || [];
  const snapshots = ids.map((id) => {
    const infoRow = info.find((r) => r.id === id);
    const yearMatch = infoRow?.data_name?.match(/(\d{4})年/);
    return { label: yearMatch ? Number(yearMatch[1]) : (infoRow?.data_name || String(id)), rows: rows.filter((r) => r.statistics_id === id) };
  });
  const categories = [...new Set(snapshots.flatMap((s) => s.rows.map((r) => r.nation_name)))];
  if (categories.length === 0) return null;
  const data: (string | number)[][] = [['年', ...categories]];
  snapshots.forEach((snap) => {
    data.push([
      snap.label,
      ...categories.map((cat) => {
        const row = snap.rows.find((r) => r.nation_name === cat);
        return row ? Number(row.data_val) : 0;
      }),
    ]);
  });
  return { data, options: { isStacked: 'percent' } };
}

// statistics_combo.php / different_statistics_json.php 共通:
// statistics_changes_data（nation_cdベース、arrange_unitで単位変換）を使った複数統計の時系列比較
function buildStatisticsChangesTimeSeries(
  datasets: Datasets,
  pairs: { statistics_id: number; nation_cd: number }[]
): ChartBuildResult | null {
  const info = datasets.statistics_info || [];
  const changesData = datasets.statistics_changes_data || [];
  const series = pairs.map((p) => {
    const infoRow = info.find((r) => r.id === p.statistics_id);
    const arrangeUnit = infoRow?.arrange_unit ? Number(infoRow.arrange_unit) : 1;
    return {
      label: infoRow?.data_name || String(p.statistics_id),
      rows: changesData
        .filter((r) => r.statistics_id === p.statistics_id && r.nation_cd === p.nation_cd)
        .map((r) => ({ data_year: r.data_year, value: r.value / arrangeUnit })),
    };
  });
  const years = [...new Set(series.flatMap((s) => s.rows.map((r) => r.data_year)))].sort((a, b) => a - b);
  if (years.length === 0) return null;
  const data: (string | number)[][] = [['年', ...series.map((s) => s.label)]];
  years.forEach((year) => {
    data.push([
      year,
      ...series.map((s) => {
        const row = s.rows.find((r) => r.data_year === year);
        return row ? Math.round(row.value * 10) / 10 : 0;
      }),
    ]);
  });
  return { data, options: { hAxis: { title: '年' } } };
}

// ::chart{dataset="statistics_combo" params="{params:[{statistics_id,nation_cd},...]}"} 用
function buildStatisticsCombo(datasets: Datasets, params: any): ChartBuildResult | null {
  const pairs = (params.params || []) as { statistics_id: number; nation_cd: number }[];
  return buildStatisticsChangesTimeSeries(datasets, pairs);
}

// ::chart{dataset="different_statistics_json" params="{params:[[statId,nationCd],...]}"} 用
function buildDifferentStatisticsJson(datasets: Datasets, params: any): ChartBuildResult | null {
  const raw = (params.params || []) as (number[] | { statistics_id: number; nation_cd: number })[];
  const pairs = raw.map((p) => (Array.isArray(p) ? { statistics_id: p[0], nation_cd: p[1] } : p));
  return buildStatisticsChangesTimeSeries(datasets, pairs);
}

// ::chart{dataset="statistics_line" params="{statistics_id, params:[nation_cd,...]}"} 用（旧lineChartAsync相当）
function buildStatisticsLine(datasets: Datasets, params: any, nations: any[]): ChartBuildResult | null {
  const statisticsId = Number(params.statistics_id);
  const nationCds: number[] = params.params || [];
  if (!statisticsId || nationCds.length === 0) return null;
  const pairs = nationCds.map((cd) => ({ statistics_id: statisticsId, nation_cd: cd }));

  const info = (datasets.statistics_info || []).find((r) => r.id === statisticsId);
  const arrangeUnit = info?.arrange_unit ? Number(info.arrange_unit) : 1;
  const changesData = datasets.statistics_changes_data || [];
  const series = pairs.map((p) => ({
    label: nationName(nations, p.nation_cd),
    rows: changesData
      .filter((r) => r.statistics_id === p.statistics_id && r.nation_cd === p.nation_cd)
      .map((r) => ({ data_year: r.data_year, value: r.value / arrangeUnit })),
  }));
  const years = [...new Set(series.flatMap((s) => s.rows.map((r) => r.data_year)))].sort((a, b) => a - b);
  if (years.length === 0) return null;
  const data: (string | number)[][] = [['年', ...series.map((s) => s.label)]];
  years.forEach((year) => {
    data.push([
      year,
      ...series.map((s) => {
        const row = s.rows.find((r) => r.data_year === year);
        return row ? Math.round(row.value * 10) / 10 : 0;
      }),
    ]);
  });
  return { data, options: { hAxis: { title: '年' } } };
}

// ::chart{dataset="static" params="{data:[[...]], options:{...}}"} 用（データを直書きした手書きチャート）
function buildStatic(_datasets: Datasets, params: any): ChartBuildResult | null {
  if (!Array.isArray(params.data) || params.data.length === 0) return null;
  return { data: params.data, options: params.options || {} };
}

type ChartBuilder = (datasets: Datasets, params: any, nations: any[]) => ChartBuildResult | null;

export const CHART_BUILDERS: Record<string, ChartBuilder> = {
  power_generation: buildPowerGeneration,
  wood_type: buildWoodType,
  wood_use: buildWoodUse,
  wood_use_comparison: buildWoodUseComparison,
  wood_supply: buildWoodSupply,
  forestry_worker: buildForestryWorker,
  agricultural_work_force: buildAgriculturalWorkForce,
  fish_catche_detail: buildFishCatcheDetail,
  fish_catche_world: buildFishCatcheWorld,
  fish_catche: buildFishCatche,
  foreign_population: buildForeignPopulation,
  foreign_population_prefecture: buildForeignPopulationPrefecture,
  ha_per_farmer: buildHaPerFarmer,
  production_per_ha: buildProductionPerHa,
  region_agricultural_production: buildRegionAgriculturalProduction,
  Korea_gdp: buildKoreaGdp,
  river_flow_rate: buildRiverFlowRate,
  export_items_bar: buildExportItemsBar,
  statistics_bar2: buildStatisticsBar2,
  statistics_highest: buildStatisticsHighest,
  statistics_any_name: buildStatisticsAnyName,
  statistics_bars2: buildStatisticsBars2,
  statistics_combo: buildStatisticsCombo,
  different_statistics_json: buildDifferentStatisticsJson,
  statistics_line: buildStatisticsLine,
  static: buildStatic,
};
