import { useCallback, useEffect, useMemo, useState } from "react";
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
import {
  BadgeCheck,
  Building2,
  Compass,
  Info,
  LineChart,
  LogOut,
  Menu,
  MessageSquare,
  Pencil,
  Phone,
  Plus,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { createAuthenticatedClient } from "../utils/supabase/client";
import { Property } from "../utils/api";
import { User } from "../App";
import AboutPage from "./AboutPage";
import ContactPage from "./ContactPage";
import MessagingPage from "./MessagingPage";
import PropertyDetails from "./PropertyDetails";
import PropertyForm from "./PropertyForm";

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
  student_id?: string;
  studentId?: string;
}

interface OwnerDashboardProps {
  user: User;
  onLogout: () => void;
  onOpenMessaging: (
    recipientId: string,
    recipientName: string,
    propertyId?: string,
    propertyTitle?: string
  ) => void;
}

type DashboardPage = "dashboard" | "messages" | "about" | "contact";
type DashboardTab = "properties" | "occupants" | "inquiries" | "analytics";

const getField = <T,>(value: any, primary: string, fallback: string): T =>
  value?.[primary] !== undefined ? value[primary] : value?.[fallback];

const getDataLoadMessage = (
  error: any,
  fallback: string
) => {
  const message = String(error?.message || "").toLowerCase();

  if (message.includes("does not exist") || message.includes("relation")) {
    return "The matching Supabase table is not ready yet for this feature.";
  }

  if (
    message.includes("jwt") ||
    message.includes("permission") ||
    message.includes("row-level security")
  ) {
    return "Your session is active, but this feature still needs the right Supabase permissions.";
  }

  return fallback;
};

const removeProperty = async (id: string, accessToken: string) => {
  const supabase = createAuthenticatedClient(accessToken);
  const { error } = await supabase.from("properties").delete().eq("id", id);
  if (error) throw error;
};

const removeOccupant = async (id: string, accessToken: string) => {
  const supabase = createAuthenticatedClient(accessToken);
  const { error } = await supabase.from("occupants").delete().eq("id", id);
  if (error) throw error;
};

const patchOccupant = async (
  id: string,
  updates: Partial<Occupant>,
  accessToken: string
) => {
  const supabase = createAuthenticatedClient(accessToken);
  const { error } = await supabase.from("occupants").update(updates).eq("id", id);
  if (error) throw error;
};

const patchInquiry = async (
  id: string,
  updates: Partial<Inquiry>,
  accessToken: string
) => {
  const supabase = createAuthenticatedClient(accessToken);
  const { error } = await supabase.from("inquiries").update(updates).eq("id", id);
  if (error) throw error;
};

function Logo() {
  return (
    <div className="boardmap-logo">
      <img src="/BoardMap_Logo_White.png" alt="BoardMap logo" />
      <div>
        <p className="boardmap-logo-title">BoardMap</p>
        <p className="boardmap-logo-tagline">Owner workspace for listings and inquiries</p>
      </div>
    </div>
  );
}

function Header({
  user,
  onMessagesClick,
  onAboutClick,
  onContactClick,
  onLogout,
  onMenuClick,
}: {
  user: User;
  onMessagesClick: () => void;
  onAboutClick: () => void;
  onContactClick: () => void;
  onLogout: () => void;
  onMenuClick: () => void;
}) {
  return (
    <header className="boardmap-topbar">
      <div className="boardmap-topbar-inner">
        <Logo />

        <div className="hidden md:flex boardmap-nav">
          <button type="button" className="boardmap-button-ghost" onClick={onMessagesClick}>
            <MessageSquare size={18} />
            Messages
          </button>
          <button type="button" className="boardmap-button-ghost" onClick={onAboutClick}>
            <Info size={18} />
            About
          </button>
          <button type="button" className="boardmap-button-ghost" onClick={onContactClick}>
            <Phone size={18} />
            Contact
          </button>
          <div className="boardmap-chip">
            <BadgeCheck size={16} />
            {user.name}
          </div>
          <button type="button" className="boardmap-button-secondary" onClick={onLogout}>
            <LogOut size={16} />
            Log out
          </button>
        </div>

        <button type="button" className="boardmap-icon-button md:hidden" onClick={onMenuClick}>
          <Menu size={20} />
        </button>
      </div>
    </header>
  );
}

