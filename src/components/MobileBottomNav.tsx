import { NavLink } from "react-router-dom";
import { Home, BookOpen, LayoutDashboard, ShoppingCart, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const MobileBottomNav = () => {
  const items = [
    { to: "/", icon: <Home className="h-6 w-6" />, label: "Home" },
    { to: "/activities", icon: <BookOpen className="h-6 w-6" />, label: "Atividades" },
    { to: "/dashboard", icon: <LayoutDashboard className="h-6 w-6" />, label: "Painel" },
    { to: "/store", icon: <ShoppingCart className="h-6 w-6" />, label: "Loja" },
    { to: "/settings", icon: <Settings className="h-6 w-6" />, label: "Config." },
  ];

  return (
    <nav className="md:hidden mobile-bottom-nav" role="navigation" aria-label="Navegação inferior">
      {items.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center justify-center gap-1 p-2 rounded-md",
              isActive ? "text-white" : "text-muted-foreground/70"
            )
          }
        >
          {item.icon}
          <span className="text-[11px]">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default MobileBottomNav;