import type { Metadata } from 'next';
import GeoExercisePage from '@/components/geo-exercises/GeoExercisePage';
import StatisticalDataSections, { GEO_OPTIONS, type StatSection } from '@/components/geo-exercises/StatisticalDataSections';
import TableOfContents from '@/components/TableOfContents';
import TermClickHandler from '@/components/lessons/TermClickHandler';
import { loadPerCapitaGni } from '@/lib/geoStatistics';

export const metadata: Metadata = {
  title: '統計データ 主要統計 | ちとにとせ',
  description: '人口・出生率・自然増加率・1人あたりGNIの世界地図（統計データ）です。',
  keywords: ['地理', '統計データ', '人口', '出生率', 'GNI', 'ちとにとせ'],
};

const YEAR = 2020;

const SECTIONS: StatSection[] = [
  {
    heading: '人口',
    blocks: [
      { heading: '人口（万人）', year: YEAR, geo: { type: 'population' }, geoOptions: { colorAxis: { maxValue: 100000 } } },
      { heading: '出生率', year: YEAR, geo: { type: 'birthrate' }, geoOptions: GEO_OPTIONS.blueToRed },
      { heading: '自然増加率', year: YEAR, geo: { type: 'growth' }, geoOptions: GEO_OPTIONS.blueToRed },
    ],
  },
  {
    heading: '経済',
    blocks: [
      { heading: '1人あたりGNI（ドル）', year: YEAR, geo: { type: 'gni' }, geoOptions: { colorAxis: { maxValue: 70000 } } },
    ],
  },
];

export default async function StatisticalDataMainPage() {
  const gni = await loadPerCapitaGni(YEAR);
  const approx = (cd: number) => (Math.round((gni.get(cd) ?? 0) / 1000) * 1000).toLocaleString('en-US');

  return (
    <GeoExercisePage slug="geo_statistical_data_main">
      <TermClickHandler />
      <TableOfContents />
      <StatisticalDataSections sections={SECTIONS} />
      <ul className="circle">
        <li>
          日本はおおよそ<span className="all">{approx(392)}</span>（ドル）
        </li>
        <li>
          中国はおおよそ<span className="all">{approx(156)}</span>（ドル）
        </li>
      </ul>
    </GeoExercisePage>
  );
}
