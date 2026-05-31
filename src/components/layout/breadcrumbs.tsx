"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

import type { UserRole } from "@/lib/auth/types";

const adminLabels: Record<string, string> = {
  "/": "Dashboard",
  "/pendientes": "Pendientes de Validación",
  "/reportes": "Reportes",
  "/recolectores": "Gestión de Recolectores",
};

const clienteLabels: Record<string, string> = {
  "/cliente": "Impacto Ambiental",
  "/cliente/recolecciones": "Recolecciones",
  "/cliente/reportes": "Mis Reportes",
  "/cliente/certificados": "Certificados",
};

interface BreadcrumbsProps {
  role: UserRole;
}

export function Breadcrumbs({ role }: BreadcrumbsProps) {
  const pathname = usePathname();
  const labels = role === "cliente" ? clienteLabels : adminLabels;
  const homeHref = role === "cliente" ? "/cliente" : "/";
  const homeLabel = role === "cliente" ? "Impacto" : "Dashboard";
  const isHome = pathname === homeHref;
  const currentLabel = labels[pathname] ?? "Dashboard";

  return (
    <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5">
      <Link
        href={homeHref}
        className="flex shrink-0 items-center text-muted-foreground transition-colors hover:text-primary"
      >
        <Home className="size-3.5" />
      </Link>
      {!isHome && (
        <>
          <ChevronRight className="size-3.5 shrink-0 text-border" />
          <span className="truncate text-sm font-medium text-foreground">
            {currentLabel}
          </span>
        </>
      )}
      {isHome && (
        <span className="ml-1 truncate text-sm font-medium text-foreground">
          {homeLabel}
        </span>
      )}
    </nav>
  );
}
