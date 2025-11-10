import { useState, useEffect } from "react";
import svgPaths from "../imports/svg-xxo13nfqz5";
import PropertyCard from "./PropertyCard";
import PropertyDetails from "./PropertyDetails";
import FilterModal from "./FilterModal";
import {
  Property,
  FilterOptions,
  getProperties,
  getPublicProperties, // ADD THIS IMPORT
  filterProperties,
} from "../utils/api";
import { Menu, X } from "lucide-react";

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
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0">
      <div className="[grid-area:1_/_1] bg-white ml-0 mt-0 rounded-[12px] size-[49.208px]" />
      <Home />
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

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  onMessagesClick: () => void;
  onAboutClick: () => void;
  onContactClick: () => void;
}

function MobileMenu({
  isOpen,
  onClose,
  onLogout,
  onMessagesClick,
  onAboutClick,
  onContactClick,
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
          <button
            onClick={() => {
              onMessagesClick();
              onClose();
            }}
            className="w-full flex items-center gap-3 p-3 text-white hover:bg-[#4f6f52] rounded-[10px] transition-colors"
          >
            <MessageCircle />
            <span className="font-['Rethink_Sans:SemiBold',sans-serif] text-[18px]">
              Messages
            </span>
          </button>
          <button
            onClick={() => {
              onAboutClick();
              onClose();
            }}
            className="w-full flex items-center gap-3 p-3 text-white hover:bg-[#4f6f52] rounded-[10px] transition-colors"
          >
            <span className="font-['Rethink_Sans:SemiBold',sans-serif] text-[18px]">
              About Us
            </span>
          </button>
          <button
            onClick={() => {
              onContactClick();
              onClose();
            }}
            className="w-full flex items-center gap-3 p-3 text-white hover:bg-[#4f6f52] rounded-[10px] transition-colors"
          >
            <span className="font-['Rethink_Sans:SemiBold',sans-serif] text-[18px]">
              Contact Us
            </span>
          </button>
          <div className="border-t border-[#79ac78] pt-4">
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="w-full flex items-center gap-3 p-3 text-white hover:bg-[#4f6f52] rounded-[10px] transition-colors"
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
        {/* Desktop Navigation */}
        <div className="hidden md:flex content-stretch gap-[30px] items-center relative shrink-0">
          <Messages onClick={onMessagesClick} />
          <UserProfile name={user.name} type={user.type} />
          <LogOut onLogout={onLogout} />
        </div>
        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center gap-3">
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

function MapList({
  isMap,
  onToggle,
}: {
  isMap: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="bg-white h-[40px] md:h-[45px] relative rounded-[30px] shadow-[0px_0px_10px_0px_#e7f0dc] shrink-0 w-[160px] md:w-[180px]">
      <div className="size-full relative">
        <div className="box-border content-stretch flex flex-col gap-[10px] h-full items-start px-[6px] py-[8px] md:py-[10px] relative w-full">
          <div className="content-stretch flex gap-[15px] items-center relative shrink-0 w-full">
            <div
              className={`absolute bg-[#597445] h-[30px] md:h-[35px] rounded-[30px] w-[70px] md:w-[80px] transition-all duration-300 ease-in-out ${
                isMap ? "left-[5px]" : "left-[80px] md:left-[95px]"
              }`}
            />
            <button
              onClick={() => onToggle()}
              className={`relative z-10 flex flex-col font-['Rethink_Sans:Medium',sans-serif] font-medium h-[20px] justify-center leading-[0] text-[16px] md:text-[18px] text-center w-[70px] md:w-[80px] cursor-pointer transition-colors ${
                isMap ? "text-white" : "text-[#597445]"
              }`}
            >
              <p className="leading-[normal]">Map</p>
            </button>
            <button
              onClick={() => onToggle()}
              className={`relative z-10 flex flex-col font-['Rethink_Sans:Medium',sans-serif] font-medium h-[20px] justify-center leading-[0] text-[16px] md:text-[18px] text-center w-[70px] md:w-[80px] cursor-pointer transition-colors ${
                !isMap ? "text-white" : "text-[#597445]"
              }`}
            >
              <p className="leading-[normal]">List</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function List() {
  return (
    <div className="relative shrink-0 size-[20px] md:size-[24px]">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="list">
          <path
            d={svgPaths.p27875740}
            fill="var(--fill-0, #597445)"
            id="icon"
          />
        </g>
      </svg>
    </div>
  );
}

function MapListAndFilter({
  isMap,
  onToggle,
  onFilterClick,
}: {
  isMap: boolean;
  onToggle: () => void;
  onFilterClick: () => void;
}) {
  return (
    <div className="fixed top-[80px] md:top-[110px] left-[50%] translate-x-[-50%] content-stretch flex gap-2 md:gap-[10px] items-center justify-center z-[110] mb-[8px]">
      <MapList isMap={isMap} onToggle={onToggle} />
      <button
        onClick={onFilterClick}
        className="bg-white h-[40px] md:h-[45px] relative rounded-[30px] shrink-0 w-[90px] md:w-[100px] cursor-pointer hover:bg-[#f5f5f5] transition-colors shadow-[0px_0px_10px_0px_#e7f0dc]"
      >
        <div className="size-full">
          <div className="box-border content-stretch flex flex-col gap-[10px] h-full items-start px-[6px] py-[8px] md:py-[10px] relative w-full">
            <div className="content-stretch flex items-center justify-center relative shrink-0 w-full">
              <List />
              <div className="flex flex-col font-['Rethink_Sans:Medium',sans-serif] font-medium h-[20px] justify-center leading-[0] relative shrink-0 text-[#597445] text-[16px] md:text-[18px] text-center w-[62px]">
                <p className="leading-[normal]">Filters</p>
              </div>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}

function Map({
  properties,
  onPropertyClick,
}: {
  properties: Property[];
  onPropertyClick: (property: Property) => void;
}) {
  const [map, setMap] = useState<any>(null);
  const [L, setL] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);

  useEffect(() => {
    // Dynamically import Leaflet
    import("leaflet").then((leaflet) => {
      setL(leaflet.default);
    });
  }, []);

  useEffect(() => {
    if (!L || map) return;

    // Initialize map centered on VSU - CHANGED: zoomControl: false → zoomControl: true
    const mapInstance = L.map("map", {
      center: [10.6777, 124.8009],
      zoom: 14,
      zoomControl: true, // ← CHANGED THIS LINE
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(mapInstance);

    setMap(mapInstance);

    return () => {
      mapInstance.remove();
    };
  }, [L]);

  useEffect(() => {
    if (!map || !L || !properties) return;

    // Clear existing markers
    markers.forEach((marker) => marker.remove());

    // Add new markers
    const newMarkers = properties.map((property) => {
      const marker = L.marker([property.location.lat, property.location.lng], {
        icon: L.divIcon({
          className: "custom-marker",
          html: `
            <div class="bg-[#79ac78] text-white px-3 py-1.5 rounded-full shadow-lg border-2 border-white cursor-pointer hover:bg-[#4f6f52] transition-colors font-['Rethink_Sans:SemiBold',sans-serif] text-[13px] whitespace-nowrap">
              ₱${property.price.toLocaleString()}
            </div>
          `,
          iconSize: [100, 40],
          iconAnchor: [50, 20],
        }),
      }).addTo(map);

      marker.on("click", () => onPropertyClick(property));

      return marker;
    });

    setMarkers(newMarkers);
  }, [map, L, properties]);

  return (
    <div className="w-full h-full relative">
      <div id="map" className="w-full h-full" />
      {/* REMOVED CUSTOM ZOOM BUTTONS - Leaflet's built-in control will show automatically */}
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
      <div className="w-full h-full flex items-center justify-center">
        <p className="font-['Rethink_Sans:SemiBold',sans-serif] text-[18px] md:text-[20px] text-[#597445]">
          No properties match your filters
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 p-4 md:p-5">
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            onClick={() => onPropertyClick(property)}
          />
        ))}
      </div>
    </div>
  );
}

interface StudentDashboardProps {
  user: {
    id: string;
    name: string;
    email: string;
    type: "student" | "owner";
    accessToken: string;
  };
  onLogout: () => void;
}

export default function StudentDashboard({
  user,
  onLogout,
}: StudentDashboardProps) {
  const [isMap, setIsMap] = useState(true);
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<"dashboard" | "messages">(
    "dashboard"
  );
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [0, 10000],
    propertyTypes: [],
    gender: [],
    amenities: [],
    availability: [],
    rating: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProperties();
  }, []);

  useEffect(() => {
    const filtered = filterProperties(allProperties, filters);
    setFilteredProperties(filtered);
  }, [allProperties, filters]);

  async function loadProperties() {
    try {
      setLoading(true);
      setError(null);
      
      // FIX: Use getPublicProperties instead of getProperties
      // This ensures students see ALL properties, not filtered by owner
      const properties = await getPublicProperties();
      
      console.log('Loaded properties for student:', properties.length, 'properties');
      console.log('Sample property:', properties[0]);
      
      setAllProperties(properties);
      setFilteredProperties(properties);
    } catch (err) {
      console.error("Error loading properties:", err);
      setError("Failed to load properties. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const handleApplyFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
  };

  if (currentPage === "messages") {
    return (
      <div className="bg-gradient-to-b from-[#e2f0d1] relative min-h-screen w-full to-[#ffffff] via-[#e8f3da] via-[18.561%] flex flex-col">
        <Header
          user={user}
          onLogout={onLogout}
          onMessagesClick={() => setCurrentPage("dashboard")}
          onMenuClick={() => setIsMobileMenuOpen(true)}
        />

        <div className="flex-1 mt-[70px] md:mt-[100px] p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
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
                No messages yet. Start connecting with property owners to see
                your conversations here.
              </p>
            </div>
          </div>
        </div>

        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          onLogout={onLogout}
          onMessagesClick={() => {
            setIsMobileMenuOpen(false);
            setCurrentPage("messages");
          }}
          onAboutClick={() => {
            setIsMobileMenuOpen(false);
          }}
          onContactClick={() => {
            setIsMobileMenuOpen(false);
          }}
        />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-[#e2f0d1] relative min-h-screen w-full to-[#ffffff] via-[#e8f3da] via-[18.561%] flex flex-col">
      {/* Add Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />

      <Header
        user={user}
        onLogout={onLogout}
        onMessagesClick={() => setCurrentPage("messages")}
        onMenuClick={() => setIsMobileMenuOpen(true)}
      />

      <MapListAndFilter
        isMap={isMap}
        onToggle={() => setIsMap(!isMap)}
        onFilterClick={() => setIsFilterOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col mt-[130px] md:mt-[160px] px-4 md:px-[50px] pb-6">
        <div className="flex h-[calc(100vh-380px)] md:h-[calc(100vh-360px)] min-h-[500px] max-h-[1000px] rounded-[15px] shadow-[0px_0px_20px_0px_#597445] overflow-hidden">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#597445]"></div>
              <p className="font-['Rethink_Sans:SemiBold',sans-serif] text-[20px] text-[#597445]">
                Loading properties...
              </p>
              </div>
            </div>
          ) : error ? (
            <div className="w-full h-full flex flex-col items-center justify-center gap-4">
              <p className="font-['Rethink_Sans:SemiBold',sans-serif] text-[20px] text-red-600">
                {error}
              </p>
              <button
                onClick={loadProperties}
                className="bg-[#4f6f52] text-white rounded-[15px] px-6 py-2 font-['Rethink_Sans:SemiBold',sans-serif] hover:bg-[#3d5841] transition-colors"
              >
                Retry
              </button>
            </div>
          ) : isMap ? (
            <Map
              properties={filteredProperties}
              onPropertyClick={handlePropertyClick}
            />
          ) : (
            <ListView
              properties={filteredProperties}
              onPropertyClick={handlePropertyClick}
            />
          )}
        </div>

        {/* Debug info - you can remove this in production */}
        {!loading && !error && (
          <div className="mt-4 text-center">
            <p className="font-['Rethink_Sans:Regular',sans-serif] text-[14px] text-[#597445]">
              Showing {filteredProperties.length} of {allProperties.length} properties
            </p>
          </div>
        )}
      </div>

      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onApply={handleApplyFilters}
      />

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onLogout={onLogout}
        onMessagesClick={() => {
          setIsMobileMenuOpen(false);
          setCurrentPage("messages");
        }}
        onAboutClick={() => {
          setIsMobileMenuOpen(false);
        }}
        onContactClick={() => {
          setIsMobileMenuOpen(false);
        }}
      />

      {selectedProperty && (
        <PropertyDetails
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
        />
      )}
    </div>
  );
}