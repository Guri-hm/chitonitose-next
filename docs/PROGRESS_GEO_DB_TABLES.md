# geo: html-to-md バグ修正 + DB連動表 実装の進捗（別環境引き継ぎ用）

作業日: 2026-08-31（このファイルの元になったセッション時点）

## 目的
元PHPサイトは `origin/chitonitose/geo/php/` 配下に約70種のスクリプトを持ち、
DBから取得したデータでテーブルやグラフをPHPで直接HTML出力していた。
使用頻度の高い上位4種（全体の9割超をカバー）をNext.js側で再現する。

- `statistics.php` … 207回使用（統計ランキング表）
- `basic_data.php` … 68回使用（国の基礎データ表）
- `export_items_lank.php` / `import_items_lank.php` … 各59回使用（貿易品目ランキング表）

## 完了したこと

### 1. `scripts/markdown-to-html.js` の `htmlToCustomMarkdown`（HTML→MD逆変換）のバグ修正
geoの元HTML→現在の `content/geo/lessons/*.md` を生成する変換処理に、複数の重大バグがあった。

- **gazo画像divが1行にまとまっている場合の読み飛ばしバグ**（最重要）:
  `<div class="gazo">...</div>` が改行なしで1行にまとまっている元HTML（geoではこれが大半）で、
  パーサーが「開始タグの次の行に画像がある」という誤った前提でコードを書いていたため、
  次の `</div>` を含む行に出会うまで見出しや段落を丸ごと読み飛ばしていた。
  例: `map_history.md` の「日本の地図の歴史」節（奈良時代・江戸時代）が丸ごと消えていた。
  → 同一行に `</div>` がある場合は自前で切り出すよう修正済み。
- **CRLF未正規化バグ**: 元HTMLがCRLFの場合、`</div>` 除去の正規表現が末尾の `\r` で不一致になり、
  `</div>` の残骸が本文テキストに混入していた。→ 関数冒頭で `\r\n`→`\n` 正規化を追加。
- **`<h4>` 見出しの出力形式不整合**: `<h4>...</h4>` のまま出力されており、`##`/`###` に変換される
  h2/h3と異なっていた。→ `#### ` 形式に統一。
- **閉じコメント `<!-- /contents -->` が無い元HTMLファイル**が1件存在
  （`geo_lessons_mountainous_landforms.html`）し、コンテンツ抽出に失敗していた。
  → `<!--\s*footer` をフォールバック境界として追加。
- **`<ul>/<li>` の素通しバグ**: リスト内の `<span onclick="chg(this)" class="all">`（クリック用語）や
  入れ子 `<div class="lead">` が変換されずサイト上で機能しなくなっていた。
  → `<li>` の中身を `convertDivContent()` 経由で変換するよう修正（`<ul class="...">` 自体はそのまま
  クラス維持のため素通し継続）。
- **画像 `src`/`data-src` 属性の並び順依存バグ**: `src` が `data-src` より先に書かれている元HTML
  （例: `China.html` の「中国の主要河川」の画像）で、実画像ではなく `../share/img/loading.svg`
  プレースホルダーの方を誤って拾っていた。→ `data-src` を常に優先するよう修正。

**既知の未修正課題**: 1つのgazo divに `<img>` タグが2つあるケース
（例: `China.html` の人口ピラミッド1970/2019年の2枚組）は最初の1枚しか抽出できず、
2枚目が後段に生HTMLとして漏れる。次回対応するなら `htmlToCustomMarkdown` のgazo処理を
複数img対応に拡張する。

### 2. `parseCustomMarkdown`（MD→HTML順変換）側の追加
- `htmlToCustomMarkdown` 内に、`<?php ... include('./php/XXX.php'); ?>` のうち
  `statistics` / `basic_data` / `export_items_lank` / `import_items_lank` の4種を検出し、
  `PHP_INCLUDE_DIRECTIVES` マップ + `parsePhpVars()`（PHP変数代入 `$name = value;` の汎用パース。
  `[1,2]` や `array(1,2)` のような配列表記もカンマ区切り文字列に変換して対応）で
  `::statistics{id="39" order="desc" limit="5" offset="0"}` のようなディレクティブに自動変換する
  処理を追加（it's生成される側なので、`node scripts/regenerate-geo-lessons.js` を再実行すると
  元HTMLから最新のロジックで作り直せる）。
