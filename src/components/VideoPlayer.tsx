import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

function toEmbedUrl(raw: string): { embed: string; external: string } {
  try {
    const url = new URL(raw);
    let videoId: string | null = null;
    let embedUrl: string | null = null;
    let externalUrl: string | null = null;

    // Handle YouTube URLs
    if (url.hostname.includes("youtube.com") || url.hostname === "youtu.be") {
      if (url.hostname === "youtu.be") {
        videoId = url.pathname.replace("/", "");
      } else if (url.searchParams.has("v")) {
        videoId = url.searchParams.get("v");
      } else if (url.pathname.startsWith("/embed/")) {
        videoId = url.pathname.split("/").pop() ?? null;
      }

      if (videoId) {
        // Use a simpler embed URL, removing rel=0 and modestbranding=1 for broader compatibility
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
        externalUrl = `https://www.youtube.com/watch?v=${videoId}`;
      }
    }
    // Handle Vimeo URLs
    else if (url.hostname.includes("vimeo.com")) {
      const parts = url.pathname.split("/").filter(Boolean);
      const id = parts[0];
      if (id && /^\d+$/.test(id)) {
        embedUrl = `https://player.vimeo.com/video/${id}`;
        externalUrl = `https://vimeo.com/${id}`;
      }
    }

    // If we successfully parsed an embeddable URL, use it.
    if (embedUrl && externalUrl) {
      return { embed: embedUrl, external: externalUrl };
    }

    // Fallback for unrecognized or unparseable URLs
    return { embed: raw, external: raw };
  } catch {
    // If URL parsing fails, return raw URLs
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
          key={embed} // Add key to force re-render on src change
          width="100%"
          height="100%"
          src={embed}
          title={title ?? "Video"}
          // Removed referrerPolicy and loading="lazy" for broader compatibility
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
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