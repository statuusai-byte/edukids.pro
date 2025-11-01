import { ReactNode } from "react";
import { useSupabase } from "@/context/SupabaseContext";
import { Navigate } from "react-router-dom";
import { Sparkles } from "lucide-react";

const RequireAuth = ({ children }: { children: ReactNode }) => {
  const { user, isLoading } = useSupabase();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Sparkles className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default RequireAuth;