'use client';

import { useEffect, useRef, useState } from 'react';

// 元HTML（jh_old_country_name.html）のSVGをそのまま埋め込み、クリックイベントのみReact側で制御する
const MAP_SVG = `<svg version="1.1" id="svg2" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 425.5 432.129">
	<style>
		path.svg-area {
			cursor: pointer;
		}

		path.svg-area:hover {
			fill: #000;
		}
	</style>
	<g id="g2458" transform="translate(231.2465,294.9057)">
		<path id="path2460" class="svg-area" data-name="紀伊（きい）" fill="#DCE0C0" stroke="#000000" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="bevel" d="
		M19.25-10.75L14.15-13v7L13-4h-2.6L6.65-1v1.75H0.4l-3.15-2.601V-4.25l-1.6-2.351L0.15-12v-5h-2.9l-1.5,1h-3.5l-11.1,1.25
		l1.85,1.5v2h1.5L-18.1-8v1.399l1.75,1.25L-18-3.5h-1.25v3l7.65,5.899l2.85,1v1.25h-1.6L-10.5,8.75H-9v2.899l8.25,3.851H1.9V17H4
		l4.65-5.75l5.75-12l4.25-1.75v-3l-1.5-1l2.1-1.75V-10.75" />
	</g>
	<g id="g3365" transform="translate(56.7125,367.8375)">
		<path id="path3367" class="svg-area" data-name="薩摩（さつま）" fill="#EEDEDE" stroke="#000000" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="bevel" d="
		M18.05-14.15v6.399h-1.5L11.3-2.9v1l1.25,2.649V3.85L9.15,8.25V10h1.25v4.851l3.15,2.649v2L10.9,21H8.15l-1.6-3.149l-7.4-1.5
		l-1.5-3.601l-1.35-2L-2.1,9.6l1.5,1.649h1.5L3.05,7.35V2L-0.6-1.25V-3.9l1.25-1v-8.4l1.3-1.6h2.6L6.8-16.75l2.1,2.5h2.15l1.35-1.5
		h2.25L18.05-14.15 M1.15-21v6.101l-0.9,0.75l-2.7-1.101v-2.25l2.6-3.5H1.15 M-11.55-7.15l-0.75,1l1.35,2h2.75l-1.75-3H-11.55 M-12.8-2.65
		l-2.75,4.399l-2.5,0.5v-1.5l3.25-3.399H-12.8" />
	</g>
	<g id="g2700" transform="translate(93.3125,355.1375)">
		<path id="path2702" class="svg-area" data-name="日向（ひゅうが）" fill="#EEDEDE" stroke="#000000" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="bevel" d="
		M2.85-25.45h2.5v-1H8.2v3.399h5.65v-2h4.75v3.5l-4.65,4.101h-1.6v3h1v2.25H11.8L3.3,7.7V12.3h1L3.05,17.95
		c-2.2,2.5-3.8,5.583-4.8,9.25L-1.8,27.3l-3.15-1.25L-6.3,23.7l1.75-4.399l-4.75-2l-1.9-5h-1.5l-1.85-1.101v-2h1.25V6.8
		l-5.25-5.051V-1.45h7.75l2-1.601h2V-5.3L-8.05-6.7l1.85-1.75V-10.3L-8.7-11.7v-4.25l1.5-1.601h1.25l7.3-9.75L2.85-25.45" />
	</g>
	<g id="g3590" transform="translate(72.837,334.104)">
		<path id="path3592" class="svg-area" data-name="肥後（ひご）" fill="#EEDEDE" stroke="#000000" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="bevel" d="
		M14.15-19.6L19.4-14.2l2.4,8l-7.3,9.75h-1.25l-1.5,1.601V9.4l2.5,1.399v1.851L12.4,14.4l1.25,1.399v2.25h-2l-2,1.601H1.9
		l-3.4-1.601h-2.25l-1.35,1.5h-2.15l-2.1-2.5V14.8L-6,12.55V10.8l2.9-3.25v-3l3-2.399V0.9h-4.75v-1.25l4.1-2.5V-6.1l-2.1-1.25
		V-8.95l-2.9-2.5l3.4-1.399l3.1-4.601h2.9L8.9-14.6h4v-3.75L14.15-19.6 M-7,4.15v-2.5L-9,3.8h-1.5L-13,5.75V8.3l1.4,0.75h3.1L-6,5.4L-7,4.15 M-14.1,10.8l0.35-8h-3.75l-3.85,5v2.25L-19,11.65h-2.75
		v2.399l1.5,2.101L-16,10.8H-14.1" />
	</g>
	<g id="g6851" transform="translate(73.679,390.345)" opacity="0.98">
		<path id="path6853" class="svg-area" data-name="大隅（おおすみ）" fill="#EEDEDE" stroke="#000000" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="bevel" d="
		M1-33.4l5.25,5.05v2.4H5v2l1.85,1.1h1.5l1.9,5l4.75,2l-1.75,4.4h-3L8.6-8.95v1.5H10l1.5,3v1.25H6.75v1.75l-6.25,4h-2.4L-3,4.15
		l-1.5-2.1l3.75-4V-3.6h1v-6.25l-1-0.25l-0.75-1.25v-3.35H-4v-2.9h2l1.25,2.15h1.5L2.1-18.6v-1.35l-2.85-1.75H-4.5l-1.25-2.65v-1
		l5.25-4.85H1V-33.4 M3.5,17.4l2.5-3v-2h2.4v4.65l-4,7.5v4.1L3,29.8l-2.35,0.25v-2l-1-1.15v-1.1l3.85-3.9V17.4 M-6.1,28.15l-2.5-2.35h-2.5l-3.9,2.1
		v2.75l2,2.65l4.4,0.1l2.5-2.75V28.15" />
	</g>
	<g id="g7742" transform="translate(72.985,314.505)">
		<path id="path7744" class="svg-area" data-name="筑後（ちくご）" fill="#EEDEDE" stroke="#000000" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="bevel" d="
		M2.2-8.001l6.5,4.25V5.1L3.45,2.249h-2.9l-3.1,4.601l-3.4,1.399v-4.75l-2.5-3.299c3-2.434,5.917-5.168,8.75-8.201H2.2" />
	</g>
	<g id="g1667" transform="translate(334.388,197.9)">
		<path id="path1669" class="svg-area" data-name="上野（こうずけ）" fill="#FFD9B4" stroke="#000000" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="bevel" d="
		M6.25-15.95l3.15,1v3.15l1.6,1L9.5-9.7v6.15l2.9,1v1.5L10,3.55V6.2l2.5,2.5h4.25l2.65,1.75l-2.4,1h-3.5L3.5,8.4l-3.1,3.05v2.6
		h-2.25l-4,3.15H-8l-1.149,3l-2.5-1.9v-2l-1-1V9.55l1.399-1V6.7L-12.9,4.2H-17.5L-19.4,1.95v-2.5l1.399-2l2.75-2.25v-1.65h2.601
		L-10.5-7.7v-1.35h4.25l1.5-2.9h2.25v-5.25l4.351-3L5-15.95H6.25" />
	</g>
	<g id="g1627" transform="translate(53.9035,316.7565)">
		<path id="path1637" class="svg-area" data-name="肥前（ひぜん）" fill="#EEDEDE" stroke="#000000" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="bevel" d="
		M5.6-16.75l-3,1.35v1.5H0.7v-2l-2.1-2.149h-1.9l-1.6,3.149h-2.25v1.75h2.6v2.75h-2.5l-1.35-1.5h-2.65l-1.6-1l-1-1.149v1.899h-2.4
		l-3.6,6.5h2.35l2.65-2.399v-1.5l2.5-1.5v3l-1.5,1.75l4.1,2.75h2.15v2.75l0.05,0.05l4.45,1.6l1,1.101v4l1.35,1.399V9.2h-2.1V7.599
		H-6.4v-5.5h-1.4V0.45h-2.5v1.399L-12.05,3.2l1.25,1.5v3.25l1.25,1.399h1.9l1.6,3l-2.75,5.25h2l4.75-5.649h4.5v-1h3v2.75
		L2.7,15.599V16.7l2.15,1.399h2.1v-1.25H8.7l2.9-3V11.45L9.35,8.2H6.6l-1.25,1H3.7l-1-1.25L5.35,6.2h1.1V4.599l-1.85-3.5v-2.5
		L6.85-2.55L8.2-4.401l2.5,2.201c3-2.434,5.917-5.168,8.75-8.201H13.7l-8.1-4.25V-16.75 M-34.9,4.599v1.9l-2.15-1.15v1.9L-35.4,9l1.6-2.15v-2.25H-34.9 M-41.9,8.849l-1.9-1.75v3.4l1.15,1.5l-1.75,2h2.85l1.15,1.5V13
		h2.25v1.25h2.25V12.5l-1.75-1.75v-2l-1.4-1.4l-1,1.5H-41.9 M0,0 M-30.05-1v2.75h-2l1,2v2.5l1,2l1.4-2.4V2.5h2.35V0l-2.1,1.5v-2.65h1.25v-4.1l-1.5,2.75L-30.05-1 M-25.9-8.651l-2.25-0.25v-1.6h2.25V-8.651 M-28.55-7.5v1.6l-1.75-1.6H-28.55" />
	</g>
	<g id="g3400" transform="translate(71.2605,298.37)">
		<path id="path3402" class="svg-area" data-name="筑前（ちくぜん）" fill="#EEDEDE" stroke="#000000" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="bevel" d="
		M0.65-10.151l-2,2.601v2.149l-2.25,2v1.75l-1.25,1.25H-7.5L-8.75-2.3H-10l-1.85,2v4.149l8.1,4.25H3.9l6.5,4.25V8.45l1.4-1.351
		l-4.55-4.25v-2.5L11.5-7.05l0.4-2.601l-2-2.649H6.4l-1.75,2.149H0.65" />
	</g>
	<g id="g5161" transform="translate(88.891,298.341)">
		<path id="path5163" class="svg-area" data-name="豊前（ぶせん）" fill="#EEDEDE" stroke="#000000" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="bevel" d="
		M-1.1-3.001l1.5,2.65c3.433,0.5,6.35,1.7,8.75,3.6V6.9h1.25v2.85l-2.25,2.25H6l-8.5-2l-7.9-7.1V0.4l4.25-7.4l0.4-2.6l4.65-2.4
		l-1,3L-1.1-3.001" />
	</g>
	<g id="g6049" transform="translate(99.834,314.5081)">
		<path id="path6051" class="svg-area" data-name="豊後（ぶんご）" fill="#EEDEDE" stroke="#000000" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="bevel" d="
		M9.3-13.849v5.75L5.8-5h-3l-1.25,1.65L3.4-1h5.4v1.15h5l-2.65,3.25l2.5,1.75V6.5h3.15v1.25h-2.4v3.4h3.75l-3.35,4.6l-2.75,1.65
		v-1.75H7.3v2H1.65v-3.4H-1.2v1h-2.5l-1.5-1.85l-2.4-8L-12.85,0l-1.25,1.25V5h-4V-7.75l1.4-1.35l3.35,2.85l8.5,2h2.15l2.25-2.25
		v-2.85H-1.7V-13h1.5l2.5-3.5l2.1-1.1h1.9L9.3-13.849" />
	</g>
	<g id="g9577" transform="translate(47.47,289.849)">
		<path id="path9579" class="svg-area" data-name="壱岐（いき）" fill="#EEDEDE" stroke="#000000" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="bevel" d="
		M0.15-3.2L-2.1-1.7v3l2,1.9l2.25-2v-2.25L0.15-3.2" />
	</g>
	<g id="g10465" transform="translate(37.44117,266.8047)">
		<path id="path10467" class="svg-area" data-name="対馬（つしま）" fill="#EEDEDE" stroke="#000000" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="bevel" d="
		M2.6-10.6l-2.9,1.399v2.851l0.4,2h-1.9v4L-2.25,0.4L1.2,2.65v-5.101l1.75-2h1.5v-3.5L5.7-9.35v-1.25H2.6 M-5.65,5.65v4l1.85,1l4.15-6.851L-4.3,1.9L-5.65,5.65" />
	</g>
	<g id="g11356" transform="translate(162.004,304.957)">
		<path id="path11358" class="svg-area" data-name="土佐（とさ）" fill="#DCE0C0" stroke="#000000" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="bevel" d="
		M4.1,1.15L-5.4,7.25L-8.3,15l-4.1,4.75h-2.15V25L-16.4,26.4v1.25l2,1v2h-1.9l-1.5-2.25h-5.1l-3.15-1.25V24.75h2V22.9l-1-2.399
		l-1.5-6.75h3l5.15-4.25V3.4h4.5c2.1-5.533,5.183-9.75,9.25-12.649h4.6L2.2-8.1l1.65-2.25L9.8-10.6l6,2.25l1.25-1h2.15v4.25l3.85,2
		v2.75L24.3,1.9h2.25C24.317,3.833,23,7.383,22.6,12.549L12.7,2.4L4.1,1.15" />
	</g>
	<g id="g12244" transform="translate(185.349,294.615)">
		<path id="path12246" class="svg-area" data-name="阿波（あわ）" fill="#DCE0C0" stroke="#000000" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="bevel" d="
		M8.65-11.1H0l-5,3.601l-2.1-2l-7.4,3.049l-1.6,1.601v4.75h2.6l6,2.25l1.25-1h2.15V5.4l3.85,2v2.75L1,12.4h2.25
		c2.133-3,5.483-5.884,10.05-8.649l2.85-1.25l-2.5-1.5l1.4-1.5V-1.85l-1.4-2.399h-1.5V-8.6l1.9-2l-1.4-1.75h-4V-11.1" />
	</g>
	<g id="g13132" transform="translate(180.1447,278.525)">
		<path id="path13136" class="svg-area" data-name="讃岐（さぬき）" fill="#DCE0C0" stroke="#000000" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="bevel" d="
		M4.7-3.75L5.2-1.4h2.5l1,0.799V1.25l5.25,2.399v1.25H5.3L0.3,8.5l-2.1-2l-7.4,3.05h-4.7l1.85-1.65V4.25L-13.2,1l3,1.399l5-3.75
		v-1.5l1.65-1.5l4.1,2.75h2L4.7-3.75" />
	</g>
	<g id="g14023" transform="translate(144.26,305.841)">
		<path id="path14025" class="svg-area" data-name="伊予（いよ）" fill="#DCE0C0" stroke="#000000" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="bevel" d="
		M13.05-10.2C8.983-7.299,5.9-3.083,3.8,2.451h-4.5v6.1l-5.15,4.25h-3l1.5,6.75l1,2.4h-5.1l-3.65-5.25l2.25-1.75l-1.35-3.9h2.35
		v-1.6l-1.75-1.75l1.9-1.15h-3.5V2.3l-1.5-1.6l-5,3.1l-1.15,1.4h-3.65l2.5-3.15h2.9l16-11.5v-4.85h1.6l1.4-4.15l5.1-3.5l4.75,6.75
		h3.9l8.25-1l1.9-1.7h4.7l-1.6,1.601v4.75l-3.35,0.25l-1.65,2.25l-2.25-1.15H13.05" />
	</g>
	<g id="g14911" transform="translate(206.291,275.6264)">
		<path id="path14913" class="svg-area" data-name="淡路（あわじ）" fill="#DCE0C0" stroke="#000000" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="bevel" d="
		M3.85-3.3l1.5-3.1l-1.5-0.9l-7.15,7.15v1.75l-2,1.35v2.15l1.4,2.25h3.1l1.25-1.5H2.2l1-1.5l-2-1.65v-3.6L3.85-3.3" />
	</g>
	<g id="g15799" transform="translate(98.48,274.251)">
		<path id="path15801" class="svg-area" data-name="長門（ながと）" fill="#F5FD95" stroke="#000000" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="bevel" d="
		M13.5-2.85L12.1-4.7v-7.9H9.2l-9.35,9.25h-2.9V-5.2h-2.1v1.1h-3.4l-2-1v2.5h-3.1v3.9h1.35v2.35l-2.1,2l1.35,2.15v4.6l2.85-2.6
		h2.55l2.75,2.85h3.85l1.65-2.1h1.6v1.6h2v-2.1L8.85,5.3V2.65h3.1l2.45-2.3L13.5-0.6V-2.85" />
	</g>
	<g id="g1687" transform="translate(113.6189,282.9163)">
		<path id="path1689" class="svg-area" data-name="周防（すおう）" fill="#F5FD95" stroke="#000000" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="bevel" d="
		M0-7.551L-0.85-8.5L-3.3-6.2h-3.1v2.649l-4.65,4.75l2.15,2l3.1-1.649h4v4.399h1.65l1.75-1.5l6,4.351l3.5-4v-6.351l-4.75-7.25
		l-2.5,1.25H0" />
	</g>
	<g id="g2575" transform="translate(134.9985,268.562)">
		<path id="path2577" class="svg-area" data-name="安芸（あき）" fill="#F5FD95" stroke="#000000" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="bevel" d="
		M6.1-12.851l-4.5,2.25h-8.75l-3.35,2.75l-1.15,5.75L-13-0.851V0.75l-1.9,1.5v3.399l4.75,7.25L-8.9,8.5l4.85-3.649L-1.4,6.5v1.351
		L0.95,11H5.7l4.25-3.899h5v-2.5l-3-6.101l-5-2.399v-2L9.2-8.25L6.1-12.851" />
	</g>
	<g id="g3463" transform="translate(152.793,261.544)">
		<path id="path3465" class="svg-area" data-name="備後（びんご）" fill="#F5FD95" stroke="#000000" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="bevel" d="
		M0.05-12.95l-1.15-1h-5l-5.6,6.35v1.801l3.1,4.6l-2.25,2.35v2l5,2.4l3,6.1v2.5h2.05v-1.5h4l1-1.6h1.1v1.85h2l4.4-3.5V6.65
		L7.55-4.7v-5.9l-3.9-3.55l-1,1.2H0.05" />
	</g>
	<g id="g4351" transform="translate(165.826,258.1118)">
		<path id="path4353" class="svg-area" data-name="備中（びっちゅう）" fill="#F5FD95" stroke="#000000" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="bevel" d="
		M0-12.95L-4.35-8.85l-3.1,0.05l1.95,1.75v5.899L-1.35,10.2v2.75H2.4L7.5,9.1V4.7L3.4,0.45V-7.15L0-12.95" />
	</g>
	<g id="g5239" transform="translate(179.7,264.0025)">
		<path id="path5241" class="svg-area" data-name="備前（びぜん）" fill="#F5FD95" stroke="#000000" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="bevel" d="
		M9.6-8.8L6.75-7.65L-10.5-8.05v2.5l4.1,4.25V3.1l-2.55,1.951V7.2h2.45V8.85h1.75L-1.4,7.7L2,3.6h3.1l5.4-5.25L9.6-5.05V-8.8 M5.545,8.171l-0.25-1.648h1.75l1.5-1.5h3v4.398h-3.4l-1.1-1.25H5.545" />
	</g>
	<g id="g6127" transform="translate(179.3145,248.145)">
		<path id="path6129" class="svg-area" data-name="美作（みまさか）" fill="#F5FD95" stroke="#000000" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="bevel" d="
		M13.6-2.55v3.6L9.95,4.8v2.25L7.1,8.2l-17.25-0.4V2.7l-3.4-5.8l4.4-4.2h10.5L2.3-8.2l2.65,0.75l3.9,4.9H13.6" />
	</g>
	<g id="g7015" transform="translate(202.247,255.492)">
		<path id="path7017" class="svg-area" data-name="播磨（はりま）" fill="#F5FD95" stroke="#000000" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="bevel" d="
		M7.5-7.749l3.3,4.899l2.35,1.149L10.55,12.4L0.9,5.799h-2.35v1h-3v-1.5h-3.4l-1.5,1.5h-2.85L-13.1,3.4v-6l3.65-3.75v-3.601
		l3.75-2.399v1.5l4.35-0.25L0.4-9.35h7.15L7.5-7.749" />
	</g>
	<g id="g7903" transform="translate(125.7867,258.094)">
		<path id="path7905" class="svg-area" data-name="石見（いわみ）" fill="#DBDBFF" stroke="#000000" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="bevel" d="
		M13.9-15.099l1.35,6.35v6.4l-4.5,2.25H2l-3.35,2.75l-1.15,5.75l-1.35,1.25v1.6l-1.9,1.5v3.4l-2.5,1.25h-3.85l-1.75-1.9v-2.25
		l-1.4-1.85V3.5h2.4l10.6-10l5.5-3.85h1.5L5.9-11.5v-1.1l2.35-3.25l3-1.5L13.9-15.099" />
	</g>
	<g id="g8791" transform="translate(149.142,240.962)">
		<path id="path8793" class="svg-area" data-name="出雲（いずも）" fill="#DBDBFF" stroke="#000000" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="bevel" d="
		M7.45-6.049h3.1l1.5,3.649v2.75L6.3,7.6H3.7l-1.15-1h-5l-5.6,6.351V8.35L-9.4,1.999l-2.65-2.25L-8.2-3.4v-1.649l-1.35-1.75h3.75
		l2.75-2.5H1.3L5.55-12.9l1.75,2.25h4.65l-2,1.5H6.2L4.95-8.049H0.7L-1.2-5.65h2.25l2.4-1.399h2.5L7.45-6.049" />
	</g>
	<g id="g9679" transform="translate(169.447,240.547)">
		<path id="path9681" class="svg-area" data-name="伯耆（ほうき）" fill="#DBDBFF" stroke="#000000" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="bevel" d="
		M2.85-7.65l-3.1-1h-3.5L-5.4-5.8h-1.35L-9.5-7.9h-1.65l1.35,2.35l1.5,3.65v2.75l-4.75,6.051L-11.1,8.7L-8,8.651L0.75,0.35h10.5
		L13.1-1.4v-2.25l-2.75-4H2.85" />
	</g>
	<g transform="translate(157.001,207.665)">
		<path id="path10569" class="svg-area" data-name="隠岐（おき）" fill="#DBDBFF" stroke="#000000" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="bevel" d="
		M7.15-0.95l-2.4,1.5L3.15,0.2l-2.4-1.5v-2.65l2.5-3l3.9,3.15V-0.95 M-3,1.45V5.8l2.75-2.6L-3,1.45 M-4.1,1.2l-1,0.35v2.3l1,0.95V1.2 M-6.1,1.9v3.25l-1-0.95v-2L-6.1,1.9 M-5.1,6.95h2.25l-1.5-1.15
		L-5.1,6.55V6.95" />
	</g>
	<g id="g11458" transform="translate(188.2649,237.355)">
		<path id="path11460" class="svg-area" data-name="因幡（いなば）" fill="#DBDBFF" stroke="#000000" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="bevel" d="
		M6.45-4.399L8.45,1v4.851L4.7,8.25h-4.75l-3.9-4.899l-2.65-0.75l0.9-0.851V-0.5l-2.75-4l1.9-1.25l2.5,1.5l1.25-1h3.25l4-3h2
		V-4.399" />
	</g>
	<g id="g12346" transform="translate(204.974,236.921)">
		<path id="path12348" class="svg-area" data-name="但馬（たじま）" fill="#DBDBFF" stroke="#000000" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="bevel" d="
		M3.05-3.6L6.3-2.1h2.75l1.25,1.85l-5.25,4.25l-0.1,5.25H-2.2l-1.75-1.75l-4.35,0.25V1.4l-2-5.4v-3.85l3.1-1.4l1.5,1h8.75V-3.6" />
	</g>
	<g id="g13234" transform="translate(221.057,246.771)">
		<path id="path13236" class="svg-area" data-name="丹波（たんば）" fill="#DBDBFF" stroke="#000000" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="bevel" d="
		M11.2-6.3v7l-5.1,9.4H3.35l-3.5-3h-5.4L-7.9,5.95l-3.3-4.9l0.05-1.6l0.1-5.25l5.25-4.25l2.9,3.9h1.6L4.2-9.8L11.2-6.3" />
	</g>
	<g id="g14122" transform="translate(217.417,232.37)">
		<path id="path14124" class="svg-area" data-name="丹後（たんご）" fill="#DBDBFF" stroke="#000000" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="bevel" d="
		M0.2-0.7l3.5,3.25L7.95-1.7l1.5,2.25L7.8,1.95V4.55L2.3,8.2H0.7l-4.15-5.75H-6.2l-3.25-1.5V-3.7h2.15L-3.45-7.3h2.25V-8.2h4
		L3.95-5.3L0.2-0.7" />
	</g>
	<g id="g15010" transform="translate(221.158,261.412)">
		<path id="path15012" class="svg-area" data-name="摂津（せっつ）" sodipodi:nodetypes="ccccccccccccc" fill="#FFBA06" stroke="#000000" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="bevel" d="
		M5.901-4.65h-2.75l-3.5-3h-5.4L-8.454,6.657l5.75-3.35L0.651,3.1L3,5.6v2.1h3.4l2-8.1v-2.65L5.901-4.65" />
	</g>
	<g id="g15898" transform="translate(219.99,274.61)">
		<path id="path15900" class="svg-area" data-name="和泉（いずみ）" fill="#FFBA06" stroke="#000000" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="bevel" d="
		M7.651-5.5h-3.4v2.15L0.75,0.5l-8.35,5L3.5,4.25L6.75-1.1L7.651-5.5" />
	</g>
	<g id="g19455" transform="translate(235.1505,273.3681)">
	</g>
	<g id="g22122" transform="translate(237.541,280.007)">
		<path id="path22124" class="svg-area" data-name="大和（やまと）" fill="#FFBA06" stroke="#000000" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="bevel" d="
		M9.7-8.85H5.6v-4.9l-1.149-1H-1.65l-2.649-1l-3.101,5v2.25l1.25,1.25v10.25l-4.5,5.4l1.601,2.35v2.4l3.149,2.6h6.25v-1.75l3.75-3
		H6.7l1.149-2L7.95-0.85H6.35v-3.4H7.7l3-2L9.7-8.85" />
	</g>
	<g id="g23010" transform="translate(235.25,253.309)">
		<path id="path23012" class="svg-area" data-name="山城（やましろ、山背）" fill="#FFBA06" stroke="#000000" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="bevel" d="
		M0.45-12.85h-3.5v7L-8.15,3.55l2.5,1.601l3.601,5.75l2.649,1H6.7l1.149,1v-2l0.351-3h-1L2.35,5.3L1.2,2.4v-6h1.25V-10.7
		L0.45-12.85" />
	</g>
	<g id="g23919" transform="translate(228.304,268.898)">
		<path id="path23921" class="svg-area" data-name="河内（かわち）" sodipodi:nodetypes="ccccccccccccc" fill="#FFBA06" stroke="#000000" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="bevel" d="
		M3.046,9.011l0.138-5.139L1.985,2.511l0.029-2.307L4.9-4.5L1.507-9.835L1.299-7.601l-1.984,7.408l-0.822,4.53L-4.741,9.96
		l3.389,0.082l1.604-1.105l2.727,0.146" />
	</g>
	<g id="g30924" transform="translate(234.324,235.25)">
		<path id="path30926" class="svg-area" data-name="若狭（わかさ）" fill="#F4F4F4" stroke="#000000" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="bevel" d="
		M9.151-0.15L3.55,3.95H1.401V5.2h-3.5l-7-3.5v-2.6l1.649-1.4l1.25,1.5h2.351v1.25h3.5L-1.7-1.65v-1h1.75l1.25,1.5L2.901-2.8v-2.35
		H5.05v1.1h4.101V-0.15" />
	</g>
	<g id="g31812" transform="translate(254.8945,220.342)">
		<path id="path31814" class="svg-area" data-name="越前（えちぜん）" fill="#F4F4F4" stroke="#000000" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="bevel" d="
		M10.8-2l2.65,3v1.85l-2.5,1.65h-12L-4,8.25h-3.15v3.25l-4.25,3.25v-3.9h-2.05v-5.1h2.05V8.6h2.25V3.75l-3.399-2.5v-5.9l5.25-8.6
		l3.25-1.5l2.399,2.25v2.6L1.1-8.4H3.95l2.899,2h3.95V-2" />
	</g>
	<g id="g1779" transform="translate(260.195,198.518)">
		<path id="path1781" class="svg-area" data-name="加賀（かが）" fill="#F4F4F4" stroke="#000000" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="bevel" d="
		M9.401-13.8v2.4l-2.65,4v5.75H8v2.6l-1.6,1.25v5.25l1.35,1v3.15l-2.301,3.85H1.5l-2.9-2h-2.85L-7,11.95v-2.6L-9.4,7.1l1.551-1.5
		v-1h2.1l4-5.75l4.15-5l4-9.25L9.401-13.8" />
	</g>
	<g id="g2667" transform="translate(274.381,171.737)">
		<path id="path2669" class="svg-area" data-name="能登（のと）" fill="#F4F4F4" stroke="#000000" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="bevel" d="
		M2.801-2.05L-0.151,1.7l-2.75-1.85l-1.649,4.1V5.6l2.899,1.25l2.601-2v5.1h-3l-2.7,3l-3-1.6V9.1l-1.65-2V3.6L-10.3,3.1v-3.4h1
		v-3.85l4.5-2.75h4.149l4.75-3.5h4.75l1.5,1.5v1.75H7.45v2.55L5.099-2.05H2.801 M-2.5,4.7V3.2h2.75l-1,1.5H-2.5" />
	</g>
	<g id="g3555" transform="translate(281.234,194.586)">
		<path id="path3557" class="svg-area" data-name="越中（えっちゅう）" fill="#F4F4F4" stroke="#000000" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="bevel" d="
		M10.199-13.35h2.351l2.149,4.4V0.8L9.8,8.9h-2l-3.351-2H-2.9l-3.65,3.65l-1.25,2.85H-9.7v-2.6h-2.5l-1.75,1.1l-0.7-0.5V6.15
		l1.6-1.25V2.3h-1.25v-5.75l2.65-4v-2.4l2.7-3h3v1.4l-1.5,1v2.1l4.149,3.4H0.55l3.899-2.5v-3.65L10.199-13.35" />
	</g>
	<g id="g4443" transform="translate(325.9618,155.9879)">
		<path id="path4445" class="svg-area" data-name="越後（えちご）" fill="#F4F4F4" stroke="#000000" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="bevel" d="
		M21.6-33.2l-2.149,5.25L18.1-19.8l-3.5,6.35L5.2-9.2L0.35-4.55L-1.4,1.2l-5.149,9.25l-9.351,6.5v1.5h-4.75l-4,3.6l-7.499,3.25
		L-30,29.7v3.5l1.95-2.15v-3.1h5l1.5,2.25h6.5l5.649-6.9h2.851l1.899,1.25v2.9l1.5,1.6v3.9H2.1l1.5-2.9h2.25V24.8l4.351-3
		l3.149,4.25h1.25V21.7L13.2,16.55h-1.25v-4.5l1.25-0.25V6.75l1.25-0.8h3.25l1.5-1.5h4.75v-4.5L27.35-4.7l-3.399-4l1.75-4.1v-5.9
		l1.75-1.85h2.5l2.25-1.75l-3-3.65h-1.75v-3.85L21.6-33.2" />
	</g>
	<g id="g5331" transform="translate(314.1554,140.9142)">
		<path id="path5333" class="svg-area" data-name="佐渡（さど）" fill="#F4F4F4" stroke="#000000" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="bevel" d="
		M1.45-3.3v2.9h3l1,1l-2,4.1l-3,2.9L-2.8,9.7h-2.65V8.2l2.25-1.75l1.4-2.75l-1.25-1.75l-1.65,1.5v-5.1l5.15-6.4l1.75-1.6h1.5v2.1
		L1.45-3.3" />
	</g>
	<g id="g6234" transform="translate(246.38,266.511)">
		<path id="path6236" class="svg-area" data-name="伊賀（いが）" fill="#FF9494" stroke="#000000" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="bevel" d="
		M1.3-7.3h-3.25l-1,2.1l-0.35,3v6.9h4.1l1,2.6l1.5-5.85v-6L1.3-7.3" />
	</g>
	<g id="g7122" transform="translate(254.5832,265.1692)">
		<path id="path7124" class="svg-area" data-name="伊勢（いせ）" fill="#FF9494" stroke="#000000" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="bevel" d="
		M6.299-18.85l-1.35-1.4h-2.15l-1.75,1.9v5.25l-4.75,7h-3.25l2,2.75v6l-1.5,5.85l-3,2h-1.35v3.4h1.6l-0.1,2.85l5.1,2.25v1.25
		l8.15-4.1l3.85-1.4l3-3.5v-3.75l-6.75-4.6V0.55h-1.1v-1.9l5-7l2.1-4.5l-2.6-3.15h-1.15V-18.85" />
	</g>
	<g id="g8010" transform="translate(266.206,277.451)">
		<path id="path8012" class="svg-area" data-name="志摩（しま）" fill="#FF9494" stroke="#000000" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="bevel" d="
		M2.05-4.8h-2.9v3.75l-3,3.5h2.75v2.4h3.65v-4l1.35-1.65v-2.1H2.05V-4.8" />
	</g>
	<g id="g8898" transform="translate(272.198,253.126)">
		<path id="path8900" class="svg-area" data-name="尾張（おわり）" fill="#FF9494" stroke="#000000" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="bevel" d="
		M8.9-9h-7v-3.25H-3l-4.25,1.75v1.851L-8.85-7.5L-8.8-2.35l1.3,1.6h3.649V0.5L-5,1.5v4.25h1.25v4.75l2.5,1.75v-7L1.9,0.5L4.4-1
		V-3.15L8.9-9" />
	</g>
	<g id="g9786" transform="translate(284.3443,257.078)">
		<path id="path9788" class="svg-area" data-name="三河（みかわ）" fill="#FF9494" stroke="#000000" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="bevel" d="
		M5.951-13.249v3.25H9.6v-1.4h2.601l1.25,1.5v1.9L7.35,2.751l-3.5,1.6v5l-11.899,3.9h-3.25v-1.4l2.649-2.35h3.601l4.25-2v-2
		l-1-1.15H-5.4v1h-4.75l-3.25-2.35v-1.75l3.149-4.75l2.5-1.5v-2.15l4.5-5.85l5.601,2.6L5.951-13.249" />
	</g>
	<g id="g10674" transform="translate(300.019,254.898)">
		<path id="path10676" class="svg-area" data-name="遠江（とおとうみ）" fill="#FF9494" stroke="#000000" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="bevel" d="
		M6.65-14.2L-2.25-7.7v1.9L-8.35,4.95l-3.5,1.6v5l2.101-4.1H-7.6l-1.5,2.5l2.351,1.85H3.749l6.5,2.4v-3.75L11.9,8.7h-2.4l-1.5-5.15
		v-1.6h0.9v-10.9l-2.25-2V-14.2" />
	</g>
	<g id="g11562" transform="translate(320.698,246.993)">
		<path id="path11564" class="svg-area" data-name="駿河（するが）" fill="#FF9494" stroke="#000000" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="bevel" d="
		M14.05-5.8L8.9-8.55v1L3.4-6.3l-2.1-2h-1.75v7.399l-1.75,1.25h-1.9l-3.6-5.25h-2.5v-3.75h1.1V-12.3l-2.35-4.25l-2.6,10.25v3.25
		l2.25,2V9.849h-0.9v1.601l1.5,5.149h2.4l3.35-6.649l3.85-2.851V5.45l3.65-2.851h5l2.5,2l3.85-4.5l-1.1-1.25v-2L14.05-5.8" />
	</g>
	<g id="g12450" transform="translate(331.799,257.791)">
		<path id="path12452" class="svg-area" data-name="伊豆（いず）" fill="#FF9494" stroke="#000000" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="bevel" d="
		M2.299-10.65l-3.85,4.5v1.5h-3.65V6.1h-1.1v2l2.85,2.6h2.4l2.85-2.85l3.25-6.9h1.25v-3.5l-1.5-1.5v-4.1L2.299-10.65" />
	</g>
	<g id="g13338" transform="translate(343.0075,239.198)">
		<path id="path13340" class="svg-area" data-name="相模（さがみ）" fill="#FF9494" stroke="#000000" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="bevel" d="
		M-5.25-5.75l-8.15,5L-8.25,2L-10,4.65v2l3.6,3.75L-5,8.9V6.65l6.649-4.4H6.25L8.4,3.9l1.5,3.5v2.25H11v-3.5l2.399-1.5V3.5H10.75V0
		H9.15L3.5-5.85l-8.75-4.5V-5.75" />
	</g>
	<g id="g14226" transform="translate(323.511,232.885)">
		<path id="path14228" class="svg-area" data-name="甲斐（かい）" fill="#FF9494" stroke="#000000" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="bevel" d="
		M1.6-12.25l-1.75,1.85H-2v-1.5H-5.9l-2.351-2.6H-9.4l-1.5,3.6h-1.851l-1.5,3v5.5l2.351,4.25V5.5H-13v3.75h2.5L-6.9,14.5H-5
		l1.75-1.25v-7.4h1.75l2.101,2L6.1,6.6v-1l8.149-5V-4L9.1-6.25l-3-4.4L1.6-12.25" />
	</g>
	<g id="g15114" transform="translate(343.426,222.721)">
		<path id="path15116" class="svg-area" data-name="武蔵（むさし）" fill="#FF9494" stroke="#000000" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="bevel" d="
		M17.45-2.551V4.1l0.75,1.25v2.35h-4.15v2.75l-3.6,2.65v3.35h-1.6L3.2,10.6l-13.9-6.75l-3-4.4l-4.5-1.6v-2.5l1.15-3h2.15l4-3.15
		h2.25v-2.6l3.1-3.05l10,3.05h3.5l2.4-1l5.35,11.85H17.45" />
	</g>
	<g id="g16002" transform="translate(365.507,251.0544)">
		<path id="path16004" class="svg-area" data-name="安房（あわ）" fill="#FF9494" stroke="#000000" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="bevel" d="
		M4.2-2.4l-5.6,3.75V4.1l-2.4,2.25h-2.5l-2.25-4h3.15l-1.9-2l1-2l-1.25-1v-2.5l2.15-1.2v1.45h4.1v-1h4.65L8.6-3.75L4.2-2.4" />
	</g>
	<g id="g16890" transform="translate(369.9664,236.9398)">
		<path id="path16892" class="svg-area" data-name="上総（かずさ）" fill="#FF9494" stroke="#000000" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="bevel" d="
		M3.05-5.051L0.9-4h-3.8l-5.45,4.55v1.149L-11.75,4.3v2.149h1.899V9.3h4.101v-1H-1.1l5.25,2.149l2.15-2l0.75-2.25V3.05h-1v-3.351
		L8.65-5.2l3.15-2.851L8.15-10.45h-2.6L3.05-5.051" />
	</g>
	<g id="g17778" transform="translate(371.931,219.293)">
		<path id="path17780" class="svg-area" data-name="下総（しもうさ）" fill="#FF9494" stroke="#000000" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="bevel" d="
		M-18.15-10.95L-12.8,0.9h1.75v6.649l0.75,1.25h2.25l3.75,3.25v1.101l-0.55,0.45h3.8l2.15-1.051L3.6,7.15h2.6l3.65,2.399L13.1,7.4
		h5.1V5.9L6.85,0.4H2.2l-7.75-3.5L-7.8-5.35v-4.85l-5.1-3.4L-18.15-10.95" />
	</g>
	<g id="g18666" transform="translate(373.95,202.87)">
		<path id="path18668" class="svg-area" data-name="常磐（ひたち）" fill="#FF9494" stroke="#000000" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="bevel" d="
		M7.7-5.45v5.5L6.35,1.15V6.9l8.55,14.85L4.85,16.9H0.2l-7.75-3.5l-2.25-2.25V6.3L-14.9,2.9l7.5-4.25l2.25,0.25l2.75-3.6v-14.9
		h-0.75v-2.05l2.75,2.3h4L6.7-21.7H9.6l3.75,2.6v2C10.416-13.2,8.533-9.317,7.7-5.45" />
		<path id="path18670" data-name="霞ヶ浦" fill="#88E1FF" stroke="#000000" stroke-width="0.6" stroke-linejoin="bevel" d="M4.7,7.9l4,6.5l0.149,2
		l-1.5-1.25L4.7,10.65V7.9 M5.1,14.8L2.2,9.15L-0.9,7.4l-0.05,1.15l1.4,1.25L-0.9,11.4L-4.05,9.65v1.4L1.85,13.9L5.1,14.8" />
		<g id="g21303" transform="translate(-128.21,42.06119)">
			<path id="path21305" class="svg-area" data-name="近江（おうみ）" fill="#FFD9B4" stroke="#000000" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="bevel" d="
			M1.949-13.05L-7.9-5.7h-2.15v1.25l2,2.15v7.1h-1.25v6l1.15,2.9l4.85,2.6h1l1-2.1h6.5l4.75-7V1.95l-1.75-3.5l1.9-3.15v-3.85
			L8.55-11l-1.601-0.05l-0.149-2.6L5.1-16.3h-3.15V-13.05" />
			<path id="path21307" fill="#88E1FF" stroke="#000000" stroke-width="0.6" stroke-linejoin="bevel" d="M2.199-7.7l2.9,4.25v2
			l-3.25,1.5l-3.65,3v1.4h-2.6l-2.5,5.5V5.7l1.25-2.4v-2l3.5-3.85l0.1-4.25l4.25-2.75V-7.7" />
			<g id="g23940" transform="translate(26.039,-11.62385)">
				<path id="path23942" class="svg-area" data-name="美濃（みの）" fill="#FFD9B4" stroke="#000000" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="bevel" d="
				M0.25-13.449l-4-4h-2.4v2.5l2.65,3v1.85L-6-8.449h-12l-2.95,3.75l1.7,2.649l0.15,2.601l1.6,0.049l1.55,2.451V6.9l-1.899,3.15
				l1.75,3.5l1.75-1.9h2.149l1.351,1.4v2.85H-9.7l1.3,1.55l-0.05-5.149l1.601-1.15v-1.85l4.25-1.75H2.3v3.25h7l5.601,2.6l3.6-2.85
				L20,8.9l1-3.1V1.4h-2.4l-1.25-1.85v-3.9l-2.9-2l-6.199,3h-3.9l-1.6-1.35l2.6-2.65v-4.6l-1.1-1.5H0.25" />
			</g>
			<g id="飛騨" transform="translate(33.004,-29.27119)">
				<path id="path24830" class="svg-area" data-name="飛騨（ひだ）" fill="#FFD9B4" stroke="#000000" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="bevel" d="
				M12.35-8.35v-3.9h-2l-3.35-2h-7.35L-4-10.6l-1.25,2.85h-1.9v-2.6h-2.5l-1.75,1.1l0.65,0.5v3.15l-2.301,3.85v1.9h2.4l4,4h4
				l1.1,1.5v4.601l-2.6,2.649l1.6,1.351h3.9l6.2-3l-2.851-2V8.15l2-2.399h2.5L13.1,0l-2.6-3.6L12.35-8.35" />
			</g>
		</g>
	</g>
	<g id="g25716" transform="translate(304.2709,213.239)">
		<path id="path25718" class="svg-area" data-name="信濃（しなの）" fill="#FFD9B4" stroke="#000000" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="bevel" d="
		M12.3-34l-5.65,6.9h-6.5l-1.5-2.25h-5v3.1L-8.3-24.1v6.25l-4.9,8.1v3.9l-1.85,4.75l2.6,3.6l-3.899,5.75h-2.5l-2,2.4v1.1l5.75,4
		v3.9l1.25,1.85h2.399v4.4l-1,3.1l-1.5,1.65v3.25h3.65v-1.4h2.6l1.25,1.5l8.9-6.5L5.05,17.25v-5.5l1.5-3H8.4l1.5-3.6h1.15l2.35,2.6
		h3.9v1.5h1.85L20.9,7.4V4.9L18.4,3V1l-1-1v-5.75l1.4-1V-8.6l-1.65-2.5h-4.6l-1.9-2.25v-2.5l1.4-2l2.75-2.25v-1.65h2.6L19.55-23
		v-1.35h-1v-3.9l-1.5-1.6v-2.9L15.15-34H12.3" />
	</g>
	<g id="g26604" transform="translate(357.612,190.967)">
		<path id="path26606" class="svg-area" data-name="下野（しもつけ）" fill="#FFD9B4" stroke="#000000" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="bevel" d="
		M8.25-16.2c1.233,0.566,2.449,1.117,3.649,1.65l1.25,2.75v4.1h0.75V7.2l-2.75,3.6L8.9,10.55l-12.75,6.9L-6.5,15.7h-4.25l-2.5-2.5
		v-2.65l2.399-4.6v-1.5l-2.899-1V-2.7l1.5-1.1l-1.601-1v-3.15L-2.5-14.3H-1.1l3-3.15H4L8.25-16.2" />
	</g>
	<g id="g27492" transform="translate(360.6508,164.906)">
		<path id="path27494" fill="#FFD9B4" stroke="#000000" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="bevel" d="
		M10.7-18.05L7.55-12.8L6.2-11.55H3.3l-6.9-2.15h-3.7L-10.7-9.05v4.5h-4.75l-1.5,1.5h-3.25l-1.25,0.8V2.8l-1.25,0.25v4.5h1.25
		l1.399,5.15v4.35l3.15,1l11.35-6.35h1.4l3-3.15h2.1L5.2,9.8l1.8,0.8H11.8l3.75-2.15l4-5v-2.9l2.899-4.1V-6.8l-1.149-1v-3.75H22.7
		v-3l-4-3.5H10.7" />
	</g>
	<g id="g28380" transform="translate(380.289,161.045)">
		<path id="path28382" class="svg-area" data-name="ええ" fill="#FFD9B4" stroke="#000000" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="bevel" d="
		M8.35-17.1l3.25,9.9l1,4.6V8.15l-2,4.9v6.25H6.95L7,22.65l-3.75-2.6h-2.9l-3.1,2.35h-4l-2.75-2.3v-2.05l-1.25-2.75l-1.85-0.85h4.8
		l3.75-2.15l4-5V4.4L2.85,0.3v-3.25l-1.149-1V-7.7H3.1v-3l-4-3.5h-8v-4.5l1.101-1.25h2l2.25-2.25h2.399l3.5,3.5L6.2-22.6H8.35
		V-17.1" />
	</g>
	<g id="g29268" transform="translate(363.357,128.897)">
		<path id="path29270" fill="#FFD9B4" stroke="#000000" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="bevel" d="
		M0.3-24.45l6,1.149l8,6.101l1.5,6.25l-1.351,3v2.899L15.55-3.8V-2.7L11.8,6.05L12.2,11.1l-1.149,1.1h-2L7.95,13.45v4.5L4.8,23.2
		L3.45,24.45H0.55l-6.9-2.149h-3.7l-3.399-4l1.75-4.101V8.3l1.75-1.851h2.5L-5.2,4.7l-3-3.649h-1.75V-2.8L-15.8-6.2V-8.8
		l6.601-7.75l1-5.149H-6.3l2,2l1.851,3h1.399L0.3-18.55V-24.45" />
	</g>
	<g id="g30156" transform="translate(394.559,119.867)">
		<path id="path30158" fill="#FFD9B4" stroke="#000000" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="bevel" d="
		M13.4-14.95v3.4l-3.1,3v3.25l-2,1.35v1.4h1.75v2.6l1.1,1.15v1H9.8v3.6l3,4.5h-1.75L9.3,11.55v-2.5l-3.4-3.1H1.4v2.1h-3.15v3
		l-2.1,2.25l-2.1,5.25H-8.1l-3.85,3.9l-3.5-3.5h-2.4l-1.1,1.15l-0.4-5.05l3.75-8.75V5.2l-1.1-1.25v-2.9l1.35-3l-1.5-6.25l4.15-4.6
		l11.85,6H5.3l2.75-1.65v-4.5l-2.5-5.85v-2l2-1.65h8.25l3.6,1.4v3.25l-2.85,1.5h-2L13.4-14.95" />
	</g>
	<g id="g31044" transform="translate(366.857,81.88589)">
		<path id="path31046" fill="#FFD9B4" stroke="#000000" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="bevel" d="
		M1.95-30.3H-2.9l-1.4,1.6h-5.6l2.1,2.25v7.5l-3.949,7.05h-4.15v3.45l1.6,1.4h1.9v-1.5h3.75l1.6,2.1L-5.9,0.7v3.6l-1.9,7.65
		l-2.85,2.5v6.5l-1.05,4.35H-9.8l2,2l1.851,3h1.399l1.351-1.85v-5.9l6,1.15l8,6.1l4.149-4.6v-9.65L12.55,12.3V6.05L15.95-0.7v-11
		H14.3L12.2-17.2v-4.75l-1.25-5.1L8.7-28.8H3.2L1.95-30.3" />
	</g>
	<g id="g32826" transform="translate(397.398,81.371)">
		<path id="path32828" fill="#FFD9B4" stroke="#000000" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="bevel" d="
		M17.8-15.15v3.25L19.45-10v5.85h-1.5v2.75H20.3l1.5,1.9v2.1l-1.5,1.75v2h-1.25l-1.5,4h2.25l-1.75,1.25v1.65L19.2,14.5l-2.649,3
		l-3.601-1.4H4.7l-2,1.65v2l2.5,5.85v4.5l-2.75,1.65H-3.7l-11.851-6V16.1l-2.399-3.25V6.6l3.399-6.75v-11H-16.2l-2.101-5.5v-4.75
		l-1.25-5.1l-2.25-1.75l4-3.25h2.5v3.25h2.5v-3.25l2.351,2.5v3.6l-4.25,6.25l0.149,8l3.5-1.85h1.25l1.75-2.9h4.101L-0.2-17
		L1.2-18.65v-6.5l3.101-4h1.5l2.25-2.6l5.149,6.6v3.25l2,1.4v1.6h-1v2l1.851,1.75H17.8" />
	</g>
	<g id="陸奥">
		<path fill="#FFD9B4" class="svg-area" data-name="陸奥（むつ）" stroke="#000000" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="bevel" d="M375.597,53.121
		l2.25,1.75l1.25,5.1v4.75l2.102,5.5h1.648v11l-3.398,6.75v6.25l2.398,3.25v9.65l-4.138,4.546l1.5,6.25l-1.35,3v2.9l1.1,1.25v1.1
		l-3.75,8.75l0.4,5.05l-1.119,1.113h-2l-1.102,1.25l-0.038,4.526l-3.149,5.25l-1.351,1.25h-2.899l-6.9-2.15h-3.7l-3.399,4.65v4.5
		h-4.75l-1.5,1.5h-3.25l-1.25,0.8v5.05l-1.25,0.25v4.5h1.25l1.398,5.15v4.35l3.15,1l11.35-6.35h1.4l3-3.15h2.1l4.251,1.25
		l3.688,1.624l1.25,2.75v2.05l2.75,2.3h4l3.1-2.35h2.9l3.75,2.6l-0.05-3.35h3.649v-6.25l2-4.9v-10.75l-1-4.6l-3.25-9.9
		l-0.029-5.513l2.1-5.25l2.1-2.25v-3h3.15v-2.1h4.5l3.4,3.1v2.5l1.75-1.25h1.75l-3-4.5v-3.6h1.35v-1l-1.1-1.15v-2.6h-1.75v-1.4
		l2-1.35v-3.25l3.1-3v-3.4l1.15-1.35h2l2.85-1.5l-0.01-3.196l2.648-3l-1.149-1.25v-1.65l1.75-1.25h-2.25l1.5-4h1.25v-2l1.5-1.75
		v-2.1l-1.5-1.9h-2.351v-2.75h1.5v-5.85l-1.649-1.9v-3.25h-1.749l-1.852-1.75v-2h1v-1.6l-2-1.4v-3.25l-7.516-9.195l-2.251-0.005
		l-3.356-6.978l-0.026-3.752l-1.135-3.722l-0.153-5.992l1.241-1.568v-7.65h0.898v-4.25h-1.349l-2.5,2.4h-3.9l-1.35-2.5l-3.75-1.65
		l-2.65-2.6v3.85l-2,2.65v3.35l-1.75,2.4v4.1h4.25l4.65-1.25l2.75-3.85l2,2l0.153,8.067l-3.144,5.728l-1.573-2.21l-2.478,0.069
		l-0.156-1.562l-2.563-2.348l-1.952,2.135l0.022,2.614l1.187-0.086l-0.008,1.349l-1.905,1.885l-1.813-0.039
		c-1.216-3.465-2.241-7.307-2.633-12.42l-2.347-2.62l-1.5,2.338l-2.06,0.042l-3.65-4.543l0.159,4.956l-1.662,1.572l2.581,3.912
		l-2.194,7.233l-3.632,2.469l-4.315,0.058l0.084,2.084l-3.07,2.46l0.018,1.85l2.786,2.655l-0.018,3.594l5.539-0.065l1.4-1.6h4.918
		l1.348,1.592l5.362-0.081" />
	</g>
	<g>
		<path id="出羽" class="svg-area" data-name="出羽（でわ）" fill="#FFD9B4" stroke="#000000" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="bevel" d="
		M377.658,111.686l4.148-4.6v-9.65l-2.399-3.25v-6.25l3.399-6.75v-11h-1.649l-2.101-5.5v-4.75l-1.25-5.1l-2.25-1.75h-5.5l-1.25-1.5
		h-4.85l-1.4,1.6h-5.6l2.1,2.25v7.5l-3.948,7.05h-4.15v3.45l1.6,1.4h1.9v-1.5h3.75l1.6,2.1l1.149,7.15v3.6l-1.9,7.65l-2.85,2.5v6.5
		l-2.049,9.511l-6.602,7.75v2.601l5.851,3.399v3.852h1.75l3,3.648l-2.249,1.749h-2.5l-1.75,1.852v5.899l-1.75,4.102l3.398,4h3.7
		l6.9,2.148h2.899l1.351-1.25l3.149-5.25v-4.5l1.102-1.25h2l1.148-1.1l-0.399-5.05l3.75-8.75v-1.101l-1.102-1.251v-2.898l1.352-3
		l-1.5-6.25" />
	</g>
</svg>`;

/**
 * 旧国名マップ（jh_old_country_name.htmlのSVG地図を移植）
 * 地図上のクリックで旧国名を表示する
 */
export default function OldCountryMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedName, setSelectedName] = useState<string | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const areas = container.querySelectorAll<SVGPathElement>('path.svg-area');
    const handleClick = (event: Event) => {
      const target = event.currentTarget as SVGPathElement;
      setSelectedName(target.getAttribute('data-name'));
    };

    areas.forEach((area) => area.addEventListener('click', handleClick));
    return () => {
      areas.forEach((area) => area.removeEventListener('click', handleClick));
    };
  }, []);

  return (
    <div className="old-country-map">
      <div
        aria-live="polite"
        style={{
          textAlign: 'center',
          fontSize: '1.1em',
          fontWeight: 'bold',
          padding: '10px',
          marginBottom: '10px',
          backgroundColor: '#fff',
          border: '1px solid #ccc',
          borderRadius: '4px',
        }}
      >
        {selectedName ? `選択中：${selectedName}` : '地図上の国名をクリックしてください'}
      </div>
      <div ref={containerRef} style={{ maxWidth: '600px', margin: '0 auto' }} dangerouslySetInnerHTML={{ __html: MAP_SVG }} />
    </div>
  );
}
