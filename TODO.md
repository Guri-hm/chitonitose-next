# 残作業（唯一の一覧）

> **残作業はこのファイルだけで管理する。** 他の `*.md`（PROGRESS*.md / ROADMAP.md など）は
> 作業の経緯・設計メモとして残しているだけで、そこに未完了タスクは書かない。
> 作業が終わったらこのファイルの項目を消し、新しい残作業はここに追記する。
>
> 最終整理: 2026-10-31（旧ドキュメントの未完了項目を現状のコードと突き合わせて再確認済み）

## 1. 公開・運用（コード外／手動）

- [ ] AdSense管理画面でAuto adsをON（「ページ内広告」のみ有効、アンカー広告・インタースティシャルはOFF）
- [ ] GitHubへの移行：リポジトリ設定、GitHub Pages（basePath／カスタムドメイン）、`.github/workflows` の動作確認
- [ ] 公開後の確認：AdSense審査・広告表示、CLS（PageSpeed Insights）、GTMタグ発火
- [ ] 現在のローカル変更はすべて未コミット（`git status`）。レビュー後にコミット

## 2. コンテンツ未移行（`準備中` と表示されているページ）

- [ ] `/jh/cabinet`：昭和以降の歴代内閣（`app/jh/cabinet/page.tsx`、元: `origin/chitonitose/jh/jh_cabinet.html`）
- [ ] `/jh/cabinet-events`：組閣中の出来事（`app/jh/cabinet-events/page.tsx`、元: `jh_cabinet2.html`）
- [ ] `/jh/agriculture-industrial-history`：農業・産業史（`app/jh/agriculture-industrial-history/page.tsx`、
      元: `jh_omnibus_agriculture_industrial_history.html`）
- [ ] 世界史のテーマ史・短期攻略は `content/wh/omnibus` が1本のみ。元サイトに対応ページがあるか確認し、あれば移行
- [ ] 地理の `tertiary_industry` 系ページにある日本地図の色分け（`jp_prefectures_statistical_data_json`、Chart.Geo）。
      現在はスクリプトを除去しているだけで描画されない
- 参考（対応不要）：元サイトの `geo.html` からリンクされていない地理レッスン
  （`agriculture_trade` / `asia` / `Indonesia` / `Japan_MAFF` / `Japan_natural_environment` / `resource_trade` / `template`）は
  新サイトにも載せていない。載せる場合は `lib/geoLessons.ts` に追加し `content/geo/lessons/` へ変換
- 参考（対応不要）：`geo_visualize_population.html`（元サイトでも到達不可）、e-Stat外部API依存のPHP
  （`getXML_API.php` 等。e-Statの値は `lib/estat.ts` でビルド時に解決）

## 3. 不具合・技術的負債

- [ ] `components/lessons/GeoLessonContent.tsx`：画像プレースホルダーを `dangerouslySetInnerHTML` の子孫に
      `createRoot` でマウントしている（React 19で未定義動作。経緯は `PROGRESS_GEO_DB_TABLES.md`）。
      チャートと同様に本文の外側へ出す、またはビルド時にHTML化する
- [ ] ヘッダーのリサイズ時ちらつきの根本原因が未特定（`PROGRESS_HEADER_UX.md`）
- [ ] 561〜767px幅でモバイルFAB（クイックアクセス）が出ない
- [ ] `/jh/cultural-history/1〜3` の再生成後の見た目（画像・`:::lead`）が未確認
- [ ] `content/jh/lessons/54.md`・`145.md`（未閉じディレクティブ／空行後の閉じタグ）、`69.md`・`72.md` を目視確認
      （`npm run build` 自体はMDXエラーなしで通る）
- [ ] ビルド後は `MDX ERROR` / `Failed to load` をログでgrep（エラーがあっても終了コードが0になるため）
- [ ] `lib/remark-custom-directives.*` のテストケース追加（入れ子・境界ケース）、CIで `npm run build` を実行
- [ ] `content/jh/lessons/*.md` のfrontmatter `title` が166件「タイトル未設定」（表示はDBのタイトルを使うため実害なし。整理するだけ）
- [ ] 地理 `China.md` 等のgazo内画像・`food_problems.md` の `<a ... src>` など軽微な変換残り（表示上は無害）

## 4. 機能追加（任意）

- [ ] トップの「お知らせ」全履歴を見せるアーカイブページ（現在は直近10件のみ）
- [ ] NoCloudPDFの公式ロゴ（現在は汎用SVGで代用）
- [ ] 地理の演習・統計ページの目視確認の追加（`geo_statistical_data_animal` / `crops` の全チャート、
      国の位置クイズのスマホ操作）
- [ ] サイト内検索の拡充、パンくずリスト、OGP・サイトマップ
- [ ] Lighthouse・クロスブラウザ（Chrome / Firefox / Safari / Edge）・リンク切れチェック
- [ ] 運用ドキュメント（MDX編集ガイド、データ更新手順、ビルド・デプロイ手順）、SQLiteのバックアップ

## 5. リポジトリの整理候補（削除してよいか要確認）

- ルート直下の作業ログ：`build.log` / `build_out2.txt` / `test-clean.md` / `test-output.md` / `test-ruby-terms.md` / `package.json.test`
- `lib/remark-custom-directives.js.backup*`、`lib/remark-temp.mjs`、`scripts/convert-omnibus-simple.js.orig`
- 旧レポート類（`BATCH_CONVERSION_REPORT.md` / `WEBP_CONVERSION_REPORT.md` / `IMAGE_PATH_FIX.md` など）は履歴として残すか `docs/` へ移動

## 完了済み（最近）

- 2026-10-31 地理「演習・その他」11ページを実装（雨温図／ハイサーグラフの演習・地図での演習、地形断面、
  国の位置クイズ3種、統計データ3種）。`components/geo-exercises/`・`lib/geoExercises.ts`・`lib/geoStatistics.ts`・
  `public/quiz-maps/`。サイドバーにも「演習・その他」を追加
- 2026-10-31 日本史・地理・世界史トップのdt／h2、ヘッダーの文字サイズ選択表示、空欄の下線、
  画像の背景色（透過画像）のダークモード対応
- 2026-10-31 AdSenseの `<ins>` によるハイドレーション警告を抑止（`components/AdUnit.tsx`）
