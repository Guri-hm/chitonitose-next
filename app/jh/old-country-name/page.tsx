import type { Metadata } from 'next';
import OldCountryMap from '@/components/lessons/OldCountryMap';

export const metadata: Metadata = {
  title: '旧国名 | ちとにとせ',
  description: '日本の旧国名一覧です。',
  keywords: ['日本史', '高校', '受験', '旧国名', 'ちとにとせ'],
};

export default async function OldCountryNamePage() {
  return (
    <>
      <link rel="stylesheet" href="/css/subject.css" />
      <link rel="stylesheet" href="/css/jh.css" />

      <h1>
        <div className="first-line">旧国名</div>
      </h1>

      <div className="main-block bg-gray">
        <div className="lessons">
          <div className="overview">
            地図上をクリックして、旧国名を確認しましょう。基本的には、京に近い方が「上」、遠い方が「下」という漢字が頭につきます。
          </div>
          <OldCountryMap />
        </div>
      </div>
    </>
  );
}
