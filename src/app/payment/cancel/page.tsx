'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function PaymentCancelPage() {
  const router = useRouter()
  const [feedback, setFeedback] = useState('')
  const [submitted, setSubmitted] = useState(false)
  
  const handleFeedback = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you'd send this feedback to your server
    console.log('Payment cancelled feedback:', feedback)
    setSubmitted(true)
    setTimeout(() => {
      router.push('/pricing')
    }, 2000)
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="mx-auto w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Payment Cancelled
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          No worries! Your payment was cancelled and you haven't been charged.
        </p>
        
        {!submitted ? (
          <form onSubmit={handleFeedback} className="mb-8">
            <label className="block text-left text-gray-700 font-semibold mb-2">
              Would you mind telling us why? (optional)
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Price too high, not ready yet, just browsing..."
            />
            <button
              type="submit"
              className="mt-4 w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Submit Feedback
            </button>
          </form>
        ) : (
          <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700">
              Thank you for your feedback! Redirecting...
            </p>
          </div>
        )}
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="font-semibold text-gray-900 mb-2">
            What you're missing:
          </h2>
          <ul className="text-left space-y-1 text-gray-700 text-sm">
            <li>• Unlimited practice problems</li>
            <li>• Step-by-step solutions</li>
            <li>• Full progress tracking</li>
            <li>• Downloadable worksheets</li>
            <li>• Priority support</li>
          </ul>
        </div>
        
        <div className="space-y-2">
          <Link
            href="/pricing"
            className="block w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            View Plans Again
          </Link>
          
          
          <Link
            href="/"
            className="block w-full text-gray-600 py-3 hover:text-gray-800 transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  )
}