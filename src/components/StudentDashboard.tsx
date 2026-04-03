import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BadgeCheck,
  Compass,
  Info,
  LayoutGrid,
  LogOut,
  Map as MapIcon,
  MapPin,
  Menu,
  MessageSquare,
  Phone,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FilterOptions, Property, filterProperties, getProperties } from "../utils/api";
import AboutPage from "./AboutPage";
import ContactPage from "./ContactPage";
import FilterModal from "./FilterModal";
import MessagingPage from "./MessagingPage";
import PropertyCard from "./PropertyCard";
import PropertyDetails from "./PropertyDetails";
import { User } from "../App";

interface StudentDashboardProps {
  user: User;
  onLogout: () => void;
  onOpenMessaging: (
    recipientId: string,
    recipientName: string,
    propertyId?: string,
    propertyTitle?: string
  ) => void;
}

type StudentPage = "dashboard" | "messages" | "about" | "contact";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

function Logo() {
  return (
    <div className="boardmap-logo">
      <img src="/BoardMap_Logo_White.png" alt="BoardMap logo" />
      <div>
        <p className="boardmap-logo-title">BoardMap</p>
        <p className="boardmap-logo-tagline">Student housing discovery near VSU</p>
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

  if (!isOpen) {
    return null;
  }

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
            <span style={{ color: "rgba(235,251,234,0.74)" }}>Student dashboard</span>
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

function DashboardTopRow({
  isMap,
  onToggleView,
  onOpenFilters,
  visibleCount,
  totalCount,
  activeFilterLabels,
}: {
  isMap: boolean;
  onToggleView: () => void;
  onOpenFilters: () => void;
  visibleCount: number;
  totalCount: number;
  activeFilterLabels: string[];
}) {
  return (
    <div className="boardmap-panel boardmap-dashboard-toolbar">
      <div className="boardmap-dashboard-toolbar-copy">
        <div>
          <strong className="boardmap-dashboard-summary">
            Showing {visibleCount} of {totalCount} listing{totalCount === 1 ? "" : "s"}
          </strong>
        </div>
        <div className="boardmap-chip-row" style={{ marginTop: "0.8rem" }}>
          {(activeFilterLabels.length > 0
            ? activeFilterLabels.slice(0, 4)
            : ["Near VSU", "Map + list flow", "Direct owner chat"]
          ).map((label) => (
            <span key={label} className="boardmap-chip">
              {label}
            </span>
          ))}
          {activeFilterLabels.length > 4 && (
            <span className="boardmap-chip">+{activeFilterLabels.length - 4} more</span>
          )}
        </div>
      </div>

      <div className="boardmap-dashboard-toolbar-actions">
        <div className="boardmap-subnav boardmap-dashboard-view-toggle">
          <button
            type="button"
            className={`boardmap-subnav-button ${isMap ? "boardmap-subnav-button-active" : ""}`}
            onClick={() => !isMap && onToggleView()}
          >
            <MapIcon size={16} />
            Map
          </button>
          <button
            type="button"
            className={`boardmap-subnav-button ${!isMap ? "boardmap-subnav-button-active" : ""}`}
            onClick={() => isMap && onToggleView()}
          >
            <LayoutGrid size={16} />
            List
          </button>
        </div>

        <button
          type="button"
          className="boardmap-button-secondary boardmap-dashboard-filter-button"
          onClick={onOpenFilters}
        >
          <SlidersHorizontal size={18} />
          Filters
          {activeFilterLabels.length > 0 && (
            <span className="boardmap-filter-count">{activeFilterLabels.length}</span>
          )}
        </button>
      </div>
    </div>
  );
}

function PropertyMap({
  properties,
  onPropertyClick,
}: {
  properties: Property[];
  onPropertyClick: (property: Property) => void;
}) {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return;
    }

    const map = L.map(containerRef.current, {
      zoomControl: true,
      scrollWheelZoom: true,
    }).setView([10.6777, 124.8009], 14);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    mapRef.current = map;

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    const bounds: L.LatLngExpression[] = [];

    properties.forEach((property) => {
      const location = property.location || { lat: 10.6777, lng: 124.8009 };
      const marker = L.marker([location.lat, location.lng])
        .addTo(mapRef.current!)
        .bindTooltip(
          `<div class="boardmap-map-preview">
            <strong class="boardmap-map-preview-title">${property.title}</strong>
            <span class="boardmap-map-preview-price">PHP ${Number(property.price || 0).toLocaleString()} / month</span>
            <span class="boardmap-map-preview-address">${property.address}</span>
          </div>`,
          {
            direction: "top",
            offset: [0, -18],
            opacity: 1,
            className: "boardmap-map-preview-tooltip",
          }
        )
        .on("click", () => onPropertyClick(property));

      markersRef.current.push(marker);
      bounds.push([location.lat, location.lng]);
    });

    if (bounds.length === 1) {
      mapRef.current.setView(bounds[0], 15);
    } else if (bounds.length > 1) {
      mapRef.current.fitBounds(bounds, { padding: [36, 36] });
    } else {
      mapRef.current.setView([10.6777, 124.8009], 14);
    }
  }, [onPropertyClick, properties]);

  if (properties.length === 0) {
    return (
      <div className="boardmap-empty-state">
        <MapPin size={42} style={{ margin: "0 auto", color: "#2f6a45" }} />
        <strong>No listings match these filters</strong>
        <p>Adjust your filters or switch to list view to review the available results.</p>
      </div>
    );
  }

  return (
    <div className="boardmap-panel-strong boardmap-map-shell">
      <div className="boardmap-map-header">
        <div>
          <span className="boardmap-eyebrow">
            <MapPin size={16} />
            Live map
          </span>
          <h2 className="boardmap-section-title" style={{ marginTop: "0.8rem", fontSize: "1.5rem" }}>
            Compare listings visually before you open a full profile.
          </h2>
        </div>
        <div className="boardmap-chip-row">
          <span className="boardmap-chip">{properties.length} visible</span>
          <span className="boardmap-chip">Pins update with filters</span>
        </div>
      </div>

      <div className="boardmap-map-frame">
        <div ref={containerRef} style={{ width: "100%", height: "100%", minHeight: 520 }} />
      </div>
    </div>
  );
}

