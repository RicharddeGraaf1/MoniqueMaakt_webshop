# Monique Maakt Webshop

Een moderne webshop gebouwd met Next.js, TypeScript, Prisma en Mollie iDEAL betalingen.

## Functionaliteiten

- 🛍️ Product catalogus met categorieën
- 🛒 Winkelwagen functionaliteit
- 💳 iDEAL betalingen via Mollie
- 👤 User authenticatie
- 📦 Orderbeheer
- 🔐 Admin panel voor productbeheer
- 📱 Responsive design

## Setup

1. Installeer dependencies:
```bash
npm install
```

2. Kopieer `.env.example` naar `.env` en vul de waarden in:
```bash
cp .env.example .env
```

3. Zet het schema in de database (PostgreSQL, zie `DATABASE_URL`):
```bash
npx prisma db push
```

4. Zet de producten in de database:
```bash
npm run seed
```

5. Start de development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in je browser.

## Mollie Setup

Voor iDEAL betalingen heb je een Mollie account nodig:
1. Maak een account aan op [mollie.com](https://www.mollie.com)
2. Vraag een API key aan in je dashboard
3. Plak de API key in je `.env` bestand als `MOLLIE_API_KEY`
4. Voor testing gebruik je de test key (begint met `test_`)
5. Voor productie gebruik je de live key (begint met `live_`)

## Database

De webshop gebruikt Prisma met PostgreSQL. Het schema wordt bijgewerkt met `prisma db push`; in productie gebeurt dat bij het opstarten van de container.

De producten staan in [prisma/seed.ts](prisma/seed.ts). De foto's staan in `public/products/<slug>/` (1.jpg is de hoofdfoto). Opnieuw seeden werkt namen, beschrijvingen, prijzen en foto's bij, maar laat de voorraad staan.

## Deployment (Coolify)

De shop draait als Docker-container op Coolify (server apps-1):

- **Database**: PostgreSQL-resource in Coolify.
- **App**: uit deze repo, build pack *Dockerfile*, poort 3000, health-check op `/api/health`.
- **Variabelen**: `DATABASE_URL` (interne URL van de database), `MOLLIE_API_KEY`, `APP_URL` (bv. `https://moniquemaakt.nl`), `JWT_SECRET`.
- **Seeden**: in de terminal van de app-container `npm run seed`.

## Admin Access

Standaard wordt er geen admin gebruiker aangemaakt. Registreer een account via de site en zet daarna in de database `role` op `admin` voor die gebruiker. Log daarna opnieuw in: de rol zit in het login-token.

## License

MIT

