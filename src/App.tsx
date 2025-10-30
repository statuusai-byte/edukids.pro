import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Activities from "./pages/Activities";
import Courses from "./pages/Courses";
import Store from "./pages/Store";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import { ProfileProvider } from "./context/ProfileContext";
import { ParentAuthProvider } from "./context/ParentAuthContext";
import ParentDashboard from "./pages/ParentDashboard";

function App() {
  return (
    <ProfileProvider>
      <ParentAuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Activities />} />
              <Route path="activities" element={<Activities />} />
              <Route path="courses" element={<Courses />} />
              <Route path="store" element={<Store />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="settings" element={<Settings />} />
              <Route path="parents" element={<ParentDashboard />} />
            </Route>
          </Routes>
        </Router>
      </ParentAuthProvider>
    </ProfileProvider>
  );
}

export default App;