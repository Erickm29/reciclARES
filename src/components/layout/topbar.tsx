"use client";

import { Menu } from "lucide-react";

import { ROLE_LABELS } from "@/lib/auth/constants";
import type { SessionUser } from "@/lib/auth/types";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Button } from "@/components/ui/button";

interface TopbarProps {
  user: SessionUser;
  onMenuClick: () => void;
}

export function Topbar({ user, onMenuClick }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-4 border-b border-border bg-card/80 px-4 backdrop-blur-md lg:px-8">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenuClick}
        aria-label="Abrir menú"
      >
        <Menu className="size-5" />
      </Button>

      <Breadcrumbs role={user.role} />

      <div className="ml-auto flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-xs font-medium text-foreground">{user.nombre}</p>
          <p className="text-[11px] text-muted-foreground">
            {ROLE_LABELS[user.role]}
          </p>
        </div>
        <div className="hidden items-center gap-2 rounded-2xl border border-border bg-background px-3 py-1.5 sm:flex">
          <span className="size-2 rounded-full bg-fundares-accent" />
          <span className="text-xs font-medium text-muted-foreground">
            Sistema activo
          </span>
        </div>
      </div>
    </header>
  );
}
