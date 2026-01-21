import "./globals.css";
import type { Metadata } from "next";
import { Cormorant_Garamond, Noto_Sans_KR } from "next/font/google";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-serif",
});

const body = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "남궁혁 ♥ 최예슬 | 모바일 청첩장",
  description: "2026년 2월 19일 목요일 19시, UpHere Worship Church",
  openGraph: {
    title: "남궁혁 ♥ 최예슬 | 모바일 청첩장",
    description: "2026년 2월 19일 목요일 19시, UpHere Worship Church",
    images: ["/og.jpg"],
  },
  appleWebApp: {
    title: "청첩장",
    statusBarStyle: "default",
    capable: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${serif.variable} ${body.variable}`}>
      <body className="text-[#1a1a1a]">{children}</body>
    </html>
  );
}
