import Link from "next/link";
import { BookOpen, LayoutDashboard, LogIn, ShieldCheck } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export async function SiteHeader() {
  const session = await getServerSession(authOptions);
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold text-slate-950">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-teal-600 text-white">
            <BookOpen size={18} />
          </span>
          Ads Academy
        </Link>
        <nav className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/vendas">Oferta</Link>
          </Button>
          {session?.user ? (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/dashboard">
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
              </Button>
              {session.user.role === "ADMIN" && (
                <Button asChild variant="secondary" size="sm">
                  <Link href="/admin">
                    <ShieldCheck size={16} />
                    Admin
                  </Link>
                </Button>
              )}
            </>
          ) : (
            <Button asChild size="sm">
              <Link href="/login">
                <LogIn size={16} />
                Entrar
              </Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
