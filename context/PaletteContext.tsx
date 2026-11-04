"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Artifact } from '@/lib/types';

interface PaletteContextType {
  savedArtifacts: Artifact[];
  addToPalette: (artifact: Artifact) => void;
  removeFromPalette: (id: string) => void;
  isInPalette: (id: string) => boolean;
  clearPalette: () => void;
  mixedColor: string; 
  mixAnalysis: {
    averageYear: number;
    era: string;
    poem: string; // Added poem
  };
}

const PaletteContext = createContext<PaletteContextType | undefined>(undefined);

export function PaletteProvider({ children }: { children: ReactNode }) {
  const [savedArtifacts, setSavedArtifacts] = useState<Artifact[]>([]);
  const [mixedColor, setMixedColor] = useState<string>("#FFFFFF");
  const [mixAnalysis, setMixAnalysis] = useState({ averageYear: 0, era: 'Unknown', poem: '' });

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('met-palette-collection');
    if (saved) {
      try {
        setSavedArtifacts(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved palette", e);
      }
    }
  }, []);

  // Save to localStorage whenever collection changes
  useEffect(() => {
    localStorage.setItem('met-palette-collection', JSON.stringify(savedArtifacts));
    calculateMix();
  }, [savedArtifacts]);

  // --- Helper: Hex to RGB ---
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  // --- Helper: RGB to Hex ---
  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
  };

  // --- Helper: Parse Year ---
  const parseYear = (dateStr: string): number => {
    const lowerDate = dateStr.toLowerCase();
    const bcMatch = lowerDate.match(/(\d+)\s*(?:[-–]\s*\d+\s*)?(?:b\.?c\.?e?\.?|b\.?c\.?)/);
    if (bcMatch) return -parseInt(bcMatch[1]);
    
    const centuryMatch = lowerDate.match(/(\d+)(?:st|nd|rd|th)?\s*century/);
    if (centuryMatch) {
        let century = parseInt(centuryMatch[1]);
        let year = (century - 1) * 100;
        if (lowerDate.includes('bc')) return -(century * 100);
        return year;
    }
    
    const yearMatch = dateStr.match(/(\d{3,4})/);
    if (yearMatch) return parseInt(yearMatch[1]);
    return 0;
  };

  // --- Calculate Mix ---
  const calculateMix = () => {
    if (savedArtifacts.length === 0) {
      setMixedColor("#FFFFFF");
      setMixAnalysis({ averageYear: 0, era: 'Unknown', poem: '' });
      return;
    }

    // 1. Calculate Average Color
    let r = 0, g = 0, b = 0;
    savedArtifacts.forEach(art => {
      const rgb = hexToRgb(art.hex);
      r += rgb.r;
      g += rgb.g;
      b += rgb.b;
    });
    
    const count = savedArtifacts.length;
    const avgR = Math.round(r/count);
    const avgG = Math.round(g/count);
    const avgB = Math.round(b/count);
    const avgHex = rgbToHex(avgR, avgG, avgB);
    setMixedColor(avgHex);

    // Determine Color Mood (Simple HSL-ish logic)
    let mood = "harmony";
    const maxC = Math.max(avgR, avgG, avgB);
    const minC = Math.min(avgR, avgG, avgB);
    const lum = (maxC + minC) / 2 / 255;
    const sat = maxC === minC ? 0 : (maxC - minC) / (1 - Math.abs(2 * lum - 1)) / 255;

    if (sat < 0.15) mood = "silence";
    else if (lum > 0.75) mood = "light";
    else if (lum < 0.25) mood = "shadow";
    else if (avgR > avgG && avgR > avgB) mood = "passion"; // Red dominant
    else if (avgG > avgR && avgG > avgB) mood = "growth";  // Green dominant
    else if (avgB > avgR && avgB > avgG) mood = "depth";   // Blue dominant
    else if (avgR > avgB && avgG > avgB) mood = "warmth";  // Yellow/Orange

    // 2. Calculate Average Year & Variance
    let totalYear = 0;
    let validYears = [];
    for (const art of savedArtifacts) {
      const y = parseYear(art.date);
      if (y !== 0) {
        totalYear += y;
        validYears.push(y);
      }
    }

    const avgYear = validYears.length > 0 ? Math.round(totalYear / validYears.length) : 0;
    
    // Variance calculation
    let variance = 0;
    if (validYears.length > 1) {
        const mean = avgYear;
        variance = Math.sqrt(validYears.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / validYears.length);
    }
    const isTimeTraveler = variance > 1000; // High variance = eclectic mix

    // 3. Determine Era & Adjective
    let era = "Timeless";
    let eraAdjs = ["Timeless"];
    
    if (avgYear < -3000) { era = "Predynastic Soul"; eraAdjs = ["Ancient", "Primal", "Eternal"]; }
    else if (avgYear < -1000) { era = "Bronze Age Spirit"; eraAdjs = ["Mythic", "Forged", "Heroic"]; }
    else if (avgYear < -300) { era = "Classical Antiquity"; eraAdjs = ["Stoic", "Marble", "Balanced"]; }
    else if (avgYear < 500) { era = "Ancient World"; eraAdjs = ["Enduring", "Imperial", "Resilient"]; }
    else if (avgYear < 1400) { era = "Medieval Mind"; eraAdjs = ["Mystical", "Cloistered", "Sacred"]; }
    else if (avgYear < 1700) { era = "Renaissance Heart"; eraAdjs = ["Enlightened", "Humanist", "Vivid"]; }
    else if (avgYear < 1900) { era = "Industrial Spirit"; eraAdjs = ["Iron", "Steam", "Constructed"]; }
    else { era = "Modern Soul"; eraAdjs = ["Electric", "Abstract", "Kinetic"]; }

    // Pick random adjective based on artifact hash to keep it deterministic per selection
    const seed = savedArtifacts.reduce((acc, art) => acc + art.id.length, 0) + validYears.length;
    const adj = eraAdjs[seed % eraAdjs.length];

    // 4. Generate Poem
    const subjects = isTimeTraveler 
        ? ["Time Traveler", "Wanderer", "Collector", "Nomad"] 
        : ["Guardian", "Curator", "Inhabitant", "Architect"];
    
    const verbs = ["weaving", "seeking", "echoing", "collecting", "dreaming of"];
    
    const objects = {
        "silence": ["quiet truths", "forgotten whispers", "monochrome memories"],
        "light": ["morning rays", "pale clarity", "ethereal dust"],
        "shadow": ["midnight secrets", "deep mysteries", "obsidian voids"],
        "passion": ["burning desires", "crimson pulses", "vital energy"],
        "growth": ["ancient roots", "jade forests", "fertile grounds"],
        "depth": ["oceanic vastness", "sapphire dreams", "distant horizons"],
        "warmth": ["golden sands", "sunlit clays", "amber glow"],
        "harmony": ["perfect balance", "chromatic unity", "fading echoes"]
    };

    const subj = subjects[seed % subjects.length];
    const verb = verbs[(seed + 1) % verbs.length];
    const objList = objects[mood as keyof typeof objects] || objects["harmony"];
    const obj = objList[(seed + 2) % objList.length];

    let poem = `A ${adj.toLowerCase()} ${subj.toLowerCase()} ${verb} ${obj}.`;
    
    // Special override for high variance
    if (isTimeTraveler) {
        const travelVerbs = ["spanning", "bridging", "connecting"];
        const tv = travelVerbs[seed % travelVerbs.length];
        poem = `A ${adj.toLowerCase()} ${subj.toLowerCase()} ${tv} the centuries with ${obj}.`;
    }

    setMixAnalysis({ averageYear: avgYear, era, poem });
  };

  const addToPalette = (artifact: Artifact) => {
    setSavedArtifacts(prev => {
      if (prev.some(item => item.id === artifact.id)) return prev;
      return [...prev, artifact];
    });
  };

  const removeFromPalette = (id: string) => {
    setSavedArtifacts(prev => prev.filter(item => item.id !== id));
  };

  const isInPalette = (id: string) => {
    return savedArtifacts.some(item => item.id === id);
  };

  const clearPalette = () => {
    setSavedArtifacts([]);
  };

  return (
    <PaletteContext.Provider value={{ 
      savedArtifacts, 
      addToPalette, 
      removeFromPalette, 
      isInPalette,
      clearPalette,
      mixedColor,
      mixAnalysis
    }}>
      {children}
    </PaletteContext.Provider>
  );
}

export function usePalette() {
  const context = useContext(PaletteContext);
  if (context === undefined) {
    throw new Error('usePalette must be used within a PaletteProvider');
  }
  return context;
}
