import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ご利用ガイド | ちとにとせ',
  description: '「ちとにとせ」の目的・免責事項・推奨環境・著作権についてのご案内です。',
  keywords: ['ご利用ガイド', '利用規約', '免責事項', 'ちとにとせ'],
};

export default function GuidePage() {
  return (
    <>
      <link rel="stylesheet" href="/css/subject.css" />
      <link rel="stylesheet" href="/css/guide.css" />

      <h1>
        <div className="first-line">ご利用ガイド</div>
      </h1>

      <div className="main-block">
        <div className="lessons guide-page">
          <section>
            <h2>サイトについて</h2>

            <h3>目的</h3>
            <p>「ちとにとせ」の目的は、高校社会科（地理歴史・公民）の学習を補助することです。</p>

            <h3>内容</h3>
            <p>授業プリントをWeb用に直したものを中心に、一問一答・史資料などを掲載しております。</p>

            <h3>専門性・留意点</h3>
            <ul>
              <li>サイトの内容は、教科書・専門書の内容をかみ砕いたもので、その専門性は大学受験程度に留めております。</li>
              <li>難解の語句・文章は平易なものに置き換えているため、語弊が生じる恐れがあります。</li>
              <li>原則として通説に従い、余説については不問とさせていただきます。</li>
            </ul>
          </section>

          <section>
            <h2>免責事項</h2>
            <ul>
              <li>当サイトのご利用による何らかのトラブルや損失・損害等につきましては、一切責任を負担いたしません。</li>
              <li>当サイトに掲載する情報の全部又は一部を予告なく変更する場合がございます。</li>
              <li>当サイトの運用を休止または停止する場合がございます。</li>
              <li>当サイトからリンクが張られている第三者のウェブサイト、または当ウェブサイトへリンクを張っている第三者のウェブサイトから取得された各種情報のご利用によって生じたいかなる損害についても責任を負担いたしません。</li>
            </ul>
          </section>

          <section>
            <h2>ご利用環境</h2>

            <h3>推奨環境</h3>
            <p>当サイトは最新版のGoogle Chrome・Microsoft Edge・Safari・Firefox等のモダンブラウザでの閲覧を推奨しております。</p>

            <h3>JavaScript</h3>
            <p>当サイトでは、JavaScriptを使用しています。全てのコンテンツをご利用いただくには、ブラウザ設定でJavaScriptを有効にしてください。</p>
          </section>

          <section>
            <h2>著作権について</h2>

            <h3>著作物</h3>
            <p>サイトのロゴ・授業プリント・一問一答など、著作物の無断利用をお断りさせていただきます。</p>
            <p>一問一答などの章構成のみ、便宜的に山川出版社の高校教科書に依拠しております。コンテンツ自体に含まれる内容は、著作権を侵害しておりません。</p>

            <h3>転載</h3>
            <p>授業プリントの一部の画像は、以下のサイトから転載させていただいております。</p>
            <ul>
              <li><a href="http://kirinuke.com/about/" target="_blank" rel="noopener noreferrer">「キリヌケ成層圏」</a></li>
              <li><a href="http://www.geocities.co.jp/NatureLand/5218/" target="_blank" rel="noopener noreferrer">「古世界の住人・川崎悟司イラスト集」</a></li>
              <li>国土画像情報（カラー空中写真） 国土交通省</li>
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}
