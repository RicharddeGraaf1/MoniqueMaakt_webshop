'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const productSchema = z.object({
  name: z.string().min(1, 'Naam is verplicht'),
  slug: z.string().min(1, 'Slug is verplicht'),
  description: z.string().optional(),
  price: z.number().min(0, 'Prijs moet positief zijn'),
  image: z.string().url('Ongeldig URL').optional().or(z.literal('')),
  stock: z.number().int().min(0, 'Voorraad moet positief zijn'),
  categoryId: z.string().min(1, 'Categorie is verplicht'),
})

type ProductFormData = z.infer<typeof productSchema>

interface Category {
  id: string
  name: string
}

interface ProductFormProps {
  categories: Category[]
  product?: {
    id: string
    name: string
    slug: string
    description: string | null
    price: number
    image: string | null
    stock: number
    categoryId: string
  }
}

export default function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter()
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product ? {
      ...product,
      description: product.description || '',
      image: product.image || '',
    } : {
      name: '',
      slug: '',
      description: '',
      price: 0,
      image: '',
      stock: 0,
      categoryId: '',
    },
  })

  const onSubmit = async (data: ProductFormData) => {
    setError('')
    setIsSubmitting(true)

    try {
      const url = product ? `/api/admin/products/${product.id}` : '/api/admin/products'
      const method = product ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          image: data.image || null,
          description: data.description || null,
        }),
      })

      if (response.ok) {
        router.push('/admin/products')
        router.refresh()
      } else {
        const result = await response.json()
        setError(result.error || 'Er ging iets mis')
        setIsSubmitting(false)
      }
    } catch (error) {
      setError('Er ging iets mis bij het opslaan')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Naam *
          </label>
          <input
            {...register('name')}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          {errors.name && (
            <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Slug *
          </label>
          <input
            {...register('slug')}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="product-naam"
          />
          {errors.slug && (
            <p className="text-red-600 text-sm mt-1">{errors.slug.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Beschrijving
          </label>
          <textarea
            {...register('description')}
            rows={4}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prijs (€) *
            </label>
            <input
              type="number"
              step="0.01"
              {...register('price', { valueAsNumber: true })}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            {errors.price && (
              <p className="text-red-600 text-sm mt-1">{errors.price.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Voorraad *
            </label>
            <input
              type="number"
              {...register('stock', { valueAsNumber: true })}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            {errors.stock && (
              <p className="text-red-600 text-sm mt-1">{errors.stock.message}</p>
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Afbeelding URL
          </label>
          <input
            type="url"
            {...register('image')}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="https://example.com/image.jpg"
          />
          {errors.image && (
            <p className="text-red-600 text-sm mt-1">{errors.image.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categorie *
          </label>
          <select
            {...register('categoryId')}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Selecteer categorie</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="text-red-600 text-sm mt-1">{errors.categoryId.message}</p>
          )}
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isSubmitting ? 'Opslaan...' : 'Opslaan'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/products')}
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
          >
            Annuleren
          </button>
        </div>
      </form>
    </div>
  )
}

