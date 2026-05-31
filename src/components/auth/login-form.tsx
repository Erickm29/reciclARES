"use client";

import { useActionState } from "react";
import { Leaf, Lock, LogIn } from "lucide-react";

import { loginAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, null);

  return (
    <div className="flex min-h-screen">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-primary p-12 text-primary-foreground lg:flex lg:w-[45%]">
        <div className="absolute -bottom-24 -right-24 size-80 rounded-full bg-fundares-accent/20 blur-3xl" />
        <div className="relative flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-white/15">
            <Leaf className="size-6" strokeWidth={2.5} />
          </div>
          <div>
            <p className="font-heading text-lg">FUNDARES</p>
            <p className="text-sm text-primary-foreground/75">
              Plataforma ESG
            </p>
          </div>
        </div>
        <div className="relative max-w-md">
          <h1 className="font-heading text-4xl leading-tight">
            Trazabilidad de reciclaje, medida en impacto.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-primary-foreground/80">
            Acceso para equipos de Fundares y empresas afiliadas que consultan
            sus datos de recolección verificada.
          </p>
        </div>
        <p className="relative text-xs text-primary-foreground/60">
          © 2026 Fundares · Datos con respaldo legal
        </p>
      </div>

      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-primary/10">
              <Leaf className="size-6 text-primary" strokeWidth={2.5} />
            </div>
            <h1 className="font-heading text-2xl text-foreground">
              Iniciar sesión
            </h1>
          </div>

          <div className="hidden lg:block">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Bienvenido
            </p>
            <h2 className="font-heading mt-2 text-3xl text-foreground">
              Iniciar sesión
            </h2>
          </div>

          <form action={formAction} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                required
                placeholder="usuario@empresa.bo"
                className="fundares-input"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="••••••••"
                className="fundares-input"
              />
            </div>

            {state?.error && (
              <p className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
                {state.error}
              </p>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={pending}>
              <LogIn className="size-4" />
              {pending ? "Ingresando..." : "Ingresar"}
            </Button>
          </form>

          <div className="mt-8 rounded-2xl border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
            <p className="mb-3 flex items-center gap-2 font-medium text-foreground">
              <Lock className="size-4 text-primary" />
              Credenciales de prueba
            </p>
            <div className="space-y-2 text-xs leading-relaxed">
              <p>
                <span className="font-semibold text-foreground">
                  Administrador:
                </span>{" "}
                admin@fundares.bo / admin123
              </p>
              <p>
                <span className="font-semibold text-foreground">Cliente:</span>{" "}
                cliente@embol.bo / cliente123
              </p>
              <p>
                <span className="font-semibold text-foreground">Cliente:</span>{" "}
                cliente@tigo.bo / cliente123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
