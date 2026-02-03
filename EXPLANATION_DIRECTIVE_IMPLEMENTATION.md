# Explanation Directive Implementation Summary

## 実施日時
2026年2月3日

## 問題点
元のHTMLの `<div class="explanation">` が正しく変換されていなかった。

### 元のHTML（jh_lessons6.html）
```html
<div class="gazo" style="margin-bottom:0px;">
  <img data-src="img/6/1.jpg" alt="" class="lazyload popup-img half" src="../share/img/loading.svg" />
</div>
<div class="explanation">
  好太王（広開土王）碑<br>
  「倭は391年よりこのかた、海を渡り、百済を破り、新羅を□□して臣民とした」とある。読解では、碑文内容と当時の情勢の食い違いに留意したい。
</div>
```

### 誤った変換結果
```markdown
:::gazo{size="half"}
![](/images/jh/img/6/1.jpg)

好太王（広開土王）碑

「倭は391年よりこのかた、海を渡り、百済を破り、新羅を□□して臣民とした」とある。読解では、碑文内容と当時の情勢の食い違いに留意したい。
:::
```

### 望ましい変換結果
```markdown
:::gazo{size="half"}
![](/images/jh/img/6/1.jpg)
:::
:::explanation
好太王（広開土王）碑

「倭は391年よりこのかた、海を渡り、百済を破り、新羅を□□して臣民とした」とある。読解では、碑文内容と当時の情勢の食い違いに留意したい。
:::
```

## 実施した修正

### 1. バッチ変換スクリプト更新
**ファイル**: `scripts/batch-convert-jh-lessons.js`

**変更内容**:
- `convertElement()` メソッドで次の要素が `<div class="explanation">` の場合、`:::explanation` ディレクティブとして追加
- `:::gazo` の閉じタグの後に `:::explanation` を配置

**修正箇所**:
```javascript
// gazo（画像） - 次の要素がexplanationの場合は一緒に処理
if (className.includes('gazo')) {
  let result = this.convertGazo($el);
  
  // 次の要素がexplanationの場合、:::explanation ディレクティブとして追加
  if ($nextEl && $nextEl.hasClass('explanation')) {
    const explanationContent = this.convertInnerHTML($nextEl);
    if (explanationContent) {
      // :::gazo の閉じタグの後に :::explanation を追加
      result += `\n:::explanation\n${explanationContent}\n:::`;
    }
  }
  
  return result;
}
```

### 2. Remark プラグイン更新
**ファイル**: `lib/remark-custom-directives.js`

**変更内容**:
- `:::explanation` ディレクティブのハンドラーを追加
- テキスト内の改行を自動的に `<br/>` タグに変換

**追加コード**:
```javascript
// Special handling for :::explanation - detailed image caption
if (node.name === 'explanation' && node.children) {
  data.hProperties.className = 'explanation';
  
  // Convert line breaks in explanation text to <br/> tags
  const processTextNodes = (children) => {
    const newChildren = [];
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (child.type === 'text' && child.value.includes('\n')) {
        // Split by newlines and insert <br/> between segments
        const lines = child.value.split('\n');
        for (let j = 0; j < lines.length; j++) {
          if (lines[j]) {
            newChildren.push({ type: 'text', value: lines[j] });
          }
          if (j < lines.length - 1) {
            newChildren.push({
              type: 'html',
              value: '<br/>'
            });
          }
        }
      } else {
        newChildren.push(child);
      }
    }
    return newChildren;
  };
  
  // Process text nodes in explanation
  if (node.children.length > 0 && node.children[0].type === 'paragraph') {
    node.children[0].children = processTextNodes(node.children[0].children);
  }
}
```

### 3. CSS更新
**ファイル**: `public/css/lessons_common.css`

**変更内容**:
- `.explanation` クラスに `text-align: left;` を追加

**修正箇所**:
```css
.explanation {
  font-size: 1.1rem;
  position: relative;
  background: #ffffff;
  border: 1px solid #000000;
  width: 90%;
  max-width: 300px;
  margin-left: auto;
  margin-right: auto;
  padding: 5px;
  margin-bottom: 30px;
  text-align: left; /* 追加 */
}
```

