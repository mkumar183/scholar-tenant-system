
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect } from "react";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Tenants from "./pages/Tenants";
import TenantDetails from "./pages/TenantDetails";
import Schools from "./pages/Schools";
import SchoolDetails from "./pages/SchoolDetails";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import AcademicSessions from "./pages/AcademicSessions";
import Grades from "./pages/Grades";
import NotFound from "./pages/NotFound";

// Fee Management Micro App Pages
import FeeManagement from "./micro-apps/fee-management/pages/FeeManagement";
import FeeCategories from "./micro-apps/fee-management/pages/FeeCategories";
import FeeGroups from "./micro-apps/fee-management/pages/FeeGroups";
import FeeAssignments from "./micro-apps/fee-management/pages/FeeAssignments";

const queryClient = new QueryClient();

// Create a component to handle redirects based on authentication
const AuthRedirects = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // This ensures we log any navigation issues
    console.log('Current path:', location.pathname);
  }, [location.pathname]);
  
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Changed this route to render the Login component directly */}
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/tenants" element={
              <ProtectedRoute>
                <Layout>
                  <Tenants />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/tenants/:id" element={
              <ProtectedRoute>
                <Layout>
                  <TenantDetails />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/schools" element={
              <ProtectedRoute>
                <Layout>
                  <Schools />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/schools/:id" element={
              <ProtectedRoute>
                <Layout>
                  <SchoolDetails />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/users" element={
              <ProtectedRoute>
                <Layout>
                  <Users />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/academic-sessions" element={
              <ProtectedRoute>
                <Layout>
                  <AcademicSessions />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/grades" element={
              <ProtectedRoute>
                <Layout>
                  <Grades />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/settings" element={
              <ProtectedRoute>
                <Layout>
                  <Settings />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* Fee Management Routes */}
            <Route path="/fee-management" element={
              <ProtectedRoute>
                <Layout>
                  <FeeManagement />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/fee-management/categories" element={
              <ProtectedRoute>
                <Layout>
                  <FeeCategories />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/fee-management/groups" element={
              <ProtectedRoute>
                <Layout>
                  <FeeGroups />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/fee-management/assignments" element={
              <ProtectedRoute>
                <Layout>
                  <FeeAssignments />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
          <AuthRedirects />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
