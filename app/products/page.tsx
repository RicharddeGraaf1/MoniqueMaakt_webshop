import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string }
}) {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: searchParams.category
        ? {
          category: {
            slug: searchParams.category,
          },
        }
        : undefined,
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    }),
    prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
    }),
  ])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-serif font-bold text-stone-800 mb-8 tracking-tight">Alle producten</h1>

      {categories.length > 0 && (
        <div className="mb-12">
          <h2 className="text-lg font-semibold text-stone-600 mb-4 font-serif">Categorieën</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/products"
              className={`px-5 py-2.5 rounded-full transition-all duration-200 text-sm font-medium ${!searchParams.category
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
                }`}
            >
              Alle
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className={`px-5 py-2.5 rounded-full transition-all duration-200 text-sm font-medium ${searchParams.category === category.slug
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
                  }`}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {products.length === 0 ? (
        <div className="text-center py-16 bg-stone-50 rounded-2xl border border-stone-100">
          <p className="text-stone-500 text-lg">Geen producten gevonden.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group block bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-stone-100"
            >
              <div className="aspect-square bg-stone-100 relative overflow-hidden">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-400">
                    <span className="text-sm">Geen afbeelding</span>
                  </div>
                )}
                {product.stock <= 0 && (
                  <div className="absolute top-3 right-3 bg-red-500/90 text-white text-xs px-3 py-1 rounded-full font-medium backdrop-blur-sm">
                    Uitverkocht
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="text-lg font-serif font-semibold text-stone-800 group-hover:text-primary transition-colors mb-2">
                  {product.name}
                </h3>
                <p className="text-sm text-stone-500 mb-3">{product.category.name}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-secondary">
                    €{product.price.toFixed(2)}
                  </span>
                  {product.stock > 0 && (
                    <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      Op voorraad
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
