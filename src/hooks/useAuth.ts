import { useState, useEffect, useCallback } from 'react';
import {
  parseTokenFromUrl,
  clearTokenFromUrl,
  fetchYandexUserInfo,
  getAvatarUrl,
  redirectToYandexAuth,
  type YandexUserInfo,
} from '../lib/yandex-auth';
import type { User } from '../types';

const TOKEN_KEY = 'yandex_access_token';
const USER_KEY = 'yandex_user_info';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  });

  // Сохранение данных пользователя в localStorage
  const saveUser = useCallback((user: User, token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }, []);

  // Загрузка данных пользователя из localStorage
  const loadUser = useCallback((): { user: User; token: string } | null => {
    const token = localStorage.getItem(TOKEN_KEY);
    const userStr = localStorage.getItem(USER_KEY);
    
    if (!token || !userStr) return null;
    
    try {
      const user = JSON.parse(userStr) as User;
      return { user, token };
    } catch {
      return null;
    }
  }, []);

  // Очистка данных авторизации
  const clearAuth = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }, []);

  // Инициализация: проверка токена при загрузке
  useEffect(() => {
    const initAuth = async () => {
      try {
        // 1. Проверяем, есть ли токен в URL (после редиректа от Яндекс)
        const tokenData = parseTokenFromUrl();
        
        if (tokenData) {
          // Очищаем URL от токена
          clearTokenFromUrl();
          
          // Получаем данные пользователя
          const userInfo = await fetchYandexUserInfo(tokenData.access_token);
          
          const user: User = {
            name: userInfo.display_name || userInfo.real_name || userInfo.login || 'Пользователь',
            email: userInfo.default_email || '',
            avatar: getAvatarUrl(userInfo.default_avatar_id) || undefined,
            id: userInfo.id,
          };
          
          // Сохраняем и устанавливаем
          saveUser(user, tokenData.access_token);
          setState({ user, isLoading: false, error: null });
          return;
        }

        // 2. Если токена в URL нет, проверяем localStorage
        const saved = loadUser();
        if (saved) {
          // Проверяем валидность токена, запрашивая данные пользователя
          try {
            const userInfo = await fetchYandexUserInfo(saved.token);
            const user: User = {
              name: userInfo.display_name || userInfo.real_name || userInfo.login || saved.user.name,
              email: userInfo.default_email || saved.user.email,
              avatar: getAvatarUrl(userInfo.default_avatar_id) || saved.user.avatar,
              id: userInfo.id,
            };
            saveUser(user, saved.token);
            setState({ user, isLoading: false, error: null });
          } catch {
            // Токен невалиден — очищаем
            clearAuth();
            setState({ user: null, isLoading: false, error: null });
          }
          return;
        }

        // 3. Пользователь не авторизован
        setState({ user: null, isLoading: false, error: null });
      } catch (error) {
        console.error('Ошибка инициализации авторизации:', error);
        clearAuth();
        setState({ 
          user: null, 
          isLoading: false, 
          error: error instanceof Error ? error.message : 'Ошибка авторизации' 
        });
      }
    };

    initAuth();
  }, [loadUser, saveUser, clearAuth]);

  // Редирект на авторизацию
  const login = useCallback(() => {
    redirectToYandexAuth();
  }, []);

  // Выход
  const logout = useCallback(() => {
    clearAuth();
    setState({ user: null, isLoading: false, error: null });
  }, [clearAuth]);

  return {
    user: state.user,
    isLoading: state.isLoading,
    error: state.error,
    login,
    logout,
  };
}
