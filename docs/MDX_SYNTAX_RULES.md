# MDX構文ルール - chitonitose-next

## 基本原則

1. **MDXは`{...}`をJavaScript式として解釈する** - `{.class}`のような構文は使用不可
2. **remark-directiveを使用する** - `:::directive{attribute="value"}`構文を使用
3. **ネスト構造は正確に** - 開始タグと閉じタグの数を厳密に一致させる
4. **ネストされたディレクティブの閉じタグ** - 最も内側のディレクティブから順に`:::`で閉じる。ネスト構造が終わった後に余分な`:::`を書かない

---

## ディレクティブ構文

### コンテナディレクティブ（:::）

```markdown
:::directiveName
コンテンツ
:::
```

- **必ず閉じタグが必要**
- **ネストする場合、各レベルごとに閉じタグが必要**
- **ネスト構造終了後に余分な`:::`を付けない**

#### 単一ディレクティブ（ネストなし）

```markdown
:::top
テキスト
:::
```

#### ネストディレクティブ - 基本ルール

**正しい例（内側→外側の順で閉じる）**:
```markdown
:::sup
関東ローム層
:::lead
更新世の火山活動で、関東平野に積もった火山灰の地層
:::
```
**出力**: `<div class="sup">関東ローム層<div class="lead">...</div></div>`

**間違い - 余分な`:::`がある**:
```markdown
:::sup
関東ローム層
:::lead
更新世の火山活動で、関東平野に積もった火山灰の地層
:::
:::  ← 不要！
```

#### ネストディレクティブ - 複数の子要素

**複数の子ディレクティブがある場合（doubleパターン）**:
```markdown
:::double
:::top
テキスト1
:::gazo-center{size="half"}
![](/images/jh/img/1/9.jpg)
:::
:::
```

**重要**: 
- `:::top`の閉じタグは不要（次のディレクティブ開始で自動的に閉じられる）
- `:::gazo-center`を閉じてから`:::double`を閉じる
- 出力: `<div class="double"><div class="top">テキスト1</div><div class="text-center gazo"><img.../></div></div>`

**従来の書き方（両方のディレクティブを明示的に閉じる）**:
```markdown
:::double
:::top
テキスト1
:::
:::gazo-center{size="half"}
![](/images/jh/img/1/9.jpg)
:::
:::
```

**どちらでも可** - remarkDirectiveが適切に処理する

```markdown
:::sup
見出し
:::lead
説明文
:::
```

**これは間違い！** `<p>:::</p>`が出力される

**正しい書き方**:

```markdown
:::sup
見出し
:::lead
説明文
:::
:::
```

**最初の`:::`は`:::lead`を閉じる**
**2番目の`:::`は`:::sup`を閉じる**

---

## 画像構文

### 基本画像

```markdown
:::gazo
![](/images/path/to/image.svg)

画像の説明文
:::
```

**出力**: `<div class="gazo"><img class="lazyload popup-img" src="..." /><div>画像の説明文</div></div>`

**重要**: 
- 画像の説明文は画像の下に配置（alt属性は空にする）
- 説明文は自動的に`<div>`で囲まれる
- `<br>`タグは使わない

### サイズ指定画像

**`{.class}`構文は使用不可** - acornエラーが発生する

**正しい方法**: ディレクティブ属性を使用

```markdown
:::gazo{size="twice"}
![](/images/path/to/image.svg)

画像の説明文
:::
```

**出力**: `<img class="lazyload popup-img twice" /><div>画像の説明文</div>`

```markdown
:::gazo{size="half"}
![](/images/path/to/image.svg)

画像の説明文
:::
```

**出力**: `<img class="lazyload popup-img half" /><div>画像の説明文</div>`

### 中央寄せ画像（text-center gazo）

```markdown
:::gazo-center{size="half"}
![](/images/path/to/image.jpg)
:::
```

