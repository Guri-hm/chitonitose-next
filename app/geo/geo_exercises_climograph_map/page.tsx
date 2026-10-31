import type { Metadata } from 'next';
import GeoExercisePage from '@/components/geo-exercises/GeoExercisePage';
import SelectionProblem from '@/components/geo-exercises/SelectionProblem';
import { buildClimateItems } from '@/components/geo-exercises/selectionItems';
import { loadClimateCities } from '@/lib/geoExercises';

export const metadata: Metadata = {
  title: '雨温図 地図での演習 | ちとにとせ',
  description: '地図上の地点の雨温図を選ぶ地理の演習ページです。',
  keywords: ['地理', '雨温図', '演習', 'ちとにとせ'],
};

export default async function ClimographMapExercisePage() {
  const cities = await loadClimateCities();
  return (
    <GeoExercisePage slug="geo_exercises_climograph_map">
      <SelectionProblem
        items={buildClimateItems(cities, 'climograph')}
        heading={
          <>
            地図上の<span className="text-red">●</span>地点の雨温図を選びましょう。
          </>
        }
      />
    </GeoExercisePage>
  );
}
