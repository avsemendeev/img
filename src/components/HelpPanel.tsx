import { useState } from 'react';

export function HelpPanel() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute bottom-5 left-5 z-10 h-9 w-9 rounded-xl bg-white/80 backdrop-blur-xl border border-[var(--color-border)] shadow-sm flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white transition-all duration-200"
        title="Подсказки"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="absolute bottom-16 left-5 z-10 w-72 bg-white/90 backdrop-blur-xl border border-[var(--color-border)] rounded-2xl shadow-lg overflow-hidden">
          <div className="p-4 border-b border-[var(--color-border)]">
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
              Как использовать
            </h3>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-[var(--color-accent)]">1</span>
              </div>
              <div>
                <p className="text-xs font-medium text-[var(--color-text-primary)]">
                  Добавьте узел
                </p>
                <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                  Нажмите «+ Добавить узел» и выберите тип: <span className="text-emerald-600 font-medium">Текст</span> или <span className="text-[var(--color-accent)] font-medium">Генерация</span>
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-[var(--color-accent)]">2</span>
              </div>
              <div>
                <p className="text-xs font-medium text-[var(--color-text-primary)]">
                  Соедините узлы
                </p>
                <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                  Потяните от <span className="font-medium">правого маркера</span> (выход) одного узла к <span className="font-medium">левому маркеру</span> (вход) другого
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-[var(--color-accent)]">3</span>
              </div>
              <div>
                <p className="text-xs font-medium text-[var(--color-text-primary)]">
                  Введите промпт
                </p>
                <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                  Опишите изображение в текстовом поле узла генерации
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-[var(--color-accent)]">4</span>
              </div>
              <div>
                <p className="text-xs font-medium text-[var(--color-text-primary)]">
                  Сгенерируйте
                </p>
                <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                  Нажмите «Сгенерировать» для создания изображения
                </p>
              </div>
            </div>
          </div>

          <div className="px-4 pb-4">
            <div className="p-3 rounded-xl bg-[var(--color-surface-secondary)] border border-[var(--color-border)]">
              <p className="text-xs text-[var(--color-text-secondary)]">
                💡 <span className="font-medium">Совет:</span> Используйте колесо мыши для зума. Текстовый узел можно подключить к генератору для передачи промпта.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
