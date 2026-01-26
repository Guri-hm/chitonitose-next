/**
 * SQLite to JSON Converter
 * SQLiteデータベースから必要なデータをJSON形式で出力するスクリプト
 */

const fs = require('fs');
const path = require('path');

// データベースファイルのパス（まだ存在しない場合は作成予定）
const DB_PATH = path.join(__dirname, '..', 'data', 'database.sqlite');
const OUTPUT_DIR = path.join(__dirname, '..', 'data', 'charts');

// 出力ディレクトリが存在しない場合は作成
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * JSONファイル出力のヘルパー関数
 */
function writeJSON(filename, data) {
  const filepath = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`✓ Generated: ${filename}`);
}

/**
 * メイン処理
 */
async function main() {
  console.log('Starting data conversion...\n');

  // データベースが存在しない場合の処理
  if (!fs.existsSync(DB_PATH)) {
    console.log('⚠ Database file not found. Creating sample data...\n');
    
    // サンプルデータを作成
    const sampleNews = [
      {
        id: 1,
        date: '2026-01-26',
        news_title: 'サイトリニューアル',
        news_type: '更新',
        news_text: 'Next.jsでサイトを再構築しました',
        path: null
      }
    ];
    
    writeJSON('news.json', sampleNews);
    writeJSON('aging_society.json', []);
    writeJSON('birthrate_mortality.json', []);
    
    console.log('\n✓ Sample data created. Please add database.sqlite file to continue.');
    return;
  }

  // TODO: better-sqlite3を使用してデータベースからデータを取得
  // const Database = require('better-sqlite3');
  // const db = new Database(DB_PATH, { readonly: true });
  
  // 各テーブルのデータを取得してJSON化
  // 例：
  // const news = db.prepare('SELECT * FROM news ORDER BY date DESC LIMIT 10').all();
  // writeJSON('news.json', news);
  
  console.log('\n✓ Data conversion completed!');
}

// スクリプト実行
main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
