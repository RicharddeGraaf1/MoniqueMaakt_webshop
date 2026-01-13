import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import Link from 'next/link'

export default async function AdminPage() {
  await requireAdmin()

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/admin/products"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Producten</h2>
          <p className="text-gray-600">Beheer producten en categorieën</p>
        </Link>
        <Link
          href="/admin/orders"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Bestellingen</h2>
          <p className="text-gray-600">Bekijk en beheer alle bestellingen</p>
        </Link>
      </div>
    </div>
  )
}

