import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

function toEmbedUrl(raw: string): { embed: string; external: string } {
  try {
    const url = new URL(raw);

    // YouTube
    if (url.hostname.includes("youtube.com")) {
      // watch?v=ID -> embed/ID
      const v = url.searchParams.get("v");
      if (v) {
        const embed = `https://www.youtube.com/embed/${v}?rel=0&modestbranding=1`;
        return { embed, external: `https://www.youtube.com/watch?v=${v}` };
      }
      // already embed or other formats
      if (url.pathname.startsWith("/embed/")) {
        const embed = `${url.origin}${url.pathname}${url.search || ""}`;
        // Try to extract id for external
        const id = url.pathname.split("/").pop() ?? "";
        return { embed, external: `https://www.youtube.com/watch?v=${id}` };
      }
    }

    if (url.hostname === "youtu.be") {
      const id = url.pathname.replace("/", "");
      const embed = `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`;
      return { embed, external: `https://www.youtube.com/watch?v=${id}` };
    }

    // Vimeo
    if (url.hostname.includes("vimeo.com")) {
      // vimeo.com/ID -> player.vimeo.com/video/ID
      const parts = url.pathname.split("/").filter(Boolean);
      const id = parts[0];
      if (id && /^\d+$/.test(id)) {
        const embed = `https://player.vimeo.com/video/${id}`;
        return { embed, external: `https://vimeo.com/${id}` };
      }
    }

    // Default: return raw as embed and external the same
    return { embed: raw, external: raw };
  } catch {
    return { embed: raw, external: raw };
  }
}

interface VideoPlayerProps {
  src: string;
  title?: string;
  className?: string;
}

export default function VideoPlayer({ src, title, className }: VideoPlayerProps) {
  const { embed, external } = toEmbedUrl(src);

  return (
    <div className={cn("w-full", className)}>
      <div className="relative aspect-video rounded-2xl overflow-hidden border border-primary/50 shadow-lg shadow-primary/20">
        <iframe
          width="100%"
          height="100%"
          src={embed}
          title={title ?? "Video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          loading="lazy"
          allowFullScreen
        />
        <div className="absolute bottom-3 right-3">
          <Button
            size="sm"
            variant="secondary"
            className="bg-black/50 text-white hover:bg-black/70"
            onClick={() => window.open(external, "_blank", "noopener,noreferrer")}
          >
            Abrir no YouTube <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="mt-2 text-xs text-muted-foreground">
        Se o vídeo não carregar, clique em “Abrir no YouTube”.
      </div>
    </div>
  );
}