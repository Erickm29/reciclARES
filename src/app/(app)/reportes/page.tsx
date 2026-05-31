import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Building2, CheckCircle2, Clock, Leaf, Package, XCircle } from "lucide-react";

import { WeightChart } from "@/components/dashboard/weight-chart-client";
import { StatusBadge } from "@/components/cargas/status-badge";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCargas, getWeightComparisonData } from "@/lib/actions/cargas";
import { getResumenTodosAfiliados } from "@/lib/actions/afiliados";

function formatFecha(value: string) {
  try {
    return format(new Date(value), "dd/MM/yyyy", { locale: es });
  } catch {
    return value;
  }
}

export default async function ReportesPage() {
  const [cargas, chartData, afiliados] = await Promise.all([
    getCargas(),
    getWeightComparisonData(),
    getResumenTodosAfiliados(),
  ]);

  const validadas = cargas.filter((c) => c.estado === "Validado").length;
  const rechazadas = cargas.filter((c) => c.estado === "Rechazado").length;
  const pendientes = cargas.filter((c) => c.estado === "Pendiente").length;
  const pesoTotal = cargas.reduce((sum, c) => sum + c.peso_reportado, 0);

  return (
    <div className="fundares-page">
      <PageHeader
        title="Reportes"
        description="Resumen global de validaciones, comparativa por empresa y estado de recolecciones."
      />

      {/* KPIs globales */}
      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { label: "Total cargas", value: cargas.length, accent: "text-foreground", Icon: Package },
          { label: "Validadas", value: validadas, accent: "text-emerald-600", Icon: CheckCircle2 },
          { label: "Rechazadas", value: rechazadas, accent: "text-destructive", Icon: XCircle },
          { label: "Pendientes", value: pendientes, accent: "text-amber-600", Icon: Clock },
          { label: "Kg totales", value: `${pesoTotal.toFixed(1)}`, accent: "text-primary", Icon: Leaf },
        ].map((stat) => (
          <Card key={stat.label} className="fundares-kpi">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <stat.Icon className={`size-4 ${stat.accent}`} />
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {stat.label}
                </p>
              </div>
              <p className={`mt-2 font-heading text-3xl ${stat.accent}`}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gráfico comparativo */}
      <div className="mb-10">
        <WeightChart data={chartData} />
      </div>

      {/* Tabla resumen por empresa (desde Supabase) */}
      {afiliados.length > 0 && (
        <Card className="fundares-card overflow-hidden mb-10">
          <CardHeader className="border-b border-border/60">
            <div className="flex items-center gap-2">
              <Building2 className="size-5 text-primary" />
              <CardTitle className="text-lg">Resumen por empresa</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">
              KPIs de cada empresa afiliada según datos reales de Supabase
            </p>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="pl-6">Empresa</TableHead>
                  <TableHead className="text-right">Recintos</TableHead>
                  <TableHead className="text-right">Recolectores</TableHead>
                  <TableHead className="text-right">Informes</TableHead>
                  <TableHead className="text-right">Aprobados</TableHead>
                  <TableHead className="text-right">Kg aprobados</TableHead>
                  <TableHead className="pr-6">Última recolección</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {afiliados.map((af) => (
                  <TableRow key={af.afiliado_id}>
                    <TableCell className="pl-6 font-medium">{af.empresa}</TableCell>
                    <TableCell className="text-right">{af.total_recintos}</TableCell>
                    <TableCell className="text-right">{af.total_recolectores}</TableCell>
                    <TableCell className="text-right">{af.total_informes}</TableCell>
                    <TableCell className="text-right">
                      <span className="font-medium text-emerald-600">{af.informes_aprobados}</span>
                      {" "}
                      <span className="text-xs text-muted-foreground">
                        / {af.total_informes}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-heading text-primary">
                      {Number(af.kg_total_aprobado).toFixed(1)} kg
                    </TableCell>
                    <TableCell className="pr-6 text-sm text-muted-foreground">
                      {af.ultima_recoleccion ? formatFecha(af.ultima_recoleccion) : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Tabla detalle todas las cargas */}
      <Card className="fundares-card overflow-hidden">
        <CardHeader className="border-b border-border/60">
          <CardTitle className="text-lg">Detalle de cargas</CardTitle>
          <p className="text-sm text-muted-foreground">
            {cargas.length} recoleccion{cargas.length !== 1 ? "es" : ""} en total
          </p>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="pl-6">Empresa</TableHead>
                <TableHead>Recolector</TableHead>
                <TableHead className="text-right">Reportado</TableHead>
                <TableHead className="text-right">Acopio</TableHead>
                <TableHead className="pr-6">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cargas.map((carga) => (
                <TableRow key={carga.id}>
                  <TableCell className="pl-6">{carga.empresa}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {carga.recolector_id}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {carga.peso_reportado} kg
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {carga.peso_acopio != null ? `${carga.peso_acopio} kg` : "—"}
                  </TableCell>
                  <TableCell className="pr-6">
                    <StatusBadge estado={carga.estado} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
