# 画像ビューアー統合 完了レポート

## 実装完了日時
2026-01-29

## 実装内容

### 1. markdown-to-html.js の更新
**ファイル**: `scripts/markdown-to-html.js`

`::gazo` ブロックをカスタムdata属性付きdivに変換するよう変更：

```javascript
// 変更前: 通常の<img>タグとして出力
<div class="gazo">
  <img class="lazyload popup-img" src="..." alt="..." />
  <br />キャプション<br />
</div>

// 変更後: placeholderとして出力（後でReactコンポーネントに置き換え）
<div class="gazo lesson-image-placeholder" 
     data-src="..." 
     data-alt="..." 
     data-class="lazyload popup-img" 
     data-caption="キャプション">
</div>
```

### 2. ImageGalleryContext の作成
**ファイル**: `contexts/ImageGalleryContext.tsx`

ページ内の全画像を管理するContextを作成：

- `images`: 画像データ配列 `{src, alt, caption}[]`
- `currentIndex`: 現在表示中の画像インデックス
- `setImages()`: 画像一覧を登録
- `setCurrentIndex()`: 現在のインデックスを設定
- `goToNext()`: 次の画像へ移動
- `goToPrev()`: 前の画像へ移動

### 3. LessonImage コンポーネントの更新
**ファイル**: `components/LessonImage.tsx`

**追加機能**:
- `imageIndex` prop: この画像のページ内インデックス
- `useImageGallery()`: Contextから画像一覧と現在位置を取得
- フルスクリーンモード時に前後の画像に移動可能
- 画像カウンター表示 (`1 / 5` など)
- 前後ボタンの無効化 (最初/最後の画像で)
- captionをdangerouslySetInnerHTMLで表示（HTMLタグを含むため）

### 4. MarkdownContent コンポーネントの更新
**ファイル**: `components/MarkdownContent.tsx`

**追加処理**:
1. `.lesson-image-placeholder` を検索
2. 各placeholderから画像データを収集
3. 画像一覧を `ImageGalleryContext` に登録
4. 各placeholderをLessonImageコンポーネントに置き換え
5. 各コンポーネントに `imageIndex` を渡す

### 5. LessonContent コンポーネントの更新
**ファイル**: `components/lessons/LessonContent.tsx`

MarkdownContentと同じロジックを実装（WHページ用）

### 6. ページコンポーネントの更新

**日本史**: `app/jh/lessons/[id]/page.tsx`
**世界史**: `app/wh/lessons/[id]/page.tsx`

両ページに `<ImageGalleryProvider>` を追加してコンテンツ全体をラップ

## 動作フロー

```
1. ページロード
   ↓
2. markdown-to-html.js が ::gazo をplaceholder divに変換
   ↓
3. MarkdownContent/LessonContent がマウント
   ↓
4. useEffect でplaceholderを検索
   ↓
5. 画像データを収集してImageGalleryContextに登録
   ↓
6. 各placeholderをLessonImageコンポーネントに置き換え
   ↓
7. ユーザーが画像をクリック
   ↓
8. setCurrentIndex(imageIndex) でコンテキスト更新
   ↓
9. フルスクリーンモーダル表示
   ↓
10. 前後ボタンで images[currentIndex] を変更
```

## 実装されたUI機能

### 通常表示
- Next.js Image コンポーネントで最適化
- lazy loading (遅延読み込み)
- blur placeholder (ロード中の薄いグレー背景)
- ホバー時に影が濃くなる
- カーソルがポインターに変化

### フルスクリーンモード
- 画面全体に黒背景 (opacity: 90%)
- 画像は最大90vw x 90vh に収まるようスケーリング
- 右上に「×」閉じるボタン
- 左右に「‹」「›」前後移動ボタン
- 最初の画像では「‹」無効化
- 最後の画像では「›」無効化
- 画像下にカウンター表示 (`3 / 10`)
- 背景クリックで閉じる
- ESCキーで閉じる (キーボードアクセシビリティ対応)

## テスト方法

1. 開発サーバー起動: `npm run dev`
2. ブラウザで `/jh/lessons/1` または `/wh/lessons/1` を開く
3. 画像をクリック → フルスクリーン表示を確認
4. 「‹」「›」ボタンで画像移動を確認
5. カウンター表示を確認
6. 背景クリックで閉じることを確認

## 残りの作業

### 任意: WebP画像変換 (id:8)
`public/images/` 内の画像をWebP形式に変換してファイルサイズを削減

**予想される改善**:
- ファイルサイズ: 30-50% 削減
- ページロード時間: 短縮
- Lighthouse Performance スコア: 向上

## 関連ファイル

### 新規作成
- `contexts/ImageGalleryContext.tsx`

### 更新
- `scripts/markdown-to-html.js`
- `components/LessonImage.tsx`
- `components/MarkdownContent.tsx`
- `components/lessons/LessonContent.tsx`
- `app/jh/lessons/[id]/page.tsx`
- `app/wh/lessons/[id]/page.tsx`

## 備考

- 地理 (geo) のレッスンページは別の構造のため未対応
- MDX形式は廃止し、カスタムMarkdown + HTML変換方式に統一
- 画像のalt/captionにHTMLタグが含まれる場合は `dangerouslySetInnerHTML` で表示
