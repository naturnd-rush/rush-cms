# Next JS Main App Dockerfile (for production builds)

FROM node:lts
WORKDIR /app

# install JS deps
COPY app/package.json app/package-lock.json ./
RUN npm ci --omit=dev

# copy db schema from keystone admin site and generate prisma client
COPY admin/schema.prisma ./prisma/schema.prisma
RUN npx prisma generate

# build app
COPY app/src app/public app/next.config.ts app/postcss.config.mjs app/tailwind.config.ts app/tsconfig.json ./
RUN npm run build

# run app
CMD ["npm", "run", "start"]
