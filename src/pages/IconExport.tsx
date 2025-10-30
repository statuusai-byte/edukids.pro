"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { showSuccess, showError, showLoading, dismissToast } from "@/utils/toast";

function downloadDataUrl(dataUrl: string, filename: string) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

async function fetchSvg(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Falha ao buscar SVG: " + res.statusText);
  return res.text();
}

export default function IconExport() {
  const [processing, setProcessing] = useState(false);
  const previewRef = useRef<HTMLImageElement | null>(null);

  const exportPng = async (size: number) => {
    setProcessing(true);
    const toastId = showLoading("Gerando PNG...");
    try {
      // Use the 512 svg as base (it scales cleanly)
      const svgText = await fetchSvg("/icons/icon-512.svg");
      // Ensure proper xml header
      const svgWithNs = svgText.trim().startsWith("<svg") ? svgText : `<svg xmlns="http://www.w3.org/2000/svg">${svgText}</svg>`;
      const svgBlob = new Blob([svgWithNs], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);
      const img = new Image();
      // Force crossOrigin to anonymous in case of fonts; same-origin allows it normally
      img.crossOrigin = "anonymous";
      img.src = url;

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Falha ao carregar imagem SVG"));
      });

      // Draw on canvas at requested size
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas não suportado");

      // Clear and draw
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Ensure background is rendered (SVG has it)
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Get PNG data URL
      const dataUrl = canvas.toDataURL("image/png");

      // Trigger download
      downloadDataUrl(dataUrl, `edukids-icon-${size}x${size}.png`);

      // Update preview image (optional)
      if (previewRef.current) {
        previewRef.current.src = dataUrl;
      }

      dismissToast(toastId);
      showSuccess(`PNG ${size}×${size} pronto para download.`);
    } catch (err: any) {
      dismissToast(toastId);
      console.error("Export error:", err);
      showError("Erro ao gerar PNG: " + (err?.message ?? String(err)));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center p-6">
      <Card className="w-full max-w-3xl glass-card p-6">
        <CardHeader>
          <CardTitle>Exportador de Ícone — PNG para Play Store</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <p className="text-sm text-muted-foreground">
            Use esta ferramenta para exportar PNGs otimizados para o Play Console. Clique em um tamanho para gerar e baixar o PNG correspondente.
          </p>

          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-44 h-44 rounded-xl bg-transparent flex items-center justify-center border border-white/10 overflow-hidden">
              <img ref={previewRef} src="/icons/icon-512.svg" alt="Ícone Preview" className="w-full h-full object-contain" />
            </div>

            <div className="flex-1">
              <div className="flex gap-3 flex-wrap">
                <Button onClick={() => exportPng(192)} disabled={processing} className="bg-primary">
                  {processing ? "Processando..." : "Exportar PNG 192×192"}
                </Button>
                <Button onClick={() => exportPng(512)} disabled={processing} className="bg-primary/80">
                  {processing ? "Processando..." : "Exportar PNG 512×512"}
                </Button>
                <Button variant="outline" onClick={() => { window.open("/icons/icon-512.svg", "_blank"); }}>
                  Abrir SVG (nova aba)
                </Button>
              </div>

              <div className="mt-4 text-xs text-muted-foreground">
                Observação: os PNGs são gerados no seu navegador usando o SVG do projeto; faça o download e em seguida suba-os no Play Console.
              </div>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            Precisa de outros tamanhos ou variações (fundo sólido, adaptado para ícone quadrado, etc.)? Diga qual tamanho e eu adapto os assets.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}