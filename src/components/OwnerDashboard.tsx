import { useState, useEffect } from "react";
import svgPaths from "../imports/svg-xxo13nfqz5";
import Footer from "./Footer";
import { createClient } from '../utils/supabase/client';
import PropertyForm from "./PropertyForm";
import { Menu, X, Trash2, Edit2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

// TypeScript Interfaces - Match your actual database schema
interface Property {
  id: string;
  title: string;
  address: string;
  price: number;
  availability: string;
  bedrooms: number;
  bathrooms: number;
  gender: string;
  reviews?: number;
  owner_id: string;
  created_at: string;
  // Add any missing properties that PropertyForm expects
  description: string;
  location?: string;
  amenities?: string[];
  type?: string;
  images?: string[];
}

interface Occupant {
  id: string;
  name: string;
  room_number?: string;
  roomNumber?: string;
  monthly_rent?: number;
  monthlyRent?: number;
  paid_until?: string;
  paidUntil?: string;
  status: "active" | "inactive";
  property_id?: string;
  propertyId?: string;
  owner_id: string;
  created_at: string;
}

interface Inquiry {
  id: string;
  student_name?: string;
  studentName?: string;
  message: string;
  property_title?: string;
  propertyTitle?: string;
  property_id?: string;
  propertyId?: string;
  status: string;
  owner_id: string;
  created_at: string;
}

// Helper function to get field with fallback
const getField = <T,>(obj: any, field1: string, field2: string): T => {
  return obj[field1] !== undefined ? obj[field1] : obj[field2];
};

// API Functions with proper typing
const deleteProperty = async (id: string, accessToken: string): Promise<void> => {
  const supabase = createClient();
  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

const deleteOccupant = async (id: string, accessToken: string): Promise<void> => {
  const supabase = createClient();
  const { error } = await supabase
    .from('occupants')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

type OccupantUpdate = Partial<Pick<Occupant, 'status' | 'monthly_rent' | 'paid_until' | 'room_number'>>;
const updateOccupant = async (id: string, updates: OccupantUpdate): Promise<void> => {
  const supabase = createClient();
  const { error } = await supabase
    .from('occupants')
    .update(updates)
    .eq('id', id);
  
  if (error) throw error;
};

type InquiryUpdate = Partial<Pick<Inquiry, 'status'>>;
const updateInquiry = async (id: string, updates: InquiryUpdate): Promise<void> => {
  const supabase = createClient();
  const { error } = await supabase
    .from('inquiries')
    .update(updates)
    .eq('id', id);
  
  if (error) throw error;
};

function Home() {
  return (
    <div className="[grid-area:1_/_1] ml-[6.207px] mt-[6.207px] relative size-[36.207px]">
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
            stroke="var(--stroke-0, #597445)"
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
      {/* Remove the green background circle and use your logo instead */}
      <img
        src="/BoardMap_Logo_White.png"
        alt="BoardMap Logo"
        className="w-[50px] h-[50px] object-contain"
      />
    </div>
  );
}

function LogoWithText() {
  return (
    <div className="content-stretch flex items-center leading-[0] relative shrink-0">
      <IconLogo />
      <div className="flex flex-col font-['REM:SemiBold',sans-serif] font-semibold h-[37.241px] justify-center relative shrink-0 text-[24px] md:text-[35px] text-center text-white w-[120px] md:w-[190.345px]">
        <p className="leading-[normal]">BoardMap</p>
      </div>
    </div>
  );
}

function MessageCircle() {
  return (
    <div className="relative shrink-0 size-[28px] md:size-[35px]">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 35 35"
      >
        <g id="Message circle">
          <path
            d={svgPaths.p20d61300}
            id="Icon"
            stroke="var(--stroke-0, white)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4"
          />
        </g>
      </svg>
    </div>
  );
}

function Messages({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="content-stretch flex items-center justify-between gap-2 relative shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
    >
      <MessageCircle />
      <div className="hidden md:flex flex-col font-['Rethink_Sans:SemiBold',sans-serif] font-semibold h-[20px] justify-center leading-[0] relative shrink-0 text-[18px] text-center text-white w-[100px]">
        <p className="leading-[normal]">Messages</p>
      </div>
    </button>
  );
}

function User() {
  return (
    <div className="relative shrink-0 size-[28px] md:size-[35px]">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 35 35"
      >
        <g id="User">
          <path
            d={svgPaths.p8bc8d00}
            id="Icon"
            stroke="var(--stroke-0, white)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4"
          />
        </g>
      </svg>
    </div>
  );
}

interface UserProfileProps {
  name: string;
  type: string;
}

function UserProfile({ name, type }: UserProfileProps) {
  return (
    <div className="content-stretch flex items-center justify-between gap-2 relative shrink-0">
      <User />
      <div className="hidden md:flex content-stretch flex-col items-start justify-center leading-[0] relative shrink-0 w-[135px]">
        <div className="flex flex-col font-['Rethink_Sans:SemiBold',sans-serif] font-semibold justify-center relative shrink-0 text-[16px] text-white w-full">
          <p className="leading-normal truncate">{name}</p>
        </div>
        <div className="flex flex-col font-['Rethink_Sans:Regular',sans-serif] font-normal justify-center relative shrink-0 text-[#e2f0d1] text-[12px] w-full capitalize">
          <p className="leading-normal truncate">{type}</p>
        </div>
      </div>
    </div>
  );
}

function LogOut({ onLogout }: { onLogout: () => void }) {
  return (
    <button
      onClick={onLogout}
      className="relative shrink-0 size-[28px] md:size-[35px] cursor-pointer hover:opacity-80 transition-opacity"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 35 35"
      >
        <g id="Log out">
          <path
            d={svgPaths.p6985300}
            id="Icon"
            stroke="var(--stroke-0, white)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4"
          />
        </g>
      </svg>
    </button>
  );
}

interface HeaderProps {
  user: { name: string; type: "student" | "owner"; accessToken: string };
  onLogout: () => void;
  onMessagesClick: () => void;
  onMenuClick: () => void;
}

function Header({ user, onLogout, onMessagesClick, onMenuClick }: HeaderProps) {
  return (
    <div className="fixed top-0 left-0 right-0 bg-[#597445] box-border content-start flex flex-wrap gap-2 md:gap-[10px] h-[70px] md:h-[100px] items-center px-4 md:px-[50px] py-3 md:py-[25px] z-50">
      <div
        aria-hidden="true"
        className="absolute border border-[#597445] border-solid inset-0 pointer-events-none shadow-[0px_4px_100px_0px_rgba(35,74,28,0.3)]"
      />
      <div className="content-end flex flex-wrap gap-4 md:gap-[984px] items-center justify-between relative shrink-0 w-full">
        <LogoWithText />
        <div className="hidden md:flex content-stretch gap-[30px] items-center relative shrink-0">
          <button
            onClick={onMessagesClick}
            className="content-stretch flex items-center justify-between gap-2 relative shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <MessageCircle />
            <div className="flex flex-col font-['Rethink_Sans:SemiBold',sans-serif] font-semibold h-[20px] justify-center leading-[0] relative shrink-0 text-[18px] text-center text-white w-[100px]">
              <p className="leading-[normal]">Messages</p>
            </div>
          </button>
          <UserProfile name={user.name} type={user.type} />
          <LogOut onLogout={onLogout} />
        </div>
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={onMessagesClick}
            className="text-white hover:opacity-80 transition-opacity"
          >
            <MessageCircle />
          </button>
          <button
            onClick={onMenuClick}
            className="text-white hover:opacity-80 transition-opacity"
          >
            <Menu size={28} />
          </button>
        </div>
      </div>
    </div>
  );
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  onMessagesClick: () => void;
  user: { name: string; type: string };
}

function MobileMenu({
  isOpen,
  onClose,
  onLogout,
  onMessagesClick,
  user,
}: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] md:hidden"
      onClick={onClose}
    >
      <div
        className="absolute right-0 top-0 h-full w-[280px] bg-[#597445] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-[#79ac78] flex items-center justify-between">
          <h2 className="font-['REM:SemiBold',sans-serif] text-[24px] text-white">
            Menu
          </h2>
          <button onClick={onClose} className="text-white hover:opacity-80">
            <X size={24} />
          </button>
        </div>
        <div className="p-4 space-y-4">
          {/* User Info */}
          <div className="bg-[#4f6f52] rounded-[10px] p-4 mb-4">
            <div className="flex items-center gap-3 mb-2">
              <User />
              <div>
                <p className="font-['Rethink_Sans:SemiBold',sans-serif] text-[18px] text-white truncate">
                  {user.name}
                </p>
                <p className="font-['Rethink_Sans:Regular',sans-serif] text-[14px] text-[#e2f0d1] capitalize">
                  {user.type}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              onMessagesClick();
              onClose();
            }}
            className="w-full flex items-center gap-3 p-4 text-white hover:bg-[#4f6f52] rounded-[10px] transition-all active:scale-98 cursor-pointer"
          >
            <MessageCircle />
            <span className="font-['Rethink_Sans:SemiBold',sans-serif] text-[18px]">
              Messages
            </span>
          </button>
          <div className="border-t border-[#79ac78] pt-4 mt-4">
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="w-full flex items-center gap-3 p-4 text-white hover:bg-[#4f6f52] rounded-[10px] transition-all active:scale-98 cursor-pointer"
            >
              <div className="relative shrink-0 size-[28px]">
                <svg
                  className="block size-full"
                  fill="none"
                  preserveAspectRatio="none"
                  viewBox="0 0 35 35"
                >
                  <g id="Log out">
                    <path
                      d={svgPaths.p6985300}
                      id="Icon"
                      stroke="var(--stroke-0, white)"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="4"
                    />
                  </g>
                </svg>
              </div>
              <span className="font-['Rethink_Sans:SemiBold',sans-serif] text-[18px]">
                Log Out
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface OwnerDashboardProps {
  user: {
    id: string;
    name: string;
    email: string;
    type: "student" | "owner";
    accessToken: string;
  };
  onLogout: () => void;
}

export default function OwnerDashboard({
  user,
  onLogout,
}: OwnerDashboardProps) {
  const [currentTab, setCurrentTab] = useState<
    "analytics" | "properties" | "occupants" | "inquiries"
  >("properties");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<"dashboard" | "messages">(
    "dashboard"
  );
  const [isPropertyFormOpen, setIsPropertyFormOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | undefined>(
    undefined
  );
  const [properties, setProperties] = useState<Property[]>([]);
  const [occupants, setOccupants] = useState<Occupant[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    type: "property" | "occupant";
    id: string;
  } | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();

      // Fetch properties
      const { data: properties, error: propertiesError } = await supabase
        .from('properties')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      // Ensure description is always a string, not undefined
      const propertiesWithDefaults = ((properties as any[]) || []).map((p: any) => ({
        ...p,
        description: p.description || ''
      }));

      // Fetch occupants
      const { data: occupants, error: occupantsError } = await supabase
        .from('occupants')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      // Fetch inquiries
      const { data: inquiries, error: inquiriesError } = await supabase
        .from('inquiries')
        .select('*')
        .eq('owner_id', user.id)
      setProperties(propertiesWithDefaults);

      if (propertiesError) console.error('Properties error:', propertiesError);
      if (occupantsError) console.error('Occupants error:', occupantsError);
      if (inquiriesError) console.error('Inquiries error:', inquiriesError);

      setProperties(properties || []);
      setOccupants(occupants || []);
      
      // Use the correct field name for status
      const activeInquiries = (inquiries || []).filter(i => 
        i.status === 'active' || (i as any).status === 'active'
      );
      setInquiries(activeInquiries);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAddProperty = () => {
    setEditingProperty(undefined);
    setIsPropertyFormOpen(true);
  };

  const handleEditProperty = (property: Property) => {
    setEditingProperty(property);
    setIsPropertyFormOpen(true);
  };

  const handleDeleteProperty = async (id: string) => {
    setItemToDelete({ type: "property", id });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      if (itemToDelete.type === "property") {
        await deleteProperty(itemToDelete.id);
        toast.success("Property deleted successfully");
      } else if (itemToDelete.type === "occupant") {
        await deleteOccupant(itemToDelete.id);
        toast.success("Occupant removed successfully");
      }
      await fetchData();
    } catch (error) {
      console.error(`Error deleting ${itemToDelete.type}:`, error);
      toast.error(`Failed to delete ${itemToDelete.type}`);
    } finally {
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const handleDeleteOccupant = (id: string) => {
    setItemToDelete({ type: "occupant", id });
    setDeleteDialogOpen(true);
  };

  const handleToggleOccupantStatus = async (occupant: Occupant) => {
    try {
      const newStatus = occupant.status === "active" ? "inactive" : "active";
      await updateOccupant(
        occupant.id,
        { status: newStatus }
      );
      toast.success(`Occupant status changed to ${newStatus}`);
      await fetchData();
    } catch (error) {
      console.error("Error updating occupant status:", error);
      toast.error("Failed to update occupant status");
    }
  };

  const handleArchiveInquiry = async (id: string) => {
    try {
      await updateInquiry(id, { status: "archived" });
      await fetchData();
    } catch (error) {
      console.error("Error archiving inquiry:", error);
      toast.error("Failed to archive inquiry");
    }
  };

  const handleReplyToInquiry = (inquiry: Inquiry) => {
    setCurrentPage("messages");
    const studentName = getField<string>(inquiry, 'student_name', 'studentName');
    toast.info(`Opening messages with ${studentName}`);
  };

  const handlePropertyFormSave = async () => {
    setIsPropertyFormOpen(false);
    setEditingProperty(undefined);
    await fetchData();
  };

  // Calculate stats with proper field access
  const totalProperties = properties.length;
  const totalOccupants = occupants.filter((o) => o.status === "active").length;
  const totalInquiries = inquiries.length;
  const totalRevenue = occupants
    .filter((o) => o.status === "active")
    .reduce((sum, o) => {
      const rent = getField<number>(o, 'monthly_rent', 'monthlyRent') || 0;
      return sum + rent;
    }, 0);

  if (currentPage === "messages") {
    return (
      <div className="bg-gradient-to-b from-[#e2f0d1] relative min-h-screen w-full to-[#ffffff] via-[#e8f3da] via-[18.561%] flex flex-col">
        <Header
          user={user}
          onLogout={onLogout}
          onMessagesClick={() => setCurrentPage("dashboard")}
          onMenuClick={() => setIsMobileMenuOpen(true)}
        />

        <div className="flex-1 mt-[70px] md:mt-[100px] p-4 md:p-8 max-w-7xl mx-auto w-full">
          <button
            onClick={() => setCurrentPage("dashboard")}
            className="mb-6 flex items-center gap-2 text-[#597445] hover:opacity-70 transition-opacity"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span className="font-['Rethink_Sans:SemiBold',sans-serif] text-[18px]">
              Back to Dashboard
            </span>
          </button>

          <h1 className="font-['REM:Bold',sans-serif] text-[32px] md:text-[42px] text-[#4f6f52] mb-8">
            Messages
          </h1>

          <div className="bg-white rounded-[20px] shadow-[0px_0px_20px_0px_rgba(89,116,69,0.2)] p-6 md:p-8">
            <p className="font-['Rethink_Sans:Regular',sans-serif] text-[18px] text-[#597445] text-center">
              No messages yet. Your inquiries from students will appear here.
            </p>
          </div>
        </div>

        <div className="mt-auto">
          <Footer />
        </div>

        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          onLogout={onLogout}
          onMessagesClick={() => {
            setIsMobileMenuOpen(false);
            setCurrentPage("messages");
          }}
          user={user}
        />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-[#e2f0d1] relative min-h-screen w-full to-[#ffffff] via-[#e8f3da] via-[18.561%] flex flex-col">
      <Header
        user={user}
        onLogout={onLogout}
        onMessagesClick={() => setCurrentPage("messages")}
        onMenuClick={() => setIsMobileMenuOpen(true)}
      />

      <div className="flex-1 mt-[70px] md:mt-[100px] px-4 md:px-8 lg:px-16 xl:px-24 py-6 md:py-8 max-w-[1600px] mx-auto w-full">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="bg-[#e2f0d1] border-[#597445] border-4 rounded-[25px] p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-['Rethink_Sans:Medium',sans-serif] text-[18px] md:text-[24px] text-[rgba(0,0,0,0.7)]">
                  Total Properties
                </p>
                <p className="font-['Rethink_Sans:Bold',sans-serif] text-[32px] md:text-[40px] text-[#597445]">
                  {totalProperties}
                </p>
              </div>
              <div className="text-[60px]">🏢</div>
            </div>
          </div>

          <div className="bg-[#e2f0d1] border-[#597445] border-4 rounded-[25px] p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-['Rethink_Sans:Medium',sans-serif] text-[18px] md:text-[24px] text-[rgba(0,0,0,0.7)]">
                  Total Occupants
                </p>
                <p className="font-['Rethink_Sans:Bold',sans-serif] text-[32px] md:text-[40px] text-[#597445]">
                  {totalOccupants}
                </p>
              </div>
              <div className="text-[60px]">👥</div>
            </div>
          </div>

          <div className="bg-[#e2f0d1] border-[#597445] border-4 rounded-[25px] p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-['Rethink_Sans:Medium',sans-serif] text-[18px] md:text-[24px] text-[rgba(0,0,0,0.7)]">
                  Total Inquiries
                </p>
                <p className="font-['Rethink_Sans:Bold',sans-serif] text-[32px] md:text-[40px] text-[#597445]">
                  {totalInquiries}
                </p>
              </div>
              <div className="text-[60px]">💬</div>
            </div>
          </div>

          <div className="bg-[#e2f0d1] border-[#597445] border-4 rounded-[25px] p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-['Rethink_Sans:Medium',sans-serif] text-[18px] md:text-[24px] text-[rgba(0,0,0,0.7)]">
                  Revenue
                </p>
                <p className="font-['Rethink_Sans:Bold',sans-serif] text-[28px] md:text-[36px] text-[#597445]">
                  ₱ {totalRevenue.toLocaleString()}
                </p>
              </div>
              <div className="text-[60px]">💰</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white border-2 border-[#597445] rounded-[15px] md:rounded-[20px] p-2 mb-6 md:mb-8 flex gap-2 md:gap-4 overflow-x-auto scrollbar-hide">
          {["Properties", "Occupants", "Inquiries", "Analytics"].map((tab) => (
            <button
              key={tab}
              onClick={() => setCurrentTab(tab.toLowerCase() as any)}
              className={`px-3 md:px-6 py-2 md:py-3 rounded-[12px] md:rounded-[15px] font-['Rethink_Sans:Medium',sans-serif] text-[14px] md:text-[18px] whitespace-nowrap transition-all cursor-pointer active:scale-95 ${
                currentTab === tab.toLowerCase()
                  ? "bg-[#597445] text-white shadow-md"
                  : "bg-transparent text-black hover:bg-[#e7f0dc] hover:shadow-sm"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-[20px] shadow-[0px_0px_20px_0px_#597445] p-6 md:p-8 mb-8">
          <h2 className="font-['Rethink_Sans:Bold',sans-serif] text-[24px] md:text-[32px] text-black mb-6 capitalize">
            {currentTab}
          </h2>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#597445]"></div>
            </div>
          ) : (
            <>
              {currentTab === "properties" && (
                <div className="space-y-4">
                  {properties.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-[80px] mb-4">🏢</div>
                      <p className="font-['Rethink_Sans:Medium',sans-serif] text-[18px] md:text-[20px] text-[#597445] mb-2">
                        No properties yet
                      </p>
                      <p className="font-['Rethink_Sans:Regular',sans-serif] text-[14px] md:text-[16px] text-[rgba(0,0,0,0.6)] mb-6">
                        Start by adding your first property to attract students
                      </p>
                    </div>
                  ) : (
                    properties.map((property) => (
                      <div
                        key={property.id}
                        className="bg-[#e7f0dc] border-2 border-[#597445] rounded-[15px] p-4 md:p-6"
                      >
                        <div className="flex justify-between items-start flex-wrap gap-4">
                          <div className="flex-1 min-w-[200px]">
                            <h3 className="font-['Rethink_Sans:Bold',sans-serif] text-[18px] md:text-[24px] text-[#4f6f52] mb-2">
                              {property.title}
                            </h3>
                            <p className="font-['Rethink_Sans:Regular',sans-serif] text-[14px] md:text-[16px] text-[#597445] mb-2">
                              {property.address}
                            </p>
                            <div className="flex items-center gap-4 mb-3">
                              <span className="font-['Rethink_Sans:SemiBold',sans-serif] text-[16px] md:text-[20px] text-[#79ac78]">
                                ₱{property.price.toLocaleString()}/month
                              </span>
                              <span
                                className={`${
                                  property.availability === "Available"
                                    ? "bg-[#79ac78]"
                                    : "bg-gray-400"
                                } text-white px-3 py-1 rounded-full text-[12px] md:text-[14px]`}
                              >
                                {property.availability}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <span className="bg-white px-2 py-1 rounded-[8px] text-[12px] md:text-[14px] text-[#597445]">
                                {property.bedrooms} Bedroom
                                {property.bedrooms > 1 ? "s" : ""}
                              </span>
                              <span className="bg-white px-2 py-1 rounded-[8px] text-[12px] md:text-[14px] text-[#597445]">
                                {property.bathrooms} Bathroom
                                {property.bathrooms > 1 ? "s" : ""}
                              </span>
                              <span className="bg-white px-2 py-1 rounded-[8px] text-[12px] md:text-[14px] text-[#597445]">
                                {property.gender}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            <button
                              onClick={() => handleEditProperty(property)}
                              className="bg-[#597445] text-white px-4 py-2 rounded-[10px] hover:bg-[#4f6f52] transition-all hover:shadow-lg active:scale-95 cursor-pointer text-[14px] md:text-[16px] flex items-center gap-2"
                            >
                              <Edit2 size={16} />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProperty(property.id)}
                              className="bg-white text-[#597445] border-2 border-[#597445] px-4 py-2 rounded-[10px] hover:bg-[#f5f5f5] transition-all hover:shadow-md active:scale-95 cursor-pointer text-[14px] md:text-[16px] flex items-center gap-2"
                            >
                              <Trash2 size={16} />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}

                  <button
                    onClick={handleAddProperty}
                    className="w-full bg-[#79ac78] text-white rounded-[15px] py-4 font-['Rethink_Sans:SemiBold',sans-serif] text-[16px] md:text-[18px] hover:bg-[#6b9b69] transition-all hover:shadow-lg active:scale-98 cursor-pointer"
                  >
                    + Add New Property
                  </button>
                </div>
              )}

              {currentTab === "occupants" && (
                <div className="space-y-6">
                  {occupants.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-[80px] mb-4">👥</div>
                      <p className="font-['Rethink_Sans:Medium',sans-serif] text-[18px] md:text-[20px] text-[#597445] mb-2">
                        No occupants yet
                      </p>
                      <p className="font-['Rethink_Sans:Regular',sans-serif] text-[14px] md:text-[16px] text-[rgba(0,0,0,0.6)]">
                        Your occupants will appear here once properties are
                        rented
                      </p>
                    </div>
                  ) : (
                    // Group occupants by property
                    properties.map((property) => {
                      const propertyOccupants = occupants.filter(
                        (o) => getField<string>(o, 'property_id', 'propertyId') === property.id
                      );
                      if (propertyOccupants.length === 0) return null;

                      return (
                        <div key={property.id} className="space-y-4">
                          <h3 className="font-['Rethink_Sans:Bold',sans-serif] text-[18px] md:text-[22px] text-[#4f6f52] border-b-2 border-[#e7f0dc] pb-2">
                            {property.title}
                          </h3>
                          {propertyOccupants.map((occupant) => {
                            const roomNumber = getField<string>(occupant, 'room_number', 'roomNumber');
                            const monthlyRent = getField<number>(occupant, 'monthly_rent', 'monthlyRent') || 0;
                            const paidUntil = getField<string>(occupant, 'paid_until', 'paidUntil');

                            return (
                              <div
                                key={occupant.id}
                                className="bg-[#e7f0dc] border-2 border-[#597445] rounded-[15px] p-4 md:p-6"
                              >
                                <div className="flex justify-between items-center flex-wrap gap-4">
                                  <div className="flex items-center gap-4 flex-1">
                                    <div className="bg-[#597445] text-white rounded-full w-12 h-12 md:w-16 md:h-16 flex items-center justify-center text-[20px] md:text-[24px] font-['Rethink_Sans:Bold',sans-serif]">
                                      {occupant.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")
                                        .substring(0, 2)
                                        .toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                      <h4 className="font-['Rethink_Sans:Bold',sans-serif] text-[16px] md:text-[20px] text-[#4f6f52]">
                                        {occupant.name}
                                      </h4>
                                      <p className="font-['Rethink_Sans:Regular',sans-serif] text-[14px] md:text-[16px] text-[#597445]">
                                        Room {roomNumber}
                                      </p>
                                      <p className="font-['Rethink_Sans:Regular',sans-serif] text-[12px] md:text-[14px] text-[#79ac78]">
                                        Paid until:{" "}
                                        {paidUntil ? new Date(paidUntil).toLocaleDateString("en-US", {
                                          year: "numeric",
                                          month: "short",
                                          day: "numeric",
                                        }) : 'Not set'}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <div className="flex flex-col items-end gap-2">
                                      <span className="font-['Rethink_Sans:Bold',sans-serif] text-[16px] md:text-[20px] text-[#4f6f52]">
                                        ₱{monthlyRent.toLocaleString()}/mo
                                      </span>
                                      <button
                                        onClick={() =>
                                          handleToggleOccupantStatus(occupant)
                                        }
                                        className={`${
                                          occupant.status === "active"
                                            ? "bg-[#79ac78]"
                                            : "bg-gray-400"
                                        } text-white px-3 py-1 rounded-full text-[12px] cursor-pointer hover:opacity-80 transition-all active:scale-95 hover:shadow-md`}
                                      >
                                        {occupant.status === "active"
                                          ? "Active"
                                          : "Inactive"}
                                      </button>
                                    </div>
                                    <button
                                      onClick={() =>
                                        handleDeleteOccupant(occupant.id)
                                      }
                                      className="text-[#597445] hover:text-red-600 transition-all p-2 hover:bg-red-50 rounded-lg active:scale-95 cursor-pointer"
                                      title="Remove occupant"
                                    >
                                      <Trash2 size={20} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {currentTab === "inquiries" && (
                <div className="space-y-4">
                  {inquiries.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-[80px] mb-4">💬</div>
                      <p className="font-['Rethink_Sans:Medium',sans-serif] text-[18px] md:text-[20px] text-[#597445] mb-2">
                        No inquiries yet
                      </p>
                      <p className="font-['Rethink_Sans:Regular',sans-serif] text-[14px] md:text-[16px] text-[rgba(0,0,0,0.6)]">
                        Student inquiries about your properties will appear here
                      </p>
                    </div>
                  ) : (
                    inquiries.map((inquiry) => {
                      const studentName = getField<string>(inquiry, 'student_name', 'studentName');
                      const propertyTitle = getField<string>(inquiry, 'property_title', 'propertyTitle');

                      return (
                        <div
                          key={inquiry.id}
                          className="bg-[#e7f0dc] border-2 border-[#597445] rounded-[15px] p-4 md:p-6"
                        >
                          <div className="flex justify-between items-start flex-wrap gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="bg-[#597445] text-white rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-[16px] md:text-[18px] font-['Rethink_Sans:Bold',sans-serif]">
                                  {studentName
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .substring(0, 2)
                                    .toUpperCase()}
                                </div>
                                <div>
                                  <h3 className="font-['Rethink_Sans:Bold',sans-serif] text-[16px] md:text-[20px] text-[#4f6f52]">
                                    {studentName}
                                  </h3>
                                  <p className="font-['Rethink_Sans:Regular',sans-serif] text-[12px] md:text-[14px] text-[#597445]">
                                    {new Date(inquiry.created_at).toLocaleString(
                                      "en-US",
                                      {
                                        month: "short",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      }
                                    )}
                                  </p>
                                </div>
                              </div>
                              <p className="font-['Rethink_Sans:Regular',sans-serif] text-[14px] md:text-[16px] text-[#597445] mb-2">
                                "{inquiry.message}"
                              </p>
                              <p className="font-['Rethink_Sans:Medium',sans-serif] text-[12px] md:text-[14px] text-[#79ac78]">
                                Property: {propertyTitle}
                              </p>
                            </div>
                            <div className="flex gap-2 flex-wrap">
                              <button
                                onClick={() => handleReplyToInquiry(inquiry)}
                                className="bg-[#597445] text-white px-4 py-2 rounded-[10px] hover:bg-[#4f6f52] transition-all hover:shadow-lg active:scale-95 cursor-pointer text-[14px]"
                              >
                                Reply
                              </button>
                              <button
                                onClick={() => handleArchiveInquiry(inquiry.id)}
                                className="bg-white text-[#597445] border-2 border-[#597445] px-4 py-2 rounded-[10px] hover:bg-[#f5f5f5] transition-all hover:shadow-md active:scale-95 cursor-pointer text-[14px]"
                              >
                                Archive
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {currentTab === "analytics" && (
                <div className="space-y-6">
                  {properties.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-[80px] mb-4">📊</div>
                      <p className="font-['Rethink_Sans:Medium',sans-serif] text-[18px] md:text-[20px] text-[#597445] mb-2">
                        No analytics available yet
                      </p>
                      <p className="font-['Rethink_Sans:Regular',sans-serif] text-[14px] md:text-[16px] text-[rgba(0,0,0,0.6)]">
                        Add properties to see performance analytics
                      </p>
                    </div>
                  ) : (
                    <>
                      <div>
                        <h3 className="font-['Rethink_Sans:SemiBold',sans-serif] text-[20px] md:text-[26px] text-black mb-2">
                          Property Performance
                        </h3>
                        <p className="font-['Rethink_Sans:Italic',sans-serif] italic text-[14px] md:text-[16px] text-[rgba(0,0,0,0.8)] mb-6">
                          Views and Inquiries of your properties
                        </p>

                        <div className="space-y-4">
                          {properties.map((property) => {
                            const propertyInquiries = inquiries.filter(
                              (i) => getField<string>(i, 'property_id', 'propertyId') === property.id
                            ).length;
                            return (
                              <div
                                key={property.id}
                                className="bg-[#eeeeee] border border-[#597445] rounded-[10px] p-4"
                              >
                                <div className="flex justify-between items-center flex-wrap gap-4">
                                  <div>
                                    <p className="font-['Rethink_Sans:SemiBold',sans-serif] text-[16px] md:text-[20px] text-black">
                                      {property.title}
                                    </p>
                                    <p className="font-['Rethink_Sans:SemiBold',sans-serif] text-[14px] md:text-[16px] text-[rgba(0,0,0,0.6)]">
                                      {property.address}
                                    </p>
                                  </div>
                                  <div className="space-y-2">
                                    <div className="bg-white border border-[#597445] rounded-[10px] px-4 py-1">
                                      <p className="font-['Rethink_Sans:Regular',sans-serif] text-[12px] text-black">
                                        {property.reviews || 0} views this month
                                      </p>
                                    </div>
                                    <div className="bg-[#597445] rounded-[10px] px-4 py-1">
                                      <p className="font-['Rethink_Sans:Regular',sans-serif] text-[12px] text-white">
                                        {propertyInquiries} Inquiries
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-['Rethink_Sans:SemiBold',sans-serif] text-[20px] md:text-[26px] text-black mb-2">
                          Revenue Overview
                        </h3>
                        <p className="font-['Rethink_Sans:Italic',sans-serif] italic text-[14px] md:text-[16px] text-[rgba(0,0,0,0.8)] mb-6">
                          Expected monthly income from occupied rooms
                        </p>

                        <div className="space-y-3">
                          <div className="flex justify-between items-center flex-wrap gap-2">
                            <p className="font-['Rethink_Sans:Bold',sans-serif] text-[16px] md:text-[22px] text-black">
                              Total Properties:
                            </p>
                            <p className="font-['Rethink_Sans:Bold',sans-serif] text-[16px] md:text-[20px] text-[#597445]">
                              {totalProperties}{" "}
                              {totalProperties === 1
                                ? "Property"
                                : "Properties"}
                            </p>
                          </div>
                          <div className="flex justify-between items-center flex-wrap gap-2">
                            <p className="font-['Rethink_Sans:Bold',sans-serif] text-[16px] md:text-[22px] text-black">
                              Total Number of Occupants:
                            </p>
                            <p className="font-['Rethink_Sans:Bold',sans-serif] text-[16px] md:text-[20px] text-[#597445]">
                              {totalOccupants}{" "}
                              {totalOccupants === 1 ? "Occupant" : "Occupants"}
                            </p>
                          </div>
                          <div className="flex justify-between items-center flex-wrap gap-2">
                            <p className="font-['Rethink_Sans:Bold',sans-serif] text-[16px] md:text-[22px] text-black">
                              Available Rooms:
                            </p>
                            <p className="font-['Rethink_Sans:Bold',sans-serif] text-[16px] md:text-[20px] text-[#597445]">
                              {
                                properties.filter(
                                  (p) => p.availability === "Available"
                                ).length
                              }{" "}
                              Rooms
                            </p>
                          </div>
                          <div className="flex justify-between items-center flex-wrap gap-2">
                            <p className="font-['Rethink_Sans:Bold',sans-serif] text-[16px] md:text-[22px] text-black">
                              Total Monthly Revenue:
                            </p>
                            <p className="font-['Rethink_Sans:Bold',sans-serif] text-[16px] md:text-[20px] text-[#597445]">
                              ₱ {totalRevenue.toLocaleString()}.00
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="mt-auto">
        <Footer />
      </div>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onLogout={onLogout}
        onMessagesClick={() => {
          setIsMobileMenuOpen(false);
          setCurrentPage("messages");
        }}
        user={user}
      />

      <PropertyForm
        isOpen={isPropertyFormOpen}
        onClose={() => {
          setIsPropertyFormOpen(false);
          setEditingProperty(undefined);
        }}
        onSave={handlePropertyFormSave}
        accessToken={user.accessToken}
        property={editingProperty}
        currentUser={{
          id: user.id,
          name: user.name,
          email: user.email,
        }}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this{" "}
              {itemToDelete?.type}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setItemToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}