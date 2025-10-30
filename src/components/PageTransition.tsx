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

  // Garante que 'contentToRender' seja sempre um único elemento React.
  // Se 'children' for nulo/indefinido, uma string, um número ou múltiplos elementos,
  // ele é envolvido em um 'div'. Caso contrário, é passado diretamente.
  let contentToRender: React.ReactElement;

  if (React.Children.count(children) === 0) {
    // Se não houver filhos, renderiza um div vazio para satisfazer a exigência de um único elemento.
    contentToRender = <div />;
  } else if (React.Children.count(children) > 1 || typeof children === 'string' || typeof children === 'number') {
    // Se houver múltiplos filhos ou um tipo primitivo, envolve-os em um div.
    contentToRender = <div>{children}</div>;
  } else {
    // Se for um único elemento React, usa-o diretamente.
    contentToRender = children as React.ReactElement;
  }

  if (reduceMotion) {
    // Se a animação for reduzida, apenas renderiza o conteúdo sem motion.div.
    return contentToRender;
  }

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      {contentToRender}
    </motion.div>
  );
};

export default PageTransition;