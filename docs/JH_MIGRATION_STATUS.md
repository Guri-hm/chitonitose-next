# 日本史ページ移植状況

> 未完了の作業は [TODO.md](../TODO.md) に集約している。このファイルは現在のルート構成と移行状況の記録用。
> （2026-10-31に現状のコードと突き合わせて更新）

## ルートと移行状況

| パス | 実装 | 状況 | 元ファイル（`origin/chitonitose/jh/`） |
|---|---|---|---|
| `/jh` | `app/jh/page.tsx` | 完了（平成No.170・PDF・役立つコンテンツを含む） | `jh.html` |
| `/jh/lessons/[id]` | `app/jh/lessons/[id]/page.tsx` | 完了（`content/jh/lessons/` 172本） | `jh_lessons*.html` |
| `/jh/omnibus/[id]` | `app/jh/omnibus/[id]/page.tsx` | 完了（`content/jh/omnibus/` 27本） | `jh_omnibus*.html` |
| `/jh/cultural-history/[id]` | `app/jh/cultural-history/[id]/page.tsx` | 完了（3本。見た目の目視確認はTODO.md） | `jh_omnibus_cultural_history{1-3}.html` |
| `/jh/agriculture-industrial-history` | `app/jh/agriculture-industrial-history/page.tsx` | **未移行（準備中表示）** | `jh_omnibus_agriculture_industrial_history.html` |
| `/jh/q-a`, `/jh/q-a/[id]` | `app/jh/q-a/` | 完了（`QAContent`、データは`qa-jh.json`） | `jh_exercises_q_a.html` |
| `/jh/print` | `app/jh/print/page.tsx` | 完了（`pdf-jh.json`、`public/pdf/jh_print/`） | `jh_print.html` |
| `/jh/old-country-name` | `app/jh/old-country-name/page.tsx` | 完了（`OldCountryMap`） | `jh_old_country_name.html` |
| `/jh/cabinet` | `app/jh/cabinet/page.tsx` | **一部**（明治・大正のみ。昭和以降は準備中） | `jh_cabinet.html` |
| `/jh/cabinet-events` | `app/jh/cabinet-events/page.tsx` | **一部**（準備中表示あり） | `jh_cabinet2.html` |

元のクエリパラメータ（`jh_exercises_q_a.html?unit=N`）は、一問一答ではクライアント側で`?unit=`を読む方式にしている。

## 元ファイルの場所

`origin/chitonitose/jh/` 内:
`jh_lessons*.html`（レッスン）/ `jh_omnibus*.html`（短期攻略・テーマ史）/ `jh_exercises_q_a.html`（一問一答）/
`jh_print.html`（PDF配布）/ `jh_old_country_name.html` / `jh_cabinet.html` / `jh_cabinet2.html`
