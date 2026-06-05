"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

type Props = {
  data: {
    domain_name: string;
    total: number;
  }[];
};

export default function AlertsChart({
  data,
}: Props) {
  const colors: Record<string, string> = {
    saude: "#ef4444",
    educacao: "#3b82f6",
    assistencia_social: "#22c55e",
  };

  const labels: Record<string, string> = {
    saude: "Saúde",
    educacao: "Educação",
    assistencia_social:
      "Assistência Social",
  };

  const chartData = data.map((item) => ({
    name:
      labels[item.domain_name] ??
      item.domain_name,
    total: item.total,
    color:
      colors[item.domain_name] ??
      "#1bb5d9",
  }));

  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm">
      <h2 className="mb-6 text-2xl font-semibold text-slate-800">
        Alertas por Área
      </h2>

      <div className="h-80">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <BarChart data={chartData}>
            <XAxis dataKey="name" />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="total"
              radius={[8, 8, 0, 0]}
            >
              {chartData.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={entry.color}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}