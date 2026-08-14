## 農業
### 耕地面積と農業産出額
::top
日本は国土の2/3が森林で、農民１人あたり耕地が狭いです。
::
::last
そのため、土地生産性や単位面積の農業産出額を高めてきました。
::
<script type="text/javascript">
createChartAsync(Chart.Bar, { "data_year": 2019, "statistics_ids": [36, 392, 840, 250, 826, 156] }, 'ha_per_farmer', {
title: '農民１人あたりの耕地面積(2019年)',
height: 300,
hAxis: {
title: 'ha',
minValue: 0
},
vAxis: {
title: '国'
},
}, "./php/ha_per_farmer.php");
</script>
<div id="ha_per_farmer" class="mx-auto mt-10 mb-10" style="width: 100%;max-width: 800px;"></div>
<script type="text/javascript">
createChartAsync(Chart.Bar, { "data_year": 2016, "statistics_ids": [36, 392, 840, 250, 826, 156] }, 'production_per_ha', {
title: '耕地1haあたりの農業産出額(2016年)',
height: 300,
hAxis: {
title: 'ドル',
minValue: 0
},
vAxis: {
title: '国'
},
}, "./php/production_per_ha.php");
</script>
<div id="production_per_ha" class="mx-auto mt-10 mb-10" style="width: 100%;max-width: 800px;"></div>
### 農業就業人口
::top
近年、農業就業人口の減少・高齢化が進行しています。
::
::last
農業が営まれなくなったことで、耕作放棄地が増加しています。
::
<script type="text/javascript">
createChartAsync(Chart.Combo, {}, 'agricultural_work_force', {
title: '農業就業人口の減少と高齢化',
height: 500,
vAxes: {
0: {
title: '農業就業人口(万人) ＊注１、注２'
},
1: {
title: '農業就業人口に占める65歳以上の割合(%) ＊注３'
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
}, "./php/agricultural_work_force.php");
</script>
<div id="agricultural_work_force" class="mx-auto mt-10 mb-10" style="width: 100%;max-width: 800px;"></div>
::sup
注１：農業就業人口は、自営農業のみに従事した人、または自営農業以外の仕事に従事していても年間労働日数で自営農業が多い人
::
::sup
注２：1995年以降は販売農家の統計であり、それ以前と異なる
::
::sup
注３：1965年までは60歳以上の割合
::
### 農産物の生産と輸入の転換
#### 米
<h5>第二次世界大戦以降</h5>
::top
食糧管理法<div class="lead">国が農家から自給用以外の米を買取り、市場への流通までを管理して米価を維持
::
::last
確実な買取りで農家の所得が保障され、米の生産が増加
::
</div>
<h5>高度経済成長期</h5>
::top
食生活の変化で米余り<div class="last">国が大量の在庫米に悩む
::
</div>
<h5>1970年代</h5>
::top
減反政策<div class="lead">稲の作付けを制限し、米以外の作物栽培への転換を促進
::
</div>
<h5>1995年</h5>
<ul class="circle">
<li>新食糧法:::lead
米の自由販売を許可
:::
<div class="last">味のよい米や銘柄米の生産で競争が増し、米の価格が低下</div></li>
<li>米の輸入自由化:::lead
低関税で一定量を輸入し、その後に高関税をかけること（ミニマム・アクセス）を開始
:::</li>
</ul>
<h5>1999年</h5>
::top
米の関税化<div class="lead">関税を支払えば、誰でも米を輸入可能
::
</div>
::gazo
![](rice_distribution.webp){.twice}
現行の米の流通ルート
::
#### 米以外
<h5>1991年</h5>
::top
牛肉・オレンジの輸入自由化<div class="last">以降、他の農作物も輸入規制を緩和
::
</div>
<h5>2001年</h5>
::top
中国からの安い野菜が国内農業に重大な損害を与えているとし、例外的に輸入制限をかける措置（セーフガード）を発動
::
### 食料自給率
<script type="text/javascript">
createChartAsync(Chart.Combo, {
"params": [
{
statistics_id: 162,
nation_cd: 392
},
{
statistics_id: 163,
nation_cd: 392
},
{
statistics_id: 164,
nation_cd: 392
},
{
statistics_id: 165,
nation_cd: 392
},
{
statistics_id: 166,
nation_cd: 392
},
{
statistics_id: 168,
nation_cd: 392
},
{
statistics_id: 169,
nation_cd: 392
},
{
statistics_id: 167,
nation_cd: 392
}
]
}, 'jp_food_self_sufficiency'
, {
title: '日本の食料自給率の推移',
height: 500,
vAxes: {
0: {
title: '%'
}
},
hAxis: { title: '年' },
series: {
// Left-Yの列のデータ
0: { type: 'line', targetAxisIndex: 0 },
// Right-Yの列のデータ
1: { type: 'line', targetAxisIndex: 0 },
},
isStacked: true,
}, "./php/statistics_combo.php");
</script>
<div id="jp_food_self_sufficiency" class="mx-auto mt-10 mb-10" style="width: 100%;max-width: 800px;"></div>
### 地域別の農業産出額の内訳
<script type="text/javascript">
createChartAsync(Chart.Bar, { "data_year": 2020, "region_cds": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }, 'agricultural_production', {
title: '地域別の農業産出額(2020年、%)',
height: 500,
legend: { position: 'top', maxLines: 3 },
isStacked: 'percent',
titleTextStyle: {
fontSize: 14,
}
}, "./php/region_agricultural_production.php");
</script>
<div id="agricultural_production" class="mx-auto mt-10 mb-10" style="width: 100%;max-width: 800px;"></div>
::gazo
![](JP_rice_farming.webp){.border}
稲作の盛んな地域
::
::gazo
![](JP_vegetable_growing.webp){.border}
野菜栽培の盛んな地域
::
::gazo
![](JP_fruit_growing.webp){.border}
果樹栽培の盛んな地域
::
::gazo
![](JP_livestock.webp){.border}
畜産の盛んな地域
::
## 林業
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
### 木材輸入先
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
createChartAsync(Chart.Bar, { "statistics_ids": [84, 85, 86, 87] }, 'wood_importer', {
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
### 林業の課題
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
## 水産業
### 漁獲量の推移
::top
日本の漁獲量はかつて世界最大でした。
::
<script type="text/javascript">
createChartAsync(Chart.Combo, { "nation_cd": 392 }, 'jp_fish_catche', {
title: '日本の漁業・養殖業の生産量の推移',
height: 500,
vAxes: {
0: {
title: '輸入量(万トン)'
},
1: {
title: '漁獲量(万トン)'
}
},
legend: { position: 'top', maxLines: 3 },
hAxis: { title: '年' },
series: {
// Left-Yの列のデータ
0: { type: 'line', targetAxisIndex: 0 },
// Right-Yの列のデータ
1: { type: 'area', targetAxisIndex: 1 },
2: { type: 'area', targetAxisIndex: 1 },
3: { type: 'area', targetAxisIndex: 1 },
4: { type: 'area', targetAxisIndex: 1 },
5: { type: 'area', targetAxisIndex: 1 },
},
isStacked: true,
}, "./php/fish_catche_detail.php");
</script>
<div id="jp_fish_catche" class="mx-auto mt-10 mb-10" style="width: 100%;max-width: 800px;"></div>
#### 高度経済成長期
::top
安価な燃料に支えられ、遠洋漁業が増加しました。
::
#### 1970年代
::top
次の２つを背景に、遠洋漁業が激減しました。
::
<ul class="en">
<li>２度の石油危機（1973年・1979年）による燃料の高騰</li>
<li>排他的経済水域（EEZ）の設定</li>
</ul>
::last
遠洋漁業の減少分を補うために、沖合漁業が急増しました。
::
#### 1980年代後半
::top
乱獲や海洋の変化によって沖合漁業が減少しました。
::
#### 近年
::top
水産物の輸入が増加しています。
::
::last
日本人によるエビ需要に応えるため、東南アジアではマングローブを破壊して養殖場を造成しています。
::
### 水産物の輸入
<div id="import_salmon_trout" class="mx-auto mt-10 mb-10 w-100 w-max800"></div>
<div id="import_bonito_tuna" class="mx-auto mt-10 mb-10 w-100 w-max800"></div>
<div id="import_shrimp" class="mx-auto mt-10 mb-10 w-100 w-max800"></div>
<div id="import_crab" class="mx-auto mt-10 mb-10 w-100 w-max800"></div>
<div id="import_squid" class="mx-auto mt-10 mb-10 w-100 w-max800"></div>
<div id="import_codfish" class="mx-auto mt-10 mb-10 w-100 w-max800"></div>
<script type="text/javascript">
fetchChart('./php/statistics_any_name.php'
, {
method: 'POST',
body: JSON.stringify({
"params": [
{
statistics_id: 200,
}
],
"chart": [
{
"type": Chart.Pie,
}
]
}),
}
, Chart.Pie
, {
title: 'サケ・マス類の輸入相手国(2019年、百万円、%)',
legend: { position: 'top' },
height: 300
}
, 'import_salmon_trout');
fetchChart('./php/statistics_any_name.php'
, {
method: 'POST',
body: JSON.stringify({
"params": [
{
statistics_id: 201,
}
],
"chart": [
{
"type": Chart.Pie,
}
]
}),
}
, Chart.Pie
, {
title: 'カツオ・マグロ類の輸入相手国(2019年、百万円、%)',
legend: { position: 'top' },
height: 300
}
, 'import_bonito_tuna');
fetchChart('./php/statistics_any_name.php'
, {
method: 'POST',
body: JSON.stringify({
"params": [
{
statistics_id: 202,
}
],
"chart": [
{
"type": Chart.Pie,
}
]
}),
}
, Chart.Pie
, {
title: 'エビの輸入相手国(2019年、百万円、%)',
legend: { position: 'top' },
height: 300
}
, 'import_shrimp');
fetchChart('./php/statistics_any_name.php'
, {
method: 'POST',
body: JSON.stringify({
"params": [
{
statistics_id: 203,
}
],
"chart": [
{
"type": Chart.Pie,
}
]
}),
}
, Chart.Pie
, {
title: 'カニの輸入相手国(2019年、百万円、%)',
legend: { position: 'top' },
height: 300
}
, 'import_crab');
fetchChart('./php/statistics_any_name.php'
, {
method: 'POST',
body: JSON.stringify({
"params": [
{
statistics_id: 204,
}
],
"chart": [
{
"type": Chart.Pie,
}
]
}),
}
, Chart.Pie
, {
title: 'イカの輸入相手国(2019年、百万円、%)',
legend: { position: 'top' },
height: 300
}
, 'import_squid');
fetchChart('./php/statistics_any_name.php'
, {
method: 'POST',
body: JSON.stringify({
"params": [
{
statistics_id: 205,
}
],
"chart": [
{
"type": Chart.Pie,
}
]
}),
}
, Chart.Pie
, {
title: 'タラ類の輸入相手国(2019年、百万円、%)',
legend: { position: 'top' },
height: 300
}
, 'import_codfish');
</script>