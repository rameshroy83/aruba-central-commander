
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Server, Activity } from "lucide-react";
import { useAruba } from '@/contexts/ArubaContext';
import { useNavigate } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import { fetchAPs } from '@/utils/arubaApi';
import { toast } from 'sonner';

const System = () => {
  const { isConfigured, credentials } = useAruba();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [apStatus, setApStatus] = useState({
    total: 0,
    online: 0,
    offline: 0,
    warning: 0,
  });

  // Mock system data
  const cpuLoad = 32;
  const memoryUsage = 45;
  const diskUsage = 28;
  const uptime = "14 days, 22 hours, 15 minutes";

  // Function to load AP data from API
  const loadApData = async () => {
    if (!isConfigured) return;
    
    setIsLoading(true);
    try {
      console.log("Fetching AP data with credentials:", {
        customerId: credentials.customerId,
        baseUrl: credentials.baseUrl,
        isPrivateCluster: credentials.isPrivateCluster,
        privateClusterUrl: credentials.privateClusterUrl
      });
      
      const result = await fetchAPs(credentials);
      console.log("API result:", result);
      
      if (!result.error) {
        setApStatus(result.data);
        toast.success("AP data refreshed");
      } else {
        toast.error(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error in loadApData:", error);
      toast.error("Failed to load AP data");
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

  if (!isConfigured) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Information</h1>
          <p className="text-muted-foreground">
            View system status and information
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Information</h1>
          <p className="text-muted-foreground">
            View system status and information
          </p>
        </div>
        {isConfigured && (
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">CPU Load</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{cpuLoad}%</div>
            <Progress value={cpuLoad} className="h-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{memoryUsage}%</div>
            <Progress value={memoryUsage} className="h-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Disk Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{diskUsage}%</div>
            <Progress value={diskUsage} className="h-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uptime}</div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div>
              <CardTitle>System Status</CardTitle>
              <CardDescription>Current system information and status</CardDescription>
            </div>
            <Button variant="outline" onClick={loadApData} disabled={isLoading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="font-medium mb-2">System Information</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">API Version:</span>
                  <span>v1.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Region:</span>
                  <span>{credentials.isPrivateCluster ? "Private Cluster" : "Public"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Login:</span>
                  <span>{new Date().toISOString().split('T')[0]} {new Date().toTimeString().split(' ')[0]} UTC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Customer ID:</span>
                  <span>{credentials.customerId || "Not configured"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Group:</span>
                  <span>{credentials.groupName || "Default Group"}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">API Health</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">API Response Time</span>
                    <span className="text-sm">120ms</span>
                  </div>
                  <Progress value={12} className="h-1" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">API Rate Limit Usage</span>
                    <span className="text-sm">35%</span>
                  </div>
                  <Progress value={35} className="h-1" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">API Errors (24h)</span>
                    <span className="text-sm">0</span>
                  </div>
                  <Progress value={0} className="h-1" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <h3 className="font-medium mb-2">System Events</h3>
            <div className="border rounded-md divide-y">
              <div className="p-3 flex gap-3">
                <Activity className="h-5 w-5 text-green-500 flex-shrink-0" />
                <div>
                  <p className="font-medium">AP Count: {apStatus.total} ({apStatus.online} online)</p>
                  <p className="text-sm text-muted-foreground">{new Date().toISOString()}</p>
                </div>
              </div>
              <div className="p-3 flex gap-3">
                <Server className="h-5 w-5 text-blue-500 flex-shrink-0" />
                <div>
                  <p className="font-medium">System Update Available</p>
                  <p className="text-sm text-muted-foreground">2023-04-02 22:15:36 UTC</p>
                </div>
              </div>
              <div className="p-3 flex gap-3">
                <Activity className="h-5 w-5 text-green-500 flex-shrink-0" />
                <div>
                  <p className="font-medium">Database Backup Completed</p>
                  <p className="text-sm text-muted-foreground">2023-04-02 04:00:00 UTC</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default System;
