import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevation?: 0 | 1 | 2;
  roundedSize?: 'sm' | 'md' | 'lg' | '2xl' | 'full';
}

export const Card: React.FC<CardProps> = ({
  children,
  elevation = 1,
  roundedSize = '2xl',
  className = '',
  ...props
}) => {
  const elevationStyles = {
    0: 'border border-border-subtle bg-white',
    1: 'shadow-elevation-1 bg-white border border-border-subtle',
    2: 'shadow-elevation-2 bg-white border border-border-subtle',
  };

  const roundedStyles = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    '2xl': 'rounded-2xl',
    full: 'rounded-full',
  };

  return (
    <div
      className={`${elevationStyles[elevation]} ${roundedStyles[roundedSize]} p-6 transition-all duration-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
