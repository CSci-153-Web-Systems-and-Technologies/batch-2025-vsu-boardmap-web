// utils/supabase/properties.ts
import { createClient } from './client';
import { Property } from '../api';

const supabase = createClient();

// Define the database row type (snake_case)
interface DatabaseProperty {
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
  rooms?: any[];
  created_at: string;
  updated_at?: string;
}

// Helper function to transform database row to Property
function transformProperty(property: DatabaseProperty): Property {
  return {
    id: property.id,
    title: property.title,
    description: property.description,
    price: property.price,
    address: property.address,
    location: property.location,
    amenities: property.amenities || [],
    type: property.type,
    availability: property.availability,
    gender: property.gender,
    rating: property.rating,
    reviews: property.reviews,
    images: property.images || [],
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    ownerId: property.owner_id,
    ownerName: property.owner_name,
    ownerEmail: property.owner_email,
    ownerPhone: property.owner_phone,
    rooms: property.rooms || [],
    createdAt: property.created_at,
    updatedAt: property.updated_at
  };
}

export const propertiesService = {
  // Fetch all properties for student dashboard
  async getProperties(): Promise<Property[]> {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('availability', 'Available')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching properties:', error);
      throw error;
    }

    return (data || []).map(transformProperty);
  },

  // Fetch single property by ID
  async getPropertyById(id: string): Promise<Property | null> {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching property:', error);
      throw error;
    }

    if (!data) return null;

    return transformProperty(data);
  },

  // Fetch properties by owner
  async getPropertiesByOwner(ownerId: string): Promise<Property[]> {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching owner properties:', error);
      throw error;
    }

    return (data || []).map(transformProperty);
  }
};