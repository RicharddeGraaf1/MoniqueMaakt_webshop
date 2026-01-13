'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const checkoutSchema = z.object({
  name: z.string().min(1, 'Naam is verplicht'),
  email: z.string().email('Ongeldig e-mailadres'),
  address: z.string().min(1, 'Adres is verplicht'),
  city: z.string().min(1, 'Stad is verplicht'),
  postal: z.string().min(1, 'Postcode is verplicht'),
  country: z.string().default('NL'),
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotal, clearCart, loadFromStorage } = useCartStore()
  const [isProcessing, setIsProcessing] = useState(false)
  
  useEffect(() => {
    loadFromStorage()
  }, [loadFromStorage])

  const total = getTotal()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  })

  const onSubmit = async (data: CheckoutFormData) => {
    if (items.length === 0) {
      alert('Je winkelwagen is leeg')
      return
    }

    setIsProcessing(true)

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          shipping: data,
        }),
      })

      const result = await response.json()

      if (response.ok && result.paymentUrl) {
        clearCart()
        window.location.href = result.paymentUrl
      } else {
        alert(result.error || 'Er ging iets mis bij het aanmaken van de bestelling')
        setIsProcessing(false)
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Er ging iets mis bij het afrekenen')
      setIsProcessing(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Afrekenen</h1>
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 mb-4">Je winkelwagen is leeg.</p>
          <button
            onClick={() => router.push('/products')}
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Bekijk producten
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Afrekenen</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Verzendgegevens</h2>
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
                E-mailadres *
              </label>
              <input
                type="email"
                {...register('email')}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adres *
              </label>
              <input
                {...register('address')}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
              {errors.address && (
                <p className="text-red-600 text-sm mt-1">{errors.address.message}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Postcode *
                </label>
                <input
                  {...register('postal')}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
                {errors.postal && (
                  <p className="text-red-600 text-sm mt-1">{errors.postal.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stad *
                </label>
                <input
                  {...register('city')}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
                {errors.city && (
                  <p className="text-red-600 text-sm mt-1">{errors.city.message}</p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Land *
              </label>
              <input
                {...register('country')}
                defaultValue="NL"
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Bezig...' : 'Betaal met iDEAL'}
            </button>
          </form>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Bestelling</h2>
          <div className="space-y-4 mb-6">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span className="text-gray-700">
                  {item.name} x {item.quantity}
                </span>
                <span className="text-gray-900 font-semibold">
                  €{(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between text-xl font-bold">
              <span>Totaal:</span>
              <span className="text-blue-600">€{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

