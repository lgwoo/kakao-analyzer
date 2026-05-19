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

const BASE_URL = "https://kakao-analyzer-seven.vercel.app";

export const metadata: Metadata = {
  title: "카톡 대화 분석기 — 무료 카카오톡 채팅 통계",
  description: "카카오톡 대화(.txt) 파일을 업로드하면 메시지 수, 답장 속도, 시간대·요일별 활동량, 자주 쓰는 단어와 이모지를 무료로 분석해드립니다. 개인정보는 브라우저 밖으로 나가지 않아요.",
  keywords: [
    "카카오톡 분석", "카톡 대화 분석기", "채팅 통계", "카카오톡 통계",
    "대화 분석", "카톡 분석", "카톡 통계", "카카오톡 채팅 분석",
    "대화 통계", "답장 속도 측정", "카톡 분석기", "무료 카톡 분석",
    "채팅 분석 도구", "카카오톡 대화 내보내기 분석",
  ],
  authors: [{ name: "kakao-analyzer" }],
  robots: { index: true, follow: true },
  verification: { google: "HGhOZ0OcRXE53LXoMj59y5EIEWPS5tw_3sjzHtFpxGE" },
  alternates: { canonical: BASE_URL },
  openGraph: {
    title: "카톡 대화 분석기 — 무료 카카오톡 채팅 통계",
    description: "카카오톡 대화 파일을 업로드하면 누가 말이 많은지, 언제 가장 활발한지, 답장 속도는 얼마인지 무료로 분석해드려요.",
    url: BASE_URL,
    siteName: "카톡 대화 분석기",
    locale: "ko_KR",
    type: "website",
    images: [{ url: `${BASE_URL}/opengraph-image`, width: 1200, height: 630, alt: "카톡 대화 분석기" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "카톡 대화 분석기 — 무료 카카오톡 채팅 통계",
    description: "카카오톡 대화 파일을 업로드하면 누가 말이 많은지, 언제 가장 활발한지, 답장 속도는 얼마인지 무료로 분석해드려요.",
    images: [`${BASE_URL}/opengraph-image`],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "카톡 대화 분석기",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web",
  description: "카카오톡 대화 내보내기 파일(.txt)을 업로드하면 메시지 수, 시간대·요일·월별 대화량, 답장 속도, 자주 쓰는 단어와 이모지를 분석해드려요.",
  url: BASE_URL,
  inLanguage: "ko",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
