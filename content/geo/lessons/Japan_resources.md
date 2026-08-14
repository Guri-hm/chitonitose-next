## 資源・エネルギー
### 資源の自給
#### 石灰石
::top
石灰石は、日本が自給できる数少ない鉱産資源です。
::
::last
大分・山口に多く分布しています。
::
### 資源の輸入
#### 鉄鉱石
<script type="text/javascript">
createChartAsync(Chart.Bar, { statistics_ids: [120] }, 'iron_ore_chart', {
title: '日本の鉄鉱石輸入先(%)',
legend: { position: 'top', maxLines: 3 },
isStacked: 'percent',
titleTextStyle: {
fontSize: 14,
}
}, "./php/statistics_bars2.php");
</script>
<div id="iron_ore_chart" class="mx-auto mt-10 mb-10" style="width: 100%;max-width: 800px;"></div>
#### 石炭
<script type="text/javascript">
createChartAsync(Chart.Bar, { statistics_ids: [121] }, 'coal_chart', {
title: '日本の石炭輸入先(%)',
legend: { position: 'top', maxLines: 3 },
isStacked: 'percent',
titleTextStyle: {
fontSize: 14,
}
}, "./php/statistics_bars2.php");
</script>
<div id="coal_chart" class="mx-auto mt-10 mb-10" style="width: 100%;max-width: 800px;"></div>
#### 原油
<script type="text/javascript">
createChartAsync(Chart.Bar, { statistics_ids: [122] }, 'crude_oil_chart', {
title: '日本の原油輸入先(%)',
legend: { position: 'top', maxLines: 3 },
isStacked: 'percent',
titleTextStyle: {
fontSize: 14,
}
}, "./php/statistics_bars2.php");
</script>
<div id="crude_oil_chart" class="mx-auto mt-10 mb-10" style="width: 100%;max-width: 800px;"></div>
#### 天然ガス
<script type="text/javascript">
createChartAsync(Chart.Bar, { statistics_ids: [123] }, 'lng_chart', {
title: '日本の天然ガス輸入先(%)',
legend: { position: 'top', maxLines: 3 },
isStacked: 'percent',
titleTextStyle: {
fontSize: 14,
}
}, "./php/statistics_bars2.php");
</script>
<div id="lng_chart" class="mx-auto mt-10 mb-10" style="width: 100%;max-width: 800px;"></div>
### エネルギー消費の変化
#### 1960年代
::top
エネルギー革命<div class="lead">エネルギー消費の中心が石炭から石油へ転換したこと
::
</div>
#### 1970年代
::top
1973年・1979年、石油危機
::
::last
石油偏重を見直し、石炭・原子力の併用へ
::
#### 2011年
::top
東日本大震災
::
::middle
原子力発電所の事故の影響で、原子力発電所の稼働率が低下
::
::last
発電量不足を補うために、[[石炭]]の消費量が先進国のなかでも増加
::
<script type="text/javascript">
createChartAsync(Chart.Pie, { "nation_cd": 392 }, 'Jp_power_generation', {
title: '日本 (億kWh、2019年)',
colors: ['#dc3912', '#3366cc', '#990099', '#109618', '#ff9900', '#FBD01D', '#dd4477'],
sliceVisibilityThreshold: 0
}, "./php/power_generation.php");
</script>
<div id="Jp_power_generation" style="width: 100%; height: 350px"></div>
<script type="text/javascript">
createChartAsync(Chart.Bar, { statistics_ids: [130, 131, 132, 133, 134, 135, 136] }, 'primary_energy', {
title: '日本の一次エネルギー供給量(%)',
legend: { position: 'top', maxLines: 3 },
isStacked: 'percent',
titleTextStyle: {
fontSize: 14,
}
}, "./php/statistics_bars2.php");
</script>
<div id="primary_energy" class="mx-auto mt-10 mb-10" style="width: 100%;max-width: 800px;"></div>