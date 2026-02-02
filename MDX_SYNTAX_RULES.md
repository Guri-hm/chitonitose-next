# MDX構文ルール - chitonitose-next

## 基本原則

1. **MDXは`{...}`をJavaScript式として解釈する** - `{.class}`のような構文は使用不可
2. **remark-directiveを使用する** - `:::directive{attribute="value"}`構文を使用
3. **ネスト構造は正確に** - 開始タグと閉じタグの数を厳密に一致させる

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

#### 単一ディレクティブ（ネストなし）

```markdown
:::top
テキスト
:::
```

#### ネストディレクティブ - パターンA（親に直接テキストあり）

**親ディレクティブにテキストがある場合は、子の閉じタグのみ**

```markdown
:::top
親のテキスト
:::lead
子のテキスト
:::
```

**出力**: `<div class="top">親のテキスト<div class="lead">子のテキスト</div></div>`

**閉じタグは1つだけ** - `:::lead`を閉じる

#### ネストディレクティブ - パターンB（親にテキストなし、supクラス）

**`:::sup`のように親にテキストがない場合は、両方の閉じタグが必要**

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
![代替テキスト](/images/path/to/image.svg)
:::
```

**出力**: `<div class="gazo"><img class="lazyload popup-img" src="..." /></div>`

### サイズ指定画像

**`{.class}`構文は使用不可** - acornエラーが発生する

**正しい方法**: ディレクティブ属性を使用

```markdown
:::gazo{size="twice"}
![代替テキスト](/images/path/to/image.svg)
:::
```

**出力**: `<img class="lazyload popup-img twice" />`

```markdown
:::gazo{size="half"}
![代替テキスト](/images/path/to/image.svg)
:::
```

**出力**: `<img class="lazyload popup-img half" />`

---

## インライン構文

### 用語（クリック可能）

```markdown
[[用語名]]
```

**出力**: `<span class="all">用語名</span>`

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
![鉱物産地の分布](/images/jh/img/2/5.svg)
:::

::arrow

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

## 注意事項

1. **ファイル保存時はUTF-8エンコーディングを厳守**
2. **PowerShellで編集する場合は`-Encoding UTF8`を明示**
3. **Gitからの復元前に必ずバックアップを作成**
4. **プラグイン順序を変更しない**
5. **新しいディレクティブを追加する場合は、remarkCustomDirectivesに処理を追加**
