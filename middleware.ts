import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  console.log("Session:", session); // Verifica si la sesión está disponible

  const isProtectedRoute = ["/hero", "/group"].some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );
  const isAuthPage = req.nextUrl.pathname.startsWith("/auth");
  const isLoginPage = req.nextUrl.pathname === "/auth/login";

  if (!session) {
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  } else {
    if (isAuthPage && !isLoginPage) {
      return NextResponse.redirect(new URL("/hero", req.url));
    }
  }

  return res;
}
