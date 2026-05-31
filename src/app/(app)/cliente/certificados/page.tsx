import { Award, Leaf, TreePine, Zap, Droplets, Building2, Calendar, CheckCircle2 } from "lucide-react";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCargasValidadasForAfiliado } from "@/lib/actions/cargas";
import { getResumenAfiliado, getResiduosPorTipo } from "@/lib/actions/afiliados";
import { calcularImpacto } from "@/lib/cliente/impacto";
import { getSession } from "@/lib/auth/session";

export default async function ClienteCertificadosPage() {
  const session = await getSession();

  if (!session || session.role !== "cliente" || !session.afiliadoId) {
    redirect("/login");
  }

  const [validadas, resumen, residuosTipo] = await Promise.all([
    getCargasValidadasForAfiliado(session.afiliadoId),
    getResumenAfiliado(session.afiliadoId),
    getResiduosPorTipo(session.afiliadoId),
  ]);

  const impacto = calcularImpacto(validadas);
  const fechaActual = format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: es });
  const anioActual = new Date().getFullYear();

  return (
    <div className="fundares-page">
      <PageHeader
        title="Certificados"
        description="Constancias de reciclaje verificado por FUNDARES para tu empresa."
      />

      {/* Certificado principal */}
      <div className="mb-8">
        <Card className="fundares-card overflow-hidden border-2 border-primary/20">
          {/* Encabezado del certificado */}
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent px-8 py-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-primary shadow-md">
                  <Leaf className="size-6 text-primary-foreground" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                    FUNDARES · Bolivia
                  </p>
                  <p className="font-heading text-xl text-foreground">
                    Certificado de Gestión de Residuos
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Período</p>
                <p className="font-heading text-lg">{anioActual}</p>
              </div>
            </div>
          </div>

          <CardContent className="px-8 py-6">
            {/* Datos de la empresa */}
            <div className="mb-6 rounded-2xl border border-border/60 bg-muted/30 p-4">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Empresa certificada
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="flex items-center gap-2">
                  <Building2 className="size-4 shrink-0 text-primary" />
                  <div>
                    <p className="text-[11px] text-muted-foreground">Empresa</p>
                    <p className="font-medium">{session.afiliadoNombre}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
                  <div>
                    <p className="text-[11px] text-muted-foreground">Cargas validadas</p>
                    <p className="font-medium">{validadas.length} recolecciones</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="size-4 shrink-0 text-primary" />
                  <div>
                    <p className="text-[11px] text-muted-foreground">Generado el</p>
                    <p className="font-medium">{fechaActual}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Indicadores ambientales */}
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Indicadores de impacto ambiental
            </p>
            <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-border/60 bg-background p-4 text-center">
                <Leaf className="mx-auto mb-2 size-6 text-primary" />
                <p className="font-heading text-2xl text-primary">
                  {impacto.kgTotal.toFixed(1)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">kg reciclados</p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-background p-4 text-center">
                <TreePine className="mx-auto mb-2 size-6 text-emerald-600" />
                <p className="font-heading text-2xl text-emerald-600">
                  {impacto.co2Evitado.toFixed(1)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">kg CO₂ evitado</p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-background p-4 text-center">
                <Zap className="mx-auto mb-2 size-6 text-amber-500" />
                <p className="font-heading text-2xl text-amber-600">
                  {impacto.energiaKwh.toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">kWh energía</p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-background p-4 text-center">
                <Droplets className="mx-auto mb-2 size-6 text-blue-500" />
                <p className="font-heading text-2xl text-blue-600">
                  {impacto.aguaLitros.toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">litros de agua</p>
              </div>
            </div>

            {/* Detalle por material */}
            {residuosTipo.length > 0 && (
              <>
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Detalle por tipo de material
                </p>
                <div className="mb-6 overflow-hidden rounded-2xl border border-border/60">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/60 bg-muted/40">
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                          Material
                        </th>
                        <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                          Cantidad (kg)
                        </th>
                        <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                          Informes
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {residuosTipo.map((r, i) => (
                        <tr
                          key={r.tipo_residuo}
                          className={i < residuosTipo.length - 1 ? "border-b border-border/40" : ""}
                        >
                          <td className="px-4 py-3 font-medium">{r.tipo_residuo}</td>
                          <td className="px-4 py-3 text-right font-heading text-primary">
                            {Number(r.kg_total).toFixed(1)}
                          </td>
                          <td className="px-4 py-3 text-right text-muted-foreground">
                            {r.cantidad_informes}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* Pie del certificado */}
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-center">
              <p className="text-xs text-muted-foreground">
                Este certificado fue generado automáticamente por el sistema Synex de FUNDARES
                basado en los registros validados al{" "}
                <span className="font-medium text-foreground">{fechaActual}</span>.
                Los datos reflejan únicamente las cargas con estado &quot;aprobado&quot; en la
                plataforma.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Card informativa sobre exportación */}
      <Card className="fundares-card border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-10 text-center">
          <Award className="mb-4 size-10 text-muted-foreground/50" />
          <p className="font-heading text-sm text-foreground">Exportación PDF</p>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            La descarga en PDF con firma digital y sello FUNDARES estará disponible próximamente.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
