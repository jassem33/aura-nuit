export function PageHeader({
  eyebrow,
  titre,
  description,
}: {
  eyebrow: string;
  titre: string;
  description?: string;
}) {
  return (
    <header className="mb-8 md:mb-10 text-center">
      <div className="flex items-center justify-center gap-3 mb-2.5">
        <div className="filet-or w-7" />
        <p className="text-[9px] tracking-luxe uppercase text-secondaire">
          {eyebrow}
        </p>
        <div className="filet-or w-7" />
      </div>
      <h1 className="font-display text-2xl md:text-3xl lg:text-4xl text-charbon leading-tight">
        {titre}
        <span className="text-secondaire italic">.</span>
      </h1>
      {description && (
        <p className="mt-3 max-w-md mx-auto text-charbon/65 text-xs md:text-sm leading-relaxed">
          {description}
        </p>
      )}
    </header>
  );
}
