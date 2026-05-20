import axios from "axios";
import { ApiConstants } from "../constants/ApiConstants";
import { ApiEndPoints } from "../constants/ApiEndpoints";
import { Township } from "../store/TownShip/TownshipTypes";

export const fetchTownships = async (): Promise<Township[]> => {
  const response = await axios.get(
    `${ApiConstants.API_BASE_URL}${ApiEndPoints.TOWNSHIPS}`,
    { headers: ApiConstants.HEADERS }
  );
  return response.data.data || [];
};