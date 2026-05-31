import type { SessionUser, UserRole } from "@/lib/auth/types";

export const SESSION_COOKIE = "fundares_session";

/** Credenciales demo — reemplazar por Supabase Auth en producción */
export const DEMO_USERS: Array<
  SessionUser & { password: string }
> = [
  {
    id: "admin-1",
    email: "admin@fundares.bo",
    password: "admin123",
    nombre: "Validador FUNDARES",
    role: "administrador",
  },
  {
    id: "cliente-pil",
    email: "cliente@pil.bo",
    password: "cliente123",
    nombre: "Pil Andina",
    role: "cliente",
    afiliadoId: "29b84741-acc7-4f6e-99cb-1aa416594aca",
    afiliadoNombre: "Pil Andina",
  },
  {
    id: "cliente-sofia",
    email: "cliente@sofia.bo",
    password: "cliente123",
    nombre: "Sofía S.A.",
    role: "cliente",
    afiliadoId: "a1563e79-ec8b-4b98-85d0-30a722d5e870",
    afiliadoNombre: "Sofía",
  },
];

export const ROLE_LABELS: Record<UserRole, string> = {
  administrador: "Administrador · Fundares",
  cliente: "Empresa Cliente",
};

export const ADMIN_ROUTES = ["/", "/pendientes", "/reportes", "/recolectores"];

export const CLIENTE_ROUTES = ["/cliente", "/cliente/recolecciones", "/cliente/reportes"];
