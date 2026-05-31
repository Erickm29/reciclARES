import { Users } from "lucide-react";

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
import { getCargas, getRecolectoresResumen } from "@/lib/actions/cargas";

export default async function RecolectoresPage() {
  const [resumen, cargas] = await Promise.all([
    getRecolectoresResumen(),
    getCargas(),
  ]);

  const recolectorIds = new Set(resumen.map((r) => r.recolector_id));

  return (
    <div className="fundares-page">
      <PageHeader
        title="Gestión de Recolectores"
        description="Resumen de actividad y cargas por recolector."
      />

      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        <Card className="fundares-kpi">
          <CardHeader className="flex flex-row items-center justify-between pb-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Recolectores activos
            </CardTitle>
            <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10">
              <Users className="size-[18px] text-primary" strokeWidth={2.5} />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="font-heading text-4xl text-primary">
              {recolectorIds.size}
            </p>
          </CardContent>
        </Card>
        <Card className="fundares-kpi">
          <CardContent className="pt-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total cargas registradas
            </p>
            <p className="mt-2 font-heading text-4xl text-foreground">
              {cargas.length}
            </p>
          </CardContent>
        </Card>
        <Card className="fundares-kpi">
          <CardContent className="pt-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Pendientes de validación
            </p>
            <p className="mt-2 font-heading text-4xl text-amber-600">
              {cargas.filter((c) => c.estado === "Pendiente").length}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="fundares-card mb-10 overflow-hidden">
        <CardHeader className="border-b border-border/60">
          <CardTitle className="text-lg">Resumen por recolector</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="pl-6">Recolector ID</TableHead>
                <TableHead className="text-right">Total cargas</TableHead>
                <TableHead className="text-right">Pendientes</TableHead>
                <TableHead className="text-right">Validadas</TableHead>
                <TableHead className="pr-6 text-right">Rechazadas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resumen.map((item) => (
                <TableRow key={item.recolector_id}>
                  <TableCell className="pl-6 font-mono text-xs font-medium">
                    {item.recolector_id}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {item.total_cargas}
                  </TableCell>
                  <TableCell className="text-right text-amber-600">
                    {item.pendientes}
                  </TableCell>
                  <TableCell className="text-right text-fundares-accent">
                    {item.validadas}
                  </TableCell>
                  <TableCell className="pr-6 text-right text-destructive">
                    {item.rechazadas}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="fundares-card overflow-hidden">
        <CardHeader className="border-b border-border/60">
          <CardTitle className="text-lg">Últimas cargas por recolector</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="pl-6">Recolector</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead className="text-right">Peso</TableHead>
                <TableHead className="pr-6">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cargas.slice(0, 10).map((carga) => (
                <TableRow key={carga.id}>
                  <TableCell className="pl-6 font-mono text-xs">
                    {carga.recolector_id}
                  </TableCell>
                  <TableCell>{carga.empresa}</TableCell>
                  <TableCell className="text-right font-medium">
                    {carga.peso_reportado} kg
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
