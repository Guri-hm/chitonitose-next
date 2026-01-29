/**
 * 画像をWebP形式に一括変換するスクリプト
 * 
 * 使い方:
 *   node scripts/convert-images-to-webp.js
 * 
 * 処理内容:
 *   - public/images/ 配下のJPG/PNG画像を検索
 *   - 各画像をWebP形式に変換
 *   - 元の画像は保持（WebP非対応ブラウザのフォールバック用）
 *   - 既にWebP版が存在する場合はスキップ
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 設定
const IMAGE_DIR = path.join(process.cwd(), 'public', 'images');
const QUALITY = 85; // WebP品質 (1-100)
const EXTENSIONS = ['.jpg', '.jpeg', '.png'];

// 統計
let stats = {
  total: 0,
  converted: 0,
  skipped: 0,
  failed: 0,
  totalSizeBefore: 0,
  totalSizeAfter: 0,
};

/**
 * ディレクトリを再帰的に走査して画像ファイルを収集
 */
function findImages(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findImages(filePath, fileList);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (EXTENSIONS.includes(ext)) {
        fileList.push(filePath);
      }
    }
  });
  
  return fileList;
}

/**
 * Sharp を使って画像をWebPに変換
 */
async function convertToWebP(imagePath) {
  const ext = path.extname(imagePath);
  const webpPath = imagePath.replace(ext, '.webp');
  
  // 既にWebP版が存在する場合はスキップ
  if (fs.existsSync(webpPath)) {
    console.log(`⏭️  スキップ: ${path.relative(process.cwd(), webpPath)} (既に存在)`);
    stats.skipped++;
    return;
  }
  
  try {
    // Sharpを使用してWebPに変換
    const sharp = require('sharp');
    const originalSize = fs.statSync(imagePath).size;
    
    await sharp(imagePath)
      .webp({ quality: QUALITY })
      .toFile(webpPath);
    
    const webpSize = fs.statSync(webpPath).size;
    const reduction = ((originalSize - webpSize) / originalSize * 100).toFixed(1);
    
    stats.totalSizeBefore += originalSize;
    stats.totalSizeAfter += webpSize;
    stats.converted++;
    
    console.log(`✅ 変換完了: ${path.relative(process.cwd(), webpPath)} (${formatBytes(originalSize)} → ${formatBytes(webpSize)}, -${reduction}%)`);
  } catch (error) {
    console.error(`❌ 変換失敗: ${path.relative(process.cwd(), imagePath)}`);
    console.error(`   エラー: ${error.message}`);
    stats.failed++;
  }
}

/**
 * バイト数を読みやすい形式に変換
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/**
 * Sharp パッケージの確認とインストール
 */
function checkSharp() {
  try {
    require('sharp');
    return true;
  } catch (error) {
    console.log('📦 sharp パッケージが見つかりません。インストール中...\n');
    try {
      execSync('npm install --save-dev sharp', { stdio: 'inherit' });
      console.log('\n✅ sharp のインストールが完了しました。\n');
      return true;
    } catch (installError) {
      console.error('❌ sharp のインストールに失敗しました。');
      console.error('   手動でインストールしてください: npm install --save-dev sharp');
      return false;
    }
  }
}

/**
 * メイン処理
 */
async function main() {
  console.log('🖼️  画像のWebP変換を開始します...\n');
  console.log(`📁 対象ディレクトリ: ${IMAGE_DIR}`);
  console.log(`🎚️  品質設定: ${QUALITY}`);
  console.log(`📋 対象拡張子: ${EXTENSIONS.join(', ')}\n`);
  
  // Sharp パッケージの確認
  if (!checkSharp()) {
    process.exit(1);
  }
  
  // 画像ディレクトリの存在確認
  if (!fs.existsSync(IMAGE_DIR)) {
    console.error(`❌ エラー: ディレクトリが見つかりません: ${IMAGE_DIR}`);
    process.exit(1);
  }
  
  // 画像ファイルを収集
  const images = findImages(IMAGE_DIR);
  stats.total = images.length;
  
  if (images.length === 0) {
    console.log('⚠️  変換対象の画像が見つかりませんでした。');
    return;
  }
  
  console.log(`🔍 ${images.length} 個の画像を検出しました。\n`);
  
  // 各画像を変換
  for (const imagePath of images) {
    await convertToWebP(imagePath);
  }
  
  // 結果レポート
  console.log('\n' + '='.repeat(60));
  console.log('📊 変換結果サマリー');
  console.log('='.repeat(60));
  console.log(`総画像数:     ${stats.total}`);
  console.log(`変換成功:     ${stats.converted}`);
  console.log(`スキップ:     ${stats.skipped} (既存のWebPファイル)`);
  console.log(`失敗:         ${stats.failed}`);
  
  if (stats.converted > 0) {
    const totalReduction = ((stats.totalSizeBefore - stats.totalSizeAfter) / stats.totalSizeBefore * 100).toFixed(1);
    console.log('\n容量削減:');
    console.log(`  変換前: ${formatBytes(stats.totalSizeBefore)}`);
    console.log(`  変換後: ${formatBytes(stats.totalSizeAfter)}`);
    console.log(`  削減量: ${formatBytes(stats.totalSizeBefore - stats.totalSizeAfter)} (-${totalReduction}%)`);
  }
  
  console.log('='.repeat(60));
  
  if (stats.converted > 0) {
    console.log('\n✅ 変換が完了しました！');
    console.log('\n📝 次のステップ:');
    console.log('   1. markdown-to-html.js で画像パスを .webp に優先変更');
    console.log('   2. <picture> タグを使用してフォールバックを追加');
    console.log('   3. npm run build でビルドテスト');
  }
}

// 実行
main().catch(error => {
  console.error('❌ エラーが発生しました:', error);
  process.exit(1);
});
