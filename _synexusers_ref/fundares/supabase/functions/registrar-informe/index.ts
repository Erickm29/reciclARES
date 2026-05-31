// ============================================================
//  Backend API · "registrar-informe"  (Supabase Edge Function)
//  Recibe el informe del recolector, lo VALIDA del lado del
//  servidor (sin confiar en el cliente), sube la foto e inserta.
//  Deploy:  supabase functions deploy registrar-informe
// ============================================================
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// La service role key solo vive en el servidor: nunca la pongas en la app.
const sb = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type, apikey",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

// distancia en metros (haversine) para recalcular la geocerca en el servidor
function distancia(la1: number, lo1: number, la2: number, lo2: number) {
  const R = 6371000, t = (x: number) => x * Math.PI / 180;
  const dLa = t(la2 - la1), dLo = t(lo2 - lo1);
  const a = Math.sin(dLa / 2) ** 2 + Math.cos(t(la1)) * Math.cos(t(la2)) * Math.sin(dLo / 2) ** 2;
  return Math.round(2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function sanitizarNombre(txt: string): string {
  return txt
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9\/\-_]/g, "_")
    .replace(/__+/g, "_");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Método no permitido" }, 405);

  let b: any;
  try { b = await req.json(); } catch { return json({ error: "JSON inválido" }, 400); }

  // ---------- 1. campos obligatorios ----------
  if (!b.recolectorId) return json({ error: "Falta recolectorId" }, 400);
  if (!b.gps || typeof b.gps.lat !== "number" || typeof b.gps.lng !== "number")
    return json({ error: "Falta o es inválido el GPS" }, 400);
  if (!b.foto || typeof b.foto !== "string") return json({ error: "Falta la foto" }, 400);
  if (!Array.isArray(b.residuos) || b.residuos.length === 0)
    return json({ error: "Sin residuos" }, 400);

  // ---------- 2. el recolector debe existir y estar activo ----------
  const { data: rec, error: e1 } = await sb
    .from("recolectores")
    .select("id, activo, recinto_id, recintos ( id, nombre, lat, lng, radio_m )")
    .eq("id", b.recolectorId)
    .single();
  if (e1 || !rec) return json({ error: "Recolector no encontrado" }, 404);
  if (!rec.activo) return json({ error: "Recolector inactivo" }, 403);
  const recinto: any = rec.recintos;

  // ---------- 3. geocerca: la recalcula el servidor, no confía en el cliente ----------
  const dist = distancia(recinto.lat, recinto.lng, b.gps.lat, b.gps.lng);
  const margen = Math.min(b.gps.acc ?? 0, 80);          // tolerancia por precisión GPS
  const dentro = dist <= recinto.radio_m + margen;
  // Rechazar solo si está groseramente lejos (claramente falso):
  if (dist > 3000) return json({ error: "Ubicación fuera de rango del recinto", dist }, 422);

  // ---------- 4. validar residuos y recalcular el total ----------
  let total = 0;
  const filas: { tipo_residuo_id: string; kg: number }[] = [];
  for (const r of b.residuos) {
    const kg = Number(r.kg);
    const tipoResiduoId = String(r.tipo_residuo_id ?? "").trim();
    if (!tipoResiduoId) return json({ error: "Falta tipo_residuo_id" }, 400);
    if (!(kg > 0) || kg > 5000) return json({ error: `Peso inválido` }, 400);
    total += kg;
    filas.push({ tipo_residuo_id: tipoResiduoId, kg });
  }
  total = Math.round(total * 100) / 100;
  if (total <= 0) return json({ error: "El total debe ser mayor a 0" }, 400);

  // ---------- 5. fecha coherente (no futura) ----------
  const fecha = b.fechaISO ? new Date(b.fechaISO) : new Date();
  if (isNaN(+fecha) || fecha.getTime() > Date.now() + 5 * 60000)
    return json({ error: "Fecha inválida" }, 400);

  // ---------- 6. id idempotente (reenvíos offline no duplican) ----------
  const id = String(b.id);
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) return json({ error: "El ID del informe debe ser un UUID válido" }, 400);

  const { data: yaExiste } = await sb.from("informes").select("id").eq("id", id).maybeSingle();
  if (yaExiste) return json({ ok: true, id, duplicado: true });

  // ---------- 7. subir la foto al Storage con la service key ----------
  let fotoUrl: string | null = null;
  try {
    const b64 = b.foto.split(",").pop()!;
    const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
    const carpeta = sanitizarNombre(recinto.nombre);
    const ruta = `${carpeta}/${id}.jpg`;
    const up = await sb.storage.from("evidencias").upload(ruta, bytes, { contentType: "image/jpeg", upsert: true });
    if (up.error) throw up.error;
    fotoUrl = sb.storage.from("evidencias").getPublicUrl(ruta).data.publicUrl;
  } catch (err) {
    return json({ error: "No se pudo guardar la foto", detalle: String(err) }, 500);
  }

  // ---------- 8. insertar informe (valores recalculados, no los del cliente) ----------
  const { error: e2 } = await sb.from("informes").insert({
    id,
    recolector_id: rec.id,
    recinto_id: recinto.id,
    fecha_hora: fecha.toISOString(),
    gps_lat: b.gps.lat,
    gps_lng: b.gps.lng,
    gps_precision_m: b.gps.acc ?? null,
    distancia_m: dist,
    dentro_geocerca: dentro,
    total_kg: total,
    foto_url: fotoUrl,
    estado: "pendiente",
  });
  if (e2) return json({ error: "No se pudo guardar el informe", detalle: e2.message }, 500);

  // ---------- 9. insertar el detalle de residuos ----------
  const { error: e3 } = await sb.from("informe_residuos")
    .insert(filas.map((f) => ({ informe_id: id, ...f })));
  if (e3) return json({ error: "No se pudo guardar el detalle", detalle: e3.message }, 500);

  return json({ ok: true, id, dentro_geocerca: dentro, distancia_m: dist, total_kg: total });
});
