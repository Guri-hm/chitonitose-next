import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import LessonContent from '@/components/lessons/LessonContent';

interface LessonPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// 地理のレッスンはファイル名ベース
const geoLessons = [
  { slug: 'geo_lessons_map_history', title: '地図の歴史', category: '地図' },
  { slug: 'geo_lessons_projection', title: '地図の図法', category: '地図' },
  { slug: 'geo_lessons_time_difference', title: '時差', category: '地図' },
  { slug: 'geo_lessons_climatic_element', title: '気候要素', category: '気候' },
  // 他のレッスンも追加可能
];

export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  const { slug } = await params; // paramsをawait
  const lesson = geoLessons.find(l => l.slug === slug);

  if (!lesson) {
    return {
      title: 'レッスンが見つかりません | ちとにとせ',
    };
  }

  return {
    title: `${lesson.title} | ちとにとせ`,
    description: `地理 ${lesson.title}のレッスンページです。`,
    keywords: ['地理', '高校', '受験', '勉強', lesson.title, 'ちとにとせ'],
  };
}

export async function generateStaticParams() {
  return geoLessons.map((lesson) => ({
    slug: lesson.slug,
  }));
}

export default async function GeoLessonPage({ params }: LessonPageProps) {
  const { slug } = await params; // paramsをawait
  const lessonIndex = geoLessons.findIndex(l => l.slug === slug);
  const lesson = geoLessons[lessonIndex];

  if (!lesson) {
    notFound();
  }

  const prevLesson = lessonIndex > 0 ? geoLessons[lessonIndex - 1] : undefined;
  const nextLesson = lessonIndex < geoLessons.length - 1 ? geoLessons[lessonIndex + 1] : undefined;

  // LessonContent用のダミーデータ（地理は番号制ではない）
  const lessonData = {
    no: lessonIndex + 1,
    title: lesson.title,
    directory: 'geo',
    filename: `${lesson.slug}.html`,
  };

  const prevData = prevLesson ? {
    no: lessonIndex,
    title: prevLesson.title,
  } : undefined;

  const nextData = nextLesson ? {
    no: lessonIndex + 2,
    title: nextLesson.title,
  } : undefined;

  return (
    <>
      <link rel="stylesheet" href="/css/subject.css" />
      <link rel="stylesheet" href="/css/geo.css" />
      
      <LessonContent
        lesson={lessonData}
        subject="geo"
        subjectName="地理"
        subjectColor="#339966"
        prevLesson={prevData}
        nextLesson={nextData}
      />
    </>
  );
}
