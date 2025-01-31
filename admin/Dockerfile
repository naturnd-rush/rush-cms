# Keystone JS Admin Site Dockerfile (for production builds)

FROM node:lts
WORKDIR /app

# install JS deps
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# build app
COPY auth.ts keystone.ts schema.graphql schema.prisma schema.ts tsconfig.json ./
RUN npm run build

# run app
CMD ["npm", "run", "start"]
