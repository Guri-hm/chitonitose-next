## 人口爆発
### 人口の推移
::top
現在（2020年現在）、約77億人です（==2011年時点で70億人を突破==）。
::
::middle
1600年の時点で約５億人なので、この数百年間で人口は急激に増加したことになります。
::
::last
人口の急激増加を人口爆発と呼んでいます。
::
<div id="world_population_changes" class="mx-auto" style="width: 80%;"></div>
<script>
lineChartAsync(290, [999], 'world_population_changes', {
title: '世界人口の推移',
hAxis: {
title: '年'
},
vAxis: {
title: '億人'
},
height: 500
});
</script>
<script type="text/javascript">
google.charts.load('current', { 'packages': ['corechart'] });
google.charts.setOnLoadCallback(drawChart);
function drawChart() {
var data = google.visualization.arrayToDataTable([
['年', 'アジア', '北アメリカ', '南アメリカ', 'ヨーロッパ', 'アフリカ', 'オセアニア'],
['1950', 1379, 162, 168, 550, 228, 13],
['1955', 1533, 177, 192, 576, 254, 14],
['1960', 1700, 194, 220, 606, 284, 16],
['1965', 1902, 209, 252, 634, 321, 18],
['1970', 2146, 222, 287, 657, 365, 19],
['1975', 2396, 235, 323, 677, 418, 22],
['1980', 2636, 248, 362, 693, 482, 23],
['1985', 2911, 261, 402, 708, 556, 25],
['1990', 3211, 276, 443, 721, 638, 27],
['1995', 3484, 295, 483, 727, 724, 29],
['2000', 3736, 313, 523, 727, 819, 31],
['2005', 3980, 329, 558, 729, 928, 34],
['2010', 4221, 345, 591, 736, 1055, 37],
['2015', 4459, 360, 623, 742, 1201, 40],
['2020', 4664, 374, 652, 746, 1361, 44],
['2021', 4695, 375, 656, 745, 1394, 44],
['2022', 4723, 377, 660, 744, 1427, 45]
]);
var options = {
title: '地域別人口の推移',
hAxis: { title: '年', showTextEvery: 2 },
vAxis: { title: '百万人', minValue: 0 },
isStacked: true,
curveType: 'function',
// isStacked=trueで積み上げ(デフォルトはfalse)
};
var chart = new google.visualization.AreaChart(document.getElementById('world_area_population'));
chart.draw(data, options);
}
</script>
<div id="world_area_population" style="width: 100%; height: 500px;"></div>
### 増加の背景
::top
人口爆発の背景は、医学・薬学の発達や衛生面の向上です。
::
::middle
つまり、人が死ににくくなったのです。
::
::last
この背景は、先進国から生じました。
::
---arrow---
::top
かつての発展途上国では、高い出生率の割に、自然災害や感染症、食料不足で乳児死亡率が高く、それほど人口が増えませんでした。
::
::middle
しかし、1950年以降（第二次世界大戦後）、先進国やWHOからの医療援助や食料供給で、乳児死亡率が低下しました。
::
::last
これにより、発展途上国で人口爆発に進みました。
::
::gazo
![](populations_developed_developing.svg){.twice}
先進国と発展途上国の人口割合
::
::top
発展途上国での人口爆発は、多くの問題を起こしました。
::
::middle
人口爆発の背景は、あくまでも先進国からの援助であり、発展途上国の経済発展を伴っていません。
::
::last
援助が追いつかないほど人が増えれば、土地不足や食料不足になってしまうのです。
::
## 各地域の人口
::gazo
![](jinkou_sekai.jpg)
::
<div class="overflow-x-auto mt-10 mb-10">
<div class="text-center">地域別の人口（2020年）</div>
<table class="w-auto table mx-auto">
<tr>
<th>地域</th>
<th>人(億人)</th>
</tr>
<tr>
<td>世界</td>
<td align="right">78.0</td>
</tr>
<tr>
<td>アフリカ</td>
<td align="right"><span class="marker">13.5</span></td>
</tr>
<tr>
<td>アジア</td>
<td align="right"><span class="marker">46.2</span></td>
</tr>
<tr>
<td>ヨーロッパ</td>
<td align="right">7.4</td>
</tr>
<tr>
<td>ラテンアメリカ</td>
<td align="right">4.4</td>
</tr>
<tr>
<td>アングロアメリカ</td>
<td align="right">6.0</td>
</tr>
<tr>
<td>オセアニア</td>
<td align="right"><span class="marker">0.4</span></td>
</tr>
</tr>
</table>
</div>
### アジア・アフリカ
::top
人口の地域分布は、==アジア・アフリカに偏ります==。
::
::middle
アジアは、多くの国が1940～50年代に独立し、発展とそれに伴う人口増加を経つつあります。
::
::middle
一方、アフリカは1960年代以降に独立国が増え、今人口を伸ばし始めつつある段階です。
::
::last
現在人口が最も多く分布するのはアジアですが、人口増加率はアフリカの方が高くなります。
::
---arrow---
::top
次の表で、人口の上位15位までにアジアの国が多いことも確認しておきましょう。
::
::last
世界の人口１位は[[中国]]、人口２位は[[インド]]です（2018年時点）。
::
<div class="overflow-x-auto mt-10 mb-10">
<div class="text-center">世界の人口１位～15位（2018年 ）</div>
<table class="w-auto table mx-auto">
<tr>
<th>国名</th>
<th>人(億人)</th>
</tr>
<tr>
<td>世界</td>
<td align="right">76.3</td>
</tr>
<tr>
<td><span class="marker">中国</span></td>
<td align="right">14.2</td>
</tr>
<tr>
<td><span class="marker">インド</span></td>
<td align="right">13.0</td>
</tr>
<tr>
<td>アメリカ合衆国</td>
<td align="right">3.3</td>
</tr>
<tr>
<td><span class="marker">インドネシア</span></td>
<td align="right">2.6</td>
</tr>
<tr>
<td>ブラジル</td>
<td align="right">2.1</td>
</tr>
<tr>
<td><span class="marker">パキスタン</span></td>
<td align="right">2.1</td>
</tr>
<tr>
<td>ナイジェリア</td>
<td align="right">1.9</td>
</tr>
<tr>
<td><span class="marker">バングラデシュ</span></td>
<td align="right">1.6</td>
</tr>
<tr>
<td>ロシア</td>
<td align="right">1.4</td>
</tr>
<tr>
<td><span class="marker">日本</span></td>
<td align="right">1.3</td>
</tr>
<tr>
<td>メキシコ</td>
<td align="right">1.3</td>
</tr>
<tr>
<td><span class="marker">フィリピン</span></td>
<td align="right">1.1</td>
</tr>
<tr>
<td>エジプト</td>
<td align="right">1.0</td>
</tr>
<tr>
<td>エチオピア</td>
<td align="right">1.0</td>
</tr>
<tr>
<td><span class="marker">ベトナム</span></td>
<td align="right">0.9</td>
</tr>
</table>
<div class="text-center">＊アジアのみマーカー付</div>
</div>
## 出生率・死亡率・自然増加率
<div class="overflow-x-auto mt-10 mb-10">
<div class="text-center">地域別の出生率・死亡率・自然増加率（2015～20年の平均値）</div>
<table class="w-auto table mx-auto">
<tr>
<th>地域</th>
<th>出生率(‰)</th>
<th>死亡率(‰)</th>
<th>自然増加率(‰)</th>
</tr>
<tr>
<td>世界</td>
<td align="right">18.5</td>
<td align="right">7.5</td>
<td align="right">10.9</td>
</tr>
<tr>
<td>アフリカ</td>
<td align="right"><span class="marker">33.6</span></td>
<td align="right"><span class="marker">8.2</span></td>
<td align="right"><span class="marker">25.4</span></td>
</tr>
<tr>
<td>アジア</td>
<td align="right">16.4</td>
<td align="right">6.9</td>
<td align="right">9.5</td>
</tr>
<tr>
<td>ヨーロッパ</td>
<td align="right"><span class="marker">10.4</span></td>
<td align="right"><span class="marker">11.0</span></td>
<td align="right"><span class="marker">-0.6</span></td>
</tr>
<tr>
<td>ラテンアメリカ</td>
<td align="right">16.5</td>
<td align="right"><span class="marker">6.3</span></td>
<td align="right">10.2</td>
</tr>
<tr>
<td>アングロアメリカ</td>
<td align="right"><span class="marker">11.8</span></td>
<td align="right">8.6</td>
<td align="right"><span class="marker">3.2</span></td>
</tr>
<tr>
<td>オセアニア</td>
<td align="right">16.7</td>
<td align="right">6.8</td>
<td align="right">9.9</td>
</tr>
</table>
</div>
### 出生率
::top
出生率とは、人口1000人に対する出生数の割合です（単位は{{‰|ﾊﾟｰﾐﾙ}}）。
::
::last
出生率は、==発展途上国ほど高く、先進国ほど低くなります==。
::
---arrow---
::top
発展途上国では、子どもも重要な労働力になるため、また、社会保障制度が未整備で老後に子どもに頼る必要があるため、出生率が高くなります。
::
---arrow---
::top
先進国では、教育などの養育費が高いため、女性の高学歴化・社会進出の活発化による晩婚化のため、出生率が低くなります。
::
::middle
ただし、==フランスや北欧諸国のスウェーデンなどは比較的早い時期に育児政策を打ち出し、出生率の向上に成功しています==。
::
::last
一方で対応に遅れる==日本・ドイツ・イタリアは出生率が低いままです==。
::
::sup
少子の枢軸<div class="lead">少子化に悩む日本・ドイツ・イタリアが第二次世界大戦で枢軸国と呼ばれたことからの皮肉
::
</div>
#### 合計特殊出生率
::top
合計特殊出生率は、一人の女性が生涯何人の子供を産むのかを推計したものです。
::
::last
この値が2.1（厳密には2.07～2.08）を超えれば人口増加と考えます。
::
::sup
2.0でないのは、性比（男女の生まれる比率）が1:1でないため
::
---arrow---
::top
先進国のほとんどが、2.1を下回ります。
::
::last
日本の合計特殊出生率は、1947～49年頃では4.3を超えていましたが、2016年では1.44と低くなっています。
::
::gazo
![](total_fertility_rate_jp.svg ){.twice}
日本の合計特殊出生率
::
---arrow---
::top
多くの発展途上国は、2.1を上回ります。
::
::last
ただし、[[中国]]はかつての一人っ子政策の効果で2017年には1.68と低くなっています（1965年は6.39）。
::
::sup
一人っ子政策は2015年廃止
::
::sup
==東アジアの出生率は、一人っ子政策を採っていた中国の影響で低い==
::
### 死亡率
::top
死亡率とは、人口1000人に対する死亡数の割合です（単位は{{‰|ﾊﾟｰﾐﾙ}}）。
::
::last
死亡率の特徴は、出生率のように発展途上国・先進国のどちらかに高低が偏るものではありません。
::
---arrow---
::top
死亡率は、次の２つの数値に大きく左右されます。
::
<ul class="en">
<li>乳児死亡率（１歳未満の死亡率）</li>
<li>高齢者の死亡率（65歳以上の死亡率）</li>
</ul>
#### 乳児死亡率
::top
乳児は抵抗力が弱く、悪い衛生環境や栄養不足で病気にかかりやすくなります。
::
::middle
医療や衛生が整った先進国では、乳児死亡率がほとんど0‰に近い値になりますが、発展途上国ではそうはいきません。
::
::last
==乳児死亡率は、発展途上国で高くなり==、その値も50‰を超えるほどです（アフリカ中部の国々では70～80‰）。
::
#### 高齢者の死亡率
::top
先進国では高齢化が進み、人口に占める高齢者の割合は高いです。
::
::last
その高い割合を占める人々が持病や寿命で亡くなるため、==高齢者の死亡率は、先進国の多いヨーロッパ・アングロアメリカで高くなります==。
::
### 自然増加率
::top
人口は、人の生死で増減します。
::
::last
生死による増減を[[自然増加率]]と呼び、次の計算で求められます。
::
<br>
::top
自然増加率＝出生率－死亡率
::
<br>
::top
自然増加率は、発展途上国で高く、先進国で低くなります。
::
### 他の増加率－社会増加率
::top
人口は、生死以外だけでなく、他の地域からの流入、あるいは、他の地域への流出でも増減します。
::
::last
これを[[社会増加率]]と呼び、次の計算で求められます。
::
<br>
::top
社会増加率＝流入率－流出率
::
<br>
::top
国際的な人の流入は、移民によって建国された歴史をもつカナダ・アメリカ・オーストラリア・ニュージーランドで多く見られます。
::
::last
結果、社会増加率が高くなります。
::
---arrow---
::top
この流入は、自然増加率の上昇にも繋がります。
::
::middle
そもそも移り住むのは、体力や気力の多く、これから出産を迎えるような若い世代です。
::
::last
従って、==先進国が混じるアングロアメリカ（カナダ・アメリカ）やオセアニアで出生率がある程度高くなります==。
::
<script type="text/javascript">
createChartAsync(Chart.Area, { "params": [[290, 840], [291, 840]] }, 'US_immigration', {
title: 'アメリカ合衆国の人口と移民の推移',
hAxis: {
title: '年'
},
vAxis: {
title: '億人'
},
height: 500
}, "./php/different_statistics_json.php");
</script>
<script type="text/javascript">
createChartAsync(Chart.Area, { "params": [[290, 36], [291, 36]] }, 'Australia_immigration', {
title: 'オーストラリアの人口と移民の推移',
hAxis: {
title: '年'
},
vAxis: {
title: '億人'
},
height: 500
}, "./php/different_statistics_json.php");
</script>
<div id="US_immigration" class="mx-auto" style="width: 80%;"></div>
<div id="Australia_immigration" class="mx-auto" style="width: 80%;"></div>