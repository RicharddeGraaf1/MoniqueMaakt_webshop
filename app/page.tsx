import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'

export default async function Home() {
  const featuredProducts = await prisma.product.findMany({
    take: 6,
    include: {
      category: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-serif font-bold text-stone-800 mb-6 tracking-tight">
          Welkom bij Monique Maakt
        </h1>
        <p className="text-xl text-stone-600 italic font-light max-w-2xl mx-auto">
          Ontdek unieke, handgemaakte producten met liefde en vakmanschap gecreëerd.
        </p>
      </div>

      <div className="mb-16 text-center">
        <Link
          href="/products"
          className="inline-block bg-primary text-white px-8 py-4 rounded-full hover:bg-primary-hover transition-colors shadow-sm text-lg font-medium"
        >
          Bekijk alle producten
        </Link>
      </div>

      <div>
        <h2 className="text-3xl font-serif font-bold text-stone-800 mb-8 text-center">Uitgelichte producten</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.length > 0 ? (
            featuredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden hover:shadow-md transition-shadow group"
              >
                {product.image && (
                  <div className="aspect-square bg-stone-100 relative overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-serif font-semibold text-stone-800 mb-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-stone-500 mb-3">{product.category.name}</p>
                  <p className="text-secondary font-bold text-xl">
                    €{product.price.toFixed(2)}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center text-stone-500 py-12">
              <p>Nog geen producten beschikbaar.</p>
              <Link href="/admin/products/new" className="text-primary hover:underline mt-2 inline-block">
                Voeg je eerste product toe
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

