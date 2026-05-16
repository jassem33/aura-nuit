import { listerCommandes } from "@/actions/commandes";
import { OrdersTable } from "@/components/admin/OrdersTable";

export const dynamic = "force-dynamic";

export default async function PageAdminCommandes() {
  const commandes = await listerCommandes();

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display text-2xl text-charbon">Commandes</h1>
        <p className="text-charbon/55 text-xs mt-0.5">
          {commandes.length} commande{commandes.length > 1 ? "s" : ""} au total.
        </p>
      </header>

      <OrdersTable commandes={commandes} />
    </div>
  );
}
