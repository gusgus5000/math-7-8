'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function VerifyEmailPage() {
  const [email, setEmail] = useState<string | null>(null)
  const [resending, setResending] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Get the user's email from session
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setEmail(user.email || null)
        // If email is already verified, redirect to dashboard
        if (user.email_confirmed_at) {
          router.push('/dashboard')
        }
      } else {
        // No user session, redirect to login
        router.push('/login')
      }
    }
    getUser()
  }, [router, supabase])

  const handleResendEmail = async () => {
    if (!email) return
    
    setResending(true)
    setMessage(null)

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      })

      if (error) {
        setMessage({ type: 'error', text: error.message })
      } else {
        setMessage({ type: 'success', text: 'Verification email sent!' })
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to resend email' })
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Verify your email
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            We've sent a verification email to:
          </p>
          {email && (
            <p className="mt-1 text-sm font-medium text-gray-900">{email}</p>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <p className="text-sm text-blue-800">
            Please check your inbox and click the verification link to complete your registration.
            The link will expire in 24 hours.
          </p>
        </div>

        {message && (
          <div
            className={`rounded-md p-4 ${
              message.type === 'success' ? 'bg-green-50' : 'bg-red-50'
            }`}
          >
            <p
              className={`text-sm ${
                message.type === 'success' ? 'text-green-800' : 'text-red-800'
              }`}
            >
              {message.text}
            </p>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleResendEmail}
            disabled={resending}
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resending ? 'Sending...' : 'Resend verification email'}
          </button>

          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              Already verified?{' '}
              <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Sign in
              </Link>
            </p>
            <p className="text-sm text-gray-600">
              Wrong email?{' '}
              <button
                onClick={async () => {
                  await supabase.auth.signOut()
                  router.push('/signup')
                }}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign up again
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}