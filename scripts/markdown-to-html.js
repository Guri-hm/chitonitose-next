/**
 * カスタムMarkdown記法をHTMLに変換するパーサー
 * 
 * 使い方:
 *   const { parseCustomMarkdown } = require('./markdown-to-html');
 *   const html = parseCustomMarkdown(markdownText);
 */

/**
 * 画像パスを適切な形式に変換
 * @param {string} imgPath - 元の画像パス
 * @param {string} subject - 科目 (jh/wh/geo)
 * @returns {string} - 変換後の画像パス
 */
function convertToWebP(imgPath, subject = '') {
  // 相対パスの場合は/images/科目/を追加
  if (!imgPath.startsWith('/') && !imgPath.startsWith('http') && subject) {
    imgPath = `/images/${subject}/${imgPath}`;
  }
  
  // WebP変換は現時点では無効化（元の拡張子を使用）
  return imgPath;
}

/**
 * カスタムMarkdownをHTMLに変換（一行ずつパース版）
 * @param {string} markdown - カスタムMarkdown記法のテキスト
 * @param {string} subject - 科目 (jh/wh/geo)
 * @returns {string} - 変換後のHTML
 */
function parseCustomMarkdown(markdown, subject = '') {
  // Normalize line endings
  let text = markdown.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  
  const lines = text.split('\n');
  const result = [];
  let i = 0;
  
  while (i < lines.length) {
    const line = lines[i];
    
    // 概要セクション - スキップ（page.tsxで別途表示）
    if (line === '---overview---') {
      i++;
      while (i < lines.length && lines[i] !== '---') {
        i++;
      }
      i++; // skip closing ---
      continue;
    }
    
    // 見出し
    if (line.startsWith('## ')) {
      result.push('<h2>' + convertInlineMarkdown(line.substring(3)) + '</h2>');
      i++;
      continue;
    }
    if (line.startsWith('### ')) {
      result.push('<h3>' + convertInlineMarkdown(line.substring(4)) + '</h3>');
      i++;
      continue;
    }
    
    // 矢印
    if (line === '---arrow---') {
      result.push('<div class="arrow"></div>');
      i++;
      continue;
    }
    
    // ::double ブロック
    if (line === '::double') {
      const content = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('---image---')) {
        content.push(lines[i]);
        i++;
      }
      
      // 画像行を解析
      if (i < lines.length && lines[i].startsWith('---image---')) {
        i++;
        const imgMatch = lines[i].match(/!\[([^\]]*)\]\(([^)]+)\)(?:\{\.([^}]+)\})?/);
        if (imgMatch) {
          const [, alt, imgSrc, imgClass] = imgMatch;
          // 画像パスをWebPに変換
          const webpSrc = convertToWebP(imgSrc, subject);
          const classNames = ['lazyload', 'popup-img'];
          if (imgClass) classNames.push(imgClass);
          
          i++;
          const caption = [];
          while (i < lines.length && lines[i] !== '::') {
            caption.push(lines[i]);
            i++;
          }
          
          const formattedText = content.join('\n').trim().replace(/\n\n/g, '<br />');
          result.push('<div class="double">');
          result.push(`\t<div class="top">${convertInlineMarkdown(formattedText)}</div>`);
          result.push(`\t<div class="text-center gazo"><img src="${webpSrc}" alt="${alt}" class="${classNames.join(' ')}" /></div>`);
          result.push('</div>');
          i++;
          continue;
        }
      }
    }
    
    // ::gazo ブロック
    if (line === '::gazo') {
      i++;
      const imgMatch = lines[i].match(/!\[([^\]]*)\]\(([^)]+)\)(?:\{\.([^}]+)\})?/);
      if (imgMatch) {
        const [, alt, imgSrc, imgClass] = imgMatch;
        // 画像パスをWebPに変換
        const webpSrc = convertToWebP(imgSrc, subject);
        const originalSrc = `/images/${subject}/${imgSrc}`; // 元画像パス
        const classNames = ['lazyload', 'popup-img'];
        if (imgClass) {
          imgClass.split('.').filter(c => c).forEach(c => classNames.push(c));
        }
        
        i++;
        const caption = [];
        while (i < lines.length && lines[i] !== '::') {
          caption.push(lines[i]);
          i++;
        }
        
        // カスタムdata属性付きdivとして出力（data-src=WebP, data-original=元画像）
        const captionHtml = caption.map(cap => cap.trim() ? convertInlineMarkdown(cap) : '').filter(c => c).join('<br />');
        result.push(`<div class="gazo lesson-image-placeholder" data-src="${webpSrc}" data-original="${originalSrc}" data-alt="${alt}" data-class="${classNames.join(' ')}" data-caption="${captionHtml.replace(/"/g, '&quot;')}"></div>`);
        i++;
        continue;
      }
    }
    
    // ::sup ブロック
    if (line === '::sup') {
      const content = [];
      i++;
      
      while (i < lines.length && lines[i] !== '::') {
        content.push(lines[i]);
        i++;
      }
      
      // content を1つの文字列に結合して :::lead...:::を処理
      let html = content.join('').replace(/:::lead(.*?):::/g, '<div class="lead">$1</div>');
      html = convertInlineMarkdown(html);
      
      result.push('<div class="sup">' + html + '</div>');
      i++;
      continue;
    }
    
    // ::top ブロック
    if (line === '::top') {
      const content = [];
      i++;
      while (i < lines.length && lines[i] !== '::') {
        content.push(lines[i]);
        i++;
      }
      result.push('<div class="top">' + content.map(l => convertInlineMarkdown(l)).join('') + '</div>');
      i++;
      continue;
    }
    
    // ::middle ブロック
    if (line === '::middle') {
      const content = [];
      i++;
      while (i < lines.length && lines[i] !== '::') {
        content.push(lines[i]);
        i++;
      }
      result.push('<div class="middle">' + content.map(l => convertInlineMarkdown(l)).join('') + '</div>');
      i++;
      continue;
    }
    
    // ::last ブロック
    if (line === '::last') {
      const content = [];
      i++;
      while (i < lines.length && lines[i] !== '::') {
        content.push(lines[i]);
        i++;
      }
      result.push('<div class="last">' + content.map(l => convertInlineMarkdown(l)).join('') + '</div>');
      i++;
      continue;
    }
    
    // 空行
    if (line.trim() === '') {
      i++;
      continue;
    }
    
    // その他の行
    result.push(convertInlineMarkdown(line));
    i++;
  }
  
  return result.join('\n');
}

