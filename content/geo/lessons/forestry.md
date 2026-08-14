## 樹木・森林の分類、木材の用途
### 樹木の分類
::top
樹木は、葉の形で大きく広葉樹と針葉樹に分類されます。
::
<ul class="en">
<li>広葉樹:::lead
平たい葉を持つ樹木
:::
:::lead
さらに落葉樹・常緑樹と細分化
:::
:::lead
クヌギ・ナラ・ケヤキなどが該当
:::
:::lead
英語で「hardwood」とも表記され、針葉樹よりも材質が硬くて重く、加工しにくい材質
:::</li>
<li>針葉樹:::lead
針のように細く尖った葉を持つ樹木
:::
:::lead
基本的に常緑樹
:::
:::lead
スギやマツ、ヒノキなどが該当
:::
:::lead
英語で「softwood」とも表記され、広葉樹よりも軟らかく、加工しやすい材質
:::</li>
</ul>
::gazo
![](hardwood_softwood.webp)
広葉樹（左）・針葉樹（右）
::
### 森林の分類
::top
森林は分布・特徴から次の３つに分けられます。
::
<ul class="en">
<li>熱帯林:::lead
広葉樹で構成され、熱帯雨林気候区を中心に分布
:::</li>
<li>温帯林:::lead
低緯度は広葉樹、高緯度は広葉樹と針葉樹の混合で構成され、温帯に分布
:::</li>
<li>亜寒帯林（冷帯林）:::lead
針葉樹で構成され、亜寒帯（冷帯）に分布
:::</li>
</ul>
### 木材の用途
::top
木材の用途は次の２つに分けられます。
::
<ul class="en">
<li>用材:::lead
製材・合板やパルプ・チップに加工し、住宅や家具などに利用
:::
:::lead
==先進国で利用が多い==
:::</li>
<li>{{薪炭材|しんたんざい}}
:::lead
{{薪|まき}}や木炭として燃料に利用
:::
:::lead
==発展途上国で利用が多い==
:::</li>
</ul>
::sup
パルプ<div class="lead">木材を機械的あるいは化学的に処理してつくられる粗繊維物質
::
</div>
<script type="text/javascript">
createChartAsync(Chart.Column, { "params": [392, 124, 643, 840, 276, 76, 156, 704, 356, 288] }, 'wood_use_comparison'
, {
title: '主な国の木材生産の割合 (2020年)',
colors: ['#109618', '#dc3912'],
legend: { position: 'top', maxLines: 3 },
bar: { groupWidth: '60%' },
isStacked: 'percent',
}, "./php/wood_use_comparison.php");
</script>
<div id="wood_use_comparison" style="width: 100%; height: 350px"></div>
::gazo
![](pulp.webp)
木材パルプ
::
## 森林ごとの分布と特色
### 熱帯林
::top
熱帯林とは、常緑広葉樹から成る熱帯雨林、常緑広葉樹に落葉広葉樹が混じる熱帯モンスーン林、海岸沿岸部のマングローブ林などを指します。
::
::sup
マングローブ<div class="lead">熱帯・亜熱帯の海岸・河口の汽水域となる地域に広く分布する植物
::
</div>
#### 分布
::top
熱帯雨林気候のアマゾン川流域、東南アジア、コンゴ川流域に分布します。
::
::last
特にアマゾン川流域の熱帯林は[[セルバ]]と呼ばれます。
::
<script type="text/javascript">
createChartAsync(Chart.Pie, { "nation_cd": 76 }, 'Brazil_wood_type', {
title: 'ブラジルの森林の割合 (%、2020年)',
legend: { position: 'top', maxLines: 3 },
colors: ['#9370db', '#b7db70'],
sliceVisibilityThreshold: 0
}, "./php/wood_type.php");
</script>
<div id="Brazil_wood_type" style="width: 100%; height: 350px"></div>
<script type="text/javascript">
createChartAsync(Chart.Pie, { "nation_cd": 360 }, 'Indonesia_wood_type', {
title: 'インドネシアの森林の割合 (%、2020年)',
legend: { position: 'top', maxLines: 3 },
colors: ['#9370db', '#b7db70'],
sliceVisibilityThreshold: 0
}, "./php/wood_type.php");
</script>
<div id="Indonesia_wood_type" style="width: 100%; height: 350px"></div>
<script type="text/javascript">
createChartAsync(Chart.Pie, { "nation_cd": 180 }, 'Congo_Re_wood_type', {
title: 'コンゴ民主の森林の割合 (%、2020年)',
legend: { position: 'top', maxLines: 3 },
colors: ['#9370db', '#b7db70'],
sliceVisibilityThreshold: 0
}, "./php/wood_type.php");
</script>
<div id="Congo_Re_wood_type" style="width: 100%; height: 350px"></div>
#### 特色
::top
熱帯林は多種多様な樹種が混在して密集し、ほしいと思う樹種の大量取得が困難です。
::
::last
熱帯林の伐採用途は建築用材・合板をはじめ様々ですが、==硬木のため、紙などの原料（パルプ）には不向きです==。
::
#### 利用樹種
<ul>
<li>ラワン：合板・建築用材</li>
<li>チーク：船舶材・建築材</li>
<li>マホガニー：高級家具材</li>
</ul>
#### 伐採の目的
<h5>焼畑農業・薪炭材</h5>
::top
発展途上国では、焼畑農業や==薪炭材のために伐採されています==。
::
::last
例えば、インドとエチオピアの木材用途のグラフを見ると、薪炭材の割合が高いことがわかります。
::
<script type="text/javascript">
createChartAsync(Chart.Pie, { "nation_cd": 356 }, 'India_wood_use', {
title: 'インドの木材生産の割合 (百万㎥、2020年)',
legend: { position: 'top', maxLines: 3 },
colors: ['#109618', '#dc3912'],
sliceVisibilityThreshold: 0
}, "./php/wood_use.php");
</script>
<div id="India_wood_use" style="width: 100%; height: 350px"></div>
<script type="text/javascript">
createChartAsync(Chart.Pie, { "nation_cd": 231 }, 'Ethiopia_wood_use', {
title: 'エチオピアの木材生産の割合 (百万㎥、2020年)',
legend: { position: 'top', maxLines: 3 },
colors: ['#109618', '#dc3912'],
sliceVisibilityThreshold: 0
}, "./php/wood_use.php");
</script>
<div id="Ethiopia_wood_use" style="width: 100%; height: 350px"></div>
<h5>開発</h5>
::top
ブラジルなどの発展途上国では、==農場・牧場の開発や鉱山開発のために熱帯林が大規模に伐採されています==。
::
::gazo
![](destruction_of_tropical_forests.webp)
開発による熱帯林の破壊
::
<h5>エビの養殖</h5>
::top
東南アジアのマングローブ林は、[[エビ]]の養殖池をつくるために伐採されています。
::
::middle
養殖されたエビは、多くが日本へ輸出されています。
::
::last
養殖地は、生産量が減少すると放置され、また別の場所につくられます。
::
::gazo
![](mangrove.webp)
マングローブ林
::
::gazo
![](black_tiger.webp)
ブラックタイガー
::
#### 問題点
::top
熱帯林の伐採は、運搬のために周囲の関係ない木々まで伐採しなくてはなりません。
::
::middle
また、焼畑農業が拡大することで過度に伐採され、==熱帯林の破壊や砂漠化が深刻化しています。==
::
::last
森林の破壊は回復に時間がかかり、生態系に大きな影響を与えます。
::
---arrow---
::top
現状のまま森林の面積が減少すると、二酸化炭素吸収量が低下し、地球温暖化に繋がると危惧されています。
::
### 温帯林
::top
熱帯林と亜寒帯林（冷帯林）との間に発達している樹林で、南北で樹種の構成が異なります。
::
#### 分布
::top
温帯に広く分布します。
::
::last
特に温帯の南部には常緑広葉樹が、冷涼な北部には落葉広葉樹と針葉樹の混合林が分布します。
::
<script type="text/javascript">
createChartAsync(Chart.Pie, { "nation_cd": 156 }, 'China_wood_type', {
title: '中国の森林の割合 (%、2020年)',
legend: { position: 'top', maxLines: 3 },
colors: ['#9370db', '#b7db70'],
sliceVisibilityThreshold: 0
}, "./php/wood_type.php");
</script>
<div id="China_wood_type" style="width: 100%; height: 350px"></div>
#### 特色
::top
温帯の地域は人類の開発の歴史が比較的早かったこともあり、天然林（伐採などで人の手が入っても自然の力で更新している森林）はほとんど残らず、人工林ばかりです。
::
#### 利用樹種
::top
常緑広葉樹のカシ・クス・シイ、落葉広葉樹のブナ・ナラ・ケヤキ、針葉樹のマツ・スギ・モミ、硬葉樹の==コルクガシ==・==オリーブ==など幅広く存在します。
::
#### 問題
::top
開発が著しいこともあり、近年では酸性雨の影響で立ち枯れも目立ちます。
::
### 亜寒帯林（冷帯林）
::top
亜寒帯林（冷帯林）とは、いわゆる針葉樹林のことです。
::
::last
原生林（天然林の中でも全く人の手が入っていない、一度も伐採されたことのない森林）で、大規模に同種の針葉樹が広がる地域を特に[[タイガ]]と呼びます。
::
::gazo
![](taiga.webp)
タイガ
::
#### 分布
::top
カナダ・ロシア・北欧などの亜寒帯（冷帯）に分布します。
::
#### 特色
::top
亜寒帯（冷帯）は生育できる樹種が少ないため、亜寒帯林（冷帯林）の多くは、一種の針葉樹からなる森林（純林）です。
::
::middle
==ほしい樹種の大量取得が容易です==。
::
::middle
加えて、針葉樹は軟木のため、パルプ材として高い利用価値があります。
::
::last
このような理由から、亜寒帯林（冷帯林）が分布するカナダ・ロシア・北欧は、木材の輸出が盛んです。
::
<script type="text/javascript">
createChartAsync(Chart.Pie, { "nation_cd": 124 }, 'Canada_wood_type', {
title: 'カナダの森林の割合 (%、2020年)',
legend: { position: 'top', maxLines: 3 },
colors: ['#9370db', '#b7db70'],
sliceVisibilityThreshold: 0
}, "./php/wood_type.php");
</script>
<div id="Canada_wood_type" style="width: 100%; height: 350px"></div>
<script type="text/javascript">
createChartAsync(Chart.Pie, { "nation_cd": 643 }, 'Russia_wood_type', {
title: 'ロシアの森林の割合 (%、2020年)',
legend: { position: 'top', maxLines: 3 },
colors: ['#9370db', '#b7db70'],
sliceVisibilityThreshold: 0
}, "./php/wood_type.php");
</script>
<div id="Russia_wood_type" style="width: 100%; height: 350px"></div>
<script type="text/javascript">
createChartAsync(Chart.Pie, { "nation_cd": 246 }, 'Finland_wood_type', {
title: 'フィンランドの森林の割合 (%、2020年)',
legend: { position: 'top', maxLines: 3 },
colors: ['#9370db', '#b7db70'],
sliceVisibilityThreshold: 0
}, "./php/wood_type.php");
</script>
<div id="Finland_wood_type" style="width: 100%; height: 350px"></div>
<script type="text/javascript">
createChartAsync(Chart.Pie, { "nation_cd": 554 }, 'NZ_wood_type', {
title: 'ニュージーランドの森林の割合 (%、2020年)',
legend: { position: 'top', maxLines: 3 },
colors: ['#9370db', '#b7db70'],
sliceVisibilityThreshold: 0
}, "./php/wood_type.php");
</script>
<div id="NZ_wood_type" style="width: 100%; height: 350px"></div>
<h2 id="japan">日本の林業</h2>
### 森林面積と自給率
::top
日本は国土の2/3が森林です。
::
::middle
かつては高い森林率を活かして、木材をほぼ自給していました。
::
::last
しかし、近年は安価な輸入材の増加で、木材自給率が低下しました。
::
<script type="text/javascript">
createChartAsync(Chart.Combo, {
"params": ""
}, 'self_sufficiency_rate_of_wood'
, {
title: '木材供給量と木材自給率の推移',
height: 500,
vAxes: {
0: {
title: '木材供給量(億㎥)'
},
1: {
title: '木材自給率(%)'
}
},
hAxis: { title: '年' },
series: {
// Left-Yの列のデータ
0: { type: 'bars', targetAxisIndex: 0 },
1: { type: 'bars', targetAxisIndex: 0 },
// Right-Yの列のデータ
2: { type: 'line', targetAxisIndex: 1 },
},
isStacked: true,
}, "./php/wood_supply.php");
</script>
<div id="self_sufficiency_rate_of_wood" class="mx-auto mt-10 mb-10" style="width: 100%;max-width: 800px;"></div>
<script type="text/javascript">
createChartAsync(Chart.Pie, { "nation_cd": 392 }, 'Japan_wood_type', {
title: '日本の森林の割合 (%、2020年)',
legend: { position: 'top', maxLines: 3 },
colors: ['#9370db', '#b7db70'],
sliceVisibilityThreshold: 0
}, "./php/wood_type.php");
</script>
<div id="Japan_wood_type" style="width: 100%; height: 350px"></div>
### 日本の木材輸入先
::top
以前の日本は、東南アジア諸国から丸太を輸入していました。
::
::middle
1980年代、インドネシアが森林の保護や合板などの加工品の輸出を目的に、丸太の輸出を規制しました。
::
::last
1980年代後半、マレーシアも丸太の輸出を規制し、日本の木材輸入に占める東南アジアの割合は減少しました。
::
::sup
合板などに加工すると付加価値をつけて輸出可能
::
---arrow---
::top
近年、日本の木材輸入先は多角化しています。
::
<script type="text/javascript">
createChartAsync(Chart.Bar, { statistics_ids: [84, 85, 86, 87] }, 'wood_importer', {
title: '日本の木材輸入先(%)',
height: 500,
legend: { position: 'top', maxLines: 3 },
isStacked: 'percent',
titleTextStyle: {
fontSize: 14,
}
}, "./php/statistics_bars2.php");
</script>
<div id="wood_importer" class="mx-auto mt-10 mb-10" style="width: 100%;max-width: 800px;"></div>
### 日本の林業の課題
::top
現在はやや回復傾向にありますが、日本の木材自給率が低下した理由には、次のことがあげられます。
::
<ul class="en">
<li>海外からの安価な木材の輸入</li>
<li>林業従事者の減少と高齢化</li>
</ul>
---arrow---
::top
1980年代以降、日本の木材自給率とともに林業の従事者は減少を続けています。
::
::last
間伐などの管理が不十分な森林が増加しています。
::
<script type="text/javascript">
createChartAsync(Chart.Combo, {
"params": ""
}, 'forestry_worker'
, {
title: '日本の林業従事者数の推移と高齢化\n*高齢者率は65歳以上の従事者の割合\n**若年者率は35歳未満の従事者の割合',
height: 500,
vAxes: {
0: {
title: '林業従事者数(万人)'
},
1: {
title: '割合(%)'
}
},
hAxis: { title: '年' },
series: {
// Left-Yの列のデータ
0: { type: 'bars', targetAxisIndex: 0 },
// Right-Yの列のデータ
1: { type: 'line', targetAxisIndex: 1 },
2: { type: 'line', targetAxisIndex: 1 },
},
isStacked: true,
}, "./php/forestry_worker.php");
</script>
<div id="forestry_worker" class="mx-auto mt-10 mb-10" style="width: 100%;max-width: 800px;"></div>