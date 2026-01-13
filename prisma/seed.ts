import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding ...')

  // Categories
  const categories = [
    { name: 'Kettingen', slug: 'kettingen', description: 'Handgemaakte kettingen' },
    { name: 'Oorbellen', slug: 'oorbellen', description: 'Unieke oorbellen' },
    { name: 'Armbanden', slug: 'armbanden', description: 'Stijlvolle armbanden' },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }

  // Fetch categories to get IDs
  const dbCategories = await prisma.category.findMany()
  const catMap = new Map(dbCategories.map((c) => [c.slug, c.id]))

  // Products
  const products = [
    {
      name: 'Zilverenmaan Ketting',
      slug: 'zilverenmaan-ketting',
      description: 'Een prachtige zilveren ketting met maansteen hanger.',
      price: 29.95,
      stock: 10,
      image: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75',
      categoryId: catMap.get('kettingen')!,
    },
    {
      name: 'Gouden Zon Hanger',
      slug: 'gouden-zon-hanger',
      description: 'Vergulde ketting met zon symbool.',
      price: 34.50,
      stock: 5,
      image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a',
      categoryId: catMap.get('kettingen')!,
    },
    {
      name: 'Parel Oorbellen',
      slug: 'parel-oorbellen',
      description: 'Klassieke zoetwaterparel oorbellen.',
      price: 19.95,
      stock: 15,
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908',
      categoryId: catMap.get('oorbellen')!,
    },
    {
      name: 'Boho Veren Oorbellen',
      slug: 'boho-veren-oorbellen',
      description: 'Lange oorbellen in bohemian stijl.',
      price: 14.95,
      stock: 8,
      image: 'https://images.unsplash.com/photo-1635767798638-3e2523422dc0',
      categoryId: catMap.get('oorbellen')!,
    },
    {
      name: 'Leren Wikkelarmband',
      slug: 'leren-wikkelarmband',
      description: 'Stoere leren armband die je kunt wikkelen.',
      price: 24.95,
      stock: 12,
      image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0',
      categoryId: catMap.get('armbanden')!,
    },
    {
      name: 'Kralen Armband Set',
      slug: 'kralen-armband-set',
      description: 'Set van 3 kralen armbandjes in zomerse kleuren.',
      price: 17.50,
      stock: 20,
      image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a',
      categoryId: catMap.get('armbanden')!,
    },
  ]

  for (const prod of products) {
    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {},
      create: prod,
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
