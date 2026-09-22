/**
 * Компонент Card в стиле shadcn/ui (Apple-inspired)
 * 
 * Для использования в Next.js с shadcn/ui:
 *   npx shadcn-ui@latest add card
 */
import { type HTMLAttributes, forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          bg-white rounded-2xl 
          border border-[var(--color-border)]
          shadow-[0_4px_24px_rgba(0,0,0,0.06),0_1px_4px_rgba(0,0,0,0.04)]
          transition-shadow duration-200
          hover:shadow-[0_8px_32px_rgba(0,0,0,0.1),0_2px_8px_rgba(0,0,0,0.06)]
          ${className}
        `.trim()}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-surface-secondary)] rounded-t-2xl ${className}`.trim()}
        {...props}
      />
    );
  }
);

CardHeader.displayName = 'CardHeader';

export const CardContent = forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`p-4 ${className}`.trim()}
        {...props}
      />
    );
  }
);

CardContent.displayName = 'CardContent';
