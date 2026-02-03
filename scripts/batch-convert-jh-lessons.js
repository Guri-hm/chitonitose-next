/**
 * バッチ変換スクリプト: jh_lessons*.html → content/jh/lessons/*.md
 * MDX_SYNTAX_RULES.mdのルールに従って変換し、エラーチェックも実行
 * 
 * テーブル変換ルール:
 * - 基本テーブル: Markdownテーブル形式に変換
 * - rowspan/colspan検出時: HTMLテーブルをそのまま保持
 * - 空セルで始まる行: 2次元テーブルとして「項目」列を追加
 * - セル内の改行・余分な空白: 自動削除（連続空白を1つに圧縮）
 * - 1行目をヘッダーとして使用（<th>タグがなくても）
 */

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// ルールチェッカー
class MDXRuleChecker {
  constructor() {
    this.errors = [];
    this.warnings = [];
  }
  
  check(mdxContent) {
    this.errors = [];
    this.warnings = [];
    
    // 1. ディレクティブの閉じタグチェック
    const lines = mdxContent.split('\n');
    let directiveStack = [];
    lines.forEach((line, i) => {
      if (line.match(/^:::(?!::)\w/)) {
        directiveStack.push({ line: i + 1, directive: line });
      } else if (line === ':::') {
        if (directiveStack.length === 0) {
          this.errors.push(`${i + 1}行目: 対応する開始ディレクティブがない閉じタグ`);
        } else {
          const popped = directiveStack.pop();
          // leadの閉じタグは外側のディレクティブ（sup/top/last/middle）も一緒に閉じる
          if (popped.directive.startsWith(':::lead') && directiveStack.length > 0) {
            const outer = directiveStack[directiveStack.length - 1];
            if (outer.directive.match(/^:::(sup|top|last|middle)/)) {
              directiveStack.pop(); // 外側も閉じる
            }
          }
          // explanationの閉じタグはgazoも一緒に閉じる
          if (popped.directive.startsWith(':::explanation') && directiveStack.length > 0) {
            const outer = directiveStack[directiveStack.length - 1];
            if (outer.directive.startsWith(':::gazo')) {
              directiveStack.pop(); // gazoも閉じる
            }
          }
        }
      }
    });
    if (directiveStack.length > 0) {
      this.errors.push(`未閉じディレクティブ: ${directiveStack.map(s => `${s.line}行目`).join(', ')}`);
    }
    
    // 2. {.class}構文の禁止チェック
    const classMatch = mdxContent.match(/\{\.[\w-]+\}/g);
    if (classMatch) {
      this.errors.push(`禁止された{.class}構文: ${classMatch.join(', ')}`);
    }
    
    // 3. alt属性に説明が入っていないかチェック
    const altMatch = mdxContent.match(/!\[([^\]]+)\]\(/g);
    if (altMatch) {
      this.warnings.push(`画像のalt属性に説明: ${altMatch.join(', ')} (空にすべき)`);
    }
    
    // 4. <br>タグの禁止チェック
    if (mdxContent.includes('<br')) {
      this.errors.push('<br>タグが使用されています（禁止）');
    }
    
    // 5. インラインstyleの禁止チェック
    if (mdxContent.match(/style\s*=\s*["'][^"']*["']/)) {
      this.errors.push('インラインstyleが使用されています（禁止）');
    }
    
    // 6. HTMLタグの直接使用チェック（ruby以外）
    // 例外: リスト内の<div class="last">、<div class="middle">、<div class="top">は許可
    const htmlTags = mdxContent.match(/<(div|span)[^>]*class/g);
    if (htmlTags) {
      // <div class="last">などが含まれているか確認（完全なタグ形式で検索）
      const hasContinuationDiv = mdxContent.match(/<div class="(last|middle|top)"/);
      
      const invalidTags = htmlTags.filter(tag => {
        // 許可されたdivタグかチェック（MDX内の完全な文脈で）
        const tagStart = mdxContent.indexOf(tag);
        const fullTag = mdxContent.substring(tagStart, tagStart + 30); // タグの最初の30文字
        return !fullTag.match(/^<div class="(last|middle|top)"/);
      });
      
      if (invalidTags.length > 0) {
        this.errors.push(`HTMLタグの直接使用（ディレクティブを使うべき）: ${invalidTags.join(', ')}`);
      }
    }
    
    // 7. <p>:::</p>を生成する可能性のあるパターンをチェック
    // 問題: :::が単独行ではなく、前後にテキストや空白がある場合
    lines.forEach((line, i) => {
      const trimmed = line.trim();
      
      // :::の前後に余分な文字がある場合
      if (trimmed.includes(':::') && trimmed !== ':::' && !trimmed.match(/^:::[\w-]+/)) {
        this.errors.push(`${i + 1}行目: :::の前後に余分な文字: "${line}"`);
      }
      
      // 空行の後に:::がある場合（段落として解釈される可能性）
      if (i > 0 && lines[i - 1].trim() === '' && trimmed === ':::') {
        // これは正常なケースもあるので警告のみ
        if (i > 1 && !lines[i - 2].match(/^:::/)) {
          this.warnings.push(`${i + 1}行目: 空行の後に:::閉じタグ（<p>:::</p>になる可能性）`);
        }
      }
    });
    
    return {
      hasErrors: this.errors.length > 0,
      hasWarnings: this.warnings.length > 0,
      errors: this.errors,
      warnings: this.warnings,
    };
  }
}

