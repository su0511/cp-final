"use client";

import React, { useState } from 'react';
import { Artifact } from '@/lib/types';
import StudioCard from './StudioCard';
import ManifestBar from './ManifestBar';

interface StudioGridProps {
  artifacts: Artifact[];
}

type SortMode = 'HEX' | 'DATE' | 'CULTURE';

export default function StudioGrid({ artifacts }: StudioGridProps) {
  const [sortMode, setSortMode] = useState<SortMode>('HEX');

  // Sorting Logic
  const sortedArtifacts = [...artifacts].sort((a, b) => {
    switch (sortMode) {
      case 'HEX':
        // Simple luminance sort
        return a.hex.localeCompare(b.hex); 
      case 'DATE':
         // Very simple string sort for now, better logic in real app
        return a.date.localeCompare(b.date);
      case 'CULTURE':
        return a.culture.localeCompare(b.culture);
      default:
        return 0;
    }
  });

  return (
    <div className="pb-32"> {/* Padding for bottom bar */}
      {/* Filter Deck */}
      <div className="sticky top-0 z-20 bg-[#F0F0F0]/95 backdrop-blur border-b border-black py-3 mb-8 flex gap-4 text-xs font-mono uppercase overflow-x-auto no-scrollbar">
        <span className="font-bold self-center px-2">SORT_BY:</span>
        {(['HEX', 'DATE', 'CULTURE'] as SortMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => setSortMode(mode)}
            className={`
              px-3 py-1 border border-black transition-colors
              ${sortMode === mode ? 'bg-black text-white' : 'hover:bg-black hover:text-white'}
            `}
          >
            {mode}
          </button>
        ))}
      </div>

      {/* The Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-8">
        {sortedArtifacts.map((artifact) => (
          <StudioCard key={artifact.id} artifact={artifact} />
        ))}
      </div>

      {/* Bottom Manifest Bar */}
      <ManifestBar />
    </div>
  );
}

