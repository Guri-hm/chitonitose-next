/**
 * データ読み込みユーティリティ
 * /data/json/ からJSONデータを読み込む
 */

import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data', 'json');

/**
 * JSONファイルを読み込む
 */
export async function loadJSON<T = any>(filename: string): Promise<T> {
  try {
    const filepath = path.join(DATA_DIR, filename);
    const content = await fs.readFile(filepath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error loading ${filename}:`, error);
    throw error;
  }
}

/**
 * 複数のJSONファイルを並列で読み込む
 */
export async function loadMultipleJSON<T = any>(filenames: string[]): Promise<T[]> {
  return Promise.all(filenames.map(f => loadJSON<T>(f)));
}

/**
 * データインデックスを読み込む
 */
export async function loadDataIndex() {
  return loadJSON<{
    generated: string;
    database: string;
    files: {
      basic: string[];
      charts: string[];
      statistics: string[];
      trade: string[];
      production: string[];
      climate: string[];
      japan: string[];
    };
    counts: {
      nations: number;
      cities: number;
      pages: number;
      news: number;
    };
  }>('_index.json');
}

// 型定義

export interface NewsItem {
  id: number;
  date: string;
  title: string;
  content?: string;
  type_id?: number;
}

export interface PageInfo {
  subject: number;
  no: number;
  title: string;
  directory: string;
  filename: string;
}

export interface LessonCategory {
  era: string;
  period: string;
  lessons: PageInfo[];
  image?: string;
}

export interface Nation {
  cd: number;
  short_name: string;
  long_name?: string;
  region_cd?: number;
}

export interface City {
  city_cd: number;
  city_name: string;
  nation_cd?: number;
  latitude?: number;
  longitude?: number;
}

export interface ClimateClassification {
  classification_id: number;
  classification_name: string;
  description?: string;
}

export interface AgingSociety {
  nation_cd: number;
  '7percent': number;
  '14percent': number;
}

export interface BirthrateMortality {
  nation_cd: number;
  data_year: number;
  birthrate: number;
  mortality: number;
  total_fertility_rate?: number;
}

export interface GDPGNI {
  nation_cd: number;
  data_year: number;
  gdp?: number;
  gni?: number;
  gdp_per_capita?: number;
  per_capita_gni?: number;
}

export interface PowerGeneration {
  nation_cd: number;
  data_year: number;
  thermal_power?: number;
  hydroelectricity?: number;
  nuclear_power?: number;
  wind_power?: number;
  solar_power?: number;
  geothermal_power?: number;
  biomass_power?: number;
}

// ::basic-data{cd="..."} 用（国の基本データ、旧basic_data.php相当）
export interface BasicData {
  cd: number;
  short_name: string;
  capital?: string;
  suzerain_state?: string;
  official_lang?: string;
  religion?: string;
  people?: string;
  area?: number;
  area_year?: number;
  population?: number;
  popu_year?: number;
  density?: number;
  dollar?: number;
  gni_year?: number;
}

// ::statistics{...} 用（旧statistics_info/statistics_data、旧statistics.php相当）
export interface StatisticsInfo {
  id: number;
  data_name: string;
  unit?: string;
  arrange_unit?: string;
}

export interface StatisticsDataRow {
  statistics_id: number;
  nation_name: string;
  data_val: number;
  data_year: number;
}

// ::export-items{...} / ::import-items{...} 用（旧export/import_items_lank.php相当）
export interface TradeItem {
  nation_cd: number;
  data_year: number;
  lank: number;
  item_name: string;
  ratio: number;
}

// 以下、使用頻度2回以上のPHPスクリプト群用
export interface LandUse {
  nation_cd: number;
  data_year: number;
  cultivated_land_rate?: number;
  pasture_rate?: number;
  forest_rate?: number;
  per_farmer_ha?: number;
  farming_rate?: number;
  group_cd?: number;
}

export interface CityRow {
  nation_cd: number;
  city_name_eg?: string;
  data_year: number;
  city_name: string;
  population: number;
  capital_flg?: number;
}

export interface ImmigrationRow {
  nation_cd: number;
  data_year: number;
  nation_cd_from: number | null;
  value: number;
}

export interface IndustrialPopulationStructure {
  nation_cd: number;
  data_year: number;
  primary_rate: number;
  secondary_rate: number;
}

export interface PortContainer {
  port_name: string;
  nation_cd: number;
  transaction_volume: number;
  data_year: number;
}

export interface PortInfo {
  cd: number;
  name: string;
}

export interface PortTransactionValue {
  port_cd: number;
  exp_imp_flg: number;
  data_year: number;
  transaction_value: number;
}

export interface ItemsEachPort {
  nation_cd: number;
  port_cd: number;
  exp_imp_flg: number;
  data_year: number;
  item_name: string;
  rate: number;
}

export interface FoodSelfSufficiencyRate {
  nation_cd: number;
  data_year: number;
  calorie_base: number;
  grain: number;
  food_grain: number;
  wheat: number;
  coarse_grain: number;
  beans: number;
  vegetables: number;
  fruits: number;
  meat: number;
  egg: number;
  milk_dairy_products: number;
}

export interface TotalFertilityRate {
  nation_cd: number;
  data_year: number;
  value: number;
}

export interface BirthRate {
  nation_cd: number;
  data_year: number;
  value: number;
}

// ::statistics-compare{ids="..."} 用（旧statistics_nation_table.php相当、statistics_dataとは別テーブル）
export interface StatisticsChangesData {
  statistics_id: number;
  nation_cd: number;
  value: number;
  data_year: number;
}

// ::eu{...} 用（旧eu.php相当）
export interface EuRow {
  nation_cd: number;
  euro: number;
  withdrawal?: string;
}

// ::wood-area{...} 用（旧wood_area.php相当、大陸別の森林面積の推移）
export interface WoodAreaRow {
  nation_cd: number;
  data_year: number;
  region_cd: number;
  forest_1000_ha: number;
}

export interface WorldRegionInfo {
  cd: number;
  name: string;
}

export interface ItemInfo {
  cd: number;
  name: string;
}

// ::import-partners{...} 用（旧import_partners_each_items.php相当）
export interface ImportPartnersEachItem {
  nation_cd: number;
  item_cd: number;
  partner_cd: number;
  data_year: number;
  rate: number;
}

// ::urban-population{...} 用（旧urban_population.php相当）
export interface UrbanPopulationRow {
  nation_cd: number;
  data_year: number;
  ratio: number;
  population: number | null;
}

// ::area-population{...} 用（旧area_population.php相当、全国ランキング用でnation_cdは含まない）
export interface AreaPopulationRow {
  short_name: string;
  area: number;
  area_year: number;
  population: number;
  popu_year: number;
  density: number;
  dollar: number;
  gni_year: number;
}

export interface TradeBalance {
  nation_cd: number;
  data_year: number;
  export: number;
  import: number;
}

// データ読み込み関数

export const loadNews = () => loadJSON<NewsItem[]>('news.json');
export const loadPages = () => loadJSON<PageInfo[]>('pages.json');

/**
 * 特定科目のページ情報を読み込む
 * @param subject - 科目ID (1: 世界史, 2: 日本史, 3: 地理)
 */
export async function loadSubjectPages(subject: number): Promise<PageInfo[]> {
  const allPages = await loadPages();
  return allPages.filter(page => page.subject === subject);
}

/**
 * アコーディオンメニュー用のページ情報を取得
 * @param subject - 科目コード ('jh' | 'wh' | 'geo')
 */
export async function getPages(subject: 'jh' | 'wh' | 'geo'): Promise<Array<{ no: number; title: string }>> {
  const subjectMap: Record<string, number> = {
    wh: 1, // 世界史
    jh: 2, // 日本史
    geo: 3, // 地理
  };
  
  const subjectId = subjectMap[subject];
  const pages = await loadSubjectPages(subjectId);
  
  return pages.map(page => ({
    no: page.no,
    title: page.title,
  }));
}

export const loadNations = () => loadJSON<Nation[]>('nations.json');
export const loadCities = () => loadJSON<City[]>('cities.json');
export const loadClimateClassifications = () => loadJSON<ClimateClassification[]>('climate-classifications.json');
export const loadAgingSociety = () => loadJSON<AgingSociety[]>('aging-society.json');
export const loadBirthrateMortality = () => loadJSON<BirthrateMortality[]>('birthrate-mortality.json');
export const loadGDPGNI = () => loadJSON<GDPGNI[]>('gdp-gni.json');
export const loadPowerGeneration = () => loadJSON<PowerGeneration[]>('power-generation.json');
export const loadBasicData = () => loadJSON<BasicData[]>('basic-data.json');
export const loadStatisticsInfo = () => loadJSON<StatisticsInfo[]>('statistics-info.json');
export const loadStatisticsData = () => loadJSON<StatisticsDataRow[]>('statistics-data.json');
export const loadExportItems = () => loadJSON<TradeItem[]>('export-items.json');
export const loadImportItems = () => loadJSON<TradeItem[]>('import-items.json');
export const loadLandUse = () => loadJSON<LandUse[]>('land-use.json');
export const loadImmigration = () => loadJSON<ImmigrationRow[]>('immigration.json');
export const loadIndustrialPopulationStructure = () =>
  loadJSON<IndustrialPopulationStructure[]>('industrial-population-structure.json');
export const loadPortContainer = () => loadJSON<PortContainer[]>('port-container.json');
export const loadPortInfo = () => loadJSON<PortInfo[]>('port-info.json');
export const loadPortTransactionValue = () => loadJSON<PortTransactionValue[]>('port-transaction-value.json');
export const loadItemsEachPorts = () => loadJSON<ItemsEachPort[]>('items-each-ports.json');
export const loadFoodSelfSufficiencyRate = () =>
  loadJSON<FoodSelfSufficiencyRate[]>('food-self-sufficiency-rate.json');
export const loadTotalFertilityRate = () => loadJSON<TotalFertilityRate[]>('total-fertility-rate.json');
export const loadBirthRate = () => loadJSON<BirthRate[]>('birth-rate.json');
export const loadStatisticsChangesData = () => loadJSON<StatisticsChangesData[]>('statistics-changes-data.json');
export const loadAreaPopulation = () => loadJSON<AreaPopulationRow[]>('area-population.json');
export const loadTradeBalance = () => loadJSON<TradeBalance[]>('trade-balance.json');
export const loadCityRows = () => loadJSON<CityRow[]>('cities.json');
export const loadEu = () => loadJSON<EuRow[]>('eu.json');
export const loadWoodArea = () => loadJSON<WoodAreaRow[]>('wood-area.json');
export const loadWorldRegionInfo = () => loadJSON<WorldRegionInfo[]>('world-region-info.json');
export const loadItemInfo = () => loadJSON<ItemInfo[]>('item-info.json');
export const loadImportPartnersEachItems = () =>
  loadJSON<ImportPartnersEachItem[]>('import-partners-each-items.json');
export const loadUrbanPopulation = () => loadJSON<UrbanPopulationRow[]>('urban-population.json');

/**
 * レッスン本文の::basic-data / ::statistics / ::export-items / ::import-items
 * ディレクティブ描画に必要なデータセットをまとめて読み込む
 */
export async function loadLessonDbDatasets() {
  const [
    basicData,
    statisticsInfo,
    statisticsData,
    exportItems,
    importItems,
    landUse,
    immigration,
    industrialPopulationStructure,
    portContainer,
    portInfo,
    portTransactionValue,
    itemsEachPorts,
    foodSelfSufficiencyRate,
    totalFertilityRate,
    birthRate,
    agingSociety,
    tradeBalance,
    areaPopulation,
    cities,
    statisticsChangesData,
    eu,
    woodArea,
    worldRegionInfo,
    itemInfo,
    importPartnersEachItems,
    urbanPopulation,
    gdpGni,
  ] = await Promise.all([
    loadBasicData(),
    loadStatisticsInfo(),
    loadStatisticsData(),
    loadExportItems(),
    loadImportItems(),
    loadLandUse(),
    loadImmigration(),
    loadIndustrialPopulationStructure(),
    loadPortContainer(),
    loadPortInfo(),
    loadPortTransactionValue(),
    loadItemsEachPorts(),
    loadFoodSelfSufficiencyRate(),
    loadTotalFertilityRate(),
    loadBirthRate(),
    loadAgingSociety(),
    loadTradeBalance(),
    loadAreaPopulation(),
    loadCityRows(),
    loadStatisticsChangesData(),
    loadEu(),
    loadWoodArea(),
    loadWorldRegionInfo(),
    loadItemInfo(),
    loadImportPartnersEachItems(),
    loadUrbanPopulation(),
    loadGDPGNI(),
  ]);
  return {
    basicData,
    statisticsInfo,
    statisticsData,
    exportItems,
    importItems,
    landUse,
    immigration,
    industrialPopulationStructure,
    portContainer,
    portInfo,
    portTransactionValue,
    itemsEachPorts,
    foodSelfSufficiencyRate,
    totalFertilityRate,
    birthRate,
    agingSociety,
    tradeBalance,
    areaPopulation,
    cities,
    statisticsChangesData,
    eu,
    woodArea,
    worldRegionInfo,
    itemInfo,
    importPartnersEachItems,
    urbanPopulation,
    gdpGni,
  };
}

/**
 * レッスン本文に埋め込む::chart{...}ディレクティブ用のデータセットをまとめて読み込む
 * dataset名(power_generationなど)をキーにしたレコード配列を返す
 */
export async function loadLessonChartDatasets(): Promise<Record<string, any[]>> {
  const [powerGeneration] = await Promise.all([
    loadPowerGeneration(),
  ]);
  return {
    power_generation: powerGeneration,
  };
}

// ===== 一問一答 =====

export interface QAItem {
  subject_id: number;
  unit_id: number;
  page_no: number;
  id: number;
  question: string;
  answer: string;
  image1: string | null;
  image2: string | null;
  image3: string | null;
  image4: string | null;
}

export interface UnitInfo {
  subject_id: number;
  unit_id: number;
  big_unit_id: number;
  unit_name: string;
  big_unit_name: string | null;
}

export interface FileInfo {
  subject_id: number;
  unit_id: string | number;
  page_no: number;
  title: string;
}

/**
 * 一問一答データを読み込む
 * @param subject - 科目コード ('jh' | 'wh')
 * @param unitId - 単元ID（省略時は全単元）
 */
export async function loadQAData(
  subject: 'jh' | 'wh',
  unitId?: number
): Promise<QAItem[]> {
  const filename = subject === 'jh' ? 'qa-jh.json' : 'qa-wh.json';
  const all = await loadJSON<QAItem[]>(filename);
  if (unitId !== undefined) {
    return all.filter(item => item.unit_id === unitId);
  }
  return all;
}

/**
 * 単元情報を読み込む
 * @param subjectId - 科目ID（1: 世界史, 2: 日本史）
 */
export async function loadUnitInfo(subjectId?: number): Promise<UnitInfo[]> {
  const all = await loadJSON<UnitInfo[]>('unit-info.json');
  if (subjectId !== undefined) {
    return all.filter(u => u.subject_id === subjectId);
  }
  return all;
}

/**
 * 授業番号情報を読み込む
 * @param subject - 科目コード ('jh' | 'wh')
 */
export async function loadFileInfo(subject: 'jh' | 'wh'): Promise<FileInfo[]> {
  const filename = subject === 'jh' ? 'file-info-jh.json' : 'file-info-wh.json';
  return loadJSON<FileInfo[]>(filename);
}

// ===== 授業プリント（PDF） =====

export interface PdfItem {
  no: number;
  file: string;
  title: string;
}

/**
 * 授業プリント（PDF）の一覧を読み込む
 * @param subject - 科目コード ('jh' | 'wh')
 */
export async function loadPdfList(subject: 'jh' | 'wh'): Promise<PdfItem[]> {
  const filename = subject === 'jh' ? 'pdf-jh.json' : 'pdf-wh.json';
  return loadJSON<PdfItem[]>(filename);
}
