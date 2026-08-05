import { loadSubjectPages } from '@/lib/dataLoader';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ちとにとせ｜世界史',
  description: '大学受験用の世界史（地理歴史）の学習・勉強をサポートします。地図や年表を掲載して見やすくわかりやすく解説します。',
  keywords: ['社会科', '勉強', '受験', '高校', '世界史', 'ちとにとせ'],
};

// 世界史のレッスン分類
const whCategories = [
  {
    era: '古代',
    sections: [
      { period: 'オリエントと地中海世界', image: '/share/img/roma.jpg', start: 1, end: 12 },
      { period: 'アジア・アメリカの古代文明', image: '/share/img/mohenjodaro.jpg', start: 13, end: 21 },
      { period: '内陸アジアと周辺世界', image: '/share/img/mongolia.jpg', start: 22, end: 26 },
    ],
  },
  {
    era: '中世',
    sections: [
      { period: 'イスラーム世界', image: '/share/img/kaaba.jpg', start: 27, end: 32 },
      { period: '西ヨーロッパ世界', image: '/share/img/Charlemagne_and_Pope_Adrian_I.jpg', start: 33, end: 40 },
      { period: '内陸アジア世界・東アジア世界', image: '/share/img/GenghisKhan.jpg', start: 41, end: 44 },
    ],
  },
  {
    era: '近世・近代',
    sections: [
      { period: '東アジア世界の動向', image: '/share/img/Yuanming_Yuan.jpg', start: 45, end: 48 },
      { period: 'イラン世界・トルコ世界の発展', image: '/share/img/mosque.jpg', start: 49, end: 50 },
      { period: 'ヨーロッパ世界の拡大', image: '/share/img/mueller.jpg', start: 51, end: 55 },
      { period: '啓蒙専制主義', image: '/share/img/Maria_Theresia_Familie.jpg', start: 56, end: 60 },
      { period: '近代世界の成立', image: '/share/img/Industrial_revolution.jpg', start: 61, end: 64 },
      { period: '国民国家の発展', image: '/share/img/liberty_leading_the_people.jpg', start: 65, end: 71 },
      { period: '南北アメリカの発展', image: '/share/img/manifest_destiny.jpg', start: 72, end: 74 },
      { period: 'アジア諸地域の動揺', image: '/share/img/tanzimat.jpg', start: 75, end: 81 },
    ],
  },
  {
    era: '近代（２つの大戦）',
    sections: [
      { period: '帝国主義と民族運動', image: '/share/img/Rhodes_Africa.jpg', start: 82, end: 87 },
      { period: '最初の世界大戦と新しい秩序の模索', image: '/share/img/ww1.jpg', start: 88, end: 95 },
      { period: '世界恐慌とファシズム諸国', image: '/share/img/great_depression.jpg', start: 96, end: 99 },
    ],
  },
  {
    era: '現代',
    sections: [
      { period: '冷戦の展開と第三世界の台頭', image: '/share/img/iron_curtain.jpg', start: 100, end: 109 },
      { period: '世界の一体化', image: '/share/img/Berlin_wall.jpg', start: 110, end: 114 },
    ],
  },
];

// 復習・演習セクション
const reviewSections = [
  {
    title: '一問一答',
    image: '/share/img/test.svg',
    items: [
      { title: 'アジア・アメリカの古代文明', href: '/wh/q-a?unit=2' },
      { title: 'ヨーロッパ世界の拡大', href: '/wh/q-a?unit=10' },
    ],
  },
];

// その他のセクション
const otherSections = [
  {
    title: 'PDFの配布',
    image: '/share/img/print.gif',
    items: [
      { title: '授業プリント', href: '/wh/print' },
    ],
  },
  {
    title: 'テーマ史',
    image: '/share/img/omnibus.svg',
    items: [
      { title: '遊牧民', href: '/wh/omnibus/1' },
    ],
  },
];

export default async function WorldHistory() {
  const pages = await loadSubjectPages(1); // 1 = 世界史

  return (
    <>
      <link rel="stylesheet" href="/css/subject.css" />
      <link rel="stylesheet" href="/css/wh.css" />
      
      {/* ヘッダーセクション */}
      <h1>
        <div className="first-line">世界史</div>
      </h1>
      <div className="text-center my-10">
        <div className="second-line">WORLD HISTORY</div>
        <div className="study">
          <img src="/share/img/study-icon-wh.svg" alt="世界史アイコン" />
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="main-block bg-gray">
        <div className="lessons">
          {whCategories.map((category) => (
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
                              <Link href={`/wh/lessons/${lesson.no}`}>
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

        {/* その他セクション */}
        <div className="lessons">
          <h2>その他</h2>
          <div className="outer-block clearfix">
            {otherSections.map((section) => (
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
