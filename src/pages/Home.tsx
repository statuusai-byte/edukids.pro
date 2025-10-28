import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, GraduationCap, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TiltCard } from "@/components/TiltCard";
import { subjectsData } from "@/data/activitiesData";
import { allCourses } from "@/data/coursesData";
import { usePremium } from "@/context/PremiumContext";
import { useSupabase } from "@/context/SupabaseContext";
import { Icon } from "@/components/Icon";

const Home = () => {
  const { isPremium } = usePremium();
  const { user } = useSupabase();

  const ageGroups = [
    { id: '3-5', label: '3 a 5 Anos', description: 'Foco em coordenação motora, cores e introdução a números e letras.', icon: 'Baby' },
    { id: '6-8', label: '6 a 8 Anos', description: 'Alfabetização, matemática básica e desenvolvimento do raciocínio lógico.', icon: 'School' },
    { id: '9-12', label: '9 a 12 Anos', description: 'Aprofundamento em matérias, pensamento crítico e resolução de problemas complexos.', icon: 'GraduationCap' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 bg-gradient-to-b from-background to-primary/5">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl sm:text-6xl font-extrabold tracking-tighter mb-4 text-foreground"
          >
            O Futuro da Educação Infantil
          </motion.h1>
          <motion.p
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-8"
          >
            EDUKIDS+ combina jogos interativos, IA e currículo pedagógico para transformar o aprendizado em uma aventura diária.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex justify-center gap-4"
          >
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/30">
              <Link to="/activities">
                Começar a Aprender <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
              <Link to="/store">
                Ver Planos Premium
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Age Selection Section (Adjusted Padding) */}
      <section id="age-selection" className="container mx-auto px-4 text-center py-12 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter mb-4">Escolha a Idade do Seu Filho(a)</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-12">
            Nosso conteúdo é adaptado para garantir o desenvolvimento cognitivo e motor ideal em cada fase.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ageGroups.map((group, index) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <TiltCard className="p-6 h-full">
                <Icon name={group.icon as any} className="h-10 w-10 text-primary mb-4 mx-auto" />
                <h3 className="text-xl font-semibold mb-2">{group.label}</h3>
                <p className="text-muted-foreground text-sm">{group.description}</p>
                <Button asChild variant="link" className="mt-4">
                  <Link to={`/activities?age=${group.id}`}>Explorar Conteúdo</Link>
                </Button>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Subjects/Activities Section */}
      <section id="subjects" className="bg-secondary/30 py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter mb-4">Matérias Interativas</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              De matemática a artes, cobrimos todas as áreas essenciais do desenvolvimento infantil com atividades lúdicas e envolventes.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {subjectsData.slice(0, 6).map((subject, index) => (
              <motion.div
                key={subject.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <Card className="glass-card p-4 text-center h-full hover:shadow-primary/30 transition-shadow">
                  <Icon name={subject.icon as any} className="h-8 w-8 text-primary mb-2 mx-auto" />
                  <h3 className="text-sm font-medium">{subject.name}</h3>
                </Card>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button asChild variant="link" size="lg">
              <Link to="/activities">Ver todas as atividades <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="container mx-auto px-4 py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter mb-4">Cursos de Habilidades Essenciais</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Cursos focados em habilidades socioemocionais, criatividade e desenvolvimento motor, complementando o currículo escolar.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {allCourses.slice(0, 3).map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="glass-card p-4 h-full flex flex-col">
                <CardHeader className="p-0 pb-3">
                  <div className="flex items-center gap-3">
                    {/* O ícone do curso não está definido no objeto course, então vou usar um ícone genérico ou removê-lo */}
                    <GraduationCap className="h-6 w-6 text-primary" />
                    <CardTitle className="text-xl">{course.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-0 flex-grow">
                  <p className="text-sm text-muted-foreground line-clamp-3">{course.description}</p>
                </CardContent>
                <div className="pt-4">
                  <Button asChild variant="link" className="p-0 h-auto">
                    <Link to={`/courses/${course.id}`}>Ver Curso</Link>
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Premium CTA Section */}
      {!isPremium && (
        <section id="premium-cta" className="bg-primary/10 py-16 sm:py-24">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <Star className="h-10 w-10 text-primary mx-auto mb-4" />
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter mb-4">Desbloqueie o Acesso Total</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Torne-se Premium e garanta acesso ilimitado a todos os jogos, cursos, relatórios avançados e suporte de IA.
              </p>
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/30">
                <Link to="/store">
                  Assinar EDUKIDS+ Premium <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>
      )}
    </motion.div>
  );
};

export default Home;