// HTML→MDX変換器
class HtmlToMdxConverter {
  constructor(htmlContent) {
    this.$ = cheerio.load(htmlContent, { decodeEntities: false });
    this.mdx = '';
  }
  
  convert(title = 'タイトル未設定') {
    // 概要を抽出
    const overview = this.$('.overview').text().replace(/概要\s*/,'').trim();
    
    // メインコンテンツを処理
    const $toc = this.$('#toc-range');
    const $contentsWrapper = $toc.find('.contents');
    
    let body = '';
    
    if ($contentsWrapper.length > 0) {
      // .contentsがラッパーの場合、その中身を処理
      const children = $contentsWrapper.children().toArray();
      
      for (let i = 0; i < children.length; i++) {
        const $el = this.$(children[i]);
        const id = $el.attr('id');
        
        // 目次とPHPは除外
        if (id === 'toc') continue;
        if ($el.html()?.includes('<?php')) continue;
        
        // explanationは前の要素（gazo）で処理済みの場合はスキップ
        if ($el.hasClass('explanation')) {
          // 前の要素がgazoの場合、既にconvertGazoで処理済みなのでスキップ
          if (i > 0 && this.$(children[i - 1]).hasClass('gazo')) {
            continue; // スキップ
          }
          // 前の要素がgazoでない場合は独立したexplanationとして処理
          const content = this.convertInnerHTML($el);
          if (content) {
            body += content + '\n\n';
          }
          continue;
        }
        
        const converted = this.convertElement($el, i < children.length - 1 ? this.$(children[i + 1]) : null);
        if (converted) {
          body += converted + '\n\n';
        }
      }
    } else {
      // .contentsがない場合は直接処理
      const children = $toc.children().toArray();
      
      for (let i = 0; i < children.length; i++) {
        const $el = this.$(children[i]);
        const id = $el.attr('id');
        const className = $el.attr('class') || '';
        
        // 除外対象
        if (id === 'toc') continue;
        if (className === 'overview') continue;
        if ($el.html()?.includes('<?php')) continue;
        
        // explanationは前の要素（gazo）で処理済みの場合はスキップ
        if (className === 'explanation') {
          // 前の要素がgazoの場合、既にconvertGazoで処理済みなのでスキップ
          if (i > 0 && this.$(children[i - 1]).hasClass('gazo')) {
            continue; // スキップ
          }
          // 前の要素がgazoでない場合は独立したexplanationとして処理
          const content = this.convertInnerHTML($el);
          if (content) {
            body += content + '\n\n';
          }
          continue;
        }
        
        const converted = this.convertElement($el, i < children.length - 1 ? this.$(children[i + 1]) : null);
        if (converted) {
          body += converted + '\n\n';
        }
      }
    }
    
    return `---
title: "${title}"
overview: "${overview}"
---

${body.trim()}`;
  }
  
