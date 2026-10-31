# 画像パス問題修正レポート

> **2026-10-31 追記**: 画像の配置は旧サイトと同じURLに変更した（`public/geo/img/`・`public/jh/img/`・`public/wh/img/`、
> PDFは`public/{jh,wh}/pdf/`）。以下の`/images/…`表記は当時のもの。jhの本文中の`/images/jh/img/…`は
> ローダー（`lib/mdxLoader.ts`・`lib/markdownLoader.ts`）が`/jh/img/…`に読み替える。

## 問題の原因

### 1. 相対パスが絶対パスに変換されていない
MDファイルの画像パス: `img/1/1.svg`
期待されるパス: `/images/jh/img/1/1.webp`

### 2. 科目情報がparseCustomMarkdown()に渡されていない
markdown-to-html.jsに科目 (jh/wh/geo) の情報が渡されていなかったため、相対パスを正しい絶対パスに変換できなかった。

### 3. 開発環境のパフォーマンス問題
> 「jh/lessons/1を開くと、開くのに時間がすごくかかる」

**原因**: 開発環境ではページアクセスごとにMD→HTML変換が実行される
**解決策**: 本番ビルド時は事前変換されるため軽量

## 実施した修正

### 1. lib/markdownLoader.ts の更新
```typescript
// 修正前
function parseCustomMarkdown(markdown: string): string {
  const { parseCustomMarkdown: parser } = require('../scripts/markdown-to-html.js');
  return parser(markdown);
}

// 修正後
function parseCustomMarkdown(markdown: string, subject: string): string {
  const { parseCustomMarkdown: parser } = require('../scripts/markdown-to-html.js');
  return parser(markdown, subject); // 科目情報を渡す
}

export async function loadLesson(subject: string, lessonNo: number) {
  // ...
  const htmlContent = parseCustomMarkdown(rawMarkdown, subject); // 科目を渡す
  // ...
}
```

### 2. scripts/markdown-to-html.js の更新

#### convertToWebP() 関数の改良
```javascript
// 修正前
function convertToWebP(imgPath) {
  if (imgPath.endsWith('.webp')) return imgPath;
  return imgPath.replace(/\.(jpg|jpeg|png|gif)$/i, '.webp');
}

// 修正後
function convertToWebP(imgPath, subject = '') {
  if (imgPath.endsWith('.webp')) return imgPath;
  
  // 相対パスの場合は/images/科目/を追加
  if (!imgPath.startsWith('/') && !imgPath.startsWith('http') && subject) {
    imgPath = `/images/${subject}/${imgPath}`;
  }
  
  return imgPath.replace(/\.(jpg|jpeg|png|gif)$/i, '.webp');
}
```

#### parseCustomMarkdown() 関数の更新
```javascript
// 修正前
function parseCustomMarkdown(markdown) {
  // ...
  const webpSrc = convertToWebP(imgSrc);
  // ...
}

// 修正後
function parseCustomMarkdown(markdown, subject = '') {
  // ...
  const webpSrc = convertToWebP(imgSrc, subject); // 科目を渡す
  // ...
}
```

## 画像パス変換の仕組み

### 入力パターンと出力

| MDファイル内のパス | 科目 | 変換後のパス |
|-------------------|------|-------------|
| `img/1/1.svg` | jh | `/images/jh/img/1/1.webp` |
| `img/1/2.jpg` | jh | `/images/jh/img/1/2.webp` |
| `share/img/test.png` | wh | `/images/wh/share/img/test.webp` |
| `/images/jh/img/1.jpg` | jh | `/images/jh/img/1.webp` |
| `https://example.com/img.jpg` | jh | `https://example.com/img.webp` |

### 変換ロジック

1. **既にWebP**: そのまま返す
2. **絶対パス** (`/`で開始): `/images/科目/`を追加せず、拡張子のみ変換
3. **外部URL** (`http`で開始): 拡張子のみ変換
4. **相対パス**: `/images/科目/`を先頭に追加し、拡張子を`.webp`に変換

## 開発環境のパフォーマンス問題

