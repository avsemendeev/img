import { useState, useRef, useEffect } from 'react';
import type { Project } from '../types';

interface ProjectSelectorProps {
  projects: Project[];
  currentProjectId: string | null;
  onSwitch: (projectId: string) => void;
  onCreate: (name: string) => void;
  onDelete: (projectId: string) => void;
  onRename: (projectId: string, newName: string) => void;
}

export function ProjectSelector({
  projects,
  currentProjectId,
  onSwitch,
  onCreate,
  onDelete,
  onRename,
}: ProjectSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentProject = projects.find((p) => p.id === currentProjectId);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsCreating(false);
        setEditingId(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCreate = () => {
    if (newName.trim()) {
      onCreate(newName.trim());
      setNewName('');
      setIsCreating(false);
    }
  };

  const handleRename = (projectId: string) => {
    if (editName.trim()) {
      onRename(projectId, editName.trim());
      setEditingId(null);
      setEditName('');
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-8 px-3 text-sm font-medium rounded-lg border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-secondary)] transition-colors duration-150 flex items-center gap-2 max-w-[200px]"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
        <span className="truncate">{currentProject?.name || 'Выберите проект'}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 w-72 bg-white rounded-xl border border-[var(--color-border)] shadow-lg overflow-hidden z-50">
          <div className="p-2 border-b border-[var(--color-border)]">
            {isCreating ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCreate();
                    if (e.key === 'Escape') {
                      setIsCreating(false);
                      setNewName('');
                    }
                  }}
                  placeholder="Название проекта"
                  className="flex-1 h-8 px-2 text-sm rounded-lg border border-[var(--color-border)] focus:border-[var(--color-accent)] focus:outline-none"
                  autoFocus
                />
                <button
                  onClick={handleCreate}
                  className="h-8 px-3 text-xs font-medium rounded-lg bg-[var(--color-accent)] text-white hover:opacity-90 transition-opacity"
                >
                  Создать
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsCreating(true)}
                className="w-full h-8 px-3 text-left text-sm font-medium rounded-lg hover:bg-[var(--color-surface-secondary)] transition-colors flex items-center gap-2"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Новый проект
              </button>
            )}
          </div>

          <div className="max-h-64 overflow-y-auto p-1">
            {projects.map((project) => (
              <div
                key={project.id}
                className={`group flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors ${
                  project.id === currentProjectId
                    ? 'bg-blue-50'
                    : 'hover:bg-[var(--color-surface-secondary)]'
                }`}
              >
                {editingId === project.id ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleRename(project.id);
                      if (e.key === 'Escape') {
                        setEditingId(null);
                        setEditName('');
                      }
                    }}
                    onBlur={() => handleRename(project.id)}
                    className="flex-1 h-7 px-2 text-sm rounded border border-[var(--color-border)] focus:border-[var(--color-accent)] focus:outline-none"
                    autoFocus
                  />
                ) : (
                  <>
                    <button
                      onClick={() => {
                        onSwitch(project.id);
                        setIsOpen(false);
                      }}
                      className="flex-1 text-left text-sm truncate"
                    >
                      {project.name}
                    </button>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingId(project.id);
                          setEditName(project.name);
                        }}
                        className="w-6 h-6 rounded flex items-center justify-center hover:bg-white/80 transition-colors"
                        title="Переименовать"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      {projects.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm('Удалить проект?')) {
                              onDelete(project.id);
                            }
                          }}
                          className="w-6 h-6 rounded flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-colors"
                          title="Удалить"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
