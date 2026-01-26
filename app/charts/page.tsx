import { loadAgingSociety, loadNations, loadBirthrateMortality } from '@/lib/dataLoader';
import GoogleChart from '@/components/charts/GoogleChart';

export default async function ChartsPage() {
  // データを読み込み
  const agingSociety = await loadAgingSociety();
  const nations = await loadNations();
  const birthrateMortality = await loadBirthrateMortality();

  // 国コードから国名を取得するマップを作成
  const nationMap = new Map(nations.map(n => [n.nation_cd, n.short_name]));

  // 高齢化社会データをグラフ用に変換
  const agingSocietyChartData = [
    ['国', '7%到達年', '14%到達年'],
    ...agingSociety.map(item => [
      nationMap.get(item.nation_cd) || `国${item.nation_cd}`,
      item['7percent'],
      item['14percent']
    ])
  ];

  // 出生率・死亡率データ（日本のデータのみ）
  const japanData = birthrateMortality
    .filter(item => item.nation_cd === 392) // 日本
    .sort((a, b) => a.data_year - b.data_year);

  const birthRateChartData = [
    ['年', '出生率', '死亡率'],
    ...japanData.map(item => [
      item.data_year.toString(),
      item.birthrate,
      item.mortality
    ])
  ];

  // 最新年の出生率上位国
  const latestYear = Math.max(...birthrateMortality.map(d => d.data_year));
  const latestData = birthrateMortality
    .filter(d => d.data_year === latestYear && d.birthrate)
    .sort((a, b) => b.birthrate - a.birthrate)
    .slice(0, 10);

  const topBirthRatesData = [
    ['国', '出生率'],
    ...latestData.map(item => [
      nationMap.get(item.nation_cd) || `国${item.nation_cd}`,
      item.birthrate
    ])
  ];

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">📊 データグラフサンプル</h1>
      <p className="text-gray-600 mb-8">
        SQLiteから生成されたJSONデータをGoogle Chartsで可視化
      </p>

      {/* 高齢化社会 */}
      <section className="mb-12 p-6 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">🧓 高齢化社会への移行年</h2>
        <p className="text-sm text-gray-600 mb-4">
          高齢化率7%（高齢化社会）および14%（高齢社会）に到達した年
        </p>
        <GoogleChart
          data={agingSocietyChartData}
          chartType="BarChart"
          height="300px"
          options={{
            title: '高齢化社会・高齢社会への移行年',
            hAxis: { title: '年' },
            vAxis: { title: '国' },
            colors: ['#4285F4', '#EA4335']
          }}
        />
      </section>

      {/* 日本の出生率・死亡率推移 */}
      <section className="mb-12 p-6 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">🇯🇵 日本の出生率・死亡率推移</h2>
        <p className="text-sm text-gray-600 mb-4">
          人口1000人あたりの出生数・死亡数の推移
        </p>
        <GoogleChart
          data={birthRateChartData}
          chartType="LineChart"
          height="400px"
          options={{
            title: '日本の出生率・死亡率推移',
            hAxis: { title: '年' },
            vAxis: { title: '率（‰）' },
            curveType: 'function',
            colors: ['#34A853', '#FBBC04']
          }}
        />
      </section>

      {/* 世界の出生率ランキング */}
      <section className="mb-12 p-6 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">🌍 世界の出生率ランキング（{latestYear}年）</h2>
        <p className="text-sm text-gray-600 mb-4">
          出生率の高い国トップ10
        </p>
        <GoogleChart
          data={topBirthRatesData}
          chartType="ColumnChart"
          height="400px"
          options={{
            title: `出生率トップ10（${latestYear}年）`,
            hAxis: { title: '国' },
            vAxis: { title: '出生率（‰）' },
            colors: ['#4285F4'],
            legend: { position: 'none' }
          }}
        />
      </section>

      {/* データ情報 */}
      <section className="p-6 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">📌 データソース</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• 高齢化社会データ: {agingSociety.length}件</li>
          <li>• 出生率・死亡率データ: {birthrateMortality.length}件</li>
          <li>• 国情報: {nations.length}件</li>
          <li>• データ形式: JSON (SQLiteから自動生成)</li>
        </ul>
      </section>
    </div>
  );
}
