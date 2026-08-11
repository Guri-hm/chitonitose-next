import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import ThreeColumnLayout from '@/components/lessons/ThreeColumnLayout';
import GeoLessonContent from '@/components/lessons/GeoLessonContent';
import TermClickHandler from '@/components/lessons/TermClickHandler';
import ImageClickHandler from '@/components/lessons/ImageClickHandler';
import AnswerButtons from '@/components/AnswerButtons';
import NotationGuide from '@/components/lessons/NotationGuide';
import TableOfContents from '@/components/TableOfContents';
import { loadCustomLesson } from '@/lib/markdownLoader';
import { loadLessonChartDatasets } from '@/lib/dataLoader';
import { GEO_LESSONS } from '@/lib/geoLessons';
import { LeftIcon, RightIcon } from '@/components/ui/Icons';

interface LessonPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/** content/geo/lessons/{contentId}.mdが存在するレッスンのみを返す */
function getAvailableLessons() {
  const contentDir = path.join(process.cwd(), 'content', 'geo', 'lessons');
  return GEO_LESSONS.filter((l) =>
    fs.existsSync(path.join(contentDir, `${l.contentId}.md`))
  );
}

export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  const { slug } = await params;
  const lesson = GEO_LESSONS.find((l) => l.slug === slug);
  if (!lesson) return { title: 'レッスンが見つかりません | ちとにとせ' };
  return {
    title: `${lesson.title} | ちとにとせ`,
    description: `地理 ${lesson.title}のレッスンページです。`,
    keywords: ['地理', '高校', '受験', '勉強', lesson.title, 'ちとにとせ'],
  };
}

export function generateStaticParams() {
  return getAvailableLessons().map((l) => ({ slug: l.slug }));
}

export default async function GeoLessonPage({ params }: LessonPageProps) {
  const { slug } = await params;
  const lessons = getAvailableLessons();
  const lessonIndex = lessons.findIndex((l) => l.slug === slug);
  const lesson = lessons[lessonIndex];

  if (!lesson) notFound();

  const lessonData = await loadCustomLesson('geo', 'lessons', lesson.contentId);
  const chartDatasets = await loadLessonChartDatasets();

  const prevLesson = lessonIndex > 0 ? lessons[lessonIndex - 1] : undefined;
  const nextLesson = lessonIndex < lessons.length - 1 ? lessons[lessonIndex + 1] : undefined;

  // ThreeColumnLayoutに渡すpages（slug付き、カテゴリ順）
  const pages = lessons.map((l, i) => ({ no: i + 1, title: l.title, slug: l.slug }));

  return (
    <>
      <link rel="stylesheet" href="/css/geo.css" />
      <link rel="stylesheet" href="/css/content_common.css" />

      <ThreeColumnLayout
        subject="geo"
        currentSlug={slug}
        pages={pages}
        title={lesson.title}
      >
        <TermClickHandler />
        <ImageClickHandler />
        <div id="toc-range" className="contents">
          {lessonData ? (
            <>
              {/* 答えの一括表示/非表示ボタン */}
              <AnswerButtons />

              {/* 表記説明 */}
              <NotationGuide />

              {/* 目次 */}
              <TableOfContents />

              <GeoLessonContent
                htmlContent={lessonData.content}
                chartDatasets={chartDatasets}
              />
            </>
          ) : (
            <p>コンテンツを読み込めませんでした。</p>
          )}

          {/* ナビゲーション */}
          <div className="text-center d-flex flex-wrap sm-flex-column justify-content-center gy-10 my-10">
            {prevLesson && (
              <div className="d-flex flex-column align-center order-1 mx-10 border border-2 border-subject-color p-10 border-radius-5">
                <a href={`/geo/${prevLesson.slug}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <LeftIcon size={20} />
                  <div>
                    <div>前の内容</div>
                    <div>{prevLesson.title}</div>
                  </div>
                </a>
              </div>
            )}
            <div className="d-flex flex-column align-center order-2 mx-10">
              <Link href="/geo" className="border border-2 border-subject-color p-10 border-radius-5">
                地理トップ
              </Link>
            </div>
            {nextLesson && (
              <div className="d-flex flex-column align-center order-3 mx-10 border border-2 border-subject-color p-10 border-radius-5">
                <a href={`/geo/${nextLesson.slug}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div>次の内容</div>
                    <div>{nextLesson.title}</div>
                  </div>
                  <RightIcon size={20} />
                </a>
              </div>
            )}
          </div>
        </div>
      </ThreeColumnLayout>
    </>
  );
}

