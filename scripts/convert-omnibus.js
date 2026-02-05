const fs = require('fs');
const path = require('path');

function convertHTMLToMDX(html, title) {
  // toc-range内のコンテンツを抽出
  const tocRangeMatch = html.match(/<div id=['"]toc-range['"][^>]*>([\s\S]*?)<\/div>[\s\S]*?<\/html>/i);
  if (!tocRangeMatch) {
    console.error('No #toc-range found');
    return null;
  }

  let content = tocRangeMatch[1];

  // 不要な要素を削除
  content = content.replace(/<\?php[\s\S]*?\?>/g, '');  // PHP
  content = content.replace(/<div id=["']toc["'][^>]*><\/div>/g, '');  // 目次div
  content = content.replace(/<script[\s\S]*?<\/script>/gi, '');  // script
  
  // h2-h4を変換
  content = content.replace(/<h2[^>]*>(.*?)<\/h2>/g, '\n## $1\n');
  content = content.replace(/<h3[^>]*>(.*?)<\/h3>/g, '\n### $1\n');
  content = content.replace(/<h4[^>]*>(.*?)<\/h4>/g, '\n#### $1\n');

  // divクラスを変換
  content = content.replace(/<div class=["']top["'][^>]*>([\s\S]*?)<\/div>/g, (match, inner) => {
    return `\n:::top\n${cleanInnerHTML(inner)}\n:::\n`;
  });
  content = content.replace(/<div class=["']middle["'][^>]*>([\s\S]*?)<\/div>/g, (match, inner) => {
    return `\n:::middle\n${cleanInnerHTML(inner)}\n:::\n`;
  });
  content = content.replace(/<div class=["']last["'][^>]*>([\s\S]*?)<\/div>/g, (match, inner) => {
    return `\n:::last\n${cleanInnerHTML(inner)}\n:::\n`;
  });
  content = content.replace(/<div class=["']sup["'][^>]*>([\s\S]*?)<\/div>/g, (match, inner) => {
    return `\n:::sup\n${cleanInnerHTML(inner)}\n:::\n`;
  });
  content = content.replace(/<div class=["']lead["'][^>]*>([\s\S]*?)<\/div>/g, (match, inner) => {
    return `\n:::lead\n${cleanInnerHTML(inner)}\n:::\n`;
  });
  content = content.replace(/<div class=["']list["'][^>]*>([\s\S]*?)<\/div>/g, (match, inner) => {
    return `\n:::list\n${cleanInnerHTML(inner)}\n:::\n`;
  });

  // 画像付きgazo
  content = content.replace(/<div class=["']gazo\s+half["'][^>]*>([\s\S]*?)<\/div>/g, (match, inner) => {
    return convertGazoDiv(inner, 'half');
  });
  content = content.replace(/<div class=["']gazo\s+twice["'][^>]*>([\s\S]*?)<\/div>/g, (match, inner) => {
    return convertGazoDiv(inner, 'twice');
  });
  content = content.replace(/<div class=["']gazo["'][^>]*>([\s\S]*?)<\/div>/g, (match, inner) => {
    return convertGazoDiv(inner, '');
  });

  // 用語span（chg関数付き）
  content = content.replace(/<span\s+onclick=["']chg\(this\)["'][^>]*>(.*?)<\/span>/g, '[[$1]]');

  // ruby要素
  content = content.replace(/<ruby>(.*?)<rt>(.*?)<\/rt><\/ruby>/g, '{$1}^($2)^');

  // br
  content = content.replace(/<br\s*\/?>/g, '\n');

  // 矢印記号
  content = content.replace(/⇒/g, '\n::arrow\n');
  content = content.replace(/→/g, '\n::arrow\n');

  // 残りのHTMLタグを削除
  content = content.replace(/<[^>]+>/g, '');

  // HTML entities
  content = content.replace(/&nbsp;/g, ' ');
  content = content.replace(/&lt;/g, '<');
  content = content.replace(/&gt;/g, '>');
  content = content.replace(/&amp;/g, '&');

  // 複数の空行を1つに
  content = content.replace(/\n{3,}/g, '\n\n');

  // frontmatter + h1タイトル + コンテンツ
  const markdown = [
    '---',
    `title: "${title}"`,
    '---',
    '',
    `# ${title}`,
    '',
    content.trim(),
    ''
  ].join('\n');

  return markdown;
}

function cleanInnerHTML(html) {
  // spanの用語変換
  let cleaned = html.replace(/<span\s+onclick=["']chg\(this\)["'][^>]*>(.*?)<\/span>/g, '[[$1]]');
  // ruby
  cleaned = cleaned.replace(/<ruby>(.*?)<rt>(.*?)<\/rt><\/ruby>/g, '{$1}^($2)^');
  // 残りのタグを削除
  cleaned = cleaned.replace(/<[^>]+>/g, '');
  // entities
  cleaned = cleaned.replace(/&nbsp;/g, ' ');
  cleaned = cleaned.replace(/&lt;/g, '<');
  cleaned = cleaned.replace(/&gt;/g, '>');
  cleaned = cleaned.replace(/&amp;/g, '&');
  return cleaned.trim();
}

function convertGazoDiv(inner, sizeClass) {
  // img要素を抽出
  const imgMatch = inner.match(/<img[^>]*>/);
  if (!imgMatch) return '';

  const img = imgMatch[0];
  const srcMatch = img.match(/(?:src|data-src)=["']([^"']+)["']/);
  const altMatch = img.match(/alt=["']([^"']*)["']/);

  const src = srcMatch ? srcMatch[1] : '';
  const alt = altMatch ? altMatch[1] : '';

  const imgMd = `![${alt}](${src})`;

  if (sizeClass) {
    return `\n:::gazo{size="${sizeClass}"}\n${imgMd}\n:::\n`;
  } else {
    return `\n:::gazo\n${imgMd}\n:::\n`;
  }
}

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

// メイン処理
const originDir = path.join(__dirname, '../origin/chitonitose/jh');
const outputDir = path.join(__dirname, '../content/jh/omnibus');

// 出力ディレクトリが存在しない場合は作成
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

let successCount = 0;
let failCount = 0;

for (const omnibus of omnibusTitles) {
  const htmlPath = path.join(originDir, `jh_omnibus${omnibus.id}.html`);
  const mdxPath = path.join(outputDir, `${omnibus.id}.md`);

  if (!fs.existsSync(htmlPath)) {
    console.error(`❌ HTML file not found: ${htmlPath}`);
    failCount++;
    continue;
  }

  try {
    const html = fs.readFileSync(htmlPath, 'utf-8');
    const mdx = convertHTMLToMDX(html, omnibus.title);
    if (mdx) {
      fs.writeFileSync(mdxPath, mdx, 'utf-8');
      console.log(`✅ Created ${mdxPath}`);
      successCount++;
    } else {
      failCount++;
    }
  } catch (error) {
    console.error(`❌ Error converting ${htmlPath}:`, error.message);
    failCount++;
  }
}

console.log(`\n✅ Success: ${successCount}`);
console.log(`❌ Failed: ${failCount}`);


// HTML要素をMarkdownに変換
function convertElementToMarkdown(element, dom) {
  const tagName = element.tagName?.toLowerCase();
  
  if (!tagName) {
    return element.textContent || '';
  }

  // div要素の処理
  if (tagName === 'div') {
    const className = element.className;
    const content = convertChildrenToMarkdown(element, dom);
    
    if (className.includes('top')) {
      return `:::top\n${content}\n:::`;
    } else if (className.includes('middle')) {
      return `:::middle\n${content}\n:::`;
    } else if (className.includes('last')) {
      return `:::last\n${content}\n:::`;
    } else if (className.includes('sup')) {
      return `:::sup\n${content}\n:::`;
    } else if (className.includes('lead')) {
      return `:::lead\n${content}\n:::`;
    } else if (className.includes('gazo')) {
      let sizeClass = '';
      if (className.includes('half')) sizeClass = 'half';
      else if (className.includes('twice')) sizeClass = 'twice';
      
      const img = element.querySelector('img');
      if (img) {
        const src = img.getAttribute('src') || img.getAttribute('data-src');
        const alt = img.getAttribute('alt') || '';
        const imgMd = `![${alt}](${src})`;
        
        if (sizeClass) {
          return `:::gazo{size="${sizeClass}"}\n${imgMd}\n:::`;
        } else {
          return `:::gazo\n${imgMd}\n:::`;
        }
      }
      return '';
    } else if (className.includes('list')) {
      return `:::list\n${content}\n:::`;
    } else if (className.includes('contents')) {
      return content;
    }
    return content;
  }

  // 見出し
  if (tagName === 'h1') {
    return `# ${element.textContent.trim()}`;
  }
  if (tagName === 'h2') {
    return `## ${element.textContent.trim()}`;
  }
  if (tagName === 'h3') {
    return `### ${element.textContent.trim()}`;
  }
  if (tagName === 'h4') {
    return `#### ${element.textContent.trim()}`;
  }

  // リスト
  if (tagName === 'ul' || tagName === 'ol') {
    const items = Array.from(element.children).map(li => {
      const content = convertChildrenToMarkdown(li, dom);
      return tagName === 'ul' ? `- ${content}` : `1. ${content}`;
    });
    return items.join('\n');
  }

  // テーブル
  if (tagName === 'table') {
    return convertTableToMarkdown(element);
  }

  // 段落
  if (tagName === 'p') {
    return convertChildrenToMarkdown(element, dom);
  }

  // br
  if (tagName === 'br') {
    return '\n';
  }

  // span要素（用語）
  if (tagName === 'span') {
    const onclick = element.getAttribute('onclick');
    if (onclick && onclick.includes('chg(this)')) {
      return `[[${element.textContent.trim()}]]`;
    }
    return element.textContent || '';
  }

  // ruby
  if (tagName === 'ruby') {
    const rb = element.querySelector('rb')?.textContent || element.childNodes[0]?.textContent || '';
    const rt = element.querySelector('rt')?.textContent || '';
    if (rt) {
      return `{${rb}}^(${rt})^`;
    }
    return rb;
  }

  // 矢印
  if (element.textContent.trim() === '⇒' || element.textContent.trim() === '→') {
    return '\n::arrow\n';
  }

  return convertChildrenToMarkdown(element, dom);
}

function convertChildrenToMarkdown(element, dom) {
  const result = [];
  
  for (const node of element.childNodes) {
    if (node.nodeType === 3) { // Text node
      const text = node.textContent.trim();
      if (text) result.push(text);
    } else if (node.nodeType === 1) { // Element node
      const md = convertElementToMarkdown(node, dom);
      if (md) result.push(md);
    }
  }
  
  return result.join('');
}

function convertTableToMarkdown(table) {
  const rows = Array.from(table.querySelectorAll('tr'));
  if (rows.length === 0) return '';

  const headers = Array.from(rows[0].querySelectorAll('th, td')).map(cell => 
    cell.textContent.trim()
  );
  
  const separator = headers.map(() => '---').join(' | ');
  const headerRow = headers.join(' | ');
  
  const bodyRows = rows.slice(1).map(row => {
    const cells = Array.from(row.querySelectorAll('td')).map(cell => 
      cell.textContent.trim()
    );
    return cells.join(' | ');
  });

  return [headerRow, separator, ...bodyRows].join('\n');
}

function convertHTMLToMDX(htmlPath, title) {
  console.log(`Converting ${htmlPath}...`);
  
  const html = fs.readFileSync(htmlPath, 'utf-8');
  const dom = new JSDOM(html);
  const document = dom.window.document;

  // toc-range内のコンテンツを取得
  const tocRange = document.getElementById('toc-range');
  if (!tocRange) {
    console.error(`No #toc-range found in ${htmlPath}`);
    return null;
  }

  const markdown = [];
  
  // frontmatter
  markdown.push('---');
  markdown.push(`title: "${title}"`);
  markdown.push('---');
  markdown.push('');
  
  // h1タイトルを追加
  markdown.push(`# ${title}`);
  markdown.push('');

  // 各子要素を変換
  for (const child of tocRange.children) {
    // 不要な要素をスキップ
    const id = child.id;
    if (id === 'toc' || 
        child.tagName === 'SCRIPT' ||
        child.className.includes('pagination') ||
        child.className.includes('footer')) {
      continue;
    }

    const md = convertElementToMarkdown(child, dom);
    if (md) {
      markdown.push(md);
      markdown.push('');
    }
  }

  return markdown.join('\n').trim() + '\n';
}

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

// メイン処理
const originDir = path.join(__dirname, '../origin/chitonitose/jh');
const outputDir = path.join(__dirname, '../content/jh/omnibus');

// 出力ディレクトリが存在しない場合は作成
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

let successCount = 0;
let failCount = 0;

for (const omnibus of omnibusTitles) {
  const htmlPath = path.join(originDir, `jh_omnibus${omnibus.id}.html`);
  const mdxPath = path.join(outputDir, `${omnibus.id}.md`);

  if (!fs.existsSync(htmlPath)) {
    console.error(`❌ HTML file not found: ${htmlPath}`);
    failCount++;
    continue;
  }

  try {
    const mdx = convertHTMLToMDX(htmlPath, omnibus.title);
    if (mdx) {
      fs.writeFileSync(mdxPath, mdx, 'utf-8');
      console.log(`✅ Created ${mdxPath}`);
      successCount++;
    } else {
      failCount++;
    }
  } catch (error) {
    console.error(`❌ Error converting ${htmlPath}:`, error.message);
    failCount++;
  }
}

console.log(`\n✅ Success: ${successCount}`);
console.log(`❌ Failed: ${failCount}`);