  convertElement($el, $nextEl = null) {
    const tagName = $el.prop('tagName')?.toLowerCase();
    const className = $el.attr('class') || '';
    
    // 見出し
    if (tagName?.match(/^h[2-5]$/)) {
      const level = '#'.repeat(parseInt(tagName[1]));
      return `${level} ${$el.text().trim()}`;
    }
    
    // 矢印
    if (className === 'arrow') {
      return '::arrow';
    }
    
    // gazo（画像） - 次の要素がexplanationの場合は一緒に処理
    if (className.includes('gazo')) {
      let result = this.convertGazo($el, $nextEl);
      return result;
    }
    
    // explanation（説明文）- gazoの後に続く説明（スキップされる）
    if (className === 'explanation') {
      // convertElementの呼び出し側でスキップされるため、ここには到達しない
      return '';
    }
    
    // ディレクティブ（top, middle, last, sup, lead）
    if (className.match(/^(top|middle|last|sup|lead)$/)) {
      const directive = className;
      
      // leadディレクティブがネストしている場合
      const $lead = $el.children('.lead');
      if ($lead.length > 0) {
        // leadの前のテキストを取得
        let mainText = '';
        $el.contents().each((i, node) => {
          if (node.type === 'text') {
            mainText += this.$(node).text();
          } else if (node.type === 'tag' && !this.$(node).hasClass('lead')) {
            mainText += this.convertInnerHTML(this.$(node));
          }
        });
        
        const leadContent = this.convertInnerHTML($lead);
        // leadの閉じタグで終わる（外側のdirectiveの閉じタグは不要）
        return `:::${directive}\n${mainText.trim()}\n:::lead\n${leadContent}\n:::`;
      }
      
      const content = this.convertInnerHTML($el);
      return `:::${directive}\n${content}\n:::`;
    }
    
    // リスト
    if (tagName === 'ul' || tagName === 'ol') {
      return this.convertList($el, tagName);
    }
    
    // テーブル
    if (tagName === 'table') {
      return this.convertTable($el);
    }
    
    // その他のテキスト
    const text = $el.text().trim();
    if (text && !className) {
      return text;
    }
    
    return '';
  }
  
  convertGazo($el, $nextEl = null) {
    const $imgs = $el.find('img');
    if ($imgs.length === 0) return '';
    
    // 説明文を抽出（<br>以降のテキスト）
    const html = $el.html();
    const parts = html.split(/<br\s*\/?>/i);
    const captions = parts.slice(1).map(p => {
      // HTMLタグを含む部分からテキストを正しく抽出
      const $temp = this.$('<div>').html(p);
      return $temp.text().trim();
    }).filter(t => t);
    
    const captionText = captions.length > 0 ? '\n\n' + captions.join('\n\n') : '';
    
    // 複数画像がある場合は横並び（half）と判定
    if ($imgs.length > 1) {
      let result = ':::gazo{size="half"}\n';
      $imgs.each((i, img) => {
        const $img = this.$(img);
        const src = $img.attr('data-src') || $img.attr('src');
        if (src && !src.includes('loading.svg')) {
          result += `![](/images/jh/${src})\n`;
        }
      });
      
      result += captionText + '\n:::';
      return result;
    }
    
    // 単一画像
    const $img = $imgs.first();
    
    // サイズ判定
    let sizeAttr = '';
    if ($img.hasClass('half')) sizeAttr = '{size="half"}';
    else if ($img.hasClass('twice')) sizeAttr = '{size="twice"}';
    else if ($img.hasClass('quarter')) sizeAttr = '{size="quarter"}';
    
    // 画像パス
    const src = $img.attr('data-src') || $img.attr('src');
    if (!src || src.includes('loading.svg')) return '';
    
    const imagePath = `/images/jh/${src}`;
    
    // 次の要素がexplanationの場合、入れ子にする
    let explanationContent = '';
    if ($nextEl && $nextEl.hasClass('explanation')) {
      explanationContent = this.convertInnerHTML($nextEl);
      if (explanationContent) {
        // <br>を改行に変換（元のHTMLに<br>がある場合）
        explanationContent = explanationContent.replace(/<br\s*\/?>/gi, '\n');
        // :::explanationディレクティブとして追加（最後の:::は:::gazoと共有）
        explanationContent = `:::explanation\n${explanationContent}\n`;
      }
    }
    
    // explanationがある場合、最後の:::はgazoとexplanation両方を閉じる
    return `:::gazo${sizeAttr}\n![](${imagePath})${captionText}\n${explanationContent}:::`;
  }
  
