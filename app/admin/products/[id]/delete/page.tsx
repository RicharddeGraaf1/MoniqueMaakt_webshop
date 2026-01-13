import { notFound, redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import DeleteProductForm from '@/components/DeleteProductForm'

export default async function DeleteProductPage({ params }: { params: { id: string } }) {
  await requireAdmin()

  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: {
      category: true,
    },
  })

  if (!product) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Product verwijderen</h1>
      <DeleteProductForm product={product} />
    </div>
  )
}

