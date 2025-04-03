
import { Home, Network, Settings, Laptop, Shield, Server, Terminal, WifiOff, Wifi } from "lucide-react";
import { NavLink } from 'react-router-dom';
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAruba } from "@/contexts/ArubaContext";

export function AppSidebar() {
  const { isConfigured } = useAruba();

  // Define our menu items
  const mainItems = [
    { title: "Dashboard", icon: Home, url: "/" },
    { title: "AP Status", icon: Wifi, url: "/ap-status", needsConfig: true },
    { title: "Tunnel Status", icon: Network, url: "/tunnel-status", needsConfig: true },
    { title: "Device Management", icon: Laptop, url: "/devices", needsConfig: true },
    { title: "Configuration", icon: Terminal, url: "/configuration", needsConfig: true },
  ];

  const adminItems = [
    { title: "API Settings", icon: Settings, url: "/settings" },
    { title: "Security", icon: Shield, url: "/security", needsConfig: true },
    { title: "System Info", icon: Server, url: "/system", needsConfig: true },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Network className="h-6 w-6 text-sidebar-primary" />
          <h1 className="text-lg font-semibold text-sidebar-foreground">Aruba Commander</h1>
        </div>
        <div className="mt-1 text-xs text-sidebar-foreground/70">
          {isConfigured ? 'Connected to API' : 'Not configured'}
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild disabled={item.needsConfig && !isConfigured} 
                    className={cn(
                      item.needsConfig && !isConfigured ? "cursor-not-allowed opacity-50" : ""
                    )}
                  >
                    <NavLink to={item.url} className={({isActive}) => cn(
                      isActive ? "bg-sidebar-accent" : "hover:bg-sidebar-accent/50"
                    )}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Administration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild disabled={item.needsConfig && !isConfigured}
                    className={cn(
                      item.needsConfig && !isConfigured ? "cursor-not-allowed opacity-50" : ""
                    )}
                  >
                    <NavLink to={item.url} className={({isActive}) => cn(
                      isActive ? "bg-sidebar-accent" : "hover:bg-sidebar-accent/50"
                    )}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-sidebar-foreground/70">
            {isConfigured ? (
              <>
                <Wifi className="h-3 w-3 text-green-400" />
                API Connected
              </>
            ) : (
              <>
                <WifiOff className="h-3 w-3 text-red-400" />
                Not Configured
              </>
            )}
          </div>
          <div className="text-xs text-sidebar-foreground/70">v1.0</div>
        </div>
      </SidebarFooter>
      
      <SidebarTrigger className="absolute right-[-12px] top-4" />
    </Sidebar>
  );
}
