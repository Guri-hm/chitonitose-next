import fs from 'fs';
import path from 'path';
import { loadNews, getPages, NewsItem } from '@/lib/dataLoader';
import { GEO_LESSONS } from '@/lib/geoLessons';
import Link from 'next/link';
import Image from 'next/image';
import './page.css';

/** content/geo/lessons/{contentId}.mdが実在するslugの集合 */
function getAvailableGeoSlugs(): Set<string> {
  const contentDir = path.join(process.cwd(), 'content', 'geo', 'lessons');
  const slugs = GEO_LESSONS.filter((l) =>
    fs.existsSync(path.join(contentDir, `${l.contentId}.md`))
  ).map((l) => l.slug);
  return new Set(slugs);
}

/**
 * 更新履歴(news.json)のpathは旧PHPサイトのファイル名のままなので、
 * 確実に対応が取れるものだけを新サイトのURLに変換する。
 * 変換できないものはリンクなし（プレーンテキスト表示）にする
 * （誤ったリンク先を出すよりは安全なため）。
 */
function resolveNewsHref(
  rawPath: string | null | undefined,
  geoSlugs: Set<string>,
  jhNos: Set<number>,
  whNos: Set<number>
): string | null {
  if (!rawPath) return null;
  const p = rawPath.replace(/^https?:\/\/chitonitose\.com\//, '');

  let m = p.match(/(?:^|\/)geo_lessons_([A-Za-z0-9_-]+?)(?:\.html)+$/);
  if (m && geoSlugs.has(m[1])) return `/geo/${m[1]}`;

  m = p.match(/(?:^|\/)jh_lessons(\d+)\.html$/);
  if (m && jhNos.has(Number(m[1]))) return `/jh/lessons/${m[1]}`;

  m = p.match(/(?:^|\/)wh_lessons(\d+)\.html$/);
  if (m && whNos.has(Number(m[1]))) return `/wh/lessons/${m[1]}`;

  m = p.match(/(?:^|\/)jh_omnibus(\d+)\.html$/);
  if (m && Number(m[1]) >= 1 && Number(m[1]) <= 26) return `/jh/omnibus/${m[1]}`;

  m = p.match(/(?:^|\/)wh_omnibus(\d+)\.html$/);
  if (m && Number(m[1]) === 1) return `/wh/omnibus/${m[1]}`;

  return null;
}

function cleanNewsTitle(title: string): string {
  return title.replace(/\s+/g, ' ').trim();
}

const NEWS_TYPE_CLASS: Record<string, string> = {
  新規作成: 'news-type-new',
  作成: 'news-type-new',
  更新: 'news-type-update',
  変更: 'news-type-update',
  誤植修正: 'news-type-fix',
};

export default async function Home() {
  const [newsRaw, jhPages, whPages] = await Promise.all([
    loadNews(),
    getPages('jh'),
    getPages('wh'),
  ]);

  const geoSlugs = getAvailableGeoSlugs();
  const jhNos = new Set(jhPages.map((p) => p.no));
  const whNos = new Set(whPages.map((p) => p.no));

  const news: NewsItem[] = [...newsRaw]
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
    .slice(0, 10);

  return (
    <div className="w-full">
      {/* ヒーロー */}
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

      {/* サイトについて */}
      <section aria-labelledby="intro-heading">
        <h2 id="intro-heading" className="section-heading">
          <div className="first-line">サイトについて</div>
          <div className="second-line">INTRODUCTION</div>
        </h2>
        <div className="section-body">
          <div className="about-content">
            <div className="about-message">
              <p>人が獲得する情報は、視覚に8割頼っています。</p>
              <Image src="/images/share/face_info.svg" alt="" width={56} height={53} />
            </div>
            <p>
              高校の地理・日本史・世界史は情報量が膨大です。見やすい板書やプリント、図の活用が学習効率を高めますが、
              授業では時間や白黒印刷などの制約があります。
            </p>
            <p>
              そこで、拡張性・利便性に優れたWebを活用することにしました。カラーの図を自由に掲載でき、紙面の制約もなく、
              いつでもどこでも学習を進められます。
            </p>
            <p>このような考えで作成したのが、このサイト「ちとにとせ」です。</p>

            <p className="about-choose">科目ごとのページはこちらです。学習する科目を選んでください。</p>
            <div className="subject-group">
              <Link href="/geo" className="subject-card subject-card-geo">
                <Image src="/images/share/study-icon-geo.svg" alt="" width={72} height={72} />
                <span>地理</span>
              </Link>
              <Link href="/jh" className="subject-card subject-card-jh">
                <Image src="/images/share/study-icon-jh.svg" alt="" width={72} height={72} />
                <span>日本史</span>
              </Link>
              <Link href="/wh" className="subject-card subject-card-wh">
                <Image src="/images/share/study-icon-wh.svg" alt="" width={72} height={72} />
                <span>世界史</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* お知らせ */}
      <section aria-labelledby="news-heading">
        <h2 id="news-heading" className="section-heading">
          <div className="first-line">お知らせ</div>
          <div className="second-line">NEWS</div>
        </h2>
        <div className="section-body">
          <div className="news-layout">
            <div className="news-timeline">
              {news.length > 0 ? (
                <ul>
                  {news.map((item) => {
                    const href = resolveNewsHref(item.path, geoSlugs, jhNos, whNos);
                    const title = cleanNewsTitle(item.news_title);
                    const typeClass = item.news_type ? NEWS_TYPE_CLASS[item.news_type] : undefined;
                    return (
                      <li key={item.id} className="news-item">
                        <time className="news-date" dateTime={item.date}>{item.date}</time>
                        <div className="news-body">
                          <div className="news-title-row">
                            {item.news_type && (
                              <span className={`news-type-badge ${typeClass || ''}`}>{item.news_type}</span>
                            )}
                            {href ? (
                              <Link href={href} className="news-title-link">{title}</Link>
                            ) : (
                              <span className="news-title-text">{title}</span>
                            )}
                          </div>
                          {item.news_text && <p className="news-text">{item.news_text}</p>}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p>現在、新しいお知らせはありません。</p>
              )}
            </div>

            <aside className="news-sidebar">
              <h3>おすすめコンテンツ</h3>
              <ul className="recommend-list">
                <li><Link href="/geo/geo_exercises_climograph_map">雨温図の演習</Link></li>
                <li><Link href="/geo/geo_exercises_hythergraph_map">ハイサーグラフの演習</Link></li>
                <li><Link href="/geo/geo_statistical_data_main">統計データ（世界地図）</Link></li>
              </ul>

              <h3>関連リンク</h3>
              <div className="link-cards">
                <a className="link-card" href="https://ncp.solopg.com/" target="_blank" rel="noopener noreferrer">
                  <span className="link-card-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
                      <path d="M14 3v5h5" />
                      <path d="m9.5 13.5 2 2 3-3.5" />
                    </svg>
                  </span>
                  <span className="link-card-text">
                    <strong>NoCloudPDF</strong>
                    <small>サーバーにアップロードせず、ブラウザ内だけでPDFを編集できる個人開発アプリです。</small>
                  </span>
                </a>
                <a className="link-card link-card-banner" href="https://k-koumin.com/" target="_blank" rel="noopener noreferrer">
                  <Image src="/images/share/k-koumin.gif" alt="政治・経済 Point まとめ" width={400} height={97} unoptimized />
                  <span className="link-card-text">
                    <small>提携サイト。政治・経済でお困りの方へおすすめです。</small>
                  </span>
                </a>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}