- `parseCustomMarkdown` 側に、上記4ディレクティブを
  `<div class="lesson-{kind}-placeholder" data-xxx="...">` プレースホルダーに変換する処理を追加。
  属性名はHTML仕様でブラウザが小文字化するため camelCase→kebab-case 変換（`toKebab()`）をしている
  （`arr_linkedId` のようなcamelCaseを含むPHP変数名を扱う際の注意点）。
- **画像が表示されない別の実バグ**: gazo以外の場所（`<td>`/`<li>`内など）に散在する旧レイジーロード形式の
  `<img data-src="X" ... src="../share/img/loading.svg">` タグ（19ファイル・78箇所）が変換されずに
  残っており、実際のブラウザで画像が一切表示されない不具合になっていた。
  → `parseCustomMarkdown` の戻り値に対して `fixLazyloadImages()` という後処理パスを追加し、
  `data-src` を `src` に昇格・`img/` プレフィックス除去・`lazyload` クラス除去をするよう修正。

### 3. `lib/dataLoader.ts`
`BasicData` / `StatisticsInfo` / `StatisticsDataRow` / `TradeItem` 型と
`loadBasicData` / `loadStatisticsInfo` / `loadStatisticsData` / `loadExportItems` /
`loadImportItems` / `loadLessonDbDatasets` を追加。

**副産物のバグ修正**: 既存の `Nation` 型の `nation_cd` フィールドが実データ（`nations.json`、
実体は `nation_info` テーブル）と不一致（実際のキーは `cd`）だったため修正。
`app/charts/page.tsx` と `app/data-test/page.tsx` の参照箇所も追随修正済み。

### 4. `scripts/sqlite-to-json.js`
以下のテーブルにかかっていた人為的なLIMITを解除（プロトタイプ段階で仮に付けられていたもの）。

- `statistics_data`: LIMIT 100 → 全2941件。ファイル名も `statistics-data-sample.json` から
  `statistics-data.json` に変更（`_index.json` の参照も追随修正）。
- `export_items` / `import_items`: LIMIT 200 → 全319/300件。
- `urban_population`: LIMIT 200 → 全1205件。
- `basic_data`: 元テーブル（sqlite上のVIEW的なテーブル）に `people`（民族）列が無かったため、
  `nation_info` と `cd` でLEFT JOINして補完。

再実行コマンド: `node scripts/sqlite-to-json.js`

### 5. DBデータ→HTML変換は `lib/renderLessonDbTables.ts`（プレーン関数、React/JSX不使用）
`app/geo/[slug]/page.tsx` で `loadCustomLesson` 直後に
`renderLessonDbTables(lessonData.content, {...})` を呼び、プレースホルダーdivを実データのHTML文字列に
置換してから `GeoLessonContent` に渡している。

#### ★重要: なぜReactコンポーネント + クライアントマウント方式を採用しなかったか
最初は `components/lessons/BasicDataTable.tsx` 等をReactコンポーネントとして実装し、
既存の `LessonImage`/`LessonChart` と同じ「`GeoLessonContent` の `useEffect` 内で
`querySelectorAll` → `createRoot(placeholder).render(...)`」方式でマウントを試みた。

**しかし、このNext.js 15 + React 19の開発環境では、大きい `dangerouslySetInnerHTML` の
子孫ノードに対する `createRoot` マウントが謎の理由で全く反映されないという問題に遭遇した**:

- エラーは一切出ない
- `useEffect` は正しく実行される（console.logで確認済み）
- `querySelectorAll` は正しい件数のプレースホルダーを見つける
- `root.render()` も `flushSync()` で強制同期させても例外を投げない
- それでもDOMには一切反映されない（`innerHTML` が空のまま、`setAttribute` すら残らない）

試したが解決しなかったこと:
- React Strict Mode を無効化（`next.config.js` に `reactStrictMode: false`）
- 兄弟コンポーネント `TableOfContents`（DOM自己操作あり）を外す
- 単純な `<div>TEST</div>` のみを描画する最小テストへの置き換え

一方、**同じ手法の最小再現コード**（1個のplaceholderのみ、他に何も無い独立した専用テストページ
`app/test-mount/page.tsx` として作成→削除済み）では**問題なく動作した**。つまり、この
複雑な実ページ特有の何かが原因だが、根本原因は特定できていない。

