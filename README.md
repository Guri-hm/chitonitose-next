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
