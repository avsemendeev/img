import type { User } from '../types';

interface TopBarProps {
  user: User | null;
  onLoginClick: () => void;
  onLogout: () => void;
  onAddNode: () => void;
}

export function TopBar({ user, onLoginClick, onLogout, onAddNode }: TopBarProps) {
  return (
    <header className="h-14 border-b border-[var(--color-border)] bg-white/80 backdrop-blur-xl flex items-center justify-between px-5 z-50">
      {/* Left: Logo */}
      <div className="flex items-center gap-3">
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
        </div>
        <span className="text-xs text-[var(--color-text-tertiary)] px-2 py-0.5 bg-[var(--color-surface-secondary)] rounded-md font-medium">
          MVP
        </span>
      </div>

      {/* Center: Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onAddNode}
          className="h-8 px-3 text-sm font-medium rounded-lg border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-secondary)] transition-colors duration-150 flex items-center gap-1.5"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Добавить узел
        </button>
      </div>

      {/* Right: Auth */}
      <div className="flex items-center gap-3">
        {user ? (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm text-[var(--color-text-secondary)] font-medium hidden sm:block">
              {user.name}
            </span>
            <button
              onClick={onLogout}
              className="text-xs text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] transition-colors ml-1"
            >
              Выйти
            </button>
          </div>
        ) : (
          <button
            onClick={onLoginClick}
            className="h-8 px-4 text-sm font-medium rounded-lg bg-[var(--color-text-primary)] text-white hover:opacity-90 transition-opacity duration-150"
          >
            Войти через Яндекс
          </button>
        )}
      </div>
    </header>
  );
}
