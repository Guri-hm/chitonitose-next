const fs = require('fs');
const path = require('path');
const { convertHtmlToMarkdown } = require('./html-to-md.js');

// 短期攻略タイトル一覧
const omnibusTitles = [
  { id: 1, title: '旧石器時代～弥生時代' },
  { id: 2, title: '古墳時代' },
  { id: 3, title: '飛鳥時代' },
  { id: 4, title: '奈良時代' },
  { id: 5, title: '平安時代①' },
  { id: 6, title: '平安時代②' },
  { id: 7, title: '鎌倉時代①' },
  { id: 8, title: '鎌倉時代②' },
  { id: 9, title: '室町時代①' },
  { id: 10, title: '室町時代②' },
  { id: 11, title: '戦国時代' },
  { id: 12, title: '江戸時代①' },
  { id: 13, title: '江戸時代②' },
  { id: 14, title: '江戸時代③' },
  { id: 15, title: '江戸時代④' },
  { id: 16, title: '江戸時代⑤' },
  { id: 17, title: '明治時代①' },
  { id: 18, title: '明治時代②' },
  { id: 19, title: '明治時代③' },
  { id: 20, title: '明治時代④（明治の内閣）' },
  { id: 21, title: '大正時代①（大正の内閣）' },
  { id: 22, title: '大正時代②' },
  { id: 23, title: '昭和時代①' },
  { id: 24, title: '昭和時代②' },
  { id: 25, title: '昭和時代③' },
  { id: 26, title: '戦後史①' },
];

// テーマ史タイトル一覧
const culturalHistoryTitles = [
  { id: 1, title: '農業・産業の歴史' },
  { id: 2, title: '女性の歴史' },
  { id: 3, title: '沖縄の歴史' },
];

function addFrontmatterAndTitle(markdown, title) {
  // overviewがある場合は取り出す
  const overviewMatch = markdown.match(/---overview---([\s\S]*?)---/);
  const overview = overviewMatch ? overviewMatch[1].trim() : '';
  
  // overview部分を削除
  let content = markdown.replace(/---overview---([\s\S]*?)---/, '').trim();
  
  // frontmatterを作成
  let frontmatter = '---\n';
  frontmatter += `title: "${title}"\n`;
  if (overview) {
    frontmatter += `overview: "${overview}"\n`;
  }
  frontmatter += '---\n\n';
  
  // h1タイトルを追加
  frontmatter += `# ${title}\n\n`;
  
  return frontmatter + content;
}

function convertBatch(type, titles, originDir, outputDir) {
  console.log(`\n=== ${type} 変換開始 ===`);
  
  // 出力ディレクトリが存在しない場合は作成
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  let successCount = 0;
  let failCount = 0;

  for (const item of titles) {
    const htmlFileName = type === 'omnibus' 
      ? `jh_omnibus${item.id}.html`
      : `jh_omnibus_cultural_history${item.id}.html`;
    
    const htmlPath = path.join(originDir, htmlFileName);
    const mdPath = path.join(outputDir, `${item.id}.md`);

    if (!fs.existsSync(htmlPath)) {
      console.error(`❌ HTML file not found: ${htmlPath}`);
      failCount++;
      continue;
    }

    try {
      const markdown = convertHtmlToMarkdown(htmlPath);
      const mdxContent = addFrontmatterAndTitle(markdown, item.title);
      
      fs.writeFileSync(mdPath, mdxContent, 'utf-8');
      console.log(`✅ Created ${item.id}.md - ${item.title}`);
      successCount++;
    } catch (error) {
      console.error(`❌ Error converting ${htmlPath}:`, error.message);
      failCount++;
    }
  }

  console.log(`\n${type} - Success: ${successCount}, Failed: ${failCount}`);
}

// メイン処理
const originDir = path.join(__dirname, '../origin/chitonitose/jh');

// 短期攻略を変換
convertBatch(
  'omnibus',
  omnibusTitles,
  originDir,
  path.join(__dirname, '../content/jh/omnibus')
);

// テーマ史を変換
convertBatch(
  'cultural-history',
  culturalHistoryTitles,
  originDir,
  path.join(__dirname, '../content/jh/cultural-history')
);

console.log('\n✅ 全ての変換が完了しました');
