"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, LogOut } from "lucide-react";

import { ROLE_LABELS } from "@/lib/auth/constants";
import { getNavItemsForRole } from "@/lib/auth/navigation";
import type { SessionUser } from "@/lib/auth/types";
import { logoutAction } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  user: SessionUser;
  onNavigate?: () => void;
  className?: string;
}

function initials(nombre: string) {
  return nombre
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function Sidebar({ user, onNavigate, className }: SidebarProps) {
  const pathname = usePathname();
  const navItems = getNavItemsForRole(user.role);
  const subtitle =
    user.role === "cliente"
      ? "Portal Empresa Cliente"
      : "Validación de Datos";

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-sidebar-border bg-sidebar",
        className
      )}
    >
      <div className="flex h-[4.5rem] shrink-0 items-center gap-3 border-b border-sidebar-border px-5">
        <div className="flex size-10 items-center justify-center rounded-2xl bg-primary shadow-[var(--shadow-fundares-sm)]">
          <Leaf className="size-5 text-primary-foreground" strokeWidth={2.5} />
        </div>
        <div className="min-w-0">
          <p className="font-heading truncate text-sm leading-tight text-foreground">
            FUNDARES
          </p>
          <p className="truncate text-[11px] font-medium text-muted-foreground">
            {subtitle}
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          {user.role === "cliente" ? "Mi empresa" : "Navegación"}
        </p>
        {navItems.map((item) => {
          const isActive =
            item.href === "/" || item.href === "/cliente"
              ? pathname === item.href
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-primary text-primary-foreground shadow-[var(--shadow-fundares-sm)]"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon
                className={cn(
                  "size-[18px] shrink-0 transition-colors",
                  isActive
                    ? "text-primary-foreground"
                    : "text-muted-foreground group-hover:text-primary"
                )}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className="leading-snug">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="shrink-0 border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-background px-3 py-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-xs font-bold text-primary">
            {initials(user.nombre)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">
              {user.nombre}
            </p>
            <p className="truncate text-[11px] text-muted-foreground">
              {ROLE_LABELS[user.role]}
            </p>
          </div>
          <form action={logoutAction}>
            <Button
              type="submit"
              variant="ghost"
              size="icon-sm"
              title="Cerrar sesión"
            >
              <LogOut className="size-4" />
            </Button>
          </form>
        </div>
      </div>
    </aside>
  );
}
