import { CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity } from "@/data/activitiesData";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { TiltCard } from "./TiltCard";
import { Icon } from "./Icon";
import { useMemo } from "react";

interface ActivityCardProps {
  activity: Activity;
  subjectSlug: string;
}

export const ActivityCard = ({ activity, subjectSlug }: ActivityCardProps) => {
  const iconClass = "h-8 w-8 text-primary";

  const firstLessonPath = useMemo(() => {
    const firstModule = activity.modules && activity.modules.length > 0 ? activity.modules[0] : undefined;
    const firstLesson = firstModule?.lessons && firstModule.lessons.length > 0 ? firstModule.lessons[0] : undefined;
    if (firstModule && firstLesson) {
      return `/activities/${subjectSlug}/${activity.id}/modules/${firstModule.id}/lessons/${firstLesson.id}`;
    }
    // fallback para a página da atividade
    return `/activities/${subjectSlug}/${activity.id}`;
  }, [activity, subjectSlug]);

  return (
    <TiltCard className="flex flex-col h-full p-6 text-center items-center group">
      <div className="mb-4 bg-primary/20 p-4 rounded-full border border-primary/50 transition-transform duration-300 group-hover:scale-110">
        <Icon name={activity.icon} className={iconClass} />
      </div>
      <CardTitle className="text-xl font-bold">{activity.title}</CardTitle>
      <p className="text-muted-foreground text-sm mt-2 flex-grow">{activity.description}</p>

      <div className="w-full mt-4 space-y-2">
        {/* Botão primário: vai direto para a primeira lição quando possível */}
        <Button asChild className="w-full">
          <Link to={firstLessonPath}>
            {activity.modules && activity.modules.length > 0 && activity.modules[0].lessons && activity.modules[0].lessons.length > 0
              ? "Começar Agora"
              : "Ver Atividade"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>

        {/* Link secundário para ver a pasta/modulos (navegação completa) */}
        <div className="text-sm text-muted-foreground mt-2">
          <Link to={`/activities/${subjectSlug}/${activity.id}`} className="underline hover:text-primary">
            Ver Pasta e Módulos
          </Link>
        </div>
      </div>
    </TiltCard>
  );
};