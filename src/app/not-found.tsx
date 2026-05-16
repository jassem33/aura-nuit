import Link from "next/link";

export default function NotFound() {
  return (
    <div className="texture-marbre voile-mobile min-h-[60vh] flex items-center">
      <div className="max-w-xl mx-auto px-6 text-center py-20">
        <p className="font-display text-7xl text-secondaire mb-3">404</p>
        <h1 className="font-display text-3xl text-charbon mb-4">
          Page introuvable
        </h1>
        <p className="text-charbon/70 mb-8">
          La pièce que vous cherchiez ne fait pas partie de notre collection.
        </p>
        <Link href="/" className="btn-or">
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
