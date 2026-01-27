import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ちとにとせ｜地理',
  description: '大学受験用の高校地理（地理歴史）の学習・勉強をサポートします。イメージしにくい系統地理や知識を応用する地誌を見やすくわかりやすく解説します。',
  keywords: ['社会科', '勉強', '受験', '高校', '地理', 'ちとにとせ'],
};

// 地理のレッスン構造
const geoCategories = [
  {
    title: '地図',
    sections: [
      {
        period: '地図',
        image: '/share/img/ptolemaeus.webp',
        lessons: [
          { file: 'geo_lessons_map_history.html', title: '地図の歴史' },
          { file: 'geo_lessons_projection.html', title: '地図の図法' },
          { file: 'geo_lessons_time_difference.html', title: '時差' },
          { file: 'geo_lessons_various_maps.html', title: '様々な地図' },
          { file: 'geo_lessons_topographical_map.html', title: '地形図の見方' },
        ]
      }
    ]
  },
  {
    title: '自然環境',
    sections: [
      {
        period: '地形',
        image: '/share/img/landform.webp',
        lessons: [
          { file: 'geo_lessons_major_landforms.html', title: '大地形と変動帯' },
          { file: 'geo_lessons_craton_orogeny.html', title: '安定陸塊と造山運動' },
          { file: 'geo_lessons_mountainous_landforms.html', title: '山地の地形' },
          { file: 'geo_lessons_plain.html', title: '平野の地形' },
          { file: 'geo_lessons_coastal_terrain.html', title: '海岸の地形' },
          { file: 'geo_lessons_other_terrain.html', title: 'その他の地形' },
        ]
      },
      {
        period: '気候',
        image: '/share/img/climate.webp',
        lessons: [
          { file: 'geo_lessons_climatic_element.html', title: '気候要素' },
          { file: 'geo_lessons_climate_classification.html', title: '気候区分' },
          { file: 'geo_lessons_climate_tropical.html', title: '熱帯' },
          { file: 'geo_lessons_climate_dry.html', title: '乾燥帯' },
          { file: 'geo_lessons_climate_temperate.html', title: '温帯' },
          { file: 'geo_lessons_climate_continental.html', title: '亜寒帯（冷帯）' },
          { file: 'geo_lessons_climate_polar.html', title: '寒帯' },
          { file: 'geo_lessons_climate_alpine.html', title: '高山気候' },
          { file: 'geo_lessons_vegetation_soil.html', title: '植生・土壌' },
        ]
      },
      {
        period: '陸水と海洋',
        image: '/share/img/water.webp',
        lessons: [
          { file: 'geo_lessons_land_ocean.html', title: '陸水と海洋' },
        ]
      },
      {
        period: '地域開発と環境問題',
        image: '/share/img/koori.webp',
        lessons: [
          { file: 'geo_lessons_regional_development.html', title: '地域開発' },
          { file: 'geo_lessons_environment_issues.html', title: '環境問題' },
        ]
      },
      {
        period: '日本の自然環境',
        image: '/share/img/Fuji.webp',
        lessons: [
          { file: 'geo_lessons_jp_terrain.html', title: '日本の自然環境' },
        ]
      },
    ]
  },
  {
    title: '資源と産業',
    sections: [
      {
        period: '農林水産業',
        image: '/share/img/agriculture.webp',
        lessons: [
          { file: 'geo_lessons_agriculture.html', title: '農業の成立条件' },
          { file: 'geo_lessons_agriculture_self-sufficient.html', title: '自給的農業' },
          { file: 'geo_lessons_commercial_farming.html', title: '商業的農業' },
          { file: 'geo_lessons_agriculture_corporate.html', title: '企業的農業' },
          { file: 'geo_lessons_forestry.html', title: '林業' },
          { file: 'geo_lessons_marine_products_industry.html', title: '水産業' },
          { file: 'geo_lessons_food_problems.html', title: '食料問題と食の安全' },
        ]
      },
    ]
  },
];

export default function Geography() {
  return (
    <>
      <link rel="stylesheet" href="/css/subject.css" />
      <link rel="stylesheet" href="/css/geo.css" />
      
      {/* ヘッダーセクション */}
      <h1>
        <div className="first-line">地理</div>
      </h1>
      <div className="text-center my-10">
        <div className="second-line">GEOGRAPHY</div>
        <div className="study">
          <img src="/share/img/study-icon-geo.svg" alt="地理アイコン" />
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="main-block bg-gray">
        <div className="lessons">
          {geoCategories.map((category, idx) => (
            <div key={idx}>
              <h2>{category.title}</h2>
              <div className="outer-block clearfix">
                {category.sections.map((section, sidx) => (
                  <dl key={sidx} className="inner-block">
                    <img src={section.image} alt={section.period} />
                    <div>
                      <dt className="ribbon">{section.period}</dt>
                      <ul className="circle">
                        {section.lessons.map((lesson, lidx) => (
                          <li key={lidx}>
                            <Link href={`/geo/${lesson.file.replace('.html', '')}`}>
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
      </div>
    </>
  );
}
