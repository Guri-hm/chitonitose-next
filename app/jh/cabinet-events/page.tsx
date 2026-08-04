import { Fragment } from 'react';
import type { Metadata } from 'next';
import AnswerButtons from '@/components/AnswerButtons';
import TermClickHandler from '@/components/lessons/TermClickHandler';

export const metadata: Metadata = {
  title: '組閣中の出来事 | ちとにとせ',
  description: '各内閣組閣中の主な出来事の一覧です。',
  keywords: ['日本史', '高校', '受験', '内閣', '出来事', 'ちとにとせ'],
};

interface EventRow {
  name: string;
  eventsHtml: string;
  noteHtml: string;
}

const meijiEvents: EventRow[] = [
  { name: '伊藤博文①', eventsHtml: '1885年、<span class="all">内閣</span>制度', noteHtml: '伊藤が枢密院議長に就任し、首相交代' },
  { name: '黒田清隆', eventsHtml: '1889年、<span class="all">大日本帝国憲法</span>発布<br>1889年、<span class="all">衆議院議員選挙法</span>公布', noteHtml: '首相辞任' },
  { name: '山県有朋①', eventsHtml: '1890年、第１回衆議院議員総選挙<br>1890年、教育勅語<br>1890年、第１回<span class="all">帝国議会</span>', noteHtml: '帝国議会運営に苦心して総辞職' },
  { name: '松方正義①', eventsHtml: '1891年、樺山資紀の蛮勇演説<br>1892年、<span class="all">選挙干渉</span>', noteHtml: '選挙干渉を非難され、総辞職' },
  { name: '伊藤博文②', eventsHtml: '1894年、甲午農民戦争<br>1894年、<span class="all">日英通商航海</span>条約<br>1894年、<span class="all">日清戦争</span>勃発<br>1895年、<span class="all">下関</span>条約', noteHtml: '大隈の入閣に失敗し、総辞職' },
  { name: '松方正義②', eventsHtml: '1897年、官営八幡製鉄所の設立<br>1897年、貨幣法（金本位制）', noteHtml: '自由党・進歩党が提携を拒否したため、総辞職' },
  { name: '伊藤博文③', eventsHtml: '1898年、憲政党の結成', noteHtml: '地租増税案の否決で総辞職' },
  { name: '大隈重信①', eventsHtml: '1898年、共和演説事件', noteHtml: '憲政党内の分裂で総辞職' },
  { name: '山県有朋②', eventsHtml: '1899年、<span class="all">文官任用令</span>改正<br>1900年、<span class="all">治安警察</span>法<br>1900年、<span class="all">軍部大臣現役武官</span>制<br>1900年、北清事変（義和団事件）', noteHtml: '憲政党が離反して総辞職' },
  { name: '伊藤博文④', eventsHtml: '1901年、<span class="all">社会民主党</span>結成、直後に禁止', noteHtml: '貴族院の反対に苦慮し、総辞職' },
  { name: '桂太郎①', eventsHtml: '1902年、<span class="all">日英同盟</span>協約<br>1904年、<span class="all">日露</span>戦争勃発<br>1905年、<span class="all">ポーツマス</span>条約<br>1905年、<span class="all">日比谷焼打ち</span>事件<br>1905年、第２次日韓協約', noteHtml: '日露戦争の戦後処理後に西園寺を首相に推薦し総辞職' },
  { name: '西園寺公望①', eventsHtml: '1906年、<span class="all">日本社会党</span>結成（翌年禁止）<br>1906年、<span class="all">鉄道国有</span>法<br>1907年、ハーグ密使事件<br>1907年、第３次日韓協約', noteHtml: '社会主義の取締りを批判されて総辞職' },
  { name: '桂太郎②', eventsHtml: '1908年、<span class="all">戊申詔書</span><br>1909年、伊藤博文暗殺<br>1910年、<span class="all">大逆</span>事件<br>1910年、韓国併合<br>1911年、<span class="all">工場法</span>公布（施行は1916年）', noteHtml: '長期政権への反対、政策実行の効果を出したとして総辞職' },
  { name: '西園寺公望②', eventsHtml: '1912年、明治天皇没<br>1912年、上原勇作陸相が帷幄上奏', noteHtml: '陸軍が後任の陸相を推薦しなかったので、総辞職' },
];

