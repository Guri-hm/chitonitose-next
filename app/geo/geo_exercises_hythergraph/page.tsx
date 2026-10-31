import type { Metadata } from 'next';
import GeoExercisePage from '@/components/geo-exercises/GeoExercisePage';
import ClimateQa from '@/components/geo-exercises/ClimateQa';
import { loadClimateCities } from '@/lib/geoExercises';

export const metadata: Metadata = {
  title: 'ハイサーグラフ演習 | ちとにとせ',
  description: 'ハイサーグラフから都市の気候区分を答える地理の演習ページです。',
  keywords: ['地理', 'ハイサーグラフ', '気候区分', '演習', 'ちとにとせ'],
};

export default async function HythergraphExercisePage() {
  const cities = await loadClimateCities();
  return (
    <GeoExercisePage slug="geo_exercises_hythergraph">
      <ClimateQa cities={cities} type="hythergraph" />
    </GeoExercisePage>
  );
}
