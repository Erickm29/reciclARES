# InnovahackSynex — FUNDARES Dashboard de Validación

Dashboard interno para validación de informes de recolección de residuos, conectado a Supabase.

## Estructura del repositorio

| Carpeta / archivo | Descripción |
|-------------------|-------------|
| `src/` | Dashboard Next.js (validación, reportes, recolectores) |
| `db/` | Esquema y scripts de base de datos |
| `sistema de recogida y VALIDACION/` | Documentación del sistema de recolección |
| `scripts/test-supabase.mjs` | Script de prueba de conexión Supabase |

## Requisitos

- Node.js 18+
- Cuenta Supabase con tablas `informes`, `recolectores`, `recintos`, etc.

## Configuración

1. Instalar dependencias:

```bash
npm install
```

2. Copiar variables de entorno:

```bash
cp .env.local.example .env.local
```

3. Completar en `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://hhurrytpyuujjvrlizzi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anon
```

## Desarrollo

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Verificar conexión Supabase

```bash
node scripts/test-supabase.mjs
```

## Build

```bash
npm run build
npm start
```

## Funcionalidades

- Validación y rechazo de informes (`pendiente` → `aprobado` / `revision`)
- Panel de auditoría con ficha técnica, fotos e historial
- Reportes con comparación de peso reportado vs acopio
- Gestión de recolectores
