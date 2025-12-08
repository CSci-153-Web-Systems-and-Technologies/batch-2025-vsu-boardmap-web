import { useState, useEffect } from 'react';
import { Toaster } from './components/ui/sooner';
import LoadingScreen from './components/LoadingScreen';
import LandingPage from './components/LandingPage';
import StudentDashboard from './components/StudentDashboard';
import OwnerDashboard from './components/OwnerDashboard';
import { initSampleData } from './utils/api';
import './styles/global.css';

export type User = {
  id: string;
  name: string;
  email: string;
  type: 'student' | 'owner';
  accessToken: string;
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'dashboard'>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if Leaflet is already loaded
    if (window.L) {
      return;
    }

    // Load Leaflet script dynamically
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.onload = () => {
      console.log('Leaflet loaded successfully');
    };
    script.onerror = () => {
      console.error('Failed to load Leaflet');
    };
    document.head.appendChild(script);

    return () => {
      // Don't remove script on cleanup to avoid reloading
      // document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    // Initialize - no sample data needed anymore
    async function initialize() {
      try {
        await initSampleData();
        console.log('App initialized');
      } catch (err) {
        console.error('Error initializing:', err);
      } finally {
        setInitialized(true);
        // Show loading screen briefly
        setTimeout(() => setLoading(false), 800);
      }
    }

    if (!initialized) {
      initialize();
    }
  }, [initialized]);

  const handleLogin = (id: string, name: string, email: string, type: 'student' | 'owner', accessToken: string) => {
    setUser({ id, name, email, type, accessToken });
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('landing');
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Toaster position="top-center" richColors />
      {currentPage === 'landing' && (
        <LandingPage onLogin={handleLogin} />
      )}
      {currentPage === 'dashboard' && user && user.type === 'student' && (
        <StudentDashboard user={user} onLogout={handleLogout} />
      )}
      {currentPage === 'dashboard' && user && user.type === 'owner' && (
        <OwnerDashboard user={user} onLogout={handleLogout} />
      )}
    </>
  );
}