import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Recuperar senha</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <Input type="email" placeholder="email@exemplo.com" required />
            <Button className="w-full">Enviar instrucoes</Button>
          </form>
          <p className="mt-4 text-sm text-slate-500">Fluxo preparado para integrar provedor de email transacional.</p>
        </CardContent>
      </Card>
    </main>
  );
}
