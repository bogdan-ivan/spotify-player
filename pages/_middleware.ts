import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: any, event: any) {
  // Token will exist if user is logged in
  const token = await getToken({ req, secret: process.env.JWT_SECRET });
  const { pathname } = req.nextUrl;

  if (token && pathname === '/login') {
    const url = req.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }
  // Allow the request if the following is true
  // 1. Token exists
  if (pathname.includes('/api/auth') || token) {
    return NextResponse.next();
  }
  if (!token && pathname !== '/login') {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    // Doesn't change the visible url
    //return NextResponse.rewrite(url);
    return NextResponse.redirect(url);
  }
}
