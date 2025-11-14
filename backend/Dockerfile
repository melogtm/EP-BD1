FROM node:22-alpine AS builder
WORKDIR /usr/app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build


FROM node:22-alpine AS runner
WORKDIR /usr/app

COPY --from=builder /usr/app/dist ./dist
COPY --from=builder /usr/app/node_modules ./node_modules
COPY package*.json ./

CMD ["node", "dist/index.js"]
