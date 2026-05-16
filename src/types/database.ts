/**
 * Types de la base de données Aura Nuit.
 */

export type StatutProduit = "en stock" | "en rupture";
export type StatutCommande = "en attente" | "confirmé" | "livré" | "retour";

export interface ImageProduit {
  url: string;
  key: string; // clé UploadThing pour suppression
  name?: string;
}

export interface CouleurProduit {
  nom: string;
  hex: string;
  stock: number;
  tailles: string[];
}

export interface ArticleCommande {
  produit_id: string;
  nom: string;
  prix_unitaire: number;
  quantite: number;
  couleur?: string;
  taille?: string;
  image?: string;
}

export interface Produit {
  id: string;
  nom: string;
  description: string | null;
  couleurs: CouleurProduit[];
  tailles: string[];
  images: ImageProduit[];
  prix_achat: number;
  prix_original: number;
  prix_vente: number;
  statut: StatutProduit;
  sous_type_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Commande {
  id: string;
  date: string;
  nom_client: string;
  adresse_client: string;
  telephone_client: string;
  articles: ArticleCommande[];
  total: number;
  statut: StatutCommande;
  created_at: string;
  updated_at: string;
}

export interface TypeProduit {
  id: string;
  nom: string;
  slug: string;
  ordre: number;
  icone: string | null;
  created_at: string;
  updated_at: string;
}

export interface SousTypeProduit {
  id: string;
  type_id: string;
  nom: string;
  slug: string;
  ordre: number;
  icone: string | null;
  created_at: string;
  updated_at: string;
}

export interface TypeAvecSousTypes extends TypeProduit {
  sous_types: SousTypeProduit[];
}

export interface Database {
  public: {
    Tables: {
      produits: {
        Row: Produit;
        Insert: Omit<Produit, "id" | "created_at" | "updated_at"> & {
          id?: string;
        };
        Update: Partial<Omit<Produit, "id" | "created_at" | "updated_at">>;
        Relationships: [];
      };
      commandes: {
        Row: Commande;
        Insert: Omit<Commande, "id" | "created_at" | "updated_at" | "date"> & {
          id?: string;
          date?: string;
        };
        Update: Partial<Omit<Commande, "id" | "created_at" | "updated_at">>;
        Relationships: [];
      };
      types_produits: {
        Row: TypeProduit;
        Insert: Omit<TypeProduit, "id" | "created_at" | "updated_at"> & {
          id?: string;
        };
        Update: Partial<Omit<TypeProduit, "id" | "created_at" | "updated_at">>;
        Relationships: [];
      };
      sous_types_produits: {
        Row: SousTypeProduit;
        Insert: Omit<SousTypeProduit, "id" | "created_at" | "updated_at"> & {
          id?: string;
        };
        Update: Partial<
          Omit<SousTypeProduit, "id" | "created_at" | "updated_at">
        >;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