**出力**: `<div class="text-center gazo"><img class="lazyload popup-img half" src="..." /></div>`

**用途**: `:::double`内で画像を配置する場合に使用

### 画像説明（explanation）

```markdown
:::gazo{size="half"}
![](/images/jh/img/6/1.jpg)
:::explanation
好太王（広開土王）碑

「倭は391年よりこのかた、海を渡り、百済を破り、新羅を□□して臣民とした」とある。読解では、碑文内容と当時の情勢の食い違いに留意したい。
:::
```

**出力**: `<div class="gazo"><img .../><div class="explanation">好太王（広開土王）碑<br/>「倭は...</div></div>`

**用途**: 画像の下に詳細な説明文を配置する場合（HTML元の`<div class="explanation">`に対応）

**重要**: 
- `:::explanation`は`:::gazo`の直後に配置
- 説明文内で改行が必要な場合は通常の改行でOK（自動的に`<br/>`に変換される）
- explanationクラスは`text-align: left;`がCSSで定義される

---

## インライン構文

### 用語（クリック可能）

**基本形式:**
```markdown
[[用語名]]
```

**出力**: `<span class="all">用語名</span>`

**ルビ付き形式:**
```markdown
[[<ruby>甕<rt>かめ</rt></ruby>]]
```

**出力**: `<span class="all"><ruby>甕<rt>かめ</rt></ruby></span>`

**用例:**
```markdown
煮炊き用の[[<ruby>甕<rt>かめ</rt></ruby>]]、貯蔵用の[[<ruby>壺<rt>つぼ</rt></ruby>]]がありました。
```

**重要**: 
- ルビが必要な用語は`[[<ruby>...</ruby>]]`形式を使用
- rubyタグは`[[...]]`の内側に記述
- remarkTermsプラグインが多ノード処理で正しく変換

### マーカー（黄色ハイライト）

```markdown
==強調テキスト==
```

**出力**: `<span class="marker">強調テキスト</span>`

### 赤文字

```markdown
**赤文字にするテキスト**
```

**出力**: `<font color="#FF0000">赤文字にするテキスト</font>`

---

## リーフディレクティブ（::）

### 矢印区切り

```markdown
::arrow
```

**出力**: `<div class="arrow"></div>`

---

## ルビ（振り仮名）

```markdown
<ruby>灰汁<rt>あく</rt></ruby>
```

MDX内でHTMLタグとして直接記述可能

---

## リスト構文

### 通常リスト

```markdown
- 項目1
- 項目2
```

### leadディレクティブ付きリスト（class="en"が自動付与）

```markdown
- 項目名
  :::lead
  説明文
  :::
```

**出力**: `<ul class="en"><li>項目名<div class="lead">説明文</div></li></ul>`

**注意**: `<li><p>`のネストを避けるため、remarkListClassesがpタグを自動削除

### カスタムクラス付きリスト（:::list ディレクティブ）

```markdown
:::list{class="en"}
- ヤマト政権の５人の王讃・珍・済・興・武（倭の五王）が、５世紀初めから約１世紀間、相次いで中国南朝に朝貢
- 倭の五王の武が過去の征服事実を中国南朝に報告
- 478年、武が安東大将軍の称号を中国南朝から獲得
:::
```

**出力**: `<ul class="en"><li>ヤマト政権の...</li><li>倭の五王の...</li><li>478年、武が...</li></ul>`

**用途**: `:::lead`ディレクティブを使わずにリスト全体にクラスを付与したい場合

**他のクラス例**:
```markdown
:::list{class="custom-class"}
- 項目1
- 項目2
:::
```

**出力**: `<ul class="custom-class"><li>項目1</li><li>項目2</li></ul>`

### リスト項目内のディレクティブ（継続テキスト）

**元のHTML構造**:
```html
<ul class="en">
  <li>メインテキスト<div class="last">継続テキスト</div></li>
</ul>
```

