"use client";

import { EmojiFrequency } from "@/types";

export default function EmojiChart({ data }: { data: EmojiFrequency[] }) {
  const max = data[0]?.count ?? 1;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-1">자주 쓰는 이모지 TOP 10</h3>
      <p className="text-sm text-gray-500 mb-4">어떤 감정을 자주 표현했을까?</p>
      {data.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-8">이모지 데이터가 없습니다</p>
      ) : (
        <div className="space-y-3">
          {data.slice(0, 10).map(({ emoji, count }) => (
            <div key={emoji} className="flex items-center gap-3">
              <span className="text-2xl w-8 text-center">{emoji}</span>
              <div className="flex-1">
                <div className="h-5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full transition-all"
                    style={{ width: `${(count / max) * 100}%` }}
                  />
                </div>
              </div>
              <span className="text-sm font-semibold text-gray-600 w-12 text-right">{count}회</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
