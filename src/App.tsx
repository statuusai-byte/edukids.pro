import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { AgeProvider } from "./context/AgeContext";
import { ProfileProvider } from "./context/ProfileContext";
import { SupabaseProvider } from "./context/SupabaseContext";
import { PremiumProvider } from "./context/PremiumContext";
import { HintsProvider } from "./context/HintsContext";
import { Sparkles } from "lucide-react";
import ErrorBoundary from "@/components/ErrorBoundary";
import AmbientBackground from "@/components/AmbientBackground";
import RequireAuth from "@/components/RequireAuth";

// Lazy pages/components
const NotFound = lazy(() => import("./pages/NotFound"));
const Layout = lazy(() => import("./components/Layout"));
const Index = lazy(() => import("./pages/Index"));
const Activities = lazy(() => import("./pages/Activities"));
const PlayPlus = lazy(() => import("./pages/PlayPlus"));
const Store = lazy(() => import("./pages/Store"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Settings = lazy(() => import("./pages/Settings"));
const SubjectPage = lazy(() => import("./pages/SubjectPage"));
const LessonPage = lazy(() => import("./pages/LessonPage"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const SuccessPayment = lazy(() => import("./pages/SuccessPayment"));
const TestAccount = lazy(() => import("./pages/TestAccount"));
const AdminGrantPremium = lazy(() => import("./pages/AdminGrantPremium"));
const AchievementsPage = lazy(() => import("./pages/Achievements"));

const queryClient = new QueryClient();

const Fallback = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <Sparkles className="h-12 w-12 animate-spin text-primary" />
  </div>
);

const AppRoutes = () => {
  // Nota: a checagem de auth e redireção inicial acontece no componente Index e em RequireAuth
  const isDev = import.meta.env.MODE === "development";
  const showAdminRoute = isDev; // Admin protegido por RequireAuth; link só visível para contas admin

  return (
    <Routes>
      {/* Landing decide entre /login (sem sessão) e /activities (com sessão) */}
      <Route path="/" element={<Index />} />

      {/* Páginas públicas de autenticação */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Página de confirmação de pagamento (livre) e conta de teste */}
      <Route path="/success-payment" element={<SuccessPayment />} />
      <Route path="/test-account" element={<TestAccount />} />

      {showAdminRoute && (
        <Route
          path="/admin/grant-premium"
          element={
            <RequireAuth>
              <AdminGrantPremium />
            </RequireAuth>
          }
        />
      )}

      {/* Alias antigo */}
      <Route path="/courses/*" element={<Navigate to="/play-plus" replace />} />

      {/* App protegido por autenticação */}
      <Route
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      >
        <Route path="activities">
          <Route index element={<Activities />} />
          <Route path=":subject" element={<SubjectPage />} />
          <Route path=":subject/:activityId/modules/:moduleId/lessons/:lessonId" element={<LessonPage />} />
        </Route>

        <Route path="/play-plus" element={<PlayPlus />} />
        <Route path="/store" element={<Store />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/achievements" element={<AchievementsPage />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AmbientBackground>
      <BrowserRouter>
        <SupabaseProvider>
          <AgeProvider>
            <ProfileProvider>
              <PremiumProvider>
                <HintsProvider>
                  <SonnerToaster />
                  <ErrorBoundary>
                    <Suspense fallback={<Fallback />}>
                      <AppRoutes />
                    </Suspense>
                  </ErrorBoundary>
                </HintsProvider>
              </PremiumProvider>
            </ProfileProvider>
          </AgeProvider>
        </SupabaseProvider>
      </BrowserRouter>
    </AmbientBackground>
  </QueryClientProvider>
);

export default App;