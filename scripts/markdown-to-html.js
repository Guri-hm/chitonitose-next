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
    const line = lines[i].trim();
    
    // 概要セクション - スキップ（page.tsxで別途表示）
    if (line === '---overview---') {
      i++;
      while (i < lines.length && lines[i].trim() !== '---') {
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
    if (line.startsWith('#### ')) {
      result.push('<h4>' + convertInlineMarkdown(line.substring(5)) + '</h4>');
      i++;
      continue;
    }
    // 旧形式の<h4>タグをそのまま持つ行（html-to-md.jsの変換残淟対策）
    if (line.startsWith('<h4>') && line.endsWith('</h4>')) {
      const text = line.slice(4, -5);
      result.push('<h4>' + convertInlineMarkdown(text) + '</h4>');
      i++;
      continue;
    }
    
    // 矢印（新旧両対応）
    if (line === '::arrow' || line === '---arrow---') {
      result.push('<div class="arrow"></div>');
      i++;
      continue;
    }
    
    // 空行スペーサー
    if (line === '::blank') {
      result.push('<br />');
      i++;
      continue;
    }

    // ::chart{...} ブロック（DBデータをJSでGoogle Chartsに渡すプレースホルダー）
    // 例: ::chart{type="Pie" dataset="power_generation" filter="nation_cd=578" fields="hydroelectricity:水力,thermal_power:火力" title="ノルウェーの発電構成"}
    if (line.startsWith('::chart{')) {
      const attrsMatch = line.match(/^::chart\{([\s\S]*)\}$/);
      const attrs = {};
      if (attrsMatch) {
        const attrRegex = /(\w+)="([^"]*)"/g;
        let m;
        while ((m = attrRegex.exec(attrsMatch[1])) !== null) {
          attrs[m[1]] = m[2];
        }
      }
      const escapeAttr = (s) => String(s || '').replace(/"/g, '&quot;');
      result.push(
        `<div class="lesson-chart-placeholder" data-chart-type="${escapeAttr(attrs.type)}" ` +
        `data-chart-dataset="${escapeAttr(attrs.dataset)}" data-chart-filter="${escapeAttr(attrs.filter)}" ` +
        `data-chart-fields="${escapeAttr(attrs.fields)}" data-chart-title="${escapeAttr(attrs.title)}"></div>`
      );
      i++;
      // 閉じの「::」があれば読み飛ばす（任意）
      if (i < lines.length && lines[i].trim() === '::') {
        i++;
      }
      continue;
    }
    
    // ::statistics{...} / ::basic-data{...} / ::export-items{...} / ::import-items{...} 等
    // DBデータ（JSON化済み）をもとに表を描画するプレースホルダー
    // 例: ::statistics{id="39" order="desc" limit="5" offset="0"}
    const dbDirectiveMatch = line.match(
      /^::(statistics|statistics-compare|basic-data|export-items|import-items|land-use|city|immigration|industrial-population|port-container|items-each-ports|food-self-sufficiency|total-fertility-rate|aging-society|trade-balance|area-population|continental-altitude|jp-natural-environment|eu|wood-area|urban-population|import-partners)\{([\s\S]*)\}$/
    );
    if (dbDirectiveMatch) {
      const [, kind, attrsStr] = dbDirectiveMatch;
      const attrs = {};
      const attrRegex = /(\w+)="([^"]*)"/g;
      let m;
      while ((m = attrRegex.exec(attrsStr)) !== null) {
        attrs[m[1]] = m[2];
      }
      const escapeAttr = (s) => String(s || '').replace(/"/g, '&quot;');
      // HTML属性名はブラウザ解析時に小文字化されるため、camelCaseもkebab-caseに変換しておく
      const toKebab = (s) => s.replace(/_/g, '-').replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
      const dataAttrs = Object.entries(attrs)
        .map(([k, v]) => `data-${toKebab(k)}="${escapeAttr(v)}"`)
        .join(' ');
      result.push(`<div class="lesson-${kind}-placeholder" ${dataAttrs}></div>`);
      i++;
      if (i < lines.length && lines[i].trim() === '::') {
        i++;
      }
      continue;
    }
    
    // 箱書きリスト（- item、ネストした:::leadも導入）
    if (line.startsWith('- ')) {
      const items = [];
      while (i < lines.length && lines[i].trim().startsWith('- ')) {
        const itemText = lines[i].trim().substring(2).trim();
        i++;
        let leadHtml = '';
        if (i < lines.length && (lines[i].trim() === ':::lead' || lines[i].trim() === '::lead')) {
          i++;
          const leadContent = [];
          while (i < lines.length && lines[i].trim() !== ':::' && lines[i].trim() !== '::' && !lines[i].trim().startsWith('- ')) {
            if (lines[i].trim() !== '') leadContent.push(lines[i].trim());
            i++;
          }
          if (i < lines.length && (lines[i].trim() === ':::' || lines[i].trim() === '::')) {
            i++;
          }
          leadHtml = `<div class="lead">${convertInlineMarkdown(leadContent.join(''))}</div>`;
        }
        items.push(`<li>${convertInlineMarkdown(itemText)}${leadHtml}</li>`);
      }
      result.push('<ul>' + items.join('') + '</ul>');
      continue;
    }
    
    // ::double ブロック
    if (line === '::double') {
      const content = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('---image---')) {
        content.push(lines[i]);
        i++;
      }
      
      // 画像行を解析
      if (i < lines.length && lines[i].trim().startsWith('---image---')) {
        i++;
        const imgMatch = lines[i].trim().match(/!\[([^\]]*)\]\(([^)]+)\)(?:\{\.([^}]+)\})?/);
        if (imgMatch) {
          const [, alt, imgSrc, imgClass] = imgMatch;
          // 画像パスをWebPに変換
          const webpSrc = convertToWebP(imgSrc, subject);
          const classNames = ['lazyload', 'popup-img'];
          if (imgClass) classNames.push(imgClass);
          
          i++;
          const caption = [];
          while (i < lines.length && lines[i].trim() !== '::') {
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
    
    // :::gazo ブロック（新旧両対応）
    if (line === ':::gazo' || line.startsWith(':::gazo{') || line === '::gazo') {
      // サイズ指定を抽出
      const sizeMatch = line.match(/\{size="([^"]+)"\}/);
      const sizeClass = sizeMatch ? sizeMatch[1] : '';
      
      i++;
      const images = [];
      const explanations = [];
      let inExplanation = false;
      
      while (i < lines.length && lines[i].trim() !== ':::' && lines[i].trim() !== '::') {
        const currentLine = lines[i].trim();
        
        // 画像行を検出
        if (currentLine.match(/^!\[/)) {
          images.push(currentLine);
          i++;
          continue;
        }
        
        // 空行はスキップ
        if (currentLine === '') {
          i++;
          continue;
        }
        
        // それ以外は説明文
        explanations.push(currentLine);
        i++;
      }
      
      // 画像HTMLを生成
      const imageHtmls = images.map(imgLine => {
        const imgMatch = imgLine.match(/!\[([^\]]*)\]\(([^)]+)\)/);
        if (imgMatch) {
          const [, alt, imgSrc] = imgMatch;
          const webpSrc = convertToWebP(imgSrc, subject);
          const classNames = ['lazyload', 'popup-img'];
          if (sizeClass) classNames.push(sizeClass);
          return `<img src="${webpSrc}" alt="${alt}" class="${classNames.join(' ')}">`;
        }
        return '';
      }).filter(h => h);
      
      // 説明文HTMLを生成
      const explanationHtmls = explanations.map(exp => {
        return `<div>${convertInlineMarkdown(exp.trim())}</div>`;
      });
      
      // gazo divを出力
      result.push('<div class="gazo">' + imageHtmls.join('') + explanationHtmls.join('') + '</div>');
      i++; // skip closing :::
      continue;
    }
    
    // :::sup ブロック（新形式）
    if (line === ':::sup' || line === '::sup') {
      const content = [];
      i++;
      
      while (i < lines.length && lines[i].trim() !== ':::' && lines[i].trim() !== '::') {
        content.push(lines[i]);
        i++;
      }
      
      // content を1つの文字列に結合
      let contentStr = content.join('\n');
      
      // ネストされた:::lead...を処理（閉じタグは:: / :::とも対応し、閉じ忘れの場合は末尾までを含む）
      contentStr = contentStr.replace(/:{2,3}\s*lead\s*\n([\s\S]*?)(?:\n\s*:{2,3}(?!\S)|$)/g, '<div class="lead">$1</div>');
      
      // インラインMarkdownを変換
      const html = convertInlineMarkdown(contentStr);
      
      result.push('<div class="sup">' + html + '</div>');
      i++; // skip closing :::
      continue;
    }
    
    // :::top ブロック（新形式）
    if (line === ':::top' || line === '::top') {
      const content = [];
      i++;
      while (i < lines.length && lines[i].trim() !== ':::' && lines[i].trim() !== '::') {
        content.push(lines[i]);
        i++;
      }
      
      // ネストされた:::lead...を処理
      let contentStr = content.join('\n');
      contentStr = contentStr.replace(/:{2,3}\s*lead\s*\n([\s\S]*?)(?:\n\s*:{2,3}(?!\S)|$)/g, '<div class="lead">$1</div>');
      
      const html = convertInlineMarkdown(contentStr);
      result.push('<div class="top">' + html + '</div>');
      i++; // skip closing :::
      continue;
    }
    
    // :::middle ブロック（新形式）
    if (line === ':::middle' || line === '::middle') {
      const content = [];
      i++;
      while (i < lines.length && lines[i].trim() !== ':::' && lines[i].trim() !== '::') {
        content.push(lines[i]);
        i++;
      }
      
      // ネストされた:::lead...:::を処理
      let contentStr = content.join('\n');
      contentStr = contentStr.replace(/:{2,3}\s*lead\s*\n([\s\S]*?)(?:\n\s*:{2,3}(?!\S)|$)/g, '<div class="lead">$1</div>');
      
      const html = convertInlineMarkdown(contentStr);
      result.push('<div class="middle">' + html + '</div>');
      i++; // skip closing :::
      continue;
    }
    
    // :::last ブロック（新形式）
    if (line === ':::last' || line === '::last') {
      const content = [];
      i++;
      while (i < lines.length && lines[i].trim() !== ':::' && lines[i].trim() !== '::') {
        content.push(lines[i]);
        i++;
      }
      
      // ネストされた:::lead...:::を処理
      let contentStr = content.join('\n');
      contentStr = contentStr.replace(/:{2,3}\s*lead\s*\n([\s\S]*?)(?:\n\s*:{2,3}(?!\S)|$)/g, '<div class="lead">$1</div>');
      
      const html = convertInlineMarkdown(contentStr);
      result.push('<div class="last">' + html + '</div>');
      i++; // skip closing :::
      continue;
    }
    
    // <ul>...</ul>（旧HTML変換由来の生HTML。中の<li>に:::lead...:::や[[term]]等が
    // 埋め込まれているため、1行ずつではなくブロックとしてまとめて変換する必要がある）
    if (line.startsWith('<ul')) {
      const ulOpenTag = line;
      i++;
      const blockLines = [];
      while (i < lines.length && lines[i].trim() !== '</ul>') {
        blockLines.push(lines[i]);
        i++;
      }
      if (i < lines.length) i++; // </ul>をスキップ
      
      const blockContent = blockLines.join('\n');
      const liRegex = /<li>([\s\S]*?)<\/li>/g;
      let liMatch;
      result.push(ulOpenTag);
      while ((liMatch = liRegex.exec(blockContent)) !== null) {
        let liInner = liMatch[1];
        liInner = liInner.replace(/:{2,3}\s*lead\s*\n([\s\S]*?)(?:\n\s*:{2,3}(?!\S)|$)/g, '<div class="lead">$1</div>');
        result.push('<li>' + convertInlineMarkdown(liInner) + '</li>');
      }
      result.push('</ul>');
      continue;
    }
    
    // 空行
    if (line.trim() === '') {
      i++;
      continue;
    }
    
    // :::単独行（閉じタグ）をスキップ（処理漏れ防止）
    if (line === ':::' || line === '::') {
      i++;
      continue;
    }
    
    // その他の行
    result.push(convertInlineMarkdown(line));
    i++;
  }
  
  return fixLazyloadImages(result.join('\n'), subject);
}

