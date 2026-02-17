const fs = require('fs');
const path = require('path');
const { convertHtmlToMarkdown } = require('./html-to-md');

const omnibusList = [
  { id: 1, filename: 'jh_omnibus1.html', title: '旧石器時代～弥生時代' },
  { id: 2, filename: 'jh_omnibus2.html', title: '古墳時代' },
  { id: 3, filename: 'jh_omnibus3.html', title: '飛鳥時代' },
  { id: 4, filename: 'jh_omnibus4.html', title: '奈良時代' },
  { id: 5, filename: 'jh_omnibus5.html', title: '平安時代①' },
  { id: 6, filename: 'jh_omnibus6.html', title: '平安時代②' },
  { id: 7, filename: 'jh_omnibus7.html', title: '鎌倉時代①' },
  { id: 8, filename: 'jh_omnibus8.html', title: '鎌倉時代②' },
  { id: 9, filename: 'jh_omnibus9.html', title: '室町時代①' },
  { id: 10, filename: 'jh_omnibus10.html', title: '室町時代②' },
  { id: 11, filename: 'jh_omnibus11.html', title: '戦国時代' },
  { id: 12, filename: 'jh_omnibus12.html', title: '江戸時代①' },
  { id: 13, filename: 'jh_omnibus13.html', title: '江戸時代②' },
  { id: 14, filename: 'jh_omnibus14.html', title: '江戸時代③' },
  { id: 15, filename: 'jh_omnibus15.html', title: '江戸時代④' },
  { id: 16, filename: 'jh_omnibus16.html', title: '江戸時代⑤' },
  { id: 17, filename: 'jh_omnibus17.html', title: '明治時代①' },
  { id: 18, filename: 'jh_omnibus18.html', title: '明治時代②' },
  { id: 19, filename: 'jh_omnibus19.html', title: '明治時代③' },
  { id: 20, filename: 'jh_omnibus20.html', title: '明治時代④（明治の内閣）' },
  { id: 21, filename: 'jh_omnibus21.html', title: '大正時代①（大正の内閣）' },
  { id: 22, filename: 'jh_omnibus22.html', title: '大正時代②' },
  { id: 23, filename: 'jh_omnibus23.html', title: '昭和時代①' },
  { id: 24, filename: 'jh_omnibus24.html', title: '昭和時代②' },
  { id: 25, filename: 'jh_omnibus25.html', title: '昭和時代③' },
  { id: 26, filename: 'jh_omnibus26.html', title: '戦後史①' },
];

const culturalHistoryList = [
  { id: 1, filename: 'jh_cultural-history1.html', title: '農業・産業の歴史' },
  { id: 2, filename: 'jh_cultural-history2.html', title: '女性の歴史' },
  { id: 3, filename: 'jh_cultural-history3.html', title: '沖縄の歴史' },
];

const originDir = path.join(__dirname, '../origin/chitonitose/jh');
const omnibusOutDir = path.join(__dirname, '../content/jh/omnibus');
const culturalHistoryOutDir = path.join(__dirname, '../content/jh/cultural-history');

// ディレクトリ作成
if (!fs.existsSync(omnibusOutDir)) {
  fs.mkdirSync(omnibusOutDir, { recursive: true });
}
if (!fs.existsSync(culturalHistoryOutDir)) {
  fs.mkdirSync(culturalHistoryOutDir, { recursive: true });
}

// omnibus変換
console.log('\n=== omnibus 変換開始 ===\n');
let omnibusSuccess = 0;
let omnibusFailed = 0;

for (const item of omnibusList) {
  try {
    const htmlPath = path.join(originDir, item.filename);
    const markdown = convertHtmlToMarkdown(htmlPath);
    
    const frontmatter = `---\ntitle: "${item.title}"\n---\n\n# ${item.title}\n\n`;
    const output = frontmatter + markdown;
    
    const outPath = path.join(omnibusOutDir, `${item.id}.md`);
    fs.writeFileSync(outPath, output, 'utf-8');
    
    console.log(`✅ Created ${item.id}.md - ${item.title}`);
    omnibusSuccess++;
  } catch (error) {
    console.error(`❌ Failed ${item.id}.md - ${item.title}`);
    console.error(error.message);
    omnibusFailed++;
  }
}

console.log(`\nomnibus - Success: ${omnibusSuccess}, Failed: ${omnibusFailed}\n`);

// cultural-history変換
console.log('\n=== cultural-history 変換開始 ===\n');
let culturalSuccess = 0;
let culturalFailed = 0;

for (const item of culturalHistoryList) {
  try {
    const htmlPath = path.join(originDir, item.filename);
    const markdown = convertHtmlToMarkdown(htmlPath);
    
    const frontmatter = `---\ntitle: "${item.title}"\n---\n\n# ${item.title}\n\n`;
    const output = frontmatter + markdown;
    
    const outPath = path.join(culturalHistoryOutDir, `${item.id}.md`);
    fs.writeFileSync(outPath, output, 'utf-8');
    
    console.log(`✅ Created ${item.id}.md - ${item.title}`);
    culturalSuccess++;
  } catch (error) {
    console.error(`❌ Failed ${item.id}.md - ${item.title}`);
    console.error(error.message);
    culturalFailed++;
  }
}

console.log(`\ncultural-history - Success: ${culturalSuccess}, Failed: ${culturalFailed}`);
console.log('\n=== 全変換完了 ===');
