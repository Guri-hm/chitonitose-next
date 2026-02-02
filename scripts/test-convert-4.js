/**
 * テスト: jh_lessons4.htmlのみ変換
 */

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// HTML→MDX変換器
class HtmlToMdxConverter {
  constructor(htmlContent) {
    this.$ = cheerio.load(htmlContent, { decodeEntities: false });
    this.mdx = '';
  }
  
  convert() {
    // 概要を抽出
    const overview = this.$('.overview').text().replace(/概要\s*/,'').trim();
    
    // タイトルは後で手動修正が必要（ファイル名から推測）
    const title = '争いとクニ';
    
    // デバッグ: コンテンツの取得方法を確認
    console.log('overview:', overview);
    console.log('toc-range exists:', this.$('#toc-range').length);
    console.log('.contents exists:', this.$('.contents').length);
    
    // メインコンテンツを処理 - #toc-rangeの直接の子要素を全て取得
    const $toc = this.$('#toc-range');
    console.log('toc children count:', $toc.children().length);
    
    const $contents = $toc.children().filter((i, el) => {
      const $el = this.$(el);
      const tagName = $el.prop('tagName')?.toLowerCase();
      const id = $el.attr('id');
      const className = $el.attr('class') || '';
      
      // PHPインクルード、ボタン、概要、目次、.contents wrapperは除外
      if (id === 'toc') return false;
      if (className === 'overview') return false;
      if (className === 'contents') {
        // .contentsの中を処理
        return false;
      }
      if (tagName === 'script') return false;
      
      return true;
    });
    
    console.log('filtered contents count:', $contents.length);
    
    // .contentsがラッパーになっている場合、その中身を取得
    const $contentsWrapper = $toc.find('.contents');
    if ($contentsWrapper.length > 0) {
      console.log('.contents wrapper found, processing its children');
      const $children = $contentsWrapper.children();
      console.log('.contents children count:', $children.length);
      
      let body = '';
      $children.each((i, el) => {
        const $el = this.$(el);
        const id = $el.attr('id');
        
        // 目次とPHPは除外
        if (id === 'toc') return;
        if ($el.html()?.includes('<?php')) return;
        
        const converted = this.convertElement($el);
        if (converted) {
          body += converted + '\n\n';
        }
      });
      
      return `---
title: "${title}"
overview: "${overview}"
---

${body.trim()}`;
    }
    
    let body = '';
    $contents.each((i, el) => {
      body += this.convertElement(this.$(el)) + '\n\n';
    });
    
    return `---
title: "${title}"
overview: "${overview}"
---

${body.trim()}`;
  }
  
  convertElement($el) {
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
      return this.convertGazo($el);
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
        return `:::${directive}\n${mainText.trim()}\n:::lead\n${leadContent}\n:::\n:::`;
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
      
      // 説明文（<br>以降のテキスト）
      const html = $el.html();
      const parts = html.split(/<br\s*\/?>/i);
      if (parts.length > 1) {
        const caption = this.$(parts[parts.length - 1]).text().trim();
        if (caption) {
          result += `\n${caption}\n`;
        }
      }
      
      result += ':::';
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
    
    // 説明文（<br>以降のテキスト）
    const html = $el.html();
    const parts = html.split(/<br\s*\/?>/i);
    const captions = parts.slice(1).map(p => {
      return this.$(p).text().trim();
    }).filter(t => t);
    
    const captionText = captions.length > 0 ? '\n\n' + captions.join('\n\n') : '';
    
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

// メイン
const htmlPath = path.join(__dirname, '../origin/chitonitose/jh/jh_lessons4.html');
const mdxPath = path.join(__dirname, '../content/jh/lessons/4.md');

const htmlContent = fs.readFileSync(htmlPath, 'utf8');
const converter = new HtmlToMdxConverter(htmlContent);
const mdxContent = converter.convert();

fs.writeFileSync(mdxPath, mdxContent, 'utf8');
console.log('✅ 4.md生成完了');
console.log(mdxContent.substring(0, 500) + '...');
