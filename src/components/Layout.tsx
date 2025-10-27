import { NavLink, Outlet } from "react-router-dom";
import {
  Home,
  BookOpen,
  PlayCircle,
  ShoppingCart,
  LayoutDashboard,
  Settings,
  Bot,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import Header from "./Header";

const navItems = [
  { to: "/", icon: <Home size={24} />, label: "Home" },
  { to: "/activities", icon: <BookOpen size={24} />, label: "Atividades" },
  { to: "/courses", icon: <PlayCircle size={24} />, label: "Cursos" },
  { to: "/store", icon: <ShoppingCart size={24} />, label: "Loja" },
  { to: "/dashboard", icon: <LayoutDashboard size={24} />, label: "Painel dos Pais" },
  { to: "/settings", icon: <Settings size={24} />, label: "Configurações" },
];

const Layout = () => {
  return (
    <div className="flex min-h-screen w-full bg-gray-100 dark:bg-gray-900">
      <aside className="fixed inset-y-0 left-0 z-10 flex w-20 flex-col items-center border-r bg-white py-6 dark:bg-gray-950 sm:w-24">
        <div className="mb-8 flex items-center justify-center">
          <Bot size={32} className="text-blue-600" />
        </div>
        <nav className="flex flex-col items-center gap-4 px-2 sm:gap-5">
          {navItems.map((item) => (
            <Tooltip key={item.to}>
              <TooltipTrigger asChild>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex h-12 w-12 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-blue-100 hover:text-blue-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white ${
                      isActive ? "bg-blue-100 text-blue-600 dark:bg-gray-800 dark:text-white" : ""
                    }`
                  }
                >
                  {item.icon}
                  <span className="sr-only">{item.label}</span>
                </NavLink>
              </TooltipTrigger>
              <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          ))}
        </nav>
      </aside>
      <div className="flex flex-1 flex-col sm:pl-24 pl-20">
        <Header />
        <main className="flex-1 p-4 sm:p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;