const fs = require('fs');
const path = require('path');

/**
 * :::lead ブロックのエラーを修正するスクリプト
 * 
 * エラーパターン:
 * ::sup
 * タイトル
 * :::lead
 * タイトル (重複)
 * :::
 * v class="lead">内容   ← これが問題
 * ::
 * 
 * 正しい形:
 * ::sup
 * タイトル
 * :::lead
 * 内容
 * :::
 * ::
 */

function getAllMdFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      getAllMdFiles(filePath, fileList);
    } else if (file.endsWith('.md')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

function fixLeadErrors(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;
  
  // パターン1: 行頭の "v class="lead">" を検出して修正
  const pattern1 = /^v class="lead">(.+)$/gm;
  if (pattern1.test(content)) {
    content = content.replace(/^v class="lead">(.+)$/gm, '$1');
    modified = true;
  }
  
  // パターン2: 行頭の "div class="lead">" を検出して修正
  const pattern2 = /^div class="lead">(.+)$/gm;
  if (pattern2.test(content)) {
    content = content.replace(/^div class="lead">(.+)$/gm, '$1');
    modified = true;
  }
  
  // パターン3: 行頭の "iv class="lead">" を検出して修正
  const pattern3 = /^iv class="lead">(.+)$/gm;
  if (pattern3.test(content)) {
    content = content.replace(/^iv class="lead">(.+)$/gm, '$1');
    modified = true;
  }
  
  // 重複タイトルの削除
  // :::lead\nタイトル\n:::のパターンを検出して、その前のタイトルと比較
  const lines = content.split('\n');
  const result = [];
  let i = 0;
  let removedDuplicates = false;
  
  while (i < lines.length) {
    const line = lines[i];
    
    // :::lead行を検出
    if (line.trim() === ':::lead' && i > 0) {
      const prevLine = lines[i - 1]; // タイトル行のはず
      
      // :::leadの次の行をチェック
      if (i + 1 < lines.length) {
        const nextLine = lines[i + 1];
        
        // 次の行がタイトルと同じで、その次が:::の場合
        if (nextLine.trim() === prevLine.trim() && 
            i + 2 < lines.length && 
            lines[i + 2].trim() === ':::') {
          // 重複を検出 - :::leadだけ追加し、重複タイトルと:::をスキップ
          result.push(line); // :::lead
          i += 3; // タイトル(重複)と:::をスキップ
          removedDuplicates = true;
          continue;
        }
      }
    }
    
    result.push(line);
    i++;
  }
  
  if (removedDuplicates) {
    content = result.join('\n');
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf-8');
    return true;
  }
  
  return false;
}

// メイン処理
console.log('Starting fix-lead-errors script...\n');

const contentDir = path.join(__dirname, '..', 'content');
const files = getAllMdFiles(contentDir);

console.log(`Found ${files.length} markdown files\n`);

let fixedCount = 0;
const fixedFiles = [];

for (const file of files) {
  try {
    const fixed = fixLeadErrors(file);
    if (fixed) {
      const relativePath = path.relative(path.join(__dirname, '..'), file);
      console.log(`✓ Fixed: ${relativePath}`);
      fixedFiles.push(relativePath);
      fixedCount++;
    }
  } catch (error) {
    console.error(`✗ Error processing ${file}:`, error.message);
  }
}

console.log(`\n${'='.repeat(60)}`);
console.log(`✓ Complete! Fixed ${fixedCount} files.`);
console.log(`${'='.repeat(60)}\n`);

if (fixedFiles.length > 0) {
  console.log('Fixed files:');
  fixedFiles.forEach(f => console.log(`  - ${f}`));
  console.log();
}