次に、Reactコンポーネントを `react-dom/server` の `renderToStaticMarkup` でSSR文字列化する案を
試したが、Next.jsのwebpackローダーが
`You're importing a component that imports react-dom/server. To fix it, render or return
the content directly as a Server Component instead` というビルドエラーを出した
（共有libファイルからの `react-dom/server` importを一律禁止している模様）。

**最終的な結論**: これら3種の表（基礎データ・統計ランキング・貿易品目）は静的データからの
単純な表示のみで対話性が不要なため、Reactを使わずプレーンな文字列結合関数
（`lib/renderLessonDbTables.ts`）でHTML文字列を直接組み立てる方式に変更した。
ビルド時にHTML文字列へ焼き込むので上記のマウント不具合を完全に回避でき、SEO的にも有利。

#### ⚠️ 未解決の懸念（次回作業時に必ず確認すること）
上記の `createRoot` マウント不具合は、既存の `.lesson-chart-placeholder`
（`components/charts/LessonChart.tsx` + `GoogleChart.tsx`。Google Charts自体はブラウザAPI必須なので
Reactコンポーネント化が避けられない）や `.lesson-image-placeholder`（`components/LessonImage.tsx`）
にも同じ問題が起きる可能性が高い。

ただし現状は実害が出ていない:
- `content/**/*.md` に `::chart{` を実際に使っている箇所は現状ゼロ（`grep`で確認済み。
  つまりチャート機能は一度も実地で動作検証されていない可能性が高い）
- geoの画像は gazoディレクティブが直接 `<img>` タグを出力する方式で、プレースホルダー方式を
  使っていない

**今後 `::chart{}` を実際に使う、または画像をプレースホルダー化する場合は**、まずこの
マウント不具合を再現・解決するか、今回と同様にサーバーサイド文字列化方式に倒すか検討すること。

### 6. `lib/geoLessons.ts`
`toLesson()` のURLスラッグから `geo_lessons_` プレフィックスを除去
（`/geo/geo_lessons_map_history/` → `/geo/map_history/`）。ユーザー承認済み
（サイトがまだ本番公開前のURL構成のため実施可、という判断）。

### 7. `scripts/regenerate-geo-lessons.js`（新規、恒久スクリプトとして残す）
`content/geo/lessons/*.md` を対応する `origin/chitonitose/geo/geo_lessons_*.html` から
`htmlToCustomMarkdown` で一括再変換・上書きするスクリプト。
`scripts/markdown-to-html.js` を修正するたびに次のコマンドで再実行して反映させる運用:

```
node scripts/regenerate-geo-lessons.js
```

対応するhtmlが無いmdファイル（`template.md`など）はスキップされる。

## 動作確認の状況
- `npm run build` は成功する（exit code 0、427ページ生成）。
  - `jh/cultural-history/lessons/{1,2,3}.md` のMDXコンパイルエラーは**今回の作業と無関係の既存の別問題**。
    フォールバックUIが表示されるだけでビルド自体は失敗しない。
- ブラウザで `/geo/Africa_countries/` と `/geo/Southeast_Asia_countries/` を目視確認:
  - 基礎データ表（人口・面積・人口密度・GNI・公用語・宗教・首都）が正しいデータで描画される。
  - 統計ランキング表が正しいデータで描画される（`arr_year`/`arr_linkedId` を使う年比較列・連動列も
    `Southeast_Asia_countries` の「天然ゴムの生産」で動作確認済み）。
  - 輸出入品目ランキング表が正しいデータで描画される。
  - 画像（lazyload修正後）が正常に表示される。

## git状態（このファイル作成時点）
**このセッションの変更は一切コミットされていない。** `git status --porcelain` で約45ファイルが
変更（M）、3ファイルが新規（??）、1ファイルが削除（D）。

新規ファイル:
- `lib/formatNumber.ts`
- `lib/renderLessonDbTables.ts`
- `data/json/statistics-data.json`

削除ファイル:
- `data/json/statistics-data-sample.json`

主な変更ファイル:
- `scripts/markdown-to-html.js`, `scripts/sqlite-to-json.js`, `scripts/regenerate-geo-lessons.js`（新規）
- `lib/dataLoader.ts`, `lib/geoLessons.ts`
- `app/geo/[slug]/page.tsx`, `app/charts/page.tsx`, `app/data-test/page.tsx`
- `components/lessons/GeoLessonContent.tsx`
- `content/geo/lessons/*.md`（PHP directiveが実際に追加された一部ファイルのみ。以前のセッションで
  行ったgazo/CRLF系バグ修正による全84ファイルの再変換は、おそらく別途既にコミット済み）
