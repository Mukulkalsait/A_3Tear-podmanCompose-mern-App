FROM node:20-alpine AS builder

WORKDIR /app

# accept build ARG
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

COPY package.json package-lock.json ./
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY index.html ./
COPY public ./public
COPY src ./src

RUN npm install
RUN npm run build

FROM node:20-alpine
WORKDIR /app

RUN npm install -g serve
COPY --from=builder /app/dist ./dist

EXPOSE 4173
ENTRYPOINT ["serve", "-s", "dist", "-l", "4173", "-n"]
