import { useCallback, useRef } from 'react';

/**
 * useCardGlow
 *
 * Returns a ref to attach to a card element. On mouse enter/move,
 * it sets --glow-x and --glow-y CSS custom properties (as percentages)
 * so a CSS radial-gradient can follow the cursor. On mouse leave,
 * it resets the opacity via --glow-opacity.
 */
export function useCardGlow() {
  const ref = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const card = ref.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    card.style.setProperty('--glow-x', `${x}%`);
    card.style.setProperty('--glow-y', `${y}%`);
    card.style.setProperty('--glow-opacity', '1');
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = ref.current;
    if (!card) return;
    card.style.setProperty('--glow-opacity', '0');
  }, []);

  return { ref, handleMouseMove, handleMouseLeave };
}
