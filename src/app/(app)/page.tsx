import { CargasTable } from "@/components/cargas/cargas-table";
import { AfiliadosWidget } from "@/components/dashboard/afiliados-widget";
import { PendingWidget } from "@/components/dashboard/pending-widget";
import { WeightChart } from "@/components/dashboard/weight-chart-client";
import { PageHeader } from "@/components/layout/page-header";
import { getResumenTodosAfiliados } from "@/lib/actions/afiliados";
import {
  getCargas,
  getPendingCount,
  getWeightComparisonData,
} from "@/lib/actions/cargas";
import { createServerClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const [pendingCount, cargas, chartData, afiliados] = await Promise.all([
    getPendingCount(),
    getCargas(),
    getWeightComparisonData(),
    getResumenTodosAfiliados(),
  ]);

  const usingMock = !createServerClient();

  return (
    <div className="fundares-page">
      <PageHeader
        title="Dashboard de Validación"
        description="Revise y valide las cargas de recolección registradas por los recolectores."
      />

      {usingMock && (
        <div className="mb-8 rounded-2xl border border-amber-200/80 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Modo demostración: configure{" "}
          <code className="rounded-lg bg-amber-100/80 px-1.5 py-0.5 font-mono text-xs">
            .env.local
          </code>{" "}
          con sus credenciales de Supabase para conectar datos reales.
        </div>
      )}

      <div className="mb-10 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6">
          <PendingWidget count={pendingCount} />
          <AfiliadosWidget afiliados={afiliados} />
        </div>
        <div className="lg:col-span-2">
          <WeightChart data={chartData} />
        </div>
      </div>

      <CargasTable cargas={cargas} />
    </div>
  );
}
