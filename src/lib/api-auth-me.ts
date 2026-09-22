/**
 * ============================================================
 * API Route: Проверка сессии и получение данных пользователя
 * ============================================================
 * 
 * Файл для Next.js: app/api/auth/me/route.ts
 * 
 * Возвращает данные текущего авторизованного пользователя
 * из JWT-токена в cookie.
 * 
 * ============================================================
 */

// import { NextRequest, NextResponse } from 'next/server';
// import { jwtVerify } from 'jose';

// export async function GET(request: NextRequest) {
//   try {
//     const sessionCookie = request.cookies.get('session');
//     
//     if (!sessionCookie) {
//       return NextResponse.json(
//         { error: 'Not authenticated' },
//         { status: 401 }
//       );
//     }
//
//     const secret = new TextEncoder().encode(process.env.JWT_SECRET || '');
//     const { payload } = await jwtVerify(sessionCookie.value, secret);
//
//     return NextResponse.json({
//       user: {
//         id: payload.sub,
//         name: payload.name,
//         email: payload.email,
//         avatar: payload.avatar,
//       },
//     });
//   } catch (error) {
//     return NextResponse.json(
//       { error: 'Invalid session' },
//       { status: 401 }
//     );
//   }
// }

export {};
