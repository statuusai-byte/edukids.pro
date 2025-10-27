import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity } from "@/data/activitiesData";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface ActivityCardProps {
  activity: Activity;
  subjectSlug: string;
}

export const ActivityCard = ({ activity, subjectSlug }: ActivityCardProps) => {
  return (
    <Card className="glass-card flex flex-col h-full">
      <CardHeader className="flex-row gap-4 items-center">
        <div className="bg-primary/20 p-3 rounded-full border border-primary/50">
          {activity.icon}
        </div>
        <div>
          <CardTitle>{activity.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground">{activity.description}</p>
      </CardContent>
      <div className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link to={`/activities/${subjectSlug}/${activity.id}`}>
            Começar <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </Card>
  );
};