import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader) {
    return new NextResponse('Authentication required', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Seen Testers"' },
    });
  }

  const [scheme, encoded] = authHeader.split(' ');
  
  if (scheme !== 'Basic' || !encoded) {
    return new NextResponse('Invalid authentication', { status: 401 });
  }

  const decoded = atob(encoded);
  const [username, password] = decoded.split(':');

  const validUsername = process.env.AUTH_USERNAME || 'tester';
  const validPassword = process.env.AUTH_PASSWORD || 'seen2025';

  if (username === validUsername && password === validPassword) {
    return NextResponse.next();
  }

  return new NextResponse('Invalid credentials', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Seen Testers"' },
  });
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|manifest.json|icon-.*\\.png).*)'],
};
