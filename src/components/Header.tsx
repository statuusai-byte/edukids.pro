import { Bell, Lightbulb, Sun, Moon, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { useProfile } from "@/context/ProfileContext";
import { useHintsContext } from "@/context/HintsContext";
import { usePremium } from "@/context/PremiumContext";
import { useTheme } from "@/context/ThemeContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { SheetTrigger } from "@/components/ui/sheet";

const Header = () => {
  const { name, avatarUrl } = useProfile();
  const { hints } = useHintsContext();
  const { isPremium } = usePremium();
  const { theme, setTheme } = useTheme();
  const isMobile = useIsMobile();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-20 items-center justify-between bg-background/80 backdrop-blur-lg px-4 sm:px-6 border-b border-white/10">
      <div className="flex items-center gap-4">
        {isMobile && (
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10">
              <Menu className="h-6 w-6 text-muted-foreground hover:text-primary" />
              <span className="sr-only">Abrir menu</span>
            </Button>
          </SheetTrigger>
        )}
        <h1 className="relative text-3xl font-bold tracking-tighter">
          <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-400 bg-clip-text text-transparent blur-md opacity-75">
            EDUKIDS+
          </span>
          <span className="relative bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-400 bg-clip-text text-transparent">
            EDUKIDS+
          </span>
        </h1>
      </div>
      <div className="flex items-center gap-4">
        
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10" onClick={toggleTheme}>
          {theme === 'dark' ? (
            <Sun className="h-6 w-6 text-yellow-400 hover:text-yellow-300" />
          ) : (
            <Moon className="h-6 w-6 text-slate-600 hover:text-slate-700" />
          )}
          <span className="sr-only">Alternar tema</span>
        </Button>

        <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 hidden sm:inline-flex">
          <Bell className="h-6 w-6 text-muted-foreground hover:text-primary" />
          <span className="sr-only">Notificações</span>
        </Button>

        <Link to="/store" className="flex items-center gap-2 bg-secondary/50 px-3 py-2 rounded-full hover:bg-secondary">
          <Lightbulb className="h-5 w-5 text-yellow-400" />
          <span className="font-bold text-sm">{isPremium ? '∞' : hints}</span>
          <span className="sr-only">Dicas</span>
        </Link>

        <Link to="/settings" className="flex items-center gap-3 cursor-pointer group">
          <span className="text-md font-medium text-muted-foreground hidden sm:inline group-hover:text-primary transition-colors">Olá, {name}!</span>
          <Button variant="ghost" size="icon" className="rounded-full h-12 w-12">
            <Avatar className="h-12 w-12 border-2 border-primary/50 group-hover:border-primary transition-colors">
              <AvatarImage src={avatarUrl ?? undefined} alt="Avatar" />
              <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="sr-only">Abrir configurações</span>
          </Button>
        </Link>
      </div>
    </header>
  );
};

export default Header;