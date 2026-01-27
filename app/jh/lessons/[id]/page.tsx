import { notFound } from 'next/navigation';
import { loadSubjectPages } from '@/lib/dataLoader';
import { getMDXLesson } from '@/lib/mdxLoader';
import { serialize } from 'next-mdx-remote/serialize';
import type { Metadata } from 'next';
import LessonContent from '@/components/lessons/LessonContent';

interface LessonPageProps {
  params: {
    id: string;
  };
}

// メタデータを動的に生成
export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  const { id } = await params; // paramsをawait
  const pages = await loadSubjectPages(2); // 日本史
  const lessonNo = parseInt(id, 10);
  const lesson = pages.find(p => p.no === lessonNo);

  if (!lesson) {
    return {
      title: 'レッスンが見つかりません | ちとにとせ',
    };
  }

  return {
    title: `${lesson.title.trim()} | ちとにとせ`,
    description: `日本史 ${lesson.title.trim()}のレッスンページです。`,
    keywords: ['日本史', '高校', '受験', '勉強', lesson.title.trim(), 'ちとにとせ'],
  };
}

// 静的パスを生成（ビルド時）
export async function generateStaticParams() {
  const pages = await loadSubjectPages(2);
  
  return pages.map((page) => ({
    id: page.no.toString(),
  }));
}

export default async function JHLessonPage({ params }: LessonPageProps) {
  const { id } = await params; // paramsをawait
  const pages = await loadSubjectPages(2);
  const lessonNo = parseInt(id, 10);
  const lesson = pages.find(p => p.no === lessonNo);

  if (!lesson) {
    notFound();
  }

  // 前後のレッスンを取得
  const prevLesson = pages.find(p => p.no === lessonNo - 1);
  const nextLesson = pages.find(p => p.no === lessonNo + 1);

  // MDXファイルを読み込む
  const mdxData = await getMDXLesson('jh', id);
  let mdxSource = null;
  
  if (mdxData) {
    mdxSource = await serialize(mdxData.content);
  }

  return (
    <>
      <link rel="stylesheet" href="/css/subject.css" />
      <link rel="stylesheet" href="/css/jh.css" />
      
      <LessonContent
        lesson={lesson}
        subject="jh"
        subjectName="日本史"
        subjectColor="#cc3366"
        prevLesson={prevLesson}
        nextLesson={nextLesson}
        mdxSource={mdxSource || undefined}
      />
    </>
  );
}
