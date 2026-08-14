## 産業分類
### 第３次産業
#### 第３次産業とは
::top
産業は次の３つに分類されます。
::
<ul class="en">
<li>第１次産業:::lead
農業・林業・水産業のこと
:::</li>
<li>第２次産業:::lead
工業・鉱業・建設業・電気やガス供給業・水道業など
:::</li>
<li>第３次産業:::lead
①②を除く商業・観光業・交通運輸業・情報通信業など
:::</li>
</ul>
---arrow---
::top
経済が発達すると、第１次産業が減少し、第２次産業・第３次産業の人口が増加します。
::
::last
例えば日本では、1951年から現在までに第１次産業の人口が<span onclick="choice(this)" class="choice"><span class="false_choice">増加</span>/<span class="true_choice">減少</span></span>し、また、第３次産業の人口が<span onclick="choice(this)" class="choice"><span class="true_choice">増加</span>/<span class="false_choice">減少</span></span>しました。
::
<script type="text/javascript">
createChartAsync(Chart.Combo, {
"params": [
{
statistics_id: 320,
nation_cd: 392
},
{
statistics_id: 321,
nation_cd: 392
},
{
statistics_id: 322,
nation_cd: 392
}
]
}, 'japan_industrial_population_structure'
, {
title: '日本の産業別就業者数の推移',
height: 500,
vAxes: {
0: {
title: '就業者数年平均(万人)'
}
},
hAxis: { title: '年' },
series: {
// Left-Yの列のデータ
0: { type: 'area', targetAxisIndex: 0 },
1: { type: 'area', targetAxisIndex: 0 },
2: { type: 'area', targetAxisIndex: 0 },
},
isStacked: true,
}, "./php/statistics_combo.php");
</script>
<div id="japan_industrial_population_structure" class="mx-auto mt-10 mb-10" style="width: 100%;max-width: 800px;">
</div>
#### 三角グラフ
::top
産業別就業率をグラフにしたものとして、三角グラフがあります。
::
::last
例えば、下のグラフ中のAの時点で、各産業の就業率は次のように読み取れます。
::
<ul class="circle">
<li>第１次産業就業率：[[47]]%</li>
<li>第２次産業就業率：[[22]]%</li>
<li>第３次産業就業率：[[31]]%</li>
</ul>
<div class="gazo "><img class="lazyload popup-img twice" data-src="img/triangular_graph_jp_history.webp" alt="三角グラフ" src="../share/img/loading.svg" /><br>三角グラフ</div>
## 商業
### 卸売業・小売業
::top
生産者と消費者をつなぐ商品売買が商業です。
::
::last
商業は{{卸売|おろしうり}}業と小売業に大別されます。
::
<div class="gazo "><img class="lazyload popup-img twice" data-src="img/wholesale_retail.webp" alt="卸売業・小売業" src="../share/img/loading.svg" /><br>卸売業・小売業</div>
#### 卸売業
::top
卸売業は多くの小売業者が商品の仕入れをしやすいように中心都市に立地します。
::
::last
商品販売額を見ると、三大都市圏の中心都市がある東京・大阪・愛知（名古屋）、そして地方の中心都市がある北海道（札幌）・宮城（仙台）・広島・福岡で多いです。
::
<div id="wholesale_trade" class="mx-auto mt-10 mb-10" style="width: 100%;max-width: 600px;"></div>
<div class="text-center">卸売業年間商品販売額（百万円，2019年）</div>
#### 小売業
::top
小売業は、人々の需要に応えるために、人口規模に比例して多く立地します。
::
<div id="retail_business" class="mx-auto mt-10 mb-10" style="width: 100%;max-width: 600px;"></div>
<div class="text-center">小売業年間商品販売額（百万円，2019年）</div>
<script type="text/javascript">
fetchChart('./php/jp_prefectures_statistical_data_json.php'
, {
method: 'POST',
body: JSON.stringify({ "statistics_id": 283, "data_year": 2019 }),
}
, Chart.Geo
, {
title: '卸売業年間商品販売額（百万円，2019年）',
region: 'JP',
resolution: 'provinces',
}
, 'wholesale_trade');
fetchChart('./php/jp_prefectures_statistical_data_json.php'
, {
method: 'POST',
body: JSON.stringify({ "statistics_id": 284, "data_year": 2019 }),
}
, Chart.Geo
, {
title: '小売業年間商品販売額（百万円，2019年）',
region: 'JP',
resolution: 'provinces',
}
, 'retail_business');
</script>
### 小売業の業態
#### 主な業態
::top
小売業の業態には、次のようなものがあります。
::
<ul class="en">
<li>専門店（商店街の青果店・精肉店など）:::lead
商圏の独立性あり（付近の店と顧客が競合しない）
:::
:::lead
車社会化（モータリゼーション）のなかで駐車場の整備ができず、近年は衰退傾向
:::
<div class="gazo"><img class="lazyload popup-img" data-src="img/shopping_street.webp" alt="商店街" src="../share/img/loading.svg" />商店街</div></li>
<li>百貨店（デパート）:::lead
==１店当たりの年間販売額が大きいが、今日減少傾向==
:::
:::lead
==駅・市の中心部に立地し==、信頼性の高い商品をそろえて接客を重視
:::
<div class="gazo"><img class="lazyload popup-img" data-src="img/department_store.webp" alt="百貨店" src="../share/img/loading.svg" />百貨店</div></li>
<li>総合スーパー・専門スーパー
:::lead
代表例として、総合スーパーはイオン、専門スーパーはユニクロやヤマダ電機
:::
:::lead
==広い駐車場をもち、都市郊外のロードサイドに立地==
:::
:::lead
商品を安価に販売することを追求
:::
<div class="sup">ロードサイド:::lead
国道など主要道路の沿線
:::
</div>
<div class="gazo"><img class="lazyload popup-img" data-src="img/general_merchandise_store.webp" alt="総合スーパー" src="../share/img/loading.svg" />総合スーパー</div></li>
<li>コンビニエンスストア:::lead
24時間営業（深夜営業などの長時間営業）で、==駅周辺や住宅地近くに立地==
:::
:::lead
多様な客層に対応し、1970年代以降から急激に増加
:::
<div class="gazo"><img class="lazyload popup-img" data-src="img/convenience_store.webp" alt="コンビニエンスストア" src="../share/img/loading.svg" />コンビニエンスストア</div></li>
</ul>
#### 業態ごとの立地
<div class="overflow-x-auto mt-10 mb-10">
<div class="text-center">商業形態別・事業所数の割合</div>
<table class="w-auto table mx-auto">
<tr class="text-center">
<th colspan="2"></th>
<th>百貨店</th>
<th>コンビニエンスストア</th>
<th>専門店</th>
<th>総合<br> スーパー</th>
</tr>
<tr>
<td rowspan="5" class="text-center">立地型<br> (%，2014年)</td>
<td>駅周辺型</td>
<td class="text-end">53.4</td>
<td class="text-end">44.8</td>
<td class="text-end">36</td>
<td class="text-end">27.9</td>
</tr>
<tr>
<td>市街地型</td>
<td class="text-end">33.7</td>
<td class="text-end">15.9</td>
<td class="text-end">23.2</td>
<td class="text-end">15.5</td>
</tr>
<tr>
<td>住宅地背景型</td>
<td class="text-end">6.7</td>
<td class="text-end">28.7</td>
<td class="text-end">28.1</td>
<td class="text-end">19.7</td>
</tr>
<tr>
<td>ロードサイド型</td>
<td class="text-end">4.5</td>
<td class="text-end">8.4</td>
<td class="text-end">9.6</td>
<td class="text-end">34.9</td>
</tr>
<tr>
<td>その他</td>
<td class="text-end">1.7</td>
<td class="text-end">2.1</td>
<td class="text-end">3.1</td>
<td class="text-end">2.1</td>
</tr>
<tr>
<td rowspan="3" class="text-center">開店時期<br> (%)</td>
<td>1984年以前</td>
<td class="text-end">63.3</td>
<td class="text-end">19.9</td>
<td class="text-end">56.7</td>
<td class="text-end">41.1</td>
</tr>
<tr>
<td>1985～1994年</td>
<td class="text-end">15.6</td>
<td class="text-end">22.5</td>
<td class="text-end">15.9</td>
<td class="text-end">22.6</td>
</tr>
<tr>
<td>1995～2004年</td>
<td class="text-end">21.1</td>
<td class="text-end">57.8</td>
<td class="text-end">27.4</td>
<td class="text-end">36.3</td>
</tr>
</table>
</div>
<h6>百貨店はどの立地型が多い？</h6>
::top
<span onclick="choice(this)" class="choice"><span class="true_choice">駅周辺</span>/<span class="false_choice">市街地</span>/<span class="false_choice">住宅地</span>/<span class="false_choice">ロードサイド</span></span>
::
<h6>コンビニエンスストアはどの立地型が多い？</h6>
::top
<span onclick="choice(this)" class="choice"><span class="false_choice">市街地</span>/<span class="true_choice">住宅地</span>/<span class="false_choice">ロードサイド</span></span>
::
<h6>ロードサイドで多い形態は？</h6>
::top
<span onclick="choice(this)" class="choice"><span class="false_choice">百貨店</span>/<span class="false_choice">コンビニエンスストア</span>/<span class="false_choice">専門店</span>/<span class="true_choice">総合スーパー</span></span>
::
<h6>ロードサイドのコンビニエンスストアは多い？</h6>
::top
<span onclick="choice(this)" class="choice"><span class="false_choice">多い</span>/<span class="true_choice">少ない</span></span>
::
### 商業・サービス業の立地
<div class="gazo "><img class="lazyload popup-img twice" data-src="img/commercial_location.webp" alt="商業・サービス業の立地" src="../share/img/loading.svg" /><br>商業・サービス業の立地<br>（2014年センター地理B本試験より引用）</div>
### 小売業の新しい業態
::top
インターネットを利用した通信販売が増加しています。
::
::last
結果、==店舗をもたずに商品を販売する無店舗販売が多くなってきています==。
::
## 観光業
### 労働と余暇
<div class="overflow-x-auto mt-10 mb-10">
<div class="text-center">労働時間と休暇日数の比較（2014年）</div>
<table class="w-auto table mx-auto">
<tr>
<th></th>
<th>日本</th>
<th>アメリカ</th>
<th>イギリス</th>
<th>ドイツ</th>
<th>フランス</th>
<th>イタリア</th>
</tr>
<tr>
<th class="text-start">総実労働時間</th>
<td class="text-end">1,729 時間</td>
<td class="text-end">1,789 時間</td>
<td class="text-end">1,677 時間</td>
<td class="text-end">1,371 時間</td>
<td class="text-end">1,473 時間</td>
<td class="text-end">1,734 時間</td>
</tr>
<tr>
<th class="text-start">週あたり労働時間</th>
<td class="text-end">37.7 時間</td>
<td class="text-end">42.0 時間</td>
<td class="text-end">41.4 時間</td>
<td class="text-end">40.0 時間</td>
<td class="text-end">37.8 時間</td>
<td class="text-end">36.8 時間</td>
</tr>
<tr>
<th class="text-start">年間休日数</th>
<td class="text-end">137.4日</td>
<td class="text-end">127.2日</td>
<td class="text-end">137.1日</td>
<td class="text-end">145.0日</td>
<td class="text-end">145.0日</td>
<td class="text-end">140.0日</td>
</tr>
<tr>
<th class="text-start">　週休日</th>
<td class="text-end">104.0日</td>
<td class="text-end">104.0日</td>
<td class="text-end">104.0日</td>
<td class="text-end">104.0日</td>
<td class="text-end">104.0日</td>
<td class="text-end">104.0日</td>
</tr>
<tr>
<th class="text-start">　週休日以外の休日</th>
<td class="text-end">15.0日</td>
<td class="text-end">10.0日</td>
<td class="text-end">8.0日</td>
<td class="text-end">11.0日</td>
<td class="text-end">11.0日</td>
<td class="text-end">11.0日</td>
</tr>
<tr>
<th class="text-start">　年次有給休暇</th>
<td class="text-end">*18.4日</td>
<td class="text-end">13.2日</td>
<td class="text-end">25.1日</td>
<td class="text-end">30.0日</td>
<td class="text-end">30.0日</td>
<td class="text-end">25.0日</td>
</tr>
</table>
::top
*取得平均8.8日
::
</div>
---arrow---
::top
ヨーロッパでは有給休暇を連日で取得し、夏季に数週間の長期休暇をつくる習慣があります。
::
::last
主にフランスではこの長期休暇をバカンスと呼びます。
::
---arrow---
::top
バカンスのような夏季の長期休暇中、フランス・スペイン・イタリアなどの地中海沿岸の地域が人気の観光地になります。
::
::last
この理由は、これらの地域が温暖で夏季に雨が少ない[[地中海性気候]]（[[Cs]]）だからです。
::
::sup
特にフランスのニースが有名なバカンスの地
::
::gazo
![](Nice.webp)
ニースの景観
::
::gazo
![](map_Nice.webp){.border}
ニース
::
### 新しい旅行の形
::top
近年、次のような新しい旅行の形が登場しました。
::
<ul class="en">
<li>[[エコツーリズム]]
:::lead
エコロジー（生態系）とツーリズム（旅行）の２語から成る造語で、各地域の自然・環境・動植物を歩きながら学ぶ旅行
:::
<div class="last">結果として環境保全に寄与</div></li>
<li>[[グリーンツーリズム]]
:::lead
都市住民が農山漁村を訪問し、自然・文化やその土地の人々との交流を楽しむ旅行
:::</li>
<li>[[ワーキングホリデー]]制度:::lead
アルバイトなどの仕事で滞在賃金を補いながら、長期の海外生活を体験できる若者向けの制度
:::</li>
</ul>
::gazo
![](green_tourism.webp)
グリーンツーリズムのイメージ（農林水産省HPより）
::
### 観光業
#### 国際観光収支
::top
国際観光において、外国人旅行者による消費を「収入」、自国民による外国での消費を「支出」とします。
::
::last
つまり、自国への旅行者が多いと「黒字」、外国への旅行者が多いと「赤字」になります。
::
#### 観光地
::top
1980年代以降、航空交通の運賃の低下が追い風になり、国際観光旅行が増加しました。
::
::middle
国際観光では、==Cs（地中海性気候）で過ごしやすいフランス・スペイン・イタリア==、==国土が広く多様性に富み、温帯が分布するアメリカ・中国==が人気です。
::
::middle
特に地中海沿岸には、ヨーロッパ北部の人々がバカンス（長期休暇）を利用し、避寒地として訪問します。
::
::last
これらの国の旅行収支は==黒字==になります（中国は<span onclick="choice(this)" class="choice"><span class="false_choice">黒字</span>/<span class="true_choice">赤字</span></span>）
    。
