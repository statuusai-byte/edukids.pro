import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Atom, Languages, Calculator, Palette, Music } from "lucide-react";

const subjects = [
  { name: "Matemática", icon: <Calculator className="h-12 w-12 text-cyan-400" />, color: "cyan" },
  { name: "Ciências", icon: <Atom className="h-12 w-12 text-green-400" />, color: "green" },
  { name: "Linguagens", icon: <Languages className="h-12 w-12 text-purple-400" />, color: "purple" },
  { name: "Lógica", icon: <Brain className="h-12 w-12 text-yellow-400" />, color: "yellow" },
  { name: "Artes", icon: <Palette className="h-12 w-12 text-red-400" />, color: "red" },
  { name: "Música", icon: <Music className="h-12 w-12 text-pink-400" />, color: "pink" },
];

const Activities = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold tracking-tighter mb-8">Atividades</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => (
          <Card key={subject.name} className="glass-card group hover:border-primary/80 transition-all duration-300 cursor-pointer overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold">{subject.name}</CardTitle>
              <div className="p-3 bg-secondary rounded-full transition-transform duration-300 group-hover:scale-110">
                {subject.icon}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Explore desafios e jogos divertidos.</p>
              <div className={`h-1 w-10 bg-${subject.color}-400 rounded-full mt-4 transition-all duration-300 group-hover:w-20`}></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Activities;