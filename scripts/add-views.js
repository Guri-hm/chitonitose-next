/**
 * Add VIEWs to SQLite Database
 * MySQLのVIEW定義をSQLite互換に変換してデータベースに追加
 */

const fs = require('fs');
const path = require('path');
const initSqlJs = require('sql.js');

const DB_FILE = path.join(__dirname, '..', 'data', 'data.sqlite3');

console.log('=== Adding VIEWs to SQLite Database ===\n');

async function addViews() {
  try {
    // データベースファイルの存在確認
    if (!fs.existsSync(DB_FILE)) {
      console.error(`❌ Database file not found: ${DB_FILE}`);
      process.exit(1);
    }

    // SQL.jsを初期化
    console.log('🔧 Loading database...');
    const SQL = await initSqlJs();
    const buffer = fs.readFileSync(DB_FILE);
    const db = new SQL.Database(buffer);

    console.log('✓ Database loaded\n');

    // 既存のVIEWを削除（存在する場合）
    console.log('📋 Dropping existing views if any...');
    try {
      db.run('DROP VIEW IF EXISTS area_population');
      db.run('DROP VIEW IF EXISTS basic_data');
      console.log('✓ Existing views dropped\n');
    } catch (e) {
      console.log('  (No existing views to drop)\n');
    }

    // VIEW 1: area_population
    console.log('📊 Creating VIEW: area_population');
    const areaPopulationView = `
      CREATE VIEW area_population AS
      SELECT 
        info.short_name AS short_name,
        area.area AS area,
        area.data_year AS area_year,
        popu.population AS population,
        popu.data_year AS popu_year,
        ROUND((popu.population / area.area), 1) AS density,
        gni.dollar AS dollar,
        gni.data_year AS gni_year
      FROM nation_info info
      JOIN nation_area area ON (
        info.cd = area.nation_cd 
        AND area.data_year = (SELECT MAX(data_year) FROM nation_area)
      )
      JOIN nation_population popu ON (
        info.cd = popu.nation_cd 
        AND popu.data_year = (SELECT MAX(data_year) FROM nation_population)
      )
      JOIN per_unit_of_gdp gni ON (
        info.cd = gni.nation_cd 
        AND gni.data_year = (SELECT MAX(data_year) FROM per_unit_of_gdp)
      )
    `;

    try {
      db.run(areaPopulationView);
      console.log('✓ area_population view created');
    } catch (e) {
      console.error('✗ Error creating area_population:', e.message);
      console.error('  Attempting alternative approach...');
      
      // テーブルが存在しない場合のエラーハンドリング
      console.log('  Checking required tables...');
      const tables = db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name IN ('nation_info', 'nation_area', 'nation_population', 'per_unit_of_gdp')");
      if (tables.length > 0) {
        console.log('  Required tables:', tables[0].values.map(v => v[0]).join(', '));
      }
    }

    // VIEW 2: basic_data
    console.log('\n📊 Creating VIEW: basic_data');
    const basicDataView = `
      CREATE VIEW basic_data AS
      SELECT 
        info.cd AS cd,
        info.short_name AS short_name,
        info.capital AS capital,
        info.suzerain_state AS suzerain_state,
        info.official_lang AS official_lang,
        info.religion AS religion,
        area.area AS area,
        area.data_year AS area_year,
        popu.population AS population,
        popu.data_year AS popu_year,
        ROUND((popu.population / area.area), 1) AS density,
        gni.dollar AS dollar,
        gni.data_year AS gni_year
      FROM nation_info info
      JOIN nation_area area ON (
        info.cd = area.nation_cd 
        AND area.data_year = (SELECT MAX(data_year) FROM nation_area)
      )
      JOIN nation_population popu ON (
        info.cd = popu.nation_cd 
        AND popu.data_year = (SELECT MAX(data_year) FROM nation_population)
      )
      JOIN per_unit_of_gdp gni ON (
        info.cd = gni.nation_cd 
        AND gni.data_year = (SELECT MAX(data_year) FROM per_unit_of_gdp)
      )
    `;

    try {
      db.run(basicDataView);
      console.log('✓ basic_data view created');
    } catch (e) {
      console.error('✗ Error creating basic_data:', e.message);
    }

    // VIEWの確認
    console.log('\n🔍 Verifying views...');
    const views = db.exec("SELECT name FROM sqlite_master WHERE type='view' ORDER BY name");
    if (views.length > 0 && views[0].values) {
      console.log('  Created views:');
      views[0].values.forEach(row => console.log(`    - ${row[0]}`));
    } else {
      console.log('  No views found');
    }

    // サンプルデータを取得
    console.log('\n📊 Sample data from views:');
    
    try {
      const areaPopSample = db.exec('SELECT * FROM area_population LIMIT 5');
      if (areaPopSample.length > 0) {
        console.log(`\n  area_population (${areaPopSample[0].values.length} rows shown):`);
        console.log('  Columns:', areaPopSample[0].columns.join(', '));
      }
    } catch (e) {
      console.log('  ⚠ Could not query area_population:', e.message);
    }

    try {
      const basicDataSample = db.exec('SELECT * FROM basic_data LIMIT 5');
      if (basicDataSample.length > 0) {
        console.log(`\n  basic_data (${basicDataSample[0].values.length} rows shown):`);
        console.log('  Columns:', basicDataSample[0].columns.join(', '));
      }
    } catch (e) {
      console.log('  ⚠ Could not query basic_data:', e.message);
    }

    // データベースを保存
    console.log('\n💾 Saving database...');
    const data = db.export();
    const bufferToSave = Buffer.from(data);
    
    // バックアップ
    const backupFile = `${DB_FILE}.backup.${Date.now()}`;
    fs.copyFileSync(DB_FILE, backupFile);
    console.log(`  Backup created: ${path.basename(backupFile)}`);
    
    fs.writeFileSync(DB_FILE, bufferToSave);
    console.log(`  Database saved: ${DB_FILE}`);

    db.close();

    console.log('\n✅ VIEWs added successfully!\n');
    console.log('=== Next Steps ===');
    console.log('1. Verify views: node scripts/verify-views.js');
    console.log('2. Re-generate JSON: npm run data:convert');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// 実行
addViews();
