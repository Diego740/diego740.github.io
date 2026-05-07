import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdClose, MdChevronLeft, MdChevronRight } from 'react-icons/md';
import styles from './ImageGalleryModal.module.css';

const wrap = (min, max, v) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

export default function ImageGalleryModal({ isOpen, onClose, images = [] }) {
  const [[page, direction], setPage] = useState([0, 0]);

  useEffect(() => {
    if (isOpen) setPage([0, 0]);
  }, [isOpen]);

  const paginate = useCallback((dir) => {
    setPage(([p]) => [p + dir, dir]);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') paginate(1);
      if (e.key === 'ArrowLeft') paginate(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose, paginate]);

  if (!images?.length) return null;

  const activeIndex = wrap(0, images.length, page);
  const isSingle = images.length === 1;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            className={styles.modal}
            initial={{ scale: 0.96, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 12 }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top bar */}
            <div className={styles.topBar}>
              <span className={styles.counter}>
                {String(activeIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
              </span>
              <button className={styles.closeButton} onClick={onClose} aria-label="Cerrar galería">
                <MdClose size={20} />
              </button>
            </div>

            {isSingle ? (
              /* Single image */
              <div className={styles.imageArea}>
                <img
                  src={images[0]}
                  alt="Screenshot 1"
                  className={styles.imageSingle}
                  draggable={false}
                />
              </div>
            ) : (
              <>
                {/* Carousel with peek */}
                <div className={styles.carouselArea}>
                  <div className={styles.carouselTrack}>
                    <AnimatePresence initial={false} custom={direction}>
                      {[page - 1, page, page + 1].map((p) => {
                        const offset = p - page;
                        const index = wrap(0, images.length, p);
                        const isCenter = offset === 0;

                        return (
                          <motion.div
                            key={p}
                            className={styles.carouselItem}
                            custom={direction}
                            initial={{
                              x: `${offset * 88}%`,
                              scale: isCenter ? 1 : 0.78,
                              opacity: isCenter ? 1 : 0.3,
                            }}
                            animate={{
                              x: `${offset * 88}%`,
                              scale: isCenter ? 1 : 0.78,
                              opacity: isCenter ? 1 : 0.3,
                              zIndex: isCenter ? 10 : 1,
                            }}
                            exit={{
                              x: `${(offset < 0 ? -140 : 140)}%`,
                              opacity: 0,
                              scale: 0.6,
                            }}
                            transition={{ type: 'spring', stiffness: 280, damping: 30 }}
                            onClick={() => {
                              if (offset === -1) paginate(-1);
                              if (offset === 1) paginate(1);
                            }}
                            style={{ cursor: isCenter ? 'default' : 'pointer' }}
                          >
                            <img
                              src={images[index]}
                              alt={`Screenshot ${index + 1}`}
                              className={styles.carouselImage}
                              draggable={false}
                            />
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>

                  <button
                    className={styles.prevButton}
                    onClick={() => paginate(-1)}
                    aria-label="Imagen anterior"
                  >
                    <MdChevronLeft size={32} />
                  </button>
                  <button
                    className={styles.nextButton}
                    onClick={() => paginate(1)}
                    aria-label="Siguiente imagen"
                  >
                    <MdChevronRight size={32} />
                  </button>
                </div>

                {/* Dots */}
                <div className={styles.indicators}>
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      className={`${styles.dot} ${idx === activeIndex ? styles.activeDot : ''}`}
                      onClick={() => {
                        let diff = idx - activeIndex;
                        if (diff > images.length / 2) diff -= images.length;
                        if (diff < -images.length / 2) diff += images.length;
                        setPage(([p]) => [p + diff, diff > 0 ? 1 : -1]);
                      }}
                      aria-label={`Ir a imagen ${idx + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
