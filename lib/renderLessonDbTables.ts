import { formatNumber } from '@/lib/formatNumber';
import type {
  BasicData,
  StatisticsInfo,
  StatisticsDataRow,
  TradeItem,
  Nation,
  LandUse,
  CityRow,
  ImmigrationRow,
  IndustrialPopulationStructure,
  PortContainer,
  PortInfo,
  PortTransactionValue,
  ItemsEachPort,
  FoodSelfSufficiencyRate,
  TotalFertilityRate,
  AgingSociety,
  BirthRate,
  TradeBalance,
  AreaPopulationRow,
  StatisticsChangesData,
} from '@/lib/dataLoader';

export interface GeoLessonDbDatasets {
  basicData: BasicData[];
  statisticsInfo: StatisticsInfo[];
  statisticsData: StatisticsDataRow[];
  exportItems: TradeItem[];
  importItems: TradeItem[];
  nations?: Nation[];
  landUse?: LandUse[];
  cities?: CityRow[];
  immigration?: ImmigrationRow[];
  industrialPopulationStructure?: IndustrialPopulationStructure[];
  portContainer?: PortContainer[];
  portInfo?: PortInfo[];
  portTransactionValue?: PortTransactionValue[];
  itemsEachPorts?: ItemsEachPort[];
  foodSelfSufficiencyRate?: FoodSelfSufficiencyRate[];
  totalFertilityRate?: TotalFertilityRate[];
  agingSociety?: AgingSociety[];
  birthRate?: BirthRate[];
  tradeBalance?: TradeBalance[];
  areaPopulation?: AreaPopulationRow[];
  statisticsChangesData?: StatisticsChangesData[];
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
  hasNumCol?: string; // "true"なら行番号列を追加（旧statistics_any_name_table.php相当）
  info: StatisticsInfo[];
  data: StatisticsDataRow[];
}

