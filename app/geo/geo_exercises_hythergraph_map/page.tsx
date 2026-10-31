import type { Metadata } from 'next';
import GeoExercisePage from '@/components/geo-exercises/GeoExercisePage';
import SelectionProblem from '@/components/geo-exercises/SelectionProblem';
import { buildClimateItems } from '@/components/geo-exercises/selectionItems';
import { loadClimateCities } from '@/lib/geoExercises';

export const metadata: Metadata = {
  title: 'ハイサーグラフ 地図での演習 | ちとにとせ',
  description: '地図上の地点のハイサーグラフを選ぶ地理の演習ページです。',
  keywords: ['地理', 'ハイサーグラフ', '演習', 'ちとにとせ'],
};

export default async function HythergraphMapExercisePage() {
  const cities = await loadClimateCities();
  return (
    <GeoExercisePage slug="geo_exercises_hythergraph_map">
      <SelectionProblem
        items={buildClimateItems(cities, 'hythergraph')}
        heading={
          <>
            地図上の<span className="text-red">●</span>地点のハイサーグラフを選びましょう。
          </>
        }
      />
    </GeoExercisePage>
  );
}
