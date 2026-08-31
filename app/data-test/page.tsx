import { loadNews, loadNations, loadDataIndex } from '@/lib/dataLoader';

export default async function DataTestPage() {
  const index = await loadDataIndex();
  const news = await loadNews();
  const nations = await loadNations();

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">データ読み込みテスト</h1>

      {/* データインデックス情報 */}
      <section className="mb-8 p-6 bg-blue-50 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">📊 データベース情報</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <div className="text-gray-600 text-sm">国数</div>
            <div className="text-2xl font-bold text-blue-600">{index.counts.nations}</div>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <div className="text-gray-600 text-sm">都市数</div>
            <div className="text-2xl font-bold text-green-600">{index.counts.cities}</div>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <div className="text-gray-600 text-sm">ページ数</div>
            <div className="text-2xl font-bold text-purple-600">{index.counts.pages}</div>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <div className="text-gray-600 text-sm">ニュース数</div>
            <div className="text-2xl font-bold text-orange-600">{index.counts.news}</div>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-600">
          生成日時: {new Date(index.generated).toLocaleString('ja-JP')}
        </p>
      </section>

      {/* ニュース一覧 */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">📰 最新ニュース</h2>
        <div className="space-y-3">
          {news.slice(0, 5).map((item) => (
            <div key={item.id} className="p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition">
              <div className="text-sm text-gray-500">{item.date}</div>
              <div className="font-semibold">{item.title}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 国情報サンプル */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">🌍 国情報（サンプル）</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border-b text-left">国コード</th>
                <th className="px-4 py-2 border-b text-left">国名</th>
                <th className="px-4 py-2 border-b text-left">正式名称</th>
              </tr>
            </thead>
            <tbody>
              {nations.slice(0, 10).map((nation) => (
                <tr key={nation.cd} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{nation.cd}</td>
                  <td className="px-4 py-2 border-b font-medium">{nation.short_name}</td>
                  <td className="px-4 py-2 border-b text-sm text-gray-600">{nation.long_name || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-sm text-gray-600">
          全{nations.length}件中10件を表示
        </p>
      </section>

      {/* JSONファイル一覧 */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">📁 利用可能なデータファイル</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {Object.entries(index.files).map(([category, files]) => (
            <div key={category} className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2 capitalize">{category}</h3>
              <ul className="text-sm space-y-1">
                {files.map((file: string) => (
                  <li key={file} className="text-gray-700">
                    • {file}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
