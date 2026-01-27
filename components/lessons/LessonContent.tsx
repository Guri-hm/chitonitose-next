'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import MDXContent from './MDXContent';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';

interface LessonContentProps {
  lesson: {
    no: number;
    title: string;
    directory: string;
    filename: string;
  };
  subject: string;
  subjectName: string;
  subjectColor: string;
  prevLesson?: {
    no: number;
    title: string;
  };
  nextLesson?: {
    no: number;
    title: string;
  };
  mdxSource?: MDXRemoteSerializeResult;
}

/**
 * レッスンコンテンツ表示コンポーネント
 */
export default function LessonContent({
  lesson,
  subject,
  subjectName,
  subjectColor,
  prevLesson,
  nextLesson,
  mdxSource,
}: LessonContentProps) {
  
  useEffect(() => {
    // 目次生成などのクライアントサイド処理をここに追加
  }, []);

  return (
    <div className="lesson-page">
      {/* ヘッダー */}
      <h1>
        <div className="first-line">{subjectName}</div>
        <div className="second-line">No.{lesson.no}　{lesson.title.trim()}</div>
      </h1>

      {/* コンテンツエリア */}
      <div className="contents" id="toc-range">
        
        {mdxSource ? (
          // MDXコンテンツをレンダリング
          <MDXContent source={mdxSource} />
        ) : (
          // MDXファイルが存在しない場合のフォールバック
          <>
            {/* 概要セクション */}
            <div className="overview">
              <div className="title">概要</div>
              <p>
                このレッスンでは「{lesson.title.trim()}」について学習します。
              </p>
              <p className="text-gray-500 text-sm mt-4">
                ※ このレッスンページは現在準備中です。元のHTMLコンテンツをMDX形式に変換中です。
              </p>
            </div>

            {/* 目次 */}
            <div id="toc"></div>

            {/* サンプルセクション */}
            <h2>学習内容</h2>
            <div className="top">
              このページでは、{lesson.title.trim()}について詳しく学習します。
            </div>
          </>
        )}

        {/* ページネーション */}
        <div className="pagination">
          {prevLesson && (
            <Link href={`/${subject}/lessons/${prevLesson.no}`} className="prev">
              ← 前のレッスン<br />
              <span className="lesson-title">No.{prevLesson.no} {prevLesson.title.trim()}</span>
            </Link>
          )}
          
          <Link href={`/${subject}`} className="index">
            一覧に戻る
          </Link>

          {nextLesson && (
            <Link href={`/${subject}/lessons/${nextLesson.no}`} className="next">
              次のレッスン →<br />
              <span className="lesson-title">No.{nextLesson.no} {nextLesson.title.trim()}</span>
            </Link>
          )}
        </div>
      </div>

      <style jsx>{`
        .lesson-page {
          margin: 0 auto;
          padding: 20px;
        }

        .pagination {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 60px;
          padding: 30px 0;
          border-top: 2px solid ${subjectColor};
          gap: 20px;
          flex-wrap: wrap;
        }

        .pagination a {
          text-decoration: none;
          padding: 15px 25px;
          border-radius: 8px;
          transition: all 0.3s;
          font-weight: bold;
          text-align: center;
        }

        .pagination .prev,
        .pagination .next {
          background: ${subjectColor};
          color: white;
          flex: 1;
          min-width: 200px;
        }

        .pagination .prev:hover,
        .pagination .next:hover {
          opacity: 0.8;
          transform: translateY(-2px);
        }

        .pagination .index {
          background: #f0f0f0;
          color: #333;
          padding: 15px 40px;
        }

        .pagination .index:hover {
          background: #e0e0e0;
        }

        .lesson-title {
          font-size: 0.85em;
          font-weight: normal;
          opacity: 0.9;
        }

        @media (max-width: 768px) {
          .pagination {
            flex-direction: column;
          }

          .pagination a {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
