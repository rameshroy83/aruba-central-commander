
import { toast } from "sonner";

interface ApiResponse<T> {
  data: T;
  error?: string;
}

export const fetchAPs = async (credentials: {
  customerId: string;
  token: string;
  baseUrl: string;
  isPrivateCluster: boolean;
  privateClusterUrl: string;
}): Promise<ApiResponse<{
  total: number;
  online: number;
  offline: number;
  warning: number;
}>> => {
  try {
    // Determine which URL to use based on private cluster settings
    const apiUrl = credentials.isPrivateCluster 
      ? `${credentials.privateClusterUrl}/central/v2/devices`
      : `${credentials.baseUrl}/central/v2/devices`;

    // Make the API call to fetch AP data
    const response = await fetch(`${apiUrl}?sku_type=IAP&limit=0&calculate_total=true`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${credentials.token}`,
        'X-Aruba-Central-Customer-Id': credentials.customerId
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.description || `API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Calculate stats from response
    const total = data.total || 0;
    let online = 0;
    let offline = 0;
    let warning = 0;
    
    // Process the devices to count status
    if (data.devices && Array.isArray(data.devices)) {
      data.devices.forEach((device: any) => {
        if (device.status === 'Up') online++;
        else if (device.status === 'Down') offline++;
        else warning++; // Any other status
      });
    }

    return {
      data: {
        total,
        online,
        offline,
        warning
      }
    };
  } catch (error) {
    console.error("Error fetching AP data:", error);
    toast.error("Failed to fetch AP data");
    
    return {
      data: {
        total: 0,
        online: 0,
        offline: 0,
        warning: 0
      },
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
};
