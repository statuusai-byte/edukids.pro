import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { AgeProvider } from "./context/AgeContext";
import { ProfileProvider } from "./context/ProfileContext";
import { SupabaseProvider } from "./context/SupabaseContext";
import { PremiumProvider } from "./context/PremiumContext";
import { HintsProvider } from "./context/HintsContext";
import { Sparkles } from "lucide-react";
import ErrorBoundary from "@/components/ErrorBoundary";
import AmbientBackground from "@/components/AmbientBackground";

// Lazy pages/components
const NotFound = lazy(() => import("./pages/NotFound"));
const Layout = lazy(() => import("./components/Layout"));
const Home = lazy(() => import("./pages/Home"));
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

const queryClient = new QueryClient();

const Fallback = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <Sparkles className="h-12 w-12 animate-spin text-primary" />
  </div>
);

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
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/success-payment" element={<SuccessPayment />} />
                        <Route path="/test-account" element={<TestAccount />} />
                        <Route path="/admin/grant-premium" element={<AdminGrantPremium />} />

                        <Route element={<Layout />}>
                          <Route path="/activities" element={<Activities />} />
                          <Route path="/activities/:subject" element={<SubjectPage />} />
                          <Route path="/activities/:subject/:activityId/modules/:moduleId/lessons/:lessonId" element={<LessonPage />} />
                          <Route path="/play-plus" element={<PlayPlus />} />
                          <Route path="/store" element={<Store />} />
                          <Route path="/dashboard" element={<Dashboard />} />
                          <Route path="/settings" element={<Settings />} />
                        </Route>

                        <Route path="*" element={<NotFound />} />
                      </Routes>
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