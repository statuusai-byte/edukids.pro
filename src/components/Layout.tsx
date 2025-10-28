import { NavLink, Outlet, useLocation, Navigate } from "react-router-dom";
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
import AgeGateModal from "./AgeGateModal";
import { AnimatePresence } from "framer-motion";
import PageTransition from "./PageTransition";
import { playSound } from "@/utils/sound";
import { useSupabase } from "@/context/SupabaseContext";
import InterstitialAdManager from "./InterstitialAdManager";

const navItems = [
  { to: "/", icon: <Home className="h-6 w-6" />, label: "Home" },
  { to: "/activities", icon: <BookOpen className="h-6 w-6" />, label: "Atividades" },
  { to: "/courses", icon: <PlayCircle className="h-6 w-6" />, label: "Cursos" },
  { to: "/store", icon: <ShoppingCart className="h-6 w-6" />, label: "Loja" },
  { to: "/dashboard", icon: <LayoutDashboard className="h-6 w-6" />, label: "Painel dos Pais" },
  { to: "/settings", icon: <Settings className="h-6 w-6" />, label: "Configurações" },
];

const Layout = () => {
  const { isLoading: isAgeLoading } = useAge();
  const { isLoading: isAuthLoading } = useSupabase(); // Mantemos o hook para o Header, mas removemos a lógica de proteção
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isLoginPage = location.pathname === '/login';

  // Removendo a lógica de proteção de rotas.
  // const protectedRoutes = navItems.map(item => item.to).filter(path => path !== '/');

  if (isAgeLoading || isAuthLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Sparkles className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // REMOVIDO: Redirecionamento se a rota for protegida e o usuário não estiver logado
  // if (!user && protectedRoutes.includes(location.pathname) && !isLoginPage) {
  //   return <Navigate to="/login" replace />;
  // }

  // Se estiver na home, não mostra o layout completo (Header/Sidebar)
  if (isHomePage) {
    return (
      <AnimatePresence mode="wait">
        <PageTransition key={location.pathname}>
          <Outlet />
        </PageTransition>
      </AnimatePresence>
    );
  }

  return (
    <TooltipProvider>
      <AgeGateModal />
      <div className="flex min-h-screen w-full text-foreground">
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
                    onClick={() => playSound('navigate')}
                    className={({ isActive }) =>
                      `flex h-12 w-12 items-center justify-center rounded-2xl text-primary transition-all duration-300 hover:bg-primary/10 hover:scale-110
                      ${isActive ? "bg-primary text-primary-foreground scale-110 shadow-lg shadow-primary/50" : ""}`
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
        <div className="flex flex-1 flex-col pl-20 main-container relative">
          <Header />
          <main className={`flex-1 p-4 sm:p-6 md:p-8`}>
            <InterstitialAdManager>
              <AnimatePresence mode="wait">
                <PageTransition key={location.pathname}>
                  <Outlet />
                </PageTransition>
              </AnimatePresence>
            </InterstitialAdManager>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Layout;