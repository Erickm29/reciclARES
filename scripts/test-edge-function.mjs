import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://hhurrytpyuujjvrlizzi.supabase.co";
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!key) {
  console.error("Falta la variable de entorno NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  process.exit(1);
}

// Generate a valid random UUID for report
const reportId = crypto.randomUUID();

// Payload
const payload = {
  id: reportId,
  recolectorId: "bba623e2-db75-42ce-973d-42687ec008a1", // Jorge Vargas
  gps: {
    lat: -17.8015,
    lng: -63.158,
    acc: 10
  },
  // Simple mock base64 photo
  foto: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=",
  fechaISO: new Date().toISOString(),
  residuos: [
    {
      tipo_residuo_id: "c96ea8af-a309-4e94-b064-64297087b4ba", // Plástico PET
      kg: 15.5
    }
  ]
};

async function test() {
  console.log("=== PROBANDO EDGE FUNCTION ===");
  console.log("Enviando informe con ID:", reportId);
  
  const functionUrl = `${url}/functions/v1/registrar-informe`;
  
  try {
    const res = await fetch(functionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": key,
        "Authorization": `Bearer ${key}`
      },
      body: JSON.stringify(payload)
    });
    
    console.log("Status:", res.status);
    const data = await res.json();
    console.log("Response:", JSON.stringify(data, null, 2));
    
    if (res.ok) {
      console.log("✓ Sincronización exitosa con la Edge Function");
    } else {
      console.log("⨯ Falló la sincronización");
    }
  } catch (e) {
    console.error("Error al hacer request:", e);
  }
}

test();