  convertList($el, tagName = 'ul') {
    const items = [];
    const hasEnClass = $el.hasClass('en');
    
    $el.children('li').each((i, li) => {
      const $li = this.$(li);
      
      // li内のテキストとネストされたdivを分離
      let mainText = '';
      const leadDivs = [];  // leadディレクティブのみ
      const continuationDivs = [];  // last, middle, topなどはdivタグとして保持
      
      $li.contents().each((j, node) => {
        if (node.type === 'text') {
          mainText += this.$(node).text();
        } else if (node.type === 'tag') {
          const $node = this.$(node);
          const className = $node.attr('class');
          
          // leadディレクティブのみネスト構造として保持
          if (className === 'lead') {
            leadDivs.push(this.convertElement($node));
          }
          // last, middle, topなどのクラスはdivタグとして保持（CSSの::beforeで記号が付く）
          else if (className?.match(/^(last|middle|top)$/)) {
            const content = this.convertInnerHTML($node);
            continuationDivs.push(`<div class="${className}">${content}</div>`);
          }
          // supはネストディレクティブとして保持
          else if (className === 'sup') {
            leadDivs.push(this.convertElement($node));
          }
          else {
            mainText += this.convertInnerHTML($node);
          }
        }
      });
      
      mainText = mainText.trim();
      
      // メインテキスト + leadディレクティブ + 継続divの順で構築
      let itemText = `- ${mainText}`;
      
      // 継続divを追加（改行なしで連結）
      if (continuationDivs.length > 0) {
        itemText += continuationDivs.join('');
      }
      
      // leadディレクティブを追加（改行してインデント）
      if (leadDivs.length > 0) {
        const nested = leadDivs.map(d => '  ' + d.split('\n').join('\n  ')).join('\n');
        itemText += '\n' + nested;
      }
      
      items.push(itemText);
    });
    
    const listContent = items.join('\n');
    
    // class="en"の場合は、:::list{class="en"}で囲む
    // :::leadがある項目はremarkListClassesが自動で class="en"を付けるので、
    // :::leadがない場合のみ:::listディレクティブを使用
    const hasAnyLead = items.some(item => item.includes(':::lead'));
    
    if (hasEnClass && !hasAnyLead) {
      return `:::list{class="en"}\n${listContent}\n:::`;
    }
    
    return listContent;
  }
  
  convertTable($el) {
    // rowspan/colspanがある場合はHTMLのまま返す（MDXテーブルでは表現不可）
    const hasRowspan = $el.find('[rowspan]').length > 0;
    const hasColspan = $el.find('[colspan]').length > 0;
    
    if (hasRowspan || hasColspan) {
      console.log('      [TABLE] rowspan/colspan detected - keeping HTML format');
      // HTMLテーブルをそのまま返す（整形して）
      const tableHtml = this.$.html($el);
      return '\n' + tableHtml + '\n';
    }
    
    const rows = [];
    
    // thead, tbody, または直接のtr要素を取得
    let $rows = $el.find('tr');
    if ($rows.length === 0) {
      $rows = $el.children('tr');
    }
    
    // 各行を変換
    $rows.each((i, tr) => {
      const $tr = this.$(tr);
      const cells = [];
      
      $tr.find('td, th').each((j, cell) => {
        const $cell = this.$(cell);
        let content = this.convertInnerHTML($cell).trim();
        // テーブルセル内の改行と余分な空白を削除（MDXテーブルでは改行不可）
        content = content.replace(/\s+/g, ' ').trim();
        cells.push(content);
      });
      
      rows.push(cells);
    });
    
    if (rows.length === 0) return '';
    
    // Markdownテーブル形式に変換
    const mdTable = [];
    
    // HTMLにヘッダー行がない場合（すべて<td>）、自動でヘッダーを追加
    const numColumns = rows[0].length;
    const hasHeader = $el.find('th').length > 0;
    
    // thead省略判定: 1行目の最初のセルが空の場合（hasHeaderに関わらず）
    const firstCellEmpty = rows[0][0].trim() === '';
    
    if (firstCellEmpty && rows.length > 1) {
      // 1行目が空セルで始まる場合、2次元テーブルとして扱う
      // ヘッダー: [項目] + [1行目の2列目以降]
      // データ: [2行目以降の全列]
      console.log('      [TABLE] 2D table detected (empty first cell) - adding "項目" header');
      
      // ヘッダー行: 「項目」+ 1行目の2列目以降
      const headerRow = ['項目', ...rows[0].slice(1)];
      mdTable.push('| ' + headerRow.join(' | ') + ' |');
      
      // セパレーター: 1列目中央寄せ、2列目以降左寄せ
      const separator = Array(numColumns).fill('').map((_, idx) => idx === 0 ? ':---:' : ':---');
      mdTable.push('| ' + separator.join(' | ') + ' |');
      
      // 2行目以降をデータ行として追加
      for (let i = 1; i < rows.length; i++) {
        mdTable.push('| ' + rows[i].join(' | ') + ' |');
      }
      
      return mdTable.join('\n');
    }
    
    if (!hasHeader) {
      // ヘッダー行がない場合、1行目をヘッダーとして使用
      mdTable.push('| ' + rows[0].join(' | ') + ' |');
    } else {
      // 既存のヘッダーを使用
      mdTable.push('| ' + rows[0].join(' | ') + ' |');
    }
    
    // セパレーター（中央寄せを最初のカラムに、左寄せを2列目以降に適用）
    const separator = Array(numColumns).fill('').map((_, idx) => idx === 0 ? ':---:' : ':---');
    mdTable.push('| ' + separator.join(' | ') + ' |');
    
    // データ行
    const startRow = hasHeader ? 1 : 0;
    for (let i = startRow; i < rows.length; i++) {
      mdTable.push('| ' + rows[i].join(' | ') + ' |');
    }
    
    return mdTable.join('\n');
  }
  
