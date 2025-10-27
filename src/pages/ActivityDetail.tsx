import { useParams, Link as RouterLink, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { subjectsData } from "@/data/activitiesData";
import { useAge } from "@/context/AgeContext";
import { ActivityCard } from "@/components/ActivityCard";

const ActivityDetail = () => {
  const { subject: subjectSlug } = useParams();
  const { ageGroup } = useAge();

  const subject = subjectsData.find(s => s.slug === subjectSlug);

  if (!subject) {
    return <Navigate to="/activities" replace />;
  }

  // Filtra as atividades diretamente para garantir que a lista está sempre atualizada.
  const filteredActivities = ageGroup
    ? subject.activities.filter(activity => activity.ageGroups.includes(ageGroup))
    : [];

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Button asChild variant="outline" size="icon">
          <RouterLink to="/activities">
            <ArrowLeft className="h-4 w-4" />
          </RouterLink>
        </Button>
        <h1 className="text-4xl font-bold tracking-tighter">Atividades de {subject.name}</h1>
      </div>
      
      {filteredActivities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map(activity => (
            <ActivityCard key={activity.id} activity={activity} subjectSlug={subject.slug} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 glass-card rounded-lg">
          <h2 className="text-2xl font-bold">Nenhuma atividade encontrada!</h2>
          <p className="text-muted-foreground mt-2">
            Não há atividades de {subject.name} para esta faixa etária no momento.
          </p>
        </div>
      )}
    </div>
  );
};

export default ActivityDetail;