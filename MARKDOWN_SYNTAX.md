# カスタムMarkdown記法仕様

## 概要

このプロジェクトでは、HTMLタグを使わずに簡潔にレッスンページを記述できる独自のMarkdown記法を採用しています。

## 基本構文

### 見出し

```markdown
## 大見出し（h2）
### 小見出し（h3）
```

→ `<h2>大見出し</h2>` `<h3>小見出し</h3>`

### 段落（パラグラフ）

```markdown
::top
約260万年前、地球は氷河時代を迎えました。
::

::middle
著しい気温の上下で、氷河の大規模な溶解・形成がありました。
::

::last
この時代において、日本列島も陸続きになりました。
::
```

→ `<div className="top">...</div>`
→ `<div className="middle">...</div>`
→ `<div className="last">...</div>`

### ルビ（ふりがな）

```markdown
{{漢字|よみがな}}
```

**例：** `{{間氷期|かんぴょうき}}`
→ `<ruby>間氷期<rt>かんぴょうき</rt></ruby>`

### クリック表示/非表示（赤字の用語）

```markdown
[[用語|よみがな]]
または
[[用語]]
```

**例：** `[[更新世|こうしんせい]]` または `[[石器時代]]`
→ `<span onClick="chg(this)" className="all"><ruby>更新世<rt>こうしんせい</rt></ruby></span>`
→ `<span onClick="chg(this)" className="all">石器時代</span>`

### マーカー（蛍光ペン）

```markdown
==マーカーを引きたいテキスト==
```

**例：** `==間氷期と氷期を交互に繰り返す==`
→ `<span className="marker">間氷期と氷期を交互に繰り返す</span>`

### 赤文字

```markdown
**赤文字テキスト**
```

**例：** `**ヘラジカ**`
→ `<span style={{color:"#FF0000"}}>ヘラジカ</span>`

### 画像（gazo）

```markdown
::gazo
![代替テキスト](/share/img/1/1.svg)
約２万年前の日本列島
＊細線は現在の海岸線
::
```

→ 
```html
<div className="gazo">
  <img className="lazyload popup-img border border-1" src="/share/img/1/1.svg" alt="代替テキスト" />
  <br />
  約２万年前の日本列島
  <br />
  ＊細線は現在の海岸線
</div>
```

**画像の表示サイズ：**
- `![alt](url)` → デフォルト
- `![alt](url){.twice}` → 2倍サイズ
- `![alt](url){.half}` → 半分サイズ
- `![alt](url){.border}` → 枠線付き

### 矢印（区切り）

```markdown
---arrow---
```

→ `<div className="arrow"></div>`

### 補足説明（sup）

```markdown
::sup
骨などの放射性元素[[炭素]]14の濃度で年代可能
::
```

→ `<div className="sup">骨などの放射性元素<span onClick="chg(this)" className="all">炭素</span>14の濃度で年代可能</div>`

**ネストした補足（lead）：**

```markdown
::sup
関東ローム層
:::lead
更新世の火山活動で、関東平野に積もった火山灰の地層
:::
::
```

→ 
```html
<div className="sup">
  関東ローム層
  <div className="lead">更新世の火山活動で、関東平野に積もった火山灰の地層</div>
</div>
```

### 2カラムレイアウト（double）

```markdown
::double
批難に屈しない考古学への情熱―相沢忠洋

独学の末に石器を発見した相沢忠洋は...

---image---
![相沢忠洋の像](/share/img/1/9.jpg){.half}
::
```

→ 
```html
<div className="double">
  <div className="top">批難に屈しない考古学への情熱―相沢忠洋<br />独学の末に...</div>
  <div className="text-center gazo"><img src="/share/img/1/9.jpg" className="lazyload popup-img half" /></div>
</div>
```

### 概要セクション

```markdown
---overview---
世界史の上で、人類文化の最古の時代を旧石器時代と言います。この時代に属する文化が我が国で最初に発見されたのは...
---
```

→ 
```html
<div className="overview">
  <div className="title">概要</div>
  世界史の上で、人類文化の最古の時代を旧石器時代と言います...
</div>
```

## 完全な例

```markdown
---overview---
世界史の上で、人類文化の最古の時代を旧石器時代と言います。この時代に属する文化が我が国で最初に発見されたのは、1949年の群馬県岩宿遺跡の発掘においてでした。「日本に旧石器時代はない」という、学界の保守的な意見を前に、発掘前は研究が進みませんでした。日本での旧石器時代研究はまだ緒についたばかりです。
---

## 気候と人類
### 地球と列島の気候変動

::top
約260万年前、地球は=={{間氷期|かんぴょうき}}と{{氷期|ひょうき}}を交互に繰り返す==[[更新世|こうしんせい]]（[[氷河時代]]）を迎えました。
::

::middle
著しい気温の上下で、氷河の大規模な溶解・形成がありました。
::

::middle
つまり、海面の上昇・下降があったことを意味します。
::

::last
この時代において、大陸と離れていた日本列島も、アジア北東部と少なくとも２回陸続きになりました。
::

::gazo
![約２万年前の日本列島](/share/img/1/1.svg){.border}
約２万年前の日本列島
＊細線は現在の海岸線
::

---arrow---

::top
陸続きの時に、大型動物が日本列島に渡来しました。
::

::middle
**ヘラジカ**・**マンモス**が北海道以北に、**オオツノジカ**・**ナウマンゾウ**が北海道以南にほぼ分布しました。
::

::last
長野県[[野尻湖|のじりこ]]はナウマンゾウの化石が出土したことで有名です。
::

::gazo
![日本列島への大型動物の移動・分布](/share/img/1/2.jpg){.twice}
日本列島への大型動物の移動・分布
::
```

## 実装メモ

- パーサーは `scripts/markdown-to-html.js` で実装
- レンダリングは `components/CustomMarkdown.tsx` で処理
- 既存HTMLからの変換は `scripts/html-to-custom-md.js` で実行
