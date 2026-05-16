"use client";

import Image from "next/image";
import { UploadDropzone } from "@/lib/uploadthing";
import type { ImageProduit } from "@/types/database";

interface Props {
  images: ImageProduit[];
  onChange: (images: ImageProduit[]) => void;
}

export function ImageUploader({ images, onChange }: Props) {
  function retirer(key: string) {
    onChange(images.filter((i) => i.key !== key));
  }

  function deplacer(index: number, direction: -1 | 1) {
    const cible = index + direction;
    if (cible < 0 || cible >= images.length) return;
    const copie = [...images];
    [copie[index], copie[cible]] = [copie[cible], copie[index]];
    onChange(copie);
  }

  return (
    <div>
      <p className="etiquette">Images du produit (Ghost Mannequin / Flat Lay)</p>

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
          {images.map((img, i) => (
            <div
              key={img.key}
              className="relative group aspect-square bg-fond-douce shadow-elegance overflow-hidden"
            >
              <Image
                src={img.url}
                alt={img.name ?? ""}
                fill
                sizes="200px"
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-charbon/70 backdrop-blur-sm flex items-center justify-between p-1 text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => deplacer(i, -1)}
                    disabled={i === 0}
                    className="px-2 py-0.5 hover:bg-secondaire/60 disabled:opacity-30"
                    aria-label="Déplacer à gauche"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => deplacer(i, 1)}
                    disabled={i === images.length - 1}
                    className="px-2 py-0.5 hover:bg-secondaire/60 disabled:opacity-30"
                    aria-label="Déplacer à droite"
                  >
                    →
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => retirer(img.key)}
                  className="px-2 py-0.5 hover:bg-secondaire/80"
                >
                  Retirer
                </button>
              </div>
              {i === 0 && (
                <span className="absolute top-1 left-1 bg-accent text-charbon text-[9px] px-1.5 py-0.5 tracking-luxe uppercase">
                  Couverture
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      <UploadDropzone
        endpoint="imageProduit"
        appearance={{
          container:
            "border border-dashed border-charbon/25 bg-fond-douce/50 p-6 hover:border-secondaire/50 transition-colors",
          label: "text-charbon font-medium",
          allowedContent: "text-xs text-charbon/50",
          button:
            "bg-charbon ut-uploading:bg-secondaire text-white text-xs tracking-luxe uppercase px-4 py-2 mt-3",
        }}
        content={{
          label: "Glissez vos images ici ou cliquez pour parcourir",
          allowedContent: "Jusqu'à 10 images · 4 Mo max chacune",
        }}
        onClientUploadComplete={(res) => {
          if (!res) return;
          const nouvelles: ImageProduit[] = res.map((f) => ({
            url: f.url,
            key: f.key,
            name: f.name,
          }));
          onChange([...images, ...nouvelles]);
        }}
        onUploadError={(e) => {
          alert(`Erreur d'upload : ${e.message}`);
        }}
      />
    </div>
  );
}
