interface AuthModalProps {
  onClose: () => void;
  onLogin: (user: { name: string; email: string }) => void;
}

export function AuthModal({ onClose, onLogin }: AuthModalProps) {
  const handleYandexLogin = () => {
    // В реальном приложении:
    // window.location.href = '/api/auth/yandex/login';
    
    // Для демо — имитация входа
    onLogin({
      name: 'Пользователь',
      email: 'user@yandex.ru',
    });
  };

  const handleDemoLogin = () => {
    onLogin({
      name: 'Демо-пользователь',
      email: 'demo@example.com',
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm mx-4 bg-white rounded-2xl shadow-2xl border border-[var(--color-border)] overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-2 text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[var(--color-accent)] to-indigo-500 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
            Вход в AI Canvas
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Авторизуйтесь для сохранения генераций
          </p>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-3">
          {/* Яндекс ID Button */}
          <button
            onClick={handleYandexLogin}
            className="w-full h-11 px-4 text-sm font-medium rounded-xl border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-secondary)] transition-all duration-200 flex items-center justify-center gap-3 active:scale-[0.98]"
          >
            {/* Яндекс логотип */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="12" fill="#FFCC00" />
              <path d="M13.5 18.5h-2.2V14L8.5 6.5h2.5l1.8 5.2 1.8-5.2H17l-2.8 7.5v4.5h-.7z" fill="#000" />
            </svg>
            Войти через Яндекс ID
          </button>

          {/* Demo Button */}
          <button
            onClick={handleDemoLogin}
            className="w-full h-11 px-4 text-sm font-medium rounded-xl bg-[var(--color-text-primary)] text-white hover:opacity-90 transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Демо-вход
          </button>
        </div>

        {/* Footer */}
        <div className="px-6 pb-5">
          <p className="text-xs text-[var(--color-text-tertiary)] text-center leading-relaxed">
            Нажимая «Войти», вы соглашаетесь с обработкой персональных данных
          </p>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-secondary)] transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
