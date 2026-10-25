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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link rel="icon" href="/favicon.ico" />
        {/* 元サイトのCSSを読み込み */}
        <link href="/css/common.css" rel="stylesheet" type="text/css" />
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
      <body suppressHydrationWarning>
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
        <script src="/js/common.js"></script>
      </body>
    </html>
  );
}
