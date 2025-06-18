import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getSubscriptionStatus } from '@/lib/subscription'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const subscriptionData = await getSubscriptionStatus(user.id, supabase)

    return NextResponse.json(subscriptionData)
  } catch (error: any) {
    console.error('Error fetching subscription status:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch subscription status' },
      { status: 500 }
    )
  }
}