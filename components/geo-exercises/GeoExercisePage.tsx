import Link from 'next/link';
import ThreeColumnLayout from '@/components/lessons/ThreeColumnLayout';
import { LeftIcon, RightIcon } from '@/components/ui/Icons';
import { GEO_EXERCISE_PAGES } from '@/lib/geoLessons';

interface GeoExercisePageProps {
  slug: string;
  children: React.ReactNode;
}

/** 地理「演習・その他」ページ共通の枠（サイドバー・見出し・前後ナビ） */
export default function GeoExercisePage({ slug, children }: GeoExercisePageProps) {
  const index = GEO_EXERCISE_PAGES.findIndex((p) => p.slug === slug);
  const current = GEO_EXERCISE_PAGES[index];
  const prev = index > 0 ? GEO_EXERCISE_PAGES[index - 1] : undefined;
  const next = index >= 0 && index < GEO_EXERCISE_PAGES.length - 1 ? GEO_EXERCISE_PAGES[index + 1] : undefined;

  return (
    <>
      <link rel="stylesheet" href="/css/geo.css" />
      <link rel="stylesheet" href="/css/content_common.css" />

      <ThreeColumnLayout
        subject="geo"
        currentSlug={slug}
        pages={[]}
        title={current.pageTitle}
        prevLesson={prev ? { title: prev.pageTitle, href: `/geo/${prev.slug}` } : undefined}
        nextLesson={next ? { title: next.pageTitle, href: `/geo/${next.slug}` } : undefined}
      >
        <div id="toc-range" className="contents">
          {children}

          <div className="text-center d-flex flex-wrap sm-flex-column justify-content-center gy-10 my-10">
            {prev && (
              <div className="d-flex flex-column align-center order-1 mx-10 border border-2 border-subject-color p-10 border-radius-5">
                <a href={`/geo/${prev.slug}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <LeftIcon size={20} />
                  <div>
                    <div>前の内容</div>
                    <div>{prev.pageTitle}</div>
                  </div>
                </a>
              </div>
            )}
            <div className="d-flex flex-column align-center order-2 mx-10">
              <Link href="/geo" className="border border-2 border-subject-color p-10 border-radius-5">
                地理トップ
              </Link>
            </div>
            {next && (
              <div className="d-flex flex-column align-center order-3 mx-10 border border-2 border-subject-color p-10 border-radius-5">
                <a href={`/geo/${next.slug}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div>次の内容</div>
                    <div>{next.pageTitle}</div>
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
