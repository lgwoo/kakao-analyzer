"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { ParticipantStats } from "@/types";

const COLORS = ["#6366f1", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6"];

function formatMinutes(min: number): string {
  if (min < 60) return `${min}분`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m > 0 ? `${h}시간 ${m}분` : `${h}시간`;
}

export default function ResponseTimeChart({ participants }: { participants: ParticipantStats[] }) {
  const data = participants
    .filter((p) => p.avgResponseTime !== null)
    .map((p) => ({ name: p.name, minutes: p.avgResponseTime! }))
    .sort((a, b) => a.minutes - b.minutes);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-1">평균 답장 속도</h3>
      <p className="text-sm text-gray-500 mb-4">누가 답장을 빨리 할까?</p>
      {data.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-8">데이터가 부족합니다</p>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data} layout="vertical" margin={{ top: 0, right: 40, left: 10, bottom: 0 }}>
              <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}분`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 13 }} width={70} />
              <Tooltip formatter={(v) => [formatMinutes(Number(v)), "평균 답장 시간"]} />
              <Bar dataKey="minutes" radius={[0, 4, 4, 0]}>
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-400 mt-3">* 24시간 이상 지난 답장은 제외</p>
        </>
      )}
    </div>
  );
}
