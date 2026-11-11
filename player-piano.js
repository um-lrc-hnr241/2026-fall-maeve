/*
 * Mariposa Saloon Player Piano
 *
 * Music: "Peacherine Rag" by Scott Joplin, published in 1901. The composition
 * is in the public domain. The player piano in Westworld starts up with it in
 * season 1, episode 3, according to
 * https://www.inverse.com/article/21702-hbo-westworld-soundtrack-songs
 *
 * Note data: bars 1-38 of the Mutopia Project edition of the rag
 * (Mutopia-2007/10/29-335), converted from the MIDI file on its page, with
 * one re-struck note in bar 12 taken from the LilyPond source beside it:
 * https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=335
 * Licence stated on that page: Public Domain.
 *
 * Quotation: René Descartes, Meditation II, in John Veitch's translation,
 * which is in the public domain. The wording follows the 1901 edition, p. 232:
 * https://archive.org/details/methodmeditatio00desc
 *
 * This file is self-contained. The notes, the instrument, the control and its
 * styles all live here, and nothing is requested from the network.
 */
(() => {
  'use strict';

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  const header = document.querySelector('.site-header') || document.querySelector('header');
  if (!AudioContextClass || !header) return;

  /* ---------------------------------------------------------------- The roll */

  const PIECE = { title: 'Peacherine Rag', composer: 'Scott Joplin', year: 1901 };
  const TEMPO = 96;             // quarter notes per minute
  const STEP = 60 / TEMPO / 4;  // one sixteenth note, in seconds
  const BAR = 8;                // sixteenths in a bar of 2/4

  // One entry per bar of the edition: the upper staff, then the lower staff.
  // Each staff is a flat list of notes, three numbers apiece: the sixteenth of
  // the bar the note starts on, its MIDI note number, its length in sixteenths.
  const BARS = [
    [[0,75,1,1,77,1,2,79,1,3,77,3,6,70,2], [0,51,1,1,53,1,2,55,1,3,53,3,6,46,2]],
    [[0,77,1,1,79,1,2,80,1,3,79,3,6,70,2], [0,53,1,1,55,1,2,56,1,3,55,3,6,46,2]],
    [[0,72,1,1,72,2,3,71,1,4,72,1,5,74,1,6,75,2], [0,48,1,1,48,2,3,47,1,4,48,1,5,50,1,6,51,2]],
    [[0,70,2,2,70,3,5,67,1,6,68,1,7,69,1], [0,46,2,2,46,4]],
    [[0,70,2,2,67,2,2,75,2,4,67,2,4,74,2,6,67,2,6,72,2], [0,51,2,2,55,2,2,58,2,2,63,2,4,46,2,6,55,2,6,58,2,6,63,2]],
    [[0,67,1,0,70,1,1,67,2,1,75,2,3,67,2,3,74,2,5,72,1,6,70,1,7,67,1], [0,51,2,2,55,2,2,58,2,2,63,2,4,46,2,6,55,2,6,58,2,6,63,2]],
    [[0,67,2,0,70,2,2,67,2,2,75,2,4,67,2,4,74,2,6,67,2,6,72,2], [0,51,2,2,55,2,2,58,2,2,63,2,4,46,2,6,55,2,6,58,2,6,63,2]],
    [[0,68,1,0,70,1,1,68,2,1,74,2,3,68,2,3,72,2,5,70,1,6,65,1,7,67,1], [0,53,2,2,56,2,2,58,2,2,62,2,4,46,2,6,56,2,6,58,2,6,62,2]],
    [[0,68,2,2,68,2,2,74,2,4,68,2,4,72,2,6,68,2,6,70,2], [0,53,2,2,56,2,2,58,2,2,62,2,4,46,2,6,56,2,6,58,2,6,62,2]],
    [[0,68,1,1,68,2,1,74,2,3,68,2,3,72,2,5,70,1,6,74,1,7,77,1], [0,53,2,2,56,2,2,58,2,2,62,2,4,46,2,6,56,2,6,58,2,6,62,2]],
    [[0,68,2,0,74,2,0,80,2,2,68,4,2,74,4,2,80,4,6,69,2,6,75,2,6,81,2], [0,53,2,2,58,2,2,62,2,4,54,2,6,54,2,6,60,2,6,63,2]],
    [[0,70,5,0,75,2,0,82,5,2,75,3,3,77,1,4,79,1,5,67,1,6,68,1,7,69,1], [0,55,4,2,58,2,2,63,2,4,58,2,4,63,2]],
    [[0,70,2,2,67,2,2,75,2,4,67,2,4,74,2,6,67,2,6,72,2], [0,51,2,2,55,2,2,58,2,2,63,2,4,46,2,6,55,2,6,58,2,6,63,2]],
    [[0,67,1,0,70,1,1,67,2,1,75,2,3,67,2,3,74,2,5,72,1,6,70,1,7,67,1], [0,51,2,2,55,2,2,58,2,2,63,2,4,46,2,6,55,2,6,58,2,6,63,2]],
    [[0,67,2,0,79,2,2,67,4,2,71,4,2,79,4,6,67,2,6,71,2,6,77,2], [0,47,2,2,55,2,2,62,2,2,65,2,4,43,2,6,55,2,6,62,2,6,65,2]],
    [[0,67,6,0,72,6,0,75,6,2,84,1,3,86,1,4,87,1,6,72,2], [0,48,2,2,55,2,2,60,2,2,63,2,4,55,2,4,60,2,4,63,2]],
    [[0,72,2,0,75,2,0,77,2,2,72,2,2,75,2,2,77,2,4,72,2,4,75,2,4,78,2,6,72,2,6,75,2,6,78,2], [0,44,4,0,56,4,4,45,4,4,57,4]],
    [[0,70,1,0,75,1,0,79,1,1,70,2,1,75,2,1,79,2,3,70,1,3,82,1,4,70,2,4,72,2,4,76,2,4,80,2,6,70,2,6,72,2,6,76,2,6,79,2], [0,46,2,0,58,2,2,55,2,2,58,2,2,63,2,4,48,2,6,55,2,6,58,2,6,60,2,6,64,2]],
    [[0,69,1,0,79,1,1,69,2,1,79,2,3,69,1,3,75,1,4,68,2,4,77,1,5,75,1,6,68,2,6,77,2], [0,53,2,0,60,2,0,63,2,2,53,2,2,60,2,2,63,2,4,58,2,4,62,2,6,58,2,6,62,2]],
    [[0,67,5,0,75,5,5,67,1,6,68,1,7,69,1], [0,51,2,0,63,2,2,55,2,2,58,2,2,63,2,4,55,2,4,58,2,4,63,2]],
    [[0,67,6,0,75,6], [0,51,2,0,63,2,2,46,2,2,58,2,4,39,2,4,51,2,6,41,2]],
    [[2,69,2,2,75,2,2,77,2,4,69,2,4,75,2,4,79,2,6,69,2,6,75,2,6,77,2], [0,48,2,2,53,2,2,60,2,2,63,2,4,41,2,6,53,2,6,60,2,6,63,2]],
    [[2,75,2,2,81,2,2,84,2,4,75,2,4,81,2,4,86,2,6,75,2,6,81,2,6,84,2], [0,48,2,2,53,2,2,57,2,2,63,2,4,41,2,6,53,2,6,57,2,6,63,2]],
    [[2,74,2,2,82,2,4,74,2,4,81,2,6,74,2,6,79,2], [0,46,2,2,53,2,2,58,2,2,62,2,4,41,2,6,53,2,6,58,2,6,62,2]],
    [[0,74,1,0,79,1,1,77,1,2,76,1,3,77,2,5,79,1,6,77,2], [0,46,2,2,53,2,2,58,2,2,62,2,4,41,2,6,53,2,6,58,2,6,62,2]],
    [[2,75,2,2,81,2,2,87,2,4,75,2,4,81,2,4,87,2,6,75,2,6,81,2,6,86,2], [0,48,2,2,53,2,2,60,2,2,63,2,4,41,2,6,53,2,6,57,2,6,63,2]],
    [[0,75,6,0,81,6,0,86,1,1,84,1,2,83,1,3,84,2,5,89,1,6,77,2], [0,48,2,2,53,2,2,57,2,2,63,2,4,41,2,6,53,2,6,57,2,6,63,2]],
    [[2,74,2,2,82,2,2,86,2,4,74,2,4,77,2,4,86,2,6,74,2,6,77,2,6,84,2], [0,46,2,2,53,2,2,58,2,2,62,2,4,41,2,6,53,2,6,58,2,6,62,2]],
    [[0,74,6,0,77,6,0,84,1,1,82,1,2,81,1,3,82,2,5,89,1,6,77,2], [0,46,2,2,53,2,2,58,2,2,62,2,4,41,2,6,53,2,6,58,2,6,62,2]],
    [[2,69,2,2,75,2,2,77,2,4,69,2,4,75,2,4,79,2,6,69,2,6,75,2,6,77,2], [0,48,2,2,53,2,2,60,2,2,63,2,4,41,2,6,53,2,6,60,2,6,63,2]],
    [[2,75,2,2,81,2,2,84,2,4,75,2,4,81,2,4,86,2,6,75,2,6,81,2,6,84,2], [0,48,2,2,53,2,2,57,2,2,63,2,4,41,2,6,53,2,6,57,2,6,63,2]],
    [[2,74,2,2,82,2,4,74,2,4,81,2,6,74,2,6,79,2], [0,46,2,2,53,2,2,58,2,2,62,2,4,41,2,6,53,2,6,58,2,6,62,2]],
    [[0,74,1,0,79,1,1,77,1,2,76,1,3,77,2,5,74,1,6,75,1,7,77,1], [0,46,2,2,53,2,2,58,2,2,62,2,4,50,2,6,53,2,6,58,2,6,62,2]],
    [[0,67,1,0,79,1,1,70,1,1,75,1,2,67,1,2,79,1,3,69,2,3,81,2,5,67,2,5,79,2,7,70,1,7,75,1], [0,39,2,0,51,2,2,39,2,2,51,2,4,41,2,4,53,2,6,41,2,6,53,2]],
    [[0,65,1,0,77,1,1,70,1,1,74,1,2,65,1,2,77,1,3,67,2,3,79,2,5,65,2,5,77,2,7,70,1], [0,38,2,0,50,2,2,38,2,2,50,2,4,39,2,4,51,2,6,38,2,6,50,2]],
    [[0,64,1,0,70,1,0,74,1,1,64,2,1,70,2,1,74,2,3,64,1,3,70,1,3,74,1,4,63,2,4,69,2,4,72,1,5,70,1,6,63,2,6,69,2,6,72,2], [0,36,2,0,48,2,2,36,2,2,48,2,4,41,2,4,53,2,6,41,2,6,53,2]],
    [[0,62,6,0,70,6], [0,46,2,0,58,2,2,53,2,2,58,2,4,53,2,4,58,2,6,41,2]],
    [[0,62,4,0,70,4,4,62,4,4,68,4,4,70,4], [0,46,2,0,58,2,2,41,2,2,53,2,4,34,4,4,46,4]]
  ];

  // The order the bars are played in, as inclusive ranges: the introduction,
  // then each of the first two strains twice, taking the first ending (bars 20
  // and 37) the first time through and the second ending (21 and 38) the
  // second. Bar 38 leads straight back to bar 1, which is what makes the loop.
  const PLAN = [[1, 20], [5, 19], [21, 37], [22, 36], [38, 38]];

  // Unroll the plan into one list of notes, timed in sixteenths from the top.
  const notes = [];
  let total = 0;
  for (const [first, last] of PLAN) {
    for (let bar = first; bar <= last; bar++) {
      BARS[bar - 1].forEach((staff, lower) => {
        for (let i = 0; i < staff.length; i += 3) {
          notes.push({ start: total + staff[i], pitch: staff[i + 1], length: staff[i + 2], right: !lower });
        }
      });
      total += BAR;
    }
  }
  notes.sort((a, b) => a.start - b.start);

  // The top note of whatever the right hand plays at a given moment is the
  // tune. Mark it so the instrument can bring it out over the notes beneath.
  const tune = new Map();
  for (const note of notes) {
    if (note.right) tune.set(note.start, Math.max(note.pitch, tune.get(note.start) || 0));
  }
  for (const note of notes) note.lead = note.right && note.pitch === tune.get(note.start);

  /* ----------------------------------------------------------- The interface */

  const SANS = 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
  const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace';

  const style = document.createElement('style');
  style.textContent = `
.player-piano {
  display: flex;
  align-items: center;
  min-width: 0;
}

.player-piano-toggle {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  max-width: 100%;
  height: 1.75rem;
  margin: 0;
  padding: 0 0.3rem 0 0.6rem;
  border: 0;
  border-radius: 999px;
  background: linear-gradient(135deg, #7c3aed, #db2777);
  box-shadow: 0 0.15rem 0.6rem rgba(124, 58, 237, 0.35);
  color: #fff;
  font: 700 0.78rem/1 ${SANS};
  white-space: nowrap;
  cursor: pointer;
}

/* A taller invisible target for fingers; the pill itself stays one line high. */
.player-piano-toggle::before {
  content: "";
  position: absolute;
  inset: -0.5rem 0;
}

.player-piano-toggle:hover {
  filter: brightness(1.08);
}

.player-piano-toggle:focus-visible {
  outline: 3px solid var(--accent);
  outline-offset: 2px;
}

.player-piano-icon {
  display: inline-block;
}

.player-piano-name {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

.player-piano-state {
  min-width: 2.2rem;
  padding: 0.28rem 0.45rem;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.28);
  font-size: 0.62rem;
  letter-spacing: 0.08em;
  text-align: center;
}

.player-piano-new {
  position: absolute;
  top: -0.5rem;
  right: -0.4rem;
  padding: 0.14rem 0.32rem;
  border-radius: 999px;
  background: #fde047;
  box-shadow: 0 0.1rem 0.3rem rgba(0, 0, 0, 0.25);
  color: #3b0764;
  font-size: 0.55rem;
  letter-spacing: 0.08em;
  transform: rotate(8deg);
}

.player-piano-toggle[aria-pressed="true"] {
  box-shadow: 0 0 0.8rem rgba(219, 39, 119, 0.7), 0 0 1.4rem rgba(124, 58, 237, 0.5);
  animation: player-piano-pulse 1.25s ease-in-out infinite;
}

.player-piano-toggle[aria-pressed="true"] .player-piano-state {
  background: #fff;
  color: #7c3aed;
}

.player-piano-toggle[aria-pressed="true"] .player-piano-icon {
  animation: player-piano-bounce 0.625s ease-in-out infinite alternate;
}

.player-piano-burst {
  position: fixed;
  inset: 0;
  z-index: 4;
  overflow: hidden;
  pointer-events: none;
}

.player-piano-burst span {
  position: absolute;
  font-size: 1.1rem;
  animation: player-piano-fly 0.9s ease-out forwards;
}

/* Gives the toast something to hang from without overriding any position
   the site itself may give its header. */
:where(.player-piano-host) {
  position: relative;
}

.player-piano-live {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
}

.player-piano-toast,
.player-piano-card {
  border: 1px solid rgba(255, 255, 255, 0.22);
  color: #fff;
  font: 0.8rem/1.4 ${SANS};
  animation: player-piano-rise 0.35s ease-out;
}

.player-piano-toast[hidden],
.player-piano-detail[hidden] {
  display: none;
}

.player-piano-toast {
  position: absolute;
  top: 100%;
  right: 1.25rem;
  z-index: 3;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  width: min(19rem, calc(100% - 2.5rem));
  margin-top: 0.75rem;
  padding: 0.55rem 0.9rem;
  border-radius: 0.9rem;
  background: rgba(20, 14, 38, 0.94);
  box-shadow: 0 0.6rem 1.6rem rgba(76, 29, 149, 0.35);
}

.player-piano-toast strong {
  display: block;
  font: 600 0.8rem/1.35 ${MONO};
}

.player-piano-detail {
  display: block;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.7rem;
}

/* The dock rides along the bottom of the window and comes to rest below the
   footer, so the card never hides the end of the page. */
.player-piano-dock {
  position: sticky;
  bottom: 0;
  z-index: 3;
  display: flex;
  justify-content: flex-end;
  padding: 0 1rem;
  pointer-events: none;
}

.player-piano-card {
  width: min(19rem, 100%);
  margin: 0 0 1rem;
  padding: 0.75rem 0.95rem 0.7rem;
  border-radius: 1.1rem;
  pointer-events: auto;
  background:
    radial-gradient(120% 90% at 0% 0%, rgba(124, 58, 237, 0.55), transparent 60%),
    radial-gradient(110% 90% at 100% 100%, rgba(219, 39, 119, 0.5), transparent 60%),
    rgba(20, 14, 38, 0.82);
  -webkit-backdrop-filter: blur(14px) saturate(160%);
  backdrop-filter: blur(14px) saturate(160%);
  box-shadow: 0 1rem 2.4rem rgba(76, 29, 149, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.25);
}

.player-piano-card p,
.player-piano-card dl,
.player-piano-card dt,
.player-piano-card dd {
  margin: 0;
}

.player-piano-place {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.82);
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.player-piano-levels {
  display: inline-flex;
  flex: none;
  align-items: flex-end;
  gap: 2px;
  height: 0.8rem;
}

.player-piano-levels i {
  width: 3px;
  height: 100%;
  border-radius: 1px;
  background: linear-gradient(#f9a8d4, #c4b5fd);
  transform: scaleY(0.6);
  transform-origin: bottom;
  animation: player-piano-level 0.625s ease-in-out infinite alternate;
}

.player-piano-levels i:nth-child(2) {
  transform: scaleY(1);
  animation-delay: -0.2s;
}

.player-piano-levels i:nth-child(3) {
  transform: scaleY(0.35);
  animation-delay: -0.45s;
}

.player-piano-levels i:nth-child(4) {
  transform: scaleY(0.8);
  animation-delay: -0.3s;
}

.player-piano-title {
  margin-top: 0.3rem;
  font-size: 1.05rem;
  font-weight: 800;
  letter-spacing: -0.01em;
  line-height: 1.3;
}

.player-piano-title span {
  margin-left: 0.3rem;
  color: rgba(255, 255, 255, 0.82);
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0;
  white-space: nowrap;
}

.player-piano-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.4rem;
  margin: 0.5rem 0 0.45rem;
}

.player-piano-stats div {
  display: flex;
  flex-direction: column-reverse;
  padding: 0.2rem 0.5rem 0.25rem;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 0.6rem;
  background: rgba(255, 255, 255, 0.08);
}

.player-piano-stats dt {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.6rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  white-space: nowrap;
}

.player-piano-stats dd {
  font: 700 0.9rem/1.3 ${MONO};
  font-variant-numeric: tabular-nums;
}

.player-piano-courtesy {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.72rem;
}

.player-piano-powered {
  margin-top: 0.25rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.6rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.piano-rule.player-piano-playing {
  box-shadow: 0 0 1.4rem rgba(168, 85, 247, 0.55);
}

.piano-rule span.player-piano-lit {
  background: linear-gradient(#f472b6, #7c3aed);
}

.player-piano-quote {
  max-width: 34rem;
  margin: 1.4rem auto 0;
  color: var(--muted);
  font-size: 0.85rem;
  line-height: 1.55;
  animation: player-piano-rise 0.5s ease-out;
}

.player-piano-quote blockquote {
  margin: 0;
  font-style: italic;
}

.player-piano-quote figcaption {
  margin-top: 0.3rem;
  font-size: 0.72rem;
  letter-spacing: 0.04em;
}

@keyframes player-piano-pulse {
  50% {
    box-shadow: 0 0 1.1rem rgba(219, 39, 119, 0.9), 0 0 2rem rgba(124, 58, 237, 0.65);
  }
}

@keyframes player-piano-bounce {
  to {
    transform: translateY(-0.16rem) rotate(-10deg);
  }
}

@keyframes player-piano-level {
  from {
    transform: scaleY(0.25);
  }
  to {
    transform: scaleY(1);
  }
}

@keyframes player-piano-rise {
  from {
    opacity: 0;
    transform: translateY(0.6rem);
  }
}

@keyframes player-piano-fly {
  from {
    opacity: 1;
    transform: translate(-50%, -50%) scale(0.4);
  }
  to {
    opacity: 0;
    transform: translate(calc(-50% + var(--x)), calc(-50% + var(--y))) scale(1.25) rotate(40deg);
  }
}

/* On small screens the card slims down, so it leaves the keyboard in view. */
@media (max-width: 42rem) {
  .player-piano-toggle {
    gap: 0.3rem;
    padding: 0 0.25rem 0 0.5rem;
    font-size: 0.72rem;
  }

  .player-piano-state {
    min-width: 1.9rem;
    padding: 0.25rem 0.35rem;
  }

  .player-piano-toast {
    right: 1rem;
    width: calc(100% - 2rem);
  }

  .player-piano-card {
    width: 100%;
  }

  .player-piano-stats {
    margin-bottom: 0;
  }

  .player-piano-courtesy,
  .player-piano-powered {
    display: none;
  }
}

/* Everything that moves holds still for visitors who ask for less motion. */
@media (prefers-reduced-motion: reduce) {
  .player-piano-toggle[aria-pressed="true"],
  .player-piano-toggle[aria-pressed="true"] .player-piano-icon,
  .player-piano-levels i,
  .player-piano-toast,
  .player-piano-card,
  .player-piano-quote {
    animation: none;
  }
}
`;
  document.head.appendChild(style);

  const NOW_PLAYING = `Now playing in the Mariposa Saloon: ${PIECE.title} (${PIECE.composer}, ${PIECE.year})`;

  // The control joins the navigation list, so it wraps with the links on
  // narrow screens; a header without such a list gets it directly. Only its
  // name is exposed to assistive technology: the state is carried by
  // aria-pressed, and the rest is decoration.
  const menu = header.querySelector('nav ul');
  const item = document.createElement(menu ? 'li' : 'div');
  item.className = 'player-piano';
  item.innerHTML = `
    <button type="button" class="player-piano-toggle" aria-pressed="false">
      <span class="player-piano-icon" aria-hidden="true">🎹</span>
      <span class="player-piano-name">Mariposa Saloon Player Piano</span>
      <span class="player-piano-state" aria-hidden="true">OFF</span>
      <span class="player-piano-new" aria-hidden="true">NEW</span>
    </button>`;
  (menu || header).appendChild(item);
  const button = item.querySelector('button');
  const stateChip = item.querySelector('.player-piano-state');

  // System messages appear as a toast just under the header. The toast is for
  // the eyes; the same words go to a polite live region for screen readers.
  header.classList.add('player-piano-host');
  header.insertAdjacentHTML('beforeend', `
    <p class="player-piano-live" role="status"></p>
    <div class="player-piano-toast" aria-hidden="true" hidden>
      <span class="player-piano-mark"></span>
      <span><strong></strong><span class="player-piano-detail"></span></span>
    </div>`);
  const live = header.querySelector('.player-piano-live');
  const toast = header.querySelector('.player-piano-toast');
  const toastMark = toast.querySelector('.player-piano-mark');
  const toastLine = toast.querySelector('strong');
  const toastDetail = toast.querySelector('.player-piano-detail');

  // The Now Playing card lives in a dock at the very end of the page.
  const dock = document.createElement('div');
  dock.className = 'player-piano-dock';
  dock.innerHTML = `
    <aside class="player-piano-card" aria-label="Now playing" hidden>
      <p class="player-piano-place">
        <span class="player-piano-levels" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
        Now playing in the Mariposa Saloon
      </p>
      <p class="player-piano-title">${PIECE.title} <span>${PIECE.composer} · ${PIECE.year}</span></p>
      <dl class="player-piano-stats">
        <div><dt>Notes played</dt><dd>0</dd></div>
        <div><dt>Uptime</dt><dd>0:00</dd></div>
        <div><dt>Tempo</dt><dd>${TEMPO} BPM</dd></div>
      </dl>
      <p class="player-piano-courtesy">Compliments of Delos Destinations.</p>
      <p class="player-piano-powered">Powered by Web Audio</p>
    </aside>`;
  document.body.appendChild(dock);
  const card = dock.querySelector('.player-piano-card');
  const [notesPlayed, uptime] = card.querySelectorAll('dd');

  // The keyboard drawn in the hero, where there is one. Its keys are in
  // keyboard order, so key = octave * 12 + pitch class.
  const keyboard = document.querySelector('.piano-rule');
  const keys = keyboard ? Array.from(keyboard.children) : [];
  const octaves = Math.floor(keys.length / 12);
  const lit = keys.map(() => false);
  for (const note of notes) {
    // The left hand plays the lowest octave drawn, the right hand the highest.
    note.key = (note.right ? octaves - 1 : 0) * 12 + (note.pitch % 12);
  }

  // While the keyboard plays, the passage of the Meditations it brings to mind
  // appears beneath it.
  let quote = null;
  if (octaves) {
    quote = document.createElement('figure');
    quote.className = 'player-piano-quote';
    quote.hidden = true;
    quote.innerHTML = `
      <blockquote>“… what do I see from the window beyond hats and cloaks that might cover
      artificial machines, whose motions might be determined by springs?”</blockquote>
      <figcaption>René Descartes, <cite>Meditations</cite>, II, translated by John Veitch (1901 edition)</figcaption>`;
    keyboard.insertAdjacentElement('afterend', quote);
  }

  const calm = window.matchMedia('(prefers-reduced-motion: reduce)');

  function releaseKeys() {
    keys.forEach((key, k) => {
      key.classList.remove('player-piano-lit');
      lit[k] = false;
    });
  }

  function show(on) {
    button.setAttribute('aria-pressed', String(on));
    stateChip.textContent = on ? 'ON' : 'OFF';
    card.hidden = !on;
    if (!octaves) return;
    keyboard.classList.toggle('player-piano-playing', on);
    quote.hidden = !on;
    if (!on) releaseKeys();
  }

  let toastTimer = 0;
  function announce(mark, line, detail) {
    clearTimeout(toastTimer);
    toastMark.textContent = mark;
    toastLine.textContent = line;
    toastDetail.textContent = detail || '';
    toastDetail.hidden = !detail;
    toast.hidden = true;
    void toast.offsetWidth;   // lets the entrance animation run again
    toast.hidden = false;
    live.textContent = detail ? `${line} ${detail}` : line;
    toastTimer = setTimeout(() => {
      toast.hidden = true;
      live.textContent = '';
    }, 4200);
  }

  function celebrate() {
    if (calm.matches) return;
    const box = button.getBoundingClientRect();
    const layer = document.createElement('div');
    layer.className = 'player-piano-burst';
    layer.setAttribute('aria-hidden', 'true');
    ['✨', '🎹', '🎵', '💜', '✨', '🎶', '💖', '🎵', '✨', '🎶'].forEach((emoji, i, all) => {
      const angle = (i / all.length) * 2 * Math.PI + 0.3;
      const reach = 55 + (i % 3) * 22;
      const bit = document.createElement('span');
      bit.textContent = emoji;
      bit.style.left = `${box.left + box.width / 2}px`;
      bit.style.top = `${box.top + box.height / 2}px`;
      bit.style.setProperty('--x', `${Math.round(Math.cos(angle) * reach * 1.6)}px`);
      bit.style.setProperty('--y', `${Math.round(Math.sin(angle) * reach)}px`);
      layer.appendChild(bit);
    });
    document.body.appendChild(layer);
    setTimeout(() => layer.remove(), 1000);
  }

  /* ---------------------------------------------------------- The instrument */

  // Master volume, applied after the limiter. The notes are balanced to peak
  // just under the limiter's threshold, so it rarely has anything to do, and
  // this brings the loudest moment out at about -6 dBFS: modest, and well
  // clear of clipping.
  const VOLUME = 0.75;

  // The harmonic recipe of a struck string, as a wave table. The hammer meets
  // the string about an eighth of the way along, which thins out every eighth
  // harmonic, and its felt rounds off the top; a larger "brightness" keeps
  // more of the upper harmonics. The fundamental always has amplitude 1.
  function stringTable(ctx, brightness) {
    const harmonics = 40;
    const recipe = (n) => Math.sin((n * Math.PI) / 8.3) / n / (1 + Math.pow(n / brightness, 2));
    const sine = new Float32Array(harmonics + 1);
    for (let n = 1; n <= harmonics; n++) sine[n] = recipe(n) / recipe(1);
    return ctx.createPeriodicWave(new Float32Array(harmonics + 1), sine, { disableNormalization: true });
  }

  // A small, dull room: decaying noise that loses its treble as it fades.
  // The generator is seeded, so it is the same room on every visit.
  function roomImpulse(ctx) {
    const length = Math.round(ctx.sampleRate * 0.9);
    const impulse = ctx.createBuffer(2, length, ctx.sampleRate);
    let seed = 1901;
    for (let channel = 0; channel < 2; channel++) {
      const samples = impulse.getChannelData(channel);
      let smooth = 0;
      for (let i = 0; i < length; i++) {
        seed = (seed * 16807) % 2147483647;
        const fade = 1 - i / length;
        smooth += (seed / 1073741823.5 - 1 - smooth) * (0.12 + 0.5 * fade);
        samples[i] = smooth * fade * fade * fade;
      }
    }
    return impulse;
  }

  function buildPiano(ctx) {
    const strings = ctx.createGain();   // every note arrives here
    const room = ctx.createConvolver();
    const roomLevel = ctx.createGain();
    const limiter = ctx.createDynamicsCompressor();
    const master = ctx.createGain();

    room.buffer = roomImpulse(ctx);
    roomLevel.gain.value = 0.16;
    limiter.threshold.value = -4;
    limiter.knee.value = 0;
    limiter.ratio.value = 20;
    limiter.attack.value = 0.002;
    limiter.release.value = 0.15;
    master.gain.value = VOLUME;

    strings.connect(limiter);
    strings.connect(room);
    room.connect(roomLevel);
    roomLevel.connect(limiter);
    limiter.connect(master);
    master.connect(ctx.destination);

    // Each register has two tables: the mellow tone a string settles into,
    // and the bright one it has at the instant the hammer lands. Low strings
    // carry far more harmonics than high ones.
    const registers = [
      { below: 52, mellow: stringTable(ctx, 6), bright: stringTable(ctx, 22), trim: 0.95 },
      { below: 74, mellow: stringTable(ctx, 3.2), bright: stringTable(ctx, 10), trim: 1 },
      { below: 128, mellow: stringTable(ctx, 1.7), bright: stringTable(ctx, 4.5), trim: 1.25 },
    ];

    // One string: an oscillator and its loudness, silent until told otherwise.
    function string(table, hertz, cents, from, until) {
      const oscillator = ctx.createOscillator();
      const loudness = ctx.createGain();
      oscillator.setPeriodicWave(table);
      oscillator.frequency.value = hertz;
      oscillator.detune.value = cents;
      oscillator.connect(loudness);
      loudness.connect(strings);
      loudness.gain.setValueAtTime(0, from);
      oscillator.start(from);
      oscillator.stop(until);
      return loudness.gain;
    }

    function strike(note, when) {
      const { pitch } = note;
      const hertz = 440 * Math.pow(2, (pitch - 69) / 12);
      const release = when + note.length * STEP * 0.9;   // a hair detached, the way a roll is cut
      const silent = release + 0.3;
      const register = registers.find((r) => pitch < r.below);
      // Voicing: the tune sings out, the bass is firm, and the chords in
      // both hands sit back. "trim" evens out the loudness of the registers.
      const touch = note.lead ? 1.25 : note.right ? 0.85 : pitch < 53 ? 0.9 : 0.72;
      const level = 0.031 * touch * register.trim;
      const ring = 1.1 * Math.pow(2, (60 - pitch) / 20);   // low strings ring longer
      // Every key is a shade out of tune in its own way, the same way each time.
      const drift = (((pitch * 37) % 9) - 4) * 0.8;

      // Two strings per note, a few cents apart, which is what gives an old
      // upright its shimmer. The first carries the body of the note: it
      // swells in 5 ms, rings down slowly, and stops when the damper falls.
      const body = string(register.mellow, hertz, drift - 3, when, silent);
      body.linearRampToValueAtTime(level, when + 0.005);
      body.setTargetAtTime(0, when + 0.005, ring);
      body.setTargetAtTime(0, release, 0.05);

      // The second carries the hammer blow: bright for a moment, then it
      // settles back under the first.
      const blow = string(register.bright, hertz, drift + 8, when, silent);
      blow.linearRampToValueAtTime(level * 0.8, when + 0.003);
      blow.setTargetAtTime(level * 0.18, when + 0.003, 0.07);
      blow.setTargetAtTime(0, release, 0.04);
    }

    return { strike, master };
  }

  /* ----------------------------------------------------------- The transport */

  const LOOKAHEAD = 1.5;   // seconds of music kept scheduled ahead of the clock
  const TICK = 200;        // milliseconds between visits from the scheduler
  const LEAD = 0.15;       // seconds between pressing the button and the first note
  const HOLD = 0.8;        // share of a note's length its key stays down on screen

  let session = null;   // everything belonging to the current run; null while silent

  function openContext() {
    try {
      return new AudioContextClass({ latencyHint: 'playback' });
    } catch (error) {
      try {
        return new AudioContextClass();
      } catch (failure) {
        return null;
      }
    }
  }

  function closeContext(ctx) {
    try {
      const closing = ctx.close();
      if (closing) closing.catch(() => {});
    } catch (error) {
      // Already closed.
    }
  }

  // Start playing. With "saved" the roll picks up where another page left it,
  // but only if the browser lets audio start without a fresh click; if it
  // does not, the control simply stays off.
  function start(saved) {
    stop(true);
    const ctx = openContext();
    if (!ctx) return false;
    const s = {
      ctx,
      bar: saved ? saved.bar : 0,
      played: saved ? saved.played : 0,
      since: saved ? saved.since : Date.now(),
      begun: false,   // false while a resumed page waits to hear whether it may play
      heard: ctx.state === 'running',
      due: [],
    };
    session = s;

    ctx.onstatechange = () => {
      if (session !== s) return;
      if (ctx.state === 'running') {
        s.heard = true;
        if (!s.begun) begin(s);
      } else if (s.heard) {
        // The browser or the system has taken the audio away.
        stop();
        forget();
      }
    };
    const resuming = ctx.resume();
    if (resuming) resuming.catch(() => {});

    if (!saved || s.heard) begin(s);
    s.patience = setTimeout(() => {
      if (session === s && !s.heard && ctx.state !== 'running') {
        stop();
        forget();
      }
    }, saved ? 1000 : 4000);
    return true;
  }

  function begin(s) {
    s.begun = true;
    s.piano = buildPiano(s.ctx);
    s.from = s.bar * BAR;
    s.origin = s.ctx.currentTime + LEAD - s.from * STEP;   // when the top of the roll passed, or will
    s.lap = 0;
    s.next = Math.max(0, notes.findIndex((note) => note.start >= s.from));
    pump();
    s.timer = setInterval(pump, TICK);
    if (octaves && !calm.matches) s.frame = requestAnimationFrame(draw);
    show(true);
    remember(s, s.bar);
  }

  // The scheduler. The audio clock is exact and timers are not, so each visit
  // hands the audio clock every note due in the next LOOKAHEAD seconds. A late
  // timer (a busy page, a background tab) is absorbed by that margin; a timer
  // later than the margin skips what it missed instead of playing it all at
  // once.
  function pump() {
    const s = session;
    const now = s.ctx.currentTime;
    for (;;) {
      const note = notes[s.next];
      const when = s.origin + (s.lap * total + note.start) * STEP;
      if (when > now + LOOKAHEAD) break;
      if (when >= now) {
        s.piano.strike(note, when);
        s.due.push(when);
      }
      s.next += 1;
      if (s.next === notes.length) {
        s.next = 0;
        s.lap += 1;
      }
    }
    while (s.due.length && s.due[0] <= now) {
      s.due.shift();
      s.played += 1;
    }
    notesPlayed.textContent = s.played.toLocaleString('en-US');
    uptime.textContent = clock(Date.now() - s.since);
  }

  function clock(milliseconds) {
    const seconds = Math.max(0, Math.floor(milliseconds / 1000));
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
  }

  // Sixteenths since the top of the roll, as the listener hears it.
  function position(s, latency) {
    return (s.ctx.currentTime - (latency || 0) - s.origin) / STEP;
  }

  // The keyboard. Each frame works out from the audio clock alone which notes
  // are sounding, so the keys cannot drift out of step with the music. The
  // roll is short enough (about a thousand notes) to check every note each
  // frame rather than keep a cursor that could go stale.
  const down = keys.map(() => false);
  function draw() {
    const s = session;
    if (!s) return;
    const here = position(s, s.ctx.outputLatency);
    down.fill(false);
    for (const note of notes) {
      let elapsed = (here - note.start) % total;
      if (elapsed < 0) elapsed += total;
      // Lit while held, and only for notes struck since this run began.
      if (elapsed < note.length * HOLD && here - elapsed >= s.from - 0.001) down[note.key] = true;
    }
    keys.forEach((key, k) => {
      if (down[k] !== lit[k]) {
        lit[k] = down[k];
        key.classList.toggle('player-piano-lit', down[k]);
      }
    });
    s.frame = requestAnimationFrame(draw);
  }

  // Stop playing. A short fade avoids a click; "abrupt" skips it when the page
  // is going away.
  function stop(abrupt) {
    const s = session;
    if (!s) return;
    session = null;
    clearInterval(s.timer);
    clearTimeout(s.patience);
    cancelAnimationFrame(s.frame);
    s.ctx.onstatechange = null;
    if (s.piano && !abrupt) {
      s.piano.master.gain.setTargetAtTime(0, s.ctx.currentTime, 0.02);
      setTimeout(() => closeContext(s.ctx), 150);
    } else {
      closeContext(s.ctx);
    }
    show(false);
  }

  /* --------------------------------------------------- Memory between pages */

  const MEMORY = 'player-piano';

  function remember(s, bar) {
    try {
      sessionStorage.setItem(MEMORY, JSON.stringify({ bar, played: s.played, since: s.since }));
    } catch (error) {
      // Storage is unavailable; the next page will simply start silent.
    }
  }

  function recall() {
    try {
      const saved = JSON.parse(sessionStorage.getItem(MEMORY));
      const sane = saved && [saved.bar, saved.played, saved.since].every((n) => Number.isInteger(n) && n >= 0);
      return sane && saved.bar < total / BAR ? saved : null;
    } catch (error) {
      return null;
    }
  }

  function forget() {
    try {
      sessionStorage.removeItem(MEMORY);
    } catch (error) {
      // Nothing to forget.
    }
  }

  function resume() {
    const saved = recall();
    if (saved) start(saved);
  }

  /* ------------------------------------------------------------------ Wiring */

  button.addEventListener('click', () => {
    if (session && session.begun) {
      stop();
      forget();
      announce('⏹️', 'Freeze all motor functions.');
    } else if (start(null)) {
      announce('✅', 'Bring yourself back online.', NOW_PLAYING);
      celebrate();
    }
  });

  // Leaving the page: note the bar we reached so the next page can pick it up.
  window.addEventListener('pagehide', () => {
    const s = session;
    if (s && s.begun) {
      const bar = Math.floor((((position(s) % total) + total) % total) / BAR);
      remember(s, bar);
    }
    stop(true);
  });

  // Coming back to a page the browser kept in memory.
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) resume();
  });

  // If the visitor changes their motion setting while the piano plays, the
  // keyboard follows at once. (The stylesheet above does the same for the rest.)
  if (calm.addEventListener) {
    calm.addEventListener('change', () => {
      const s = session;
      if (!s || !s.begun || !octaves) return;
      cancelAnimationFrame(s.frame);
      if (calm.matches) releaseKeys();
      else s.frame = requestAnimationFrame(draw);
    });
  }

  resume();

  console.log('%c🚀 Mariposa Saloon Player Piano initialized successfully', 'color: #7c3aed; font-weight: 700;');
})();
