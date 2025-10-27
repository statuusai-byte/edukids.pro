import { useParams, Link as RouterLink } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const ActivityDetail = () => {
  const { subject } = useParams();
  const subjectName = subject ? subject.charAt(0).toUpperCase() + subject.slice(1) : "Atividade";

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Button asChild variant="outline" size="icon">
          <RouterLink to="/activities">
            <ArrowLeft className="h-4 w-4" />
          </RouterLink>
        </Button>
        <h1 className="text-4xl font-bold tracking-tighter">Atividades de {subjectName}</h1>
      </div>
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Em Breve!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Estamos preparando atividades incríveis de {subjectName} para você. Volte em breve para conferir as novidades!
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityDetail;