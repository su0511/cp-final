"use client";

import { useState } from 'react';
import AboutDrawer from '@/components/AboutDrawer';
import Link from 'next/link';
import ColorChallenge from '@/components/ColorChallenge';
export default function Home() {
  const [showAbout, setShowAbout] = useState(false);
  return <main className="min-h-screen bg-[#F5F5F0] text-[#111] font-mono">
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-black/15 px-5 py-5 md:px-10">
      <div><h1 className="text-lg font-bold tracking-tight"><button type="button" onClick={() => setShowAbout(true)} aria-label="About The Met Palette" aria-expanded={showAbout} className="bg-black px-3 py-1 text-left text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">The Met Palette</button></h1></div>
      <nav aria-label="Main navigation" className="flex gap-5 text-[10px] uppercase tracking-widest"><Link href="/studio">Free play ↗</Link><Link href="/archive">Archive ↗</Link></nav>
    </header><ColorChallenge />
    <AboutDrawer isOpen={showAbout} onClose={() => setShowAbout(false)} mode="challenge" />
  </main>;
}
