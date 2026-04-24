import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdClose, MdChevronLeft, MdChevronRight } from 'react-icons/md';
import styles from './ImageGalleryModal.module.css';

// Utility to wrap index around array length
const wrap = (min, max, v) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

export default function ImageGalleryModal({ isOpen, onClose, images = [] }) {
  const [page, setPage] = useState(0);

  // Reset page when modal opens
  useEffect(() => {
    if (isOpen) setPage(0);
  }, [isOpen]);

  const handleNext = useCallback((e) => {
    e?.stopPropagation();
    setPage((prev) => prev + 1);
  }, []);

  const handlePrev = useCallback((e) => {
    e?.stopPropagation();
    setPage((prev) => prev - 1);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handleNext, handlePrev]);

  if (!images || images.length === 0) return null;

  // Single image case: no carousel needed
  if (images.length === 1) {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            <motion.div
              className={styles.modal}
              initial={{ scale: 0.98, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.98, opacity: 0, y: 15 }}
              transition={{ type: 'spring', damping: 30, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className={styles.closeButton} onClick={onClose} aria-label="Cerrar galería">
                <MdClose size={24} />
              </button>
              <div className={styles.imageContainer}>
                <img src={images[0]} alt="Screenshot 1" className={styles.imageSingle} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Carousel logic
  const activeIndex = wrap(0, images.length, page);
  const visiblePages = [page - 1, page, page + 1];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={styles.modal}
            initial={{ scale: 0.98, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.98, opacity: 0, y: 15 }}
            transition={{ type: 'spring', damping: 30, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.closeButton} onClick={onClose} aria-label="Cerrar galería">
              <MdClose size={24} />
            </button>

            <div className={styles.carouselWrapper}>
              <div className={styles.carouselTrack}>
                <AnimatePresence initial={false}>
                  {visiblePages.map((p) => {
                    const offset = p - page; // -1, 0, or 1
                    const index = wrap(0, images.length, p);
                    const isCenter = offset === 0;
                    
                    return (
                      <motion.div
                        key={p}
                        className={styles.carouselItem}
                        initial={{ 
                          x: `${offset * 90}%`, 
                          scale: isCenter ? 1 : 0.8, 
                          opacity: isCenter ? 1 : 0.4 
                        }}
                        animate={{ 
                          x: `${offset * 90}%`, 
                          scale: isCenter ? 1 : 0.8, 
                          opacity: isCenter ? 1 : 0.4,
                          zIndex: isCenter ? 10 : 1
                        }}
                        exit={{ 
                          x: `${(offset < 0 ? -120 : 120)}%`,
                          opacity: 0,
                          scale: 0.6
                        }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        onClick={() => {
                          if (offset === -1) handlePrev();
                          if (offset === 1) handleNext();
                        }}
                        style={{ cursor: isCenter ? 'default' : 'pointer' }}
                      >
                        <img 
                          src={images[index]} 
                          alt={`Screenshot ${index + 1}`} 
                          className={styles.carouselImage} 
                        />
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>

            <button className={styles.prevButton} onClick={handlePrev} aria-label="Imagen anterior">
              <MdChevronLeft size={32} />
            </button>
            <button className={styles.nextButton} onClick={handleNext} aria-label="Siguiente imagen">
              <MdChevronRight size={32} />
            </button>
            
            <div className={styles.indicators}>
              {images.map((_, idx) => (
                <button
                  key={idx}
                  className={`${styles.dot} ${idx === activeIndex ? styles.activeDot : ''}`}
                  onClick={() => {
                    let diff = idx - activeIndex;
                    if (diff > images.length / 2) diff -= images.length;
                    if (diff < -images.length / 2) diff += images.length;
                    setPage(page + diff);
                  }}
                  aria-label={`Ir a imagen ${idx + 1}`}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
