import type { Metadata } from 'next';
import GeoExercisePage from '@/components/geo-exercises/GeoExercisePage';
import SelectionProblem from '@/components/geo-exercises/SelectionProblem';
import { buildTopographicItems } from '@/components/geo-exercises/selectionItems';
import { loadTopographicProfiles } from '@/lib/geoExercises';

export const metadata: Metadata = {
  title: '地形断面 地図での演習 | ちとにとせ',
  description: '地図上の線に沿った地形断面を選ぶ地理の演習ページです。',
  keywords: ['地理', '地形断面', '演習', 'ちとにとせ'],
};

export default async function TopographicProfilePage() {
  const profiles = await loadTopographicProfiles();
  return (
    <GeoExercisePage slug="topographic_profile">
      <SelectionProblem
        items={buildTopographicItems(profiles)}
        heading="地図上の線に沿った地形断面を選びましょう。"
        footnote={
          <div className="mt-10 text-end">
            *図は「Web地形断面図メーカー」で作成
            <br />
            **作成の都合上、地形断面の距離は異なる
          </div>
        }
      />
    </GeoExercisePage>
  );
}