**MDX形式**:
```markdown
:::list{class="en"}
- メインテキスト
  :::last
  継続テキスト
:::
```

**出力**: `<ul class="en"><li>メインテキスト<div class="last">継続テキスト</div></li></ul>`

**実例（jh/lessons/85.md）**:
```markdown
:::list{class="en"}
- 諸藩の大名は領内の年貢米・特産物の倉庫兼取引所である蔵屋敷を置き、蔵物と総称されるこれら年貢米・特産物を販売して貨幣を獲得
  :::last
  [[蔵元]]と呼ばれる商人が蔵物の販売・保管をおこない、[[掛屋]]と呼ばれる商人がその販売代金の<ruby>出納<rt>すいとう</rt></ruby>・藩への送金を担当
- 商人が全国から大坂に集めた商品を<ruby>納屋物<rt>なやもの</rt></ruby>と呼び、江戸や全国に出荷
:::
```

**重要な注意点**:
- `:::last`, `:::middle`, `:::top`はリスト項目内で**2スペースインデント**
- リスト項目の一部として扱われる（サブリストではない）
- CSS `.last::before { content: "⇒"; }` で矢印マーカーが自動付与される

**他の継続ディレクティブ**:
- `:::last` - 最後の補足情報（⇒マーカー付き）
- `:::middle` - 中間の補足情報（→マーカー付き）
- `:::top` - 最初の情報（マーカーなし）

**変換ロジック（batch-convert-jh-lessons.js）**:
```javascript
// convertList()メソッド内
else if (className?.match(/^(last|middle|top)$/)) {
  nestedDirectives.push(this.convertElement($node));
}

// 出力時にインデント
if (nestedDirectives.length > 0) {
  const nested = nestedDirectives.map(d => '  ' + d.split('\n').join('\n  ')).join('\n');
  itemText += '\n' + nested;
}
```

---

## テーブル構文

### 基本テーブル

```markdown
| 人物 | 説明 |
|:---:|:---|
| **<ruby>王仁<rt>わに</rt></ruby>** | [[<ruby>西文氏<rt>かわちのふみうじ</rt></ruby>]]の祖、『論語』を伝える |
| 阿知使主 | [[<ruby>東漢氏<rt>やまとのあやうじ</rt></ruby>]]の祖、財務に携わる |
| **弓月君** | [[<ruby>秦氏<rt>はたうじ</rt></ruby>]]の祖、養蚕・機織を伝える |
```

**出力**: 
```html
<table>
  <thead>
    <tr>
      <th style="text-align:center">人物</th>
      <th style="text-align:left">説明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="text-align:center"><font color="#FF0000"><ruby>王仁<rt>わに</rt></ruby></font></td>
      <td style="text-align:left"><span class="all"><ruby>西文氏<rt>かわちのふみうじ</rt></ruby></span>の祖、『論語』を伝える</td>
    </tr>
    <!-- 以下省略 -->
  </tbody>
</table>
```

**セル内で使用可能な構文**:
- `**テキスト**` - 赤文字（`<font color="#FF0000">`に変換）
- `[[用語]]` - `.all`クラス（`<span class="all">`に変換）
- `<ruby>漢字<rt>よみ</rt></ruby>` - ルビ
- `==テキスト==` - マーカー（`<span class="marker">`に変換）

**アライメント**:
- `:---:` - 中央寄せ
- `:---` - 左寄せ
- `---:` - 右寄せ

**重要な注意事項**:
- テーブルセル内では改行不可（MDXの制約）
- 元HTMLで改行やインデントがある場合、変換時に自動削除される
- セル内の連続空白は1つの空白に圧縮される

### 2次元テーブル（空セルで始まる行）

HTMLで1行目が空セルで始まる場合、2次元テーブルとして認識される。

**元HTML**:
```html
<table>
  <tr>
    <td></td>
    <td>金貨</td>
    <td>銀貨</td>
    <td>銭貨</td>
  </tr>
  <tr>
    <td>鋳造所</td>
    <td>金座</td>
    <td>銀座</td>
    <td>銭座</td>
  </tr>
</table>
```

