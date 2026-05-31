# Proyecto Fundares · GreenImpact

Plataforma de trazabilidad de reciclaje. Los recolectores registran en campo lo que
recolectan (materiales + kg, foto y GPS), todo se guarda en Supabase como centro de
datos, y el dashboard principal le muestra al cliente su impacto ambiental y sus recolecciones.

## Arquitectura (cómo se conecta todo)

```
App recolector (PWA)  --POST-->  Edge Function "registrar-informe"  --insert-->  Supabase  <--lee--  Dashboard principal
```

- La app NO escribe directo a la base: manda el informe a la Edge Function, que lo
  **valida** (recolector activo, geocerca, pesos), sube la foto al Storage e inserta.
- El **enlace** entre la app y el dashboard es el campo `recolector_id`: el recolector
  inicia sesión con su ID (ej. `R-001`), ese ID viaja en cada informe y apunta a la
  tabla `recolectores` (y de ahí a su recinto y afiliado).
- El dashboard lee `informes` + `informe_residuos` y agrupa por recolector y por material.

## Estructura

```
fundares/
├── app-recolector/      PWA del recolector (HTML/JS puro, offline-first)
│   ├── index.html        login + formulario (materiales, foto, GPS, cola offline)
│   ├── manifest.webmanifest, sw.js, icon-*.png
├── supabase/
│   ├── schema.sql        tablas: afiliados, recintos, recolectores, informes,
│   │                     informe_residuos, tipos_residuo + vistas de reporte + triggers
│   └── functions/registrar-informe/index.ts   Edge Function (recibe y valida informes)
└── docs/
    └── guia-equipo.md    reparto de tareas y prompts del equipo
```

## Stack

- App recolector: HTML/CSS/JS puro, PWA instalable, cola offline en localStorage.
- Dashboard principal: Next.js + React + TailwindCSS + Supabase.
- Backend/datos: Supabase (Postgres + Storage + Edge Functions en Deno/TypeScript).

## Estado actual

- App recolector: funcional con DATOS DEMO. El `pushOne()` está listo para apuntar a
  la Edge Function; faltan las claves reales.
- Supabase: el `schema.sql` está listo para correr. La Edge Function está lista para
  desplegar. Falta crear el proyecto y conectar las dos apps.

## Cómo correr cada parte

- PWA: servir con `npx http-server -p 8085` desde `app-recolector/` y abrir en
  `localhost` (la cámara y el GPS solo funcionan en localhost o https).
- Dashboard principal: ejecutar `npm run dev` en el directorio raíz.
- Supabase: pegar `supabase/schema.sql` in el SQL Editor; desplegar la función con
  `supabase functions deploy registrar-informe`.

## Tareas pendientes (prioridad)

1. Crear el proyecto Supabase y correr `schema.sql`; crear el bucket `evidencias`.
2. Poner Project URL + anon key en el `pushOne()` de la app.
3. En el dashboard principal, asegurar que lea de Supabase (informes con sus `informe_residuos`, y `recolectores`).
4. Auth real: Supabase Auth + tabla `profiles` (role, recinto) y políticas RLS para que
   el cliente solo vea su recinto.
5. Opcional: suscripción Realtime en el dashboard para que los informes aparezcan en vivo.

## Convenciones

- Idioma del proyecto y de la UI: español.
- Un informe tiene MUCHOS materiales (filas en `informe_residuos`), no uno solo.
- Los residuos "excepcionales" (fuera del catálogo) se guardan con `excepcional = true`.
- No usar `sudo` para instalar nada. No exponer la service role key en el frontend
  (solo vive en la Edge Function).
