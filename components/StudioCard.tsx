"use client";

import React from 'react';
import { Artifact } from '@/lib/types';
import { usePalette } from '@/context/PaletteContext';
import Image from 'next/image';

interface StudioCardProps {
  artifact: Artifact;
}

export default function StudioCard({ artifact }: StudioCardProps) {
  const { addToPalette, removeFromPalette, isInPalette } = usePalette();
  const isSelected = isInPalette(artifact.id);

  const toggleSelection = () => {
    if (isSelected) {
      removeFromPalette(artifact.id);
    } else {
      addToPalette(artifact);
    }
  };

  return (
    <div 
      onClick={toggleSelection}
      className={`
        group relative cursor-pointer transition-all duration-200
        border border-transparent hover:border-black
        ${isSelected ? 'ring-2 ring-black ring-offset-2' : ''}
      `}
    >
      {/* Image/Color Area */}
      <div className="relative aspect-[3/4] bg-gray-100 mb-2 overflow-hidden">
        {/* Color Block (Default) */}
        <div 
          className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-0"
          style={{ backgroundColor: artifact.hex }} 
        />
        
        {/* Image (Reveal on Hover) */}
        <Image
          src={artifact.imageUrl}
          alt={artifact.title}
          fill
          className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          sizes="(max-width: 768px) 50vw, 20vw"
        />

        {/* Selection Indicator Overlay */}
        {isSelected && (
          <div className="absolute top-2 right-2 w-3 h-3 bg-black rounded-full shadow-sm border border-white" />
        )}
      </div>

      {/* Meta Data (Monospace List Style) */}
      <div className="flex flex-col gap-0.5 text-[10px] leading-tight font-mono text-[#333]">
        <div className="flex justify-between border-b border-gray-200 pb-1 mb-1">
          <span className="font-bold">#{artifact.id}</span>
          <span className="uppercase">{artifact.hex}</span>
        </div>
        <div className="truncate font-medium">{artifact.colorName}</div>
        <div className="truncate text-[#888]">{artifact.date}</div>
      </div>
    </div>
  );
}

