"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Artifact } from '@/lib/types';
import Image from 'next/image';
import { usePalette } from '@/context/PaletteContext';

interface InteractiveCardProps {
  artifact: Artifact;
  index: number;
  initialPos: { x: number; y: number; rotate: number };
}

export default function InteractiveCard({ artifact, index, initialPos }: InteractiveCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { addToPalette, isInPalette } = usePalette();
  
  const isMixed = isInPalette(artifact.id);

  // If it's mixed (in the cauldron), we remove it from the desk.
  if (isMixed) return null;

  return (
    <motion.div
      drag
      dragMomentum={false}
      onDragEnd={(event, info) => {
        const { point } = info;
        const winW = window.innerWidth;
        const winH = window.innerHeight;
        
        // Drop Zone: Bottom Right (approx 300x300)
        if (point.x > winW - 300 && point.y > winH - 300) {
            addToPalette(artifact);
        }
      }}
      whileHover={{ scale: 1.05, zIndex: 10000 }}
      whileDrag={{ scale: 1.1, zIndex: 10000, cursor: 'grabbing' }}
      initial={{ 
        opacity: 0, 
        x: initialPos.x, 
        y: initialPos.y + 100, 
        rotate: initialPos.rotate 
      }}
      animate={{ 
        opacity: 1,
        scale: 1,
        x: initialPos.x, 
        y: initialPos.y,
        rotate: initialPos.rotate
      }}
      transition={{ duration: 0.6, delay: index * 0.02, type: "spring" }}
      
      className="absolute w-48 bg-white shadow-[0_5px_15px_rgba(0,0,0,0.15)] cursor-grab flex flex-col p-3 pb-4 rounded-sm select-none"
      style={{ transformOrigin: 'center center' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image/Color Area - Square Aspect Ratio */}
      <div className="relative w-full aspect-square mb-3 bg-gray-100 overflow-hidden border border-gray-100">
        <div className="absolute inset-0 w-full h-full" style={{ backgroundColor: artifact.hex }} />
        
        <div 
          className={`absolute inset-0 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
           <Image
            src={artifact.imageUrl}
            alt={artifact.title}
            fill
            className="object-cover"
            sizes="200px"
            draggable={false}
          />
        </div>
      </div>

      {/* Text Area */}
      <div className="flex flex-col gap-1 font-mono text-xs text-black">
        <div className="flex justify-between items-baseline">
            <span className="font-bold">{artifact.colorName}</span>
            <span className="text-[10px] text-gray-500">{artifact.hex}</span>
        </div>
        <div className="w-full h-px bg-gray-200 my-1" />
        <div className="text-[10px] text-gray-600 leading-tight line-clamp-2 h-6">
          {artifact.title}
        </div>
        <div className="text-[9px] text-gray-400 mt-0.5">
          {artifact.date}
        </div>
      </div>
    </motion.div>
  );
}
