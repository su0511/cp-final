"use client";

import { useEffect, useRef, useState } from 'react';
import { LEVEL_COUNT } from '@/lib/color-game';
import type { ColorRound, RoundResult } from '@/lib/color-game';
import GameArtifactImage from './GameArtifactImage';

interface GameResultProps {
  round: ColorRound;
  result: RoundResult | null;
  history: RoundResult[];
  finished: boolean;
  onClose: () => void;
  onNext: () => void;
  onRestart: () => void;
}

export default function GameResult({ round, result, history, finished, onClose, onNext, onRestart }: GameResultProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [revealed, setRevealed] = useState(false);
  const answer = round.palette.filter(artifact => round.answerIds.includes(artifact.id));
  const average = history.length ? history.reduce((sum, item) => sum + item.similarity, 0) / history.length : 0;

  useEffect(() => {
    const element = dialog.current;
    element?.showModal();
    return () => element?.close();
  }, []);

  useEffect(() => { setRevealed(false); }, [round, finished]);

  return (
    <dialog ref={dialog} className="game-result-dialog font-mono" aria-labelledby="game-result-title" onCancel={event => { event.preventDefault(); if (!finished) onClose(); }} onClick={event => { if (event.target === event.currentTarget && !finished) onClose(); }}>
      <div className="game-result-content">
        {!finished && <button type="button" className="game-result-close" aria-label="Close results and try again" onClick={onClose}>×</button>}
        <p className="game-eyebrow">The Met Palette</p>
        <h2 id="game-result-title" className="game-result-title">{finished ? 'All 15 levels complete!' : `Level ${String(round.level).padStart(2, '0')} Complete!`}</h2>
        <p className="game-result-score">{(finished ? average : result?.similarity ?? 0).toFixed(1)}<span>%</span></p>
        {!finished && <p className="game-result-score-label">Color similarity</p>}

        {finished ? (
          <>
            <div className="game-summary-grid" aria-label="Your results for all 15 levels">
              {history.map(item => <div key={item.level} className="game-summary-level"><span className="game-summary-number">{String(item.level).padStart(2, '0')}</span><span className="game-summary-color" style={{ backgroundColor: item.target }} /><span>{item.similarity.toFixed(1)}%</span></div>)}
            </div>
            <p className="game-finish-count">{history.length} / {LEVEL_COUNT} levels completed</p>
            <button type="button" className="game-button game-button-primary game-restart" onClick={onRestart}>Play again <span aria-hidden="true">↗</span></button>
          </>
        ) : result && (
          <>
            <div className="game-result-comparison">
              <div><span className="game-result-swatch" style={{ backgroundColor: result.target }} /><span className="game-eyebrow">Target</span><span className="game-color-code">{result.target}</span></div>
              <span className="game-comparison-divider" aria-hidden="true">↔</span>
              <div><span className="game-result-swatch game-result-mix" style={{ backgroundColor: result.mixed }} /><span className="game-eyebrow">Your mix</span><span className="game-color-code">{result.mixed}</span></div>
            </div>
            <button type="button" className="game-reveal-button" aria-expanded={revealed} aria-controls="game-answer" onClick={() => setRevealed(value => !value)}>{revealed ? 'Hide answer' : 'Reveal answer'} <span aria-hidden="true">{revealed ? '−' : '+'}</span></button>
            {revealed && <section id="game-answer" className="game-answer" aria-label="One exact answer">
              <h3 className="game-eyebrow">One exact answer · {answer.length} {answer.length === 1 ? 'color' : 'colors'}</h3>
              <div className="game-answer-grid">{answer.map(artifact => <div key={artifact.id} className="game-answer-card" title={`${artifact.title} · ${artifact.colorName}`}><div className="game-answer-photo"><GameArtifactImage artifact={artifact} /></div><span className="game-answer-color" style={{ backgroundColor: artifact.hex }} /><span className="game-answer-name">{artifact.colorName}</span></div>)}</div>
            </section>}
            <div className="game-result-actions"><button type="button" className="game-button" onClick={onClose}>Try again</button><button type="button" className="game-button game-button-primary" onClick={onNext}>{round.level === LEVEL_COUNT ? 'Finish game' : 'Next level'} <span aria-hidden="true">→</span></button></div>
          </>
        )}
      </div>
    </dialog>
  );
}
