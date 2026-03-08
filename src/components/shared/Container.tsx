import React from 'react';

export interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function Container({ children, className = '' }: ContainerProps) {
  const baseStyles = 'w-full mx-auto px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12 lg:px-16 lg:py-16 max-w-7xl';
  
  const combinedClassName = `${baseStyles} ${className}`.trim();
  
  return (
    <div className={combinedClassName}>
      {children}
    </div>
  );
}
