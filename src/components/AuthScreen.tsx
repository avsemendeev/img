import { isYandexConfigured, redirectToYandexAuth } from '../lib/yandex-auth';

interface AuthScreenProps {
  isLoading?: boolean;
  error?: string | null;
}

export function AuthScreen({ isLoading, error }: AuthScreenProps) {
  const isConfigured = isYandexConfigured();

  const handleYandexLogin = () => {
    if (!isConfigured) {
      alert(
        'Не указан YANDEX_CLIENT_ID.\n\n' +
        'Добавьте в переменные окружения Vercel:\n' +
        'VITE_YANDEX_CLIENT_ID = ваш_client_id\n\n' +
        'Важно: имя должно начинаться с VITE_'
      );
      return;
    }
    redirectToYandexAuth();
  };

  return (
    <div className="flex flex-col h-screen bg-[var(--color-surface-secondary)]">
      {/* Top Bar (simplified) */}
      <header className="h-14 border-b border-[var(--color-border)] bg-white/80 backdrop-blur-xl flex items-center justify-between px-5 z-50">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[var(--color-accent)] to-indigo-500 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <h1 className="text-base font-semibold text-[var(--color-text-primary)] tracking-tight">
            AI Canvas
          </h1>
          <span className="text-xs text-[var(--color-text-tertiary)] px-2 py-0.5 bg-[var(--color-surface-secondary)] rounded-md font-medium">
            MVP
          </span>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-[var(--color-accent)] to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-[var(--color-text-primary)] tracking-tight">
              Добро пожаловать в AI Canvas
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)] mt-2 max-w-sm mx-auto leading-relaxed">
              Создавайте изображения с помощью AI в удобном нодовом интерфейсе. Объединяйте промпты, экспериментируйте и сохраняйте результаты в проектах.
            </p>
          </div>

          {/* Auth Card */}
          <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-6 space-y-4">
            <div className="text-center mb-2">
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
                Войдите, чтобы начать
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                Авторизация нужна для сохранения ваших проектов
              </p>
            </div>

            {/* Яндекс ID Button */}
            <button
              onClick={handleYandexLogin}
              disabled={isLoading}
              className="w-full h-11 px-4 text-sm font-medium rounded-xl border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-secondary)] transition-all duration-200 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="12" fill="#FFCC00" />
                <path d="M13.5 18.5h-2.2V14L8.5 6.5h2.5l1.8 5.2 1.8-5.2H17l-2.8 7.5v4.5h-.7z" fill="#000" />
              </svg>
              {isLoading ? 'Авторизация...' : 'Войти через Яндекс ID'}
            </button>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-100">
                <p className="text-xs text-red-600 font-medium flex items-center gap-1.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {error}
                </p>
              </div>
            )}

            {/* Config warning */}
            {!isConfigured && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                <p className="text-xs text-amber-800 font-medium mb-2 flex items-center gap-1.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  Требуется настройка
                </p>
                <p className="text-xs text-amber-700 leading-relaxed">
                  Добавьте в переменные окружения Vercel:
                </p>
                <code className="block mt-2 p-2 bg-white rounded-md border border-amber-200 text-xs text-amber-900 font-mono">
                  VITE_YANDEX_CLIENT_ID=ваш_client_id
                </code>
                <p className="text-xs text-amber-700 mt-2 leading-relaxed">
                  ⚠️ Имя переменной должно начинаться с <code className="font-mono font-bold">VITE_</code>, иначе она не будет доступна в клиентском коде.
                </p>
                <a
                  href="https://oauth.yandex.ru"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-xs font-medium text-[var(--color-accent)] hover:underline"
                >
                  Получить Client ID →
                </a>
              </div>
            )}

            <p className="text-xs text-[var(--color-text-tertiary)] text-center leading-relaxed pt-2">
              Нажимая «Войти», вы соглашаетесь с обработкой персональных данных
            </p>
          </div>

          {/* Features */}
          <div className="mt-8 grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-emerald-50 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <p className="text-xs font-medium text-[var(--color-text-primary)]">Проекты</p>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">Сохранение</p>
            </div>

            <div className="text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-blue-50 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-accent)]">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
              <p className="text-xs font-medium text-[var(--color-text-primary)]">AI генерация</p>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">GigaChat</p>
            </div>

            <div className="text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-purple-50 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
              </div>
              <p className="text-xs font-medium text-[var(--color-text-primary)]">Ноды</p>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">Canvas</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
