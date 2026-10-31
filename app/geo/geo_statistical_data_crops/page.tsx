import type { Metadata } from 'next';
import GeoExercisePage from '@/components/geo-exercises/GeoExercisePage';
import StatisticalDataSections, { type StatBlock, type StatSection } from '@/components/geo-exercises/StatisticalDataSections';
import TableOfContents from '@/components/TableOfContents';

export const metadata: Metadata = {
  title: '統計データ 農作物 | ちとにとせ',
  description: '米・小麦・とうもろこしなどの主要生産国・輸出国の割合（統計データ）です。',
  keywords: ['地理', '統計データ', '農作物', '米', '小麦', 'ちとにとせ'],
};

function crop(heading: string, ...bars: [string, number][]): StatBlock {
  return { heading, bars: bars.map(([h, statisticsId]) => ({ heading: h, statisticsId, title: heading })) };
}

const SECTIONS: StatSection[] = [
  {
    heading: '３大穀物',
    blocks: [
      crop('米', ['主要生産国', 1000], ['主要輸出国', 1001]),
      crop('小麦', ['主要生産国', 1003], ['主要輸出国', 1004]),
      crop('とうもろこし', ['主要生産国', 1006], ['主要輸出国', 1007]),
    ],
  },
  {
    heading: '農作物',
    blocks: [
      crop('バナナ', ['主要生産国', 1017]),
      crop('綿花', ['主要生産国', 1018]),
      crop('大豆', ['主要生産国', 1019]),
    ],
  },
  {
    heading: '嗜好品農作物',
    blocks: [
      crop('コーヒー豆', ['主要生産国', 1009]),
      crop('カカオ豆', ['主要生産国', 1011]),
      crop('茶', ['主要生産国', 1013]),
    ],
  },
];

export default function StatisticalDataCropsPage() {
  return (
    <GeoExercisePage slug="geo_statistical_data_crops">
      <TableOfContents />
      <StatisticalDataSections sections={SECTIONS} />
    </GeoExercisePage>
  );
}
