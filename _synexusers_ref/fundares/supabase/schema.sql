-- ============================================================
--  FUNDARES · Base de datos central (PostgreSQL / Supabase)
--  Pegá todo esto en el SQL Editor de Supabase y ejecutá.
-- ============================================================

create extension if not exists "pgcrypto";   -- para gen_random_uuid()

-- ---------- empresas que contratan a Fundares ----------
create table afiliados (
  id        uuid primary key default gen_random_uuid(),
  nombre    text not null,
  nit       text,
  creado_en timestamptz default now()
);

-- ---------- recintos verificados (con geocerca) ----------
create table recintos (
  id          uuid primary key default gen_random_uuid(),
  afiliado_id uuid not null references afiliados(id) on delete cascade,
  nombre      text not null,
  lat         double precision not null,
  lng         double precision not null,
  radio_m     integer not null default 150,   -- radio de la geocerca en metros
  creado_en   timestamptz default now()
);

-- ---------- recolectores verificados ----------
create table recolectores (
  id              uuid primary key default gen_random_uuid(),
  recinto_id      uuid not null references recintos(id),
  nombre          text not null,
  codigo_empleado text not null unique,
  activo          boolean not null default true,
  creado_en       timestamptz default now()
);

-- ---------- catálogo de tipos (alimenta el manifiesto de la app) ----------
create table tipos_residuo (
  id                   uuid primary key default gen_random_uuid(),
  nombre               text not null unique,               -- 'Plástico PET'
  detalle              text,
  kg_esperado_defecto  numeric
);

-- ---------- cabecero del informe ----------
create table informes (
  id              uuid primary key default gen_random_uuid(),
  recolector_id   uuid not null references recolectores(id),
  recinto_id      uuid references recintos(id),   -- se autocompleta por trigger
  fecha_hora      timestamptz not null,
  gps_lat         double precision,
  gps_lng         double precision,
  gps_precision_m numeric,
  distancia_m     numeric,                     -- distancia al centro del recinto
  dentro_geocerca boolean,
  total_kg        numeric(10,2) not null,
  foto_url        text,                        -- link a Storage, NO la imagen
  estado          text not null default 'pendiente',
  creado_en       timestamptz default now()
);

-- ---------- detalle: un renglón por sección/tipo ----------
create table informe_residuos (
  id               uuid primary key default gen_random_uuid(),
  informe_id       uuid not null references informes(id) on delete cascade,
  tipo_residuo_id  uuid not null references tipos_residuo(id),
  kg               numeric(10,2) not null
);

-- ---------- índices para que los reportes vuelen ----------
create index idx_inf_recinto_fecha on informes (recinto_id, fecha_hora);
create index idx_inf_recol_fecha   on informes (recolector_id, fecha_hora);
create index idx_res_informe       on informe_residuos (informe_id);

-- ============================================================
--  TRIGGER: completar recinto_id automáticamente desde el
--  recolector, así la app solo manda recolector_id.
-- ============================================================
create or replace function set_recinto_id() returns trigger as $$
begin
  if new.recinto_id is null then
    select recinto_id into new.recinto_id
    from recolectores where id = new.recolector_id;
  end if;
  return new;
end;
$$ language plpgsql;

create trigger trg_set_recinto
  before insert on informes
  for each row execute function set_recinto_id();

-- ============================================================
--  VISTAS DE REPORTE  (diario / semanal / mensual)
--  Son consultas guardadas; el dashboard solo las lee.
-- ============================================================

-- Totales por recinto y día
create view reporte_diario as
select recinto_id,
       date_trunc('day', fecha_hora)::date as dia,
       count(*)        as cant_informes,
       sum(total_kg)   as kg_total
from informes
group by recinto_id, date_trunc('day', fecha_hora);

-- Totales por recinto y semana
create view reporte_semanal as
select recinto_id,
       date_trunc('week', fecha_hora)::date as semana,
       count(*)        as cant_informes,
       sum(total_kg)   as kg_total
from informes
group by recinto_id, date_trunc('week', fecha_hora);

-- Totales por recinto y mes
create view reporte_mensual as
select recinto_id,
       date_trunc('month', fecha_hora)::date as mes,
       count(*)        as cant_informes,
       sum(total_kg)   as kg_total
from informes
group by recinto_id, date_trunc('month', fecha_hora);

-- Desglose por tipo de residuo (para gráficos del dashboard)
create or replace view reporte_por_tipo as
select i.recinto_id,
       tr.id as tipo_residuo_id,
       tr.nombre as tipo_residuo_nombre,
       count(distinct i.id) as cantidad_informes,
       coalesce(sum(ir.kg), 0)::numeric(12,3) as total_kg
from informes i
join informe_residuos ir on ir.informe_id = i.id
join tipos_residuo tr on tr.id = ir.tipo_residuo_id
group by i.recinto_id, tr.id, tr.nombre;


-- ============================================================
--  DATOS DEMO  (coinciden con la app del recolector)
-- ============================================================
insert into afiliados (nombre) values
  ('Embol S.A.'), ('Tigo Bolivia'), ('Banco Sol');

insert into recintos (afiliado_id, nombre, lat, lng, radio_m)
select id, 'Centro Norte',      -17.7833, -63.1821, 150 from afiliados where nombre='Embol S.A.'
union all
select id, 'Parque Industrial', -17.7570, -63.2010, 200 from afiliados where nombre='Tigo Bolivia'
union all
select id, 'Zona Sur',          -17.8200, -63.1700, 150 from afiliados where nombre='Banco Sol';

insert into recolectores (id, recinto_id, nombre)
select 'R-001', id, 'Juan Mamani'   from recintos where nombre='Centro Norte'
union all
select 'R-002', id, 'María Quispe'  from recintos where nombre='Parque Industrial'
union all
select 'R-003', id, 'Carlos Flores' from recintos where nombre='Zona Sur';

insert into tipos_residuo (nombre, detalle, color) values
  ('Plástico PET', 'botellas, envases', '#1f9bd1'),
  ('Cartón',       'cajas secas',       '#b9701a'),
  ('Vidrio',       'transparente',      '#0f7a45'),
  ('Papel',        'blanco, mixto',     '#6b5bd2'),
  ('Aluminio',     'latas',             '#9a9a9a');

-- ============================================================
--  SEGURIDAD (RLS)
--  Para la hackatón lo dejamos abierto con la anon key.
--  EN PRODUCCIÓN: activá RLS y políticas reales (auth de Supabase).
--  Ejemplo de cómo se bloquearía después:
--
--    alter table informes enable row level security;
--    create policy "insert propio" on informes for insert
--      with check ( recolector_id = auth.jwt() ->> 'sub' );
-- ============================================================
