## 地形図
### 日本の地形図
::top
地形図は、国土交通省の[[国土地理院]]が発行しています。
::
---arrow---
::top
縮尺は、１万分の１、2.5万分の１、５万分の１の３種類です。
::
::middle
縮尺とは、実物をどれほど縮めているかで、より縮めていれば「縮尺が小さい」、あまり縮めていなければ「縮尺が大きい」と表現します。
::
::middle
従って、2.5万分の１の方は、５万分の１より「縮尺が大きい」と言えます。
::
::last
「2.5万分の１＝0.00004」「5万分の１＝0.00002」と考えると、縮尺が「大きい」「小さい」はわかりやすくなります。
::
---arrow---
::top
５万分の１地形図の１面は、2.5万分の１地形図の４面分から編集されています。
::
::gazo
![](25000.webp)
2.5万分の1地形図
::
::gazo
![](50000-2.webp)
５万分の１地形図
＊赤枠内が2.5万分の1地形図で表示した範囲
::
<div class="overflow-x-auto mt-10 mb-10">
<table class="w-80 mx-auto table">
<tr>
<th class="text-center"></th>
<th class="text-center" colspan="2">範囲</th>
<th class="text-center">距離</th>
</tr>
<tr>
<th class="text-center"></th>
<th class="text-center">緯度</th>
<th class="text-center">経度</th>
<th class="text-center">１㎝の距離</th>
</tr>
<tr>
<th class="text-center">５万分の１</th>
<td class="text-center">10′</td>
<td class="text-center">15′</td>
<td class="text-center"><span onclick="chg(this)" class="all">500</span>ｍ</td>
</tr>
<tr>
<th class="text-center">2.5万分の１</th>
<td class="text-center">５′</td>
<td class="text-center">7′30″</td>
<td class="text-center"><span onclick="chg(this)" class="all">250</span>ｍ</td>
</tr>
</table>
</div>
## 見方
### 等高線
<div class="overflow-x-auto mt-10 mb-10">
<table class="w-80 mx-auto table">
<tr>
<th class="text-center" rowspan="2"></th>
<th class="text-center" rowspan="2">計曲線</th>
<th class="text-center" rowspan="2">主曲線</th>
<th class="text-center" colspan="2">補助曲線</th>
</tr>
<tr>
<th class="text-center">第一次</th>
<th class="text-center">第二次</th>
</tr>
<tr>
<th class="text-center">記号</th>
<td class="text-center">
<hr size="2px" color="#333333" width="80%">
</td>
<td class="text-center">
<hr size="1px" color="#333333" width="80%">
</td>
<td class="text-center">－－－－－</td>
<td class="text-center">- - - - - -</td>
</tr>
<tr>
<th class="text-center">５万分の１</th>
<td class="text-center"><span onclick="chg(this)" class="all">100</span>ｍ</td>
<td class="text-center"><span onclick="chg(this)" class="all">20</span>ｍ</td>
<td class="text-center">10ｍ</td>
<td class="text-center">５ｍ</td>
</tr>
<tr>
<th class="text-center">2.5万分の１</th>
<td class="text-center"><span onclick="chg(this)" class="all">50</span>ｍ</td>
<td class="text-center"><span onclick="chg(this)" class="all">10</span>ｍ</td>
<td class="text-center">5ｍ/2.5ｍ*</td>
<td class="text-center diagonal"></td>
</tr>
</table>
</div>
::sup
2.5ｍのときは等高線数値を表示
::
#### 等高線は閉曲線
::top
等高線は、==閉曲線になり、互いに交わりません==。
::
::gazo
![](contour.svg)
::
#### 内側が高い
::top
等高線は、==内側の曲線ほど標高が高くなります==。
::
::last
従って、下図が「2.5万分の１地形図」なら、便宜的に緑色で塗った部分は、110ｍ以上になります。
::
::gazo
![](contour1.svg)
::
::top
ただし、内側の曲線が外側の曲線より低くなる場合もあります。
::
::middle
曲線の内側に沿って線（ケバ線）が並んでいる場合、曲線内部は外側より低くなります。
::
::middle
そこには「凹（くぼ）地」が存在しているのです。
::
::last
凹地の記号がある等高線は外側の等高線と同じ高さになり、下図で便宜的に緑色で塗った部分は100ｍ未満になります。
::
::gazo
![](contour2.svg)
凹（くぼ）地がある場合
::
::top
実際に地形図で確認しましょう。
::
::middle
ケバ線の1つ外側の等高線は、10ｍ地点を示します。
::
::last
本来は等高線の内側にいくほど標高が高くなりますが、ケバ線の内側は10ｍ未満になっています。
::
::gazo
![](Katagami_map.webp)
潟上市内の地形図
*地理院地図から作成
::
::gazo
![](Katagami_section.webp){.twice}
潟上市内の断面図
*地理院地図から作成
::
::top
凹地が比較的小規模の場合、曲線の内側に向かう矢印で凹地を示すこともあります。
::
::last
上図と同様に、緑色で塗った部分は、100ｍ未満になります。
::
::gazo
![](contour3.svg)
小さな凹地がある場合
::
::top
なお、等高線からたくさんの凹地の存在が読み取れた場合、そこは[[カルスト]]地形と推測できます。
::
::gazo
![](doline.webp)
秋吉台（カルスト地形）
::
#### 白黒ゆえの難しさ
::gazo
![](contour4.svg)
カラーの場合
::
::top
実際の地形図はカラー印刷で、等高線は茶色、道路は黒色、河川は水色です。
::
::last
しかし、入試問題などでは白黒印刷で、区別がなかなかつきません。
::
::gazo
![](contour4-black and white.svg)
白黒の場合
::
::top
等高線は互いに交わらないため、まず最初に等高線から見つけます。
::
::middle
次に等高線から「尾根」「谷」を区別しましょう。
::
::middle
等高線が山頂に向かって張り出すように表現されている場所が[[谷]]、等高線が山頂から低い方に突き出して表現されている場所が[[尾根]]です。
::
::last
谷と尾根が区別できれば、谷を流れている線が川、尾根を通る線が道路と区別できます。
::
::gazo
![](ridges_valleys.svg)
尾根（赤色）と谷（緑色）
::
::gazo
![](ridge.webp)
尾根（背骨のような部分）
::
#### 等高線の間隔
::top
等高線は、間隔が広いほど緩やかな傾斜を、狭いほど急な傾斜を表します。
::
::gazo
![](contour5.svg)
::
### 分水嶺と集水域
::top
山に雨が降ると、水は <span onclick="choice(this)" class="choice"> <span class="false_choice">尾根</span>/<span
        class="true_choice">谷</span> </span>に集まります。
