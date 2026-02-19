const fs = require('fs');

function convertHtmlToMarkdown(htmlPath) {
  const html = fs.readFileSync(htmlPath, 'utf-8');
  
  // コンテンツ部分を抽出
  const match = html.match(/<div id='toc-range'[^>]*>([\s\S]*?)<\/div><!-- \/contents -->/);
  if (!match) {
    console.error('コンテンツが見つかりません');
    return '';
  }
  
  const lines = match[1].split('\n');
  const result = [];
  let i = 0;
  
  while (i < lines.length) {
    const line = lines[i].trim();
    
    // 空行・PHP・コメント
    if (!line || line.startsWith('<?php') || line.startsWith('<!--')) {
      i++;
      continue;
    }
    
    // overview
    if (line === '<div class="overview">') {
      i++;
      // すべての<div class="title">行をスキップ
      while (i < lines.length && lines[i].includes('<div class="title">')) {
        i++;
      }
      let text = '';
      while (i < lines.length && !lines[i].trim().startsWith('</div>')) {
        text += lines[i].trim();
        i++;
      }
      result.push('---overview---');
      result.push(text);
      result.push('---');
      i++; // </div>
      continue;
    }
    
    // toc
    if (line.includes('<div id="toc"></div>')) {
      i++;
      continue;
    }
    
    // h2
    if (line.startsWith('<h2>')) {
      result.push('## ' + cleanInline(line.replace(/<\/?h2>/g, '')));
      i++;
      continue;
    }
    
    // h3
    if (line.startsWith('<h3>')) {
      result.push('### ' + cleanInline(line.replace(/<\/?h3>/g, '')));
      i++;
      continue;
    }
    
    // h4
    if (line.startsWith('<h4>')) {
      result.push('#### ' + cleanInline(line.replace(/<\/?h4>/g, '')));
      i++;
      continue;
    }
    
    // arrow
    if (line === '<div class="arrow"></div>') {
      result.push('---arrow---');
      i++;
      continue;
    }
    
    // ul
    if (line.startsWith('<ul')) {
      result.push('');
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('</ul>')) {
        let li = lines[i].trim();
        if (li.startsWith('<li>')) {
          // 複数行の<li>を結合
          let fullLi = li;
          while (!fullLi.includes('</li>') && i + 1 < lines.length) {
            i++;
            fullLi += lines[i].trim();
          }
          
          // <li>text<div class="lead">lead text</div></li>
          let content = fullLi.replace(/^<li>/, '').replace(/<\/li>$/, '');
          
          if (content.includes('<div class="lead">')) {
            const idx = content.indexOf('<div class="lead">');
            const mainText = content.substring(0, idx);
            const leadStart = idx + '<div class="lead">'.length;
            const leadEnd = content.indexOf('</div>', leadStart);
            const leadText = content.substring(leadStart, leadEnd);
            
            result.push('- ' + cleanInline(mainText));
            result.push('  :::lead');
            result.push('  ' + cleanInline(leadText));
            result.push('  :::');
          } else {
            result.push('- ' + cleanInline(content));
          }
        }
        i++;
      }
      result.push('');
      i++; // </ul>
      continue;
    }
    
    // gazo
    if (line.startsWith('<div class="gazo">')) {
      i++;
      let img = '';
      let caption = '';
      
      while (i < lines.length) {
        const g = lines[i].trim();
        if (g.startsWith('</div>') || g.endsWith('</div>')) {
          if (g !== '</div>') {
            const text = g.replace('</div>', '').trim();
            if (!text.includes('<')) caption += text;
          }
          break;
        }
        
        if (g.includes('<img')) {
          const src = g.match(/data-src="([^"]+)"/);
          if (src) {
            let cls = '';
            if (g.includes('twice')) cls = '{.twice}';
            else if (g.includes('half')) cls = '{.half}';
            else if (g.includes('border')) cls = '{.border}';
            img = '![](' + src[1] + ')' + cls;
          }
          
          if (g.includes('<br />')) {
            const parts = g.split('<br />');
            if (parts[1]) {
              caption = parts[1].replace('</div>', '').trim();
            }
          }
        }
        i++;
      }
      
      result.push(':::gazo');
      if (img) result.push(img);
      if (caption) result.push(caption);
      result.push(':::');
      i++;
      continue;
    }
    
    // double
    if (line.startsWith('<div class="double">')) {
      i++;
      let textLines = [];
      let img = '';
      
      while (i < lines.length && !lines[i].trim().startsWith('</div>')) {
        const d = lines[i].trim();
        
        if (d.includes('<img')) {
          const src = d.match(/data-src="([^"]+)"/);
          if (src) img = '![](' + src[1] + ')';
        } else if (d && !d.includes('<br />') && !d.startsWith('<div class="text-center')) {
          textLines.push(cleanInline(d));
        }
        i++;
      }
      
      result.push(':::double');
      if (textLines.length > 0) result.push(textLines.join('\n'));
      result.push('---image---');
      if (img) result.push(img);
      result.push(':::');
      i++; // </div>
      continue;
    }
    
    // div class="top|middle|last|sup"
    if (line.match(/^<div class="(top|middle|last|sup)">/)) {
      const type = line.match(/class="(\w+)"/)[1];
      let content = line.replace(/^<div class="\w+">/, '');
      
      // 同じ行に</div>
      if (content.endsWith('</div>')) {
        // 入れ子<div class="lead">がある場合、末尾の</div>は内側のleadタグのもの
        // なのでcontentをそのままprocessLeadDivに渡し、次行の</div>を消費する
        if (content.includes('<div class="lead">')) {
          // 内側のleadタグ含むケース: contentの末尾</div>はleadの閉じタグ
          result.push(':::' + type);
          result.push(processLeadDiv(content));
          result.push(':::');
          i++;
          // 次行が</div>（外側の閉じタグ）なら消費する
          if (i < lines.length && lines[i].trim() === '</div>') {
            i++;
          }
          continue;
        }
        content = content.slice(0, content.lastIndexOf('</div>'));
        result.push(':::' + type);
        result.push(processLeadDiv(content));
        result.push(':::');
        i++;
        continue;
      }
      
      // 複数行 - すべて結合
      i++;
      let allLines = [content];
      while (i < lines.length) {
        const next = lines[i];
        if (next.trim() === '</div>' || next.trim().endsWith('</div>')) {
          if (next.trim() !== '</div>') {
            allLines.push(next.trim().replace('</div>', ''));
          }
          break;
        }
        allLines.push(next);
        i++;
      }
      
      // 結合して処理
      const fullText = allLines.join('');
      result.push(':::' + type);
      result.push(processLeadDiv(fullText));
      result.push(':::');
      i++;
      continue;
    }
    
    // 閉じタグだけの行
    if (line === '</div>') {
      i++;
      continue;
    }
    
    // その他
    i++;
  }
  
  return result.join('\n');
}

