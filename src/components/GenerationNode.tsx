import { useState, useCallback } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Button } from './ui/Button';
import { Textarea } from './ui/Textarea';
import type { GenerationNodeData } from '../types';

export function GenerationNode({ id, data }: NodeProps) {
  const nodeData = data as unknown as GenerationNodeData;
  const [prompt, setPrompt] = useState(nodeData.prompt || '');
  const [imageUrl, setImageUrl] = useState(nodeData.imageUrl || '');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) return;

    setStatus('loading');
    setError('');
    setImageUrl('');

    try {
      // ============================================================
      // В реальном приложении с Next.js API Routes:
      // ============================================================
      // const response = await fetch('/api/generate-image', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ prompt }),
      // });
      // 
      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.error || 'Ошибка сервера');
      // }
      // 
      // const result = await response.json();
      // setImageUrl(result.imageUrl);
      // setStatus('success');
      // ============================================================

      // Для демо — имитация генерации (2.5 секунды)
      await new Promise((resolve) => setTimeout(resolve, 2500));

      // Демо: показываем placeholder-изображения
      const demoImages = [
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1604076913837-52ab5629fba9?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=300&fit=crop',
      ];
      const randomImage = demoImages[Math.floor(Math.random() * demoImages.length)];
      setImageUrl(randomImage);
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Ошибка генерации');
    }
  }, [prompt]);

  return (
    <div className="w-[320px] bg-white rounded-2xl border border-[var(--color-border)] shadow-sm overflow-hidden">
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-[var(--color-accent)] !border-2 !border-white"
      />

      {/* Header */}
      <div className="px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-surface-secondary)]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
          <span className="text-sm font-medium text-[var(--color-text-primary)]">
            {nodeData.label}
          </span>
          <span className="ml-auto text-xs text-[var(--color-text-tertiary)]">
            {status === 'idle' ? 'Ожидание' : status === 'loading' ? 'Генерация...' : status === 'success' ? 'Готово' : 'Ошибка'}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        {/* Textarea */}
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Опишите изображение, которое хотите создать..."
          label="Промпт"
          rows={3}
        />

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={status === 'loading' || !prompt.trim()}
          className="w-full"
          variant="default"
        >
          {status === 'loading' ? (
            <span className="flex items-center justify-center gap-2">
              <span className="flex gap-1">
                <span className="loading-dot w-1.5 h-1.5 rounded-full bg-white inline-block" />
                <span className="loading-dot w-1.5 h-1.5 rounded-full bg-white inline-block" />
                <span className="loading-dot w-1.5 h-1.5 rounded-full bg-white inline-block" />
              </span>
              Генерация...
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z" />
              </svg>
              Сгенерировать
            </span>
          )}
        </Button>

        {/* Image Result */}
        {status === 'loading' && (
          <div className="w-full h-48 rounded-xl shimmer" />
        )}

        {status === 'success' && imageUrl && (
          <div className="relative group rounded-xl overflow-hidden border border-[var(--color-border)]">
            <img
              src={imageUrl}
              alt="Сгенерированное изображение"
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
              <a
                href={imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-medium text-[var(--color-text-primary)] shadow-sm hover:bg-white"
              >
                Открыть в полном размере ↗
              </a>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-100">
            <p className="text-xs text-red-600 font-medium flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error || 'Произошла ошибка при генерации'}
            </p>
            <button
              onClick={handleGenerate}
              className="mt-2 text-xs text-red-600 hover:text-red-700 font-medium underline underline-offset-2"
            >
              Попробовать снова
            </button>
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-[var(--color-accent)] !border-2 !border-white"
      />
    </div>
  );
}
