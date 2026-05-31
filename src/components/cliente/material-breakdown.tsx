import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MATERIAL_FACTORS } from "@/lib/cliente/impacto";

interface MaterialBreakdownProps {
  items: Array<[string, number]>;
}

export function MaterialBreakdown({ items }: MaterialBreakdownProps) {
  const max = Math.max(1, ...items.map(([, kg]) => kg));

  if (items.length === 0) {
    return (
      <Card className="fundares-card">
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          Aún no hay materiales registrados para su empresa.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="fundares-card">
      <CardHeader>
        <CardTitle className="text-lg">Materiales reciclados</CardTitle>
        <p className="text-sm text-muted-foreground">
          Desglose por tipo de residuo en sus recolecciones validadas
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map(([material, kg]) => {
          const color = MATERIAL_FACTORS[material]?.color ?? "#2C6667";
          const pct = Math.round((kg / max) * 100);

          return (
            <div
              key={material}
              className="grid grid-cols-[minmax(0,1fr)_1fr_auto] items-center gap-4 text-sm"
            >
              <span className="font-medium text-foreground">{material}</span>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, backgroundColor: color }}
                />
              </div>
              <span className="font-heading text-sm text-foreground">
                {kg.toFixed(1)} kg
              </span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
