const fs = require('fs');

function convertHtmlToMarkdown(htmlPath) {
  const html = fs.readFileSync(htmlPath, 'utf-8');
  
  // <div id='toc-range'>から</div><!-- /contents -->までを抽出
  const match = html.match(/<div id='toc-range'[^>]*>([\s\S]*?)<\/div><!-- \/contents -->/);
  if (!match) {
    console.error('コンテンツが見つかりません:', htmlPath);
    return '';
  }
  
  const content = match[1];
  const lines = content.split('\n');
  
  let result = [];
  let i = 0;
  
  while (i < lines.length) {
    let line = lines[i].trim();
    
    // PHPやコメントは無視
    if (line.startsWith('<?php') || line.startsWith('<!--') || line === '') {
      i++;
      continue;
    }
    
    // overview
    if (line.includes('<div class="overview">')) {
      i++;
      if (lines[i].includes('<div class="title">概要</div>')) i++;
      let overviewText = '';
      while (i < lines.length && !lines[i].trim().startsWith('</div>')) {
        overviewText += lines[i].trim();
        i++;
      }
      result.push('---overview---');
      result.push(overviewText);
      result.push('---');
      i++;
      continue;
    }
    
    // <div id="toc"></div> は無視
    if (line.match(/<div id="toc"><\/div>/)) {
      i++;
      continue;
    }
    
    // <h2>
    if (line.match(/^<h2>/)) {
      result.push('## ' + line.replace(/<\/?h2>/g, ''));
      i++;
      continue;
    }
    
    // <h3>
    if (line.match(/^<h3>/)) {
      result.push('### ' + line.replace(/<\/?h3>/g, ''));
      i++;
      continue;
    }
    
    // <h4>
    if (line.match(/^<h4>/)) {
      result.push('#### ' + line.replace(/<\/?h4>/g, ''));
      i++;
      continue;
    }
    
    // <ul>
    if (line.match(/^<ul/)) {
      result.push('');
      i++;
      while (i < lines.length) {
        const liLine = lines[i].trim();
        if (liLine.startsWith('</ul>')) {
          i++;
          break;
        }
        if (liLine.startsWith('<li>')) {
          // <li>content<div class="lead">text</div></li>
          let liContent = liLine.replace(/^<li>/, '').replace(/<\/li>$/, '');
          
          // <div class="lead">を:::lead:::に変換
          if (liContent.includes('<div class="lead">')) {
            const parts = liContent.split('<div class="lead">');
            const mainText = convertInline(parts[0]);
            const leadText = parts[1].replace('</div>', '');
            result.push('- ' + mainText);
            result.push('  :::lead');
            result.push('  ' + convertInline(leadText));
            result.push('  :::');
          } else {
            liContent = convertInline(liContent);
            result.push('- ' + liContent);
          }
        }
        i++;
      }
      result.push('');
      continue;
    }
    
    // <div class="arrow"></div>
    if (line.match(/<div class="arrow"><\/div>/)) {
      result.push('');
      i++;
      continue;
    }
    
    // <div class="gazo">
    if (line.match(/<div class="gazo">/)) {
      i++;
      let imageLine = '';
      let caption = '';
      
      while (i < lines.length) {
        const imgLine = lines[i].trim();
        if (imgLine.startsWith('</div>') || imgLine.endsWith('</div>')) {
          // </div>の前にキャプションがあるかチェック
          if (imgLine !== '</div>') {
            const text = imgLine.substring(0, imgLine.lastIndexOf('</div>')).trim();
            if (text && !text.includes('<img') && !text.includes('<br />')) {
              caption += text;
            }
          }
          i++;
          break;
        }
        
        if (imgLine.includes('<img')) {
          const srcMatch = imgLine.match(/data-src="([^"]+)"/);
          if (srcMatch) {
            let classes = '';
            if (imgLine.match(/class="[^"]*\b(border|twice|half)\b[^"]*"/)) {
              const classMatch = imgLine.match(/\b(border|twice|half)\b/);
              if (classMatch) classes = '{.' + classMatch[1] + '}';
            }
            imageLine = '![](' + srcMatch[1] + ')' + classes;
          }
          
          if (imgLine.includes('<br />')) {
            const parts = imgLine.split('<br />');
            if (parts[1]) {
              let cap = parts[1].trim();
              cap = cap.replace(/<\/div>$/, '').trim();
              caption = cap;
            }
          }
        }
        i++;
      }
      
      result.push('::gazo');
      if (imageLine) result.push(imageLine);
      if (caption) result.push(caption);
      result.push('::');
      continue;
    }
    
    // <div class="double">
    if (line.match(/<div class="double">/)) {
      i++;
      let textPart = [];
      let imageLine = '';
      
      while (i < lines.length) {
        const dLine = lines[i].trim();
        if (dLine.startsWith('</div>')) {
          i++;
          break;
        }
        
        if (dLine.includes('<img')) {
          const srcMatch = dLine.match(/data-src="([^"]+)"/);
          if (srcMatch) imageLine = '![](' + srcMatch[1] + ')';
        } else if (dLine && !dLine.includes('<br />')) {
          textPart.push(convertInline(dLine));
        }
        i++;
      }
      
      result.push('::double');
      if (textPart.length > 0) result.push(textPart.join('\n'));
      result.push('---image---');
      if (imageLine) result.push(imageLine);
      result.push('::');
      continue;
    }
    
    // <div class="top|middle|last|sup">
    const divMatch = line.match(/^<div class="(top|middle|last|sup)">/);
    if (divMatch) {
      const divType = divMatch[1];
      let content = line.replace(/^<div class="[^"]*">/, '');
      
      // 同じ行に</div>がある
      if (content.includes('</div>')) {
        content = content.substring(0, content.lastIndexOf('</div>')).trim();
        content = convertDivContent(content);
        result.push('::' + divType);
        if (content) result.push(content);
        result.push('::');
        i++;
        continue;
      }
      
      // 複数行
      i++;
      let fullContent = content ? [content] : [];
      while (i < lines.length) {
        const nextLine = lines[i].trim();
        // </div>で終わる、または</div>のみの行
        if (nextLine.endsWith('</div>') || nextLine === '</div>') {
          if (nextLine !== '</div>') {
            const text = nextLine.substring(0, nextLine.lastIndexOf('</div>')).trim();
            if (text) fullContent.push(text);
          }
          i++;
          break;
        }
        if (nextLine) fullContent.push(nextLine);
        i++;
      }
      
      content = fullContent.join('\n');
      content = convertDivContent(content);
      result.push('::' + divType);
      if (content) result.push(content);
      result.push('::');
      continue;
    }
    
    // 単独の</div>は無視
    if (line === '</div>') {
      i++;
      continue;
    }
    
    // その他のHTMLタグで始まる行は無視（未処理のタグ）
    if (line.startsWith('<')) {
      console.warn('未処理のHTMLタグ:', line.substring(0, 50));
      i++;
      continue;
    }
    
    // その他の行（テキストなど）
    if (line) {
      result.push(convertInline(line));
    }
    
    i++;
  }
  
  return result.join('\n');
}

