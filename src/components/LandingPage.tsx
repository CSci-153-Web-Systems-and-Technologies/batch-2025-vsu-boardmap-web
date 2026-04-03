import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Compass, Leaf } from "lucide-react";
import { toast } from "sonner";
import imgGoogleLogoNoBg1 from "../assets/google-logo-no-bg.png";
import { createClient } from "../utils/supabase/client";
import AboutPage from "./AboutPage";
import ContactPage from "./ContactPage";

interface LandingPageProps {
  onLogin: (
    id: string,
    name: string,
    email: string,
    type: "student" | "owner",
    accessToken: string
  ) => void;
}

type UserRole = "student" | "owner";

const heroStats = [
  { label: "Student-ready stays", value: "200+" },
  { label: "Owner replies", value: "Fast" },
  { label: "Campus-focused", value: "VSU" },
];

const trustPoints = [
  "Built for VSU",
  "Student + owner flow",
  "Clear green contrast",
];

function SiteHeader({
  onAboutClick,
  onContactClick,
}: {
  onAboutClick: () => void;
  onContactClick: () => void;
}) {
  return (
    <header className="boardmap-topbar">
      <div className="boardmap-topbar-inner">
        <div className="boardmap-logo">
          <img src="/BoardMap_Logo.png" alt="BoardMap logo" />
          <div>
            <p className="boardmap-logo-title">BoardMap</p>
            <p className="boardmap-logo-tagline">
              Green, clear, campus-ready housing search
            </p>
          </div>
        </div>

        <nav className="boardmap-nav">
          <button
            type="button"
            onClick={onAboutClick}
            className="boardmap-button-ghost hidden md:inline-flex"
          >
            About
          </button>
          <button
            type="button"
            onClick={onContactClick}
            className="boardmap-button-secondary"
          >
            Contact
          </button>
        </nav>
      </div>
    </header>
  );
}

function RoleToggle({
  role,
  onChange,
}: {
  role: UserRole;
  onChange: (role: UserRole) => void;
}) {
  return (
    <div className="boardmap-role-toggle">
      <button
        type="button"
        onClick={() => onChange("student")}
        className={`boardmap-role-card ${
          role === "student" ? "boardmap-role-card-active" : ""
        }`}
      >
        <strong>Student</strong>
        <span>Find a place near VSU fast.</span>
      </button>
      <button
        type="button"
        onClick={() => onChange("owner")}
        className={`boardmap-role-card ${
          role === "owner" ? "boardmap-role-card-active" : ""
        }`}
      >
        <strong>Owner</strong>
        <span>List rooms and manage inquiries.</span>
      </button>
    </div>
  );
}

