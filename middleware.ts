import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  console.log('🚀 MIDDLEWARE TRIGGERED:', request.nextUrl.pathname)
  
  if (request.nextUrl.pathname.startsWith('/admin')) {
    console.log('🔐 ADMIN ROUTE DETECTED')
    
    if (request.nextUrl.pathname === '/admin/login') {
      console.log('✅ LOGIN PAGE - ALLOWED')
      return NextResponse.next()
    }
    
    const token = request.cookies.get('admin-token')?.value
    
    if (!token) {
      console.log('❌ NO TOKEN - REDIRECTING TO LOGIN')
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    
    console.log('✅ TOKEN EXISTS - ALLOWED')
    return NextResponse.next()
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*'
}
