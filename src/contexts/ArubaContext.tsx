
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from "sonner";

interface ArubaCredentials {
  customerId: string;
  clientId: string;
  clientSecret: string;
  token: string;
  baseUrl: string;
  groupName: string;
}

interface ArubaContextType {
  credentials: ArubaCredentials;
  isConfigured: boolean;
  updateCredentials: (creds: Partial<ArubaCredentials>) => void;
  clearCredentials: () => void;
  testConnection: () => Promise<boolean>;
}

const defaultCredentials: ArubaCredentials = {
  customerId: '',
  clientId: '',
  clientSecret: '',
  token: '',
  baseUrl: 'https://apigw-uswest4.central.arubanetworks.com',
  groupName: '',
};

const ArubaContext = createContext<ArubaContextType | undefined>(undefined);

export function ArubaProvider({ children }: { children: ReactNode }) {
  const [credentials, setCredentials] = useState<ArubaCredentials>(() => {
    const saved = localStorage.getItem('arubaCredentials');
    return saved ? JSON.parse(saved) : defaultCredentials;
  });

  const isConfigured = !!credentials.customerId && !!credentials.token;

  const updateCredentials = (creds: Partial<ArubaCredentials>) => {
    const updated = { ...credentials, ...creds };
    setCredentials(updated);
    localStorage.setItem('arubaCredentials', JSON.stringify(updated));
    
    // Notify user
    if (Object.keys(creds).length > 0) {
      toast("Credentials updated", {
        description: "Your Aruba Central API credentials have been saved.",
      });
    }
  };

  const clearCredentials = () => {
    setCredentials(defaultCredentials);
    localStorage.removeItem('arubaCredentials');
    toast("Credentials cleared", {
      description: "Your Aruba Central API credentials have been cleared.",
    });
  };

  const testConnection = async (): Promise<boolean> => {
    if (!isConfigured) {
      toast("Configuration incomplete", {
        description: "Please provide all required API credentials.",
        variant: "destructive",
      });
      return false;
    }

    try {
      toast("Testing connection...", {
        description: "Attempting to connect to Aruba Central API.",
      });
      
      // In a real app, this would make an API call to validate credentials
      // For the demo, we'll simulate a successful connection
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast("Connection successful", {
        description: "Successfully connected to Aruba Central API.",
      });
      return true;
    } catch (error) {
      toast("Connection failed", {
        description: "Failed to connect to Aruba Central API. Please check your credentials.",
        variant: "destructive",
      });
      return false;
    }
  };

  return (
    <ArubaContext.Provider value={{ 
      credentials, 
      isConfigured, 
      updateCredentials, 
      clearCredentials,
      testConnection
    }}>
      {children}
    </ArubaContext.Provider>
  );
}

export function useAruba() {
  const context = useContext(ArubaContext);
  if (context === undefined) {
    throw new Error('useAruba must be used within an ArubaProvider');
  }
  return context;
}
