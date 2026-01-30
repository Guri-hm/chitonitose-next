# MDX 移行（進捗と復元手順）

目的
- chitonitose-next リポジトリの Markdown → MDX 移行作業の進捗と、別環境で再現する手順・注意点をまとめる。

現状（2026-01-30）
- 開発サーバーで `http://localhost:3000/jh/lessons/2` が表示されることを確認済み（一時的に `2.md` を標準Markdown版に差し替え）。
- カスタム remark プラグインは一時無効化し、最小構成で動作確認を完了。

変更した主要ファイル
- `next.config.js`  : MDX を有効化（`@next/mdx`）。カスタム remark プラグインは段階的に有効化する設計。
- `lib/remark-custom-directives.js` : カスタム remark プラグイン群（:::lead、::top、[[用語]]、==マーカー==、画像クラス、---arrow---、赤文字等）。
- `lib/mdxLoader.ts` : `compileMDX` を使ったサーバーサイドMDXコンパイル処理。
- `app/jh/lessons/[id]/page.tsx` : レッスンページをMDX出力に対応（フロントマター・コンテンツ表示）。
- `components/lessons/TOC.tsx` : ページ内目次生成コンポーネント（クライアント側）。
- `content/jh/lessons/2.md` : デバッグ用に括弧等を取り除いた標準Markdown（元ファイルは `2-backup.md` に保存）。
- `content/jh/lessons/2-simple.md` : 元ファイルを簡素化したバックアップ/参照用ファイル。

再現手順（別環境）
1. リポジトリをクローン／チェックアウト
2. 依存をインストール

```cmd
npm install
```

3. 開発サーバーを起動

```cmd
npm run dev
```

4. ブラウザで `http://localhost:3000/jh/lessons/2` を確認

段階的回復手順（カスタムプラグインを戻す方法）
- 目的：どのプラグインが問題を起こすか特定するため、1つずつ有効化してテストする。

1. `next.config.js` の `remarkPlugins` で最初は `remark-gfm` のみ有効にする。
2. `remark-directive` を追加してサーバー再起動 → 表示確認。
3. `lib/remark-custom-directives.js` のプラグインを一つずつ `next.config.js` に追加して、都度 `npm run dev` （またはサーバーを再起動）して確認。
   - 追加順（推奨）: `remarkCustomDirectives` → `remarkTerms` → `remarkMarkers` → `remarkRedText` → `remarkCustomImages` → `remarkArrows`
4. どのプラグインでエラーが出るか特定できたら、そのプラグインの実装（JSXノードの扱い、入れ子、テキストノードの分割など）を検査・修正する。

重要な注意点（MDXでのエスケープ）
- MDXはJSX拡張なので `()` や `{}`、`<` `>` の組み合わせが JavaScript/JSX として誤解釈されることがある。
- 実際に `Could not parse expression with acorn` が出た主な原因は、丸括弧の入れ子や全角/半角の組合せ（例: `(姫川流域）`）でした。
- 回避法:
  - テキスト中の丸括弧はダッシュ等で代替する（`(〜)` → ` - 〜 -`）
  - 必要ならバックスラッシュでエスケープ `\(〜\)` または HTML エンティティ `&#40;` を使う
  - カスタム構文は段階的に有効化して検証する

備考・今後のタスク
- TODO: `lib/remark-custom-directives.js` のテストケースを増やして、入れ子や境界ケースに強くする。
- TODO: CIで `npm run build` を実行して本番ビルド時の問題も早期に検出する（`next build`）。

連絡
- 問題が出た箇所（例：どのプラグインを最優先で戻したいか）を教えてください。優先度に従って段階的に有効化/修正を進めます。

---
このファイルはプロジェクトルートに置いてあります。必要なら README に短いサマリを追記します。
