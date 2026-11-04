"use client";

import React, { useState, useMemo } from 'react';
import { Artifact } from '@/lib/types';
import ColorCard from './ColorCard';
import Link from 'next/link';

interface ArtifactGridProps {
  initialArtifacts: Artifact[];
}

type SortOption = 'color' | 'time';

export default function ArtifactGrid({ initialArtifacts }: ArtifactGridProps) {
  const [sortBy, setSortBy] = useState<SortOption>('color');

  // 辅助函数：解析年份
  const parseYear = (dateStr: string): number => {
    const lowerDate = dateStr.toLowerCase();
    
    // 1. 处理 B.C. / BCE
    const bcMatch = lowerDate.match(/(\d+)\s*(?:[-–]\s*\d+\s*)?(?:b\.?c\.?e?\.?|b\.?c\.?)/);
    if (bcMatch) {
      return -parseInt(bcMatch[1]);
    }

    // 2. 处理世纪 (e.g., "6th century")
    const centuryMatch = lowerDate.match(/(\d+)(?:st|nd|rd|th)?\s*century/);
    if (centuryMatch) {
        let century = parseInt(centuryMatch[1]);
        // 世纪转换为大致年份 (6th century -> 500s)
        let year = (century - 1) * 100;
        if (lowerDate.includes('bc')) {
            return -(century * 100); // 6th century BC -> -600
        }
        return year;
    }

    // 3. 处理普通年份 (e.g., "1732", "19th century")
    // 优先匹配4位数字
    const yearMatch = dateStr.match(/(\d{3,4})/);
    if (yearMatch) {
        return parseInt(yearMatch[1]);
    }

    return 0; // 默认值
  };

  // 辅助函数：计算亮度
  const getLuminance = (hex: string) => {
    const c = hex.substring(1);      // strip #
    const rgb = parseInt(c, 16);   // convert rrggbb to decimal
    const r = (rgb >> 16) & 0xff;  // extract red
    const g = (rgb >>  8) & 0xff;  // extract green
    const b = (rgb >>  0) & 0xff;  // extract blue

    // Perceived luminance formula
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const sortedArtifacts = useMemo(() => {
    const items = [...initialArtifacts];
    if (sortBy === 'color') {
      // 按亮度从暗到亮排序
      return items.sort((a, b) => getLuminance(a.hex) - getLuminance(b.hex));
    } else {
      // 按时间从古老到现代排序
      return items.sort((a, b) => parseYear(a.date) - parseYear(b.date));
    }
  }, [initialArtifacts, sortBy]);

  return (
    <div>
      {/* Sort Controls */}
      <div className="flex justify-center gap-4 mb-12 sticky top-4 z-10 py-2">
        <div className="bg-white/80 backdrop-blur-md p-1.5 rounded-full shadow-sm border border-gray-100 flex gap-2">
          <button
            onClick={() => setSortBy('color')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              sortBy === 'color' 
                ? 'bg-[#1A1A1A] text-white shadow-md' 
                : 'text-[#888888] hover:bg-gray-50 hover:text-[#1A1A1A]'
            }`}
          >
            Color
          </button>
          <button
            onClick={() => setSortBy('time')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              sortBy === 'time' 
                ? 'bg-[#1A1A1A] text-white shadow-md' 
                : 'text-[#888888] hover:bg-gray-50 hover:text-[#1A1A1A]'
            }`}
          >
            Time
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        {sortedArtifacts.map((artifact) => (
          <div key={artifact.id} className="block h-full">
            <ColorCard artifact={artifact} />
          </div>
        ))}
      </div>
    </div>
  );
}

