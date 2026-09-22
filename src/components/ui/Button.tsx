/**
 * Компонент Button в стиле shadcn/ui (Apple-inspired)
 * 
 * Для использования в Next.js с shadcn/ui:
 *   npx shadcn-ui@latest init
 *   npx shadcn-ui@latest add button
 * 
 * Данный файл — упрощённая версия для standalone React.
 */
import { type ButtonHTMLAttributes, forwardRef } from 'react';

type Variant = 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive';
type Size = 'default' | 'sm' | 'lg' | 'icon';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  default: 'bg-[var(--color-text-primary)] text-white hover:opacity-90',
  secondary: 'bg-[var(--color-surface-secondary)] text-[var(--color-text-primary)] hover:bg-[var(--color-border)]',
  outline: 'border border-[var(--color-border)] bg-white hover:bg-[var(--color-surface-secondary)] text-[var(--color-text-primary)]',
  ghost: 'hover:bg-[var(--color-surface-secondary)] text-[var(--color-text-primary)]',
  destructive: 'bg-[var(--color-danger)] text-white hover:opacity-90',
};

const sizeClasses: Record<Size, string> = {
  default: 'h-9 px-4 py-2 text-sm',
  sm: 'h-8 px-3 text-xs',
  lg: 'h-11 px-8 text-base',
  icon: 'h-9 w-9',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`
          inline-flex items-center justify-center 
          rounded-xl font-medium 
          transition-all duration-200 
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2
          disabled:pointer-events-none disabled:opacity-50
          active:scale-[0.98]
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${className}
        `.trim()}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
