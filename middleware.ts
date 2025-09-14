import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  console.log("Middleware running for:", request.nextUrl.pathname)

  // Get token from cookies
  const token = request.cookies.get("access_token")?.value
  console.log("Token in middleware:", token ? "exists" : "none")

  // Protected routes that require authentication
  const protectedPaths = ["/dashboard", "/meetings", "/action-items", "/upload"]
  const isProtectedPath = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path))

  // Auth routes that should redirect if already authenticated
  const authPaths = ["/login", "/signup"]
  const isAuthPath = authPaths.some((path) => request.nextUrl.pathname.startsWith(path))

  console.log("Path analysis:", { isProtectedPath, isAuthPath, hasToken: !!token })

  // Check if user is trying to access protected route without token
  if (isProtectedPath && !token) {
    console.log("Redirecting to login - no token for protected route")
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Check if authenticated user is trying to access auth pages
  if (isAuthPath && token) {
    console.log("Redirecting to dashboard - already authenticated")
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  console.log("Allowing request to proceed")
  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/meetings/:path*", "/action-items/:path*", "/upload/:path*", "/login", "/signup"],
}
