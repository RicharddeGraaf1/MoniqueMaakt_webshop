'use client'

import { useCartStore } from '@/store/cartStore'
import Link from 'next/link'
import { Trash2 } from 'lucide-react'
import { useEffect } from 'react'

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal, loadFromStorage } = useCartStore()
  
  useEffect(() => {
    loadFromStorage()
  }, [loadFromStorage])

  const total = getTotal()

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Winkelwagen</h1>
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 mb-4">Je winkelwagen is leeg.</p>
          <Link
            href="/products"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Bekijk producten
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Winkelwagen</h1>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="divide-y divide-gray-200">
          {items.map((item) => (
            <div key={item.id} className="p-6 flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-gray-600">€{item.price.toFixed(2)} per stuk</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="w-12 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                <p className="text-lg font-semibold text-gray-900 w-24 text-right">
                  €{(item.price * item.quantity).toFixed(2)}
                </p>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xl font-semibold text-gray-900">Totaal:</span>
            <span className="text-2xl font-bold text-blue-600">€{total.toFixed(2)}</span>
          </div>
          <Link
            href="/checkout"
            className="block w-full bg-blue-600 text-white text-center px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Naar afrekenen
          </Link>
        </div>
      </div>
    </div>
  )
}

