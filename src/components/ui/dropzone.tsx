'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface DropzoneProps {
    onDrop: (acceptedFiles: File[]) => void;
    className?: string;
}

export function Dropzone({ onDrop, className }: DropzoneProps) {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': [],
            'image/png': [],
            'image/webp': [],
        },
    });

    return (
        <div
            {...getRootProps()}
            className={cn(
                'relative group cursor-pointer flex flex-col items-center justify-center w-full h-64 rounded-3xl border-2 border-dashed transition-all duration-300 ease-in-out overflow-hidden',
                isDragActive
                    ? 'border-primary bg-primary/5 scale-[1.02]'
                    : 'border-border hover:border-primary/50 hover:bg-muted/50',
                className
            )}
        >
            <input {...getInputProps()} />

            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: isDragActive ? 1.1 : 1 }}
                className="z-10 flex flex-col items-center gap-4 text-center p-6"
            >
                <div className="p-4 rounded-full bg-background shadow-lg ring-1 ring-border group-hover:ring-primary/50 transition-all duration-300">
                    {isDragActive ? (
                        <Upload className="w-8 h-8 text-primary animate-bounce" />
                    ) : (
                        <ImageIcon className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                    )}
                </div>

                <div className="space-y-1">
                    <h3 className="font-semibold text-lg tracking-tight">
                        {isDragActive ? 'Drop images here' : 'Upload Images'}
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-xs">
                        Drag & drop or click to select. Supports JPG, PNG, WebP.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
