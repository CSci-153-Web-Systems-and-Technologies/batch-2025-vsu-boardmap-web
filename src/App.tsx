import { useState, useEffect, useRef } from "react";
import { Toaster } from "./components/ui/sooner";
import LoadingScreen from "./components/LoadingScreen";
import LandingPage from "./components/LandingPage";
import StudentDashboard from "./components/StudentDashboard";
import OwnerDashboard from "./components/OwnerDashboard";
import MessagingPage from "./components/MessagingPage";
import { createClient } from "./utils/supabase/client";

export type User = {
  id: string;
  name: string;
  email: string;
  type: "student" | "owner";
  accessToken: string;
};

// Helper function to store and retrieve user type from localStorage
const STORAGE_KEY = "boardmap_user_type";

const storeUserType = (userId: string, type: "student" | "owner") => {
  const data = { userId, type, timestamp: Date.now() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const getUserType = (userId: string): "student" | "owner" | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const data = JSON.parse(stored);
    // Check if it's the same user and data is not too old (24 hours)
    if (
      data.userId === userId &&
      Date.now() - data.timestamp < 24 * 60 * 60 * 1000
    ) {
      return data.type;
    }
    return null;
  } catch {
    return null;
  }
};

const clearUserType = () => {
  localStorage.removeItem(STORAGE_KEY);
};

interface MessageRecipient {
  recipientId: string;
  recipientName: string;
  propertyId?: string;
  propertyTitle?: string;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<"landing" | "dashboard">(
    "landing"
  );
  const [user, setUser] = useState<User | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(true);

  const [showMessaging, setShowMessaging] = useState(false);
  const [messageRecipient, setMessageRecipient] =
    useState<MessageRecipient | null>(null);
  // Use refs to prevent duplicate processing
  const authProcessingRef = useRef(false);
  const lastUserIdRef = useRef<string | null>(null);

  const openMessaging = (
    recipientId: string,
    recipientName: string,
    propertyId?: string,
    propertyTitle?: string
  ) => {
    console.log("Opening messaging with:", { recipientId, recipientName, propertyId, propertyTitle });
    setMessageRecipient({
      recipientId,
      recipientName,
      propertyId,
      propertyTitle,
    });
    setShowMessaging(true);
  };

  // Function to close messaging
  const closeMessaging = () => {
    console.log("Closing messaging");
    setShowMessaging(false);
    setMessageRecipient(null);
  };

  const handleLogin = (
    id: string,
    name: string,
    email: string,
    type: "student" | "owner",
    accessToken: string
  ) => {
    // Store the type immediately
    storeUserType(id, type);

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
      clearUserType();
    }
  };

  useEffect(() => {
    // Check if Leaflet is already loaded
    if (window.L) {
      return;
    }

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
      // Don't remove script on cleanup
    };
  }, []);

  useEffect(() => {
    async function initialize() {
      try {
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

  // Add auth state listener with improved handling
  useEffect(() => {
    const supabase = createClient();
    let mounted = true;

    const handleAuthChange = async (event: string, session: any) => {
      // Prevent multiple simultaneous auth state processing
      if (authProcessingRef.current) {
        console.log("Auth processing already in progress, skipping...");
        return;
      }

      authProcessingRef.current = true;

      try {
        console.log(
          "Auth state changed:",
          event,
          "User ID:",
          session?.user?.id
        );

        // Ignore some events to prevent unnecessary re-renders
        if (event === "INITIAL_SESSION" || event === "TOKEN_REFRESHED") {
          // Don't change state for these events if we already have a user
          if (user && session?.user?.id === user.id) {
            console.log("Same user, not updating state");
            return;
          }
        }

        if (
          session &&
          (event === "SIGNED_IN" ||
            event === "TOKEN_REFRESHED" ||
            event === "INITIAL_SESSION")
        ) {
          // Check if this is the same user we already have
          if (lastUserIdRef.current === session.user.id && user) {
            console.log("Same user ID, not updating");
            return;
          }

          // Get user type from multiple sources in order of preference
          let userType: "student" | "owner" = "student"; // Default to student

          // 1. Try localStorage first (most reliable for persistence)
          const storedType = getUserType(session.user.id);
          if (storedType) {
            userType = storedType;
            console.log("Got user type from localStorage:", userType);
          }
          // 2. Try user metadata
          else if (session.user.user_metadata?.type) {
            userType = session.user.user_metadata.type;
            console.log("Got user type from metadata:", userType);
            // Store it for future use
            storeUserType(session.user.id, userType);
          }
          // 3. Try to get from database (if you have a profiles table)
          else {
            try {
              const { data, error } = await supabase
                .from("users") // Try different table names
                .select("type")
                .eq("id", session.user.id)
                .single();

              if (!error && data?.type) {
                userType = data.type;
                console.log("Got user type from database:", userType);
                storeUserType(session.user.id, userType);
              }
            } catch (dbErr) {
              console.log("No user type in database, using default");
            }
          }

          const userData = {
            id: session.user.id,
            name:
              session.user.user_metadata?.name ||
              session.user.email?.split("@")[0] ||
              "User",
            email: session.user.email!,
            type: userType,
            accessToken: session.access_token,
          };

          console.log("Setting user with type:", userType);

          if (mounted) {
            lastUserIdRef.current = session.user.id;
            setUser(userData);
            setCurrentPage("dashboard");
          }
        } else if (event === "SIGNED_OUT") {
          console.log("User signed out");
          if (mounted) {
            lastUserIdRef.current = null;
            setUser(null);
            setCurrentPage("landing");
            clearUserType();
          }
        }
      } catch (error) {
        console.error("Error in auth state change handler:", error);
      } finally {
        authProcessingRef.current = false;
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(handleAuthChange);

    // Also check current session on mount
    const checkCurrentSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session && mounted) {
          handleAuthChange("INITIAL_SESSION", session);
        }
      } catch (error) {
        console.error("Error checking current session:", error);
      }
    };

    checkCurrentSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []); // Empty dependency array - only run once on mount

  // Add a visibility change handler to prevent unwanted re-renders
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        console.log("Tab became visible, but not changing auth state");
        // Do nothing - we want to keep the current user state
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Toaster position="top-center" richColors />
      {currentPage === "landing" && <LandingPage onLogin={handleLogin} />}
      {currentPage === "dashboard" && user && user.type === "student" && (
        <StudentDashboard 
          user={user} 
          onLogout={handleLogout} 
          onOpenMessaging={openMessaging}
        />
      )}
      {currentPage === "dashboard" && user && user.type === "owner" && (
        <OwnerDashboard 
          user={user} 
          onLogout={handleLogout} 
          onOpenMessaging={openMessaging}
        />
      )}

      {/* Messaging Overlay */}
      {showMessaging && messageRecipient && user && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[10000000] p-4 md:p-6">
          <div className="w-full max-w-3xl h-[80vh] md:h-[85vh]">
            <MessagingPage
              userId={user.id}
              recipientId={messageRecipient.recipientId}
              recipientName={messageRecipient.recipientName}
              propertyId={messageRecipient.propertyId}
              propertyTitle={messageRecipient.propertyTitle}
              accessToken={user.accessToken}
              onBack={closeMessaging}
            />
          </div>
        </div>
      )}
    </>
  );
}