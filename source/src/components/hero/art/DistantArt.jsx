import ArtBoard from '../../layout/ArtBoard';

function Palm({ x, h, lean = 0, scale = 1 }) {
  const topX = x + lean;
  const topY = 700 - h;
  const fronds = [-150, -120, -90, -60, -30, -170, -10].map((deg, i) => {
    const r = (deg * Math.PI) / 180;
    const len = (52 + (i % 3) * 8) * scale;
    const ex = topX + Math.cos(r) * len;
    const ey = topY + Math.sin(r) * len * 0.5 + len * 0.45;
    const cx = topX + Math.cos(r) * len * 0.55;
    const cy = topY + Math.sin(r) * len * 0.75;
    return `M${topX} ${topY} Q${cx} ${cy} ${ex} ${ey}`;
  });
  return (
    <g stroke="currentColor" fill="none" strokeLinecap="round">
      <path d={`M${x} 700 Q${x + lean * 0.2} ${700 - h * 0.6} ${topX} ${topY}`} strokeWidth={5 * scale} />
      {fronds.map((d, i) => (
        <path key={i} d={d} strokeWidth={4 * scale} />
      ))}
    </g>
  );
}

/** Placeholder: hazy Sindh horizon — low dunes and date palms. */
export default function DistantArt() {
  return (
    <ArtBoard>
      <path
        d="M0 660 C160 630 300 650 420 640 C560 628 640 660 760 655 C900 648 1000 622 1140 636 C1260 648 1360 630 1440 640 V900 H0 Z"
        fill="#ECBF92"
        opacity="0.55"
      />
      <path
        d="M0 685 C200 664 360 690 520 676 C700 662 820 690 980 680 C1140 670 1300 690 1440 674 V900 H0 Z"
        fill="#E6B285"
        opacity="0.7"
      />
      <g style={{ color: '#B87A5C' }} opacity="0.55">
        <Palm x={170} h={150} lean={-12} />
        <Palm x={240} h={118} lean={8} scale={0.85} />
        <Palm x={1200} h={160} lean={14} />
        <Palm x={1280} h={120} lean={-6} scale={0.85} />
        <Palm x={60} h={100} lean={6} scale={0.75} />
        <Palm x={1385} h={104} lean={-8} scale={0.75} />
      </g>
    </ArtBoard>
  );
}
