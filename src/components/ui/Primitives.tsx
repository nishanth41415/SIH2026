import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Card({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-sm border border-slate-800/60 bg-[#0B0F17] p-5 shadow-lg shadow-black/40 transition-all',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function Badge({
  variant = 'default',
  className,
  children
}: {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'cyan' | 'purple' | 'outline';
  className?: string;
  children: React.ReactNode;
}) {
  const variants = {
    default: 'bg-slate-800/80 text-slate-300 border-slate-700/80',
    success: 'bg-emerald-950/40 text-emerald-400 border-emerald-800/50',
    warning: 'bg-amber-950/40 text-amber-400 border-amber-800/50',
    danger: 'bg-rose-950/40 text-rose-400 border-rose-800/50',
    cyan: 'bg-blue-950/40 text-blue-400 border-blue-800/50',
    purple: 'bg-indigo-950/40 text-indigo-400 border-indigo-800/50',
    outline: 'bg-transparent text-slate-400 border-slate-800'
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm text-[10px] font-mono font-medium border tracking-wide whitespace-nowrap',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  disabled,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'cyan';
  size?: 'sm' | 'md' | 'lg';
}) {
  const base =
    'inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 rounded-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none focus:outline-none focus:ring-1 focus:ring-blue-500/40';

  const sizes = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-xs font-bold uppercase tracking-wider px-4 py-2',
    lg: 'text-sm font-bold uppercase tracking-wider px-5 py-2.5'
  };

  const variants = {
    primary:
      'bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-wider shadow-md shadow-blue-950/30 border border-blue-500/30',
    secondary:
      'bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold uppercase tracking-wider',
    danger:
      'bg-rose-600 hover:bg-rose-500 text-white font-bold uppercase tracking-wider shadow-md shadow-rose-950/30 border border-rose-500/40',
    ghost:
      'bg-transparent hover:bg-slate-800/50 text-slate-400 hover:text-slate-200 border border-transparent',
    cyan:
      'bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/40'
  };

  return (
    <button
      className={cn(base, sizes[size], variants[variant], className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

