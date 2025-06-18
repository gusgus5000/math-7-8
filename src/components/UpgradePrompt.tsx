'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSubscription } from '@/hooks/useSubscription'

interface UpgradePromptProps {
  feature?: string
  message?: string
  onClose?: () => void
}

export function UpgradePrompt({ feature, message, onClose }: UpgradePromptProps) {
  const { subscription } = useSubscription()
  const [isVisible, setIsVisible] = useState(true)

  const handleClose = () => {
    setIsVisible(false)
    onClose?.()
  }

  if (!isVisible || subscription?.canAccessPremium) {
    return null
  }

  const defaultMessage = feature 
    ? `Upgrade to Premium to unlock ${feature}`
    : 'Upgrade to Premium for unlimited access'

  return (
    <div className="fixed bottom-4 right-4 max-w-sm bg-white rounded-lg shadow-lg border border-gray-200 p-6 z-50">
      <button
        onClick={handleClose}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      <div className="pr-8">
        <h3 className="font-semibold text-gray-900 mb-2">
          Unlock Premium Features
        </h3>
        
        <p className="text-sm text-gray-600 mb-4">
          {message || defaultMessage}
        </p>
        
        
        <div className="space-y-2">
          <Link
            href="/pricing"
            className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
          >
            View Plans
          </Link>
          
          <button
            onClick={handleClose}
            className="block w-full text-center text-gray-600 hover:text-gray-800 text-sm"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  )
}

// Inline upgrade banner for use in content
export function UpgradeBanner({ feature }: { feature?: string }) {
  const { subscription } = useSubscription()

  if (subscription?.canAccessPremium) {
    return null
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-gray-900">
            {feature ? `${feature} is a Premium feature` : 'Upgrade to Premium'}
          </h4>
          <p className="text-sm text-gray-600 mt-1">
            Get unlimited access to all features with a Premium subscription
          </p>
        </div>
        
        <Link
          href="/pricing"
          className="flex-shrink-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
        >
          Upgrade Now
        </Link>
      </div>
    </div>
  )
}

// Feature gate component
export function PremiumFeature({ 
  children, 
  fallback,
  feature 
}: { 
  children: React.ReactNode
  fallback?: React.ReactNode
  feature?: string 
}) {
  const { subscription } = useSubscription()

  if (subscription?.canAccessPremium) {
    return <>{children}</>
  }

  return (
    <>
      {fallback || <UpgradeBanner feature={feature} />}
    </>
  )
}