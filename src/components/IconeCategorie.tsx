import { obtenirIcone } from "@/lib/icones";

interface Props {
  cle: string | null | undefined;
  size?: number;
  className?: string;
}

export function IconeCategorie({ cle, size = 14, className }: Props) {
  const Icone = obtenirIcone(cle);
  if (!Icone) return null;
  return (
    <Icone
      size={size}
      strokeWidth={1.6}
      className={className}
      aria-hidden="true"
    />
  );
}
