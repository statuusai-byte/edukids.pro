import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAge } from '@/context/AgeContext';
import { useEffect } from 'react';

const Home = () => {
  const { ageGroup, setAgeGroup } = useAge();

  // Efeito para "limpar" a faixa etária ao visitar a página inicial
  // Isto força o utilizador a fazer uma escolha consciente sempre que regressa aqui.
  useEffect(() => {
    setAgeGroup(null);
  }, [setAgeGroup]);

  return (
    <div className="space-y-16">
      <section className="flex flex-col items-center justify-center text-center min-h-[60vh] relative overflow-hidden">
        {/* Elementos de fundo decorativos */}
        <motion.div
          className="absolute top-10 left-10 w-32 h-32 bg-secondary rounded-full opacity-30"
          animate={{ y: [0, 20, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-48 h-48 bg-accent rounded-full opacity-30"
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div 
          className="relative z-10 flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary-foreground">
            EduKids+
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl">
            A plataforma onde a aprendizagem se transforma numa aventura emocionante. Explore, jogue e cresça connosco!
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link to="/sobre">Saber Mais</Link>
          </Button>
        </motion.div>
      </section>

      <section id="age-selection" className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold">Para Começar a Aventura...</h2>
          <p className="mt-2 text-lg text-muted-foreground">Qual é a idade do nosso explorador?</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button variant={ageGroup === '4-6' ? 'default' : 'outline'} size="xl" onClick={() => setAgeGroup('4-6')}>
              <Link to="/dashboard">4-6 anos</Link>
            </Button>
            <Button variant={ageGroup === '7-9' ? 'default' : 'outline'} size="xl" onClick={() => setAgeGroup('7-9')}>
              <Link to="/dashboard">7-9 anos</Link>
            </Button>
            <Button variant={ageGroup === '10-12' ? 'default' : 'outline'} size="xl" onClick={() => setAgeGroup('10-12')}>
              <Link to="/dashboard">10-12 anos</Link>
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;