"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ParticipantStats } from "@/types";

const COLORS = ["#6366f1", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6"];

export default function MessageCountChart({ participants }: { participants: ParticipantStats[] }) {
  const data = participants.map((p) => ({ name: p.name, value: p.messageCount }));

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-1">참여자별 메시지 수</h3>
      <p className="text-sm text-gray-500 mb-4">누가 제일 말이 많을까?</p>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`} labelLine={false}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(v) => [`${Number(v).toLocaleString()}개`, "메시지"]} />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-2 space-y-2">
        {participants.map((p, i) => (
          <div key={p.name} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
              <span className="text-gray-700">{p.name}</span>
            </div>
            <span className="font-semibold text-gray-800">{p.messageCount.toLocaleString()}개</span>
          </div>
        ))}
      </div>
    </div>
  );
}
