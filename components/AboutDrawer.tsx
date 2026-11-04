"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AboutDrawerProps {
  isOpen: boolean;
  mode?: 'free' | 'challenge';
  onClose: () => void;
}

export default function AboutDrawer({ isOpen, onClose, mode = 'free' }: AboutDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[150]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '0%' }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 h-full w-[320px] max-w-[80vw] bg-[#EAEAE5] z-[200] shadow-2xl border-r border-black/10 flex flex-col p-8 font-mono text-sm text-[#1A1A1A]"
          >
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-xl font-bold uppercase tracking-tighter">The Met Palette</h2>
              <button onClick={onClose} className="text-xs border border-black px-2 py-1 hover:bg-black hover:text-white transition-colors">CLOSE</button>
            </div>

            <div className="space-y-8 flex-1 overflow-y-auto no-scrollbar">
              <section>
                <h3 className="font-bold mb-2 uppercase text-[10px] text-[#888]">Concept</h3>
                <p className="leading-relaxed">
                  A digital excavation of the Metropolitan Museum of Art. 
                  Forty animal sculptures, forty colors, spanning 5,000 years of human history.
                </p>
              </section>

              <section>
                <h3 className="font-bold mb-2 uppercase text-[10px] text-[#888]">How to Play</h3>
                <ul className="space-y-4 list-none m-0 p-0">
                  <li className="flex gap-2">
                    <span className="font-bold">01.</span>
                    <span><span className="font-bold">Discover</span>: {mode === 'challenge' ? 'Explore the objects and their colors.' : 'Drag cards around the desk to explore the collection.'}</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold">02.</span>
                    <span><span className="font-bold">Curate</span>: {mode === 'challenge' ? 'Choose three objects to blend their colors and match the target.' : <>Drag your favorites into the <span className="bg-black text-white px-1 text-[10px]">MIX ZONE</span> at the bottom right.</>}</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold">03.</span>
                    <span><span className="font-bold">{mode === 'challenge' ? 'Compare' : 'Analyze'}</span>: {mode === 'challenge' ? 'Submit your mix to see your score. Try again or move to the next target.' : 'Generate your unique "Chrono-Persona" based on your color choices.'}</span>
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="font-bold mb-2 uppercase text-[10px] text-[#888]">Credits</h3>
                <p className="text-xs text-[#666]">
                  Data courtesy of The Met Open Access API.
                </p>
              </section>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

