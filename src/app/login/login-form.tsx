"use client";

import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        startTransition(async () => {
          const result = await signIn("credentials", {
            email: formData.get("email"),
            password: formData.get("password"),
            redirect: false,
          });
          if (result?.ok) router.push("/dashboard");
          else setError("Email ou senha invalidos.");
        });
      }}
    >
      {searchParams.get("registered") && (
        <p className="rounded-md bg-teal-50 p-3 text-sm text-teal-800">Conta criada. Entre com seu email e senha.</p>
      )}
      <Input name="email" type="email" placeholder="email@exemplo.com" required />
      <Input name="password" type="password" placeholder="Senha" required />
      {error && <p className="text-sm text-rose-600">{error}</p>}
      <Button className="w-full" disabled={pending}>
        Entrar
      </Button>
    </form>
  );
}
