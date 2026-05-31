# Guía de equipo · Hackatón Fundares

Sistema de recolección verificada de residuos. La app del recolector captura el
informe en campo (foto + GPS + pesos), todo viaja a una base central en Supabase,
y desde ahí se genera el dashboard de Fundares y los reportes que reciben los afiliados.

---

## 0. Quién hace qué

| Integrante | Módulo | Entrega |
|---|---|---|
| **1** | **Base de datos** (Supabase) | Tablas, storage de fotos, vistas de reporte, seguridad, API |
| **2** | **Empresa cliente · App recolector** (PWA) | App de campo conectada a Supabase real (ya tienen el código base) |
| **3** | **Empresa cliente · Portal afiliado** (web) | El afiliado carga su manifiesto y ve/descarga sus reportes |
| **4** | **Módulo Fundares** (central) | Dashboard, mapa de trazabilidad, exportación a Excel |
| Transversal | **Automatización (Make.com)** | Envío automático de reportes semanales/mensuales a afiliados |

> La app del recolector ya está construida. El integrante 2 la integra con Supabase
> y la pule; no parte de cero.

---

## 1. Setup común (TODOS, primeros 30–40 min)

Hagan esto antes de repartirse. Es lo que evita que choquen después.

### 1.1 Cuentas
- GitHub, Supabase, Make.com, ChatGPT, Claude (Claude Code si lo tienen), Cursor, Antigravity.

### 1.2 Repositorio único (monorepo)
El integrante 1 crea **un** repo en GitHub: `fundares-hackaton`, con esta estructura:

```
fundares-hackaton/
├── db/                 → schema.sql y migraciones
├── app-recolector/     → la PWA (integrante 2)
├── portal-afiliado/    → web del afiliado (integrante 3)
└── dashboard-fundares/ → central (integrante 4)
```

Cada integrante trabaja en **su propia rama** (`git checkout -b app-recolector`, etc.)
y hace merge a `main` cuando su parte funciona. Así no se pisan.

### 1.3 Proyecto Supabase (lo hace el integrante 1, pero todos lo usan)
1. Crear proyecto en supabase.com (región más cercana).
2. SQL Editor → pegar `schema.sql` → Run. Quedan tablas + datos demo.
3. Storage → New bucket → `evidencias` → **público** (para la demo).
4. Anotar y compartir con el equipo: **Project URL** y **anon key**
   (Project Settings → API). Esas dos cosas las usan los integrantes 2, 3 y 4.

### 1.4 Conectar los MCP en Cursor y Antigravity
Los MCP dejan que la IA hable directo con tu base y tu repo. Requiere **Node 22+**.

**Supabase MCP** — generá un *Personal Access Token* en
`supabase.com/dashboard/account/tokens`. En Cursor creá el archivo
`.cursor/mcp.json` en la raíz del proyecto:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server-supabase@latest",
               "--access-token", "TU_PERSONAL_ACCESS_TOKEN"]
    }
  }
}
```

Verificá en Cursor: Settings → Cursor Settings → Tools & MCP (puede pedir reiniciar).
Probá pidiéndole: *"¿Qué tablas hay en la base? Usá las herramientas MCP."*
En **Antigravity** se agrega igual desde su panel de configuración de MCP (mismo bloque).

> Seguridad: dejen activada la confirmación manual de cada acción del MCP, y úsenlo
> contra el proyecto de desarrollo, no contra uno de producción.

**GitHub MCP** — en Cursor/Antigravity: Settings → Tools & MCP → Add, buscá *GitHub*
y autenticá con tu cuenta. Sirve para que la IA cree ramas, lea el repo y abra PRs.
(Si les complica, usen git normal; el de Supabase es el importante.)

### 1.5 Stack acordado (para que todo encaje)
- Frontend (portal afiliado y dashboard): **React + Vite + Tailwind**.
- Datos: **@supabase/supabase-js**.
- Gráficos: **Recharts**. Mapas: **Leaflet + OpenStreetMap** (gratis). Excel: **SheetJS (xlsx)**.
- App recolector: HTML/JS puro (ya está hecha así).
- Deploy: **Vercel** o **Netlify** (dan https, necesario para PWA, cámara y GPS).

---

## 2. Integrante 1 · Base de datos (Supabase)

### Pasos
1. Hacés el setup de §1.3 (proyecto + schema + bucket + claves).
2. Verificás que las vistas `reporte_diario`, `reporte_semanal`, `reporte_mensual`
   y `reporte_por_tipo` devuelvan datos (insertá 1–2 informes de prueba).
3. Creás la política de Storage para que la `anon key` pueda subir fotos al bucket
   `evidencias` (Storage → Policies → plantilla "allow all" para la demo).
4. Documentás en el README del repo: URL del proyecto, anon key y nombres de tablas.
5. Quedás de soporte: cuando los demás necesiten un campo o una vista nueva, la creás.

### Prompt para Cursor / Antigravity (con MCP de Supabase activo)
```
Sos mi asistente de base de datos. Tenés el MCP de Supabase conectado.
Contexto: app de recolección de residuos. Tablas: afiliados, recintos,
recolectores, tipos_residuo, informes, informe_residuos. Hay vistas
reporte_diario/semanal/mensual/por_tipo.

