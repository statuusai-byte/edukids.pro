import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Atom, Languages, Calculator, Palette, Music, Landmark, Globe, SpellCheck, Code, Bot, PiggyBank } from "lucide-react";
import { useAge } from "@/context/AgeContext";
import { useMemo } from "react";
import { Link } from "react-router-dom";

const allSubjects = [
  { name: "Matemática", icon: <Calculator className="h-12 w-12 text-cyan-400" />, color: "cyan", ageGroups: ['4-6', '7-9', '10-12'] },
  { name: "Ciências", icon: <Atom className="h-12 w-12 text-green-400" />, color: "green", ageGroups: ['7-9', '10-12'] },
  { name: "Português", icon: <Languages className="h-12 w-12 text-purple-400" />, color: "purple", ageGroups: ['4-6', '7-9', '10-12'] },
  { name: "História", icon: <Landmark className="h-12 w-12 text-orange-400" />, color: "orange", ageGroups: ['7-9', '10-12'] },
  { name: "Geografia", icon: <Globe className="h-12 w-12 text-teal-400" />, color: "teal", ageGroups: ['7-9', '10-12'] },
  { name: "Inglês", icon: <SpellCheck className="h-12 w-12 text-indigo-400" />, color: "indigo", ageGroups: ['7-9', '10-12'] },
  { name: "Lógica", icon: <Brain className="h-12 w-12 text-yellow-400" />, color: "yellow", ageGroups: ['4-6', '7-9', '10-12'] },
  { name: "Artes", icon: <Palette className="h-12 w-12 text-red-400" />, color: "red", ageGroups: ['4-6', '7-9'] },
  { name: "Música", icon: <Music className="h-12 w-12 text-pink-400" />, color: "pink", ageGroups: ['4-6', '7-9'] },
  { name: "Programação", icon: <Code className="h-12 w-12 text-slate-400" />, color: "slate", ageGroups: ['10-12'] },
  { name: "Robótica", icon: <Bot className="h-12 w-12 text-rose-400" />, color: "rose", ageGroups: ['10-12'] },
  { name: "Finanças", icon: <PiggyBank className="h-12 w-12 text-lime-400" />, color: "lime", ageGroups: ['10-12'] },
];

const Activities = () => {
  const { ageGroup } = useAge();

  const subjects = useMemo(() => {
    if (!ageGroup) return [];
    return allSubjects.filter(subject => subject.ageGroups.includes(ageGroup));
  }, [ageGroup]);

  return (
    <div>
      <h1 className="text-4xl font-bold tracking-tighter mb-8">Atividades</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {subjects.map((subject) => (
          <Link to={`/activities/${subject.name.toLowerCase()}`} key={subject.name}>
            <Card className="glass-card group hover:border-primary/80 transition-all duration-300 cursor-pointer overflow-hidden h-full">
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
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Activities;