**変換後MDX**:
```markdown
| 項目 | 金貨 | 銀貨 | 銭貨 |
|:---:|:---|:---|:---|
| 鋳造所 | [[金座]] | [[銀座]] | [[銭座]] |
```

**処理ロジック**:
1. 1行目の最初のセルが空の場合を検出
2. ヘッダー行を「項目」+ 1行目の2列目以降で構成
3. 2行目以降を通常のデータ行として出力

**実例（jh/lessons/85.md - 三貨の表）**:
```markdown
| 項目 | 金貨 | 銀貨 | 銭貨 |
| :---: | :--- | :--- | :--- |
| 鋳造所 | [[金座]] | [[銀座]] | [[銭座]] |
| 場所 | 江戸・京都 | <ruby>駿府<rt>すんぷ</rt></ruby>・伏見 ＊のちに江戸・京都 | 江戸・近江坂本 ＊のちに全国各地 |
| 流通圏 | 主に==東日本== （金遣い） | 主に==西日本== （銀遣い） | 全国で流通 |
```

### rowspan/colspanを含むテーブル

MDXテーブルでは`rowspan`/`colspan`を表現できないため、**HTMLテーブルをそのまま保持**する。

**元HTML**:
```html
<table>
  <tr>
    <th rowspan="2">天皇</th>
    <th colspan="2">政権担当者</th>
  </tr>
  <tr>
    <th>藤原氏</th>
    <th>その他</th>
  </tr>
</table>
```

**変換後MDX**:
```markdown
<table>
  <tr>
    <th rowspan="2">天皇</th>
    <th colspan="2">政権担当者</th>
  </tr>
  <tr>
    <th>藤原氏</th>
    <th>その他</th>
  </tr>
</table>
```

**重要**: 
- HTMLテーブルとして保持される（Markdownテーブルには変換されない）
- `rehype-raw`プラグインによってHTMLが処理される
- セル内の`<span class="all">`などの特殊構文も変換処理が必要

**変換ロジック（batch-convert-jh-lessons.js）**:
```javascript
convertTable($table) {
  const hasRowspan = $table.find('[rowspan]').length > 0;
  const hasColspan = $table.find('[colspan]').length > 0;
  
  if (hasRowspan || hasColspan) {
    // HTMLテーブルとして保持
    let tableHtml = '<table>\n';
    
    $table.children('tr').each((i, tr) => {
      tableHtml += '  <tr>\n';
      this.$(tr).children('th, td').each((j, cell) => {
        const $cell = this.$(cell);
        const tagName = cell.name;
        const rowspan = $cell.attr('rowspan');
        const colspan = $cell.attr('colspan');
        const align = $cell.attr('align');
        
        let attrs = '';
        if (rowspan) attrs += ` rowspan="${rowspan}"`;
        if (colspan) attrs += ` colspan="${colspan}"`;
        if (align) attrs += ` align="${align}"`;
        
        const content = this.convertInnerHTML($cell);
        tableHtml += `    <${tagName}${attrs}>${content}</${tagName}>\n`;
      });
      tableHtml += '  </tr>\n';
    });
    
    tableHtml += '</table>';
    return tableHtml;
  }
  
  // rowspan/colspanがない場合はMarkdownテーブルに変換
  // ...（通常のテーブル変換ロジック）
}
```

### テーブル変換の注意点

**セル内容の処理**:
```javascript
// convertInnerHTML()でセル内容を変換
// - [[用語]] → <span class="all">用語</span>
// - **赤文字** → <font color="#FF0000">赤文字</font>
// - ==マーカー== → <span class="marker">マーカー</span>
// - <ruby> タグはそのまま保持（改行・空白を削除）
```

