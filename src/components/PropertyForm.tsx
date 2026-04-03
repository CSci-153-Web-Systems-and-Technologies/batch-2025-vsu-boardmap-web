import { useEffect, useRef, useState } from "react";
import {
  Bath,
  BedDouble,
  BookOpen,
  Car,
  Cigarette,
  Clock3,
  Droplets,
  ImagePlus,
  MapPin,
  PawPrint,
  Phone,
  Sparkles,
  Snowflake,
  ShieldCheck,
  Shirt,
  Tv,
  Upload,
  Users,
  UtensilsCrossed,
  Wifi,
  X,
  Zap,
} from "lucide-react";
import { Property, Room, createProperty, updateProperty } from "../utils/api";
import { toast } from "sonner";

interface PropertyFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  accessToken?: string;
  property?: Property;
  currentUser?: {
    id: string;
    name: string;
    email: string;
  };
}

interface Location {
  lat: number;
  lng: number;
}

interface FormData {
  title: string;
  description: string;
  price: string;
  address: string;
  location: Location;
  type: string;
  availability: string;
  gender: string;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  rooms: Room[];
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
}

interface ImageItem {
  id: string;
  url: string;
  file?: File;
  isNew: boolean;
}

const DEFAULT_LOCATION = { lat: 10.6777, lng: 124.8009 };

const PROPERTY_TYPES = [
  "Studio",
  "Private Room",
  "Shared Room",
  "Bed Space",
  "Apartment",
];

const AVAILABILITY_OPTIONS = ["Available", "Limited", "Full"];
const GENDER_OPTIONS = ["Any", "Male", "Female"];

const AMENITY_OPTIONS = [
  { label: "WiFi", Icon: Wifi },
  { label: "Air Conditioning", Icon: Snowflake },
  { label: "Kitchen", Icon: UtensilsCrossed },
  { label: "Parking", Icon: Car },
  { label: "Laundry", Icon: Shirt },
  { label: "Security", Icon: ShieldCheck },
  { label: "Study Desk", Icon: BookOpen },
  { label: "Free Water", Icon: Droplets },
  { label: "Free Electricity", Icon: Zap },
  { label: "Television", Icon: Tv },
  { label: "Comfort Room", Icon: Bath },
  { label: "Smoking Allowed", Icon: Cigarette },
  { label: "Pets Allowed", Icon: PawPrint },
  { label: "No Curfew", Icon: Clock3 },
  { label: "Visitors Allowed", Icon: Users },
];

const createDefaultFormData = (
  currentUser: NonNullable<PropertyFormProps["currentUser"]>
): FormData => ({
  title: "",
  description: "",
  price: "",
  address: "",
  location: DEFAULT_LOCATION,
  type: "Studio",
  availability: "Available",
  gender: "Any",
  bedrooms: 0,
  bathrooms: 1,
  amenities: [],
  rooms: [],
  ownerId: currentUser.id,
  ownerName: currentUser.name,
  ownerEmail: currentUser.email,
  ownerPhone: "",
});

const toImageItems = (images: string[]) =>
  images.map((url, index) => ({
    id: `existing-${index}-${url}`,
    url,
    isNew: false,
  }));

const cleanupImageItems = (items: ImageItem[]) => {
  items.forEach((item) => {
    if (item.isNew) {
      URL.revokeObjectURL(item.url);
    }
  });
};

function LocationPicker({
  location,
  onChange,
}: {
  location: Location;
  onChange: (loc: Location) => void;
}) {
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (!containerRef.current || typeof window === "undefined") return;

    let cancelled = false;

    const initMap = () => {
      if (cancelled) return;

      const leaflet = (window as Window & { L?: any }).L;
      if (!leaflet) {
        window.setTimeout(initMap, 100);
        return;
      }

      if (mapRef.current) {
        mapRef.current.remove();
      }

      const map = leaflet.map(containerRef.current, {
        center: [location.lat, location.lng],
        zoom: 15,
      });

      mapRef.current = map;

      leaflet
        .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        })
        .addTo(map);

      const marker = leaflet.marker([location.lat, location.lng]).addTo(map);
      markerRef.current = marker;

      map.on("click", (event: any) => {
        const nextLocation = {
          lat: event.latlng.lat,
          lng: event.latlng.lng,
        };

        marker.setLatLng([nextLocation.lat, nextLocation.lng]);
        onChangeRef.current(nextLocation);
      });
    };

    initMap();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [location.lat, location.lng]);

  useEffect(() => {
    if (mapRef.current && markerRef.current) {
      mapRef.current.setView([location.lat, location.lng], 15);
      markerRef.current.setLatLng([location.lat, location.lng]);
    }
  }, [location.lat, location.lng]);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}

