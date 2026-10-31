import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BodyClassManager from "@/components/BodyClassManager";
import { ImageGalleryProvider } from "@/contexts/ImageGalleryContext";

export const metadata: Metadata = {
  title: "ちとにとせ｜地理と日本史と世界史のまとめサイト",
  description: "「ちとにとせ」は、大学受験用の日本史・世界史・地理（地理歴史）のまとめサイト。見やすくわかりやすく解説します。",
  keywords: ["社会科", "高校", "日本史", "世界史", "地理", "授業", "プリント", "ちとにとせ"],
  // テスト公開中は旧サイトとの重複を避けるため、ワークフローで NEXT_PUBLIC_NOINDEX=true を設定してインデックスさせない
  ...(process.env.NEXT_PUBLIC_NOINDEX === "true" ? { robots: { index: false, follow: false } } : {}),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        {/* 元サイトのCSSを読み込み */}
        <link href="/css/common.css" rel="stylesheet" type="text/css" />
        {/* 保存済みのテーマ（ダークモード）を描画前に適用し、ライト→ダークのちらつきを防ぐ */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem('theme')==='dark')document.documentElement.setAttribute('data-theme','dark');}catch(e){}`,
          }}
        />
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-KKRF3KN');`,
          }}
        />
        {/* End Google Tag Manager */}
        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4825014479713194"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className="m-size-font" suppressHydrationWarning>
        {/* 保存済みの文字サイズを描画前に適用し、表示後にサイズが切り替わるちらつきを防ぐ */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var f=sessionStorage.getItem('fontSize');if(f)document.body.className=f;}catch(e){}`,
          }}
        />
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KKRF3KN"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <ImageGalleryProvider>
          <BodyClassManager />
          <Header />
          <main>
            {children}
          </main>
          <Footer />
        </ImageGalleryProvider>
      </body>
    </html>
  );
}
