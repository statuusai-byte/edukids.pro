import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { AgeProvider } from "./context/AgeContext";
import { ProfileProvider } from "./context/ProfileContext";
import { SupabaseProvider } from "./context/SupabaseContext";
import { PremiumProvider } from "./context/PremiumContext";
import { HintsProvider } from "./context/HintsContext";
import { ThemeProvider } from "./context/ThemeContext";
import { AchievementsProvider } from "./context/AchievementsContext";
import { Sparkles } from "lucide-react";
import ErrorBoundary from "@/components/ErrorBoundary";
import AmbientBackground from "@/components/AmbientBackground";
import RequireAuth from "@/components/RequireAuth";
import GlobalErrorLogger from "@/components/GlobalErrorLogger";
import PwaUpdatePrompt from "@/components/PwaUpdatePrompt";

// Lazy pages/components
const NotFound = lazy(() => import("./pages/NotFound"));
const Layout = lazy(() => import("./components/Layout"));
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
const Home = lazy(() => import("./pages/Home"));

const queryClient = new QueryClient();

const Fallback = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <Sparkles className="h-12 w-12 animate-spin text-primary" />
  </div>
);

const AppRoutes = () => {
  const isDev = import.meta.env.MODE === "development";
  const showAdminRoute = isDev;

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
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

      {/* Rotas públicas que usam o layout principal */}
      <Route element={<Layout />}>
        <Route path="/activities" element={<Activities />} />
        <Route path="/activities/:subject" element={<SubjectPage />} />
        <Route path="/activities/:subject/:activityId/modules/:moduleId/lessons/:lessonId" element={<LessonPage />} />
        <Route path="/play-plus" element={<PlayPlus />} />
        <Route path="/store" element={<Store />} />
      </Route>

      {/* Rotas protegidas que exigem login */}
      <Route
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      >
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
    <ThemeProvider defaultTheme="dark" storageKey="edukids-theme">
      <AmbientBackground>
        <BrowserRouter>
          <SupabaseProvider>
            <AgeProvider>
              <ProfileProvider>
                <PremiumProvider>
                  <HintsProvider>
                    <AchievementsProvider>
                      <SonnerToaster />
                      <GlobalErrorLogger />
                      <PwaUpdatePrompt />
                      <ErrorBoundary>
                        <Suspense fallback={<Fallback />}>
                          <AppRoutes />
                        </Suspense>
                      </ErrorBoundary>
                    </AchievementsProvider>
                  </HintsProvider>
                </PremiumProvider>
              </ProfileProvider>
            </AgeProvider>
          </SupabaseProvider>
        </BrowserRouter>
      </AmbientBackground>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;