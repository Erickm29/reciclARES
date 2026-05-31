export type UserRole = "administrador" | "cliente";

export interface SessionUser {
  id: string;
  email: string;
  nombre: string;
  role: UserRole;
  /** UUID del afiliado en Supabase (solo clientes) */
  afiliadoId?: string;
  /** Nombre de la empresa cliente */
  afiliadoNombre?: string;
}

export interface NavItem {
  href: string;
  label: string;
  icon: string;
}
