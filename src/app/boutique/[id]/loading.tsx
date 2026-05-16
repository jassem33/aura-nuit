export default function ChargementProduit() {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-8 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 animate-pulse">
        <div className="aspect-[3/4] bg-charbon/5" />
        <div className="space-y-4">
          <div className="h-3 w-24 bg-charbon/5 rounded" />
          <div className="h-7 w-2/3 bg-charbon/5 rounded" />
          <div className="h-5 w-1/3 bg-charbon/5 rounded" />
          <div className="h-24 w-full bg-charbon/5 rounded" />
          <div className="h-9 w-40 bg-charbon/5 rounded" />
        </div>
      </div>
    </div>
  );
}
