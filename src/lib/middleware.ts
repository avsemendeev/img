/**
 * ============================================================
 * Next.js Middleware для проверки авторизации
 * ============================================================
 * 
 * Файл: middleware.ts (в корне Next.js проекта)
 * 
 * Проверяет наличие валидной JWT-сессии в cookie.
 * Защищает API routes от неавторизованного доступа.
 * 
 * ============================================================
 * КОД ДЛЯ NEXT.JS (раскомментируйте при переносе):
 * ============================================================
 */

// import { NextRequest, NextResponse } from 'next/server';
// import { jwtVerify } from 'jose';

// // Публичные пути (не требуют авторизации)
// const PUBLIC_PATHS = [
//   '/',
//   '/api/auth/yandex/login',
//   '/api/auth/yandex/callback',
// ];

// export async function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   // Пропускаем публичные пути
//   if (PUBLIC_PATHS.includes(pathname)) {
//     return NextResponse.next();
//   }

//   // Пропускаем статические файлы
//   if (
//     pathname.startsWith('/_next') ||
//     pathname.startsWith('/favicon') ||
//     pathname.includes('.')
//   ) {
//     return NextResponse.next();
//   }

//   // Проверяем session cookie
//   const sessionCookie = request.cookies.get('session');
//   
//   if (!sessionCookie) {
//     // Для API routes возвращаем 401
//     if (pathname.startsWith('/api/')) {
//       return NextResponse.json(
//         { error: 'Unauthorized' },
//         { status: 401 }
//       );
//     }
//     // Для страниц — редирект на главную
//     return NextResponse.redirect(new URL('/', request.url));
//   }

//   // Верифицируем JWT
//   try {
//     const secret = new TextEncoder().encode(process.env.JWT_SECRET || '');
//     await jwtVerify(sessionCookie.value, secret);
//     return NextResponse.next();
//   } catch {
//     // Токен невалиден — удаляем cookie
//     const response = pathname.startsWith('/api/')
//       ? NextResponse.json({ error: 'Session expired' }, { status: 401 })
//       : NextResponse.redirect(new URL('/', request.url));
//     
//     response.cookies.delete('session');
//     return response;
//   }
// }

// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except:
//      * - _next/static (static files)
//      * - _next/image (image optimization)
//      * - favicon.ico (favicon)
//      */
//     '/((?!_next/static|_next/image|favicon.ico).*)',
//   ],
// };

export {};
