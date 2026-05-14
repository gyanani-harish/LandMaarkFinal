import { ApiConstants } from "../../constants/ApiConstants";
import { ApiEndPoints } from "../../constants/ApiEndpoints";
import { Property } from "./types";

export const fetchProperties = async (townshipId: number, query: string = ""): Promise<Property[]> => {
  try {
    const baseUrl = `${ApiConstants.API_BASE_URL}${ApiEndPoints.TOWNSHIP_PROPERTIES_FULL(townshipId)}`;
    const url = query ? `${baseUrl}&${query}` : baseUrl;
    const res = await fetch(url, { 
      headers: ApiConstants.HEADERS 
    });
    const data = await res.json();
    return (data.data?.properties || []).map((item: any) => ({
      property_id: item.property_id,
      title: item.title || "",
      image: item.image || "",
      construction_status: item.construction_status || "",
      construction_type: item.construction_type || "",
      property_type: item.property_type || "",
      bhk: item.bhk || 0,
      verified: item.verified || 0,
      area_sqft: item.area_sqft || 0,
      created_at: item.created_at || "",
      price: parseFloat(item.price) || 0,
      location: item.location || "",
      description: item.description || "",
    }));
  } catch (error) {
    console.error("Error fetching properties:", error);
    return [];
  }
};

export const buildQueryString = (filters: any): string => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, value as string);
  });
  return params.toString();
};