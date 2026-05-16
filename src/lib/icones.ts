/**
 * Registre des icônes disponibles pour les types et sous-types de produits.
 * L'admin choisit une clé (stockée en BDD), le client la rend en composant.
 */

import {
  Bird,
  Crown,
  Diamond,
  Feather,
  Flower,
  Flower2,
  Gem,
  Gift,
  Heart,
  Leaf,
  Moon,
  Package,
  Ribbon,
  Scissors,
  Shirt,
  ShoppingBag,
  Snowflake,
  Sparkle,
  Sparkles,
  Star,
  Sun,
  Tag,
  Wand2,
  Waves,
  type LucideIcon,
} from "lucide-react";

export interface OptionIcone {
  cle: string;
  label: string;
  Icone: LucideIcon;
}

export const ICONES_DISPONIBLES: OptionIcone[] = [
  { cle: "sparkles", label: "Étincelles", Icone: Sparkles },
  { cle: "sparkle", label: "Étincelle", Icone: Sparkle },
  { cle: "heart", label: "Cœur", Icone: Heart },
  { cle: "star", label: "Étoile", Icone: Star },
  { cle: "crown", label: "Couronne", Icone: Crown },
  { cle: "gem", label: "Gemme", Icone: Gem },
  { cle: "diamond", label: "Diamant", Icone: Diamond },
  { cle: "ribbon", label: "Ruban", Icone: Ribbon },
  { cle: "shirt", label: "Vêtement", Icone: Shirt },
  { cle: "scissors", label: "Ciseaux", Icone: Scissors },
  { cle: "shopping-bag", label: "Sac", Icone: ShoppingBag },
  { cle: "package", label: "Paquet", Icone: Package },
  { cle: "gift", label: "Cadeau", Icone: Gift },
  { cle: "tag", label: "Étiquette", Icone: Tag },
  { cle: "wand", label: "Baguette", Icone: Wand2 },
  { cle: "flower", label: "Fleur", Icone: Flower },
  { cle: "flower-2", label: "Fleur 2", Icone: Flower2 },
  { cle: "leaf", label: "Feuille", Icone: Leaf },
  { cle: "feather", label: "Plume", Icone: Feather },
  { cle: "bird", label: "Oiseau", Icone: Bird },
  { cle: "sun", label: "Soleil", Icone: Sun },
  { cle: "moon", label: "Lune", Icone: Moon },
  { cle: "snowflake", label: "Flocon", Icone: Snowflake },
  { cle: "waves", label: "Vagues", Icone: Waves },
];

const INDEX = new Map(ICONES_DISPONIBLES.map((o) => [o.cle, o.Icone]));

export function obtenirIcone(cle: string | null | undefined): LucideIcon | null {
  if (!cle) return null;
  return INDEX.get(cle) ?? null;
}
