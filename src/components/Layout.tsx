import { NavLink, Outlet } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { Icon, type IconName } from "@/components/Icon";
import { cn } from "@/lib/utils";
import { useProfile } from "@/context/ProfileContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/get-initials";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileSidebar from "@/components/MobileSidebar";
import { StudyAssistantProvider } from "@/context/StudyAssistantContext";

type NavItem = {
  to: string;
  icon: IconName;
  label: string;
  color: string;
};

const navItems: NavItem[] = [
  { to: "/activities", icon: "BookOpen", label: "Atividades", color: "text-cyan-400" },
  { to: "/courses", icon: "PlaySquare", label: "Cursos", color: "text-purple-400" },
  { to: "/games", icon: "Gamepad2", label: "Jogos", color: "text-pink-400" }, // New Games Nav Item
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

  return (
    <div className="flex min-h-screen w-full text-foreground">
      {isMobile ? (
        <MobileSidebar />
      ) : (
        <aside className="fixed inset-y-0 left-0 z-20 flex w-24 flex-col items-center border-r border-white/10 bg-secondary/30 backdrop-blur-xl py-6">
          <div className="mb-8 flex items-center justify-center">
            <Sparkles size={34} className="text-primary" />
          </div>

          <nav className="flex flex-1 flex-col items-stretch gap-2 w-full px-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "group flex w-full items-center gap-3 rounded-xl px-3 py-2 transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-primary/10 to-primary/5 ring-1 ring-primary/20"
                      : "hover:bg-white/5"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-lg transition-transform duration-200",
                        isActive ? "scale-105" : "group-hover:scale-105"
                      )}
                    >
                      <Icon
                        name={item.icon}
                        className={cn(
                          "h-6 w-6 transition-colors",
                          isActive ? item.color : "text-muted-foreground group-hover:text-foreground"
                        )}
                      />
                    </div>
                    <span
                      className={cn(
                        "text-sm font-medium truncate",
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

          <div className="mt-auto flex w-full flex-col items-stretch gap-3 px-2">
            <NavLink
              to={settingsItem.to}
              className={({ isActive }) =>
                cn(
                  "group flex w-full items-center gap-3 rounded-xl px-3 py-2 transition-all duration-200",
                  isActive ? "bg-white/5 ring-1 ring-primary/20" : "hover:bg-white/5"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg")}>
                    <Icon
                      name={settingsItem.icon}
                      className={cn(
                        "h-6 w-6 transition-colors",
                        isActive ? settingsItem.color : "text-muted-foreground group-hover:text-foreground"
                      )}
                    />
                  </div>
                  <span
                    className={cn(
                      "text-sm font-medium",
                      isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                    )}
                  >
                    {settingsItem.label}
                  </span>
                </>
              )}
            </NavLink>

            <div className="w-full flex items-center justify-center py-2">
              <Avatar className="h-10 w-10">
                <AvatarImage src={avatarUrl ?? undefined} />
                <AvatarFallback>{getInitials(name ?? "Anônimo")}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </aside>
      )}

      <main className={cn("flex-1", !isMobile && "pl-24")}>
        <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
          <StudyAssistantProvider>
            <Outlet />
          </StudyAssistantProvider>
        </div>
      </main>
    </div>
  );
};

export default Layout;