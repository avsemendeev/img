/**
 * ============================================================
 * API Route: /api/auth/yandex/login
 * ============================================================
 * 
 * Этот файл предназначен для Next.js 14 (App Router).
 * Для переноса в Next.js-проект:
 *   app/api/auth/yandex/login/route.ts
 * 
 * Назначение: генерирует URL для редиректа на Яндекс OAuth.
 * 
 * ============================================================
 * НАСТРОЙКА ЯНДЕКС ID (https://oauth.yandex.ru):
 * ============================================================
 * 
 * 1. Зарегистрируйте новое приложение на https://oauth.yandex.ru
 * 2. Платформа: Веб-сервисы
 * 3. Доступы: Яндекс ID (username, email, avatar)
 * 4. Хостнейм (Hostname):
 *    - Для разработки: localhost:3000
 *    - Для продакшена: your-project-name.vercel.app
 * 5. Redirect URI:
 *    - Локальный: http://localhost:3000/api/auth/yandex/callback
 *    - Продакшен: https://your-project-name.vercel.app/api/auth/yandex/callback
 * 
 * ============================================================
 * ПЕРЕМЕННЫЕ ОКРУЖЕНИЯ (.env.local):
 * ============================================================
 * 
 * YANDEX_CLIENT_ID=ваш_client_id_из_яндекс_oauth
 * YANDEX_CLIENT_SECRET=ваш_client_secret_из_яндекс_oauth
 * YANDEX_REDIRECT_URI=http://localhost:3000/api/auth/yandex/callback
 * JWT_SECRET=ваш_секретный_ключ_для_jwt (минимум 32 символа)
 * 
 * ============================================================
 */

// Для Next.js 14 App Router:
// import { NextResponse } from 'next/server';

// export async function GET() {
//   const clientId = process.env.YANDEX_CLIENT_ID;
//   const redirectUri = process.env.YANDEX_REDIRECT_URI;

//   if (!clientId || !redirectUri) {
//     return NextResponse.json(
//       { error: 'Server configuration error' },
//       { status: 500 }
//     );
//   }

//   const authUrl = new URL('https://oauth.yandex.ru/authorize');
//   authUrl.searchParams.set('response_type', 'code');
//   authUrl.searchParams.set('client_id', clientId);
//   authUrl.searchParams.set('redirect_uri', redirectUri);

//   return NextResponse.redirect(authUrl.toString());
// }

/**
 * Экспорт для использования на клиенте (демо-режим).
 * В реальном приложении используется серверный API route выше.
 */
export function getYandexAuthUrl(): string {
  const clientId = 'YOUR_YANDEX_CLIENT_ID'; // Замените на реальный client_id
  const redirectUri = typeof window !== 'undefined' 
    ? `${window.location.origin}/api/auth/yandex/callback`
    : 'http://localhost:3000/api/auth/yandex/callback';

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
  });

  return `https://oauth.yandex.ru/authorize?${params.toString()}`;
}
