const fs = require('fs');
const path = require('path');

/**
 * omnibus用のシンプルなHTML→MDX変換スクリプト
 * 
 * omnibusのHTML構造はシンプル：
 * - <h2>セクション</h2>
 * - <h3>サブセクション</h3>
 * - <h4>項目</h4>
 * - <div class="top">テキスト</div>
 * - <br>
 * - <span class="all">用語</span>
 * - <ruby>漢字<rt>読み</rt></ruby>
 */

function convertOmnibusHtml(htmlPath) {
  const html = fs.readFileSync(htmlPath, 'utf-8');
  
  // コンテンツ部分を抽出
  const match = html.match(/<div id='toc-range'[^>]*>([\s\S]*?)<\/div><!-- \/contents -->/);
  if (!match) {
    throw new Error('コンテンツが見つかりません');
  }
  
  const lines = match[1].split('\n').map(line => line.trim()).filter(line => line);
  const result = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // PHP・コメント・不要なタグをスキップ
    if (line.startsWith('<?php') || 
        line.startsWith('<!--') || 
        line.includes('<div id="toc"></div>')) {
      continue;
    }
    
    // h2見出し
    if (line.startsWith('<h2>')) {
      const text = line.replace(/<\/?h2>/g, '');
      result.push('');
      result.push(`## ${text}`);
      continue;
    }
    
    // h3見出し
    if (line.startsWith('<h3>')) {
      const text = line.replace(/<\/?h3>/g, '');
      result.push(`### ${text}`);
      continue;
    }
    
    // h4見出し
    if (line.startsWith('<h4>')) {
      const text = line.replace(/<\/?h4>/g, '');
      result.push(`#### ${text}`);
      continue;
    }
    
    // <br> → 空行
    if (line === '<br>') {
      result.push('');
      continue;
    }
    
    // <div class="top">テキスト</div>
    if (line.startsWith('<div class="top">')) {
      const content = line
        .replace('<div class="top">', '')
        .replace('</div>', '');
      
      const converted = convertInlineElements(content);
      result.push(':::top');
      result.push(converted);
      result.push(':::');
      continue;
    }
    
    // その他のdivクラス（middle, last, sup など）
    const divMatch = line.match(/<div class="([^"]+)">(.*?)<\/div>/);
    if (divMatch) {
      const className = divMatch[1];
      const content = divMatch[2];
      const converted = convertInlineElements(content);
      result.push(`:::${className}`);
      result.push(converted);
      result.push(':::');
      continue;
    }
  }
  
  return result.join('\n');
}

/**
 * インライン要素の変換
 * - <span class="all">用語</span> → [[用語]]
 * - <ruby>漢字<rt>読み</rt></ruby> → そのまま
 */
function convertInlineElements(text) {
  // <span onclick="chg(this)" class="all">用語</span> → [[用語]]
  text = text.replace(/<span onclick="chg\(this\)" class="all">([^<]+)<\/span>/g, '[[$1]]');
  text = text.replace(/<span class="all">([^<]+)<\/span>/g, '[[$1]]');
  
  // <ruby>タグ内の改行・空白を削除
  text = text.replace(/<ruby>([^<]*?)<rt>([^<]*?)<\/rt><\/ruby>/g, (match, base, rt) => {
    return `<ruby>${base.trim()}<rt>${rt.trim()}</rt></ruby>`;
  });
  
  return text;
}

/**
 * フロントマターとタイトルを追加
 */
function addFrontmatterAndTitle(markdown, title) {
  let frontmatter = '---\n';
  frontmatter += `title: "${title}"\n`;
  frontmatter += '---\n\n';
  frontmatter += `# ${title}\n`;
  
  return frontmatter + markdown;
}

// コマンドライン実行
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length !== 3) {
    console.error('使用方法: node convert-omnibus-simple.js <HTMLファイルパス> <タイトル> <出力MDファイルパス>');
    console.error('例: node convert-omnibus-simple.js origin/chitonitose/jh/jh_omnibus1.html "旧石器時代～弥生時代" content/jh/omnibus/1.md');
    process.exit(1);
  }
  
  const [htmlPath, title, outputPath] = args;
  
  try {
    console.log(`変換開始: ${htmlPath}`);
    const markdown = convertOmnibusHtml(htmlPath);
    const final = addFrontmatterAndTitle(markdown, title);
    
    // 出力ディレクトリを作成
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, final, 'utf-8');
    console.log(`✅ 変換完了: ${outputPath}`);
  } catch (error) {
    console.error('❌ エラー:', error.message);
    process.exit(1);
  }
}

module.exports = { convertOmnibusHtml, addFrontmatterAndTitle };
