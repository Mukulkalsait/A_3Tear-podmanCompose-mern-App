FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json tsconfig.json ./
COPY src ./src
COPY data ./data

RUN npm install
RUN npm run build

FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/data ./data

EXPOSE 4000

CMD ["node", "dist/index.js"]



