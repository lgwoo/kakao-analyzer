"use client";

import { WordFrequency } from "@/types";

const COLORS = [
  "#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981",
  "#3b82f6", "#ef4444", "#14b8a6", "#f97316", "#06b6d4",
];

export default function WordCloudChart({ data }: { data: WordFrequency[] }) {
  const top = data.slice(0, 60);
  const max = top[0]?.value ?? 1;
  const min = top[top.length - 1]?.value ?? 1;

  function fontSize(value: number) {
    const normalized = (value - min) / Math.max(max - min, 1);
    return Math.round(12 + normalized * 32);
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 col-span-full">
      <h3 className="text-lg font-bold text-gray-800 mb-1">자주 쓰는 단어</h3>
      <p className="text-sm text-gray-500 mb-4">크기가 클수록 많이 사용한 단어예요</p>
      <div className="flex flex-wrap gap-2 justify-center items-center min-h-[160px] p-4 bg-gray-50 rounded-xl">
        {top.map(({ text, value }, i) => (
          <span
            key={text}
            style={{
              fontSize: `${fontSize(value)}px`,
              color: COLORS[i % COLORS.length],
              lineHeight: 1.3,
              fontWeight: fontSize(value) > 28 ? 700 : 500,
            }}
            title={`${text}: ${value}회`}
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
