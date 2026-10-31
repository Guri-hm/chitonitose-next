'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { shuffle } from './random';

export interface SelectionItem {
  id: string;
  /** 同じ値を持つ項目は不正解の選択肢として同時に出題しない（例：同じ気候区分） */
  groupKey: string | number;
  mapSrc: string;
  optionSrc: string;
  optionAlt: string;
  /** 正解時の解説（例：「日本の東京の雨温図（Cfa、温暖湿潤気候）です。」） */
  correctText: string;
  /** 不正解の選択肢の解説 */
  otherText: string;
  explanation?: string;
}

interface Question {
  answer: SelectionItem;
  options: SelectionItem[];
}

interface SelectionProblemProps {
  items: SelectionItem[];
  heading: React.ReactNode;
  footnote?: React.ReactNode;
  optionCount?: number;
}

function buildQuestion(items: SelectionItem[], optionCount: number): Question {
  const answer = items[Math.floor(Math.random() * items.length)];
  const distractors = shuffle(items.filter((i) => i.id !== answer.id && i.groupKey !== answer.groupKey)).slice(
    0,
    optionCount - 1
  );
  return { answer, options: shuffle([answer, ...distractors]) };
}

/** 地図上の地点・線に対応する図を4択から選ぶ演習 */
export default function SelectionProblem({ items, heading, footnote, optionCount = 4 }: SelectionProblemProps) {
  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const next = useCallback(() => {
    setQuestion(buildQuestion(items, optionCount));
    setSelectedId(null);
    setAnswered(false);
  }, [items, optionCount]);

  // 出題はクライアント側でのみ決める（静的書き出しとのハイドレーション不一致を避ける）
  useEffect(() => {
    next();
  }, [next]);

  const handleNext = () => {
    next();
    headingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const correctNo = question ? question.options.findIndex((o) => o.id === question.answer.id) + 1 : 0;
  const isCorrect = question !== null && selectedId === question.answer.id;

  return (
    <>
      <h2 id="resPos" ref={headingRef}>
        {heading}
      </h2>
      <div id="question" className="form-radio-none">
        {question && (
          <>
            <div className="gazo">
              <img src={question.answer.mapSrc} className="border border-1" alt="地図" />
            </div>
            <div className="gazo">
              <ul className="d-flex flex-wrap gy-20 gx-10 justify-content-center">
                {question.options.map((opt, i) => (
                  <li key={opt.id} className="p-5">
                    <input
                      id={`option-${opt.id}`}
                      type="radio"
                      name="choice"
                      value={opt.id}
                      checked={selectedId === opt.id}
                      onChange={() => setSelectedId(opt.id)}
                      disabled={answered}
                    />
                    <label htmlFor={`option-${opt.id}`}>
                      選択肢{i + 1}
                      <br />
                      <img src={opt.optionSrc} alt={opt.optionAlt} />
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            {answered && (
              <div id="divExplanation" className="answer overview">
                <div className="title">答え</div>
                <div id="divResult" className={isCorrect ? 'correct' : 'incorrect'}>
                  正解は選択肢{correctNo}。
                </div>
                <div>
                  {question.answer.correctText}
                  {question.answer.explanation}
                </div>
                <br />
                {question.options.map(
                  (opt, i) =>
                    opt.id !== question.answer.id && (
                      <div key={opt.id}>
                        選択肢{i + 1}は、{opt.otherText}
                      </div>
                    )
                )}
              </div>
            )}
          </>
        )}
      </div>
      <div className="text-center">
        <button
          type="button"
          className="button btnAnswer"
          disabled={selectedId === null || answered}
          onClick={() => setAnswered(true)}
        >
          回答
        </button>{' '}
        <button type="button" className="button btnGetNew bg-black" onClick={handleNext}>
          別の問題
        </button>
      </div>
      {footnote}
    </>
  );
}
