"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { DailyActivity } from "@/types";

export default function DayOfWeekChart({ data, mostActiveDay }: { data: DailyActivity[]; mostActiveDay: string }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-1">요일별 대화량</h3>
      <p className="text-sm text-gray-500 mb-4">
        가장 활발한 요일: <span className="font-semibold text-indigo-600">{mostActiveDay}요일</span>
      </p>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <XAxis dataKey="day" tick={{ fontSize: 13 }} tickFormatter={(d) => `${d}요일`} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip formatter={(v) => [`${Number(v).toLocaleString()}개`, "메시지"]} labelFormatter={(l) => `${l}요일`} />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.day === mostActiveDay ? "#f59e0b" : "#fde68a"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