- `data/json/basic-data.json`, `export-items.json`, `import-items.json`, `urban-population.json`,
  `_index.json`

## 残作業

未完了の作業は [TODO.md](../TODO.md) に集約した。以下の1〜6は後述の追記で対応済み（`createRoot`の件のみ
TODO.mdに残している）。

---

## 2026-09-06 追記: 上記1〜4を完了、5は未着手

### 完了したこと

1. **gazo divの複数画像対応**（`htmlToCustomMarkdown`）: `[...inner.matchAll(/<img\b[^>]*>/g)]` で
   全imgタグを抽出するよう修正。`China.md` の人口ピラミッド1970/2019年の2枚組が両方とも
   正しく表示されるようになった。
   - **副産物で発見・修正したバグ**: `parseCustomMarkdown`（順変換）に `<ul>/<li>` ブロックの
     専用ハンドラが無く、`<li>` 内に埋め込まれた `:::lead...:::` が1行ずつ処理されて変換されず、
     `:::lead` の文字列がそのまま画面に表示されるバグがあった（`China.md` の「56の民族」リスト等）。
     `<ul>`〜`</ul>` をブロックとしてまとめて取得し、`:::lead` 正規表現を適用してから
     `convertInlineMarkdown` するよう新規ハンドラを追加して解消。
2. **クリック用語正規表現の寛容化**: `convertHtmlToMarkdownInline` の4箇所の正規表現を
   `class="all">` → `class="all"[^>]*>` に変更。`projection.md`（サンソン等の図法名）が
   正しく `[[term]]` に変換されるようになった。`food_problems.md` の `<a href=... src="...">` は
   `<img>` ではなく実害が無いため未修正のまま許容（対応不要と判断）。
3. **`agriculture_self-sufficient.md`のラトソル**: 元HTML
   （`origin/chitonitose/geo/geo_lessons_agriculture_self-sufficient.html`、**別ネストGitリポジトリ**、
   ローカルコミット済み）に `class="all"` を追加して修正。`[[ラトソル]]` に正しく変換される。
4. **使用頻度2回以上の残り16種のPHPスクリプトを全て移行完了**（`land_use`, `city`,
   `immigration`, `industrial_population_structure`, `port_container`, `items_each_ports`,
   `food_self_sufficiency_rate`, `total_fertility_rate`, `aging_society`, `trade_balance`,
   `area_population`, `statistics_any_name_table`（既存`::statistics`に`hasNumCol`対応を追加して
   合流）, `statistics_nation_table`（`::statistics-compare{ids="..."}`として新設。
   `$json = json_encode([...])` という特殊呼び出し形式のため専用パーサーを実装）,
   `continental_altitude` / `jp_natural_environment`（元PHPがDBを使わず静的HTMLを出力していたと
   判明、固定HTML文字列として実装）。
   - **新たに発見・修正した仕組み上のバグ**:
     - `<?php` タグが開始行、実際のコード（`include(...)`含む）が次の行、という**複数行PHPブロック**
       が一部ファイルにあり（`tertiary_industry2.html`の`statistics_nation_table`呼び出し等）、
       従来は1行内に`<?php...?>`が完結する前提だったため変換されず生PHPコードが漏れていた。
       →`?>`が見つかるまで複数行を結合してから処理するよう修正。
     - `statistics_nation_table.php`は`statistics_data`ではなく別テーブル`statistics_changes_data`
       (`nation_cd`,`value`,`arrange_unit`による単位換算あり)を参照することが判明。新規JSON
       (`statistics-changes-data.json`)を追加してこちらを参照するよう実装。
   - **データベース自体の誤りを発見・修正**: `port_container`テーブルで「プサン(釜山)」の
     `nation_cd`が156（中国）になっていた（正しくは410・韓国）。`data.sqlite3`を直接UPDATEし、
     JSON再出力して解消（`data.sqlite3`はgit管理下、変更はコミット済み）。
   - `scripts/sqlite-to-json.js`に10個の新規テーブルのエクスポートを追加
     （`land-use.json`, `immigration.json`, `industrial-population-structure.json`,
     `port-container.json`, `port-info.json`, `port-transaction-value.json`,
     `items-each-ports.json`, `food-self-sufficiency-rate.json`, `total-fertility-rate.json`,
     `birth-rate.json`, `statistics-changes-data.json`）。
   - `lib/dataLoader.ts`に対応する型・ローダー・`loadLessonDbDatasets()`への統合を追加。
   - `lib/renderLessonDbTables.ts`に各テーブル用の描画関数を追加（Reactコンポーネントは使わず、
     既存方針どおりプレーンな文字列結合関数）。
