/**
 * MySQL to SQLite Converter
 * MySQLのSQLダンプファイルをSQLite形式に変換するスクリプト
 */

const fs = require('fs');
const path = require('path');

const INPUT_FILE = path.join(__dirname, '..', '..', 'chitonitose', 'mysql3107_db_sakura_ne_jp.sql');
const OUTPUT_FILE = path.join(__dirname, '..', 'data', 'database.sql');

console.log('Converting MySQL dump to SQLite format...\n');

if (!fs.existsSync(INPUT_FILE)) {
  console.error(`Error: Input file not found: ${INPUT_FILE}`);
  console.log('Please ensure the MySQL dump file exists in the chitonitose directory.');
  process.exit(1);
}

// SQLファイルを読み込み
let sql = fs.readFileSync(INPUT_FILE, 'utf-8');

// MySQL特有の構文をSQLite用に変換
sql = sql
  // コメント行を削除
  .replace(/^--.*$/gm, '')
  // MySQL特有のコマンドを削除
  .replace(/^SET .*$/gm, '')
  .replace(/^START TRANSACTION;$/gm, '')
  .replace(/^COMMIT;$/gm, '')
  .replace(/^\/\*.*?\*\/;?$/gms, '')
  // ENGINE=InnoDB等を削除
  .replace(/ENGINE=\w+/g, '')
  .replace(/DEFAULT CHARSET=\w+/g, '')
  .replace(/COLLATE=\w+/g, '')
  .replace(/ROW_FORMAT=\w+/g, '')
  // AUTO_INCREMENTをAUTOINCREMENTに
  .replace(/AUTO_INCREMENT/g, 'AUTOINCREMENT')
  // データ型の変換
  .replace(/\bINT\(\d+\)/g, 'INTEGER')
  .replace(/\bTINYINT\(\d+\)/g, 'INTEGER')
  .replace(/\bSMALLINT\(\d+\)/g, 'INTEGER')
  .replace(/\bMEDIUMINT\(\d+\)/g, 'INTEGER')
  .replace(/\bBIGINT\(\d+\)/g, 'INTEGER')
  .replace(/\bDOUBLE/g, 'REAL')
  .replace(/\bFLOAT/g, 'REAL')
  // VARCHARのサイズ制限を保持
  // .replace(/VARCHAR\(\d+\)/g, 'TEXT')
  // CREATE DATABASE文を削除
  .replace(/CREATE DATABASE .*?;/gs, '')
  .replace(/USE .*?;/g, '')
  // VIEWの代替構造を削除（SQLiteでは実際のVIEWとして作成）
  .replace(/-- ビュー用の代替構造.*?(?=CREATE TABLE|$)/gs, '')
  // バッククォートを削除
  .replace(/`/g, '')
  // 複数の空行を1行に
  .replace(/\n{3,}/g, '\n\n');

// 出力ディレクトリが存在しない場合は作成
const outputDir = path.dirname(OUTPUT_FILE);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 変換後のSQLを保存
fs.writeFileSync(OUTPUT_FILE, sql, 'utf-8');

console.log(`✓ Converted SQL file saved to: ${OUTPUT_FILE}`);
console.log('\nNext steps:');
console.log('1. Review the generated SQL file');
console.log('2. Create SQLite database: sqlite3 data/database.sqlite < data/database.sql');
console.log('3. Run data conversion: npm run data:convert');
