/**
 * MySQL to SQLite Converter
 * MySQLのSQLダンプファイルをSQLite形式に変換するスクリプト
 */

const fs = require('fs');
const path = require('path');

const INPUT_FILE = path.join(__dirname, '..', 'origin', 'mysql3107_db_sakura_ne_jp.sql');
const OUTPUT_FILE = path.join(__dirname, '..', 'data', 'database.sql');

console.log('Converting MySQL dump to SQLite format...\n');

if (!fs.existsSync(INPUT_FILE)) {
  console.error(`Error: Input file not found: ${INPUT_FILE}`);
  console.log('Please ensure the MySQL dump file exists in the chitonitose directory.');
  process.exit(1);
}

// SQLファイルを読み込み
let sql = fs.readFileSync(INPUT_FILE, 'utf-8');

console.log('Converting MySQL syntax to SQLite...');

// MySQL特有の構文をSQLite用に変換
sql = sql
  // MySQLコメントを保持しつつクリーンアップ
  .replace(/^-- phpMyAdmin.*$/gm, '')
  .replace(/^-- version.*$/gm, '')
  .replace(/^-- ホスト:.*$/gm, '')
  .replace(/^-- 生成日時:.*$/gm, '')
  .replace(/^-- サーバのバージョン:.*$/gm, '')
  .replace(/^-- PHP のバージョン:.*$/gm, '')
  // MySQL特有のコマンドを削除
  .replace(/^SET .*$/gm, '')
  .replace(/^START TRANSACTION;$/gm, '')
  .replace(/^COMMIT;$/gm, '')
  .replace(/^\/\*!.*?\*\/;?$/gms, '')
  // データベース作成・使用を削除
  .replace(/CREATE DATABASE .*?;/gs, '')
  .replace(/USE .*?;/g, '')
  // ENGINE=InnoDB等を削除
  .replace(/ENGINE=\w+/g, '')
  .replace(/DEFAULT CHARSET=[\w\d]+/g, '')
  .replace(/COLLATE=[\w\d]+/g, '')
  .replace(/ROW_FORMAT=\w+/g, '')
  .replace(/AUTO_INCREMENT=\d+/g, '')
  // AUTO_INCREMENTをAUTOINCREMENTに
  .replace(/\bAUTO_INCREMENT\b/g, 'AUTOINCREMENT')
  // データ型の変換
  .replace(/\bINT\(\d+\)/g, 'INTEGER')
  .replace(/\bTINYINT\(\d+\)/g, 'INTEGER')
  .replace(/\bSMALLINT\(\d+\)/g, 'INTEGER')
  .replace(/\bMEDIUMINT\(\d+\)/g, 'INTEGER')
  .replace(/\bBIGINT\(\d+\)/g, 'INTEGER')
  .replace(/\bINT\b/g, 'INTEGER')
  .replace(/\bTINYINT\b/g, 'INTEGER')
  .replace(/\bSMALLINT\b/g, 'INTEGER')
  .replace(/\bMEDIUMINT\b/g, 'INTEGER')
  .replace(/\bBIGINT\b/g, 'INTEGER')
  .replace(/\bDOUBLE\b/g, 'REAL')
  .replace(/\bFLOAT\b/g, 'REAL')
  // DATETIME を TEXT に (SQLiteはDATETIME型を持つが、TEXT互換)
  .replace(/\bDATETIME\b/g, 'TEXT')
  .replace(/\bTIMESTAMP\b/g, 'TEXT')
  // VIEWの代替構造を削除
  .replace(/-- ビュー用の代替構造.*?(?=--\s*-|CREATE TABLE|CREATE VIEW|$)/gs, '')
  // バッククォートを削除
  .replace(/`/g, '')
  // 複数の空行を整理
  .replace(/\n{3,}/g, '\n\n')
  // 行末のスペース削除
  .replace(/ +$/gm, '');

console.log('Cleaning up syntax...');

// 出力ディレクトリが存在しない場合は作成
const outputDir = path.dirname(OUTPUT_FILE);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 変換後のSQLを保存
fs.writeFileSync(OUTPUT_FILE, sql, 'utf-8');

console.log(`\n✓ Converted SQL file saved to: ${OUTPUT_FILE}`);
console.log(`✓ File size: ${(sql.length / 1024).toFixed(2)} KB`);
console.log('\n=== Next steps ===');
console.log('1. Import to SQLite:');
console.log('   sqlite3 data/data.sqlite3 < data/database.sql');
console.log('   または PowerShell で:');
console.log('   Get-Content data\\database.sql | sqlite3 data\\data.sqlite3');
console.log('\n2. Verify import:');
console.log('   sqlite3 data/data.sqlite3 ".tables"');
console.log('\n3. Run data conversion:');
console.log('   npm run data:convert');
console.log('\nConversion complete!');
