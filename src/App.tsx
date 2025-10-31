"use client";

import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Suspense, lazy } from "react";
import { AgeProvider } from "./context/AgeContext";
import { ProfileProvider } from "./context/ProfileContext";
import { SupabaseProvider } from "./context/SupabaseContext";
import { PremiumProvider } from "./context/PremiumContext";
import { HintsProvider } from "./context/HintsContext";
import { Sparkles } from "lucide-react";
import ErrorBoundary from "@/components/ErrorBoundary";
import { AnimatePresence } from "framer-motion";
import Layout from "./components/Layout"; // Importa o Layout diretamente

// Lazy pages/components
const NotFound = lazy(() => import("./pages/NotFound"));
const IndexPage = lazy(() => import("./pages/Index")); // Root presentation page
const Activities = lazy(() => import("./pages/Activities"));
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
const IconExport = lazy(() => import("./pages/IconExport"));
const Games = lazy(() => import("./pages/Games")); // New page: Games

const queryClient = new QueryClient();

const Fallback = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <Sparkles className="h-12 w-12 animate-spin text-primary" />
  </div>
);

const AppRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Root presentation page */}
        <Route path="/" element={<IndexPage />} />

        {/* Top-level routes that should not be wrapped by the main Layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/success-payment" element={<SuccessPayment />} />
        <Route path="/test-account" element={<TestAccount />} />
        <Route path="/admin/grant-premium" element={<AdminGrantPremium />} />
        <Route path="/icon-export" element={<IconExport />} />

        {/* All other routes use the main Layout */}
        <Route element={<Layout />}>
          <Route path="/activities" element={<Activities />} />
          <Route path="/activities/:subject" element={<SubjectPage />} />
          <Route path="/activities/:subject/:activityId/modules/:moduleId/lessons/:lessonId" element={<LessonPage />} />
          <Route path="/store" element={<Store />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/games" element={<Games />} /> {/* New Games Route */}
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <SupabaseProvider>
        <AgeProvider>
          <ProfileProvider>
            <PremiumProvider>
              <HintsProvider>
                {/* Sonner Toaster (used by sonner toast utility) */}
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
  </QueryClientProvider>
);

export default App;