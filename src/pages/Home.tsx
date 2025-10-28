import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, GraduationCap, Star, Rocket } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TiltCard } from "@/components/TiltCard";
import { usePremium } from "@/context/PremiumContext";
import { useAge } from "@/context/AgeContext";
import { cn } from "@/lib/utils";

type AgeGroupKey = '4-6' | '7-9' | '10-12';

const Home = () => {
  const { isPremium } = usePremium();
  const { setAgeGroup } = useAge();
  const navigate = useNavigate();

  const ageGroups: { id: AgeGroupKey; label: string; description: string; icon: string }[] = [
    { id: '4-6', label: '4 a 6 Anos', description: 'Foco em coordenação motora, cores e introdução a números e letras.', icon: 'Apple' },
    { id: '7-9', label: '7 a 9 Anos', description: 'Alfabetização, matemática básica e desenvolvimento do raciocínio lógico.', icon: 'BookOpen' },
    { id: '10-12', label: '10 a 12 Anos', description: 'Aprofundamento em matérias, pensamento crítico e resolução de problemas complexos.', icon: 'GraduationCap' },
  ];

  const handleSelectAge = (group: AgeGroupKey) => {
    setAgeGroup(group);
    navigate('/activities');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col items-center justify-center p-4"
    >
      {/* Background Hero Image (using Tailwind classes defined in tailwind.config.ts) */}
      <div className="fixed inset-0 z-0 bg-hero-desktop bg-cover bg-center md:bg-hero-desktop bg-no-repeat opacity-30"></div>
      <div className="fixed inset-0 z-0 bg-black/50"></div>

      <div className="relative z-10 w-full max-w-5xl text-center">
        
        {/* Title Section */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <h1 className="text-6xl sm:text-7xl font-extrabold tracking-tighter text-white text-shadow-lg">
            EDUKIDS+
          </h1>
          <p className="text-xl sm:text-2xl text-white/80 mt-3 text-shadow-md">
            A aventura do aprendizado começa aqui.
          </p>
        </motion.div>

        {/* Age Selection Section */}
        <section id="age-selection" className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 text-shadow">
            Selecione a Faixa Etária
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ageGroups.map((group, index) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              >
                <TiltCard 
                  className="p-6 h-full cursor-pointer hover:border-primary/80 transition-all duration-300"
                  onClick={() => handleSelectAge(group.id)}
                >
                  <Rocket className="h-10 w-10 text-primary mb-4 mx-auto" />
                  <h3 className="text-xl font-semibold mb-2">{group.label}</h3>
                  <p className="text-muted-foreground text-sm">{group.description}</p>
                  <Button variant="link" className="mt-4 text-primary">
                    Começar
                  </Button>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Premium CTA Section */}
        {!isPremium && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-10"
          >
            <Card className="glass-card p-6 max-w-xl mx-auto border-primary/50">
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <h3 className="text-xl font-bold flex items-center gap-2 text-primary">
                    <Star className="h-5 w-5" /> EDUKIDS+ Premium
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Desbloqueie todos os cursos e relatórios avançados.
                  </p>
                </div>
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30">
                  <Link to="/store">
                    Assinar Agora <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </Card>
          </motion.section>
        )}
      </div>
    </motion.div>
  );
};

export default Home;