function ListView({
  properties,
  onPropertyClick,
}: {
  properties: Property[];
  onPropertyClick: (property: Property) => void;
}) {
  if (properties.length === 0) {
    return (
      <div className="boardmap-empty-state">
        <Sparkles size={42} style={{ margin: "0 auto", color: "#2f6a45" }} />
        <strong>No listings match your current filters</strong>
        <p>Try widening the price range or removing a few chips to see more options.</p>
      </div>
    );
  }

  return (
    <div className="boardmap-panel-strong boardmap-results-shell">
      <div className="boardmap-results-header">
        <div>
          <span className="boardmap-eyebrow">
            <LayoutGrid size={16} />
            List view
          </span>
          <h2 className="boardmap-section-title" style={{ marginTop: "0.8rem", fontSize: "1.5rem" }}>
            Scan the best matches in a cleaner card layout.
          </h2>
          <p className="boardmap-helper" style={{ marginTop: "0.45rem" }}>
            Each card keeps price, setup, amenities, and host details in one quick glance.
          </p>
        </div>
        <span className="boardmap-chip">
          {properties.length} card{properties.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="boardmap-results-grid">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} onClick={() => onPropertyClick(property)} />
        ))}
      </div>
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
          <p className="boardmap-helper">Return to the map anytime without losing your session.</p>
        </div>
      </div>
    </div>
  );
}

