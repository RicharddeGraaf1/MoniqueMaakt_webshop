import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Placeholder-data uit de eerste versie van de shop; wordt opgeruimd zolang er geen orders aan hangen
const placeholderProductSlugs = [
  'zilverenmaan-ketting',
  'gouden-zon-hanger',
  'parel-oorbellen',
  'boho-veren-oorbellen',
  'leren-wikkelarmband',
  'kralen-armband-set',
]
const placeholderCategorySlugs = ['kettingen', 'oorbellen', 'armbanden']

function beschrijving(intro: string, productinformatie: string[]) {
  return [
    intro,
    'Alles is handgemaakt. Kleine verschillen in afmetingen zijn hierdoor mogelijk.',
    'Productinformatie:\n' + productinformatie.map((regel) => `- ${regel}`).join('\n'),
    'Prijs is exclusief verzendkosten.',
  ].join('\n\n')
}

async function main() {
  console.log('Start seeding ...')

  await prisma.product.deleteMany({
    where: { slug: { in: placeholderProductSlugs }, orderItems: { none: {} } },
  })
  await prisma.category.deleteMany({
    where: { slug: { in: placeholderCategorySlugs }, products: { none: {} } },
  })

  // Categories
  const categories = [
    { name: 'Vilten speelgoed', slug: 'vilten-speelgoed', description: 'Handgemaakt speelgoed van vilt' },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    })
  }

  // Fetch categories to get IDs
  const dbCategories = await prisma.category.findMany()
  const catMap = new Map(dbCategories.map((c) => [c.slug, c.id]))

  // Products (bron: WhatsApp-berichten van Monique, 20 oktober 2026)
  const products = [
    {
      name: 'Speelgoed pasta: farfalle in bewaarzakje',
      slug: 'speelgoed-pasta-farfalle',
      description: beschrijving('Vilten speelgoed pasta: farfalle in een bewaarzakje.', [
        'Materiaal: 100% wolvilt',
        'Inhoud: 14 stuks',
        'Afmeting farfalle: 4,5 x 3 cm',
        'Afmeting bewaarzakje: 13 x 17 cm',
      ]),
      price: 5.0,
      stock: 1,
      fotos: 3,
      categoryId: catMap.get('vilten-speelgoed')!,
    },
    {
      name: 'Speelgoed pasta: ravioli in bewaarzakje',
      slug: 'speelgoed-pasta-ravioli',
      description: beschrijving('Vilten speelgoed pasta: ravioli in een bewaarzakje.', [
        'Materiaal: 100% wolvilt',
        'Inhoud: 12 stuks',
        'Afmeting ravioli: 4 x 4 cm',
        'Afmeting bewaarzakje: 13 x 17 cm',
      ]),
      price: 5.0,
      stock: 1,
      fotos: 3,
      categoryId: catMap.get('vilten-speelgoed')!,
    },
    {
      name: 'Boterham met sla, tomaat en spiegelei',
      slug: 'boterham-sla-tomaat-spiegelei',
      description: beschrijving('Vilten boterham belegd met 1 blaadje sla, 2 plakjes tomaat en 1 spiegelei.', [
        'Materiaal: 100% polyestervilt',
        'Afmeting boterham: 12 x 9 x 2 cm',
        'Afmeting ei: 11,5 x 7 cm',
        'Afmeting sla: 9 x 8 cm',
        'Afmeting tomaat: 5,5 cm',
        'Wasadvies: handwas 30° / zachte zeep',
      ]),
      price: 6.0,
      stock: 1,
      fotos: 4,
      categoryId: catMap.get('vilten-speelgoed')!,
    },
    {
      name: 'Aardbeien met slagroom',
      slug: 'aardbeien-met-slagroom',
      description: beschrijving('Vilten aardbeien met slagroom.', [
        'Materiaal: 100% polyestervilt',
        'Afmeting aardbei: 3 x 3 x 3 cm',
        'Afmeting slagroom: 5 x 5 cm',
        'Wasadvies: handwas 30° / zachte zeep',
      ]),
      price: 8.5,
      stock: 1,
      fotos: 3,
      categoryId: catMap.get('vilten-speelgoed')!,
    },
    {
      name: 'Banaan met 6 partjes',
      slug: 'banaan-met-partjes',
      description: beschrijving('Vilten banaan met 6 partjes banaan.', [
        'Materiaal: 100% polyestervilt',
        'Afmeting banaan: 16 cm',
        'Afmeting partjes: 3,5 x 3,5 cm',
        'Wasadvies: handwas 30° / zachte zeep',
      ]),
      price: 6.0,
      stock: 1,
      fotos: 3,
      categoryId: catMap.get('vilten-speelgoed')!,
    },
    {
      name: 'Stokbrood heel en belegd',
      slug: 'stokbrood-heel-en-belegd',
      description: beschrijving(
        'Vilten stokbrood: één heel stokbrood en één stokbrood belegd met 3 blaadjes sla (1 groot, 2 klein), 3 plakjes tomaat en 6 plakjes gekookt ei.',
        [
          'Materiaal: 100% polyestervilt',
          'Afmeting stokbrood: 23 cm',
          'Afmeting tomaat: 5,5 cm',
          'Afmeting ei: 6 x 4 cm',
          'Afmeting sla groot: 14 x 11 cm',
          'Afmeting sla klein: 10 x 9 cm',
        ]
      ),
      price: 11.5,
      stock: 1,
      fotos: 7,
      categoryId: catMap.get('vilten-speelgoed')!,
    },
    {
      name: 'Boodschappen- of opbergtasje',
      slug: 'boodschappen-opbergtasje',
      description: beschrijving('Vilten boodschappen- of opbergtasje.', [
        'Materiaal: 100% polyestervilt',
        'Afmeting: 22 x 22 x 4 cm',
        'Wasadvies: handwas 30° / zachte zeep',
      ]),
      price: 7.0,
      stock: 1,
      fotos: 2,
      categoryId: catMap.get('vilten-speelgoed')!,
    },
    {
      name: 'Broodje met sla, tomaat en kaas',
      slug: 'broodje-sla-tomaat-kaas',
      description: beschrijving(
        'Vilten broodje belegd met 2 blaadjes sla, 2 plakjes tomaat en een plakje kaas. Extra: 2 hele tomaatjes.',
        [
          'Materiaal: 100% polyestervilt',
          'Afmeting broodje: 9 x 9 cm',
          'Afmeting plakje tomaat: 5,5 cm',
          'Afmeting blaadje sla: 11 x 9 cm',
          'Afmeting plakje kaas: 12 x 7,5 cm',
          'Afmeting tomaatjes: 4 x 3 cm',
        ]
      ),
      price: 7.5,
      stock: 1,
      fotos: 4,
      categoryId: catMap.get('vilten-speelgoed')!,
    },
    {
      name: 'IJsjes (5 stuks)',
      slug: 'ijsjes-5-stuks',
      description: beschrijving('Vilten ijsjes, 5 stuks.', [
        'Materiaal: 100% polyestervilt',
        'Afmeting: 6 x 8 cm',
        'Houten stokje: 3,5 cm',
        'Wasadvies: handwas 30° / zachte zeep',
      ]),
      price: 5.0,
      stock: 1,
      fotos: 3,
      categoryId: catMap.get('vilten-speelgoed')!,
    },
  ]

  for (const { fotos, ...prod } of products) {
    // Foto's staan in public/products/<slug>/1.jpg, 2.jpg, ...; de eerste is de hoofdfoto
    const paden = Array.from({ length: fotos }, (_, i) => `/products/${prod.slug}/${i + 1}.jpg`)
    const data = { ...prod, image: paden[0], images: paden.slice(1) }
    // Voorraad niet overschrijven als die al via het admin-paneel is aangepast
    const { stock, ...gegevens } = data
    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: gegevens,
      create: data,
    })
  }

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
