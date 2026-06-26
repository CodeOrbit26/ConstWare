import { NextResponse, type NextRequest } from "next/server"
import { updateSession } from "@/lib/supabase/middleware"

export async function middleware(request: NextRequest) {
  // Skip mock auth mode — let everything through
  if (process.env.NEXT_PUBLIC_MOCK_AUTH === "true") {
    return NextResponse.next()
  }

  try {
    const { response, user } = await updateSession(request)
    const path = request.nextUrl.pathname

    // Public routes — always accessible
    const publicRoutes = ["/login", "/register", "/", "/auth/callback"]
    const isPublicRoute = publicRoutes.includes(path) || path.startsWith("/client/")

    if (isPublicRoute) {
      // If user is logged in and tries to visit /login or /register, redirect to dashboard
      if (user && (path === "/login" || path === "/register")) {
        const role = user.user_metadata?.role || "contractor"
        const redirectUrl = role === "supervisor" 
          ? "/supervisor/dashboard" 
          : "/contractor/dashboard"
        return NextResponse.redirect(new URL(redirectUrl, request.url))
      }
      return response
    }

    // Protected routes — require auth
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    // Role-based access control
    const role = user.user_metadata?.role
    if (path.startsWith("/contractor") && role !== "contractor") {
      return NextResponse.redirect(new URL("/login", request.url))
    }
    if (path.startsWith("/supervisor") && role !== "supervisor") {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    return response
  } catch (error) {
    console.error("Middleware execution failed:", error)
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/ (API routes)
     */
    "/((?!_next/static|_next/image|favicon.ico|api/).*)",
  ],
}
