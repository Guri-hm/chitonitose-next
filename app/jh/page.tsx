import { loadSubjectPages } from '@/lib/dataLoader';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ちとにとせ｜日本史',
  description: '大学受験用の高校日本史（地理歴史）の学習・勉強をサポートします。わかりにくい制度・事象を見やすくわかりやすく解説します。',
  keywords: ['社会科', '勉強', '受験', '高校', '日本史', 'ちとにとせ'],
};

// 日本史のレッスン分類
const jhCategories = [
  {
    era: '古代',
    sections: [
      { period: '旧石器～弥生時代', image: '/share/img/doki.gif', start: 1, end: 4 },
      { period: '古墳時代', image: '/share/img/kohun.jpg', start: 5, end: 10 },
      { period: '奈良時代', image: '/share/img/daibutsu.jpg', start: 11, end: 23 },
      { period: '平安時代', image: '/share/img/murasaki.jpg', start: 24, end: 36 },
      { period: '平安時代（院政期）', image: '/share/img/goso.jpg', start: 37, end: 40 },
    ],
  },
  {
    era: '中世',
    sections: [
      { period: '鎌倉時代', image: '/share/img/tsuruoka.jpg', start: 41, end: 52 },
      { period: '建武の新政', image: '/share/img/godaigo.jpg', start: 53, end: 53 },
      { period: '室町時代', image: '/share/img/kinkaku.jpg', start: 54, end: 63 },
      { period: '戦国時代・安土桃山時代', image: '/share/img/fushimi.jpg', start: 64, end: 71 },
    ],
  },
  {
    era: '近世',
    sections: [
      { period: '江戸時代', image: '/share/img/edo.jpg', start: 72, end: 87 },
      { period: '江戸時代（動揺期）', image: '/share/img/asama.jpg', start: 88, end: 101 },
      { period: '江戸時代（幕末）', image: '/share/img/kurohune.jpg', start: 102, end: 111 },
    ],
  },
  {
    era: '近代',
    sections: [
      { period: '明治時代（前期）', image: '/share/img/meiji.jpg', start: 112, end: 118 },
      { period: '明治時代（憲法発布後）', image: '/share/img/kenpo.jpg', start: 119, end: 136 },
      { period: '大正時代', image: '/share/img/typist.jpg', start: 137, end: 145 },
    ],
  },
  {
    era: '現代',
    sections: [
      { period: '昭和時代（戦前）', image: '/share/img/tokko.jpg', start: 146, end: 158 },
      { period: '昭和時代（占領期）', image: '/share/img/senryo.jpg', start: 159, end: 165 },
      { period: '昭和時代（独立後）', image: '/share/img/anpo.jpg', start: 166, end: 172 },
    ],
  },
];

export default async function JapaneseHistory() {
  const pages = await loadSubjectPages(2); // 2 = 日本史

  return (
    <>
      <link rel="stylesheet" href="/css/subject.css" />
      <link rel="stylesheet" href="/css/jh.css" />
      
      {/* ヘッダーセクション */}
      <h1>
        <div className="first-line">日本史</div>
      </h1>
      <div className="text-center my-10">
        <div className="second-line">JAPANESE HISTORY</div>
        <div className="study">
          <img src="/share/img/study-icon-jh.svg" alt="日本史アイコン" />
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="main-block bg-gray">
        <div className="lessons">
          {jhCategories.map((category) => (
            <div key={category.era}>
              <h2>{category.era}</h2>
              <div className="outer-block clearfix">
                {category.sections.map((section) => {
                  const sectionLessons = pages.filter(
                    (page) => page.no >= section.start && page.no <= section.end
                  );

                  return (
                    <dl key={section.period} className="inner-block">
                      <img src={section.image} alt={section.period} />
                      <div>
                        <dt className="ribbon">{section.period}</dt>
                        <ul>
                          {sectionLessons.map((lesson) => (
                            <li key={lesson.no}>
                              <Link href={`/jh/lessons/${lesson.no}`}>
                                No.{lesson.no}　{lesson.title.trim()}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </dl>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
