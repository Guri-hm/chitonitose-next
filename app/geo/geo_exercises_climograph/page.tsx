import type { Metadata } from 'next';
import GeoExercisePage from '@/components/geo-exercises/GeoExercisePage';
import ClimateQa from '@/components/geo-exercises/ClimateQa';
import { loadClimateCities } from '@/lib/geoExercises';

export const metadata: Metadata = {
  title: '雨温図演習 | ちとにとせ',
  description: '雨温図から都市の気候区分を答える地理の演習ページです。',
  keywords: ['地理', '雨温図', '気候区分', '演習', 'ちとにとせ'],
};

export default async function ClimographExercisePage() {
  const cities = await loadClimateCities();
  return (
    <GeoExercisePage slug="geo_exercises_climograph">
      <ClimateQa cities={cities} type="climograph" />
    </GeoExercisePage>
  );
}
