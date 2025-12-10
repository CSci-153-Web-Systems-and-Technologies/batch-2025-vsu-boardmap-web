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

// Mock SVG paths - in a real app, these would be imported
const svgPaths = {
  p3ffc9300:
    "M9 21v-8.4a.6.6 0 0 1 .6-.6h4.8a.6.6 0 0 1 .6.6V21M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z",
  p20d61300:
    "M17.5 22h.5a5 5 0 0 0 5-5v-2a5 5 0 0 0-5-5h-10a5 5 0 0 0-5 5v2a5 5 0 0 0 5 5h.5a5 5 0 0 1 4.5 3M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z",
  p8bc8d00:
    "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  p6985300: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  p27875740: "M3 12h.01M3 18h.01M3 6h.01M8 12h13M8 18h13M8 6h13",
};

// Types and API functions
interface Property {
  id: string;
  name: string;
  price: number;
  location: { lat: number; lng: number };
  type: string;
  rating: number;
  description?: string;
  amenities?: string[];
  images?: string[];
}

interface FilterOptions {
  priceRange: [number, number];
  propertyTypes: string[];
  gender: string[];
  amenities: string[];
  availability: string[];
  rating: number;
}

// Mock API functions
async function getProperties(): Promise<Property[]> {
  // In real app, this would fetch from API
  return [
    {
      id: "1",
      name: "Sample Property",
      price: 5000,
      location: { lat: 10.6777, lng: 124.8009 },
      type: "Studio",
      rating: 4.5,
      description: "A cozy studio near the university",
      amenities: ["WiFi", "Aircon", "Kitchen"],
      images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"],
    },
    {
      id: "2",
      name: "Modern Apartment",
      price: 8000,
      location: { lat: 10.679, lng: 124.803 },
      type: "Apartment",
      rating: 4.8,
      description: "Modern apartment with great amenities",
      amenities: ["WiFi", "Parking", "Gym"],
      images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00"],
    },
  ];
}

function filterProperties(
  properties: Property[],
  filters: FilterOptions
): Property[] {
  return properties.filter((property) => {
    const [minPrice, maxPrice] = filters.priceRange;
    return property.price >= minPrice && property.price <= maxPrice;
  });
}

