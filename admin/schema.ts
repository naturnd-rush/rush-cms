// Welcome to your schema
//   Schema driven development is Keystone's modus operandi
//
// This file is where we define the lists, fields and hooks for our data.
// If you want to learn more about how lists are configured, please read
// - https://keystonejs.com/docs/config/lists

import { group, list } from '@keystone-6/core'
import { allowAll } from '@keystone-6/core/access'
import { select } from '@keystone-6/core/fields';
import {
  checkbox,
  decimal,
  file,
  integer,
  password,
  relationship,
  text,
  timestamp,
} from '@keystone-6/core/fields'
import { document } from '@keystone-6/fields-document'
import { type Lists } from '.keystone/types'
import path from "path";
import { availableIcons } from './types/icon'

// Custom color validation for hex codes
// Ref: https://stackoverflow.com/questions/1636350/how-to-identify-a-given-string-is-hex-color-format
const colorValidationMatch = {
  regex: /^#(?:[0-9a-fA-F]{3}){1,2}$/,
  explanation: `Color must be a hex color in the format #FFF or #FFFFFF`
}

const SubQuestionDisplay = [
  {
    label: 'Full-window',
    value: 'full_window',
  },
  {
    label: 'Card',
    value: 'card',
  },
];

export const lists = {

  User: list({
    access: allowAll,
    fields: {
      name: text({ validation: { isRequired: true } }),
      email: text({
        validation: { isRequired: true },
        isIndexed: 'unique',
      }),
      password: password({ validation: { isRequired: true } }),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
    },
  }),

  Question: list({
    access: allowAll,
    fields: {
      layer: relationship({
        ref: 'Layer',
        ui: {
          description: 'The map layer to create a question for.',
        },
      }),
      title: text({validation: { isRequired: true }}),
      subtitle: text({validation: { isRequired: true }}),
      content: document({formatting: true, links: true}),
      subQuestion: relationship({
        ref: 'SubQuestion', 
        ui: {
          createView: {fieldMode: 'hidden'},
          description: 
            'You can add more information about the question here, ' + 
            'or leave this blank if you want.'
        },
      }),
    },
  }),

  SubQuestion: list({
    access: allowAll,
    fields: {
      subQuestion: relationship({ref: 'SubQuestion'}),
      display: select({
        options: SubQuestionDisplay,
        defaultValue: "FiHome",
        ui: {
          displayMode: 'segmented-control', 
        },
      }),
      buttonText: text({validation: { isRequired: true }}),
      title: text({validation: { isRequired: true }}),
      subtitle: text({validation: { isRequired: true }}),
      content: document({formatting: true, links: true}),
    },
  }),

  Initiative: list({
    access: allowAll,
    fields: {
      title: text({validation: { isRequired: true }}),
      description: document(),
      thumbnail: file({
        storage: 'local_images',
        ui: {
          description: 'An optional image thumbnail for this initiative.',
        },
      }),
    },
  }),

  Tag: list({
    access: allowAll,
    fields: {
      name: text({validation: { isRequired: true }}),
    },
  }),

  Page: list({
    access: allowAll,
    fields: {
      title: text({
        validation: { isRequired: true }
      }),
      content: document({formatting: true, links: true}),
      /**icon: select({
        options: availableIcons.map((icon) => {
          return {
            label: icon.displayName, 
            value: icon.value,
          }
        }),
        defaultValue: "FiHome",
        ui: {
          displayMode: 'segmented-control', // don't use dropdown
          views: path.join(__dirname, "../components/IconField"),
        },
      }),*/
    },
  }),

  QuestionInitiative: list({
    access: allowAll,
    fields: {
      question: relationship({
        ref: 'Question',
        ui: {
          description: 'The linked question.',
        },
      }),
      initiative: relationship({
        ref: 'Initiative',
        ui: {
          description: 'The linked initiative.',
        },
      }),
    },
  }),

  InitiativeTag: list({
    access: allowAll,
    fields: {
      initiative: relationship({
        ref: 'Initiative',
        ui: {
          description: 'The linked initiative.',
        },
      }),
      tag: relationship({
        ref: 'Tag',
        ui: {
          description: 'The linked tag.',
        },
      }),
    },
  }),



  /**
  SamIcon: list({
    access: allowAll,
    fields: {
      name: text({
        validation: { isRequired: true }
      }),
      icon: select({
        options: availableIcons.map((icon) => {
          return {
            label: icon.displayName, 
            value: icon.value,
          }
        }),
        defaultValue: "FiHome", // Default to a specific icon on creation
        ui: {
          displayMode: 'segmented-control', // don't use dropdown
          views: path.join(__dirname, "../components/IconField"),
        },
      }),
    },
  }),

  Page: list({
    access: allowAll,
    fields: {
      title: text({
        validation: { isRequired: true }
      }),
      icon: select({
        options: availableIcons.map((icon) => {
          return {
            label: icon.displayName, 
            value: icon.value,
          }
        }),
        defaultValue: "FiHome", // Default to a specific icon on creation
        ui: {
          displayMode: 'segmented-control', // don't use dropdown
          views: path.join(__dirname, "../components/IconField"),
        },
      }),
    },
  }),
  */

  // --- Map Schema ---
  Layer: list({
    access: allowAll,
    fields: {
      title: text({
        validation: {
          isRequired: true,
          length: { min: 3, max: 60 }
        },
        isIndexed: 'unique'
      }),
      description: document({
        // TODO: restrict formatting options, legend descriptions should not support
        // fully complex documents. Limit heading levels, lists perhaps, etc.
        formatting: true,
        links: true
      }),
      styles: relationship({
        ref: 'StyleOnLayer.layer',
        many: true,
        ui: {
          displayMode: 'cards',
          linkToItem: true,
          cardFields: ['style', 'mapAttrKey', 'mapAttrVal', 'mapAttrOper', 'legendText' ],
          inlineCreate: { fields: ['style', 'mapAttrKey', 'mapAttrVal', 'mapAttrOper', 'legendText' ] },
          inlineEdit: { fields: ['style', 'mapAttrKey', 'mapAttrVal', 'mapAttrOper', 'legendText' ] }
        }
      }),
      ...group({
        label: 'Data Provider',
        description: 'Select one (only one) of the following options for where the map data for this layer is found.',
        fields: {
          data_GeoJSON: relationship({
            label: 'Data Provider: GeoJSON File',
            ref: 'Data_GeoJSON'
          }),
          data_OpenGreenMap: relationship({
            label: 'Data Provider: OpenGreenMap',
            ref: 'Data_OpenGreenMap'
          })
        }
      })
    }
  }),

  Style: list({
    access: allowAll,
    fields: {
      title: text({
        validation: {
          isRequired: true
        },
        isIndexed: 'unique'
      }),
      ...group({
        label: 'Stroke Options',
        fields: {
          stroke: checkbox(),
          // TODO: Custom color field instead of regex hex validation.
          color: text({
            defaultValue: '#FFF',
            validation: {
              match: colorValidationMatch
            }
          }),
          weight: decimal(),
          opacity: decimal(),
          lineCap: text({ db: { isNullable: true } }),
          lineJoin: text({ db: { isNullable: true } }),
          dashArray: text({ db: { isNullable: true } }),
          dashOffset: text({ db: { isNullable: true } })
        }
      }),
      ...group({
        label: 'Fill Options',
        fields: {
          fill: checkbox(),
          fillColor: text({
            defaultValue: '#000',
            validation: {
              match: colorValidationMatch
            }
          }),
          fillOpacity: decimal(),
          fillRule: text({ db: { isNullable: true } })
        }
      }),
      ...group({
        label: 'Icon Options',
        fields: {
          icon: relationship({ ref: 'Icon.styles', many: false }),
          iconOpacity: decimal(),
        }
      }),
      ...group({
        label: 'Event Options',
        fields: {
          // Changed _hover to onHover, Prisma error on key name with _
          onHover: relationship({ ref: 'Style', label: 'Hover Style' })
          // Omitting onActive for now because it is not a LeafletJS event
        }
      }),
      layers: relationship({ ref: 'StyleOnLayer.style', many: true })
    }
  }),

  StyleOnLayer: list({
    access: allowAll,
    fields: {
      layer: relationship({ ref: 'Layer.styles', many: false }),
      style: relationship({ ref: 'Style.layers', many: false }),
      mapAttrKey: text(),
      mapAttrVal: text(),
      mapAttrOper: text(),
      legendText: text()
    }
  }),

  Icon: list({
    access: allowAll,
    fields: {
      height: integer({
        label: 'Height (px)'
      }),
      width: integer({
        label: 'Width (px)'
      }),
      ...group({
        label: 'Icon Anchor',
        description: `The coordinates of the "tip" of the icon (relative to its top left corner). The icon will be aligned so that this point is at the marker's geographical location.`,
        fields: {
          anchorX: integer({
            label: 'Anchor X (px)'
          }),
          anchorY: integer({
            label: 'Anchor Y (px)'
          }),
        },
      }),
      bgColor: text({
        label: 'Background Color',
        defaultValue: '#000',
        validation: {
          match: colorValidationMatch
        }
      }),
      fillColor: text({
        label: 'Fill Color',
        defaultValue: '#000',
        validation: {
          match: colorValidationMatch
        }
      }),
      strokeColor: text({
        label: 'Stroke Color',
        defaultValue: '#000',
        validation: {
          match: colorValidationMatch
        }
      }),
      // TODO: Add custom view component to show the svg on the admin page.
      svg: file({
        storage: 'local_images'
      }),
      styles: relationship({ ref: 'Style.icon', many: true })
    }
  }),

  // Map Data Providers
  Data_GeoJSON: list({
    access: allowAll,
    fields: {
      geoJSON: file({
        label: 'GeoJSON File',
        storage: 'local_geojson',
      })
    }
  }),
  Data_OpenGreenMap: list({
    access: allowAll,
    fields: {
      ogmMapId: text({
        validation: {
          isRequired: true
        }
      })
    }
  })
} satisfies Lists
