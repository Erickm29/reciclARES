import { redirect } from "next/navigation";

import { StatusBadge } from "@/components/cargas/status-badge";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCargasForAfiliado } from "@/lib/actions/cargas";
import { getSession } from "@/lib/auth/session";
import { format } from "date-fns";
import { es } from "date-fns/locale";

function formatDate(value: string) {
  try {
    return format(new Date(value), "dd/MM/yyyy", { locale: es });
  } catch {
    return value;
  }
}

export default async function ClienteRecoleccionesPage() {
  const session = await getSession();

  if (!session || session.role !== "cliente" || !session.afiliadoId) {
    redirect("/login");
  }

  const cargas = await getCargasForAfiliado(session.afiliadoId);

  return (
    <div className="fundares-page">
      <PageHeader
        title="Recolecciones de su empresa"
        description="Detalle de las cargas registradas en sus recintos, con respaldo trazable."
      />

      <Card className="fundares-card overflow-hidden">
        <CardHeader className="border-b border-border/60">
          <CardTitle className="text-lg">Historial de recolecciones</CardTitle>
          <p className="text-sm text-muted-foreground">
            {cargas.length} registro{cargas.length !== 1 ? "s" : ""} ·{" "}
            {session.afiliadoNombre}
          </p>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          {cargas.length === 0 ? (
            <EmptyState
              message="Sin recolecciones registradas"
              description="Las cargas de su empresa aparecerán aquí cuando los recolectores las registren."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="pl-6">Fecha</TableHead>
                  <TableHead>Material</TableHead>
                  <TableHead>Recolector</TableHead>
                  <TableHead className="text-right">Peso (kg)</TableHead>
                  <TableHead className="pr-6">Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cargas.map((carga) => (
                  <TableRow key={carga.id}>
                    <TableCell className="pl-6 font-medium">
                      {formatDate(carga.fecha)}
                    </TableCell>
                    <TableCell>{carga.material ?? "—"}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {carga.recolector_id}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {carga.peso_reportado}
                    </TableCell>
                    <TableCell className="pr-6">
                      <StatusBadge estado={carga.estado} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
