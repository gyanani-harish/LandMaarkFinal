export interface Property {
  id: number;
  image: string;
  title: string;
  description: string;
}

export interface Township {
  id?: number;
  township_id?: number;
  city?: string;
  name?: string;
  image?: string | null;
  images?: string[];
  properties?: Property[];
  description?: string;
  location?: string;
  latitude?: string;
  longitude?: string;
  total_area_acres?: string;
  created_at?: string;
}