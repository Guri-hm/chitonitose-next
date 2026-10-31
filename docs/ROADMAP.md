# Chitonitose Next.js 移行プロジェクト ロードマップ

> 未完了の作業は [TODO.md](../TODO.md) に集約している。このファイルは目的・構成・方針の記録用で、
> 未完了チェックボックスは置かない。作業経緯は [PROGRESS.md](./PROGRESS.md) 以下を参照。

## 目的・背景

chitonitose.com を PHP/MySQL から Next.js + SQLite（ビルド時にJSON化）+ GitHub Pages（静的サイト）へ移行する。

- 旧構成の問題: さくらインターネットの運用コスト、DBアクセスによる表示速度低下、SQLインジェクションのリスク
- 新構成: Next.js 15（App Router）+ TypeScript + Tailwind CSS / コンテンツはMarkdown(MDX) /
  データは `data/data.sqlite3` → `data/json/*.json` / グラフはGoogle Charts / デプロイはGitHub Actions → GitHub Pages

## フェーズ（状況）

| フェーズ | 内容 | 状況 |
|---|---|---|
| 0 | プロジェクト初期化 | 完了 |
| 1 | MySQL→SQLite→JSON のデータ移行 | 完了 |
| 2 | 共通コンポーネント（ヘッダー・フッター・サイドバー・ダークモード・トップ刷新） | 完了 |
| 3 | 地理コンテンツ移行（レッスン77本、演習・その他11ページ） | 完了 |
| 4 | 日本史・世界史コンテンツ移行 | ほぼ完了（残りは TODO.md の「コンテンツ未移行」） |
| 5 | グラフ機能（Google Charts、DB連動表） | 完了 |
| 6 | 検索・パフォーマンス・テスト・公開・運用 | TODO.md を参照 |

## コマンド

```bash
npm run dev            # 開発サーバー
npm run build          # 本番ビルド（out/ に静的書き出し）
npm run lint
npm run db:convert     # MySQL → SQLite
npm run data:convert   # SQLite → JSON（data/json/）
```

`npm run dev` と `npm run build` は同時に動かさない（`.next` のロックで固まる）。

## ディレクトリ構成

```
app/          Next.js App Router（geo / jh / wh / guide / contact …）
components/   Header・Footer・lessons/（3カラム・サイドバー）・charts/・geo-exercises/
content/      Markdown（geo/lessons, jh/lessons|omnibus|cultural-history, wh/lessons|omnibus）
data/         data.sqlite3 と json/
lib/          データ読み込み・チャート整形・MDX/remarkプラグイン
public/       css・画像・pdf・quiz-maps（国の位置クイズの地図SVG）
scripts/      変換・移行スクリプト
origin/       元サイト（別Gitリポジトリ。移行元の参照用）
```

## リスクと対策

- ページ数が膨大（400以上）: 優先順位をつけて段階移行（完了済み）
- グラフデータが複雑: `lib/chartBuilders.ts` / `lib/renderLessonDbTables.ts` にパターン化
- 画像の容量: webp変換済み（`WEBP_CONVERSION_REPORT.md`）
- SQLite↔JSON変換: JOIN等はSQL側で処理し、必要な構造を事前に設計
