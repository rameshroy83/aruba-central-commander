
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, RefreshCw, AlertTriangle, Save, Trash2 } from "lucide-react";
import { useAruba } from '@/contexts/ArubaContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";

const apiRegionOptions = [
  { label: "WiFi Down Under (Australia)", value: "https://central.wifidownunder.com" },
  { label: "US West 4 (Global)", value: "https://apigw-uswest4.central.arubanetworks.com" },
  { label: "US West (USA)", value: "https://apigw-prod2.central.arubanetworks.com" },
  { label: "US East (USA)", value: "https://apigw-prod1.central.arubanetworks.com" },
  { label: "EU Central (Germany)", value: "https://apigw-eucentral3.central.arubanetworks.com" },
  { label: "Asia Pacific (Sydney)", value: "https://apigw-apac1.central.arubanetworks.com" },
  { label: "Asia Pacific (India)", value: "https://apigw-apac2.central.arubanetworks.com" },
  { label: "China", value: "https://apigw-china1.central.arubanetworks.com" },
];

const Settings = () => {
  const { credentials, updateCredentials, clearCredentials, testConnection } = useAruba();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await testConnection();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">API Settings</h1>
        <p className="text-muted-foreground">
          Configure your Aruba Central API credentials
        </p>
      </div>

      <Tabs defaultValue="apiSettings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="apiSettings">API Settings</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="apiSettings">
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Aruba Central API Configuration</CardTitle>
                <CardDescription>
                  Enter your API credentials to connect to Aruba Central
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertTitle>API Credentials are stored locally</AlertTitle>
                  <AlertDescription>
                    Your API credentials are stored in your browser's local storage and never transmitted elsewhere.
                  </AlertDescription>
                </Alert>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="customerId">Customer ID</Label>
                    <Input
                      id="customerId"
                      value={credentials.customerId}
                      onChange={(e) => updateCredentials({ customerId: e.target.value })}
                      placeholder="Enter your customer ID"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 pb-2">
                      <Label htmlFor="isPrivateCluster" className="flex-grow">Private Cluster</Label>
                      <Switch 
                        id="isPrivateCluster"
                        checked={credentials.isPrivateCluster}
                        onCheckedChange={(checked) => updateCredentials({ isPrivateCluster: checked })}
                      />
                    </div>
                    
                    {credentials.isPrivateCluster ? (
                      <Input
                        id="privateClusterUrl"
                        value={credentials.privateClusterUrl}
                        onChange={(e) => updateCredentials({ privateClusterUrl: e.target.value })}
                        placeholder="Enter your private cluster URL"
                      />
                    ) : (
                      <Select 
                        value={credentials.baseUrl}
                        onValueChange={(value) => updateCredentials({ baseUrl: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select API region" />
                        </SelectTrigger>
                        <SelectContent>
                          {apiRegionOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="token">API Token</Label>
                  <Input
                    id="token"
                    type="password"
                    value={credentials.token}
                    onChange={(e) => updateCredentials({ token: e.target.value })}
                    placeholder="Enter your API token"
                  />
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="clientId">Client ID (OAuth)</Label>
                    <Input
                      id="clientId"
                      value={credentials.clientId}
                      onChange={(e) => updateCredentials({ clientId: e.target.value })}
                      placeholder="OAuth Client ID (optional)"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="clientSecret">Client Secret</Label>
                    <Input
                      id="clientSecret"
                      type="password"
                      value={credentials.clientSecret}
                      onChange={(e) => updateCredentials({ clientSecret: e.target.value })}
                      placeholder="OAuth Client Secret (optional)"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="groupName">Group Name</Label>
                  <Input
                    id="groupName"
                    value={credentials.groupName}
                    onChange={(e) => updateCredentials({ groupName: e.target.value })}
                    placeholder="Enter your group name"
                  />
                </div>
              </CardContent>
              
              <CardFooter className="justify-between">
                <Button variant="destructive" type="button" onClick={clearCredentials}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear Credentials
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" type="button" onClick={() => testConnection()} disabled={isLoading}>
                    <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    Test Connection
                  </Button>
                  <Button type="submit" className="bg-aruba hover:bg-aruba-dark" disabled={isLoading}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Settings
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure security options for API access
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Security Information</AlertTitle>
                <AlertDescription>
                  For enhanced security, this application only stores credentials locally and never transmits them to third parties.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-2 border-t pt-4">
                <h3 className="font-medium">Security Recommendations:</h3>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>Use read-only API tokens when possible</li>
                  <li>Regularly rotate your API tokens</li>
                  <li>Use temporary tokens with limited scope for specific operations</li>
                  <li>Clear credentials when using shared devices</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