export default function StudentDashboard({
  user,
  onLogout,
  onOpenMessaging,
}: StudentDashboardProps) {
  const [currentPage, setCurrentPage] = useState<StudentPage>("dashboard");
  const [isMap, setIsMap] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [0, 10000],
    propertyTypes: [],
    gender: [],
    amenities: [],
    availability: [],
    rating: 0,
  });

  const availableListings = useMemo(
    () => allProperties.filter((property) => property.availability === "Available").length,
    [allProperties]
  );

  const lowestPrice = useMemo(() => {
    if (allProperties.length === 0) {
      return 0;
    }

    return allProperties.reduce(
      (lowest, property) => Math.min(lowest, Number(property.price || 0)),
      Number(allProperties[0]?.price || 0)
    );
  }, [allProperties]);

  const activeFilterLabels = useMemo(() => {
    const labels: string[] = [];

    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000) {
      labels.push(
        `PHP ${filters.priceRange[0].toLocaleString()}-${filters.priceRange[1].toLocaleString()}`
      );
    }

    labels.push(...filters.propertyTypes);
    labels.push(...filters.gender);
    labels.push(...filters.availability);
    labels.push(...filters.amenities);

    if (filters.rating > 0) {
      labels.push(`${filters.rating}+ stars`);
    }

    return labels;
  }, [filters]);

  const loadProperties = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const properties = await getProperties();
      setAllProperties(properties);
      setFilteredProperties(filterProperties(properties, filters));
    } catch (loadError) {
      console.error("Error loading student properties:", loadError);
      setError("We could not load listings right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadProperties();
  }, [loadProperties]);

  useEffect(() => {
    setFilteredProperties(filterProperties(allProperties, filters));
  }, [allProperties, filters]);

  useEffect(() => {
    document.body.classList.toggle("property-details-open", Boolean(selectedProperty));
    return () => document.body.classList.remove("property-details-open");
  }, [selectedProperty]);

  const handlePropertyClick = useCallback((property: Property) => {
    setSelectedProperty(property);
  }, []);

  const renderDashboard = () => (
    <div style={{ display: "grid", gap: "1rem" }}>
      <section className="boardmap-panel-strong" style={{ padding: "1.2rem 1.25rem" }}>
        <span className="boardmap-eyebrow">
          <Compass size={16} />
          Student view
        </span>
        <div className="boardmap-student-hero">
          <div className="boardmap-student-hero-main" style={{ marginTop: "0.75rem" }}>
            <div className="boardmap-hero-card boardmap-student-hero-copy">
              <h1 className="boardmap-section-title" style={{ fontSize: "clamp(1.8rem, 3.4vw, 2.7rem)" }}>
                Explore nearby listings without leaving the map flow.
              </h1>
              <p className="boardmap-section-copy" style={{ maxWidth: 620, fontSize: "1.02rem" }}>
                Compare prices, switch between map and list, and message owners as soon as you find a place worth asking about.
              </p>
              <div className="boardmap-chip-row" style={{ marginTop: "0.2rem" }}>
                {(activeFilterLabels.length > 0
                  ? activeFilterLabels.slice(0, 4)
                  : ["Near VSU", "Visual map browse", "Fast owner messaging"]
                ).map((label) => (
                  <span key={label} className="boardmap-chip">
                    {label}
                  </span>
                ))}
                {activeFilterLabels.length > 4 && (
                  <span className="boardmap-chip">+{activeFilterLabels.length - 4} filters</span>
                )}
              </div>
              <div className="boardmap-student-quick-grid">
                <div className="boardmap-student-quick-card">
                  <div className="boardmap-student-quick-icon">
                    <MapIcon size={16} />
                  </div>
                  <div>
                    <strong>Map-first browsing</strong>
                  </div>
                </div>
                <div className="boardmap-student-quick-card">
                  <div className="boardmap-student-quick-icon">
                    <LayoutGrid size={16} />
                  </div>
                  <div>
                    <strong>Switch views fast</strong>
                  </div>
                </div>
                <div className="boardmap-student-quick-card">
                  <div className="boardmap-student-quick-icon">
                    <MessageSquare size={16} />
                  </div>
                  <div>
                    <strong>Owner chat ready</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="boardmap-kpi-grid boardmap-student-kpi-grid" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
              <div className="boardmap-kpi-card">
                <span>Listings</span>
                <strong>{allProperties.length}</strong>
              </div>
              <div className="boardmap-kpi-card">
                <span>Available</span>
                <strong>{availableListings}</strong>
              </div>
              <div className="boardmap-kpi-card">
                <span>Matches</span>
                <strong>{filteredProperties.length}</strong>
              </div>
              <div className="boardmap-kpi-card">
                <span>Starts at</span>
                <strong>{lowestPrice ? `PHP ${lowestPrice.toLocaleString()}` : "-"}</strong>
              </div>
            </div>
          </div>
        </div>
        </section>

      <DashboardTopRow
        isMap={isMap}
        onToggleView={() => setIsMap((current) => !current)}
        onOpenFilters={() => setIsFilterOpen(true)}
        visibleCount={filteredProperties.length}
        totalCount={allProperties.length}
        activeFilterLabels={activeFilterLabels}
      />

      {loading ? (
        <div className="boardmap-empty-state">
          <strong>Loading listings</strong>
          <p>We are preparing the latest properties around the campus area.</p>
        </div>
      ) : error ? (
        <div className="boardmap-empty-state">
          <strong>{error}</strong>
          <p>You can retry without refreshing the whole app.</p>
          <div style={{ marginTop: "1rem" }}>
            <button type="button" className="boardmap-button-primary" onClick={loadProperties}>
              Retry
            </button>
          </div>
        </div>
      ) : isMap ? (
        <PropertyMap properties={filteredProperties} onPropertyClick={handlePropertyClick} />
      ) : (
        <ListView properties={filteredProperties} onPropertyClick={handlePropertyClick} />
      )}
    </div>
  );

    const renderPageContent = () => {
    if (currentPage === "messages") {
      return (
        <MessagingPage
          userId={user.id}
          accessToken={user.accessToken}
          onBack={() => setCurrentPage("dashboard")}
          mode="list"
        />
      );
    }

    if (currentPage === "about") {
      return (
        <>
          <PageBackHeader title="About BoardMap" onBack={() => setCurrentPage("dashboard")} />
          <AboutPage />
        </>
      );
    }

    if (currentPage === "contact") {
      return (
        <>
          <PageBackHeader title="Contact" onBack={() => setCurrentPage("dashboard")} />
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
        onMessagesClick={() => setCurrentPage("messages")}
        onAboutClick={() => setCurrentPage("about")}
        onContactClick={() => setCurrentPage("contact")}
        onLogout={onLogout}
        onMenuClick={() => setIsMobileMenuOpen(true)}
      />

      <main className="boardmap-shell boardmap-page-offset boardmap-shell-wide">
        {renderPageContent()}
      </main>

      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onApply={setFilters}
      />

      {selectedProperty && (
        <PropertyDetails
          property={selectedProperty}
          userId={user.id}
          userName={user.name}
          accessToken={user.accessToken}
          onClose={() => setSelectedProperty(null)}
          onMessage={onOpenMessaging}
        />
      )}

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onMessagesClick={() => {
          setCurrentPage("messages");
          setIsMobileMenuOpen(false);
        }}
        onAboutClick={() => {
          setCurrentPage("about");
          setIsMobileMenuOpen(false);
        }}
        onContactClick={() => {
          setCurrentPage("contact");
          setIsMobileMenuOpen(false);
        }}
        onLogout={onLogout}
        user={user}
      />
    </div>
  );
}