function processLeadDiv(text) {
  // <div class="lead">がない場合
  if (!text.includes('<div class="lead">')) {
    return cleanInline(text);
  }
  
  // <div class="lead">...</div>の位置を特定
  const leadStart = text.indexOf('<div class="lead">');
  const leadContentStart = leadStart + '<div class="lead">'.length;
  const leadEnd = text.indexOf('</div>', leadContentStart);
  
  // 3つの部分に分割
  const beforeHTML = text.substring(0, leadStart);
  const leadHTML = text.substring(leadContentStart, leadEnd);
  const afterHTML = text.substring(leadEnd + '</div>'.length);
  
  // それぞれインライン変換
  let parts = [];
  const beforeClean = cleanInline(beforeHTML).trim();
  const leadClean = cleanInline(leadHTML).trim();
  const afterClean = cleanInline(afterHTML).trim();
  
  if (beforeClean) parts.push(beforeClean);
  if (leadClean) {
    parts.push(':::lead');
    parts.push(leadClean);
    parts.push(':::');
  }
  if (afterClean) parts.push(afterClean);
  
  return parts.join('\n');
}

function cleanInline(text) {
  if (!text) return '';
  
  let result = text;
  
  // タブ・改行・余計なスペースを削除
  result = result.replace(/\t/g, '').replace(/\n/g, '').replace(/\s+/g, ' ');
  
  // <span onclick="chg(this)" class="all"><ruby>X<rt>Y</rt></ruby></span> → [[X|Y]]
  result = result.replace(/<span onclick="chg\(this\)" class="all"><ruby>(.+?)<rt>(.+?)<\/rt><\/ruby><\/span>/g, '[[$1|$2]]');
  
  // <span onclick="chg(this)" class="all">X</span> → [[X]]
  result = result.replace(/<span onclick="chg\(this\)" class="all">(.+?)<\/span>/g, '[[$1]]');
  
  // <ruby>X<rt>Y</rt></ruby> → {{X|Y}}
  result = result.replace(/<ruby>(.+?)<rt>(.+?)<\/rt><\/ruby>/g, '{{$1|$2}}');
  
  // <span class="marker">X</span> → ==X==
  result = result.replace(/<span class="marker">(.+?)<\/span>/g, '==$1==');
  
  // <font color="#FF0000">X</font> → **X**
  result = result.replace(/<font color="#FF0000">(.+?)<\/font>/g, '**$1**');
  
  // 全てのHTMLタグを削除（<div class="lead">含む）
  result = result.replace(/<[^>]+>/g, '');
  
  return result.trim();
}

// 実行
if (require.main === module) {
  const file = process.argv[2] || 'c:/Users/a186587500/dev/chitonitose-next/origin/chitonitose/jh/jh_lessons1.html';
  const output = convertHtmlToMarkdown(file);
  
  const outFile = 'test-clean.md';
  fs.writeFileSync(outFile, output, 'utf-8');
  console.log('✅ ' + outFile + ' に保存');
  console.log('\n--- 先頭部分 ---');
  console.log(output.split('\n').slice(0, 60).join('\n'));
}

module.exports = { convertHtmlToMarkdown };
