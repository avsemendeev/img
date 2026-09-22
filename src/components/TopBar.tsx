import { useState, useRef, useEffect } from 'react';
import type { User, Project } from '../types';
import { ProjectSelector } from './ProjectSelector';

interface TopBarProps {
  user: User | null;
  projects: Project[];
  currentProjectId: string | null;
  onLoginClick: () => void;
  onLogout: () => void;
  onAddNode: (type: 'text' | 'generation') => void;
  onSwitchProject: (projectId: string) => void;
  onCreateProject: (name: string) => void;
  onDeleteProject: (projectId: string) => void;
  onRenameProject: (projectId: string, newName: string) => void;
}

export function TopBar({
  user,
  projects,
  currentProjectId,
  onLoginClick,
  onLogout,
  onAddNode,
  onSwitchProject,
  onCreateProject,
  onDeleteProject,
  onRenameProject,
}: TopBarProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddText = () => {
    onAddNode('text');
    setShowMenu(false);
  };

  const handleAddGeneration = () => {
    onAddNode('generation');
    setShowMenu(false);
  };

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

      {/* Center: Projects & Actions */}
      <div className="flex items-center gap-2">
        {/* Project Selector */}
        <ProjectSelector
          projects={projects}
          currentProjectId={currentProjectId}
          onSwitch={onSwitchProject}
          onCreate={onCreateProject}
          onDelete={onDeleteProject}
          onRename={onRenameProject}
        />

        {/* Add Node Button */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="h-8 px-3 text-sm font-medium rounded-lg border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-secondary)] transition-colors duration-150 flex items-center gap-1.5"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Добавить узел
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${showMenu ? 'rotate-180' : ''}`}>
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <div className="absolute top-full mt-2 left-0 w-56 bg-white rounded-xl border border-[var(--color-border)] shadow-lg overflow-hidden z-50">
              <div className="p-1">
                <button
                  onClick={handleAddText}
                  className="w-full px-3 py-2.5 text-left text-sm hover:bg-[var(--color-surface-secondary)] rounded-lg transition-colors duration-150 flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-[var(--color-text-primary)]">Текст</div>
                    <div className="text-xs text-[var(--color-text-tertiary)]">Текстовый узел</div>
                  </div>
                </button>

                <button
                  onClick={handleAddGeneration}
                  className="w-full px-3 py-2.5 text-left text-sm hover:bg-[var(--color-surface-secondary)] rounded-lg transition-colors duration-150 flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-accent)]">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-[var(--color-text-primary)]">Генерация изображения</div>
                    <div className="text-xs text-[var(--color-text-tertiary)]">AI генератор</div>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
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
