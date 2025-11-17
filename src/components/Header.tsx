import { Bell, Settings, User, Gem, Lightbulb, Sun, Moon, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  // const { signOut } = useSupabase(); // Removido
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
          // Mobile Menu Trigger (SheetTrigger must be wrapped in Sheet in MobileSidebar)
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10">
              <Menu className="h-6 w-6 text-muted-foreground hover:text-primary" />
              <span className="sr-only">Abrir menu</span>
            </Button>
          </SheetTrigger>
        )}
        <h1 className="text-3xl font-bold tracking-tighter bg-gradient-to-r from-primary via-fuchsia-500 to-orange-400 text-transparent bg-clip-text">
          EDUKIDS+
        </h1>
      </div>
      <div className="flex items-center gap-4">
        
        {/* Theme Toggle Button - Always visible on the right */}
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 cursor-pointer">
              <span className="text-md font-medium text-muted-foreground hidden sm:inline">Olá, {name}!</span>
              <Button variant="ghost" size="icon" className="rounded-full h-12 w-12">
                <Avatar className="h-12 w-12 border-2 border-primary/50">
                  <AvatarImage src={avatarUrl ?? undefined} alt="Avatar" />
                  <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="sr-only">Menu do Usuário</span>
              </Button>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-secondary border-white/10 w-56">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem asChild>
              <Link to="/settings"><User className="mr-2 h-4 w-4" /> Perfil</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/store"><Gem className="mr-2 h-4 w-4" /> Assinatura e Dicas</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings"><Settings className="mr-2 h-4 w-4" /> Configurações</Link>
            </DropdownMenuItem>
            {/* <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" /> Sair
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;