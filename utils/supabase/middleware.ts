import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value
        },
        set(name, value, options) {
          // If the cookie is being deleted, get the original to preserve its options
          if (!value) {
            const oldCookie = request.cookies.get(name)
            if (oldCookie) {
              response.cookies.set({
                name,
                value: '',
                ...options,
                maxAge: 0,  // Force the cookie to expire
              })
            }
            return
          }
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name, options) {
          response.cookies.set({
            name,
            value: '',
            ...options,
            maxAge: 0,  // Force the cookie to expire
          })
        },
      },
    }
  )

  // Refresh the session
  const { data: { session } } = await supabase.auth.getSession()

  // If there is no session but there are auth cookies, attempt to clear them
  if (!session) {
    const authCookies = [
      'sb-access-token', 
      'sb-refresh-token', 
      'sb-auth-token', 
      // Add any other Supabase auth cookies that might exist
    ]
    
    authCookies.forEach(cookieName => {
      if (request.cookies.has(cookieName)) {
        response.cookies.set({
          name: cookieName,
          value: '',
          maxAge: 0,
          path: '/',
        })
      }
    })
  }

  return response
}