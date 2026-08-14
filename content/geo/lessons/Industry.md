## 繊維工業
### 立地
#### 一般衣類の生産
::top
多くて安い労働力が必要で、アジアの<span onclick="choice(this)" class="choice"><span class="false_choice">先進国</span>/<span class="true_choice">発展途上国</span></span>が生産の中心です。
::
<h5>海外移転の例</h5>
::top
例えばユニクロは、当初日本国内に生産拠点を置いていました。
::
::middle
次第に工場の海外移転が進み、2000年代初めには中国が生産拠点になりました。
::
::last
やがて2010年代後半にはベトナムが生産拠点になりました。
::
#### 高級衣類の生産
::top
ブランド品やファッション性のある衣服は、<span onclick="choice(this)" class="choice"><span class="true_choice">先進国</span>/<span class="false_choice">発展途上国</span></span>で生産されます。
::
#### ファッション性の求められる衣類の企画・開発
::top
ファッション性の求められる衣類の企画・開発は、流行をつかむために、先進国の大都市でおこなわれます。
::
## 金属工業
### アルミニウム工業
#### 立地
::top
アルミニウムの生産は、大量の電力が必要です。
::
::last
そのため電気代が安い国が生産の中心です。
::
::top
主な生産国は、<span onclick="choice(this)" class="choice"><span class="true_choice">石炭</span>/<span class="false_choice">石油</span>/<span class="false_choice">天然ガス</span></span>による火力発電が盛んなオーストラリア・中国・インド、<span onclick="choice(this)" class="choice"><span class="false_choice">火力</span>/<span class="true_choice">水力</span>/<span class="false_choice">風力</span>/<span class="false_choice">地熱</span>/<span class="false_choice">バイオマス</span></span>中心の発電をおこなうノルウェー・カナダ・ブラジルが該当します。
::
<script type="text/javascript">
createChartAsync(Chart.Pie, { "nation_cd": 578 }, 'Norway_power_generation', {
title: 'ノルウェー (億kWh、2019年)',
colors: ['#dc3912', '#3366cc', '#990099', '#109618', '#ff9900', '#FBD01D', '#dd4477'],
sliceVisibilityThreshold: 0
}, "./php/power_generation.php");
</script>
<script type="text/javascript">
createChartAsync(Chart.Pie, { "nation_cd": 76 }, 'Brazil_power_generation', {
title: 'ブラジル (億kWh、2019年)',
colors: ['#dc3912', '#3366cc', '#990099', '#109618', '#ff9900', '#FBD01D', '#dd4477'],
sliceVisibilityThreshold: 0
}, "./php/power_generation.php");
</script>
<script type="text/javascript">
createChartAsync(Chart.Pie, { "nation_cd": 124 }, 'Canada_power_generation', {
title: 'カナダ (億kWh、2019年)',
colors: ['#dc3912', '#3366cc', '#990099', '#109618', '#ff9900', '#FBD01D', '#dd4477'],
sliceVisibilityThreshold: 0
}, "./php/power_generation.php");
</script>
<div id="Norway_power_generation" style="width: 100%; height: 350px"></div>
<div id="Brazil_power_generation" style="width: 100%; height: 350px"></div>
<div id="Canada_power_generation" style="width: 100%; height: 350px"></div>
### 鉄鋼業
#### 立地
::top
鉄鋼業の立地は、歴史の中で変化してきました。
::
::gazo
![](changes__steel_industry.webp){.twice}
鉄鋼業の立地移動
::
::top
例えば、イギリスとフランスの鉄鋼業は、原料指向型から臨海指向型に変化しています。
::
::gazo
![](UK_iron_steel.webp)
イギリスの鉄鋼業
::
::gazo
![](France_iron_steel.webp)
フランスの鉄鋼業
::
<div id="carcrude_steels" class="mx-auto" style="width: 80%;"></div>
<script type="text/javascript">
lineChartAsync(4, [156, 356, 392, 840, 643, 276, 410], 'carcrude_steels', {
title: '各国粗鋼生産の変遷',
hAxis: {
title: '年'
},
vAxis: {
title: '万トン'
},
height: 500
});
</script>
::sup
ロシアの1991年までのデータは旧ソ連のもの
::
::sup
ドイツの1990年までのデータは東ドイツ含む
::
## 機械工業
### 自動車工業
#### 立地
::top
自動車工業は、多数の部品工場で作られたものを組立工場で製品化します。
::
::middle
工場が集まって立地することで、設備の共同利用や輸送コストの削減ができます。
::
::last
このような工場の立地を集積指向型と呼びます。
::
::gazo
![](automobile_assembly.webp)
自動車工場の集積
::
#### 生産台数
::top
自動車の生産台数は、経済の歴史と強く関連します。
::
<div id="cars" class="mx-auto" style="width: 80%;"></div>
<script type="text/javascript">
lineChartAsync(37, [156, 392, 840, 276, 410, 356], 'cars', {
title: '各国自動車生産の変遷',
hAxis: {
title: '年'
},
vAxis: {
title: '千台'
},
height: 500
});
</script>
<h5>日本の自動車の歩み</h5>
::top
戦後、日本はアメリカに対する自動車や電気機器の輸出を伸ばしていきました（貿易黒字）。
::
::middle
一方、安価な日本産に押され、アメリカの日本への輸出は少なくなりました（貿易赤字）。
::
::last
1980年代、日米間の貿易収支の不均衡は、国家間の対立[[貿易摩擦]]を起こしました。
::
::gazo
![](trade_friction.webp)
貿易摩擦
::
---arrow---
::top
1990年代、日本は「日本の輸出＝相手国の生産圧迫」という貿易摩擦の根本的問題を回避するため、アメリカに工場を建設して現地生産するようにしました。
::
::gazo
![](trade_friction_after.webp)
貿易摩擦の解消
::
---arrow---
::top
2000年代、日本はアジアでの現地生産も増やしました（国内生産の減少）。
::
::last
現地生産が増える一方、いわゆる「産業の空洞化」が目立つようになりました。
::
### 造船業
::top
造船業は、中国・韓国・日本がほぼ占めています。
::
<div id="shipbuilding" class="mx-auto" style="width: 80%;"></div>
<script type="text/javascript">
lineChartAsync(37, [156, 392, 840, 276, 410, 356], 'shipbuilding', {
title: '各国造船業の変遷',
hAxis: {
title: '年'
},
vAxis: {
title: '千総t'
},
height: 500
});
</script>
#### 日本の造船業
::top
広島や長崎が造船{{竣工|しゅんこう}}量の上位です。
::
### 航空機工業
::top
航空機は、先端技術が集約した部品を組み立てた製品です。
::
::last
軍事面での利用もあり、歴史のなかで軍需産業と強く結びついて発達してきました。
::
#### アメリカ合衆国
::top
アメリカ合衆国での航空機工業は、シアトルやロサンゼルスなど==太平洋側に立地します==。
::
::middle
特にシアトルでは、昔の航空機の材料である木材が得られ、また、コロンビア川の水力発電でアルミニウムを精錬できたために発達しました。
::
::last
また、一説によれば太平洋戦争での利用から太平洋側で発達したとも言われています。
::
::gazo
![](US_aircraft.webp){.border}
アメリカ合衆国の航空機工業
::
#### ヨーロッパ
::top
ヨーロッパでは、ドイツ・フランス・イギリスなどの国々が分業で部品を製造し、航空機を生産しています。
::
::last
最終的な航空機の組み立ては、フランスの[[トゥールーズ]]でおこなわれています。
::
::gazo
![](France_aircraft.webp){.border}
フランスのトゥールーズ
::
### 電気機械工業
#### 立地
::top
電気機械工業は、安価で大量に生産される製品ほど、豊富な労働力を求めて<span onclick="choice(this)" class="choice"><span class="true_choice">先進国</span>/<span class="false_choice">先進国以外</span></span>の地域に立地する傾向があります。
::
## その他
### 先端技術産業
#### 立地
<h5>研究・開発</h5>
::top
研究・開発の拠点は、大学や研究機関が集まる大都市に立地します。
::
<h5>生産</h5>
::top
製品の生産をおこなう工場は、==空港付近や高速道路付近に==立地します。
::
### 石油化学工業
#### 立地
::top
石油化学や石油精製部門は、原料となる石油の輸送に便利な==臨海部に==立地する傾向が強いです。
::
::middle
ただし、これは原油をオイルタンカーで直接輸入する国の話であり、ヨーロッパの内陸国は、ユーロポート（オランダのロッテルダムの港）で精製された石油をパイプラインで輸送してもらっています。
::
::last
パイプラインで結ばれれば、内陸部でも石油化学工業は発達します。
::
### パルプ工業・製紙業
#### パルプ工業
::top
パルプ工業は原料指向型のため、木材の豊富な国で発達します。
::
::sup
パルプ<div class="lead">木材から繊維のみ取り出したチップで、これを加工して紙を製造
::
</div>
#### パルプ
#### 製紙業
::top
紙の消費量が多い国が生産の上位です。
::