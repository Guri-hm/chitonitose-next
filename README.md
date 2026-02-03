# Chitonitose Next.js

ちとにとせ（地理・日本史・世界史のまとめサイト）のNext.js版

## 概要

このプロジェクトは、chitonitose.comを従来のPHP/MySQL構成からNext.jsベースの静的サイトに移行するためのものです。

## 技術スタック

- **Next.js 15+** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **MDX** (Markdownコンテンツ管理)
- **SQLite** (データソース)
- **GitHub Pages** (ホスティング)

## プロジェクト構造

```
chitonitose-next/
├── app/                 # Next.js App Router
│   ├── layout.tsx      # ルートレイアウト
│   ├── page.tsx        # トップページ
│   ├── geo/            # 地理セクション
│   ├── jh/             # 日本史セクション
│   └── wh/             # 世界史セクション
├── components/          # Reactコンポーネント
├── content/            # MDXコンテンツファイル
├── data/               # JSONデータファイル
├── scripts/            # ビルドスクリプト
└── public/             # 静的ファイル
```

## セットアップ

### 前提条件

- Node.js 18.17以降
- npm

### インストール

```bash
npm install
```

### 開発サーバー起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

### ビルド

```bash
npm run build
```

### データ変換

SQLiteデータベースからJSONファイルを生成：

```bash
npm run data:convert
```

### HTMLからMDXへのバッチ変換

日本史レッスンファイルをHTMLからMDXに一括変換：

```bash
node scripts/batch-convert-jh-lessons.js
```

### MDXコンパイルチェック

すべてのMDXファイルがエラーなくコンパイルできるかをチェック：

```bash
# 全科目
npm run test:mdx

# 特定の科目のみ
npm run test:mdx:jh   # 日本史
npm run test:mdx:wh   # 世界史
npm run test:mdx:geo  # 地理
```

**用途**:
- ブラウザで開かなくてもMDXファイルの構文エラーを事前検出
- CI/CDパイプラインでの品質チェック
- バッチ変換後の検証

## MDX構文ルール

MDXファイルの書き方については [MDX_SYNTAX_RULES.md](./MDX_SYNTAX_RULES.md) を参照してください。

**主なルール**:
- ディレクティブ構文（`:::directive`）を使用
- リスト項目内の継続テキストは `:::last`, `:::middle`, `:::top`
- テーブルはMarkdown形式（rowspan/colspanがある場合はHTML）
- ルビタグ内の改行・タブは自動削除される
- 用語は `[[用語名]]` でマークアップ


## デプロイ

GitHub Actionsを使用してGitHub Pagesに自動デプロイされます。

mainブランチにプッシュすると自動的にビルド・デプロイが実行されます。

## 移行計画

1. ✅ プロジェクト初期化
2. ⏳ データベース移行（MySQL → SQLite）
3. ⏳ 共通コンポーネント作成
4. ⏳ コンテンツ移行（HTML → MDX）
5. ⏳ グラフ機能実装
6. ⏳ CI/CD設定

## ライセンス

Private
