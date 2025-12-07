'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import AuthModal from './AuthModal'

export default function AuthButton() {
  const [user, setUser] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-700">{user.email}</span>
        <button
          onClick={handleSignOut}
          className="text-sm text-gray-700 hover:text-blue-600"
        >
          Sign Out
        </button>
      </div>
    )
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700"
      >
        Sign In
      </button>
      {showModal && <AuthModal onClose={() => setShowModal(false)} />}
    </>
  )
}
