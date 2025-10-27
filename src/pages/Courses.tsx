import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle, Clock, ArrowRight } from "lucide-react";
import { useAge } from "@/context/AgeContext";
import { useMemo } from "react";
import { allCourses } from "@/data/coursesData";
import { Link } from "react-router-dom";

const Courses = () => {
  const { ageGroup } = useAge();

  const courses = useMemo(() => {
    if (!ageGroup) return [];
    return allCourses.filter(course => course.ageGroups.includes(ageGroup));
  }, [ageGroup]);

  return (
    <div>
      <h1 className="text-4xl font-bold tracking-tighter mb-8">Cursos</h1>
      {courses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map((course) => (
            <Link to={`/courses/${course.id}`} key={course.id} className="group">
              <Card className="glass-card h-full flex flex-col overflow-hidden transition-transform duration-300 hover:-translate-y-2">
                <div className="relative h-40">
                  <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <PlayCircle className="h-20 w-20 text-white/70" />
                  </div>
                </div>
                <CardContent className="p-4 flex-grow">
                  <h3 className="font-bold text-xl text-foreground">{course.title}</h3>
                  <p className="text-sm text-muted-foreground">Por: {course.instructor}</p>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between items-center">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    {course.duration}
                  </div>
                  <Button variant="link" className="p-0 h-auto text-primary">
                    Assistir <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 glass-card rounded-lg">
          <h2 className="text-2xl font-bold">Nenhum curso encontrado!</h2>
          <p className="text-muted-foreground mt-2">
            Não há cursos disponíveis para esta faixa etária no momento. Tente selecionar outra faixa etária nas configurações.
          </p>
        </div>
      )}
    </div>
  );
};

export default Courses;