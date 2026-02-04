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

// 復習・演習セクション
const reviewSections = [
  {
    title: '短期攻略',
    image: '/share/img/omnibus.svg',
    items: [
      { title: '旧石器時代～弥生時代', href: '/jh/omnibus/1' },
      { title: '古墳時代', href: '/jh/omnibus/2' },
      { title: '飛鳥時代', href: '/jh/omnibus/3' },
      { title: '奈良時代', href: '/jh/omnibus/4' },
      { title: '平安時代①', href: '/jh/omnibus/5' },
      { title: '平安時代②', href: '/jh/omnibus/6' },
      { title: '鎌倉時代①', href: '/jh/omnibus/7' },
      { title: '鎌倉時代②', href: '/jh/omnibus/8' },
      { title: '室町時代①', href: '/jh/omnibus/9' },
      { title: '室町時代②', href: '/jh/omnibus/10' },
      { title: '戦国時代', href: '/jh/omnibus/11' },
      { title: '江戸時代①', href: '/jh/omnibus/12' },
      { title: '江戸時代②', href: '/jh/omnibus/13' },
      { title: '江戸時代③', href: '/jh/omnibus/14' },
      { title: '江戸時代④', href: '/jh/omnibus/15' },
      { title: '江戸時代⑤', href: '/jh/omnibus/16' },
      { title: '明治時代①', href: '/jh/omnibus/17' },
      { title: '明治時代②', href: '/jh/omnibus/18' },
      { title: '明治時代③', href: '/jh/omnibus/19' },
      { title: '明治時代④（明治の内閣）', href: '/jh/omnibus/20' },
      { title: '大正時代①（大正の内閣）', href: '/jh/omnibus/21' },
      { title: '大正時代②', href: '/jh/omnibus/22' },
      { title: '昭和時代①', href: '/jh/omnibus/23' },
      { title: '昭和時代②', href: '/jh/omnibus/24' },
      { title: '昭和時代③', href: '/jh/omnibus/25' },
      { title: '戦後史①', href: '/jh/omnibus/26' },
    ],
  },
  {
    title: 'テーマ史',
    image: '/share/img/omnibus.svg',
    items: [
      { title: '文化史（飛鳥文化～室町文化）', href: '/jh/cultural-history/1' },
      { title: '文化史（桃山文化～化政文化）', href: '/jh/cultural-history/2' },
      { title: '文化史（明治～現代）', href: '/jh/cultural-history/3' },
      { title: '農業・産業史', href: '/jh/agriculture-industrial-history' },
    ],
  },
  {
    title: '一問一答',
    image: '/share/img/test.svg',
    items: [
      { title: '旧石器時代', href: '/jh/q-a/1' },
      { title: '古墳時代', href: '/jh/q-a/2' },
      { title: '奈良時代', href: '/jh/q-a/3' },
      { title: '平安時代', href: '/jh/q-a/4' },
      { title: '平安時代（院政期）', href: '/jh/q-a/5' },
      { title: '鎌倉時代', href: '/jh/q-a/6' },
      { title: '建武の新政', href: '/jh/q-a/7' },
      { title: '室町時代', href: '/jh/q-a/8' },
      { title: '戦国時代・安土桃山時代', href: '/jh/q-a/9' },
      { title: '江戸時代', href: '/jh/q-a/10' },
      { title: '江戸時代（動揺期）', href: '/jh/q-a/11' },
      { title: '江戸時代（幕末）', href: '/jh/q-a/12' },
      { title: '明治時代', href: '/jh/q-a/13' },
      { title: '明治時代（憲法発布後）', href: '/jh/q-a/14' },
      { title: '大正時代', href: '/jh/q-a/15' },
      { title: '昭和（戦前）', href: '/jh/q-a/16' },
      { title: '昭和（占領期）', href: '/jh/q-a/17' },
      { title: '昭和（独立後）', href: '/jh/q-a/18' },
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

        {/* 復習・演習セクション */}
        <div className="lessons">
          <h2>復習・演習</h2>
          <div className="outer-block clearfix">
            {reviewSections.map((section) => (
              <dl key={section.title} className="inner-block">
                <img src={section.image} alt={section.title} />
                <div>
                  <dt className="ribbon">{section.title}</dt>
                  <ul>
                    {section.items.map((item) => (
                      <li key={item.href}>
                        <Link href={item.href}>{item.title}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </dl>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
