import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BodyClassManager from "@/components/BodyClassManager";

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
      </head>
      <body suppressHydrationWarning>
        <BodyClassManager />
        <Header />
        <main>
          {children}
        </main>
        <Footer />
        <script src="/js/common.js"></script>
      </body>
    </html>
  );
}
