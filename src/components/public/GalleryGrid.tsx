"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Card";
import type { GalleryImage } from "@/types";

interface GalleryGridProps {
  images: GalleryImage[];
}

export function GalleryGrid({ images }: GalleryGridProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <button
            key={image.id}
            onClick={() => setSelectedImage(image)}
            className="group relative aspect-square rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <img
              src={image.image_url}
              alt={image.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <div className="text-white text-left">
                <p className="font-semibold text-sm">{image.title}</p>
                {image.caption && (
                  <p className="text-xs text-white/70 mt-0.5">
                    {image.caption}
                  </p>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      <Modal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        title={selectedImage?.title}
        size="xl"
      >
        {selectedImage && (
          <div>
            <img
              src={selectedImage.image_url}
              alt={selectedImage.title}
              className="w-full rounded-lg"
            />
            {selectedImage.caption && (
              <p className="mt-4 text-sm text-gray-600 text-center">
                {selectedImage.caption}
              </p>
            )}
          </div>
        )}
      </Modal>
    </>
  );
}
