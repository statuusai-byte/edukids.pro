import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Activities from "./pages/Activities";
import Courses from "./pages/Courses";
import Store from "./pages/Store";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import { AgeProvider } from "./context/AgeContext";
import ActivityDetail from "./pages/ActivityDetail";
import ActivityContentPage from "./pages/ActivityContentPage";
import CourseDetail from "./pages/CourseDetail";
import LessonPage from "./pages/LessonPage";
import { ProfileProvider } from "./context/ProfileContext";
import { SupabaseProvider } from "./context/SupabaseContext";
import { PremiumProvider } from "./context/PremiumContext";
import SuccessPayment from "./pages/SuccessPayment";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <SupabaseProvider>
        <AgeProvider>
          <ProfileProvider>
            <PremiumProvider>
              <Toaster />
              <Sonner />
              <Routes>
                {/* Rota de Login removida */}
                <Route path="/success-payment" element={<SuccessPayment />} />
                <Route element={<Layout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/activities" element={<Activities />} />
                  <Route path="/activities/:subject" element={<ActivityDetail />} />
                  <Route path="/activities/:subject/:activityId" element={<ActivityContentPage />} />
                  <Route path="/activities/:subject/:activityId/modules/:moduleId/lessons/:lessonId" element={<LessonPage />} />
                  <Route path="/courses" element={<Courses />} />
                  <Route path="/courses/:courseId" element={<CourseDetail />} />
                  <Route path="/store" element={<Store />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/settings" element={<Settings />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </PremiumProvider>
          </ProfileProvider>
        </AgeProvider>
      </SupabaseProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;