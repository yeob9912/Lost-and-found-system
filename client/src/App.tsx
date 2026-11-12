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

// Role-Based Security Guards
import AdminGuard from './components/admin/AdminGuard.tsx';
import StudentGuard from './components/student/StudentGuard.tsx';
import GuestOnlyRoute from './components/common/GuestOnlyRoute.tsx';

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
          {/* Landing / Public pages: Logged-in admin is redirected directly to /admin, students and guests see the page */}
          <Route path="/" element={<GuestOnlyRoute allowStudent><Home /></GuestOnlyRoute>} />
          <Route path="/lost-items" element={<GuestOnlyRoute allowStudent><LostItems /></GuestOnlyRoute>} />
          <Route path="/found-items" element={<GuestOnlyRoute allowStudent><FoundItems /></GuestOnlyRoute>} />
          <Route path="/about" element={<GuestOnlyRoute allowStudent><About /></GuestOnlyRoute>} />
          <Route path="/contact" element={<GuestOnlyRoute allowStudent><Contact /></GuestOnlyRoute>} />
          <Route path="/registration" element={<GuestOnlyRoute><AuthPage initialView="signup" /></GuestOnlyRoute>} />
          <Route path="/signup" element={<GuestOnlyRoute><AuthPage initialView="signup" /></GuestOnlyRoute>} />
          <Route path="/login" element={<GuestOnlyRoute><AuthPage initialView="login" /></GuestOnlyRoute>} />
          
          {/* Protected Student Routes - Strict Role-Based Access Control */}
          <Route path="/profile" element={<StudentGuard><Profile /></StudentGuard>} />
          <Route path="/student/profile" element={<StudentGuard><Profile /></StudentGuard>} />
          <Route path="/my-claims" element={<StudentGuard><MyClaims /></StudentGuard>} />
          <Route path="/student/my-claims" element={<StudentGuard><MyClaims /></StudentGuard>} />
          <Route path="/my-reports" element={<StudentGuard><MyReports /></StudentGuard>} />
          <Route path="/student/my-reports" element={<StudentGuard><MyReports /></StudentGuard>} />
          <Route path="/notifications" element={<Navigate to="/" replace />} />
          <Route path="/student/notifications" element={<Navigate to="/" replace />} />
          <Route path="/claim" element={<StudentGuard><ClaimForm /></StudentGuard>} />
          <Route path="/claim-form" element={<StudentGuard><ClaimForm /></StudentGuard>} />
          <Route path="/report-item" element={<StudentGuard><ReportItem /></StudentGuard>} />

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
