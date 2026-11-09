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
import Notifications from './pages/student/Notifications.tsx';
import ClaimForm from './components/claims/ClaimForm.tsx';

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
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/student/notifications" element={<Notifications />} />
        <Route path="/claim" element={<ClaimForm />} />
        <Route path="/claim-form" element={<ClaimForm />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<ManageUsers />} />
        <Route path="/admin/lost-items" element={<ManageLostItems />} />
        <Route path="/admin/found-items" element={<ManageFoundItems />} />
        <Route path="/admin/claims" element={<ManageClaims />} />
        <Route path="/admin/categories" element={<ManageCategories />} />
        <Route path="/admin/locations" element={<ManageLocations />} />
        <Route path="/admin/abuse-reports" element={<AbuseReports />} />
        <Route path="/admin/activity-logs" element={<ActivityLogs />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
        <Route path="/admin/notifications" element={<Navigate to="/admin" replace />} />

        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