::
---arrow---
::top
今日では、物価の安さを求めて==中国への旅行者も増加==しています。
::
::last
日本も観光客の誘致に力を入れ、近年は==旅行収支が黒字になりました==。
::
<div class="overflow-x-auto mt-10 mb-10">
<div class="text-center">観光客数・国際観光収支</div>
</div>
#### 日本の余暇活動
::top
1980年代後半、<span onclick="choice(this)" class="choice"><span class="true_choice">円高</span>/<span class="false_choice">円安</span></span>が進み、日本人海外旅行者数が増加しました。
::
::middle
旅行先は、中国・韓国・台湾などの近隣国やアメリカ合衆国が多いです。
::
::last
2000年代まで国際観光収支は赤字でしたが、近年が訪日外国人数が増加して<span onclick="choice(this)" class="choice"><span class="true_choice">黒字</span>/<span class="false_choice">赤字</span></span>になりました。
::
<script type="text/javascript">
createChartAsync(Chart.Combo, {
"params": [
{
statistics_id: 314,
nation_cd: 392
},
{
statistics_id: 315,
nation_cd: 392
}
]
}, 'jp_tourism'
, {
title: '訪日外国人数と日本人海外旅行者数の推移(万人)',
height: 500,
vAxes: {
0: {
title: '人数(万人)'
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
<div id="jp_tourism" class="mx-auto mt-10 mb-10" style="width: 100%;max-width: 800px;"></div>
<div class="overflow-x-auto mt-10 mb-10">
<div class="text-center">各国・地域別日本人訪問者数人</div>
</div>