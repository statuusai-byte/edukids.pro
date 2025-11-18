import { Link, useLocation } from "react-router-dom";
import { Icon, type IconName } from "@/components/Icon";
import { cn } from "@/lib/utils";

type TabItem = {
  to: string;
  icon: IconName;
  label: string;
  color: string;
};

const tabs: TabItem[] = [
  { to: "/activities", icon: "BookOpen", label: "Atividades", color: "text-cyan-400" },
  { to: "/play-plus", icon: "PlaySquare", label: "Play+", color: "text-purple-400" },
  { to: "/achievements", icon: "Trophy", label: "Medalhas", color: "text-yellow-400" },
  { to: "/store", icon: "Store", label: "Loja", color: "text-green-400" },
  { to: "/dashboard", icon: "User", label: "Painel dos Pais", color: "text-orange-400" },
];

const isActivePath = (pathname: string, target: string) => {
  if (target === "/dashboard") return pathname.startsWith("/dashboard");
  if (target === "/play-plus") return pathname.startsWith("/play-plus");
  if (target === "/activities") return pathname.startsWith("/activities");
  if (target === "/store") return pathname.startsWith("/store");
  if (target === "/achievements") return pathname.startsWith("/achievements");
  return pathname === target;
};

const MobileTabBar = () => {
  const location = useLocation();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 block border-t border-white/10 bg-secondary/90 backdrop-blur-xl md:hidden">
      <div 
        className="mx-auto flex max-w-2xl items-center justify-around px-4 pt-2"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 0.5rem)" }}
      >
        {tabs.map((item) => {
          const active = isActivePath(location.pathname, item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "group flex flex-col items-center justify-center gap-1 rounded-2xl px-3 py-2 text-xs transition-all w-20",
                active
                  ? "bg-primary/15"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon
                name={item.icon}
                className={cn(
                  "h-5 w-5 transition-transform",
                  active ? `scale-110 ${item.color}` : "scale-100 text-muted-foreground group-hover:text-foreground",
                )}
              />
              <span className={cn("font-medium", active ? item.color : "text-muted-foreground group-hover:text-foreground")}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileTabBar;