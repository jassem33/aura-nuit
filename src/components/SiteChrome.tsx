"use client";

import { usePathname } from "next/navigation";

export function SiteChrome({
  topBar,
  navBar,
  footer,
  children,
}: {
  topBar: React.ReactNode;
  navBar: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? "";
  const masquerChrome = pathname.startsWith("/admin");

  if (masquerChrome) {
    return <>{children}</>;
  }

  return (
    <>
      {topBar}
      {navBar}
      <main className="flex-1">{children}</main>
      {footer}
    </>
  );
}
