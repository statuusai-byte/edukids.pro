import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle, Clock } from "lucide-react";
import { useAge } from "@/context/AgeContext";
import { useMemo } from "react";

const allCourses = [
  { 
    title: "Inglês para Crianças", 
    instructor: "Teacher Liza", 
    duration: "3h 45m", 
    imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop",
    ageGroups: ['4-6', '7-9', '10-12']
  },
  { 
    title: "Violão para Iniciantes", 
    instructor: "Maestro Léo", 
    duration: "4h 20m", 
    imageUrl: "https://images.unsplash.com/photo-1558020245-70c1a53218a9?q=80&w=2070&auto=format&fit=crop",
    ageGroups: ['7-9', '10-12']
  },
  { 
    title: "Espanhol Divertido", 
    instructor: "Profe Sofia", 
    duration: "3h 10m", 
    imageUrl: "https://images.unsplash.com/photo-1534790566855-4cb788d389ec?q=80&w=2070&auto=format&fit=crop",
    ageGroups: ['7-9', '10-12']
  },
  { 
    title: "Desenho e Pintura Digital", 
    instructor: "Artista Gabi", 
    duration: "5h 00m", 
    imageUrl: "https://images.unsplash.com/photo-1589150306321-458c3d39c37a?q=80&w=1974&auto=format&fit=crop",
    ageGroups: ['7-9', '10-12']
  },
  {
    title: "Pequenos Cientistas",
    instructor: "Dr. Elara",
    duration: "2h 15m",
    imageUrl: "https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=2080&auto=format&fit=crop",
    ageGroups: ['4-6', '7-9']
  },
  {
    title: "Robótica com LEGO",
    instructor: "Eng. Rick",
    duration: "6h 30m",
    imageUrl: "https://images.unsplash.com/photo-1678922619217-061b7a23b0e1?q=80&w=2070&auto=format&fit=crop",
    ageGroups: ['10-12']
  },
  {
    title: "Teclado Mágico",
    instructor: "Maestra Ana",
    duration: "4h 00m",
    imageUrl: "https://images.unsplash.com/photo-1612021459339-39989c23165a?q=80&w=2070&auto=format&fit=crop",
    ageGroups: ['4-6', '7-9', '10-12']
  }
];

const Courses = () => {
  const { ageGroup } = useAge();

  const courses = useMemo(() => {
    if (!ageGroup) return [];
    return allCourses.filter(course => course.ageGroups.includes(ageGroup));
  }, [ageGroup]);

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