const taishoEvents: EventRow[] = [
  { name: '桂太郎③', eventsHtml: '1913年、立憲政友会・立憲国民党が内閣不信任案提出', noteHtml: '<span class="all">第一次護憲運動</span>で総辞職（大正政変）' },
  { name: '山本権兵衛①', eventsHtml: '1913年、<span class="all">軍部大臣現役武官制</span>改正<br>1913年、<span class="all">文官任用令</span>改正<br>1914年、<span class="all">ジーメンス</span>事件', noteHtml: 'ジーメンス事件で予算が成立せず総辞職' },
  { name: '大隈重信②', eventsHtml: '1914年、<span class="all">第一次世界大戦</span>勃発<br>1914年、ドイツ領南洋諸島・山東半島の<span class="all">青島</span>占領<br>1915年、二十一ヵ条の要求<br>1916年、<span class="all">工場法</span>施行（1911年に公布）', noteHtml: '元老の支持を失い総辞職' },
  { name: '寺内正毅', eventsHtml: '1917年、西原借款<br>1917年、<span class="all">石井・ランシング</span>協定<br>1918年、<span class="all">シベリア出兵</span>を宣言<br>1918年、<span class="all">米騒動</span>', noteHtml: '米騒動の責任を取って総辞職' },
  { name: '原敬', eventsHtml: '1918年、<span class="all">大学</span>令<br>1919年、三・一独立運動<br>1919年、五・四運動<br>1919年、ヴェルサイユ条約<br>1920年、<span class="all">国際連盟</span>加入<br>1920年、最初のメーデー', noteHtml: '原敬暗殺で総辞職' },
  { name: '高橋是清', eventsHtml: '1921年、<span class="all">ワシントン</span>会議開催<br>1921年、四ヵ国条約<br>1922年、ワシントン海軍軍縮条約<br>1922年、九ヵ国条約', noteHtml: '閣内不一致で総辞職' },
  { name: '加藤友三郎', eventsHtml: '1922年、日本共産党結成（非合法）<br>1922年、<span class="all">シベリア</span>から撤兵完了', noteHtml: '加藤友三郎の病死で総辞職' },
  { name: '山本権兵衛②', eventsHtml: '1923年9月1日、<span class="all">関東大震災</span><br>1923年、<span class="all">虎ノ門</span>事件', noteHtml: '虎ノ門事件の責任を取って総辞職' },
  { name: '清浦奎吾', eventsHtml: '1924年<span class="all">、第二次護憲</span>運動展開<br>1924年、政友本党結成', noteHtml: '総選挙で護憲三派が勝利し総辞職' },
  { name: '加藤高明①②', eventsHtml: '1925年、<span class="all">日ソ基本</span>条約調印<br>1925年、<span class="all">治安維持法</span>公布<br>1925年、<span class="all">普通選挙法</span>公布<br>1925年、<span class="all">五・三〇</span>事件', noteHtml: '加藤高明の病死で総辞職' },
];

function EventsTable({ rows }: { rows: EventRow[] }) {
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
              <td style={{ whiteSpace: 'nowrap' }}>{row.name}</td>
              <td dangerouslySetInnerHTML={{ __html: row.eventsHtml }} />
            </tr>
            <tr>
              <td
                colSpan={2}
                style={{ textAlign: 'center', fontStyle: 'italic', color: '#666' }}
                dangerouslySetInnerHTML={{ __html: row.noteHtml }}
              />
            </tr>
          </Fragment>
        ))}
      </tbody>
    </table>
  );
}

export default async function CabinetEventsPage() {
  return (
    <>
      <link rel="stylesheet" href="/css/subject.css" />
      <link rel="stylesheet" href="/css/jh.css" />
      <link rel="stylesheet" href="/css/content_common.css" />

      <TermClickHandler />

      <h1>
        <div className="first-line">組閣中の出来事</div>
      </h1>

      <div className="main-block bg-gray">
        <div id="toc-range" className="contents">
          <div className="overview">
            下線部の語句をクリックすると表示・非表示が切り替わります。
          </div>

          <AnswerButtons />

          <h2>各内閣組閣中の主な出来事</h2>
          <h3>明治時代</h3>
          <EventsTable rows={meijiEvents} />
          <h3>大正時代</h3>
          <EventsTable rows={taishoEvents} />
          <h3>昭和</h3>
          <p style={{ padding: '20px', textAlign: 'center' }}>準備中です。</p>
        </div>
      </div>
    </>
  );
}
