import { forwardRef, useImperativeHandle, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

export function ParallaxProvider({ children }) {
  return children;
}

const toTransformValue = (progress, output) => {
  if (!output) {
    return undefined;
  }

  if (Array.isArray(output)) {
    return useTransform(progress, [0, 1], output);
  }

  return typeof output === 'number' ? useTransform(progress, [0, 1], [0, output]) : output;
};

export const Parallax = forwardRef(function Parallax(
  { translateY, translateX, scale, opacity, rotate, style, className, children, onProgressChange, ...rest },
  forwardedRef
) {
  const localRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: localRef, offset: ['start end', 'end start'] });

  useImperativeHandle(forwardedRef, () => localRef.current);

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    if (typeof onProgressChange === 'function') {
      onProgressChange(value);
    }
  });

  const motionStyle = {
    ...style,
    y: toTransformValue(scrollYProgress, translateY),
    x: toTransformValue(scrollYProgress, translateX),
    scale: toTransformValue(scrollYProgress, scale),
    opacity: toTransformValue(scrollYProgress, opacity),
    rotate: toTransformValue(scrollYProgress, rotate)
  };

  Object.keys(motionStyle).forEach((key) => {
    if (motionStyle[key] === undefined) {
      delete motionStyle[key];
    }
  });

  return (
    <motion.div ref={localRef} style={motionStyle} className={className} {...rest}>
      {children}
    </motion.div>
  );
});

export default {
  ParallaxProvider,
  Parallax
};