function MobileMenu({
  isOpen,
  onClose,
  onMessagesClick,
  onAboutClick,
  onContactClick,
  onLogout,
  user,
}: {
  isOpen: boolean;
  onClose: () => void;
  onMessagesClick: () => void;
  onAboutClick: () => void;
  onContactClick: () => void;
  onLogout: () => void;
  user: User;
}) {
  useEffect(() => {
    document.body.classList.toggle("mobile-menu-open", isOpen);
    return () => document.body.classList.remove("mobile-menu-open");
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="boardmap-modal-overlay" onClick={onClose}>
      <aside
        className="boardmap-panel-dark"
        style={{ width: "min(360px, 100%)", marginLeft: "auto", padding: "1.25rem" }}
        onClick={(event) => event.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <strong style={{ display: "block", fontSize: "1.1rem" }}>{user.name}</strong>
            <span style={{ color: "rgba(235,251,234,0.74)" }}>Owner dashboard</span>
          </div>
          <button type="button" className="boardmap-icon-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: "grid", gap: "0.8rem", marginTop: "1.2rem" }}>
          <button type="button" className="boardmap-button-secondary" onClick={onMessagesClick}>
            <MessageSquare size={18} />
            Messages
          </button>
          <button type="button" className="boardmap-button-secondary" onClick={onAboutClick}>
            <Info size={18} />
            About
          </button>
          <button type="button" className="boardmap-button-secondary" onClick={onContactClick}>
            <Phone size={18} />
            Contact
          </button>
          <button type="button" className="boardmap-button-primary" onClick={onLogout}>
            <LogOut size={18} />
            Log out
          </button>
        </div>
      </aside>
    </div>
  );
}

function PageBackHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="boardmap-panel" style={{ padding: "1rem", marginBottom: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.9rem" }}>
        <button type="button" className="boardmap-button-secondary" onClick={onBack}>
          <Compass size={18} />
          Back
        </button>
        <div>
          <h2 className="boardmap-section-title" style={{ fontSize: "1.35rem" }}>
            {title}
          </h2>
          <p className="boardmap-helper">Return to the owner dashboard without losing your current data.</p>
        </div>
      </div>
    </div>
  );
}

function EmptyState({
  title,
  description,
  icon,
  action,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="boardmap-empty-state">
      <div style={{ color: "#2f6a45" }}>{icon}</div>
      <strong>{title}</strong>
      <p>{description}</p>
      {action && <div style={{ marginTop: "1rem" }}>{action}</div>}
    </div>
  );
}

export default function OwnerDashboard({
  user,
  onLogout,
  onOpenMessaging,
}: OwnerDashboardProps) {
  const [page, setPage] = useState<DashboardPage>("dashboard");
  const [tab, setTab] = useState<DashboardTab>("properties");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPropertyFormOpen, setIsPropertyFormOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | undefined>();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [occupants, setOccupants] = useState<Occupant[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<
    { type: "property" | "occupant"; id: string } | null
  >(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const supabase = createAuthenticatedClient(user.accessToken);

      const { data: nextProperties, error: propertiesError } = await supabase
        .from("properties")
        .select("*")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false });

      if (propertiesError) {
        throw propertiesError;
      }

      setProperties((nextProperties || []) as Property[]);
      setDashboardError(null);

      const { data: nextOccupants, error: occupantsError } = await supabase
        .from("occupants")
        .select("*")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false });

      if (occupantsError) {
        console.warn("Unable to load occupants:", occupantsError.message);
        setOccupants([]);
      } else {
        setOccupants(nextOccupants || []);
      }

      const { data: nextInquiries, error: inquiriesError } = await supabase
        .from("inquiries")
        .select("*")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false });

      if (inquiriesError) {
        console.warn("Unable to load inquiries:", inquiriesError.message);
        setInquiries([]);
      } else {
        setInquiries(nextInquiries || []);
      }
    } catch (error) {
      console.error("Error loading owner dashboard data:", error);
      setDashboardError(
        getDataLoadMessage(
          error,
          "We could not load the owner workspace right now. You can still try again below."
        )
      );
    } finally {
      setLoading(false);
    }
  }, [user.accessToken, user.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    document.body.classList.toggle("property-details-open", Boolean(selectedProperty));
    return () => document.body.classList.remove("property-details-open");
  }, [selectedProperty]);

  const totalProperties = properties.length;
  const totalOccupants = occupants.filter((occupant) => occupant.status === "active").length;
  const totalInquiries = inquiries.length;
  const totalRevenue = occupants
    .filter((occupant) => occupant.status === "active")
    .reduce((sum, occupant) => {
      const rent = getField<number>(occupant, "monthly_rent", "monthlyRent") || 0;
      return sum + rent;
    }, 0);

  const activeInquiries = inquiries.filter((inquiry) => inquiry.status === "active");
  const archivedInquiries = inquiries.filter((inquiry) => inquiry.status === "archived");

  const propertyOccupantMap = useMemo(() => {
    const nextMap = new Map<string, Occupant[]>();
    occupants.forEach((occupant) => {
      const propertyId = getField<string>(occupant, "property_id", "propertyId");
      if (!propertyId) return;
      const currentEntries = nextMap.get(propertyId) || [];
      nextMap.set(propertyId, [...currentEntries, occupant]);
    });
    return nextMap;
  }, [occupants]);

  const handlePropertyFormSave = async () => {
    setIsPropertyFormOpen(false);
    setEditingProperty(undefined);
    await fetchData();
  };

  const handleDeleteRequest = (type: "property" | "occupant", id: string) => {
    setItemToDelete({ type, id });
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      if (itemToDelete.type === "property") {
        await removeProperty(itemToDelete.id, user.accessToken);
        toast.success("Property deleted successfully.");
      } else {
        await removeOccupant(itemToDelete.id, user.accessToken);
        toast.success("Occupant removed successfully.");
      }
      await fetchData();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("We could not complete the delete action.");
    } finally {
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const handleToggleOccupantStatus = async (occupant: Occupant) => {
    try {
      const nextStatus = occupant.status === "active" ? "inactive" : "active";
      await patchOccupant(occupant.id, { status: nextStatus }, user.accessToken);
      toast.success(`Occupant marked as ${nextStatus}.`);
      await fetchData();
    } catch (error) {
      console.error("Occupant update error:", error);
      toast.error("Unable to update occupant status.");
    }
  };

  const handleArchiveInquiry = async (id: string) => {
    try {
      await patchInquiry(id, { status: "archived" }, user.accessToken);
      toast.success("Inquiry archived.");
      await fetchData();
    } catch (error) {
      console.error("Inquiry update error:", error);
      toast.error("Unable to archive inquiry.");
    }
  };

  const handleReplyToInquiry = (inquiry: Inquiry) => {
    const studentId = getField<string>(inquiry, "student_id", "studentId");
    const studentName = getField<string>(inquiry, "student_name", "studentName") || "Student";
    const propertyTitle = getField<string>(inquiry, "property_title", "propertyTitle") || "Listing";
    const propertyId = getField<string>(inquiry, "property_id", "propertyId");

    if (!studentId) {
      toast.error("This inquiry is missing a student ID, so we cannot open a chat yet.");
      return;
    }

    onOpenMessaging(studentId, studentName, propertyId, propertyTitle);
  };

  const renderProperties = () => {
    if (properties.length === 0) {
      return (
        <EmptyState
          icon={<Building2 size={42} />}
          title="No properties yet"
          description="Add your first listing to start receiving student views and inquiries."
          action={
            <button
              type="button"
              className="boardmap-button-primary"
              onClick={() => {
                setEditingProperty(undefined);
                setIsPropertyFormOpen(true);
              }}
            >
              <Plus size={18} />
              Add property
            </button>
          }
        />
      );
    }

    return (
      <div style={{ display: "grid", gap: "0.9rem" }}>
        {properties.map((property) => (
          <article key={property.id} className="boardmap-list-card boardmap-property-card">
            <div className="boardmap-property-summary">
                <div className="boardmap-chip-row" style={{ marginBottom: "0.75rem" }}>
                  <span className="boardmap-chip">{property.availability}</span>
                  <span className="boardmap-chip">{property.gender}</span>
                  <span className="boardmap-chip">{property.type}</span>
                </div>
                <h3 className="boardmap-section-title" style={{ fontSize: "1.35rem" }}>
                  {property.title}
                </h3>
                <p className="boardmap-section-copy">{property.address}</p>
                <div className="boardmap-inline-meta" style={{ marginTop: "0.75rem" }}>
                  <span>PHP {Number(property.price || 0).toLocaleString()} / month</span>
                  <span>{property.bedrooms} bedrooms</span>
                  <span>{property.bathrooms} bathrooms</span>
                  <span>
                    {propertyOccupantMap.get(property.id)?.length || 0} occupant
                    {(propertyOccupantMap.get(property.id)?.length || 0) === 1 ? "" : "s"}
                  </span>
                </div>
            </div>
            <div className="boardmap-property-actions">
                <button
                  type="button"
                  className="boardmap-button-secondary boardmap-property-action"
                  onClick={() => setSelectedProperty(property)}
                >
                  View
                </button>
                <button
                  type="button"
                  className="boardmap-button-secondary boardmap-property-action"
                  onClick={() => {
                    setEditingProperty(property);
                    setIsPropertyFormOpen(true);
                  }}
                >
                  <Pencil size={16} />
                  Edit
                </button>
                <button
                  type="button"
                  className="boardmap-button-secondary boardmap-property-action boardmap-property-action-danger"
                  onClick={() => handleDeleteRequest("property", property.id)}
                >
                  <Trash2 size={16} />
                  Delete
                </button>
            </div>
          </article>
        ))}

        <button
          type="button"
          className="boardmap-button-primary"
          onClick={() => {
            setEditingProperty(undefined);
            setIsPropertyFormOpen(true);
          }}
        >
          <Plus size={18} />
          Add another property
        </button>
      </div>
    );
  };

  const renderOccupants = () => {
    if (occupants.length === 0) {
      return (
        <EmptyState
          icon={<Users size={42} />}
          title="No occupants yet"
          description="Occupants will appear here once your listings have active tenants."
        />
      );
    }

    return (
      <div style={{ display: "grid", gap: "0.9rem" }}>
        {occupants.map((occupant) => {
          const roomNumber = getField<string>(occupant, "room_number", "roomNumber") || "Unassigned";
          const monthlyRent = getField<number>(occupant, "monthly_rent", "monthlyRent") || 0;
          const paidUntil = getField<string>(occupant, "paid_until", "paidUntil");
          const propertyId = getField<string>(occupant, "property_id", "propertyId");
          const propertyTitle = properties.find((property) => property.id === propertyId)?.title || "Listing";

          return (
            <article key={occupant.id} className="boardmap-list-card">
              <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                <div style={{ display: "flex", gap: "0.9rem", alignItems: "flex-start", flex: 1 }}>
                  <div className="boardmap-avatar">
                    {occupant.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <div>
                    <strong style={{ display: "block", fontSize: "1rem" }}>{occupant.name}</strong>
                    <p className="boardmap-helper" style={{ marginTop: "0.3rem" }}>
                      {propertyTitle} - {roomNumber}
                    </p>
                    <div className="boardmap-inline-meta" style={{ marginTop: "0.65rem" }}>
                      <span>PHP {monthlyRent.toLocaleString()} / month</span>
                      <span>Status: {occupant.status}</span>
                      <span>
                        Paid until {paidUntil ? new Date(paidUntil).toLocaleDateString() : "not set"}
                      </span>
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                  <button
                    type="button"
                    className="boardmap-button-secondary"
                    onClick={() => handleToggleOccupantStatus(occupant)}
                  >
                    Mark {occupant.status === "active" ? "inactive" : "active"}
                  </button>
                  <button
                    type="button"
                    className="boardmap-button-primary"
                    onClick={() => handleDeleteRequest("occupant", occupant.id)}
                  >
                    <Trash2 size={16} />
                    Remove
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    );
  };

  const renderInquiries = () => {
    if (inquiries.length === 0) {
      return (
        <EmptyState
          icon={<MessageSquare size={42} />}
          title="No inquiries yet"
          description="When students message you from a listing, those inquiry threads will show up here."
        />
      );
    }

    const renderInquirySection = (title: string, items: Inquiry[], archived = false) => {
      if (items.length === 0) {
        return null;
      }

      return (
        <section style={{ display: "grid", gap: "0.75rem" }}>
          <h3 className="boardmap-section-title" style={{ fontSize: "1.2rem" }}>
            {title}
          </h3>
          {items.map((inquiry) => {
            const studentName = getField<string>(inquiry, "student_name", "studentName") || "Student";
            const propertyTitle = getField<string>(inquiry, "property_title", "propertyTitle") || "Listing";

            return (
              <article
                key={inquiry.id}
                className="boardmap-list-card boardmap-owner-inquiry-card"
                style={{ opacity: archived ? 0.72 : 1 }}
              >
                <div className="boardmap-owner-inquiry-content">
                  <div className="boardmap-owner-inquiry-main">
                    <div className="boardmap-owner-inquiry-heading">
                      <strong style={{ display: "block", fontSize: "1rem" }}>{studentName}</strong>
                      <span className="boardmap-chip">{propertyTitle}</span>
                    </div>
                    <p className="boardmap-helper boardmap-owner-inquiry-meta" style={{ marginTop: "0.35rem" }}>
                      {new Date(inquiry.created_at).toLocaleString()}
                    </p>
                    <p className="boardmap-section-copy boardmap-owner-inquiry-message" style={{ marginTop: "0.8rem" }}>
                      "{inquiry.message}"
                    </p>
                  </div>
                  <div className="boardmap-owner-inquiry-actions">
                    <button
                      type="button"
                      className="boardmap-button-secondary"
                      onClick={() => handleReplyToInquiry(inquiry)}
                    >
                      Reply
                    </button>
                    {!archived && (
                      <button
                        type="button"
                        className="boardmap-button-primary"
                        onClick={() => handleArchiveInquiry(inquiry.id)}
                      >
                        Archive
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      );
    };

    return (
      <div style={{ display: "grid", gap: "1rem" }}>
        {renderInquirySection("Active inquiries", activeInquiries)}
        {renderInquirySection("Archived inquiries", archivedInquiries, true)}
      </div>
    );
  };

  const renderAnalytics = () => {
    if (properties.length === 0) {
      return (
        <EmptyState
          icon={<LineChart size={42} />}
          title="No analytics yet"
          description="Once you add listings and start receiving inquiries, this area will summarize the activity."
        />
      );
    }

    return (
      <div style={{ display: "grid", gap: "1rem" }}>
        <div className="boardmap-kpi-grid">
          <div className="boardmap-kpi-card">
            <span>Properties</span>
            <strong>{totalProperties}</strong>
          </div>
          <div className="boardmap-kpi-card">
            <span>Active occupants</span>
            <strong>{totalOccupants}</strong>
          </div>
          <div className="boardmap-kpi-card">
            <span>Inquiries</span>
            <strong>{totalInquiries}</strong>
          </div>
          <div className="boardmap-kpi-card">
            <span>Monthly revenue</span>
            <strong>PHP {totalRevenue.toLocaleString()}</strong>
          </div>
        </div>

        {properties.map((property) => {
          const propertyInquiries = inquiries.filter((inquiry) => {
            const inquiryPropertyId = getField<string>(inquiry, "property_id", "propertyId");
            return inquiryPropertyId === property.id;
          }).length;
          const propertyOccupants = propertyOccupantMap.get(property.id)?.length || 0;

          return (
            <article key={property.id} className="boardmap-list-card">
              <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                <div>
                  <strong style={{ display: "block", fontSize: "1rem" }}>{property.title}</strong>
                  <p className="boardmap-helper" style={{ marginTop: "0.25rem" }}>
                    {property.address}
                  </p>
                </div>
                <div className="boardmap-inline-meta">
                  <span>{propertyInquiries} inquiries</span>
                  <span>{propertyOccupants} occupants</span>
                  <span>{property.availability}</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    );
  };

  const renderDashboard = () => (
    <div style={{ display: "grid", gap: "1rem" }}>
      <section className="boardmap-panel-strong boardmap-owner-hero-panel" style={{ padding: "1.5rem" }}>
        <span className="boardmap-eyebrow">
          <Building2 size={16} />
          Owner workspace
        </span>
        <div className="boardmap-hero-grid boardmap-owner-hero-grid" style={{ marginTop: "1rem" }}>
          <div className="boardmap-owner-hero-copy">
            <h1 className="boardmap-section-title boardmap-owner-hero-title">
              Manage listings, occupancy, and student inquiries from one green dashboard.
            </h1>
          </div>
          <div className="boardmap-kpi-grid boardmap-owner-kpi-grid">
            <div className="boardmap-kpi-card">
              <span>Properties</span>
              <strong>{totalProperties}</strong>
            </div>
            <div className="boardmap-kpi-card">
              <span>Occupants</span>
              <strong>{totalOccupants}</strong>
            </div>
            <div className="boardmap-kpi-card">
              <span>Inquiries</span>
              <strong>{totalInquiries}</strong>
            </div>
            <div className="boardmap-kpi-card">
              <span>Revenue</span>
              <strong>PHP {totalRevenue.toLocaleString()}</strong>
            </div>
          </div>
        </div>
      </section>

      <div className="boardmap-panel" style={{ padding: "0.8rem" }}>
        <div className="boardmap-subnav boardmap-owner-subnav">
          {([
            ["properties", "Properties"],
            ["occupants", "Occupants"],
            ["inquiries", "Inquiries"],
            ["analytics", "Analytics"],
          ] as [DashboardTab, string][]).map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={`boardmap-subnav-button boardmap-owner-subnav-button ${tab === value ? "boardmap-subnav-button-active" : ""}`}
              onClick={() => setTab(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <section className="boardmap-panel-strong" style={{ padding: "1.25rem" }}>
        {dashboardError && (
          <div
            className="boardmap-list-card"
            style={{
              marginBottom: "1rem",
              background: "rgba(255, 247, 245, 0.94)",
              border: "1px solid rgba(199, 81, 70, 0.18)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
              <div>
                <strong style={{ display: "block", fontSize: "1rem", color: "#173625" }}>
                  Owner data is temporarily unavailable
                </strong>
                <p className="boardmap-helper" style={{ marginTop: "0.35rem", maxWidth: 640 }}>
                  {dashboardError}
                </p>
              </div>
              <button type="button" className="boardmap-button-secondary" onClick={fetchData}>
                Try again
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <EmptyState
            icon={<Compass size={42} />}
            title="Loading owner dashboard"
            description="Pulling in your listings, occupants, and inquiry data now."
          />
        ) : tab === "properties" ? (
          renderProperties()
        ) : tab === "occupants" ? (
          renderOccupants()
        ) : tab === "inquiries" ? (
          renderInquiries()
        ) : (
          renderAnalytics()
        )}
      </section>
    </div>
  );

  const renderPageContent = () => {
    if (page === "messages") {
      return (
        <>
          <MessagingPage
            userId={user.id}
            accessToken={user.accessToken}
            onBack={() => setPage("dashboard")}
            mode="list"
          />
        </>
      );
    }

    if (page === "about") {
      return (
        <>
          <PageBackHeader title="About BoardMap" onBack={() => setPage("dashboard")} />
          <AboutPage />
        </>
      );
    }

    if (page === "contact") {
      return (
        <>
          <PageBackHeader title="Contact" onBack={() => setPage("dashboard")} />
          <ContactPage />
        </>
      );
    }

    return renderDashboard();
  };

  return (
    <div className="boardmap-page">
      <Header
        user={user}
        onMessagesClick={() => setPage("messages")}
        onAboutClick={() => setPage("about")}
        onContactClick={() => setPage("contact")}
        onLogout={onLogout}
        onMenuClick={() => setIsMobileMenuOpen(true)}
      />

      <main className="boardmap-shell boardmap-page-offset boardmap-shell-wide">
        {renderPageContent()}
      </main>

      {selectedProperty && (
        <PropertyDetails property={selectedProperty} onClose={() => setSelectedProperty(null)} />
      )}

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onMessagesClick={() => {
          setPage("messages");
          setIsMobileMenuOpen(false);
        }}
        onAboutClick={() => {
          setPage("about");
          setIsMobileMenuOpen(false);
        }}
        onContactClick={() => {
          setPage("contact");
          setIsMobileMenuOpen(false);
        }}
        onLogout={onLogout}
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
            <AlertDialogTitle>Delete this item?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. It will permanently remove the selected {itemToDelete?.type}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setItemToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
