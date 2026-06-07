"use client";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

type Props = {
  total: number;
  reviewed: number;
};

export default function ReviewProgressChart({
  total,
  reviewed,
}: Props) {
  const data = [
    {
      name: "Revisadas",
      value: reviewed,
    },
    {
      name: "Pendentes",
      value: total - reviewed,
    },
  ];

  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm">
      <h2 className="mb-6 text-2xl font-semibold text-slate-800">
        Progresso das Revisões
      </h2>

      <div className="h-80 min-w-0">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >
              <Cell fill="#22c55e" />

              <Cell fill="#f59e0b" />
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}