/**
 * インラインMarkdown記法をHTMLに変換
 * @param {string} text - 変換するテキスト
 * @returns {string} - 変換後のHTML
 */
function convertInlineMarkdown(text) {
  let html = text;
  
  // 1. マーカー（==...==）- 内部の記法も処理
  html = html.replace(/==([^=]+)==/g, (match, content) => {
    let processed = content;
    processed = processed.replace(/\{\{([^\|]+)\|([^\}]+)\}\}/g, '<ruby>$1<rt>$2</rt></ruby>');
    processed = processed.replace(/\[\[([^\|\]]+)\|([^\]]+)\]\]/g, '<span onclick="chg(this)" class="all"><ruby>$1<rt>$2</rt></ruby></span>');
    processed = processed.replace(/\[\[([^\]]+)\]\]/g, '<span onclick="chg(this)" class="all">$1</span>');
    return `<span class="marker">${processed}</span>`;
  });
  
  // 2. 赤文字 - ルビ付き
  html = html.replace(/\*\*\{\{([^\|]+)\|([^\}]+)\}\}\*\*/g, '<font color="#FF0000"><ruby>$1<rt>$2</rt></ruby></font>');
  html = html.replace(/\*\*([^\*]+)\*\*/g, '<font color="#FF0000">$1</font>');
  
  // 3. ルビ（{{term|reading}}）
  html = html.replace(/\{\{([^\|]+)\|([^\}]+)\}\}/g, '<ruby>$1<rt>$2</rt></ruby>');
  
  // 4. クリック用語 - ルビ付き（[[term|reading]]）
  html = html.replace(/\[\[([^\|\]]+)\|([^\]]+)\]\]/g, '<span onclick="chg(this)" class="all"><ruby>$1<rt>$2</rt></ruby></span>');
  
  // 5. クリック用語 - ルビなし（[[term]]）
  html = html.replace(/\[\[([^\]]+)\]\]/g, '<span onclick="chg(this)" class="all">$1</span>');
  
  return html;
}

/**
 * HTMLをカスタムMarkdownに逆変換（既存HTMLファイルの変換用）
 * @param {string} html - 既存のHTML
 * @returns {string} - カスタムMarkdown記法
 */
