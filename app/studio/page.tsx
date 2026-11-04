"use client";

import React, { useState } from 'react';
import { artifacts } from '@/lib/data';
import StudioDesk from '@/components/StudioDesk';
import Link from 'next/link';
import MixingZone from '@/components/MixingZone';
import IdentityModal from '@/components/IdentityModal';
import AboutDrawer from '@/components/AboutDrawer';
import { AnimatePresence } from 'framer-motion';

export default function Home() {
  const [showIdentity, setShowIdentity] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#111] font-mono overflow-hidden">
      {/* Header - Floating */}
      <header className="fixed top-0 left-0 w-full z-[100] px-6 py-4 flex justify-between items-center pointer-events-none">
        <div className="pointer-events-auto cursor-pointer" onClick={() => setShowAbout(true)}>
          <h1 className="text-lg font-bold uppercase tracking-tighter bg-black text-white px-3 py-1 inline-block transform -rotate-1 hover:scale-105 transition-transform">
            The Met Palette
          </h1>
        </div>
        <Link 
          href="/archive"
          className="pointer-events-auto text-xs bg-white border border-black px-3 py-1 hover:bg-black hover:text-white transition-colors uppercase shadow-sm"
        >
          View Archive Index →
        </Link>
      </header>

      {/* The Interactive Desk */}
      <StudioDesk artifacts={artifacts} />

      {/* The Color Mixer */}
      <MixingZone onOpenIdentity={() => setShowIdentity(true)} />

      {/* Modals */}
      <AnimatePresence>
        {showIdentity && (
          <IdentityModal onClose={() => setShowIdentity(false)} />
        )}
      </AnimatePresence>

      <AboutDrawer isOpen={showAbout} onClose={() => setShowAbout(false)} />
      
    </div>
  );
}
