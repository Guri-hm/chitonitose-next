import Link from 'next/link';
import type { Metadata } from 'next';
import { GEO_CATEGORIES } from '@/lib/geoLessons';

export const metadata: Metadata = {
  title: 'ちとにとせ｜地理',
  description: '大学受験用の高校地理（地理歴史）の学習・勉強をサポートします。イメージしにくい系統地理や知識を応用する地誌を見やすくわかりやすく解説します。',
  keywords: ['社会科', '勉強', '受験', '高校', '地理', 'ちとにとせ'],
};

// 演習・その他のセクション（固定リンク）
const otherSections = [
  {
    period: 'ハイサーグラフ',
    image: '/share/img/hythergraph.webp',
    items: [
      { href: '/geo/geo_exercises_hythergraph', title: '演習' },
      { href: '/geo/geo_exercises_hythergraph_map', title: '地図での演習' },
    ],
  },
  {
    period: '雨温図',
    image: '/share/img/climograph.webp',
    items: [
      { href: '/geo/geo_exercises_climograph', title: '演習' },
      { href: '/geo/geo_exercises_climograph_map', title: '地図での演習' },
    ],
  },
  {
    period: '地形断面',
    image: '/share/img/topographic_profile.webp',
    items: [
      { href: '/geo/topographic_profile', title: '地図での演習' },
    ],
  },
  {
    period: '国の位置',
    image: '/share/img/map_pin.webp',
    items: [
      { href: '/geo/geo_location_quiz_Asia', title: '東南アジア・南アジア' },
      { href: '/geo/geo_location_quiz_West_Asia', title: '西アジア' },
      { href: '/geo/geo_location_quiz_Africa', title: 'アフリカ' },
    ],
  },
  {
    period: '統計データ',
    image: '/share/img/statistical_data.webp',
    items: [
      { href: '/geo/geo_statistical_data_main', title: '主要統計' },
      { href: '/geo/geo_statistical_data_animal', title: '動物' },
      { href: '/geo/geo_statistical_data_crops', title: '農作物' },
    ],
  },
];

export default function Geography() {
  return (
    <>
      <link rel="stylesheet" href="/css/subject.css" />
      <link rel="stylesheet" href="/css/geo.css" />

      <h1>
        <div className="first-line">地理</div>
      </h1>
      <div className="text-center my-10">
        <div className="second-line">GEOGRAPHY</div>
        <div className="study">
          <img src="/share/img/study-icon-geo.svg" alt="地理アイコン" />
        </div>
      </div>

      <div className="main-block bg-gray">
        <div className="lessons">
          {GEO_CATEGORIES.map((category, idx) => (
            <div key={idx}>
              <h2>{category.title}</h2>
              <div className="outer-block clearfix">
                {category.sections.map((section, sidx) => (
                  <dl key={sidx} className="inner-block">
                    <img src={section.image} alt={section.period} />
                    <div>
                      <dt className="ribbon">{section.period}</dt>
                      <ul>
                        {section.lessons.map((lesson) => (
                          <li key={lesson.slug}>
                            <Link href={`/geo/${lesson.slug}`}>
                              {lesson.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </dl>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="lessons">
          <h2>演習・その他</h2>
          <div className="outer-block clearfix">
            {otherSections.map((section) => (
              <dl key={section.period} className="inner-block">
                <img src={section.image} alt={section.period} />
                <div>
                  <dt className="ribbon">{section.period}</dt>
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
