/**
 * SQLite to JSON Converter
 * SQLiteデータベースから必要なデータをJSON形式で出力するスクリプト
 */

const fs = require('fs');
const path = require('path');
const initSqlJs = require('sql.js');

const DB_FILE = path.join(__dirname, '..', 'data', 'data.sqlite3');
const OUTPUT_DIR = path.join(__dirname, '..', 'data', 'json');

console.log('=== SQLite to JSON Converter ===\n');

/**
 * JSONファイル出力のヘルパー関数
 */
function writeJSON(filename, data) {
  try {
    const filepath = path.join(OUTPUT_DIR, filename);
    const jsonString = JSON.stringify(data, null, 2);
    fs.writeFileSync(filepath, jsonString, 'utf-8');
    const size = (fs.statSync(filepath).size / 1024).toFixed(2);
    console.log(`  ✓ ${filename} (${data.length} records, ${size} KB)`);
    return filepath;
  } catch (error) {
    console.error(`  ✗ Error writing ${filename}:`, error.message);
    return null;
  }
}

/**
 * SQLクエリ結果をオブジェクト配列に変換
 */
function queryToArray(result) {
  if (!result || result.length === 0) return [];
  const columns = result[0].columns;
  const values = result[0].values;
  return values.map(row => {
    const obj = {};
    columns.forEach((col, idx) => {
      obj[col] = row[idx];
    });
    return obj;
  });
}

/**
 * 安全にクエリを実行
 */
function safeQuery(db, sql, label) {
  try {
    console.log(`  ... ${label}`);
    const result = db.exec(sql);
    const data = queryToArray(result);
    console.log(`  → ${data.length} records`);
    return data;
  } catch (error) {
    console.error(`  ✗ Error in ${label}: ${error.message}`);
    return [];
  }
}

/**
 * メイン処理
 */
