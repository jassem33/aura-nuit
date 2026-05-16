import { estAdminAuthentifie } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata = {
  title: "Administration — Aura Nuit",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Non authentifié : on rend juste la page (typiquement /admin/login).
  if (!estAdminAuthentifie()) {
    return <>{children}</>;
  }

  return <AdminShell>{children}</AdminShell>;
}
