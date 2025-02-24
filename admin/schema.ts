// Welcome to your schema
//   Schema driven development is Keystone's modus operandi
//
// This file is where we define the lists, fields and hooks for our data.
// If you want to learn more about how lists are configured, please read
// - https://keystonejs.com/docs/config/lists

import { group, list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";

// see https://keystonejs.com/docs/fields/overview for the full list of fields
//   this is a few common fields for an example
import {
  checkbox,
  decimal,
  file,
  integer,
  password,
  relationship,
  text,
  timestamp,
} from "@keystone-6/core/fields";

// the document field is a more complicated field, so it has it's own package
import { document } from "@keystone-6/fields-document";
// if you want to make your own fields, see https://keystonejs.com/docs/guides/custom-fields

// when using Typescript, you can refine your types to a stricter subset by importing
// the generated types from '.keystone/types'
import type { Lists } from ".keystone/types";

// Custom color validation for hex codes
// Ref: https://stackoverflow.com/questions/1636350/how-to-identify-a-given-string-is-hex-color-format
const colorValidationMatch = {
  regex: /^#(?:[0-9a-fA-F]{3}){1,2}$/,
  explanation: `Color must be a hex color in the format #FFF or #FFFFFF`,
};

// Schema Constants
const LAYER_TITLE_MIN_LENGTH = 3;
const LAYER_TITLE_MAX_LENGTH = 60;

export const lists = {
  User: list({
    // WARNING
    //   for this starter project, anyone can create, query, update and delete anything
    //   if you want to prevent random people on the internet from accessing your data,
    //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
    access: allowAll,

    // this is the fields for our User list
    fields: {
      // by adding isRequired, we enforce that every User should have a name
      //   if no name is provided, an error will be displayed
      name: text({ validation: { isRequired: true } }),

      email: text({
        validation: { isRequired: true },
        // by adding isIndexed: 'unique', we're saying that no user can have the same
        // email as another user - this may or may not be a good idea for your project
        isIndexed: "unique",
      }),

      password: password({ validation: { isRequired: true } }),

      // we can use this field to see what Posts this User has authored
      //   more on that in the Post list below
      posts: relationship({ ref: "Post.author", many: true }),

      createdAt: timestamp({
        // this sets the timestamp to Date.now() when the user is first created
        defaultValue: { kind: "now" },
      }),
    },
  }),

  Post: list({
    // WARNING
    //   for this starter project, anyone can create, query, update and delete anything
    //   if you want to prevent random people on the internet from accessing your data,
    //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
    access: allowAll,

    // this is the fields for our Post list
    fields: {
      title: text({ validation: { isRequired: true } }),

      // the document field can be used for making rich editable content
      //   you can find out more at https://keystonejs.com/docs/guides/document-fields
      content: document({
        formatting: true,
        links: true,
        dividers: true,
      }),

      // with this field, you can set a User as the author for a Post
      author: relationship({
        // we could have used 'User', but then the relationship would only be 1-way
        ref: "User.posts",

        // this is some customisations for changing how this will look in the AdminUI
        ui: {
          displayMode: "cards",
          cardFields: ["name", "email"],
          inlineEdit: { fields: ["name", "email"] },
          linkToItem: true,
          inlineConnect: true,
        },

        // a Post can only have one author
        //   this is the default, but we show it here for verbosity
        many: false,
      }),

      // with this field, you can add some Tags to Posts
      tags: relationship({
        // we could have used 'Tag', but then the relationship would only be 1-way
        ref: "Tag.posts",

        // a Post can have many Tags, not just one
        many: true,

        // this is some customisations for changing how this will look in the AdminUI
        ui: {
          displayMode: "cards",
          cardFields: ["name"],
          inlineEdit: { fields: ["name"] },
          linkToItem: true,
          inlineConnect: true,
          inlineCreate: { fields: ["name"] },
        },
      }),
    },
  }),

  // this last list is our Tag list, it only has a name field for now
  Tag: list({
    // WARNING
    //   for this starter project, anyone can create, query, update and delete anything
    //   if you want to prevent random people on the internet from accessing your data,
    //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
    access: allowAll,

    // setting this to isHidden for the user interface prevents this list being visible in the Admin UI
    ui: {
      isHidden: true,
    },

    // this is the fields for our Tag list
    fields: {
      name: text(),
      // this can be helpful to find out all the Posts associated with a Tag
      posts: relationship({ ref: "Post.tags", many: true }),
    },
  }),

  // --- Map Schema ---
  Layer: list({
    access: allowAll,
    fields: {
      title: text({
        validation: {
          isRequired: true,
          length: { min: LAYER_TITLE_MIN_LENGTH, max: LAYER_TITLE_MAX_LENGTH },
        },
        isIndexed: "unique",
      }),
      description: document({
        // TODO: restrict formatting options, legend descriptions should not support
        // fully complex documents. Limit heading levels, lists perhaps, etc.
        formatting: true,
        links: true,
      }),
      styles: relationship({
        ref: "StyleOnLayer.layer",
        many: true,
        ui: {
          displayMode: "cards",
          linkToItem: true,
          cardFields: [
            "style",
            "mapAttrKey",
            "mapAttrVal",
            "mapAttrOper",
            "legendText",
          ],
          inlineCreate: {
            fields: [
              "style",
              "mapAttrKey",
              "mapAttrVal",
              "mapAttrOper",
              "legendText",
            ],
          },
          inlineEdit: {
            fields: [
              "style",
              "mapAttrKey",
              "mapAttrVal",
              "mapAttrOper",
              "legendText",
            ],
          },
        },
      }),
      ...group({
        label: "Data Provider",
        description:
          "Select one (only one) of the following options for where the map data for this layer is found.",
        fields: {
          data_GeoJSON: relationship({
            label: "Data Provider: GeoJSON File",
            ref: "Data_GeoJSON",
          }),
          data_OpenGreenMap: relationship({
            label: "Data Provider: OpenGreenMap",
            ref: "Data_OpenGreenMap",
          }),
        },
      }),
    },
  }),

  Style: list({
    access: allowAll,
    fields: {
      title: text({
        validation: {
          isRequired: true,
        },
        isIndexed: "unique",
      }),
      ...group({
        label: "Stroke Options",
        fields: {
          stroke: checkbox(),
          // TODO: Custom color field instead of regex hex validation.
          color: text({
            defaultValue: "#FFF",
            validation: {
              match: colorValidationMatch,
            },
          }),
          weight: decimal(),
          opacity: decimal(),
          lineCap: text({ db: { isNullable: true } }),
          lineJoin: text({ db: { isNullable: true } }),
          dashArray: text({ db: { isNullable: true } }),
          dashOffset: text({ db: { isNullable: true } }),
        },
      }),
      ...group({
        label: "Fill Options",
        fields: {
          fill: checkbox(),
          fillColor: text({
            defaultValue: "#000",
            validation: {
              match: colorValidationMatch,
            },
          }),
          fillOpacity: decimal(),
          fillRule: text({ db: { isNullable: true } }),
        },
      }),
      ...group({
        label: "Icon Options",
        fields: {
          icon: relationship({ ref: "Icon.styles", many: false }),
          iconOpacity: decimal(),
        },
      }),
      ...group({
        label: "Event Options",
        fields: {
          // Changed _hover to onHover, Prisma error on key name with _
          onHover: relationship({ ref: "Style", label: "Hover Style" }),
          // Omitting onActive for now because it is not a LeafletJS event
        },
      }),
      layers: relationship({ ref: "StyleOnLayer.style", many: true }),
    },
  }),

  StyleOnLayer: list({
    access: allowAll,
    fields: {
      layer: relationship({ ref: "Layer.styles", many: false }),
      style: relationship({ ref: "Style.layers", many: false }),
      mapAttrKey: text(),
      mapAttrVal: text(),
      mapAttrOper: text(),
      legendText: text(),
    },
  }),

  Icon: list({
    access: allowAll,
    fields: {
      height: integer({
        label: "Height (px)",
      }),
      width: integer({
        label: "Width (px)",
      }),
      ...group({
        label: "Icon Anchor",
        description: `The coordinates of the "tip" of the icon (relative to its top left corner). The icon will be aligned so that this point is at the marker's geographical location.`,
        fields: {
          anchorX: integer({
            label: "Anchor X (px)",
          }),
          anchorY: integer({
            label: "Anchor Y (px)",
          }),
        },
      }),
      bgColor: text({
        label: "Background Color",
        defaultValue: "#000",
        validation: {
          match: colorValidationMatch,
        },
      }),
      fillColor: text({
        label: "Fill Color",
        defaultValue: "#000",
        validation: {
          match: colorValidationMatch,
        },
      }),
      strokeColor: text({
        label: "Stroke Color",
        defaultValue: "#000",
        validation: {
          match: colorValidationMatch,
        },
      }),
      // TODO: Add custom view component to show the svg on the admin page.
      svg: file({
        storage: "local_icon_svgs",
      }),
      styles: relationship({ ref: "Style.icon", many: true }),
    },
  }),

  // Map Data Providers
  Data_GeoJSON: list({
    access: allowAll,
    fields: {
      geoJSON: file({
        label: "GeoJSON File",
        storage: "local_geojson",
      }),
    },
  }),
  Data_OpenGreenMap: list({
    access: allowAll,
    fields: {
      ogmMapId: text({
        validation: {
          isRequired: true,
        },
      }),
    },
  }),
} satisfies Lists;
