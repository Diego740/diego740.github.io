import { motion } from 'framer-motion';
import styles from './AnimatedBackground.module.css';

const bubbles = Array.from({ length: 10 }).map((_, index) => ({
  id: index,
  delay: index * 0.9,
  size: Math.floor(Math.random() * 220) + 80,
  left: Math.random() * 100,
  driftX: (Math.random() - 0.5) * 120,
  duration: Math.random() * 20 + 14
}));

function AnimatedBackground() {
  return (
    <div className={styles.wrapper} aria-hidden>
      <motion.div
        className={styles.gradient}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
      />
      {bubbles.map((bubble) => (
        <motion.span
          key={bubble.id}
          className={styles.particle}
          style={{
            width: bubble.size,
            height: bubble.size,
            left: `${bubble.left}%`
          }}
          animate={{
            y: ['110vh', '-10vh'],
            x: [0, bubble.driftX, 0],
            opacity: [0, 0.35, 0],
            scale: [0.8, 1.1, 0.9]
          }}
          transition={{
            duration: bubble.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: bubble.delay
          }}
        />
      ))}
    </div>
  );
}

export default AnimatedBackground;
