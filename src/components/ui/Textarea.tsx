/**
 * Компонент Textarea в стиле shadcn/ui (Apple-inspired)
 * 
 * Для использования в Next.js с shadcn/ui:
 *   npx shadcn-ui@latest add textarea
 */
import { type TextareaHTMLAttributes, forwardRef } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', label, error, disabled, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className={`text-xs font-medium ${disabled ? 'text-[var(--color-text-tertiary)]' : 'text-[var(--color-text-secondary)]'}`}>
            {label}
            {disabled && (
              <span className="ml-1.5 text-[var(--color-text-tertiary)] font-normal">(из текстовой ноды)</span>
            )}
          </label>
        )}
        <textarea
          ref={ref}
          disabled={disabled}
          className={`
            w-full px-3 py-2 text-sm 
            rounded-xl border 
            bg-white 
            resize-none
            placeholder:text-[var(--color-text-tertiary)]
            border-[var(--color-border)]
            focus:border-[var(--color-accent)]
            transition-all duration-200
            ${disabled ? 'bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)] cursor-not-allowed border-[var(--color-border)]' : ''}
            ${error ? 'border-[var(--color-danger)]' : ''}
            ${className}
          `.trim()}
          {...props}
        />
        {error && (
          <p className="text-xs text-[var(--color-danger)]">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
