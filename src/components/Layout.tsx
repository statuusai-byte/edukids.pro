import { Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileSidebar from "@/components/MobileSidebar";
import MobileTabBar from "@/components/MobileTabBar";
import StudyAssistant from "@/components/StudyAssistant";
import AgeGateModal from "@/components/AgeGateModal";
import { useInterstitialAdManager } from "@/hooks/useInterstitialAdManager";
import Header from "@/components/Header";
import { Sheet } from "@/components/ui/sheet";

const Layout = () => {
  const isMobile = useIsMobile();
  
  useInterstitialAdManager();

  // Calculate padding to offset the fixed Header (h-20 = 5rem) and MobileTabBar (h-20 approx)
  const shellStyle = {
    paddingTop: "calc(env(safe-area-inset-top, 0px) + 5rem)",
    paddingBottom: isMobile ? "calc(env(safe-area-inset-bottom, 0px) + 5rem)" : "0",
    minHeight: "100vh",
  };

  return (
    <Sheet>
      <div className="flex flex-1 w-full text-foreground">
        <Header />

        {isMobile && (
          <>
            <MobileSidebar />
            <MobileTabBar />
          </>
        )}

        <main
          className={cn("flex-1 overflow-x-hidden w-full")}
          style={shellStyle}
        >
          <div
            className={cn(
              "mx-auto w-full max-w-7xl",
              isMobile ? "px-4" : "py-10 md:py-12 px-6"
            )}
          >
            <div
              className={cn(
                "relative rounded-2xl bg-secondary/70 shadow-xl shadow-black/30",
                "md:rounded-3xl md:border md:border-white/10 md:bg-secondary/60 md:shadow-[0_25px_120px_rgba(76,29,149,0.35)] md:backdrop-blur-2xl",
                "md:overflow-hidden"
              )}
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),transparent_65%)]" />
              <div className="pointer-events-none absolute -top-32 left-6 hidden h-64 w-64 rounded-full bg-primary/25 blur-[110px] md:block" />
              <div className="pointer-events-none absolute bottom-[-20%] right-[-12%] hidden h-60 w-60 rounded-full bg-pink-500/20 blur-[110px] md:block" />
              <div
                className={cn(
                  "relative z-10",
                  isMobile ? "px-6 py-8 sm:px-8 sm:py-10" : "px-6 py-8 sm:px-8 sm:py-10 md:px-14 md:py-14"
                )}
              >
                <Outlet />
                <AgeGateModal />
              </div>
            </div>
          </div>

          {/* Footer com link para Política de Privacidade */}
          <footer className="mx-auto w-full max-w-7xl px-6 py-6 text-center text-xs text-muted-foreground">
            <a href="/privacy-policy" className="underline hover:text-foreground">
              Política de Privacidade
            </a>
          </footer>
        </main>

        <StudyAssistant />
      </div>
    </Sheet>
  );
};

export default Layout;