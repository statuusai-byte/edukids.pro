import { NavLink, Outlet } from "react-router-dom";
import {
  Home,
  BookOpen,
  PlayCircle,
  ShoppingCart,
  LayoutDashboard,
  Settings,
  Sparkles,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Header from "./Header";
import { useAge } from "@/context/AgeContext";
import { AgeGateModal } from "./AgeGateModal";

const navItems = [
  { to: "/", icon: <Home className="h-6 w-6" />, label: "Home" },
  { to: "/activities", icon: <BookOpen className="h-6 w-6" />, label: "Atividades" },
  { to: "/courses", icon: <PlayCircle className="h-6 w-6" />, label: "Cursos" },
  { to: "/store", icon: <ShoppingCart className="h-6 w-6" />, label: "Loja" },
  { to: "/dashboard", icon: <LayoutDashboard className="h-6 w-6" />, label: "Painel dos Pais" },
  { to: "/settings", icon: <Settings className="h-6 w-6" />, label: "Configurações" },
];

const Layout = () => {
  const { isLoading } = useAge();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Sparkles className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <TooltipProvider>
      <AgeGateModal />
      <div className="flex min-h-screen w-full bg-background text-foreground">
        <aside className="fixed inset-y-0 left-0 z-20 flex w-20 flex-col items-center border-r border-white/10 bg-secondary/30 backdrop-blur-xl py-6">
          <div className="mb-10 flex items-center justify-center">
            <Sparkles size={32} className="text-primary" />
          </div>
          <nav className="flex flex-col items-center gap-4 px-2 sm:gap-6">
            {navItems.map((item) => (
              <Tooltip key={item.to}>
                <TooltipTrigger asChild>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `relative flex h-12 w-12 items-center justify-center rounded-full text-muted-foreground transition-all duration-300 hover:text-primary hover:bg-primary/10
                      ${isActive ? "text-primary bg-primary/10 scale-110" : ""}`
                    }
                  >
                    {item.icon}
                    <span className="sr-only">{item.label}</span>
                  </NavLink>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-primary text-primary-foreground">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            ))}
          </nav>
        </aside>
        <div className="flex flex-1 flex-col pl-20">
          <Header />
          <main className="flex-1 p-4 sm:p-6 md:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Layout;