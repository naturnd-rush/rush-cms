// Storage configuration
import type { StorageConfig } from "@keystone-6/core/types";

const {
  env: { BASE_URL: baseUrl = "http://localhost:3000" },
} = process;

export const storage = {
  local_images: {
    kind: "local",
    type: "file",
    generateUrl: (path) => `${baseUrl}/images${path}`,
    serverRoute: {
      path: "/images",
    },
    storagePath: "public/images",
  } satisfies StorageConfig,

  local_geojson: {
    kind: "local",
    type: "file",
    generateUrl: (path) => `${baseUrl}/geojson${path}`,
    serverRoute: {
      path: "/geojson",
    },
    storagePath: "public/geojson",
  } satisfies StorageConfig,
};
