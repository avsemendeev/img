import { useState, useCallback, useMemo } from 'react';
import { Handle, Position, type NodeProps, useNodes, useEdges, useReactFlow } from '@xyflow/react';
import { Button } from './ui/Button';
import { Textarea } from './ui/Textarea';
import type { GenerationNodeData, TextNodeData } from '../types';

export function GenerationNode({ id, data }: NodeProps) {
  const nodeData = data as unknown as GenerationNodeData;
  const [prompt, setPrompt] = useState(nodeData.prompt || '');
  const [imageUrl, setImageUrl] = useState(nodeData.imageUrl || '');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const { setNodes } = useReactFlow();
  const nodes = useNodes();
  const edges = useEdges();

  // Вычисляем входящий промпт из связанных текстовых нод
  const incomingPrompt = useMemo(() => {
    const incomingEdges = edges.filter((e) => e.target === id);
    const texts: string[] = [];
    for (const edge of incomingEdges) {
      const sourceNode = nodes.find((n) => n.id === edge.source);
      if (sourceNode?.type === 'text') {
        const textData = sourceNode.data as unknown as TextNodeData;
        if (textData.text && textData.text.trim()) {
          texts.push(textData.text.trim());
        }
      }
    }
    return texts.join('\n');
  }, [edges, nodes, id]);

  const handlePromptChange = (newPrompt: string) => {
    setPrompt(newPrompt);
    // Синхронизируем изменения с data ноды
    setNodes((nds) =>
      nds.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, prompt: newPrompt } } : n
      )
    );
  };

  const handleDownload = useCallback(async () => {
    if (!imageUrl) return;
    
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `generated-image-${id}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Ошибка скачивания:', err);
    }
  }, [imageUrl, id]);

  const handleGenerate = useCallback(async () => {
    // Используем prompt или incomingPrompt
    const finalPrompt = prompt.trim() || incomingPrompt;
    if (!finalPrompt) return;

    setStatus('loading');
    setError('');
    setImageUrl('');

    try {
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
  }, [prompt, incomingPrompt]);

  return (
    <div className="w-[320px] bg-white rounded-2xl border border-[var(--color-border)] shadow-sm overflow-hidden">
      {/* Handle: Вход слева */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-[var(--color-accent)] !border-2 !border-white"
      />

      {/* Header */}
      <div className="px-4 py-2 border-b border-[var(--color-border)] bg-[var(--color-surface-secondary)]">
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

      {/* Image Preview Section */}
      <div className="p-4 pb-2">
        {status === 'loading' ? (
          <div className="w-full h-48 rounded-xl shimmer" />
        ) : imageUrl ? (
          <div className="space-y-2">
            <div className="relative group rounded-xl overflow-hidden border border-[var(--color-border)]">
              <img
                src={imageUrl}
                alt="Сгенерированное изображение"
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center gap-2">
                <a
                  href={imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-medium text-[var(--color-text-primary)] shadow-sm hover:bg-white"
                >
                  Открыть ↗
                </a>
                <button
                  onClick={handleDownload}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-medium text-[var(--color-text-primary)] shadow-sm hover:bg-white flex items-center gap-1"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Скачать
                </button>
              </div>
            </div>
            <button
              onClick={handleDownload}
              className="w-full h-8 px-3 text-xs font-medium rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-secondary)] transition-colors duration-150 flex items-center justify-center gap-1.5"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Скачать изображение
            </button>
          </div>
        ) : (
          <div className="w-full h-48 rounded-xl border-2 border-dashed border-[var(--color-border)] bg-[var(--color-surface-secondary)] flex items-center justify-center">
            <div className="text-center">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mx-auto text-[var(--color-text-tertiary)]"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-2">
                Изображение появится здесь
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Prompt Section */}
      <div className="px-4 pb-4 space-y-3">
        {/* Входящий промпт из текстовой ноды */}
        {incomingPrompt && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
            <div className="flex items-center gap-1.5 mb-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <span className="text-xs font-medium text-emerald-700">Входящий промпт</span>
            </div>
            <p className="text-xs text-emerald-900 leading-relaxed whitespace-pre-wrap">
              {incomingPrompt}
            </p>
          </div>
        )}

        <Textarea
          value={prompt}
          onChange={(e) => handlePromptChange(e.target.value)}
          placeholder="Опишите изображение, которое хотите создать..."
          label="Промпт"
          rows={3}
        />

        <Button
          onClick={handleGenerate}
          disabled={status === 'loading' || (!prompt.trim() && !incomingPrompt)}
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

      {/* Handle: Выход справа */}
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-[var(--color-accent)] !border-2 !border-white"
      />
    </div>
  );
}
