import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  // Public paths that don't require authentication
  const publicPaths = ['/', '/pricing', '/api/stripe/webhook']
  const authPaths = ['/login', '/signup', '/forgot-password', '/reset-password', '/verify-email', '/signup/complete']
  const pathname = request.nextUrl.pathname
  
  // Check if the current path matches any category
  const isPublicPath = publicPaths.some(path => pathname === path || pathname.startsWith(path))
  const isAuthPath = authPaths.some(path => pathname.startsWith(path))
  const isApiPath = pathname.startsWith('/api/')
  
  const response = await updateSession(request)
  
  // Allow public paths and API routes
  if (isPublicPath || (isApiPath && pathname !== '/api/stripe/create-checkout-session')) {
    return response
  }
  
  // Check authentication for all other paths
  if (!isPublicPath) {
    // Get the session from the request
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set() {},
          remove() {},
        },
      }
    )
    
    const { data: { session } } = await supabase.auth.getSession()
    
    // Redirect authenticated users away from auth pages
    if (session && isAuthPath) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    
    // Redirect unauthenticated users to login
    if (!session && !isAuthPath) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    // For authenticated users, check subscription for ALL non-auth paths
    if (session && !isAuthPath && !isApiPath) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_status')
        .eq('id', session.user.id)
        .single()
      
      // Allow access to settings page so users can manage subscription
      if (pathname === '/settings') {
        return response
      }
      
      // Block users without active subscriptions
      // Only allow 'active' or 'past_due' statuses
      if (!profile || !['active', 'past_due'].includes(profile.subscription_status)) {
        // For pending users (just signed up), show subscription required message
        if (profile?.subscription_status === 'pending') {
          return NextResponse.redirect(new URL('/subscription-required', request.url))
        }
        // For all other cases, redirect to pricing
        return NextResponse.redirect(new URL('/pricing?upgrade=true', request.url))
      }
    }
  }
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api).*)',
  ],
}