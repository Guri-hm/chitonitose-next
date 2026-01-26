# Chitonitose Next.js 移行プロジェクト ロードマップ

## プロジェクト概要

### 目的
chitonitose.com を PHP/MySQL から Next.js + SQLite + GitHub Pages へ移行

### 背景・課題
- **現状**: HTML + PHP + JavaScript + MySQL (さくらインターネット)
- **問題点**:
  1. さくらインターネットの有料運用コスト
  2. DBアクセスによるページ表示速度低下
  3. SQLインジェクションのセキュリティリスク

### 移行後の構成
- **フロントエンド**: Next.js 15 + TypeScript + Tailwind CSS
- **コンテンツ**: MDX形式
- **データ管理**: SQLite (ローカル) → JSON (ビルド時)
- **デプロイ**: GitHub Pages (静的サイト)
- **グラフ**: Google Charts

---

## フェーズ0: プロジェクト初期化 ✅ 完了

### 完了したタスク
- [x] Next.js プロジェクト作成
- [x] TypeScript + Tailwind CSS セットアップ
- [x] App Router ディレクトリ構造
- [x] ESLint 設定
- [x] 基本レイアウト作成
- [x] Header/Footer コンポーネント
- [x] トップページ作成
- [x] セクショントップページ (geo, jh, wh)
- [x] GitHub Actions ワークフロー作成
- [x] 静的エクスポート設定 (next.config.js)
- [x] data.sqlite3 ファイル作成

### 成果物
```
chitonitose-next/
├── app/              # Next.js App Router
│   ├── layout.tsx    # 共通レイアウト
│   ├── page.tsx      # トップページ
│   ├── geo/          # 地理セクション
│   ├── jh/           # 日本史セクション
│   └── wh/           # 世界史セクション
├── components/       # React コンポーネント
│   ├── Header.tsx
│   └── Footer.tsx
├── data/            # データファイル (JSON, SQLite)
│   └── data.sqlite3
├── scripts/         # ビルドスクリプト
├── public/          # 静的アセット
└── .github/         # CI/CD設定
    └── workflows/
```

---

## フェーズ1: データベース移行 ✅ 完了 (2026/01/26)

### 目標
MySQL のデータを SQLite に完全移行し、JSON 出力の基盤を構築

### 完了したタスク

#### 1.1 MySQL → SQLite 変換 ✅ 完了
- [x] mysql3107_db_sakura_ne_jp.sql をoriginフォルダに配置
- [x] mysql3107_db_sakura_ne_jp.json から直接インポート
- [x] sql.js (WebAssembly版SQLite) をインストール
- [x] JSON to SQLite インポートスクリプト作成
- [x] data.sqlite3 にスキーマとデータをインポート
- [x] データ整合性検証

**インポート結果:**
- ✅ 60テーブル作成
- ✅ 20,962行のデータ格納
- ✅ 主要テーブル確認済み
  - nation_info: 251件
  - city: 315件
  - page: 409件
  - statistics_data: 2,941件
  - one_q_one_a: 2,444件

**使用ツール:**
- sql.js (npm package)
- Node.js スクリプト
- PHPMyAdmin JSON エクスポート

#### 1.2 SQLite → JSON 変換スクリプト作成 ✅ 完了
- [x] グラフ用JSONスキーマ設計
- [x] データ抽出クエリ作成
- [x] scripts/sqlite-to-json.js の実装
- [x] npm run data:convert コマンド動作確認
- [x] 20個のJSONファイル生成成功

**生成されたJSONファイル:**
- 📄 news.json (35件)
- 📄 pages.json (409件)
- 📄 nations.json (251件)
- 📄 cities.json (315件)
- 📄 aging-society.json (5件)
- 📄 birthrate-mortality.json (178件)
- 📄 gdp-gni.json (411件)
- 📄 urban-population.json (500件)
- 📄 statistics-info.json (217件)
- 📄 export-items.json (200件)
- 📄 import-items.json (200件)
- その他9ファイル

