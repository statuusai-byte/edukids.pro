import { cn } from "@/lib/utils";
import { Zap } from "lucide-react";

interface AdBannerProps {
  adUnitId: string;
  className?: string;
}

// Este é um componente placeholder. Em um aplicativo nativo/híbrido,
// a integração real do AdMob seria feita aqui usando um SDK ou plugin.
const AdBanner = ({ adUnitId, className }: AdBannerProps) => {
  // ID de exemplo: substitua por seu ID real do AdMob/AdSense
  const displayId = adUnitId || "ca-app-pub-XXXXX/YYYYY"; 

  return (
    <div className={cn(
      "w-full h-16 flex items-center justify-center bg-secondary/50 border border-white/10 rounded-lg shadow-lg text-muted-foreground text-sm overflow-hidden",
      className
    )}>
      <div className="flex items-center gap-2">
        <Zap className="h-4 w-4 text-yellow-400" />
        <span className="font-semibold text-yellow-400">Anúncio Patrocinado</span>
        <span className="hidden sm:inline"> | ID: {displayId}</span>
      </div>
    </div>
  );
};

export default AdBanner;