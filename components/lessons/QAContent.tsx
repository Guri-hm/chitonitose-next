'use client';

import { useState, useCallback, useMemo } from 'react';

export interface QAItem {
  subject_id: number;
  unit_id: number;
  page_no: number;
  id: number;
  question: string;
  answer: string;
  image1: string | null;
  image2: string | null;
  image3: string | null;
  image4: string | null;
}

export interface UnitInfo {
  subject_id: number;
  unit_id: number;
  big_unit_id: number;
  unit_name: string;
  big_unit_name: string | null;
}

export interface FileInfo {
  subject_id: number;
  unit_id: string | number;
  page_no: number;
  title: string;
}

interface QAContentProps {
  /** 全問題データ（全unit分） */
  allItems: QAItem[];
  /** 単元情報（unit select の optgroup 構築用） */
  units: UnitInfo[];
  /** 授業番号情報（page select 用） */
  fileInfo: FileInfo[];
}

export default function QAContent({ allItems, units, fileInfo }: QAContentProps) {
  const [selectedUnit, setSelectedUnit] = useState<number | null>(null);
  const [selectedPage, setSelectedPage] = useState<number | null>(null);
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [allOpen, setAllOpen] = useState(false);
  const [shuffled, setShuffled] = useState<QAItem[] | null>(null);

  // 単元を変えたら授業番号をリセット
  const handleUnitChange = (unitId: number | null) => {
    setSelectedUnit(unitId);
    setSelectedPage(null);
    setShuffled(null);
    setOpenItems(new Set());
    setAllOpen(false);
  };

  const handlePageChange = (page: number | null) => {
    setSelectedPage(page);
    setShuffled(null);
    setOpenItems(new Set());
    setAllOpen(false);
  };

  // 授業番号 select の選択肢（選択中の unit に応じて絞り込み）
  const filteredFileInfo = useMemo(() => {
    if (selectedUnit === null) return fileInfo;
    return fileInfo.filter(f => Number(f.unit_id) === selectedUnit);
  }, [fileInfo, selectedUnit]);

  // 問題の絞り込み
  const filtered = useMemo(() => {
    let items = allItems;
    if (selectedUnit !== null) items = items.filter(i => i.unit_id === selectedUnit);
    if (selectedPage !== null) items = items.filter(i => i.page_no === selectedPage);
    return items;
  }, [allItems, selectedUnit, selectedPage]);

  const displayed = shuffled ?? filtered;

  const toggleItem = useCallback((key: string) => {
    setOpenItems(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const toggleAll = () => {
    if (allOpen) {
      setOpenItems(new Set());
      setAllOpen(false);
    } else {
      const allKeys = new Set(displayed.map(item => `${item.unit_id}-${item.page_no}-${item.id}`));
      setOpenItems(allKeys);
      setAllOpen(true);
    }
  };

  const shuffle = () => {
    const arr = [...filtered];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setShuffled(arr);
    setOpenItems(new Set());
    setAllOpen(false);
  };

  const resetShuffle = () => {
    setShuffled(null);
    setOpenItems(new Set());
    setAllOpen(false);
  };

  // unit select 用: big_unit_name でグルーピング
  const unitGroups = useMemo(() => {
    const groups: { groupName: string | null; units: UnitInfo[] }[] = [];
    let currentGroup: string | null = undefined as unknown as null;
    for (const u of units) {
      if (u.big_unit_name !== currentGroup) {
        groups.push({ groupName: u.big_unit_name, units: [u] });
        currentGroup = u.big_unit_name;
      } else {
        groups[groups.length - 1].units.push(u);
      }
    }
    return groups;
  }, [units]);

  // page select 用: unit_id でグルーピング（数値昇順）
  const pageGroups = useMemo(() => {
    // page_no で数値昇順ソート
    const sorted = [...filteredFileInfo].sort((a, b) => Number(a.page_no) - Number(b.page_no));
    const groups: { unitId: number; unitName: string; pages: FileInfo[] }[] = [];
    const unitMap = new Map(units.map(u => [u.unit_id, u.unit_name]));
    for (const f of sorted) {
      const uid = Number(f.unit_id);
      const unitName = unitMap.get(uid) ?? '';
      const last = groups[groups.length - 1];
      if (!last || last.unitId !== uid) {
        groups.push({ unitId: uid, unitName, pages: [f] });
      } else {
        last.pages.push(f);
      }
    }
    return groups;
  }, [filteredFileInfo, units]);

  return (
    <div className="qa-content">
      {/* 概要 */}
      <div className="overview">
        <div className="title">一問一答</div>
        <ul>
          <li>各問の問題文をタップ（あるいはクリック）すれば、解答が表示されます。</li>
        </ul>
      </div>

      {/* フィルター */}
      <div className="qa-filters">
        <div className="qa-filter-row">
          <label className="control-label">単元</label>
          <div className="select">
            <select
              id="select_unit"
              title="単元選択"
              value={selectedUnit ?? ''}
              onChange={e => handleUnitChange(e.target.value === '' ? null : Number(e.target.value))}
            >
              <option value="">全て</option>
              {unitGroups.map(group =>
                group.groupName ? (
                  <optgroup key={group.groupName} label={group.groupName}>
                    {group.units.map(u => (
                      <option key={u.unit_id} value={u.unit_id}>{u.unit_name}</option>
                    ))}
                  </optgroup>
                ) : (
                  group.units.map(u => (
                    <option key={u.unit_id} value={u.unit_id}>{u.unit_name}</option>
                  ))
                )
              )}
            </select>
          </div>
        </div>

        <div className="qa-filter-row">
          <label className="control-label">授業番号</label>
          <div className="select">
            <select
              id="select_page"
              value={selectedPage ?? ''}
              onChange={e => handlePageChange(e.target.value === '' ? null : Number(e.target.value))}
            >
              <option value="">全て</option>
              {pageGroups.map(group =>
                group.unitName && selectedUnit === null ? (
                  <optgroup key={group.unitId} label={group.unitName}>
                    {group.pages.map(f => (
                      <option key={f.page_no} value={f.page_no}>No.{f.page_no}　{f.title}</option>
                    ))}
                  </optgroup>
                ) : (
                  group.pages.map(f => (
                    <option key={f.page_no} value={f.page_no}>No.{f.page_no}　{f.title}</option>
                  ))
                )
              )}
            </select>
          </div>
        </div>
      </div>

      {/* アクションボタン */}
      <div className="qa-actions">
        <button onClick={toggleAll} className="qa-btn qa-btn-primary">
          {allOpen ? '全て閉じる' : '全て開く'}
        </button>
        <button onClick={shuffle} className="qa-btn qa-btn-secondary">
          シャッフル
        </button>
        {shuffled && (
          <button onClick={resetShuffle} className="qa-btn qa-btn-outline">
            順番に戻す
          </button>
        )}
      </div>

      {/* 問題数 */}
      <p className="qa-count">{displayed.length}問</p>

      {/* 問題一覧 */}
      <ul className="qa-list">
        {displayed.map(item => {
          const key = `${item.unit_id}-${item.page_no}-${item.id}`;
          const isOpen = openItems.has(key);
          return (
            <li key={key} className="qa-item">
              <dl className="faqs">
                <dt
                  className={`qa-question${isOpen ? ' qa-question--open' : ''}`}
                  onClick={() => toggleItem(key)}
                >
                  {item.question}
                </dt>
                <dd
                  className="qa-answer"
                  style={{ display: isOpen ? 'flex' : 'none' }}
                >
                  {item.answer}
                </dd>
              </dl>
            </li>
          );
        })}
      </ul>

      {displayed.length === 0 && (
        <p className="qa-empty">この条件に一致する問題はありません。</p>
      )}
    </div>
  );
}