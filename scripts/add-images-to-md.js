const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

/**
 * HTMLファイルから画像情報を抽出して、対応するMDファイルに追加
 */

function extractImageInfo(htmlPath) {
  const html = fs.readFileSync(htmlPath, 'utf-8');
  const $ = cheerio.load(html);
  const images = [];
  
  // .gazo divを探す
  $('div.gazo').each((i, elem) => {
    const $img = $(elem).find('img');
    const src = $img.attr('data-src') || $img.attr('src');
    const alt = $img.attr('alt') || '';
    const classes = $img.attr('class') || '';
    
    // キャプション（brの後のテキスト）
    const text = $(elem).text().trim();
    const caption = text || '';
    
    images.push({
      src: src ? src.replace('../share/img/loading.svg', '') : '',
      alt,
      classes: classes.split(' ').filter(c => c && c !== 'lazyload' && c !== 'popup-img'),
      caption
    });
  });
  
  return images;
}

function updateMdWithImages(mdPath, htmlPath) {
  if (!fs.existsSync(mdPath)) {
    console.log(`⚠ MD file not found: ${mdPath}`);
    return false;
  }
  
  if (!fs.existsSync(htmlPath)) {
    console.log(`⚠ HTML file not found: ${htmlPath}`);
    return false;
  }
  
  const images = extractImageInfo(htmlPath);
  if (images.length === 0) {
    return false;
  }
  
  let mdContent = fs.readFileSync(mdPath, 'utf-8');
  const lines = mdContent.split('\n');
  const result = [];
  let imageIndex = 0;
  let modified = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // ::gazo行を検出
    if (line.trim() === '::gazo') {
      result.push(line);
      
      // 次の行が::でなければ、すでに画像情報がある
      if (i + 1 < lines.length && lines[i + 1].trim() !== '::') {
        // 既存の画像情報をスキップ
        i++;
        while (i < lines.length && lines[i].trim() !== '::') {
          result.push(lines[i]);
          i++;
        }
        if (i < lines.length) {
          result.push(lines[i]); // ::
        }
        continue;
      }
      
      // 画像情報を追加
      if (imageIndex < images.length) {
        const img = images[imageIndex];
        if (img.src) {
          const classAttr = img.classes.length > 0 ? `{.${img.classes.join('.')}}` : '';
          result.push(`![${img.alt}](${img.src})${classAttr}`);
          if (img.caption) {
            result.push(img.caption);
          }
          modified = true;
        }
        imageIndex++;
      }
    } else {
      result.push(line);
    }
  }
  
  if (modified) {
    fs.writeFileSync(mdPath, result.join('\n'), 'utf-8');
    return true;
  }
  
  return false;
}

function processDirectory(category) {
  const originDir = path.join(__dirname, '..', 'origin', 'chitonitose', category);
  const contentDir = path.join(__dirname, '..', 'content', category, 'lessons');
  
  if (!fs.existsSync(originDir)) {
    console.log(`⚠ Origin directory not found: ${originDir}`);
    return 0;
  }
  
  if (!fs.existsSync(contentDir)) {
    console.log(`⚠ Content directory not found: ${contentDir}`);
    return 0;
  }
  
  const htmlFiles = fs.readdirSync(originDir).filter(f => f.endsWith('.html'));
  let updatedCount = 0;
  
  for (const htmlFile of htmlFiles) {
    // ファイル名から対応するMDファイルを推測
    // 例: jh_lessons1.html → 1.md
    const match = htmlFile.match(/^(jh|geo|wh)_lessons(.+)\.html$/);
    if (!match) continue;
    
    const lessonName = match[2];
    const mdFile = `${lessonName}.md`;
    
    const htmlPath = path.join(originDir, htmlFile);
    const mdPath = path.join(contentDir, mdFile);
    
    const updated = updateMdWithImages(mdPath, htmlPath);
    if (updated) {
      console.log(`✓ Updated: ${category}/lessons/${mdFile}`);
      updatedCount++;
    }
  }
  
  return updatedCount;
}

// メイン処理
console.log('Starting add-images-to-md script...\n');

const categories = ['jh', 'geo', 'wh'];
let totalUpdated = 0;

for (const category of categories) {
  console.log(`\nProcessing ${category}...`);
  const count = processDirectory(category);
  console.log(`  Updated ${count} files in ${category}`);
  totalUpdated += count;
}

console.log(`\n${'='.repeat(60)}`);
console.log(`✓ Complete! Updated ${totalUpdated} files.`);
console.log(`${'='.repeat(60)}\n`);
