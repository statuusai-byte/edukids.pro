import { NavLink, Link } from "react-router-dom";
import { Sparkles, Menu, Gem, X } from "lucide-react";
import { Icon, type IconName } from "@/components/Icon";
import { cn } from "@/lib/utils";
import { useProfile } from "@/context/ProfileContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/get-initials";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import { usePremium } from "@/context/PremiumContext";

type NavItem = {
  to: string;
  icon: IconName;
  label: string;
  color: string;
};

const navItems: NavItem[] = [
  { to: "/activities", icon: "BookOpen", label: "Atividades", color: "text-cyan-400" },
  { to: "/play-plus", icon: "PlaySquare", label: "Play+", color: "text-purple-400" },
  { to: "/achievements", icon: "Trophy", label: "Medalhas", color: "text-yellow-400" },
  { to: "/store", icon: "Store", label: "Loja", color: "text-green-400" },
  { to: "/dashboard", icon: "User", label: "Pais", color: "text-orange-400" },
];

const settingsItem: NavItem = {
  to: "/settings",
  icon: "Settings",
  label: "Ajustes",
  color: "text-slate-400",
};

const MobileSidebar = () => {
  const { name, avatarUrl } = useProfile();
  const displayName = useMemo(
    () => (name?.trim()?.length ? name : "Explorador EDUKIDS"),
    [name],
  );
  const [isOpen, setIsOpen] = useState(false);
  const { isPremium } = usePremium();

  const handleNavClick = () => setIsOpen(false);

  const avatarInitials = useMemo(() => getInitials(displayName), [displayName]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="default"
          size="icon"
          className="fixed left-4 top-4 z-50 bg-white text-black shadow-md hover:bg-gray-100 md:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-72 overflow-hidden border-r border-white/10 bg-transparent p-0"
      >
        <div
          className="relative flex h-full flex-col bg-gradient-to-br from-[#090720] via-[#170d35] to-[#050312]"
        >
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-16 -left-24 h-48 w-48 rounded-full bg-primary/25 blur-3xl" />
            <div className="absolute top-1/3 -right-20 h-44 w-44 rounded-full bg-fuchsia-500/25 blur-[120px]" />
            <div className="absolute bottom-0 left-[-30px] h-56 w-56 rounded-full bg-cyan-500/20 blur-[110px]" />
          </div>

          <div className="relative flex h-full flex-col px-5 pb-6 pt-6">
            <div className="flex items-start justify-between pb-6">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white/12 p-2">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">EDUKIDS+</p>
                  <p className="text-xs text-white/60">Explorar, aprender e brincar</p>
                </div>
              </div>
              <SheetClose asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full bg-white/10 text-white hover:bg-white/20"
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">Fechar menu</span>
                </Button>
              </SheetClose>
            </div>

            <nav className="flex-1 space-y-2 overflow-y-auto pr-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    cn(
                      "group flex items-center gap-3 rounded-2xl border border-transparent px-3 py-3 transition-all duration-200",
                      isActive
                        ? "border-primary/40 bg-primary/12 shadow-[0_0_30px_rgba(124,58,237,0.35)]"
                        : "bg-white/[0.04] hover:bg-white/[0.09]",
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 transition-transform duration-200",
                          isActive ? "scale-105" : "group-hover:scale-105",
                        )}
                      >
                        <Icon
                          name={item.icon}
                          className={cn(
                            "h-5 w-5 transition-colors",
                            isActive ? item.color : "text-white/65 group-hover:text-white",
                          )}
                        />
                      </div>
                      <span
                        className={cn(
                          "text-sm font-medium transition-colors",
                          isActive ? "text-white" : "text-white/70 group-hover:text-white",
                        )}
                      >
                        {item.label}
                      </span>
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            <div className="mt-6 space-y-4">
              {isPremium ? (
                <div className="rounded-2xl border border-emerald-400/30 bg-gradient-to-br from-emerald-400/[0.25] via-emerald-500/[0.12] to-teal-400/[0.15] p-4 text-sm text-white/85 shadow-[0_10px_45px_rgba(16,185,129,0.25)]">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-emerald-400/25 p-2">
                      <Gem className="h-5 w-5 text-emerald-300" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">Você é Premium 🤩</p>
                      <p className="text-xs text-white/70">Missões e Trilhas completas liberadas, sem anúncios.</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-fuchsia-600 p-4 text-white shadow-[0_20px_58px_rgba(147,51,234,0.28)]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.35),transparent_55%)] opacity-40" />
                  <div className="relative flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-white/20 p-2">
                        <Gem className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-white/80">
                          Exclusivo
                        </h3>
                        <p className="text-base font-semibold text-white">Seja Premium</p>
                      </div>
                    </div>
                    <p className="text-xs text-white/80">
                      Desbloqueie Missões Diárias e Trilhas de Estudo completas, dicas ilimitadas e navegação sem anúncios.
                    </p>
                    <Button
                      asChild
                      size="sm"
                      className="mt-1 w-full rounded-xl bg-white text-primary font-bold hover:bg-white/90"
                      onClick={handleNavClick}
                    >
                      <Link to="/store">Ver planos e vantagens</Link>
                    </Button>
                  </div>
                </div>
              )}

              <NavLink
                to={settingsItem.to}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center gap-3 rounded-2xl border border-transparent px-3 py-3 transition-all duration-200",
                    isActive ? "border-white/20 bg-white/10" : "bg-white/[0.04] hover:bg-white/[0.09]",
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/6">
                      <Icon
                        name={settingsItem.icon}
                        className={cn(
                          "h-5 w-5 transition-colors",
                          isActive ? settingsItem.color : "text-white/65 group-hover:text-white",
                        )}
                      />
                    </div>
                    <span
                      className={cn(
                        "text-sm font-medium",
                        isActive ? "text-white" : "text-white/70 group-hover:text-white",
                      )}
                    >
                      {settingsItem.label}
                    </span>
                  </>
                )}
              </NavLink>

              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 shadow-inner shadow-black/10">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={avatarUrl ?? undefined} />
                  <AvatarFallback>{avatarInitials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-white">{displayName}</p>
                  <p className="text-xs text-white/60">Pronto para descobrir uma nova aventura?</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;