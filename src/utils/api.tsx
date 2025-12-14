import {
  createClient as createSupabaseClient,
  SupabaseClient,
} from "@supabase/supabase-js";
import { projectId, publicAnonKey } from "./supabase/info";

const supabaseUrl = `https://${projectId}.supabase.co`;
const supabaseAnonKey = publicAnonKey;
const API_BASE = `${supabaseUrl}/functions/v1/make-server-47d35f34`;

let _supabase: SupabaseClient | null = null;
function createClient(): SupabaseClient {
  if (!_supabase) {
    _supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);
  }
  return _supabase;
}

// Initialize supabase client
const supabase = createClient();

export interface PropertyImage {
  id: string;
  url: string;
  propertyId: string;
  isPrimary: boolean;
  createdAt: string;
}

export interface Room {
  roomNumber: string;
  maxOccupancy: number;
  currentOccupancy: number;
  price: number;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  address: string;
  location: { lat: number; lng: number };
  amenities: string[];
  type: string;
  availability: string;
  gender: string;
  rating: number;
  reviews: number;
  images: string[];
  bedrooms: number;
  bathrooms: number;
  owner_id: string;
  owner_name: string;
  owner_email: string;
  owner_phone?: string;
  rooms?: Room[];
  created_at: string;
  updated_at?: string;
}

export interface Occupant {
  id: string;
  propertyId: string;
  propertyTitle: string;
  roomNumber: string;
  name: string;
  email: string;
  phone?: string;
  monthlyRent: number;
  paidUntil: string;
  status: "active" | "inactive";
  ownerId: string;
  createdAt: string;
}

export interface Inquiry {
  id: string;
  propertyId: string;
  propertyTitle: string;
  studentId: string;
  studentName: string;
  message: string;
  ownerId: string;
  status: "active" | "archived";
  createdAt: string;
  archivedAt?: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  message: string;
  propertyId?: string;
  timestamp: string;
}

