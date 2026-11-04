"use client";

import Link from 'next/link';
import { Artifact } from '@/lib/types';
import { useState } from 'react';

interface ColorCardProps {
  artifact: Artifact;
}

export default function ColorCard({ artifact }: ColorCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Link href={`/artifact/${artifact.id}`}>
      <div className="group relative flex flex-col bg-white cursor-pointer overflow-hidden rounded-sm transition-all duration-300 hover:scale-[1.02]"
           style={{ 
             aspectRatio: '2/3',
             boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)'
           }}>
        
        {/* Top: Color Block (70%) */}
        <div 
          className="relative h-[70%] w-full overflow-hidden"
          style={{ backgroundColor: artifact.hex }}
        >
          {/* Image on Hover */}
          {!imageError && (
            <div 
              className={`absolute inset-0 w-full h-full transition-opacity duration-500 bg-cover bg-center ${
                imageLoaded ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'
              }`}
              style={{ backgroundImage: `url(${artifact.imageUrl})` }}
            >
              <img
                src={artifact.imageUrl}
                alt={artifact.title}
                className="w-full h-full object-cover"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                style={{ display: 'none' }} // 预加载但不显示
              />
            </div>
          )}
          
          {/* Fallback for image error */}
          {imageError && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="text-white/80 text-xs text-center px-4">
                <div className="mb-2">📦</div>
                <div>Artifact Archived</div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom: Metadata (30%) */}
        <div className="flex flex-col justify-between p-4 h-[30%] bg-white">
          <div>
            <h3 className="text-lg font-bold text-[#1A1A1A] leading-none mb-1">
              {artifact.colorName}
            </h3>
            <p className="font-mono text-xs text-[#888888] tracking-wider">
              {artifact.hex}
            </p>
          </div>
          
          <div className="mt-auto pt-2 border-t border-gray-100">
            <p className="text-[10px] font-medium text-[#1A1A1A] truncate">
              {artifact.title}
            </p>
            <p className="text-[9px] text-[#888888] truncate mt-0.5">
              {artifact.culture}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
