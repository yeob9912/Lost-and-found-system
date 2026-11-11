import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login.tsx';
import Register from './pages/auth/Register.tsx';
import Home from './pages/public/Home.tsx';
import LostItems from './pages/public/LostItems.jsx';
import FoundItems from './pages/public/FoundItems.jsx';
import About from './pages/public/About.tsx';
import Contact from './pages/public/Contact.tsx';
import ReportItem from './pages/public/ReportItem.jsx';
import Profile from './pages/student/Profile.tsx';
import MyClaims from './pages/student/MyClaims.tsx';
import MyReports from './pages/student/MyReports.tsx';
import ClaimForm from './components/claims/ClaimForm.tsx';

// Theme Context
import { ThemeProvider } from './context/ThemeContext.tsx';
import PlexusBackground from './components/common/PlexusBackground.tsx';

// Admin Security Guard
import AdminGuard from './components/admin/AdminGuard.tsx';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard.tsx';
import ManageUsers from './pages/admin/ManageUsers.tsx';
import ManageLostItems from './pages/admin/ManageLostItems.tsx';
import ManageFoundItems from './pages/admin/ManageFoundItems.tsx';
import ManageClaims from './pages/admin/ManageClaims.tsx';
import ManageCategories from './pages/admin/ManageCategories.tsx';
import ManageLocations from './pages/admin/ManageLocations.tsx';
import AbuseReports from './pages/admin/AbuseReports.tsx';
import ActivityLogs from './pages/admin/ActivityLogs.tsx';
import AdminProfile from './pages/admin/AdminProfile.tsx';

function AuthPage({ initialView }: { initialView: 'login' | 'signup' }) {
  const navigate = useNavigate();

  return initialView === 'login' ? (
    <Login onSwitchToSignup={() => navigate('/registration')} />
  ) : (
    <Register onSwitchToLogin={() => navigate('/login')} />
  );
}

function App() {
  return (
    <ThemeProvider>
      <PlexusBackground />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lost-items" element={<LostItems />} />
          <Route path="/found-items" element={<FoundItems />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/report-item" element={<ReportItem />} />
          <Route path="/registration" element={<AuthPage initialView="signup" />} />
          <Route path="/signup" element={<AuthPage initialView="signup" />} />
          <Route path="/login" element={<AuthPage initialView="login" />} />
          
          {/* Student Dashboard & Activity Routes */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/student/profile" element={<Profile />} />
          <Route path="/my-claims" element={<MyClaims />} />
          <Route path="/student/my-claims" element={<MyClaims />} />
          <Route path="/my-reports" element={<MyReports />} />
          <Route path="/student/my-reports" element={<MyReports />} />
          <Route path="/notifications" element={<Navigate to="/" replace />} />
          <Route path="/student/notifications" element={<Navigate to="/" replace />} />
          <Route path="/claim" element={<ClaimForm />} />
          <Route path="/claim-form" element={<ClaimForm />} />

          {/* Protected Admin Routes - Strict Role-Based Access Control */}
          <Route path="/admin" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
          <Route path="/admin/users" element={<AdminGuard><ManageUsers /></AdminGuard>} />
          <Route path="/admin/lost-items" element={<AdminGuard><ManageLostItems /></AdminGuard>} />
          <Route path="/admin/found-items" element={<AdminGuard><ManageFoundItems /></AdminGuard>} />
          <Route path="/admin/claims" element={<AdminGuard><ManageClaims /></AdminGuard>} />
          <Route path="/admin/categories" element={<AdminGuard><ManageCategories /></AdminGuard>} />
          <Route path="/admin/locations" element={<AdminGuard><ManageLocations /></AdminGuard>} />
          <Route path="/admin/abuse-reports" element={<AdminGuard><AbuseReports /></AdminGuard>} />
          <Route path="/admin/activity-logs" element={<AdminGuard><ActivityLogs /></AdminGuard>} />
          <Route path="/admin/profile" element={<AdminGuard><AdminProfile /></AdminGuard>} />
          <Route path="/admin/notifications" element={<Navigate to="/admin" replace />} />

          <Route path="*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
