"use client";

import { useEffect, useRef, useState } from 'react';
import { checkRound, createRound, LEVEL_COUNT, selectedColor, toggleArtifact } from '@/lib/color-game';
import type { ColorRound, RoundResult } from '@/lib/color-game';
import GameArtifactImage from './GameArtifactImage';
import GameResult from './GameResult';

export default function ColorChallenge() {
  const [round, setRound] = useState<ColorRound | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [result, setResult] = useState<RoundResult | null>(null);
  const [history, setHistory] = useState<RoundResult[]>([]);
  const [finished, setFinished] = useState(false);
  const checkButton = useRef<HTMLButtonElement>(null);

  // Generate only in the browser, keeping server and hydration markup identical.
  useEffect(() => { setRound(createRound(1)); }, []);

  function restart() {
    setRound(createRound(1));
    setSelected([]);
    setResult(null);
    setHistory([]);
    setFinished(false);
  }

  function advance() {
    if (!round || !result) return;
    setHistory(previous => [...previous, result]);
    setResult(null);
    if (round.level === LEVEL_COUNT) {
      setFinished(true);
    } else {
      setRound(createRound(round.level + 1));
      setSelected([]);
    }
  }

  const level = round?.level ?? 1;
  const mixed = round ? selectedColor(round, selected) : '#FFFFFF';
  const chosen = round?.palette.filter(artifact => selected.includes(artifact.id)) ?? [];
  const locked = result !== null || finished;

  return (
    <>
      <div className="game-board" aria-busy={!round}>
        <aside className="game-controls" aria-label="Color matching challenge">
          <div className="game-level">
            <div className="game-level-label" aria-live="polite">
              <span>LEVEL <strong>{String(level).padStart(2, '0')}</strong></span>
              <span className="game-muted">/ {LEVEL_COUNT}</span>
            </div>
            <div className="game-progress" role="progressbar" aria-label="Levels completed" aria-valuemin={0} aria-valuemax={LEVEL_COUNT} aria-valuenow={finished ? LEVEL_COUNT : level - 1}>
              {Array.from({ length: LEVEL_COUNT }, (_, index) => (
                <span key={index} className={finished || index < level - 1 ? 'is-complete' : index === level - 1 ? 'is-current' : ''} aria-hidden="true" />
              ))}
            </div>
          </div>

          <div className="game-colors">
            <div className="game-color-group">
              <h2 className="game-eyebrow">Target color</h2>
              <div className="game-color-swatch game-target" style={{ backgroundColor: round?.target ?? '#E8E8E0' }} role="img" aria-label={`Target color ${round?.target ?? 'loading'}`} />
              <span className="game-color-code">{round?.target ?? '—'}</span>
            </div>
            <div className="game-color-group">
              <h2 className="game-eyebrow">Your mix</h2>
              <div className={`game-color-swatch game-mix ${selected.length ? 'has-color' : ''}`} style={{ backgroundColor: selected.length ? mixed : undefined }} role="img" aria-label={selected.length ? `Your mixed color ${mixed}` : 'No colors selected'}>
                {!selected.length && <span aria-hidden="true">+</span>}
              </div>
              <span className="game-color-code">{selected.length ? mixed : '—'}</span>
            </div>
          </div>

          <div className="game-submit-area">
            <p className="game-selection-count" aria-live="polite" aria-atomic="true"><strong>{selected.length}</strong> / {level} <span>selected</span></p>
            <div className="game-selected-colors" aria-hidden="true">
              {Array.from({ length: level }, (_, index) => <span key={index} style={{ backgroundColor: chosen[index]?.hex }} className={chosen[index] ? 'is-filled' : ''} />)}
            </div>
            <button ref={checkButton} type="button" className="game-button game-button-primary game-check" disabled={!round || selected.length !== level || locked} onClick={() => { if (round) setResult(checkRound(round, selected)); }}>
              <span>Check mix</span><span aria-hidden="true">→</span>
            </button>
          </div>
        </aside>

        <section className="game-palette" aria-label="Choose your artifacts">
          <div className="game-palette-heading"><h2 className="game-eyebrow">The palette</h2></div>
          <div className="game-artifact-grid">
            {round ? round.palette.map((artifact, index) => {
              const active = selected.includes(artifact.id);
              return (
                <button key={`${level}-${artifact.id}`} type="button" className={`game-artifact-card ${active ? 'is-selected' : ''}`} aria-pressed={active} aria-label={`${active ? 'Remove' : 'Select'} ${artifact.title}, ${artifact.colorName}`} aria-describedby={`object-info-${artifact.id}`} disabled={locked || (!active && selected.length === level)} onClick={() => setSelected(previous => toggleArtifact(round, previous, artifact.id))}>
                  <span className="game-card-photo">
                    <GameArtifactImage artifact={artifact} />
                    <span className="game-card-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                    <span className="game-card-check" aria-hidden="true">{active ? '✓' : ''}</span>
                    <span className="game-card-info" id={`object-info-${artifact.id}`}>
                      <strong>{artifact.title}</strong><span>{artifact.culture}</span><span>{artifact.date}</span>
                    </span>
                  </span>
                  <span className="game-card-color" style={{ backgroundColor: artifact.hex }} />
                  <span className="game-card-caption"><span>{artifact.colorName}</span><span>{artifact.hex}</span></span>
                </button>
              );
            }) : Array.from({ length: 16 }, (_, index) => <div key={index} className="game-artifact-placeholder" aria-hidden="true" />)}
          </div>
        </section>
      </div>

      {round && (result || finished) && <GameResult round={round} result={result} selectedIds={selected} history={history} finished={finished} onClose={() => { setResult(null); checkButton.current?.focus(); }} onNext={advance} onRestart={restart} />}
    </>
  );
}
