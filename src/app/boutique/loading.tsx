export default function ChargementBoutique() {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-10 md:py-14">
      <header className="mb-8 md:mb-10 text-center">
        <div className="flex items-center justify-center gap-3 mb-2.5">
          <div className="filet-or w-7" />
          <p className="text-[9px] tracking-luxe uppercase text-secondaire">
            Boutique
          </p>
          <div className="filet-or w-7" />
        </div>
        <h1 className="font-display text-2xl md:text-3xl lg:text-4xl text-charbon leading-tight">
          La collection<span className="text-secondaire italic">.</span>
        </h1>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[3/4] bg-charbon/5" />
            <div className="p-4 space-y-2.5">
              <div className="h-3 w-3/4 bg-charbon/5 rounded" />
              <div className="h-3 w-1/3 bg-charbon/5 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
