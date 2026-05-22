
#------------------------------------------------------------
# STAGE  1 
#------------------------------------------------------------

FROM node:20-alpine AS builder
# we used this image AS BUILDER ...
# full size image for installation. 

WORKDIR /app

COPY package*.json tsconfig.json ./
COPY src ./src
COPY data ./data

RUN npm install
RUN npm run build

#------------------------------------------------------------
# STAGE 2
#------------------------------------------------------------
FROM node:20-alpine
# small size image for running only.

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

COPY package*.json ./
RUN npm install --omit=dev

# we took things from the BUILDER image...
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/data ./data

EXPOSE 4000

CMD ["node", "dist/index.js"]



