
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Shield, RefreshCw } from "lucide-react";
import { useAruba } from '@/contexts/ArubaContext';
import { useNavigate } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';

const Security = () => {
  const { isConfigured } = useAruba();
  const navigate = useNavigate();

  if (!isConfigured) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Security</h1>
          <p className="text-muted-foreground">
            Monitor network security and threats
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
        <h1 className="text-3xl font-bold tracking-tight">Security</h1>
        <p className="text-muted-foreground">
          Monitor network security and threats
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Security Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">87/100</div>
            <Progress value={87} className="h-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Threats Detected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Firmware Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">92%</div>
            <Progress value={92} className="h-2" />
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div>
              <CardTitle>Security Dashboard</CardTitle>
              <CardDescription>Monitor your network security posture</CardDescription>
            </div>
            <Button variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 border border-dashed rounded-md">
            <div className="text-center">
              <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="font-medium">Security Module Coming Soon</p>
              <p className="text-sm text-muted-foreground">
                This feature will be available in a future update
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Security;
