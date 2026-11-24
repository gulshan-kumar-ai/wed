import ArtBoard from '../../layout/ArtBoard';

export const RAIL_TOP = 640;
const RAIL_H = 14;
const BOTTOM_RAIL = 712;
const GAP = [598, 842]; // opening for the garden path

function Baluster({ x }) {
  const top = RAIL_TOP + RAIL_H;
  return (
    <path
      d={`M${x - 5} ${top} h10 q-2 8 4 18 q6 12 -2 22 q-3 4 -2 18 h-10 q1 -14 -2 -18 q-8 -10 -2 -22 q6 -10 4 -18 Z`}
      fill="url(#bal-stone)"
    />
  );
}

function Pier({ x }) {
  return (
    <g>
      <rect x={x - 22} y={RAIL_TOP - 30} width="44" height={BOTTOM_RAIL + 26 - RAIL_TOP + 30} fill="url(#bal-stone)" />
      <rect x={x - 28} y={RAIL_TOP - 40} width="56" height="12" fill="#E3CDA6" />
      <rect x={x - 14} y={RAIL_TOP - 12} width="28" height="50" fill="none" stroke="#D4AF37" strokeWidth="1.2" />
      {/* lotus finial */}
      <path d={`M${x} ${RAIL_TOP - 72} q12 14 0 32 q-12 -18 0 -32 Z`} fill="#D4AF37" />
      <path d={`M${x} ${RAIL_TOP - 40} q-18 -4 -20 -18 q12 0 20 18 Z`} fill="#C8A15E" />
      <path d={`M${x} ${RAIL_TOP - 40} q18 -4 20 -18 q-12 0 -20 18 Z`} fill="#C8A15E" />
    </g>
  );
}

/** Placeholder: carved ivory-sandstone balustrade with a central opening and lotus-capped piers. */
export default function BalustradeArt() {
  const runs = [
    [-20, GAP[0]],
    [GAP[1], 1460],
  ];
  return (
    <ArtBoard>
      <defs>
        <linearGradient id="bal-stone" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#E7D2AE" />
          <stop offset="0.45" stopColor="#FBF0DC" />
          <stop offset="1" stopColor="#D9BE90" />
        </linearGradient>
        <linearGradient id="bal-rail" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFF7E8" />
          <stop offset="1" stopColor="#E2C99E" />
        </linearGradient>
      </defs>
      {runs.map(([a, b]) => (
        <g key={a}>
          <rect x={a} y={RAIL_TOP} width={b - a} height={RAIL_H} fill="url(#bal-rail)" />
          <rect x={a} y={RAIL_TOP + RAIL_H} width={b - a} height="2" fill="#C8A15E" opacity="0.6" />
          {Array.from({ length: Math.floor((b - a) / 26) }, (_, i) => (
            <Baluster key={i} x={a + 14 + i * 26} />
          ))}
          <rect x={a} y={BOTTOM_RAIL} width={b - a} height="12" fill="url(#bal-rail)" />
          <rect x={a} y={BOTTOM_RAIL + 12} width={b - a} height="16" fill="#D9BE90" />
        </g>
      ))}
      <Pier x={GAP[0]} />
      <Pier x={GAP[1]} />
    </ArtBoard>
  );
}
