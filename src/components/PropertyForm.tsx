import { useState, useEffect, useRef } from "react";
import { X, MapPin, Plus, Trash2, Upload } from "lucide-react";
import { Property, Room, createProperty, updateProperty } from "../utils/api";
import { toast } from "sonner";
import { createClient } from "../utils/supabase/client";

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
  location: Location | null;
  type: string;
  gender: string;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  images: string[];
  rooms: Room[];
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone?: string;
  availability: string;
}

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

  useEffect(() => {
    if (!containerRef.current || typeof window === "undefined") return;

    const initMap = () => {
      // @ts-ignore
      if (!window.L) {
        setTimeout(initMap, 100);
        return;
      }

      // @ts-ignore
      const L = window.L;

      if (mapRef.current) {
        mapRef.current.remove();
      }

      const map = L.map(containerRef.current!, {
        center: [location.lat, location.lng],
        zoom: 15,
      });

      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      const marker = L.marker([location.lat, location.lng]).addTo(map);
      markerRef.current = marker;

      map.on("click", (e: any) => {
        const { lat, lng } = e.latlng;
        onChange({ lat, lng });
        marker.setLatLng([lat, lng]);
      });
    };

    initMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (mapRef.current && markerRef.current) {
      mapRef.current.setView([location.lat, location.lng], 15);
      markerRef.current.setLatLng([location.lat, location.lng]);
    }
  }, [location.lat, location.lng]);

  return (
    <div
      ref={containerRef}
      className="w-full h-[300px] rounded-[10px] overflow-hidden"
    />
  );
}

