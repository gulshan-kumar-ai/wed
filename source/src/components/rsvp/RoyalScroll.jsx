/** Parchment body between two gilded scroll rollers. */
function Roller() {
  return (
    <div className="relative z-10 mx-[-14px] h-7 sm:mx-[-22px]" aria-hidden="true">
      <div className="absolute inset-x-3 inset-y-0 rounded-full bg-[linear-gradient(to_bottom,#F6E6A6_0%,#D4AF37_35%,#9C7A1E_75%,#6E5010_100%)] shadow-[0_6px_14px_rgba(80,30,10,0.3)]" />
      <div className="absolute inset-x-3 top-[9px] h-[3px] bg-crimson/70" />
      <div className="absolute inset-x-3 bottom-[8px] h-px bg-[#F6E6A6]/70" />
      {['left-0', 'right-0'].map((side) => (
        <span
          key={side}
          className={`absolute ${side} top-1/2 h-10 w-6 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_35%_30%,#F6E6A6,#B8922E_55%,#6E5010)] shadow-md`}
        />
      ))}
    </div>
  );
}

export default function RoyalScroll({ children, className = '' }) {
  return (
    <div className={`mx-auto w-full max-w-2xl ${className}`}>
      <Roller />
      <div className="relative -my-3 border-x border-gold/70 bg-[linear-gradient(to_right,#EEDDBC_0%,#FBF3E2_7%,#FFFCF5_50%,#FBF3E2_93%,#EEDDBC_100%)] px-6 pb-14 pt-16 shadow-[0_30px_60px_rgba(80,30,10,0.18)] sm:px-14">
        <div className="pointer-events-none absolute inset-x-5 inset-y-8 border border-gold/50 sm:inset-x-8" aria-hidden="true" />
        <div className="relative">{children}</div>
      </div>
      <Roller />
    </div>
  );
}
