import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminOverview from "./pages/admin/AdminOverview";
import AdminDeals from "./pages/admin/AdminDeals";
import DealDetail from "./pages/admin/DealDetail";
import AdminSMEs from "./pages/admin/AdminSMEs";
import AdminAudit from "./pages/admin/AdminAudit";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* SME Dashboard routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Admin routes - protected, ADMIN only */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminOverview />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/deals"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminDeals />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/deals/:id"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <DealDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/smes"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminSMEs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/audit"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminAudit />
                </ProtectedRoute>
              }
            />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
