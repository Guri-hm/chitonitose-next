const { convertOmnibusHtml, addFrontmatterAndTitle } = require('./convert-omnibus-simple');
const fs = require('fs');
const path = require('path');

// omnibus用のタイトルとファイル名の対応
const omnibusFiles = [
  { id: 1, title: '旧石器時代～弥生時代', file: 'jh_omnibus1.html' },
  { id: 2, title: '古墳時代', file: 'jh_omnibus2.html' },
  { id: 3, title: '飛鳥時代', file: 'jh_omnibus3.html' },
  { id: 4, title: '奈良時代', file: 'jh_omnibus4.html' },
  { id: 5, title: '平安時代①', file: 'jh_omnibus5.html' },
  { id: 6, title: '平安時代②', file: 'jh_omnibus6.html' },
  { id: 7, title: '鎌倉時代①', file: 'jh_omnibus7.html' },
  { id: 8, title: '鎌倉時代②', file: 'jh_omnibus8.html' },
  { id: 9, title: '室町時代①', file: 'jh_omnibus9.html' },
  { id: 10, title: '室町時代②', file: 'jh_omnibus10.html' },
  { id: 11, title: '戦国時代', file: 'jh_omnibus11.html' },
  { id: 12, title: '江戸時代①', file: 'jh_omnibus12.html' },
  { id: 13, title: '江戸時代②', file: 'jh_omnibus13.html' },
  { id: 14, title: '江戸時代③', file: 'jh_omnibus14.html' },
  { id: 15, title: '江戸時代④', file: 'jh_omnibus15.html' },
  { id: 16, title: '江戸時代⑤', file: 'jh_omnibus16.html' },
  { id: 17, title: '明治時代①', file: 'jh_omnibus17.html' },
  { id: 18, title: '明治時代②', file: 'jh_omnibus18.html' },
  { id: 19, title: '明治時代③', file: 'jh_omnibus19.html' },
  { id: 20, title: '明治時代④（明治の内閣）', file: 'jh_omnibus20.html' },
  { id: 21, title: '大正時代①（大正の内閣）', file: 'jh_omnibus21.html' },
  { id: 22, title: '大正時代②', file: 'jh_omnibus22.html' },
  { id: 23, title: '昭和時代①', file: 'jh_omnibus23.html' },
  { id: 24, title: '昭和時代②', file: 'jh_omnibus24.html' },
  { id: 25, title: '昭和時代③', file: 'jh_omnibus25.html' },
  { id: 26, title: '戦後史①', file: 'jh_omnibus26.html' },
];

// cultural-history用のタイトルとファイル名の対応
const culturalHistoryFiles = [
  { id: 1, title: '農業・産業の歴史', file: 'jh_omnibus_cultural_history1.html' },
  { id: 2, title: '女性の歴史', file: 'jh_omnibus_cultural_history2.html' },
  { id: 3, title: '沖縄の歴史', file: 'jh_omnibus_cultural_history3.html' },
];

const originDir = path.join(__dirname, '..', 'origin', 'chitonitose', 'jh');
const omnibusOutputDir = path.join(__dirname, '..', 'content', 'jh', 'omnibus');
const culturalHistoryOutputDir = path.join(__dirname, '..', 'content', 'jh', 'cultural-history');

// 出力ディレクトリを作成
if (!fs.existsSync(omnibusOutputDir)) {
  fs.mkdirSync(omnibusOutputDir, { recursive: true });
}
if (!fs.existsSync(culturalHistoryOutputDir)) {
  fs.mkdirSync(culturalHistoryOutputDir, { recursive: true });
}

function convertFiles(files, outputDir, categoryName) {
  console.log(`\n=== ${categoryName} 変換開始 ===\n`);
  
  let successCount = 0;
  let failCount = 0;
  
  for (const item of files) {
    const htmlPath = path.join(originDir, item.file);
    const outputPath = path.join(outputDir, `${item.id}.md`);
    
    try {
      if (!fs.existsSync(htmlPath)) {
        console.log(`⚠️  スキップ (ファイルなし): ${item.file}`);
        failCount++;
        continue;
      }
      
      const markdown = convertOmnibusHtml(htmlPath);
      const final = addFrontmatterAndTitle(markdown, item.title);
      
      fs.writeFileSync(outputPath, final, 'utf-8');
      console.log(`✅ Created ${item.id}.md - ${item.title}`);
      successCount++;
    } catch (error) {
      console.error(`❌ Failed ${item.id}.md - ${item.title}`);
      console.error(`   Error: ${error.message}`);
      failCount++;
    }
  }
  
  console.log(`\n${categoryName} - Success: ${successCount}, Failed: ${failCount}\n`);
}

// omnibus変換
convertFiles(omnibusFiles, omnibusOutputDir, 'omnibus');

// cultural-history変換
convertFiles(culturalHistoryFiles, culturalHistoryOutputDir, 'cultural-history');

console.log('=== 全変換完了 ===');
