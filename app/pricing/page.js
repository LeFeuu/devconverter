'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import AuthModal from '../components/AuthModal'

export default function PricingPage() {
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  const handleUpgrade = async () => {
    if (!user) {
      setShowAuthModal(true)
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          priceId: 'price_1SbpHh1d4S9Vpl960mk81QWM',
          email: user.email
        }),
      })
      const { url } = await response.json()
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Erreur lors de la redirection vers Stripe')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              DevConverter
            </Link>
            <Link href="/converter" className="text-gray-700 hover:text-blue-600">
              Back to Converter
            </Link>
          </div>
        </div>
      </nav>

      {/* Pricing */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600">
            Choose the plan that fits your needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white rounded-lg shadow-sm border-2 border-gray-200 p-8">
            <h3 className="text-2xl font-bold mb-2">Free</h3>
            <div className="text-4xl font-bold mb-6">
              $0<span className="text-lg text-gray-600">/month</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                5 conversions per day
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                All formats (JSON, CSV, YAML, XML)
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Client-side processing
              </li>
              <li className="flex items-center">
                <span className="text-gray-400 mr-2">✗</span>
                <span className="text-gray-400">API access</span>
              </li>
            </ul>
            <Link 
              href="/converter"
              className="block text-center bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300"
            >
              Current Plan
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="bg-blue-600 text-white rounded-lg shadow-lg border-2 border-blue-700 p-8 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-bold">
              MOST POPULAR
            </div>
            <h3 className="text-2xl font-bold mb-2">Pro</h3>
            <div className="text-4xl font-bold mb-6">
              $5<span className="text-lg opacity-80">/month</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <span className="text-yellow-400 mr-2">✓</span>
                Unlimited conversions
              </li>
              <li className="flex items-center">
                <span className="text-yellow-400 mr-2">✓</span>
                All formats (JSON, CSV, YAML, XML)
              </li>
              <li className="flex items-center">
                <span className="text-yellow-400 mr-2">✓</span>
                Client-side processing
              </li>
              <li className="flex items-center">
                <span className="text-yellow-400 mr-2">✓</span>
                API access (coming soon)
              </li>
              <li className="flex items-center">
                <span className="text-yellow-400 mr-2">✓</span>
                Priority support
              </li>
            </ul>
            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="block w-full text-center bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Upgrade to Pro'}
            </button>
          </div>
        </div>
      </div>
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  )
}
