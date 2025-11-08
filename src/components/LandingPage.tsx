import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import svgPaths from "../imports/svg-0x5486gjrj";
import imgGoogleLogoNoBg1 from "../assets/google-logo-no-bg.png";
import { createClient } from "../utils/supabase/client";
import { signUp } from "../utils/api";
import AboutPage from "./AboutPage";
import ContactPage from "./ContactPage";

function Home() {
  return (
    <div
      className="[grid-area:1_/_1] ml-[6.207px] mt-[6.207px] relative size-[36.207px]"
      data-name="Home"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 37 37"
      >
        <g id="Home">
          <path
            d={svgPaths.p3ffc9300}
            id="Icon"
            stroke="var(--stroke-0, #F5F5F5)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4"
          />
        </g>
      </svg>
    </div>
  );
}

function IconLogo() {
  return (
    <div
      className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0"
      data-name="Icon Logo"
    >
      <div className="[grid-area:1_/_1] bg-[#4f6f52] ml-0 mt-0 rounded-[12px] size-[49.208px]" />
      <Home />
    </div>
  );
}

function LogoWithText() {
  return (
    <div className="relative shrink-0" data-name="Logo with Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center leading-[0] relative">
        <IconLogo />
        <div className="flex flex-col font-['REM:SemiBold',sans-serif] font-semibold h-[37.241px] justify-center relative shrink-0 text-[#4f6f52] text-[28px] md:text-[35px] text-center w-[150px] md:w-[190.345px]">
          <p className="leading-[normal]">BoardMap</p>
        </div>
      </div>
    </div>
  );
}

interface Frame12Props {
  onAboutClick: () => void;
  onContactClick: () => void;
}

function Frame12({ onAboutClick, onContactClick }: Frame12Props) {
  return (
    <div className="relative shrink-0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex font-['Rethink_Sans:SemiBold',sans-serif] font-semibold gap-[20px] md:gap-[30px] items-center justify-center leading-[0] relative text-[#4f6f52] text-[18px] md:text-[25px] text-center">
        <button
          onClick={onAboutClick}
          className="flex flex-col h-[39px] justify-center relative shrink-0 w-[80px] md:w-[106px] cursor-pointer hover:opacity-80 transition-opacity"
        >
          <p className="leading-[normal]">About</p>
        </button>
        <button
          onClick={onContactClick}
          className="flex flex-col h-[39px] justify-center relative shrink-0 w-[80px] md:w-[106px] cursor-pointer hover:opacity-80 transition-opacity"
        >
          <p className="leading-[normal]">Contact</p>
        </button>
      </div>
    </div>
  );
}

function Frame13({ onAboutClick, onContactClick }: Frame12Props) {
  return (
    <div className="basis-0 content-stretch flex grow items-center justify-between min-h-px min-w-px relative shrink-0">
      <LogoWithText />
      <Frame12 onAboutClick={onAboutClick} onContactClick={onContactClick} />
    </div>
  );
}

interface AuthFormProps {
  isSignUp: boolean;
  onSubmit: (data: {
    name?: string;
    email: string;
    password: string;
    userType: "student" | "owner";
  }) => Promise<void>;
  loading: boolean;
}

