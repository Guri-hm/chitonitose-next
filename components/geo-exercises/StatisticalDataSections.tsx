import StatsChart from './StatsChart';
import {
  buildBirthrateGeoTable,
  buildNaturalGrowthGeoTable,
  buildPerCapitaGniGeoTable,
  buildPopulationGeoTable,
  buildProductionBarTable,
  buildStatisticsGeoTable,
} from '@/lib/geoStatistics';

export type GeoSource =
  | { type: 'statistics'; statisticsId: number; label?: string }
  | { type: 'population' | 'birthrate' | 'growth' | 'gni' };

export interface BarSpec {
  heading: string;
  statisticsId: number;
  /** グラフタイトル。未指定ならh3の見出しを使う */
  title?: string;
}

export interface StatBlock {
  heading: string;
  year?: number;
  geo?: GeoSource;
  geoOptions?: Record<string, unknown>;
  bars?: BarSpec[];
}

export interface StatSection {
  heading: string;
  blocks: StatBlock[];
}

const BLUE_TO_RED = ['#4B79B6', '#94C1DC', '#E1F3F8', '#FEE193', '#FC915E', '#D8362E'];

export const GEO_OPTIONS = {
  blueToRed: { colorAxis: { colors: BLUE_TO_RED } },
};

function buildGeoTable(source: GeoSource, year: number) {
  switch (source.type) {
    case 'statistics':
      return buildStatisticsGeoTable(source.statisticsId, year, source.label);
    case 'population':
      return buildPopulationGeoTable(year);
    case 'birthrate':
      return buildBirthrateGeoTable(year);
    case 'growth':
      return buildNaturalGrowthGeoTable(year);
    case 'gni':
      return buildPerCapitaGniGeoTable(year);
  }
}

async function StatBlockView({ block }: { block: StatBlock }) {
  const geoTable = block.geo && block.year ? await buildGeoTable(block.geo, block.year) : null;
  const bars = await Promise.all(
    (block.bars ?? []).map(async (bar) => ({
      bar,
      table: await buildProductionBarTable(bar.statisticsId, 5),
    }))
  );

  return (
    <>
      <h3>{block.heading}</h3>
      {geoTable && (
        <>
          統計年次:{block.year}年
          <StatsChart kind="geo" table={geoTable} options={block.geoOptions ?? { colorAxis: {} }} />
        </>
      )}
      {bars.map(({ bar, table }) => (
        <div key={bar.statisticsId}>
          <h4>{bar.heading}</h4>
          <StatsChart kind="bar" table={table} title={bar.title ?? block.heading} />
        </div>
      ))}
    </>
  );
}

/** 統計データページ共通：見出し（h2/h3/h4）ごとに世界地図・割合グラフを並べる */
export default function StatisticalDataSections({ sections }: { sections: StatSection[] }) {
  return (
    <>
      {sections.map((section) => (
        <div key={section.heading}>
          <h2>{section.heading}</h2>
          {section.blocks.map((block) => (
            <StatBlockView key={block.heading} block={block} />
          ))}
        </div>
      ))}
    </>
  );
}
