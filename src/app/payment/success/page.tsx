'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const [countdown, setCountdown] = useState(5)
  
  const sessionId = searchParams.get('session_id')
  
  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    
    // Countdown redirect
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push('/dashboard')
        }
        return prev - 1
      })
    }, 1000)
    
    return () => clearInterval(timer)
  }, [user, router])
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Payment Successful!
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          Welcome to MathMinds Premium! You now have access to all premium features.
        </p>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <h2 className="font-semibold text-gray-900 mb-2">
            What's next?
          </h2>
          <ul className="text-left space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              Explore unlimited practice problems
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              View step-by-step solutions
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              Download custom worksheets
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              Track your progress with advanced analytics
            </li>
          </ul>
        </div>
        
        <p className="text-gray-600 mb-4">
          Redirecting to your dashboard in {countdown} seconds...
        </p>
        
        <div className="space-y-2">
          <Link
            href="/dashboard"
            className="block w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Go to Dashboard Now
          </Link>
          
          <Link
            href="/practice"
            className="block w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
          >
            Start Practicing
          </Link>
        </div>
        
        {sessionId && (
          <p className="mt-6 text-sm text-gray-500">
            Reference: {sessionId}
          </p>
        )}
      </div>
    </div>
  )
}