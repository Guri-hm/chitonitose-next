import type { Metadata } from 'next';
import GeoExercisePage from '@/components/geo-exercises/GeoExercisePage';
import MapQuiz from '@/components/geo-exercises/MapQuiz';
import { loadNationNameMap, loadQuizNations } from '@/lib/geoExercises';

export const metadata: Metadata = {
  title: '国の位置 アフリカ | ちとにとせ',
  description: 'アフリカの国の位置を地図上にドラッグ＆ドロップで答える地理の演習ページです。',
  keywords: ['地理', '国の位置', 'アフリカ', '演習', 'ちとにとせ'],
};

const NATION_CDS = [566, 646, 12, 434, 504, 788, 818, 710, 231, 404, 729, 728, 288, 384, 324, 430, 732, 72, 180, 450];

export default async function LocationQuizAfricaPage() {
  const [nations, nationNames] = await Promise.all([loadQuizNations(NATION_CDS), loadNationNameMap()]);
  return (
    <GeoExercisePage slug="geo_location_quiz_Africa">
      <MapQuiz mapName="Africa" nations={nations} nationNames={nationNames} />
    </GeoExercisePage>
  );
}
