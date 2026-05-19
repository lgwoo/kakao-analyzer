"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { MonthlyActivity } from "@/types";

export default function MonthlyChart({ data }: { data: MonthlyActivity[] }) {
  const formatted = data.map((d) => ({
    ...d,
    label: d.month.replace("-", "년 ") + "월",
  }));

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 col-span-full">
      <h3 className="text-lg font-bold text-gray-800 mb-1">월별 대화량 추이</h3>
      <p className="text-sm text-gray-500 mb-4">친해진 시점, 소원해진 시점을 한눈에</p>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={formatted} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="colorMsg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="label" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip formatter={(v) => [`${Number(v).toLocaleString()}개`, "메시지"]} />
          <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} fill="url(#colorMsg)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
