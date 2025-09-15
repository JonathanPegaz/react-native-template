import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines class names using clsx and tailwind-merge
 * This ensures Tailwind classes are properly merged without conflicts
 *
 * @example
 * cn('px-4 py-2', 'px-8') // => 'py-2 px-8'
 * cn('text-red-500', condition && 'text-blue-500') // => 'text-blue-500' (if condition is true)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
