import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import styles from './CustomCursor.module.css';

const INTERACTIVE = 'a, button, input, textarea, select, label, [role="button"], [tabindex]';

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);

  // Raw mouse position (dot follows exactly)
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);

  // Spring-lagged position for the ring
  const springCfg = { stiffness: 140, damping: 18, mass: 0.6 };
  const ringX = useSpring(dotX, springCfg);
  const ringY = useSpring(dotY, springCfg);

  useEffect(() => {
    // Detect touch devices — disable cursor on them
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const onMove = (e) => {
      dotX.set(e.clientX);
      dotY.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const onEnter = () => setVisible(true);
    const onLeave = () => setVisible(false);
    const onDown  = () => setClicking(true);
    const onUp    = () => setClicking(false);

    const onOver = (e) => {
      setHovering(!!e.target.closest(INTERACTIVE));
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseenter', onEnter);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('mouseover', onOver);

    document.documentElement.style.cursor = 'none';

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseenter', onEnter);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseover', onOver);
      document.documentElement.style.cursor = '';
    };
  }, [dotX, dotY, visible]);

  return (
    <>
      {/* Trailing ring */}
      <motion.div
        className={`${styles.ring} ${hovering ? styles.ringHover : ''} ${clicking ? styles.ringClick : ''}`}
        style={{
          translateX: ringX,
          translateY: ringY,
          opacity: visible ? 1 : 0,
        }}
        aria-hidden="true"
      />
      {/* Precise dot */}
      <motion.div
        ref={cursorRef}
        className={`${styles.dot} ${hovering ? styles.dotHover : ''} ${clicking ? styles.dotClick : ''}`}
        style={{
          translateX: dotX,
          translateY: dotY,
          opacity: visible ? 1 : 0,
        }}
        aria-hidden="true"
      />
    </>
  );
}
