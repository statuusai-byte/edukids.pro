import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, PlayCircle, Rocket } from "lucide-react";
import { TiltCard } from "@/components/TiltCard";
import { Link } from "react-router-dom";
import { useMemo } from "react";
import { allCourses } from "@/data/coursesData";
import { useAge } from "@/context/AgeContext";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Home = () => {
  const { ageGroup } = useAge();

  const recommended = useMemo(() => {
    if (!ageGroup) return [];
    const rec = allCourses.filter(c => c.recommended && c.ageGroups.includes(ageGroup));
    const fallback = allCourses.filter(c => !c.recommended && c.ageGroups.includes(ageGroup));
    return [...rec, ...fallback].slice(0, 6);
  }, [ageGroup]);

  return (
    <div className="space-y-16">
      <section className="flex flex-col items-center justify-center text-center min-h-[60vh]">
        <motion.div 
          className="relative z-10 flex flex-col items-center"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="mb-6 p-4 bg-primary/20 border border-primary/50 rounded-full shadow-lg">
            <Rocket className="h-10 w-10 text-primary" />
          </motion.div>
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-black text-white tracking-tighter bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">
            Sua Aventura do Saber
          </motion.h1>
          <motion.p variants={itemVariants} className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Olá, Alex! Pronto para explorar, aprender e conquistar? Escolha seu caminho e vamos começar!
          </motion.p>
          
          <motion.div variants={containerVariants} className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
            <motion.div variants={itemVariants}>
              <Link to="/activities">
                <TiltCard className="p-8 h-full flex flex-col items-center justify-center text-center group">
                  <div className="mb-4 p-4 bg-secondary rounded-full border border-white/10">
                    <BookOpen className="h-12 w-12 text-purple-400 transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <h2 className="text-3xl font-bold text-white">Atividades</h2>
                  <p className="text-muted-foreground mt-2">Desafios e jogos interativos para testar seus conhecimentos.</p>
                  <Button variant="link" className="mt-4 text-primary text-lg">
                    Começar a Jogar <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </TiltCard>
              </Link>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Link to="/courses">
                <TiltCard className="p-8 h-full flex flex-col items-center justify-center text-center group">
                  <div className="mb-4 p-4 bg-secondary rounded-full border border-white/10">
                    <PlayCircle className="h-12 w-12 text-cyan-400 transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <h2 className="text-3xl font-bold text-white">Cursos</h2>
                  <p className="text-muted-foreground mt-2">Aulas em vídeo para aprender novas habilidades e conceitos.</p>
                  <Button variant="link" className="mt-4 text-primary text-lg">
                    Explorar Cursos <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </TiltCard>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      <motion.section 
        className="max-w-6xl mx-auto px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Recomendados para você</h2>
          <Link to="/courses" className="text-sm text-primary hover:underline">Ver todos os cursos</Link>
        </div>

        {recommended.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {recommended.map(course => (
              <motion.div variants={itemVariants} key={course.id} className="group">
                <div className="glass-card p-3 h-full flex flex-col">
                  <div className="relative h-36 overflow-hidden rounded-lg mb-3">
                    <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-semibold"
                      style={{ background: course.premium ? 'linear-gradient(90deg,#f43f5e,#8b5cf6)' : 'rgba(255,255,255,0.06)' , color: course.premium ? 'white' : 'var(--foreground)'}}>
                      {course.premium ? 'Premium' : 'Gratuito'}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{course.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{course.instructor}</p>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    {course.premium ? (
                      <Button asChild variant="outline" size="sm">
                        <Link to="/store">Fazer Upgrade</Link>
                      </Button>
                    ) : (
                      <Button asChild variant="default" size="sm">
                        <Link to={`/courses/${course.id}`}>Assistir</Link>
                      </Button>
                    )}
                    <div className="text-xs text-muted-foreground">{course.duration}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground">Selecione uma faixa etária para ver recomendações.</div>
        )}
      </motion.section>
    </div>
  );
};

export default Home;