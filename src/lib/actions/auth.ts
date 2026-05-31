"use server";

import { redirect } from "next/navigation";

import { DEMO_USERS } from "@/lib/auth/constants";
import { clearSession, setSession } from "@/lib/auth/session";

export async function loginAction(
  _prev: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string }> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  const user = DEMO_USERS.find(
    (u) => u.email.toLowerCase() === email && u.password === password
  );

  if (!user) {
    return { error: "Correo o contraseña incorrectos." };
  }

  const { password: _, ...session } = user;
  await setSession(session);

  if (session.role === "cliente") {
    redirect("/cliente");
  }

  redirect("/");
}

export async function logoutAction() {
  await clearSession();
  redirect("/login");
}