function AuthForm({ isSignUp, onSubmit, loading }: AuthFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    userType: "student" as "student" | "owner",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <motion.form
      key={isSignUp ? "signup" : "login"}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className="contents"
    >
      <AnimatePresence mode="wait">
        {isSignUp && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="content-stretch flex flex-col gap-[3px] items-start relative shrink-0 w-[384px] overflow-hidden"
          >
            <div className="flex flex-col font-['Rethink_Sans:Medium',sans-serif] font-medium h-[22px] justify-center leading-[0] relative shrink-0 text-[#4f6f52] text-[14px] w-full">
              <p className="leading-[normal]">Full name</p>
            </div>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="ex. Dela Cruz, Juan A."
              className="bg-[#e7f0dc] h-[35px] w-full rounded-[15px] border border-[#597445] px-[23px] py-[6px] font-['Rethink_Sans:Regular',sans-serif] text-[12px] text-[#4f6f52] outline-none focus:ring-2 focus:ring-[#597445] transition-all"
              required={isSignUp}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="content-stretch flex flex-col gap-[3px] items-start relative shrink-0 w-[384px]">
        <div className="flex flex-col font-['Rethink_Sans:Medium',sans-serif] font-medium h-[22px] justify-center leading-[0] relative shrink-0 text-[#4f6f52] text-[14px] w-full">
          <p className="leading-[normal]">Email</p>
        </div>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="phone number, username, or email"
          className="bg-[#e7f0dc] h-[35px] w-full rounded-[15px] border border-[#597445] px-[23px] py-[6px] font-['Rethink_Sans:Regular',sans-serif] text-[12px] text-[#4f6f52] outline-none focus:ring-2 focus:ring-[#597445] transition-all"
          required
        />
      </div>

      <div className="content-stretch flex flex-col gap-[3px] items-start relative shrink-0 w-[384px]">
        <div className="flex flex-col font-['Rethink_Sans:Medium',sans-serif] font-medium h-[22px] justify-center leading-[0] relative shrink-0 text-[#4f6f52] text-[14px] w-full">
          <p className="leading-[normal]">Password</p>
        </div>
        <input
          type="password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          placeholder={isSignUp ? "create secure password" : "enter password"}
          className="bg-[#e7f0dc] h-[35px] w-full rounded-[15px] border border-[#597445] px-[23px] py-[6px] font-['Rethink_Sans:Regular',sans-serif] text-[12px] text-[#4f6f52] outline-none focus:ring-2 focus:ring-[#597445] transition-all"
          required
        />
      </div>

      <div className="content-stretch flex gap-[28px] items-center relative shrink-0">
        <div className="relative">
          <motion.div
            animate={{ opacity: formData.userType === "student" ? 1 : 0 }}
            className="h-[28px] rounded-[15px] shrink-0 w-[120px] bg-[#4f6f52] shadow-[0px_0px_50px_0px_#597445] absolute"
          />
          <button
            type="button"
            onClick={() => setFormData({ ...formData, userType: "student" })}
            className={`relative flex flex-col font-['Rethink_Sans:Medium',sans-serif] font-medium h-[28px] justify-center text-[14px] text-center w-[120px] transition-colors rounded-[15px] ${
              formData.userType === "student"
                ? "text-[#e8f3da]"
                : "text-[#4f6f52]"
            }`}
          >
            <p className="leading-[normal]">Student</p>
          </button>
        </div>
        <div className="relative">
          <motion.div
            animate={{ opacity: formData.userType === "owner" ? 1 : 0 }}
            className="h-[28px] rounded-[15px] shrink-0 w-[120px] bg-[#4f6f52] shadow-[0px_0px_50px_0px_#597445] absolute"
          />
          <button
            type="button"
            onClick={() => setFormData({ ...formData, userType: "owner" })}
            className={`relative flex flex-col font-['Rethink_Sans:Medium',sans-serif] font-medium h-[28px] justify-center text-[14px] text-center w-[120px] transition-colors rounded-[15px] ${
              formData.userType === "owner"
                ? "text-[#e8f3da]"
                : "text-[#4f6f52]"
            }`}
          >
            <p className="leading-[normal]">Owner</p>
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-[#4f6f52] box-border content-stretch flex gap-[10px] h-[35px] items-center justify-center px-[44px] py-[8px] relative rounded-[15px] shrink-0 w-[180px] cursor-pointer hover:bg-[#3d5841] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="flex flex-col font-['Rethink_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#e8f3da] text-[14px] text-center text-nowrap">
          <p className="leading-[normal] whitespace-pre">
            {loading ? "Please wait..." : isSignUp ? "Sign up" : "Sign In"}
          </p>
        </div>
      </button>
    </motion.form>
  );
}

function LogInOrSignUp({
  isSignUp,
  onToggle,
}: {
  isSignUp: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <motion.div
        animate={{ x: isSignUp ? 145 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="[grid-area:1_/_1] bg-[#4f6f52] h-[35px] ml-0 mt-0 rounded-[15px] shadow-[0px_0px_50px_0px_#597445] w-[150px]"
      />
      <div className="[grid-area:1_/_1] box-border content-stretch flex font-['Rethink_Sans:Medium',sans-serif] font-medium gap-[50px] items-center justify-center ml-[18px] mt-[6px] relative text-[18px] text-center">
        <button
          type="button"
          onClick={() => onToggle()}
          className={`flex flex-col h-[23px] justify-center relative shrink-0 w-[113px] cursor-pointer transition-colors ${
            !isSignUp ? "text-[#e8f3da]" : "text-[#4f6f52]"
          }`}
        >
          <p className="leading-[normal]">Log In</p>
        </button>
        <button
          type="button"
          onClick={() => onToggle()}
          className={`flex flex-col h-[23px] justify-center relative shrink-0 w-[113px] cursor-pointer transition-colors ${
            isSignUp ? "text-[#e8f3da]" : "text-[#4f6f52]"
          }`}
        >
          <p className="leading-[normal]">Sign Up</p>
        </button>
      </div>
    </div>
  );
}

function ContinueWithGoogle({
  onGoogleLogin,
  loading,
}: {
  onGoogleLogin: () => Promise<void>;
  loading: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onGoogleLogin}
      disabled={loading}
      className="bg-[#e7f0dc] box-border content-stretch flex flex-col gap-[10px] h-[35px] items-center px-[46px] py-[5px] relative rounded-[15px] shrink-0 w-[250px] cursor-pointer hover:bg-[#d5e4c8] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <div
        aria-hidden="true"
        className="absolute border border-[#597445] border-solid inset-0 pointer-events-none rounded-[15px]"
      />
      <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
        <div className="[grid-area:1_/_1] ml-0 mt-0 relative size-[25px]">
          <img
            alt=""
            className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full"
            src={imgGoogleLogoNoBg1}
          />
        </div>
        <div className="[grid-area:1_/_1] flex flex-col font-['Rethink_Sans:Regular',sans-serif] font-normal h-[23px] justify-center ml-[30px] mt-[12.5px] relative text-[12px] text-[rgba(79,111,82,0.7)] translate-y-[-50%] w-[127px]">
          <p className="leading-[normal]">
            {loading ? "Signing in..." : "Continue with Google"}
          </p>
        </div>
      </div>
    </button>
  );
}

interface BodyRightProps {
  onLogin: (
    id: string,
    name: string,
    email: string,
    type: "student" | "owner",
    accessToken: string
  ) => void;
}

function BodyRight({ onLogin }: BodyRightProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (data: {
    name?: string;
    email: string;
    password: string;
    userType: "student" | "owner";
  }) => {
    try {
      setLoading(true);

      if (isSignUp) {
        // Sign up
        await signUp(
          data.email,
          data.password,
          data.name || data.email.split("@")[0],
          data.userType
        );
        toast.success("Account created successfully!");
      }

      // Sign in
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        toast.error(error.message || "Invalid email or password");
        return;
      }

      if (authData.session && authData.user) {
        const name =
          authData.user.user_metadata?.name || data.email.split("@")[0];
        const userType = authData.user.user_metadata?.userType || data.userType;
        onLogin(
          authData.user.id,
          name,
          authData.user.email || data.email,
          userType,
          authData.session.access_token
        );
        toast.success("Welcome to BoardMap!");
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) {
        toast.error("Google sign-in failed. Please try again.");
      }
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      toast.error("Google sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const boxHeight = isSignUp ? "h-[680px]" : "h-[607px]";

  return (
    <motion.div
      animate={{ height: isSignUp ? 680 : 607 }}
      transition={{ duration: 0.3 }}
      className={`bg-[#e7f0dc] box-border content-stretch flex flex-col gap-[22px] items-center justify-center px-[20px] md:px-[47px] py-[23px] relative rounded-[16px] shrink-0 w-full max-w-[90vw] md:max-w-[505px] ${boxHeight}`}
    >
      <div
        aria-hidden="true"
        className="absolute border-4 border-[#597445] border-solid inset-[-2px] pointer-events-none rounded-[18px]"
      />
      <div className="content-stretch flex flex-col gap-[24px] items-center relative shrink-0 w-full max-w-[354px]">
        <div className="h-[15px] relative shrink-0 w-[65px]">
          <svg
            className="block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 65 15"
          >
            <g id="Frame 14">
              <circle
                cx="7.5"
                cy="7.5"
                fill="var(--fill-0, #597445)"
                id="Ellipse 1"
                r="7.5"
              />
              <circle
                cx="32.5"
                cy="7.5"
                fill="var(--fill-0, #597445)"
                id="Ellipse 2"
                r="7.5"
              />
              <circle
                cx="57.5"
                cy="7.5"
                fill="var(--fill-0, #597445)"
                id="Ellipse 3"
                r="7.5"
              />
            </g>
          </svg>
        </div>
        <div className="content-stretch flex flex-col gap-[15px] items-center leading-[normal] relative shrink-0 text-center w-full">
          <p className="font-['REM:SemiBold',sans-serif] font-semibold h-[28px] relative shrink-0 text-[#4f6f52] text-[30px] w-full">
            Get Started
          </p>
          <p className="font-['Rethink_Sans:Regular',sans-serif] font-normal h-[20px] relative shrink-0 text-[#597445] text-[14px] w-full">
            Join BoardMap to find your ideal accommodation
          </p>
        </div>
      </div>
      <LogInOrSignUp
        isSignUp={isSignUp}
        onToggle={() => setIsSignUp(!isSignUp)}
      />
      <AuthForm isSignUp={isSignUp} onSubmit={handleSubmit} loading={loading} />
      <div className="content-stretch flex items-center justify-center relative shrink-0">
        <div className="h-0 relative shrink-0 w-[178px]">
          <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
            <svg
              className="block size-full"
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 178 1"
            >
              <line
                id="Line 4"
                stroke="var(--stroke-0, #597445)"
                x2="178"
                y1="0.5"
                y2="0.5"
              />
            </svg>
          </div>
        </div>
        <div className="flex flex-col font-['Rethink_Sans:Medium',sans-serif] font-medium h-[7px] justify-center leading-[0] relative shrink-0 text-[#4f6f52] text-[14px] text-center w-[25px]">
          <p className="leading-[normal]">or</p>
        </div>
        <div className="h-0 relative shrink-0 w-[178px]">
          <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
            <svg
              className="block size-full"
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 178 1"
            >
              <line
                id="Line 4"
                stroke="var(--stroke-0, #597445)"
                x2="178"
                y1="0.5"
                y2="0.5"
              />
            </svg>
          </div>
        </div>
      </div>
      <ContinueWithGoogle onGoogleLogin={handleGoogleLogin} loading={loading} />
    </motion.div>
  );
}

interface LandingPageProps {
  onLogin: (
    id: string,
    name: string,
    email: string,
    type: "student" | "owner",
    accessToken: string
  ) => void;
}

export default function LandingPage({ onLogin }: LandingPageProps) {
  const [showAbout, setShowAbout] = useState(false);
  const [showContact, setShowContact] = useState(false);

  return (
    <div className="bg-gradient-to-b from-[#e2f0d1] to-[#ffffff] via-[#e8f3da] min-h-screen w-full overflow-x-hidden">
      {/* Desktop Version */}
      <div className="hidden lg:block">
        <div className="h-auto min-h-screen overflow-clip relative w-full">
          <div className="bg-[#e7f0dc] box-border content-start flex flex-wrap gap-[10px] h-[97.208px] items-start left-0 px-[25px] py-[24px] shadow-[0px_4px_100px_0px_rgba(35,74,28,0.3)] top-0 w-full">
            <Frame13
              onAboutClick={() => setShowAbout(true)}
              onContactClick={() => setShowContact(true)}
            />
          </div>
          <div className="content-center flex flex-wrap gap-[100px] lg:gap-[200px] items-center justify-center px-8 py-16 w-full">
            {/* Hero content here - using simplified version for mobile */}
            <div className="max-w-2xl">
              <h1 className="font-['REM:SemiBold',sans-serif] text-[48px] lg:text-[75px] leading-tight mb-6 whitespace-nowrap">
                {" "}
                <span className="block text-black font-semibold">
                  Find the Perfect
                </span>
                <span className="block text-[#79ac78] font-semibold">
                  Boarding House
                </span>
                <span className="block text-black font-semibold">Near VSU</span>
              </h1>
              <p className="font-['Rethink_Sans:SemiBold',sans-serif] text-[18px] lg:text-[25px] text-[rgba(0,0,0,0.6)] mb-8 max-w-xl">
                Discover comfortable, affordable, and convenient boarding houses
                around Visayas State University. Real-time availability, direct
                communication with owners, and detailed property information at
                your fingertips.
              </p>
            </div>
            <BodyRight onLogin={onLogin} />
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Version */}
      <div className="lg:hidden min-h-screen flex flex-col">
        <div className="bg-[#e7f0dc] shadow-[0px_4px_100px_0px_rgba(35,74,28,0.3)] px-4 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <LogoWithText />
            <div className="flex gap-4">
              <button
                onClick={() => setShowAbout(true)}
                className="font-['Rethink_Sans:SemiBold',sans-serif] text-[#4f6f52] text-[16px] hover:opacity-70 transition-opacity"
              >
                About
              </button>
              <button
                onClick={() => setShowContact(true)}
                className="font-['Rethink_Sans:SemiBold',sans-serif] text-[#4f6f52] text-[16px] hover:opacity-70 transition-opacity"
              >
                Contact
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center px-4 py-8 gap-8">
          <div className="text-center max-w-2xl">
            <h1 className="font-['REM:SemiBold',sans-serif] text-[32px] md:text-[48px] leading-tight mb-4">
              <span className="block text-black">Find the Perfect</span>
              <span className="block text-[#79ac78]">Boarding House</span>
              <span className="block text-black">Near VSU</span>
            </h1>
            <p className="font-['Rethink_Sans:SemiBold',sans-serif] text-[16px] md:text-[18px] text-[rgba(0,0,0,0.6)] mb-6">
              Discover comfortable, affordable, and convenient boarding houses
              around Visayas State University.
            </p>
          </div>

          <div className="bg-[#e7f0dc] rounded-[16px] border-4 border-[#597445] p-6 md:p-8 w-full max-w-md">
            <BodyRight onLogin={onLogin} />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showAbout && <AboutPage onClose={() => setShowAbout(false)} />}
        {showContact && <ContactPage onClose={() => setShowContact(false)} />}
      </AnimatePresence>
    </div>
  );
}
