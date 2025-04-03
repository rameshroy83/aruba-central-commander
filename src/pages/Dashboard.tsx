
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Network, Wifi, Settings, AlertTriangle, Server, Activity, CheckCircle, RefreshCw } from "lucide-react";
import { useAruba } from '@/contexts/ArubaContext';
import { useNavigate } from 'react-router-dom';
import { fetchAPs } from '@/utils/arubaApi';

const Dashboard = () => {
  const { isConfigured, credentials } = useAruba();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // State to store AP and Tunnel status
  const [apStatus, setApStatus] = useState({
    total: 0,
    online: 0,
    offline: 0,
    warning: 0,
  });

  // Mock data for tunnel status
  const tunnelStatus = {
    total: 45,
    up: 42,
    down: 3,
    warning: 1,
  };

  // Function to load AP data from API
  const loadApData = async () => {
    if (!isConfigured) return;
    
    setIsLoading(true);
    try {
      const result = await fetchAPs(credentials);
      if (!result.error) {
        setApStatus(result.data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Load data when component mounts or when credentials/configuration changes
  useEffect(() => {
    if (isConfigured) {
      loadApData();
    }
  }, [isConfigured, credentials.customerId, credentials.token, credentials.baseUrl]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor and manage your Aruba Central environment
          </p>
        </div>
        {!isConfigured ? (
          <Button 
            onClick={() => navigate('/settings')}
            className="bg-aruba hover:bg-aruba-dark"
          >
            <Settings className="mr-2 h-4 w-4" />
            Configure API Settings
          </Button>
        ) : (
          <Button 
            variant="outline" 
            onClick={loadApData} 
            disabled={isLoading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
        )}
      </div>

      {!isConfigured ? (
        <Card>
          <CardHeader className="bg-amber-50 dark:bg-amber-950/30 border-b">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <CardTitle>API Not Configured</CardTitle>
            </div>
            <CardDescription>
              Configure your Aruba Central API credentials to access all features
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="mb-4">To get started with Aruba Central Commander, you'll need to enter your API credentials:</p>
            
            <ul className="list-disc list-inside space-y-2 mb-6">
              <li>Customer ID</li>
              <li>Client ID and Client Secret (if using OAuth)</li>
              <li>API Token</li>
              <li>Group Name</li>
            </ul>
            
            <Button 
              onClick={() => navigate('/settings')}
              className="bg-aruba hover:bg-aruba-dark"
            >
              <Settings className="mr-2 h-4 w-4" />
              Configure Now
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total APs
                </CardTitle>
                <Wifi className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{apStatus.total}</div>
                <p className="text-xs text-muted-foreground">
                  {apStatus.online} online, {apStatus.offline} offline
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Tunnels
                </CardTitle>
                <Network className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tunnelStatus.total}</div>
                <p className="text-xs text-muted-foreground">
                  {tunnelStatus.up} up, {tunnelStatus.down} down
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Alerts
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{apStatus.warning + tunnelStatus.warning}</div>
                <p className="text-xs text-muted-foreground">
                  {apStatus.warning} AP alerts, {tunnelStatus.warning} tunnel alerts
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  System Status
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{isLoading ? "Checking..." : "Healthy"}</div>
                <p className="text-xs text-muted-foreground">
                  All systems operational
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="quickActions" className="space-y-4">
            <TabsList>
              <TabsTrigger value="quickActions">Quick Actions</TabsTrigger>
              <TabsTrigger value="recentActivity">Recent Activity</TabsTrigger>
            </TabsList>
            
            <TabsContent value="quickActions" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="cursor-pointer hover:bg-muted/50" onClick={() => navigate('/ap-status')}>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                      <Wifi className="h-5 w-5 text-aruba" />
                      AP Status Check
                    </CardTitle>
                    <CardDescription>Check the status of all access points</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" variant="outline">
                      Run Check
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="cursor-pointer hover:bg-muted/50" onClick={() => navigate('/tunnel-status')}>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                      <Network className="h-5 w-5 text-aruba" />
                      Tunnel Status
                    </CardTitle>
                    <CardDescription>Check VPN and tunnel connectivity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" variant="outline">
                      Check Tunnels
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="cursor-pointer hover:bg-muted/50" onClick={() => navigate('/configuration')}>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                      <Server className="h-5 w-5 text-aruba" />
                      Configuration
                    </CardTitle>
                    <CardDescription>Manage device configurations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" variant="outline">
                      View Configs
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="recentActivity">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Recent actions performed in your Aruba Central account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 border-b pb-4">
                    <div className="bg-aruba/10 p-2 rounded-full">
                      <CheckCircle className="h-5 w-5 text-aruba" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">Configuration pushed to AP-303H-US</p>
                        <Badge variant="outline">10m ago</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Configuration changes deployed successfully</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 border-b pb-4">
                    <div className="bg-aruba/10 p-2 rounded-full">
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">AP-505H-US disconnected</p>
                        <Badge variant="outline">1h ago</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">AP at Location: Floor 2, Room 204 is offline</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 pb-4">
                    <div className="bg-aruba/10 p-2 rounded-full">
                      <Settings className="h-5 w-5 text-aruba" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">Group settings updated</p>
                        <Badge variant="outline">3h ago</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">WLAN security policy updated</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default Dashboard;