function convertDivContent(html) {
  // <div class="lead">...</div> を :::lead\n...\n::: に変換
  let result = html;
  
  // <div class="lead">を処理
  while (result.includes('<div class="lead">')) {
    const startIdx = result.indexOf('<div class="lead">');
    const endIdx = result.indexOf('</div>', startIdx);
    if (endIdx === -1) break;
    
    const before = result.substring(0, startIdx);
    const content = result.substring(startIdx + '<div class="lead">'.length, endIdx);
    const after = result.substring(endIdx + '</div>'.length);
    
    result = before + ':::lead\n' + convertInline(content) + '\n:::' + after;
  }
  
  return convertInline(result);
}

function convertInline(text) {
  // インライン要素を変換
  
  // <span class="marker">...</span> → ==...==
  text = text.replace(/<span class="marker">(.*?)<\/span>/g, '==$1==');
  
  // <font color="#FF0000">...</font> → **...**
  text = text.replace(/<font color="#FF0000">(.*?)<\/font>/g, '**$1**');
  
  // <span onclick="chg(this)" class="all"><ruby>...<rt>...</rt></ruby></span> → [[...|...]]
  text = text.replace(/<span onclick="chg\(this\)" class="all"><ruby>(.*?)<rt>(.*?)<\/rt><\/ruby><\/span>/g, '[[$1|$2]]');
  
  // <span onclick="chg(this)" class="all">...</span> → [[...]]
  text = text.replace(/<span onclick="chg\(this\)" class="all">(.*?)<\/span>/g, '[[$1]]');
  
  // <ruby>...<rt>...</rt></ruby> → {{...|...}}
  text = text.replace(/<ruby>(.*?)<rt>(.*?)<\/rt><\/ruby>/g, '{{$1|$2}}');
  
  // 残っている全てのHTMLタグを削除
  text = text.replace(/<[^>]+>/g, '');
  
  return text;
}

// テスト実行
if (require.main === module) {
  const testFile = 'c:/Users/a186587500/dev/chitonitose-next/origin/chitonitose/jh/jh_lessons2.html';
  const result = convertHtmlToMarkdown(testFile);
  
  fs.writeFileSync('test-output.md', result, 'utf-8');
  console.log('✅ test-output.mdに保存しました\n');
  console.log('=== 出力の先頭50行 ===');
  console.log(result.split('\n').slice(0, 50).join('\n'));
}

module.exports = { convertHtmlToMarkdown };