5. `npm run build` 成功（427ページ生成）を確認。ブラウザで以下を目視確認済み:
   `Europa_countries1`（land-use/total-fertility-rate/aging-society/immigration）、
   `China`（複数画像gazo・港湾コンテナ・面積人口ランキング）、
   `tertiary_industry2`（statistics-compare鉄道輸送量比較）、
   `Japan5`（items-each-ports港別貿易額）、`food_problems`（食料自給率）、
   `Oceania`（city都市人口）、`Africa`/`Japan1`（continental-altitude/jp-natural-environment固定表）。

### 移行状況の補足

- 残りの低頻度PHPスクリプトを精査した結果、テーブル描画パターンに当てはまるものは出尽くした。
  残るのは移行対象外と判断したもののみ（e-Stat外部API依存の`getXML_API.php`・`jp_population.php`・
  `jp_3age_categories_prefecture.php`等、データ準備用の`set_per_capita_gni_variable.php`）。
- `eu` / `wood_area` / `import_partners_each_items` / `urban_population` は追加実装済み。
- `origin/chitonitose` は**別のネストされたGitリポジトリ**（`.gitmodules`には未登録の生gitlink）。
  中を編集した場合は `cd origin/chitonitose && git add/commit` を忘れないこと
  （親リポジトリ側は単にgitlinkの参照が変わるだけで、差分の中身は追えない）。

### ✅ GoogleChartグラフが一切表示されない不具合を修正（追記）

`::chart{}`ディレクティブ自体とレンダリング基盤（`LessonChart`/`GoogleChart`/`loadLessonChartDatasets`）は
以前のセッションで実装済みだったが、以下2つの理由で実際には一切機能していなかった:

1. **`htmlToCustomMarkdown`（逆変換）が元HTMLの`<script>createChartAsync(...)</script>`+
   `<div id="...">`のペアを`::chart{}`に変換する処理を持っていなかった**ため、
   `content/geo/lessons/*.md`には生の`<script>`/`<div>`がそのまま残っていた
   （ブラウザは`dangerouslySetInnerHTML`経由で注入された`<script>`を実行しないため無害化されるだけ）。
   → `convertChartScripts()`を追加し、`power_generation.php`（円グラフ、25箇所・12ファイルで使用）を
   対象に自動変換するようにした。scriptとdivが同じ行の近くにあるとは限らない
   （`Industry.html`は全script→全divの順でまとまっている）ため、2パス構成
   （script側を除去しつつtargetIdごとの変換結果をMapに記録→対応するdivを置換）にしている。
   `Chart.Pie`のような元サイトの型名をGoogle Charts本来の`PieChart`名に変換する
   `CHART_TYPE_MAP`も追加（この変換漏れも表示されない原因の一つだった）。
2. **`GeoLessonContent`が`.lesson-chart-placeholder`を`dangerouslySetInnerHTML`の子孫ノードに対して
   `createRoot`でマウントしていた**ため、DBテーブルのときと全く同じ`createRoot`未定義動作
   （facebook/react#32774）に該当し、プレースホルダー自体は正しく出力されていてもReactが
   一切マウントされていなかった（`querySelectorAll('.lesson-chart-placeholder')`はヒットするが
   `childCount`は常に0）。
   → `GeoLessonContent`を全面的に書き換え、`htmlContent`文字列を`.lesson-chart-placeholder`の
   位置で分割し、HTML断片は`<div style="display:contents" dangerouslySetInnerHTML>`で、
   チャート部分は`<LessonChart>`を**最初から本来のReact子要素として**（`dangerouslySetInnerHTML`の
   外側で）レンダリングするよう変更。`display:contents`によりラッパーdiv自体は見た目上
   レイアウトに影響を与えない。画像プレースホルダー（`.lesson-image-placeholder`、現状geoでは未使用）の
   `createRoot`マウント処理は変更していない（現状実害なしのため、根本修正は将来必要）。