async function main() {
  try {
    // データベースファイルの存在確認
    if (!fs.existsSync(DB_FILE)) {
      console.error(`❌ Database file not found: ${DB_FILE}`);
      console.log('\nPlease run: npm run db:import');
      process.exit(1);
    }

    // 出力ディレクトリを作成
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
      console.log(`📁 Created output directory: ${OUTPUT_DIR}\n`);
    }

    // SQL.jsを初期化
    console.log('🔧 Loading database...');
    const SQL = await initSqlJs();
    const buffer = fs.readFileSync(DB_FILE);
    const db = new SQL.Database(buffer);

    console.log('✓ Database loaded\n');
    console.log('📊 Generating JSON files...\n');

    let filesCreated = 0;

    // ===== 基本データ =====
    console.log('📌 Basic Data:');
    
    // ニュース
    const news = safeQuery(db, 'SELECT * FROM news ORDER BY date DESC', 'news');
    if (news.length > 0) writeJSON('news.json', news);
    filesCreated++;

    // ページ情報
    const pages = safeQuery(db, 'SELECT * FROM page ORDER BY subject, no', 'pages');
    if (pages.length > 0) writeJSON('pages.json', pages);
    filesCreated++;

    // 国情報
    const nations = safeQuery(db, 'SELECT * FROM nation_info', 'nations');
    if (nations.length > 0) writeJSON('nations.json', nations);
    filesCreated++;

    // 都市情報
    const cities = safeQuery(db, 'SELECT * FROM city', 'cities');
    if (cities.length > 0) writeJSON('cities.json', cities);
    filesCreated++;

    // 気候区分
    const climateClassifications = safeQuery(db, 'SELECT * FROM climate_classification', 'climate');
    if (climateClassifications.length > 0) writeJSON('climate-classifications.json', climateClassifications);
    filesCreated++;

    // ===== VIEWからのデータ =====
    console.log('\n🔍 View Data:');

    // area_population VIEW
    const areaPopulation = safeQuery(db, 'SELECT * FROM area_population', 'area_population view');
    if (areaPopulation.length > 0) writeJSON('area-population.json', areaPopulation);
    filesCreated++;

    // basic_data VIEW（nation_info.peopleは含まれないため別途JOINして補完）
    const basicData = safeQuery(
      db,
      'SELECT bd.*, ni.people FROM basic_data bd LEFT JOIN nation_info ni ON bd.cd = ni.cd',
      'basic_data view'
    );
    if (basicData.length > 0) writeJSON('basic-data.json', basicData);
    filesCreated++;

    // ===== グラフ用データ =====
    console.log('\n📈 Chart Data:');

    // 高齢化社会データ
    const agingSociety = safeQuery(db, 'SELECT * FROM aging_society', 'aging society');
    if (agingSociety.length > 0) writeJSON('aging-society.json', agingSociety);
    filesCreated++;

    // 出生率・死亡率
    const birthrateMortality = safeQuery(db, 'SELECT * FROM birthrate_mortality', 'birthrate/mortality');
    if (birthrateMortality.length > 0) writeJSON('birthrate-mortality.json', birthrateMortality);
    filesCreated++;

    // 農業労働力
    const agriculturalWorkforce = safeQuery(db, 'SELECT * FROM agricultural_work_force', 'agricultural workforce');
    if (agriculturalWorkforce.length > 0) writeJSON('agricultural-workforce.json', agriculturalWorkforce);
    filesCreated++;

    // GDP/GNI
    const gdpGni = safeQuery(db, 'SELECT * FROM gdp_gni', 'GDP/GNI');
    if (gdpGni.length > 0) writeJSON('gdp-gni.json', gdpGni);
    filesCreated++;

    // 発電構成（火力・水力・原子力・風力・太陽光・地熱・バイオマス）
    const powerGeneration = safeQuery(db, 'SELECT * FROM power_generation', 'power generation');
    if (powerGeneration.length > 0) writeJSON('power-generation.json', powerGeneration);
    filesCreated++;

    // 都市人口
    const urbanPopulation = safeQuery(db, 'SELECT * FROM urban_population', 'urban population');
    if (urbanPopulation.length > 0) writeJSON('urban-population.json', urbanPopulation);
    filesCreated++;

    // ===== 統計データ =====
    console.log('\n📊 Statistics Data:');

    // 統計情報
    const statisticsInfo = safeQuery(db, 'SELECT * FROM statistics_info', 'statistics info');
    if (statisticsInfo.length > 0) writeJSON('statistics-info.json', statisticsInfo);
    filesCreated++;

    // 統計データ（全件）
    const statisticsData = safeQuery(db, 'SELECT * FROM statistics_data', 'statistics data');
    if (statisticsData.length > 0) writeJSON('statistics-data.json', statisticsData);
    filesCreated++;

    // ===== 貿易データ =====
    console.log('\n🌍 Trade Data:');

    // 輸出品目
    const exportItems = safeQuery(db, 'SELECT * FROM export_items', 'export items');
    if (exportItems.length > 0) writeJSON('export-items.json', exportItems);
    filesCreated++;

    // 輸入品目
    const importItems = safeQuery(db, 'SELECT * FROM import_items', 'import items');
    if (importItems.length > 0) writeJSON('import-items.json', importItems);
    filesCreated++;

    // 貿易収支
    const tradeBalance = safeQuery(db, 'SELECT * FROM trade_balance', 'trade balance');
    if (tradeBalance.length > 0) writeJSON('trade-balance.json', tradeBalance);
    filesCreated++;

    // ===== geoレッスンのDB連動表・追加分 =====
    console.log('\n🗺️ Geo Lesson Tables:');

    const landUse = safeQuery(db, 'SELECT * FROM land_use', 'land use');
    if (landUse.length > 0) writeJSON('land-use.json', landUse);
    filesCreated++;

    const immigration = safeQuery(db, 'SELECT * FROM immigration', 'immigration');
    if (immigration.length > 0) writeJSON('immigration.json', immigration);
    filesCreated++;

    const industrialPopulationStructure = safeQuery(
      db,
      'SELECT * FROM industrial_population_structure',
      'industrial population structure'
    );
    if (industrialPopulationStructure.length > 0) {
      writeJSON('industrial-population-structure.json', industrialPopulationStructure);
    }
    filesCreated++;

    const portContainer = safeQuery(db, 'SELECT * FROM port_container', 'port container');
    if (portContainer.length > 0) writeJSON('port-container.json', portContainer);
    filesCreated++;

    const portInfo = safeQuery(db, 'SELECT * FROM port_info', 'port info');
    if (portInfo.length > 0) writeJSON('port-info.json', portInfo);
    filesCreated++;

    const portTransactionValue = safeQuery(db, 'SELECT * FROM port_transaction_value', 'port transaction value');
    if (portTransactionValue.length > 0) writeJSON('port-transaction-value.json', portTransactionValue);
    filesCreated++;

    const itemsEachPorts = safeQuery(db, 'SELECT * FROM items_each_ports', 'items each ports');
    if (itemsEachPorts.length > 0) writeJSON('items-each-ports.json', itemsEachPorts);
    filesCreated++;

    const foodSelfSufficiencyRate = safeQuery(
      db,
      'SELECT * FROM food_self_sufficiency_rate',
      'food self sufficiency rate'
    );
    if (foodSelfSufficiencyRate.length > 0) writeJSON('food-self-sufficiency-rate.json', foodSelfSufficiencyRate);
    filesCreated++;

    const totalFertilityRate = safeQuery(db, 'SELECT * FROM total_fertility_rate', 'total fertility rate');
    if (totalFertilityRate.length > 0) writeJSON('total-fertility-rate.json', totalFertilityRate);
    filesCreated++;

    const birthRate = safeQuery(db, 'SELECT * FROM birth_rate', 'birth rate');
    if (birthRate.length > 0) writeJSON('birth-rate.json', birthRate);
    filesCreated++;

    const statisticsChangesData = safeQuery(db, 'SELECT * FROM statistics_changes_data', 'statistics changes data');
    if (statisticsChangesData.length > 0) writeJSON('statistics-changes-data.json', statisticsChangesData);
    filesCreated++;

    const eu = safeQuery(db, 'SELECT * FROM eu', 'eu');
    if (eu.length > 0) writeJSON('eu.json', eu);
    filesCreated++;

    const woodArea = safeQuery(db, 'SELECT * FROM wood_area', 'wood area');
    if (woodArea.length > 0) writeJSON('wood-area.json', woodArea);
    filesCreated++;

    const worldRegionInfo = safeQuery(db, 'SELECT * FROM world_region_info', 'world region info');
    if (worldRegionInfo.length > 0) writeJSON('world-region-info.json', worldRegionInfo);
    filesCreated++;

    const itemInfo = safeQuery(db, 'SELECT * FROM item_info', 'item info');
    if (itemInfo.length > 0) writeJSON('item-info.json', itemInfo);
    filesCreated++;

    const importPartnersEachItems = safeQuery(
      db,
      'SELECT * FROM import_partners_each_items',
      'import partners each items'
    );
    if (importPartnersEachItems.length > 0) writeJSON('import-partners-each-items.json', importPartnersEachItems);
    filesCreated++;

    // ===== グラフ用データ（追加分） =====
    console.log('\n📈 Chart Data (追加):');

    const woodUse = safeQuery(db, 'SELECT * FROM wood_use', 'wood use');
    if (woodUse.length > 0) writeJSON('wood-use.json', woodUse);
    filesCreated++;

    const woodSupply = safeQuery(db, 'SELECT * FROM wood_supply', 'wood supply');
    if (woodSupply.length > 0) writeJSON('wood-supply.json', woodSupply);
    filesCreated++;

    const forestryWorker = safeQuery(db, 'SELECT * FROM forestry_worker', 'forestry worker');
    if (forestryWorker.length > 0) writeJSON('forestry-worker.json', forestryWorker);
    filesCreated++;

    const fishCatche = safeQuery(db, 'SELECT * FROM fish_catche', 'fish catche');
    if (fishCatche.length > 0) writeJSON('fish-catche.json', fishCatche);
    filesCreated++;

    const foreignPopulation = safeQuery(db, 'SELECT * FROM foreign_population', 'foreign population');
    if (foreignPopulation.length > 0) writeJSON('foreign-population.json', foreignPopulation);
    filesCreated++;

    const nationality = safeQuery(db, 'SELECT * FROM nationality', 'nationality');
    if (nationality.length > 0) writeJSON('nationality.json', nationality);
    filesCreated++;

    const productionPerHa = safeQuery(db, 'SELECT * FROM production_per_ha', 'production per ha');
    if (productionPerHa.length > 0) writeJSON('production-per-ha.json', productionPerHa);
    filesCreated++;

    const regionAgriculturalProduction = safeQuery(
      db,
      'SELECT * FROM region_agricultural_production',
      'region agricultural production'
    );
    if (regionAgriculturalProduction.length > 0) {
      writeJSON('region-agricultural-production.json', regionAgriculturalProduction);
    }
    filesCreated++;

    const regionInfo = safeQuery(db, 'SELECT * FROM region_info', 'region info');
    if (regionInfo.length > 0) writeJSON('region-info.json', regionInfo);
    filesCreated++;

    const perUnitOfGdp = safeQuery(db, 'SELECT * FROM per_unit_of_gdp', 'per unit of gdp');
    if (perUnitOfGdp.length > 0) writeJSON('per-unit-of-gdp.json', perUnitOfGdp);
    filesCreated++;

    const riverFlowRate = safeQuery(db, 'SELECT * FROM river_flow_rate', 'river flow rate');
    if (riverFlowRate.length > 0) writeJSON('river-flow-rate.json', riverFlowRate);
    filesCreated++;

    const riverInfo = safeQuery(db, 'SELECT * FROM river_info', 'river info');
    if (riverInfo.length > 0) writeJSON('river-info.json', riverInfo);
    filesCreated++;
    filesCreated++;

    // ===== 生産データ =====
    console.log('\n🌾 Production Data:');

    // 生産データ
    const production = safeQuery(db,     'SELECT * FROM production', 'production');
    if (production.length > 0) writeJSON('production.json', production);
    filesCreated++;

        const nationPopulation = safeQuery(db, 'SELECT * FROM nation_population', 'nation population');
        if (nationPopulation.length > 0) writeJSON('nation-population.json', nationPopulation);
        filesCreated++;

    // ===== 気候データ（グラフ用） =====
    console.log('\n🌡️ Climate Data:');

    // 都市と気候区分の関連
    const cityClimate = safeQuery(db, 'SELECT * FROM city_climate_classification', 'city climate');
    if (cityClimate.length > 0) writeJSON('city-climate.json', cityClimate);
    filesCreated++;

    const topographicProfile = safeQuery(db, 'SELECT * FROM topographic_profile', 'topographic profile');
    if (topographicProfile.length > 0) writeJSON('topographic-profile.json', topographicProfile);
    filesCreated++;

    // ===== 一問一答データ =====
    console.log('\n❓ Q&A Data:');

    // 教科情報
    const subjects = safeQuery(db, 'SELECT * FROM subject ORDER BY id', 'subjects');
    if (subjects.length > 0) writeJSON('subjects.json', subjects);
    filesCreated++;

    // 単元情報（big_unit_name付き）
    const unitInfo = safeQuery(db,
      'SELECT u.subject_id, u.unit_id, u.big_unit_id, u.unit_name, b.big_unit_name' +
      ' FROM unit_info u' +
      ' LEFT JOIN big_unit_info b ON u.subject_id = b.subject_id AND u.big_unit_id = b.big_unit_id' +
      ' ORDER BY u.subject_id, u.unit_id',
      'unit_info');
    if (unitInfo.length > 0) writeJSON('unit-info.json', unitInfo);
    filesCreated++;

    // 授業番号情報（日本史: subject_id=2） ※ one_q_one_a に存在するpage_noのみ
    const fileInfoJh = safeQuery(db,
      'SELECT DISTINCT q.unit_id, q.page_no, f.title' +
      ' FROM one_q_one_a q' +
      ' LEFT JOIN file_info f ON f.subject_id = q.subject_id AND f.page_no = q.page_no' +
      ' WHERE q.subject_id = 2' +
      ' ORDER BY CAST(q.unit_id AS INTEGER), CAST(q.page_no AS INTEGER)',
      'file_info jh');
    if (fileInfoJh.length > 0) writeJSON('file-info-jh.json', fileInfoJh);
    filesCreated++;

    // 授業番号情報（世界史: subject_id=1） ※ one_q_one_a に存在するpage_noのみ
    const fileInfoWh = safeQuery(db,
      'SELECT DISTINCT q.unit_id, q.page_no, f.title' +
      ' FROM one_q_one_a q' +
      ' LEFT JOIN file_info f ON f.subject_id = q.subject_id AND f.page_no = q.page_no' +
      ' WHERE q.subject_id = 1' +
      ' ORDER BY CAST(q.unit_id AS INTEGER), CAST(q.page_no AS INTEGER)',
      'file_info wh');
    if (fileInfoWh.length > 0) writeJSON('file-info-wh.json', fileInfoWh);
    filesCreated++;

    // 一問一答（世界史: subject_id=1）
    const qaWh = safeQuery(db, 'SELECT subject_id, unit_id, page_no, id, question, answer, image1, image2, image3, image4 FROM one_q_one_a WHERE subject_id = 1 ORDER BY unit_id, page_no, id', 'Q&A world history');
    if (qaWh.length > 0) writeJSON('qa-wh.json', qaWh);
    filesCreated++;

    // 一問一答（日本史: subject_id=2）
    const qaJh = safeQuery(db, 'SELECT subject_id, unit_id, page_no, id, question, answer, image1, image2, image3, image4 FROM one_q_one_a WHERE subject_id = 2 ORDER BY unit_id, page_no, id', 'Q&A japan history');
    if (qaJh.length > 0) writeJSON('qa-jh.json', qaJh);
    filesCreated++;

    // ===== 日本関連データ =====
    console.log('\n🗾 Japan Data:');

    // 都道府県情報
    const prefectures = safeQuery(db, 'SELECT * FROM prefecture_info', 'prefectures');
    if (prefectures.length > 0) writeJSON('prefectures.json', prefectures);
    filesCreated++;

    // 外国人人口（都道府県別）
    const foreignPopulationPref = safeQuery(db, 'SELECT * FROM foreign_population_prefecture', 'foreign population by prefecture');
    if (foreignPopulationPref.length > 0) writeJSON('foreign-population-prefecture.json', foreignPopulationPref);
    filesCreated++;

    // ===== インデックスファイル =====
    console.log('\n📑 Metadata:');

    const dataIndex = {
      generated: new Date().toISOString(),
      database: 'data.sqlite3',
      files: {
        basic: [
          'news.json',
          'pages.json',
          'nations.json',
          'cities.json',
          'climate-classifications.json'
        ],
        views: [
          'area-population.json',
          'basic-data.json'
        ],
        charts: [
          'aging-society.json',
          'birthrate-mortality.json',
          'agricultural-workforce.json',
          'gdp-gni.json',
          'power-generation.json',
          'urban-population.json'
        ],
        statistics: [
          'statistics-info.json',
          'statistics-data.json'
        ],
        trade: [
          'export-items.json',
          'import-items.json',
          'trade-balance.json'
        ],
        geo_lessons: [
          'land-use.json',
          'immigration.json',
          'industrial-population-structure.json',
          'port-container.json',
          'port-info.json',
          'port-transaction-value.json',
          'items-each-ports.json',
          'food-self-sufficiency-rate.json',
          'total-fertility-rate.json',
          'birth-rate.json',
          'statistics-changes-data.json',
          'eu.json',
          'wood-area.json',
          'world-region-info.json',
          'item-info.json',
          'import-partners-each-items.json',
          'wood-use.json',
          'wood-supply.json',
          'forestry-worker.json',
          'fish-catche.json',
          'foreign-population.json',
          'nationality.json',
          'production-per-ha.json',
          'region-agricultural-production.json',
          'region-info.json',
          'per-unit-of-gdp.json',
          'river-flow-rate.json',
          'river-info.json'
        ],
        production: [
          'production.json',
          'nation-population.json'
        ],
        climate: [
          'city-climate.json',
          'topographic-profile.json'
        ],
        japan: [
          'prefectures.json',
          'foreign-population-prefecture.json'
        ]
      },
      counts: {
        nations: nations.length,
        cities: cities.length,
        pages: pages.length,
        news: news.length
      }
    };

    writeJSON('_index.json', dataIndex);
    filesCreated++;

    db.close();

    console.log(`\n✅ Conversion complete!`);
    console.log(`   Files created: ${filesCreated}`);
    console.log(`   Output directory: ${OUTPUT_DIR}\n`);

    console.log('=== Next Steps ===');
    console.log('1. Review generated JSON files in data/json/');
    console.log('2. Create chart components to use this data');
    console.log('3. Start migrating content pages');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// 実行
main();
