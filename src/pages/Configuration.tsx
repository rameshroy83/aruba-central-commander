
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Terminal, Download, UploadCloud, RefreshCw } from "lucide-react";
import { useAruba } from '@/contexts/ArubaContext';
import { useNavigate } from 'react-router-dom';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const Configuration = () => {
  const { isConfigured } = useAruba();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState("");

  // Mock configuration data
  const mockConfigData = `# Configuration for AP-505H-US-1
# Last updated: 2023-04-03

hostname "AP-505H-US-1"
ip address 192.168.1.101 255.255.255.0
ip default-gateway 192.168.1.1
ip name-server 8.8.8.8
ntp server 0.pool.ntp.org
ntp server 1.pool.ntp.org

# WLAN Configuration
wlan ssid-profile "WLAN-CORP"
  essid "Corporate-WiFi"
  opmode wpa2-aes
  utf8
wlan ssid-profile "WLAN-GUEST"
  essid "Guest-WiFi"
  opmode wpa2-aes
  utf8

# Security
aaa authentication-server radius "RADIUS-1"
  host 10.1.1.15
  key "********"
  timeout 5
  retry-count 3
  nas-identifier "ap505h"
  radsec

# SNMP Configuration
snmp-server community "public" ro
snmp-server host 10.1.1.10 version 2c "public"`;

  const fetchConfiguration = async () => {
    setIsLoading(true);
    // In a real app, this would fetch configuration from the Aruba Central API
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  if (!isConfigured) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configuration</h1>
          <p className="text-muted-foreground">
            Manage device configurations
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
        <h1 className="text-3xl font-bold tracking-tight">Configuration</h1>
        <p className="text-muted-foreground">
          Manage and deploy device configurations
        </p>
      </div>

      <Tabs defaultValue="deviceConfig" className="space-y-4">
        <TabsList>
          <TabsTrigger value="deviceConfig">Device Configuration</TabsTrigger>
          <TabsTrigger value="templates">Configuration Templates</TabsTrigger>
          <TabsTrigger value="history">Change History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="deviceConfig">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div>
                  <CardTitle>Device Configuration</CardTitle>
                  <CardDescription>View and edit device configurations</CardDescription>
                </div>
                <Button 
                  onClick={fetchConfiguration} 
                  variant="outline" 
                  disabled={isLoading}
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="deviceSelect">Select Device</Label>
                  <Select 
                    value={selectedDevice} 
                    onValueChange={setSelectedDevice}
                  >
                    <SelectTrigger id="deviceSelect">
                      <SelectValue placeholder="Select a device" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AP-505H-US-1">AP-505H-US-1</SelectItem>
                      <SelectItem value="AP-505H-US-2">AP-505H-US-2</SelectItem>
                      <SelectItem value="AP-303H-US-1">AP-303H-US-1</SelectItem>
                      <SelectItem value="AP-303H-US-2">AP-303H-US-2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-end gap-2">
                  <Button variant="outline" className="flex-1">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <UploadCloud className="mr-2 h-4 w-4" />
                    Upload
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="configTextarea">Configuration</Label>
                <div className="relative">
                  <Textarea
                    id="configTextarea"
                    className="font-mono text-sm h-96 resize-none"
                    value={mockConfigData}
                    readOnly
                  />
                  <div className="absolute top-2 right-2">
                    <Button size="sm" variant="ghost">
                      <Terminal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Configuration Templates</CardTitle>
              <CardDescription>Create and manage configuration templates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-64 border border-dashed rounded-md">
                <p className="text-muted-foreground">Template management coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Configuration Change History</CardTitle>
              <CardDescription>View and compare configuration changes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-64 border border-dashed rounded-md">
                <p className="text-muted-foreground">Configuration history coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Configuration;