#### 1.3 サンプルデータでの検証 📋 次のステップ
- [ ] グラフ用JSONスキーマ設計
- [ ] データ抽出クエリ作成
- [ ] scripts/sqlite-to-json.js の実装
- [ ] npm run data:convert コマンド動作確認

#### 1.3 サンプルデータでの検証 ✅ 完了
- [x] 特定ページ用のJSONデータ生成
- [x] データ読み込みユーティリティ作成 (lib/dataLoader.ts)
- [x] データテストページ作成 (/data-test)
- [x] Google Charts 統合
- [x] グラフコンポーネント作成 (components/charts/GoogleChart.tsx)
- [x] グラフサンプルページ作成 (/charts)
- [x] トップページにデータ統計表示

**検証結果:**
- ✅ JSONデータが正しく読み込める
- ✅ Google Chartsでグラフ表示成功
- ✅ 高齢化社会、出生率・死亡率のグラフ動作確認
- ✅ サーバーサイドでのデータ読み込み動作確認

---

## フェーズ2: 共通コンポーネント強化 🔄 進行中

### 目標
全ページで使用する共通UI・機能の実装

### タスク

#### 2.1 ナビゲーション
- [ ] グローバルナビゲーション
- [ ] パンくずリスト
- [ ] サイドバーナビゲーション (セクション内)

#### 2.2 レイアウト
- [ ] レスポンシブデザイン
- [ ] モバイル対応メニュー
- [ ] フッター拡充 (サイトマップ等)

#### 2.3 メタデータ管理
- [ ] SEO対応メタタグ
- [ ] OGP設定
- [ ] サイトマップ生成

---

## フェーズ3: コンテンツ移行 (地理) 📚 計画中

### 目標
origin/chitonitose/geo/ 配下の約100ページを移行

### 移行対象ページ (例)

#### 3.1 基礎レッスン (約40ページ)
- `geo_lessons_climatic_element.html` - 気候要素
- `geo_lessons_climate_classification.html` - 気候区分
- `geo_lessons_climate_tropical.html` - 熱帯気候
- `geo_lessons_climate_dry.html` - 乾燥帯気候
- `geo_lessons_climate_temperate.html` - 温帯気候
- `geo_lessons_climate_continental.html` - 冷帯気候
- `geo_lessons_climate_polar.html` - 寒帯気候
- `geo_lessons_agriculture.html` - 農業
- `geo_lessons_Industry.html` - 工業
- `geo_lessons_energy_resources.html` - エネルギー資源
- その他...

#### 3.2 地域別レッスン (約30ページ)
- `geo_lessons_asia.html` - アジア
- `geo_lessons_China.html` - 中国
- `geo_lessons_Indonesia.html` - インドネシア
- `geo_lessons_Europa1.html` / `Europa2.html` - ヨーロッパ
- `geo_lessons_Africa.html` - アフリカ
- `geo_lessons_Anglo_America.html` - アングロアメリカ
- その他...

#### 3.3 演習ページ (約20ページ)
- `geo_exercises_climograph.html` - クリモグラフ
- `geo_exercises_climograph_map.html` - クリモグラフ地図
- `geo_exercises_hythergraph.html` - ハイサーグラフ
- `geo_exercises_hythergraph_map.html` - ハイサーグラフ地図
- その他...

### 作業手順 (ページ単位)
1. HTML解析 (構造・コンテンツ抽出)
2. MDX変換 (マークダウン + React コンポーネント)
3. 画像ファイル移行 (origin/chitonitose/geo/img/)
4. CSS/スタイル調整
5. グラフ機能実装 (必要な場合)
6. 動作確認

---

## フェーズ4: コンテンツ移行 (日本史・世界史) 📚 計画中

### 4.1 日本史コンテンツ (jh)
- [ ] origin/chitonitose/jh/ 配下のHTMLファイル移行
- [ ] 画像ファイル移行
- [ ] 年表・地図コンポーネント実装

