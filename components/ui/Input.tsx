import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  roundedSize?: 'md' | 'full';
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  className = '',
  roundedSize = 'md',
  icon,
  ...props
}) => {
  const roundedStyles = {
    md: 'rounded-md',
    full: 'rounded-full',
  };

  return (
    <div className="relative w-full">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-warm-gray">
          {icon}
        </div>
      )}
      <input
        className={`w-full bg-white border border-border-subtle text-on-surface py-3 ${
          icon ? 'pl-11' : 'px-4'
        } pr-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-body-sm shadow-sm transition-all duration-200 ${
          roundedStyles[roundedSize]
        } ${className}`}
        {...props}
      />
    </div>
  );
};
