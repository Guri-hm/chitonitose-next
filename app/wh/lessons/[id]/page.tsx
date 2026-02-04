import { notFound } from 'next/navigation';
import { loadSubjectPages } from '@/lib/dataLoader';
import { loadLesson } from '@/lib/markdownLoader';
import type { Metadata } from 'next';
import LessonContent from '@/components/lessons/LessonContent';
import { ImageGalleryProvider } from '@/contexts/ImageGalleryContext';

interface LessonPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  const { id } = await params; // paramsをawait
  const pages = await loadSubjectPages(1); // 世界史
  const lessonNo = parseInt(id, 10);
  const lesson = pages.find(p => p.no === lessonNo);

  if (!lesson) {
    return {
      title: 'レッスンが見つかりません | ちとにとせ',
    };
  }

  return {
    title: `${lesson.title.trim()} | ちとにとせ`,
    description: `世界史 ${lesson.title.trim()}のレッスンページです。`,
    keywords: ['世界史', '高校', '受験', '勉強', lesson.title.trim(), 'ちとにとせ'],
  };
}

export async function generateStaticParams() {
  const pages = await loadSubjectPages(1);
  
  return pages.map((page) => ({
    id: page.no.toString(),
  }));
}

export default async function WHLessonPage({ params }: LessonPageProps) {
  const { id } = await params; // paramsをawait
  const pages = await loadSubjectPages(1);
  const lessonNo = parseInt(id, 10);
  const lesson = pages.find(p => p.no === lessonNo);

  if (!lesson) {
    notFound();
  }

  const prevLesson = pages.find(p => p.no === lessonNo - 1);
  const nextLesson = pages.find(p => p.no === lessonNo + 1);

  // カスタムMarkdownを読み込んでHTMLに変換
  let lessonData = null;
  try {
    lessonData = await loadLesson('wh', lessonNo);
  } catch (error) {
    console.error(`Failed to load lesson ${lessonNo}:`, error);
  }

  return (
    <ImageGalleryProvider>
      <link rel="stylesheet" href="/css/subject.css" />
      <link rel="stylesheet" href="/css/wh.css" />
      
      <LessonContent
        lesson={lesson}
        subject="wh"
        subjectName="世界史"
        subjectColor="#3366cc"
        prevLesson={prevLesson}
        nextLesson={nextLesson}
        htmlContent={lessonData?.content}
      />
    </ImageGalleryProvider>
  );
}