**改行・空白の処理**:
```javascript
// テーブルセル内の改行とインデントは削除
cellText = cellText.replace(/[\r\n\t]+/g, ' ').replace(/\s+/g, ' ').trim();
```

**空セルの扱い**:
```markdown
| 項目 | 金貨 | 銀貨 | 銭貨 |
|:---:|:---|:---|:---|
| 統括者 | 後藤庄三郎 |  |  |  ← 空セルはスペース2つ
```
<table>
  <tr>
    <th rowspan="2">天皇</th>
    <th colspan="2">政権担当者</th>
  </tr>
  <tr>
    <th>藤原氏</th>
    <th>その他</th>
  </tr>
</table>
```

**変換後MDX**:
```markdown
（HTMLテーブルがそのまま埋め込まれる）
<table>
  <tr>
    <th rowspan="2">天皇</th>
    <th colspan="2">政権担当者</th>
  </tr>
  ...
</table>
```

**検出方法**:
- `[rowspan]`または`[colspan]`属性の存在をチェック
- 検出された場合、Markdown変換をスキップ

---

## フロントマター

```markdown
---
title: "ページタイトル"
overview: "概要文"
---
```

**注意**: 
- YAMLフォーマットを厳守
- `---`で囲む
- gray-matterで手動パース（remark-frontmatterは使用しない）

---

## ネスト構造の判断基準

### 単一閉じタグパターン

**条件**: 親ディレクティブに直接テキストがある

```markdown
:::top
石器による区分

:::lead
旧石器時代から[[新石器時代]]（約１万2000年前～）
:::
```

**閉じタグ数**: 1つ（`:::lead`のみを閉じる）

### 二重閉じタグパターン

**条件**: 親ディレクティブにテキストがない（見出しのみ）

```markdown
:::sup
中期
:::lead
縄文土器の最盛期
:::
:::
```

**閉じタグ数**: 2つ（1つ目で`:::lead`、2つ目で`:::sup`を閉じる）

---

## プラグイン実行順序（重要）

remarkPlugins配列での順序:

1. `remarkGfm` - GitHub Flavored Markdown
2. `remarkDirective` - `:::`と`::`構文をパース（属性も含む）
3. `remarkCustomDirectives` - ディレクティブをdivに変換、段落アンラップ、size属性読み取り
4. `remarkListClasses` - `class="en"`追加、リスト項目の段落アンラップ
5. `remarkTerms` - `[[term]]`を`<span class="all">`に変換
6. `remarkMarkers` - `==text==`を`<span class="marker">`に変換
7. `remarkRedText` - `**text**`を`<font color="#FF0000">`に変換

**この順序を変更しない**

---

## よくあるエラーと解決法

### エラー: "Could not parse expression with acorn"

**原因**: `{.class}`構文を使用している

**解決**: `:::gazo{size="class"}`に変更

### エラー: `<p>:::</p>`が出力される

**原因**: `:::sup`のような親ディレクティブで閉じタグが不足

**解決**: 閉じタグを2つ記述（1つ目で子、2つ目で親を閉じる）

### エラー: `[[term]]`が変換されない

**原因**: visitのreturn値が不正、またはネスト構造エラーで処理が中断

**解決**: 
1. remarkTermsで`return [visit.SKIP, index]`を使用
2. ネスト構造を確認

### エラー: `<div><p>`のネスト

**原因**: remarkCustomDirectivesで段落アンラップ処理が不足

**解決**: remarkCustomDirectivesとremarkListClassesで段落を展開

---

## チェックリスト

新規MDXファイル作成時:

- [ ] フロントマターがYAML形式（`---`で囲まれている）
- [ ] `{.class}`構文を使用していない
- [ ] すべての`:::`ディレクティブに適切な数の閉じタグがある
- [ ] `:::sup`+`:::lead`パターンでは閉じタグが2つある
- [ ] `:::top`+`:::lead`で親にテキストがある場合は閉じタグが1つ
- [ ] 画像にサイズ指定が必要な場合は`:::gazo{size="..."}`を使用
- [ ] `[[term]]`、`==marker==`、`**red**`構文を正しく使用
- [ ] `<ruby>`タグをそのまま記述（エスケープ不要）

---

## 実例

### 完全な例（2.md から抜粋）

```markdown
---
title: "縄文文化の成立"
overview: "約１万年前に地球は完新世になりました。"
---