ブラウザで`/geo/energy_resources/`（カナダ/ノルウェー/ブラジル/フランスの円グラフ）と
`/geo/Industry/`（scriptとdivが離れているケース）で実際にGoogle Charts製の円グラフ（SVG）が
描画されることを確認済み。対象は`power_generation.php`のみ（他のエンドポイント、
例えば`Chart.Bar`+`statistics_ids`系の棒グラフ等は今回未対応。必要になれば
`CHART_ENDPOINT_CONFIGS`に追記し、`convertChartScripts()`と同じパターンで追加する）。

### ✅ 残り全グラフエンドポイントの実装完了（追記）

上記のpower_generation限定対応の後、「未対応のグラフエンドポイントを全て対応してほしい」という
依頼を受け、geo配下で実際に到達可能なレッスンページで使われている**グラフ埋め込み関数を4種類**
（元々`createChartAsync`のみ対応していたが、他に3種類の別関数が使われていることが判明）
全てに対応した。

**発見した4種類のグラフ埋め込み関数と対応内容**:
1. `createChartAsync(Chart.XXX, {params}, 'targetId', {options}, "./php/YYY.php")` —
   power_generationに加え、`statistics_bar2`/`statistics_bars2`/`statistics_combo`/
   `statistics_highest`/`wood_type`/`wood_use`/`wood_use_comparison`/`wood_supply`/
   `forestry_worker`/`fish_catche`系3種/`foreign_population`系2種/`ha_per_farmer`/
   `production_per_ha`/`agricultural_work_force`/`region_agricultural_production`/
   `Korea_gdp`/`river_flow_rate`/`export_items_bar`/`different_statistics_json`の
   22エンドポイントを追加。
2. `fetchChart(phpPath, {method,body:JSON.stringify(...)}, Chart.XXX, {options}, 'targetId')` —
   引数順序が異なる別関数。`statistics_any_name.php`（18箇所で使用）に対応。
   未対応の`jp_prefectures_statistical_data_json.php`（日本地図の色分け、Chart.Geo）は
   対象外のまま安全に除去する。
3. `lineChartAsync(statisticsId, [nationCd,...], 'targetId', {options})` — phpパスが
   呼び出し側に現れずJS関数内部にハードコードされている専用関数。`statistics_line`という
   固定dataset名で対応。
4. `google.charts.load(...)`/`google.load(...)`＋`google.visualization.arrayToDataTable([...])`を
   直接呼ぶ、PHPを介さないデータ直書きの手書きチャート（China.md「一次エネルギー構成」、
   world_population.md「地域別人口の推移」等7ファイル）。`dataset="static"`として、
   静的な`data`配列と`options`オブジェクトをそのまま`params`に埋め込んで再現。

**⚠️ 重要な追加発見（実行時エラーによるページクラッシュ）**: 当初「未対応のエンドポイントは
生scriptのまま残しても`dangerouslySetInnerHTML`経由なので無害」という前提だったが、これは
**誤りだった**。Next.jsは`output:'export'`（静的HTML）のため、`dangerouslySetInnerHTML`の
内容は最終的に**実HTMLファイルにそのまま書き出され、ブラウザの通常のHTML解析時に
`<script>`タグが実行される**（動的に`.innerHTML=`する場合とは異なる）。そのため、
`createChartAsync`/`fetchChart`/`lineChartAsync`のいずれも、変換できない（対応表に無い）
呼び出しを生scriptのまま放置すると「XXX is not defined」という実行時エラーで
**ページ全体がクラッシュする**（Next.jsのエラーオーバーレイが表示される）ことが判明。
→ 全ての変換関数を「対応表に無い場合でも呼び出し自体は必ず除去する」方式に修正
（ディレクティブを生成しないだけで、scriptタグの中身は必ず空にする）。

**その他に発見・修正した実装バグ**:
- `GoogleChart.tsx`に「1ページに複数チャートが同時マウントされるとgstatic loaderスクリプトを
  複数回読み込み、`google.charts.load`のコールバック登録が競合し`google is not defined`に
  なる」という実在の競合バグを発見。モジュールレベルの単一Promiseでローダー読み込みを
  1回に集約するよう修正（`loadGoogleChartsOnce()`）。
- `statistics_bars2`（複数`statistics_ids`指定時）の実データ確認で、各idは実は「ある年の
  スナップショット」を表し、`nation_name`列がカテゴリ名（輸入先国名・産業分類名等）として
  転用されていることが判明（例: id=84→「日本の木材輸入先(1965年)」）。当初「日本のみに絞った
  純粋な時系列」と誤って実装しており、データが見つからず表示されなかった。正しくは
  各idの`data_name`から年を抽出し、年を横軸にした構成比（100%積み上げ棒）として実装し直した。
