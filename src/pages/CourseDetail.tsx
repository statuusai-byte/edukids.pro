import { useParams, Link as RouterLink } from "react-router-dom";
import { allCourses } from "@/data/coursesData";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePremium } from "@/context/PremiumContext";
import VideoPlayer from "@/components/VideoPlayer";

const CourseDetail = () => {
  const { courseId } = useParams();
  const { isPremium } = usePremium();

  const course = useMemo(() => {
    return allCourses.find(c => c.id === courseId);
  }, [courseId]);

  if (!course) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">Curso não encontrado</h1>
        <Button asChild variant="link">
          <RouterLink to="/courses">Voltar para Cursos</RouterLink>
        </Button>
      </div>
    );
  }

  const canWatch = !course.premium || isPremium;
  const hasVideo = !!course.videoUrl;

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Button asChild variant="outline" size="icon">
          <RouterLink to="/courses">
            <ArrowLeft className="h-4 w-4" />
          </RouterLink>
        </Button>
        <div>
          <h1 className="text-4xl font-bold tracking-tighter">{course.title}</h1>
          <p className="text-muted-foreground">Por: {course.instructor}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {canWatch && hasVideo ? (
            <VideoPlayer src={course.videoUrl!} title={course.title} />
          ) : !canWatch ? (
             <div className="aspect-video rounded-2xl overflow-hidden border border-primary/50 shadow-lg shadow-primary/20 flex items-center justify-center bg-secondary/20 flex-col gap-4 p-6 text-center">
              <Lock className="h-12 w-12 text-primary" />
              <h2 className="text-2xl font-bold">Conteúdo Premium</h2>
              <p className="text-muted-foreground">Este curso faz parte da assinatura EDUKIDS+ para desbloquear todo o conteúdo.</p>
              <Button asChild>
                <RouterLink to="/store">Ver Planos de Assinatura</RouterLink>
              </Button>
            </div>
          ) : (
            <div className="aspect-video rounded-2xl overflow-hidden border border-primary/50 shadow-lg shadow-primary/20 flex items-center justify-center bg-secondary/20">
              <div className="text-center p-6">
                <div className="text-xl font-semibold mb-2">Vídeo indisponível</div>
                <div className="text-sm text-muted-foreground">Este curso não possui vídeo. Leia a descrição ao lado para mais detalhes.</div>
              </div>
            </div>
          )}
        </div>
        <div>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Sobre o Curso</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center text-muted-foreground">
                <Clock className="h-4 w-4 mr-2" />
                <span>Duração: {course.duration}</span>
              </div>
              <p className="text-foreground/90">{course.description}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;