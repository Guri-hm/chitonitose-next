/**
 * SQLite Import Script
 * 変換されたSQLファイルをSQLiteデータベースにインポート
 * better-sqlite3の代わりにsqlite3パッケージを使用
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const SQL_FILE = path.join(__dirname, '..', 'data', 'database.sql');
const DB_FILE = path.join(__dirname, '..', 'data', 'data.sqlite3');

console.log('SQLite Database Import');
console.log('======================\n');

// SQLファイルの存在確認
if (!fs.existsSync(SQL_FILE)) {
  console.error(`Error: SQL file not found: ${SQL_FILE}`);
  console.log('Please run: npm run db:convert');
  process.exit(1);
}

// 既存のDBファイルがあれば削除（クリーンインポート）
if (fs.existsSync(DB_FILE)) {
  console.log('⚠ Existing database found. Creating backup...');
  const backupFile = `${DB_FILE}.backup.${Date.now()}`;
  fs.copyFileSync(DB_FILE, backupFile);
  console.log(`✓ Backup created: ${backupFile}\n`);
  fs.unlinkSync(DB_FILE);
}

console.log('Checking for SQLite installation...\n');

// Windows環境でsqlite3が利用可能か確認
const checkSqlite = spawn('where.exe', ['sqlite3'], { shell: true });

checkSqlite.on('close', (code) => {
  if (code === 0) {
    // SQLite3がインストールされている場合
    importWithSqlite3();
  } else {
    // SQLite3がない場合は代替方法を提案
    console.log('SQLite3 is not installed on this system.');
    console.log('\n=== Installation Options ===\n');
    console.log('Option 1: Install SQLite3 for Windows');
    console.log('  1. Download from: https://www.sqlite.org/download.html');
    console.log('  2. Extract sqlite3.exe to a folder in your PATH');
    console.log('  3. Run this script again\n');
    console.log('Option 2: Use npm package (recommended)');
    console.log('  npm install sqlite3');
    console.log('  Then run: npm run db:import\n');
    console.log('Option 3: Use DB Browser for SQLite (GUI)');
    console.log('  1. Download from: https://sqlitebrowser.org/');
    console.log('  2. Open DB Browser');
    console.log('  3. Create new database: data/data.sqlite3');
    console.log(`  4. File > Import > Database from SQL file: ${SQL_FILE}`);
    
    // 簡易インポートスクリプトを作成
    createManualImportScript();
  }
});

function importWithSqlite3() {
  console.log('✓ SQLite3 found. Starting import...\n');
  
  const sql = fs.readFileSync(SQL_FILE, 'utf-8');
  const importProcess = spawn('sqlite3', [DB_FILE], { shell: true });
  
  importProcess.stdin.write(sql);
  importProcess.stdin.end();
  
  importProcess.stdout.on('data', (data) => {
    console.log(data.toString());
  });
  
  importProcess.stderr.on('data', (data) => {
    console.error(data.toString());
  });
  
  importProcess.on('close', (code) => {
    if (code === 0) {
      console.log('\n✓ Database imported successfully!');
      verifyDatabase();
    } else {
      console.error(`\n✗ Import failed with code ${code}`);
      process.exit(1);
    }
  });
}

function verifyDatabase() {
  console.log('\nVerifying database...');
  const verify = spawn('sqlite3', [DB_FILE, '.tables'], { shell: true });
  
  verify.stdout.on('data', (data) => {
    console.log('\nTables created:');
    console.log(data.toString());
  });
  
  verify.on('close', () => {
    console.log('\n=== Next Steps ===');
    console.log('1. Verify data: sqlite3 data/data.sqlite3 "SELECT COUNT(*) FROM nation_info;"');
    console.log('2. Convert to JSON: npm run data:convert');
  });
}

function createManualImportScript() {
  const psScript = `# PowerShell script to import SQL to SQLite
# Requires sqlite3.exe in PATH

$sqlFile = "${SQL_FILE.replace(/\\/g, '\\\\')}"
$dbFile = "${DB_FILE.replace(/\\/g, '\\\\')}"

if (Test-Path $dbFile) {
    $backup = "$dbFile.backup.$(Get-Date -Format 'yyyyMMddHHmmss')"
    Copy-Item $dbFile $backup
    Remove-Item $dbFile
}

Get-Content $sqlFile | sqlite3 $dbFile

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Import successful"
    sqlite3 $dbFile ".tables"
} else {
    Write-Host "✗ Import failed"
}
`;
  
  const scriptPath = path.join(__dirname, '..', 'data', 'import.ps1');
  fs.writeFileSync(scriptPath, psScript, 'utf-8');
  console.log(`\nManual import script created: ${scriptPath}`);
  console.log('Run with: powershell -ExecutionPolicy Bypass -File data\\import.ps1');
}
