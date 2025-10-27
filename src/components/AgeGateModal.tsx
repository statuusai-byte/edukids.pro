import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAge } from "@/context/AgeContext";
import { Rocket } from "lucide-react";

const ageGroups = [
  { label: "4 a 6 anos", value: "4-6" as const },
  { label: "7 a 9 anos", value: "7-9" as const },
  { label: "10 a 12 anos", value: "10-12" as const },
];

export const AgeGateModal = () => {
  const { ageGroup, setAgeGroup } = useAge();

  const handleSelectAge = (selectedAge: '4-6' | '7-9' | '10-12') => {
    setAgeGroup(selectedAge);
  };

  return (
    <Dialog open={!ageGroup}>
      <DialogContent className="glass-card border-primary/50 sm:max-w-md text-center p-8">
        <DialogHeader>
          <div className="mx-auto mb-4 rounded-full bg-primary/20 p-3 border border-primary/50 w-fit">
            <Rocket className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="text-2xl font-bold tracking-tighter">Bem-vindo ao EDUKIDS+!</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Para começar, selecione a faixa etária da criança. Isso nos ajudará a personalizar a aventura do saber!
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-4 mt-4">
          {ageGroups.map((group) => (
            <Button
              key={group.value}
              onClick={() => handleSelectAge(group.value)}
              size="lg"
              className="w-full text-lg py-6 rounded-full"
            >
              {group.label}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};