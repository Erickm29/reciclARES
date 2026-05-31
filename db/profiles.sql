-- Perfiles de usuario vinculados a Supabase Auth
-- Ejecutar cuando se migre de credenciales demo a auth real

create type public.user_role as enum ('administrador', 'cliente');

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.user_role not null default 'cliente',
  nombre text not null,
  afiliado_id uuid references public.afiliados(id) on delete set null,
  creado_en timestamptz default now()
);

alter table public.profiles enable row level security;

-- El usuario solo puede leer su propio perfil
create policy "profiles_select_own"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

-- Administradores: acceso total a informes (ajustar según políticas reales)
-- Clientes: solo informes de recintos de su afiliado
-- Ver db/.cursorrules para el esquema completo de afiliados, recintos e informes

comment on table public.profiles is
  'Rol y afiliado de cada usuario. administrador = equipo Fundares; cliente = empresa afiliada.';