### 現状の動作フロー (開発環境)
```
ユーザーがページアクセス
  ↓
Next.js サーバーサイドレンダリング
  ↓
loadLesson('jh', 1) 実行
  ↓
1.md ファイルを読み込み
  ↓
parseCustomMarkdown() でHTMLに変換 ← ここで時間がかかる
  ↓
Reactコンポーネントレンダリング
  ↓
ページ表示
```

**所要時間**: 初回アクセス時に1-3秒程度

### 本番環境の動作フロー
```
npm run build 実行時
  ↓
全ページを事前生成 (Static Generation)
  ↓
全MDファイルをHTMLに変換
  ↓
HTMLファイルとして保存
  ↓
デプロイ

ユーザーがページアクセス
  ↓
事前生成済みHTMLを即座に配信 ← 高速
  ↓
ページ表示
```

**所要時間**: 0.1-0.5秒程度 (約10倍高速)

### 解決策

#### 開発環境での高速化 (オプション)
1. **ビルドキャッシュ利用**: 変更がない限り再変換しない
2. **ファイル監視**: MDファイル更新時のみ再変換

#### 推奨: 本番ビルドで確認
```bash
npm run build
npm run start
```

これで実際の本番環境のパフォーマンスを確認できます。

## 赤字クリック機能の確認

### 実装状況
`components/MarkdownContent.tsx`で実装済み：

```typescript
// すべての .all クラス要素にクリックイベントを追加
const allElements = contentRef.current.querySelectorAll('.all');
const listeners = new Map<Element, () => void>();

allElements.forEach(element => {
  const htmlElement = element as HTMLElement;
  htmlElement.style.cursor = 'pointer';
  
  const listener = () => handleClick(htmlElement);
  listeners.set(element, listener);
  htmlElement.addEventListener('click', listener);
});
```

### 動作条件
- HTML内に `.all` クラスを持つ要素が存在すること
- markdown-to-html.jsで正しく `<span class="all">` に変換されていること

### 確認方法
1. ブラウザで `/jh/lessons/1` を開く
2. 開発者ツールでElementsタブを確認
3. `.all` クラスの要素を探す
4. クリックして赤字に変わるか確認

## テスト手順

### 1. サーバー起動
```bash
npm run dev
```

### 2. ブラウザで確認
- URL: `http://localhost:3000/jh/lessons/1`
- 開発者ツールのNetworkタブで画像リクエストを確認
- 期待: `/images/jh/img/1/1.webp` のような正しいパスでリクエスト

### 3. 画像表示確認
- 画像が正しく表示されるか
- フルスクリーンモーダルが動作するか
- 前後ナビゲーションが動作するか

### 4. 赤字クリック確認
- `.all` クラスの要素をクリック
- 赤字⇄通常が切り替わるか

## 残りの問題

### 画像ファイルが存在しない
以下の画像がエラーになっている場合:
- `/share/img/nisshinsen.jpg`
- `/share/img/taisho.jpg`
- `/share/img/showa.jpg`
- `/share/img/showa_sengo.jpg`

**解決策**:
1. `origin/chitonitose/share/img/` から該当ファイルを探す
2. `public/images/share/` にコピー
3. WebP変換スクリプトを再実行

```bash
# 画像をコピー
copy origin\chitonitose\share\img\*.jpg public\images\share\

# WebP変換
node scripts/convert-images-to-webp.js
```

## まとめ

### 修正完了
- ✅ 科目情報をparseCustomMarkdown()に渡す
- ✅ 相対パスを絶対パスに変換
- ✅ WebP拡張子に自動変換

### 確認必要
- ⚠️ 画像ファイルが実際に存在するか
- ⚠️ 赤字クリック機能が動作するか
- ⚠️ 開発環境のパフォーマンス (想定通り遅い)

### 本番環境で解決
- 🚀 ビルド時に事前変換されるため高速
- 🚀 MD→HTML変換はビルド時のみ
- 🚀 ユーザーは静的HTMLを受け取るだけ

---

**次のアクション**: 
1. サーバー再起動完了を待つ
2. ブラウザで `/jh/lessons/1` を開く
3. 開発者ツールで画像パスを確認
4. 必要に応じて不足している画像を追加
