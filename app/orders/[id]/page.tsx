import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import Link from 'next/link'

export default async function OrderPage({ params }: { params: { id: string } }) {
  const user = await requireAuth()
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      user: true,
    },
  })

  if (!order) {
    notFound()
  }

  // Check if user owns this order or is admin
  if (!user || (order.userId !== user.userId && user.role !== 'admin')) {
    notFound()
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Bestelling #{order.id.slice(0, 8)}
      </h1>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">Status:</span>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[order.status] || statusColors.pending
            }`}>
            {order.status}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-600">Besteld op</p>
            <p className="font-semibold">
              {new Date(order.createdAt).toLocaleDateString('nl-NL')}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Totaal</p>
            <p className="font-semibold text-xl text-blue-600">
              €{order.total.toFixed(2)}
            </p>
          </div>
        </div>
        <div className="border-t pt-4">
          <h2 className="font-semibold text-gray-900 mb-2">Verzendgegevens</h2>
          <p className="text-gray-700">{order.shippingName}</p>
          <p className="text-gray-700">{order.shippingEmail}</p>
          <p className="text-gray-700">{order.shippingAddress}</p>
          <p className="text-gray-700">
            {order.shippingPostal} {order.shippingCity}
          </p>
          <p className="text-gray-700">{order.shippingCountry}</p>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Bestelde items</h2>
        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between items-center border-b pb-4">
              <div>
                <p className="font-semibold text-gray-900">{item.product.name}</p>
                <p className="text-sm text-gray-600">
                  Aantal: {item.quantity} x €{item.price.toFixed(2)}
                </p>
              </div>
              <p className="font-semibold text-gray-900">
                €{(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t">
          <div className="flex justify-between text-xl font-bold">
            <span>Totaal:</span>
            <span className="text-blue-600">€{order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <Link
          href="/orders"
          className="text-blue-600 hover:underline"
        >
          ← Terug naar bestellingen
        </Link>
      </div>
    </div>
  )
}

