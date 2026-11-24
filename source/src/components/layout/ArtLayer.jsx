import { motion } from 'framer-motion';

/**
 * A single depth layer in a parallax scene.
 *
 * - `style` takes Framer Motion values (y, scale, opacity, …) from useTransform.
 * - `image` swaps the placeholder art for an illustration. When it's null the
 *   `children` (placeholder SVG/CSS art) are rendered instead.
 * - `imageClassName` controls how the image fits (defaults to the same
 *   bottom-anchored cover as the 1440 × 900 SVG artboard).
 */
export default function ArtLayer({
  image = null,
  alt = '',
  style,
  className = 'absolute inset-0',
  imageClassName = 'h-full w-full object-cover object-bottom',
  children,
}) {
  return (
    <motion.div
      aria-hidden={alt ? undefined : true}
      className={`pointer-events-none will-change-transform ${className}`}
      style={style}
    >
      {image ? (
        <img src={image} alt={alt} className={imageClassName} draggable="false" />
      ) : (
        children
      )}
    </motion.div>
  );
}
