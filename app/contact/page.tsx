import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'お問い合わせ | ちとにとせ',
  description: '「ちとにとせ」へのお問い合わせはこちらのフォームからお願いします。',
  keywords: ['お問い合わせ', '連絡', 'ちとにとせ'],
};

export default function ContactPage() {
  return (
    <>
      <link rel="stylesheet" href="/css/subject.css" />
      <link rel="stylesheet" href="/css/contact.css" />

      <h1>
        <div className="first-line">お問い合わせ</div>
      </h1>

      <div className="main-block bg-gray">
        <div className="lessons">
          <div className="overview">
            ご質問・ご意見・誤りのご指摘等がありましたら、下記フォームよりお気軽にご連絡ください。
            内容を確認のうえ、個別に返信が必要な場合は折り返しご連絡いたします。
          </div>

          <ContactForm />
        </div>
      </div>
    </>
  );
}
