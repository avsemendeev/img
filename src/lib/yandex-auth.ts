/**
 * Утилиты для OAuth авторизации через Яндекс ID.
 * 
 * Используется Implicit Flow (response_type=token), так как это SPA
 * без серверной части. Токен возвращается прямо в URL fragment.
 * 
 * ============================================================
 * НАСТРОЙКА ЯНДЕКС ID (https://oauth.yandex.ru):
 * ============================================================
 * 
 * 1. Зарегистрируйте новое приложение
 * 2. Платформа: Веб-сервисы
 * 3. Доступы: Яндекс ID (имя, email, аватар)
 * 4. Redirect URI:
 *    - Локально: http://localhost:3000/
 *    - Продакшен: https://your-app.vercel.app/
 * 5. Скопируйте Client ID в .env.local как VITE_YANDEX_CLIENT_ID
 * 
 * ============================================================
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

export interface YandexTokenData {
  access_token: string;
  token_type: string;
  expires_in?: number;
  state?: string;
}

// Получение Client ID из переменных окружения.
// Поддерживаются оба варианта имени:
//   - VITE_YANDEX_CLIENT_ID (правильный для Vite/Vercel)
//   - YANDEX_CLIENT_ID (legacy, для обратной совместимости)
const getClientId = (): string => {
  // @ts-ignore - Vite env
  const env = import.meta.env || {};
  const clientId = env.VITE_YANDEX_CLIENT_ID || env.YANDEX_CLIENT_ID || '';
  return clientId;
};

/**
 * Проверяет, настроен ли Client ID.
 */
export function isYandexConfigured(): boolean {
  return getClientId().length > 0;
}

// Получение redirect URI (текущий URL без hash/query)
const getRedirectUri = (): string => {
  return `${window.location.origin}${window.location.pathname}`;
};

/**
 * Генерирует URL для редиректа на Яндекс OAuth.
 */
export function getYandexAuthUrl(): string {
  const clientId = getClientId();
  const redirectUri = getRedirectUri();
  const state = Math.random().toString(36).substring(7);
  
  // Сохраняем state для проверки при возврате
  sessionStorage.setItem('yandex_oauth_state', state);

  const params = new URLSearchParams({
    response_type: 'token',
    client_id: clientId,
    redirect_uri: redirectUri,
    state,
  });

  return `https://oauth.yandex.ru/authorize?${params.toString()}`;
}

/**
 * Редирект на страницу авторизации Яндекс.
 */
export function redirectToYandexAuth(): void {
  const url = getYandexAuthUrl();
  window.location.href = url;
}

/**
 * Парсит URL fragment и извлекает данные токена.
 * Яндекс возвращает токен в формате: #access_token=XXX&token_type=bearer&state=YYY
 */
export function parseTokenFromUrl(): YandexTokenData | null {
  const hash = window.location.hash;
  if (!hash || hash.length <= 1) return null;

  const params = new URLSearchParams(hash.substring(1));
  const accessToken = params.get('access_token');
  const tokenType = params.get('token_type');
  const state = params.get('state');

  if (!accessToken) return null;

  // Проверяем state для защиты от CSRF
  const savedState = sessionStorage.getItem('yandex_oauth_state');
  if (savedState && state !== savedState) {
    console.error('State mismatch — возможная CSRF атака');
    return null;
  }
  sessionStorage.removeItem('yandex_oauth_state');

  return {
    access_token: accessToken,
    token_type: tokenType || 'bearer',
    state: state || undefined,
  };
}

/**
 * Очищает URL от токена (удаляет hash).
 */
export function clearTokenFromUrl(): void {
  if (window.location.hash) {
    window.history.replaceState(
      null,
      '',
      window.location.pathname + window.location.search
    );
  }
}

/**
 * Получает информацию о пользователе через API Яндекс ID.
 */
export async function fetchYandexUserInfo(accessToken: string): Promise<YandexUserInfo> {
  const response = await fetch(
    `https://login.yandex.ru/info?format=json&oauth_token=${accessToken}`
  );

  if (!response.ok) {
    throw new Error(`Ошибка получения данных пользователя: ${response.status}`);
  }

  return response.json();
}

/**
 * Формирует URL аватара пользователя.
 */
export function getAvatarUrl(avatarId?: string): string | null {
  if (!avatarId) return null;
  return `https://avatars.yandex.net/get-yapic/${avatarId}/islands-50`;
}
