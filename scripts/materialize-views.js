/**
 * VIEWを実体化（テーブルに変換）するスクリプト
 * サブクエリが重いVIEWをテーブルに変換してパフォーマンス改善
 */

const fs = require('fs');
const path = require('path');
const initSqlJs = require('sql.js');

const DB_FILE = path.join(__dirname, '..', 'data', 'data.sqlite3');

console.log('=== Materializing VIEWs ===\n');

async function materializeViews() {
  try {
    console.log('📖 Loading database...');
    const SQL = await initSqlJs();
    const buffer = fs.readFileSync(DB_FILE);
    const db = new SQL.Database(buffer);

    console.log('✓ Database loaded\n');

    // VIEWを削除してテーブルとして再作成
    console.log('🔄 Converting VIEWs to tables...\n');

    // 1. area_population
    console.log('Processing area_population...');
    db.run('DROP VIEW IF EXISTS area_population');
    db.run(`
      CREATE TABLE area_population AS
      SELECT 
        info.short_name,
        area.area,
        area.data_year AS area_year,
        popu.population,
        popu.data_year AS popu_year,
        ROUND(popu.population / area.area, 1) AS density,
        gni.dollar,
        gni.data_year AS gni_year
      FROM nation_info info
      JOIN nation_area area ON info.cd = area.nation_cd
      JOIN nation_population popu ON info.cd = popu.nation_cd
      JOIN per_unit_of_gdp gni ON info.cd = gni.nation_cd
      WHERE area.data_year = (SELECT MAX(data_year) FROM nation_area)
        AND popu.data_year = (SELECT MAX(data_year) FROM nation_population)
        AND gni.data_year = (SELECT MAX(data_year) FROM per_unit_of_gdp)
    `);
    const areaPopCount = db.exec('SELECT COUNT(*) FROM area_population')[0].values[0][0];
    console.log(`  ✓ area_population: ${areaPopCount} records\n`);

    // 2. basic_data
    console.log('Processing basic_data...');
    db.run('DROP VIEW IF EXISTS basic_data');
    db.run(`
      CREATE TABLE basic_data AS
      SELECT 
        info.cd,
        info.short_name,
        info.capital,
        info.suzerain_state,
        info.official_lang,
        info.religion,
        area.area,
        area.data_year AS area_year,
        popu.population,
        popu.data_year AS popu_year,
        ROUND(popu.population / area.area, 1) AS density,
        gni.dollar,
        gni.data_year AS gni_year
      FROM nation_info info
      JOIN nation_area area ON info.cd = area.nation_cd
      JOIN nation_population popu ON info.cd = popu.nation_cd
      JOIN per_unit_of_gdp gni ON info.cd = gni.nation_cd
      WHERE area.data_year = (SELECT MAX(data_year) FROM nation_area)
        AND popu.data_year = (SELECT MAX(data_year) FROM nation_population)
        AND gni.data_year = (SELECT MAX(data_year) FROM per_unit_of_gdp)
    `);
    const basicDataCount = db.exec('SELECT COUNT(*) FROM basic_data')[0].values[0][0];
    console.log(`  ✓ basic_data: ${basicDataCount} records\n`);

    // データベースを保存
    console.log('💾 Saving database...');
    const data = db.export();
    const outputBuffer = Buffer.from(data);
    
    // バックアップ作成
    const backupFile = `${DB_FILE}.backup.${Date.now()}`;
    fs.copyFileSync(DB_FILE, backupFile);
    console.log(`  ✓ Backup: ${path.basename(backupFile)}`);
    
    fs.writeFileSync(DB_FILE, outputBuffer);
    console.log(`  ✓ Saved: ${DB_FILE}\n`);

    db.close();

    console.log('✅ VIEWs materialized successfully!');
    console.log('\nNow you can run: npm run data:convert');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

materializeViews();
