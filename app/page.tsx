"use client";

import { useState } from 'react';
import AboutDrawer from '@/components/AboutDrawer';
import ColorChallenge from '@/components/ColorChallenge';
export default function Home() {
  const [showAbout, setShowAbout] = useState(false);
  return <main className="palette-game-shell font-mono">
    <header className="palette-game-header">
      <h1><button type="button" onClick={() => setShowAbout(true)} aria-label="About The Met Palette" aria-expanded={showAbout} className="palette-wordmark">The Met Palette</button></h1>
    </header><ColorChallenge />
    <AboutDrawer isOpen={showAbout} onClose={() => setShowAbout(false)} mode="challenge" />
  </main>;
}
