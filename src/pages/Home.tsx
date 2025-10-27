import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAge } from '@/context/AgeContext';
import { useEffect } from 'react';

const Home = () => {
  const { setAgeGroup } = useAge();

  useEffect(() => {
    setAgeGroup(null);
  }, [setAgeGroup]);

  const desktopBg = "url('https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg')";
  const mobileBg = "url('https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg')";

  return (
    <div>
      <section className="relative w-full h-screen flex items-center justify-center text-center text-white overflow-hidden">
        {/* Background Image Container */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: mobileBg }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat hidden md:block"
          style={{ backgroundImage: desktopBg }}
          aria-hidden="true"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" aria-hidden="true" />

        {/* Content */}
        <motion.div
          className="relative z-10 flex flex-col items-center px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-shadow-lg">
            EduKids+
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-200 max-w-2xl text-shadow">
            A plataforma onde a aprendizagem se transforma numa aventura emocionante. Explore, jogue e cresça connosco!
          </p>
          <Button asChild size="lg" className="mt-8 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30">
            <a href="#age-selection">Começar Aventura</a>
          </Button>
        </motion.div>
      </section>

      <section id="age-selection" className="container mx-auto px-4 text-center py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold">Para Começar a Aventura...</h2>
          <p className="mt-2 text-lg text-muted-foreground">Qual é a idade do nosso explorador?</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild variant="outline" size="lg" className="h-16 px-8 text-xl">
              <Link to="/dashboard" onClick={() => setAgeGroup('4-6')}>4-6 anos</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-16 px-8 text-xl">
              <Link to="/dashboard" onClick={() => setAgeGroup('7-9')}>7-9 anos</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-16 px-8 text-xl">
              <Link to="/dashboard" onClick={() => setAgeGroup('10-12')}>10-12 anos</Link>
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;