## セクション見出し

:::top
更新世から[[完新世]]（約１万年前～現在）に至る過渡期に、地球の気候は次第に温暖になりました。
:::

:::top
[[狩猟]]
:::lead
変化①により、Ⓐ中・小型動物（イノシシ・ニホンシカ）が狩猟対象
:::

:::gazo{size="twice"}
![](/images/jh/img/2/5.svg)

鉱物産地の分布
:::

::arrow

:::double
:::top
批難に屈しない考古学への情熱―相沢忠洋

独学の末に石器を発見した相沢忠洋は、1949年に明治大学の学者たちと岩宿遺跡を調査、日本の旧石器時代の存在を証明しました。しかし、報告は大学の名義でなされ、相沢は調査の単なる付き添い役として、学界から存在を無視されました。加えて、功績をねたむ学者・地元住民から売名行為と批難を浴びました。

その後も相沢はアマチュアとして地道な調査活動を続け、多くの遺跡発見に貢献しました。やがて相沢への批難は消え、正当な評価がなされました。

下図は岩宿遺跡の相沢の像。常識を覆した石器を手に、じっと見つめています。
:::gazo-center{size="half"}
![](/images/jh/img/1/9.jpg)
:::
:::

:::sup
中期
:::lead
縄文土器の最盛期
:::

- 動物の変化
  :::lead
  大型動物が絶滅し、==中・小型動物が多く生息==
  :::
```

---

## 禁止事項

### HTMLタグを直接使わない

**NG**: 
```markdown
<div className="top">テキスト</div>
<div className="text-center gazo"><img ... /></div>
```

**理由**: 
- MDXでHTMLを直接書くとReact構文（className, style={{}}）が必要
- 保守性が低い
- ディレクティブの方が簡潔

**OK**: 
```markdown
:::top
テキスト
:::
:::gazo-center{size="half"}
![](/images/path.jpg)
:::
```

### インラインstyleを使わない

**NG**: 
```markdown
<img style="cursor: pointer;" />
<div style="text-align: center;">
```

**理由**: 
- CSSファイルで管理すべき
- インラインstyleはメンテナンス困難
- remarkプラグインで自動付与しない

**OK**: 
- CSSクラスで制御
- `:hover { cursor: pointer; }` をCSSに記述

### <br>タグで改行しない

**NG**: 
```markdown
:::gazo
![](/images/path.jpg)<br />画像の説明
:::
```

**理由**: 
- remarkプラグインが自動的にdivで囲む
- セマンティックHTML違反

**OK**: 
```markdown
:::gazo
![](/images/path.jpg)

画像の説明
:::
```

**出力**: `<div class="gazo"><img /><div>画像の説明</div></div>`

### 画像のalt属性に説明を入れない

**NG**: 
```markdown
![約２万年前の日本列島](/images/jh/img/1/1.svg)
```

**理由**: 
- 説明文は画像の下に表示する仕様
- alt属性は空にする

**OK**: 
```markdown
:::gazo
![](/images/jh/img/1/1.svg)

約２万年前の日本列島

＊細線は現在の海岸線
:::
```

---

## 注意事項

1. **ファイル保存時はUTF-8エンコーディングを厳守**
2. **PowerShellで編集する場合は`-Encoding UTF8`を明示**
3. **Gitからの復元前に必ずバックアップを作成**
4. **プラグイン順序を変更しない**
5. **新しいディレクティブを追加する場合は、remarkCustomDirectivesに処理を追加**
