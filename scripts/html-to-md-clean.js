const fs = require('fs');
const path = require('path');

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
  let inDiv = false;
  let divType = '';
  let divContent = [];
  
  while (i < lines.length) {
    const line = lines[i].trim();
    
    // overview
    if (line.includes('<div class="overview">')) {
      i++;
      if (lines[i].includes('<div class="title">概要</div>')) i++;
      let overviewText = '';
      while (i < lines.length && !lines[i].includes('</div>')) {
        overviewText += lines[i].trim();
        i++;
      }
      result.push('---overview---');
      result.push(overviewText);
      result.push('---');
      i++;
      continue;
    }
    
    // toc
    if (line.includes('<div id="toc"></div>')) {
      i++;
      continue;
    }
    
    // h2
    if (line.startsWith('<h2>')) {
      const text = line.replace(/<\/?h2>/g, '');
      result.push('## ' + text);
      i++;
      continue;
    }
    
    // h3
    if (line.startsWith('<h3>')) {
      const text = line.replace(/<\/?h3>/g, '');
      result.push('### ' + text);
      i++;
      continue;
    }
    
    // h4
    if (line.startsWith('<h4>')) {
      const text = line.replace(/<\/?h4>/g, '');
      result.push('#### ' + text);
      i++;
      continue;
    }
    
    // ul
    if (line.startsWith('<ul')) {
      result.push('');
      i++;
      while (i < lines.length && !lines[i].includes('</ul>')) {
        const liLine = lines[i].trim();
        if (liLine.startsWith('<li>')) {
          let liText = liLine.replace('<li>', '').replace('</li>', '');
          // <div class="lead">を処理
          liText = liText.replace(/<div class="lead">/g, '\n  - ');
          liText = liText.replace(/<\/div>/g, '');
          liText = convertInline(liText);
          result.push('- ' + liText);
        }
        i++;
      }
      result.push('');
      i++;
      continue;
    }
    
    // div blocks (top, middle, last, sup)
    const divMatch = line.match(/<div class="(top|middle|last|sup)">/);
    if (divMatch) {
      divType = divMatch[1];
      let text = '';
      let currentLine = line.replace(/<div class="[^"]*">/, '').trim();
      
      // 同じ行に閉じタグがある場合
      if (currentLine.includes('</div>')) {
        text = currentLine.substring(0, currentLine.lastIndexOf('</div>')).trim();
      } else {
        // 複数行の場合
        if (currentLine) text = currentLine;
        i++;
        while (i < lines.length && !lines[i].trim().startsWith('</div>')) {
          const nextLine = lines[i].trim();
          if (nextLine) {
            text += (text ? '\n' : '') + nextLine;
          }
          i++;
        }
      }
      
      text = convertDivContent(text);
      result.push('::' + divType);
      if (text) result.push(text);
      result.push('::');
      i++;
      continue;
    }
    
    // 単独の</div>は無視
    if (line === '</div>') {
      i++;
      continue;
    }
    
    // gazo
    if (line.includes('<div class="gazo">')) {
      let imageLine = '';
      let caption = '';
      i++;
      
      while (i < lines.length && !lines[i].trim().startsWith('</div>')) {
        const imgLine = lines[i].trim();
        if (imgLine.includes('<img')) {
          const srcMatch = imgLine.match(/data-src="([^"]+)"/);
          if (srcMatch) {
            const imgPath = srcMatch[1];
            let classes = '';
            if (imgLine.includes('class="')) {
              const classMatch = imgLine.match(/class="[^"]*\b(border|twice|half)\b[^"]*"/);
              if (classMatch) {
                classes = '{.' + classMatch[1] + '}';
              }
            }
            imageLine = '![](' + imgPath + ')' + classes;
          }
        } else if (imgLine.includes('<br />')) {
          const parts = imgLine.split('<br />');
          if (parts[1]) caption = parts[1].trim();
        } else if (imgLine && !imgLine.startsWith('<')) {
          caption += imgLine;
        }
        i++;
      }
      
      result.push('::gazo');
      if (imageLine) result.push(imageLine);
      if (caption) result.push(caption);
      result.push('::');
      i++;
      continue;
    }
    
    // double
    if (line.includes('<div class="double">')) {
      let textPart = [];
      let imagePart = '';
      i++;
      
      while (i < lines.length && !lines[i].trim().startsWith('</div>')) {
        const dLine = lines[i].trim();
        if (dLine.includes('<img')) {
          const srcMatch = dLine.match(/data-src="([^"]+)"/);
          if (srcMatch) {
            imagePart = '![](' + srcMatch[1] + ')';
          }
        } else if (dLine && !dLine.includes('<br />') && !dLine.startsWith('<')) {
          textPart.push(convertInline(dLine));
        }
        i++;
      }
      
      result.push('::double');
      if (textPart.length > 0) result.push(textPart.join('\n'));
      result.push('---image---');
      if (imagePart) result.push(imagePart);
      result.push('::');
      i++;
      continue;
    }
    
    // arrow
    if (line.includes('<div class="arrow"></div>')) {
      result.push('');
      i++;
      continue;
    }
    
    // 空行
    if (line === '') {
      i++;
      continue;
    }
    
    // その他のテキスト
    if (line && !line.startsWith('<?php') && !line.startsWith('<!--')) {
      result.push(convertInline(line));
    }
    
    i++;
  }
  
  return result.join('\n');
}

function convertDivContent(html) {
  // <div class="lead">を:::lead:::に変換
  html = html.replace(/<div class="lead">/g, ':::lead\n');
  html = html.replace(/<\/div>/g, '\n:::');
  
  return convertInline(html);
}

function convertInline(text) {
  // HTMLタグを全てカスタムMarkdownに変換
  
  // <span class="marker">...</span> → ==...==
  text = text.replace(/<span class="marker">(.*?)<\/span>/g, '==$1==');
  
  // <font color="#FF0000">...</font> → **...**
  text = text.replace(/<font color="#FF0000">(.*?)<\/font>/g, '**$1**');
  
  // <ruby>...<rt>...</rt></ruby> → {{...|...}}
  text = text.replace(/<ruby>(.*?)<rt>(.*?)<\/rt><\/ruby>/g, '{{$1|$2}}');
  
  // <span onclick="chg(this)" class="all"><ruby>...<rt>...</rt></ruby></span> → [[...|...]]
  text = text.replace(/<span onclick="chg\(this\)" class="all"><ruby>(.*?)<rt>(.*?)<\/rt><\/ruby><\/span>/g, '[[$1|$2]]');
  
  // <span onclick="chg(this)" class="all">...</span> → [[...]]
  text = text.replace(/<span onclick="chg\(this\)" class="all">(.*?)<\/span>/g, '[[$1]]');
  
  return text;
}

// テスト
if (require.main === module) {
  const testFile = 'c:/Users/a186587500/dev/chitonitose-next/origin/chitonitose/jh/jh_lessons2.html';
  const result = convertHtmlToMarkdown(testFile);
  console.log(result);
  
  // ファイルに保存
  fs.writeFileSync('test-output.md', result, 'utf-8');
  console.log('\n✅ test-output.mdに保存しました');
}

module.exports = { convertHtmlToMarkdown };
