import { projectId, publicAnonKey } from './supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-47d35f34`;

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
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone?: string;
  rooms?: Room[];
  createdAt: string;
  updatedAt?: string;
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
  status: 'active' | 'inactive';
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
  status: 'active' | 'archived';
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
export async function getProperties(accessToken?: string): Promise<Property[]> {
  try {
    const headers: Record<string, string> = {};
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${API_BASE}/properties`, { headers });
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch properties');
    }
    
    return data.properties || [];
  } catch (error) {
    console.error('Error fetching properties:', error);
    return [];
  }
}

export async function getOwnerProperties(ownerId: string, accessToken: string): Promise<Property[]> {
  try {
    const response = await fetch(`${API_BASE}/properties/owner/${ownerId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch owner properties');
    }
    
    return data.properties || [];
  } catch (error) {
    console.error('Error fetching owner properties:', error);
    return [];
  }
}

export async function createProperty(propertyData: Partial<Property>, accessToken: string): Promise<Property> {
  const response = await fetch(`${API_BASE}/properties`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(propertyData),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to create property');
  }
  
  return data.property;
}

export async function updateProperty(id: string, updates: Partial<Property>, accessToken: string): Promise<Property> {
  const response = await fetch(`${API_BASE}/properties/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(updates),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to update property');
  }
  
  return data.property;
}

export async function deleteProperty(id: string, accessToken: string): Promise<void> {
  const response = await fetch(`${API_BASE}/properties/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Failed to delete property');
  }
}

// Occupants API
export async function getOccupants(accessToken: string): Promise<Occupant[]> {
  try {
    const response = await fetch(`${API_BASE}/occupants`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch occupants');
    }
    
    return data.occupants || [];
  } catch (error) {
    console.error('Error fetching occupants:', error);
    return [];
  }
}

export async function getOwnerOccupants(ownerId: string, accessToken: string): Promise<Occupant[]> {
  try {
    const response = await fetch(`${API_BASE}/occupants/owner/${ownerId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch occupants');
    }
    
    return data.occupants || [];
  } catch (error) {
    console.error('Error fetching occupants:', error);
    return [];
  }
}

export async function updateOccupant(id: string, updates: Partial<Occupant>, accessToken: string): Promise<Occupant> {
  const response = await fetch(`${API_BASE}/occupants/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(updates),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to update occupant');
  }
  
  return data.occupant;
}

export async function deleteOccupant(id: string, accessToken: string): Promise<void> {
  const response = await fetch(`${API_BASE}/occupants/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Failed to delete occupant');
  }
}

// Inquiries API
export async function getInquiries(accessToken: string): Promise<Inquiry[]> {
  try {
    const response = await fetch(`${API_BASE}/inquiries`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch inquiries');
    }
    
    return data.inquiries || [];
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    return [];
  }
}

export async function getOwnerInquiries(ownerId: string, accessToken: string): Promise<Inquiry[]> {
  try {
    const response = await fetch(`${API_BASE}/inquiries/owner/${ownerId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch inquiries');
    }
    
    return data.inquiries || [];
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    return [];
  }
}

export async function createInquiry(inquiryData: Partial<Inquiry>, accessToken: string): Promise<Inquiry> {
  const response = await fetch(`${API_BASE}/inquiries`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(inquiryData),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to create inquiry');
  }
  
  return data.inquiry;
}

export async function updateInquiry(id: string, updates: Partial<Inquiry>, accessToken: string): Promise<Inquiry> {
  const response = await fetch(`${API_BASE}/inquiries/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(updates),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to update inquiry');
  }
  
  return data.inquiry;
}

export async function archiveInquiry(id: string, accessToken: string): Promise<void> {
  const response = await fetch(`${API_BASE}/inquiries/${id}/archive`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Failed to archive inquiry');
  }
}

// Messages API
export async function getConversation(userId1: string, userId2: string, accessToken: string): Promise<Message[]> {
  try {
    const response = await fetch(`${API_BASE}/messages/${userId1}/${userId2}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch messages');
    }
    
    return data.messages || [];
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
}

export async function sendMessage(recipientId: string, message: string, propertyId: string | undefined, accessToken: string): Promise<Message> {
  const response = await fetch(`${API_BASE}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ recipientId, message, propertyId }),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to send message');
  }
  
  return data.message;
}

// Reviews API
export async function getPropertyReviews(propertyId: string): Promise<Review[]> {
  try {
    const response = await fetch(`${API_BASE}/reviews/property/${propertyId}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch reviews');
    }
    
    return data.reviews || [];
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
}

export async function createReview(reviewData: Partial<Review>, accessToken: string): Promise<Review> {
  const response = await fetch(`${API_BASE}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(reviewData),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to create review');
  }
  
  return data.review;
}

// Auth API
export async function signUp(email: string, password: string, name: string, userType: 'student' | 'owner'): Promise<any> {
  const response = await fetch(`${API_BASE}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, name, userType }),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to sign up');
  }
  
  return data.user;
}

// Initialize sample data (no longer needed but kept for compatibility)
export async function initSampleData(): Promise<void> {
  // No-op - all data is now dynamic
  return Promise.resolve();
}

// Filter properties
export function filterProperties(properties: Property[], filters: FilterOptions): Property[] {
  return properties.filter((property) => {
    // Price range filter
    if (property.price < filters.priceRange[0] || property.price > filters.priceRange[1]) {
      return false;
    }

    // Property type filter
    if (filters.propertyTypes.length > 0 && !filters.propertyTypes.includes(property.type)) {
      return false;
    }

    // Gender filter
    if (filters.gender.length > 0 && !filters.gender.includes(property.gender)) {
      return false;
    }

    // Amenities filter
    if (filters.amenities.length > 0) {
      const hasAllAmenities = filters.amenities.every((amenity) =>
        property.amenities.includes(amenity)
      );
      if (!hasAllAmenities) {
        return false;
      }
    }

    // Availability filter
    if (filters.availability.length > 0 && !filters.availability.includes(property.availability)) {
      return false;
    }

    // Rating filter
    if (filters.rating > 0 && property.rating < filters.rating) {
      return false;
    }

    return true;
  });
}
