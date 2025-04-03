
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, RefreshCw, Laptop, Server, Router, Wifi } from "lucide-react";
import { useAruba } from '@/contexts/ArubaContext';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data
const mockDevices = [
  { id: 1, name: "AP-505H-US-1", type: "ap", model: "AP-505H", serial: "APSNJ0123456", status: "online" },
  { id: 2, name: "AP-505H-US-2", type: "ap", model: "AP-505H", serial: "APSNJ0123457", status: "online" },
  { id: 3, name: "AP-303H-US-1", type: "ap", model: "AP-303H", serial: "APSNJ0123459", status: "warning" },
  { id: 4, name: "AP-303H-US-2", type: "ap", model: "AP-303H", serial: "APSNJ0123460", status: "online" },
  { id: 5, name: "Switch-2930F-1", type: "switch", model: "2930F-24G", serial: "SG12345678", status: "online" },
  { id: 6, name: "Switch-2930F-2", type: "switch", model: "2930F-48G", serial: "SG12345679", status: "online" },
  { id: 7, name: "Gateway-7005-1", type: "gateway", model: "7005", serial: "GW12345678", status: "online" },
  { id: 8, name: "Gateway-7005-2", type: "gateway", model: "7005", serial: "GW12345679", status: "online" },
];

const Devices = () => {
  const { isConfigured } = useAruba();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const filteredDevices = mockDevices
    .filter(device => activeTab === "all" || device.type === activeTab)
    .filter(device => 
      device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.serial.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const refreshData = () => {
    setIsLoading(true);
    // In a real app, this would fetch data from the Aruba Central API
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'ap':
        return <Wifi className="h-5 w-5" />;
      case 'switch':
        return <Server className="h-5 w-5" />;
      case 'gateway':
        return <Router className="h-5 w-5" />;
      default:
        return <Laptop className="h-5 w-5" />;
    }
  };

  if (!isConfigured) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Device Management</h1>
          <p className="text-muted-foreground">
            View and manage your network devices
          </p>
        </div>
        
        <Card>
          <CardHeader className="bg-amber-50 dark:bg-amber-950/30 border-b">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <CardTitle>API Not Configured</CardTitle>
            </div>
            <CardDescription>
              Configure your Aruba Central API credentials to access this feature
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="mb-4">You need to configure your API credentials before using this feature.</p>
            <Button 
              onClick={() => navigate('/settings')}
              className="bg-aruba hover:bg-aruba-dark"
            >
              Configure API Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Device Management</h1>
        <p className="text-muted-foreground">
          View and manage your network devices
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div>
              <CardTitle>Network Devices</CardTitle>
              <CardDescription>Manage your Aruba network devices</CardDescription>
            </div>
            <Button 
              onClick={refreshData} 
              variant="outline" 
              disabled={isLoading}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Search devices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
              <TabsList className="grid grid-cols-4 w-full sm:w-[400px]">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="ap">APs</TabsTrigger>
                <TabsTrigger value="switch">Switches</TabsTrigger>
                <TabsTrigger value="gateway">Gateways</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="pb-2 text-left font-medium">Type</th>
                  <th className="pb-2 text-left font-medium">Name</th>
                  <th className="pb-2 text-left font-medium">Model</th>
                  <th className="pb-2 text-left font-medium">Serial</th>
                  <th className="pb-2 text-left font-medium">Status</th>
                  <th className="pb-2 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDevices.length > 0 ? (
                  filteredDevices.map((device) => (
                    <tr key={device.id} className="border-b hover:bg-muted/50">
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          {getDeviceIcon(device.type)}
                          <span className="capitalize">{device.type}</span>
                        </div>
                      </td>
                      <td className="py-3 font-medium">{device.name}</td>
                      <td className="py-3">{device.model}</td>
                      <td className="py-3 font-mono text-sm">{device.serial}</td>
                      <td className="py-3">
                        <div className={`w-2 h-2 rounded-full ${
                          device.status === 'online' ? 'bg-green-500' : 
                          device.status === 'offline' ? 'bg-red-500' : 
                          'bg-amber-500'
                        }`}>
                        </div>
                      </td>
                      <td className="py-3 text-right">
                        <Button variant="ghost" size="sm">Details</Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-4 text-center text-muted-foreground">
                      No devices found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Devices;
