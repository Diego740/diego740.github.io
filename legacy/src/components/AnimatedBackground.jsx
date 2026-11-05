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
        <motion.div
          key={bubble.id}
          style={{
            position: 'absolute',
            bottom: '-20vh',
            width: bubble.size,
            height: bubble.size,
            left: `${bubble.left}%`,
            zIndex: -1
          }}
          animate={{
            y: ['130vh', '-30vh'],
            x: [0, bubble.driftX, 0],
            opacity: [0, 0.45, 0]
          }}
          transition={{
            y: { duration: bubble.duration, repeat: Infinity, ease: 'linear', delay: bubble.delay },
            x: { duration: bubble.duration * 0.7, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut', delay: bubble.delay },
            opacity: { duration: bubble.duration, repeat: Infinity, ease: 'easeInOut', delay: bubble.delay }
          }}
        >
          <motion.div
            className={styles.particle}
            style={{ position: 'relative', bottom: 0, width: '100%', height: '100%' }}
            animate={{ scale: [0.3, 1.7] }}
            transition={{
              duration: 2 + (bubble.id % 2),
              repeat: Infinity,
              repeatType: 'mirror',
              ease: 'easeInOut',
              delay: bubble.delay % 2
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}

export default AnimatedBackground;
