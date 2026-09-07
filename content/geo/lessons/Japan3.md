## 農業
### 耕地面積と農業産出額
::top
日本は国土の2/3が森林で、農民１人あたり耕地が狭いです。
::
::last
そのため、土地生産性や単位面積の農業産出額を高めてきました。
::
::land-use{data_year="2019" params="392"}
::chart{type="BarChart" dataset="ha_per_farmer" params="{&quot;data_year&quot;:2019,&quot;statistics_ids&quot;:[36,392,840,250,826,156]}" title="農民１人あたりの耕地面積(2019年)"}
::chart{type="BarChart" dataset="production_per_ha" params="{&quot;data_year&quot;:2016,&quot;statistics_ids&quot;:[36,392,840,250,826,156]}" title="耕地1haあたりの農業産出額(2016年)"}
### 農業就業人口
::top
近年、農業就業人口の減少・高齢化が進行しています。
::
::last
農業が営まれなくなったことで、耕作放棄地が増加しています。
::
::chart{type="ComboChart" dataset="agricultural_work_force" params="{}" title="農業就業人口の減少と高齢化"}
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
::food-self-sufficiency{params="392,380,826,250,276,840" data_year="2017"}
::chart{type="ComboChart" dataset="statistics_combo" params="{&quot;params&quot;:[{&quot;statistics_id&quot;:162,&quot;nation_cd&quot;:392},{&quot;statistics_id&quot;:163,&quot;nation_cd&quot;:392},{&quot;statistics_id&quot;:164,&quot;nation_cd&quot;:392},{&quot;statistics_id&quot;:165,&quot;nation_cd&quot;:392},{&quot;statistics_id&quot;:166,&quot;nation_cd&quot;:392},{&quot;statistics_id&quot;:168,&quot;nation_cd&quot;:392},{&quot;statistics_id&quot;:169,&quot;nation_cd&quot;:392},{&quot;statistics_id&quot;:167,&quot;nation_cd&quot;:392}]}" title="日本の食料自給率の推移"}
### 地域別の農業産出額の内訳
::chart{type="BarChart" dataset="region_agricultural_production" params="{&quot;data_year&quot;:2020,&quot;region_cds&quot;:[1,2,3,4,5,6,7,8,9,10]}" title="地域別の農業産出額(2020年、%)"}
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
::land-use{data_year="2019" params="392"}
::chart{type="ComboChart" dataset="wood_supply" params="{&quot;params&quot;:&quot;&quot;}" title="木材供給量と木材自給率の推移"}
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
::chart{type="BarChart" dataset="statistics_bars2" params="{&quot;statistics_ids&quot;:[84,85,86,87]}" title="日本の木材輸入先(%)"}
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
::chart{type="ComboChart" dataset="forestry_worker" params="{&quot;params&quot;:&quot;&quot;}" title="日本の林業従事者数の推移と高齢化\n*高齢者率は65歳以上の従事者の割合\n**若年者率は35歳未満の従事者の割合"}
## 水産業
### 漁獲量の推移
::top
日本の漁獲量はかつて世界最大でした。
::
::chart{type="ComboChart" dataset="fish_catche_detail" params="{&quot;nation_cd&quot;:392}" title="日本の漁業・養殖業の生産量の推移"}
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
::chart{type="PieChart" dataset="statistics_any_name" params="{&quot;params&quot;:[200]}" title="サケ・マス類の輸入相手国(2019年、百万円、%)"}
::chart{type="PieChart" dataset="statistics_any_name" params="{&quot;params&quot;:[201]}" title="カツオ・マグロ類の輸入相手国(2019年、百万円、%)"}
::chart{type="PieChart" dataset="statistics_any_name" params="{&quot;params&quot;:[202]}" title="エビの輸入相手国(2019年、百万円、%)"}
::chart{type="PieChart" dataset="statistics_any_name" params="{&quot;params&quot;:[203]}" title="カニの輸入相手国(2019年、百万円、%)"}
::chart{type="PieChart" dataset="statistics_any_name" params="{&quot;params&quot;:[204]}" title="イカの輸入相手国(2019年、百万円、%)"}
::chart{type="PieChart" dataset="statistics_any_name" params="{&quot;params&quot;:[205]}" title="タラ類の輸入相手国(2019年、百万円、%)"}