Tareas:
1. Verificá con las herramientas MCP que todas las tablas y vistas existen.
2. Insertá 3 informes de prueba para el recolector R-001 en distintos días,
   cada uno con 3 renglones en informe_residuos, para que las vistas tengan datos.
3. Mostrame el resultado de reporte_semanal y reporte_por_tipo.
4. Creá una vista nueva "reporte_recolector" que dé, por recolector y por día:
   cantidad de informes, kg_total y % de informes dentro de la geocerca.
Mostrame cada SQL antes de ejecutarlo y pedí confirmación.
```

---

## 3. Integrante 2 · App recolector (PWA)

### Pasos
1. Copiás la carpeta de la app (la que ya tienen) a `app-recolector/`.
2. Reemplazás la función `pushOne()` por la versión real con Supabase (subir foto +
   insertar informe + insertar residuos) usando la URL y anon key del integrante 1.
3. Reemplazás los datos demo (`RECOLECTORES`, `MANIFIESTO`) por una carga real desde
   Supabase al iniciar sesión (tabla `recolectores` y `tipos_residuo`).
4. Probás en `localhost` (cámara y GPS solo andan en localhost o https).
5. Desplegás en Netlify/Vercel y probás "Instalar app" en un celular real.

### Prompt para Cursor / Antigravity / Claude Code
```
Tengo una PWA en HTML/JS puro (index.html, manifest.webmanifest, sw.js) para que
recolectores registren un informe con foto comprimida, GPS con geocerca y cola
offline. Hoy los datos son demo y pushOne() simula el envío.

Quiero conectarla a Supabase (proyecto real, ya tengo URL y anon key):
1. Agregá el cliente supabase-js por CDN.
2. Al iniciar sesión con el ID, en vez del objeto RECOLECTORES, buscá el recolector
   en la tabla "recolectores" (join con recintos para nombre/lat/lng/radio) y el
   manifiesto desde "tipos_residuo".
3. Reescribí pushOne(rep) para que: suba rep.foto al bucket "evidencias" en la ruta
   recinto/id.jpg, guarde el publicUrl, inserte en "informes" (campos: id,
   recolector_id, fecha_hora, gps_lat, gps_lng, gps_precision_m, distancia_m,
   dentro_geocerca, total_kg, foto_url, estado='enviado') y los renglones en
   "informe_residuos" (informe_id, tipo, kg).
