'use client';

import { useCallback, useEffect, useState } from 'react';
import type { ClimateCity } from '@/lib/geoExercises';
import { CLIMATE_TYPE_NAMES, shuffle, type ClimateType } from './random';

interface ClimateQaProps {
  cities: ClimateCity[];
  type: ClimateType;
}

const QUESTION_COUNT = 10;

/** 雨温図・ハイサーグラフの気候区分を答える一問一答（ランダム10問） */
export default function ClimateQa({ cities, type }: ClimateQaProps) {
  const [questions, setQuestions] = useState<ClimateCity[]>([]);
  const [open, setOpen] = useState<Set<number>>(new Set());
  const typeName = CLIMATE_TYPE_NAMES[type];

  const generate = useCallback(() => {
    setQuestions(shuffle(cities).slice(0, QUESTION_COUNT));
    setOpen(new Set());
  }, [cities]);

  // 出題順はクライアント側でのみ決める（静的書き出しとのハイドレーション不一致を避ける）
  useEffect(() => {
    generate();
  }, [generate]);

  const toggle = (id: number) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <>
      <div id="resPos" className="overview">
        <div className="title">演習について</div>
        <ul>
          <li>
            各問の問題文をタップ（あるいはクリック）すれば、解答が表示されます。問題はページ表示ごとにランダムで{QUESTION_COUNT}問生成されます。
          </li>
        </ul>
      </div>

      <ul>
        {questions.map((city) => {
          const isOpen = open.has(city.id);
          return (
            <li key={city.id}>
              <dl className="faqs">
                <dt className={isOpen ? 'hover' : undefined} onClick={() => toggle(city.id)}>
                  次の{typeName}の気候区分を答えなさい。
                  <div className="gazo">
                    <img src={`/images/geo/${city.nameEg}_${type}.webp`} alt={typeName} loading="lazy" />
                  </div>
                </dt>
                <dd style={{ display: isOpen ? 'block' : 'none' }}>
                  {city.climateAlpha}（{city.climateJp}）
                  <br />
                  {city.nationName}の{city.name}の{typeName}です。
                  <br />
                  {city.explanation}
                  <div className="gazo">
                    <img className="border border-1" src={`/images/geo/${city.nameEg}_map.webp`} alt="都市の地図" loading="lazy" />
                  </div>
                </dd>
              </dl>
            </li>
          );
        })}
      </ul>

      <div className="text-center">
        <button type="button" className="button bg-black" onClick={generate}>
          別の問題
        </button>
      </div>
    </>
  );
}
