import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "카톡 대화 분석기",
  description: "카카오톡 대화 내보내기 파일(.txt)을 업로드하면 메시지 수, 시간대·요일·월별 대화량, 답장 속도, 자주 쓰는 단어와 이모지를 분석해드려요. 모든 분석은 브라우저에서만 처리됩니다.",
  keywords: ["카카오톡 분석", "카톡 대화 분석기", "채팅 통계", "카카오톡 통계", "대화 분석", "카톡 분석"],
  authors: [{ name: "kakao-analyzer" }],
  robots: { index: true, follow: true },
  verification: { google: "HGhOZ0OcRXE53LXoMj59y5EIEWPS5tw_3sjzHtFpxGE" },
  alternates: { canonical: "https://kakao-analyzer-seven.vercel.app" },
  openGraph: {
    title: "카톡 대화 분석기",
    description: "카카오톡 대화 파일을 업로드하면 누가 말이 많은지, 언제 가장 활발한지 분석해드려요.",
    url: "https://kakao-analyzer-seven.vercel.app",
    siteName: "카톡 대화 분석기",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
