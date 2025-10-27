import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Atom, Languages, Calculator, Palette, Music } from "lucide-react";

const subjects = [
  { name: "Matemática", icon: <Calculator className="h-12 w-12 text-blue-500" /> },
  { name: "Ciências", icon: <Atom className="h-12 w-12 text-green-500" /> },
  { name: "Linguagens", icon: <Languages className="h-12 w-12 text-purple-500" /> },
  { name: "Lógica", icon: <Brain className="h-12 w-12 text-yellow-500" /> },
  { name: "Artes", icon: <Palette className="h-12 w-12 text-red-500" /> },
  { name: "Música", icon: <Music className="h-12 w-12 text-pink-500" /> },
];

const Activities = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Atividades</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => (
          <Card key={subject.name} className="hover:shadow-lg hover:-translate-y-1 transition-transform duration-300 cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold">{subject.name}</CardTitle>
              {subject.icon}
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Explore desafios e jogos divertidos.</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Activities;