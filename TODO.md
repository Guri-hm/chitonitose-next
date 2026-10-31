# 残作業（唯一の一覧）

> **残作業はこのファイルだけで管理する。** `docs/` 配下の `*.md`（PROGRESS*.md / ROADMAP.md など）は
> 作業の経緯・設計メモとして残しているだけで、そこに未完了タスクは書かない。
> 作業が終わったらこのファイルの項目を消し、新しい残作業はここに追記する。
>
> 最終整理: 2026-10-31（旧ドキュメントの未完了項目を現状のコードと突き合わせて再確認済み）

## 1. 公開・運用

- テスト公開中: `https://test.solopg.com/`（GitHub Pages、`public/CNAME`、`.github/workflows/deploy.yml`）。
  テスト中は `NEXT_PUBLIC_NOINDEX=true`（noindex＋`robots.txt`でDisallow）にしている
- GitHub Pagesの **Settings → Pages → Source は「GitHub Actions」** にしておくこと
  （「Deploy from a branch」だとワークフローの成果物（`out/`）ではなくリポジトリ直下が公開される）
- [ ] AdSense：自動広告の形式を見直す（推奨設定は下記「AdSense設定の方針」）
- [ ] 公開後の確認：CLS（PageSpeed Insights）、GTMタグ発火、AdSenseの広告表示

### 本番ドメイン（chitonitose.com）への切り替え手順

1. （前日まで）DNSのTTLを300秒程度に短縮。Search Consoleは旧サイトのまま所有権確認済みか確認
   （確認用ファイル `public/google20e3b5533c8454ba.html` を移してある）
2. コード側（1コミット）：`public/CNAME` を `chitonitose.com` に、`deploy.yml` の `SITE_URL` を
   `https://chitonitose.com` に変更し、`NEXT_PUBLIC_NOINDEX` の行を削除してpush
3. GitHub：Settings → Pages → Custom domain を `chitonitose.com` に変更
4. DNS（ネームサーバーを管理している場所で。お名前.comのDNSか、さくらのDNSかは要確認）：
   - apex（`chitonitose.com`）のAレコードを、さくらのIPから GitHub Pages の
     `185.199.108.153` / `185.199.109.153` / `185.199.110.153` / `185.199.111.153` の4つに置き換える
     （IPv6を使うならAAAAも `2606:50c0:8000::153` 〜 `8003::153`）
   - `www` はCNAMEで `guri-hm.github.io`
   - **MX・TXT（メール／SPF）レコードは触らない**
5. Pages画面の「DNS check successful」を待ち、「Enforce HTTPS」をON（証明書の発行に数分〜数時間）
6. 確認後、Search Consoleでsitemap（`/sitemap.xml`）を送信。さくらのサーバーは、しばらく解約せず残す
   （独自ドメインを外しても `*.sakura.ne.jp` で旧ファイルを見られ、切り戻しやメール用に使える）

### 旧URLの扱い

GitHub Pagesはサーバー側の301リダイレクトが使えない。代わりに次の方式で旧URLを維持している。

- 旧ページ（`/geo/geo_lessons_plain.html` など426件）：`data/legacy-urls.json` の対応表から、
  ビルド後（`scripts/postbuild.mjs`）にリダイレクト用のHTMLを生成（meta refresh＋JS＋canonical。
  `?unit=` などのクエリは引き継ぐ）。対応表は `node scripts/generate-legacy-urls.mjs` で再生成できる
- 画像・PDF：転送ではなく、旧サイトと同じURLにファイルを置いている
  （`/geo/img/…`、`/jh/img/…`、`/wh/img/…`、`/jh/pdf/jh_print/…`、`/wh/pdf/wh_print/…`、`/share/img/…`）
- 対応していないもの：`/mail/mail.php`、`news.php` などPHPファイル。旧サイトで存在しなかったURLは404
- より確実な301が必要になったら、DNSをCloudflare（無料）経由にしてRedirect Rulesを使う方法がある

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
      `createRoot` でマウントしている（React 19で未定義動作。経緯は `docs/PROGRESS_GEO_DB_TABLES.md`）。
      チャートと同様に本文の外側へ出す、またはビルド時にHTML化する
- [ ] ヘッダーのリサイズ時ちらつきの根本原因が未特定（`docs/PROGRESS_HEADER_UX.md`）
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