export default function PropertyForm({
  isOpen,
  onClose,
  onSave,
  accessToken,
  property,
  currentUser = { id: "user-id", name: "User Name", email: "user@email.com" },
}: PropertyFormProps) {
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    price: "",
    address: "",
    location: { lat: 10.6777, lng: 124.8009 },
    amenities: [],
    type: "Studio",
    availability: "Available",
    gender: "Any",
    bedrooms: 0,
    bathrooms: 0,
    ownerPhone: "",
    rooms: [],
    images: [],
    ownerId: currentUser?.id || "",
    ownerName: currentUser?.name || "",
    ownerEmail: currentUser?.email || "",
  });

  const [numRooms, setNumRooms] = useState(0);
  const [loading, setLoading] = useState(false);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title || "",
        description: property.description || "",
        price: property.price?.toString() || "",
        address: property.address || "",
        location: property.location || { lat: 10.6777, lng: 124.8009 },
        amenities: property.amenities || [],
        type: property.type || "Studio",
        gender: property.gender || "Any",
        bedrooms: property.bedrooms || 1,
        bathrooms: property.bathrooms || 1,
        ownerPhone: property.owner_phone || "",
        rooms: property.rooms || [],
        images: property.images || [],
        availability: property.availability || "Available",
        ownerId: property.owner_id || currentUser?.id || "",
        ownerName: property.owner_name || currentUser?.name || "",
        ownerEmail: property.owner_email || currentUser?.email || "",
      });
      setNumRooms(property.rooms?.length || 0);
    }
  }, [property]);

  // Photo upload handler
  const handlePhotoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploadingPhotos(true);

    try {
      const newPhotos: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const objectUrl = URL.createObjectURL(file);
        newPhotos.push(objectUrl);
      }

      setFormData((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...newPhotos],
      }));

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error uploading photos:", error);
      toast.error("Failed to upload photos");
    } finally {
      setUploadingPhotos(false);
    }
  };

  const removePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleUseMyLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          });
          toast.success("Location updated!");
        },
        (error) => {
          console.error("Geolocation error:", error);
          toast.error(
            "Could not get your location. Please click on the map to set location."
          );
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser");
    }
  };

  const handleNumRoomsChange = (num: number) => {
    setNumRooms(num);
    const newRooms: Room[] = [];
    for (let i = 0; i < num; i++) {
      newRooms.push(
        formData.rooms?.[i] || {
          roomNumber: `Room ${i + 1}`,
          maxOccupancy: 1,
          currentOccupancy: 0,
          price: parseFloat(formData.price) || 0,
        }
      );
    }
    setFormData({ ...formData, rooms: newRooms });
  };

  const handleRoomChange = (index: number, field: keyof Room, value: any) => {
    const newRooms = [...formData.rooms];
    newRooms[index] = { ...newRooms[index], [field]: value };
    setFormData({ ...formData, rooms: newRooms });
  };

  const toggleAmenity = (amenity: string) => {
    const current = formData.amenities;
    if (current.includes(amenity)) {
      setFormData({
        ...formData,
        amenities: current.filter((a) => a !== amenity),
      });
    } else {
      setFormData({ ...formData, amenities: [...current, amenity] });
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Validation
      if (!formData.title || !formData.description || !formData.address) {
        toast.error("Please fill in all required fields");
        return;
      }

      if (!formData.price || parseFloat(formData.price) <= 0) {
        toast.error("Price must be greater than 0");
        return;
      }

      // Photo validation
      if (!formData.images || formData.images.length === 0) {
        toast.error("Please add at least one photo of your property");
        return;
      }

      // ✅ ADD THIS: Log the complete data before sending
      console.log("📝 Form data before sending:", {
        title: formData.title,
        price: Number(formData.price),
        address: formData.address,
        description: formData.description,
        bedrooms: Number(formData.bedrooms) || 1,
        bathrooms: Number(formData.bathrooms) || 1,
        amenities: formData.amenities || [],
        images: formData.images || [],
        rooms: formData.rooms || [],
        location: formData.location || { lat: 10.6777, lng: 124.8009 },
        ownerId: user?.id || currentUser.id,
        ownerName: user?.user_metadata?.name || currentUser.name,
        ownerEmail: user?.email || currentUser.email,
      });

      // ✅ CREATE A CLEAN PAYLOAD THAT MATCHES YOUR DATABASE SCHEMA
      const payload = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        address: formData.address,
        location: formData.location || { lat: 10.6777, lng: 124.8009 },
        type: formData.type || "Studio",
        gender: formData.gender || "Any",
        bedrooms: Number(formData.bedrooms) || 1,
        bathrooms: Number(formData.bathrooms) || 1,
        amenities: formData.amenities || [],
        images: formData.images || [],
        rooms: formData.rooms || [],
        availability: formData.availability || "Available",
        owner_phone: formData.ownerPhone || "",
        owner_id: user?.id || currentUser.id,
        owner_name: user?.user_metadata?.name || currentUser.name,
        owner_email: user?.email || currentUser.email,
      };

      console.log("🚀 Sending payload to API:", payload);

      let result;
      if (property) {
        result = await updateProperty(property.id, payload);
      } else {
        result = await createProperty(payload);
      }

      console.log("✅ API Response:", result);

      toast.success(
        property
          ? "Property updated successfully!"
          : "Property created successfully!"
      );

      onSave();
      onClose();
    } catch (error: any) {
      console.error("❌ Error saving property:", error);
      console.error("Error details:", {
        message: error.message,
        status: error.status,
        statusText: error.statusText,
        data: error.data,
      });

      // Show more specific error messages
      if (error.message?.includes("Not Found")) {
        toast.error("API endpoint not found. Please check server connection.");
      } else if (error.message?.includes("Network Error")) {
        toast.error("Network error. Please check your connection.");
      } else if (error.status === 401) {
        toast.error("Authentication failed. Please log in again.");
      } else {
        toast.error(error.message || "Failed to save property");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const availableAmenities = [
    "WiFi",
    "Air Conditioning",
    "Kitchen",
    "Parking",
    "Laundry",
    "Security",
    "Study Desk",
    "Water",
  ];

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[250] p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[20px] max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-[#e7f0dc] p-4 md:p-6 flex items-center justify-between z-10 rounded-t-[20px]">
          <h2 className="font-['REM:SemiBold',sans-serif] text-[24px] md:text-[32px] text-[#4f6f52]">
            {property ? "Edit Property" : "Add New Property"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#e7f0dc] rounded-full transition-colors"
          >
            <X size={24} className="text-[#597445]" />
          </button>
        </div>

        {/* Form */}
        <div className="p-4 md:p-8 space-y-6">
          {/* Basic Info */}
          <div>
            <label className="font-['Rethink_Sans:SemiBold',sans-serif] text-[16px] md:text-[18px] text-[#4f6f52] block mb-2">
              Property Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g., Cozy Studio near VSU"
              className="w-full bg-white border-2 border-[#597445] rounded-[10px] px-4 py-3 text-[#4f6f52] outline-none focus:ring-2 focus:ring-[#79ac78]"
            />
          </div>

          <div>
            <label className="font-['Rethink_Sans:SemiBold',sans-serif] text-[16px] md:text-[18px] text-[#4f6f52] block mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Describe your property..."
              rows={4}
              className="w-full bg-white border-2 border-[#597445] rounded-[10px] px-4 py-3 text-[#4f6f52] outline-none focus:ring-2 focus:ring-[#79ac78] resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-['Rethink_Sans:SemiBold',sans-serif] text-[16px] md:text-[18px] text-[#4f6f52] block mb-2">
                Base Price (₱/month) *
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: e.target.value,
                  })
                }
                placeholder="3500"
                className="w-full bg-white border-2 border-[#597445] rounded-[10px] px-4 py-3 text-[#4f6f52] outline-none focus:ring-2 focus:ring-[#79ac78]"
              />
            </div>

            <div>
              <label className="font-['Rethink_Sans:SemiBold',sans-serif] text-[16px] md:text-[18px] text-[#4f6f52] block mb-2">
                Property Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="w-full bg-white border-2 border-[#597445] rounded-[10px] px-4 py-3 text-[#4f6f52] outline-none focus:ring-2 focus:ring-[#79ac78]"
              >
                <option>Studio</option>
                <option>Private Room</option>
                <option>Shared Room</option>
                <option>Bed Space</option>
                <option>Apartment</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="font-['Rethink_Sans:SemiBold',sans-serif] text-[16px] md:text-[18px] text-[#4f6f52] block mb-2">
                Bedrooms
              </label>
              <input
                type="number"
                value={formData.bedrooms}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bedrooms: parseInt(e.target.value) || 1,
                  })
                }
                min="1"
                className="w-full bg-white border-2 border-[#597445] rounded-[10px] px-4 py-3 text-[#4f6f52] outline-none focus:ring-2 focus:ring-[#79ac78]"
              />
            </div>

            <div>
              <label className="font-['Rethink_Sans:SemiBold',sans-serif] text-[16px] md:text-[18px] text-[#4f6f52] block mb-2">
                Bathrooms
              </label>
              <input
                type="number"
                value={formData.bathrooms}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bathrooms: parseInt(e.target.value) || 1,
                  })
                }
                min="1"
                className="w-full bg-white border-2 border-[#597445] rounded-[10px] px-4 py-3 text-[#4f6f52] outline-none focus:ring-2 focus:ring-[#79ac78]"
              />
            </div>

            <div>
              <label className="font-['Rethink_Sans:SemiBold',sans-serif] text-[16px] md:text-[18px] text-[#4f6f52] block mb-2">
                Gender
              </label>
              <select
                value={formData.gender}
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value })
                }
                className="w-full bg-white border-2 border-[#597445] rounded-[10px] px-4 py-3 text-[#4f6f52] outline-none focus:ring-2 focus:ring-[#79ac78]"
              >
                <option>Any</option>
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-['Rethink_Sans:SemiBold',sans-serif] text-[16px] md:text-[18px] text-[#4f6f52] block mb-2">
              Contact Phone
            </label>
            <input
              type="tel"
              value={formData.ownerPhone || ""}
              onChange={(e) =>
                setFormData({ ...formData, ownerPhone: e.target.value })
              }
              placeholder="+63 915 211 1698"
              className="w-full bg-white border-2 border-[#597445] rounded-[10px] px-4 py-3 text-[#4f6f52] outline-none focus:ring-2 focus:ring-[#79ac78]"
            />
          </div>

          {/* Multiple Rooms */}
          <div>
            <label className="font-['Rethink_Sans:SemiBold',sans-serif] text-[16px] md:text-[18px] text-[#4f6f52] block mb-2">
              Number of Rooms (0 for single unit)
            </label>
            <input
              type="number"
              value={numRooms}
              onChange={(e) =>
                handleNumRoomsChange(parseInt(e.target.value) || 0)
              }
              min="0"
              max="50"
              className="w-full bg-white border-2 border-[#597445] rounded-[10px] px-4 py-3 text-[#4f6f52] outline-none focus:ring-2 focus:ring-[#79ac78]"
            />
          </div>

          {numRooms > 0 && (
            <div className="space-y-4">
              <h3 className="font-['Rethink_Sans:SemiBold',sans-serif] text-[18px] md:text-[20px] text-[#4f6f52]">
                Room Details
              </h3>
              {formData.rooms?.map((room, index) => (
                <div
                  key={index}
                  className="bg-[#e7f0dc] rounded-[12px] p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-['Rethink_Sans:SemiBold',sans-serif] text-[16px] text-[#4f6f52]">
                      Room {index + 1}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="font-['Rethink_Sans:Medium',sans-serif] text-[14px] text-[#597445] block mb-1">
                        Room Name
                      </label>
                      <input
                        type="text"
                        value={room.roomNumber}
                        onChange={(e) =>
                          handleRoomChange(index, "roomNumber", e.target.value)
                        }
                        className="w-full bg-white border border-[#597445] rounded-[8px] px-3 py-2 text-[#4f6f52] outline-none focus:ring-2 focus:ring-[#79ac78]"
                      />
                    </div>
                    <div>
                      <label className="font-['Rethink_Sans:Medium',sans-serif] text-[14px] text-[#597445] block mb-1">
                        Max Occupancy
                      </label>
                      <input
                        type="number"
                        value={room.maxOccupancy}
                        onChange={(e) =>
                          handleRoomChange(
                            index,
                            "maxOccupancy",
                            parseInt(e.target.value) || 1
                          )
                        }
                        min="1"
                        className="w-full bg-white border border-[#597445] rounded-[8px] px-3 py-2 text-[#4f6f52] outline-none focus:ring-2 focus:ring-[#79ac78]"
                      />
                    </div>
                    <div>
                      <label className="font-['Rethink_Sans:Medium',sans-serif] text-[14px] text-[#597445] block mb-1">
                        Price per Tenant (₱/month)
                      </label>
                      <input
                        type="number"
                        value={room.price}
                        onChange={(e) =>
                          handleRoomChange(
                            index,
                            "price",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-full bg-white border border-[#597445] rounded-[8px] px-3 py-2 text-[#4f6f52] outline-none focus:ring-2 focus:ring-[#79ac78]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Photos Upload */}
          <div>
            <label className="font-['Rethink_Sans:SemiBold',sans-serif] text-[16px] md:text-[18px] text-[#4f6f52] block mb-2">
              Property Photos *
            </label>

            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />

            {/* Upload button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingPhotos}
              className="flex items-center gap-2 bg-[#79ac78] text-white px-4 py-3 rounded-[10px] hover:bg-[#6b9b69] transition-colors disabled:opacity-50 mb-4"
            >
              {uploadingPhotos ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={18} />
                  Add Photos
                </>
              )}
            </button>

            {/* Photo preview grid */}
            {formData.images && formData.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Property photo ${index + 1}`}
                      className="w-full h-32 object-cover rounded-[10px] border-2 border-[#597445]"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Validation message */}
            {(!formData.images || formData.images.length === 0) && (
              <p className="text-red-500 text-sm mt-2">
                Please add at least one photo of your property
              </p>
            )}

            <p className="font-['Rethink_Sans:Regular',sans-serif] text-[14px] text-[#597445] mt-2">
              Upload clear photos of the property interior and exterior. You can
              select multiple photos.
            </p>
          </div>

          {/* Amenities */}
          <div>
            <label className="font-['Rethink_Sans:SemiBold',sans-serif] text-[16px] md:text-[18px] text-[#4f6f52] block mb-2">
              Amenities
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {availableAmenities.map((amenity) => (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => toggleAmenity(amenity)}
                  className={`px-3 py-2 rounded-[10px] font-['Rethink_Sans:Medium',sans-serif] text-[14px] transition-all ${
                    formData.amenities?.includes(amenity)
                      ? "bg-[#79ac78] text-white"
                      : "bg-[#e7f0dc] text-[#597445] border-2 border-[#597445]"
                  }`}
                >
                  {amenity}
                </button>
              ))}
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="font-['Rethink_Sans:SemiBold',sans-serif] text-[16px] md:text-[18px] text-[#4f6f52] block mb-2">
              Address *
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              placeholder="Barangay Poblacion 8, Baybay City"
              className="w-full bg-white border-2 border-[#597445] rounded-[10px] px-4 py-3 text-[#4f6f52] outline-none focus:ring-2 focus:ring-[#79ac78]"
            />
          </div>

          {/* Location Map */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-['Rethink_Sans:SemiBold',sans-serif] text-[16px] md:text-[18px] text-[#4f6f52]">
                Location on Map *
              </label>
              <button
                type="button"
                onClick={handleUseMyLocation}
                className="flex items-center gap-2 bg-[#79ac78] text-white px-4 py-2 rounded-[10px] hover:bg-[#6b9b69] transition-colors"
              >
                <MapPin size={18} />
                Use My Location
              </button>
            </div>
            <p className="font-['Rethink_Sans:Regular',sans-serif] text-[14px] text-[#597445] mb-2">
              Click on the map to set property location
            </p>
            <div className="h-[300px] md:h-[400px] rounded-[12px] overflow-hidden border-2 border-[#597445]">
              <LocationPicker
                location={formData.location || { lat: 10.6777, lng: 124.8009 }}
                onChange={(location) => setFormData({ ...formData, location })}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-white text-[#597445] border-2 border-[#597445] rounded-[15px] px-4 py-3 font-['Rethink_Sans:SemiBold',sans-serif] text-[16px] md:text-[18px] hover:bg-[#f5f5f5] transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-[#4f6f52] text-white rounded-[15px] px-4 py-3 font-['Rethink_Sans:SemiBold',sans-serif] text-[16px] md:text-[18px] hover:bg-[#3d5841] transition-colors disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : property
                ? "Update Property"
                : "Create Property"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
