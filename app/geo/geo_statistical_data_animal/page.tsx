import type { Metadata } from 'next';
import GeoExercisePage from '@/components/geo-exercises/GeoExercisePage';
import StatisticalDataSections, { type StatBlock, type StatSection } from '@/components/geo-exercises/StatisticalDataSections';
import TableOfContents from '@/components/TableOfContents';

export const metadata: Metadata = {
  title: '統計データ 動物 | ちとにとせ',
  description: '牛・豚・鶏・羊の頭数や畜産物の生産・輸出の世界地図（統計データ）です。',
  keywords: ['地理', '統計データ', '畜産', '牛', '豚', '鶏', '羊', 'ちとにとせ'],
};

function stat(heading: string, statisticsId: number, year: number, extra: Partial<StatBlock> = {}, label?: string): StatBlock {
  return { heading, year, geo: { type: 'statistics', statisticsId, label }, ...extra };
}

const SECTIONS: StatSection[] = [
  {
    heading: '牛',
    blocks: [
      stat('牛の頭数', 28, 2020, { bars: [{ heading: '頭数上位国', statisticsId: 1030 }] }),
      stat('牛肉の生産', 29, 2019),
      stat('牛肉の輸出', 30, 2020),
      stat('牛乳の生産', 21, 2020),
    ],
  },
  {
    heading: '豚',
    blocks: [
      stat('豚の頭数', 31, 2020, { bars: [{ heading: '頭数上位国', statisticsId: 1033 }] }),
      stat('豚肉の生産', 32, 2020),
      stat('豚肉の輸出', 33, 2020),
    ],
  },
  {
    heading: '鶏',
    blocks: [
      // 統計27・281はDB上の名称・単位が入れ替わっているため、ラベルをここで明示する
      stat('鶏の羽数', 27, 2020, { bars: [{ heading: '羽数上位国', statisticsId: 1036 }] }, '鶏の羽数(百万羽)'),
      stat('鶏肉の生産', 281, 2020, {}, '鶏肉の生産(万t)'),
    ],
  },
  {
    heading: '羊',
    blocks: [
      stat('羊の頭数', 34, 2020, { bars: [{ heading: '頭数上位国', statisticsId: 1039 }] }),
      stat('羊毛の生産(脂付)', 35, 2020),
      stat('羊肉の生産', 36, 2020),
    ],
  },
];

export default function StatisticalDataAnimalPage() {
  return (
    <GeoExercisePage slug="geo_statistical_data_animal">
      <TableOfContents />
      <StatisticalDataSections sections={SECTIONS} />
    </GeoExercisePage>
  );
}
