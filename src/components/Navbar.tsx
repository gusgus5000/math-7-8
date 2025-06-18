'use client'

import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'
import { useSubscription } from '@/contexts/SubscriptionContext'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const { user, loading: authLoading, signOut } = useAuth()
  const { subscription, loading: subLoading } = useSubscription()
  const router = useRouter()
  const loading = authLoading || subLoading

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 text-xl font-bold text-blue-600">
              <span className="text-2xl">🧠</span>
              <span>MathMinds</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="animate-pulse h-8 w-20 bg-gray-200 rounded"></div>
            ) : user ? (
              <>
                {subscription && (
                  <div className="flex items-center mr-2">
                    {subscription.tier === 'premium' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Premium
                      </span>
                    ) : subscription.tier === 'trial' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Trial
                        {subscription.trialDaysRemaining && (
                          <span className="ml-1">({subscription.trialDaysRemaining}d)</span>
                        )}
                      </span>
                    ) : (
                      <Link
                        href="/pricing"
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200"
                      >
                        Free • Upgrade
                      </Link>
                    )}
                  </div>
                )}
                <Link
                  href="/dashboard"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}