- `<script>`タグの検出正規表現が`type="text/javascript"`属性必須になっていたため、
  属性無しの`<script>`（`fetchChart`/`google.load`系で使用）や、`type="text/javascript"`以外の
  属性を持つタグを見逃していた。`<script[^>]*>`に緩和して対応。

**対象範囲外として意図的に除外したもの**（`Chart.Geo`系の世界地図は2026-10-31に`geo_statistical_data_*`として
実装済み。`lib/geoStatistics.ts`参照）:
- `jp_prefectures_statistical_data_json`（日本地図の色分け）は`tertiary_industry.html`内でスクリプトを除去しているだけ（TODO.md参照）。
- `fetchData('./php/request.php', ...)`（`geo_visualize_population.html`のみ、元サイトでも到達不可）は未対応。

新規実装したデータ層: `sqlite-to-json.js`に12テーブル追加
（`wood_use`/`wood_supply`/`forestry_worker`/`fish_catche`/`foreign_population`/`nationality`/
`production_per_ha`/`region_agricultural_production`/`region_info`/`per_unit_of_gdp`/
`river_flow_rate`/`river_info`）。`lib/dataLoader.ts`に対応する型・ローダーと
`loadLessonChartDatasets()`への統合を追加。データ整形ロジックは`lib/chartBuilders.ts`
（新規、23個のbuilder関数を`CHART_BUILDERS`レジストリに登録）に集約し、`LessonChart.tsx`は
`dataset`名でbuilderを呼び出すだけの薄いディスパッチャに書き換えた
（DBテーブルの`renderLessonDbTables.ts`と同じアーキテクチャパターン）。

ブラウザで28ページ（全対象ページ）を自動巡回し、`pageerror`イベントとSVG描画数を確認。
全ページでコンソールエラー0件・SVG描画あり（1〜20個）を確認済み。`npm run build`も成功
（既存の無関係なjh MDXエラーのみ、exit code 0）。

### `createRoot` マウント不具合の根本原因が判明（解決済み・要恒久対応）

React公式リポジトリで該当する変更を発見した:
[facebook/react PR #32774「Warn for using a React owned node as a Container if it also has text content」](https://github.com/facebook/react/pull/32774)
（React 19系にマージ済み）。

> `dangerouslySetInnerHTML`（または`children`）を設定したDOMノードに対して、`ref`経由で
> 手動で子要素を追加したり、`createRoot`/`createPortal`のコンテナとして使うことは**未定義動作**。
> 特に`dangerouslySetInnerHTML`の場合、Reactが内部的に「反応的に更新」するたびに手動追加した
> DOM要素が消される。**それがいつ起こるかは保証されない。**

これが今回の症状（エラーなし・`querySelectorAll`は要素を発見・`render()`も例外なし・
だがDOMには何も反映されない）と完全に一致する。`GeoLessonContent`は`dangerouslySetInnerHTML`で
本文を描画しつつ、その子孫ノードに対して`createRoot`でマウントしていたため、この
「未定義動作」に該当していた。単純な最小再現（プレースホルダー1個だけの独立ページ、大きい
ダミーHTMLを詰めたページ）では再現しなかったが、実ページでは`TableOfContents`の自己DOM操作や
`Header`のスクロール状態変化などによる再コミットのタイミングで発生していたと考えられる
（再現条件は非決定的、というのがReact開発チームの説明と一致）。

**結論**: 今回DBテーブル3種で採用した「サーバー側で文字列としてHTMLを組み立てて
`dangerouslySetInnerHTML`に最初から含めてしまう」方式（`lib/renderLessonDbTables.ts`）が
唯一の正しい回避策。**既存の`.lesson-chart-placeholder`（`LessonChart`+`GoogleChart`）・
`.lesson-image-placeholder`（`LessonImage`）も同じ未定義動作のリスクを抱えている。**
今後これらを本格的に使う場合は、次のいずれかの対応が必要:

1. Google Chartsのように対話性・ブラウザAPIが必須な場合は、`dangerouslySetInnerHTML`の
   **外側**（`ref`で管理された別の兄弟要素、もしくは`createPortal`で本文と重ならない別DOM）に
   マウントするよう構造を変更する。
2. 静的な表示だけで良い場合（今回のDBテーブルのように）は、Reactを使わずビルド時に
   HTML文字列へ焼き込む方式に倒す。

