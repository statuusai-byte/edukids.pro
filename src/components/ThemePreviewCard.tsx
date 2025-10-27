import { cn } from "@/lib/utils";
import { Check, Palette } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const themes = [
  { id: 'nebula', name: 'Nébula', gradient: 'from-purple-500 to-indigo-600' },
  { id: 'cosmos', name: 'Cosmos', gradient: 'from-blue-400 to-cyan-500' },
  { id: 'selva', name: 'Selva', gradient: 'from-lime-400 to-green-600' },
  { id: 'oceano', name: 'Oceano', gradient: 'from-cyan-400 to-teal-500' },
] as const;

interface ThemePreviewCardProps {
  isPremium: boolean;
}

export const ThemePreviewCard = ({ isPremium }: ThemePreviewCardProps) => {
  const { theme, setTheme } = useTheme();

  return (
    <Card className="glass-card p-4">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-primary" /> Temas Visuais
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {themes.map((t) => (
          <div key={t.id} className="text-center">
            <button
              onClick={() => isPremium && setTheme(t.id)}
              disabled={!isPremium}
              className={cn(
                "w-full h-20 rounded-lg bg-gradient-to-br relative flex items-center justify-center transition-all",
                t.gradient,
                theme === t.id && "ring-2 ring-offset-2 ring-offset-background ring-primary",
                !isPremium && "opacity-50 cursor-not-allowed"
              )}
            >
              {theme === t.id && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                  <Check className="h-8 w-8 text-white" />
                </div>
              )}
            </button>
            <p className="mt-2 text-sm font-medium">{t.name}</p>
          </div>
        ))}
      </CardContent>
      {!isPremium && (
        <p className="text-center text-sm text-red-400 mt-4">
          Assine o Premium para desbloquear e aplicar todos os temas.
        </p>
      )}
    </Card>
  );
};