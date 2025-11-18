import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { SupabaseProvider } from '@/context/SupabaseContext';
import { ProfileProvider } from '@/context/ProfileContext';
import { AgeProvider } from '@/context/AgeContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { PremiumProvider } from '@/context/PremiumContext';
import { HintsProvider } from '@/context/HintsContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import GlobalErrorLogger from '@/components/GlobalErrorLogger';

import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Activities from '@/pages/Activities';
import SubjectPage from '@/pages/SubjectPage';
import LessonPage from '@/pages/LessonPage';
import Dashboard from '@/pages/Dashboard';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';
import Store from '@/pages/Store';
import AchievementsPage from '@/pages/Achievements';
import PlayPlus from '@/pages/PlayPlus';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import SuccessPayment from '@/pages/SuccessPayment';

const App = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Router>
          <SupabaseProvider>
            <ProfileProvider>
              <AgeProvider>
                <PremiumProvider>
                  <HintsProvider>
                    <Routes>
                      {/* Rotas independentes que NÃO usam o Layout principal */}
                      <Route path="/" element={<Home />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />

                      {/* Rotas do aplicativo que USAM o Layout principal */}
                      <Route element={<Layout />}>
                        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                        <Route path="/success-payment" element={<SuccessPayment />} />

                        <Route element={<ProtectedRoute />}>
                          <Route path="/activities" element={<Activities />} />
                          <Route path="/activities/:subject" element={<SubjectPage />} />
                          <Route path="/activities/:subject/:activityId/modules/:moduleId/lessons/:lessonId" element={<LessonPage />} />
                          <Route path="/dashboard" element={<Dashboard />} />
                          <Route path="/settings" element={<Settings />} />
                          <Route path="/store" element={<Store />} />
                          <Route path="/achievements" element={<AchievementsPage />} />
                          <Route path="/play-plus" element={<PlayPlus />} />
                        </Route>

                        <Route path="*" element={<NotFound />} />
                      </Route>
                    </Routes>
                    <Toaster richColors />
                    <GlobalErrorLogger />
                  </HintsProvider>
                </PremiumProvider>
              </AgeProvider>
            </ProfileProvider>
          </SupabaseProvider>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;