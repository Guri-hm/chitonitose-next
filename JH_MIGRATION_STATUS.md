# 日本史ページ移植進捗状況

## 完了した作業

### 1. レッスンページの構造修正（2026-02-05）

- **平成時代セクションの追加**
  - `app/jh/page.tsx`に平成時代（No.170）のセクションを追加
  - 画像: `/share/img/heisei.jpg`
  - レッスン範囲: No.170のみ

- **その他セクションの追加**
  - PDFの配布
  - 役立つコンテンツ（旧国名、歴代首相、組閣中の出来事）

### 2. 復習・演習ページの基礎構造作成

#### 短期攻略（26ページ）
- パス: `/jh/omnibus/[id]`
- ファイル: `app/jh/omnibus/[id]/page.tsx`
- 状態: ✅ ルーティング完了、❌ コンテンツ未移植
- 元ファイル: `origin/chitonitose/jh/jh_omnibus*.html`

#### テーマ史（4ページ）
1. 文化史（飛鳥文化～室町文化）
   - パス: `/jh/cultural-history/1`
   - 元ファイル: `jh_omnibus_cultural_history1.html`
   
2. 文化史（桃山文化～化政文化）
   - パス: `/jh/cultural-history/2`
   - 元ファイル: `jh_omnibus_cultural_history2.html`
   
3. 文化史（明治～現代）
   - パス: `/jh/cultural-history/3`
   - 元ファイル: `jh_omnibus_cultural_history3.html`
   
4. 農業・産業史
   - パス: `/jh/agriculture-industrial-history`
   - 元ファイル: `jh_omnibus_agriculture_industrial_history.html`

状態: ✅ ルーティング完了、❌ コンテンツ未移植

#### 一問一答（18ページ）
- パス: `/jh/q-a/[id]`
- ファイル: `app/jh/q-a/[id]/page.tsx`
- 状態: ✅ ルーティング完了、❌ コンテンツ未移植
- 元ファイル: `jh_exercises_q_a.html?unit=[1-18]`
- 注意: 元はクエリパラメータで実装されていたが、Next.jsではルートパラメータに変更

### 3. その他ページの基礎構造作成

#### PDFの配布
- パス: `/jh/print`
- ファイル: `app/jh/print/page.tsx`
- 状態: ✅ ルーティング完了、❌ コンテンツ未移植
- 元ファイル: `jh_print.html`

#### 役立つコンテンツ
1. 旧国名
   - パス: `/jh/old-country-name`
   - 元ファイル: `jh_old_country_name.html`
   
2. 歴代首相
   - パス: `/jh/cabinet`
   - 元ファイル: `jh_cabinet.html`
   
3. 組閣中の出来事
   - パス: `/jh/cabinet-events`
   - 元ファイル: `jh_cabinet2.html`

状態: ✅ ルーティング完了、❌ コンテンツ未移植

## 次のステップ（優先順位順）

### 優先度: 高
1. **レッスンNo.170のコンテンツ移植**
   - 元ファイル: `origin/chitonitose/jh/jh_lessons170.html`
   - MDXファイル作成: `content/jh/lessons/170.md`
   - データベースへの登録

2. **短期攻略ページのコンテンツ移植**（26ページ）
   - 各HTMLファイルからコンテンツを抽出
   - MDXまたは独自形式での保存
   - データベースへの登録（必要に応じて）

### 優先度: 中
3. **テーマ史ページのコンテンツ移植**（4ページ）
   - 文化史の3ページ + 農業・産業史

4. **一問一答システムの実装**
   - データベース構造の確認・設計
   - インタラクティブなQ&A機能の実装
   - 18ユニット分のデータ移植

### 優先度: 低
5. **PDFファイルの移植**
   - PDF配布ページの実装
   - ファイルのホスティング設定

6. **役立つコンテンツの移植**
   - 旧国名の表・地図
   - 歴代首相の一覧表
   - 組閣中の出来事の年表

## 技術的メモ

### ファイル構造
```
app/jh/
├── page.tsx                              # メインページ（完了）
├── lessons/[id]/page.tsx                 # レッスンページ（既存）
├── omnibus/[id]/page.tsx                 # 短期攻略（新規作成）
├── cultural-history/[id]/page.tsx        # テーマ史-文化史（新規作成）
├── agriculture-industrial-history/page.tsx # テーマ史-農業産業史（新規作成）
├── q-a/[id]/page.tsx                     # 一問一答（新規作成）
├── print/page.tsx                        # PDF配布（新規作成）
├── old-country-name/page.tsx             # 旧国名（新規作成）
├── cabinet/page.tsx                      # 歴代首相（新規作成）
└── cabinet-events/page.tsx               # 組閣中の出来事（新規作成）
```

### データベース対応
- `data.sqlite3`の`page`テーブルにNo.170のデータ追加が必要
- 短期攻略、テーマ史、一問一答用のテーブル設計が必要な可能性

### 元ファイルの場所
`origin/chitonitose/jh/` ディレクトリ内:
- `jh_lessons*.html` - レッスンページ
- `jh_omnibus*.html` - 短期攻略・テーマ史
- `jh_exercises_q_a.html` - 一問一答
- `jh_print.html` - PDF配布
- `jh_old_country_name.html` - 旧国名
- `jh_cabinet.html` - 歴代首相
- `jh_cabinet2.html` - 組閣中の出来事
