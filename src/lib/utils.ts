import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// shadcn/ui's class helper: joins conditional classes, and later Tailwind classes win conflicts
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