/**
 * gazoディレクティブ等で処理されず素通りしたimgタグ（旧レイジーロード形式）を修正する。
 * data-srcが実画像で、srcは常にloading.svgのプレースホルダーのままになっているため、
 * このままだと画像が一切表示されない。
 */
function fixLazyloadImages(html, subject) {
  return html.replace(/<img\b([^>]*)>/g, (match, attrsStr) => {
    const dataSrcMatch = attrsStr.match(/data-src="([^"]+)"/);
    if (!dataSrcMatch) return match;
    const resolvedSrc = convertToWebP(dataSrcMatch[1].replace(/^img\//, ''), subject);
    const newAttrs = attrsStr
      .replace(/\s*data-src="[^"]*"/, '')
      .replace(/\s*src="[^"]*"/, '')
      .replace(/\blazyload\s*/, '');
    return `<img src="${resolvedSrc}"${newAttrs}>`;
  });
}

/**
 * インラインMarkdown記法をHTMLに変換
 * @param {string} text - 変換するテキスト
 * @returns {string} - 変換後のHTML
 */
function convertInlineMarkdown(text) {
  let html = text;
  
  // 0. 旧変換の残淟で残った、閉じられていない onclick="chg(this)" class="all"> 断片を除去
  // （例: "n onclick=\"chg(this)\" class=\"all\">本文" のように先頭の<spanタグが欠落したまま残るケース）
  html = html.replace(/[A-Za-z]{0,3}\s*onclick="chg\(this\)"\s+class="all">/g, '');
  
  // 1. マーカー（==...==）- 内部の記法も処理
  html = html.replace(/==([^=]+)==/g, (match, content) => {
    let processed = content;
    processed = processed.replace(/\{\{([^\|]+)\|([^\}]+)\}\}/g, '<ruby>$1<rt>$2</rt></ruby>');
    processed = processed.replace(/\[\[([^\|\]]+)\|([^\]]+)\]\]/g, '<span class="all"><ruby>$1<rt>$2</rt></ruby></span>');
    processed = processed.replace(/\[\[([^\]]+)\]\]/g, '<span class="all">$1</span>');
    return `<span class="marker">${processed}</span>`;
  });
  
  // 2. 赤文字 - ルビ付き
  html = html.replace(/\*\*\{\{([^\|]+)\|([^\}]+)\}\}\*\*/g, '<font color="#FF0000"><ruby>$1<rt>$2</rt></ruby></font>');
  html = html.replace(/\*\*([^\*]+)\*\*/g, '<font color="#FF0000">$1</font>');
  
  // 3. ルビ（{{term|reading}}）
  html = html.replace(/\{\{([^\|]+)\|([^\}]+)\}\}/g, '<ruby>$1<rt>$2</rt></ruby>');
  
  // 4. クリック用語 - ルビ付き（[[term|reading]]）- onclick属性削除
  html = html.replace(/\[\[([^\|\]]+)\|([^\]]+)\]\]/g, '<span class="all"><ruby>$1<rt>$2</rt></ruby></span>');
  
  // 5. クリック用語 - ルビなし（[[term]]）- onclick属性削除
  html = html.replace(/\[\[([^\]]+)\]\]/g, '<span class="all">$1</span>');
  
  return html;
}

