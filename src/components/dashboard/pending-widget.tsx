import { Clock3 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PendingWidgetProps {
  count: number;
}

export function PendingWidget({ count }: PendingWidgetProps) {
  return (
    <Card className="fundares-kpi border-primary/10">
      <CardHeader className="flex flex-row items-center justify-between pb-0">
        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Cargas Pendientes
        </CardTitle>
        <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10">
          <Clock3 className="size-[18px] text-primary" strokeWidth={2.5} />
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="font-heading text-4xl tracking-tight text-primary lg:text-5xl">
          {count}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Registros esperando validación
        </p>
      </CardContent>
    </Card>
  );
}
