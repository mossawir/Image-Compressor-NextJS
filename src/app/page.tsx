'use client';

import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { AnimatePresence, motion } from 'framer-motion';
import { Dropzone } from '@/components/ui/dropzone';
import { ImageCard, type ImageFile } from '@/components/image-card';
import { ActionBar } from '@/components/action-bar';
import { getDownloadFilename } from '@/lib/utils';

export default function Home() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDrop = useCallback((acceptedFiles: File[]) => {
    const newImages = acceptedFiles.map((file) => ({
      id: uuidv4(),
      file,
      preview: URL.createObjectURL(file),
      status: 'pending' as const,
      originalSize: file.size,
      format: file.type.split('/')[1] as 'jpg' | 'png' | 'webp',
      targetFormat: 'webp' as 'jpg' | 'png' | 'webp',
      quality: 80,
    }));
    setImages((prev) => [...prev, ...newImages]);
  }, []);

  const handleRemove = (id: string) => {
    setImages((prev) => {
      const image = prev.find((img) => img.id === id);
      if (image) URL.revokeObjectURL(image.preview);
      return prev.filter((img) => img.id !== id);
    });
  };

  const handleUpdate = (id: string, updates: Partial<ImageFile>) => {
    setImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, ...updates } : img))
    );
  };

  const processImage = async (image: ImageFile) => {
    try {
      handleUpdate(image.id, { status: 'processing' });

      const formData = new FormData();
      formData.append('file', image.file);
      formData.append('format', image.targetFormat);
      formData.append('quality', image.quality.toString());

      const response = await fetch('/api/process', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Processing failed');

      const blob = await response.blob();
      const processedUrl = URL.createObjectURL(blob);

      handleUpdate(image.id, {
        status: 'completed',
        processedUrl,
        processedSize: blob.size,
      });
    } catch (error) {
      console.error(error);
      handleUpdate(image.id, { status: 'error' });
    }
  };

  const handleProcessAll = async () => {
    setIsProcessing(true);
    const pendingImages = images.filter((img) => img.status !== 'completed');
    await Promise.all(pendingImages.map((img) => processImage(img)));
    setIsProcessing(false);
  };

  const handleDownloadAll = async () => {
    const zip = new JSZip();
    const completedImages = images.filter((img) => img.status === 'completed');

    for (const img of completedImages) {
      if (img.processedUrl) {
        const response = await fetch(img.processedUrl);
        const blob = await response.blob();
        const fileName = getDownloadFilename(img.file.name, img.targetFormat);
        zip.file(fileName, blob);
      }
    }

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'compressed-images.zip');
  };

  const handleClearAll = () => {
    images.forEach((img) => URL.revokeObjectURL(img.preview));
    setImages([]);
  };

  return (
    <main className="min-h-screen bg-background text-foreground p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Image Compressor
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Compress and convert your images locally with high quality.
            Supports JPG, PNG, and WebP.
          </p>
        </div>

        {/* Upload Area */}
        <Dropzone onDrop={handleDrop} />

        {/* Image Grid */}
        <AnimatePresence>
          {images.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24"
            >
              {images.map((image) => (
                <ImageCard
                  key={image.id}
                  image={image}
                  onRemove={handleRemove}
                  onUpdate={handleUpdate}
                  onProcess={() => processImage(image)}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Bar */}
        <ActionBar
          selectedCount={images.length}
          onProcessAll={handleProcessAll}
          onDownloadAll={handleDownloadAll}
          onClearAll={handleClearAll}
          isProcessing={isProcessing}
          hasCompleted={images.some((img) => img.status === 'completed')}
        />

        {/* Footer */}
        <footer className="text-center text-muted-foreground text-sm py-8">
          <p>Developed By Mossawir Ahmed - 2025</p>
        </footer>
      </div>
    </main>
  );
}
