/**
 * カスタムMarkdown記法をHTMLに変換するパーサー
 * 
 * 使い方:
 *   const { parseCustomMarkdown } = require('./markdown-to-html');
 *   const html = parseCustomMarkdown(markdownText);
 */

/**
 * カスタムMarkdownをHTMLに変換
 * @param {string} markdown - カスタムMarkdown記法のテキスト
 * @returns {string} - 変換後のHTML
 */
function parseCustomMarkdown(markdown) {
  let html = markdown;

  // 1. 概要セクション
  html = html.replace(
    /---overview---\n([\s\S]*?)\n---/g,
    '<div className="overview">\n\t<div className="title">概要</div>\n\t$1\n</div>'
  );

  // 2. 見出し（h2, h3）はそのまま
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');

  // 3. 矢印
  html = html.replace(/^---arrow---$/gm, '<div className="arrow"></div>');

  // 4. double（2カラムレイアウト）
  html = html.replace(
    /::double\n([\s\S]*?)---image---\n!\[([^\]]*)\]\(([^)]+)\)(?:\{\.([^}]+)\})?\n([\s\S]*?)::/g,
    (match, textContent, alt, imgSrc, imgClass, caption) => {
      // 改行を<br />に変換
      const formattedText = textContent.trim().replace(/\n\n/g, '<br />');
      const classNames = ['lazyload', 'popup-img'];
      if (imgClass) classNames.push(imgClass);
      
      return `<div className="double">
\t<div className="top">${formattedText}</div>
\t<div className="text-center gazo"><img src="${imgSrc}" alt="${alt}" className="${classNames.join(' ')}" /></div>
</div>`;
    }
  );

  // 5. gazo（画像）
  html = html.replace(
    /::gazo\n!\[([^\]]*)\]\(([^)]+)\)(?:\{\.([^}]+)\})?\n([\s\S]*?)::/g,
    (match, alt, imgSrc, imgClass, caption) => {
      const classNames = ['lazyload', 'popup-img'];
      if (imgClass) {
        imgClass.split('.').filter(c => c).forEach(c => classNames.push(c));
      }
      
      // キャプションの各行を<br />で区切る
      const lines = caption.trim().split('\n').filter(line => line.trim());
      const captionHtml = lines.join('\n\t<br />\n\t');
      
      return `<div className="gazo">
\t<img className="${classNames.join(' ')}" src="${imgSrc}" alt="${alt}" />
\t<br />
\t${captionHtml}
</div>`;
    }
  );

  // 6. sup（補足説明）- lead入れ子対応
  html = html.replace(
    /::sup\n([\s\S]*?):::lead\n([\s\S]*?):::\n([\s\S]*?)::/g,
    (match, before, leadContent, after) => {
      const beforeText = before.trim();
      const afterText = after.trim();
      let content = beforeText;
      if (leadContent.trim()) {
        content += `<div className="lead">${leadContent.trim()}</div>`;
      }
      if (afterText) {
        content += afterText;
      }
      return `<div className="sup">${content}</div>`;
    }
  );

  // 7. sup（シンプル版）
  html = html.replace(
    /::sup\n([\s\S]*?)::/g,
    '<div className="sup">$1</div>'
  );

  // 8. パラグラフ（top, middle, last）
  html = html.replace(/::top\n([\s\S]*?)::/g, '<div className="top">$1</div>');
  html = html.replace(/::middle\n([\s\S]*?)::/g, '<div className="middle">$1</div>');
  html = html.replace(/::last\n([\s\S]*?)::/g, '<div className="last">$1</div>');

  // 9. マーカー（蛍光ペン）
  html = html.replace(/==([^=]+)==/g, '<span className="marker">$1</span>');

  // 10. クリック表示/非表示（赤字用語）- ルビ付き
  html = html.replace(
    /\[\[([^\|]+)\|([^\]]+)\]\]/g,
    '<span onClick="chg(this)" className="all"><ruby>$1<rt>$2</rt></ruby></span>'
  );

  // 11. クリック表示/非表示（赤字用語）- ルビなし
  html = html.replace(
    /\[\[([^\]]+)\]\]/g,
    '<span onClick="chg(this)" className="all">$1</span>'
  );

  // 12. ルビ（ふりがな）
  html = html.replace(
    /\{\{([^\|]+)\|([^\}]+)\}\}/g,
    '<ruby>$1<rt>$2</rt></ruby>'
  );

  // 13. 赤文字
  html = html.replace(
    /\*\*([^\*]+)\*\*/g,
    '<span style={{color:"#FF0000"}}>$1</span>'
  );

  // 14. 改行の正規化（段落内の改行を削除）
  html = html.replace(/<div className="(top|middle|last|sup)">\n/g, '<div className="$1">');
  html = html.replace(/\n<\/div>/g, '</div>');

  return html;
}

/**
 * HTMLをカスタムMarkdownに逆変換（既存HTMLファイルの変換用）
 * @param {string} html - 既存のHTML
 * @returns {string} - カスタムMarkdown記法
 */