4. Mantené intactas la cola offline y la sincronización automática al volver la red.
Respetá el diseño actual. Mostrame solo los bloques que cambian.
```

---

## 4. Integrante 3 · Portal del afiliado (empresa cliente)

Web donde cada empresa cliente entra, **carga/edita el manifiesto** de residuos que
sus recolectores van a verificar, y **ve y descarga sus propios reportes**.

### Pasos
1. `npm create vite@latest portal-afiliado -- --template react`, instalar Tailwind,
   supabase-js, recharts y xlsx.
2. Pantalla de selección de afiliado (demo: dropdown con los 3 afiliados).
3. Sección "Mis recintos" y "Manifiesto": lista editable de tipos_residuo con kg
   esperados (esto alimenta lo que el recolector verifica).
4. Sección "Mis reportes": tabla de informes filtrada por sus recintos, con totales
   por día/semana/mes (leyendo las vistas) y un gráfico por tipo de residuo.
5. Botón "Descargar Excel" de los informes filtrados.

### Prompt para Cursor / Antigravity (con MCP de Supabase)
```
Creá un portal web en React + Vite + Tailwind para la "empresa cliente" (afiliado)
de un sistema de reciclaje. Usa supabase-js con mi URL y anon key.

Tablas: afiliados, recintos (afiliado_id, nombre, lat, lng), recolectores,
informes (recinto_id, fecha_hora, total_kg, foto_url, dentro_geocerca, estado),
informe_residuos (informe_id, tipo, kg). Vistas: reporte_diario/semanal/mensual,
reporte_por_tipo.

Pantallas:
1. Selector de afiliado (dropdown desde la tabla afiliados).
2. "Manifiesto": tabla editable de tipos_residuo (nombre, detalle, kg esperado) con
   guardar en Supabase.
3. "Reportes": filtro por recinto y por rango (día/semana/mes) leyendo las vistas;
   tabla de informes + tarjetas con kg_total y cantidad; gráfico de barras por tipo
   con recharts; al hacer clic en un informe, mostrar la foto (foto_url) en un modal.
4. Botón "Descargar Excel" que exporte los informes filtrados con SheetJS.
Diseño limpio, mobile-first, en español. Generá el proyecto completo.
```

---

## 5. Integrante 4 · Dashboard Fundares (central)

La vista interna de Fundares: ve **todos** los informes, el **mapa de trazabilidad**
y exporta los Excel que se devuelven a los afiliados.

### Pasos
1. `npm create vite@latest dashboard-fundares -- --template react` + Tailwind +
   supabase-js + recharts + leaflet + xlsx.
2. Panel general: total de kg, informes de hoy, % dentro de geocerca, pendientes.
3. Mapa Leaflet con un marcador por informe (gps_lat/lng) y el círculo de geocerca
   de cada recinto; color del marcador según dentro/fuera del radio.
4. Tabla global de informes con filtros (afiliado, recinto, fecha) y vista de la foto.
5. Exportación a Excel por día/semana/mes (varias hojas: resumen + detalle).

### Prompt para Cursor / Antigravity (con MCP de Supabase)
```
Creá un dashboard central en React + Vite + Tailwind para "Fundares", organizador
de reciclaje. supabase-js con mi URL y anon key.

Datos: tablas informes (id, recolector_id, recinto_id, fecha_hora, gps_lat, gps_lng,
dentro_geocerca, total_kg, foto_url, estado), recintos (nombre, lat, lng, radio_m),
afiliados, informe_residuos (tipo, kg). Vistas reporte_diario/semanal/mensual/por_tipo.

Construí:
1. KPIs arriba: kg_total acumulado, informes de hoy, % dentro de geocerca, pendientes.
2. Mapa con Leaflet + OpenStreetMap: un marcador por informe (verde si
   dentro_geocerca, rojo si no) y un círculo por recinto con su radio_m. Popup con
   recolector, kg y la foto.
3. Tabla de todos los informes con filtros por afiliado, recinto y rango de fechas.
4. Gráfico de evolución de kg por semana (recharts) y torta por tipo de residuo.
5. Botón "Exportar Excel" con SheetJS: una hoja "Resumen" (por recinto y periodo) y
   una hoja "Detalle" (cada informe con sus residuos). Selector día/semana/mes.
