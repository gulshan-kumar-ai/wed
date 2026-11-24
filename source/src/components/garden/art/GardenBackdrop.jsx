import ArtBoard from '../../layout/ArtBoard';

/** Placeholder: soft late-afternoon sky over the garden, with a lawn base below. */
export default function GardenBackdrop() {
  return (
    <ArtBoard>
      <defs>
        <linearGradient id="garden-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FDF8F0" />
          <stop offset="0.35" stopColor="#FBEBD0" />
          <stop offset="0.66" stopColor="#F4D2A2" />
          <stop offset="0.8" stopColor="#7E9A4C" />
          <stop offset="1" stopColor="#5D7C38" />
        </linearGradient>
        <radialGradient id="garden-sun" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFF6DE" stopOpacity="0.95" />
          <stop offset="1" stopColor="#FFF6DE" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1440" height="900" fill="url(#garden-sky)" />
      <circle cx="720" cy="420" r="380" fill="url(#garden-sun)" />
    </ArtBoard>
  );
}
