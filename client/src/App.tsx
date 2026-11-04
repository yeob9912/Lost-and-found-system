import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Login from './pages/auth/login.tsx';
import Register from './pages/auth/register.tsx';
import Home from './pages/public/Home.tsx';
import LostItems from './pages/public/LostItems.jsx';
import FoundItems from './pages/public/FoundItems.jsx';
import About from './pages/public/About.tsx';
import Contact from './pages/public/Contact.tsx';
import ReportItem from './pages/public/ReportItem.jsx';

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
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
