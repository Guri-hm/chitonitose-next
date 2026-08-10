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

    // basic_data VIEW
    const basicData = safeQuery(db, 'SELECT * FROM basic_data', 'basic_data view');
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

    // 都市人口（大きいテーブルなので制限）
    const urbanPopulation = safeQuery(db, 'SELECT * FROM urban_population LIMIT 200', 'urban population (limited)');
    if (urbanPopulation.length > 0) writeJSON('urban-population.json', urbanPopulation);
    filesCreated++;

    // ===== 統計データ =====
    console.log('\n📊 Statistics Data:');

    // 統計情報
    const statisticsInfo = safeQuery(db, 'SELECT * FROM statistics_info', 'statistics info');
    if (statisticsInfo.length > 0) writeJSON('statistics-info.json', statisticsInfo);
    filesCreated++;

    // 統計データ（サンプル：最新100件）
    const statisticsData = safeQuery(db, 'SELECT * FROM statistics_data LIMIT 100', 'statistics data (sample)');
    if (statisticsData.length > 0) writeJSON('statistics-data-sample.json', statisticsData);
    filesCreated++;

    // ===== 貿易データ =====
    console.log('\n🌍 Trade Data:');

    // 輸出品目
    const exportItems = safeQuery(db, 'SELECT * FROM export_items LIMIT 200', 'export items');
    if (exportItems.length > 0) writeJSON('export-items.json', exportItems);
    filesCreated++;

    // 輸入品目
    const importItems = safeQuery(db, 'SELECT * FROM import_items LIMIT 200', 'import items');
    if (importItems.length > 0) writeJSON('import-items.json', importItems);
    filesCreated++;

    // 貿易収支
    const tradeBalance = safeQuery(db, 'SELECT * FROM trade_balance', 'trade balance');
    if (tradeBalance.length > 0) writeJSON('trade-balance.json', tradeBalance);
    filesCreated++;

    // ===== 生産データ =====
    console.log('\n🌾 Production Data:');

    // 生産データ
    const production = safeQuery(db, 'SELECT * FROM production LIMIT 100', 'production');
    if (production.length > 0) writeJSON('production.json', production);
    filesCreated++;

    // ===== 気候データ（グラフ用） =====
    console.log('\n🌡️ Climate Data:');

    // 都市と気候区分の関連
    const cityClimate = safeQuery(db, 'SELECT * FROM city_climate_classification', 'city climate');
    if (cityClimate.length > 0) writeJSON('city-climate.json', cityClimate);
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
          'statistics-data-sample.json'
        ],
        trade: [
          'export-items.json',
          'import-items.json',
          'trade-balance.json'
        ],
        production: [
          'production.json'
        ],
        climate: [
          'city-climate.json'
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
