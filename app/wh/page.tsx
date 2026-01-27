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
      { period: '内陸アジア世界・東アジア世界の展開', image: '/share/img/Yuanming_Yuan.jpg', start: 45, end: 53 },
      { period: 'ヨーロッパの拡大と大航海時代', image: '/share/img/ptolemaeus.jpg', start: 54, end: 63 },
      { period: '近代ヨーロッパの形成', image: '/share/img/liberty_leading_the_people.jpg', start: 64, end: 72 },
      { period: 'ヨーロッパ世界の展開', image: '/share/img/Maria_Theresia_Familie.jpg', start: 73, end: 84 },
      { period: '欧米における近代国民国家の発展', image: '/share/img/manifest_destiny.jpg', start: 85, end: 95 },
      { period: '欧米における近代市民文化の成長', image: '/share/img/typist.jpg', start: 96, end: 102 },
      { period: 'アジア諸地域の動揺', image: '/share/img/tanzimat.jpg', start: 103, end: 110 },
      { period: '帝国主義とアジアの民族運動', image: '/share/img/Rhodes_Africa.jpg', start: 111, end: 121 },
    ],
  },
  {
    era: '現代',
    sections: [
      { period: '第一次世界大戦とロシア革命', image: '/share/img/ww1.jpg', start: 122, end: 128 },
      { period: 'ヴェルサイユ体制下の欧米諸国', image: '/share/img/great_depression.jpg', start: 129, end: 138 },
      { period: '第二次世界大戦', image: '/share/img/mueller.jpg', start: 139, end: 145 },
      { period: '第二次世界大戦後の世界', image: '/share/img/iron_curtain.jpg', start: 146, end: 156 },
      { period: '冷戦の終結と今日の世界', image: '/share/img/Berlin_wall.jpg', start: 157, end: 165 },
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
      </div>
    </>
  );
}