export default function PropertyForm({
  isOpen,
  onClose,
  onSave,
  property,
  currentUser = { id: "user-id", name: "User Name", email: "user@email.com" },
}: PropertyFormProps) {  const [formData, setFormData] = useState<FormData>(() =>
    createDefaultFormData(currentUser)
  );
  const [numRooms, setNumRooms] = useState(0);
  const [imageItems, setImageItems] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const latestImageItemsRef = useRef<ImageItem[]>([]);

  useEffect(() => {
    latestImageItemsRef.current = imageItems;
  }, [imageItems]);

  useEffect(() => {
    return () => cleanupImageItems(latestImageItemsRef.current);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const nextFormData = property
      ? {
          title: property.title || "",
          description: property.description || "",
          price: property.price?.toString() || "",
          address: property.address || "",
          location: property.location || DEFAULT_LOCATION,
          type: property.type || "Studio",
          availability: property.availability || "Available",
          gender: property.gender || "Any",
          bedrooms: property.bedrooms ?? 0,
          bathrooms: property.bathrooms ?? 1,
          amenities: property.amenities || [],
          rooms: property.rooms || [],
          ownerId: property.owner_id || currentUser.id,
          ownerName: property.owner_name || currentUser.name,
          ownerEmail: property.owner_email || currentUser.email,
          ownerPhone: property.owner_phone || "",
        }
      : createDefaultFormData({
          id: currentUser.id,
          name: currentUser.name,
          email: currentUser.email,
        });

    setFormData(nextFormData);
    setNumRooms(property?.rooms?.length || 0);
    setLoading(false);
    setUploadingPhotos(false);
    setShowValidation(false);
    setImageItems((previous) => {
      cleanupImageItems(previous);
      return toImageItems(property?.images || []);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [currentUser.email, currentUser.id, currentUser.name, isOpen, property]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !loading && !uploadingPhotos) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, loading, onClose, uploadingPhotos]);

  const selectedImageCount = imageItems.length;
  const existingImageUrls = imageItems
    .filter((item) => !item.isNew)
    .map((item) => item.url);
  const newImageFiles = imageItems
    .filter((item) => item.isNew && item.file)
    .map((item) => item.file as File);

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []).filter((file) =>
      file.type.startsWith("image/")
    );

    if (files.length === 0) return;

    setUploadingPhotos(true);

    const nextImages = files.map((file, index) => ({
      id: `new-${Date.now()}-${index}-${file.name}`,
      url: URL.createObjectURL(file),
      file,
      isNew: true,
    }));

    setImageItems((current) => [...current, ...nextImages]);
    setUploadingPhotos(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (id: string) => {
    setImageItems((current) => {
      const imageToRemove = current.find((item) => item.id === id);
      if (imageToRemove?.isNew) {
        URL.revokeObjectURL(imageToRemove.url);
      }

      return current.filter((item) => item.id !== id);
    });
  };

  const handleUseMyLocation = () => {
    if (!("geolocation" in navigator)) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        updateField("location", {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        toast.success("Location updated.");
      },
      () => {
        toast.error(
          "We could not read your current location. You can still place the pin manually on the map."
        );
      }
    );
  };

  const handleNumRoomsChange = (value: number) => {
    const nextCount = Math.max(0, Math.min(50, value || 0));
    setNumRooms(nextCount);

    setFormData((current) => {
      const nextRooms = Array.from({ length: nextCount }, (_, index) => {
        const existingRoom = current.rooms[index];
        return (
          existingRoom || {
            roomNumber: `Room ${index + 1}`,
            maxOccupancy: 1,
            currentOccupancy: 0,
            price: Number(current.price) || 0,
          }
        );
      });

      return {
        ...current,
        rooms: nextRooms,
      };
    });
  };

  const handleRoomChange = (index: number, field: keyof Room, value: string | number) => {
    setFormData((current) => {
      const nextRooms = [...current.rooms];
      nextRooms[index] = {
        ...nextRooms[index],
        [field]: value,
      };

      return {
        ...current,
        rooms: nextRooms,
      };
    });
  };

  const toggleAmenity = (amenity: string) => {
    setFormData((current) => {
      const nextAmenities = current.amenities.includes(amenity)
        ? current.amenities.filter((item) => item !== amenity)
        : [...current.amenities, amenity];

      return {
        ...current,
        amenities: nextAmenities,
      };
    });
  };

  const handleSubmit = async () => {
    setShowValidation(true);

    if (!formData.title.trim() || !formData.description.trim() || !formData.address.trim()) {
      toast.error("Please complete the required listing details first.");
      return;
    }

    if (!formData.price || Number(formData.price) <= 0) {
      toast.error("Base price must be greater than zero.");
      return;
    }

    if (selectedImageCount === 0) {
      toast.error("Add at least one property image before saving.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        address: formData.address.trim(),
        location: formData.location || DEFAULT_LOCATION,
        type: formData.type,
        availability: formData.availability,
        gender: formData.gender,
        bedrooms: Number(formData.bedrooms) || 0,
        bathrooms: Number(formData.bathrooms) || 0,
        amenities: formData.amenities,
        rooms: formData.rooms,
        owner_phone: formData.ownerPhone.trim(),
        owner_id: formData.ownerId || currentUser.id,
        owner_name: formData.ownerName || currentUser.name,
        owner_email: formData.ownerEmail || currentUser.email,
        images: existingImageUrls,
        imageFiles: newImageFiles,
      };

      if (property) {
        await updateProperty(property.id, payload);
      } else {
        await createProperty(payload);
      }

      toast.success(property ? "Property updated successfully." : "Property created successfully.");
      onSave();
      onClose();
    } catch (error: any) {
      console.error("Error saving property:", error);
      toast.error(error.message || "Failed to save property.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="boardmap-modal-overlay" onClick={onClose} style={{ zIndex: 250 }}>
      <div
        className="boardmap-panel-strong boardmap-modal"
        style={{
          width: "min(1180px, 100%)",
          maxHeight: "92vh",
          display: "grid",
          gridTemplateRows: "auto 1fr auto",
          overflow: "hidden",
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <div
          style={{
            padding: "1.15rem 1.2rem",
            borderBottom: "1px solid rgba(47, 106, 69, 0.12)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "1rem",
          }}
        >
          <div>
            <span className="boardmap-eyebrow">
              <Sparkles size={14} />
              Owner listing form
            </span>
            <h2 className="boardmap-section-title" style={{ marginTop: "0.7rem" }}>
              {property ? "Edit property" : "Add a new property"}
            </h2>
            <p className="boardmap-section-copy">
              Keep the listing complete, visual, and easy for students to compare.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="boardmap-button-secondary"
            style={{ minWidth: 46, paddingInline: "0.95rem" }}
          >
            <X size={18} />
          </button>
        </div>

        <div className="boardmap-modal-body boardmap-scroll" style={{ padding: "1rem 1.2rem 1.2rem" }}>
          <div style={{ display: "grid", gap: "1rem" }}>
            <div className="boardmap-panel" style={{ padding: "1rem" }}>
              <div className="boardmap-badge-row">
                <span className="boardmap-badge">{selectedImageCount} image{selectedImageCount === 1 ? "" : "s"}</span>
                <span className="boardmap-badge">{formData.amenities.length} amenit{formData.amenities.length === 1 ? "y" : "ies"}</span>
                <span className="boardmap-badge">{numRooms > 0 ? `${numRooms} room${numRooms === 1 ? "" : "s"}` : "Single unit"}</span>
              </div>
            </div>            <div className="boardmap-form-grid-two">
              <section className="boardmap-list-card">
                <div>
                  <h3 className="boardmap-section-title" style={{ fontSize: "1.18rem" }}>
                    Listing basics
                  </h3>
                  <p className="boardmap-helper" style={{ marginTop: "0.35rem" }}>
                    Start with the information students see first.
                  </p>
                </div>

                <label className="boardmap-field">
                  <span className="boardmap-label">Property title *</span>
                  <input
                    className="boardmap-input"
                    type="text"
                    value={formData.title}
                    onChange={(event) => updateField("title", event.target.value)}
                    placeholder="Cozy studio near VSU main gate"
                    maxLength={100}
                  />
                </label>

                <label className="boardmap-field">
                  <span className="boardmap-label">Description *</span>
                  <textarea
                    className="boardmap-textarea"
                    value={formData.description}
                    onChange={(event) => updateField("description", event.target.value)}
                    placeholder="Describe the room setup, nearby landmarks, and what makes the place comfortable."
                    rows={5}
                  />
                </label>

                <label className="boardmap-field">
                  <span className="boardmap-label">Address *</span>
                  <input
                    className="boardmap-input"
                    type="text"
                    value={formData.address}
                    onChange={(event) => updateField("address", event.target.value)}
                    placeholder="Barangay Poblacion 8, Baybay City"
                  />
                </label>
              </section>

              <section className="boardmap-list-card">
                <div>
                  <h3 className="boardmap-section-title" style={{ fontSize: "1.18rem" }}>
                    Rental details
                  </h3>
                  <p className="boardmap-helper" style={{ marginTop: "0.35rem" }}>
                    Keep the structure clear so pricing and availability are easy to trust.
                  </p>
                </div>

                <div className="boardmap-form-grid-two">
                  <label className="boardmap-field">
                    <span className="boardmap-label">Base price (PHP/month) *</span>
                    <input
                      className="boardmap-input"
                      type="number"
                      value={formData.price}
                      onChange={(event) => updateField("price", event.target.value)}
                      placeholder="3500"
                      min="1"
                    />
                  </label>

                  <label className="boardmap-field">
                    <span className="boardmap-label">Property type *</span>
                    <select
                      className="boardmap-select"
                      value={formData.type}
                      onChange={(event) => updateField("type", event.target.value)}
                    >
                      {PROPERTY_TYPES.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="boardmap-form-grid-three">
                  <label className="boardmap-field">
                    <span className="boardmap-label">Availability</span>
                    <select
                      className="boardmap-select"
                      value={formData.availability}
                      onChange={(event) => updateField("availability", event.target.value)}
                    >
                      {AVAILABILITY_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="boardmap-field">
                    <span className="boardmap-label">Gender</span>
                    <select
                      className="boardmap-select"
                      value={formData.gender}
                      onChange={(event) => updateField("gender", event.target.value)}
                    >
                      {GENDER_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="boardmap-field">
                    <span className="boardmap-label">Contact phone</span>
                    <div style={{ position: "relative" }}>
                      <Phone
                        size={16}
                        style={{
                          position: "absolute",
                          left: "0.9rem",
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: "#6e8f7d",
                        }}
                      />
                      <input
                        className="boardmap-input"
                        style={{ paddingLeft: "2.5rem" }}
                        type="tel"
                        value={formData.ownerPhone}
                        onChange={(event) => updateField("ownerPhone", event.target.value)}
                        placeholder="+63 915 211 1698"
                      />
                    </div>
                  </label>
                </div>

                <div className="boardmap-form-grid-three">
                  <label className="boardmap-field">
                    <span className="boardmap-label">Bedrooms</span>
                    <div style={{ position: "relative" }}>
                      <BedDouble
                        size={16}
                        style={{
                          position: "absolute",
                          left: "0.9rem",
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: "#6e8f7d",
                        }}
                      />
                      <input
                        className="boardmap-input"
                        style={{ paddingLeft: "2.5rem" }}
                        type="number"
                        value={formData.bedrooms}
                        onChange={(event) =>
                          updateField("bedrooms", Number(event.target.value) || 0)
                        }
                        min="0"
                      />
                    </div>
                  </label>

                  <label className="boardmap-field">
                    <span className="boardmap-label">Bathrooms</span>
                    <div style={{ position: "relative" }}>
                      <Bath
                        size={16}
                        style={{
                          position: "absolute",
                          left: "0.9rem",
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: "#6e8f7d",
                        }}
                      />
                      <input
                        className="boardmap-input"
                        style={{ paddingLeft: "2.5rem" }}
                        type="number"
                        value={formData.bathrooms}
                        onChange={(event) =>
                          updateField("bathrooms", Number(event.target.value) || 0)
                        }
                        min="0"
                      />
                    </div>
                  </label>

                  <label className="boardmap-field">
                    <span className="boardmap-label">Room count</span>
                    <input
                      className="boardmap-input"
                      type="number"
                      value={numRooms}
                      onChange={(event) =>
                        handleNumRoomsChange(Number(event.target.value) || 0)
                      }
                      min="0"
                      max="50"
                    />
                  </label>
                </div>
              </section>
            </div>

            <section className="boardmap-list-card">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "1rem",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <h3 className="boardmap-section-title" style={{ fontSize: "1.18rem" }}>
                    Photos
                  </h3>
                  <p className="boardmap-helper" style={{ marginTop: "0.35rem" }}>
                    Lead with clear images of the room, exterior, and shared spaces.
                  </p>
                </div>

                <button
                  type="button"
                  className="boardmap-button-primary"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingPhotos}
                >
                  <Upload size={18} />
                  {uploadingPhotos ? "Adding images..." : "Upload images"}
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
                style={{ display: "none" }}
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="boardmap-upload-zone"
              >
                <ImagePlus size={26} />
                <strong>Add interior and exterior shots</strong>
                <span>
                  Drag-and-drop is not required here. Just choose one or more images from your device.
                </span>
              </button>

              {showValidation && selectedImageCount === 0 && (
                <p style={{ margin: 0, color: "#c75146", fontSize: "0.84rem", fontWeight: 600 }}>
                  Add at least one property image before saving.
                </p>
              )}

              {selectedImageCount > 0 && (
                <div className="boardmap-image-grid">
                  {imageItems.map((image, index) => (
                    <div key={image.id} className="boardmap-image-card">
                      <img
                        src={image.url}
                        alt={`${formData.title || "Property"} preview ${index + 1}`}
                        style={{
                          width: "100%",
                          height: 150,
                          objectFit: "cover",
                          borderRadius: 18,
                        }}
                      />
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: "0.75rem",
                        }}
                      >
                        <span className="boardmap-helper">
                          {image.isNew ? "New upload" : "Existing image"}
                        </span>
                        <button
                          type="button"
                          className="boardmap-button-secondary"
                          style={{ padding: "0.5rem 0.8rem" }}
                          onClick={() => removeImage(image.id)}
                        >
                          <X size={16} />
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>            <div className="boardmap-form-grid-two">
              <section className="boardmap-list-card">
                <div>
                  <h3 className="boardmap-section-title" style={{ fontSize: "1.18rem" }}>
                    Amenities
                  </h3>
                  <p className="boardmap-helper" style={{ marginTop: "0.35rem" }}>
                    Select the comforts students care about most.
                  </p>
                </div>

                <div className="boardmap-amenity-grid">
                  {AMENITY_OPTIONS.map(({ label, Icon }) => {
                    const active = formData.amenities.includes(label);
                    return (
                      <button
                        key={label}
                        type="button"
                        className={`boardmap-amenity-toggle ${
                          active ? "boardmap-amenity-toggle-active" : ""
                        }`}
                        onClick={() => toggleAmenity(label)}
                        aria-pressed={active}
                      >
                        <span className="boardmap-amenity-icon">
                          <Icon size={18} />
                        </span>
                        <span>{label}</span>
                      </button>
                    );
                  })}
                </div>
              </section>

              <section className="boardmap-list-card">
                <div>
                  <h3 className="boardmap-section-title" style={{ fontSize: "1.18rem" }}>
                    Room setup
                  </h3>
                  <p className="boardmap-helper" style={{ marginTop: "0.35rem" }}>
                    Use this only when the listing has multiple rentable rooms.
                  </p>
                </div>

                {numRooms === 0 ? (
                  <div
                    className="boardmap-panel"
                    style={{
                      padding: "1rem",
                      borderStyle: "dashed",
                      borderWidth: 1,
                    }}
                  >
                    <strong style={{ display: "block", fontSize: "0.95rem" }}>Single-unit listing</strong>
                    <p className="boardmap-helper" style={{ marginTop: "0.35rem" }}>
                      The base price will be used for the whole property.
                    </p>
                  </div>
                ) : (
                  <div style={{ display: "grid", gap: "0.8rem" }}>
                    {formData.rooms.map((room, index) => (
                      <div key={`${room.roomNumber}-${index}`} className="boardmap-panel" style={{ padding: "0.95rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", marginBottom: "0.8rem" }}>
                          <strong style={{ fontSize: "0.98rem" }}>Room {index + 1}</strong>
                          <span className="boardmap-chip">{room.maxOccupancy} max occupants</span>
                        </div>

                        <div className="boardmap-form-grid-two">
                          <label className="boardmap-field">
                            <span className="boardmap-label">Room name</span>
                            <input
                              className="boardmap-input"
                              type="text"
                              value={room.roomNumber}
                              onChange={(event) =>
                                handleRoomChange(index, "roomNumber", event.target.value)
                              }
                            />
                          </label>

                          <label className="boardmap-field">
                            <span className="boardmap-label">Max occupancy</span>
                            <input
                              className="boardmap-input"
                              type="number"
                              value={room.maxOccupancy}
                              min="1"
                              onChange={(event) =>
                                handleRoomChange(
                                  index,
                                  "maxOccupancy",
                                  Number(event.target.value) || 1
                                )
                              }
                            />
                          </label>
                        </div>

                        <label className="boardmap-field" style={{ marginTop: "0.8rem" }}>
                          <span className="boardmap-label">Price per tenant (PHP/month)</span>
                          <input
                            className="boardmap-input"
                            type="number"
                            value={room.price}
                            min="0"
                            onChange={(event) =>
                              handleRoomChange(index, "price", Number(event.target.value) || 0)
                            }
                          />
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>

            <section className="boardmap-list-card">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "1rem",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <h3 className="boardmap-section-title" style={{ fontSize: "1.18rem" }}>
                    Map location
                  </h3>
                  <p className="boardmap-helper" style={{ marginTop: "0.35rem" }}>
                    Pin the listing so students can judge the walkability around VSU.
                  </p>
                </div>

                <button
                  type="button"
                  className="boardmap-button-secondary"
                  onClick={handleUseMyLocation}
                >
                  <MapPin size={18} />
                  Use my location
                </button>
              </div>

              <div className="boardmap-panel" style={{ padding: "0.95rem" }}>
                <div className="boardmap-inline-meta">
                  <span>
                    Lat {formData.location.lat.toFixed(5)}
                  </span>
                  <span>
                    Lng {formData.location.lng.toFixed(5)}
                  </span>
                </div>
              </div>

              <div
                style={{
                  height: 300,
                  borderRadius: 22,
                  overflow: "hidden",
                  border: "1px solid rgba(47, 106, 69, 0.16)",
                }}
              >
                <LocationPicker
                  location={formData.location}
                  onChange={(location) => updateField("location", location)}
                />
              </div>
            </section>
          </div>
        </div>

        <div
          style={{
            padding: "1rem 1.2rem",
            borderTop: "1px solid rgba(47, 106, 69, 0.12)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <p className="boardmap-helper" style={{ margin: 0 }}>
            Required fields are marked with *.
          </p>

          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <button
              type="button"
              className="boardmap-button-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="button"
              className="boardmap-button-primary"
              onClick={handleSubmit}
              disabled={loading || uploadingPhotos}
            >
              {loading ? "Saving..." : property ? "Update property" : "Create property"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
