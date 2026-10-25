import Link from 'next/link';
import './Footer.css';

export default function Footer() {
  return (
    <footer id="footer">
      <nav className="footer-links" aria-label="サイト情報">
        <Link href="/guide">ご利用ガイド</Link>
        <Link href="/contact">お問い合わせ</Link>
      </nav>
      <div>(C) ちとにとせ / since December 2.2013</div>
    </footer>
  );
}


