'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { shuffle } from './random';
import './geo-exercises.css';

interface QuizNation {
  code: string;
  name: string;
}

interface MapQuizProps {
  /** public/quiz-maps/ 配下のSVGファイル名（拡張子なし） */
  mapName: string;
  nations: QuizNation[];
  /** 2文字コード→国名（ドロップ先の国名表示用、全国分） */
  nationNames: Record<string, string>;
}

interface Placement {
  zone: string;
  color: string;
}

interface DragState {
  code: string;
  startX: number;
  startY: number;
  baseX: number;
  baseY: number;
}

const ZONE_ID = /^[A-Z]+$/;

function randomColor() {
  const r = () => Math.floor(Math.random() * 255);
  return `rgb(${r()},${r()},${r()})`;
}

function setFill(el: Element, color: string) {
  el.setAttribute('fill', color);
  el.querySelectorAll('path').forEach((p) => p.setAttribute('fill', color));
}

/** 国名リストを地図上の正しい国にドラッグ＆ドロップする演習 */
export default function MapQuiz({ mapName, nations, nationNames }: MapQuizProps) {
  const [items, setItems] = useState<QuizNation[]>(nations);
  const [mapReady, setMapReady] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});
  const [placements, setPlacements] = useState<Record<string, Placement>>({});
  const [draggingCode, setDraggingCode] = useState<string | null>(null);
  const [hoverZone, setHoverZone] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const mapRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const positionsRef = useRef(positions);
  positionsRef.current = positions;

  // 並び順のシャッフルはクライアント側でのみ行う（ハイドレーション不一致を避ける）
  useEffect(() => {
    setItems(shuffle(nations));
  }, [nations]);

  useEffect(() => {
    let cancelled = false;
    setLoadError(false);
    fetch(`/quiz-maps/${mapName}.svg`)
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        return res.text();
      })
      .then((text) => {
        // Reactに管理させると再描画で地図のDOM（配色・クラス）が作り直されるため、直接挿入する
        if (cancelled || !mapRef.current) return;
        mapRef.current.innerHTML = text;
        setMapReady(true);
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [mapName]);

  // 地図のDOMは描画のたびに作り直される場合があるため、要素は参照を保持せず都度取得する
  const getZones = useCallback((): Map<string, Element> => {
    const zones = new Map<string, Element>();
    mapRef.current?.querySelectorAll('path[id], g[id]').forEach((el) => {
      if (ZONE_ID.test(el.id)) zones.set(el.id, el);
    });
    return zones;
  }, []);

  // 配置状態から地図の色を再計算する
  useEffect(() => {
    const zones = getZones();
    zones.forEach((el) => setFill(el, '#FFFFFF'));
    Object.values(placements).forEach(({ zone, color }) => {
      const el = zones.get(zone);
      if (el) setFill(el, color);
    });
  }, [placements, mapReady, getZones]);

  useEffect(() => {
    getZones().forEach((el) => {
      el.classList.toggle('drag-active', draggingCode !== null);
      el.classList.toggle('drag-enter', draggingCode !== null && el.id === hoverZone);
    });
  }, [draggingCode, hoverZone, getZones]);

  const findZone = useCallback((x: number, y: number): string | null => {
    const svg = mapRef.current?.querySelector('svg');
    if (!svg) return null;
    for (const el of document.elementsFromPoint(x, y)) {
      if (!svg.contains(el)) continue;
      let node: Element | null = el;
      while (node && node !== svg) {
        if (ZONE_ID.test(node.id) && (node.tagName === 'path' || node.tagName === 'g')) return node.id;
        node = node.parentElement;
      }
    }
    return null;
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>, code: string) => {
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const pos = positionsRef.current[code] ?? { x: 0, y: 0 };
    dragRef.current = { code, startX: e.clientX, startY: e.clientY, baseX: pos.x, baseY: pos.y };
    setDraggingCode(code);
    setPlacements((prev) => {
      if (!(code in prev)) return prev;
      const { [code]: _removed, ...rest } = prev;
      return rest;
    });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    setPositions((prev) => ({
      ...prev,
      [drag.code]: { x: drag.baseX + e.clientX - drag.startX, y: drag.baseY + e.clientY - drag.startY },
    }));
    setHoverZone(findZone(e.clientX, e.clientY));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    dragRef.current = null;
    const zone = findZone(e.clientX, e.clientY);
    setDraggingCode(null);
    setHoverZone(null);
    if (!zone) return;

    // 先にドロップされていた国名は初期位置に戻す
    const evicted = Object.entries(placements)
      .filter(([code, p]) => p.zone === zone && code !== drag.code)
      .map(([code]) => code);
    if (evicted.length > 0) {
      setPositions((prev) => {
        const next = { ...prev };
        evicted.forEach((code) => delete next[code]);
        return next;
      });
    }
    setPlacements((prev) => {
      const next: Record<string, Placement> = {};
      Object.entries(prev).forEach(([code, p]) => {
        if (p.zone !== zone) next[code] = p;
      });
      next[drag.code] = { zone, color: randomColor() };
      return next;
    });
  };

  const reset = () => {
    setPositions({});
    setPlacements({});
    setShowResult(false);
  };

  const allPlaced = items.length > 0 && items.every((n) => n.code in placements);

  const results = useMemo(
    () =>
      items.map((n) => {
        const dropped = placements[n.code]?.zone;
        const correct = dropped === n.code;
        return {
          code: n.code,
          correct,
          text: correct ? n.name : `${n.name}(ドロップ先は${dropped ? nationNames[dropped] ?? dropped : '-'})`,
        };
      }),
    [items, placements, nationNames]
  );
  const correctCount = results.filter((r) => r.correct).length;

  return (
    <div className="map-quiz">
      <div id="resPos" className="h2 mb-20">
        リスト内の国名を地図上の正しい場所にドロップしましょう。
      </div>
      <div className="overview">
        <div className="title">国名リスト</div>
        <div className="quiz-nations">
          {items.map((n) => {
            const pos = positions[n.code];
            const placed = n.code in placements;
            return (
              <div
                key={n.code}
                className={`drag${placed ? ' ft-shadow' : ''}${draggingCode === n.code ? ' is-dragging' : ''}`}
                style={pos ? { transform: `translate(${pos.x}px, ${pos.y}px)` } : undefined}
                onPointerDown={(e) => handlePointerDown(e, n.code)}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
              >
                {n.name}
              </div>
            );
          })}
        </div>
      </div>

      <div id="question" className="quiz-map">
        {loadError ? (
          <p>地図を読み込めませんでした。</p>
        ) : (
          <div ref={mapRef} />
        )}
      </div>

      <div className="text-center">
        <button type="button" className="button" disabled={!allPlaced} onClick={() => setShowResult(true)}>
          解答
        </button>{' '}
        <button type="button" className="button bg-black" onClick={reset}>
          リセット
        </button>
      </div>

      {showResult && (
        <div className="quiz-modal-overlay" onClick={() => setShowResult(false)}>
          <div className="quiz-modal" role="dialog" aria-modal="true" aria-labelledby="quiz-result-title" onClick={(e) => e.stopPropagation()}>
            <div id="quiz-result-title" className="quiz-modal-title">
              結果
            </div>
            <div id="resultMsg">
              <p>
                {items.length}か国のうち{correctCount}か国正解しました。
              </p>
              {results.map((r) => (
                <p key={r.code} className={r.correct ? 'correct' : 'incorrect'}>
                  {r.text}
                </p>
              ))}
            </div>
            <div className="text-center mt-10">
              <button type="button" className="button bg-black" onClick={() => setShowResult(false)}>
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
