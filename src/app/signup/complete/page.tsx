'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getAuthErrorMessage } from '@/lib/auth-errors'

export default function SignupCompletePage() {
  const [status, setStatus] = useState<'loading' | 'creating' | 'success' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    const completeSignup = async () => {
      const sessionId = searchParams.get('session_id')
      
      if (!sessionId) {
        setError('Invalid payment session')
        setStatus('error')
        return
      }

      // Get stored signup data
      const signupDataStr = sessionStorage.getItem('signupData')
      if (!signupDataStr) {
        setError('Signup data not found. Please start over.')
        setStatus('error')
        return
      }

      const signupData = JSON.parse(signupDataStr)
      setStatus('creating')

      try {
        // Verify the checkout session with backend
        const verifyResponse = await fetch('/api/stripe/verify-checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId }),
        })

        if (!verifyResponse.ok) {
          throw new Error('Payment verification failed')
        }

        const { customerId, subscriptionId } = await verifyResponse.json()

        // Create the user account with email confirmation disabled
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email: signupData.email,
          password: signupData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: {
              full_name: signupData.fullName,
              grade_level: parseInt(signupData.gradeLevel),
              stripe_customer_id: customerId,
              stripe_subscription_id: subscriptionId,
            },
          },
        })

        if (signUpError) {
          throw signUpError
        }

        if (authData.user) {
          // Update the user's subscription status in the database
          const { error: updateError } = await supabase
            .from('profiles')
            .update({
              subscription_status: 'active',
              stripe_customer_id: customerId,
              stripe_subscription_id: subscriptionId,
              updated_at: new Date().toISOString()
            })
            .eq('id', authData.user.id)
          
          if (updateError) {
            console.error('Error updating subscription status:', updateError)
          }
          
          // If the user email needs confirmation, try to sign them in anyway since they paid
          if (authData.user.identities && authData.user.identities.length === 0) {
            // Try to sign in the user
            const { error: signInError } = await supabase.auth.signInWithPassword({
              email: signupData.email,
              password: signupData.password,
            })
            
            if (signInError) {
              console.error('Auto sign-in failed:', signInError)
              // Still proceed since account was created
            }
          }
          
          // Clear signup data from session storage
          sessionStorage.removeItem('signupData')
          
          setStatus('success')
          
          // Redirect to dashboard after a short delay
          setTimeout(() => {
            router.push('/dashboard')
          }, 2000)
        }
      } catch (err) {
        console.error('Signup completion error:', err)
        setError(getAuthErrorMessage(err))
        setStatus('error')
      }
    }

    completeSignup()
  }, [searchParams, router, supabase])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying payment...</p>
        </div>
      </div>
    )
  }

  if (status === 'creating') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Creating your account...</p>
        </div>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="rounded-full h-12 w-12 bg-green-100 mx-auto flex items-center justify-center">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="mt-4 text-xl font-semibold text-gray-900">Account created successfully!</h2>
          <p className="mt-2 text-gray-600">Redirecting to your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Account Creation Failed</h2>
          <div className="mt-4 rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">{error || 'An unexpected error occurred'}</p>
          </div>
          <div className="mt-6 space-y-2">
            <button
              onClick={() => router.push('/signup')}
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push('/login')}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}