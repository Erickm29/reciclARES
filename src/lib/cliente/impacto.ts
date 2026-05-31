/** Factores ambientales estimados por material (kg CO₂ evitados por kg reciclado) */
export const MATERIAL_FACTORS: Record<string, { co2: number; color: string }> = {
  "Plástico PET": { co2: 1.5, color: "#2C6667" },
  Cartón: { co2: 1.1, color: "#67B34D" },
  "Cartón corrugado": { co2: 1.1, color: "#67B34D" },
  Papel: { co2: 1.3, color: "#2F5D35" },
  "Papel blanco": { co2: 1.3, color: "#2F5D35" },
  Vidrio: { co2: 0.3, color: "#0f7a45" },
  Aluminio: { co2: 9, color: "#64748b" },
  "Orgánico industrial": { co2: 0.8, color: "#94c87a" },
  "Chatarra mixta": { co2: 2, color: "#78716c" },
};

const DEFAULT_CO2 = 1;

export function calcularImpacto(cargas: Array<{ peso_reportado: number; material?: string | null }>) {
  const kgTotal = cargas.reduce((sum, c) => sum + c.peso_reportado, 0);
  const co2Evitado = cargas.reduce((sum, c) => {
    const factor = MATERIAL_FACTORS[c.material ?? ""]?.co2 ?? DEFAULT_CO2;
    return sum + c.peso_reportado * factor;
  }, 0);

  return {
    kgTotal,
    co2Evitado,
    arbolesEquivalentes: Math.round(co2Evitado / 21),
    aguaLitros: Math.round(kgTotal * 15),
    energiaKwh: Math.round(kgTotal * 1.8),
    informesValidados: cargas.filter((c) => "estado" in c && (c as { estado: string }).estado === "Validado").length,
  };
}

export function kgPorMaterial(
  cargas: Array<{ peso_reportado: number; material?: string | null }>
) {
  const map: Record<string, number> = {};
  for (const carga of cargas) {
    const key = carga.material ?? "Sin clasificar";
    map[key] = (map[key] ?? 0) + carga.peso_reportado;
  }
  return Object.entries(map).sort((a, b) => b[1] - a[1]);
}
