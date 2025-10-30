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

  // Garante que 'children' seja sempre um único elemento React para 'motion.div'.
  // Se 'children' for uma string, um número, ou múltiplos elementos, ele é envolvido em um 'div'.
  // Caso contrário, é passado diretamente.
  const content = React.Children.count(children) > 1 || typeof children === 'string' || typeof children === 'number'
    ? <div>{children}</div>
    : children;

  if (reduceMotion) {
    // Se a animação for reduzida, apenas renderiza o conteúdo sem motion.div
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
      {content}
    </motion.div>
  );
};

export default PageTransition;