/**
 * JSON to SQLite Importer
 * PHPMyAdminからエクスポートしたJSONファイルをSQLiteデータベースに変換
 */

const fs = require('fs');
const path = require('path');
const initSqlJs = require('sql.js');

const JSON_FILE = path.join(__dirname, '..', 'origin', 'mysql3107_db_sakura_ne_jp.json');
const DB_FILE = path.join(__dirname, '..', 'data', 'data.sqlite3');

console.log('=== JSON to SQLite Importer ===\n');

async function importDatabase() {
  try {
    // JSONファイルを読み込み
    console.log('📖 Reading JSON file...');
    const jsonData = JSON.parse(fs.readFileSync(JSON_FILE, 'utf-8'));
    
    // SQL.jsを初期化
    console.log('🔧 Initializing SQL.js...');
    const SQL = await initSqlJs();
    const db = new SQL.Database();
    
    // テーブル数をカウント
    const tables = jsonData.filter(item => item.type === 'table');
    console.log(`📊 Found ${tables.length} tables to import\n`);
    
    let importedTables = 0;
    let totalRows = 0;
    
    // 各テーブルをインポート
    for (const item of jsonData) {
      if (item.type === 'table' && item.data) {
        const tableName = item.name;
        const data = item.data;
        
        if (data.length === 0) {
          console.log(`⊘ Skipping empty table: ${tableName}`);
          continue;
        }
        
        // テーブル構造を推測してCREATE TABLE文を生成
        const columns = Object.keys(data[0]);
        const columnDefs = columns.map(col => {
          // データ型を推測
          const sampleValue = data[0][col];
          let type = 'TEXT';
          
          if (sampleValue !== null && sampleValue !== '') {
            if (!isNaN(sampleValue)) {
              type = Number.isInteger(Number(sampleValue)) ? 'INTEGER' : 'REAL';
            }
          }
          
          return `"${col}" ${type}`;
        }).join(', ');
        
        // CREATE TABLE
        const createTableSQL = `CREATE TABLE IF NOT EXISTS "${tableName}" (${columnDefs})`;
        
        try {
          db.run(createTableSQL);
          
          // INSERT文を準備
          const placeholders = columns.map(() => '?').join(', ');
          const insertSQL = `INSERT INTO "${tableName}" (${columns.map(c => `"${c}"`).join(', ')}) VALUES (${placeholders})`;
          
          // データを挿入
          const stmt = db.prepare(insertSQL);
          for (const row of data) {
            const values = columns.map(col => {
              const val = row[col];
              // nullまたは空文字列の処理
              if (val === null || val === '') return null;
              // 数値変換を試みる
              if (!isNaN(val) && val !== '') return Number(val);
              return val;
            });
            stmt.run(values);
          }
          stmt.free();
          
          importedTables++;
          totalRows += data.length;
          console.log(`✓ ${tableName} (${data.length} rows)`);
          
        } catch (error) {
          console.error(`✗ Error importing ${tableName}:`, error.message);
        }
      }
    }
    
    console.log(`\n📈 Import Summary:`);
    console.log(`   Tables: ${importedTables}/${tables.length}`);
    console.log(`   Total rows: ${totalRows.toLocaleString()}`);
    
    // データベースファイルを保存
    console.log('\n💾 Saving database...');
    const data = db.export();
    const buffer = Buffer.from(data);
    
    // 既存のDBがあればバックアップ
    if (fs.existsSync(DB_FILE)) {
      const backupFile = `${DB_FILE}.backup.${Date.now()}`;
      fs.copyFileSync(DB_FILE, backupFile);
      console.log(`   Backup created: ${path.basename(backupFile)}`);
    }
    
    fs.writeFileSync(DB_FILE, buffer);
    console.log(`   Database saved: ${DB_FILE}`);
    
    // テーブル一覧を表示
    console.log('\n📋 Tables in database:');
    const tableList = db.exec("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
    if (tableList.length > 0 && tableList[0].values) {
      const tableNames = tableList[0].values.map(row => row[0]);
      console.log(`   ${tableNames.join(', ')}`);
    }
    
    // サンプルクエリを実行
    console.log('\n🔍 Sample queries:');
    try {
      const nationCount = db.exec("SELECT COUNT(*) as count FROM nation_info");
      if (nationCount[0]) {
        console.log(`   Nations: ${nationCount[0].values[0][0]}`);
      }
      
      const pageCount = db.exec("SELECT COUNT(*) as count FROM page");
      if (pageCount[0]) {
        console.log(`   Pages: ${pageCount[0].values[0][0]}`);
      }
      
      const cityCount = db.exec("SELECT COUNT(*) as count FROM city");
      if (cityCount[0]) {
        console.log(`   Cities: ${cityCount[0].values[0][0]}`);
      }
    } catch (e) {
      console.log('   (Some tables may not exist)');
    }
    
    db.close();
    
    console.log('\n✅ Import complete!\n');
    console.log('=== Next Steps ===');
    console.log('1. Verify database:');
    console.log('   node -e "const SQL=require(\'sql.js\');const fs=require(\'fs\');SQL().then(S=>{const db=new S.Database(fs.readFileSync(\'data/data.sqlite3\'));console.log(db.exec(\'SELECT * FROM nation_info LIMIT 5\'));db.close();})"');
    console.log('\n2. Convert to JSON for Next.js:');
    console.log('   npm run data:convert');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// 実行
importDatabase();
