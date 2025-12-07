'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { jsonToCsv, csvToJson, jsonToYaml, yamlToJson } from '@/lib/converters'
import AuthModal from '../components/AuthModal'

export default function ConverterPage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [fromFormat, setFromFormat] = useState('JSON')
  const [toFormat, setToFormat] = useState('CSV')
  const [conversionsToday, setConversionsToday] = useState(0)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [user, setUser] = useState(null)
  const [isPro, setIsPro] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const supabase = createClient()

  // Charger l'utilisateur et son statut Pro
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      if (user) {
        // Récupérer le profil avec le statut is_pro
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_pro')
          .eq('id', user.id)
          .single()
        
        if (profile) {
          setIsPro(profile.is_pro)
        }
      }
    }
    getUser()
  }, [])

  // Charger le compteur de conversions depuis localStorage (seulement pour utilisateurs gratuits)
  useEffect(() => {
    if (!isPro) {
      const today = new Date().toDateString()
      const stored = localStorage.getItem('conversions')
      if (stored) {
        const data = JSON.parse(stored)
        if (data.date === today) {
          setConversionsToday(data.count)
        } else {
          localStorage.setItem('conversions', JSON.stringify({ date: today, count: 0 }))
        }
      } else {
        localStorage.setItem('conversions', JSON.stringify({ date: today, count: 0 }))
      }
    }
  }, [isPro])

  const incrementConversions = () => {
    const today = new Date().toDateString()
    const newCount = conversionsToday + 1
    setConversionsToday(newCount)
    localStorage.setItem('conversions', JSON.stringify({ date: today, count: newCount }))
  }

  const handleConvert = () => {
    // Vérifier si l'utilisateur doit se connecter
    if (!user) {
      setShowAuthModal(true)
      return
    }

    // Vérifier la limite gratuite (seulement pour non-Pro)
    if (!isPro && conversionsToday >= 5) {
      setShowUpgradeModal(true)
      return
    }

    // Vérifier que les formats sont différents
    if (fromFormat === toFormat) {
      setOutput('Error: Please select different input and output formats')
      return
    }

    let result
    const conversionKey = `${fromFormat}-${toFormat}`

    switch (conversionKey) {
      case 'JSON-CSV':
        result = jsonToCsv(input)
        break
      case 'CSV-JSON':
        result = csvToJson(input)
        break
      case 'JSON-YAML':
        result = jsonToYaml(input)
        break
      case 'YAML-JSON':
        result = yamlToJson(input)
        break
      default:
        result = { success: false, error: `Conversion from ${fromFormat} to ${toFormat} not supported yet` }
    }

    if (result.success) {
      setOutput(result.result)
      // Incrémenter seulement pour les utilisateurs gratuits
      if (!isPro) {
        incrementConversions()
      }
    } else {
      setOutput(`Error: ${result.error}`)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output)
    alert('Copied to clipboard!')
  }

  const formats = ['JSON', 'CSV', 'YAML']

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              DevConverter
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {conversionsToday}/5 free conversions today
              </span>
              <Link 
                href="/pricing" 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Upgrade to Pro
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Converter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {/* Format Selectors */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <select 
              value={fromFormat}
              onChange={(e) => setFromFormat(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {formats.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
            
            <span className="text-2xl">→</span>
            
            <select 
              value={toFormat}
              onChange={(e) => setToFormat(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {formats.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          {/* Input/Output */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Input ({fromFormat})
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Paste your ${fromFormat} here...`}
                className="w-full h-96 p-4 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Output ({toFormat})
              </label>
              <textarea
                value={output}
                readOnly
                placeholder="Converted result will appear here..."
                className="w-full h-96 p-4 border border-gray-300 rounded-lg font-mono text-sm bg-gray-50"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={handleConvert}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Convert
            </button>
            <button
              onClick={copyToClipboard}
              disabled={!output}
              className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition disabled:opacity-50"
            >
              Copy Output
            </button>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md mx-4">
            <h2 className="text-2xl font-bold mb-4">Free Limit Reached</h2>
            <p className="text-gray-600 mb-6">
              You've used your 5 free conversions for today. 
              Upgrade to Pro for unlimited conversions!
            </p>
            <div className="flex gap-4">
              <Link 
                href="/pricing"
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg text-center font-semibold hover:bg-blue-700"
              >
                Upgrade to Pro
              </Link>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
