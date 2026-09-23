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
 * 4. Redirect URI: https://your-app.vercel.app/
 * 5. Скопируйте Client ID в .env.local как VITE_YANDEX_CLIENT_ID
 * 6. Скопируйте Redirect URI в .env.local как VITE_YANDEX_REDIRECT_URI
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

// Получение Client ID из переменных окружения
const getClientId = (): string => {
  // @ts-ignore - Vite env
  const clientId = import.meta.env.VITE_YANDEX_CLIENT_ID;
  if (!clientId) {
    console.error('VITE_YANDEX_CLIENT_ID не установлен в .env.local');
    return '';
  }
  return clientId;
};

// Получение redirect URI из переменных окружения
const getRedirectUri = (): string => {
  // @ts-ignore - Vite env
  const redirectUri = import.meta.env.VITE_YANDEX_REDIRECT_URI;
  if (!redirectUri) {
    console.error('VITE_YANDEX_REDIRECT_URI не установлен в .env.local');
    return '';
  }
  return redirectUri;
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
