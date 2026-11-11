"use client";

import { useState } from 'react';
import type { Artifact } from '@/lib/types';

export default function GameArtifactImage({ artifact }: { artifact: Artifact }) {
  const [failed, setFailed] = useState(false);
  return failed ? (
    <span className="game-image-fallback"><span>{artifact.title}</span><small>Image unavailable</small></span>
  ) : (
    <img src={artifact.imageUrl} alt={artifact.title} decoding="async" draggable={false} onError={() => setFailed(true)} />
  );
}
