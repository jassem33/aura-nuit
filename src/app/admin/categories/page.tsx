import { listerSousTypes, listerTypes } from "@/actions/categories";
import { CategoriesManager } from "@/components/admin/CategoriesManager";

export const metadata = {
  title: "Catégories — Admin Aura Nuit",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function PageAdminCategories() {
  const [types, sousTypes] = await Promise.all([
    listerTypes(),
    listerSousTypes(),
  ]);

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display text-2xl text-charbon">Catégories</h1>
        <p className="text-xs text-charbon/55 mt-0.5">
          Gérez les types (ex. <em>Maillot de bain</em>) et leurs sous-types
          (ex. <em>Burkini</em>).
        </p>
      </header>
      <CategoriesManager types={types} sousTypes={sousTypes} />
    </div>
  );
}
