import { useMemo } from 'react';
import { motion } from 'framer-motion';
import ArtBoard from '../../layout/ArtBoard';
import { seeded } from '../../layout/random';
import { DiyaDefs, DiyaGlyph } from '../../hero/art/Diya';
import { WATERLINE } from './PavilionPondArt';

const depth = (y) => 0.25 + ((y - WATERLINE) / (900 - WATERLINE)) * 0.95;

function LotusPad({ x, y, s, rot }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s} ${s * 0.38}) rotate(${rot})`}>
      <path d="M0 0 L40 -8 A40 40 0 1 1 40 8 Z" fill="#2F5A34" />
      <path d="M0 0 L40 -8 A40 40 0 1 1 40 8 Z" fill="none" stroke="#5E8A4A" strokeOpacity="0.6" strokeWidth="2" />
    </g>
  );
}

function LotusFlower({ x, y, s }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="4" rx="22" ry="5" fill="#2F5A34" />
      <path d="M0 2 C-6 -10 -5 -22 0 -32 C5 -22 6 -10 0 2 Z" fill="#F7B8C8" />
      <path d="M0 2 C-14 -2 -20 -14 -20 -24 C-10 -20 -4 -10 0 2 Z" fill="#EE93AC" />
      <path d="M0 2 C14 -2 20 -14 20 -24 C10 -20 4 -10 0 2 Z" fill="#EE93AC" />
      <path d="M0 2 C-20 2 -28 -6 -30 -12 C-18 -12 -8 -6 0 2 Z" fill="#E07A97" />
      <path d="M0 2 C20 2 28 -6 30 -12 C18 -12 8 -6 0 2 Z" fill="#E07A97" />
    </g>
  );
}

/** Placeholder: lotus pads, blooms and floating diyas gently bobbing on the pond. */
export default function LotusForegroundArt({ animate = true }) {
  const { pads, flowers } = useMemo(() => {
    const rand = seeded(44);
    const pads = Array.from({ length: 26 }, () => {
      const y = WATERLINE + 30 + rand() ** 0.8 * 280;
      const side = rand() > 0.5 ? 1 : -1;
      const x = 720 + side * (140 + rand() * 620);
      return { x, y, s: depth(y) * 1.4, rot: rand() * 360 };
    });
    const flowers = pads.filter((_, i) => i % 3 === 0).map((p) => ({ x: p.x + 10, y: p.y - 4, s: p.s * 0.8 }));
    return { pads, flowers };
  }, []);

  const diyas = [
    [600, 650], [840, 662], [480, 700], [960, 712], [660, 740],
    [790, 770], [380, 790], [1060, 800], [560, 840], [890, 860],
  ];

  return (
    <ArtBoard>
      <defs>
        <DiyaDefs />
        <radialGradient id="diya-reflect" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFC46B" stopOpacity="0.55" />
          <stop offset="1" stopColor="#FFC46B" stopOpacity="0" />
        </radialGradient>
      </defs>
      {pads.map((p, i) => (
        <LotusPad key={i} {...p} />
      ))}
      {flowers.map((f, i) => (
        <LotusFlower key={i} {...f} />
      ))}
      {diyas.map(([x, y], i) => {
        const s = depth(y) * 0.75;
        return (
          <g key={i}>
            <ellipse cx={x + 20 * s} cy={y + 14 * s} rx={60 * s} ry={22 * s} fill="url(#diya-reflect)" />
            <motion.g
              animate={animate ? { y: [0, -3 * s - 1, 0] } : undefined}
              transition={{ duration: 3 + (i % 4) * 0.6, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
            >
              <ellipse cx={x} cy={y + 8 * s} rx={44 * s} ry={10 * s} fill="#2F5A34" />
              <DiyaGlyph x={x} y={y} scale={s} animate={animate} seed={i} />
            </motion.g>
          </g>
        );
      })}
    </ArtBoard>
  );
}