  convertInnerHTML($el) {
    let result = '';
    
    $el.contents().each((i, node) => {
      if (node.type === 'text') {
        result += this.$(node).text();
      } else if (node.type === 'tag') {
        const $node = this.$(node);
        const tagName = node.name;
        
        // 用語: <span class="all">...</span>
        if (tagName === 'span' && $node.hasClass('all')) {
          const inner = this.convertInnerHTML($node);
          result += `[[${inner}]]`;
        }
        // マーカー: <span class="marker">...</span>
        else if (tagName === 'span' && $node.hasClass('marker')) {
          const inner = this.convertInnerHTML($node);
          result += `==${inner}==`;
        }
        // 赤文字: <font color="#FF0000">...</font>
        else if (tagName === 'font' && $node.attr('color')?.toUpperCase() === '#FF0000') {
          const inner = this.convertInnerHTML($node);
          result += `**${inner}**`;
        }
        // ruby: そのまま保持
        else if (tagName === 'ruby') {
          const base = $node.contents().filter((i, n) => n.type === 'text' || n.name !== 'rt').text();
          const rt = $node.find('rt').text();
          result += `<ruby>${base}<rt>${rt}</rt></ruby>`;
        }
        // 再帰的にネストディレクティブを処理
        else if (tagName === 'div' && $node.attr('class')?.match(/^(lead|last|sup)$/)) {
          // これはconvertElement()で処理されるべき
          result += '\n' + this.convertElement($node) + '\n';
        }
        // <br>は改行に
        else if (tagName === 'br') {
          result += '\n';
        }
        // その他のタグは中身だけ取得
        else {
          result += this.convertInnerHTML($node);
        }
      }
    });
    
    return result.trim();
  }
}

