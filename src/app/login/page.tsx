import Link from "next/link";
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Entrar na plataforma</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<p className="text-sm text-slate-500">Carregando formulario...</p>}>
            <LoginForm />
          </Suspense>
          <div className="mt-5 flex justify-between text-sm">
            <Link href="/register" className="text-teal-700 hover:underline">
              Criar conta
            </Link>
            <Link href="/forgot-password" className="text-slate-600 hover:underline">
              Esqueci a senha
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
