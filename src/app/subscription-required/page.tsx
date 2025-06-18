import Link from 'next/link'

export default function SubscriptionRequiredPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Subscription Required
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            A paid subscription is required to access Math 7-8
          </p>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex justify-center mb-4">
            <svg className="h-12 w-12 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-sm text-yellow-800">
            Your account has been created, but you need an active subscription to access the learning materials.
          </p>
        </div>

        <div className="space-y-4">
          <Link 
            href="/pricing"
            className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            View Subscription Plans
          </Link>
          
          <Link 
            href="/settings"
            className="w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Account Settings
          </Link>
        </div>

        <div className="text-sm text-gray-500">
          <p>Need help? Contact support at</p>
          <a href="mailto:support@math78.com" className="text-blue-600 hover:text-blue-500">
            support@math78.com
          </a>
        </div>
      </div>
    </div>
  )
}