// ::statistics{...} 用の統計ランキング表（旧statistics.php/statistics_any_name_table.php相当）
function renderStatisticsTable(params: StatisticsTableParams): string {
  const { id, order = 'desc', limit, offset, dataYear, years, linked, hasNumCol, info, data } = params;
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
    .map((row, idx) => {
      const yearCells = yearList
        .map((y) => `<td class="text-end">${formatNumber(findYearVal(row.nation_name, y))}</td>`)
        .join('');
      const linkedCells = linkedList
        .map((lid) => `<td class="text-end">${formatNumber(findLinkedVal(row.nation_name, lid))}</td>`)
        .join('');
      const numCell = hasNumCol === 'true' ? `<td class="text-center">${idx}</td>` : '';
      return (
        `<tr>${numCell}<td class="text-center">${escapeHtml(row.nation_name)}</td>` +
        `<td class="text-end">${formatNumber(row.data_val)}</td>${yearCells}${linkedCells}</tr>`
      );
    })
    .join('');

  const numHeader = hasNumCol === 'true' ? '<th class="text-center"></th>' : '';

  return (
    '<div class="overflow-x-auto mt-10 mb-10"><table class="w-auto table mx-auto">' +
    `<caption class="text-center">${escapeHtml(infoRow.data_name)}</caption>` +
    `<thead><tr>${numHeader}<th class="text-center">国名</th>` +
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

function nationName(nations: Nation[] | undefined, cd: string | number): string {
  return nations?.find((n) => String(n.cd) === String(cd))?.short_name || String(cd);
}

// ::land-use{...} 用の土地利用表（旧land_use.php相当）
function renderLandUseTable(attrs: Record<string, string>, rows: LandUse[], nations?: Nation[]): string {
  const dataYear = Number(attrs.dataYear);
  const params = (attrs.params || attrs.nationCd || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const groupCd = attrs.groupCd ? Number(attrs.groupCd) : undefined;

  let matched = (rows || []).filter((r) => r.data_year === dataYear);
  if (groupCd !== undefined) {
    matched = matched.filter((r) => r.group_cd === groupCd);
  } else if (params.length > 0) {
    matched = matched.filter((r) => params.includes(String(r.nation_cd)));
  }
  if (matched.length === 0) return NOT_FOUND_HTML;

  const showNameCol = groupCd !== undefined || params.length > 1;
  const title = groupCd !== undefined
    ? `ヨーロッパの土地利用（${dataYear}年）`
    : showNameCol
      ? `土地利用（${dataYear}年）`
      : `${nationName(nations, matched[0].nation_cd)}の土地利用（${dataYear}年）`;

  const nameHeader = showNameCol ? '<th class="text-center">国名</th>' : '';
  const bodyRows = matched
    .sort((a, b) => nationName(nations, a.nation_cd).localeCompare(nationName(nations, b.nation_cd)))
    .map((row) => {
      const nameCell = showNameCol ? `<td class="text-center">${escapeHtml(nationName(nations, row.nation_cd))}</td>` : '';
      return (
        `<tr>${nameCell}` +
        `<td class="text-end">${formatNumber(row.cultivated_land_rate)}</td>` +
        `<td class="text-end">${formatNumber(row.pasture_rate)}</td>` +
        `<td class="text-end">${formatNumber(row.forest_rate)}</td>` +
        `<td class="text-end">${formatNumber(row.per_farmer_ha)}</td>` +
        `<td class="text-end">${formatNumber(row.farming_rate)}</td></tr>`
      );
    })
    .join('');

  return (
    '<div class="overflow-x-auto mt-10 mb-10">' +
    `<div class="text-center">${title}</div>` +
    '<table class="mx-auto w-auto table"><thead><tr>' +
    `${nameHeader}<th class="text-center">耕地率（％）</th><th class="text-center">牧場・牧草地率（％）</th>` +
    '<th class="text-center">森林率（％）</th><th class="text-center">農民1人あたり耕地（ha）</th>' +
    `<th class="text-center">就農率（％）</th></tr></thead><tbody>${bodyRows}</tbody></table></div>`
  );
}

// ::city{...} 用の主要都市人口表（旧city.php相当）
function renderCityTable(attrs: Record<string, string>, rows: CityRow[]): string {
  const params = (attrs.params || '').split(',').map((s) => s.trim()).filter(Boolean);
  if (params.length === 0) return NOT_FOUND_HTML;

  const matched = (rows || [])
    .filter((r) => params.includes(String(r.nation_cd)))
    .sort((a, b) => a.nation_cd - b.nation_cd || b.population - a.population);
  if (matched.length === 0) return NOT_FOUND_HTML;

  const showNationCol = params.length > 2;
  const title = showNationCol ? '<div class="text-center">主な都市の人口</div>' : '';
  const nameHeader = showNationCol ? '<th class="text-center">国名</th>' : '';

  const bodyRows = matched
    .map((row) => {
      const nameCell = showNationCol
        ? `<td class="text-center">${escapeHtml(row.nation_cd)}</td>`
        : '';
      return (
        `<tr>${nameCell}<td class="text-center">${escapeHtml(row.city_name)}</td>` +
        `<td class="text-end">${formatNumber(row.population / 10)}</td>` +
        `<td class="text-end">${escapeHtml(row.data_year)}年</td>` +
        `<td class="text-end">${row.capital_flg ? '首都' : ''}</td></tr>`
      );
    })
    .join('');

  return (
    `<div class="overflow-x-auto mt-10 mb-10">${title}` +
    '<table class="mx-auto w-auto table"><thead><tr>' +
    `${nameHeader}<th class="text-center">都市名</th><th class="text-center">人口(万人)</th>` +
    `<th class="text-center">統計年次</th><th class="text-center">備考</th></tr></thead><tbody>${bodyRows}</tbody></table></div>`
  );
}

// ::immigration{...} 用の移民表（旧immigration.php相当）
function renderImmigrationTable(nationCd: string, rows: ImmigrationRow[], nations?: Nation[]): string {
  const matched = (rows || []).filter((r) => String(r.nation_cd) === nationCd);
  if (matched.length === 0) return NOT_FOUND_HTML;

  const maxYear = Math.max(...matched.map((r) => r.data_year));
  const filtered = matched.filter((r) => r.data_year === maxYear).sort((a, b) => b.value - a.value);

  const bodyRows = filtered
    .map((row) => {
      const label = row.nation_cd_from ? escapeHtml(nationName(nations, row.nation_cd_from)) : '人口比(%)';
      return `<tr><td class="text-center">${label}</td><td class="text-end">${formatNumber(row.value)}</td></tr>`;
    })
    .join('');

  return (
    '<div class="overflow-x-auto mt-10 mb-10">' +
    `<div class="text-center">${escapeHtml(nationName(nations, nationCd))}の移民（${maxYear}年）</div>` +
    '<table class="mx-auto w-auto table"><thead><tr>' +
    `<th class="text-center">出身名</th><th class="text-center">千人</th></tr></thead><tbody>${bodyRows}</tbody></table></div>`
  );
}

// ::industrial-population{...} 用の産業別人口構成表（旧industrial_population_structure.php相当）
function renderIndustrialPopulationTable(
  attrs: Record<string, string>,
  rows: IndustrialPopulationStructure[],
  nations?: Nation[]
): string {
  const dataYear = Number(attrs.dataYear);
  const params = (attrs.params || '').split(',').map((s) => s.trim()).filter(Boolean);
  const matched = (rows || []).filter((r) => params.includes(String(r.nation_cd)) && r.data_year === dataYear);
  if (matched.length === 0) return NOT_FOUND_HTML;

  const showNameCol = params.length > 1;
  const title = showNameCol
    ? '主な国の産業別人口構成'
    : `${nationName(nations, matched[0].nation_cd)}の産業別人口構成`;
  const nameHeader = showNameCol ? '<th class="text-center" rowspan="2">国名</th>' : '';

  const bodyRows = matched
    .map((row) => {
      const tertiary = Math.round((100 - row.primary_rate - row.secondary_rate) * 10) / 10;
      const nameCell = showNameCol ? `<td class="text-center">${escapeHtml(nationName(nations, row.nation_cd))}</td>` : '';
      return (
        `<tr>${nameCell}<td class="text-end">${formatNumber(row.primary_rate)}</td>` +
        `<td class="text-end">${formatNumber(row.secondary_rate)}</td><td class="text-end">${formatNumber(tertiary)}</td></tr>`
      );
    })
    .join('');

  return (
    '<div class="overflow-x-auto mt-10 mb-10">' +
    `<div class="text-center">${title}</div>` +
    '<table class="mx-auto w-auto table"><thead>' +
    `<tr>${nameHeader}<th class="text-center" colspan="3">産業別人口（％、${dataYear - 5}～${dataYear}年）</th></tr>` +
    '<tr><th class="text-center">1次</th><th class="text-center">2次</th><th class="text-center">3次</th></tr>' +
    `</thead><tbody>${bodyRows}</tbody></table></div>`
  );
}

// ::port-container{} 用の主な港のコンテナ取扱量表（旧port_container.php相当、パラメータなし固定表示）
function renderPortContainerTable(rows: PortContainer[], nations?: Nation[]): string {
  const sorted = [...(rows || [])].sort((a, b) => b.transaction_volume - a.transaction_volume).slice(0, 12);
  if (sorted.length === 0) return NOT_FOUND_HTML;

  const dataYear = sorted[0].data_year;
  const bodyRows = sorted
    .map(
      (row) =>
        `<tr><td class="text-center">${escapeHtml(row.port_name)}</td>` +
        `<td class="text-center">${escapeHtml(nationName(nations, row.nation_cd))}</td>` +
        `<td class="text-end">${formatNumber(row.transaction_volume)}</td></tr>`
    )
    .join('');

  return (
    '<div class="overflow-x-auto mt-10 mb-10">' +
    `<div class="text-center">主な港のコンテナ取扱量（${dataYear}年、万TEU）</div>` +
    '<table class="w-auto table mx-auto"><thead><tr>' +
    `<th class="text-center">港名</th><th class="text-center">国名</th><th class="text-center">${dataYear}年</th>` +
    `</tr></thead><tbody>${bodyRows}</tbody></table>` +
    '<div class="sup">TEU<div class="lead">20フィートのコンテナに換算したコンテナ数の単位</div></div></div>'
  );
}

// ::items-each-ports{...} 用の港別貿易額表（旧items_each_ports.php相当）
function renderItemsEachPortsTable(
  attrs: Record<string, string>,
  items: ItemsEachPort[],
  portInfo: PortInfo[],
  portTransactionValue: PortTransactionValue[]
): string {
  const nationCd = Number(attrs.nationCd);
  const dataYear = Number(attrs.dataYear);
  const expImpFlg = Number(attrs.expImpFlg);

  const matchedItems = (items || []).filter(
    (r) => r.nation_cd === nationCd && r.exp_imp_flg === expImpFlg && r.data_year === dataYear
  );
  if (matchedItems.length === 0) return NOT_FOUND_HTML;

  const portInfoMap = new Map((portInfo || []).map((p) => [p.cd, p.name]));
  const portValueMap = new Map(
    (portTransactionValue || [])
      .filter((p) => p.exp_imp_flg === expImpFlg && p.data_year === dataYear)
      .map((p) => [p.port_cd, p.transaction_value])
  );

  const byPort = new Map<number, ItemsEachPort[]>();
  matchedItems.forEach((item) => {
    const list = byPort.get(item.port_cd) || [];
    list.push(item);
    byPort.set(item.port_cd, list);
  });

  const ports = [...byPort.entries()]
    .map(([portCd, portItems]) => ({
      portCd,
      value: portValueMap.get(portCd) || 0,
      items: portItems.sort((a, b) => b.rate - a.rate),
    }))
    .sort((a, b) => b.value - a.value);

  const bodyRows = ports
    .map(({ portCd, value, items: portItems }) => {
      const itemsText = portItems.map((it) => `${escapeHtml(it.item_name)}(${escapeHtml(it.rate)})`).join('');
      return (
        `<tr><td class="text-center">${escapeHtml(portInfoMap.get(portCd) || portCd)}</td>` +
        `<td class="text-center">${formatNumber(value)}</td><td class="text-start">${itemsText}</td></tr>`
      );
    })
    .join('');

  const label = expImpFlg === 0 ? '輸出港' : '輸入港';

  return (
    '<div class="overflow-x-auto mt-10 mb-10">' +
    `<div class="text-center">主な港別貿易額（${dataYear}年、億円）</div>` +
    '<table class="w-auto table mx-auto"><thead><tr>' +
    `<th class="text-center">${label}</th><th class="text-center">取引額</th><th class="text-center">上位３輸出品（%）</th>` +
    `</tr></thead><tbody>${bodyRows}</tbody></table></div>`
  );
}

// ::food-self-sufficiency{...} 用の食料自給率表（旧food_self_sufficiency_rate.php相当）
function renderFoodSelfSufficiencyTable(
  attrs: Record<string, string>,
  rows: FoodSelfSufficiencyRate[],
  nations?: Nation[]
): string {
  const dataYear = Number(attrs.dataYear);
  const params = (attrs.params || '').split(',').map((s) => s.trim()).filter(Boolean);
  const matched = (rows || [])
    .filter((r) => params.includes(String(r.nation_cd)) && r.data_year === dataYear)
    .sort((a, b) => a.nation_cd - b.nation_cd);
  if (matched.length === 0) return NOT_FOUND_HTML;

  const bodyRows = matched
    .map(
      (row) =>
        `<tr><td class="text-center">${escapeHtml(nationName(nations, row.nation_cd))}</td>` +
        `<td class="text-end">${formatNumber(row.calorie_base)}</td>` +
        `<td class="text-end">${formatNumber(row.grain)}</td>` +
        `<td class="text-end">${formatNumber(row.food_grain)}</td>` +
        `<td class="text-end">${formatNumber(row.wheat)}</td>` +
        `<td class="text-end">${formatNumber(row.coarse_grain)}</td>` +
        `<td class="text-end">${formatNumber(row.beans)}</td>` +
        `<td class="text-end">${formatNumber(row.vegetables)}</td>` +
        `<td class="text-end">${formatNumber(row.fruits)}</td>` +
        `<td class="text-end">${formatNumber(row.meat)}</td>` +
        `<td class="text-end">${formatNumber(row.egg)}</td>` +
        `<td class="text-end">${formatNumber(row.milk_dairy_products)}</td></tr>`
    )
    .join('');

  return (
    '<div class="overflow-x-auto mt-10 mb-10">' +
    `<div class="text-center">食料自給率（${dataYear}年、%）</div>` +
    '<table class="mx-auto w-auto table"><thead>' +
    '<tr><td rowspan="2" class="text-center">国</td><td rowspan="2" class="text-center">食料<br>自給率</td>' +
    '<td colspan="2" class="text-center">穀物</td><td rowspan="2" class="text-center">粗粒<br>穀物</td>' +
    '<td rowspan="2" class="text-center">豆類</td><td rowspan="2" class="text-center">野菜<br>類</td>' +
    '<td rowspan="2" class="text-center">果実<br>類</td><td rowspan="2" class="text-center">肉類</td>' +
    '<td rowspan="2" class="text-center">卵類</td><td rowspan="2" class="text-center">牛乳・<br>乳製品</td></tr>' +
    '<tr><td class="text-center">食用<br>穀物</td><td class="text-center">うち<br>小麦</td></tr>' +
    `</thead><tbody>${bodyRows}</tbody></table></div>`
  );
}

// ::total-fertility-rate{...} 用の合計特殊出生率表（旧total_fertility_rate.php相当）
function renderTotalFertilityRateTable(attrs: Record<string, string>, rows: TotalFertilityRate[], nations?: Nation[]): string {
  const params = (attrs.params || '').split(',').map((s) => s.trim()).filter(Boolean);
  const candidates = (rows || []).filter((r) => params.includes(String(r.nation_cd)));
  if (candidates.length === 0) return NOT_FOUND_HTML;

  const maxYear = Math.max(...candidates.map((r) => r.data_year));
  const matched = candidates.filter((r) => r.data_year === maxYear).sort((a, b) => a.nation_cd - b.nation_cd);

  const bodyRows = matched
    .map(
      (row) =>
        `<tr><td class="text-center">${escapeHtml(nationName(nations, row.nation_cd))}</td>` +
        `<td class="text-end">${formatNumber(row.value)}</td></tr>`
    )
    .join('');

  return (
    '<div class="overflow-x-auto mt-10 mb-10">' +
    `<div class="text-center">合計特殊出生率（${maxYear}年）</div>` +
    '<table class="w-auto table mx-auto"><thead><tr>' +
    `<th class="text-center">国名</th><th class="text-end">合計特殊出生率</th></tr></thead><tbody>${bodyRows}</tbody></table></div>`
  );
}

// ::aging-society{...} 用の高齢化表（旧aging_society.php相当）
function renderAgingSocietyTable(
  attrs: Record<string, string>,
  agingRows: AgingSociety[],
  birthRows: BirthRate[],
  nations?: Nation[]
): string {
  const params = (attrs.params || '').split(',').map((s) => s.trim()).filter(Boolean);
  const matched = (agingRows || [])
    .filter((r) => params.includes(String((r as any).nation_cd)))
    .sort((a, b) => (a as any)['7percent'] - (b as any)['7percent']);
  if (matched.length === 0) return NOT_FOUND_HTML;

  const maxBirthYear = birthRows && birthRows.length > 0 ? Math.max(...birthRows.map((r) => r.data_year)) : undefined;

  const bodyRows = matched
    .map((row: any) => {
      const birth = birthRows?.find((b) => b.nation_cd === row.nation_cd && b.data_year === maxBirthYear);
      return (
        `<tr><td class="text-center">${escapeHtml(nationName(nations, row.nation_cd))}</td>` +
        `<td class="text-center">${escapeHtml(row['7percent'])}年</td>` +
        `<td class="text-center">${escapeHtml(row['14percent'])}年</td>` +
        `<td class="text-end">${birth ? formatNumber(birth.value) : ''}</td></tr>`
      );
    })
    .join('');

  return (
    '<div class="overflow-x-auto mt-10 mb-10">' +
    '<div class="text-center">各国の高齢化</div>' +
    '<table class="w-auto table mx-auto"><thead>' +
    '<tr><th class="text-center" rowspan="2">国名</th><th class="text-end" colspan="2">高齢化社会・高齢社会の到達年数</th>' +
    '<th class="text-end">出生率(‰)</th></tr>' +
    `<tr><th class="text-center">7%</th><th class="text-center">14%</th><th class="text-center">${maxBirthYear ?? ''}年</th></tr>` +
    `</thead><tbody>${bodyRows}</tbody></table></div>`
  );
}

// ::trade-balance{...} 用の貿易バランス表（旧trade_balance.php相当）
function renderTradeBalanceTable(attrs: Record<string, string>, rows: TradeBalance[], nations?: Nation[]): string {
  const dataYear = Number(attrs.dataYear);
  const params = (attrs.params || '').split(',').map((s) => s.trim()).filter(Boolean);
  const orderCol = (attrs.orderColName || 'amount') as 'export' | 'import' | 'profit' | 'amount';

  const matched = (rows || [])
    .filter((r) => params.includes(String(r.nation_cd)) && r.data_year === dataYear)
    .map((r) => ({ ...r, amount: r.export + r.import, profit: r.export - r.import }))
    .sort((a, b) => (b as any)[orderCol] - (a as any)[orderCol]);
  if (matched.length === 0) return NOT_FOUND_HTML;

  const showNameCol = params.length > 1;
  const title = showNameCol
    ? `主な国の貿易バランス（百万ドル、${dataYear}年）`
    : `${nationName(nations, matched[0].nation_cd)}の貿易バランス（百万ドル、${dataYear}年）`;
  const nameHeader = showNameCol ? '<th class="text-center">国名</th>' : '';

  const bodyRows = matched
    .map((row) => {
      const nameCell = showNameCol ? `<td class="text-center">${escapeHtml(nationName(nations, row.nation_cd))}</td>` : '';
      return (
        `<tr>${nameCell}<td class="text-end">${formatNumber(row.amount)}</td>` +
        `<td class="text-end">${formatNumber(row.export)}</td><td class="text-end">${formatNumber(row.import)}</td>` +
        `<td class="text-end">${formatNumber(row.profit)}</td></tr>`
      );
    })
    .join('');

  return (
    '<div class="overflow-x-auto mt-10 mb-10">' +
    `<div class="text-center">${title}</div>` +
    '<table class="mx-auto w-auto table"><thead><tr>' +
    `${nameHeader}<th class="text-center">貿易総額</th><th class="text-center">輸出額</th>` +
    `<th class="text-center">輸入額</th><th class="text-center">貿易収支</th></tr></thead><tbody>${bodyRows}</tbody></table></div>`
  );
}

// ::area-population{...} 用の面積・人口・人口密度ランキング表（旧industrial_population_structure.php ※実体はarea_population.php相当）
function renderAreaPopulationTable(attrs: Record<string, string>, rows: AreaPopulationRow[]): string {
  const order = attrs.order || 'population';
  const limit = attrs.limit ? Number(attrs.limit) : undefined;
  const offset = attrs.offset ? Number(attrs.offset) : 0;

  const sorted = [...(rows || [])].sort((a, b) => (b as any)[order] - (a as any)[order]);
  const sliced = limit !== undefined ? sorted.slice(offset, offset + limit) : sorted.slice(offset);
  if (sliced.length === 0) return NOT_FOUND_HTML;

  const bodyRows = sliced
    .map(
      (row) =>
        `<tr><td class="text-center">${escapeHtml(row.short_name)}</td>` +
        `<td class="text-end">${formatNumber(row.area)}</td>` +
        `<td class="text-end">${formatNumber(row.population)}</td>` +
        `<td class="text-end">${formatNumber(row.density)}</td></tr>`
    )
    .join('');

  return (
    '<div class="overflow-x-auto mt-10 mb-10">' +
    '<table class="w-auto table mx-auto"><thead><tr>' +
    `<th class="text-center">国名</th><th class="text-center">面積(万㎢)(${escapeHtml(sliced[0]?.area_year)}年)</th>` +
    `<th class="text-center">人口(万人)(${escapeHtml(sliced[0]?.popu_year)}年)</th><th class="text-center">人口密度(人/k㎡)</th>` +
    `</tr></thead><tbody>${bodyRows}</tbody></table></div>`
  );
}

// ::statistics-compare{ids="..."} 用の複数統計横並び比較表（旧statistics_nation_table.php相当。
// 通常のstatistics_dataとは別のstatistics_changes_dataテーブルを参照する）
function renderStatisticsCompareTable(
  ids: string,
  info: StatisticsInfo[],
  changesData: StatisticsChangesData[],
  nations?: Nation[]
): string {
  const idList = ids.split(',').map((s) => Number(s.trim())).filter((n) => !Number.isNaN(n));
  if (idList.length === 0) return NOT_FOUND_HTML;

  const perStat = idList.map((id) => {
    const infoRow = (info || []).find((r) => r.id === id);
    const arrangeUnit = infoRow?.arrange_unit ? Number(infoRow.arrange_unit) : 1;
    const statRows = (changesData || []).filter((r) => r.statistics_id === id);
    const maxYear = statRows.length > 0 ? Math.max(...statRows.map((r) => r.data_year)) : undefined;
    return {
      id,
      info: infoRow,
      rows: statRows.filter((r) => r.data_year === maxYear).map((r) => ({ ...r, value: r.value / arrangeUnit })),
      year: maxYear,
    };
  });
  if (perStat.every((s) => s.rows.length === 0)) return NOT_FOUND_HTML;

  const nationCds = [...new Set(perStat[0].rows.map((r) => r.nation_cd))];

  const headers = perStat
    .map((s) => `<th class="text-center">${escapeHtml(s.info?.data_name)}<br/>(${escapeHtml(s.info?.unit)})<br/>(${s.year}年)</th>`)
    .join('');

  const bodyRows = nationCds
    .map((cd) => {
      const cells = perStat
        .map((s) => {
          const val = s.rows.find((r) => r.nation_cd === cd)?.value;
          return `<td class="text-end">${formatNumber(val)}</td>`;
        })
        .join('');
      return `<tr><td class="text-center">${escapeHtml(nationName(nations, cd))}</td>${cells}</tr>`;
    })
    .join('');

  return (
    '<div class="overflow-x-auto mt-10 mb-10">' +
    `<table class="w-auto table mx-auto"><thead><tr><th class="text-center">国名</th>${headers}</tr></thead>` +
    `<tbody>${bodyRows}</tbody></table></div>`
  );
}

// ::continental-altitude{} / ::jp-natural-environment{} 用の固定表（元PHPがDBを使わず静的HTMLを出力していたもの）
const CONTINENTAL_ALTITUDE_HTML =
  '<div class="overflow-x-auto mt-10 mb-10"><div class="text-center">大陸別・高度別面積の割合</div>' +
  '<table class="w-100 table"><thead><tr><th class="text-center"></th><th class="text-center">200m以下(%)</th>' +
  '<th class="text-center">200～500m</th><th class="text-center">500～1000m</th><th class="text-center">1000～2000m</th>' +
  '<th class="text-center">2000～4000m</th><th class="text-center">4000m以上</th><th class="text-center">平均高度(m)</th></tr></thead><tbody>' +
  '<tr><td class="text-center">アジア</td><td class="text-end">24.6</td><td class="text-end">20.2</td><td class="text-end">25.9</td><td class="text-end">18</td><td class="text-end">7.2</td><td class="text-end">5.2</td><td class="text-end">960</td></tr>' +
  '<tr><td class="text-center">ヨーロッパ</td><td class="text-end">52.7</td><td class="text-end">21.2</td><td class="text-end">15.2</td><td class="text-end">5</td><td class="text-end">2</td><td class="text-end">0</td><td class="text-end">340</td></tr>' +
  '<tr><td class="text-center">アフリカ</td><td class="text-end">9.7</td><td class="text-end">38.9</td><td class="text-end">28.2</td><td class="text-end">19.5</td><td class="text-end">3.7</td><td class="text-end">0</td><td class="text-end">750</td></tr>' +
  '<tr><td class="text-center">北アメリカ</td><td class="text-end">29.9</td><td class="text-end">30.7</td><td class="text-end">12</td><td class="text-end">16.6</td><td class="text-end">10.8</td><td class="text-end">0</td><td class="text-end">720</td></tr>' +
  '<tr><td class="text-center">南アメリカ</td><td class="text-end">38.2</td><td class="text-end">29.8</td><td class="text-end">19.2</td><td class="text-end">5.6</td><td class="text-end">5</td><td class="text-end">2.2</td><td class="text-end">590</td></tr>' +
  '<tr><td class="text-center">オーストラリア</td><td class="text-end">39.3</td><td class="text-end">41.6</td><td class="text-end">16.9</td><td class="text-end">2.2</td><td class="text-end">0</td><td class="text-end">0</td><td class="text-end">340</td></tr>' +
  '<tr><td class="text-center">南極</td><td class="text-end">6.4</td><td class="text-end">2.8</td><td class="text-end">5</td><td class="text-end">22</td><td class="text-end">63.8</td><td class="text-end">0</td><td class="text-end">2,200</td></tr>' +
  '<tr><td class="text-center">全大陸</td><td class="text-end">25.3</td><td class="text-end">26.8</td><td class="text-end">19.4</td><td class="text-end">15.2</td><td class="text-end">11.4</td><td class="text-end">1.9</td><td class="text-end">875</td></tr>' +
  '</tbody></table><div class="sup">データが古く、補正がかかっているため、ヨーロッパとアジアは100％にならない</div></div>';

const JP_NATURAL_ENVIRONMENT_HTML =
  '<div class="overflow-x-auto mt-10 mb-10"><div class="text-center">日本列島の自然環境</div>' +
  '<table class="w-auto mx-auto table"><tr><th class="text-center">山地</th><th class="text-center">丘陵地</th>' +
  '<th class="text-center">台地</th><th class="text-center">低地</th><th class="text-center">内水域等</th></tr>' +
  '<tr><td class="text-end">230,331㎢</td><td class="text-end">44,337㎢</td><td class="text-end">41,471㎢</td><td class="text-end">51,963㎢</td><td class="text-end">9,232㎢</td></tr>' +
  '<tr><td class="text-end">61.0%</td><td class="text-end">11.8%</td><td class="text-end">11.0%</td><td class="text-end">13.8%</td><td class="text-end">2.4%</td></tr>' +
  '</table></div>';

const PLACEHOLDER_RE =
  /<div class="lesson-(basic-data|statistics|statistics-compare|export-items|import-items|land-use|city|immigration|industrial-population|port-container|items-each-ports|food-self-sufficiency|total-fertility-rate|aging-society|trade-balance|area-population|continental-altitude|jp-natural-environment)-placeholder"([^>]*)><\/div>/g;

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
 * レッスン本文中のDB連動ディレクティブのプレースホルダーを、
 * DBデータ（JSON）をもとに生成したテーブルHTMLに置き換える。
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
          hasNumCol: attrs.hasNumCol,
          info: datasets.statisticsInfo,
          data: datasets.statisticsData,
        });
      case 'statistics-compare':
        return renderStatisticsCompareTable(
          attrs.ids,
          datasets.statisticsInfo,
          datasets.statisticsChangesData || [],
          datasets.nations
        );
      case 'export-items':
      case 'import-items': {
        const type = kind === 'export-items' ? 'export' : 'import';
        const rows = type === 'export' ? datasets.exportItems : datasets.importItems;
        const nm = datasets.nations?.find((n) => String(n.cd) === attrs.nationCd)?.short_name;
        return renderTradeItemsTable(attrs.nationCd, rows, type, nm);
      }
      case 'land-use':
        return renderLandUseTable(attrs, datasets.landUse || [], datasets.nations);
      case 'city':
        return renderCityTable(attrs, datasets.cities || []);
      case 'immigration':
        return renderImmigrationTable(attrs.nationCd, datasets.immigration || [], datasets.nations);
      case 'industrial-population':
        return renderIndustrialPopulationTable(attrs, datasets.industrialPopulationStructure || [], datasets.nations);
      case 'port-container':
        return renderPortContainerTable(datasets.portContainer || [], datasets.nations);
      case 'items-each-ports':
        return renderItemsEachPortsTable(
          attrs,
          datasets.itemsEachPorts || [],
          datasets.portInfo || [],
          datasets.portTransactionValue || []
        );
      case 'food-self-sufficiency':
        return renderFoodSelfSufficiencyTable(attrs, datasets.foodSelfSufficiencyRate || [], datasets.nations);
      case 'total-fertility-rate':
        return renderTotalFertilityRateTable(attrs, datasets.totalFertilityRate || [], datasets.nations);
      case 'aging-society':
        return renderAgingSocietyTable(attrs, datasets.agingSociety || [], datasets.birthRate || [], datasets.nations);
      case 'trade-balance':
        return renderTradeBalanceTable(attrs, datasets.tradeBalance || [], datasets.nations);
      case 'area-population':
        return renderAreaPopulationTable(attrs, datasets.areaPopulation || []);
      case 'continental-altitude':
        return CONTINENTAL_ALTITUDE_HTML;
      case 'jp-natural-environment':
        return JP_NATURAL_ENVIRONMENT_HTML;
      default:
        return match;
    }
  });
}
