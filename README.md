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

3. Maak de database aan en run migrations:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

4. (Optioneel) Seed de database met voorbeelddata:
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

De webshop gebruikt Prisma met SQLite voor ontwikkeling. Voor productie wordt aangeraden om PostgreSQL of MySQL te gebruiken.

## Admin Access

Standaard wordt er geen admin gebruiker aangemaakt. Gebruik de seed script of maak handmatig een admin gebruiker aan in de database.

## License

MIT

