import Link from 'next/link';
import type { Metadata } from 'next';
import { GEO_CATEGORIES, GEO_EXERCISE_SECTIONS } from '@/lib/geoLessons';

export const metadata: Metadata = {
  title: 'ちとにとせ｜地理',
  description: '大学受験用の高校地理（地理歴史）の学習・勉強をサポートします。イメージしにくい系統地理や知識を応用する地誌を見やすくわかりやすく解説します。',
  keywords: ['社会科', '勉強', '受験', '高校', '地理', 'ちとにとせ'],
};

export default function Geography() {
  return (
    <>
      <link rel="stylesheet" href="/css/subject.css" />
      <link rel="stylesheet" href="/css/geo.css" />

      <h1>
        <div className="first-line">地理</div>
      </h1>
      <div className="text-center my-10">
        <div className="second-line">GEOGRAPHY</div>
        <div className="study">
          <img src="/share/img/study-icon-geo.svg" alt="地理アイコン" />
        </div>
      </div>

      <div className="main-block">
        <div className="lessons">
          {GEO_CATEGORIES.map((category, idx) => (
            <div key={idx}>
              <h2>{category.title}</h2>
              <div className="outer-block clearfix">
                {category.sections.map((section, sidx) => (
                  <dl key={sidx} className="inner-block">
                    <img src={section.image} alt={section.period} />
                    <div>
                      <dt className="ribbon">{section.period}</dt>
                      <ul>
                        {section.lessons.map((lesson) => (
                          <li key={lesson.slug}>
                            <Link href={`/geo/${lesson.slug}`}>
                              {lesson.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </dl>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="lessons">
          <h2>演習・その他</h2>
          <div className="outer-block clearfix">
            {GEO_EXERCISE_SECTIONS.map((section) => (
              <dl key={section.period} className="inner-block">
                <img src={section.image} alt={section.period} />
                <div>
                  <dt className="ribbon">{section.period}</dt>
                  <ul>
                    {section.items.map((item) => (
                      <li key={item.slug}>
                        <Link href={`/geo/${item.slug}`}>{item.title}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </dl>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
