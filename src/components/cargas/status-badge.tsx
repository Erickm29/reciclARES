import { Badge } from "@/components/ui/badge";
import type { EstadoCarga } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

const styles: Record<EstadoCarga, string> = {
  Pendiente: "border-amber-200/80 bg-amber-50 text-amber-700",
  Validado: "border-fundares-accent/30 bg-[#eef7ea] text-fundares-dark",
  Rechazado: "border-destructive/20 bg-destructive/10 text-destructive",
};

export function StatusBadge({ estado }: { estado: EstadoCarga }) {
  return (
    <Badge variant="outline" className={cn("font-semibold", styles[estado])}>
      {estado}
    </Badge>
  );
}
