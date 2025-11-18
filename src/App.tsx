import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import { AuthProvider } from './context/AuthContext';
import { ProfileProvider } from './context/ProfileContext';
import { AgeProvider } from './context/AgeContext';
import { ScreenTimeProvider } from './context/ScreenTimeContext';

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Activities from './pages/Activities';
import ActivityDetail from './pages/ActivityDetail';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import About from './pages/About';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ProfileProvider>
          <AgeProvider>
            <ScreenTimeProvider>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/about" element={<About />} />
                  
                  <Route element={<ProtectedRoute />}>
                    <Route path="/activities" element={<Activities />} />
                    <Route path="/activities/:subjectSlug" element={<ActivityDetail />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/settings" element={<Settings />} />
                  </Route>

                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </ScreenTimeProvider>
          </AgeProvider>
        </ProfileProvider>
      </AuthProvider>
      <Toaster />
    </Router>
  );
}

export default App;