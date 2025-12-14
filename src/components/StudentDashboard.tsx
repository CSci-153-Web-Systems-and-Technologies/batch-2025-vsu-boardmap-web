import { useState, useEffect, useCallback, useRef } from "react";
import svgPaths from "../imports/svg-xxo13nfqz5";
import {
  Property,
  FilterOptions,
  getProperties,
  filterProperties,
} from "../utils/api";
import { Menu, X } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/global.css";
import FilterModal from "./FilterModal";
import PropertyDetails from "./PropertyDetails";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Mock SVG paths - in a real app, these would be imported
const localSvgPaths = {
  p3ffc9300:
    "M9 21v-8.4a.6.6 0 0 1 .6-.6h4.8a.6.6 0 0 1 .6.6V21M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z",
  p20d61300:
    "M17.5 22h.5a5 5 0 0 0 5-5v-2a5 5 0 0 0-5-5h-10a5 5 0 0 0-5 5v2a5 5 0 0 0 5 5h.5a5 5 0 0 1 4.5 3M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z",
  p8bc8d00:
    "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  p6985300: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  p27875740: "M3 12h.01M3 18h.01M3 6h.01M8 12h13M8 18h13M8 6h13",
};

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
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[10000] md:hidden"
      onClick={onClose}
    >
      <div
        className="absolute right-0 top-0 h-full w-[280px] bg-[#597445] shadow-2xl z-[10001] md:hidden"
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
        <span className="text-[#597445] font-medium text-[15px] md:text-[18px]">
          Filters
        </span>
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
        {property.title}
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

