"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WeightChartProps {
  data: Array<{
    label: string;
    reportado: number;
    acopio: number;
  }>;
}

export function WeightChart({ data }: WeightChartProps) {
  return (
    <Card className="fundares-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">
          Peso Reportado vs Peso en Acopio
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Comparación de cargas recientes (kg)
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barGap={6} barCategoryGap="24%">
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#DDE2E2"
                vertical={false}
              />
              <XAxis
                dataKey="label"
                tick={{ fill: "#6B7280", fontSize: 12 }}
                axisLine={{ stroke: "#DDE2E2" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#6B7280", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "16px",
                  border: "1px solid #DDE2E2",
                  boxShadow: "0 4px 16px rgba(44, 102, 103, 0.08)",
                  backgroundColor: "#FFFFFF",
                  color: "#1F2937",
                  fontSize: 13,
                }}
                formatter={(value) => [`${value} kg`, ""]}
                cursor={{ fill: "rgba(44, 102, 103, 0.04)" }}
              />
              <Legend
                wrapperStyle={{ fontSize: 12, paddingTop: 16 }}
                formatter={(value) =>
                  value === "reportado" ? "Peso Reportado" : "Peso en Acopio"
                }
              />
              <Bar
                dataKey="reportado"
                fill="#2C6667"
                radius={[8, 8, 0, 0]}
                name="reportado"
              />
              <Bar
                dataKey="acopio"
                fill="#67B34D"
                radius={[8, 8, 0, 0]}
                name="acopio"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
