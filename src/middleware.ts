import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

enum RoleType {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

interface DecodedToken {
  id: string;
  email: string;
  role: RoleType;
  exp: number;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Kiểm tra nếu route bắt đầu với /admin
  if (pathname.startsWith('/admin')) {
    // Kiểm tra token từ cookies hoặc header
    const token = request.cookies.get('nd_token')?.value || 
                 request.headers.get('authorization')?.replace('Bearer ', '');
    
    // Nếu không có token, redirect về trang chủ
    if (!token) {
      const homeUrl = new URL('/', request.url);
      homeUrl.searchParams.set('message', 'Vui lòng đăng nhập để truy cập trang quản trị');
      return NextResponse.redirect(homeUrl);
    }

    try {
      // Decode JWT token để kiểm tra role
      const tokenPayload = JSON.parse(atob(token.split('.')[1])) as DecodedToken;
      
      // Kiểm tra token có hết hạn không
      if (tokenPayload.exp * 1000 < Date.now()) {
        const homeUrl = new URL('/', request.url);
        homeUrl.searchParams.set('message', 'Phiên đăng nhập đã hết hạn');
        return NextResponse.redirect(homeUrl);
      }

      // Kiểm tra role có phải ADMIN không
      if (tokenPayload.role !== RoleType.ADMIN) {
        const homeUrl = new URL('/', request.url);
        homeUrl.searchParams.set('message', 'Bạn không có quyền truy cập trang quản trị');
        return NextResponse.redirect(homeUrl);
      }

      console.log(`Admin access granted: ${pathname}, user: ${tokenPayload.email}, role: ${tokenPayload.role}`);
    } catch (error) {
      console.error('Token validation error:', error);
      const homeUrl = new URL('/', request.url);
      homeUrl.searchParams.set('message', 'Token không hợp lệ');
      return NextResponse.redirect(homeUrl);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    // Có thể thêm các protected routes khác
  ],
};