### 4.2 世界史コンテンツ (wh)
- [ ] origin/chitonitose/wh/ 配下のHTMLファイル移行
- [ ] 画像ファイル移行
- [ ] 地図・年表コンポーネント実装

---

## フェーズ5: グラフ機能実装 📊 計画中

### 目標
Google Charts を使用したインタラクティブグラフの実装

### タスク

#### 5.1 グラフコンポーネント作成
- [ ] LineChart コンポーネント
- [ ] BarChart コンポーネント
- [ ] PieChart コンポーネント
- [ ] GeoChart コンポーネント (地図)
- [ ] Climograph (クリモグラフ)
- [ ] Hythergraph (ハイサーグラフ)

#### 5.2 データ読み込み機能
- [ ] JSONデータフェッチユーティリティ
- [ ] データキャッシュ
- [ ] エラーハンドリング

#### 5.3 グラフページ実装
- [ ] 統計データ表示ページ
- [ ] 気候グラフページ
- [ ] その他データビジュアライゼーション

---

## フェーズ6: 機能追加・改善 🚀 計画中

### 6.1 検索機能
- [ ] サイト内検索
- [ ] ページタグ・カテゴリ
- [ ] 関連ページ表示

### 6.2 ユーザビリティ向上
- [ ] ダークモード (オプション)
- [ ] フォントサイズ調整
- [ ] 印刷最適化CSS

### 6.3 パフォーマンス最適化
- [ ] 画像最適化 (Next.js Image)
- [ ] コード分割
- [ ] キャッシュ戦略

---

## フェーズ7: テスト・検証 ✅ 計画中

### 7.1 機能テスト
- [ ] 全ページ表示確認
- [ ] グラフ動作確認
- [ ] リンク切れチェック
- [ ] レスポンシブ表示確認

### 7.2 パフォーマンステスト
- [ ] Lighthouse スコア確認
- [ ] ページ読み込み速度
- [ ] バンドルサイズ最適化

### 7.3 クロスブラウザテスト
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

---

## フェーズ8: デプロイ・公開 🌐 計画中

### 8.1 GitHub Pages セットアップ
- [ ] リポジトリ設定
- [ ] カスタムドメイン設定 (chitonitose.com)
- [ ] HTTPS設定

### 8.2 CI/CD 最終調整
- [ ] ビルドワークフロー確認
- [ ] デプロイ自動化テスト
- [ ] ロールバック手順確認

### 8.3 本番公開
- [ ] 最終動作確認
- [ ] DNS切り替え
- [ ] 旧サイトからのリダイレクト設定

---

## フェーズ9: 運用・保守 🔧 計画中

### 9.1 コンテンツ更新フロー
- [ ] MDX編集ガイドライン
- [ ] データ更新手順書
- [ ] ビルド・デプロイ手順書

### 9.2 モニタリング
- [ ] Google Analytics 設定
- [ ] エラー監視
- [ ] アクセスログ分析

### 9.3 バックアップ
- [ ] リポジトリバックアップ
- [ ] SQLiteデータバックアップ

---

## 技術スタック詳細

### フロントエンド
- **フレームワーク**: Next.js 15 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **コンテンツ**: MDX (Markdown + JSX)

### データ管理
- **開発時**: SQLite (data.sqlite3)
- **ビルド時**: JSON ファイル生成
- **グラフライブラリ**: Google Charts

### デプロイ
- **ホスティング**: GitHub Pages
- **CI/CD**: GitHub Actions
- **出力形式**: 静的HTML (next export)

---

## 実行コマンド

```bash
# 開発サーバー起動
npm run dev

# ビルド
npm run build

# MySQL → SQLite 変換
npm run db:convert

# SQLite → JSON 変換
npm run data:convert

# リンター実行
npm run lint
```

---

## ディレクトリ構成 (最終形)

