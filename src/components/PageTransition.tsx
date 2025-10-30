import { motion, Transition } from 'framer-motion';
import React, { ReactNode } from 'react';
import { usePrefersReducedMotion } from '@/hooks/use-reduced-motion';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -20,
  },
};

const pageTransition: Transition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5,
};

const PageTransition = ({ children }: { children: ReactNode }) => {
  const reduceMotion = usePrefersReducedMotion();

  if (reduceMotion) {
    return <div>{children}</div>;
  }

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      {/* Garante que motion.div sempre receba um único elemento React.
          Se 'children' puder ser múltiplos elementos, envolva-os em um fragmento. */}
      <React.Fragment>{children}</React.Fragment>
    </motion.div>
  );
};

export default PageTransition;