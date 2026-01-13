import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import AddToCartButton from '@/components/AddToCartButton'

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: {
      category: true,
    },
  })

  if (!product) {
    notFound()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {product.image && (
          <div className="aspect-square bg-stone-100 rounded-2xl overflow-hidden shadow-sm border border-stone-100 relative">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="lg:py-4">
          <h1 className="text-4xl font-serif font-bold text-stone-800 mb-4">{product.name}</h1>
          <p className="text-stone-500 mb-6 text-lg">
            Categorie: <span className="font-medium text-stone-700">{product.category.name}</span>
          </p>
          <div className="mb-8">
            <p className="text-4xl font-bold text-secondary mb-2">
              €{product.price.toFixed(2)}
            </p>
            <p className="text-stone-500 text-sm italic">Inclusief BTW</p>
          </div>

          {product.description && (
            <div className="mb-8 bg-white p-6 rounded-xl border border-stone-100 shadow-sm">
              <h2 className="text-xl font-serif font-semibold text-stone-800 mb-3">Beschrijving</h2>
              <p className="text-stone-600 whitespace-pre-wrap leading-relaxed">{product.description}</p>
            </div>
          )}

          <div className="mb-8">
            <div className={`inline-flex items-center px-4 py-2 rounded-full border ${product.stock > 0 ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'}`}>
              <span className={`w-2 h-2 rounded-full mr-2 ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span className="font-medium">
                {product.stock > 0 ? `${product.stock} op voorraad` : 'Uitverkocht'}
              </span>
            </div>
          </div>
          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  )
}