function htmlToCustomMarkdown(html) {
  // contentsクラス内のコンテンツだけを抽出
  const contentMatch = html.match(/<div id='toc-range' class="contents">([\s\S]*?)(?:<\/div>)?<!-- \/contents -->/);
  if (!contentMatch) {
    console.error('コンテンツが見つかりません');
    return '';
  }
  
  let content = contentMatch[1].trim();
  
  // PHPタグとコメントを削除
  content = content.replace(/<\?php[\s\S]*?\?>/g, '');
  content = content.replace(/<!--[\s\S]*?-->/g, '');

  // PHPタグとコメントを削除
  content = content.replace(/<\?php[\s\S]*?\?>/g, '');
  content = content.replace(/<!--[\s\S]*?-->/g, '');
  
  // 一行ずつパースして変換
  const lines = content.split('\n');
  const result = [];
  let i = 0;
  
  while (i < lines.length) {
    let line = lines[i].trim();
    
    // 空行
    if (!line) {
      i++;
      continue;
    }
    
    // 概要セクション
    if (line.startsWith('<div class="overview">')) {
      result.push('---overview---');
      i++;
      // <div class="title">概要</div>をスキップ
      if (lines[i] && lines[i].includes('<div class="title">概要</div>')) {
        i++;
      }
      // 概要の内容を取得
      while (i < lines.length && !lines[i].includes('</div>')) {
        const overviewLine = lines[i].trim();
        if (overviewLine) {
          result.push(convertHtmlToMarkdownInline(overviewLine));
        }
        i++;
      }
      result.push('---');
      i++; // </div>をスキップ
      continue;
    }
    
    // TOC
    if (line.includes('<div id="toc"></div>')) {
      result.push('<div id="toc"></div>');
      i++;
      continue;
    }
    
    // 見出し
    if (line.startsWith('<h2>')) {
      const text = line.replace(/<\/?h2>/g, '');
      result.push('## ' + convertHtmlToMarkdownInline(text));
      i++;
      continue;
    }
    if (line.startsWith('<h3>')) {
      const text = line.replace(/<\/?h3>/g, '');
      result.push('### ' + convertHtmlToMarkdownInline(text));
      i++;
      continue;
    }
    if (line.startsWith('<h4>')) {
      const text = line.replace(/<\/?h4>/g, '');
      result.push('<h4>' + convertHtmlToMarkdownInline(text) + '</h4>');
      i++;
      continue;
    }
    
    // arrow
    if (line.includes('<div class="arrow"></div>')) {
      result.push('---arrow---');
      i++;
      continue;
    }
    
    // div class="top/middle/last/sup"
    const divMatch = line.match(/<div class="(top|middle|last|sup)">([\s\S]*)/);
    if (divMatch) {
      const type = divMatch[1];
      let content = divMatch[2];
      
      // 同じ行に</div>がある場合
      if (content.includes('</div>')) {
        content = content.replace(/<\/div>.*$/, '');
        const converted = convertDivContent(content);
        result.push(`::${type}`);
        if (converted) result.push(converted);
        result.push('::');
        i++;
        continue;
      }
      
      // 複数行にまたがる場合
      const contentLines = [content];
      i++;
      while (i < lines.length && !lines[i].includes('</div>')) {
        contentLines.push(lines[i]);
        i++;
      }
      // 最後の行（</div>を含む）
      if (i < lines.length) {
        const lastLine = lines[i].replace(/<\/div>.*$/, '');
        if (lastLine.trim()) contentLines.push(lastLine);
      }
      
      result.push(`::${type}`);
      const converted = convertDivContent(contentLines.join('\n'));
      if (converted) result.push(converted);
      result.push('::');
      i++;
      continue;
    }
    
    // gazo
    if (line.startsWith('<div class="gazo">')) {
      i++;
      result.push('::gazo');
      
      // 画像行を取得
      let imgLine = lines[i].trim();
      const imgMatch = imgLine.match(/<img[^>]*?(?:data-)?src="([^"]+)"[^>]*?(?:class="([^"]*)")?[^>]*?\/>/);
      if (imgMatch) {
        const src = imgMatch[1];
        const classes = imgMatch[2] || '';
        const classMatch = classes.match(/\b(border|twice|half)\b/);
        const classAttr = classMatch ? `{.${classMatch[1]}}` : '';
        result.push(`![](${src})${classAttr}`);
      }
      i++;
      
      // キャプションを取得
      while (i < lines.length && !lines[i].includes('</div>')) {
        const capLine = lines[i].trim();
        if (capLine && capLine !== '<br />' && capLine !== '<br>') {
          result.push(convertHtmlToMarkdownInline(capLine));
        }
        i++;
      }
      result.push('::');
      i++;
      continue;
    }
    
    // double
    if (line.startsWith('<div class="double">')) {
      i++;
      result.push('::double');
      
      // topの内容
      if (lines[i] && lines[i].includes('<div class="top">')) {
        i++;
        const topLines = [];
        while (i < lines.length && !lines[i].includes('</div>')) {
          topLines.push(lines[i].trim());
          i++;
        }
        const topText = convertDivContent(topLines.join('\n'));
        if (topText) {
          result.push(topText);
          result.push('');
        }
        i++; // </div>
      }
      
      // 画像
      result.push('---image---');
      if (lines[i] && lines[i].includes('<div class="text-center gazo">')) {
        i++;
        const imgLine = lines[i].trim();
        const imgMatch = imgLine.match(/<img[^>]*?src="([^"]+)"[^>]*?(?:class="([^"]*)")?[^>]*?\/>/);
        if (imgMatch) {
          const src = imgMatch[1];
          const classes = imgMatch[2] || '';
          const classMatch = classes.match(/\b(border|twice|half)\b/);
          const classAttr = classMatch ? `{.${classMatch[1]}}` : '';
          result.push(`![](${src})${classAttr}`);
        }
        i++;
        // </div> for gazo
        if (lines[i] && lines[i].includes('</div>')) i++;
      }
      
      // </div> for double
      if (lines[i] && lines[i].includes('</div>')) i++;
      result.push('::');
      continue;
    }
    
    // ul/li などのHTML要素はそのまま保持
    if (line.startsWith('<ul') || line.startsWith('<li') || line.startsWith('</ul') || line.startsWith('</li')) {
      result.push(line);
      i++;
      continue;
    }
    
    // その他のHTMLタグを含む行
    if (line.includes('<') && line.includes('>')) {
      // そのまま出力（後で手動修正が必要）
      result.push(line);
      i++;
      continue;
    }
    
    // 通常のテキスト
    result.push(convertHtmlToMarkdownInline(line));
    i++;
  }
  
  return result.join('\n');
}