### 4. MDX構文ルール更新
**ファイル**: `MDX_SYNTAX_RULES.md`

**追加内容**:
```markdown
### 画像説明（explanation）

​```markdown
:::gazo{size="half"}
![](/images/jh/img/6/1.jpg)
:::
:::explanation
好太王（広開土王）碑

「倭は391年よりこのかた、海を渡り、百済を破り、新羅を□□して臣民とした」とある。読解では、碑文内容と当時の情勢の食い違いに留意したい。
:::
​```

**出力**: `<div class="gazo"><img .../><div class="explanation">好太王（広開土王）碑<br/>「倭は...</div></div>`

**用途**: 画像の下に詳細な説明文を配置する場合（HTML元の`<div class="explanation">`に対応）

**重要**: 
- `:::explanation`は`:::gazo`の直後に配置
- 説明文内で改行が必要な場合は通常の改行でOK（自動的に`<br/>`に変換される）
- explanationクラスは`text-align: left;`がCSSで定義される
```

### 5. バッチ変換実行結果

**対象**: jh_lessons1.html ～ jh_lessons170.html（170ファイル）

**結果**:
- ✅ 成功: 164ファイル (96.5%)
- ⚠️ 警告あり: 1ファイル (jh_lessons145.html)
- ❌ エラー: 2ファイル (jh_lessons54.html, jh_lessons73.html)

**検証済み**:
- lesson 6 の explanation ディレクティブが正しく生成されていることを確認
- `<p>:::</p>` が生成されていないことを全ファイルで確認

## 期待される出力HTML

### MDX入力
```markdown
:::gazo{size="half"}
![](/images/jh/img/6/1.jpg)
:::
:::explanation
好太王（広開土王）碑

「倭は391年よりこのかた、海を渡り、百済を破り、新羅を□□して臣民とした」とある。読解では、碑文内容と当時の情勢の食い違いに留意したい。
:::
```

### レンダリング後のHTML（期待値）
```html
<div class="gazo">
  <img class="lazyload popup-img half" src="/images/jh/img/6/1.jpg" alt="" />
</div>
<div class="explanation">
  好太王（広開土王）碑<br/>
  「倭は391年よりこのかた、海を渡り、百済を破り、新羅を□□して臣民とした」とある。読解では、碑文内容と当時の情勢の食い違いに留意したい。
</div>
```

## 次のステップ

### 1. 開発サーバーで確認（必須）
```bash
npm run dev
```

以下のURLで表示確認:
- http://localhost:3000/jh/lessons/6

**確認項目**:
- ✅ 画像の下に説明ボックスが表示される
- ✅ 説明ボックスに枠線があり、中央寄せされている
- ✅ 説明文の1行目がタイトル（大きめのフォント）
- ✅ 説明文の改行が正しく表示される（`<br/>`が機能している）
- ✅ テキストが左寄せ（text-align: left）されている
- ✅ 説明ボックスの上に小さな三角形（吹き出し風）が表示される

### 2. エラーファイルの確認
以下の2ファイルは手動で修正が必要:
- `content/jh/lessons/54.md` - 未閉じディレクティブ
- `content/jh/lessons/73.md` - 余分な閉じタグ

### 3. 警告ファイルの確認
- `content/jh/lessons/145.md` - 空行後の閉じタグ（目視確認推奨）

## 補足: 不要ファイルの削除

以下のファイルを削除済み:
- `scripts/batch-convert-jh-lessons-new.js` （不完全な変換スクリプト）

## まとめ

**✅ 完了した作業**:
1. `:::explanation` ディレクティブの実装
2. バッチ変換スクリプトの修正
3. Remark プラグインの更新（改行→`<br/>`自動変換）
4. CSS への `text-align: left;` 追加
5. MDX構文ルールへのドキュメント追加
6. 全170ファイルの再変換実行

**🔍 要確認**:
- 開発サーバーでの表示確認（特にlesson 6）
- エラーファイル2件の手動修正
- 警告ファイル1件の目視確認

**📝 注意事項**:
- `:::explanation` は必ず `:::gazo` の直後に配置する
- 説明文内の改行は通常の改行でOK（自動的に`<br/>`に変換される）
- `<br>`タグを手書きしない（MDXルール違反）
