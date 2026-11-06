FROM node:20-alpine

# Prisma heeft openssl nodig; curl voor de health-check van Coolify
RUN apk add --no-cache openssl curl

WORKDIR /app

COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci

COPY . .
RUN npm run build

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

# Schema bijwerken bij het opstarten: tijdens de build is de database niet bereikbaar.
# Dev-dependencies blijven in de image zodat `npm run seed` in de container werkt.
CMD ["sh", "-c", "npx prisma db push --skip-generate && npm start"]
