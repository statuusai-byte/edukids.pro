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

  // Use local feature graphic placed in /public (matches uploaded filename)
  const heroImage = "/feature-graphic.png.png";

  // External assets for starry sky and planet
  const starsUrl =
    "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?q=80&w=1920&auto=format&fit=crop";
  const earthUrl =
    "https://images.unsplash.com/photo-1531206715517-5c0ba8f1d6d8?q=80&w=1200&auto=format&fit=crop";

  return (
    <div>
      <section
        // Reduced hero height so the age-selection can sit inside initial viewport
        className="relative w-full min-h-[62vh] md:min-h-[68vh] flex items-center justify-center text-center overflow-hidden main-container"
        aria-label="Hero do EduKids Plus"
      >
        {/* Starry sky layer (subtle, repeated) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url(${starsUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.12,
            mixBlendMode: 'screen',
            filter: 'blur(0.6px) contrast(1.05)',
            zIndex: 2,
          }}
        />

        {/* Planet / Earth — decorative, low opacity and behind content */}
        <img
          src={earthUrl}
          alt=""
          aria-hidden="true"
          className="hidden md:block absolute right-4 top-6 w-64 md:w-96 lg:w-[520px] pointer-events-none"
          style={{
            opacity: 0.12,
            transform: 'translateZ(0)',
            mixBlendMode: 'screen',
            zIndex: 3,
            filter: 'saturate(0.9) contrast(0.95)',
          }}
        />

        {/* Blended background layers: hero image + subtle color overlay to keep a premium look */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${heroImage})`,
            // Slightly lift saturation/contrast without overpowering the nebula beneath
            filter: 'saturate(1.05) contrast(1.02)',
            transformOrigin: 'center',
            zIndex: 1,
          }}
          aria-hidden="true"
        />

        {/* Subtle soft vignette + light color wash for premium mood (keeps text legible but not fully dark) */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true" style={{ zIndex: 4 }}>
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/6 to-black/10 mix-blend-multiply" />
          {/* Use inline style for the radial gradient to avoid Tailwind arbitrary-class parsing errors,
              but keep the aurora animation via the animate-aurora utility. */}
          <div
            className="absolute inset-0 animate-aurora"
            style={{
              background:
                'radial-gradient(ellipse at top left, rgba(124,58,237,0.12), transparent 30%)',
            }}
          />
        </div>

        {/* Accessible fallback image (for crawlers / semantics) */}
        <img
          src={heroImage}
          alt="Ilustração EduKids+ com crianças e texto 'Aprendizagem Lúdica para Crianças' sobre fundo degradê"
          className="sr-only"
        />

        {/* Foreground content (top layer) */}
        <motion.div
          className="relative z-10 flex max-w-5xl flex-col items-center px-6 text-center"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-fuchsia-500 to-yellow-400 drop-shadow-lg">
            EduKids+
          </h1>

          <p className="mt-4 max-w-3xl text-base md:text-lg text-white/85 leading-relaxed">
            A plataforma onde a aprendizagem se transforma numa aventura emocionante — conteúdo pedagógico, jogos interativos e ferramentas parentais para apoiar o crescimento.
          </p>

          <div className="mt-8 flex w-full max-w-md gap-3">
            <Button asChild size="lg" className="flex-1 bg-gradient-to-r from-primary to-fuchsia-500 text-white shadow-2xl">
              <Link to="/dashboard" onClick={() => setAgeGroup('4-6')}>Começar Aventura</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="hidden sm:inline-flex">
              <Link to="/store">Ver Planos</Link>
            </Button>
          </div>

          <div className="mt-6 text-sm text-white/75">
            <span>Explore atividades gratuitas ou experimente o Premium por assinatura — pronto para publicar na Play Store.</span>
          </div>
        </motion.div>
      </section>

      <section
        id="age-selection"
        // Pull the section up so it's visible on initial load; responsive negative margin
        className="container mx-auto px-4 text-center py-12 -mt-20 md:-mt-32 relative z-20"
      >
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.45 }}
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