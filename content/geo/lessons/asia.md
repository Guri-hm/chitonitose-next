## 地形
### 長江
::top
長江の上流は、チベット高原にあたります。
::
::last
河口から1800㎞地点に三峡ダムが建設されましたが、この付近から四川盆地にかけて勾配が急に大きくなります。
::
::sup
==ダムには急勾配が必要であり、ダムの存在＝急勾配の河川==
::
<span onclick="choice(this)" class="choice"> <span class="true_choice">aaaa</span>/<span class="false_choice">bbbb</span> </span>
---arrow---
::top
また、長江の上流にはツンドラ気候（ET）、中流には温暖冬季少雨気候（Cw)などが分布し、特に冬季は流量が少なくなります。
::
::gazo
![](yangtze_and_yellow_river.svg){.border}
長江と黄河
::
<script>
//下線空欄クリック
function choice(obj) {
let elms = obj.querySelectorAll('span');
for (let i = 0; i < elms.length; i++) {
if (elms[i].className.indexOf('true_choice') != -1) {
elms[i].style.border = "1px solid #FF0000";
elms[i].style.borderRadius = "5px";
}
if (elms[i].className.indexOf('false_choice') != -1) {
elms[i].style.textDecoration = "line-through";
}
}
}
function reset_choice(obj) {
let elms = obj.querySelectorAll('span');
for (let i = 0; i < elms.length; i++) {
elms[i].style.border = "";
elms[i].style.borderRadius = "";
elms[i].style.textDecoration = "";
}
}
</script>