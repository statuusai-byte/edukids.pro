import { NavLink, Outlet } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { Icon, type IconName } from "@/components/Icon";
import { cn } from "@/lib/utils";
import { useProfile } from "@/context/ProfileContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/get-initials";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileSidebar from "@/components/MobileSidebar";
import MobileTabBar from "@/components/MobileTabBar";
import StudyAssistant from "@/components/StudyAssistant";
import AgeGateModal from "@/components/AgeGateModal";
import { useInterstitialAdManager } from "@/hooks/useInterstitialAdManager";

type NavItem = {
  to: string;
  icon: IconName;
  label: string;
  color: string;
};

const navItems: NavItem[] = [
  { to: "/activities", icon: "BookOpen", label: "Atividades", color: "text-cyan-400" },
  { to: "/play-plus", icon: "PlaySquare", label: "Play+", color: "text-purple-400" },
  { to: "/achievements", icon: "Trophy", label: "Medalhas", color: "text-yellow-400" },
  { to: "/store", icon: "Store", label: "Loja", color: "text-green-400" },
  { to: "/dashboard", icon: "User", label: "Painel dos Pais", color: "text-orange-400" },
];

const settingsItem: NavItem = {
  to: "/settings",
  icon: "Settings",
  label: "Ajustes",
  color: "text-slate-400",
};

const Layout = () => {
  const { name, avatarUrl } = useProfile();
  const isMobile = useIsMobile();
  
  useInterstitialAdManager();

  const mobileShellStyle = isMobile
    ? {
        paddingTop: "env(safe-area-inset-top, 1rem)",
        paddingBottom: "calc(env(safe-area-inset-bottom, 1rem) + 5rem)",
        paddingLeft: "env(safe-area-inset-left, 1rem)",
        paddingRight: "env(safe-area-inset-right, 1rem)",
      }
    : undefined;

  return (
    <div className="flex flex-1 w-full text-foreground">
      {isMobile ? (
        <>
          <MobileSidebar />
          <MobileTabBar />
        </>
      ) : (
        <aside className="group fixed inset-y-0 left-0 z-20 hidden w-24 flex-col items-center border-r border-white/10 bg-secondary/30 backdrop-blur-xl py-6 transition-all duration-300 hover:w-64 md:flex">
          <div className="mb-8 flex items-center justify-center">
            <Sparkles size={34} className="text-primary" />
          </div>

          <nav className="flex flex-1 flex-col items-stretch gap-2 w-full px-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "flex w-full items-center gap-4 rounded-xl p-3 transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-primary/10 to-primary/5 ring-1 ring-primary/20"
                      : "hover:bg-white/5"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      name={item.icon}
                      className={cn(
                        "h-6 w-6 transition-colors",
                        isActive ? item.color : "text-muted-foreground group-hover:text-foreground"
                      )}
                    />
                    <span
                      className={cn(
                        "text-sm font-medium truncate opacity-0 transition-opacity duration-200 group-hover:opacity-100",
                        isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                      )}
                    >
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto flex w-full flex-col items-stretch gap-3 px-4">
            <NavLink
              to={settingsItem.to}
              className={({ isActive }) =>
                cn(
                  "flex w-full items-center gap-4 rounded-xl p-3 transition-all duration-200",
                  isActive ? "bg-white/5 ring-1 ring-primary/20" : "hover:bg-white/5"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    name={settingsItem.icon}
                    className={cn(
                      "h-6 w-6 transition-colors",
                      isActive ? settingsItem.color : "text-muted-foreground group-hover:text-foreground"
                    )}
                  />
                  <span
                    className={cn(
                      "text-sm font-medium truncate opacity-0 transition-opacity duration-200 group-hover:opacity-100",
                      isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                    )}
                  >
                    {settingsItem.label}
                  </span>
                </>
              )}
            </NavLink>

            <div className="w-full flex items-center gap-4 p-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={avatarUrl ?? undefined} />
                <AvatarFallback>{getInitials(name ?? "Anônimo")}</AvatarFallback>
              </Avatar>
              <div className="truncate opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <p className="text-sm font-semibold truncate">{name}</p>
                <p className="text-xs text-muted-foreground truncate">Explorador</p>
              </div>
            </div>
          </div>
        </aside>
      )}

      <main
        className={cn("flex-1 overflow-x-hidden", !isMobile && "md:pl-24")}
        style={mobileShellStyle}
      >
        <div
          className={cn(
            "mx-auto w-full max-w-7xl",
            isMobile ? "" : "py-10 md:py-12"
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
                isMobile ? "px-4 pt-16 pb-24" : "px-6 py-8 sm:px-8 sm:py-10 md:px-14 md:py-14"
              )}
            >
              <Outlet />
              <AgeGateModal />
            </div>
          </div>
        </div>
      </main>

      <StudyAssistant />
    </div>
  );
};

export default Layout;