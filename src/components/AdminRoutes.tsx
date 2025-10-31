import { lazy } from "react";
import { Route } from "react-router-dom";
import { useSupabase } from "@/context/SupabaseContext";

const AdminGrantPremium = lazy(() => import("@/pages/AdminGrantPremium"));

const ADMIN_EMAILS = ["statuus.ai@gmail.com", "eduki.teste@gmail.com"];

export default function AdminRoutes() {
  const { user, isLoading } = useSupabase();

  // treat dev mode as allowed so you can test locally even if not logged as admin
  const isDev = import.meta.env.MODE === "development" || process.env.NODE_ENV === "development";

  if (isLoading) return null;

  const email = user?.email?.toLowerCase();
  const isAdmin = !!email && ADMIN_EMAILS.includes(email);

  if (!isDev && !isAdmin) return null;

  // Return the Route so it only appears when allowed
  return <Route path="/admin/grant-premium" element={<AdminGrantPremium />} />;
}