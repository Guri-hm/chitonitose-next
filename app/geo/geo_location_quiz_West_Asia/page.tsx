import type { Metadata } from 'next';
import GeoExercisePage from '@/components/geo-exercises/GeoExercisePage';
import MapQuiz from '@/components/geo-exercises/MapQuiz';
import { loadNationNameMap, loadQuizNations } from '@/lib/geoExercises';

export const metadata: Metadata = {
  title: '国の位置 西アジア | ちとにとせ',
  description: '西アジアの国の位置を地図上にドラッグ＆ドロップで答える地理の演習ページです。',
  keywords: ['地理', '国の位置', '西アジア', '演習', 'ちとにとせ'],
};

const NATION_CDS = [4, 364, 368, 376, 414, 512, 634, 682, 760, 792, 887, 784];

export default async function LocationQuizWestAsiaPage() {
  const [nations, nationNames] = await Promise.all([loadQuizNations(NATION_CDS), loadNationNameMap()]);
  return (
    <GeoExercisePage slug="geo_location_quiz_West_Asia">
      <MapQuiz mapName="West_Asia" nations={nations} nationNames={nationNames} />
    </GeoExercisePage>
  );
}
