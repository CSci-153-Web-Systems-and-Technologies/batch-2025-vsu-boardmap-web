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

// Properties API
export async function getProperties(): Promise<Property[]> {
  try {
    const supabase = createClient();

    const { data: properties, error } = await supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message || "Failed to fetch properties");
    }

    // Transform the data to match your Property interface
    return (properties || []).map((property) => ({
      id: property.id,
      title: property.title,
      description: property.description || "",
      price: property.price,
      address: property.address,
      location: property.location || { lat: 10.6777, lng: 124.8009 }, // Default to VSU location
      amenities: property.amenities || [],
      type: property.type || "Private Room",
      availability: property.availability || "Available",
      gender: property.gender || "Any",
      rating: property.rating || 0,
      reviews: property.reviews || 0,
      images: property.images || [],
      bedrooms: property.bedrooms || 1,
      bathrooms: property.bathrooms || 1,
      ownerId: property.owner_id,
      ownerName: property.owner_name || "Property Owner",
      ownerEmail: property.owner_email || "",
      createdAt: property.created_at,
      updatedAt: property.updated_at,
    }));
  } catch (error) {
    console.error("Error fetching properties:", error);
    return [];
  }
}

export async function getOwnerProperties(
  ownerId: string,
  accessToken: string
): Promise<Property[]> {
  try {
    const supabase = createClient();

    const { data: properties, error } = await supabase
      .from("properties")
      .select("*")
      .eq("owner_id", ownerId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message || "Failed to fetch owner properties");
    }

    return (properties || []).map((property) => ({
      id: property.id,
      title: property.title,
      description: property.description || "",
      price: property.price,
      address: property.address,
      location: property.location || { lat: 10.6777, lng: 124.8009 },
      amenities: property.amenities || [],
      type: property.type || "Private Room",
      availability: property.availability || "Available",
      gender: property.gender || "Any",
      rating: property.rating || 0,
      reviews: property.reviews || 0,
      images: property.images || [],
      bedrooms: property.bedrooms || 1,
      bathrooms: property.bathrooms || 1,
      ownerId: property.owner_id,
      ownerName: property.owner_name || "Property Owner",
      ownerEmail: property.owner_email || "",
      createdAt: property.created_at,
      updatedAt: property.updated_at,
    }));
  } catch (error) {
    console.error("Error fetching owner properties:", error);
    return [];
  }
}

export async function createProperty(
  propertyData: Partial<Property>,
  accessToken: string
): Promise<Property> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("properties")
      .insert([
        {
          title: propertyData.title,
          description: propertyData.description,
          price: propertyData.price,
          address: propertyData.address,
          location: propertyData.location,
          amenities: propertyData.amenities,
          type: propertyData.type,
          availability: propertyData.availability,
          gender: propertyData.gender,
          bedrooms: propertyData.bedrooms,
          bathrooms: propertyData.bathrooms,
          owner_id: propertyData.ownerId,
          owner_name: propertyData.ownerName,
          owner_email: propertyData.ownerEmail,
          images: propertyData.images,
        },
      ])
      .select()
      .single();

    if (error) {
      throw new Error(error.message || "Failed to create property");
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description || "",
      price: data.price,
      address: data.address,
      location: data.location || { lat: 10.6777, lng: 124.8009 },
      amenities: data.amenities || [],
      type: data.type || "Private Room",
      availability: data.availability || "Available",
      gender: data.gender || "Any",
      rating: data.rating || 0,
      reviews: data.reviews || 0,
      images: data.images || [],
      bedrooms: data.bedrooms || 1,
      bathrooms: data.bathrooms || 1,
      ownerId: data.owner_id,
      ownerName: data.owner_name || "Property Owner",
      ownerEmail: data.owner_email || "",
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch (error) {
    console.error("Error creating property:", error);
    throw error;
  }
}

export async function updateProperty(
  id: string,
  updates: Partial<Property>,
  accessToken: string
): Promise<Property> {
  const response = await fetch(`${API_BASE}/properties/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(updates),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to update property");
  }

  return data.property;
}

export async function deleteProperty(
  id: string,
  accessToken: string
): Promise<void> {
  const response = await fetch(`${API_BASE}/properties/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Failed to delete property");
  }
}


// Occupants API
export async function getOccupants(ownerId: string, accessToken: string): Promise<Occupant[]> {
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
export async function getInquiries(ownerId: string, accessToken: string): Promise<Inquiry[]> {
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

// Reviews API
export async function getPropertyReviews(
  propertyId: string
): Promise<Review[]> {
  try {
    const response = await fetch(`${API_BASE}/reviews/property/${propertyId}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch reviews");
    }

    return data.reviews || [];
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
}

export async function createReview(
  reviewData: Partial<Review>,
  accessToken: string
): Promise<Review> {
  const response = await fetch(`${API_BASE}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(reviewData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to create review");
  }

  return data.review;
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
    // Price range filter
    if (
      property.price < filters.priceRange[0] ||
      property.price > filters.priceRange[1]
    ) {
      return false;
    }

    // Property type filter
    if (
      filters.propertyTypes.length > 0 &&
      !filters.propertyTypes.includes(property.type)
    ) {
      return false;
    }

    // Gender filter
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

    // Availability filter
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