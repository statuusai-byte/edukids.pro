import { useAge } from "@/context/AgeContext";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { subjectsData } from "@/data/activitiesData";
import { TiltCard } from "@/components/TiltCard";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const Activities = () => {
  const { ageGroup } = useAge();

  const subjects = useMemo(() => {
    if (!ageGroup) return [];
    return subjectsData.filter(subject => subject.ageGroups.includes(ageGroup));
  }, [ageGroup]);

  return (
    <div>
      <h1 className="text-4xl font-bold tracking-tighter mb-8">Atividades</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {subjects.map((subject) => (
          <Link to={`/activities/${subject.slug}`} key={subject.slug} className="group">
            <TiltCard>
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
            </TiltCard>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Activities;