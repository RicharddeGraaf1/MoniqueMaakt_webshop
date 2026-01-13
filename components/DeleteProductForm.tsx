'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Product {
  id: string
  name: string
  category: {
    name: string
  }
}

export default function DeleteProductForm({ product }: { product: Product }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState('')

  const handleDelete = async () => {
    if (!confirm(`Weet je zeker dat je "${product.name}" wilt verwijderen?`)) {
      return
    }

    setIsDeleting(true)
    setError('')

    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.push('/admin/products')
        router.refresh()
      } else {
        const result = await response.json()
        setError(result.error || 'Er ging iets mis')
        setIsDeleting(false)
      }
    } catch (error) {
      setError('Er ging iets mis bij het verwijderen')
      setIsDeleting(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-4">
        <p className="text-gray-700 mb-2">
          Weet je zeker dat je <strong>{product.name}</strong> wilt verwijderen?
        </p>
        <p className="text-sm text-gray-500">
          Categorie: {product.category.name}
        </p>
      </div>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <div className="flex space-x-4">
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 disabled:bg-gray-400"
        >
          {isDeleting ? 'Verwijderen...' : 'Verwijderen'}
        </button>
        <button
          onClick={() => router.push('/admin/products')}
          className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
        >
          Annuleren
        </button>
      </div>
    </div>
  )
}

