## 交通
### 旅客輸送
::top
通勤手段として自動車が普及しているため、割合が最も高いです。
::
::last
ただし、通勤には在来線や新幹線などの鉄道も利用されるため、他国に比べて鉄道の割合が高いです。
::
<script type="text/javascript">
createChartAsync(Chart.Bar, { statistics_ids: [140, 141] }, 'jp_passenger_transportation', {
title: '日本の旅客輸送(%)',
legend: { position: 'top', maxLines: 3 },
isStacked: 'percent',
titleTextStyle: {
fontSize: 14,
}
}, "./php/statistics_bars2.php");
</script>
<div id="jp_passenger_transportation" class="mx-auto mt-10 mb-10" style="width: 100%;max-width: 800px;"></div>
### 貨物輸送
::top
トラック輸送が多く、自動車の割合が最も高いです。
::
::last
また、船舶は迅速性に欠けますが一度の輸送量が多いため今日もよく利用されます。
::
::sup
アメリカは内陸部の長距離輸送のため、鉄道の割合が高い
::
<script type="text/javascript">
createChartAsync(Chart.Bar, { statistics_ids: [145, 146] }, 'jp_freight_transportation', {
title: '日本の貨物輸送(%)',
legend: { position: 'top', maxLines: 3 },
isStacked: 'percent',
titleTextStyle: {
fontSize: 14,
}
}, "./php/statistics_bars2.php");
</script>
<div id="jp_freight_transportation" class="mx-auto mt-10 mb-10" style="width: 100%;max-width: 800px;"></div>
## 貿易
### 貿易品目の変化
#### 戦前
::top
生糸・綿織物の輸出、綿花の輸入が中心でした。
::
#### 戦後
::top
工業の中心が重化学工業へ移行したため、輸出は鉄鋼・機械類が多く、輸入は原油が多くなりました。
::
#### 近年
::top
石油危機後、エネルギー消費の低い加工組立型に工業が変化しました。
::
::last
輸出は機械類（電気機械・自動車）が多く、輸入は機械類・食料品・原油が多くなりました。
::
<script type="text/javascript">
createChartAsync(Chart.Bar, { statistics_ids: [150, 151, 152] }, 'jp_export', {
title: '日本の輸出品目(%)',
legend: { position: 'top', maxLines: 3 },
isStacked: 'percent',
titleTextStyle: {
fontSize: 14,
}
}, "./php/statistics_bars2.php");
</script>
<div id="jp_export" class="mx-auto mt-10 mb-10" style="width: 100%;max-width: 800px;"></div>
<script type="text/javascript">
createChartAsync(Chart.Bar, { statistics_ids: [155, 156, 157] }, 'jp_import', {
title: '日本の輸入品目(%)',
legend: { position: 'top', maxLines: 3 },
isStacked: 'percent',
titleTextStyle: {
fontSize: 14,
}
}, "./php/statistics_bars2.php");
</script>
<div id="jp_import" class="mx-auto mt-10 mb-10" style="width: 100%;max-width: 800px;"></div>
### 貿易相手国の変化
#### 以前
::top
アメリカが最大の相手国でした。
::
#### 近年
::top
中国が最大の相手国です。
::
### 主要輸入品の輸入先
### 貿易港ごとの輸出入
#### 輸出
<h5>成田空港・関西空港</h5>
::top
軽量で付加価値の高い集積回路が多く輸出されます。
::
<h5>横浜・東海（清水・三河・名古屋）</h5>
::top
自動車が多く輸出されます。
::
#### 輸入
<h5>東京・大阪</h5>
::top
大都市で需要の大きい食料品や衣服が多く輸入されます。
::
<h5>千葉・四日市</h5>
::top
石油化学コンビナートがあり、原油・粗油が多く輸入されます。
::