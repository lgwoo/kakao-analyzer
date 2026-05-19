import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "대화 분석 결과 — 카톡 대화 분석기",
  description: "업로드한 카카오톡 대화의 메시지 수, 답장 속도, 시간대·요일별 활동량, 자주 쓰는 단어와 이모지 분석 결과를 확인하세요.",
  robots: { index: false, follow: false },
};

export default function ResultLayout({ children }: { children: React.ReactNode }) {
  return children;
}
