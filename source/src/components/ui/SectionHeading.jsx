import { motion } from 'framer-motion';
import Ornament from './Ornament';

/** Eyebrow + display title + gold ornament, used to open each chapter. */
export default function SectionHeading({ id, eyebrow, title, intro }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto max-w-2xl text-center"
    >
      <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.4em] text-saffron-dark">{eyebrow}</p>
      <h2 id={id} className="mt-3 font-display text-[clamp(2.4rem,5.5vw,3.8rem)] font-semibold leading-[1.05] text-crimson">
        {title}
      </h2>
      <Ornament className="mx-auto mt-5 h-3 w-56" />
      {intro && <p className="mt-5 font-sans text-base leading-relaxed text-charcoal-soft sm:text-lg">{intro}</p>}
    </motion.header>
  );
}
