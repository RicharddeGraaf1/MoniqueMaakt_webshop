import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function AdminProductsPage() {
  await requireAdmin()

  const products = await prisma.product.findMany({
    include: {
      category: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Producten</h1>
        <Link
          href="/admin/products/new"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Nieuw product
        </Link>
      </div>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Naam
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categorie
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prijs
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Voorraad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acties
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{product.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{product.category.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">€{product.price.toFixed(2)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm ${
                    product.stock > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {product.stock}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Bewerken
                  </Link>
                  <Link
                    href={`/admin/products/${product.id}/delete`}
                    className="text-red-600 hover:text-red-900"
                  >
                    Verwijderen
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>Nog geen producten.</p>
            <Link
              href="/admin/products/new"
              className="text-blue-600 hover:underline mt-2 inline-block"
            >
              Voeg je eerste product toe
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

