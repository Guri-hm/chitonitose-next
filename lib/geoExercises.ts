import { loadJSON } from '@/lib/dataLoader';

export interface ClimateCity {
  id: number;
  nameEg: string;
  name: string;
  classCd: number;
  explanation: string;
  climateAlpha: string;
  climateJp: string;
  nationName: string;
}

export interface TopographicProfile {
  id: number;
  name: string;
  jpName: string;
  explanation: string;
}

/** 雨温図・ハイサーグラフ演習用の都市データ（気候区分・国名を結合済み） */
export async function loadClimateCities(): Promise<ClimateCity[]> {
  const [cities, climates, nations] = await Promise.all([
    loadJSON<any[]>('city-climate.json'),
    loadJSON<any[]>('climate-classifications.json'),
    loadJSON<any[]>('nations.json'),
  ]);
  return cities.map((c) => {
    const climate = climates.find((k) => k.cd === c.class_cd);
    const nation = nations.find((n) => n.cd === c.nation_cd);
    return {
      id: c.id,
      nameEg: c.city_name_eg,
      name: c.city_name,
      classCd: c.class_cd,
      explanation: c.explanation ?? '',
      climateAlpha: climate?.name_alphabet ?? '',
      climateJp: climate?.name_jp ?? '',
      nationName: nation?.short_name ?? '',
    };
  });
}

export async function loadTopographicProfiles(): Promise<TopographicProfile[]> {
  const rows = await loadJSON<any[]>('topographic-profile.json');
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    jpName: r.jp_name,
    explanation: r.explanation ?? '',
  }));
}

/** 国の位置クイズ用：2文字コード→国名の対応（全国分） */
export async function loadNationNameMap(): Promise<Record<string, string>> {
  const nations = await loadJSON<any[]>('nations.json');
  const map: Record<string, string> = {};
  for (const n of nations) {
    const code = n['2letters'];
    if (code) map[code] = n.short_name ?? n.name;
  }
  return map;
}

/** 国の位置クイズに出題する国（nation_info.cd）の2文字コードと国名 */
export async function loadQuizNations(cds: number[]): Promise<{ code: string; name: string }[]> {
  const nations = await loadJSON<any[]>('nations.json');
  return cds
    .map((cd) => nations.find((n) => n.cd === cd))
    .filter(Boolean)
    .map((n) => ({ code: n['2letters'] as string, name: n.name as string }));
}
