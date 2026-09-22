/**
 * ============================================================
 * API Route: Выход (logout)
 * ============================================================
 * 
 * Файл для Next.js: app/api/auth/logout/route.ts
 * 
 * Удаляет session cookie и завершает сессию.
 * 
 * ============================================================
 */

// import { NextRequest, NextResponse } from 'next/server';

// export async function POST(request: NextRequest) {
//   const response = NextResponse.json({ success: true });
//   
//   response.cookies.set('session', '', {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production',
//     sameSite: 'lax',
//     maxAge: 0, // Удаляем cookie
//     path: '/',
//   });
//
//   return response;
// }

export {};
