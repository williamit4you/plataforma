import Link from "next/link";
import { Award, BookOpen, Brain, CreditCard, Flame, GraduationCap, LayoutDashboard, Search, Settings, Upload } from "lucide-react";
import { requireUser } from "@/lib/permissions";

const studentLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/courses", label: "Cursos", icon: BookOpen },
  { href: "/learning-paths", label: "Trilhas", icon: GraduationCap },
  { href: "/flashcards", label: "Flashcards", icon: Brain },
  { href: "/reviews", label: "Revisoes", icon: Flame },
  { href: "/simulations", label: "Simulados", icon: Search },
  { href: "/certificates", label: "Certificados", icon: Award },
];

const adminLinks = [
  { href: "/admin", label: "Admin", icon: Settings },
  { href: "/admin/users", label: "Usuarios", icon: LayoutDashboard },
  { href: "/admin/courses", label: "Cursos", icon: BookOpen },
  { href: "/admin/import", label: "Importar IA", icon: Upload },
  { href: "/admin/payments", label: "Pagamentos", icon: CreditCard },
];

export async function AppShell({ children, admin = false }: { children: React.ReactNode; admin?: boolean }) {
  const user = await requireUser();
  const links = admin ? adminLinks : studentLinks;
  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white p-4 lg:block">
        <Link href="/" className="mb-8 flex items-center gap-2 font-semibold text-slate-950">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-teal-600 text-white">
            <BookOpen size={18} />
          </span>
          Ads Academy
        </Link>
        <nav className="space-y-1">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              <item.icon size={17} />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-4 left-4 right-4 rounded-lg border border-slate-200 p-3 text-sm text-slate-600">
          <p className="font-medium text-slate-950">{user.name}</p>
          <p className="truncate">{user.email}</p>
        </div>
      </aside>
      <main className="lg:pl-64">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