```
chitonitose-next/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # ルートレイアウト
│   ├── page.tsx            # トップページ
│   ├── geo/                # 地理セクション
│   │   ├── page.tsx        # 地理トップ
│   │   ├── lessons/        # レッスンページ
│   │   └── exercises/      # 演習ページ
│   ├── jh/                 # 日本史セクション
│   └── wh/                 # 世界史セクション
├── components/             # Reactコンポーネント
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Navigation.tsx
│   ├── Breadcrumb.tsx
│   └── charts/             # グラフコンポーネント
│       ├── LineChart.tsx
│       ├── BarChart.tsx
│       └── GeoChart.tsx
├── content/                # MDXコンテンツ
│   ├── geo/
│   ├── jh/
│   └── wh/
├── data/                   # データファイル
│   ├── data.sqlite3        # SQLiteデータベース
│   └── json/               # 生成されたJSONファイル
│       ├── nations.json
│       ├── cities.json
│       ├── climate.json
│       └── ...
├── public/                 # 静的アセット
│   ├── images/
│   │   ├── geo/
│   │   ├── jh/
│   │   └── wh/
│   └── ...
├── scripts/                # ビルドスクリプト
│   ├── mysql-to-sqlite.js
│   └── sqlite-to-json.js
├── lib/                    # ユーティリティ
│   ├── dataLoader.ts       # データ読み込み
│   └── utils.ts
└── .github/
    └── workflows/
        └── deploy.yml      # デプロイワークフロー
```

---

## 進捗トラッキング

### 全体進捗: 約35%

| フェーズ | 進捗 | 状態 |
|---------|------|------|
| フェーズ0: プロジェクト初期化 | 100% | ✅ 完了 |
| フェーズ1: データベース移行 | 100% | ✅ 完了 (2026/01/26) |
| フェーズ2: 共通コンポーネント | 30% | 🔄 進行中 |
| フェーズ3: コンテンツ移行(地理) | 0% | 📋 計画中 |
| フェーズ4: コンテンツ移行(歴史) | 0% | 📋 計画中 |
| フェーズ5: グラフ機能 | 40% | 🔄 進行中 |
| フェーズ6: 機能追加・改善 | 0% | 📋 計画中 |
| フェーズ7: テスト・検証 | 0% | 📋 計画中 |
| フェーズ8: デプロイ・公開 | 0% | 📋 計画中 |
| フェーズ9: 運用・保守 | 0% | 📋 計画中 |

---

## 次のステップ (優先順位順)

1. ✅ **MySQL → SQLite 変換完了** (フェーズ1.1) - 完了
   - ✅ スクリプト実行完了
   - ✅ データ検証済み

2. **SQLite → JSON 変換スクリプト実装** (フェーズ1.2) - 次のタスク
   - サンプルグラフ用JSON生成
   - ニュースデータJSON生成
   - ページ情報JSON生成

3. **サンプルページでグラフ表示** (フェーズ1.3 + 5.1)
   - Google Charts 統合
   - 1ページで動作確認

4. **共通コンポーネント拡充** (フェーズ2)
   - ナビゲーション強化

5. **コンテンツ移行開始** (フェーズ3)
   - 地理レッスン 5ページ移行

---

## リスクと対策

### リスク1: ページ数が膨大 (400以上)
- **対策**: 優先順位をつけ、段階的に移行。重要ページから着手。

### リスク2: グラフデータの複雑さ
- **対策**: サンプルページで先行実装し、パターン化。

### リスク3: 画像ファイルの容量
- **対策**: Next.js Image コンポーネントで最適化。

### リスク4: SQLite ↔ JSON 変換の複雑さ
- **対策**: 必要なデータ構造を事前設計。JOIN等はSQL側で処理。

---

## 備考

- **作業ログ**: [PROGRESS.md](./PROGRESS.md) に詳細記録
- **リポジトリ**: chitonitose-next (GitHub)
- **オリジナルファイル**: origin/ フォルダに保管

---

最終更新: 2026年1月26日
