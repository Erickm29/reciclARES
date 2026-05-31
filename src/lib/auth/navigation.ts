import {
  Award,
  BarChart3,
  ClipboardCheck,
  LayoutDashboard,
  Leaf,
  Package,
  Users,
} from "lucide-react";

import type { UserRole } from "@/lib/auth/types";

export const adminNavItems = [
  { href: "/", label: "Inicio", icon: LayoutDashboard },
  {
    href: "/pendientes",
    label: "Pendientes de Validación",
    icon: ClipboardCheck,
  },
  { href: "/reportes", label: "Reportes", icon: BarChart3 },
  { href: "/recolectores", label: "Gestión de Recolectores", icon: Users },
] as const;

export const clienteNavItems = [
  { href: "/cliente", label: "Impacto Ambiental", icon: Leaf },
  { href: "/cliente/recolecciones", label: "Recolecciones", icon: Package },
  { href: "/cliente/reportes", label: "Mis Reportes", icon: BarChart3 },
  { href: "/cliente/certificados", label: "Certificados", icon: Award },
] as const;

export function getNavItemsForRole(role: UserRole) {
  return role === "cliente" ? clienteNavItems : adminNavItems;
}

export type NavItemConfig =
  | (typeof adminNavItems)[number]
  | (typeof clienteNavItems)[number];
