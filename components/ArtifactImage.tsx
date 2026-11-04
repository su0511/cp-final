"use client";

import { useState } from 'react';

interface ArtifactImageProps {
  src: string;
  alt: string;
  bgColor?: string; // 可选，如果不需要背景色
}

export default function ArtifactImage({ src, alt, bgColor }: ArtifactImageProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div 
      className="relative rounded-lg overflow-hidden"
      style={{ 
        aspectRatio: '2/3'
      }}
    >
      {!imageError ? (
        <>
          <img
            src={src}
            alt={alt}
            className={`w-full h-full object-contain transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center bg-white">
              <div className="text-[#888888] text-sm">Loading...</div>
            </div>
          )}
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-white">
          <div className="text-center text-[#888888]">
            <div className="text-4xl mb-2">📦</div>
            <p className="text-sm">Image unavailable</p>
          </div>
        </div>
      )}
    </div>
  );
}
