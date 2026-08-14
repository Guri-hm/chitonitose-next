## 人口
### 出生率・死亡率
::top
日本の人口は
		
		
		です。
::
::middle
日本の出生率・死亡率などの統計データは次の通りです。
::
<ul class="circle">
<li>出生率（人口千対）：</li>
<li>合計特殊出生率：</li>
<li>死亡率（人口千対）：</li>
<li>老年人口（65歳以上）の割合：</li>
</ul>
::middle
統計データから、日本は少産で人口減少が進む超高齢社会と言えます。
::
::sup
超高齢社会<div class="lead">老年人口が人口の21%を超えた社会
::
</div>
::gazo
![](JP_population_by_age.webp)
年齢別人口と合計特殊出生率の推移
::
### 人口ピラミッド
#### 1930年
::top
富士山型（多産多死）の人口ピラミッドです。
::
::gazo
![](population_pyramid_Japan1930.webp)
日本の人口ピラミッド(1930年)
::
#### 1960年
::top
つり鐘型（少産少死）の人口ピラミッドです。
::
::gazo
![](population_pyramid_Japan1960.webp)
日本の人口ピラミッド(1960年)
::
#### 1990年
::top
つり鐘型（少産少死）の人口ピラミッドです。
::
::gazo
![](population_pyramid_Japan1990.webp)
日本の人口ピラミッド(1990年)
::
#### 2020年
::top
つぼ型（少産少死）の人口ピラミッドです。
::
::gazo
![](population_pyramid_Japan2020.webp)
日本の人口ピラミッド(2020年)
::
#### 2021年（詳細）
::top
日本の人口ピラミッドには、ベビーブームや「ひのえうま（丙午）」の影響が見られます。
::
::sup
ひのえうま<div class="lead">60年に１回まわってくる年のことで、その年に生まれた女性は気性が激しいという迷信があり、日本の出生率が低下
::
</div>
::gazo
![](population_pyramid_Japan_detail.webp)
日本の人口ピラミッド(2021年)
::
### 人口移動
#### 1950～70年
::top
高度経済成長期にあたり、東北や四国、九州地方の人口が太平洋ベルトに流入しました。
::
::last
結果、地方の過疎化、大都市の過密化が問題になりました。
::
::gazo
![](population_trends_1950_1970.webp){.border}
1950～1970年の人口増減率
::
#### 1970～1990年
::top
高度経済成長期に流入した人口が、郊外に住宅を購入しました。
::
::last
東京都周辺でドーナツ化現象が生じました。
::
::gazo
![](population_trends_1970_1990.webp){.border}
1970～1990年の人口増減率
::
#### 1990～2014年
::top
1990年前半のバブル崩壊で地価が下落しました。
::
::middle
==東京の都心回帰が見られました==。
::
::last
一方、地方の過密化が解決されず、限界集落などが目立つようになりました。
::
::sup
限界集落<div class="lead">65歳以上の人口が50%を超え、社会的な共同生活の維持が困難な状態にある集落のこと
::
</div>
::gazo
![](population_trends_1990_2014.webp){.border}
1990～2014年の人口増減率
::
::gazo
![](population_trends_central_Tokyo.webp){.twice}
都心と郊外の人口増減
＊内閣府「地域の経済2011」より引用
::
### 都道府県別の人口
#### 老年人口が多い、年少人口が少ない
::top
秋田県・高知県・徳島県など過疎化が進む地方は、老年人口（65歳以上）が多いです。
::
::last
加えて、これらの県は年少人口（15歳未満）が少ないです。
::
#### 老年人口が少ない
::top
生産年齢人口（15歳～64歳）の流入が進む東京都は、老年人口が最も少ないです。
::
#### 年少人口が多い
::top
沖縄県は年少人口（15歳未満）が最も多く、合計特殊出生率が
		
		
		です。
::
## 外国人人口
### 韓国籍・朝鮮籍
::top
戦前から日本に居住し、かつては外国籍の人々のなかで最も割合が大きかったです。
::
::last
大阪府に多く居住しています。
::
### ブラジル籍・ペルー籍
::top
1990年、入国管理法改正<div class="lead">以前は単純労働者の入国・定住を認めなかったが、日系３世まで家族含めて就労可能に変更
::
</div>
---arrow---
::top
1990年代、日系人が単純労働を目的に流入しました。
::
::last
自動車などの工場がある愛知県・静岡県・群馬県・滋賀県などに多く居住しています。
::
### 中国籍
::top
2000年以降に急増し、今日外国籍の人々のなかで最も割合が大きいです。
::
::last
留学や仕事で日本に居住しています。
::
### アメリカ籍
::top
米軍基地がある沖縄で多く居住しています。
::
<script type="text/javascript">
createChartAsync(Chart.Line, { statistics_ids: "" }, 'foreign_population', {
title: '国籍別総在留外国人人口',
hAxis: {
title: '年'
},
vAxis: {
title: '人'
},
height: 500
}, "./php/foreign_population.php");
</script>
<div id="foreign_population" class="mx-auto" style="width: 100%;max-width: 800px;"></div>
<script type="text/javascript">
createChartAsync(Chart.Bar, { statistics_ids: "" }, 'foreign_population_pref', {
title: '都道府県別、国籍別在留外国人(2019年、%)',
height: 500,
legend: { position: 'top', maxLines: 3 },
isStacked: 'percent',
titleTextStyle: {
fontSize: 14,
}
}, "./php/foreign_population_prefecture.php");
</script>
<div id="foreign_population_pref" class="mx-auto mt-10 mb-10" style="width: 100%;max-width: 800px;"></div>