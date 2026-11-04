"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Artifact } from '@/lib/types';
import Image from 'next/image';

interface PantoneStripProps {
  artifact: Artifact;
  index: number;
  initialPos: { x: number; y: number; rotate: number };
}

export default function PantoneStrip({ artifact, index, initialPos }: PantoneStripProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      drag
      dragMomentum={false} // 减少滑行，增加控制感
      whileHover={{ scale: 1.1, zIndex: 100 }}
      whileDrag={{ scale: 1.15, zIndex: 200, cursor: 'grabbing' }}
      initial={{ 
        opacity: 0, 
        x: initialPos.x, 
        y: initialPos.y + 100, // 稍微从下方升起
        rotate: initialPos.rotate 
      }}
      animate={{ 
        opacity: 1, 
        x: initialPos.x, 
        y: initialPos.y,
        rotate: initialPos.rotate
      }}
      transition={{ duration: 0.6, delay: index * 0.05, type: "spring" }}
      className="absolute w-24 h-80 bg-white shadow-xl cursor-grab flex flex-col overflow-hidden select-none rounded-sm"
      style={{ transformOrigin: 'center center' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Color Area (75%) */}
      <div className="relative h-[75%] w-full" style={{ backgroundColor: artifact.hex }}>
        {/* Reveal Image on Hover */}
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
            sizes="150px"
            draggable={false} // 禁止图片原生拖拽
          />
        </div>
      </div>

      {/* Text Area (25%) */}
      <div className="h-[25%] p-3 flex flex-col justify-between bg-white font-mono text-[10px] border-t border-gray-100">
        <div>
          <div className="font-bold text-xs text-black mb-1 leading-tight">{artifact.colorName}</div>
          <div className="text-gray-500">{artifact.hex}</div>
        </div>
        <div className="text-[9px] text-gray-400 truncate">
          {artifact.date}
        </div>
      </div>
      
      {/* The "Hole" at bottom */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-gray-200 rounded-full" />
    </motion.div>
  );
}

