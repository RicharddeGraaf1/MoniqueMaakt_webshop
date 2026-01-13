'use client'

import Link from 'next/link'
import { ShoppingCart, User, LogOut } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const itemCount = useCartStore((state) => state.items.length)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Check if user is logged in by checking for auth token
    const checkAuth = () => {
      const token = document.cookie.split('; ').find(row => row.startsWith('auth-token='))
      setIsLoggedIn(!!token)
    }
    checkAuth()
  }, [])

  const handleLogout = async () => {
    const response = await fetch('/api/auth/logout', { method: 'POST' })
    if (response.ok) {
      setIsLoggedIn(false)
      window.location.href = '/'
    }
  }

  return (
    <nav className="bg-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="text-3xl font-serif font-bold text-primary tracking-wide">
              Monique Maakt
            </Link>
          </div>
          <div className="flex items-center space-x-8">
            <Link href="/products" className="text-stone-600 hover:text-primary transition-colors font-medium">
              Producten
            </Link>
            <Link href="/about" className="text-stone-600 hover:text-primary transition-colors font-medium">
              Over
            </Link>
            <Link
              href="/cart"
              className="relative text-stone-600 hover:text-primary flex items-center transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            {isLoggedIn ? (
              <>
                <Link href="/orders" className="text-stone-600 hover:text-primary font-medium">
                  Bestellingen
                </Link>
                <Link href="/admin" className="text-stone-600 hover:text-primary font-medium">
                  Admin
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-stone-600 hover:text-primary flex items-center transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-stone-600 hover:text-primary flex items-center font-medium transition-colors">
                  <User className="h-5 w-5 mr-1" />
                  Inloggen
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

