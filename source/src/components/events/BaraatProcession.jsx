import { motion } from 'framer-motion';

function Person({ x, y = 96, scale = 1, trumpet = false }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <circle cx="0" cy="-34" r="8" fill="#D8A06A" stroke="#663F24" strokeWidth="1" />
      <path d="M-9-27 Q0-37 9-27 L8-5 Q0 2-8-5Z" fill="#263E7A" />
      <path d="M-8-5 Q0 4 8-5 L6 28 Q0 34-6 28Z" fill="#D9A4B8" />
      <path d="M-6-24Q-22-12-15 5" fill="none" stroke="#D8A06A" strokeWidth="4" strokeLinecap="round" />
      <path d="M7-24Q23-12 16 5" fill="none" stroke="#D8A06A" strokeWidth="4" strokeLinecap="round" />
      {trumpet && <>
        <path d="M16 4Q45-10 66-20" fill="none" stroke="#D4AF37" strokeWidth="4" strokeLinecap="round" />
        <path d="M62-24Q72-23 70-13Q60-12 58-19Z" fill="#F4C64D" />
      </>}
      <path d="M-7-42Q0-50 7-42L5-36Q0-33-5-36Z" fill="#A93226" />
    </g>
  );
}

function Horse({ x }) {
  return (
    <g transform={`translate(${x} 120)`}>
      <ellipse cx="0" cy="14" rx="31" ry="20" fill="#F2C58A" stroke="#8A5A32" strokeWidth="2" />
      <circle cx="24" cy="-2" r="10" fill="#F2C58A" stroke="#8A5A32" strokeWidth="2" />
      <path d="M29-10L35-27L40-8Z" fill="#A93226" />
      <path d="M-28 14L-33 42M-12 18L-16 42M12 18L16 42M26 11L30 38" fill="none" stroke="#8A5A32" strokeWidth="5" strokeLinecap="round" />
      <path d="M-27-2Q0-18 23-4L21 12Q0 5-27 12Z" fill="#A93226" />
      <path d="M-17-7Q0-20 18-7" fill="none" stroke="#D4AF37" strokeWidth="3" />
      <circle cx="18" cy="-2" r="1.6" fill="#201A16" />
    </g>
  );
}

export default function BaraatProcession({ className = '', label = 'Animated royal baraat procession' }) {
  return (
    <div
      role="img"
      aria-label={label}
      dir="ltr"
      className={`relative h-36 w-full overflow-hidden rounded-xl border border-gold/40 bg-[linear-gradient(to_bottom,#FFF9ED_0%,#FFF9ED_58%,#DDAF6B_58%,#DDAF6B_100%)] ${className}`}
    >
      <div className="absolute bottom-3 left-0 right-0 h-px bg-[#A93226]/25" />
      <motion.div
        className="absolute bottom-2 left-[-48%] w-[145%] h-[118px]"
        animate={{ x: ['0%', '70%', '0%'] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', times: [0, 0.48, 1] }}
      >
        <svg viewBox="0 0 520 170" className="h-full w-full" aria-hidden="true">
          <g opacity="0.95">
            <Person x="46" trumpet />
            <Person x="112" />
            <Horse x="188" />
            <g transform="translate(188 72)">
              <path d="M-38 18Q0-18 38 18L34 50Q0 58-34 50Z" fill="#A93226" stroke="#5D1F18" strokeWidth="2" />
              <path d="M-29 17Q0-2 29 17L25 45Q0 48-25 45Z" fill="#F1D4A1" />
              <circle cx="0" cy="25" r="8" fill="#D8A06A" />
              <path d="M-10 20Q0 10 10 20L8 42Q0 48-8 42Z" fill="#263E7A" />
              <path d="M-16 14Q0-10 16 14L12-1Q0-12-12-1Z" fill="#D4AF37" />
              <path d="M-31-18Q0-54 31-18" fill="none" stroke="#D4AF37" strokeWidth="3" />
            </g>
            <Person x="288" />
            <Person x="350" trumpet />
            <Person x="420" trumpet />
            <Person x="470" />
          </g>
        </svg>
      </motion.div>
    </div>
  );
}
