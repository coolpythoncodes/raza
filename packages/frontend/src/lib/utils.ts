import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const responsiveConfig = {
  small: 0,
  middle: 1024,
  large: 1280,
};