export interface Review {
  id: string;
  propertyId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface FilterOptions {
  priceRange: [number, number];
  propertyTypes: string[];
  gender: string[];
  amenities: string[];
  availability: string[];
  rating: number;
}

export async function uploadToStorage(
  file: File,
  propertyId: string
): Promise<string> {
  try {
    console.log(
      "Uploading file to storage:",
      file.name,
      "for property:",
      propertyId
    );

    // Clean the filename - remove special characters
    const cleanFileName = file.name
      .replace(/[^a-zA-Z0-9.\-_]/g, "_") // Replace special chars with underscores
      .replace(/\s+/g, "_") // Replace spaces with underscores
      .replace(/\+/g, "_") // Replace + with underscores
      .toLowerCase();

    const fileExt = cleanFileName.split(".").pop() || "jpg";

    // Generate safe filename
    const fileName = `${propertyId}-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 9)}.${fileExt}`;

    console.log("Original filename:", file.name);
    console.log("Cleaned filename:", cleanFileName);
    console.log("Final filename for storage:", fileName);

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from("property-images")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (error) {
      console.error("Error uploading to storage:", error);
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("property-images").getPublicUrl(fileName);

    console.log("File uploaded successfully. Public URL:", publicUrl);
    return publicUrl;
  } catch (error: any) {
    console.error("Upload error:", error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }
}

export async function uploadMultipleToStorage(
  files: File[],
  propertyId: string
): Promise<string[]> {
  const uploadedUrls: string[] = [];

  for (const file of files) {
    try {
      const url = await uploadToStorage(file, propertyId);
      uploadedUrls.push(url);
    } catch (error) {
      console.error("Failed to upload file:", file.name, error);
      // Continue with other files even if one fails
    }
  }

  return uploadedUrls;
}

export async function deleteFromStorage(imageUrls: string[]): Promise<void> {
  for (const url of imageUrls) {
    try {
      // Extract filename from URL
      const urlParts = url.split("/");
      const fileName = urlParts[urlParts.length - 1];

      if (fileName) {
        const { error } = await supabase.storage
          .from("property-images")
          .remove([fileName]);

        if (error) {
          console.error("Error deleting file:", fileName, error);
        }
      }
    } catch (error) {
      console.error("Error in deleteFromStorage:", error);
    }
  }
}

async function processPropertyImages(
  images: string[],
  propertyId: string
): Promise<string[]> {
  const processedImages: string[] = [];

  for (const image of images) {
    if (image.startsWith("blob:")) {
      // Convert blob URL to file and upload
      try {
        const response = await fetch(image);
        const blob = await response.blob();
        const file = new File([blob], `image-${Date.now()}.jpg`, {
          type: blob.type,
        });
        const uploadedUrl = await uploadToStorage(file, propertyId);
        processedImages.push(uploadedUrl);
      } catch (error) {
        console.error("Error processing blob image:", error);
      }
    } else if (image && image.startsWith("http")) {
      // Keep existing HTTP URLs
      processedImages.push(image);
    }
  }

  return processedImages;
}

export async function getPropertyImages(
  propertyId: string
): Promise<PropertyImage[]> {
  try {
    // Get the property
    const { data: property, error } = await supabase
      .from("properties")
      .select("images")
      .eq("id", propertyId)
      .single();

    if (error) {
      console.error("Error fetching property:", error);
      return [];
    }

    if (
      property?.images &&
      Array.isArray(property.images) &&
      property.images.length > 0
    ) {
      return property.images.map((url: string, index: number) => {
        // Check if URL is still a blob URL (shouldn't happen with new uploads)
        let imageUrl = url;

        if (url.startsWith("blob:")) {
          console.warn("Blob URL found in database - needs migration:", url);
          // Try to upload it now
          imageUrl = `https://via.placeholder.com/800x400/597445/FFFFFF?text=Migrating+Image`;
        }

        return {
          id: `img-${propertyId}-${index}`,
          url: imageUrl,
          propertyId: propertyId,
          isPrimary: index === 0,
          createdAt: new Date().toISOString(),
        };
      });
    }

    return [];
  } catch (error) {
    console.error("Error in getPropertyImages:", error);
    return [];
  }
}

// Properties API
export async function getProperties(): Promise<Property[]> {
  try {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    const propertiesWithRatings = await Promise.all(
      (data || []).map(async (property) => {
        // Get reviews for this property
        const { data: reviews } = await supabase
          .from("reviews")
          .select("rating")
          .eq("property_id", property.id);

        let averageRating = 0;
        let roundedRating = 0;
        let reviewsCount = 0;

        if (reviews && reviews.length > 0) {
          reviewsCount = reviews.length;

          // Calculate average rating
          const totalRating = reviews.reduce(
            (sum, review) => sum + review.rating,
            0
          );
          averageRating = totalRating / reviewsCount;

          // Round to nearest 0.5
          roundedRating = Math.round(averageRating * 2) / 2;

          // Handle edge cases (round 0.0-0.2 to 0, 0.3-0.7 to 0.5, 0.8-1.0 to 1.0)
          if (roundedRating < 0.25) roundedRating = 0;
          else if (roundedRating < 0.75) roundedRating = 0.5;
          else roundedRating = Math.round(roundedRating);
        }

        return {
          ...property,
          rating: roundedRating,
          reviews: reviewsCount,
        };
      })
    );

    return propertiesWithRatings;
  } catch (error) {
    console.error("Error fetching properties:", error);
    return [];
  }
}

export function calculateRoundedRating(rating: number): number {
  // Round to nearest 0.5
  let rounded = Math.round(rating * 2) / 2;

  // Apply specific rounding rules
  const decimal = rounded - Math.floor(rounded);

  if (decimal === 0) {
    return rounded;
  } else if (decimal <= 0.2) {
    return Math.floor(rounded);
  } else if (decimal >= 0.8) {
    return Math.ceil(rounded);
  } else {
    return Math.floor(rounded) + 0.5;
  }
}

export async function getOwnerProperties(ownerId: string): Promise<Property[]> {
  try {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("owner_id", ownerId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching owner properties:", error);
    return [];
  }
}

export async function createProperty(
  propertyData: Partial<Property> & { imageFiles?: File[] }
): Promise<Property> {
  try {
    console.log("Creating property with data:", propertyData);

    let imageUrls: string[] = [];

    // If imageFiles are provided, upload them to storage
    if (propertyData.imageFiles && propertyData.imageFiles.length > 0) {
      console.log("Uploading image files to storage...");
      const tempPropertyId = `temp-${Date.now()}`;
      imageUrls = await uploadMultipleToStorage(
        propertyData.imageFiles,
        tempPropertyId
      );
      console.log("Uploaded images URLs:", imageUrls);
    }
    // If images array already has URLs (from editing), use them
    else if (
      propertyData.images &&
      Array.isArray(propertyData.images) &&
      propertyData.images.length > 0
    ) {
      imageUrls = propertyData.images.filter(
        (url) => url && url.startsWith("http") && !url.startsWith("blob:")
      );
      console.log("Using existing image URLs:", imageUrls);
    }

    const payload = {
      title: propertyData.title,
      description: propertyData.description || "",
      price: Number(propertyData.price) || 0,
      address: propertyData.address || "",
      location: propertyData.location || { lat: 10.6777, lng: 124.8009 },
      type: propertyData.type || "Studio",
      gender: propertyData.gender || "Any",
      bedrooms: Number(propertyData.bedrooms) || 1,
      bathrooms: Number(propertyData.bathrooms) || 1,
      amenities: propertyData.amenities || [],
      images: imageUrls, // Use uploaded permanent URLs
      availability: propertyData.availability || "Available",
      owner_phone: propertyData.owner_phone || "",
      owner_id: propertyData.owner_id,
      owner_name: propertyData.owner_name,
      owner_email: propertyData.owner_email,
      rooms: propertyData.rooms || [],
    };

    console.log("Sending to Supabase:", payload);

    const { data, error } = await supabase
      .from("properties")
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);

      // If property creation fails, clean up uploaded images
      if (imageUrls.length > 0) {
        await deleteFromStorage(imageUrls);
      }

      throw new Error(error.message || "Failed to create property");
    }

    console.log("Property created successfully:", data);
    return data;
  } catch (error: any) {
    console.error("Error creating property:", error);
    throw new Error(error.message || "Failed to create property");
  }
}

export async function updateProperty(
  id: string,
  updates: Partial<Property>
): Promise<Property> {
  try {
    // Process images if they're being updated
    if (updates.images && Array.isArray(updates.images)) {
      try {
        const processedImages = await processPropertyImages(updates.images, id);
        updates.images = processedImages;
      } catch (imageError) {
        console.error("Error processing update images:", imageError);
      }
    }

    const { data, error } = await supabase
      .from("properties")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error("Error updating property:", error);
    throw new Error(error.message || "Failed to update property");
  }
}

export async function deleteProperty(id: string): Promise<void> {
  try {
    const { error } = await supabase.from("properties").delete().eq("id", id);

    if (error) throw error;
  } catch (error: any) {
    console.error("Error deleting property:", error);
    throw new Error(error.message || "Failed to delete property");
  }
}

// Occupants API
export async function getOccupants(
  ownerId: string,
  accessToken: string
): Promise<Occupant[]> {
  try {
    const response = await fetch(`${API_BASE}/occupants/owner/${ownerId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch occupants");
    }

    return data.occupants || [];
  } catch (error) {
    console.error("Error fetching occupants:", error);
    return [];
  }
}

export async function getOwnerOccupants(
  ownerId: string,
  accessToken: string
): Promise<Occupant[]> {
  try {
    const response = await fetch(`${API_BASE}/occupants/owner/${ownerId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch occupants");
    }

    return data.occupants || [];
  } catch (error) {
    console.error("Error fetching occupants:", error);
    return [];
  }
}

export async function updateOccupant(
  id: string,
  updates: Partial<Occupant>,
  accessToken: string
): Promise<Occupant> {
  const response = await fetch(`${API_BASE}/occupants/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(updates),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to update occupant");
  }

  return data.occupant;
}

export async function deleteOccupant(
  id: string,
  accessToken: string
): Promise<void> {
  const response = await fetch(`${API_BASE}/occupants/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Failed to delete occupant");
  }
}

// Inquiries API
export async function getInquiries(
  ownerId: string,
  accessToken: string
): Promise<Inquiry[]> {
  try {
    const response = await fetch(`${API_BASE}/inquiries/owner/${ownerId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch inquiries");
    }

    return data.inquiries || [];
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    return [];
  }
}

export async function getOwnerInquiries(
  ownerId: string,
  accessToken: string
): Promise<Inquiry[]> {
  try {
    const response = await fetch(`${API_BASE}/inquiries/owner/${ownerId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch inquiries");
    }

    return data.inquiries || [];
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    return [];
  }
}

export async function createInquiry(
  inquiryData: Partial<Inquiry>,
  accessToken: string
): Promise<Inquiry> {
  const response = await fetch(`${API_BASE}/inquiries`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(inquiryData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to create inquiry");
  }

  return data.inquiry;
}

export async function updateInquiry(
  id: string,
  updates: Partial<Inquiry>,
  accessToken: string
): Promise<Inquiry> {
  const response = await fetch(`${API_BASE}/inquiries/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(updates),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to update inquiry");
  }

  return data.inquiry;
}

export async function archiveInquiry(
  id: string,
  accessToken: string
): Promise<void> {
  const response = await fetch(`${API_BASE}/inquiries/${id}/archive`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Failed to archive inquiry");
  }
}

// Messages API
export async function getConversation(
  userId1: string,
  userId2: string,
  accessToken: string
): Promise<Message[]> {
  try {
    const response = await fetch(`${API_BASE}/messages/${userId1}/${userId2}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch messages");
    }

    return data.messages || [];
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
}

export async function sendMessage(
  recipientId: string,
  message: string,
  propertyId: string | undefined,
  accessToken: string
): Promise<Message> {
  const response = await fetch(`${API_BASE}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ recipientId, message, propertyId }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to send message");
  }

  return data.message;
}

export async function getPropertyReviews(
  propertyId: string
): Promise<Review[]> {
  try {
    console.log("Fetching reviews for property:", propertyId);

    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("property_id", propertyId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching reviews:", error);
      return [];
    }

    console.log(
      `Found ${data?.length || 0} reviews for property ${propertyId}`
    );

    // Transform the data to match your Review interface
    return (data || []).map((review: any) => ({
      id: review.id,
      propertyId: review.property_id,
      userId: review.user_id,
      userName: review.user_name,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.created_at,
    }));
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
}

export async function createReview(
  reviewData: {
    propertyId: string;
    rating: number;
    comment: string;
  },
  accessToken: string
): Promise<Review> {
  try {
    console.log("Creating review with data:", reviewData);

    // Make sure supabase is initialized with the accessToken
    const supabase = createClient(accessToken);

    // Get current user
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.error("Error getting user:", userError);
      throw new Error("User not authenticated");
    }

    const userId = userData.user.id;
    const userName = userData.user.email?.split("@")[0] || "Anonymous";

    console.log("User ID:", userId, "User Name:", userName);

    // Insert the review
    const { data, error } = await supabase
      .from("reviews")
      .insert({
        property_id: reviewData.propertyId,
        user_id: userId,
        user_name: userName, // Make sure this column exists in your table
        rating: reviewData.rating,
        comment: reviewData.comment,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error creating review:", error);
      throw new Error(`Failed to create review: ${error.message}`);
    }

    return data as Review;
  } catch (error) {
    console.error("Error in createReview:", error);
    throw error;
  }
}

// Auth API
export async function signUp(
  email: string,
  password: string,
  name: string,
  userType: "student" | "owner"
): Promise<any> {
  const response = await fetch(`${API_BASE}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, name, userType }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to sign up");
  }

  return data.user;
}

// Filter properties
export function filterProperties(
  properties: Property[],
  filters: FilterOptions
): Property[] {
  return properties.filter((property) => {
    if (
      property.price < filters.priceRange[0] ||
      property.price > filters.priceRange[1]
    ) {
      return false;
    }
    if (
      filters.propertyTypes.length > 0 &&
      !filters.propertyTypes.includes(property.type)
    ) {
      return false;
    }
    if (
      filters.gender.length > 0 &&
      !filters.gender.includes(property.gender)
    ) {
      return false;
    }
    if (filters.amenities.length > 0) {
      const hasAllAmenities = filters.amenities.every((amenity) =>
        property.amenities.includes(amenity)
      );
      if (!hasAllAmenities) {
        return false;
      }
    }
    if (
      filters.availability.length > 0 &&
      !filters.availability.includes(property.availability)
    ) {
      return false;
    }
    if (filters.rating > 0 && property.rating < filters.rating) {
      return false;
    }
    return true;
  });
}

// Helper function to check if property exists
export async function propertyExists(id: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("properties")
      .select("id")
      .eq("id", id)
      .single();

    if (error) return false;
    return !!data;
  } catch (error) {
    console.error("Error checking property existence:", error);
    return false;
  }
}
