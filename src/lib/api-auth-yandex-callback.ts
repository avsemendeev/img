/**
 * ============================================================
 * API Route: /api/auth/yandex/callback
 * ============================================================
 * 
 * Этот файл предназначен для Next.js 14 (App Router).
 * Для переноса в Next.js-проект:
 *   app/api/auth/yandex/callback/route.ts
 * 
 * Назначение: обрабатывает callback от Яндекс OAuth,
 * обменивает code на access_token и получает данные пользователя.
 * 
 * ============================================================
 * ПОЛНЫЙ КОД ДЛЯ NEXT.JS (раскомментируйте при переносе):
 * ============================================================
 */

// import { NextRequest, NextResponse } from 'next/server';
// import { SignJWT } from 'jose';

// export async function GET(request: NextRequest) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const code = searchParams.get('code');
//     const error = searchParams.get('error');

//     // Обработка ошибки от Яндекс
//     if (error) {
//       return NextResponse.redirect(
//         new URL(`/?auth_error=${error}`, request.url)
//       );
//     }

//     // Проверка наличия code
//     if (!code) {
//       return NextResponse.json(
//         { error: 'Authorization code is missing' },
//         { status: 400 }
//       );
//     }

//     const clientId = process.env.YANDEX_CLIENT_ID;
//     const clientSecret = process.env.YANDEX_CLIENT_SECRET;
//     const redirectUri = process.env.YANDEX_REDIRECT_URI;
//     const jwtSecret = process.env.JWT_SECRET;

//     if (!clientId || !clientSecret || !redirectUri || !jwtSecret) {
//       return NextResponse.json(
//         { error: 'Server configuration error' },
//         { status: 500 }
//       );
//     }

//     // Шаг 1: Обмен code на access_token
//     const tokenResponse = await fetch('https://oauth.yandex.ru/token', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//       },
//       body: new URLSearchParams({
//         grant_type: 'authorization_code',
//         code,
//         client_id: clientId,
//         client_secret: clientSecret,
//       }),
//     });

//     if (!tokenResponse.ok) {
//       const errorData = await tokenResponse.json();
//       console.error('Yandex token exchange failed:', errorData);
//       return NextResponse.json(
//         { error: 'Failed to exchange authorization code' },
//         { status: 401 }
//       );
//     }

//     const tokenData = await tokenResponse.json();
//     const accessToken = tokenData.access_token;

//     // Шаг 2: Получение информации о пользователе
//     const userInfoResponse = await fetch('https://login.yandex.ru/info', {
//       headers: {
//         Authorization: `OAuth ${accessToken}`,
//       },
//     });

//     if (!userInfoResponse.ok) {
//       return NextResponse.json(
//         { error: 'Failed to get user info' },
//         { status: 401 }
//       );
//     }

//     const userInfo = await userInfoResponse.json();

//     // Шаг 3: Создание JWT-сессии
//     const secret = new TextEncoder().encode(jwtSecret);
//     const jwt = await new SignJWT({
//       sub: userInfo.id,
//       name: userInfo.display_name || userInfo.login,
//       email: userInfo.default_email || '',
//       avatar: userInfo.default_avatar_id 
//         ? `https://avatars.yandex.net/get-yapic/${userInfo.default_avatar_id}/islands-50` 
//         : '',
//     })
//       .setProtectedHeader({ alg: 'HS256' })
//       .setIssuedAt()
//       .setExpirationTime('7d')
//       .sign(secret);

//     // Шаг 4: Установка HTTP-only cookie и редирект
//     const response = NextResponse.redirect(new URL('/', request.url));
//     response.cookies.set('session', jwt, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'lax',
//       maxAge: 60 * 60 * 24 * 7, // 7 дней
//       path: '/',
//     });

//     return response;
//   } catch (error) {
//     console.error('Auth callback error:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }

/**
 * Тип ответа от Яндекс ID API
 */
export interface YandexUserInfo {
  id: string;
  login: string;
  display_name?: string;
  real_name?: string;
  default_email?: string;
  default_avatar_id?: string;
  sex?: string;
}

/**
 * Тип ответа от Яндекс OAuth при получении токена
 */
export interface YandexTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope?: string;
}
