"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const WeightChartInner = dynamic(
  () =>
    import("@/components/dashboard/weight-chart").then((mod) => mod.WeightChart),
  {
    ssr: false,
    loading: () => (
      <div className="fundares-card flex h-80 flex-col items-center justify-center gap-3">
        <Loader2 className="size-6 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Cargando gráfico...</p>
      </div>
    ),
  }
);

interface WeightChartProps {
  data: Array<{
    label: string;
    reportado: number;
    acopio: number;
  }>;
}

export function WeightChart(props: WeightChartProps) {
  return <WeightChartInner {...props} />;
}
