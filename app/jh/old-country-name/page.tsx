import type { Metadata } from 'next';

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
          <h2>日本の旧国名</h2>
          <p style={{ padding: '20px', textAlign: 'center' }}>
            このページは準備中です。元のHTMLファイル（jh_old_country_name.html）から旧国名の情報を移植する必要があります。
          </p>
        </div>
      </div>
    </>
  );
}
