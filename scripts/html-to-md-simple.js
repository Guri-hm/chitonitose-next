const fs = require('fs');

/**
 * HTMLを一行ずつ読んでMarkdownに変換
 */
function convertHtmlToMarkdown(htmlPath) {
  const html = fs.readFileSync(htmlPath, 'utf-8');
  
  // コンテンツ部分だけを抽出
  const contentMatch = html.match(/<div id='toc-range' class="contents">([\s\S]*?)(?:<\/div>)?<!-- \/contents -->/);
  if (!contentMatch) {
    console.error('コンテンツが見つかりません:', htmlPath);
    return '';
  }
  
  const content = contentMatch[1];
  const lines = content.split('\n');
  const result = [];
  
  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();
    
    // 空行
    if (!line) {
      i++;
      continue;
    }
    
    // PHPタグ・コメント
    if (line.startsWith('<?php') || line.startsWith('<!--')) {
      i++;
      continue;
    }
    
    // 概要セクション開始
    if (line.includes('<div class="overview">')) {
      result.push('---overview---');
      i++;
      // titleをスキップ
      if (lines[i] && lines[i].includes('<div class="title">概要</div>')) {
        i++;
      }
      // 概要本文
      while (i < lines.length && !lines[i].includes('</div>')) {
        const text = lines[i].trim();
        if (text) {
          result.push(convertInline(text));
        }
        i++;
      }
      result.push('---');
      i++; // </div>
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
      result.push('## ' + convertInline(line.replace(/<\/?h2>/g, '')));
      i++;
      continue;
    }
    if (line.startsWith('<h3>')) {
      result.push('### ' + convertInline(line.replace(/<\/?h3>/g, '')));
      i++;
      continue;
    }
    if (line.startsWith('<h4>')) {
      result.push('<h4>' + convertInline(line.replace(/<\/?h4>/g, '')) + '</h4>');
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
    const divMatch = line.match(/<div class="(top|middle|last|sup)">(.*)/);
    if (divMatch) {
      const type = divMatch[1];
      let content = divMatch[2];
      
      result.push(`::${type}`);
      
      // 同じ行に</div>がある
      if (content.includes('</div>')) {
        content = content.replace(/<\/div>.*$/, '');
        const converted = convertDivContent(content);
        if (converted) result.push(converted);
        result.push('::');
        i++;
        continue;
      }
      
      // 複数行
      const contentLines = [];
      if (content) contentLines.push(content);
      i++;
      
      while (i < lines.length && !lines[i].includes('</div>')) {
        contentLines.push(lines[i].trim());
        i++;
      }
      
      // 最後の行
      if (i < lines.length) {
        const lastLine = lines[i].replace(/<\/div>.*$/, '').trim();
        if (lastLine) contentLines.push(lastLine);
      }
      
      const converted = convertDivContent(contentLines.join('\n'));
      if (converted) result.push(converted);
      result.push('::');
      i++;
      continue;
    }
    
    // gazo
    if (line.includes('<div class="gazo">')) {
      result.push('::gazo');
      i++;
      
      // 画像行
      const imgLine = lines[i];
      const imgMatch = imgLine.match(/<img[^>]*?(?:data-)?src="([^"]+)"[^>]*?(?:class="([^"]*)")?/);
      if (imgMatch) {
        const src = imgMatch[1];
        const classes = imgMatch[2] || '';
        let classAttr = '';
        if (classes.includes('border')) classAttr = '{.border}';
        else if (classes.includes('twice')) classAttr = '{.twice}';
        else if (classes.includes('half')) classAttr = '{.half}';
        result.push(`![](${src})${classAttr}`);
      }
      i++;
      
      // キャプション
      while (i < lines.length && !lines[i].includes('</div>')) {
        const cap = lines[i].trim();
        if (cap && cap !== '<br />' && cap !== '<br>' && !cap.startsWith('<img')) {
          result.push(convertInline(cap));
        }
        i++;
      }
      result.push('::');
      i++;
      continue;
    }
    
    // double
    if (line.includes('<div class="double">')) {
      result.push('::double');
      i++;
      
      // top部分
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
      
      // 画像部分
      result.push('---image---');
      if (lines[i] && lines[i].includes('<div class="text-center gazo">')) {
        i++;
        const imgLine = lines[i];
        const imgMatch = imgLine.match(/<img[^>]*?src="([^"]+)"[^>]*?(?:class="([^"]*)")?/);
        if (imgMatch) {
          const src = imgMatch[1];
          const classes = imgMatch[2] || '';
          let classAttr = '';
          if (classes.includes('twice')) classAttr = '{.twice}';
          else if (classes.includes('half')) classAttr = '{.half}';
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
    
    // ul/li などはそのまま（ただし内部のHTMLを変換）
    if (line.startsWith('<ul') || line.startsWith('</ul')) {
      result.push(line);
      i++;
      continue;
    }
    if (line.startsWith('<li')) {
      result.push(convertInline(line));
      i++;
      continue;
    }
    
    // その他はそのまま出力
    result.push(line);
    i++;
  }
  
  return result.join('\n');
}

/**
 * div内のコンテンツを変換（leadを処理）
 */
function convertDivContent(html) {
  let text = html.trim();
  
  // <div class="lead">...</div>を:::lead...:::に変換
  text = text.replace(/<div class="lead">([\s\S]*?)<\/div>/g, (match, content) => {
    return `:::lead\n${convertInline(content.trim())}\n:::`;
  });
  
  return convertInline(text);
}

/**
 * インラインHTMLをMarkdownに変換
 */
function convertInline(text) {
  let result = text;
  
  // lead（ネストされている場合も処理）
  result = result.replace(/<div class="lead">([\s\S]*?)<\/div>/g, (match, content) => {
    return `<div class="lead">${convertInlineRecursive(content.trim())}</div>`;
  });
  
  result = convertInlineRecursive(result);
  
  return result.trim();
}

/**
 * 再帰的にインライン変換
 */
function convertInlineRecursive(text) {
  let result = text;
  
  // marker
  result = result.replace(/<span class="marker">([\s\S]*?)<\/span>/g, (match, content) => {
    return `==${convertInlineRecursive(content)}==`;
  });
  
  // 赤文字（ruby付き）
  result = result.replace(/<font color="#FF0000">\s*<ruby>\s*([^<]+?)\s*<rt>\s*([^<]+?)\s*<\/rt>\s*<\/ruby>\s*<\/font>/g, '**{{$1|$2}}**');
  
  // 赤文字
  result = result.replace(/<font color="#FF0000">([^<]+?)<\/font>/g, '**$1**');
  
  // ruby
  result = result.replace(/<ruby>\s*([^<]+?)\s*<rt>\s*([^<]+?)\s*<\/rt>\s*<\/ruby>/g, '{{$1|$2}}');
  
  // クリック用語（ruby付き）
  result = result.replace(/<span\s+onclick="chg\(this\)"\s+class="all">\s*<ruby>\s*([^<]+?)\s*<rt>\s*([^<]+?)\s*<\/rt>\s*<\/ruby>\s*<\/span>/g, '[[$1|$2]]');
  
  // クリック用語
  result = result.replace(/<span\s+onclick="chg\(this\)"\s+class="all">\s*([^<]+?)\s*<\/span>/g, '[[$1]]');
  
  // br削除
  result = result.replace(/<br\s*\/?>/g, '');
  
  // タブ削除
  result = result.replace(/\t+/g, '');
  
  return result.trim();
}

// テスト実行
if (require.main === module) {
  const testFile = 'origin/chitonitose/jh/jh_lessons2.html';
  const result = convertHtmlToMarkdown(testFile);
  fs.writeFileSync('content/jh/lessons/2.md', result, 'utf-8');
  console.log('変換完了: 2.md');
  
  // 検証
  const md = fs.readFileSync('content/jh/lessons/2.md', 'utf-8');
  console.log('\n=== 検証 ===');
  console.log('Has <div class=:', md.includes('<div class='));
  console.log('Has </div> (except toc):', md.split('\n').filter(l => l.includes('</div>') && !l.includes('<div id="toc">')).length);
  console.log('Has <span class="marker":', md.includes('<span class="marker"'));
  console.log('Has ::top:', md.includes('::top'));
  console.log('Has ::middle:', md.includes('::middle'));
  console.log('Has ::last:', md.includes('::last'));
}

module.exports = { convertHtmlToMarkdown };