/**
 * HTMLをカスタムMarkdownに逆変換（既存HTMLファイルの変換用）
 * @param {string} html - 既存のHTML
 * @returns {string} - カスタムMarkdown記法
 */

// <?php ... include('./php/XXX.php'); ?> のXXXと、変換先ディレクティブ名の対応表
const PHP_INCLUDE_DIRECTIVES = {
  statistics: 'statistics',
  statistics_any_name_table: 'statistics',
  basic_data: 'basic-data',
  export_items_lank: 'export-items',
  import_items_lank: 'import-items',
  land_use: 'land-use',
  city: 'city',
  immigration: 'immigration',
  industrial_population_structure: 'industrial-population',
  port_container: 'port-container',
  items_each_ports: 'items-each-ports',
  food_self_sufficiency_rate: 'food-self-sufficiency',
  total_fertility_rate: 'total-fertility-rate',
  aging_society: 'aging-society',
  trade_balance: 'trade-balance',
  area_population: 'area-population',
  continental_altitude: 'continental-altitude',
  jp_natural_environment: 'jp-natural-environment',
  eu: 'eu',
  wood_area: 'wood-area',
  urban_population: 'urban-population',
  import_partners_each_items: 'import-partners',
};

/**
 * PHPコード断片中の "$name = value;" 形式の変数代入を抽出する。
 * value は 数値・文字列リテラル・配列（[1,2] / array(1,2)）・真偽値リテラルに対応。
 * 配列はカンマ区切りの数値文字列に変換する。
 */
