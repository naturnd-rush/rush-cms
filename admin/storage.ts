// Storage configuration
import { StorageConfig } from "@keystone-6/core/types";

require('dotenv').config({ path: '../.env' });

const {
  BASE_URL: baseUrl = 'http://localhost:3000'
} = process.env;

export const storage = {
  local_icon_svgs: {
    kind: 'local',
    type: 'file',
    generateUrl: path => `${baseUrl}/images${path}`,
    serverRoute: {
      path: '/images'
    },
    storagePath: 'public/images'
  } satisfies StorageConfig,

  local_geojson: {
    kind: 'local',
    type: 'file',
    generateUrl: path => `${baseUrl}/geojson${path}`,
    serverRoute: {
      path: '/geojson'
    },
    storagePath: 'public/geojson'
  } satisfies StorageConfig
}