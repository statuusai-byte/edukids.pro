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
    // Se a animação for reduzida, apenas renderiza os filhos diretamente dentro de um fragmento.
    return <>{children}</>;
  }

  // Envolve os filhos em um div para garantir que motion.div sempre receba um único elemento.
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <div>{children}</div>
    </motion.div>
  );
};

export default PageTransition;