export interface GeoLesson {
  slug: string;      // URL slug例: Polar_Regions
  contentId: string; // mdファイル名例: Polar_Regions
  title: string;
}

export interface GeoSection {
  period: string;
  image: string;
  lessons: GeoLesson[];
}

export interface GeoCategory {
  title: string;
  sections: GeoSection[];
}

function toLesson(file: string, title: string): GeoLesson {
  const contentId = file.replace('.html', '').replace('geo_lessons_', '');
  return { slug: contentId, contentId, title };
}

export const GEO_CATEGORIES: GeoCategory[] = [
  {
    title: '地図',
    sections: [
      {
        period: '地図',
        image: '/share/img/ptolemaeus.webp',
        lessons: [
          toLesson('geo_lessons_map_history.html', '地図の歴史'),
          toLesson('geo_lessons_projection.html', '地図の図法'),
          toLesson('geo_lessons_time_difference.html', '時差'),
          toLesson('geo_lessons_various_maps.html', '様々な地図'),
          toLesson('geo_lessons_topographical_map.html', '地形図の見方'),
        ],
      },
    ],
  },
  {
    title: '自然環境',
    sections: [
      {
        period: '地形',
        image: '/share/img/landform.webp',
        lessons: [
          toLesson('geo_lessons_major_landforms.html', '大地形と変動帯'),
          toLesson('geo_lessons_craton_orogeny.html', '安定陸塊と造山運動'),
          toLesson('geo_lessons_mountainous_landforms.html', '山地の地形'),
          toLesson('geo_lessons_plain.html', '平野の地形'),
          toLesson('geo_lessons_coastal_terrain.html', '海岸の地形'),
          toLesson('geo_lessons_other_terrain.html', 'その他の地形'),
        ],
      },
      {
        period: '気候',
        image: '/share/img/climate.webp',
        lessons: [
          toLesson('geo_lessons_climatic_element.html', '気候要素'),
          toLesson('geo_lessons_climate_classification.html', '気候区分'),
          toLesson('geo_lessons_climate_tropical.html', '熱帯'),
          toLesson('geo_lessons_climate_dry.html', '乾燥帯'),
          toLesson('geo_lessons_climate_temperate.html', '温帯'),
          toLesson('geo_lessons_climate_continental.html', '亜寒帯（冷帯）'),
          toLesson('geo_lessons_climate_polar.html', '寒帯'),
          toLesson('geo_lessons_climate_alpine.html', '高山気候'),
          toLesson('geo_lessons_vegetation_soil.html', '植生・土壌'),
        ],
      },
      {
        period: '陸水と海洋',
        image: '/share/img/water.webp',
        lessons: [
          toLesson('geo_lessons_land_ocean.html', '陸水と海洋'),
        ],
      },
      {
        period: '地域開発と環境問題',
        image: '/share/img/koori.webp',
        lessons: [
          toLesson('geo_lessons_regional_development.html', '地域開発'),
          toLesson('geo_lessons_environment_issues.html', '環境問題'),
        ],
      },
      {
        period: '日本の自然環境',
        image: '/share/img/Fuji.webp',
        lessons: [
          toLesson('geo_lessons_jp_terrain.html', '日本の自然環境'),
        ],
      },
    ],
  },
  {
    title: '資源と産業',
    sections: [
      {
        period: '農林水産業',
        image: '/share/img/agriculture.webp',
        lessons: [
          toLesson('geo_lessons_agriculture.html', '農業の成立条件'),
          toLesson('geo_lessons_agriculture_self-sufficient.html', '自給的農業'),
          toLesson('geo_lessons_commercial_farming.html', '商業的農業'),
          toLesson('geo_lessons_agriculture_corporate.html', '企業的農業'),
          toLesson('geo_lessons_forestry.html', '林業'),
          toLesson('geo_lessons_marine_products_industry.html', '水産業'),
          toLesson('geo_lessons_food_problems.html', '食料問題と食の安全'),
        ],
      },
      {
        period: 'エネルギー・鉱産資源',
        image: '/share/img/generation.webp',
        lessons: [
          toLesson('geo_lessons_energy_resources.html', 'エネルギー資源'),
          toLesson('geo_lessons_mineral_resources.html', '鉱産資源'),
          toLesson('geo_lessons_resource_issues.html', '資源をめぐる問題'),
          toLesson('geo_lessons_energy_problem.html', 'エネルギーの抱える課題'),
          toLesson('geo_lessons_Japan_resources.html', '日本の資源'),
        ],
      },
      {
        period: '工業',
        image: '/share/img/industry.gif',
        lessons: [
          toLesson('geo_lessons_industrial_location.html', '工業の発達と立地'),
          toLesson('geo_lessons_Industry.html', '各種工業の特徴'),
          toLesson('geo_lessons_industrial_location_european.html', 'ヨーロッパの工業立地'),
          toLesson('geo_lessons_industrial_location_jp.html', '日本の工業立地'),
        ],
      },
      {
        period: '第３次産業・貿易',
        image: '/share/img/commerce.gif',
        lessons: [
          toLesson('geo_lessons_tertiary_industry.html', '第３次産業－商業・観光業'),
          toLesson('geo_lessons_tertiary_industry2.html', '第３次産業－交通業・情報通信業'),
          toLesson('geo_lessons_trade.html', '世界の貿易'),
          toLesson('geo_lessons_investment_oda.html', '投資・対外援助'),
        ],
      },
    ],
  },
  {
    title: '人口と集落',
    sections: [
      {
        period: '人口',
        image: '/share/img/population.gif',
        lessons: [
          toLesson('geo_lessons_world_population.html', '世界の人口'),
          toLesson('geo_lessons_demographic_transition.html', '人口動態の変化（人口転換）と人口問題'),
          toLesson('geo_lessons_migration_labor.html', '人口移動・労働'),
        ],
      },
      {
        period: '集落',
        image: '/share/img/village.gif',
        lessons: [
          toLesson('geo_lessons_village.html', '集落－村落'),
          toLesson('geo_lessons_city.html', '集落－都市'),
        ],
      },
    ],
  },
  {
    title: '生活文化と民族・宗教',
    sections: [
      {
        period: '生活文化と民族・宗教',
        image: '/share/img/multilingualism.webp',
        lessons: [
          toLesson('geo_lessons_nation.html', '国家・国家群'),
          toLesson('geo_lessons_language_religion.html', '衣食住・民族・言語・宗教'),
          toLesson('geo_lessons_ethnic_territorial_issues.html', '民族問題・領土問題'),
        ],
      },
    ],
  },
  {
    title: '地誌',
    sections: [
      {
        period: 'アジア',
        image: '/share/img/Asia.webp',
        lessons: [
          toLesson('geo_lessons_China.html', '東アジア地誌－中国'),
          toLesson('geo_lessons_Korea.html', '東アジア地誌－朝鮮半島'),
          toLesson('geo_lessons_Southeast_Asia.html', '東南アジア地誌－概説'),
          toLesson('geo_lessons_Southeast_Asia_countries.html', '東南アジア地誌－各国'),
          toLesson('geo_lessons_South_Asia.html', '南アジア地誌'),
          toLesson('geo_lessons_West_Asia.html', '西アジア・中央アジア地誌'),
        ],
      },
      {
        period: 'アフリカ',
        image: '/share/img/Africa.webp',
        lessons: [
          toLesson('geo_lessons_Africa.html', 'アフリカ地誌－概説'),
          toLesson('geo_lessons_Africa_countries.html', 'アフリカ地誌－各国'),
        ],
      },
      {
        period: 'ヨーロッパ',
        image: '/share/img/Europe.webp',
        lessons: [
          toLesson('geo_lessons_Europa1.html', 'ヨーロッパ地誌－概説①'),
          toLesson('geo_lessons_Europa2.html', 'ヨーロッパ地誌－概説②'),
          toLesson('geo_lessons_Europa_countries1.html', 'ヨーロッパ地誌－各国①'),
          toLesson('geo_lessons_Europa_countries2.html', 'ヨーロッパ地誌－各国②'),
        ],
      },
      {
        period: 'ロシアと周辺国',
        image: '/share/img/Russia_neighboring_countries.webp',
        lessons: [
          toLesson('geo_lessons_Russia_neighboring_countries1.html', 'ロシアと周辺国の地誌－概説'),
          toLesson('geo_lessons_Russia_neighboring_countries2.html', 'ロシアと周辺国の地誌－各国'),
        ],
      },
      {
        period: 'アングロアメリカ',
        image: '/share/img/North_America.webp',
        lessons: [
          toLesson('geo_lessons_Anglo_America.html', 'アングロアメリカ地誌－概説'),
          toLesson('geo_lessons_Anglo_America_countries.html', 'アングロアメリカ地誌－各国'),
        ],
      },
      {
        period: 'ラテンアメリカ',
        image: '/share/img/South_America.webp',
        lessons: [
          toLesson('geo_lessons_Latin_America.html', 'ラテンアメリカ地誌－概説'),
          toLesson('geo_lessons_Latin_America_countries.html', 'ラテンアメリカ地誌－各国'),
        ],
      },
      {
        period: 'オセアニア',
        image: '/share/img/Oceania.webp',
        lessons: [
          toLesson('geo_lessons_Oceania.html', 'オセアニア地誌'),
        ],
      },
      {
        period: '日本',
        image: '/share/img/Japan.webp',
        lessons: [
          toLesson('geo_lessons_Japan1.html', '日本地誌－地形・気候・自然環境'),
          toLesson('geo_lessons_Japan2.html', '日本地誌－人口'),
          toLesson('geo_lessons_Japan3.html', '日本地誌－農林水産業'),
          toLesson('geo_lessons_Japan4.html', '日本地誌－鉱工業'),
          toLesson('geo_lessons_Japan5.html', '日本地誌－交通・貿易'),
        ],
      },
      {
        period: '極地方（北極圏・南極圏）',
        image: '/share/img/Polar_Regions.webp',
        lessons: [
          toLesson('geo_lessons_Polar_Regions.html', '極地方'),
        ],
      },
    ],
  },
];

/** カテゴリ順のフラットなレッスン一覧 */
export const GEO_LESSONS: GeoLesson[] = GEO_CATEGORIES.flatMap((cat) =>
  cat.sections.flatMap((sec) => sec.lessons)
);
