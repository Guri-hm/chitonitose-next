'use client';

import { useState } from 'react';

// スパム収集ボットによる機械的な抽出を避けるため、メールアドレスは
// ソース上に直接書かず、クリック時に組み立てる。
const MAIL_USER = 'chitonitose';
const MAIL_DOMAIN = 'gmail.com';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const to = `${MAIL_USER}@${MAIL_DOMAIN}`;
    const mailSubject = subject || 'お問い合わせ';
    const mailBody = `${body}${name ? `\n\n―――――\nお名前: ${name}` : ''}`;
    const href = `mailto:${to}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;
    window.location.href = href;
  };

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      <div className="form-group">
        <label htmlFor="contact-name">お名前（任意）</label>
        <input
          id="contact-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="氏名"
        />
      </div>

      <div className="form-group">
        <label htmlFor="contact-subject">件名（必須）</label>
        <input
          id="contact-subject"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="件名"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="contact-body">お問い合わせ内容（必須）</label>
        <textarea
          id="contact-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="お問い合わせ内容をお書きください"
          rows={6}
          required
        />
      </div>

      <button type="submit" className="button contact-submit">メールを送る</button>
      <p className="contact-note">
        送信ボタンを押すと、お使いのメールソフトが起動し、入力内容を引用した状態で下書きが作成されます。
      </p>
    </form>
  );
}
