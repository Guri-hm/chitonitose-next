export default function GeoPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">地理</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">系統地理</h2>
          <p className="text-gray-600 mb-4">
            自然環境、気候、産業など、テーマごとに学習します。
          </p>
          <ul className="space-y-2">
            <li>
              <a href="/geo/lessons/climatic_element" className="text-blue-600 hover:underline">
                気候要素
              </a>
            </li>
            <li className="text-gray-400">その他のレッスン（準備中）</li>
          </ul>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">地誌</h2>
          <p className="text-gray-600 mb-4">
            世界各地域の特徴を学習します。
          </p>
          <ul className="space-y-2">
            <li className="text-gray-400">準備中</li>
          </ul>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">演習</h2>
          <p className="text-gray-600 mb-4">
            問題演習で理解を深めます。
          </p>
          <ul className="space-y-2">
            <li className="text-gray-400">準備中</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