// メイン処理
async function main() {
  const originDir = path.join(__dirname, '../origin/chitonitose/jh');
  const outputDir = path.join(__dirname, '../content/jh/lessons');
  
  // HTMLファイル一覧
  const htmlFiles = fs.readdirSync(originDir)
    .filter(f => f.match(/^jh_lessons\d+\.html$/))
    .sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)[0]);
      const numB = parseInt(b.match(/\d+/)[0]);
      return numA - numB;
    });
  
  console.log(`\n========== バッチ変換開始 ==========`);
  console.log(`対象ファイル数: ${htmlFiles.length}\n`);
  
  const results = {
    success: [],
    failed: [],
    withWarnings: [],
  };
  
  const checker = new MDXRuleChecker();
  const skipFiles = ['jh_lessons1.html', 'jh_lessons2.html', 'jh_lessons3.html'];
  const onlyConvert = null; // デバッグ用: nullなら全ファイル処理
  
  for (const htmlFile of htmlFiles) {
    // デバッグ用: onlyConvertが設定されている場合、そのファイルのみ処理
    if (onlyConvert && !onlyConvert.includes(htmlFile)) {
      continue;
    }
    
    if (skipFiles.includes(htmlFile)) {
      console.log(`⏭️  スキップ: ${htmlFile} (既に変換済み)`);
      continue;
    }
    
    const lessonNumber = htmlFile.match(/\d+/)[0];
    const htmlPath = path.join(originDir, htmlFile);
    const mdxPath = path.join(outputDir, `${lessonNumber}.md`);
    
    try {
      // HTML読み込み
      const htmlContent = fs.readFileSync(htmlPath, 'utf8');
      
      // MDXに変換
      const converter = new HtmlToMdxConverter(htmlContent);
      const mdxContent = converter.convert(); // titleは後で手動修正
      
      // ルールチェック
      const checkResult = checker.check(mdxContent);
      
      if (checkResult.hasErrors) {
        results.failed.push({
          file: htmlFile,
          errors: checkResult.errors,
          warnings: checkResult.warnings,
        });
        console.log(`❌ エラー: ${htmlFile}`);
        checkResult.errors.forEach(err => console.log(`   - ${err}`));
      } else if (checkResult.hasWarnings) {
        results.withWarnings.push({
          file: htmlFile,
          warnings: checkResult.warnings,
        });
        console.log(`⚠️  警告: ${htmlFile}`);
        checkResult.warnings.forEach(warn => console.log(`   - ${warn}`));
        
        // ファイル出力（警告のみなら出力）
        fs.writeFileSync(mdxPath, mdxContent, 'utf8');
      } else {
        results.success.push(htmlFile);
        console.log(`✅ 成功: ${htmlFile}`);
        
        // ファイル出力
        fs.writeFileSync(mdxPath, mdxContent, 'utf8');
      }
      
    } catch (error) {
      results.failed.push({
        file: htmlFile,
        errors: [error.message],
        warnings: [],
      });
      console.log(`❌ 例外: ${htmlFile} - ${error.message}`);
    }
  }
  
  // サマリー
  console.log(`\n========== 変換サマリー ==========`);
  console.log(`✅ 成功: ${results.success.length}ファイル`);
  console.log(`⚠️  警告あり: ${results.withWarnings.length}ファイル`);
  console.log(`❌ エラー/失敗: ${results.failed.length}ファイル`);
  
  if (results.withWarnings.length > 0) {
    console.log(`\n【警告が発生したファイル】`);
    results.withWarnings.forEach(({ file, warnings }) => {
      console.log(`${file}:`);
      warnings.forEach(w => console.log(`  - ${w}`));
    });
  }
  
  if (results.failed.length > 0) {
    console.log(`\n【エラーが発生したファイル】`);
    results.failed.forEach(({ file, errors }) => {
      console.log(`${file}:`);
      errors.forEach(e => console.log(`  - ${e}`));
    });
  }
  
  // MDXをHTMLに変換して<p>:::</p>をチェック
  console.log('\n========== HTMLレンダリングチェック ==========');
  await checkRenderedHtml();
  
  console.log(`\n========== 次のステップ ==========`);
  console.log(`1. 各MDXファイルのtitleフィールドを手動で修正してください`);
  console.log(`2. 警告があったファイルは内容を確認して手動修正してください`);
  console.log(`3. npm run devで開発サーバーを起動してページを確認してください\n`);
}

/**
 * 生成されたMDXをHTMLに変換して<p>:::</p>が含まれていないかチェック
 */
async function checkRenderedHtml() {
  const { parseCustomMarkdown } = require('./markdown-to-html');
  const outputDir = path.join(__dirname, '../content/jh/lessons');
  const mdxFiles = fs.readdirSync(outputDir).filter(f => f.endsWith('.md'));
  const problemFiles = [];
  
  for (const mdxFile of mdxFiles) {
    const mdxPath = path.join(outputDir, mdxFile);
    const mdxContent = fs.readFileSync(mdxPath, 'utf-8');
    
    // フロントマターを除去
    const contentWithoutFrontmatter = mdxContent.replace(/^---\n[\s\S]*?\n---\n/, '');
    
    // HTMLに変換
    const html = parseCustomMarkdown(contentWithoutFrontmatter, 'jh');
    
    // <p>:::</p>を検索
    if (html.includes('<p>:::</p>')) {
      const lines = html.split('\n');
      const problemLines = [];
      lines.forEach((line, idx) => {
        if (line.includes('<p>:::</p>')) {
          problemLines.push(idx + 1);
        }
      });
      
      problemFiles.push({
        file: mdxFile,
        lines: problemLines
      });
    }
  }
  
  if (problemFiles.length > 0) {
    console.log(`❌ <p>:::</p>が見つかりました: ${problemFiles.length}ファイル\n`);
    problemFiles.forEach(item => {
      console.log(`${item.file}:`);
      console.log(`  レンダリング後のHTML ${item.lines.join(', ')}行目に<p>:::</p>が存在`);
    });
  } else {
    console.log(`✅ すべてのファイルで<p>:::</p>は見つかりませんでした`);
  }
}

// 実行
try {
  require.resolve('cheerio');
  main().catch(console.error);
} catch (e) {
  console.error('\nエラー: cheerioがインストールされていません');
  console.error('以下のコマンドを実行してください:\n');
  console.error('  npm install cheerio\n');
  process.exit(1);
}
