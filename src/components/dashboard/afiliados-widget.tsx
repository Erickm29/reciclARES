import { Building2, CheckCircle2, Leaf, TrendingUp } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ResumenAfiliado } from "@/lib/actions/afiliados";

interface AfiliadosWidgetProps {
  afiliados: ResumenAfiliado[];
}

export function AfiliadosWidget({ afiliados }: AfiliadosWidgetProps) {
  if (afiliados.length === 0) return null;

  const totalKg = afiliados.reduce((sum, a) => sum + Number(a.kg_total_aprobado), 0);

  return (
    <Card className="fundares-card overflow-hidden">
      <CardHeader className="border-b border-border/60">
        <div className="flex items-center gap-2">
          <Building2 className="size-5 text-primary" />
          <CardTitle className="text-lg">Empresas afiliadas</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">
          {afiliados.length} empresa{afiliados.length !== 1 ? "s" : ""} ·{" "}
          {totalKg.toFixed(0)} kg reciclados aprobados en total
        </p>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3">
          {afiliados.map((af) => {
            const tasaAprobacion =
              af.total_informes > 0
                ? Math.round((af.informes_aprobados / af.total_informes) * 100)
                : 0;
            const pctKg = totalKg > 0
              ? Math.round((Number(af.kg_total_aprobado) / totalKg) * 100)
              : 0;

            return (
              <div
                key={af.afiliado_id}
                className="rounded-2xl border border-border/60 bg-background p-4"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <p className="font-medium">{af.empresa}</p>
                    <p className="text-xs text-muted-foreground">{af.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-heading text-lg text-primary">
                      {Number(af.kg_total_aprobado).toFixed(1)} kg
                    </p>
                    <p className="text-[11px] text-muted-foreground">{pctKg}% del total</p>
                  </div>
                </div>

                {/* Barra de progreso de kg */}
                <div className="mb-3">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${pctKg}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-[11px] text-muted-foreground">Recintos</p>
                    <p className="font-medium">{af.total_recintos}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground">Informes</p>
                    <p className="font-medium">{af.total_informes}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground">Aprobación</p>
                    <p className="font-medium text-emerald-600">{tasaAprobacion}%</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
