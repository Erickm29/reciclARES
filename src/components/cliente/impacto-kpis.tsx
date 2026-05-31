import { Cloud, Droplets, Leaf, TreePine, Zap } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

interface ImpactoKpisProps {
  kgTotal: number;
  co2Evitado: number;
  arbolesEquivalentes: number;
  aguaLitros: number;
  energiaKwh: number;
}

function KpiCard({
  label,
  value,
  unit,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  unit?: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}) {
  return (
    <Card className="fundares-kpi">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <Icon className="size-[18px] text-fundares-accent" strokeWidth={2.5} />
        </div>
        <p className="mt-3 font-heading text-3xl text-foreground">
          {value}
          {unit && (
            <span className="ml-1 text-base font-sans font-medium text-muted-foreground">
              {unit}
            </span>
          )}
        </p>
      </CardContent>
    </Card>
  );
}

export function ImpactoKpis({
  kgTotal,
  co2Evitado,
  arbolesEquivalentes,
  aguaLitros,
  energiaKwh,
}: ImpactoKpisProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KpiCard
        label="CO₂ evitado"
        value={co2Evitado.toFixed(0)}
        unit="kg"
        icon={Cloud}
      />
      <KpiCard
        label="Árboles equivalentes"
        value={arbolesEquivalentes}
        icon={TreePine}
      />
      <KpiCard label="Agua ahorrada" value={aguaLitros.toLocaleString("es-BO")} unit="L" icon={Droplets} />
      <KpiCard label="Energía ahorrada" value={energiaKwh.toLocaleString("es-BO")} unit="kWh" icon={Zap} />
    </div>
  );
}

export function ImpactoHero({ kgTotal, empresa }: { kgTotal: number; empresa: string }) {
  return (
    <Card className="fundares-card border-primary/15 bg-accent/30">
      <CardContent className="py-8">
        <div className="flex items-start gap-4">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10">
            <Leaf className="size-6 text-primary" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-fundares-dark">
              Total reciclado · {empresa}
            </p>
            <p className="mt-2 font-heading text-5xl text-primary lg:text-6xl">
              {kgTotal.toFixed(1)}
              <span className="ml-2 text-2xl text-muted-foreground">kg</span>
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Acumulado de cargas validadas en el período registrado.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
