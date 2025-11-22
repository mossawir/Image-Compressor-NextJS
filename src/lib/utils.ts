import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getDownloadFilename(originalName: string, format: string) {
    const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
    return `compressed-${nameWithoutExt}.${format}`;
}
