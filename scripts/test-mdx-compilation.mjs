/**
 * 全MDXファイルのコンパイルチェックテスト
 * 
 * 目的:
 * - 各MDXファイルがエラーなくコンパイルできるかをチェック
 * - ブラウザで開かなくても問題を事前に検出
 * 
 * 実行方法:
 * node scripts/test-mdx-compilation.js [subject]
 * 
 * 例:
 * node scripts/test-mdx-compilation.js jh  # 日本史のみ
 * node scripts/test-mdx-compilation.js     # 全科目
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { compile } from '@mdx-js/mdx';
import { remarkPlugins, rehypePlugins } from '../lib/mdx-config.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const contentDir = path.join(projectRoot, 'content');

// 科目の定義
const subjects = {
  jh: { name: '日本史', dir: 'jh/lessons' },
  wh: { name: '世界史', dir: 'wh/lessons' },
  geo: { name: '地理', dir: 'geo/lessons' },
};

// 統計情報
const stats = {
  total: 0,
  success: 0,
  failed: 0,
  errors: []
};

/**
 * MDXファイルをコンパイルしてチェック
 */
async function checkMDXFile(filePath, relativePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // MDXをコンパイル（frontmatter処理なし - シンプルにチェックのみ）
    await compile(content, {
      remarkPlugins,
      rehypePlugins,
      development: false,
    });
    
    stats.success++;
    console.log(`✅ ${relativePath}`);
    return true;
  } catch (error) {
    stats.failed++;
    const errorInfo = {
      file: relativePath,
      message: error.message,
      stack: error.stack
    };
    stats.errors.push(errorInfo);
    
    console.error(`❌ ${relativePath}`);
    console.error(`   エラー: ${error.message.split('\n')[0]}`);
    
    return false;
  }
}

/**
 * ディレクトリ内のMDXファイルを再帰的に検索
 */
function findMDXFiles(dir) {
  const files = [];
  
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    
    if (item.isDirectory()) {
      files.push(...findMDXFiles(fullPath));
    } else if (item.isFile() && item.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

/**
 * 指定された科目のMDXファイルをチェック
 */
async function checkSubject(subjectKey) {
  const subject = subjects[subjectKey];
  if (!subject) {
    console.error(`❌ 科目 "${subjectKey}" が見つかりません`);
    return;
  }
  
  const subjectDir = path.join(contentDir, subject.dir);
  
  if (!fs.existsSync(subjectDir)) {
    console.error(`❌ ディレクトリが見つかりません: ${subjectDir}`);
    return;
  }
  
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📚 ${subject.name} (${subjectKey}) のチェックを開始`);
  console.log(`${'='.repeat(60)}\n`);
  
  const files = findMDXFiles(subjectDir);
  
  if (files.length === 0) {
    console.log(`⚠️  MDXファイルが見つかりませんでした`);
    return;
  }
  
  console.log(`📄 ${files.length}個のファイルを検出\n`);
  
  for (const file of files) {
    const relativePath = path.relative(contentDir, file);
    stats.total++;
    await checkMDXFile(file, relativePath);
  }
}

/**
 * メイン処理
 */
async function main() {
  const args = process.argv.slice(2);
  const targetSubject = args[0]; // 科目指定（オプション）
  
  console.log('\n📝 MDXコンパイルチェックテスト\n');
  
  if (targetSubject) {
    // 特定の科目のみチェック
    await checkSubject(targetSubject);
  } else {
    // 全科目をチェック
    for (const subjectKey of Object.keys(subjects)) {
      await checkSubject(subjectKey);
    }
  }
  
  // 結果サマリー
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📊 チェック結果サマリー`);
  console.log(`${'='.repeat(60)}\n`);
  console.log(`総ファイル数: ${stats.total}`);
  console.log(`✅ 成功: ${stats.success}`);
  console.log(`❌ 失敗: ${stats.failed}`);
  
  if (stats.failed > 0) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`❌ エラー詳細`);
    console.log(`${'='.repeat(60)}\n`);
    
    stats.errors.forEach((error, index) => {
      console.log(`${index + 1}. ${error.file}`);
      console.log(`   ${error.message}\n`);
    });
    
    process.exit(1);
  } else {
    console.log(`\n✨ すべてのMDXファイルが正常にコンパイルできました！\n`);
    process.exit(0);
  }
}

main().catch(error => {
  console.error('❌ テスト実行中にエラーが発生しました:', error);
  process.exit(1);
});
