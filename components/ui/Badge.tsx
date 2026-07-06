import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'sale' | 'pending' | 'gray' | 'coming-soon';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  className = '',
  ...props
}) => {
  const variantStyles = {
    primary: 'bg-primary-container text-on-primary-container font-semibold',
    secondary: 'bg-secondary-container text-on-secondary-container font-semibold',
    sale: 'bg-sale-red text-white font-bold uppercase tracking-wider',
    pending: 'bg-yellow-100 text-yellow-800 font-medium',
    gray: 'bg-warm-gray bg-opacity-20 text-on-surface-variant font-medium',
    'coming-soon': 'bg-warm-gray text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5',
  };

  return (
    <span
      className={`inline-block px-2.5 py-1 text-xs rounded-full ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
