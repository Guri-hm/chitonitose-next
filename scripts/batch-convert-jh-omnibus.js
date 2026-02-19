/**
 * バッチ変換スクリプト: jh_omnibus*.html → content/jh/omnibus/*.md
 * batch-convert-jh-lessons.js と同じ HtmlToMdxConverter クラスを使用
 */

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// HTML→MDX変換器（batch-convert-jh-lessons.js と同一）
class HtmlToMdxConverter {
  constructor(htmlContent) {
    this.$ = cheerio.load(htmlContent, { decodeEntities: false });
    this.mdx = '';
  }

  convert(title = 'タイトル未設定') {
    // 概要を抽出
    const overview = this.$('.overview').text().replace(/概要\s*/, '').trim();

    // メインコンテンツを処理
    const $toc = this.$('#toc-range');
    const $contentsWrapper = $toc.find('.contents');

    let body = '';

    if ($contentsWrapper.length > 0) {
      const children = $contentsWrapper.children().toArray();

      for (let i = 0; i < children.length; i++) {
        const $el = this.$(children[i]);
        const id = $el.attr('id');

        if (id === 'toc') continue;
        if ($el.html()?.includes('<?php')) continue;

        if ($el.hasClass('explanation')) {
          if (i > 0 && this.$(children[i - 1]).hasClass('gazo')) {
            continue;
          }
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
      const children = $toc.children().toArray();

      for (let i = 0; i < children.length; i++) {
        const $el = this.$(children[i]);
        const id = $el.attr('id');
        const className = $el.attr('class') || '';

        if (id === 'toc') continue;
        if (className === 'overview') continue;
        if ($el.html()?.includes('<?php')) continue;

        if (className === 'explanation') {
          if (i > 0 && this.$(children[i - 1]).hasClass('gazo')) {
            continue;
          }
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

    // frontmatter（overview なし）
    const fm = overview
      ? `---\ntitle: "${title}"\noverview: "${overview}"\n---`
      : `---\ntitle: "${title}"\n---`;

    return `${fm}\n\n${body.trim()}`;
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

    // gazo（画像）
    if (className.includes('gazo')) {
      return this.convertGazo($el, $nextEl);
    }

    // explanation
    if (className === 'explanation') {
      return '';
    }

    // ディレクティブ（top, middle, last, sup, lead）
    if (className.match(/^(top|middle|last|sup|lead)$/)) {
      const directive = className;

      const $lead = $el.children('.lead');
      if ($lead.length > 0) {
        let mainText = '';
        $el.contents().each((i, node) => {
          if (node.type === 'text') {
            mainText += this.$(node).text();
          } else if (node.type === 'tag' && !this.$(node).hasClass('lead')) {
            mainText += this.convertInnerHTML(this.$(node));
          }
        });

        const leadContent = this.convertInnerHTML($lead);
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

    const html = $el.html();
    const parts = html.split(/<br\s*\/?>/i);
    const captions = parts.slice(1).map(p => {
      const $temp = this.$('<div>').html(p);
      return $temp.text().trim();
    }).filter(t => t);

    const captionText = captions.length > 0 ? '\n\n' + captions.join('\n\n') : '';

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

    const $img = $imgs.first();

    let sizeAttr = '';
    if ($img.hasClass('half')) sizeAttr = '{size="half"}';
    else if ($img.hasClass('twice')) sizeAttr = '{size="twice"}';
    else if ($img.hasClass('quarter')) sizeAttr = '{size="quarter"}';

    const src = $img.attr('data-src') || $img.attr('src');
    if (!src || src.includes('loading.svg')) return '';

    const imagePath = `/images/jh/${src}`;

    let explanationContent = '';
    if ($nextEl && $nextEl.hasClass('explanation')) {
      explanationContent = this.convertInnerHTML($nextEl);
      if (explanationContent) {
        explanationContent = explanationContent.replace(/<br\s*\/?>/gi, '\n');
        explanationContent = `:::explanation\n${explanationContent}\n`;
      }
    }

    return `:::gazo${sizeAttr}\n![](${imagePath})${captionText}\n${explanationContent}:::`;
  }

  convertList($el, tagName = 'ul') {
    const items = [];
    const hasEnClass = $el.hasClass('en');

    $el.children('li').each((i, li) => {
      const $li = this.$(li);

      let mainText = '';
      const nestedDirectives = [];

      $li.contents().each((j, node) => {
        if (node.type === 'text') {
          mainText += this.$(node).text();
        } else if (node.type === 'tag') {
          const $node = this.$(node);
          const cls = $node.attr('class');

          if (cls?.match(/^(lead|sup|last|middle|top)$/)) {
            nestedDirectives.push(this.convertElement($node));
          } else {
            mainText += this.convertInnerHTML($node);
          }
        }
      });

      mainText = mainText.trim();
      let itemText = `- ${mainText}`;

      if (nestedDirectives.length > 0) {
        const nested = nestedDirectives.map(d => '  ' + d.split('\n').join('\n  ')).join('\n');
        itemText += '\n' + nested;
      }

      items.push(itemText);
    });

    const listContent = items.join('\n');
    const hasAnyLead = items.some(item => item.includes(':::lead'));

    if (hasEnClass && !hasAnyLead) {
      return `:::list{class="en"}\n${listContent}\n:::`;
    }

    return listContent;
  }

  convertTable($el) {
    const hasRowspan = $el.find('[rowspan]').length > 0;
    const hasColspan = $el.find('[colspan]').length > 0;

    if (hasRowspan || hasColspan) {
      const tableHtml = this.$.html($el);
      return '\n' + tableHtml + '\n';
    }

    const rows = [];
    let $rows = $el.find('tr');
    if ($rows.length === 0) {
      $rows = $el.children('tr');
    }

    $rows.each((i, tr) => {
      const $tr = this.$(tr);
      const cells = [];
      $tr.find('td, th').each((j, cell) => {
        const $cell = this.$(cell);
        let content = this.convertInnerHTML($cell).trim();
        content = content.replace(/\s+/g, ' ').trim();
        cells.push(content);
      });
      rows.push(cells);
    });

    if (rows.length === 0) return '';

    const mdTable = [];
    const numColumns = rows[0].length;
    const hasHeader = $el.find('th').length > 0;
    const firstCellEmpty = rows[0][0].trim() === '';

    if (firstCellEmpty && rows.length > 1) {
      const headerRow = ['項目', ...rows[0].slice(1)];
      mdTable.push('| ' + headerRow.join(' | ') + ' |');
      const separator = Array(numColumns).fill('').map((_, idx) => idx === 0 ? ':---:' : ':---');
      mdTable.push('| ' + separator.join(' | ') + ' |');
      for (let i = 1; i < rows.length; i++) {
        mdTable.push('| ' + rows[i].join(' | ') + ' |');
      }
      return mdTable.join('\n');
    }

    mdTable.push('| ' + rows[0].join(' | ') + ' |');
    const separator = Array(numColumns).fill('').map((_, idx) => idx === 0 ? ':---:' : ':---');
    mdTable.push('| ' + separator.join(' | ') + ' |');

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

        if (tagName === 'span' && $node.hasClass('all')) {
          const inner = this.convertInnerHTML($node);
          result += `[[${inner}]]`;
        } else if (tagName === 'span' && $node.hasClass('marker')) {
          const inner = this.convertInnerHTML($node);
          result += `==${inner}==`;
        } else if (tagName === 'font' && $node.attr('color')?.toUpperCase() === '#FF0000') {
          const inner = this.convertInnerHTML($node);
          result += `**${inner}**`;
        } else if (tagName === 'ruby') {
          const base = $node.contents().filter((i, n) => n.type === 'text' || n.name !== 'rt').text().replace(/[\r\n\t]+/g, '').trim();
          const rt = $node.find('rt').text().replace(/[\r\n\t]+/g, '').trim();
          result += `<ruby>${base}<rt>${rt}</rt></ruby>`;
        } else if (tagName === 'div' && $node.attr('class')?.match(/^(lead|last|sup)$/)) {
          result += '\n' + this.convertElement($node) + '\n';
        } else if (tagName === 'br') {
          result += '\n';
        } else {
          result += this.convertInnerHTML($node);
        }
      }
    });

    return result.trim();
  }
}

// タイトルを HTML の最初の h2 から取得
function extractTitle($) {
  const h2 = $('#toc-range h2').first().text().trim();
  return h2 || 'タイトル未設定';
}

// メイン処理
function main() {
  const originDir = path.join(__dirname, '../origin/chitonitose/jh');
  const outputDir = path.join(__dirname, '../content/jh/omnibus');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // jh_omnibus*.html を番号順に取得
  const htmlFiles = fs.readdirSync(originDir)
    .filter(f => f.match(/^jh_omnibus\d+\.html$/))
    .sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)[0]);
      const numB = parseInt(b.match(/\d+/)[0]);
      return numA - numB;
    });

  console.log(`\n=== omnibus 変換開始 (${htmlFiles.length}ファイル) ===\n`);

  let success = 0;
  let failed = 0;

  for (const htmlFile of htmlFiles) {
    const num = htmlFile.match(/\d+/)[0];
    const htmlPath = path.join(originDir, htmlFile);
    const outPath = path.join(outputDir, `${num}.md`);

    try {
      const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
      const $ = cheerio.load(htmlContent, { decodeEntities: false });
      const title = extractTitle($);

      const converter = new HtmlToMdxConverter(htmlContent);
      const md = converter.convert(title);

      fs.writeFileSync(outPath, md, 'utf-8');
      console.log(`✅ ${num}.md - ${title}`);
      success++;
    } catch (err) {
      console.error(`❌ ${num}.md - ${err.message}`);
      failed++;
    }
  }

  console.log(`\n成功: ${success}, 失敗: ${failed}`);
}

try {
  require.resolve('cheerio');
  main();
} catch (e) {
  console.error('cheerio がインストールされていません。npm install cheerio を実行してください。');
  process.exit(1);
}
