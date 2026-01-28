const md = `::sup
骨などの放射性元素[[炭素]]14の濃度で年代可能
::
::sup
兵庫県で発見された明石人は新人とする説が主流
::`;

console.log('=== Original ===');
console.log(md);
console.log('');

const regex = /\n?::sup\n?((?:(?!::)[\s\S])*?)::\n?/g;
let match;
let matchCount = 0;
while ((match = regex.exec(md)) !== null) {
  matchCount++;
  console.log(`Match ${matchCount}:`);
  console.log('  Full match:', JSON.stringify(match[0]));
  console.log('  Capture 1:', JSON.stringify(match[1]));
  console.log('  Index:', match.index);
  console.log('');
}

let html = md;
html = html.replace(/\n?::sup\n?((?:(?!::)[\s\S])*?)::\n?/g, '<div class="sup">$1</div>\n');

console.log('=== Result ===');
console.log(html);
console.log('');
console.log('Has :: remaining:', html.includes('::'));
