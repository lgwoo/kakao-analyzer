"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { HourlyActivity } from "@/types";

export default function HourlyChart({ data, mostActiveHour }: { data: HourlyActivity[]; mostActiveHour: number }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-1">시간대별 대화량</h3>
      <p className="text-sm text-gray-500 mb-4">
        가장 활발한 시간: <span className="font-semibold text-indigo-600">{mostActiveHour}시</span>
      </p>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <XAxis
            dataKey="hour"
            tick={{ fontSize: 11 }}
            tickFormatter={(h) => (h % 6 === 0 ? `${h}시` : "")}
          />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip formatter={(v) => [`${Number(v).toLocaleString()}개`, "메시지"]} labelFormatter={(l) => `${l}시`} />
          <Bar dataKey="count" radius={[3, 3, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.hour === mostActiveHour ? "#6366f1" : "#c7d2fe"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
