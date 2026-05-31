import { CargasTable } from "@/components/cargas/cargas-table";
import { PendingWidget } from "@/components/dashboard/pending-widget";
import { PageHeader } from "@/components/layout/page-header";
import { getCargas, getPendingCount } from "@/lib/actions/cargas";

export default async function PendientesPage() {
  const [pendingCount, cargas] = await Promise.all([
    getPendingCount(),
    getCargas("pendientes"),
  ]);

  return (
    <div className="fundares-page">
      <PageHeader
        title="Pendientes de Validación"
        description="Cargas que requieren revisión y aprobación del validador."
      />

      <div className="mb-10 max-w-sm">
        <PendingWidget count={pendingCount} />
      </div>

      <CargasTable
        cargas={cargas}
        title="Cargas pendientes"
        showOnlyPending
      />
    </div>
  );
}
