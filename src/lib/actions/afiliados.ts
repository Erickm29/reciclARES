"use server";

import { createServerClient } from "@/lib/supabase/server";

export interface ResumenAfiliado {
  afiliado_id: string;
  empresa: string;
  email: string;
  telefono: string;
  total_recintos: number;
  total_recolectores: number;
  total_informes: number;
  informes_aprobados: number;
  informes_pendientes: number;
  informes_rechazados: number;
  kg_total_aprobado: number;
  kg_total_registrado: number;
  ultima_recoleccion: string | null;
}

export interface TendenciaMensual {
  afiliado_id: string;
  empresa: string;
  mes: string;
  total_informes: number;
  kg_total: number;
  kg_aprobado: number;
}

export interface ResiduoPorTipo {
  afiliado_id: string;
  empresa: string;
  tipo_residuo: string;
  kg_total: number;
  cantidad_informes: number;
}

/** Resumen KPI de un afiliado específico */
export async function getResumenAfiliado(
  afiliadoId: string
): Promise<ResumenAfiliado | null> {
  const supabase = createServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("resumen_afiliado")
    .select("*")
    .eq("afiliado_id", afiliadoId)
    .single();

  if (error) {
    console.error("Error fetching resumen_afiliado:", error.message);
    return null;
  }

  return data as ResumenAfiliado;
}

/** Todos los afiliados con KPIs — para el dashboard del admin */
export async function getResumenTodosAfiliados(): Promise<ResumenAfiliado[]> {
  const supabase = createServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("resumen_afiliado")
    .select("*")
    .order("kg_total_aprobado", { ascending: false });

  if (error) {
    console.error("Error fetching resumen afiliados:", error.message);
    return [];
  }

  return (data ?? []) as ResumenAfiliado[];
}

/** Tendencia mensual de los últimos 12 meses para un afiliado */
export async function getTendenciaMensual(
  afiliadoId: string
): Promise<TendenciaMensual[]> {
  const supabase = createServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("tendencia_mensual_afiliado")
    .select("*")
    .eq("afiliado_id", afiliadoId)
    .order("mes", { ascending: true });

  if (error) {
    console.error("Error fetching tendencia mensual:", error.message);
    return [];
  }

  return (data ?? []) as TendenciaMensual[];
}

/** Residuos por tipo para un afiliado */
export async function getResiduosPorTipo(
  afiliadoId: string
): Promise<ResiduoPorTipo[]> {
  const supabase = createServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("residuos_por_tipo_afiliado")
    .select("*")
    .eq("afiliado_id", afiliadoId)
    .order("kg_total", { ascending: false });

  if (error) {
    console.error("Error fetching residuos por tipo:", error.message);
    return [];
  }

  return (data ?? []) as ResiduoPorTipo[];
}
