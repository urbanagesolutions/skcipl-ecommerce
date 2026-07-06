import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger' | 'coming-soon';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-bold transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]';
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-label-caps text-xs rounded-sm',
    md: 'px-6 py-3 text-body-sm rounded-md',
    lg: 'px-8 py-4 text-body-lg rounded-md',
  };

  const variantStyles = {
    primary: 'bg-primary text-white hover:bg-primary-container hover:text-on-primary-container shadow-elevation-1',
    secondary: 'bg-secondary text-white hover:bg-opacity-90 shadow-elevation-1',
    outline: 'border-2 border-primary text-primary bg-transparent hover:bg-primary hover:bg-opacity-5',
    ghost: 'bg-transparent text-primary hover:bg-primary hover:bg-opacity-5',
    danger: 'bg-sale-red text-white hover:bg-opacity-90',
    'coming-soon': 'bg-warm-gray text-white cursor-not-allowed opacity-60',
  };

  return (
    <button
      disabled={disabled || variant === 'coming-soon'}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
