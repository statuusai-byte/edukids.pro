import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";

const courses = [
  { title: "Introdução à Programação", instructor: "Prof. Ada", duration: "2h 30m" },
  { title: "A Magia dos Números", instructor: "Prof. Alan", duration: "3h 15m" },
  { title: "Desenhando com Formas", instructor: "Prof. Grace", duration: "1h 45m" },
  { title: "Viagem pelo Sistema Solar", instructor: "Prof. Carl", duration: "4h 00m" },
];

const Courses = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Cursos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.title} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="bg-gray-200 h-40 flex items-center justify-center">
              <PlayCircle className="h-16 w-16 text-gray-400" />
            </div>
            <CardContent className="p-4">
              <h3 className="font-bold text-lg">{course.title}</h3>
              <p className="text-sm text-muted-foreground">Por: {course.instructor}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{course.duration}</span>
              <Button>Assistir</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Courses;