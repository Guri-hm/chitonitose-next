import { Fragment } from 'react';
import type { Metadata } from 'next';
import AnswerButtons from '@/components/AnswerButtons';
import TermClickHandler from '@/components/lessons/TermClickHandler';

export const metadata: Metadata = {
  title: '歴代首相 | ちとにとせ',
  description: '日本の歴代首相一覧です。',
  keywords: ['日本史', '高校', '受験', '歴代首相', '内閣', 'ちとにとせ'],
};

interface CabinetRow {
  name: string;
  events: string[];
  note: string;
}

const meijiCabinets: CabinetRow[] = [
  { name: '伊藤博文①', events: ['1885年、内閣制度'], note: '伊藤が枢密院議長に就任し、首相交代' },
  { name: '黒田清隆', events: ['1889年、大日本帝国憲法発布', '1889年、衆議院議員選挙法公布'], note: '首相辞任' },
  { name: '山県有朋①', events: ['1890年、第１回衆議院議員総選挙', '1890年、教育勅語', '1890年、第１回帝国議会'], note: '帝国議会運営に苦心して総辞職' },
  { name: '松方正義①', events: ['1891年、樺山資紀の蛮勇演説', '1892年、選挙干渉'], note: '選挙干渉を非難され、総辞職' },
  { name: '伊藤博文②', events: ['1894年、甲午農民戦争', '1894年、日英通商航海条約', '1894年、日清戦争', '1895年、下関条約'], note: '大隈の入閣に失敗し、総辞職' },
  { name: '松方正義②', events: ['1897年、官営八幡製鉄所の設立', '1897年、貨幣法（金本位制）'], note: '自由党・進歩党が提携を拒否したため、総辞職' },
  { name: '伊藤博文③', events: ['1898年、憲政党の結成'], note: '地租増税案の否決で総辞職' },
  { name: '大隈重信①', events: ['1898年、共和演説事件'], note: '憲政党内の分裂で総辞職' },
  { name: '山県有朋②', events: ['1899年、文官任用令改正', '1900年、治安警察法', '1900年、軍部大臣現役武官制', '1900年、北清事変（義和団事件）'], note: '憲政党が離反して総辞職' },
  { name: '伊藤博文④', events: ['1901年、社会民主党結成、直後に禁止'], note: '貴族院の反対に苦慮し、総辞職' },
  { name: '桂太郎①', events: ['1902年、日英同盟協約', '1904年、日露戦争', '1905年、ポーツマス条約', '1905年、日比谷焼打ち事件', '1905年、第２次日韓協約'], note: '日露戦争の戦後処理後に西園寺を首相に推薦し総辞職' },
  { name: '西園寺公望①', events: ['1906年、日本社会党結成（翌年禁止）', '1906年、鉄道国有法', '1907年、ハーグ密使事件', '1907年、第３次日韓協約'], note: '社会主義の取締りを批判されて総辞職' },
  { name: '桂太郎②', events: ['1908年、戊申詔書', '1909年、伊藤博文暗殺', '1910年、大逆事件', '1910年、韓国併合', '1911年、工場法公布（施行は1916年）'], note: '長期政権への反対、政策実行の効果を出したとして総辞職' },
  { name: '西園寺公望②', events: ['1912年、明治天皇没', '1912年、上原勇作陸相が帷幄上奏'], note: '陸軍が後任の陸相を推薦しなかったので、総辞職' },
];

const taishoCabinets: CabinetRow[] = [
  { name: '桂太郎③', events: ['1913年、立憲政友会・立憲国民党が内閣不信任案提出'], note: '第一次護憲運動で総辞職（大正政変）' },
  { name: '山本権兵衛①', events: ['1913年、軍部大臣現役武官制改正', '1913年、文官任用令改正', '1914年、ジーメンス事件'], note: 'ジーメンス事件で予算が成立せず総辞職' },
  { name: '大隈重信②', events: ['1914年、第一次世界大戦勃発', '1914年、ドイツ領南洋諸島・山東半島の青島占領', '1915年、二十一ヵ条の要求', '1916年、工場法施行（1911年に公布）'], note: '元老の支持を失い総辞職' },
  { name: '寺内正毅', events: ['1917年、西原借款', '1917年、石井・ランシング協定', '1918年、シベリア出兵を宣言', '1918年、米騒動'], note: '米騒動の責任を取って総辞職' },
  { name: '原敬', events: ['1918年、大学令', '1919年、三・一独立運動', '1919年、五・四運動', '1919年、ヴェルサイユ条約', '1920年、国際連盟加入', '1920年、最初のメーデー'], note: '原敬暗殺で総辞職' },
  { name: '高橋是清', events: ['1921年、ワシントン会議開催', '1921年、四ヵ国条約', '1922年、ワシントン海軍軍縮条約', '1922年、九ヵ国条約'], note: '閣内不一致で総辞職' },
  { name: '加藤友三郎', events: ['1922年、日本共産党結成（非合法）', '1922年、シベリアから撤兵完了'], note: '加藤友三郎の病死で総辞職' },
  { name: '山本権兵衛②', events: ['1923年9月1日、関東大震災', '1923年、虎ノ門事件'], note: '虎ノ門事件の責任を取って総辞職' },
  { name: '清浦奎吾', events: ['1924年、第二次護憲運動展開', '1924年、政友本党結成'], note: '総選挙で護憲三派が勝利し総辞職' },
  { name: '加藤高明①②', events: ['1925年、日ソ基本条約調印', '1925年、治安維持法公布', '1925年、普通選挙法公布', '1925年、五・三〇事件'], note: '加藤高明の病死で総辞職' },
];

function CabinetTable({ rows }: { rows: CabinetRow[] }) {
  return (
    <table width="100%" border={1}>
      <thead>
        <tr>
          <th scope="col">内閣</th>
          <th scope="col">出来事</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <Fragment key={row.name}>
            <tr>
              <td style={{ whiteSpace: 'nowrap' }}>
                <span className="all">{row.name}</span>
              </td>
              <td>
                {row.events.map((line, i) => (
                  <span key={i}>
                    {i > 0 && <br />}
                    {line}
                  </span>
                ))}
              </td>
            </tr>
            <tr>
              <td colSpan={2} style={{ textAlign: 'center', fontStyle: 'italic', color: '#666' }}>
                {row.note}
              </td>
            </tr>
          </Fragment>
        ))}
      </tbody>
    </table>
  );
}

export default async function CabinetPage() {
  return (
    <>
      <link rel="stylesheet" href="/css/subject.css" />
      <link rel="stylesheet" href="/css/jh.css" />
      <link rel="stylesheet" href="/css/content_common.css" />

      <TermClickHandler />

      <h1>
        <div className="first-line">歴代首相</div>
      </h1>

      <div className="main-block bg-gray">
        <div id="toc-range" className="contents">
          <div className="overview">
            内閣名をクリックすると表示・非表示が切り替わります。
          </div>

          <AnswerButtons />

          <h2>歴代内閣</h2>
          <h3>明治時代</h3>
          <CabinetTable rows={meijiCabinets} />
          <h3>大正時代</h3>
          <CabinetTable rows={taishoCabinets} />
          <h3>昭和</h3>
          <p style={{ padding: '20px', textAlign: 'center' }}>準備中です。</p>
        </div>
      </div>
    </>
  );
}
