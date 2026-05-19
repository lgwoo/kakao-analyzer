"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnalysisResult } from "@/types";
import StatCard from "@/components/StatCard";
import MessageCountChart from "@/components/charts/MessageCountChart";
import HourlyChart from "@/components/charts/HourlyChart";
import DayOfWeekChart from "@/components/charts/DayOfWeekChart";
import MonthlyChart from "@/components/charts/MonthlyChart";
import EmojiChart from "@/components/charts/EmojiChart";
import WordCloudChart from "@/components/charts/WordCloudChart";
import ResponseTimeChart from "@/components/charts/ResponseTimeChart";

function fmt(d: Date) {
  const date = new Date(d);
  return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
}

function formatMinutes(min: number | null): string {
  if (min === null) return "-";
  if (min < 60) return `${min}분`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m > 0 ? `${h}시간 ${m}분` : `${h}시간`;
}

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("kakao-result");
    if (!raw) {
      router.replace("/");
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      // Date 복원
      parsed.startDate = new Date(parsed.startDate);
      parsed.endDate = new Date(parsed.endDate);
      setResult(parsed);
    } catch {
      router.replace("/");
    }
  }, [router]);

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">불러오는 중...</p>
      </div>
    );
  }

  const fastest = [...result.participants].sort(
    (a, b) => (a.avgResponseTime ?? Infinity) - (b.avgResponseTime ?? Infinity)
  )[0];

  return (
    <main className="min-h-screen bg-gray-50 pb-16">
      {/* 상단 헤더 */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white py-10 px-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.push("/")}
            className="text-white/70 hover:text-white text-sm mb-4 flex items-center gap-1 transition-colors"
          >
            ← 다시 분석하기
          </button>
          <h1 className="text-2xl font-bold mb-1">💬 대화 분석 결과</h1>
          <p className="text-white/70 text-sm">
            {fmt(result.startDate)} ~ {fmt(result.endDate)}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-6">
        {/* 요약 카드 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <StatCard label="총 메시지" value={result.totalMessages.toLocaleString() + "개"} />
          <StatCard label="대화 기간" value={result.totalDays.toLocaleString() + "일"} />
          <StatCard label="연속 대화 최장" value={result.longestStreak + "일"} sub="하루도 빠짐없이" />
          <StatCard label="가장 활발한 시간" value={result.mostActiveHour + "시대"} sub={result.mostActiveDay + "요일"} />
        </div>

        {/* 참여자 요약 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-4">
          <h3 className="text-lg font-bold text-gray-800 mb-4">참여자 상세</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 text-gray-500 font-medium">이름</th>
                  <th className="text-right py-2 text-gray-500 font-medium">메시지</th>
                  <th className="text-right py-2 text-gray-500 font-medium">글자 수</th>
                  <th className="text-right py-2 text-gray-500 font-medium">사진/파일</th>
                  <th className="text-right py-2 text-gray-500 font-medium">평균 답장</th>
                </tr>
              </thead>
              <tbody>
                {result.participants.map((p) => (
                  <tr key={p.name} className="border-b border-gray-50 last:border-0">
                    <td className="py-2.5 font-medium text-gray-800">{p.name}</td>
                    <td className="py-2.5 text-right text-gray-600">{p.messageCount.toLocaleString()}</td>
                    <td className="py-2.5 text-right text-gray-600">{p.charCount.toLocaleString()}</td>
                    <td className="py-2.5 text-right text-gray-600">{p.mediaCount.toLocaleString()}</td>
                    <td className="py-2.5 text-right text-gray-600">{formatMinutes(p.avgResponseTime)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {fastest && fastest.avgResponseTime !== null && (
            <p className="mt-3 text-xs text-indigo-600 font-medium">
              ⚡ 답장 제일 빠른 사람: {fastest.name} (평균 {formatMinutes(fastest.avgResponseTime)})
            </p>
          )}
        </div>

        {/* 차트 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <MessageCountChart participants={result.participants} />
          <ResponseTimeChart participants={result.participants} />
          <HourlyChart data={result.hourlyActivity} mostActiveHour={result.mostActiveHour} />
          <DayOfWeekChart data={result.dailyActivity} mostActiveDay={result.mostActiveDay} />
          <MonthlyChart data={result.monthlyActivity} />
          <WordCloudChart data={result.wordFrequency} />
          <EmojiChart data={result.emojiFrequency} />
        </div>
      </div>
    </main>
  );
}
