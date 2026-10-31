import type { Metadata } from 'next';
import GeoExercisePage from '@/components/geo-exercises/GeoExercisePage';
import MapQuiz from '@/components/geo-exercises/MapQuiz';
import { loadNationNameMap, loadQuizNations } from '@/lib/geoExercises';

export const metadata: Metadata = {
  title: '国の位置 東南アジア・南アジア | ちとにとせ',
  description: '東南アジア・南アジアの国の位置を地図上にドラッグ＆ドロップで答える地理の演習ページです。',
  keywords: ['地理', '国の位置', '東南アジア', '南アジア', '演習', 'ちとにとせ'],
};

const NATION_CDS = [50, 104, 116, 144, 356, 360, 458, 586, 608, 704, 764];

export default async function LocationQuizAsiaPage() {
  const [nations, nationNames] = await Promise.all([loadQuizNations(NATION_CDS), loadNationNameMap()]);
  return (
    <GeoExercisePage slug="geo_location_quiz_Asia">
      <MapQuiz mapName="Asia" nations={nations} nationNames={nationNames} />
    </GeoExercisePage>
  );
}
