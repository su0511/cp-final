"use client";

import React, { useState, useEffect } from 'react';
import { Artifact } from '@/lib/types';
import InteractiveCard from './InteractiveCard';

interface StudioDeskProps {
  artifacts: Artifact[];
}

export default function StudioDesk({ artifacts }: StudioDeskProps) {
  const [positions, setPositions] = useState<{x: number, y: number, rotate: number}[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const calculatePositions = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // 卡片尺寸
      const cardWidth = 192; // w-48 = 12rem = 192px
      const cardHeight = 280; // 估算高度

      return artifacts.map(() => {
        // 散落区域：全屏，稍微留出边距
        // 中心点为 (0,0) 对于 absolute 定位来说不方便，framer motion 的 x/y 是相对于父容器左上角的偏移
        // 父容器是 relative，且 full width/height
        
        // 我们希望它们散落在屏幕中心区域
        const paddingX = viewportWidth * 0.1;
        const paddingY = viewportHeight * 0.1;
        const availableW = viewportWidth - paddingX * 2 - cardWidth;
        const availableH = viewportHeight - paddingY * 2 - cardHeight;

        return {
          x: paddingX + Math.random() * availableW,
          y: paddingY + Math.random() * availableH,
          rotate: Math.random() * 40 - 20 // -20 到 20 度旋转
        };
      });
    };

    setPositions(calculatePositions());
    setIsLoaded(true);

    // 可选：监听 resize 重新计算 (可能会导致位置重置，暂时只在 mount 时计算)
  }, [artifacts]);

  if (!isLoaded) return null;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#EAEAE5]"> {/* 使用更自然的米色背景 */}
      {/* Background Grid Texture (Optional) */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ 
          backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', 
          backgroundSize: '20px 20px' 
        }} 
      />

      {artifacts.map((artifact, index) => (
        <InteractiveCard 
          key={artifact.id} 
          artifact={artifact} 
          index={index}
          initialPos={positions[index]}
        />
      ))}
      
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none opacity-40">
        <p className="font-mono text-xs text-black text-center tracking-widest">
          INTERACTIVE ARCHIVE<br/>
          DRAG TO CURATE
        </p>
      </div>
    </div>
  );
}
