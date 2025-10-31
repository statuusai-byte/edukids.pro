import { NavLink } from "react-router-dom";
import { Sparkles, Menu } from "lucide-react";
import { Icon, type IconName } from "@/components/Icon";
import { cn } from "@/lib/utils";
import { useProfile } from "@/context/ProfileContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/get-initials";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useState } from "react";

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
  { to: "/dashboard", icon: "User", label: "Painel dos Pais", color: "text-orange-400" },
];

const settingsItem: NavItem = {
  to: "/settings",
  icon: "Settings",
  label: "Ajustes",
  color: "text-slate-400",
};

const MobileSidebar = () => {
  const { name, avatarUrl } = useProfile();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="default" // Changed from 'ghost'
          size="icon" 
          className="fixed top-4 left-4 z-50 md:hidden bg-white text-black shadow-md hover:bg-gray-100" // Added bg-white, text-black, shadow-md
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 bg-secondary/95 backdrop-blur-lg border-r border-white/10 p-4 flex flex-col">
        <div className="mb-8 flex items-center justify-center">
          <Sparkles size={34} className="text-primary" />
        </div>

        <nav className="flex flex-1 flex-col items-stretch gap-2 w-full px-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setIsOpen(false)} // Close sheet on navigation
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
            onClick={() => setIsOpen(false)} // Close sheet on navigation
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
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;