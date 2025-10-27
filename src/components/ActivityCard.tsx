import { CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity } from "@/data/activitiesData";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { TiltCard } from "./TiltCard";

interface ActivityCardProps {
  activity: Activity;
  subjectSlug: string;
}

export const ActivityCard = ({ activity, subjectSlug }: ActivityCardProps) => {
  return (
    <TiltCard className="flex flex-col h-full p-6 text-center items-center group">
      <div className="mb-4 bg-primary/20 p-4 rounded-full border border-primary/50 transition-transform duration-300 group-hover:scale-110">
        {activity.icon}
      </div>
      <CardTitle className="text-xl font-bold">{activity.title}</CardTitle>
      <p className="text-muted-foreground text-sm mt-2 flex-grow">{activity.description}</p>
      <Button asChild className="w-full mt-4">
        <Link to={`/activities/${subjectSlug}/${activity.id}`}>
          Começar <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </TiltCard>
  );
};