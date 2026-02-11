import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import LandingPage from "./pages/LandingPage";
import MarketplacePage from "./pages/MarketplacePage";
import ShopDetailPage from "./pages/ShopDetailPage";
import BookingPage from "./pages/BookingPage";
import LoginPage from "./pages/LoginPage";
import MyBookingsPage from "./pages/MyBookingsPage";

// Vendor Pages
import VendorLoginPage from "./pages/vendor/VendorLoginPage";
import VendorRegisterPage from "./pages/vendor/VendorRegisterPage";
import VendorDashboard from "./pages/vendor/VendorDashboard";
import VendorBookingsPage from "./pages/vendor/VendorBookingsPage";
import VendorDiscountCodesPage from "./pages/vendor/VendorDiscountCodesPage";
import VendorCustomersPage from "./pages/vendor/VendorCustomersPage";
import VendorSettingsPage from "./pages/vendor/VendorSettingsPage";

// Admin Pages
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCategoriesPage from "./pages/admin/AdminCategoriesPage";
import AdminShopsPage from "./pages/admin/AdminShopsPage";
import AdminDiscountCodesPage from "./pages/admin/AdminDiscountCodesPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";
import AdminManagersPage from "./pages/admin/AdminManagersPage";

// Manager Pages
import ManagerLoginPage from "./pages/manager/ManagerLoginPage";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import ManagerDiscountCodesPage from "./pages/manager/ManagerDiscountCodesPage";

import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Customer Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/shop/:slug" element={<ShopDetailPage />} />
          <Route path="/booking/:slug" element={<BookingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/bookings" element={<MyBookingsPage />} />
          
          {/* Vendor Routes */}
          <Route path="/vendor/login" element={<VendorLoginPage />} />
          <Route path="/vendor/register" element={<VendorRegisterPage />} />
          <Route path="/vendor/dashboard" element={<VendorDashboard />} />
          <Route path="/vendor/bookings" element={<VendorBookingsPage />} />
          <Route path="/vendor/discount-codes" element={<VendorDiscountCodesPage />} />
          <Route path="/vendor/customers" element={<VendorCustomersPage />} />
          <Route path="/vendor/settings" element={<VendorSettingsPage />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/categories" element={<AdminCategoriesPage />} />
          <Route path="/admin/shops" element={<AdminShopsPage />} />
          <Route path="/admin/discount-codes" element={<AdminDiscountCodesPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/managers" element={<AdminManagersPage />} />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />
          
          {/* Manager Routes */}
          <Route path="/manager/login" element={<ManagerLoginPage />} />
          <Route path="/manager" element={<ManagerDashboard />} />
          <Route path="/manager/discount-codes" element={<ManagerDiscountCodesPage />} />
          
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
