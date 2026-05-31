import { redirect } from "next/navigation";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { WeightChart } from "@/components/dashboard/weight-chart-client";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCargasForAfiliado, getCargasValidadasForAfiliado } from "@/lib/actions/cargas";
import {
  getResumenAfiliado,
  getTendenciaMensual,
  getResiduosPorTipo,
} from "@/lib/actions/afiliados";
import { calcularImpacto } from "@/lib/cliente/impacto";
import { getSession } from "@/lib/auth/session";

function formatMes(isoDate: string) {
  try {
    return format(new Date(isoDate), "MMM yyyy", { locale: es });
  } catch {
    return isoDate;
  }
}

export default async function ClienteReportesPage() {
  const session = await getSession();

  if (!session || session.role !== "cliente" || !session.afiliadoId) {
    redirect("/login");
  }

  const [todas, validadas, resumen, tendencia, residuosTipo] = await Promise.all([
    getCargasForAfiliado(session.afiliadoId),
    getCargasValidadasForAfiliado(session.afiliadoId),
    getResumenAfiliado(session.afiliadoId),
    getTendenciaMensual(session.afiliadoId),
    getResiduosPorTipo(session.afiliadoId),
  ]);

  const impacto = calcularImpacto(validadas);

  // Datos para gráfico: tendencia mensual de Supabase, o fallback a cargas recientes
  const chartData =
    tendencia.length > 0
      ? tendencia.map((t) => ({
          label: formatMes(t.mes),
          reportado: Number(t.kg_total),
          acopio: Number(t.kg_aprobado),
        }))
      : validadas
          .slice(0, 6)
          .reverse()
          .map((c) => ({
            label: format(new Date(c.fecha), "dd/MM"),
            reportado: c.peso_reportado,
            acopio: c.peso_acopio ?? 0,
          }));

  const totalResiduosTipo = residuosTipo.reduce((sum, r) => sum + Number(r.kg_total), 0);

  return (
    <div className="fundares-page">
      <PageHeader
        title="Mis reportes"
        description={`Resumen de reciclaje validado y tendencias para ${session.afiliadoNombre}.`}
      />

      {/* KPIs principales */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="fundares-kpi">
          <CardContent className="pt-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total registros
            </p>
            <p className="mt-2 font-heading text-3xl">{todas.length}</p>
          </CardContent>
        </Card>
        <Card className="fundares-kpi">
          <CardContent className="pt-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Validadas
            </p>
            <p className="mt-2 font-heading text-3xl text-fundares-accent">
              {validadas.length}
            </p>
          </CardContent>
        </Card>
        <Card className="fundares-kpi">
          <CardContent className="pt-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Kg reciclados
            </p>
            <p className="mt-2 font-heading text-3xl text-primary">
              {impacto.kgTotal.toFixed(1)}
            </p>
          </CardContent>
        </Card>
        <Card className="fundares-kpi">
          <CardContent className="pt-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              CO₂ evitado (kg)
            </p>
            <p className="mt-2 font-heading text-3xl text-emerald-600">
              {impacto.co2Evitado.toFixed(1)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de tendencia */}
      {chartData.length > 0 ? (
        <div className="mb-8">
          <WeightChart data={chartData} />
        </div>
      ) : (
        <Card className="fundares-card mb-8">
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            Aún no hay cargas validadas para generar el gráfico comparativo.
          </CardContent>
        </Card>
      )}

      {/* Tabla de residuos por tipo */}
      {residuosTipo.length > 0 && (
        <Card className="fundares-card">
          <CardHeader className="border-b border-border/60">
            <CardTitle className="text-lg">Residuos por tipo de material</CardTitle>
            <p className="text-sm text-muted-foreground">
              Distribución de kg reciclados aprobados por categoría
            </p>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              {residuosTipo.map((r) => {
                const pct =
                  totalResiduosTipo > 0
                    ? Math.round((Number(r.kg_total) / totalResiduosTipo) * 100)
                    : 0;
                return (
                  <div key={r.tipo_residuo}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-medium">{r.tipo_residuo}</span>
                      <span className="text-muted-foreground">
                        {Number(r.kg_total).toFixed(1)} kg · {pct}%
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Total aprobado: {totalResiduosTipo.toFixed(1)} kg en {residuosTipo.length} tipo
              {residuosTipo.length !== 1 ? "s" : ""} de residuos.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Estadísticas adicionales del resumen */}
      {resumen && (
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Card className="fundares-kpi">
            <CardContent className="pt-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Recintos activos
              </p>
              <p className="mt-2 font-heading text-3xl">{resumen.total_recintos}</p>
            </CardContent>
          </Card>
          <Card className="fundares-kpi">
            <CardContent className="pt-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Recolectores
              </p>
              <p className="mt-2 font-heading text-3xl">{resumen.total_recolectores}</p>
            </CardContent>
          </Card>
          <Card className="fundares-kpi">
            <CardContent className="pt-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Kg registrados (total)
              </p>
              <p className="mt-2 font-heading text-3xl">
                {Number(resumen.kg_total_registrado).toFixed(1)}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
