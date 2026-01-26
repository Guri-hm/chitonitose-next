/**
 * Simple SQLite Importer using sql.js (WASM-based)
 * better-sqlite3やsqlite3のネイティブバインディング不要
 */

console.log('=== SQLite Import Alternative ===\n');
console.log('このスクリプトはsql.jsパッケージが必要です。');
console.log('\nインストール方法:');
console.log('  npm install sql.js');
console.log('\n現在のオプション:');
console.log('1. SQL.jsを使用 (npm install sql.js)');
console.log('2. PowerShellスクリプトを使用 (data/import.ps1)');
console.log('3. DB Browser for SQLiteを使用 (GUI)');
console.log('4. 手動でデータをJSON化\n');

// sql.jsがインストールされているか確認
let initSqlJs;
try {
  initSqlJs = require('sql.js');
  runImport();
} catch (e) {
  console.log('⚠ sql.js not installed.');
  console.log('\n推奨: npm install sql.js');
  console.log('その後、このスクリプトを再実行してください。');
  
  // JSONベースの代替案を提案
  suggestJsonAlternative();
}

async function runImport() {
  const fs = require('fs');
  const path = require('path');
  
  const SQL_FILE = path.join(__dirname, '..', 'data', 'database.sql');
  const DB_FILE = path.join(__dirname, '..', 'data', 'data.sqlite3');
  
  console.log('Loading SQL.js...');
  const SQL = await initSqlJs();
  
  console.log('Creating database...');
  const db = new SQL.Database();
  
  console.log('Reading SQL file...');
  const sql = fs.readFileSync(SQL_FILE, 'utf-8');
  
  console.log('Executing SQL statements...');
  const statements = sql.split(';').filter(s => s.trim());
  let executed = 0;
  
  for (const statement of statements) {
    if (statement.trim()) {
      try {
        db.run(statement);
        executed++;
        if (executed % 100 === 0) {
          process.stdout.write(`\rExecuted ${executed}/${statements.length} statements...`);
        }
      } catch (e) {
        console.error(`\nError in statement: ${statement.substring(0, 100)}...`);
        console.error(e.message);
      }
    }
  }
  
  console.log(`\n✓ Executed ${executed} statements`);
  
  console.log('Saving database...');
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_FILE, buffer);
  
  console.log(`✓ Database saved: ${DB_FILE}`);
  
  // テーブル一覧を表示
  const tables = db.exec("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
  if (tables.length > 0 && tables[0].values) {
    console.log('\n=== Tables Created ===');
    tables[0].values.forEach(row => console.log(`  - ${row[0]}`));
  }
  
  db.close();
  
  console.log('\n=== Next Steps ===');
  console.log('1. Verify database: node scripts/verify-db.js');
  console.log('2. Convert to JSON: npm run data:convert');
}

function suggestJsonAlternative() {
  console.log('\n=== 代替案: JSON直接変換 ===');
  console.log('SQLiteを経由せず、元のmysql_dump.jsonから直接変換することも可能です。');
  console.log('ファイル: origin/mysql3107_db_sakura_ne_jp.json');
  console.log('\nこのアプローチでは:');
  console.log('- SQLiteインストール不要');
  console.log('- ビルド時にJSONから直接データ読み込み');
  console.log('- データ更新はJSONファイルを直接編集');
}