function htmlToCustomMarkdown(html) {
  let markdown = html;

  // PHPタグを削除
  markdown = markdown.replace(/<\?php[\s\S]*?\?>/g, '');
  
  // HTMLコメントを削除
  markdown = markdown.replace(/<!--[\s\S]*?-->/g, '');

  // 1. 概要セクション
  markdown = markdown.replace(
    /<div className="overview">\s*<div className="title">概要<\/div>\s*([\s\S]*?)\s*<\/div>/g,
    '---overview---\n$1\n---\n'
  );

  // 2. 見出し
  markdown = markdown.replace(/<h2>([^<]+)<\/h2>/g, '## $1');
  markdown = markdown.replace(/<h3>([^<]+)<\/h3>/g, '### $1');

  // 3. arrow
  markdown = markdown.replace(/<div className="arrow"><\/div>/g, '\n---arrow---\n');

  // 4. sup（補足）- lead入れ子
  markdown = markdown.replace(
    /<div className="sup">([^<]*?)<div className="lead">([^<]*?)<\/div>([^<]*?)<\/div>/g,
    (match, before, lead, after) => {
      let content = '';
      if (before && before.trim()) content += before.trim() + '\n';
      content += `:::lead\n${lead.trim()}\n:::\n`;
      if (after && after.trim()) content += after.trim();
      return `::sup\n${content}::`;
    }
  );

  // 5. sup（シンプル）- 内部のタグを先に処理する必要があるので後回し

  // 6. gazo（画像）- 複数パターンに対応
  // パターン1: imgタグが先にある場合
  markdown = markdown.replace(
    /<div className="gazo">\s*<img[^>]*?className="([^"]*)"[^>]*?src="([^"]+)"[^>]*?\/>\s*<br\s*\/>\s*([^<]*?)(?:<br\s*\/>\s*([^<]*?))?(?:<\/div>|$)/g,
    (match, imgClasses, imgSrc, line1, line2) => {
      // クラス名から必要な部分を抽出
      const classMatch = imgClasses.match(/\b(border|twice|half)\b/);
      const classAttr = classMatch ? `{.${classMatch[1]}}` : '';
      
      let caption = line1.trim();
      if (line2 && line2.trim()) {
        caption += '\n' + line2.trim();
      }
      
      return `::gazo\n![](${imgSrc})${classAttr}\n${caption}\n::`;
    }
  );
  
  // パターン2: src属性が先の場合
  markdown = markdown.replace(
    /<div className="gazo">\s*<img[^>]*?src="([^"]+)"[^>]*?className="([^"]*)"[^>]*?\/>\s*<br\s*\/>\s*([^<]*?)(?:<br\s*\/>\s*([^<]*?))?<\/div>/g,
    (match, imgSrc, imgClasses, line1, line2) => {
      const classMatch = imgClasses.match(/\b(border|twice|half)\b/);
      const classAttr = classMatch ? `{.${classMatch[1]}}` : '';
      
      let caption = line1.trim();
      if (line2 && line2.trim()) {
        caption += '\n' + line2.trim();
      }
      
      return `::gazo\n![](${imgSrc})${classAttr}\n${caption}\n::`;
    }
  );

  // 7. double（2カラム）
  markdown = markdown.replace(
    /<div className="double">\s*<div className="top">([\s\S]*?)<\/div>\s*<div className="text-center gazo">\s*<img[^>]*?src="([^"]+)"[^>]*?className="([^"]*)"[^>]*?\/>\s*<\/div>\s*<\/div>/g,
    (match, text, imgSrc, imgClasses) => {
      const formattedText = text.replace(/<br\s*\/?>\s*/g, '\n\n').trim();
      const classMatch = imgClasses.match(/\b(half|twice)\b/);
      const classAttr = classMatch ? `{.${classMatch[1]}}` : '';
      return `::double\n${formattedText}\n\n---image---\n![](${imgSrc})${classAttr}\n::`;
    }
  );

  // 8. マーカー（span className="marker"）
  markdown = markdown.replace(
    /<span className="marker">([\s\S]*?)<\/span>/g,
    '==$1=='
  );

  // 9. ルビ（通常）- 先に処理
  markdown = markdown.replace(
    /<ruby>([^<]+?)<rt>([^<]+?)<\/rt>\s*<\/ruby>/g,
    '{{$1|$2}}'
  );

  // 10. クリック表示/非表示 - ルビ付き（{{}}記法になっている）
  markdown = markdown.replace(
    /<span onClick="chg\(this\)" className="all">\{\{([^\|]+)\|([^\}]+)\}\}<\/span>/g,
    '[[$1|$2]]'
  );

  // 11. クリック表示/非表示 - ルビなし
  markdown = markdown.replace(
    /<span onClick="chg\(this\)" className="all">([^<]+?)<\/span>/g,
    '[[$1]]'
  );

  // 12. 赤文字（span style）- 色指定の形式に対応
  markdown = markdown.replace(
    /<span style=\{\{color:"#FF0000"\}\}>([^<]+?)<\/span>/g,
    '**$1**'
  );
  markdown = markdown.replace(
    /<span style="color:#FF0000">([^<]+?)<\/span>/g,
    '**$1**'
  );

  // 13. パラグラフ（top, middle, last）- 内部タグが処理された後
  markdown = markdown.replace(
    /<div className="top">([\s\S]*?)<\/div>/g,
    '::top\n$1\n::'
  );
  markdown = markdown.replace(
    /<div className="middle">([\s\S]*?)<\/div>/g,
    '::middle\n$1\n::'
  );
  markdown = markdown.replace(
    /<div className="last">([\s\S]*?)<\/div>/g,
    '::last\n$1\n::'
  );

  // 14. sup（シンプル）- 内部タグが処理された後
  markdown = markdown.replace(
    /<div className="sup">([\s\S]*?)<\/div>/g,
    '::sup\n$1\n::'
  );

  // 15. 不要な改行とタブを整理
  markdown = markdown.replace(/\t+/g, '');
  markdown = markdown.replace(/\n{3,}/g, '\n\n');
  markdown = markdown.trim();

  return markdown;
}

module.exports = {
  parseCustomMarkdown,
  htmlToCustomMarkdown
};
