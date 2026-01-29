# Scripts ディレクトリ整理

## 使用中のファイル（保持）

### データベース関連
- `sqlite-to-json.js` - SQLiteデータをJSON形式に変換
- `json-to-sqlite.js` - JSONデータをSQLiteに変換
- `mysql-to-sqlite.js` - MySQLダンプをSQLiteに変換
- `import-sqljs.js` - SQL.jsでのインポート処理
- `import-to-sqlite.js` - SQLiteへのインポート処理
- `materialize-views.js` - ビューのマテリアライズ処理
- `add-views.js` - ビュー追加処理

### 変換・修正スクリプト（保持）
- `html-to-md.js` - **最終版HTML→MD変換スクリプト**（一行ずつパース）
- `markdown-to-html.js` - **MD→HTML変換スクリプト**（Next.jsで使用）
- `fix-lead-errors.js` - **:::leadエラー修正スクリプト**（320ファイル修正済み）
- `add-images-to-md.js` - **画像情報追加スクリプト**（250ファイル更新済み）

## 削除対象ファイル（開発中の試行錯誤ファイル）

### 古い変換スクリプト
- `convert.js` - 初期の変換試行
- `convert-all.js` - 一括変換（旧版）
- `convert-all-simple.js` - シンプル版（旧版）
- `convert-all-lessons.js` - レッスン変換（旧版）
- `batch-convert-jh.js` - jhフォルダ変換（旧版）
- `batch-convert-mdx.js` - MDX変換試行
- `html-to-md-clean.js` - クリーン版（旧版）
- `html-to-md-simple.js` - シンプル版（旧版）
- `html-to-custom-md.js` - カスタム版（旧版）
- `html-to-mdx.js` - MDX変換試行

### デバッグ・テストファイル
- `debug-lead.js` - leadエラーデバッグ
- `debug-parse.js` - パースデバッグ
- `test-fix.js` - 修正テスト（今回使用）
- `test-chain.js` - チェーンテスト
- `test-conversion.js` - 変換テスト
- `test-detail.js` - 詳細テスト
- `test-direct.js` - 直接テスト
- `test-fullfile.js` - 全体テスト
- `test-regex.js` - 正規表現テスト
- `test-section.js` - セクションテスト
- `test-single-line.js` - 単一行テスト
- `test-steps.js` - ステップテスト
- `test-sup.js` - supブロックテスト
- `test-氷河時代.js` - 氷河時代テスト

### MDX修正ファイル（MDX不使用のため削除）
- `fix-mdx-br.js` - MDX brタグ修正
- `fix-mdx-complete.js` - MDX完全修正
- `fix-mdx-multiline-tags.js` - MDX複数行タグ修正
- `check-mdx-issues.js` - MDX問題チェック

### テスト出力ファイル
- `test-output.html` - テスト出力HTML

## アクション
削除予定: 31ファイル
保持: 11ファイル
