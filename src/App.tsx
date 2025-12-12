import { useState, useEffect } from "react";
import { Toaster } from "./components/ui/sooner";
import LoadingScreen from "./components/LoadingScreen";
import LandingPage from "./components/LandingPage";
import StudentDashboard from "./components/StudentDashboard";
import OwnerDashboard from "./components/OwnerDashboard";
import { createClient } from "./utils/supabase/client"; // Import your Supabase client

export type User = {
  id: string;
  name: string;
  email: string;
  type: "student" | "owner";
  accessToken: string;
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<"landing" | "dashboard">(
    "landing"
  );
  const [user, setUser] = useState<User | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if Leaflet is already loaded
    if (window.L) {
      return;
    }

    // Load Leaflet script dynamically
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.async = true;
    script.onload = () => {
      console.log("Leaflet loaded successfully");
    };
    script.onerror = () => {
      console.error("Failed to load Leaflet");
    };
    document.head.appendChild(script);

    return () => {
      // Don't remove script on cleanup to avoid reloading
      // document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    async function initialize() {
      try {
        // Just initialize without sample data
        console.log("App initialized");
      } catch (err) {
        console.error("Error initializing:", err);
      } finally {
        setInitialized(true);
        setTimeout(() => setLoading(false), 800);
      }
    }

    if (!initialized) {
      initialize();
    }
  }, [initialized]);

  // Add auth state listener to handle session changes
  useEffect(() => {
    const supabase = createClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);

      if (event === "SIGNED_IN" && session) {
        const userData = {
          id: session.user.id,
          name:
            session.user.user_metadata?.name ||
            session.user.email?.split("@")[0] ||
            "User",
          email: session.user.email!,
          type:
            (session.user.user_metadata?.type as "student" | "owner") ||
            "student",
          accessToken: session.access_token,
        };

        setUser(userData);
        setCurrentPage("dashboard");
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setCurrentPage("landing");
      } else if (event === "TOKEN_REFRESHED" && session) {
        // Update access token if refreshed
        setUser((prev) =>
          prev ? { ...prev, accessToken: session.access_token } : null
        );
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = (
    id: string,
    name: string,
    email: string,
    type: "student" | "owner",
    accessToken: string
  ) => {
    setUser({ id, name, email, type, accessToken });
    setCurrentPage("dashboard");
  };

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setUser(null);
      setCurrentPage("landing");
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Toaster position="top-center" richColors />
      {currentPage === "landing" && <LandingPage onLogin={handleLogin} />}
      {currentPage === "dashboard" && user && user.type === "student" && (
        <StudentDashboard user={user} onLogout={handleLogout} />
      )}
      {currentPage === "dashboard" && user && user.type === "owner" && (
        <OwnerDashboard user={user} onLogout={handleLogout} />
      )}
    </>
  );
}
