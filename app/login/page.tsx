'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'

const loginSchema = z.object({
  email: z.string().email('Ongeldig e-mailadres'),
  password: z.string().min(6, 'Wachtwoord moet minimaal 6 tekens lang zijn'),
  name: z.string().optional(),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setError('')
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok) {
        router.push('/')
        router.refresh()
      } else {
        setError(result.error || 'Er ging iets mis')
      }
    } catch (error) {
      setError('Er ging iets mis bij het inloggen')
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {isLogin ? 'Inloggen' : 'Registreren'}
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Naam
              </label>
              <input
                type="text"
                {...register('name')}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              E-mailadres
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
              Wachtwoord
            </label>
            <input
              type="password"
              {...register('password')}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            {isLogin ? 'Inloggen' : 'Registreren'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:underline"
          >
            {isLogin
              ? 'Nog geen account? Registreer hier'
              : 'Al een account? Log hier in'}
          </button>
        </div>
      </div>
    </div>
  )
}

