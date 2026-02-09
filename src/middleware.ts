import { NextRequest, NextResponse, type MiddlewareConfig } from 'next/server';

const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = '/login';

const routeSegments = [
  { path: '/', isPrivate: false },
  { path: '/signin', isPrivate: false },
  { path: '/login', isPrivate: false },
  { path: '/create-lost-and-found/first-form', isPrivate: true },
  { path: '/create-lost-and-found/second-form', isPrivate: true },
  { path: '/create-lost-and-found/third-form', isPrivate: true },
];

export default function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const privateRoutes = routeSegments.find(
    (route) => route.path === path
  )?.isPrivate;

  const authToken = request.cookies.get('@lost-and-link:token');

  const redirectURL = request.nextUrl.clone();

  if (privateRoutes === true && !authToken) {
    redirectURL.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE;

    return NextResponse.redirect(redirectURL);
  }

  return NextResponse.next();
}

export const middlewareConfig: MiddlewareConfig = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
