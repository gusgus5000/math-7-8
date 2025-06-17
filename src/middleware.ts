import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  // Only protect specific routes
  const protectedPaths = ['/dashboard', '/profile', '/settings']
  const authPaths = ['/login', '/signup', '/forgot-password', '/reset-password', '/verify-email']
  const pathname = request.nextUrl.pathname
  
  // Check if the current path is protected
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))
  const isAuthPath = authPaths.some(path => pathname.startsWith(path))
  
  const response = await updateSession(request)
  
  // Only check session for protected or auth paths
  if (isProtectedPath || isAuthPath) {
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
    
    // Redirect unauthenticated users away from protected pages
    if (!session && isProtectedPath) {
      return NextResponse.redirect(new URL('/login', request.url))
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