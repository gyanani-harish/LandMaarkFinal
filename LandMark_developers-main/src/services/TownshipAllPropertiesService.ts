import axios from "axios";
import { ApiConstants } from "../constants/ApiConstants";
import { ApiEndPoints } from "../constants/ApiEndpoints";

export interface TownshipAllProperty {
  property_id: number;
  property_name: string;
  image: string;
  description: string;
  price: string;
  location: string;
  bhk: number;
  area_sqft: number;
}

export const fetchTownshipAllProperties = async (townshipId: number): Promise<TownshipAllProperty[]> => {
  try {
    const response = await axios.get(
      `${ApiConstants.API_BASE_URL}${ApiEndPoints.TOWNSHIP_PROPERTIES_FULL(townshipId)}`,
      { headers: ApiConstants.HEADERS }
    );
    return response.data.data?.properties || [];
  } catch (error) {
    console.error('Error fetching township all properties:', error);
    return [];
  }
};