::
::middle
水が流れていく方向を分かつ尾根を[[分水嶺]]と呼びます。
::
### 地図記号
::top
地図記号は、地形・道・施設・土地利用の状況などを表現する記号です。
::
<div class="overflow-x-auto mt-10 mb-10">
<table class="w-100 mx-auto table">
<tr>
<td class="text-center"><img class="lazyload popup-img w-30px" data-src="img/symbol/school.svg" alt="小・中学校"
src="../share/img/loading.svg" /></td>
<td class="text-center"><span onclick="chg(this)" class="all">小・中学校</span></td>
<td class="text-center"><img class="lazyload popup-img w-30px" data-src="img/symbol/high-school.svg" alt="高等学校"
src="../share/img/loading.svg" /></td>
<td class="text-center"><span onclick="chg(this)" class="all">高等学校</span></td>
<td class="text-center"><img class="lazyload popup-img w-30px" data-src="img/symbol/hospital.svg" alt="病院"
src="../share/img/loading.svg" /></td>
<td class="text-center"><span onclick="chg(this)" class="all">病院</span></td>
</tr>
<tr>
<td class="text-center"><img class="lazyload popup-img w-30px" data-src="img/symbol/police-box.svg" alt=""
src="../share/img/loading.svg" /></td>
<td class="text-center"><span onclick="chg(this)" class="all">交番</span></td>
<td class="text-center"><img class="lazyload popup-img w-30px" data-src="img/symbol/police-station.svg" alt=""
src="../share/img/loading.svg" /></td>
<td class="text-center"><span onclick="chg(this)" class="all">警察署</span></td>
<td class="text-center"><img class="lazyload popup-img w-30px" data-src="img/symbol/fire-station.svg" alt=""
src="../share/img/loading.svg" /></td>
<td class="text-center"><span onclick="chg(this)" class="all">消防署</span></td>
</tr>
<tr>
<td class="text-center"><img class="lazyload popup-img w-30px" data-src="img/symbol/factory.svg" alt=""
src="../share/img/loading.svg" /></td>
<td class="text-center"><span onclick="chg(this)" class="all">工場</span><br>＊廃止</td>
<td class="text-center"><img class="lazyload popup-img w-30px" data-src="img/symbol/power-plant.svg" alt=""
src="../share/img/loading.svg" /></td>
<td class="text-center"><span onclick="chg(this)" class="all">発電所</span></td>
<td class="text-center"><img class="lazyload popup-img w-30px" data-src="img/symbol/shrine.svg" alt=""
src="../share/img/loading.svg" /></td>
<td class="text-center"><span onclick="chg(this)" class="all">神社</span></td>
</tr>
<tr>
<td class="text-center"><img class="lazyload popup-img w-30px" data-src="img/symbol/temple.svg" alt=""
src="../share/img/loading.svg" /></td>
<td class="text-center"><span onclick="chg(this)" class="all">寺院</span></td>
<td class="text-center"><img class="lazyload popup-img w-30px" data-src="img/symbol/post-office.svg" alt=""
src="../share/img/loading.svg" /></td>
<td class="text-center"><span onclick="chg(this)" class="all">郵便局</span></td>
<td class="text-center"><img class="lazyload popup-img w-30px" data-src="img/symbol/town-hall.svg" alt=""
src="../share/img/loading.svg" /></td>
<td class="text-center"><span onclick="chg(this)" class="all">町村役場</span></td>
</tr>
<tr>
<td class="text-center"><img class="lazyload popup-img w-30px" data-src="img/symbol/city-hall.svg" alt=""
src="../share/img/loading.svg" /></td>
<td class="text-center"><span onclick="chg(this)" class="all">市役所</span></td>
<td class="text-center"><img class="lazyload popup-img w-30px" data-src="img/symbol/library.svg" alt=""
src="../share/img/loading.svg" /></td>
<td class="text-center"><span onclick="chg(this)" class="all">図書館</span></td>
<td class="text-center"><img class="lazyload popup-img w-30px" data-src="img/symbol/museum.svg" alt=""
src="../share/img/loading.svg" /></td>
<td class="text-center"><span onclick="chg(this)" class="all">博物館・美術館</span></td>
</tr>
<tr>
<td class="text-center"><img class="lazyload popup-img w-30px" data-src="img/symbol/nursing-home.svg" alt=""
src="../share/img/loading.svg" /></td>
<td class="text-center"><span onclick="chg(this)" class="all">老人ホーム</span></td>
<td class="text-center"><img class="lazyload popup-img w-30px" data-src="img/symbol/windmill.svg" alt=""
src="../share/img/loading.svg" /></td>
<td class="text-center"><span onclick="chg(this)" class="all">風車</span></td>
<td class="text-center"><img class="lazyload popup-img w-30px" data-src="img/symbol/crater.svg" alt=""
src="../share/img/loading.svg" /></td>
<td class="text-center"><span onclick="chg(this)" class="all">噴火口</span></td>
</tr>
<tr>
<td class="text-center"><img class="lazyload popup-img w-30px" data-src="img/symbol/triangulation-point.svg"
alt="" src="../share/img/loading.svg" /></td>
<td class="text-center"><span onclick="chg(this)" class="all">三角点</span><br>＊位置の測量に使用</td>
<td class="text-center"><img class="lazyload popup-img w-30px" data-src="img/symbol/benchmark.svg" alt=""
src="../share/img/loading.svg" /></td>
<td class="text-center"><span onclick="chg(this)" class="all">水準点</span><br>＊高さの測量に使用</td>
<td class="text-center"><img class="lazyload popup-img w-30px" data-src="img/symbol/paddy.svg" alt=""
src="../share/img/loading.svg" /></td>
<td class="text-center"><span onclick="chg(this)" class="all">田</span>
</tr>
<tr>
<td class="text-center"><img class="lazyload popup-img w-30px" data-src="img/symbol/wasteland.svg" alt=""
src="../share/img/loading.svg" /></td>
<td class="text-center"><span onclick="chg(this)" class="all">荒地</span></td>
<td class="text-center"><img class="lazyload popup-img w-30px" data-src="img/symbol/field.svg" alt=""
src="../share/img/loading.svg" /></td>
<td class="text-center"><span onclick="chg(this)" class="all">畑</span></td>
<td class="text-center"><img class="lazyload popup-img w-30px" data-src="img/symbol/orchard.svg" alt=""
src="../share/img/loading.svg" /></td>
<td class="text-center"><span onclick="chg(this)" class="all">果樹園</span></td>
</tr>
<tr>
<td class="text-center"><img class="lazyload popup-img w-30px" data-src="img/symbol/mulberry.svg" alt=""
src="../share/img/loading.svg" /></td>
<td class="text-center"><span onclick="chg(this)" class="all">桑畑</span><br>＊廃止</td>
<td class="text-center"><img class="lazyload popup-img w-30px" data-src="img/symbol/tea.svg" alt=""
src="../share/img/loading.svg" /></td>
<td class="text-center"><span onclick="chg(this)" class="all">茶畑</span></td>
<td class="text-center"><img class="lazyload popup-img w-30px" data-src="img/symbol/bamboo.svg" alt=""
src="../share/img/loading.svg" /></td>
<td class="text-center"><span onclick="chg(this)" class="all">竹林</span></td>
</tr>
<tr>
<td class="text-center"><img class="lazyload popup-img w-30px" data-src="img/symbol/bamboo-grass.svg" alt=""
src="../share/img/loading.svg" /></td>
<td class="text-center"><span onclick="chg(this)" class="all">笹林</span></td>
<td class="text-center"><img class="lazyload popup-img w-30px" data-src="img/symbol/broadleaf-tree.svg" alt=""
src="../share/img/loading.svg" /></td>
<td class="text-center"><span onclick="chg(this)" class="all">広葉樹</span></td>
<td class="text-center"><img class="lazyload popup-img w-30px" data-src="img/symbol/coniferous-tree.svg" alt=""
src="../share/img/loading.svg" /></td>
<td class="text-center"><span onclick="chg(this)" class="all">針葉樹</span></td>
</tr>
<tr>
<td class="text-center"><img class="lazyload popup-img w-30px" data-src="img/symbol/cliff.svg" alt="土崖"
src="../share/img/loading.svg" /></td>
<td class="text-center"><span onclick="chg(this)" class="all"><ruby>土崖<rt>つちがけ</rt></ruby></span></td>
<td class="text-center"><img class="lazyload popup-img w-30px" data-src="img/symbol/rock_cliff.svg" alt="岩崖"
src="../share/img/loading.svg" /></td>
<td class="text-center"><span onclick="chg(this)" class="all"><ruby>岩崖<rt>がんがい</rt></ruby></span></td>
<td class="text-center"></td>
</tr>
</table>
</div>
</td>