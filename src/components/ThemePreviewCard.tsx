import { cn } from "@/lib/utils";
import { Check, Palette, Gem } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePremium } from "@/context/PremiumContext"; // Importar usePremium

const themes = [
  { id: 'nebula', name: 'Nébula (Padrão)', gradient: 'from-purple-500 to-indigo-600' },
  { id: 'espaco', name: 'Espaço (Premium)', gradient: 'from-orange-500 to-red-600' },
] as const;

export const ThemePreviewCard = () => {
  const { theme, setTheme } = useTheme();
  const { isPremium } = usePremium(); // Usar o status real

  return (
    <Card className="glass-card p-4">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-primary" /> Temas Visuais
          {!isPremium && <Gem className="h-4 w-4 text-yellow-400 ml-2" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        {themes.map((t) => (
          <div key={t.id} className="text-center">
            <button
              onClick={() => {
                if (t.id === 'nebula') {
                  setTheme('nebula');
                } else if (isPremium) {
                  setTheme('espaco');
                }
              }}
              disabled={t.id === 'espaco' && !isPremium}
              className={cn(
                "w-full h-20 rounded-lg bg-gradient-to-br relative flex items-center justify-center transition-all",
                t.gradient,
                theme === t.id && "ring-2 ring-offset-2 ring-offset-background ring-primary",
                t.id === 'espaco' && !isPremium && "opacity-50 cursor-not-allowed"
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
          Assine o Premium para desbloquear e aplicar o tema Espaço.
        </p>
      )}
    </Card>
  );
};