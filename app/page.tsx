import { loadNews, loadDataIndex } from '@/lib/dataLoader';
import Image from 'next/image';
import './page.css';

export default async function Home() {
  const news = await loadNews();
  const dataIndex = await loadDataIndex();

  return (
    <div className="w-full">
      {/* ヘッダー画像 */}
      <h1 id="top">
        <div className="inner">
          <Image 
            className="inner" 
            src="/images/share/chitonitose.svg" 
            alt="ちとにとせ｜地理と日本史と世界史のまとめサイト"
            width={600}
            height={200}
            priority
          />
        </div>
      </h1>

      {/* イントロセクション */}
      <h2 id="intro" className="py-30">
        <div className="first-line">サイトについて</div>
        <div className="second-line">INTRODUCTION</div>
      </h2>
      <div className="intro bg-gray w-100">
        <div className="message py-40 mx-auto">
          <Image 
            className="w-100 w-max700" 
            src="/images/share/serif1.svg" 
            alt="メッセージ1"
            width={700}
            height={100}
          />
          <p>高校の地理・日本史・世界史は、情報量が非常に多いので、見やすい板書やプリント、そして図の活用が学習効率を高めます。しかし、実際の授業では時間や白黒印刷などの制限があります。</p>
          <p>そこで拡張性・利便性の高いWebの利用を考えました。図をカラーで掲載でき、紙面の制限もありません。また、手軽にどこでも閲覧でき、時間を見つけて学習を進められます。</p>
          <p>このような考えで作成したのが、このサイト「ちとにとせ」です。</p>
          <Image 
            className="w-100 w-max700" 
            src="/images/share/serif2.svg" 
            alt="メッセージ2"
            width={700}
            height={100}
          />
          <p>科目ごとのページはこちらです。学習する科目を選んでください。</p>
          <div className="icon-group">
            <a href="/geo" className="icon-wrapper">
              <div className="guide-icon bg-white">
                <Image 
                  src="/images/share/study-icon-geo.svg" 
                  alt="地理アイコン"
                  width={90}
                  height={90}
                />
              </div>
              <div className="icon-label">地理</div>
            </a>
            <a href="/jh" className="icon-wrapper">
              <div className="guide-icon bg-white">
                <Image 
                  src="/images/share/study-icon-jh.svg" 
                  alt="日本史アイコン"
                  width={90}
                  height={90}
                />
              </div>
              <div className="icon-label">日本史</div>
            </a>
            <a href="/wh" className="icon-wrapper">
              <div className="guide-icon bg-white">
                <Image 
                  src="/images/share/study-icon-wh.svg" 
                  alt="世界史アイコン"
                  width={90}
                  height={90}
                />
              </div>
              <div className="icon-label">世界史</div>
            </a>
          </div>
        </div>
      </div>

      {/* お知らせセクション */}
      <h2 id="news" className="py-30">
        <div className="first-line">お知らせ</div>
        <div className="second-line">NEWS</div>
      </h2>
      <div className="news-section">
        <div id="koushin">
          <div className="outer-box">
            {news.length > 0 ? (
              news.slice(0, 5).map((item) => (
                <div key={item.id} className="unit">
                  <div className="date">{item.date}</div>
                  <div className="content">{item.title}</div>
                </div>
              ))
            ) : (
              <div className="unit">
                <div className="content">現在、お知らせはありません。</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ご利用ガイド */}
      <h2 id="guide" className="py-30">
        <div className="first-line">ご利用ガイド</div>
        <div className="second-line">GUIDE</div>
      </h2>
      <div className="icon-group bg-gray py-40">
        <a href="/charts" className="icon-wrapper">
          <div className="guide-icon bg-pale-blue">
            <Image 
              src="/images/share/statistical_data.webp" 
              alt="グラフデータ"
              width={90}
              height={90}
            />
          </div>
          <div className="icon-label">グラフ</div>
        </a>
      </div>
    </div>
  );
}