function AuthPanel({ onLogin }: LandingPageProps) {
  const supabase = createClient();
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [role, setRole] = useState<UserRole>("student");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    const savedEmail = localStorage.getItem("lastLoggedInEmail");
    if (savedEmail) {
      setFormData((current) => ({ ...current, email: savedEmail }));
    }
  }, []);

  const isSignUp = mode === "signup";

  const handleChange = (
    field: "name" | "email" | "password",
    value: string
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSignUp && !formData.name.trim()) {
      toast.error("Please enter your full name before creating an account.");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Use at least 6 characters for your password.");
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        const fullName = formData.name.trim();
        const { data, error } = await supabase.auth.signUp({
          email: formData.email.trim(),
          password: formData.password,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              name: fullName,
              type: role,
              userType: role,
            },
          },
        });

        if (error) {
          throw error;
        }

        if (data.session && data.user) {
          onLogin(
            data.user.id,
            fullName,
            data.user.email || formData.email.trim(),
            role,
            data.session.access_token
          );
          toast.success("Your account is ready. Welcome to BoardMap.");
          return;
        }

        toast.success(
          "Account created. Check your email to confirm your address before logging in."
        );
        setMode("login");
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (error) {
        throw error;
      }

      if (data.session && data.user) {
        localStorage.setItem("lastLoggedInEmail", formData.email.trim());

        const userRole =
          data.user.user_metadata?.userType ||
          data.user.user_metadata?.type ||
          role;
        const userName =
          data.user.user_metadata?.name ||
          formData.name.trim() ||
          data.user.email?.split("@")[0] ||
          "BoardMap User";

        onLogin(
          data.user.id,
          userName,
          data.user.email || formData.email.trim(),
          userRole,
          data.session.access_token
        );
        toast.success(`Welcome back, ${userName}.`);
      }
    } catch (error: any) {
      toast.error(error.message || "We could not complete that request.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
          queryParams: {
            prompt: "select_account",
          },
        },
      });

      if (error) {
        throw error;
      }
    } catch (error: any) {
      toast.error(error.message || "Google sign-in is unavailable right now.");
      setLoading(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="boardmap-panel-strong boardmap-auth-card"
    >
      <div>
        <span className="boardmap-eyebrow">
          <Leaf size={14} />
          Get started
        </span>
        <h2 className="boardmap-section-title" style={{ marginTop: "0.7rem" }}>
          Sign in with the role that fits your flow.
        </h2>
        <p className="boardmap-section-copy">
          One clean account for browsing, listing, and messaging.
        </p>
      </div>

      <div className="boardmap-auth-toggle">
        <motion.div
          className="boardmap-auth-pill"
          animate={{ x: mode === "signup" ? "100%" : "0%" }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
        />
        <button
          type="button"
          className={`boardmap-auth-option ${
            mode === "login" ? "boardmap-auth-option-active" : ""
          }`}
          onClick={() => setMode("login")}
        >
          Log in
        </button>
        <button
          type="button"
          className={`boardmap-auth-option ${
            mode === "signup" ? "boardmap-auth-option-active" : ""
          }`}
          onClick={() => setMode("signup")}
        >
          Sign up
        </button>
      </div>

      <RoleToggle role={role} onChange={setRole} />

      <form className="boardmap-form-grid" onSubmit={handleSubmit}>
        {isSignUp ? (
          <div className="boardmap-field-row">
            <label className="boardmap-field">
              <span className="boardmap-label">Full name</span>
              <input
                className="boardmap-input"
                type="text"
                placeholder="Juan Dela Cruz"
                value={formData.name}
                onChange={(event) => handleChange("name", event.target.value)}
                autoComplete="name"
              />
            </label>

            <label className="boardmap-field">
              <span className="boardmap-label">Email address</span>
              <input
                className="boardmap-input"
                type="email"
                placeholder="yourname@example.com"
                value={formData.email}
                onChange={(event) => handleChange("email", event.target.value)}
                autoComplete="email"
                required
              />
            </label>
          </div>
        ) : (
          <label className="boardmap-field">
            <span className="boardmap-label">Email address</span>
            <input
              className="boardmap-input"
              type="email"
              placeholder="yourname@example.com"
              value={formData.email}
              onChange={(event) => handleChange("email", event.target.value)}
              autoComplete="email"
              required
            />
          </label>
        )}

        <label className="boardmap-field">
          <span className="boardmap-label">Password</span>
          <div style={{ position: "relative" }}>
            <input
              className="boardmap-input"
              style={{ paddingRight: "3.2rem" }}
              type={showPassword ? "text" : "password"}
              placeholder={
                isSignUp ? "Create a secure password" : "Enter your password"
              }
              value={formData.password}
              onChange={(event) => handleChange("password", event.target.value)}
              autoComplete={isSignUp ? "new-password" : "current-password"}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              style={{
                position: "absolute",
                right: "0.75rem",
                top: "50%",
                transform: "translateY(-50%)",
                border: "none",
                background: "transparent",
                color: "#2f6a45",
                fontWeight: 700,
                fontSize: "0.78rem",
                cursor: "pointer",
              }}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </label>

        <div className="boardmap-helper">
          {isSignUp
            ? "Your role is saved so the correct dashboard opens after sign-in."
            : "Use the same verified email from Supabase."}
        </div>

        <button
          type="submit"
          className="boardmap-button-primary"
          disabled={loading}
          style={{ width: "100%" }}
        >
          {loading ? "Please wait..." : isSignUp ? "Create account" : "Continue"}
          {!loading && <ArrowRight size={16} />}
        </button>
      </form>

      <div className="boardmap-divider">or continue with</div>

      <button
        type="button"
        className="boardmap-button-secondary"
        style={{ width: "100%" }}
        onClick={handleGoogleLogin}
        disabled={loading}
      >
        <img
          src={imgGoogleLogoNoBg1}
          alt="Google"
          style={{ width: 18, height: 18, objectFit: "contain" }}
        />
        {loading ? "Connecting..." : "Continue with Google"}
      </button>
    </motion.section>
  );
}

export default function LandingPage({ onLogin }: LandingPageProps) {
  const [showAbout, setShowAbout] = useState(false);
  const [showContact, setShowContact] = useState(false);

  return (
    <div className="boardmap-page">
      <SiteHeader
        onAboutClick={() => setShowAbout(true)}
        onContactClick={() => setShowContact(true)}
      />

      <main className="boardmap-shell boardmap-landing-main">
        <section className="boardmap-hero-grid" style={{ width: "100%" }}>
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="boardmap-panel boardmap-hero-card"
            style={{ padding: "1.15rem 1.2rem" }}
          >
            <span className="boardmap-eyebrow">
              <Compass size={14} />
              Revamped green experience
            </span>
            <h1 className="boardmap-heading">
              Find your next
              <span className="boardmap-heading-accent"> boarding house near VSU.</span>
            </h1>
            <p className="boardmap-lead">
              Search nearby stays, compare details faster, and message owners in one
              cleaner flow.
            </p>

            <div className="boardmap-chip-row" style={{ marginTop: "0.55rem" }}>
              {trustPoints.map((point) => (
                <span key={point} className="boardmap-chip">
                  <CheckCircle2 size={14} />
                  {point}
                </span>
              ))}
            </div>

            <div className="boardmap-metric-grid">
              {heroStats.map((item) => (
                <div key={item.label} className="boardmap-stat-card">
                  <span className="boardmap-stat-label">{item.label}</span>
                  <strong className="boardmap-stat-value">{item.value}</strong>
                </div>
              ))}
            </div>
          </motion.div>

          <AuthPanel onLogin={onLogin} />
        </section>
      </main>

      <AnimatePresence>
        {showAbout && <AboutPage onClose={() => setShowAbout(false)} />}
        {showContact && <ContactPage onClose={() => setShowContact(false)} />}
      </AnimatePresence>
    </div>
  );
}
