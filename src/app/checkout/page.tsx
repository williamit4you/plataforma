import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CheckoutPage() {
  return (
    <>
      <SiteHeader />
      <main className="grid min-h-[calc(100vh-4rem)] place-items-center bg-slate-50 px-4">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>Checkout</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-6 text-slate-600">
              A compra sera feita pela Kiwify. Configure aqui o link oficial do produto quando a oferta estiver criada.
            </p>
            <Button asChild className="mt-6 w-full">
              <Link href="/register">Criar conta enquanto isso</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
