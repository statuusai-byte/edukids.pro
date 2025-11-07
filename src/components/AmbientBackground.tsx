import { ReactNode } from "react";

type AmbientBackgroundProps = {
  children: ReactNode;
};

const AmbientBackground = ({ children }: AmbientBackgroundProps) => {
  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-[#050312] text-foreground">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-64 left-1/2 h-[60rem] w-[60rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(124,58,237,0.28)_0%,_rgba(37,99,235,0.05)_55%,_transparent_70%)] blur-3xl" />
        <div className="absolute bottom-[-40%] left-[-20%] h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle,_rgba(236,72,153,0.25)_0%,_transparent_70%)] blur-[120px]" />
        <div className="absolute right-[-25%] top-[15%] h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,_rgba(45,212,191,0.2)_0%,_transparent_70%)] blur-[110px]" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,_transparent_1px)] opacity-[0.18]" style={{ backgroundSize: "32px 32px" }} />
      </div>

      <div className="relative z-10 flex min-h-[100dvh] flex-col">{children}</div>
    </div>
  );
};

export default AmbientBackground;