'use client';

import { useState } from 'react';
import { X, Download, RefreshCw, FileImage, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { saveAs } from 'file-saver';
import { Button } from '@/components/ui/button';
import { cn, getDownloadFilename } from '@/lib/utils';

export interface ImageFile {
    id: string;
    file: File;
    preview: string;
    status: 'pending' | 'processing' | 'completed' | 'error';
    processedUrl?: string;
    processedSize?: number;
    originalSize: number;
    format: 'jpg' | 'png' | 'webp';
    targetFormat: 'jpg' | 'png' | 'webp';
    quality: number;
}

interface ImageCardProps {
    image: ImageFile;
    onRemove: (id: string) => void;
    onUpdate: (id: string, updates: Partial<ImageFile>) => void;
    onProcess: (id: string) => void;
}

export function ImageCard({ image, onRemove, onUpdate, onProcess }: ImageCardProps) {
    const [showComparison, setShowComparison] = useState(false);

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getReduction = () => {
        if (!image.processedSize) return 0;
        return Math.round(((image.originalSize - image.processedSize) / image.originalSize) * 100);
    };

    const handleDownload = () => {
        if (image.processedUrl) {
            const filename = getDownloadFilename(image.file.name, image.targetFormat);
            saveAs(image.processedUrl, filename);
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="group relative bg-card rounded-2xl border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
        >
            {/* Header / Controls */}
            <div className="p-4 border-b bg-muted/30 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-2 rounded-lg bg-background border shadow-sm">
                        <FileImage className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="font-medium truncate text-sm" title={image.file.name}>
                            {image.file.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            {formatSize(image.originalSize)}
                        </span>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => onRemove(image.id)}
                >
                    <X className="w-4 h-4" />
                </Button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
                {/* Preview Area */}
                <div className="relative aspect-video rounded-xl overflow-hidden bg-muted/50 border">
                    {image.status === 'completed' && showComparison ? (
                        <div className="absolute inset-0 flex">
                            <div className="w-1/2 h-full relative border-r border-white/20">
                                <img src={image.preview} alt="Original" className="w-full h-full object-cover" />
                                <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm">
                                    Original
                                </div>
                            </div>
                            <div className="w-1/2 h-full relative">
                                <img src={image.processedUrl} alt="Processed" className="w-full h-full object-cover" />
                                <div className="absolute bottom-2 right-2 bg-primary/90 text-primary-foreground text-[10px] px-2 py-1 rounded backdrop-blur-sm">
                                    Compressed
                                </div>
                            </div>
                        </div>
                    ) : (
                        <img
                            src={image.status === 'completed' ? (image.processedUrl || image.preview) : image.preview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                    )}

                    {image.status === 'processing' && (
                        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center">
                            <RefreshCw className="w-8 h-8 text-primary animate-spin" />
                        </div>
                    )}
                </div>

                {/* Settings & Status */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <select
                                value={image.targetFormat}
                                onChange={(e) => onUpdate(image.id, { targetFormat: e.target.value as any })}
                                className="bg-background border rounded px-2 py-1 text-xs focus:ring-1 focus:ring-primary outline-none"
                                disabled={image.status === 'processing'}
                            >
                                <option value="jpg">JPG</option>
                                <option value="png">PNG</option>
                                <option value="webp">WebP</option>
                            </select>
                            <span className="text-muted-foreground text-xs">at</span>
                            <input
                                type="number"
                                min="1"
                                max="100"
                                value={image.quality}
                                onChange={(e) => onUpdate(image.id, { quality: parseInt(e.target.value) })}
                                className="w-12 bg-background border rounded px-2 py-1 text-xs focus:ring-1 focus:ring-primary outline-none"
                                disabled={image.status === 'processing'}
                            />
                            <span className="text-muted-foreground text-xs">%</span>
                        </div>

                        {image.status === 'completed' && (
                            <div className="flex items-center gap-1 text-xs font-medium text-green-600">
                                <span>-{getReduction()}%</span>
                                <ArrowRight className="w-3 h-3" />
                                <span>{formatSize(image.processedSize || 0)}</span>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                        {image.status === 'completed' ? (
                            <>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 text-xs"
                                    onClick={() => setShowComparison(!showComparison)}
                                >
                                    {showComparison ? 'Hide Compare' : 'Compare'}
                                </Button>
                                <Button
                                    size="sm"
                                    className="flex-1 text-xs gap-2"
                                    onClick={handleDownload}
                                >
                                    <Download className="w-3 h-3" /> Save
                                </Button>
                            </>
                        ) : (
                            <Button
                                size="sm"
                                className="w-full text-xs gap-2"
                                onClick={() => onProcess(image.id)}
                                disabled={image.status === 'processing'}
                            >
                                {image.status === 'processing' ? 'Compressing...' : 'Compress Image'}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
