'use client';

import { Download, Trash2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface ActionBarProps {
    selectedCount: number;
    onProcessAll: () => void;
    onDownloadAll: () => void;
    onClearAll: () => void;
    isProcessing: boolean;
    hasCompleted: boolean;
}

export function ActionBar({
    selectedCount,
    onProcessAll,
    onDownloadAll,
    onClearAll,
    isProcessing,
    hasCompleted,
}: ActionBarProps) {
    if (selectedCount === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
        >
            <div className="bg-background/80 backdrop-blur-lg border shadow-lg rounded-full px-6 py-3 flex items-center gap-4">
                <span className="text-sm font-medium text-muted-foreground border-r pr-4">
                    {selectedCount} images
                </span>

                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClearAll}
                        className="text-muted-foreground hover:text-destructive"
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Clear
                    </Button>

                    {!hasCompleted && (
                        <Button
                            size="sm"
                            onClick={onProcessAll}
                            disabled={isProcessing}
                            className="bg-primary text-primary-foreground shadow-md hover:shadow-lg transition-all"
                        >
                            <Zap className="w-4 h-4 mr-2" />
                            {isProcessing ? 'Processing...' : 'Compress All'}
                        </Button>
                    )}

                    {hasCompleted && (
                        <Button
                            size="sm"
                            onClick={onDownloadAll}
                            className="bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg transition-all"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Download All
                        </Button>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
