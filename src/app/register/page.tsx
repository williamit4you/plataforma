import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { registerAction } from "@/server/actions/auth-actions";

export default function RegisterPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Criar conta</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={registerAction} className="space-y-4">
            <Input name="name" placeholder="Nome completo" required />
            <Input name="email" type="email" placeholder="email@exemplo.com" required />
            <Input name="password" type="password" placeholder="Senha com 6+ caracteres" required />
            <Button className="w-full">Cadastrar</Button>
          </form>
          <p className="mt-5 text-sm text-slate-600">
            Ja tem conta?{" "}
            <Link href="/login" className="text-teal-700 hover:underline">
              Entrar
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
