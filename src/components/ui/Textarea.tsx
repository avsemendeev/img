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
  ({ className = '', label, error, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="text-xs font-medium text-[var(--color-text-secondary)]">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`
            w-full px-3 py-2 text-sm 
            rounded-xl border 
            bg-white 
            resize-none
            placeholder:text-[var(--color-text-tertiary)]
            border-[var(--color-border)]
            focus:border-[var(--color-accent)]
            transition-all duration-200
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
