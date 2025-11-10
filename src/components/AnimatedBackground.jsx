import { motion } from 'framer-motion';
import styles from './AnimatedBackground.module.css';

const bubbles = Array.from({ length: 12 }).map((_, index) => ({
  id: index,
  delay: index * 0.4,
  size: Math.floor(Math.random() * 160) + 120,
  left: Math.random() * 100,
  duration: Math.random() * 14 + 12
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
            opacity: [0, 0.4, 0]
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