function Map({
  properties,
  onPropertyClick,
}: {
  properties: Property[];
  onPropertyClick: (property: Property) => void;
}) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const isInitializedRef = useRef(false);
  const popupRef = useRef<L.Popup | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    const handlePropertyDetailsOpen = () => setIsDetailsOpen(true);
    const handlePropertyDetailsClose = () => setIsDetailsOpen(false);

    // You can use a custom event or prop to detect when PropertyDetails opens
    // For now, we'll use a simpler approach by checking the DOM
    const checkDetailsOpen = () => {
      const detailsModal = document.querySelector(".property-details-modal");
      setIsDetailsOpen(!!detailsModal);
    };

    // Check periodically
    const interval = setInterval(checkDetailsOpen, 100);

    return () => clearInterval(interval);
  }, []);

  // DISABLE MAP INTERACTIONS when PropertyDetails is open
  useEffect(() => {
    if (!mapRef.current) return;

    if (isDetailsOpen) {
      // Disable all interactions
      mapRef.current.dragging.disable();
      mapRef.current.touchZoom.disable();
      mapRef.current.doubleClickZoom.disable();
      mapRef.current.scrollWheelZoom.disable();
      mapRef.current.boxZoom.disable();
      mapRef.current.keyboard.disable();

      // Make map container inert
      if (mapContainerRef.current) {
        mapContainerRef.current.style.pointerEvents = "none";
        mapContainerRef.current.style.touchAction = "none";
      }

      // Hide all popups
      if (popupRef.current) {
        popupRef.current.close();
        popupRef.current = null;
      }

      // Hide controls
      mapRef.current.getContainer().classList.add("map-disabled");
    } else {
      // Re-enable interactions
      mapRef.current.dragging.enable();
      mapRef.current.touchZoom.enable();
      mapRef.current.doubleClickZoom.enable();
      mapRef.current.scrollWheelZoom.enable();
      mapRef.current.boxZoom.enable();
      mapRef.current.keyboard.enable();

      if (mapContainerRef.current) {
        mapContainerRef.current.style.pointerEvents = "auto";
        mapContainerRef.current.style.touchAction = "auto";
      }

      mapRef.current.getContainer().classList.remove("map-disabled");
    }
  }, [isDetailsOpen]);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || isInitializedRef.current) return;

    console.log("Initializing map...");

    // Create map instance
    mapRef.current = L.map(mapContainerRef.current, {
      center: [10.6777, 124.8009],
      zoom: 14,
      zoomControl: true,
      attributionControl: false,
    });

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(mapRef.current);

    // Add zoom control
    L.control
      .zoom({
        position: "topright",
      })
      .addTo(mapRef.current);

    // Invalidate size after a delay to ensure proper rendering
    setTimeout(() => {
      mapRef.current?.invalidateSize();
    }, 100);

    isInitializedRef.current = true;

    // Cleanup
    return () => {
      console.log("Cleaning up map...");
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      markersRef.current = [];
      isInitializedRef.current = false;
    };
  }, []);

  // Update markers when properties change
  useEffect(() => {
    if (!mapRef.current || !properties.length) {
      console.log(
        "Map not ready or no properties:",
        mapRef.current,
        properties.length
      );
      return;
    }

    // Create new markers
    const bounds = L.latLngBounds([]);
    const newMarkers: L.Marker[] = [];

    properties.forEach((property) => {
      try {
        // Create custom icon
        const customIcon = L.divIcon({
          className: "custom-marker",
          html: `
            <div style="
              background: #79ac78;
              color: white;
              padding: 6px 12px;
              border-radius: 20px;
              border: 2px solid white;
              font-weight: bold;
              font-size: 13px;
              cursor: pointer;
              box-shadow: 0 2px 6px rgba(0,0,0,0.3);
              white-space: nowrap;
              min-width: 80px;
              text-align: center;
              z-index: 1000;
            ">
              ₱${property.price.toLocaleString()}
            </div>
          `,
          iconSize: [100, 40],
          iconAnchor: [50, 40],
          popupAnchor: [0, -40],
        });

        // Create marker WITHOUT auto-popup
        const marker = L.marker(
          [property.location.lat, property.location.lng],
          {
            icon: customIcon,
            title: property.title,
            riseOnHover: true,
          }
        ).addTo(mapRef.current!);

        // Create popup for hover (not auto-open)
        const popup = L.popup({
          closeButton: true,
          autoClose: false,
          closeOnClick: false,
          className: "property-hover-popup",
          maxWidth: 250,
          offset: [0, -20],
        }).setContent(`
          <div style="padding: 12px; min-width: 220px;">
            <h3 style="margin: 0 0 6px 0; color: #4f6f52; font-size: 16px; font-weight: bold; line-height: 1.2;">
              ${property.title}
            </h3>
            <p style="margin: 0 0 4px 0; color: #79ac78; font-weight: bold; font-size: 18px; line-height: 1.2;">
              ₱${property.price.toLocaleString()}/month
            </p>
            <p style="margin: 0 0 4px 0; color: #666; font-size: 14px; line-height: 1.2;">
              ${property.type}
            </p>
            <p style="margin: 0 0 8px 0; color: #666; font-size: 13px; line-height: 1.2;">
              ${property.address || "Address not available"}
            </p>
            <button 
              style="
                background: #4f6f52;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 14px;
                font-weight: bold;
                width: 100%;
                transition: background-color 0.2s;
              "
              onmouseover="this.style.backgroundColor='#3d5841'"
              onmouseout="this.style.backgroundColor='#4f6f52'"
              onclick="window.dispatchEvent(new CustomEvent('propertyClick', { detail: '${
                property.id
              }' }))"
            >
              View Details
            </button>
          </div>
        `);

        // HOVER EVENT: Show popup on mouseover
        marker.on("mouseover", function (e) {
          if (popupRef.current) {
            popupRef.current.close();
          }
          popup.setLatLng(e.latlng);
          popup.openOn(mapRef.current!);
          popupRef.current = popup;
        });

        // MOUSEOUT EVENT: Close popup after delay
        marker.on("mouseout", function () {
          setTimeout(() => {
            if (popupRef.current === popup) {
              popup.close();
              popupRef.current = null;
            }
          }, 300);
        });

        // CLICK EVENT: Open PropertyDetails modal
        marker.on("click", () => {
          console.log("Marker clicked:", property.title);
          // Close any open popup
          if (popupRef.current) {
            popupRef.current.close();
            popupRef.current = null;
          }
          // Trigger property click to open modal
          onPropertyClick(property);
        });

        // Also close popup when clicking elsewhere on map
        mapRef.current.on("click", () => {
          if (popupRef.current) {
            popupRef.current.close();
            popupRef.current = null;
          }
        });

        newMarkers.push(marker);
        bounds.extend([property.location.lat, property.location.lng]);
      } catch (error) {
        console.error(
          "Error creating marker for property:",
          property.title,
          error
        );
      }
    });

    markersRef.current = newMarkers;

    // Fit bounds if we have markers
    if (newMarkers.length > 0) {
      try {
        // Add padding to bounds
        mapRef.current?.fitBounds(bounds, {
          padding: [50, 50],
          maxZoom: 16,
        });
      } catch (error) {
        console.error("Error fitting bounds:", error);
      }
    }

    // Invalidate size after markers are added
    setTimeout(() => {
      mapRef.current?.invalidateSize();
    }, 200);
  }, [properties, onPropertyClick]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (mapRef.current) {
        setTimeout(() => {
          mapRef.current?.invalidateSize();
        }, 150);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="w-full h-full relative rounded-[15px] overflow-hidden">
      <style>{`
  /* Ensure map container has proper dimensions */
  .leaflet-container {
    width: 100%;
    height: 100%;
    border-radius: 15px;
    z-index: 1;
  }
  
  /* Custom marker styling */
  .custom-marker {
    background: transparent;
    border: none;
    z-index: 1000;
  }
  
  /* Ensure hover popups are above markers */
  .leaflet-popup {
    z-index: 1001 !important;
  }
  
  /* PropertyDetails modal should be above everything */
  .property-details-modal {
    z-index: 999999 !important;
  }
  
  /* Ensure map tiles are below everything */
  .leaflet-tile {
    z-index: 0 !important;
  }
  
  .leaflet-control-container {
    z-index: 1000 !important;
  }
`}</style>

      <div
        ref={mapContainerRef}
        className="w-full h-full rounded-[15px]"
        style={{ minHeight: "700px" }}
      />

      {properties.length === 0 && !isInitializedRef.current && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-[15px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#597445] mx-auto mb-4"></div>
            <p className="font-semibold text-[#597445]">Loading map...</p>
          </div>
        </div>
      )}

      {properties.length === 0 && isInitializedRef.current && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-[15px] bg-opacity-90">
          <div className="text-center p-6">
            <p className="font-semibold text-[#597445] text-lg mb-2">
              No properties to display
            </p>
            <p className="text-gray-600">
              Adjust your filters or check back later
            </p>
          </div>
        </div>
      )}
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

  useEffect(() => {
    loadProperties();
  }, []);

  useEffect(() => {
    const filtered = filterProperties(allProperties, filters);
    setFilteredProperties(filtered);
  }, [allProperties, filters]);

  useEffect(() => {
    if (selectedProperty) {
      document.body.classList.add("property-details-open");
    } else {
      document.body.classList.remove("property-details-open");
    }

    return () => {
      document.body.classList.remove("property-details-open");
    };
  }, [selectedProperty]);

  async function loadProperties() {
    try {
      setLoading(true);
      setError(null);
      console.log("Starting to load properties...");

      const properties = await getProperties();

      console.log(
        "Loaded properties for student:",
        properties.length,
        "properties"
      );
      console.log("Sample property:", properties[0]);

      setAllProperties(properties);
      setFilteredProperties(properties);
    } catch (err) {
      console.error("Error loading properties:", err);
      setError("Failed to load properties. Please try again.");
    } finally {
      // IMPORTANT: Set loading to false whether successful or not
      setLoading(false);
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
      {!selectedProperty && (
        <MapListAndFilter
          isMap={isMap}
          onToggle={() => setIsMap(!isMap)}
          onFilterClick={() => setIsFilterOpen(true)}
        />
      )}

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
        <div className="flex h-[80vh] min-h-[600px] rounded-[15px] shadow-[0px_0px_20px_0px_#597445] overflow-hidden">
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
              Showing {filteredProperties.length} of {allProperties.length}{" "}
              properties
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
