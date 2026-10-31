import type { ClimateCity, TopographicProfile } from '@/lib/geoExercises';
import { CLIMATE_TYPE_NAMES, type ClimateType } from './random';
import type { SelectionItem } from './SelectionProblem';

export function buildClimateItems(cities: ClimateCity[], type: ClimateType): SelectionItem[] {
  const typeName = CLIMATE_TYPE_NAMES[type];
  return cities.map((c) => ({
    id: c.nameEg,
    groupKey: c.classCd,
    mapSrc: `/images/geo/${c.nameEg}_map.webp`,
    optionSrc: `/images/geo/${c.nameEg}_${type}.webp`,
    optionAlt: typeName,
    correctText: `${c.nationName}の${c.name}の${typeName}（${c.climateAlpha}、${c.climateJp}）です。`,
    otherText: `${c.nationName}の${c.name}の${typeName}（${c.climateAlpha}、${c.climateJp}）です。`,
    explanation: c.explanation,
  }));
}

export function buildTopographicItems(profiles: TopographicProfile[]): SelectionItem[] {
  return profiles.map((p) => ({
    id: p.name,
    groupKey: p.id,
    mapSrc: `/images/geo/topographic_profile/${p.name}_map.webp`,
    optionSrc: `/images/geo/topographic_profile/${p.name}.webp`,
    optionAlt: '地形断面',
    correctText: `${p.jpName}地形断面です。`,
    otherText: `${p.jpName}地形断面です。`,
    explanation: p.explanation,
  }));
}
