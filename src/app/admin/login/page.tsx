import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { estAdminAuthentifie } from "@/lib/auth";

export const metadata = {
  title: "Connexion administrateur — Aura Nuit",
  robots: { index: false, follow: false },
};

export default function PageLogin({
  searchParams,
}: {
  searchParams: { redirect?: string };
}) {
  if (estAdminAuthentifie()) {
    redirect(searchParams.redirect ?? "/admin");
  }
  return (
    <div className="texture-marbre voile-mobile min-h-[80vh] flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-md bg-white shadow-elegance p-8 md:p-10">
        <header className="text-center mb-8">
          <p className="text-xs tracking-luxe uppercase text-secondaire mb-2">
            Aura Nuit
          </p>
          <h1 className="font-display text-3xl text-charbon">
            Espace administrateur
          </h1>
          <div className="filet-or w-16 mx-auto mt-4" />
        </header>

        <LoginForm redirect={searchParams.redirect ?? "/admin"} />
      </div>
    </div>
  );
}
