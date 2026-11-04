"use client";

import React, { useState } from 'react';
import { usePalette } from '@/context/PaletteContext';
import { Artifact } from '@/lib/types';

export default function ManifestBar() {
  const { savedArtifacts, clearPalette, removeFromPalette } = usePalette();
  const [isExpanded, setIsExpanded] = useState(false);

  if (savedArtifacts.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-3xl">
      <div className="bg-black text-white p-1 shadow-2xl border border-white/20 flex flex-col transition-all duration-300">
        
        {/* Top Bar: Summary & Actions */}
        <div className="flex justify-between items-center px-4 py-2 font-mono text-xs uppercase">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>MANIFEST_STATUS: ACTIVE</span>
            <span className="bg-white/20 px-2 py-0.5 rounded">
              COUNT: {savedArtifacts.length}
            </span>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="hover:text-green-400"
            >
              {isExpanded ? '[_MINIMIZE]' : '[+EXPAND]'}
            </button>
            <button 
               onClick={clearPalette}
               className="hover:text-red-400"
            >
              [X_CLEAR]
            </button>
          </div>
        </div>

        {/* Expanded View: The Swatches */}
        {isExpanded && (
          <div className="border-t border-white/20 p-4 flex flex-wrap gap-2 max-h-40 overflow-y-auto">
            {savedArtifacts.map((artifact) => (
              <div 
                key={artifact.id}
                className="group relative w-10 h-10 cursor-pointer border border-white/30 hover:border-white"
                onClick={() => removeFromPalette(artifact.id)}
                title={`${artifact.colorName} (${artifact.hex})`}
              >
                <div 
                  className="w-full h-full"
                  style={{ backgroundColor: artifact.hex }} 
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 text-[8px]">
                  X
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Main Action: Generate */}
        <div className="border-t border-white/20">
          <button 
            className="w-full py-3 text-center font-bold hover:bg-white hover:text-black transition-colors uppercase tracking-widest text-sm"
            onClick={() => alert('Generative Logic Coming Soon!')}
          >
            /// GENERATE CHRONO-PERSONA ///
          </button>
        </div>

      </div>
    </div>
  );
}

