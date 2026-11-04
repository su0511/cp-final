"use client";

import React, { useState } from 'react';
import { usePalette } from '@/context/PaletteContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function MixingZone({ onOpenIdentity }: { onOpenIdentity: () => void }) {
  const { savedArtifacts, mixedColor, clearPalette, removeFromPalette } = usePalette();
  const [isExpanded, setIsExpanded] = useState(false);
  const count = savedArtifacts.length;

  return (
    <motion.div 
      className="fixed bottom-8 right-8 z-40 flex flex-col items-end gap-4 pointer-events-none"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
    >
      {/* Action Button - Moved to Top */}
      <AnimatePresence>
        {count > 0 && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={onOpenIdentity}
            className="bg-black text-white px-6 py-2 font-mono text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors shadow-lg pointer-events-auto mb-2 mr-2"
          >
            Generate Identity
          </motion.button>
        )}
      </AnimatePresence>

      {/* The Mixer Circle */}
      <div 
        className="relative w-32 h-32 rounded-full border-2 border-dashed flex items-center justify-center transition-all duration-500 pointer-events-auto bg-white/50 backdrop-blur-sm cursor-pointer hover:bg-white/80"
        style={{ 
          borderColor: count > 0 ? mixedColor : '#aaa',
        }}
        onClick={() => count > 0 && setIsExpanded(!isExpanded)}
      >
        {/* Center Pulse */}
        {count > 0 && (
          <motion.div 
            layoutId="soul-core"
            className="w-16 h-16 rounded-full shadow-lg"
            style={{ backgroundColor: mixedColor }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 3 }}
          />
        )}

        {/* Text Hint */}
        {count === 0 && (
          <span className="text-[10px] font-mono text-gray-500 text-center leading-tight pointer-events-none select-none">
            DRAG HERE<br/>TO MIX
          </span>
        )}
        
        {/* Counter Badge */}
        {count > 0 && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs font-mono border border-white">
            {count}
          </div>
        )}
      </div>

      {/* Expanded List for Removal */}
      <AnimatePresence>
        {isExpanded && count > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: 20 }}
            className="absolute bottom-0 right-36 bg-white p-2 rounded shadow-xl border border-gray-200 pointer-events-auto flex flex-col gap-2 max-h-60 overflow-y-auto w-40"
          >
            <div className="flex justify-between items-center border-b border-gray-100 pb-1 mb-1">
              <span className="text-[10px] font-mono font-bold text-gray-500">CONTENTS</span>
              <button onClick={clearPalette} className="text-[10px] text-red-500 hover:underline">CLEAR ALL</button>
            </div>
            
            {savedArtifacts.map((art) => (
              <div key={art.id} className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded group">
                <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: art.hex }} />
                <span className="text-[10px] font-mono truncate flex-1 text-gray-700">{art.colorName}</span>
                <button 
                  onClick={(e) => { e.stopPropagation(); removeFromPalette(art.id); }}
                  className="text-gray-300 hover:text-red-500"
                >
                  ✕
                </button>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