function parsePhpVars(phpCode) {
  const vars = {};
  const re = /\$(\w+)\s*=\s*(\[[^\]]*\]|array\([^)]*\)|"[^"]*"|'[^']*'|true|false|-?\d+(?:\.\d+)?)\s*;/g;
  let m;
  while ((m = re.exec(phpCode)) !== null) {
    let val = m[2];
    if (/^["']/.test(val)) {
      val = val.slice(1, -1);
    } else if (/^(\[|array\()/.test(val)) {
      val = (val.match(/-?\d+(?:\.\d+)?/g) || []).join(',');
    }
    vars[m[1]] = val;
  }
  return vars;
}

function htmlToCustomMarkdown(html) {
  // contentsクラス内のコンテンツだけを抽出
  let contentMatch = html.match(/<div id='toc-range' class="contents">([\s\S]*?)(?:<\/div>)?<!-- \/contents -->/);
  // 閉じコメント（<!-- /contents -->）が無い一部ファイル用のフォールバック
  if (!contentMatch) {
    contentMatch = html.match(/<div id='toc-range' class="contents">([\s\S]*?)<!--\s*footer/);
  }
  if (!contentMatch) {
    console.error('コンテンツが見つかりません');
    return '';
  }
  
  let content = contentMatch[1].trim();
  // CRLFを正規化（末尾に\rが残ると</div>除去の正規表現が一致しなくなるため）
  content = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  
  // コメントを削除（PHPタグはループ内でDB連動ディレクティブへの変換を試みてから削除する）
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
    
    // <?php ... include('./php/XXX.php'); ?> 形式のDB連動テーブル/グラフを
    // 対応するディレクティブ（::statistics{...}等）に変換する。それ以外のPHP行は削除する。
    // 開始タグ行に閉じ「?>」が無い（複数行にまたがる）場合は、見つかるまで結合してから処理する。
    if (line.includes('<?php')) {
      let phpBlock = line;
      while (!phpBlock.includes('?>') && i + 1 < lines.length) {
        i++;
        phpBlock += '\n' + lines[i].trim();
      }
      const phpMatch = phpBlock.match(/<\?php([\s\S]*?)\?>/);
      const phpCode = phpMatch ? phpMatch[1] : phpBlock;
      // statistics_nation_table.php は $json = json_encode(['params'=>array(['statistics_id'=>N],...)]) という
      // 特殊な呼び出し形式のため、他とは別に統計IDのリストだけを抜き出して専用ディレクティブに変換する
      if (phpCode.includes("include('./php/statistics_nation_table.php')") || phpCode.includes('include("./php/statistics_nation_table.php")')) {
        const ids = [...phpCode.matchAll(/'statistics_id'\s*=>\s*(\d+)/g)].map((mm) => mm[1]);
        if (ids.length > 0) {
          result.push(`::statistics-compare{ids="${ids.join(',')}"}`);
        }
        i++;
        continue;
      }
      const includeMatch = phpCode.match(/include\(['"]\.\/php\/(\w+)\.php['"]\)/);
      const directiveName = includeMatch ? PHP_INCLUDE_DIRECTIVES[includeMatch[1]] : null;
      if (directiveName) {
        const vars = parsePhpVars(phpCode);
        const attrs = Object.entries(vars)
          .map(([k, v]) => `${k}="${String(v).replace(/"/g, '&quot;')}"`)
          .join(' ');
        result.push(`::${directiveName}{${attrs}}`);
      }
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
    
    // TOC（新サイトでは別コンポーネントで自動生成するため行ごと削除）
    if (line.includes('<div id="toc"></div>')) {
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
      result.push('#### ' + convertHtmlToMarkdownInline(text));
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
    // <div class="gazo">...</div>が一行にまとまっている場合と、複数行にまたがる場合の両方に対応する
    // （一行にまとまっているケースを考慮しないと、次の見出しや段落を誤って読み飛ばしてしまう）
    if (line.startsWith('<div class="gazo">')) {
      let inner = line.slice('<div class="gazo">'.length);
      i++;
      if (inner.includes('</div>')) {
        inner = inner.replace(/<\/div>[\s\S]*$/, '');
      } else {
        while (i < lines.length) {
          const l = lines[i];
          if (l.includes('</div>')) {
            inner += '\n' + l.replace(/<\/div>[\s\S]*$/, '');
            i++;
            break;
          }
          inner += '\n' + l;
          i++;
        }
      }

      result.push('::gazo');

      // 画像タグ全体を取得してから、属性の並び順に依存せずsrc/classを抽出する
      // （1つのgazo divに複数枚の画像が入っているケース（人口ピラミッドの新旧比較など）にも対応）
      const imgTagMatches = [...inner.matchAll(/<img\b[^>]*>/g)];
      let captionSource = inner;
      imgTagMatches.forEach((imgTagMatch) => {
        const imgTag = imgTagMatch[0];
        // data-srcを優先し、無ければsrcを使う（属性の並び順に依存しない）
        const srcMatch = imgTag.match(/data-src="([^"]+)"/) || imgTag.match(/\bsrc="([^"]+)"/);
        const classMatch = imgTag.match(/class="([^"]*)"/);
        if (srcMatch) {
          const src = srcMatch[1].replace(/^img\//, '');
          const classes = classMatch ? classMatch[1] : '';
          const sizeMatch = classes.match(/\b(border|twice|half)\b/);
          const classAttr = sizeMatch ? `{.${sizeMatch[1]}}` : '';
          result.push(`![](${src})${classAttr}`);
        }
      });
      if (imgTagMatches.length > 0) {
        const lastMatch = imgTagMatches[imgTagMatches.length - 1];
        captionSource = inner.slice(lastMatch.index + lastMatch[0].length);
      }

      // キャプションを取得
      captionSource
        .replace(/<br\s*\/?>/g, '\n')
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean)
        .forEach(capLine => result.push(convertHtmlToMarkdownInline(capLine)));

      result.push('::');
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
          const src = imgMatch[1].replace(/^img\//, '');
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
    
    // ul: 開始・終了タグはそのまま保持
    if (line.startsWith('<ul') || line.startsWith('</ul')) {
      result.push(line);
      i++;
      continue;
    }

    // li: クリック用語(onclick)・marker・入れ子のlead等をconvertDivContentで変換してから出力
    // （素通しすると、クリック用語がonclick="chg(this)"のままになりサイト上で機能しなくなるため）
    if (line.startsWith('<li')) {
      let liLines = [line];
      i++;
      while (i < lines.length && !liLines.join('\n').includes('</li>')) {
        liLines.push(lines[i].trim());
        i++;
      }
      const liContent = liLines.join('\n');
      const liMatch = liContent.match(/^<li[^>]*>([\s\S]*)<\/li>\s*$/);
      const inner = liMatch ? liMatch[1] : liContent.replace(/^<li[^>]*>/, '').replace(/<\/li>\s*$/, '');
      result.push('<li>' + convertDivContent(inner) + '</li>');
      continue;
    }
    if (line.startsWith('</li')) {
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
    inner = inner.replace(/<span\s+onclick="chg\(this\)"\s+class="all"[^>]*>\s*<ruby>\s*([^<]+?)\s*<rt>\s*([^<]+?)\s*<\/rt>\s*<\/ruby>\s*<\/span>/g, '[[$1|$2]]');
    inner = inner.replace(/<span\s+onclick="chg\(this\)"\s+class="all"[^>]*>\s*([^<]+?)\s*<\/span>/g, '[[$1]]');
    return `==${inner}==`;
  });
  
  // 赤文字（ruby付き）
  result = result.replace(/<font color="#FF0000">\s*<ruby>\s*([^<]+?)\s*<rt>\s*([^<]+?)\s*<\/rt>\s*<\/ruby>\s*<\/font>/g, '**{{$1|$2}}**');
  
  // 赤文字（通常）
  result = result.replace(/<font color="#FF0000">([^<]+?)<\/font>/g, '**$1**');
  
  // ruby
  result = result.replace(/<ruby>\s*([^<]+?)\s*<rt>\s*([^<]+?)\s*<\/rt>\s*<\/ruby>/g, '{{$1|$2}}');
  
  // クリック用語（ruby付き）
  result = result.replace(/<span\s+onclick="chg\(this\)"\s+class="all"[^>]*>\s*<ruby>\s*([^<]+?)\s*<rt>\s*([^<]+?)\s*<\/rt>\s*<\/ruby>\s*<\/span>/g, '[[$1|$2]]');
  
  // クリック用語（通常）
  result = result.replace(/<span\s+onclick="chg\(this\)"\s+class="all"[^>]*>\s*([^<]+?)\s*<\/span>/g, '[[$1]]');
  
  // 不要なタグ削除
  result = result.replace(/<br\s*\/?>/g, '');
  
  return result.trim();
}

module.exports = {
  parseCustomMarkdown,
  convertInlineMarkdown,
  htmlToCustomMarkdown
};