/**
 * div内のコンテンツをMarkdownに変換（leadなどの入れ子に対応）
 */
function convertDivContent(html) {
  let content = html.trim();
  
  // leadを処理
  content = content.replace(/<div class="lead">([\s\S]*?)<\/div>/g, (match, leadContent) => {
    return `:::lead\n${convertHtmlToMarkdownInline(leadContent.trim())}\n:::`;
  });
  
  return convertHtmlToMarkdownInline(content);
}

/**
 * インラインHTMLをMarkdownに変換
 */
function convertHtmlToMarkdownInline(text) {
  let result = text;
  
  // marker
  result = result.replace(/<span class="marker">([\s\S]*?)<\/span>/g, (match, content) => {
    let inner = content;
    inner = inner.replace(/<ruby>\s*([^<]+?)\s*<rt>\s*([^<]+?)\s*<\/rt>\s*<\/ruby>/g, '{{$1|$2}}');
    inner = inner.replace(/<span\s+onclick="chg\(this\)"\s+class="all">\s*<ruby>\s*([^<]+?)\s*<rt>\s*([^<]+?)\s*<\/rt>\s*<\/ruby>\s*<\/span>/g, '[[$1|$2]]');
    inner = inner.replace(/<span\s+onclick="chg\(this\)"\s+class="all">\s*([^<]+?)\s*<\/span>/g, '[[$1]]');
    return `==${inner}==`;
  });
  
  // 赤文字（ruby付き）
  result = result.replace(/<font color="#FF0000">\s*<ruby>\s*([^<]+?)\s*<rt>\s*([^<]+?)\s*<\/rt>\s*<\/ruby>\s*<\/font>/g, '**{{$1|$2}}**');
  
  // 赤文字（通常）
  result = result.replace(/<font color="#FF0000">([^<]+?)<\/font>/g, '**$1**');
  
  // ruby
  result = result.replace(/<ruby>\s*([^<]+?)\s*<rt>\s*([^<]+?)\s*<\/rt>\s*<\/ruby>/g, '{{$1|$2}}');
  
  // クリック用語（ruby付き）
  result = result.replace(/<span\s+onclick="chg\(this\)"\s+class="all">\s*<ruby>\s*([^<]+?)\s*<rt>\s*([^<]+?)\s*<\/rt>\s*<\/ruby>\s*<\/span>/g, '[[$1|$2]]');
  
  // クリック用語（通常）
  result = result.replace(/<span\s+onclick="chg\(this\)"\s+class="all">\s*([^<]+?)\s*<\/span>/g, '[[$1]]');
  
  // 不要なタグ削除
  result = result.replace(/<br\s*\/?>/g, '');
  
  return result.trim();
}

module.exports = {
  parseCustomMarkdown,
  htmlToCustomMarkdown
};

module.exports = {
  parseCustomMarkdown,
  htmlToCustomMarkdown
};
