import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle, Clock } from "lucide-react";

const courses = [
  { title: "Introdução à Programação", instructor: "Prof. Ada", duration: "2h 30m", gradient: "from-purple-500 to-indigo-500" },
  { title: "A Magia dos Números", instructor: "Prof. Alan", duration: "3h 15m", gradient: "from-cyan-500 to-blue-500" },
  { title: "Desenhando com Formas", instructor: "Prof. Grace", duration: "1h 45m", gradient: "from-pink-500 to-red-500" },
  { title: "Viagem pelo Sistema Solar", instructor: "Prof. Carl", duration: "4h 00m", gradient: "from-yellow-500 to-orange-500" },
];

const Courses = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold tracking-tighter mb-8">Cursos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.title} className="glass-card group overflow-hidden transition-transform duration-300 hover:-translate-y-2">
            <div className={`h-40 flex items-center justify-center bg-gradient-to-br ${course.gradient}`}>
              <PlayCircle className="h-20 w-20 text-white/70 transition-transform duration-300 group-hover:scale-110" />
            </div>
            <CardContent className="p-4">
              <h3 className="font-bold text-xl text-foreground">{course.title}</h3>
              <p className="text-sm text-muted-foreground">Por: {course.instructor}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between items-center">
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                {course.duration}
              </div>
              <Button className="bg-primary hover:bg-primary/90">Assistir</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Courses;