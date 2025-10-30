import { NavLink, Outlet } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { Icon, type IconName } from "@/components/Icon";
import { cn } from "@/lib/utils";
import { useProfile } from "@/context/ProfileContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/get-initials";

type NavItem = {
  to: string;
  icon: IconName;
  label: string;
  color: string;
};

const navItems: NavItem[] = [
  { to: "/activities", icon: "BookOpen", label: "Atividades", color: "text-cyan-400" },
  { to: "/courses", icon: "PlaySquare", label: "Cursos", color: "text-purple-400" },
  { to: "/store", icon: "Store", label: "Loja", color: "text-green-400" },
  { to: "/dashboard", icon: "User", label: "Perfil", color: "text-orange-400" },
];

const settingsItem: NavItem = {
  to: "/settings",
  icon: "Settings",
  label: "Ajustes",
  color: "text-slate-400",
};

const Layout = () => {
  const { name, avatarUrl } = useProfile();

  return (
    <div className="flex min-h-screen w-full text-foreground">
      <aside className="fixed inset-y-0 left-0 z-20 flex w-20 flex-col items-center border-r border-white/10 bg-secondary/30 backdrop-blur-xl py-6">
        <div className="mb-10 flex items-center justify-center">
          <Sparkles size={32} className="text-primary" />
        </div>
        <nav className="flex flex-1 flex-col items-center gap-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className="group flex w-full flex-col items-center gap-1 rounded-lg p-2 text-muted-foreground transition-colors hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {({ isActive }) => (
                <>
                  <Icon
                    name={item.icon}
                    className={cn(
                      "h-6 w-6 transition-transform duration-300 group-hover:scale-110",
                      isActive ? item.color : "text-muted-foreground group-hover:text-foreground"
                    )}
                  />
                  <span
                    className={cn(
                      "text-xs font-medium",
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

        <div className="mt-auto flex flex-col items-center gap-4">
          <NavLink
            to={settingsItem.to}
            className="group flex w-full flex-col items-center gap-1 rounded-lg p-2 text-muted-foreground transition-colors hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {({ isActive }) => (
              <>
                <Icon
                  name={settingsItem.icon}
                  className={cn(
                    "h-6 w-6 transition-transform duration-300 group-hover:scale-110",
                    isActive ? settingsItem.color : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
                <span
                  className={cn(
                    "text-xs font-medium",
                    isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                  )}
                >
                  {settingsItem.label}
                </span>
              </>
            )}
          </NavLink>
          <Avatar>
            <AvatarImage src={avatarUrl ?? undefined} />
            <AvatarFallback>{getInitials(name ?? "Anônimo")}</AvatarFallback>
          </Avatar>
        </div>
      </aside>
      <main className="flex-1 pl-20">
        <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;