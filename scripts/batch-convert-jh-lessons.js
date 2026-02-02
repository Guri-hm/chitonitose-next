/**
 * バッチ変換スクリプト: jh_lessons*.html → content/jh/lessons/*.md
 * MDX_SYNTAX_RULES.mdのルールに従って変換し、エラーチェックも実行
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
    const htmlTags = mdxContent.match(/<(div|span)[^>]*class/g);
    if (htmlTags) {
      this.errors.push(`HTMLタグの直接使用（ディレクティブを使うべき）: ${htmlTags.join(', ')}`);
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
          // 前の要素がgazoでない場合のみ処理
          if (i === 0 || !this.$(children[i - 1]).hasClass('gazo')) {
            const content = this.convertInnerHTML($el);
            if (content) {
              body += content + '\n\n';
            }
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
          if (i === 0 || !this.$(children[i - 1]).hasClass('gazo')) {
            const content = this.convertInnerHTML($el);
            if (content) {
              body += content + '\n\n';
            }
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
      let result = this.convertGazo($el);
      
      // 次の要素がexplanationの場合、その内容を追加
      if ($nextEl && $nextEl.hasClass('explanation')) {
        const explanationContent = this.convertInnerHTML($nextEl);
        if (explanationContent) {
          // :::の直前に説明文を挿入
          result = result.replace(/\n:::$/, `\n\n${explanationContent}\n:::`);
        }
      }
      
      return result;
    }
    
    // explanation（説明文）- gazoの後に続く説明
    if (className === 'explanation') {
      const content = this.convertInnerHTML($el);
      return content; // ディレクティブで囲まず、そのまま出力
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
      return this.convertList($el);
    }
    
    // その他のテキスト
    const text = $el.text().trim();
    if (text && !className) {
      return text;
    }
    
    return '';
  }
  
  convertGazo($el) {
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
    
    return `:::gazo${sizeAttr}\n![](${imagePath})${captionText}\n:::`;
  }
  
  convertList($el) {
    const items = [];
    $el.children('li').each((i, li) => {
      const $li = this.$(li);
      
      // li内のテキストとネストされたdivを分離
      let mainText = '';
      const nestedDivs = [];
      
      $li.contents().each((j, node) => {
        if (node.type === 'text') {
          mainText += this.$(node).text();
        } else if (node.type === 'tag') {
          const $node = this.$(node);
          const className = $node.attr('class');
          
          // ネストされたディレクティブ（lead, last, sup）
          if (className?.match(/^(lead|last|sup)$/)) {
            nestedDivs.push(this.convertElement($node));
          } else {
            mainText += this.convertInnerHTML($node);
          }
        }
      });
      
      mainText = mainText.trim();
      
      if (nestedDivs.length > 0) {
        const nested = nestedDivs.map(d => '  ' + d.split('\n').join('\n  ')).join('\n');
        items.push(`- ${mainText}\n${nested}`);
      } else {
        items.push(`- ${mainText}`);
      }
    });
    return items.join('\n');
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
  
  for (const htmlFile of htmlFiles) {
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
