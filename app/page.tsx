import { loadNews, loadDataIndex } from '@/lib/dataLoader';

export default async function Home() {
  const news = await loadNews();
  const dataIndex = await loadDataIndex();

  return (
    <div className="w-full">
      {/* イントロセクション */}
      <section id="intro" className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            サイトについて
            <span className="block text-sm font-normal text-gray-500 mt-2">INTRODUCTION</span>
          </h2>
          <div className="space-y-6 text-gray-700">
            <p>
              高校の地理・日本史・世界史は、情報量が非常に多いので、見やすい板書やプリント、そして図の活用が学習効率を高めます。しかし、実際の授業では時間や白黒印刷などの制限があります。
            </p>
            <p>
              そこで拡張性・利便性の高いWebの利用を考えました。図をカラーで掲載でき、紙面の制限もありません。また、手軽にどこでも閲覧でき、時間を見つけて学習を進められます。
            </p>
            <p>
              このような考えで作成したのが、このサイト「ちとにとせ」です。
            </p>
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                🚀 <strong>Next.js版として新しく生まれ変わりました！</strong><br/>
                より高速で、セキュアな静的サイトとして再構築されました。
              </p>
            </div>
          </div>
          
          <div className="mt-12">
            <p className="text-center mb-6 text-gray-700">科目ごとのページはこちらです。学習する科目を選んでください。</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <a href="/geo" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
                <div className="text-4xl mb-3">🌍</div>
                <div className="text-xl font-semibold">地理</div>
                <div className="text-sm text-gray-500 mt-2">Geography</div>
              </a>
              <a href="/jh" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
                <div className="text-4xl mb-3">🏯</div>
                <div className="text-xl font-semibold">日本史</div>
                <div className="text-sm text-gray-500 mt-2">Japanese History</div>
              </a>
              <a href="/wh" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
                <div className="text-4xl mb-3">🏛️</div>
                <div className="text-xl font-semibold">世界史</div>
                <div className="text-sm text-gray-500 mt-2">World History</div>
              </a>
            </div>
          </div>

          {/* データ統計 */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <div className="text-2xl font-bold text-blue-600">{dataIndex.counts.pages}</div>
              <div className="text-sm text-gray-600">ページ</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <div className="text-2xl font-bold text-green-600">{dataIndex.counts.nations}</div>
              <div className="text-sm text-gray-600">国データ</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <div className="text-2xl font-bold text-purple-600">{dataIndex.counts.cities}</div>
              <div className="text-sm text-gray-600">都市データ</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <div className="text-2xl font-bold text-orange-600">{dataIndex.counts.news}</div>
              <div className="text-sm text-gray-600">お知らせ</div>
            </div>
          </div>
        </div>
      </section>

      {/* お知らせセクション */}
      <section id="news" className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            お知らせ
            <span className="block text-sm font-normal text-gray-500 mt-2">NEWS</span>
          </h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            {news.length > 0 ? (
              <ul className="space-y-4">
                {news.slice(0, 5).map((item) => (
                  <li key={item.id} className="border-b pb-4 last:border-b-0">
                    <div className="text-sm text-gray-500">{item.date}</div>
                    <div className="font-semibold mt-1">{item.title}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center">現在、お知らせはありません。</p>
            )}
          </div>
        </div>
      </section>

      {/* ガイドセクション */}
      <section id="guide" className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            ご利用ガイド
            <span className="block text-sm font-normal text-gray-500 mt-2">GUIDE</span>
          </h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-700">
              各科目のページから、学習したい単元を選択してください。
              各レッスンには図表や解説が含まれており、学習を効果的に進められます。
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
