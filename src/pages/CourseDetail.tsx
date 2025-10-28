import { useParams, Link as RouterLink } from "react-router-dom";
import { allCourses } from "@/data/coursesData";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CourseDetail = () => {
  const { courseId } = useParams();

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
          <div className="aspect-video rounded-2xl overflow-hidden border border-primary/50 shadow-lg shadow-primary/20">
            <iframe
              width="100%"
              height="100%"
              src={course.videoUrl}
              title="YouTube video player"
              frameBorder="0"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
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