## 5. リポジトリの整理（残り）

- [ ] `sqlite-tools/`（sqlite3.exe 等のバイナリ4個）がリポジトリに入っている。PATHのsqlite3で足りるなら削除
- [ ] `data/` の `database.sql` / `import.ps1`、`origin/*.sql`（MySQLダンプ）は移行元データ。移行が完全に終わったら削除または別保管
- [ ] `scripts/` の残りは `package.json` のコマンドと変換ツール（`batch-convert-jh-*` / `regenerate-geo-lessons` /
      `markdown-to-html` / `convert-images-to-webp`）、DB補助（`materialize-views` / `import-sqljs` / `import-to-sqlite`）。
      不要と判断できたものから削除
- [ ] `public/css/content_common.css` に、削除済みコンポーネント（`ImageModal` / `OptimizedImage`）向けの
      ダークモード指定が残っている（無害。必要なら削除）

## AdSense設定の方針（2026-10-31時点の推奨）

サイトの構成（ヘッダー常時表示、モバイルは画面左下にFAB、ページ末尾に手動のMultiplex枠1つ）を踏まえた推奨。

| 項目 | 推奨 | 理由 |
|---|---|---|
| 自動広告 | ON | 前提 |
| ページ内：バナー | ON | 主力。本文を邪魔しにくい |
| ページ内：Multiplex | OFF | ページ末尾に手動のMultiplex枠（`AdUnit.tsx`）が既にあり、自動と重複して広告過多になる |
| オーバーレイ：アンカー | OFF | 画面下に固定され、モバイルの左下FAB・読み進める操作と干渉。常時固定のヘッダーと合わせて画面が狭くなる |
| オーバーレイ：全面広告 | OFF | 画面遷移時に学習を中断させ、離脱・CLS悪化の原因 |
| オーバーレイ：サイドレール | 様子見（迷うならOFF） | 広い画面の余白に出るだけだが、3カラムのレイアウトと重なって見えないか確認してから |
| 広告インテント | OFF（効果を見てから） | 検索意図に連動する追加の広告UI。学習サイトでは優先度が低く、まず上記だけで計測する |

あわせて：自動広告の「広告の読み込み量」は低〜中に抑える。`public/ads.txt` は元サイトのものを移した
（AdSenseのads.txt警告対策）。テストドメイン（`test.solopg.com`）は、AdSenseの「サイト」に追加するまで広告は出ない。

## 完了済み（最近）

- 2026-10-31 授業ページの選択肢（`span.choice`）のクリック表示が動かない不具合を修正（`TermClickHandler`・`AnswerButtons`・
  CSS。表記説明の下線部が二重に切り替わる不具合も同時に修正）
- 2026-10-31 教科トップのアイコンが円で見切れる不具合を修正（`clip-path`）
- 2026-10-31 旧URLの維持：画像・PDFを旧サイトと同じURLに移動、旧ページ426件のリダイレクト生成、
  `sitemap.xml`・`robots.txt` の自動生成（`scripts/postbuild.mjs`）

- 2026-10-31 リポジトリ整理：作業ログ・バックアップ・テスト用ページ（`/test-ruby` `/data-test` `/charts`）・
  未使用コンポーネント・旧変換スクリプト・デバッグスクリプトを削除。旧レポート類は `docs/` に移動
- 2026-10-31 教科トップのアイコン（`.study`）のダークモード対応、壊れていた画像参照（`plain.md` ほか）、
  `/jh/exercises/q-a` の誤リンク、`favicon.ico` を修正
- 2026-10-31 テスト公開用に noindex を設定
- 2026-10-31 地理「演習・その他」11ページを実装（雨温図／ハイサーグラフの演習・地図での演習、地形断面、
  国の位置クイズ3種、統計データ3種）。`components/geo-exercises/`・`lib/geoExercises.ts`・`lib/geoStatistics.ts`・
  `public/quiz-maps/`。サイドバーにも「演習・その他」を追加
- 2026-10-31 日本史・地理・世界史トップのdt／h2、ヘッダーの文字サイズ選択表示、空欄の下線、
  画像の背景色（透過画像）のダークモード対応
- 2026-10-31 AdSenseの `<ins>` によるハイドレーション警告を抑止（`components/AdUnit.tsx`）
