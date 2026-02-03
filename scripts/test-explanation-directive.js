/**
 * Test :::explanation directive rendering
 */

const fs = require('fs');
const path = require('path');

// Read lesson 6
const lesson6Path = path.join(__dirname, '../content/jh/lessons/6.md');
const content = fs.readFileSync(lesson6Path, 'utf8');

// Extract the explanation section
const explanationMatch = content.match(/:::gazo\{size="half"\}\n!\[\]\(.*?6\/1\.jpg\)\n:::\n:::explanation\n([\s\S]*?)\n:::/);

if (explanationMatch) {
  console.log('✅ Found :::explanation directive in 6.md');
  console.log('\nContent:');
  console.log('---');
  console.log(explanationMatch[0]);
  console.log('---');
  console.log('\nExpected HTML structure:');
  console.log('<div class="gazo">');
  console.log('  <img class="lazyload popup-img half" src="/images/jh/img/6/1.jpg" />');
  console.log('  <div class="explanation">');
  console.log('    好太王（広開土王）碑<br/>');
  console.log('    「倭は391年よりこのかた、海を渡り、百済を破り、新羅を□□して臣民とした」とある。読解では、碑文内容と当時の情勢の食い違いに留意したい。');
  console.log('  </div>');
  console.log('</div>');
  console.log('\n⚠️  Note: Run `npm run dev` and visit http://localhost:3000/jh/lessons/6 to verify rendering');
} else {
  console.log('❌ :::explanation directive not found in expected format');
}
