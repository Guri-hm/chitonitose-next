const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

async function main() {
  const SQL = await initSqlJs();
  const buffer = fs.readFileSync(path.join(__dirname, '..', 'data', 'data.sqlite3'));
  const db = new SQL.Database(buffer);

  // テーブル一覧
  const tables = db.exec("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
  const tableNames = tables[0].values.map(v => v[0]);
  console.log('Tables:', tableNames);

  // one_q_one_a テーブルを確認
  if (tableNames.includes('one_q_one_a')) {
    const schema = db.exec("PRAGMA table_info(one_q_one_a)");
    console.log('\none_q_one_a columns:', schema[0].values.map(v => v[1] + '(' + v[2] + ')'));
    const count = db.exec("SELECT COUNT(*) FROM one_q_one_a");
    console.log('Row count:', count[0].values[0][0]);
    const sample = db.exec("SELECT * FROM one_q_one_a LIMIT 5");
    console.log('Columns:', sample[0].columns);
    console.log('Sample:', JSON.stringify(sample[0].values, null, 2));
    // subject一覧
    const subjects = db.exec("SELECT DISTINCT subject_id FROM one_q_one_a ORDER BY subject_id");
    if (subjects.length > 0) console.log('\nsubject_ids:', subjects[0].values.map(v => v[0]));
    // unit一覧
    const units = db.exec("SELECT DISTINCT subject_id, unit_id FROM one_q_one_a ORDER BY subject_id, unit_id LIMIT 20");
    if (units.length > 0) console.log('subject/unit:', units[0].values);
  } else {
    const similar = tableNames.filter(n => n.toLowerCase().includes('one') || n.toLowerCase().includes('quiz') || n.toLowerCase().includes('exercise') || n.toLowerCase().includes('question'));
    console.log('\nSimilar tables:', similar);
  }

  db.close();
}

main().catch(console.error);
