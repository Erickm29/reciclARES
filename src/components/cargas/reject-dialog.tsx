"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { updateCargaEstado } from "@/lib/actions/cargas";

interface RejectDialogProps {
  cargaId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function RejectDialog({
  cargaId,
  open,
  onOpenChange,
  onSuccess,
}: RejectDialogProps) {
  const [notas, setNotas] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleReject() {
    if (!cargaId) return;

    startTransition(async () => {
      const result = await updateCargaEstado(
        cargaId,
        "Rechazado",
        notas.trim() || "Rechazado por el validador"
      );

      if (result.success) {
        toast.success("Carga rechazada correctamente");
        setNotas("");
        onOpenChange(false);
        onSuccess?.();
      } else {
        toast.error(result.error ?? "Error al rechazar la carga");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rechazar carga</DialogTitle>
          <DialogDescription>
            Indique el motivo del rechazo. Esta acción quedará registrada en el
            historial de auditoría.
          </DialogDescription>
        </DialogHeader>
        <textarea
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          placeholder="Motivo del rechazo (opcional)..."
          rows={4}
          className="fundares-input resize-none"
        />
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleReject}
            disabled={isPending}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {isPending ? "Rechazando..." : "Confirmar rechazo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
