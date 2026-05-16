import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { TopBar } from "@/components/TopBar";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PanierProvider } from "@/components/PanierContext";
import { SiteChrome } from "@/components/SiteChrome";
import { listerCategoriesPublic } from "@/lib/produits-public";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aura Nuit — Maison de Luxe",
  description:
    "Aura Nuit, une maison de couture où l'élégance rencontre la nuit. Pièces uniques, savoir-faire raffiné.",
  metadataBase: new URL("https://aura-nuit.local"),
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Aura Nuit — Maison de Luxe",
    description: "L'élégance rencontre la nuit.",
    locale: "fr_FR",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await listerCategoriesPublic().catch(() => []);
  return (
    <html lang="fr" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-fond text-charbon flex flex-col">
        <PanierProvider>
          <SiteChrome
            topBar={<TopBar />}
            navBar={<Navbar categories={categories} />}
            footer={<Footer />}
          >
            {children}
          </SiteChrome>
        </PanierProvider>
      </body>
    </html>
  );
}
