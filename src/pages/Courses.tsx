import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle, Clock } from "lucide-react";

const courses = [
  { 
    title: "Introdução à Programação", 
    instructor: "Prof. Ada", 
    duration: "2h 30m", 
    imageUrl: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2070&auto=format&fit=crop" 
  },
  { 
    title: "A Magia dos Números", 
    instructor: "Prof. Alan", 
    duration: "3h 15m", 
    imageUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=2070&auto=format&fit=crop" 
  },
  { 
    title: "Desenhando com Formas", 
    instructor: "Prof. Grace", 
    duration: "1h 45m", 
    imageUrl: "https://images.unsplash.com/photo-1588864721034-4c4b8c13dc32?q=80&w=2070&auto=format&fit=crop" 
  },
  { 
    title: "Viagem pelo Sistema Solar", 
    instructor: "Prof. Carl", 
    duration: "4h 00m", 
    imageUrl: "https://images.unsplash.com/photo-1614726365902-79a8e383d11d?q=80&w=2070&auto=format&fit=crop" 
  },
];

const Courses = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold tracking-tighter mb-8">Cursos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {courses.map((course) => (
          <Card key={course.title} className="glass-card group overflow-hidden transition-transform duration-300 hover:-translate-y-2">
            <div className="relative h-40">
              <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <PlayCircle className="h-20 w-20 text-white/70" />
              </div>
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