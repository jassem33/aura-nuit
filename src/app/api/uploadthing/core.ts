import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { estAdminAuthentifie } from "@/lib/auth";

const f = createUploadthing();

export const ourFileRouter = {
  imageProduit: f({
    image: { maxFileSize: "4MB", maxFileCount: 10 },
  })
    .middleware(async () => {
      if (!estAdminAuthentifie()) {
        throw new UploadThingError("Non autorisé.");
      }
      return { adminAuthentifie: true };
    })
    .onUploadComplete(async ({ file }) => {
      // `ufsUrl` est l'URL canonique (<appId>.ufs.sh/f/<key>) ;
      // `url` (utfs.io) est déprécié par UploadThing.
      const url = (file as { ufsUrl?: string }).ufsUrl ?? file.url;
      return { url, key: file.key, name: file.name };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
