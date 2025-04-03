
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { RefreshCw, Wifi, WifiOff, AlertTriangle } from "lucide-react";
import { useAruba } from '@/contexts/ArubaContext';
import { useNavigate } from 'react-router-dom';
import { Progress } from "@/components/ui/progress";

// Mock data for AP status
const mockAPData = [
  { 
    name: "AP-505H-US-1", 
    mac: "94:b4:0f:12:4a:b1", 
    status: "online", 
    ip: "192.168.1.101",
    model: "AP-505H",
    serial: "APSNJ0123456",
    firmware: "8.11.0.0-8.11.0.4_87592",
    group: "Campus-Main",
    clients: 18,
    uptime: "14 days, 22 hours"
  },
  { 
    name: "AP-505H-US-2", 
    mac: "94:b4:0f:12:4a:b2", 
    status: "online", 
    ip: "192.168.1.102",
    model: "AP-505H",
    serial: "APSNJ0123457",
    firmware: "8.11.0.0-8.11.0.4_87592",
    group: "Campus-Main",
    clients: 12,
    uptime: "14 days, 22 hours"
  },
  { 
    name: "AP-505H-US-3", 
    mac: "94:b4:0f:12:4a:b3", 
    status: "offline", 
    ip: "192.168.1.103",
    model: "AP-505H",
    serial: "APSNJ0123458",
    firmware: "8.11.0.0-8.11.0.4_87592",
    group: "Campus-Main",
    clients: 0,
    uptime: "0"
  },
  { 
    name: "AP-303H-US-1", 
    mac: "94:b4:0f:12:4a:c1", 
    status: "warning", 
    ip: "192.168.1.104",
    model: "AP-303H",
    serial: "APSNJ0123459",
    firmware: "8.11.0.0-8.11.0.4_87592",
    group: "Campus-Second",
    clients: 4,
    uptime: "14 days, 18 hours"
  },
  { 
    name: "AP-303H-US-2", 
    mac: "94:b4:0f:12:4a:c2", 
    status: "online", 
    ip: "192.168.1.105",
    model: "AP-303H",
    serial: "APSNJ0123460",
    firmware: "8.11.0.0-8.11.0.4_87592",
    group: "Campus-Second",
    clients: 7,
    uptime: "14 days, 22 hours"
  },
];

const APStatus = () => {
  const { isConfigured } = useAruba();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apData, setApData] = useState(mockAPData);

  const filteredAPs = apData.filter(ap => 
    ap.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ap.mac.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ap.ip.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-3xl font-bold tracking-tight">AP Status</h1>
          <p className="text-muted-foreground">
            View and manage your access points
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
      case 'online':
        return <Badge className="bg-green-500">Online</Badge>;
      case 'offline':
        return <Badge variant="destructive">Offline</Badge>;
      case 'warning':
        return <Badge className="bg-amber-500">Warning</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <Wifi className="h-5 w-5 text-green-500" />;
      case 'offline':
        return <WifiOff className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      default:
        return <Wifi className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const stats = {
    total: apData.length,
    online: apData.filter(ap => ap.status === 'online').length,
    offline: apData.filter(ap => ap.status === 'offline').length,
    warning: apData.filter(ap => ap.status === 'warning').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AP Status</h1>
        <p className="text-muted-foreground">
          View and manage your access points
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total APs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600">Online</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.online}</div>
            <Progress value={(stats.online / stats.total) * 100} className="h-2 mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-600">Offline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.offline}</div>
            <Progress value={(stats.offline / stats.total) * 100} className="h-2 mt-2 bg-muted" color="red" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-600">Warning</CardTitle>
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
              <CardTitle>Access Points</CardTitle>
              <CardDescription>Manage and monitor your Aruba access points</CardDescription>
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
              placeholder="Search APs by name, MAC, or IP..."
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
                  <th className="pb-2 text-left font-medium">MAC Address</th>
                  <th className="pb-2 text-left font-medium">IP Address</th>
                  <th className="pb-2 text-left font-medium">Model</th>
                  <th className="pb-2 text-right font-medium">Clients</th>
                </tr>
              </thead>
              <tbody>
                {filteredAPs.length > 0 ? (
                  filteredAPs.map((ap) => (
                    <tr key={ap.mac} className="border-b hover:bg-muted/50">
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(ap.status)}
                          {getStatusBadge(ap.status)}
                        </div>
                      </td>
                      <td className="py-3 font-medium">{ap.name}</td>
                      <td className="py-3 font-mono text-sm">{ap.mac}</td>
                      <td className="py-3 font-mono text-sm">{ap.ip}</td>
                      <td className="py-3">{ap.model}</td>
                      <td className="py-3 text-right">{ap.clients}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-4 text-center text-muted-foreground">
                      No access points found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {filteredAPs.length} of {apData.length} access points
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default APStatus;
