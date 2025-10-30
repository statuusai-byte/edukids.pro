import { motion, Transition } from 'framer-motion';
import { ReactNode } from 'react';
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

  // Aplica motion.div diretamente aos filhos.
  // Como em todos os usos atuais, 'children' é um único elemento React (um div),
  // esta abordagem é mais direta e segura.
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;