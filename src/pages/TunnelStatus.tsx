
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { RefreshCw, Network, AlertTriangle } from "lucide-react";
import { useAruba } from '@/contexts/ArubaContext';
import { useNavigate } from 'react-router-dom';
import { Progress } from "@/components/ui/progress";

// Mock data for tunnel status
const mockTunnelData = [
  { 
    name: "VPN-Tunnel-1", 
    source: "Gateway-1",
    destination: "DC-Core-1",
    type: "IPsec",
    status: "up", 
    latency: "12ms",
    uptime: "14 days, 22 hours",
    throughput: "45.2 Mbps"
  },
  { 
    name: "VPN-Tunnel-2", 
    source: "Gateway-2",
    destination: "DC-Core-2",
    type: "IPsec",
    status: "up", 
    latency: "14ms",
    uptime: "14 days, 22 hours",
    throughput: "38.7 Mbps"
  },
  { 
    name: "VPN-Tunnel-3", 
    source: "Gateway-3",
    destination: "DC-Core-1",
    type: "IPsec",
    status: "down", 
    latency: "---",
    uptime: "0",
    throughput: "0 Mbps"
  },
  { 
    name: "VPN-Tunnel-4", 
    source: "Gateway-1",
    destination: "Branch-Core-1",
    type: "GRE",
    status: "warning", 
    latency: "45ms",
    uptime: "14 days, 18 hours",
    throughput: "12.5 Mbps"
  },
  { 
    name: "VPN-Tunnel-5", 
    source: "Gateway-2",
    destination: "Branch-Core-2",
    type: "GRE",
    status: "up", 
    latency: "18ms",
    uptime: "14 days, 22 hours",
    throughput: "22.3 Mbps"
  },
];

const TunnelStatus = () => {
  const { isConfigured } = useAruba();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tunnelData, setTunnelData] = useState(mockTunnelData);

  const filteredTunnels = tunnelData.filter(tunnel => 
    tunnel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tunnel.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tunnel.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const refreshData = async () => {
    setIsLoading(true);
    // In a real app, this would fetch data from the Aruba Central API
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  if (!isConfigured) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tunnel Status</h1>
          <p className="text-muted-foreground">
            Monitor VPN and tunnel connectivity
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'up':
        return <Badge className="bg-green-500">Up</Badge>;
      case 'down':
        return <Badge variant="destructive">Down</Badge>;
      case 'warning':
        return <Badge className="bg-amber-500">Unstable</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const stats = {
    total: tunnelData.length,
    up: tunnelData.filter(tunnel => tunnel.status === 'up').length,
    down: tunnelData.filter(tunnel => tunnel.status === 'down').length,
    warning: tunnelData.filter(tunnel => tunnel.status === 'warning').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tunnel Status</h1>
        <p className="text-muted-foreground">
          Monitor VPN and tunnel connectivity
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Tunnels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600">Up</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.up}</div>
            <Progress value={(stats.up / stats.total) * 100} className="h-2 mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-600">Down</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.down}</div>
            <Progress value={(stats.down / stats.total) * 100} className="h-2 mt-2 bg-muted" color="red" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-600">Unstable</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.warning}</div>
            <Progress value={(stats.warning / stats.total) * 100} className="h-2 mt-2 bg-muted" color="amber" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div>
              <CardTitle>VPN Tunnels</CardTitle>
              <CardDescription>Monitor and troubleshoot VPN and tunnel connections</CardDescription>
            </div>
            <Button 
              onClick={refreshData} 
              variant="outline" 
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search tunnels by name, source, or destination..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="pb-2 text-left font-medium">Status</th>
                  <th className="pb-2 text-left font-medium">Name</th>
                  <th className="pb-2 text-left font-medium">Type</th>
                  <th className="pb-2 text-left font-medium">Source</th>
                  <th className="pb-2 text-left font-medium">Destination</th>
                  <th className="pb-2 text-right font-medium">Latency</th>
                  <th className="pb-2 text-right font-medium">Throughput</th>
                </tr>
              </thead>
              <tbody>
                {filteredTunnels.length > 0 ? (
                  filteredTunnels.map((tunnel) => (
                    <tr key={tunnel.name} className="border-b hover:bg-muted/50">
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <Network className={`h-5 w-5 ${
                            tunnel.status === 'up' ? 'text-green-500' : 
                            tunnel.status === 'down' ? 'text-red-500' : 
                            'text-amber-500'
                          }`} />
                          {getStatusBadge(tunnel.status)}
                        </div>
                      </td>
                      <td className="py-3 font-medium">{tunnel.name}</td>
                      <td className="py-3">{tunnel.type}</td>
                      <td className="py-3">{tunnel.source}</td>
                      <td className="py-3">{tunnel.destination}</td>
                      <td className="py-3 text-right">{tunnel.latency}</td>
                      <td className="py-3 text-right">{tunnel.throughput}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-4 text-center text-muted-foreground">
                      No tunnels found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {filteredTunnels.length} of {tunnelData.length} tunnels
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TunnelStatus;
