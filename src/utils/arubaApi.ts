
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
    // Ensure baseUrl and privateClusterUrl don't end with a trailing slash
    const baseUrl = credentials.baseUrl.endsWith('/') 
      ? credentials.baseUrl.slice(0, -1) 
      : credentials.baseUrl;
    
    const privateUrl = credentials.privateClusterUrl?.endsWith('/') 
      ? credentials.privateClusterUrl.slice(0, -1) 
      : credentials.privateClusterUrl;

    // Determine which URL to use based on private cluster settings
    const apiUrl = credentials.isPrivateCluster 
      ? `${privateUrl}/central/v2/devices`
      : `${baseUrl}/central/v2/devices`;

    // Make the API call to fetch AP data
    const response = await fetch(`${apiUrl}?sku_type=IAP&limit=100&calculate_total=true`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${credentials.token}`,
        'X-CS-CUSTOMER-ID': credentials.customerId
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.description || `API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("API response:", data);
    
    // Calculate stats from response
    const total = data.count || data.total || 0;
    let online = 0;
    let offline = 0;
    let warning = 0;
    
    // Process the devices to count status
    if (data.aps && Array.isArray(data.aps)) {
      data.aps.forEach((device: any) => {
        if (device.status === 'Up') online++;
        else if (device.status === 'Down') offline++;
        else warning++; // Any other status
      });
    } else if (data.devices && Array.isArray(data.devices)) {
      data.devices.forEach((device: any) => {
        if (device.status === 'Up') online++;
        else if (device.status === 'Down') offline++;
        else warning++; // Any other status
      });
    }

    // If we don't have detailed status but we have total, assume all are online (for demo purposes)
    if (total > 0 && online + offline + warning === 0) {
      online = total;
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
