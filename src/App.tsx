import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import BookingPage from "./pages/BookingPage";
import BookingSuccess from "./pages/BookingSuccess";
import SpacesPage from "./pages/SpacesPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminAuth from "./pages/admin/AdminAuth";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminInvoices from "./pages/admin/AdminInvoices";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminSettings from "./pages/admin/AdminSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/book" element={<BookingPage />} />
          <Route path="/booking-success" element={<BookingSuccess />} />
          <Route path="/spaces" element={<SpacesPage />} />
          <Route path="/admin/login" element={<AdminAuth />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
          <Route path="/admin/invoices" element={<AdminInvoices />} />
          <Route path="/admin/payments" element={<AdminPayments />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
