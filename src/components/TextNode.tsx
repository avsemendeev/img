import { useState } from 'react';
import { Handle, Position, type NodeProps, useReactFlow } from '@xyflow/react';
import { Textarea } from './ui/Textarea';
import type { TextNodeData } from '../types';

export function TextNode({ id, data }: NodeProps) {
  const nodeData = data as unknown as TextNodeData;
  const [text, setText] = useState(nodeData.text || '');
  const { setNodes } = useReactFlow();

  const handleTextChange = (newText: string) => {
    setText(newText);
    // Синхронизируем изменения с data ноды, чтобы они были видны другим компонентам
    setNodes((nds) =>
      nds.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, text: newText } } : n
      )
    );
  };

  return (
    <div className="w-[280px] bg-white rounded-2xl border border-[var(--color-border)] shadow-sm overflow-hidden">
      {/* Handle: Вход слева */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-emerald-500 !border-2 !border-white"
      />

      {/* Header */}
      <div className="px-4 py-2 border-b border-[var(--color-border)] bg-[var(--color-surface-secondary)]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-sm font-medium text-[var(--color-text-primary)]">
            {nodeData.label}
          </span>
        </div>
      </div>

      {/* Text Content */}
      <div className="p-4">
        <Textarea
          value={text}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder="Введите текст или промпт..."
          label="Текст"
          rows={4}
        />
      </div>

      {/* Handle: Выход справа */}
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-emerald-500 !border-2 !border-white"
      />
    </div>
  );
}
