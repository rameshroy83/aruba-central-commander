
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import APStatus from "./pages/APStatus";
import TunnelStatus from "./pages/TunnelStatus";
import Devices from "./pages/Devices";
import Configuration from "./pages/Configuration";
import Settings from "./pages/Settings";
import Security from "./pages/Security";
import System from "./pages/System";
import NotFound from "./pages/NotFound";
import { ArubaProvider } from "./contexts/ArubaContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ArubaProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/ap-status" element={<APStatus />} />
              <Route path="/tunnel-status" element={<TunnelStatus />} />
              <Route path="/devices" element={<Devices />} />
              <Route path="/configuration" element={<Configuration />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/security" element={<Security />} />
              <Route path="/system" element={<System />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </ArubaProvider>
  </QueryClientProvider>
);

export default App;
