'use client'

import { useCartStore } from '@/store/cartStore'
import { useState, useEffect } from 'react'

interface Product {
  id: string
  name: string
  price: number
  image?: string | null
  stock: number
}

export default function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem)
  const loadFromStorage = useCartStore((state) => state.loadFromStorage)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    loadFromStorage()
  }, [loadFromStorage])

  const handleAddToCart = () => {
    if (product.stock < quantity) {
      alert('Niet genoeg voorraad')
      return
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image || undefined,
      quantity,
    })

    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (product.stock === 0) {
    return (
      <button
        disabled
        className="w-full bg-gray-400 text-white px-6 py-3 rounded-lg cursor-not-allowed"
      >
        Uitverkocht
      </button>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <label className="text-stone-700 font-medium">Aantal:</label>
        <div className="relative">
          <input
            type="number"
            min="1"
            max={product.stock}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="border border-stone-200 rounded-lg px-4 py-2 w-24 text-stone-800 focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-center"
          />
        </div>
      </div>
      <button
        onClick={handleAddToCart}
        className={`w-full px-8 py-4 rounded-full font-semibold transition-all duration-300 shadow-sm hover:shadow-md ${added
            ? 'bg-green-600 text-white'
            : 'bg-primary text-white hover:bg-primary-hover'
          }`}
      >
        {added ? 'Toegevoegd aan winkelwagen!' : 'Voeg toe aan winkelwagen'}
      </button>
    </div>
  )
}