Diseño profesional, en español. Generá el proyecto completo y dejá comentado dónde
van mis credenciales.
```

---

## 6. Automatización con Make.com (transversal)

Esto resuelve el dolor original de Fundares: dejar de pasar cosas a mano. En vez de
que alguien arme y mande el reporte, Make lo hace solo.

### Qué automatizar (elijan 1 para la demo)
- **Reporte semanal por email**: cada lunes, leer la vista `reporte_semanal` de
  Supabase y enviar a cada afiliado su resumen (módulos: Schedule → Supabase/HTTP →
  Email o Google Sheets).
- **Alerta fuera de geocerca**: cuando entra un informe con `dentro_geocerca = false`,
  avisar a Fundares por email o WhatsApp.
- **Excel a Google Drive**: generar y subir el Excel mensual a una carpeta compartida.

### Pasos
1. En Make.com: nuevo escenario.
2. Trigger: "Schedule" (cron) o un webhook que dispare desde Supabase.
3. Módulo HTTP / Supabase para leer la vista (GET a la API REST de Supabase con la
   anon key).
4. Módulo de salida: Email, Gmail, Google Sheets o WhatsApp (vía Twilio/360dialog).

### Prompt para ChatGPT / Claude (diseñar el escenario)
```
Quiero un escenario en Make.com que cada lunes a las 8am lea la vista
"reporte_semanal" de mi proyecto Supabase (te paso la URL REST y la anon key como
header apikey) y envíe a cada afiliado un email con su resumen de kg reciclados de la
semana. Decime paso a paso qué módulos agregar, cómo configurar el HTTP request a la
API REST de Supabase (endpoint, headers, filtro por recinto), cómo recorrer los
resultados con un iterator y cómo armar el cuerpo del email. Dame también el filtro
de fecha para "la semana pasada".
```

---

## 7. Otras apps recomendadas

- **Vercel / Netlify** — desplegar los frontends y la PWA con https (gratis). Sin
  https no funcionan cámara, GPS ni instalación PWA.
- **Leaflet + OpenStreetMap** — mapas gratis sin tarjeta (mejor que Google Maps para
  una hackatón). Alternativa: **Mapbox** (más bonito, requiere token).
- **v0.dev** (Vercel) — generar UI de React a partir de un texto, muy rápido para
  prototipar el portal o el dashboard.
- **Supabase Edge Functions** — si quieren la automatización dentro de Supabase
  (cron + función) en vez de Make.
- **Resend** — envío de emails desde código, simple, si no usan Make para eso.
- **Postman** o **Thunder Client** (extensión de VS Code) — probar la API de Supabase
  antes de conectar el frontend.
- **Trello / Linear** — repartir y seguir tareas durante la hackatón.
- **Excalidraw** — diagramas rápidos para explicar la arquitectura en la presentación.

---

## 8. Orden de integración y demo

1. **Hora 0–1:** setup común (§1). El integrante 1 deja la base y las claves listas.
2. **Hora 1–3:** cada uno construye su módulo en su rama con su prompt.
3. **Hora 3–4:** integrar — la app recolector manda un informe real → aparece en el
   dashboard y en el portal del afiliado. Ese es el "momento mágico" del demo.
4. **Hora 4–5:** automatización con Make + pulir UI + preparar la presentación.
5. **Demo:** mostrar el flujo completo en vivo — recolector registra desde el celular,
   el dato cae en la base, Fundares lo ve en el mapa, el afiliado descarga su Excel,
   y Make manda el reporte solo.

---

## 9. Tips para sacarle jugo a las IAs

- **Dales contexto siempre**: pegá al inicio del prompt qué tablas hay y qué stack
  usan. Una IA sin contexto inventa nombres de campos.
- **Con MCP de Supabase**, pedí que *verifique* el esquema real antes de escribir
  código ("revisá las tablas con MCP y después generá").
- **Antigravity** brilla en tareas de "construí el módulo completo y probalo solo";
  **Cursor** para editar archivo por archivo con control; **Claude Code** para
  trabajos multi-archivo desde la terminal (`npm i -g @anthropic-ai/claude-code`,
  luego `claude` en la carpeta — docs: https://docs.claude.com/en/docs/claude-code/overview).
- **ChatGPT/Claude (chat)** para diseñar el escenario de Make, escribir SQL puntual o
  destrabar errores que pegás del log.
- Pedí cambios chicos y verificables, no "hacé todo". Es más fácil de revisar y rompe menos.
- Revisá cada acción del MCP antes de aprobarla; no conectes los MCP a un proyecto real
  de producción.
