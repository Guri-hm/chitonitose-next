/**
 * レッスンページ末尾の広告ユニット。
 * オリジナルサイトのshare/php/footer_ads.phpと同じ広告ユニット
 * （client/slot="9261924498"）をそのまま踏襲している。
 *
 * ▼広告配置の方針（ハイブリッド方式）
 * オリジナルサイトは1レッスンページあたり最大3枠
 * （h1直下のリンクユニット、概要欄下のautorelaxedユニット、
 * 本ユニット＝footer_ads.php）の広告を表示しており、広告過多による
 * 離脱（UX低下）が懸念される。移行後はこの1枠のみを手動配置の
 * ベースラインとして残し、残り2枠は復活させない。
 *
 * 収益最適化のため、AdSense管理画面側でAuto ads（自動広告）を
 * 有効にすることを推奨する。adsbygoogle.jsは手動ユニットとAuto ads
 * で共用されるため、コード側の追加対応は不要（Auto ads自体はダッシュ
 * ボードの設定でON/OFFする）。Auto adsはこの手動ユニットと共存可能
 * （Googleのアルゴリズムが既存ユニットを認識し、重複しない位置に
 * 広告を挿入する）。
 *
 * ただしAuto adsの「アンカー広告」「ベネット広告（インタースティ
 * シャル）」はCLS・UXへの悪影響が大きく、オリジナルサイトの「広告
 * だらけ」な印象の再現にもつながるため無効化し、「ページ内広告」
 * のみ有効にする。これによりCLS対策と収益機会の両立、かつ広告密度を
 * 抑えたユーザー体験を実現する。
 */
export default function AdUnit() {
  return (
    <div className="ad-unit">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-format="autorelaxed"
        data-ad-client="ca-pub-4825014479713194"
        data-ad-slot="9261924498"
      />
      <script
        dangerouslySetInnerHTML={{ __html: '(adsbygoogle = window.adsbygoogle || []).push({});' }}
      />
    </div>
  );
}
