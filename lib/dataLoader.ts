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
  nation_cd: number;
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
  gni_per_capita?: number;
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
export const loadNations = () => loadJSON<Nation[]>('nations.json');
export const loadCities = () => loadJSON<City[]>('cities.json');
export const loadClimateClassifications = () => loadJSON<ClimateClassification[]>('climate-classifications.json');
export const loadAgingSociety = () => loadJSON<AgingSociety[]>('aging-society.json');
export const loadBirthrateMortality = () => loadJSON<BirthrateMortality[]>('birthrate-mortality.json');
export const loadGDPGNI = () => loadJSON<GDPGNI[]>('gdp-gni.json');
