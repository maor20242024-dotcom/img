"use client";
import { ButtonHTMLAttributes, ReactNode } from 'react';
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

interface LuxuryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export default function LuxuryButton({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  ...props
}: LuxuryButtonProps) {
  const baseClasses = "font-bold transition-all duration-300 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-[#f1d07e] to-[#caa449] text-[#111] font-semibold hover:bg-[#111] hover:text-[#f1d07e] border border-[#f1d07e] hover:border-[#f1d07e]",
    secondary: "bg-black/80 text-[#f1d07e] border border-[#f1d07e] hover:bg-[#f1d07e] hover:text-[#111]",
    outline: "bg-transparent text-[#f1d07e] border border-[#f1d07e] hover:bg-[#f1d07e] hover:text-[#111]"
  };
  
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };
  
  const widthClasses = fullWidth ? "w-full" : "";
  
  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        widthClasses,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}