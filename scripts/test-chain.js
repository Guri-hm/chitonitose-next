const md = '約260万年前、地球は=={{間氷期|かんぴょうき}}と{{氷期|ひょうき}}を交互に繰り返す==[[更新世|こうしんせい]]（[[氷河時代]]）を迎えました。';
let html = md;

console.log('=== 入力 ===');
console.log(html);
console.log('');

// マーカー処理
html = html.replace(/==([^=]+)==/g, (m, c) => {
  let p = c;
  p = p.replace(/\{\{([^\|]+)\|([^\}]+)\}\}/g, '<ruby>$1<rt>$2</rt></ruby>');
  p = p.replace(/\[\[([^\|]+)\|([^\]]+)\]\]/g, '<span onclick="chg(this)" class="all"><ruby>$1<rt>$2</rt></ruby></span>');
  p = p.replace(/\[\[(.+?)\]\]/g, '<span onclick="chg(this)" class="all">$1</span>');
  return '<span class="marker">' + p + '</span>';
});

console.log('=== マーカー処理後 ===');
console.log(html);
console.log('');

// ruby処理
html = html.replace(/\{\{([^\|]+)\|([^\}]+)\}\}/g, '<ruby>$1<rt>$2</rt></ruby>');
console.log('=== ruby処理後 ===');
console.log(html);
console.log('');

// [[...|...]]処理
html = html.replace(/\[\[([^\|]+)\|([^\]]+)\]\]/g, '<span onclick="chg(this)" class="all"><ruby>$1<rt>$2</rt></ruby></span>');
console.log('=== [[...|...]]処理後 ===');
console.log(html);
console.log('');

// [[...]]処理
html = html.replace(/\[\[(.+?)\]\]/g, '<span onclick="chg(this)" class="all">$1</span>');
console.log('=== [[...]]処理後（最終） ===');
console.log(html);