// Components
function HomeIcon() {
  return (
    <div className="size-[38px] md:size-[32px]">
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
    <div className="relative">
      <div className="bg-white rounded-[12px] size-[49.208px] flex items-center justify-center">
        <HomeIcon />
      </div>
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

function UserIcon() {
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
      <UserIcon />
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

function LogOutIcon({ onLogout }: { onLogout: () => void }) {
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
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] md:hidden"
      onClick={onClose}
    >
      <div
        className="absolute right-0 top-0 h-full w-[280px] bg-[#597445] shadow-2xl z-[9999]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-[#79ac78] flex items-center justify-between">
          <h2 className="font-['REM:SemiBold',sans-serif] text-[26px] text-white">
            Menu
          </h2>
          <button onClick={onClose} className="text-white hover:opacity-80">
            <X size={26} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <button
            onClick={() => {
              onMessagesClick();
              onClose();
            }}
            className="w-full flex items-center gap-4 p-4 text-white hover:bg-[#4f6f52] rounded-[14px] transition-all duration-200"
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
            className="w-full flex items-center gap-4 p-4 text-white hover:bg-[#4f6f52] rounded-[14px] transition-all duration-200"
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
            className="w-full flex items-center gap-4 p-4 text-white hover:bg-[#4f6f52] rounded-[14px] transition-all duration-200"
          >
            <span className="font-['Rethink_Sans:SemiBold',sans-serif] text-[18px]">
              Contact Us
            </span>
          </button>
          <div className="border-t border-[#79ac78] pt-6">
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="w-full flex items-center gap-4 p-4 text-white hover:bg-[#4f6f52] rounded-[14px] transition-all duration-200"
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

function Header({
  user,
  onLogout,
  onMessagesClick,
  onMenuClick,
}: {
  user: { name: string; type: "student" | "owner" };
  onLogout: () => void;
  onMessagesClick: () => void;
  onMenuClick: () => void;
}) {
  return (
    <div className="fixed top-0 left-0 right-0 bg-[#597445] h-[70px] md:h-[85px] flex items-center px-6 md:px-8 z-[100] shadow-lg">
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
        <LogoWithText />

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Messages onClick={onMessagesClick} />
          <UserProfile name={user.name} type={user.type} />
          <LogOutIcon onLogout={onLogout} />
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center gap-4">
          <button
            onClick={onMenuClick}
            className="text-white hover:opacity-80 transition-opacity p-2"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}

function MapListToggle({
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

function ListIcon() {
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
    <div className="fixed top-[80px] md:top-[100px] left-[50%] translate-x-[-50%] flex gap-3 md:gap-[10px] items-center justify-center z-[200]">
      <MapListToggle isMap={isMap} onToggle={onToggle} />
      <button
        onClick={onFilterClick}
        className="bg-white h-[40px] md:h-[45px] rounded-[25px] px-6 shadow-lg hover:bg-[#f5f5f5] transition-all duration-200 flex items-center gap-2 hover:shadow-xl"
      >
        <ListIcon />
        <span className="text-[#597445] font-medium text-[15px] md:text-[18px]">Filters</span>
      </button>
    </div>
  );
}

function PropertyCard({
  property,
  onClick,
}: {
  property: Property;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="bg-white border border-[#597445] rounded-[18px] p-5 md:p-6 cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      <h3 className="font-bold text-[#4f6f52] text-[18px] md:text-[20px] truncate">
        {property.name}
      </h3>
      <p className="text-[#79ac78] mt-3 font-semibold text-[20px] md:text-[22px]">
        ₱{property.price.toLocaleString()}/month
      </p>
      <p className="text-[#597445] text-[14px] md:text-[15px] mt-1.5 capitalize bg-[#f8f9fa] inline-block px-3 py-1 rounded-full">
        {property.type}
      </p>
      <div className="flex items-center mt-4">
        <span className="text-yellow-500 text-[18px]">★</span>
        <span className="ml-2 text-[15px] text-gray-700 font-medium">
          {property.rating}
        </span>
      </div>
    </div>
  );
}

function PropertyDetails({
  property,
  onClose,
}: {
  property: Property;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 md:p-6">
      <div className="bg-white rounded-[20px] max-w-4xl w-full max-h-[90vh] overflow-y-auto z-[1000] shadow-2xl">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-[#4f6f52]">
              {property.name}
            </h2>
            <button
              onClick={onClose}
              className="text-[#597445] hover:opacity-70 text-2xl"
            >
              ✕
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-3xl md:text-4xl font-bold text-[#79ac78] mb-6">
                ₱{property.price.toLocaleString()}/month
              </p>
              <p className="text-[#597445] text-[16px] md:text-[17px] leading-relaxed mb-6">
                {property.description}
              </p>
              <div className="mb-6">
                <h3 className="font-semibold text-[18px] text-[#4f6f52] mb-3">
                  Amenities
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {property.amenities?.map((amenity, idx) => (
                    <span
                      key={idx}
                      className="bg-[#e7f0dc] text-[#597445] px-4 py-2 rounded-full text-[14px] font-medium"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-64 rounded-[20px] mb-6 flex items-center justify-center overflow-hidden">
                <span className="text-gray-500 font-medium">
                  Property Image
                </span>
              </div>
              <button className="w-full bg-[#4f6f52] text-white py-4 rounded-[18px] font-semibold text-[16px] hover:bg-[#3d5841] transition-all duration-300 hover:shadow-lg">
                Contact Owner
              </button>
            </div>
          </div>
        </div>
      </div>
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
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<any[]>([]);
  const mapInitializedRef = useRef(false);

  // Initialize Leaflet - load it properly
  useEffect(() => {
    let mounted = true;

    // Check if Leaflet is already loaded
    if (window.L) {
      setL(window.L);
      return;
    }

    // Load Leaflet dynamically
    import("leaflet")
      .then((leaflet) => {
        if (mounted) {
          setL(leaflet.default);
        }
      })
      .catch((error) => {
        console.error("Error loading Leaflet:", error);
      });

    return () => {
      mounted = false;
    };
  }, []);

  // Initialize map when container is ready and L is loaded
  useEffect(() => {
    if (!L || !mapContainerRef.current || mapInitializedRef.current) return;

    const mapInstance = L.map(mapContainerRef.current, {
      center: [10.6777, 124.8009],
      zoom: 14,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(mapInstance);

    setMap(mapInstance);
    mapInitializedRef.current = true;

    // Invalidate size after a small delay
    setTimeout(() => {
      mapInstance.invalidateSize();
    }, 100);

    return () => {
      if (mapInstance) {
        mapInstance.remove();
      }
      mapInitializedRef.current = false;
    };
  }, [L]);

  // Update markers when properties or map changes
  useEffect(() => {
    if (!map || !L || !properties || properties.length === 0) {
      return;
    }

    // Clear existing markers
    if (markersRef.current.length > 0) {
      markersRef.current.forEach((marker) => {
        if (marker && map && map.removeLayer) {
          map.removeLayer(marker);
        }
      });
      markersRef.current = [];
    }

    // Add new markers
    const newMarkers: any[] = [];

    properties.forEach((property) => {
      try {
        // Create a simple marker first
        const marker = L.marker(
          [property.location.lat, property.location.lng],
          {
            title: property.name,
            icon: L.divIcon({
              className: "custom-marker",
              html: `
              <div style="
                background: #79ac78; 
                color: white; 
                padding: 8px 12px; 
                border-radius: 20px; 
                border: 2px solid white;
                font-weight: bold;
                font-size: 13px;
                cursor: pointer;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                white-space: nowrap;
              ">
                ₱${property.price.toLocaleString()}
              </div>
            `,
              iconSize: [100, 40],
              iconAnchor: [50, 40],
            }),
          }
        ).addTo(map);

        marker.on("click", () => onPropertyClick(property));

        // Add popup
        marker.bindPopup(`
          <div style="min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; color: #4f6f52;">${property.name}</h3>
            <p style="margin: 0 0 4px 0; color: #79ac78; font-weight: bold;">₱${property.price.toLocaleString()}/month</p>
            <p style="margin: 0 0 4px 0;">${property.type}</p>
            <p style="margin: 0;">Rating: ${property.rating} ★</p>
          </div>
        `);

        newMarkers.push(marker);
      } catch (error) {
        console.error("Error creating marker:", error);
      }
    });

    markersRef.current = newMarkers;

    // Fit bounds to show all markers
    if (newMarkers.length > 0) {
      try {
        const group = L.featureGroup(newMarkers);
        map.fitBounds(group.getBounds().pad(0.1));
      } catch (error) {
        console.error("Error fitting bounds:", error);
      }
    }

    // Invalidate size after adding markers
    setTimeout(() => {
      map.invalidateSize();
    }, 200);
  }, [map, L, properties, onPropertyClick]); // Fixed dependencies

  return (
    <div className="w-full h-full relative rounded-[15px] overflow-hidden z-0">
      <style>{`
        .leaflet-container {
          width: 100% !important;
          height: 100% !important;
          border-radius: 15px;
          z-index: 1;
        }
        .custom-marker {
          background: none !important;
          border: none !important;
        }
        .leaflet-div-icon {
          background: transparent !important;
          border: none !important;
        }
      `}</style>
      <div
        ref={mapContainerRef}
        className="w-full h-full rounded-[15px]"
        style={{ minHeight: "720px" }}
      />
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
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center p-8">
          <p className="font-semibold text-[18px] md:text-[20px] text-[#597445] mb-3">
            No properties match your filters
          </p>
          <p className="text-gray-500 text-[14px] md:text-[15px]">
            Try adjusting your search criteria
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-y-auto bg-gradient-to-br from-gray-50 to-white p-4 md:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
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

function FilterModal({
  isOpen,
  onClose,
  filters,
  onApply,
}: {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterOptions;
  onApply: (filters: FilterOptions) => void;
}) {
  const [localFilters, setLocalFilters] = useState(filters);

  if (!isOpen) return null;

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters: FilterOptions = {
      priceRange: [0, 10000],
      propertyTypes: [],
      gender: [],
      amenities: [],
      availability: [],
      rating: 0,
    };
    setLocalFilters(resetFilters);
    onApply(resetFilters);
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#e7f0dc] rounded-[20px] shadow-2xl w-full max-w-[90vw] md:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col z-[1000]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#e7f0dc] border-b-4 border-[#597445] p-4 md:p-6 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-[24px] md:text-[32px] text-[#4f6f52]">
              Filters
            </h2>
            <button
              onClick={onClose}
              className="text-[#597445] hover:opacity-70 transition-opacity text-3xl leading-none"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 p-4 md:p-6 space-y-6">
          <div>
            <label className="font-semibold text-[16px] md:text-[18px] text-[#4f6f52] block mb-3">
              Price Range
            </label>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  value={localFilters.priceRange[0]}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      priceRange: [
                        parseInt(e.target.value) || 0,
                        localFilters.priceRange[1],
                      ],
                    })
                  }
                  placeholder="Min"
                  className="bg-white border-2 border-[#597445] rounded-[10px] px-4 py-2 w-full text-[#4f6f52]"
                />
                <span className="text-[#4f6f52]">-</span>
                <input
                  type="number"
                  value={localFilters.priceRange[1]}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      priceRange: [
                        localFilters.priceRange[0],
                        parseInt(e.target.value) || 10000,
                      ],
                    })
                  }
                  placeholder="Max"
                  className="bg-white border-2 border-[#597445] rounded-[10px] px-4 py-2 w-full text-[#4f6f52]"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="font-semibold text-[16px] md:text-[18px] text-[#4f6f52] block mb-3">
              Property Type
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
              {[
                "Studio",
                "Private Room",
                "Shared Room",
                "Bed Space",
                "Apartment",
              ].map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    const newTypes = localFilters.propertyTypes.includes(type)
                      ? localFilters.propertyTypes.filter((t) => t !== type)
                      : [...localFilters.propertyTypes, type];
                    setLocalFilters({
                      ...localFilters,
                      propertyTypes: newTypes,
                    });
                  }}
                  className={`px-3 md:px-4 py-2 rounded-[10px] font-medium text-[14px] md:text-[16px] border-2 border-[#597445] transition-all ${
                    localFilters.propertyTypes.includes(type)
                      ? "bg-[#79ac78] text-white"
                      : "bg-white text-[#597445] hover:bg-[#79ac78] hover:text-white"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="font-semibold text-[16px] md:text-[18px] text-[#4f6f52] block mb-3">
              Gender Preference
            </label>
            <div className="flex gap-2 md:gap-3">
              {["Male", "Female", "Any"].map((gender) => (
                <button
                  key={gender}
                  onClick={() => {
                    const newGender = localFilters.gender.includes(gender)
                      ? localFilters.gender.filter((g) => g !== gender)
                      : [...localFilters.gender, gender];
                    setLocalFilters({ ...localFilters, gender: newGender });
                  }}
                  className={`flex-1 px-3 md:px-4 py-2 rounded-[10px] font-medium text-[14px] md:text-[16px] border-2 border-[#597445] transition-all ${
                    localFilters.gender.includes(gender)
                      ? "bg-[#79ac78] text-white"
                      : "bg-white text-[#597445] hover:bg-[#79ac78] hover:text-white"
                  }`}
                >
                  {gender}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleReset}
              className="flex-1 bg-white text-[#597445] border-2 border-[#597445] rounded-[15px] px-4 py-3 font-semibold text-[16px] md:text-[18px] hover:bg-[#f5f5f5]"
            >
              Reset
            </button>
            <button
              onClick={handleApply}
              className="flex-1 bg-[#4f6f52] text-white rounded-[15px] px-4 py-3 font-semibold text-[16px] md:text-[18px] hover:bg-[#3d5841]"
            >
              Apply Filters
            </button>
          </div>
        </div>
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
    }
  }

  const handleApplyFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handlePropertyClick = useCallback((property: Property) => {
    setSelectedProperty(property);
  }, []);

  const handleLogout = () => {
    console.log("Logout");
    onLogout(); // Call the parent's logout function
  };

  const handleMessagesClick = () => {
    setCurrentPage("messages");
  };

  const handleMenuClick = () => {
    setIsMobileMenuOpen(true);
  };

  if (currentPage === "messages") {
    return (
      <div className="bg-gradient-to-b from-[#e2f0d1] to-[#ffffff] via-[#e8f3da] min-h-screen w-full flex flex-col">
        <Header
          user={user}
          onLogout={handleLogout}
          onMessagesClick={handleMessagesClick}
          onMenuClick={handleMenuClick}
        />

        <div className="flex-1 mt-[70px] md:mt-[100px] p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            <button
              onClick={() => setCurrentPage("dashboard")}
              className="mb-6 flex items-center gap-2 text-[#597445] hover:opacity-70 transition-opacity"
            >
              <span>←</span>
              <span className="font-semibold text-[18px]">
                Back to Dashboard
              </span>
            </button>

            <h1 className="font-bold text-[32px] md:text-[42px] text-[#4f6f52] mb-8">
              Messages
            </h1>

            <div className="bg-white rounded-[20px] shadow-lg p-6 md:p-8">
              <p className="text-[18px] text-[#597445] text-center">
                No messages yet. Start connecting with property owners to see
                your conversations here.
              </p>
            </div>
          </div>
        </div>

        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          onLogout={handleLogout} // This should use the fixed handleLogout function
          onMessagesClick={handleMessagesClick}
          onAboutClick={() => setIsMobileMenuOpen(false)}
          onContactClick={() => setIsMobileMenuOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-[#e2f0d1] to-[#ffffff] via-[#e8f3da] min-h-screen w-full flex flex-col overflow-x-hidden">

      {/* LAYER 1: Header */}
      <Header
        user={user}
        onLogout={handleLogout}
        onMessagesClick={handleMessagesClick}
        onMenuClick={handleMenuClick}
      />

      {/* LAYER 2: Map/List Toggle & Filter Button */}
      <MapListAndFilter
        isMap={isMap}
        onToggle={() => setIsMap(!isMap)}
        onFilterClick={() => setIsFilterOpen(true)}
      />

      {/* ===== MODALS COME FIRST (BEFORE MAP) ===== */}
      {/* This ensures they appear above the map in stacking context */}

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

      {/* Main Content Area - MAP COMES AFTER MODALS */}
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
    </div>
  );
}