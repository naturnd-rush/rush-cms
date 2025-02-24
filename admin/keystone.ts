// Welcome to Keystone!
//
// This file is what Keystone uses as the entry-point to your headless backend
//
// Keystone imports the default export of this file, expecting a Keystone configuration object
//   you can find out more at https://keystonejs.com/docs/apis/config

import "./env.ts";

import { config } from "@keystone-6/core";

// to keep this file tidy, we define our schema in a different file
import { lists } from "./schema";

// authentication is configured separately here too, but you might move this elsewhere
// when you write your list-level access control functions, as they typically rely on session data
import { withAuth, session } from "./auth";

// to keep this file tidy, we define our storage buckets in a different file
import { storage } from "./storage";

let dbURL = "NOT FOUND";
if (process.env.DATABASE_URL !== undefined) {
  ({
    env: { DATABASE_URL: dbURL },
  } = process);
}

export default withAuth(
  config({
    db: {
      provider: "postgresql",
      url: dbURL,
    },
    lists,
    session,
    storage,
  }),
);
